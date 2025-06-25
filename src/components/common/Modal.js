import { useEffect } from 'react';
import { ModalOverlay, ModalContent, ModalCloseButton } from '../../styles/GlobalStyles';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '500px',
  closeOnOverlayClick = true,
  hideCloseButton = false,
  transparentBackground = false
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
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
      <ModalContent
        style={{
          minWidth: 380,
          minHeight: 120,
          padding: 24,
          position: 'relative',
          background: transparentBackground ? 'none' : undefined,
          boxShadow: transparentBackground ? 'none' : undefined,
          border: transparentBackground ? 'none' : undefined
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
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
