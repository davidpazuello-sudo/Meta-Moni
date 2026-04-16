import { useEffect, useState } from "react";
import {
  Calendar,
  FileText,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { fetchModules, type UiModule } from "../lib/metagov-api";
import { ModulePage } from "./ModulePage";

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  FileText,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Settings,
};

function resolveIcon(iconName?: string | null): LucideIcon {
  if (!iconName) return FileText;
  return iconMap[iconName] ?? FileText;
}

export function AppShell() {
  const [modules, setModules] = useState<UiModule[]>([]);
  const [activeSlug, setActiveSlug] = useState<string>("");

  useEffect(() => {
    fetchModules()
      .then((loadedModules) => {
        setModules(loadedModules);
        if (loadedModules.length > 0) {
          setActiveSlug((current) => current || loadedModules[0].slug);
        }
      })
      .catch((error) => {
        console.error("Failed to load modules", error);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F4F7FC]">
      <aside className="w-72 shrink-0 border-r border-[#D5E4F5] bg-[#EAF0FB] p-3">
        <nav className="space-y-1">
          {modules.map((module) => {
            const Icon = resolveIcon(module.icon);
            const isActive = module.slug === activeSlug;

            return (
              <button
                key={module.id}
                onClick={() => setActiveSlug(module.slug)}
                className={`flex w-full items-center gap-3 rounded-md border-l-4 px-3 py-2 text-left transition ${
                  isActive
                    ? "border-l-[#3B6BF5] bg-[#D5E4F5] font-medium text-[#3B6BF5]"
                    : "border-l-transparent text-slate-700 hover:bg-[#DCE8F7]"
                }`}
                type="button"
              >
                <Icon className="h-4 w-4" />
                <span>{module.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {activeSlug ? (
          <ModulePage moduleSlug={activeSlug} />
        ) : (
          <div className="rounded-lg bg-white p-6 shadow-sm">Nenhum módulo encontrado.</div>
        )}
      </main>
    </div>
  );
}
