import { useState, type PropsWithChildren } from 'react';
import { Menu, X } from 'lucide-react';


export function Sidebar({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botão que só aparece em telas pequenas, fixo no canto */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="fixed left-3 top-3 z-40 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground md:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Overlay escuro atrás do menu — só em mobile, só quando aberto */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Menu lateral em si */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex flex-wrap flex-col gap-4 w-64 flex-col border-e border-border bg-background transition-transform duration-200 md:sticky md:h-screen md:w-auto md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Botão de fechar — só em mobile, dentro do próprio menu */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
          className="ml-auto mr-3 mt-3 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground md:hidden"
        >
          <X size={18} />
        </button>

        {/* Conteúdo do menu (itens de navegação) — passado de fora */}
        <div
          className="flex flex-1 flex-col  gap-2 p-4"
          onClick={() => setOpen(false)} // fecha ao clicar em qualquer item, só relevante em mobile
        >
          {children}
        </div>
      </aside>
    </>
  );
}