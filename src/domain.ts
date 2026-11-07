/** Liiketoimintasäännöt ovat erillään Reactista, jotta niitä voi testata suoraan. */
export type TaskStatus = "todo" | "doing" | "done";
export type Priority = "low" | "medium" | "high";
export type Role = "manager" | "viewer";
export type Fault = "none" | "dependency" | "version" | "permission";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignee: string;
  due: string;
  status: TaskStatus;
  priority: Priority;
  cost: number;
  dependsOn: string | null;
}
export interface Project {
  id: string;
  name: string;
  address: string;
  category: string;
  budget: number;
  baseCost: number;
  start: string;
  end: string;
  code: string;
}
export interface DocumentVersion {
  version: number;
  note: string;
  date: string;
  author: string;
}
export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  category: string;
  versions: DocumentVersion[];
}
export interface DemoState {
  schema: 1;
  tasks: Task[];
  documents: ProjectDocument[];
  completedLessons: string[];
}

export const DEMO_DAY = "2026-11-07";
export const STORE_KEY = "rakenna-qa-lab-v1";
export const statuses: { id: TaskStatus; label: string }[] = [
  { id: "todo", label: "Suunnitteilla" },
  { id: "doing", label: "Työn alla" },
  { id: "done", label: "Valmis" },
];
export const priorities: Record<Priority, string> = {
  low: "Matala",
  medium: "Normaali",
  high: "Korkea",
};
export const projects: Project[] = [
  {
    id: "p1",
    name: "As Oy Päijänteenranta",
    address: "Satamatie 12, Jyväskylä",
    category: "Uudisrakentaminen",
    budget: 480000,
    baseCost: 212400,
    start: "2026-09-01",
    end: "2027-03-31",
    code: "PRJ–2026–041",
  },
  {
    id: "p2",
    name: "Muuramen koulukeskus",
    address: "Koulutie 4, Muurame",
    category: "Peruskorjaus",
    budget: 320000,
    baseCost: 154000,
    start: "2026-08-15",
    end: "2027-02-28",
    code: "PRJ–2026–038",
  },
  {
    id: "p3",
    name: "Jämsän toimistotalo",
    address: "Keskuskatu 8, Jämsä",
    category: "Toimitilarakentaminen",
    budget: 650000,
    baseCost: 315000,
    start: "2026-10-01",
    end: "2027-06-30",
    code: "PRJ–2026–052",
  },
];

