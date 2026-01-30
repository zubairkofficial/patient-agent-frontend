import React, { useState } from "react";

export const formatKey = (k: string) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const isPrimitive = (v: unknown): boolean => v === null || ["string", "number", "boolean"].includes(typeof v as string);
const looksLikeIsoDate = (s: string) => {
  // basic ISO date-time detection (e.g., 2023-01-30T12:34:56Z)
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(s);
};

export const RenderValue: React.FC<{ value: unknown; depth?: number }> = ({ value, depth = 0 }) => {
  // Primitive values
  if (isPrimitive(value)) {
    const v = value as string | number | boolean | null;
    // Format dates
    if (typeof v === "string" && looksLikeIsoDate(v)) {
      const d = new Date(v);
      if (!isNaN(d.getTime())) {
        return (
          <div className="rounded-md border p-3 bg-muted/10 text-sm">
            {d.toLocaleString()}
          </div>
        );
      }
    }

    // Long text truncation with toggle
    if (typeof v === "string" && v.length > 240) {
      const [showAll, setShowAll] = useState(false);
      return (
        <div className="rounded-md border p-3 bg-muted/10 text-sm">
          <div className="whitespace-pre-wrap">{showAll ? v : `${v.slice(0, 240)}…`}</div>
          <button
            type="button"
            className="mt-2 text-xs text-primary underline"
            onClick={() => setShowAll((s) => !s)}
          >
            {showAll ? "Show less" : "Show more"}
          </button>
        </div>
      );
    }

    return (
      <div className="rounded-md border p-3 bg-muted/10 text-sm whitespace-pre-wrap">{String(v ?? "—")}</div>
    );
  }

  // Arrays
  if (Array.isArray(value)) {
    return (
      <div className="space-y-3">
        {(value as unknown[]).map((item, idx) => (
          <div key={idx} className="rounded-md border p-3 bg-muted/10">
            <div className="text-xs font-medium text-muted-foreground mb-2">Item {idx + 1}</div>
            <RenderObject obj={item} depth={(depth ?? 0) + 1} />
          </div>
        ))}
      </div>
    );
  }

  // Objects
  return <RenderObject obj={value as Record<string, unknown>} depth={depth} />;
};

export const RenderObject: React.FC<{ obj: any; depth?: number }> = ({ obj, depth = 0 }) => {
  if (obj === null) return <div className="rounded-md border p-3 bg-muted/10 text-sm">null</div>;
  if (typeof obj !== "object") return <div className="rounded-md border p-3 bg-muted/10 text-sm">{String(obj)}</div>;

  const entries = Object.entries(obj);
  const paddingLeft = `${depth * 1}rem`;

  return (
    <div className="grid gap-4">
      {entries.map(([k, v]) => (
        <div key={k} style={{ paddingLeft }}>
          <h4 className={`text-sm font-semibold text-foreground mb-2`}>{formatKey(k)}</h4>
          <RenderValue value={v} depth={(depth ?? 0) + 1} />
        </div>
      ))}
    </div>
  );
};

export const ProfileRenderer: React.FC<{ obj: any }> = ({ obj }) => {
  return <RenderObject obj={obj} depth={0} />;
};

export default ProfileRenderer;
