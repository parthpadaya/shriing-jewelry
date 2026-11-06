import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Modal } from "@/components/common/Modal";
import { useMockCollection } from "@/hooks";
import { toast } from "@/store/useStore";
import { uid } from "@/utils/format";
import { cn } from "@/utils/cn";

export type Row = { id: string } & Record<string, string | number | boolean>;
export interface Col { key: string; label: string; render?: (r: Row) => ReactNode; options?: string[]; align?: "right" }
export interface FieldDef { key: string; label: string; type?: "text" | "number" | "select" | "textarea" | "date"; options?: string[] }

const tone = (v: string) =>
  /^(active|published|live|approved|delivered|completed|shipped|in stock|ready to ship)$/i.test(v) ? "bg-emerald-50 text-emerald-700"
  : /^(pending|draft|in review|placed|on leave|design approved|low stock)$/i.test(v) ? "bg-amber-50 text-amber-700"
  : /^(rejected|blocked|expired|cancelled|hidden|out of stock)$/i.test(v) ? "bg-red-50 text-red-700"
  : "bg-champagne text-burgundy";

export const StatusPill = ({ v }: { v: string }) => <span className={cn("inline-block rounded-full px-2.5 py-1 text-[11px] font-medium", tone(v))}>{v}</span>;

export function ManageTable({ title, storageKey, seed, columns, fields, blank, searchKeys, idPrefix = "ID", canAdd = true, canDelete = true, addLabel, summary, rowActions }: {
  title: string; storageKey: string; seed: Row[]; columns: Col[]; fields: FieldDef[]; blank: Omit<Row, "id">; searchKeys: string[]; idPrefix?: string; canAdd?: boolean; canDelete?: boolean; addLabel?: string; summary?: (rows: Row[]) => ReactNode; rowActions?: (r: Row, update: (patch: Partial<Row>) => void) => ReactNode;
}) {
  const { items, add, update, remove } = useMockCollection<Row>(storageKey, seed);
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [page, setPage] = useState(0);
  const per = 10;
  const rows = useMemo(() => items.filter((r) => !q || searchKeys.some((k) => String(r[k]).toLowerCase().includes(q.toLowerCase()))), [items, q, searchKeys]);
  const pages = Math.max(1, Math.ceil(rows.length / per));
  const shown = rows.slice(page * per, page * per + per);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    if (isNew) { add(edit); toast(`${title.replace(/^Manage /, "")} added`); } else { update(edit.id, edit); toast("Changes saved"); }
    setEdit(null);
  };

  return (
    <div>
      {summary?.(items)}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand p-4">
          <div className="relative w-full sm:w-72"><Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" /><input className="input pl-9" placeholder="Search…" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} aria-label="Search" /></div>
          {canAdd && <button className="btn btn-primary btn-sm" onClick={() => { setIsNew(true); setEdit({ id: uid(idPrefix), ...blank }); }}><Plus size={14} /> {addLabel ?? "Add new"}</button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-champagne/50"><tr>{columns.map((c) => (<th key={c.key} className={cn("th", c.align === "right" && "text-right")}>{c.label}</th>))}<th className="th text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-sand/70">
              {shown.map((r) => (
                <tr key={r.id} className="hover:bg-champagne/30">
                  {columns.map((c) => (
                    <td key={c.key} className={cn("td", c.align === "right" && "text-right")}>
                      {c.options ? <select value={String(r[c.key])} onChange={(e) => { update(r.id, { [c.key]: e.target.value }); toast(`${c.label} updated to “${e.target.value}”`); }} className={cn("cursor-pointer rounded-full border-0 px-2.5 py-1 text-[11px] font-medium outline-none", tone(String(r[c.key])))} aria-label={c.label}>{Array.from(new Set([...c.options, String(r[c.key])])).map((o) => (<option key={o}>{o}</option>))}</select> : c.render ? c.render(r) : String(r[c.key] ?? "")}
                    </td>
                  ))}
                  <td className="td text-right whitespace-nowrap">
                    {rowActions?.(r, (p) => update(r.id, p))}
                    <button aria-label="Edit" className="rounded p-1.5 text-muted hover:bg-champagne hover:text-burgundy" onClick={() => { setIsNew(false); setEdit({ ...r }); }}><Pencil size={15} /></button>
                    {canDelete && <button aria-label="Delete" className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-700" onClick={() => { remove(r.id); toast("Deleted"); }}><Trash2 size={15} /></button>}
                  </td>
                </tr>
              ))}
              {shown.length === 0 && <tr><td colSpan={columns.length + 1} className="px-4 py-12 text-center text-sm text-muted">No records found.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-sand p-3 text-xs text-muted"><span>{rows.length} records</span><div className="flex items-center gap-2"><button disabled={page === 0} onClick={() => setPage(page - 1)} className="btn btn-ghost btn-sm">Prev</button><span>{page + 1} / {pages}</span><button disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className="btn btn-ghost btn-sm">Next</button></div></div>
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={isNew ? `Add — ${title}` : `Edit — ${title}`}>
        {edit && (
          <form onSubmit={save} className="grid gap-4 p-6 sm:grid-cols-2">
            {fields.map((f) => (
              <label key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}><span className="label">{f.label}</span>
                {f.type === "select" ? <select className="input" value={String(edit[f.key] ?? "")} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })}>{f.options?.map((o) => (<option key={o}>{o}</option>))}</select>
                  : f.type === "textarea" ? <textarea className="input min-h-24" value={String(edit[f.key] ?? "")} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })} />
                  : <input required className="input" type={f.type ?? "text"} value={String(edit[f.key] ?? "")} onChange={(e) => setEdit({ ...edit, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })} />}
              </label>
            ))}
            <div className="flex gap-3 sm:col-span-2"><button className="btn btn-primary">Save</button><button type="button" className="btn btn-outline" onClick={() => setEdit(null)}>Cancel</button></div>
          </form>
        )}
      </Modal>
    </div>
  );
}