const task = (
  id: string,
  title: string,
  status: TaskStatus,
  priority: Priority,
  due: string,
  assignee: string,
  cost: number,
  dependsOn: string | null = null,
  projectId = "p1",
): Task => ({
  id,
  projectId,
  title,
  status,
  priority,
  due,
  assignee,
  cost,
  dependsOn,
  description:
    "Varmista työn laatu, kirjaa havainnot ja sovi hyväksynnästä vastuuhenkilön kanssa.",
});
export function initialState(): DemoState {
  return {
    schema: 1,
    tasks: [
      task(
        "t1",
        "Perustusten tarkastus",
        "done",
        "high",
        "2026-10-28",
        "Mikko Virtanen",
        12400,
      ),
      task(
        "t2",
        "Runkotyön laadunvarmistus",
        "doing",
        "high",
        "2026-11-12",
        "Anna Korhonen",
        18600,
        "t1",
      ),
      task(
        "t3",
        "LVI-suunnitelmien hyväksyntä",
        "doing",
        "high",
        "2026-11-06",
        "Juha Laine",
        7200,
      ),
      task(
        "t4",
        "Julkisivumateriaalien tilaus",
        "todo",
        "medium",
        "2026-11-18",
        "Anna Korhonen",
        34200,
        "t2",
      ),
      task(
        "t5",
        "Työmaan turvallisuuskierros",
        "done",
        "medium",
        "2026-11-05",
        "Mikko Virtanen",
        1800,
      ),
      task(
        "t6",
        "Sähköasennusten aloituspalaveri",
        "todo",
        "medium",
        "2026-11-20",
        "Juha Laine",
        2400,
        "t3",
      ),
      task(
        "t7",
        "Viikkoraportin kokoaminen",
        "doing",
        "low",
        "2026-11-10",
        "Anna Korhonen",
        800,
      ),
      task(
        "t8",
        "Ikkunatoimituksen vastaanotto",
        "todo",
        "medium",
        "2026-11-25",
        "Mikko Virtanen",
        28000,
      ),
      task(
        "t9",
        "Kosteusmittausten dokumentointi",
        "todo",
        "high",
        "2026-11-15",
        "Juha Laine",
        3200,
        "t2",
      ),
      task(
        "t10",
        "Purkutyön vastaanottotarkastus",
        "done",
        "high",
        "2026-10-20",
        "Mikko Virtanen",
        22000,
        null,
        "p2",
      ),
      task(
        "t11",
        "Ilmanvaihdon tarkastus",
        "doing",
        "high",
        "2026-11-05",
        "Juha Laine",
        14000,
        "t10",
        "p2",
      ),
      task(
        "t12",
        "Pintamateriaalien hyväksyntä",
        "todo",
        "medium",
        "2026-11-22",
        "Anna Korhonen",
        18500,
        "t11",
        "p2",
      ),
      task(
        "t13",
        "Rakennusluvan katselmointi",
        "done",
        "high",
        "2026-10-24",
        "Anna Korhonen",
        6500,
        null,
        "p3",
      ),
      task(
        "t14",
        "Pohjatutkimusten tarkastus",
        "doing",
        "high",
        "2026-11-13",
        "Mikko Virtanen",
        18600,
        "t13",
        "p3",
      ),
      task(
        "t15",
        "Runkourakan kilpailutus",
        "todo",
        "medium",
        "2026-11-28",
        "Juha Laine",
        42000,
        "t14",
        "p3",
      ),
    ],
    documents: [
      {
        id: "d1",
        projectId: "p1",
        title: "Pohjapiirustus, 1. kerros",
        category: "ARK",
        versions: [
          {
            version: 1,
            note: "Alkuperäinen suunnitelma",
            date: "2026-09-12",
            author: "Anna Korhonen",
          },
          {
            version: 2,
            note: "Huonejaon tarkennukset",
            date: "2026-10-15",
            author: "Anna Korhonen",
          },
          {
            version: 3,
            note: "Oviaukkojen mitoitus päivitetty",
            date: "2026-11-05",
            author: "Anna Korhonen",
          },
        ],
      },
      {
        id: "d2",
        projectId: "p1",
        title: "LVI-suunnitelma",
        category: "LVI",
        versions: [
          {
            version: 1,
            note: "Tarkastettavaksi",
            date: "2026-11-03",
            author: "Juha Laine",
          },
        ],
      },
      {
        id: "d3",
        projectId: "p1",
        title: "Työturvallisuussuunnitelma",
        category: "TUR",
        versions: [
          {
            version: 1,
            note: "Hyväksytty työmaakäyttöön",
            date: "2026-10-20",
            author: "Mikko Virtanen",
          },
        ],
      },
      {
        id: "d4",
        projectId: "p2",
        title: "Koulun pohjapiirustus",
        category: "ARK",
        versions: [
          {
            version: 1,
            note: "Lähtötiedot",
            date: "2026-09-01",
            author: "Anna Korhonen",
          },
        ],
      },
      {
        id: "d5",
        projectId: "p3",
        title: "Asemapiirustus",
        category: "ARK",
        versions: [
          {
            version: 1,
            note: "Lupakuva",
            date: "2026-10-22",
            author: "Anna Korhonen",
          },
        ],
      },
    ],
    completedLessons: [],
  };
}

/** String.trim() estää tyhjän tehtävän, Number.isFinite() myös NaN- ja Infinity-arvot. */
export function validateTask(
  input: Pick<Task, "title" | "cost" | "due">,
): string | null {
  if (!input.title.trim()) return "Tehtävän nimi on pakollinen.";
  if (input.title.trim().length > 120)
    return "Tehtävän nimi saa olla enintään 120 merkkiä.";
  if (!Number.isFinite(input.cost) || input.cost < 0)
    return "Kustannusarvion on oltava nolla tai positiivinen luku.";
  const parsedDate = new Date(input.due + "T12:00:00Z");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(input.due) ||
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== input.due
  )
    return "Valitse kelvollinen määräpäivä.";
  return null;
}

export function changeTaskStatus(
  tasks: Task[],
  id: string,
  status: TaskStatus,
  fault: Fault = "none",
): Task[] {
  const current = tasks.find((t) => t.id === id);
  if (!current) throw new Error("Tehtävää ei löytynyt.");
  if (status === "done" && current.dependsOn && fault !== "dependency") {
    const prerequisite = tasks.find(
      (t) => t.id === current.dependsOn && t.projectId === current.projectId,
    );
    if (!prerequisite || prerequisite.status !== "done")
      throw new Error("Edeltävän tehtävän on oltava valmis.");
  }
  // Myös jo valmistuneen edeltäjän avaaminen estetään, jos jatkotehtävä on valmis.
  if (
    status !== "done" &&
    current.status === "done" &&
    tasks.some((t) => t.dependsOn === id && t.status === "done")
  ) {
    throw new Error("Avaa ensin tästä riippuva valmis tehtävä.");
  }
  return tasks.map((t) => (t.id === id ? { ...t, status } : t));
}

