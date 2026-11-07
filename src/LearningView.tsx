import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Code2,
  Download,
  ExternalLink,
  Play,
  RotateCcw,
} from "lucide-react";
import { lessons, jsStarter } from "./learning";
import type { Task } from "./domain";
import { CodeBlock, Completed } from "./ui";

export default function Learning({
  tasks,
  completed,
  onComplete,
  onCopy,
  onQA,
}: {
  tasks: Task[];
  completed: string[];
  onComplete: (id: string) => void;
  onCopy: (s: string) => void;
  onQA: () => void;
}) {
  const [active, setActive] = useState("js");
  const lesson = lessons.find((l) => l.id === active)!;
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">OPI TEKEMÄLLÄ, OMAAN TAHTIIN</div>
          <h1>Seuraava taito rakentuu tässä.</h1>
          <p>
            Kuusi käytännön askelta tutuista testausperiaatteista uuteen
            teknologiaan.
          </p>
        </div>
        <a
          className="button primary"
          href="/rakenna-qa-lab-lahdekoodi.zip"
          download
        >
          <Download size={17} />
          Lataa lähdekoodi
        </a>
      </div>
      <div className="learning-progress">
        <span className="soft-icon">
          <BookOpen size={22} />
        </span>
        <div>
          <strong>Oma oppimispolkusi</strong>
          <p>JavaScript → TypeScript → React → Playwright → AI & QA → CI/CD</p>
        </div>
        <div className="course-progress">
          <span>
            {completed.length} / {lessons.length} harjoiteltu
          </span>
          <div className="progress-track">
            <i
              style={{ width: `${(completed.length / lessons.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <div className="learning-layout">
        <aside className="lesson-sidebar" aria-label="Oppimispolun osiot">
          {lessons.map((l) => (
            <button
              key={l.id}
              className={`lesson-option ${active === l.id ? "active" : ""}`}
              onClick={() => setActive(l.id)}
              aria-current={active === l.id ? "step" : undefined}
            >
              <span className="lesson-number">{l.number}</span>
              <span>
                <small>{l.technology}</small>
                <strong>{l.title}</strong>
              </span>
              <Completed done={completed.includes(l.id)} />
            </button>
          ))}
          <div className="learning-total">
            <Clock3 size={15} />
            Noin 1 h 45 min + omat kokeilut
          </div>
          <a href="/HARJOITUKSET.md" download className="text-button">
            <Download size={15} />
            Harjoitukset tekstinä
          </a>
        </aside>
        <section className="panel lesson-content" key={lesson.id}>
          <div className="lesson-content-top">
            <span className={`technology-badge technology-${lesson.id}`}>
              {lesson.technology}
            </span>
            <span>
              <Clock3 size={14} />
              {lesson.minutes} min
            </span>
          </div>
          <h2>{lesson.title}</h2>
          <p className="lesson-description">{lesson.description}</p>
          <CodeBlock file={lesson.file} code={lesson.code} onCopy={onCopy} />
          <div className="lesson-points">
            {lesson.points.map((p) => (
              <p key={p}>
                <span>
                  <Check size={14} />
                </span>
                {p}
              </p>
            ))}
          </div>
          <div className="exercise-heading">
            <Code2 size={18} />
            <h3>Kokeile itse</h3>
          </div>
          <p className="exercise-text">{lesson.exercise}</p>
          {lesson.id === "js" && <JavaScriptPractice tasks={tasks} />}
          {lesson.id === "ts" && <TypeScriptPractice />}
          {lesson.id === "react" && <ReactPractice tasks={tasks} />}
          {lesson.id === "playwright" && (
            <div className="terminal">
              <span>PowerShell · puretun projektin kansiossa</span>
              <pre>
                npm install{"\n"}npx playwright install chromium{"\n"}npm run
                test:e2e:ui
              </pre>
            </div>
          )}
          {lesson.id === "ai" && (
            <button className="button secondary" onClick={onQA}>
              Avaa QA-labra <ArrowRight size={16} />
            </button>
          )}
          {lesson.id === "ci" && (
            <div className="callout neutral">
              <Code2 size={22} />
              <div>
                <strong>Valmis työnkulku on lähdekoodipaketissa.</strong>
                <p>
                  Tutustu .github/workflows/quality.yml-tiedostoon. Yhdistämisen
                  esto vaatii lisäksi branch protection- tai ruleset-asetuksen
                  GitHubissa.
                </p>
              </div>
            </div>
          )}
          <div className="lesson-footer">
            <button
              className={`button ${completed.includes(lesson.id) ? "completed-button" : "primary"}`}
              onClick={() => onComplete(lesson.id)}
            >
              <Check size={16} />
              {completed.includes(lesson.id)
                ? "Merkitty harjoitelluksi"
                : "Merkitse harjoitelluksi"}
            </button>
            {lessons.indexOf(lesson) < lessons.length - 1 && (
              <button
                className="text-button"
                onClick={() =>
                  setActive(lessons[lessons.indexOf(lesson) + 1].id)
                }
              >
                Seuraava osio <ArrowRight size={17} />
              </button>
            )}
          </div>
        </section>
      </div>
      <section className="panel local-guide">
        <div>
          <div className="eyebrow">JATKA OMASSA EDITORISSA</div>
          <h2>Oikea sovellus. Oikea lähdekoodi.</h2>
          <p>
            Paketti sisältää tämän React/TypeScript-sovelluksen, yksikkötestit,
            Playwright-testit, CI-esimerkin ja suomenkielisen README-ohjeen.
            Avaa purettu kansio VS Codessa.
          </p>
        </div>
        <div className="terminal">
          <span>PowerShell · käynnistä paikallisesti</span>
          <pre>
            npm install{"\n"}npm run dev{"\n"}
            {"\n"}# Avaa terminaalin näyttämä localhost-osoite.
          </pre>
        </div>
      </section>
      <div className="official-links">
        <span>Viralliset oppaat</span>
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"
          target="_blank"
          rel="noreferrer"
        >
          JavaScript <ExternalLink size={12} />
        </a>
        <a
          href="https://www.typescriptlang.org/docs/handbook/intro.html"
          target="_blank"
          rel="noreferrer"
        >
          TypeScript <ExternalLink size={12} />
        </a>
        <a href="https://react.dev/learn" target="_blank" rel="noreferrer">
          React <ExternalLink size={12} />
        </a>
        <a
          href="https://playwright.dev/docs/intro"
          target="_blank"
          rel="noreferrer"
        >
          Playwright <ExternalLink size={12} />
        </a>
      </div>
    </>
  );
}

function JavaScriptPractice({ tasks }: { tasks: Task[] }) {
  const [code, setCode] = useState(jsStarter);
  const [output, setOutput] = useState("Suorita koodi nähdäksesi tuloksen.");
  const [running, setRunning] = useState(false);
  const [correct, setCorrect] = useState(false);
  const run = () => {
    setRunning(true);
    setCorrect(false);
    // Erillinen Worker rajaa suorituksen pois käyttöliittymän säikeestä. Se suljetaan aikarajassa.
    const source = `self.onmessage = (event) => { try { const value = new Function('tasks', event.data.code)(event.data.tasks); self.postMessage({ output: JSON.stringify(value, null, 2) ?? 'undefined', value }); } catch (error) { self.postMessage({ error: error.message }); } };`;
    const url = URL.createObjectURL(
      new Blob([source], { type: "application/javascript" }),
    );
    let worker: Worker;
    try {
      worker = new Worker(url);
    } catch {
      URL.revokeObjectURL(url);
      setOutput(
        "Selain esti harjoituskoodin suorituksen. Voit kokeilla koodia paikallisesti.",
      );
      setRunning(false);
      return;
    }
    const cleanup = () => {
      worker.terminate();
      URL.revokeObjectURL(url);
      setRunning(false);
    };
    const timeout = window.setTimeout(() => {
      cleanup();
      setOutput(
        "Suoritus keskeytettiin: aikaraja 1,5 s. Tarkista mahdollinen loputon silmukka.",
      );
    }, 1500);
    worker.onmessage = (event) => {
      clearTimeout(timeout);
      cleanup();
      setOutput(
        event.data.error ? `Virhe: ${event.data.error}` : event.data.output,
      );
      setCorrect(
        !event.data.error &&
          event.data.value ===
            tasks
              .filter((t) => t.status === "doing")
              .reduce((s, t) => s + t.cost, 0),
      );
    };
    worker.onerror = () => {
      clearTimeout(timeout);
      cleanup();
      setOutput("Koodin suoritus epäonnistui. Tarkista syntaksi.");
    };
    worker.postMessage({ code, tasks });
  };
  return (
    <div className="js-playground">
      <div className="editor-label">
        <span>harjoitus.js · muokattava</span>
        <button
          className="text-button"
          onClick={() => {
            setCode(jsStarter);
            setCorrect(false);
            setOutput("Suorita koodi nähdäksesi tuloksen.");
          }}
        >
          <RotateCcw size={13} />
          Palauta
        </button>
      </div>
      <textarea
        spellCheck={false}
        aria-label="JavaScript-harjoituskoodi"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={7}
      />
      <div className="editor-actions">
        <span>Käytössä {tasks.length} valitun projektin tehtävää</span>
        <button
          className="button dark small-button"
          onClick={run}
          disabled={running}
        >
          <Play size={14} />
          {running ? "Suoritetaan…" : "Suorita JavaScript"}
        </button>
      </div>
      <pre className="editor-output" aria-live="polite">
        {output}
      </pre>
      {correct && (
        <p className="positive-feedback">
          <Check size={16} />
          Tulos vastaa työn alla olevien tehtävien kustannussummaa.
        </p>
      )}
    </div>
  );
}

function TypeScriptPractice() {
  const [answer, setAnswer] = useState("");
  return (
    <div className="quiz-options">
      {["'finished'", "'done'", "true"].map((a) => (
        <button
          key={a}
          className={`quiz-option ${answer === a ? "selected" : ""}`}
          onClick={() => setAnswer(a)}
        >
          <code>{a}</code>
          {answer === a && <Check size={16} />}
        </button>
      ))}
      {answer && (
        <p
          className={
            answer === "'done'" ? "positive-feedback" : "negative-feedback"
          }
        >
          {answer === "'done'"
            ? "Oikein. 'done' on yksi kolmesta sallitusta merkkijonosta. Kokeile väärää arvoa myös paikallisesti ja aja npm run typecheck."
            : "Tämä ei kuulu TaskStatus-unioniin. Sallitut arvot ovat 'todo', 'doing' ja 'done'."}
        </p>
      )}
    </div>
  );
}

/** Sama useState-ajatus kuin oppimispolun esimerkissä. */
// function ReactPractice({ tasks }: { tasks: Task[] }) {
//   const [onlyOpen, setOnlyOpen] = useState(false);
//   const visible = onlyOpen ? tasks.filter((t) => t.status !== "done") : tasks;
//   return (
//     <div className="react-preview">
//       <div className="editor-label">
//         <span>ELÄVÄ REACT-ESIKATSELU</span>
//         <span>onlyOpen = {String(onlyOpen)}</span>
//       </div>
//       <div className="react-preview-content">
//         <button
//           className="button secondary"
//           onClick={() => setOnlyOpen(!onlyOpen)}
//         >
//           {onlyOpen ? "Näytä kaikki" : "Vain avoimet"}
//         </button>
//         <strong>Näytetään {visible.length} tehtävää</strong>
//         <div className="preview-tasks">
//           {visible.map((t) => (
//             <span key={t.id} className={t.status === "done" ? "is-done" : ""}>
//               {t.title}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


/** Sama useState-ajatus kuin oppimispolun esimerkissä. */
function ReactPractice({ tasks }: { tasks: Task[] }) {
  const [onlyOpen, setOnlyOpen] = useState(false);
  const visible = onlyOpen ? tasks.filter((t) => t.status !== "done") : tasks;
  return (
    <div className="react-preview">
      <div className="editor-label">
        <span>ELÄVÄ REACT-ESIKATSELU</span>
        <span>onlyOpen = {String(onlyOpen)}</span>
      </div>
      <div className="react-preview-content">
        <button
          className="button secondary"
          onClick={() => setOnlyOpen(!onlyOpen)}
        >
          {onlyOpen ? "Näytä kaikki" : "Vain avoimet"}
        </button>
        <strong>Näytetään {visible.length} tehtävää</strong>
        <div className="preview-tasks">
          {visible.map((t) => (
            <span key={t.id} className={t.status === "done" ? "is-done" : ""}>
              {t.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}