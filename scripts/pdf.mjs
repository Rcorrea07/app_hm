/**
 * Gera o PDF de entrega (5 páginas) a partir de /doc/imprimir.
 * Uso: com o app rodando (npx next start -p 3123), rode
 *      BASE_URL=https://seu-link node scripts/pdf.mjs
 * BASE_URL define também o link e o QR code impressos na capa.
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3123";
const SAIDA = "entrega/Projeto_Final_Rafael_Correa_Barbosa_GES745.pdf";

mkdirSync("entrega", { recursive: true });
const navegador = await chromium.launch();
const page = await navegador.newPage();
await page.emulateMedia({ media: "print", reducedMotion: "reduce" });
await page.goto(`${BASE}/doc/imprimir`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
// Confere se alguma página passou da altura do A4 (o conteúdo seria cortado).
const estouros = await page.$$eval(".pagina", (els) =>
  els.map((el, i) => ({ pagina: i + 1, sobra: el.scrollHeight - el.clientHeight })).filter((x) => x.sobra > 1),
);
if (estouros.length) console.warn("ATENÇÃO: conteúdo passando da página:", estouros);
await page.pdf({ path: SAIDA, preferCSSPageSize: true, printBackground: true });
await navegador.close();
console.log("PDF salvo em", SAIDA);
