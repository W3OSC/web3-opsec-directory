import { BadgeCheck, Star, Wrench } from "lucide-react";
import type { Company, Tool } from "@/lib/types";

type Props =
  | { type: "company"; item: Company; selected: boolean; onClick: () => void }
  | { type: "tool"; item: Tool; selected: boolean; onClick: () => void };

export default function SidebarRow(props: Props) {
  const { type, selected, onClick } = props;
  const isCompany = type === "company";
  const item = props.item;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors group ${
        selected
          ? "bg-brand/10 border border-brand/30"
          : "hover:bg-surface-raised border border-transparent"
      }`}
    >
      {isCompany ? (
        (item as Company).logo ? (
          <img
            src={(item as Company).logo}
            alt={item.name}
            className="w-7 h-7 rounded-md object-contain bg-surface-border flex-shrink-0"
          />
        ) : (
          <div className="w-7 h-7 rounded-md bg-surface-border flex-shrink-0 flex items-center justify-center text-xs font-bold text-brand">
            {item.name[0]}
          </div>
        )
      ) : (
        <div className="w-7 h-7 rounded-md bg-surface-border flex-shrink-0 flex items-center justify-center">
          <Wrench size={13} className="text-gray-400" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-medium truncate ${selected ? "text-brand" : "text-white group-hover:text-brand transition-colors"}`}>
            {item.name}
          </span>
          {isCompany && (item as Company).endorsed && (
            <BadgeCheck size={13} className="text-brand flex-shrink-0" />
          )}
          {!isCompany && (item as Tool).stars != null && (
            <span className="flex items-center gap-0.5 text-xs text-gray-500 flex-shrink-0">
              <Star size={10} className="text-yellow-500" />
              {(item as Tool).stars}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">
          {isCompany
            ? (item as Company).services?.slice(0, 2).join(", ")
            : (item as Tool).tags?.slice(0, 2).join(", ")}
        </p>
      </div>
    </button>
  );
}
