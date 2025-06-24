import { useEffect } from 'react';
import { 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  ModalCloseButton 
} from '../../styles/GlobalStyles';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = '500px',
  closeOnOverlayClick = true 
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
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
      <ModalContent style={{ maxWidth }}>
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <ModalCloseButton onClick={onClose}>
              ×
            </ModalCloseButton>
          </ModalHeader>
        )}
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
