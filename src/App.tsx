import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  FileText,
  FlaskConical,
  FolderKanban,
  LayoutDashboard,
  Menu,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import type {
  DemoState,
  Fault,
  Role,
  Task,
  TaskStatus,
  ProjectDocument,
} from "./domain";
import {
  addDocumentVersion,
  changeTaskStatus,
  initialState,
  projects,
  readState,
  saveTask,
  STORE_KEY,
} from "./domain";
import Overview from "./Overview";
import Tasks, { TaskDialog } from "./Tasks";
import Documents from "./Documents";
import QA, { downloadText } from "./QA";
//import Learning from "./Learning";
import Learning from "./LearningView";
import { Modal } from "./ui";

type View = "overview" | "tasks" | "documents" | "qa" | "learn";
const viewNames: Record<View, string> = {
  overview: "Yleiskuva",
  tasks: "Tehtävät",
  documents: "Dokumentit",
  qa: "QA-labra",
  learn: "Oppimispolku",
};
const navigation = [
  { id: "overview" as const, icon: LayoutDashboard },
  { id: "tasks" as const, icon: FolderKanban },
  { id: "documents" as const, icon: FileText },
];

function initialFault(): Fault {
  try {
    const f = sessionStorage.getItem("rakenna-fault");
    if (f === "dependency" || f === "version" || f === "permission") return f;
  } catch {
    /* Tallennus on valinnainen. */
  }
  return "none";
}

