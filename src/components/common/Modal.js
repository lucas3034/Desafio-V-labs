import { useEffect } from 'react';
import { ModalOverlay, ModalCloseButton } from '../../styles/GlobalStyles';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '500px',
  closeOnOverlayClick = true,
  hideCloseButton = false
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Removido overflow hidden para permitir scroll do body com modal aberto
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Removido overflow unset
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          minWidth: 380,
          minHeight: 120,
          padding: 24
        }}
      >
        {!hideCloseButton && (
          <ModalCloseButton
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 2,
              fontSize: 18,
              width: 28,
              height: 28,
              background: 'transparent',
              color: '#444',
              opacity: 0.5,
              border: 'none',
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            &times;
          </ModalCloseButton>
        )}
        {children}
      </div>
    </ModalOverlay>
  );
};

export default Modal;
