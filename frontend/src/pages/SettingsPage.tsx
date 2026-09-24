import { useState } from 'react';
import { Lock } from 'lucide-react';
import FormChangePassword from '../components/FormChangePassword';
import { Button } from '../shared/Button';
import { Header } from '../components/Header';

const listSettings = [
  { id: 'change-password', name: 'Trocar Senha', icon: Lock, component: FormChangePassword },
];

export function SettingsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = listSettings.find((item) => item.id === selectedId);
  const SelectedComponent = selected?.component;

  return (
    <main className="h-screen">
      <Header title="Configuração" />

      <div className="flex h-[90%] flex-col gap-2 p-4 md:m-auto md:flex-row md:p-6">
        <div className="flex w-full flex-col md:w-[50%]">
          {listSettings.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start"
              icon={item.icon ?? undefined}
              onClick={() => setSelectedId(item.id)}
            >
              {item.name}
            </Button>
          ))}
        </div>

        {/* Divisor — linha horizontal empilhado, vertical lado a lado */}
        <div className="hidden border-border md:block md:h-full md:border-l md:p-4" />
        <div className="border-t border-border md:hidden" />

        <div className="component-area w-full md:w-[50%]">
          {SelectedComponent ? (
            <SelectedComponent />
          ) : (
            <p className="p-4 text-center font-mono text-sm text-muted-foreground md:hidden">
              Selecione uma opção acima
            </p>
          )}
        </div>
      </div>
    </main>
  );
}