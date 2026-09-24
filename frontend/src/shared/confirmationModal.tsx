import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { ModalShell } from "../components/TemplateModal";
import { Button } from "../shared/Button";
interface Props {
  title: string;
  message: string;
}
export const confirmationModal = NiceModal.create(
  ({ title, message }: Props) => {
    const modal = useModal();

    function onConfirmation(confirmation: boolean) {
      modal.resolve(confirmation);
      modal.hide();
    }

    return (
      <ModalShell
        title={title}
        visible={modal.visible}
        onClose={() => modal.hide()}
        onExited={() => modal.remove()}
      >
        <>
          <p>{message}</p>
          <div className="flex justify-center mt-3 gap-3">
            <Button variant="secondary" onClick={() => onConfirmation(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => onConfirmation(true)}>
              Confirmar
            </Button>
          </div>
        </>
      </ModalShell>
    );
  },
);
