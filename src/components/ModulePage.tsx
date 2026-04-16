import { useEffect, useState } from "react";
import { BlockRenderer } from "./BlockRenderer";
import { fetchModuleTabs, fetchTabBlocks, type UiBlock, type UiTab } from "../lib/metagov-api";

type ModulePageProps = {
  moduleSlug: string;
};

export function ModulePage({ moduleSlug }: ModulePageProps) {
  const [tabs, setTabs] = useState<UiTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [blocks, setBlocks] = useState<UiBlock[]>([]);

  useEffect(() => {
    fetchModuleTabs(moduleSlug)
      .then((loadedTabs) => {
        setTabs(loadedTabs);
        setActiveTabId(loadedTabs[0]?.id ?? "");
      })
      .catch((error) => {
        console.error("Failed to load tabs", error);
        setTabs([]);
        setActiveTabId("");
      });
  }, [moduleSlug]);

  useEffect(() => {
    if (!activeTabId) {
      setBlocks([]);
      return;
    }

    fetchTabBlocks(activeTabId)
      .then((loadedBlocks) => {
        setBlocks(loadedBlocks);
      })
      .catch((error) => {
        console.error("Failed to load blocks", error);
        setBlocks([]);
      });
  }, [activeTabId]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                isActive
                  ? "bg-[#D5E4F5] font-medium text-[#3B6BF5]"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <BlockRenderer blocks={blocks} />
    </section>
  );
}
