export type UiModule = {
  id: string;
  slug: string;
  label: string;
  icon?: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type UiTab = {
  id: string;
  moduleId: string;
  slug: string;
  label: string;
  icon?: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type UiBlock = {
  id: string;
  blockType: string;
  blockId?: string | null;
  label?: string | null;
  config: Record<string, unknown>;
  sortOrder: number;
  isActive: boolean;
  layoutColSpan: number;
  layoutRow: number;
};

const API_BASE = "/api/metagov";

const demoModules: UiModule[] = [
  { id: "m1", slug: "dashboard", label: "Dashboard", icon: "LayoutDashboard", sortOrder: 1, isActive: true },
  { id: "m2", slug: "solicitacoes", label: "Solicitações", icon: "Inbox", sortOrder: 2, isActive: true },
  { id: "m3", slug: "agendamentos", label: "Agendamentos", icon: "Calendar", sortOrder: 3, isActive: true },
  { id: "m4", slug: "ouvidoria", label: "Ouvidoria", icon: "MessageSquare", sortOrder: 4, isActive: true },
  { id: "m5", slug: "transmissao", label: "Transmissão", icon: "Megaphone", sortOrder: 5, isActive: true },
  { id: "m6", slug: "configuracoes", label: "Configurações", icon: "Settings", sortOrder: 6, isActive: true },
];

const demoTabsByModule: Record<string, UiTab[]> = {
  dashboard: [
    {
      id: "t-dashboard-1",
      moduleId: "m1",
      slug: "visao-geral",
      label: "Visão Geral",
      icon: "LayoutDashboard",
      sortOrder: 1,
      isActive: true,
    },
  ],
};

const demoBlocksByTab: Record<string, UiBlock[]> = {
  "t-dashboard-1": [
    {
      id: "b1",
      blockId: "dashboard_cards_geral",
      blockType: "dashboard",
      label: "Indicadores do Dia",
      config: {
        cards: [
          { label: "Solicitações abertas", value: "128", trend: "+8%" },
          { label: "Agendamentos hoje", value: "34", trend: "+2%" },
          { label: "Ouvidoria pendente", value: "17", trend: "-5%" },
          { label: "Tempo médio resposta", value: "2h15", trend: "-12%" },
        ],
      },
      sortOrder: 1,
      isActive: true,
      layoutColSpan: 12,
      layoutRow: 1,
    },
    {
      id: "b2",
      blockId: "dashboard_table_ultimos_protocolos",
      blockType: "table",
      label: "Últimos Protocolos",
      config: {
        columns: ["Protocolo", "Cidadão", "Canal", "Status"],
        rows: [
          ["2026-0001", "Ana Silva", "App", "pending"],
          ["2026-0002", "João Lima", "Web", "in_progress"],
          ["2026-0003", "Maria Souza", "WhatsApp", "resolved"],
        ],
      },
      sortOrder: 2,
      isActive: true,
      layoutColSpan: 8,
      layoutRow: 2,
    },
    {
      id: "b3",
      blockId: "dashboard_filtro_status",
      blockType: "filter",
      label: "Filtro Rápido",
      config: {
        fields: [
          { type: "input", label: "Buscar protocolo", placeholder: "Ex: 2026-0001" },
          { type: "select", label: "Status", options: ["pending", "in_progress", "resolved"] },
        ],
      },
      sortOrder: 3,
      isActive: true,
      layoutColSpan: 4,
      layoutRow: 2,
    },
  ],
};

async function readJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`MetaGov API error: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchModules(): Promise<UiModule[]> {
  try {
    const modules = await readJson<UiModule[]>(`${API_BASE}/modules`);
    return modules.filter((module) => module.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return demoModules;
  }
}

export async function fetchModuleTabs(moduleSlug: string): Promise<UiTab[]> {
  try {
    const tabs = await readJson<UiTab[]>(`${API_BASE}/modules/${moduleSlug}/tabs`);
    return tabs.filter((tab) => tab.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return demoTabsByModule[moduleSlug] ?? [];
  }
}

export async function fetchTabBlocks(tabId: string): Promise<UiBlock[]> {
  try {
    const blocks = await readJson<UiBlock[]>(`${API_BASE}/tabs/${tabId}/blocks`);
    return blocks
      .filter((block) => block.isActive)
      .sort((a, b) => a.layoutRow - b.layoutRow || a.sortOrder - b.sortOrder);
  } catch {
    return (demoBlocksByTab[tabId] ?? [])
      .filter((block) => block.isActive)
      .sort((a, b) => a.layoutRow - b.layoutRow || a.sortOrder - b.sortOrder);
  }
}
