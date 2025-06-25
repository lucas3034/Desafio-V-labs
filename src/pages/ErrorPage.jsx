import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Card, Flex } from '../styles/GlobalStyles';

const ErrorWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.gray50};
  padding: ${props => props.theme.spacing.xl};
`;

const ErrorCard = styled(Card)`
  max-width: 500px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.error};
`;

const ErrorCode = styled.h1`
  font-size: 3rem;
  color: ${props => props.theme.colors.gray800};
  margin-bottom: ${props => props.theme.spacing.md};
  font-weight: 700;
`;

const ErrorTitle = styled.h2`
  color: ${props => props.theme.colors.gray700};
  margin-bottom: ${props => props.theme.spacing.md};
  font-weight: 500;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.gray600};
  margin-bottom: ${props => props.theme.spacing.xl};
  line-height: 1.6;
`;

const ErrorPage = ({ 
  code = '403', 
  title = 'Acesso Negado', 
  message = 'Você não tem permissão para acessar esta página.',
  showGoBack = true 
}) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (code) {
      case '404':
        return '🔍';
      case '403':
        return '🚫';
      case '500':
        return '💥';
      default:
        return '⚠️';
    }
  };

  const getDefaultMessage = () => {
    switch (code) {
      case '404':
        return 'A página que você está procurando não foi encontrada.';
      case '403':
        return 'Você não tem permissão para acessar esta página.';
      case '500':
        return 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.';
      default:
        return 'Ocorreu um erro inesperado.';
    }
  };

  const getDefaultTitle = () => {
    switch (code) {
      case '404':
        return 'Página Não Encontrada';
      case '403':
        return 'Acesso Negado';
      case '500':
        return 'Erro Interno';
      default:
        return 'Erro';
    }
  };

  return (
    <ErrorWrapper>
      <ErrorCard>
        <ErrorIcon>{getIcon()}</ErrorIcon>
        <ErrorCode>{code}</ErrorCode>
        <ErrorTitle>{title || getDefaultTitle()}</ErrorTitle>
        <ErrorMessage>
          {message || getDefaultMessage()}
        </ErrorMessage>
        
        <Flex gap="1rem" justify="center">
          <Button as={Link} to="/" variant="primary">
            Ir para Dashboard
          </Button>
          {showGoBack && (
            <Button 
              onClick={() => navigate(-1)} 
              variant="secondary"
            >
              Voltar
            </Button>
          )}
        </Flex>
      </ErrorCard>
    </ErrorWrapper>
  );
};

export default ErrorPage;
