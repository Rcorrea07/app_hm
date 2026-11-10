import { describe, expect, it } from "vitest";
import { diasEntre, somarDias, formatarData, formatarMes } from "./datas";

describe("datas", () => {
  it("conta dias e formata", () => {
    expect(diasEntre("2026-11-10", "2026-12-05")).toBe(25);
    expect(somarDias("2026-11-10", 25)).toBe("2026-12-05");
    expect(formatarData("2026-12-05")).toBe("05/12/2026");
    expect(formatarMes("2026-11")).toBe("novembro/2026");
  });
});
