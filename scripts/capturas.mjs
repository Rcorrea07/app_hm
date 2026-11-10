/**
 * Gera PNGs das 10 telas do wireframe (tamanho de iPhone, 2x) em capturas/,
 * para usar na documentação (projeto separado).
 * Uso: npm run build && npx next start -p 3123 (em outro terminal) e depois
 *      npm run capturas
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3123";
const SAIDA = "capturas";

const ESCONDER = `
  [aria-label^="Abrir roteiro"], [role="status"] { display: none !important; }
  *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
`;

function mesDeReferencia(hoje = new Date()) {
  const d = new Date(Date.UTC(hoje.getFullYear(), hoje.getMonth() + (hoje.getDate() > 15 ? 1 : 0), 15));
  return d.toISOString().slice(0, 7);
}

function orcamentoExemplo() {
  const mes = mesDeReferencia();
  const dia = (n, h) => `${mes}-${String(n).padStart(2, "0")}T${h}:00.000Z`;
  return {
    mesReferencia: mes,
    rendaMensal: 290_000,
    fontes: { auxilio: 220_000, bolsaIC: 70_000 },
    percentuais: { moradia: 50, alimentacao: 30, outros: 20 },
    despesas: [
      { id: "e4", valor: 6_490, data: dia(9, "18:20"), categoriaId: "outros", subcategoria: "Lazer" },
      { id: "e3", valor: 21_870, data: dia(8, "12:05"), categoriaId: "alimentacao" },
      { id: "e2", valor: 4_500, data: dia(6, "19:40"), categoriaId: "alimentacao" },
      { id: "e1", valor: 45_000, data: dia(5, "10:00"), categoriaId: "moradia" },
    ],
  };
}

mkdirSync(SAIDA, { recursive: true });
const navegador = await chromium.launch();
const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await contexto.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });

async function ir(rota, espera = 400) {
  await page.goto(`${BASE}${rota}`);
  await page.addStyleTag({ content: ESCONDER });
  await page.waitForTimeout(espera);
}

async function capturar(nome) {
  await page.addStyleTag({ content: ESCONDER });
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${SAIDA}/${nome}.png` });
  console.log("ok", nome);
}

// 1–4: telas existentes
await ir("/app/perfis");
await capturar("tela-01");
await page.getByRole("link", { name: /Lucas Andrade/ }).click();
await capturar("tela-02");
await ir("/app/avisos");
await capturar("tela-03");
await ir("/app/menu");
await page.getByText("Tesouraria", { exact: true }).scrollIntoViewIfNeeded();
await page.locator("[data-app] div.rolagem").first().evaluate((el) => el.scrollBy(0, 160));
await capturar("tela-04");

// 5–6: resumo e bolsa (espera a sincronização)
await ir("/app/financeiro", 1600);
await capturar("tela-05");
await ir("/app/financeiro/bolsa", 1600);
await capturar("tela-06");

// 7–8: planejamento com a renda de exemplo
await ir("/app/financeiro/planejar/renda", 1600);
await page.getByLabel("Auxílio familiar").fill("220000");
await page.getByRole("button", { name: "Bolsa IC" }).click();
await page.locator("#renda-bolsaIC").fill("70000");
await page.locator("body").click({ position: { x: 5, y: 5 } });
await capturar("tela-07");
await page.getByRole("button", { name: "Continuar" }).click();
await capturar("tela-08");

// 9–10: painel com gastos de exemplo
await page.evaluate((dados) => localStorage.setItem("inatel-planejador:v1", JSON.stringify(dados)), orcamentoExemplo());
await ir("/app/financeiro/orcamento", 1700);
await capturar("tela-09");
await ir("/app/financeiro/lancar", 1600);
for (const t of ["3", "2", ",", "5", "0"]) {
  await page.getByRole("button", { name: t === "," ? "Vírgula" : t, exact: true }).click();
}
await page.getByRole("button", { name: /Alimentação/ }).click();
await capturar("tela-10");

await page.evaluate(() => localStorage.clear());
await navegador.close();
