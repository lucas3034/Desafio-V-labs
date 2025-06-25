import Modal from './Modal';
import { MdCheckCircleOutline } from 'react-icons/md';
import styled from 'styled-components';
import { Button } from '../../styles/GlobalStyles';

const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  background: linear-gradient(135deg, #e6f9ed 0%, #c3f0e0 50%, #e0ffe7 100%);
  border-radius: 20px;
  min-width: 320px;
  max-width: 400px;
  box-shadow: 0 4px 24px 0 rgba(0, 128, 64, 0.1),
    0 1.5px 8px 0 rgba(0, 0, 0, 0.04);
  border: 1.5px solid #b2eac7;
  backdrop-filter: blur(1.5px);
  transition: background 0.4s;
`;

const SuccessIcon = styled(MdCheckCircleOutline)`
  color: #1fc77a;
  font-size: 72px;
  margin-bottom: 18px;
  filter: drop-shadow(0 2px 8px #b2eac7);
`;

const SuccessTitle = styled.h2`
  color: #218838;
  font-size: 1.6rem;
  margin-bottom: 8px;
  font-weight: 700;
  text-align: center;
`;

const SuccessText = styled.p`
  color: #218838;
  font-size: 1.1rem;
  margin-bottom: 32px;
  text-align: center;
`;

const SuccessButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
`;

const SuccessCloseButton = styled(Button)`
  background: linear-gradient(90deg, #1fc77a 0%, #43e97b 100%);
  color: #fff;
  border: none;
  &:hover,
  &:focus {
    background: linear-gradient(90deg, #43e97b 0%, #1fc77a 100%);
    color: #fff;
    opacity: 0.92;
  }
`;

const SuccessModal = ({
  isOpen,
  onClose,
  title,
  text,
  closeLabel = 'Fechar',
  extraButton,
  ...modalProps
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    closeOnOverlayClick={false}
    hideCloseButton={true}
    transparentBackground={true}
    {...modalProps}
  >
    <SuccessContent>
      <SuccessIcon />
      <SuccessTitle>{title}</SuccessTitle>
      <SuccessText>{text}</SuccessText>
      <SuccessButtonGroup>
        <SuccessCloseButton onClick={onClose}>
          {closeLabel}
        </SuccessCloseButton>
        {extraButton}
      </SuccessButtonGroup>
    </SuccessContent>
  </Modal>
);

export default SuccessModal;
