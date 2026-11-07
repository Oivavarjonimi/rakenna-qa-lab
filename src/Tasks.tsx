import { useState } from "react";
import {
  Plus,
  Search,
  CalendarDays,
  ArrowUpRight,
  Link2,
  LayoutGrid,
  List,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import type { Task, TaskStatus, Priority, Project } from "./domain";
import { statuses, priorities, day, DEMO_DAY, euro } from "./domain";
import { Avatar, Modal } from "./ui";

interface Props {
  tasks: Task[];
  project: Project;
  onStatus: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task | null) => void;
}

export default function Tasks({ tasks, project, onStatus, onEdit }: Props) {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const [view, setView] = useState<"board" | "list">("board");
  const visible = tasks.filter(
    (t) =>
      t.title.toLocaleLowerCase("fi").includes(query.toLocaleLowerCase("fi")) &&
      (priority === "all" || t.priority === priority),
  );
  const renderTask = (t: Task) => (
    <article
      className={`task-card ${view === "list" ? "task-row" : ""}`}
      key={t.id}
      data-testid={`task-${t.id}`}
    >
      <div className="task-card-top">
        <span className={`priority priority-${t.priority}`}>
          <i />
          {priorities[t.priority]}
        </span>
        <button
          className="icon-button"
          aria-label={`Muokkaa: ${t.title}`}
          onClick={() => onEdit(t)}
        >
          <ArrowUpRight size={17} />
        </button>
      </div>
      <h3>{t.title}</h3>
      {t.dependsOn && (
        <p className="dependency">
          <Link2 size={12} />
          {tasks.find((p) => p.id === t.dependsOn)?.title ?? "Edeltävä tehtävä"}
        </p>
      )}
      <div className="task-meta">
        <span
          className={t.due < DEMO_DAY && t.status !== "done" ? "overdue" : ""}
        >
          <CalendarDays size={13} />
          {day(t.due)}
        </span>
        <Avatar name={t.assignee} size="small" />
      </div>
      <label className="sr-only" htmlFor={`status-${t.id}`}>
        Tila: {t.title}
      </label>
      <select
        id={`status-${t.id}`}
        value={t.status}
        onChange={(e) => onStatus(t.id, e.target.value as TaskStatus)}
        className="task-status-select"
      >
        {statuses.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </article>
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">PROJEKTIN TYÖVAIHEET</div>
          <h1>Suunnitelmasta valmiiksi.</h1>
          <p>Selkeä vastuu, seuraava askel ja yhteinen tilannekuva.</p>
        </div>
        <button className="button primary" onClick={() => onEdit(null)}>
          <Plus size={18} />
          Uusi tehtävä
        </button>
      </div>
      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            aria-label="Etsi tehtäviä"
            placeholder="Etsi tehtäviä…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="toolbar-right">
          <div className="select-filter">
            <SlidersHorizontal size={16} />
            <select
              aria-label="Suodata prioriteetin mukaan"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="all">Kaikki prioriteetit</option>
              <option value="high">Korkea</option>
              <option value="medium">Normaali</option>
              <option value="low">Matala</option>
            </select>
          </div>
          <div className="view-switch">
            <button
              aria-label="Taulunäkymä"
              aria-pressed={view === "board"}
              className={view === "board" ? "selected" : ""}
              onClick={() => setView("board")}
            >
              <LayoutGrid size={17} />
            </button>
            <button
              aria-label="Listanäkymä"
              aria-pressed={view === "list"}
              className={view === "list" ? "selected" : ""}
              onClick={() => setView("list")}
            >
              <List size={17} />
            </button>
          </div>
        </div>
      </div>
      {visible.length === 0 ? (
        <div className="empty-state">
          <Search size={28} />
          <h3>Tehtäviä ei löytynyt</h3>
          <p>Kokeile toista hakusanaa tai poista prioriteettisuodatin.</p>
          <button
            className="button secondary"
            onClick={() => {
              setQuery("");
              setPriority("all");
            }}
          >
            Tyhjennä suodattimet
          </button>
        </div>
      ) : (
        <div className={view === "board" ? "kanban" : "task-list"}>
          {statuses.map((s) => (
            <section key={s.id} className={`kanban-column column-${s.id}`}>
              <div className="column-heading">
                <span>
                  <i />
                  {s.label}{" "}
                  <b>{visible.filter((t) => t.status === s.id).length}</b>
                </span>
                {s.id === "todo" && (
                  <button
                    className="icon-button"
                    aria-label="Lisää tehtävä"
                    onClick={() => onEdit(null)}
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
              <div className="task-stack">
                {visible.filter((t) => t.status === s.id).map(renderTask)}
                {!visible.some((t) => t.status === s.id) && (
                  <p className="column-empty">Ei tehtäviä tässä vaiheessa.</p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
      <div className="hint-line">
        <Link2 size={15} />
        <span>
          Riippuvuus suojaa työjärjestystä. Edeltävän tehtävän täytyy valmistua
          ensin.
        </span>
        <span className="push-right">
          {project.code} · {tasks.length} tehtävää
        </span>
      </div>
    </>
  );
}

export function TaskDialog({
  task,
  project,
  tasks,
  onSave,
  onClose,
}: {
  task: Task | null;
  project: Project;
  tasks: Task[];
  onSave: (t: Task) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [assignee, setAssignee] = useState(task?.assignee ?? "Kimmo Lepoaho");
  const [due, setDue] = useState(task?.due ?? "2026-11-20");
  const [priority, setPriority] = useState<Priority>(
    task?.priority ?? "medium",
  );
  const [cost, setCost] = useState(String(task?.cost ?? 0));
  const [dependsOn, setDependsOn] = useState(task?.dependsOn ?? "");
  const [error, setError] = useState("");
  return (
    <Modal title={task ? "Muokkaa tehtävää" : "Uusi tehtävä"} onClose={onClose}>
      <form
        className="form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const id =
            task?.id ??
            (typeof crypto.randomUUID === "function"
              ? crypto.randomUUID()
              : `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`);
          try {
            onSave({
              id,
              projectId: project.id,
              title,
              description,
              assignee,
              due,
              priority,
              cost: cost.trim() === "" ? NaN : Number(cost),
              dependsOn: dependsOn || null,
              status: task?.status ?? "todo",
            });
          } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
          }
        }}
      >
        <p className="form-intro">
          {project.name} ·{" "}
          {task
            ? "Päivitä tehtävän tiedot."
            : "Uusi tehtävä lisätään suunnitteilla-vaiheeseen."}
        </p>
        {error && (
          <div className="inline-error" role="alert">
            <AlertCircle size={17} />
            {error}
          </div>
        )}
        <label>
          Tehtävän nimi
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Esim. Rakenteiden katselmointi"
            maxLength={121}
          />
        </label>
        <label>
          Kuvaus
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mitä tehdään ja miten valmistuminen varmistetaan?"
          />
        </label>
        <div className="form-grid">
          <label>
            Vastuuhenkilö
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              {[
                "Kimmo Lepoaho",
                "Anna Korhonen",
                "Mikko Virtanen",
                "Juha Laine",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Määräpäivä
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />
          </label>
        </div>
        <div className="form-grid">
          <label>
            Prioriteetti
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              {Object.entries(priorities).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Kustannusarvio (€)
            <input
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </label>
        </div>
        <label>
          Edeltävä tehtävä
          <select
            value={dependsOn}
            onChange={(e) => setDependsOn(e.target.value)}
          >
            <option value="">Ei riippuvuutta</option>
            {tasks
              .filter((t) => t.id !== task?.id)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
          </select>
        </label>
        <div className="form-footer">
          <span>Budjetti {euro(project.budget)}</span>
          <button type="button" className="button secondary" onClick={onClose}>
            Peruuta
          </button>
          <button type="submit" className="button primary">
            Tallenna tehtävä
          </button>
        </div>
      </form>
    </Modal>
  );
}
