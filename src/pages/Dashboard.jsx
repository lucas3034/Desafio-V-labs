import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { courseService, userService } from '../services/api';
import {
  Card,
  Button,
  Grid,
  Flex,
  LoadingSpinner,
  Badge
} from '../styles/GlobalStyles';

const WelcomeSection = styled.div`
  background: ${(props) => props.theme.colors.primaryGradient};
  padding: ${(props) => props.theme.spacing.xxxl}
    ${(props) => props.theme.spacing.xl};
  border-radius: ${(props) => props.theme.borderRadius.xxl};
  margin-bottom: ${(props) => props.theme.spacing.xxxl};
  color: ${(props) => props.theme.colors.white};
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 30% 70%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 30%,
        rgba(255, 255, 255, 0.05) 0%,
        transparent 50%
      );
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSize['4xl']};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const WelcomeSubtitle = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  opacity: 0.9;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.xxxl};
`;

const StatCard = styled(Card)`
  text-align: center;
  background: ${(props) => props.theme.colors.white};
  border: 2px solid ${(props) => props.theme.colors.gray100};
`;

const StatNumber = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize['3xl']};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${(props) => props.theme.colors.gray600};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
`;

const SectionHeader = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize['2xl']};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.gray800};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const SectionSubtitle = styled.p`
  color: ${(props) => props.theme.colors.gray600};
  font-size: ${(props) => props.theme.typography.fontSize.base};
`;

const CourseCard = styled(Card)`
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  transform: translateY(-4px);
`;

const CourseHeader = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const CourseTitle = styled.h3`
  color: ${(props) => props.theme.colors.gray800};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  line-height: 1.3;
`;

const CourseDescription = styled.p`
  color: ${(props) => props.theme.colors.gray600};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  flex: 1;
  line-height: 1.5;
`;

const CourseMeta = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.gray600};

  &:last-child {
    margin-bottom: 0;
  }
`;

const MetaIcon = styled.span`
  margin-right: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.base};
`;

const CourseFooter = styled.div`
  border-top: 1px solid ${(props) => props.theme.colors.gray100};
  padding-top: ${(props) => props.theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spacing.xxxl};
  background: ${(props) => props.theme.colors.white};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  border: 2px dashed ${(props) => props.theme.colors.gray200};

  h3 {
    font-size: ${(props) => props.theme.typography.fontSize.xl};
    margin-bottom: ${(props) => props.theme.spacing.md};
    color: ${(props) => props.theme.colors.gray700};
  }

  p {
    margin-bottom: ${(props) => props.theme.spacing.xl};
    color: ${(props) => props.theme.colors.gray500};
    font-size: ${(props) => props.theme.typography.fontSize.base};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, usersData] = await Promise.all([
          courseService.getAll(),
          userService.getAll()
        ]);

        setCourses(coursesData);
        setUsers(usersData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getUserName = (userId) => {
    const foundUser = users.find((u) => u.id === userId);
    return foundUser ? foundUser.name : 'Usuário não encontrado';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getUserRole = (course) => {
    if (!user) return null;
    if (course.creator_id === user.id) return 'Criador';
    if (
      Array.isArray(course.instructors) &&
      course.instructors.map(String).includes(String(user.id))
    )
      return 'Instrutor';
    return null;
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <div>
      <WelcomeSection>
        <WelcomeTitle>Olá, {user.name}! 👋</WelcomeTitle>
        <WelcomeSubtitle>Bem-vindo de volta ao CourseSphere</WelcomeSubtitle>
        <Button variant="secondary" size="large" as={Link} to="/courses/new">
          ✨ Criar Novo Curso
        </Button>
      </WelcomeSection>

      <StatsContainer>
        <StatCard>
          <StatNumber>{courses.length}</StatNumber>
          <StatLabel>Total de Cursos</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{users.length}</StatNumber>
          <StatLabel>Total de Usuários</StatLabel>
        </StatCard>
      </StatsContainer>

      {courses.length === 0 ? (
        <EmptyState>
          <h3>🎓 Nenhum curso encontrado</h3>
          <p>Ainda não há cursos na plataforma. Que tal criar o primeiro?</p>
          <Button variant="gradient" size="large" as={Link} to="/courses/new">
            Criar Primeiro Curso
          </Button>
        </EmptyState>
      ) : (
        <>
          <SectionHeader>
            <SectionTitle>Todos os Cursos</SectionTitle>
            <SectionSubtitle>
              Explore todos os cursos disponíveis na plataforma
            </SectionSubtitle>
          </SectionHeader>

          <Grid>
            {courses.map((course) => {
              const userRole = getUserRole(course);
              return (
                <CourseCard
                  key={course.id}
                  as={Link}
                  to={`/courses/${course.id}`}
                >
                  <CourseHeader>
                    <Flex justify="space-between" align="flex-start">
                      <CourseTitle>{course.name}</CourseTitle>
                      {userRole && (
                        <Badge
                          variant={
                            userRole === 'Criador' ? 'primary' : 'success'
                          }
                        >
                          {userRole}
                        </Badge>
                      )}
                    </Flex>
                  </CourseHeader>

                  <CourseDescription>
                    {course.description || 'Sem descrição disponível'}
                  </CourseDescription>

                  <CourseMeta>
                    <MetaItem>
                      <MetaIcon>👤</MetaIcon>
                      <strong>Criador:</strong> {getUserName(course.creator_id)}
                    </MetaItem>
                    <MetaItem>
                      <MetaIcon>📅</MetaIcon>
                      <strong>Início:</strong> {formatDate(course.start_date)}
                    </MetaItem>
                    <MetaItem>
                      <MetaIcon>🏁</MetaIcon>
                      <strong>Término:</strong> {formatDate(course.end_date)}
                    </MetaItem>
                    <MetaItem>
                      <MetaIcon>👥</MetaIcon>
                      <strong>Instrutores:</strong>{' '}
                      {Array.isArray(course.instructors)
                        ? course.instructors.length
                        : 0}
                    </MetaItem>
                  </CourseMeta>

                  <CourseFooter>
                    <Button variant="secondary" size="small" fullWidth>
                      Ver Detalhes →
                    </Button>
                  </CourseFooter>
                </CourseCard>
              );
            })}
          </Grid>
        </>
      )}
    </div>
  );
};

export default Dashboard;
