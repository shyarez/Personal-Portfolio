"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Archive, Inbox, Mail, Reply, Search } from "lucide-react";
import { toast, Toaster } from "sonner";
import type { EnquiryStatus } from "@/lib/validation/contact";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
  updated_at: string;
};

const TABS: { value: EnquiryStatus; label: string; icon: typeof Inbox }[] = [
  { value: "new", label: "New", icon: Inbox },
  { value: "replied", label: "Replied", icon: Reply },
  { value: "archived", label: "Archived", icon: Archive },
];

const badgeFor: Record<EnquiryStatus, "momo" | "aura" | "default"> = {
  new: "momo",
  replied: "aura",
  archived: "default",
};

const fmt = (iso: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

export function Dashboard({ initial }: { initial: Enquiry[] }) {
  const [items, setItems] = useState(initial);
  const [tab, setTab] = useState<EnquiryStatus>("new");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initial.find((e) => e.status === "new")?.id ?? null);
  const [pending, setPending] = useState<string | null>(null);

  const counts = useMemo(
    () =>
      items.reduce(
        (acc, e) => ({ ...acc, [e.status]: acc[e.status] + 1 }),
        { new: 0, replied: 0, archived: 0 } as Record<EnquiryStatus, number>
      ),
    [items]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (e) =>
        e.status === tab &&
        (!q || [e.name, e.email, e.subject, e.message].some((f) => f.toLowerCase().includes(q)))
    );
  }, [items, tab, query]);

  const selected = items.find((e) => e.id === selectedId) ?? null;

  const setStatus = async (id: string, status: EnquiryStatus) => {
    const prev = items;
    setPending(id);
    setItems((list) => list.map((e) => (e.id === id ? { ...e, status } : e))); // optimistic
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Update failed");
      toast.success(`Moved to ${status}`);
    } catch (e) {
      setItems(prev);
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setPending(null);
    }
  };

  return (
    <>
      <Toaster theme="dark" position="bottom-right" richColors />
      <div className="mb-6 grid grid-cols-3 gap-3 md:max-w-xl">
        {TABS.map((t) => (
          <div key={t.value} className="rounded-2xl border border-white/10 bg-ink-2 p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{t.label}</p>
            <p className={cn("mt-1 font-display text-3xl", t.value === "new" && "text-momo")}>{counts[t.value]}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as EnquiryStatus)}>
          <TabsList>
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                <t.icon className="size-4" /> {t.label}
                <span className="rounded-full bg-black/20 px-1.5 text-[10px]">{counts[t.value]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search enquiries…" className="h-10 pl-9" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* List */}
        <ul className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {visible.length === 0 && (
              <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-muted">
                Nothing here.
              </motion.li>
            )}
            {visible.map((e) => (
              <motion.li
                key={e.id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, height: 0 }}
              >
                <button
                  onClick={() => setSelectedId(e.id)}
                  className={cn(
                    "w-full rounded-2xl border-2 p-4 text-left transition-colors",
                    selectedId === e.id ? "border-momo bg-momo/10" : "border-white/5 bg-ink-2 hover:border-white/20"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold">{e.name}</span>
                    <span className="shrink-0 font-mono text-[10px] text-muted">{fmt(e.created_at)}</span>
                  </div>
                  <p className="mt-1 truncate text-sm">{e.subject}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted">{e.message}</p>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Detail */}
        <div className="min-h-[50vh] rounded-3xl border-2 border-white/10 bg-ink-2 p-6 md:p-8">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.article key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Badge variant={badgeFor[selected.status]}>{selected.status}</Badge>
                    <h2 className="mt-3 font-display text-2xl md:text-3xl">{selected.subject}</h2>
                    <p className="mt-2 text-sm text-muted">
                      {selected.name} ·{" "}
                      <a className="text-aura hover:underline" href={`mailto:${selected.email}`}>
                        {selected.email}
                      </a>{" "}
                      · {fmt(selected.created_at)}
                    </p>
                  </div>
                </div>
                <div className="mt-6 whitespace-pre-wrap rounded-2xl bg-ink p-5 leading-relaxed text-foreground/85">{selected.message}</div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <a href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}>
                      <Mail /> Reply by email
                    </a>
                  </Button>
                  {TABS.filter((t) => t.value !== selected.status).map((t) => (
                    <Button
                      key={t.value}
                      size="sm"
                      variant="outline"
                      disabled={pending === selected.id}
                      onClick={() => setStatus(selected.id, t.value)}
                    >
                      <t.icon /> Mark {t.label.toLowerCase()}
                    </Button>
                  ))}
                </div>
              </motion.article>
            ) : (
              <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid h-full min-h-[40vh] place-items-center text-sm text-muted">
                Select an enquiry to read it.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
