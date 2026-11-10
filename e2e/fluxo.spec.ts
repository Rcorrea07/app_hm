import { test, expect, type Page } from "@playwright/test";

/** Tarefa de ponta a ponta da HTA: 1.1 → 1.2 → 2.1 → 2.2 → 3.1 → 3.2. */

async function digitar(page: Page, teclas: string) {
  for (const t of teclas) {
    await page.getByRole("button", { name: t === "," ? "Vírgula" : t, exact: true }).click();
  }
}

test("planejar o mês e lançar gastos, com persistência local", async ({ page }) => {
  // Telas 1 → 3: perfil salvo, autenticação, avisos.
  await page.goto("/app/perfis");
  await page.getByRole("link", { name: /Lucas Andrade/ }).click();
  await page.getByPlaceholder("Senha").fill("123");
  await page.getByRole("button", { name: "Autenticar" }).click();
  await expect(page).toHaveURL(/\/app\/avisos$/);

  // Tela 4: Menu com a seção nova.
  await page.getByRole("link", { name: "Menu" }).last().click();
  await expect(page.getByRole("link", { name: "Planejador Financeiro & Bolsa" })).toBeVisible();
  await page.getByRole("link", { name: "Planejador Financeiro & Bolsa" }).click();

  // Tela 5: resumo depois da sincronização (1.2).
  const tabela = page.getByRole("table", { name: "Resumo da mensalidade" });
  await expect(tabela).toContainText("R$ 2.850,00");
  await expect(tabela).toContainText("R$ 1.140,00");
  await expect(tabela).toContainText("R$ 1.710,00");

  // Tela 6: cotas da bolsa.
  await page.getByRole("link", { name: /Bolsa Finatel/ }).click();
  await expect(page.getByRole("table", { name: "Cotas da bolsa" })).toContainText("20% · R$ 570,00");
  await page.getByRole("link", { name: "Voltar" }).click();

  // Tela 7: renda insuficiente bloqueia; renda certa calcula saldo livre (2.1).
  await page.getByRole("link", { name: "Planejar orçamento do mês" }).click();
  await page.getByLabel("Auxílio familiar").fill("100000");
  await expect(page.getByRole("alert").filter({ hasText: "não cobre" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continuar" })).toBeDisabled();
  await page.getByLabel("Auxílio familiar").fill("220000");
  await page.getByRole("button", { name: "Bolsa IC" }).click();
  await page.locator("#renda-bolsaIC").fill("70000");
  await expect(page.getByRole("table", { name: "Cálculo do saldo livre" })).toContainText("R$ 1.190,00");
  await page.getByRole("button", { name: "Continuar" }).click();

  // Tela 8: tetos sempre somam 100% (2.2).
  await page.locator("#teto-moradia").fill("60");
  await expect(page.getByText("Total distribuído")).toContainText("100%");
  await page.getByRole("button", { name: "Usar divisão sugerida" }).click();
  await expect(page.getByText("R$ 357,00")).toBeVisible();
  await page.getByRole("button", { name: "Salvar orçamento" }).click();
  await expect(page).toHaveURL(/\/app\/financeiro\/orcamento$/);

  // Tela 10: valor zero não registra; gasto dentro do teto (3.1).
  await page.getByRole("link", { name: "Lançar gasto" }).click();
  // aria-disabled: o botão continua clicável para explicar o que falta.
  await page.getByRole("button", { name: "Registrar gasto" }).dispatchEvent("click");
  await expect(page.getByRole("alert").filter({ hasText: "maior que zero" })).toBeVisible();
  await digitar(page, "120,5");
  await page.getByRole("button", { name: /Alimentação/ }).click();
  await expect(page.getByText("Disponível em Alimentação")).toContainText("R$ 357,00");
  await page.getByRole("button", { name: "Registrar gasto" }).click();

  // Tela 9: painel atualizado (3.2).
  await expect(page).toHaveURL(/\/app\/financeiro\/orcamento$/);
  await expect(page.getByRole("progressbar", { name: "Teto de Alimentação usado" })).toHaveAttribute("aria-valuenow", "34");

  // Gasto que estoura o teto pede confirmação.
  await page.getByRole("link", { name: "Lançar gasto" }).click();
  await digitar(page, "300");
  await page.getByRole("button", { name: /Alimentação/ }).click();
  await page.getByRole("button", { name: "Registrar gasto" }).click();
  await expect(page.getByRole("dialog")).toContainText("Vai passar do teto");
  await page.getByRole("button", { name: "Registrar mesmo assim" }).click();
  await expect(page.getByText("Passou do teto")).toBeVisible();
  await expect(page.getByText("R$ 769,50")).toBeVisible(); // 1.190,00 − 420,50

  // Persistência: recarregar mantém os gastos (localStorage).
  await page.reload();
  await expect(page.getByText("R$ 769,50")).toBeVisible();

  // Remover com desfazer.
  await page.getByRole("button", { name: /Remover gasto de R\$ 300,00/ }).click();
  await expect(page.getByText("R$ 1.069,50")).toBeVisible();
  await page.getByRole("button", { name: "Desfazer" }).click();
  await expect(page.getByText("R$ 769,50")).toBeVisible();

  // Outros gastos: a subcategoria é obrigatória e todas descontam do mesmo teto.
  await page.getByRole("link", { name: "Lançar gasto" }).click();
  await digitar(page, "50");
  await page.getByRole("button", { name: /^Outros$/ }).click();
  await page.getByRole("button", { name: "Registrar gasto" }).dispatchEvent("click");
  await expect(page.getByRole("alert").filter({ hasText: "Escolha em que você gastou" })).toBeVisible();
  await page.getByRole("button", { name: "Lazer" }).click();
  await page.getByRole("button", { name: "Registrar gasto" }).click();
  await expect(page).toHaveURL(/\/app\/financeiro\/orcamento$/);
  await expect(page.getByRole("list", { name: "Divisão de Outros gastos" })).toContainText("Lazer");

  // Subcategoria nova criada na hora de lançar.
  await page.getByRole("link", { name: "Lançar gasto" }).click();
  await digitar(page, "30");
  await page.getByRole("button", { name: /^Outros$/ }).click();
  await page.getByRole("button", { name: "Nova" }).click();
  await page.getByPlaceholder(/Academia/).fill("lazer");
  await page.getByRole("button", { name: "Criar" }).click();
  await expect(page.getByRole("dialog")).toContainText("já existe");
  await page.getByPlaceholder(/Academia/).fill("academia");
  await page.getByRole("button", { name: "Criar" }).click();
  await expect(page.getByRole("button", { name: "Academia" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Registrar gasto" }).click();
  await expect(page.getByText("R$ 689,50")).toBeVisible(); // 769,50 − 50 − 30

  // Persistência da subcategoria criada.
  await page.reload();
  await expect(page.getByRole("list", { name: "Divisão de Outros gastos" })).toContainText("Academia");
  await expect(page.getByText("Outros · Academia")).toBeVisible();
});

test("larguras de tela sem rolagem horizontal", async ({ page }) => {
  for (const largura of [320, 360, 390, 412, 430, 768, 1280]) {
    await page.setViewportSize({ width: largura, height: 800 });
    for (const rota of ["/app/menu", "/app/avisos", "/app/financeiro", "/app/financeiro/lancar"]) {
      await page.goto(rota);
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(sobra, `${rota} em ${largura}px`).toBeLessThanOrEqual(0);
    }
  }
});

test("computador: menu lateral no lugar das abas e roteiro fixo", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/app/financeiro");
  const lateral = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(lateral).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Abas do aplicativo" })).toBeHidden();
  await expect(page.getByRole("complementary", { name: "Roteiro da tarefa" })).toBeVisible();
  await expect(page.getByRole("table", { name: "Resumo da mensalidade" })).toContainText("R$ 1.710,00");
  await lateral.getByRole("link", { name: "Orçamento do mês" }).click();
  await expect(page.getByText("Seu mês ainda não tem orçamento")).toBeVisible();
});
