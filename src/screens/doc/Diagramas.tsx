import { CLASSES, HTA, type ClasseUML } from "@/doc/conteudo";

const AZUL = "#0166c0";
const TINTA = "#18181b";

/* =================== HTA (Annett & Duncan) =================== */

export function DiagramaHTA() {
  const W = 1000;
  const colunas = [170, 500, 830];
  const larg = 290;
  return (
    <svg viewBox={`0 0 ${W} 340`} role="img" aria-labelledby="hta-titulo" className="h-auto w-full" fontFamily="Inter, system-ui, sans-serif">
      <title id="hta-titulo">Diagrama HTA: meta 0 dividida nos subobjetivos 1, 2 e 3, cada um com duas operações</title>
      {/* Meta 0 */}
      <rect x={235} y={6} width={530} height={58} rx={4} fill="#eef5fc" stroke={AZUL} strokeWidth={1.6} />
      <text x={500} y={30} textAnchor="middle" fontSize={15} fontWeight={700} fill={TINTA}>
        0. {HTA.meta.titulo}
      </text>
      <text x={500} y={51} textAnchor="middle" fontSize={12} fontStyle="italic" fill="#3f3f46">
        {HTA.meta.plano}
      </text>
      {/* barramento */}
      <line x1={500} y1={64} x2={500} y2={88} stroke={TINTA} />
      <line x1={colunas[0]} y1={88} x2={colunas[2]} y2={88} stroke={TINTA} />
      {HTA.sub.map((s, i) => {
        const cx = colunas[i];
        const x = cx - larg / 2;
        return (
          <g key={s.id}>
            <line x1={cx} y1={88} x2={cx} y2={108} stroke={TINTA} />
            <rect x={x} y={108} width={larg} height={50} rx={4} fill="#fff" stroke={TINTA} strokeWidth={1.3} />
            <text x={cx} y={129} textAnchor="middle" fontSize={14} fontWeight={700} fill={TINTA}>
              {s.id}. {s.titulo}
            </text>
            <text x={cx} y={148} textAnchor="middle" fontSize={11.5} fontStyle="italic" fill="#3f3f46">
              {s.plano}
            </text>
            {s.ops.map((o, k) => {
              const y = 190 + k * 76;
              return (
                <g key={o.id}>
                  <line x1={cx} y1={k === 0 ? 158 : y - 30} x2={cx} y2={y} stroke={TINTA} />
                  <rect x={x + 10} y={y} width={larg - 20} height={46} rx={3} fill="#fff" stroke={TINTA} />
                  <foreignObject x={x + 14} y={y + 2} width={larg - 28} height={42}>
                    <div
                      style={{ fontSize: 12, lineHeight: 1.25, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: TINTA }}
                    >
                      <span>
                        <b style={{ color: AZUL }}>{o.id}</b> {o.titulo}
                      </span>
                    </div>
                  </foreignObject>
                  {/* traço duplo: operação no nível mais baixo (parada da decomposição) */}
                  <line x1={x + 10} y1={y + 50} x2={x + larg - 10} y2={y + 50} stroke={TINTA} />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

/* =================== Diagrama de Classes (UML) =================== */

const CAB = 26;
const LIN = 15;

export function alturaClasse(c: ClasseUML): number {
  return CAB + 8 + c.atributos.length * LIN + 8 + c.metodos.length * LIN + 8;
}

function Caixa({ c }: { c: ClasseUML }) {
  const h = alturaClasse(c);
  const yAttr = c.y + CAB + 8;
  const yDiv = yAttr + c.atributos.length * LIN + 4;
  const linha = (t: string, y: number) => {
    const novo = t.endsWith("★");
    return (
      <text key={t} x={c.x + 8} y={y} fontSize={11} fill={novo ? AZUL : TINTA} fontWeight={novo ? 600 : 400}>
        {t}
      </text>
    );
  };
  return (
    <g>
      <rect x={c.x} y={c.y} width={c.w} height={h} fill="#fff" stroke={TINTA} strokeWidth={1.3} />
      <rect x={c.x} y={c.y} width={c.w} height={CAB} fill="#eef5fc" stroke={TINTA} strokeWidth={1.3} />
      <text x={c.x + c.w / 2} y={c.y + 17} textAnchor="middle" fontSize={13} fontWeight={700} fill={TINTA}>
        {c.nome}
      </text>
      {c.atributos.map((a, i) => linha(a, yAttr + 9 + i * LIN))}
      <line x1={c.x} y1={yDiv} x2={c.x + c.w} y2={yDiv} stroke={TINTA} />
      {c.metodos.map((m, i) => linha(m, yDiv + 15 + i * LIN))}
    </g>
  );
}

const pos = (id: string) => CLASSES.find((c) => c.id === id)!;

function Losango({ x, y, dir, cheio }: { x: number; y: number; dir: "dir" | "baixo"; cheio: boolean }) {
  const p = dir === "dir" ? `${x},${y} ${x + 10},${y - 6} ${x + 20},${y} ${x + 10},${y + 6}` : `${x},${y} ${x + 6},${y + 10} ${x},${y + 20} ${x - 6},${y + 10}`;
  return <polygon points={p} fill={cheio ? TINTA : "#fff"} stroke={TINTA} strokeWidth={1.2} />;
}

function Seta({ x, y, dir }: { x: number; y: number; dir: "dir" | "cima" }) {
  const d = dir === "dir" ? `M${x - 9},${y - 5} L${x},${y} L${x - 9},${y + 5}` : `M${x - 5},${y + 9} L${x},${y} L${x + 5},${y + 9}`;
  return <path d={d} fill="none" stroke={TINTA} strokeWidth={1.3} />;
}

function Txt({ x, y, children, anchor = "middle", italic }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end"; italic?: boolean }) {
  return (
    <text x={x} y={y} fontSize={11} textAnchor={anchor} fill="#3f3f46" fontStyle={italic ? "italic" : undefined}>
      {children}
    </text>
  );
}

export function DiagramaClasses() {
  const al = pos("aluno"), su = pos("suporte"), me = pos("mensalidade"), bo = pos("bolsa");
  const or = pos("orcamento"), ca = pos("categoria"), de = pos("despesa");
  const yTop = 62; // altura das ligações da primeira linha
  const yBase = or.y + 60;
  const suX = 377;
  const meBase = me.y + alturaClasse(me);
  const suBase = su.y + alturaClasse(su);

  return (
    <svg viewBox="0 0 1140 572" role="img" aria-labelledby="uml-titulo" className="h-auto w-full" fontFamily="Inter, system-ui, sans-serif">
      <title id="uml-titulo">Diagrama de classes do módulo Suporte Financeiro com 7 classes e suas relações</title>

      {/* Aluno → SuporteFinanceiro (associação) */}
      <line x1={al.x + al.w} y1={yTop} x2={su.x} y2={yTop} stroke={TINTA} strokeWidth={1.2} />
      <Seta x={su.x} y={yTop} dir="dir" />
      <Txt x={(al.x + al.w + su.x) / 2} y={yTop - 6}>acessa</Txt>
      <Txt x={al.x + al.w + 6} y={yTop + 15} anchor="start">1..1</Txt>
      <Txt x={su.x - 8} y={yTop + 15} anchor="end">1..1</Txt>

      {/* SuporteFinanceiro → Mensalidade (associação) */}
      <line x1={su.x + su.w} y1={yTop} x2={me.x} y2={yTop} stroke={TINTA} strokeWidth={1.2} />
      <Seta x={me.x} y={yTop} dir="dir" />
      <Txt x={(su.x + su.w + me.x) / 2} y={yTop - 6}>exibe</Txt>
      <Txt x={su.x + su.w + 6} y={yTop + 15} anchor="start">1..1</Txt>
      <Txt x={me.x - 8} y={yTop + 15} anchor="end">0..*</Txt>

      {/* Mensalidade ◇— Bolsa (agregação) */}
      <Losango x={me.x + me.w} y={yTop} dir="dir" cheio={false} />
      <line x1={me.x + me.w + 20} y1={yTop} x2={bo.x} y2={yTop} stroke={TINTA} strokeWidth={1.2} />
      <Txt x={(me.x + me.w + bo.x) / 2 + 8} y={yTop - 9}>aplica</Txt>
      <Txt x={me.x + me.w + 6} y={yTop + 19} anchor="start">0..*</Txt>
      <Txt x={bo.x - 6} y={yTop + 19} anchor="end">0..*</Txt>

      {/* SuporteFinanceiro ◆— OrcamentoMensal (composição) */}
      <Losango x={suX} y={suBase} dir="baixo" cheio />
      <line x1={suX} y1={suBase + 20} x2={suX} y2={or.y} stroke={TINTA} strokeWidth={1.2} />
      <Txt x={suX - 8} y={(suBase + or.y) / 2 + 20} anchor="end">gerencia</Txt>
      <Txt x={suX + 8} y={suBase + 34} anchor="start">1..1</Txt>
      <Txt x={suX + 8} y={or.y - 6} anchor="start">0..*</Txt>

      {/* OrcamentoMensal ◆— CategoriaGasto (composição) */}
      <Losango x={or.x + or.w} y={yBase} dir="dir" cheio />
      <line x1={or.x + or.w + 20} y1={yBase} x2={ca.x} y2={yBase} stroke={TINTA} strokeWidth={1.2} />
      <Txt x={(or.x + or.w + ca.x) / 2 + 10} y={yBase - 9}>contém</Txt>
      <Txt x={or.x + or.w + 6} y={yBase + 19} anchor="start">1..1</Txt>
      <Txt x={ca.x - 6} y={yBase + 19} anchor="end">3</Txt>

      {/* CategoriaGasto ◆— Despesa (composição) */}
      <Losango x={ca.x + ca.w} y={yBase} dir="dir" cheio />
      <line x1={ca.x + ca.w + 20} y1={yBase} x2={de.x} y2={yBase} stroke={TINTA} strokeWidth={1.2} />
      <Txt x={(ca.x + ca.w + de.x) / 2 + 10} y={yBase - 9}>registra</Txt>
      <Txt x={ca.x + ca.w + 6} y={yBase + 19} anchor="start">1..1</Txt>
      <Txt x={de.x - 6} y={yBase + 19} anchor="end">0..*</Txt>

      {/* OrcamentoMensal ⇢ Mensalidade (dependência) */}
      <path
        d={`M${395},${or.y} L${395},${292} L${680},${292} L${680},${meBase}`}
        fill="none"
        stroke={TINTA}
        strokeWidth={1.2}
        strokeDasharray="6 4"
      />
      <Seta x={680} y={meBase} dir="cima" />
      <Txt x={540} y={285} italic>
        usa a parcela líquida
      </Txt>

      {CLASSES.map((c) => (
        <Caixa key={c.id} c={c} />
      ))}

      {/* Legenda */}
      <g transform="translate(10,552)" fontSize={11} fill={TINTA}>
        <line x1={0} y1={6} x2={34} y2={6} stroke={TINTA} />
        <Seta x={34} y={6} dir="dir" />
        <text x={42} y={10}>Associação</text>
        <line x1={130} y1={6} x2={164} y2={6} stroke={TINTA} strokeDasharray="5 3" />
        <Seta x={164} y={6} dir="dir" />
        <text x={172} y={10}>Dependência</text>
        <Losango x={268} y={6} dir="dir" cheio={false} />
        <line x1={288} y1={6} x2={304} y2={6} stroke={TINTA} />
        <text x={310} y={10}>Agregação</text>
        <Losango x={392} y={6} dir="dir" cheio />
        <line x1={412} y1={6} x2={428} y2={6} stroke={TINTA} />
        <text x={434} y={10}>Composição</text>
        <text x={530} y={10}>+ público · - privado · / derivado</text>
        <text x={740} y={10} fill={AZUL} fontWeight={600}>
          ★ acrescentado no protótipo final
        </text>
      </g>
    </svg>
  );
}
