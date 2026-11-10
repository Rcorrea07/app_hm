/** Datas do domínio são strings ISO "AAAA-MM-DD" (sem fuso). */
export type DataISO = string;

const MS_DIA = 86_400_000;

function utc(data: DataISO): number {
  const [a, m, d] = data.slice(0, 10).split("-").map(Number);
  return Date.UTC(a, m - 1, d);
}

export function hojeISO(agora: Date = new Date()): DataISO {
  const a = agora.getFullYear();
  const m = String(agora.getMonth() + 1).padStart(2, "0");
  const d = String(agora.getDate()).padStart(2, "0");
  return `${a}-${m}-${d}`;
}

export function somarDias(data: DataISO, dias: number): DataISO {
  return new Date(utc(data) + dias * MS_DIA).toISOString().slice(0, 10);
}

export function diasEntre(de: DataISO, ate: DataISO): number {
  return Math.round((utc(ate) - utc(de)) / MS_DIA);
}

/** "2026-12-05" → "05/12/2026". */
export function formatarData(data: DataISO): string {
  const [a, m, d] = data.slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
}

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** "2026-11" → "novembro/2026". */
export function formatarMes(mes: string): string {
  const [a, m] = mes.split("-").map(Number);
  return `${MESES[m - 1]}/${a}`;
}

/** Data e hora curtas para o histórico: "10/11 · 14:32". */
export function formatarDataHora(iso: string): string {
  const d = new Date(iso);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dia}/${mes} · ${h}:${min}`;
}