export default function App() {
  const [state, setState] = useState<DemoState>(readState);
  const [view, setView] = useState<View>("overview");
  const [projectId, setProjectId] = useState("p1");
  const [role, setRole] = useState<Role>("manager");
  const [fault, setFault] = useState<Fault>(initialFault);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editing, setEditing] = useState<{ task: Task | null } | null>(null);
  const [info, setInfo] = useState(false);
  const [reset, setReset] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [notice, setNotice] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const project = projects.find((p) => p.id === projectId)!;
  const tasks = state.tasks.filter((t) => t.projectId === projectId);
  const documents = state.documents.filter((d) => d.projectId === projectId);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
      setStorageOk(true);
    } catch {
      setStorageOk(false);
    }
  }, [state]);
  useEffect(() => {
    try {
      sessionStorage.setItem("rakenna-fault", fault);
    } catch {
      /* Virhevalinta toimii myös vain muistissa. */
    }
  }, [fault]);
  useEffect(() => {
    if (notice?.type === "success") {
      const timer = setTimeout(() => setNotice(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [notice]);

  const navigate = (next: View) => {
    setView(next);
    setMobileOpen(false);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const notify = (text: string) => setNotice({ text, type: "success" });
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify("Kopioitu leikepöydälle.");
    } catch {
      downloadText("rakenna-kopio.txt", text);
      notify("Leikepöytä ei ollut käytettävissä. Teksti ladattiin tiedostona.");
    }
  };
  const updateStatus = (id: string, status: TaskStatus) => {
    try {
      const updated = changeTaskStatus(state.tasks, id, status, fault);
      setState({ ...state, tasks: updated });
      notify("Tehtävän tila päivitetty.");
    } catch (error) {
      setNotice({
        text: error instanceof Error ? error.message : String(error),
        type: "error",
      });
    }
  };
  const updateTask = (candidate: Task) => {
    const updated = saveTask(state.tasks, candidate);
    setState({ ...state, tasks: updated });
    setEditing(null);
    notify("Tehtävä tallennettu.");
  };
  const addVersion = (doc: ProjectDocument, note: string) => {
    const updated = addDocumentVersion(doc, role, note, fault);
    setState({
      ...state,
      documents: state.documents.map((d) => (d.id === doc.id ? updated : d)),
    });
    notify("Dokumenttiversio tallennettu.");
  };

  return (
    <div className="app-shell">
      {mobileOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Sulje valikko"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <button
          className="brand"
          onClick={() => navigate("overview")}
          aria-label="Rakenna, etusivu"
        >
          <span className="brand-symbol">
            <Building2 size={24} strokeWidth={1.7} />
          </span>
          <span>
            rakenna<span className="brand-period">.</span>
          </span>
        </button>
        <div className="workspace-chip">
          <span className="workspace-icon">K</span>
          <div>
            <strong>Kimmon harjoitustyötila</strong>
            <span>Projektit & laadunvarmistus</span>
          </div>
        </div>
        <div className="nav-label">PROJEKTIN TYÖTILA</div>
        <nav aria-label="Päänavigaatio">
          {navigation.map((item) => (
            <button
              key={item.id}
              aria-label={viewNames[item.id]}
              aria-current={view === item.id ? "page" : undefined}
              className={`nav-item ${view === item.id ? "active" : ""}`}
              onClick={() => navigate(item.id)}
            >
              <item.icon size={19} />
              <span>{viewNames[item.id]}</span>
              {item.id === "tasks" && (
                <span className="nav-count">
                  {tasks.filter((t) => t.status !== "done").length}
                </span>
              )}
            </button>
          ))}
          <div className="nav-divider" />
          <div className="nav-label">OPI & KOKEILE</div>
          <button
            aria-label="QA-labra"
            className={`nav-item ${view === "qa" ? "active" : ""}`}
            aria-current={view === "qa" ? "page" : undefined}
            onClick={() => navigate("qa")}
          >
            <FlaskConical size={19} />
            <span>QA-labra</span>
            <span className="new-tag">AI</span>
          </button>
          <button
            className={`nav-item ${view === "learn" ? "active" : ""}`}
            aria-current={view === "learn" ? "page" : undefined}
            onClick={() => navigate("learn")}
          >
            <BookOpen size={19} />
            <span>Oppimispolku</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-learning">
            <span className="sidebar-spark">
              <Sparkles size={18} />
            </span>
            <h3>Pieni kokeilu. Uusi taito.</h3>
            <p>React, TypeScript ja testaus käytännössä.</p>
            <button onClick={() => navigate("learn")}>
              Jatka oppimista <ArrowRight size={16} />
            </button>
          </div>
          <button className="help-button" onClick={() => setInfo(true)}>
            <CircleHelp size={17} />
            Ohje ja aloitus
            <ExternalLink size={13} />
          </button>
          <div className="sidebar-version">
            <i />
            HARJOITUSVERSIO 1.0
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu icon-button"
              aria-label="Avaa valikko"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
            <span>Työtila</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{viewNames[view]}</strong>
          </div>
          <div className="topbar-right">
            <span className="demo-pill">
              <i />
              Demo · 7.11.2026
            </span>
            <button
              className="icon-button"
              aria-label="Palauta demoaineisto"
              title="Palauta demoaineisto"
              onClick={() => setReset(true)}
            >
              <RotateCcw size={17} />
            </button>
            <span className="topbar-divider" />
            <div className="user-profile">
              <span className="profile-avatar">KL</span>
              <span>
                Kimmo<small>QA Specialist</small>
              </span>
            </div>
          </div>
        </header>
        <main>
          <div className="project-context">
            <div className="project-selector">
              <span className="project-context-icon">
                <Building2 size={18} />
              </span>
              <select
                aria-label="Valittu projekti"
                value={projectId}
                onChange={(e) => {
                  setProjectId(e.target.value);
                  setNotice(null);
                }}
              >
                <option value="p1">As Oy Päijänteenranta</option>
                <option value="p2">Muuramen koulukeskus</option>
                <option value="p3">Jämsän toimistotalo</option>
              </select>
              <ChevronDown size={15} />
            </div>
            <span>
              {project.code}
              <span className="context-dot">·</span>
              <ShieldCheck size={14} />
              Kuvitteellinen harjoitus
            </span>
          </div>
          {notice && (
            <div
              className={`notification ${notice.type}`}
              role={notice.type === "error" ? "alert" : "status"}
            >
              {notice.type === "error" ? (
                <AlertCircle size={18} />
              ) : (
                <Check size={18} />
              )}
              <span>{notice.text}</span>
              <button
                className="icon-button"
                aria-label="Sulje ilmoitus"
                onClick={() => setNotice(null)}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {fault !== "none" && view !== "qa" && (
            <div className="global-fault">
              <FlaskConical size={16} />
              <span>
                Harjoitusvirhe käytössä:{" "}
                {fault === "dependency"
                  ? "riippuvuus ohitetaan"
                  : fault === "version"
                    ? "versionumero ei kasva"
                    : "lukijan muokkaus sallitaan"}
                .
              </span>
              <button
                onClick={() => {
                  setFault("none");
                  notify(
                    "Harjoitusvirhe poistettu. Aiemmat muutokset jäävät demoaineistoon.",
                  );
                }}
              >
                Poista virhe
              </button>
              <button onClick={() => navigate("qa")}>
                QA-labra <ArrowRight size={13} />
              </button>
            </div>
          )}
          {view === "overview" && (
            <Overview
              project={project}
              tasks={tasks}
              documents={documents}
              onNavigate={navigate}
              onNew={() => setEditing({ task: null })}
              completed={state.completedLessons.length}
            />
          )}
          {view === "tasks" && (
            <Tasks
              key={projectId}
              project={project}
              tasks={tasks}
              onStatus={updateStatus}
              onEdit={(task) => setEditing({ task })}
            />
          )}
          {view === "documents" && (
            <Documents
              key={projectId}
              documents={documents}
              role={role}
              setRole={setRole}
              onAdd={addVersion}
            />
          )}
          {view === "qa" && (
            <QA
              fault={fault}
              setFault={setFault}
              onCopy={copy}
              onNavigate={navigate}
            />
          )}
          {view === "learn" && (
            <Learning
              tasks={tasks}
              completed={state.completedLessons}
              // onComplete={(id) =>
              onComplete={(id: string) =>  
                setState({
                  ...state,
                  completedLessons: state.completedLessons.includes(id)
                    ? state.completedLessons.filter((s) => s !== id)
                    : [...state.completedLessons, id],
                })
              }
              onCopy={copy}
              onQA={() => navigate("qa")}
            />
          )}
          <footer className="app-footer">
            <span>
              rakenna. <i>Projektit & QA-labra</i>
            </span>
            <span>
              {storageOk
                ? "Muutokset tallentuvat tähän selaimeen"
                : "Selain ei salli tallennusta — muutokset ovat vain muistissa"}
              <i
                className={
                  storageOk ? "storage-dot" : "storage-dot warning-dot"
                }
              />
            </span>
          </footer>
        </main>
      </div>
      {editing && (
        <TaskDialog
          task={editing.task}
          project={project}
          tasks={tasks}
          onSave={updateTask}
          onClose={() => setEditing(null)}
        />
      )}
      {info && (
        <Modal
          title="Tervetuloa harjoitustyömaalle"
          onClose={() => setInfo(false)}
        >
          <div className="help-content">
            <p>
              <strong>Rakenna on kuvitteellinen oppimissovellus</strong>, joka
              tukee valmistautumista rakennusalan SaaS-tuotteiden
              laadunvarmistukseen. Se ei ole Admicomin tuote tai kuvaus
              yrityksen sisäisestä toteutuksesta.
            </p>
            <ol className="numbered-steps">
              <li>Tutustu ensin projektin tehtäviin ja dokumentteihin.</li>
              <li>
                Kokeile uuden tehtävän luontia, riippuvuuksia ja
                dokumenttiversioita.
              </li>
              <li>
                Avaa oppimispolku. Voit muokata JavaScriptiä suoraan selaimessa.
              </li>
              <li>
                Avaa QA-labra: muodosta testiluonnos, arvioi se ja kytke
                harjoitusvirhe päälle.
              </li>
              <li>
                Lataa lähdekoodi ja jatka Reactin, TypeScriptin sekä
                Playwrightin harjoittelua VS Codessa.
              </li>
            </ol>
            <div className="callout neutral">
              <ShieldCheck size={21} />
              <p>
                Kaikki projektit ja henkilöt ovat demoaineistoa. Tehtävät ja
                versiot tallennetaan selaimeesi. Harjoituksen päivä on
                7.11.2026. AI-kehotteen voi kopioida omaan AI-työkaluun;
                sovelluksessa ei ole suoraa kielimalliyhteyttä.
              </p>
            </div>
            <div className="help-actions">
              <button
                className="button secondary"
                onClick={() =>
                  downloadText(
                    "rakenna-harjoitusdata.json",
                    JSON.stringify(state, null, 2),
                  )
                }
              >
                <ArrowDownToLine size={16} />
                Vie harjoitusdata
              </button>
              <button
                className="button primary"
                onClick={() => {
                  setInfo(false);
                  navigate("learn");
                }}
              >
                Avaa oppimispolku <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </Modal>
      )}
      {reset && (
        <Modal
          title="Palautetaanko alkuperäinen demo?"
          onClose={() => setReset(false)}
        >
          <div className="help-content">
            <p>
              Tämä korvaa lisäämäsi tehtävät, muokkaukset ja dokumenttiversiot
              alkuperäisellä aineistolla. Myös harjoittelumerkinnät ja
              harjoitusvirhe nollataan.
            </p>
            <p>
              Voit ensin viedä nykyisen aineiston Ohje ja aloitus -näkymästä.
            </p>
            <div className="help-actions">
              <button
                className="button secondary"
                onClick={() => setReset(false)}
              >
                Peruuta
              </button>
              <button
                className="button primary"
                onClick={() => {
                  setState(initialState());
                  setFault("none");
                  setRole("manager");
                  setProjectId("p1");
                  setReset(false);
                  notify("Alkuperäinen demoaineisto palautettu.");
                }}
              >
                <RotateCcw size={16} />
                Palauta alkuperäinen demo
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
