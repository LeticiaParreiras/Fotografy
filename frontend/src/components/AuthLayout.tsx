import type { ReactNode } from 'react';

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}


export function AuthLayout({ eyebrow, title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex">
      {/* Painel esquerdo — visível a partir de telas médias */}
      <div className="hidden lg:flex lg:w-[42%] border-border relative border-r p-12 flex-col justify-between overflow-hidden">

        <div className="relative z-10">
          <span className=" text-xs tracking-[0.2em] text-primary uppercase">
            Fotografy
          </span>
        </div>

        <div className="relative z-10 space-y-3">
          <p className="text-2xl font-medium leading-snug max-w-sm">
            Cada imagem carrega uma história. Guarde e compartilhe as suas.
          </p>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <span className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
              {eyebrow}
            </span>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="mt-2 text-sm text-neutral-400">{subtitle}</p>
          </div>

          {children}

          <div className="mt-8 text-sm text-neutral-500 text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}