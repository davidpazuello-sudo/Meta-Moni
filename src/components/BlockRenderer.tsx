import type { ReactElement } from "react";
import type { UiBlock } from "../lib/metagov-api";

type BlockRendererProps = {
  blocks: UiBlock[];
};

type GenericConfig = Record<string, unknown>;

type DashboardCard = {
  label: string;
  value: string;
  trend?: string;
};

function DataTable({ config }: { config: GenericConfig }) {
  const columns = Array.isArray(config.columns) ? (config.columns as string[]) : [];
  const rows = Array.isArray(config.rows) ? (config.rows as string[][]) : [];

  if (columns.length === 0) {
    return <p className="text-sm text-slate-500">Nenhuma coluna configurada.</p>;
  }

  return (
    <div className="overflow-auto">
      <table className="w-full min-w-[420px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            {columns.map((column) => (
              <th key={column} className="px-2 py-2 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-100 last:border-0">
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="px-2 py-2 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DynamicForm({ config }: { config: GenericConfig }) {
  return <pre className="text-xs text-slate-600">Form config: {JSON.stringify(config, null, 2)}</pre>;
}

function DashboardCards({ config }: { config: GenericConfig }) {
  const cards = Array.isArray(config.cards) ? (config.cards as DashboardCard[]) : [];

  if (cards.length === 0) {
    return <p className="text-sm text-slate-500">Nenhum card configurado.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.label} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs text-slate-500">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{card.value}</p>
          {card.trend ? <p className="mt-1 text-xs text-[#3B6BF5]">{card.trend}</p> : null}
        </article>
      ))}
    </div>
  );
}

function ReportView({ config }: { config: GenericConfig }) {
  return <pre className="text-xs text-slate-600">Report config: {JSON.stringify(config, null, 2)}</pre>;
}

function FilterPanel({ config }: { config: GenericConfig }) {
  const fields = Array.isArray(config.fields)
    ? (config.fields as Array<{ type: string; label: string; placeholder?: string; options?: string[] }>)
    : [];

  return (
    <div className="space-y-3">
      {fields.map((field) => {
        if (field.type === "select") {
          return (
            <label key={field.label} className="block space-y-1">
              <span className="text-xs font-medium text-slate-600">{field.label}</span>
              <select className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                {(field.options ?? []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          );
        }

        return (
          <label key={field.label} className="block space-y-1">
            <span className="text-xs font-medium text-slate-600">{field.label}</span>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder={field.placeholder ?? "Digite aqui"}
            />
          </label>
        );
      })}

      <button className="w-full rounded-md bg-[#3B6BF5] px-3 py-2 text-sm text-white">Aplicar filtros</button>
    </div>
  );
}

function ActionButtonBlock({ config }: { config: GenericConfig }) {
  const label = typeof config.label === "string" ? config.label : "Ação";
  return <button className="rounded-md bg-[#3B6BF5] px-3 py-2 text-sm text-white">{label}</button>;
}

function InputBlock({ config }: { config: GenericConfig }) {
  const placeholder = typeof config.placeholder === "string" ? config.placeholder : "Digite aqui";
  return <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder={placeholder} />;
}

function CustomBlock({ config }: { config: GenericConfig }) {
  return <pre className="text-xs text-slate-600">Custom config: {JSON.stringify(config, null, 2)}</pre>;
}

function UnsupportedBlock({ blockType }: { blockType: string }) {
  return <div className="text-sm text-red-500">Tipo de bloco não suportado: {blockType}</div>;
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {blocks.map((block) => {
        const colSpan = Math.min(Math.max(block.layoutColSpan || 12, 1), 12);
        const config = (block.config ?? {}) as GenericConfig;

        let content: ReactElement;
        switch (block.blockType) {
          case "table":
            content = <DataTable config={config} />;
            break;
          case "form":
            content = <DynamicForm config={config} />;
            break;
          case "dashboard":
            content = <DashboardCards config={config} />;
            break;
          case "report":
            content = <ReportView config={config} />;
            break;
          case "filter":
            content = <FilterPanel config={config} />;
            break;
          case "button":
            content = <ActionButtonBlock config={config} />;
            break;
          case "input":
            content = <InputBlock config={config} />;
            break;
          case "custom":
            content = <CustomBlock config={config} />;
            break;
          default:
            content = <UnsupportedBlock blockType={block.blockType} />;
        }

        return (
          <article
            key={block.id}
            className="col-span-12 rounded-xl bg-white p-4 shadow-sm"
            style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}
          >
            {block.label ? <h3 className="mb-3 text-sm font-semibold text-slate-800">{block.label}</h3> : null}
            {content}
          </article>
        );
      })}
    </div>
  );
}