export function saveTask(tasks: Task[], candidate: Task): Task[] {
  const error = validateTask(candidate);
  if (error) throw new Error(error);
  const visited = new Set([candidate.id]);
  let parentId = candidate.dependsOn;
  while (parentId) {
    if (visited.has(parentId))
      throw new Error("Tehtäväriippuvuus ei saa muodostaa kehää.");
    visited.add(parentId);
    const parent = tasks.find(
      (t) => t.id === parentId && t.projectId === candidate.projectId,
    );
    if (!parent)
      throw new Error("Edeltävän tehtävän on kuuluttava samaan projektiin.");
    parentId = parent.dependsOn;
  }
  if (
    candidate.status === "done" &&
    candidate.dependsOn &&
    tasks.find((t) => t.id === candidate.dependsOn)?.status !== "done"
  )
    throw new Error("Edeltävän tehtävän on oltava valmis.");
  const clean = { ...candidate, title: candidate.title.trim() };
  return tasks.some((t) => t.id === candidate.id)
    ? tasks.map((t) => (t.id === candidate.id ? clean : t))
    : [...tasks, clean];
}

export function addDocumentVersion(
  doc: ProjectDocument,
  role: Role,
  note: string,
  fault: Fault = "none",
): ProjectDocument {
  if (role !== "manager" && fault !== "permission")
    throw new Error("Lukijalla ei ole oikeutta lisätä versiota.");
  if (!note.trim()) throw new Error("Muutoskuvaus on pakollinen.");
  const latest = Math.max(...doc.versions.map((v) => v.version), 0);
  return {
    ...doc,
    versions: [
      ...doc.versions,
      {
        version: fault === "version" ? latest : latest + 1,
        note: note.trim(),
        date: DEMO_DAY,
        author:
          role === "manager" ? "Kimmo Lepoaho" : "Lukija (harjoitusrooli)",
      },
    ],
  };
}

export function budgetSummary(project: Project, tasks: Task[]) {
  const taskCost = tasks
    .filter((t) => t.projectId === project.id)
    .reduce((total, t) => total + t.cost, 0);
  const committed = project.baseCost + taskCost;
  return {
    committed,
    remaining: project.budget - committed,
    percent: Math.round((committed / project.budget) * 100),
  };
}

export interface CheckResult {
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
}
/** Nämä tarkistukset suorittavat samoja funktioita kuin käyttöliittymä. Eivät ole selain-E2E-testejä. */
export function runDomainChecks(fault: Fault): CheckResult[] {
  const data = initialState();
  const results: CheckResult[] = [];
  const check = (name: string, expected: string, fn: () => string) => {
    let actual: string;
    try {
      actual = fn();
    } catch (e) {
      actual = e instanceof Error ? e.message : String(e);
    }
    results.push({ name, expected, actual, passed: actual === expected });
  };
  check(
    "Tyhjä nimi hylätään",
    "Tehtävän nimi on pakollinen.",
    () => validateTask({ title: "  ", cost: 0, due: DEMO_DAY }) ?? "Hyväksytty",
  );
  check(
    "Negatiivinen kustannus hylätään",
    "Kustannusarvion on oltava nolla tai positiivinen luku.",
    () =>
      validateTask({ title: "Tarkastus", cost: -1, due: DEMO_DAY }) ??
      "Hyväksytty",
  );
  check(
    "Keskeneräinen riippuvuus estää valmistumisen",
    "Edeltävän tehtävän on oltava valmis.",
    () => {
      changeTaskStatus(data.tasks, "t4", "done", fault);
      return "Tehtävä hyväksyttiin valmiiksi";
    },
  );
  check("Dokumentin versionumero kasvaa", "4", () =>
    String(
      addDocumentVersion(
        data.documents[0],
        "manager",
        "Uusi versio",
        fault,
      ).versions.at(-1)!.version,
    ),
  );
  check(
    "Lukijan muokkaus estetään",
    "Lukijalla ei ole oikeutta lisätä versiota.",
    () => {
      addDocumentVersion(data.documents[0], "viewer", "Luvaton muutos", fault);
      return "Versio lisättiin";
    },
  );
  check("Budjetti sisältää vain valitun projektin kulut", "321000", () =>
    String(budgetSummary(projects[0], data.tasks).committed),
  );
  return results;
}

export function euro(value: number) {
  return new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
export function day(value: string) {
  return new Intl.DateTimeFormat("fi-FI", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(value + "T12:00:00"));
}

/** localStorage on harjoituksen tallennus, ei palvelimen käyttöoikeusraja. */
export function readState(): DemoState {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORE_KEY) ?? "null");
    if (
      raw &&
      typeof raw === "object" &&
      "schema" in raw &&
      raw.schema === 1 &&
      "tasks" in raw &&
      Array.isArray(raw.tasks) &&
      "documents" in raw &&
      Array.isArray(raw.documents) &&
      "completedLessons" in raw &&
      Array.isArray(raw.completedLessons)
    )
      return raw as DemoState;
  } catch {
    /* Käytetään demoa, jos selaimen tallennus ei ole käytettävissä. */
  }
  return initialState();
}
