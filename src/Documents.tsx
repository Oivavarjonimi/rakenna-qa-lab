import { useState } from "react";
import {
  FileText,
  History,
  Plus,
  Eye,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  LockKeyhole,
} from "lucide-react";
import type { ProjectDocument, Role } from "./domain";
import { day } from "./domain";
import { Avatar, Modal } from "./ui";

export default function Documents({
  documents,
  role,
  setRole,
  onAdd,
}: {
  documents: ProjectDocument[];
  role: Role;
  setRole: (r: Role) => void;
  onAdd: (doc: ProjectDocument, note: string) => void;
}) {
  const [versionDoc, setVersionDoc] = useState<ProjectDocument | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const historyDoc = documents.find((d) => d.id === historyId);
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">YHTEINEN TIETO, OIKEA VERSIO</div>
          <h1>Piirustukset järjestyksessä.</h1>
          <p>Katsele suunnitelmia ja kokeile versionhallinnan työnkulkua.</p>
        </div>
        <span className="outlined-pill">
          <ShieldCheck size={15} />
          Versiohistoria käytössä
        </span>
      </div>
      <div className="role-bar">
        <div>
          <span className="soft-icon">
            <LockKeyhole size={19} />
          </span>
          <div>
            <strong>Kenen näkökulmasta testaat?</strong>
            <p>Harjoitusrooli vaikuttaa dokumenttiversion lisäämiseen.</p>
          </div>
        </div>
        <label>
          Harjoitusrooli
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option value="manager">Projektipäällikkö</option>
            <option value="viewer">Lukija</option>
          </select>
        </label>
      </div>
      <div className="document-grid">
        {documents.map((doc) => {
          const latest = doc.versions.at(-1)!;
          return (
            <article
              className="document-card panel"
              key={doc.id}
              data-testid={`document-${doc.id}`}
            >
              <div className="document-top">
                <span className="document-file">
                  <FileText size={25} />
                </span>
                <span className="document-category">{doc.category}</span>
                <span className="version-badge" data-testid="latest-version">
                  v{latest.version}
                </span>
              </div>
              <h2>{doc.title}</h2>
              <p className="document-note">{latest.note}</p>
              <div className="document-author">
                <Avatar name={latest.author} size="small" />
                <span>
                  {latest.author}
                  <small>Päivitetty {day(latest.date)}</small>
                </span>
              </div>
              <div className="document-actions">
                <button
                  className="text-button"
                  onClick={() => setHistoryId(doc.id)}
                >
                  <History size={15} />
                  {doc.versions.length} versiota
                </button>
                <button
                  className="button secondary small-button"
                  onClick={() => setVersionDoc(doc)}
                >
                  <Plus size={15} />
                  Uusi versio
                </button>
              </div>
              <button
                className="document-preview"
                onClick={() => setHistoryId(doc.id)}
              >
                <Eye size={14} />
                Esikatsele ja tutki historiaa
                <ArrowUpRight size={14} />
              </button>
            </article>
          );
        })}
      </div>
      <div className="callout neutral">
        <ShieldCheck size={20} />
        <div>
          <strong>Käyttöoikeudet ovat hyvä negatiivinen testitapaus.</strong>
          <p>
            Lukijakin voi avata versionlisäysikkunan, jotta voit testata
            tallennuksen estymistä. Todellisessa SaaS-palvelussa oikeus
            tarkistetaan myös palvelimella. Tässä harjoitellaan selaimen
            logiikkaa.
          </p>
        </div>
      </div>
      {versionDoc && (
        <VersionDialog
          doc={versionDoc}
          onClose={() => setVersionDoc(null)}
          onSave={(note) => {
            onAdd(versionDoc, note);
            setVersionDoc(null);
          }}
        />
      )}
      {historyDoc && (
        <Modal title={historyDoc.title} onClose={() => setHistoryId(null)}>
          <div className="document-history">
            <div className="preview-sheet">
              <span>{historyDoc.category} / HARJOITUSDOKUMENTTI</span>
              <svg viewBox="0 0 400 200" aria-hidden="true">
                <g fill="none" stroke="#78968b" strokeWidth="3">
                  <path d="M40 30H360V170H40Z M180 30V170 M40 105H180 M180 95H360 M270 95V170" />
                  <path
                    d="M65 30H100 M40 55V80 M215 30H250 M360 50V75 M290 170H325"
                    stroke="#e5eee9"
                    strokeWidth="7"
                  />
                  <path
                    d="M65 30V65H100 M180 65H215V95 M270 130H305V170"
                    strokeWidth="1"
                  />
                </g>
              </svg>
              <p>Havainnollistava piirros · ei rakennuskäyttöön</p>
            </div>
            <h3>Versiohistoria</h3>
            {[...historyDoc.versions].reverse().map((version, i) => (
              <div className="version-row" key={`${version.version}-${i}`}>
                <span
                  className={`version-badge ${i === 0 ? "" : "old-version"}`}
                >
                  v{version.version}
                </span>
                <div>
                  <strong>{version.note}</strong>
                  <p>
                    {version.author} · {day(version.date)}
                  </p>
                </div>
                {i === 0 && <span className="tag">Viimeisin</span>}
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}

function VersionDialog({
  doc,
  onClose,
  onSave,
}: {
  doc: ProjectDocument;
  onClose: () => void;
  onSave: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  return (
    <Modal title="Lisää dokumenttiversio" onClose={onClose}>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            onSave(note);
          } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
          }
        }}
      >
        <p className="form-intro">
          {doc.title}
          <br />
          Nykyinen versio v{doc.versions.at(-1)!.version}. Vanha versio säilyy
          historiassa.
        </p>
        {error && (
          <div role="alert" className="inline-error">
            <AlertCircle size={17} />
            {error}
          </div>
        )}
        <label>
          Muutoskuvaus
          <textarea
            autoFocus
            rows={4}
            placeholder="Mitä tässä versiossa muuttuu?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <p className="form-note">
          Harjoituksessa tallennetaan version tiedot. Varsinaisia tiedostoja ei
          ladata palvelimelle.
        </p>
        <div className="form-footer">
          <button type="button" className="button secondary" onClick={onClose}>
            Peruuta
          </button>
          <button className="button primary" type="submit">
            Lisää versio
          </button>
        </div>
      </form>
    </Modal>
  );
}
