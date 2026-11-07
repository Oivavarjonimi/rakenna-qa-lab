import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Check, Copy, X, FileCode2 } from "lucide-react";

export function CodeBlock({
  code,
  file,
  onCopy,
}: {
  code: string;
  file: string;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>
          <FileCode2 size={15} />
          {file}
        </span>
        <button
          className="code-copy"
          onClick={() => onCopy(code)}
          aria-label="Kopioi koodi"
        >
          <Copy size={15} /> Kopioi
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = ref.current;
    node?.showModal();
    return () => {
      node?.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      aria-labelledby="modal-title"
    >
      <div className="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button
          className="icon-button"
          aria-label="Sulje ikkuna"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function Avatar({
  name,
  size = "normal",
}: {
  name: string;
  size?: "small" | "normal";
}) {
  return (
    <span
      title={name}
      className={`avatar ${size === "small" ? "small" : ""} ${name.startsWith("Anna") ? "peach" : name.startsWith("Juha") ? "blue" : ""}`}
    >
      {name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

export function Completed({ done }: { done: boolean }) {
  return (
    <span className={`lesson-check ${done ? "complete" : ""}`}>
      {done ? <Check size={15} /> : null}
    </span>
  );
}

export function BuildingDrawing() {
  return (
    <svg
      className="building-art"
      viewBox="0 0 490 240"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" stroke="#7a9b8b" strokeOpacity=".15" />
        </pattern>
      </defs>
      <rect width="490" height="240" fill="url(#grid)" />
      <g stroke="#c7dacb" strokeWidth="1.2" strokeLinejoin="round">
        <path d="M104 154 247 207 409 122 266 70 104 154Z" fill="#24433a" />
        <path
          d="M151 143V70L253 31 373 75V149L253 195 151 157V143Z"
          fill="#254b3e"
        />
        <path d="M253 31V195M151 70 253 108 373 75M151 92 253 130 373 97M151 114 253 152 373 119M151 136 253 174 373 141" />
        <path
          d="M172 78V163M195 87V173M219 96V182M279 98V184M304 92V175M329 85V165M352 78V156"
          strokeOpacity=".6"
        />
        <path d="M151 70 253 31 373 75 253 115 151 78V70Z" fill="#385c47" />
        <path
          d="M200 65 254 45 324 70 269 91 200 65Z"
          fill="#b9cc8b"
          stroke="#caddaa"
        />
        <path
          d="M120 166V119M120 119 111 126M120 119 129 123M393 144V53M393 53 386 63M393 53 401 57"
          strokeOpacity=".4"
        />
        <path
          d="m86 179 157 58M269 230 438 139"
          strokeDasharray="3 5"
          strokeOpacity=".5"
        />
        <path d="M64 176 88 185M428 118 451 127" strokeOpacity=".7" />
      </g>
      <circle cx="109" cy="178" r="10" fill="#6e9662" />
      <circle cx="397" cy="161" r="13" fill="#6e9662" />
      <path d="M109 178V198M397 161V185" stroke="#c7dacb" />
      <circle cx="415" cy="176" r="8" fill="#8ca572" />
      <path d="M415 176V193" stroke="#c7dacb" />
      <text x="31" y="35" fill="#b4c8b5" fontSize="9" letterSpacing="3">
        ARK / LUONNOS 03
      </text>
      <text x="368" y="220" fill="#b4c8b5" fontSize="9" letterSpacing="2">
        1 : 200
      </text>
    </svg>
  );
}
