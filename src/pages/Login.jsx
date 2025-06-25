import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { loginValidationRules } from '../utils/validation';
import Modal from '../components/common/Modal';
import { 
  Card, 
  Button, 
  Input, 
  Label, 
  ErrorMessage, 
  FormGroup, 
  Flex,
  LoadingSpinner,
  Alert,
  IconButton
} from '../styles/GlobalStyles';

const LoginWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.primaryGradient};
  padding: ${props => props.theme.spacing.xl};
  position: relative;
  overflow: hidden;
  transition: filter 0.3s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
  }
`;

const LoginContainer = styled.div`
  position: relative;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 12px 0 rgba(120,119,198,0.10), 0 1.5px 8px 0 rgba(60,60,130,0.08);
  transition: 
    box-shadow 0.35s cubic-bezier(0.4,0.2,0.2,1),
    transform 0.28s cubic-bezier(0.4,0.2,0.2,1),
    filter 0.28s cubic-bezier(0.4,0.2,0.2,1);

  &:hover, &:focus-within {
    box-shadow:
      0 6px 24px 0 rgba(120,119,198,0.16),
      0 2px 8px 0 rgba(60,60,130,0.10),
      0 0 8px 2px rgba(120,119,198,0.08);
    transform: scale(1.015) translateY(-2px);
    filter: brightness(1.03) drop-shadow(0 0 8px rgba(120,119,198,0.08));
    outline: none;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.gray800};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.gray600};
  font-size: ${props => props.theme.typography.fontSize.base};
`;

const CredentialsButton = styled(Button)`
  margin-bottom: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.accent};
  
  &:hover {
    background: ${props => props.theme.colors.accentLight};
  }
`;

const CredentialsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const CredentialItem = styled.div`
  background: rgba(255, 255, 255, 0.5);
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateY(-3px) scale(1.02);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const CredentialLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.gray600};
  margin-bottom: ${props => props.theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const CredentialValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.gray800};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.mono};
`;

const CopyButton = styled(IconButton)`
  margin-left: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.primary};
`;

const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  margin: ${props => props.theme.spacing.xl} 0;
`;

const Divider = styled.div`
  flex: 1;
  height: 1px;
  background: ${props => props.theme.colors.gray200};
`;

const DividerText = styled.span`
  padding: 0 ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.gray500};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateAll } = useForm(
    { email: '', password: '' },
    loginValidationRules
  );

  const credentials = [
    { email: 'joao@example.com', password: '123456', name: 'João Silva' },
    { email: 'maria@example.com', password: '123456', name: 'Maria Santos' },
    { email: 'pedro@example.com', password: '123456', name: 'Pedro Oliveira' }
  ];

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    setIsLoading(true);
    setLoginError('');

    const result = await login(values.email, values.password);
    
    if (!result.success) {
      setLoginError(result.error);
    }
    
    setIsLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const fillCredentials = (email, password) => {
    handleChange({ target: { name: 'email', value: email } });
    handleChange({ target: { name: 'password', value: password } });
    setShowCredentials(false);
  };

  return (
    <LoginWrapper>
      <LoginContainer isModalOpen={showCredentials}>
        <LoginCard>
          <Header>
            <Title>CourseSphere</Title>
            <Subtitle>Faça login para acessar sua plataforma de cursos</Subtitle>
          </Header>

          <CredentialsButton
            variant="secondary"
            fullWidth
            onClick={() => setShowCredentials(true)}
            isModalOpen={showCredentials}
          >
            🔑 Credenciais para Teste
          </CredentialsButton>

          {loginError && (
            <Alert variant="error">
              {loginError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.email && errors.email}
              placeholder="seu@email.com"
            />
            {touched.email && errors.email && (
              <ErrorMessage>{errors.email}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.password && errors.password}
              placeholder="Sua senha"
            />
            {touched.password && errors.password && (
              <ErrorMessage>{errors.password}</ErrorMessage>
            )}
          </FormGroup>

          <Button
            type="submit"
            variant="gradient"
            size="large"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? (
              <Flex align="center" justify="center">
                <LoadingSpinner />
                Entrando...
              </Flex>
            ) : (
              'Entrar na Plataforma'
            )}
          </Button>
        </form>

        <Modal
          isOpen={showCredentials}
          onClose={() => setShowCredentials(false)}
          title="Credenciais para Teste"
          maxWidth="600px"
        >
          <Alert variant="primary">
            <strong>💡 Dica:</strong> Clique em qualquer credencial para preenchê-la automaticamente no formulário!
          </Alert>

          <CredentialsList>
            {credentials.map((cred, index) => (
              <CredentialItem
                key={index}
                onClick={() => fillCredentials(cred.email, cred.password)}
                style={{ cursor: 'pointer' }}
              >
                <Flex justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <CredentialLabel>Nome do Usuário</CredentialLabel>
                    <CredentialValue>{cred.name}</CredentialValue>
                    
                    <CredentialLabel style={{ marginTop: '12px' }}>Email</CredentialLabel>
                    <CredentialValue>{cred.email}</CredentialValue>
                    
                    <CredentialLabel style={{ marginTop: '12px' }}>Senha</CredentialLabel>
                    <CredentialValue>{cred.password}</CredentialValue>
                  </div>
                  
                  <Flex gap="8px">
                    <CopyButton
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(cred.email);
                      }}
                      title="Copiar email"
                    >
                      📋
                    </CopyButton>
                  </Flex>
                </Flex>
              </CredentialItem>
            ))}
          </CredentialsList>

          <DividerContainer>
            <Divider />
            <DividerText>ou</DividerText>
            <Divider />
          </DividerContainer>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => setShowCredentials(false)}
          >
            Fechar
          </Button>
        </Modal>
        </LoginCard>
      </LoginContainer>
    </LoginWrapper>
  );
};

export default Login;
