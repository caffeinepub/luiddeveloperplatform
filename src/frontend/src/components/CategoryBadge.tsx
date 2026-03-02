import type { Category } from "@/store/useAppStore";

const CATEGORY_CONFIG: Record<Category, { label: string; className: string }> =
  {
    discordBots: {
      label: "Bot Discord",
      className: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
    },
    automationScripts: {
      label: "Automação",
      className: "bg-orange-500/15 text-orange-300 border border-orange-500/30",
    },
    aiTools: {
      label: "Ferramenta IA",
      className: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
    },
    apis: {
      label: "API",
      className: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
    },
  };

export function getCategoryConfig(category: Category) {
  return CATEGORY_CONFIG[category];
}

export function CategoryBadge({ category }: { category: Category }) {
  const config = CATEGORY_CONFIG[category];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export const CATEGORY_LABELS: Record<Category, string> = {
  discordBots: "Bots Discord",
  automationScripts: "Scripts Automação",
  aiTools: "Ferramentas IA",
  apis: "APIs",
};
