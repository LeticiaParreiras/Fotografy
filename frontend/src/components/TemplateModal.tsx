import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "../shared/Button";

interface ModalShellProps {
  title: string;
  visible: boolean;
  onClose: () => void;
  onExited: () => void;
  children: ReactNode;
}

/**
 * Estrutura visual compartilhada por todos os modais do app.
 * nice-modal-react só gerencia ESTADO (visível/escondido, resolve/reject) */
export function ModalShell({
  title,
  visible,
  onClose,
  onExited,
  children,
}: ModalShellProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-150 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onTransitionEnd={() => {
        if (!visible) onExited();
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative w-full max-w-md rounded-xl border border-border bg-background shadow-2xl transition-all duration-150 ${
          visible ? "translate-y-0 scale-100" : "translate-y-2 scale-95"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="modal-title" className="text-base font-semibold ">
            {title}
          </h2>
          <Button
            variant="ghost"
            type="button"
            icon={X}
            onClick={onClose}
            className=" hover:bg-foreground hover:text-background"
            aria-label="Fechar"
          />
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
