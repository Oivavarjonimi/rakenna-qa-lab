import { useState } from "react";
import {
  ArrowRight,
  Beaker,
  Check,
  CheckCheck,
  CircleCheck,
  CircleX,
  Copy,
  Download,
  FlaskConical,
  Play,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import type { Fault, CheckResult } from "./domain";
import { runDomainChecks } from "./domain";
import { cases, makePrompt } from "./learning";
import type { TestCase } from "./learning";
import { CodeBlock } from "./ui";

export function downloadText(filename: string, text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}

export default function QA({
  fault,
  setFault,
  onCopy,
  onNavigate,
}: {
  fault: Fault;
  setFault: (fault: Fault) => void;
  onCopy: (s: string) => void;
  onNavigate: (view: "tasks" | "documents" | "learn") => void;
}) {
  const [selected, setSelected] = useState<TestCase>("version");
  const [context, setContext] = useState("");
  const [generated, setGenerated] = useState<TestCase | null>(null);
  const [generatedContext, setGeneratedContext] = useState("");
  const [tab, setTab] = useState<"plan" | "code" | "prompt">("plan");
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [checked, setChecked] = useState<number[]>([]);

  const currentCase = generated ? cases[generated] : null;
  const failed = results?.filter((r) => !r.passed).length ?? 0;

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">TESTAA AJATTELUASI</div>
          <h1>Laadun oma laboratorio.</h1>
          <p>Vaatimus → testiluonnos → kriittinen arvio → havaittu virhe.</p>
        </div>

        <span className="outlined-pill lavender-pill">
          <FlaskConical size={15} />
          Turvallinen demoaineisto
        </span>
      </div>

      <div className="lab-intro">
        <span className="soft-icon">
          <Sparkles size={22} />
        </span>

        <div>
          <strong>Tekoäly luonnostelee. Laadusta vastaat sinä.</strong>
          <p>
            Tässä labrassa käytetään valmiita testimalleja, ei yhdistettyä
            kielimallia. Kopioi kehote käyttämääsi AI-työkaluun ja vertaa sen
            tuotosta malliin. API-avainta ei tarvita.
          </p>
        </div>

        <button className="text-button" onClick={() => onNavigate("learn")}>
          Miten arvioin? <ArrowRight size={16} />
        </button>
      </div>

      <div className="qa-grid">
        <section className="panel lab-setup">
          <div className="section-number">
            01 <span>VALITSE TESTATTAVA RISKI</span>
          </div>

          <h2>Mitä voisi mennä pieleen?</h2>

          <div className="case-options">
            {(Object.keys(cases) as TestCase[]).map((key) => (
              <button
                key={key}
                className={`case-option ${selected === key ? "active" : ""}`}
                onClick={() => setSelected(key)}
                aria-pressed={selected === key}
              >
                <span className="radio-dot" />

                <span>
                  <strong>{cases[key].label}</strong>
                  <small>{cases[key].risk}</small>
                </span>

                {selected === key && <Check size={17} />}
              </button>
            ))}
          </div>

          <label className="context-label">
            Lisäkonteksti AI-kehotteeseen
            <textarea
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Esim. huomioi myös sivun lataus ja kaksi käyttäjäroolia…"
            />
          </label>

          <button
            className="button primary full-width"
            onClick={() => {
              setGenerated(selected);
              setGeneratedContext(context);
              setChecked([]);
            }}
          >
            <WandSparkles size={17} />
            Muodosta harjoitusluonnos
          </button>

          <p className="microcopy">
            Mallipohja käyttää valittua tapausta. Lisäkonteksti sisältyy
            kopioitavaan AI-kehotteeseen.
          </p>
        </section>

        <section className="panel lab-output">
          <div className="output-heading">
            <div className="section-number">
              02 <span>ARVIOI LUONNOS</span>
            </div>

            <span className="tag">Mallipohjainen</span>
          </div>

          <div
            className="tab-bar"
            role="tablist"
            aria-label="Testiluonnoksen sisältö"
          >
            {(
              [
                { id: "plan", label: "Testisuunnitelma" },
                { id: "code", label: "Playwright" },
                { id: "prompt", label: "AI-kehote" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {!currentCase || !generated ? (
            <div className="output-empty">
              <span>
                <Beaker size={34} />
              </span>

              <h3>Hyvä testi alkaa hyvästä kysymyksestä.</h3>
              <p>Valitse riski ja muodosta ensimmäinen testiluonnoksesi.</p>
            </div>
          ) : (
            <div className="output-content" role="tabpanel">
              {tab === "plan" ? (
                <>
                  <div className="output-label">HYVÄKSYMISKRITEERI</div>

                  <h3>{currentCase.label}</h3>
                  <p>{currentCase.requirement}</p>

                  <div className="output-label">TESTIN VAIHEET</div>

                  <ol className="numbered-steps">
                    {currentCase.manual.map((s: string) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>

                  <div className="review-checklist">
                    <strong>
                      <ShieldCheck size={16} />
                      Tarkista ennen hyväksymistä
                    </strong>

                    {[
                      "Testi tarkistaa juuri vaaditun lopputuloksen.",
                      "Testidata ja rooli on määritelty.",
                      "Olen miettinyt myös virhetilanteen.",
                      "Testi löytää tarkoituksella lisätyn virheen.",
                    ].map((s, i) => (
                      <label key={s}>
                        <input
                          type="checkbox"
                          checked={checked.includes(i)}
                          onChange={() =>
                            setChecked((v) =>
                              v.includes(i)
                                ? v.filter((x) => x !== i)
                                : [...v, i],
                            )
                          }
                        />
                        {s}
                      </label>
                    ))}

                    {checked.length === 4 && (
                      <p className="review-complete">
                        <CheckCheck size={16} />
                        Arviointilista käyty läpi. Perustele valintasi myös omin
                        sanoin.
                      </p>
                    )}
                  </div>
                </>
              ) : tab === "code" ? (
                <>
                  <CodeBlock
                    code={currentCase.test}
                    file={`tests/e2e/${generated}.spec.ts`}
                    onCopy={onCopy}
                  />

                  <button
                    className="text-button download-test"
                    onClick={() =>
                      downloadText(`${generated}.spec.ts`, currentCase.test)
                    }
                  >
                    <Download size={15} />
                    Lataa testitiedosto
                  </button>

                  <p className="microcopy">
                    Selaintesti suoritetaan omalla koneella Playwrightilla.
                    Käytä alkuperäistä demoaineistoa ja valitse Päijänteenranta.
                  </p>
                </>
              ) : (
                <>
                  <CodeBlock
                    code={makePrompt(generated, generatedContext)}
                    file="Kopioi AI-työkaluun"
                    onCopy={onCopy}
                  />

                  <button
                    className="button secondary"
                    onClick={() =>
                      onCopy(makePrompt(generated, generatedContext))
                    }
                  >
                    <Copy size={16} />
                    Kopioi kehote
                  </button>
                </>
              )}
            </div>
          )}
        </section>
      </div>

      <section className="panel fault-lab">
        <div className="fault-heading">
          <div>
            <div className="section-number">
              03 <span>KOKEILE, HAVAITSEEKO TESTI VIRHEEN</span>
            </div>

            <h2>Vihreästä punaiseen. Ja takaisin.</h2>

            <p>
              Suorita kuusi liiketoimintasääntöjen tarkistusta samoilla
              funktioilla, joita sovellus käyttää.
            </p>
          </div>

          <span className="soft-icon">
            <FlaskConical size={23} />
          </span>
        </div>

        <div className="fault-controls">
          <label>
            Harjoitusvirhe
            <select
              aria-label="Harjoitusvirhe"
              value={fault}
              onChange={(e) => {
                setFault(e.target.value as Fault);
                setResults(null);
              }}
            >
              <option value="none">Ei virhettä — vertailutaso</option>
              <option value="dependency">Riippuvuus ohitetaan</option>
              <option value="version">Versionumero ei kasva</option>
              <option value="permission">Lukija voi lisätä version</option>
            </select>
          </label>

          <button
            className="button dark"
            onClick={() => setResults(runDomainChecks(fault))}
          >
            <Play size={16} />
            Suorita tarkistukset
          </button>
        </div>

        <p className="microcopy">
          Tarkistukset käyttävät erillistä vakioaineistoa. Valittu virhe
          vaikuttaa myös tehtävien ja dokumenttien toimintaan tässä
          selainvälilehdessä, kunnes poistat sen. Nämä ovat funktiotason
          tarkistuksia, eivät Playwright-ajo.
        </p>

        {fault !== "none" && (
          <div className="fault-notice">
            <FlaskConical size={16} />
            <span>Harjoitusvirhe on käytössä.</span>

            <button
              className="text-button"
              onClick={() =>
                onNavigate(fault === "dependency" ? "tasks" : "documents")
              }
            >
              Kokeile käyttöliittymässä <ArrowRight size={14} />
            </button>
          </div>
        )}

        {results && (
          <div className="test-results" aria-live="polite">
            <div className={`test-summary ${failed ? "has-failures" : ""}`}>
              {failed ? <CircleX size={22} /> : <CircleCheck size={22} />}

              <strong>
                {results.length - failed} / {results.length} tarkistusta
                läpäisty
              </strong>

              <span>
                {failed
                  ? `${failed} havaittu virhe — testi teki tehtävänsä`
                  : "Vertailutaso kunnossa"}
              </span>
            </div>

            {results.map((r) => (
              <div
                key={r.name}
                className={`test-result ${r.passed ? "passed" : "failed"}`}
              >
                <div>
                  {r.passed ? <CircleCheck size={17} /> : <CircleX size={17} />}

                  <strong>{r.name}</strong>
                  <span>{r.passed ? "Läpäisty" : "Havaittu virhe"}</span>
                </div>

                {!r.passed && (
                  <p>
                    Odotettu: <code>{r.expected}</code>
                    <br />
                    Saatu: <code>{r.actual}</code>
                  </p>
                )}
              </div>
            ))}

            {failed > 0 && (
              <button
                className="text-button"
                onClick={() =>
                  onCopy(
                    `VIRHERAPORTTI — Rakenna-harjoitus\nHarjoitusvirhe: ${fault}\n\n${results
                      .filter((r) => !r.passed)
                      .map(
                        (r) =>
                          `${r.name}\nOdotettu: ${r.expected}\nToteutunut: ${r.actual}`,
                      )
                      .join(
                        "\n\n",
                      )}\n\nToistaminen: valitse QA-labrassa kyseinen harjoitusvirhe ja suorita tarkistukset.\nVakavuus: arvioi vaikutus käyttäjälle ennen luokittelua.`,
                  )
                }
              >
                <Copy size={15} />
                Kopioi virheraportin pohja
              </button>
            )}
          </div>
        )}
      </section>
    </>
  );
}