import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Button, Flex } from '../../styles/GlobalStyles';

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: linear-gradient(135deg, ${props => props.theme.colors.white} 0%, ${props => props.theme.colors.gray50} 100%);
  box-shadow: ${props => props.theme.shadows.lg};
  padding: ${props => props.theme.spacing.lg} 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid ${props => props.theme.colors.gray200};
`;

const LogoContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  transition: ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.theme.colors.primaryGradient};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.white};
  font-weight: 700;
  font-size: 1.2rem;
  box-shadow: ${props => props.theme.shadows.md};
`;

const Logo = styled.h1`
  background: ${props => props.theme.colors.primaryGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
`;

const UserInfo = styled.div`
  color: ${props => props.theme.colors.gray600};
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  .greeting {
    color: ${props => props.theme.colors.gray800};
    font-weight: 600;
  }
  
  .role {
    font-size: 0.75rem;
    color: ${props => props.theme.colors.gray500};
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  background: ${props => props.theme.colors.primaryGradient};
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.white};
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: ${props => props.theme.shadows.md};
`;

const Main = styled.main`
  flex: 1;
  padding: ${props => props.theme.spacing.xl} 0;
`;

const Footer = styled.footer`
  background: linear-gradient(135deg, ${props => props.theme.colors.gray800} 0%, ${props => props.theme.colors.gray900} 100%);
  color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.xl} 0;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.theme.colors.primaryGradient};
  }

  p {
    margin: 0;
    font-size: ${props => props.theme.typography.fontSize.sm};
    opacity: 0.9;
    position: relative;
    z-index: 1;
  }
`;

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <LayoutWrapper>
      <Header>
        <Container>
          <Flex justify="space-between" align="center">
            <LogoContainer onClick={handleLogoClick}>
              <LogoIcon>CS</LogoIcon>
              <Logo>CourseSphere</Logo>
            </LogoContainer>
            {user && (
              <UserSection>
                <UserInfo>
                  <div className="greeting">Olá, {user.name}</div>
                  <div className="role">Instrutor</div>
                </UserInfo>
                <UserAvatar>{getUserInitials(user.name)}</UserAvatar>
                <Button variant="secondary" size="small" onClick={handleLogout}>
                  Sair
                </Button>
              </UserSection>
            )}
          </Flex>
        </Container>
      </Header>

      <Main>
        <Container>
          {children}
        </Container>
      </Main>

      <Footer>
        <Container>
          <p>&copy; 2025 CourseSphere. Todos os direitos reservados.</p>
        </Container>
      </Footer>
    </LayoutWrapper>
  );
};

export default Layout;
