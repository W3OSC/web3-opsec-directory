.PHONY: setup dev build deploy-prod setup-ec2 deploy-nginx setup-ssl renew-ssl encrypt-env decrypt-env setup-secrets install-deps security-check

GCP_HOST  ?= root@<GCP_IP>
PROD_PATH ?= /var/www/w3os

# ─── Local ───────────────────────────────────────────────────────────────────

install-deps:
	@echo "Installing frontend deps..."
	@cd frontend && npm install
	@echo "Installing backend deps..."
	@cd backend && bun install

setup: install-deps decrypt-env

dev:
	@pm2 start ecosystem.local.config.js

build:
	@echo "Building frontend..."
	@cd frontend && npm run build
	@echo "Build complete — standalone output at frontend/.next/standalone"

# ─── Deploy ──────────────────────────────────────────────────────────────────

security-check:
	@echo "Checking for hardcoded secrets..."; \
	if grep -rE "(secret|api_key|password)\s*[:=]\s*['\"][^'\"]{20,}['\"]" \
		--include="*.ts" --include="*.tsx" \
		frontend/src backend/src 2>/dev/null | grep -v "NEXT_PUBLIC_" | grep -v "process.env"; then \
		echo "FAIL: Potential hardcoded secrets found"; exit 1; \
	else echo "PASS: No hardcoded secrets"; fi; \
	if [ ! -f secrets/.env.backend.prod ]; then \
		echo "FAIL: secrets/.env.backend.prod missing"; exit 1; \
	else echo "PASS: Production secrets exist"; fi

deploy-prod: security-check build
	@echo "Syncing to $(GCP_HOST)..."; \
	rsync -Pazv --delete-delay -e 'ssh' \
		--exclude='.next/' \
		--exclude='node_modules/' \
		--exclude='backend/data/' \
		--exclude='backend/assets/*.ttf' \
		--exclude='secrets/' \
		./ $(GCP_HOST):$(PROD_PATH)/; \
	echo "Syncing .next/standalone..."; \
	rsync -Pazv -e 'ssh' \
		frontend/.next/standalone/ $(GCP_HOST):$(PROD_PATH)/frontend/.next/standalone/; \
	rsync -Pazv -e 'ssh' \
		frontend/.next/static/ $(GCP_HOST):$(PROD_PATH)/frontend/.next/standalone/.next/static/; \
	rsync -Pazv -e 'ssh' \
		frontend/public/ $(GCP_HOST):$(PROD_PATH)/frontend/.next/standalone/public/; \
	echo "Syncing secrets..."; \
	rsync -Pzv -e 'ssh' secrets/.env.backend.prod $(GCP_HOST):$(PROD_PATH)/secrets/; \
	rsync -Pzv -e 'ssh' secrets/.env.frontend.prod $(GCP_HOST):$(PROD_PATH)/secrets/; \
	echo "Installing backend deps on server..."; \
	ssh $(GCP_HOST) 'cd $(PROD_PATH)/backend && bun install --production'; \
	echo "Restarting services..."; \
	ssh $(GCP_HOST) 'cd $(PROD_PATH) && \
		pm2 reload ecosystem.prod.config.js --update-env || \
		pm2 start ecosystem.prod.config.js'; \
	sleep 4; \
	echo "Health check..."; \
	HEALTH=$$(ssh $(GCP_HOST) 'curl -sf http://localhost:3001/health || echo FAILED'); \
	if [ "$$HEALTH" = "ok" ]; then \
		echo "✓ Backend healthy"; \
	else \
		echo "✗ Backend health check failed"; \
		ssh $(GCP_HOST) 'pm2 --nostream logs w3os-backend --lines 30 --err'; \
		exit 1; \
	fi; \
	echo "Deploying nginx..."; \
	$(MAKE) deploy-nginx; \
	echo "Deployment complete"

deploy-nginx:
	@rsync -Pzv -e 'ssh' deploy/nginx.conf $(GCP_HOST):/tmp/w3os-nginx.conf; \
	ssh $(GCP_HOST) "sudo mv /tmp/w3os-nginx.conf /etc/nginx/sites-available/w3os && \
		sudo ln -sf /etc/nginx/sites-available/w3os /etc/nginx/sites-enabled/w3os && \
		sudo nginx -t && \
		sudo systemctl reload nginx"; \
	echo "nginx reloaded"

# ─── Server setup ─────────────────────────────────────────────────────────────

setup-ec2:
	@echo "Provisioning $(GCP_HOST)..."
	@ssh $(GCP_HOST) 'bash -euo pipefail << '"'"'SETUP'"'"' \
		export DEBIAN_FRONTEND=noninteractive; \
		apt-get update -qq; \
		apt-get install -y -q nginx certbot python3-certbot-nginx curl unzip; \
		curl -fsSL https://deb.nodesource.com/setup_20.x | bash -; \
		apt-get install -y -q nodejs; \
		curl -fsSL https://bun.sh/install | bash; \
		npm install -g pm2; \
		env PATH="$$PATH:/usr/bin" pm2 startup systemd -u root --hp /root | tail -1 | bash; \
		mkdir -p /var/www/w3os/{frontend,backend/data,backend/assets,secrets}; \
		echo "Server ready."; \
SETUP'
	@echo "Uploading secrets..."
	@scp secrets/.env.backend.prod $(GCP_HOST):$(PROD_PATH)/secrets/.env.backend.prod
	@scp secrets/.env.frontend.prod $(GCP_HOST):$(PROD_PATH)/secrets/.env.frontend.prod
	@echo "Done. Run: make deploy-prod"

setup-ssl:
	@ssh $(GCP_HOST) 'certbot --nginx -d w3os.org -d www.w3os.org --non-interactive --agree-tos -m admin@w3os.org'

renew-ssl:
	@ssh $(GCP_HOST) 'certbot renew --post-hook "systemctl reload nginx"'

# ─── Secrets ──────────────────────────────────────────────────────────────────

encrypt-env:
	@git secret hide -d
	@echo "Secrets encrypted"

decrypt-env:
	@git secret reveal -f
	@echo "Secrets decrypted"

setup-secrets:
	@if ! command -v git-secret &>/dev/null; then brew install git-secret; fi
	@if [ ! -d ".gitsecret" ]; then git secret init; fi
	@read -p "GPG email: " email; \
	if ! gpg --list-keys "$$email" &>/dev/null; then \
		gpg --batch --gen-key <<-EOF; \
		Key-Type: RSA; Key-Length: 4096; \
		Name-Real: w3os Secret; Name-Email: $$email; \
		Expire-Date: 0; %no-protection; %commit; \
		EOF \
	fi; \
	git secret tell "$$email"; \
	git secret add secrets/.env.backend.local 2>/dev/null || true; \
	git secret add secrets/.env.backend.prod 2>/dev/null || true; \
	git secret add secrets/.env.frontend.prod 2>/dev/null || true; \
	echo "git-secret configured for $$email"
