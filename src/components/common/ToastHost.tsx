import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/store/useStore";

export function ToastHost() {
  const toasts = useToast((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed right-4 bottom-24 z-[100] flex flex-col items-end gap-2 sm:right-6" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="pointer-events-auto flex max-w-xs items-center gap-2.5 rounded-md border border-gold/40 bg-burgundy-dark px-4 py-3 text-sm text-ivory shadow-lift"
          >
            <CheckCircle2 size={18} className="shrink-0 text-gold-light" />
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
