import { describe, expect, it } from "vitest";
import { redistribuir, somaPercentuais } from "./tetos";

describe("tetos", () => {
  it("redistribui mantendo 100%", () => {
    const r = redistribuir([50, 30, 20], 0, 60);
    expect(r).toEqual([60, 24, 16]);
    expect(somaPercentuais(r)).toBe(100);
  });
  it("quando os outros estão zerados, divide igual", () => {
    expect(redistribuir([100, 0, 0], 0, 40)).toEqual([40, 30, 30]);
  });
  it("sempre soma 100 com valores quebrados", () => {
    for (let v = 0; v <= 100; v += 7) {
      expect(somaPercentuais(redistribuir([33, 33, 34], 1, v))).toBe(100);
    }
  });
});
