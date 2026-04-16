import { AppShell } from "./components/AppShell";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F4F7FC]">
      <header className="border-b border-[#D5E4F5] bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-slate-800">Cidade na Mão • MetaGov UI Engine</h1>
        <p className="text-sm text-slate-500">Primeira página dinâmica baseada em Módulo → Aba → Bloco.</p>
      </header>
      <AppShell />
    </div>
  );
}
