import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const officialModules = [
  { slug: "dashboard", label: "Dashboard", icon: "LayoutDashboard", sortOrder: 1 },
  { slug: "solicitacoes", label: "Solicitações", icon: "Inbox", sortOrder: 2 },
  { slug: "agendamentos", label: "Agendamentos", icon: "Calendar", sortOrder: 3 },
  { slug: "ouvidoria", label: "Ouvidoria", icon: "MessageSquare", sortOrder: 4 },
  { slug: "transmissao", label: "Transmissão", icon: "Megaphone", sortOrder: 5 },
  { slug: "configuracoes", label: "Configurações", icon: "Settings", sortOrder: 6 },
];

const dashboardTab = {
  slug: "visao-geral",
  label: "Visão Geral",
  icon: "LayoutDashboard",
  sortOrder: 1,
};

const initialDashboardBlocks: Array<{
  blockId: string;
  blockType: string;
  label: string;
  sortOrder: number;
  layoutColSpan: number;
  config: Prisma.JsonObject;
}> = [
  {
    blockId: "dashboard_cards_geral",
    blockType: "dashboard",
    label: "Indicadores do Dia",
    sortOrder: 1,
    layoutColSpan: 12,
    config: {
      cards: [
        { label: "Solicitações abertas", value: "128", trend: "+8%" },
        { label: "Agendamentos hoje", value: "34", trend: "+2%" },
        { label: "Ouvidoria pendente", value: "17", trend: "-5%" },
        { label: "Tempo médio resposta", value: "2h15", trend: "-12%" },
      ],
    },
  },
  {
    blockId: "dashboard_table_ultimos_protocolos",
    blockType: "table",
    label: "Últimos Protocolos",
    sortOrder: 2,
    layoutColSpan: 8,
    config: {
      columns: ["Protocolo", "Cidadão", "Canal", "Status"],
      rows: [
        ["2026-0001", "Ana Silva", "App", "pending"],
        ["2026-0002", "João Lima", "Web", "in_progress"],
        ["2026-0003", "Maria Souza", "WhatsApp", "resolved"],
      ],
    },
  },
  {
    blockId: "dashboard_filtro_status",
    blockType: "filter",
    label: "Filtro Rápido",
    sortOrder: 3,
    layoutColSpan: 4,
    config: {
      fields: [
        { type: "input", label: "Buscar protocolo", placeholder: "Ex: 2026-0001" },
        { type: "select", label: "Status", options: ["pending", "in_progress", "resolved"] },
      ],
    },
  },
];

async function main() {
  await Promise.all(
    officialModules.map((module) =>
      prisma.uiModule.upsert({
        where: { slug: module.slug },
        update: {
          label: module.label,
          icon: module.icon,
          sortOrder: module.sortOrder,
          isActive: true,
        },
        create: {
          slug: module.slug,
          label: module.label,
          icon: module.icon,
          sortOrder: module.sortOrder,
          isActive: true,
        },
      }),
    ),
  );

  const dashboardModule = await prisma.uiModule.findUnique({ where: { slug: "dashboard" } });
  if (!dashboardModule) {
    throw new Error("Módulo dashboard não encontrado após o seed.");
  }

  const existingTab = await prisma.uiTab.findFirst({
    where: {
      moduleId: dashboardModule.id,
      slug: dashboardTab.slug,
    },
  });

  const tab = existingTab
    ? await prisma.uiTab.update({
        where: { id: existingTab.id },
        data: {
          label: dashboardTab.label,
          icon: dashboardTab.icon,
          sortOrder: dashboardTab.sortOrder,
          isActive: true,
        },
      })
    : await prisma.uiTab.create({
        data: {
          moduleId: dashboardModule.id,
          slug: dashboardTab.slug,
          label: dashboardTab.label,
          icon: dashboardTab.icon,
          sortOrder: dashboardTab.sortOrder,
          isActive: true,
        },
      });

  await Promise.all(
    initialDashboardBlocks.map((block) =>
      prisma.uiBlock.upsert({
        where: { blockId: block.blockId },
        update: {
          tabId: tab.id,
          blockType: block.blockType,
          label: block.label,
          sortOrder: block.sortOrder,
          layoutColSpan: block.layoutColSpan,
          config: block.config,
          isActive: true,
        },
        create: {
          tabId: tab.id,
          blockId: block.blockId,
          blockType: block.blockType,
          label: block.label,
          sortOrder: block.sortOrder,
          layoutColSpan: block.layoutColSpan,
          config: block.config,
          isActive: true,
        },
      }),
    ),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed error:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
