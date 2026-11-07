import {
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  CircleCheck,
  Clock3,
  FileText,
  FolderKanban,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import type { Project, Task, ProjectDocument } from "./domain";
import { budgetSummary, euro, day, DEMO_DAY, priorities } from "./domain";
import { Avatar, BuildingDrawing } from "./ui";

export default function Overview({
  project,
  tasks,
  documents,
  onNavigate,
  onNew,
  completed,
}: {
  project: Project;
  tasks: Task[];
  documents: ProjectDocument[];
  onNavigate: (view: "tasks" | "documents" | "qa" | "learn") => void;
  onNew: () => void;
  completed: number;
}) {
  const done = tasks.filter((t) => t.status === "done").length;
  const open = tasks.length - done;
  const overdue = tasks.filter(
    (t) => t.status !== "done" && t.due < DEMO_DAY,
  ).length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const budget = budgetSummary(project, tasks);
  const next = tasks
    .filter((t) => t.status !== "done")
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 4);
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">HYVÄÄ TYÖPÄIVÄÄ, KIMMO</div>
          <h1>Projektin pulssi.</h1>
          <p>Suunnitelmat, ihmiset ja laatu. Samassa näkymässä.</p>
        </div>
        <button className="button primary" onClick={onNew}>
          <Plus size={18} />
          Uusi tehtävä
        </button>
      </div>
      <section className="project-hero">
        <div className="hero-content">
          <div className="hero-tags">
            <span>
              <i />
              Käynnissä
            </span>
            <span>{project.category}</span>
          </div>
          <h2>{project.name}</h2>
          <p>
            <MapPin size={14} />
            {project.address}
          </p>
          <div className="hero-bottom">
            <div>
              <span className="hero-small-label">PROJEKTIN AIKATAULU</span>
              <strong>
                <CalendarDays size={15} />
                {day(project.start)} — {day(project.end)}
              </strong>
            </div>
            <div className="avatar-group">
              <Avatar name="Anna Korhonen" />
              <Avatar name="Mikko Virtanen" />
              <Avatar name="Juha Laine" />
              <span className="avatar more">+1</span>
            </div>
          </div>
        </div>
        <BuildingDrawing />
      </section>
      <div className="stat-grid">
        <button className="stat-card" onClick={() => onNavigate("tasks")}>
          <div className="stat-top">
            <span>Valmistuminen</span>
            <span className="stat-icon mint">
              <CircleCheck size={19} />
            </span>
          </div>
          <div className="stat-value">
            {progress}
            <small>%</small>
          </div>
          <div className="progress-track">
            <i style={{ width: `${progress}%` }} />
          </div>
          <p>
            {done} / {tasks.length} työvaihetta valmiina{" "}
            <ArrowUpRight size={14} />
          </p>
        </button>
        <button className="stat-card" onClick={() => onNavigate("tasks")}>
          <div className="stat-top">
            <span>Avoimet tehtävät</span>
            <span className="stat-icon peach">
              <FolderKanban size={19} />
            </span>
          </div>
          <div className="stat-value">
            {open}
            <small>tehtävää</small>
          </div>
          <p>
            <span className={overdue ? "overdue" : ""}>
              {overdue ? `${overdue} myöhässä` : "Aikataulu kunnossa"}
            </span>
            <ArrowUpRight size={14} />
          </p>
        </button>
        <div className="stat-card">
          <div className="stat-top">
            <span>Sidottu budjetista</span>
            <span className="stat-icon sand">
              <Wallet size={19} />
            </span>
          </div>
          <div className="stat-value">
            {budget.percent}
            <small>%</small>
          </div>
          <p className={budget.remaining < 0 ? "overdue" : ""}>
            {euro(budget.remaining)}{" "}
            {budget.remaining < 0 ? "ylitys" : "jäljellä"}
          </p>
        </div>
        <button className="stat-card" onClick={() => onNavigate("documents")}>
          <div className="stat-top">
            <span>Projektidokumentit</span>
            <span className="stat-icon lavender">
              <FileText size={19} />
            </span>
          </div>
          <div className="stat-value">
            {documents.length}
            <small>dokumenttia</small>
          </div>
          <p>
            Versiohistoria ajan tasalla <ArrowUpRight size={14} />
          </p>
        </button>
      </div>
      <div className="overview-grid">
        <section className="panel upcoming-panel">
          <div className="panel-heading">
            <div>
              <h2>Seuraavaksi työmaalla</h2>
              <p>Tärkeimmät avoimet työvaiheet.</p>
            </div>
            <button className="text-button" onClick={() => onNavigate("tasks")}>
              Kaikki tehtävät <ArrowRight size={16} />
            </button>
          </div>
          <div className="upcoming-list">
            {next.map((t) => (
              <button
                key={t.id}
                className="upcoming-row"
                onClick={() => onNavigate("tasks")}
              >
                <span className={`task-bullet ${t.status}`}>
                  <Clock3 size={16} />
                </span>
                <span className="upcoming-info">
                  <strong>{t.title}</strong>
                  <span>
                    {t.assignee} <i>·</i>{" "}
                    <span className={t.due < DEMO_DAY ? "overdue" : ""}>
                      {day(t.due)}
                    </span>
                  </span>
                </span>
                <span className={`priority priority-${t.priority}`}>
                  <i />
                  {priorities[t.priority]}
                </span>
                <ArrowUpRight className="row-arrow" size={16} />
              </button>
            ))}
            {!next.length && (
              <div className="empty-compact">
                <CircleCheck size={25} />
                <p>Kaikki tehtävät valmiina.</p>
              </div>
            )}
          </div>
        </section>
        <section className="panel budget-panel">
          <div className="panel-heading">
            <div>
              <h2>Budjetin tilanne</h2>
              <p>Kustannusarviot yhdessä.</p>
            </div>
            <Wallet size={19} />
          </div>
          <div className="budget-total">
            {euro(budget.committed)}
            <span>/ {euro(project.budget)}</span>
          </div>
          <div className="budget-bar">
            <span
              style={{
                width: `${Math.min(100, (project.baseCost / project.budget) * 100)}%`,
              }}
            />
            <span
              style={{
                width: `${Math.max(0, Math.min(((budget.committed - project.baseCost) / project.budget) * 100, 100 - (project.baseCost / project.budget) * 100))}%`,
              }}
            />
          </div>
          <div className="budget-legend">
            <p>
              <i className="dark-dot" />
              Pohjakustannukset<strong>{euro(project.baseCost)}</strong>
            </p>
            <p>
              <i className="light-dot" />
              Tehtävien kustannusarviot
              <strong>{euro(budget.committed - project.baseCost)}</strong>
            </p>
            <p>
              <i className="empty-dot" />
              Jäljellä
              <strong className={budget.remaining < 0 ? "overdue" : ""}>
                {euro(budget.remaining)}
              </strong>
            </p>
          </div>
          {budget.remaining < 0 && (
            <p className="budget-warning">
              <AlertTriangle size={15} />
              Kustannusarvio ylittää budjetin.
            </p>
          )}
          <p className="budget-note">
            Harjoituslaskelma: pohjakustannukset + tehtävien arviot.
          </p>
        </section>
      </div>
      <section className="learning-banner">
        <span className="learning-banner-icon">
          <Sparkles size={25} />
        </span>
        <div>
          <span className="eyebrow">OMA QA-HARJOITTELUYMPÄRISTÖSI</span>
          <h2>Rakenna myös omaa osaamistasi.</h2>
          <p>
            Kokeile, riko hallitusti ja testaa. JavaScriptistä AI-avusteiseen
            laadunvarmistukseen.
          </p>
        </div>
        <button className="button dark" onClick={() => onNavigate("learn")}>
          Avaa oppimispolku <ArrowRight size={17} />
        </button>
        <span className="banner-progress">{completed} / 6 osiota</span>
      </section>
      <div className="hint-line">
        <ShieldCheck size={15} />
        <span>
          Kuvitteellinen, Admicom-rooliin valmistautumista tukeva
          harjoitussovellus.
        </span>
        <button
          className="text-button push-right"
          onClick={() => onNavigate("qa")}
        >
          Kokeile QA-labraa <ArrowRight size={14} />
        </button>
      </div>
    </>
  );
}
