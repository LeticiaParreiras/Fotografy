import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { ModalShell } from './TemplateModal';
import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/Button';

export const NoLoggedModal = NiceModal.create(() => {
  const modal = useModal();
  const navigate = useNavigate();

  function navigateTo(endpoint: 'login' | 'register') {
      modal.resolve();
      modal.hide();
      navigate(endpoint);
  }

  return (
    <ModalShell
      title="Entre no Fotografy"
      visible={modal.visible}
      onClose={() => modal.hide()}
      onExited={() => modal.remove()}
    >
      <div className="flex flex-col gap-3">
        <Button variant="primary" onClick={() => navigateTo('login')}>
          Entre
        </Button>
        <Button variant="secondary" onClick={() => navigateTo('register')}>
          Cadastre-se
        </Button>
      </div>
    </ModalShell>
  );
});