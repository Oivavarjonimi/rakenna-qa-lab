import { describe, expect, it } from "vitest";
import {
  addDocumentVersion,
  budgetSummary,
  changeTaskStatus,
  initialState,
  projects,
  runDomainChecks,
  saveTask,
  validateTask,
} from "../../src/domain";

describe("tehtävän validointi", () => {
  it("hylkää pelkän välilyönnin", () => {
    expect(validateTask({ title: "  ", cost: 0, due: "2026-11-07" })).toBe(
      "Tehtävän nimi on pakollinen.",
    );
  });
  it.each([-1, NaN, Infinity])(
    "hylkää virheellisen kustannuksen %s",
    (cost) => {
      expect(
        validateTask({ title: "Katselmus", cost, due: "2026-11-07" }),
      ).toContain("nolla tai positiivinen");
    },
  );
  it("hyväksyy nollakustannuksen", () => {
    expect(
      validateTask({ title: "Katselmus", cost: 0, due: "2026-11-07" }),
    ).toBeNull();
  });
  it.each(["2026-02-29", "2026-02-31", "2026-13-01", "virhe", ""])(
    "hylkää virheellisen päivän %s",
    (due) => {
      expect(validateTask({ title: "Katselmus", cost: 0, due })).toBe(
        "Valitse kelvollinen määräpäivä.",
      );
    },
  );
  it("hyväksyy karkauspäivän karkausvuonna", () => {
    expect(
      validateTask({ title: "Katselmus", cost: 0, due: "2028-02-29" }),
    ).toBeNull();
  });
});

describe("työvaiheiden riippuvuudet", () => {
  it("estää valmistumisen ja jättää alkuperäisen datan muuttumatta", () => {
    const { tasks } = initialState();
    expect(() => changeTaskStatus(tasks, "t4", "done")).toThrow(
      "Edeltävän tehtävän on oltava valmis.",
    );
    expect(tasks.find((t) => t.id === "t4")?.status).toBe("todo");
  });
  it("sallii valmistumisen, kun edeltävä tehtävä on valmis", () => {
    const { tasks } = initialState();
    const first = changeTaskStatus(tasks, "t2", "done");
    const next = changeTaskStatus(first, "t4", "done");
    expect(next.find((t) => t.id === "t4")?.status).toBe("done");
    expect(tasks.find((t) => t.id === "t4")?.status).toBe("todo");
  });
  it("estää edeltäjän avaamisen valmiin jatkotehtävän alta", () => {
    const { tasks } = initialState();
    const updated = changeTaskStatus(
      changeTaskStatus(tasks, "t2", "done"),
      "t4",
      "done",
    );
    expect(() => changeTaskStatus(updated, "t2", "doing")).toThrow(
      "Avaa ensin",
    );
  });
  it("havaitsee välillisen riippuvuuskehän", () => {
    const { tasks } = initialState();
    const candidate = { ...tasks.find((t) => t.id === "t2")!, dependsOn: "t4" };
    expect(() => saveTask(tasks, candidate)).toThrow("kehää");
  });
  it("ei hyväksy toisen projektin tehtävää edeltäjäksi", () => {
    const { tasks } = initialState();
    expect(() => saveTask(tasks, { ...tasks[1], dependsOn: "t10" })).toThrow(
      "samaan projektiin",
    );
  });
  it("siistii nimen tallennuksessa", () => {
    const { tasks } = initialState();
    const next = saveTask(tasks, {
      ...tasks[0],
      title: "  Perustusten tarkastus  ",
    });
    expect(next[0].title).toBe("Perustusten tarkastus");
  });
});

describe("dokumentin versiot ja roolit", () => {
  it("kasvattaa versionumeroa ja säilyttää aiemmat versiot", () => {
    const original = initialState().documents[0];
    const updated = addDocumentVersion(original, "manager", " Ovimitoitus ");
    expect(updated.versions.map((v) => v.version)).toEqual([1, 2, 3, 4]);
    expect(updated.versions.at(-1)?.note).toBe("Ovimitoitus");
    expect(original.versions).toHaveLength(3);
  });
  it("estää lukijan tallennuksen", () => {
    const doc = initialState().documents[0];
    expect(() => addDocumentVersion(doc, "viewer", "Muutos")).toThrow(
      "Lukijalla ei ole oikeutta",
    );
    expect(doc.versions).toHaveLength(3);
  });
  it("hylkää tyhjän muutoskuvauksen", () => {
    expect(() =>
      addDocumentVersion(initialState().documents[0], "manager", "  "),
    ).toThrow("Muutoskuvaus on pakollinen.");
  });
});

describe("budjetin projektirajaus", () => {
  it("sisältää vain valitun projektin kulut", () => {
    const { tasks } = initialState();
    expect(budgetSummary(projects[0], tasks)).toEqual({
      committed: 321000,
      remaining: 159000,
      percent: 67,
    });
  });
  it("näyttää ylityksen negatiivisena jäljellä olevana summana", () => {
    const { tasks } = initialState();
    const next = [...tasks, { ...tasks[0], id: "large", cost: 200000 }];
    expect(budgetSummary(projects[0], next).remaining).toBe(-41000);
  });
});

describe("QA-labran todellinen virheenhavaitseminen", () => {
  it("läpäisee vertailutason", () => {
    expect(runDomainChecks("none").every((r) => r.passed)).toBe(true);
  });
  it.each(["dependency", "version", "permission"] as const)(
    "havaitsee injektoidun virheen: %s",
    (fault) => {
      expect(runDomainChecks(fault).filter((r) => !r.passed)).toHaveLength(1);
    },
  );
});
