import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import {
  courseService,
  userService,
  externalService,
  lessonService
} from '../services/api';
import {
  Card,
  Button,
  Grid,
  Flex,
  LoadingSpinner
} from '../styles/GlobalStyles';

const Header = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.gray800};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const Section = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  color: ${(props) => props.theme.colors.gray700};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  font-size: 1.25rem;
`;

const InstructorCard = styled(Card)`
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.lg};
  }
`;

const InstructorInfo = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const InstructorName = styled.h3`
  color: ${(props) => props.theme.colors.gray800};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  font-size: 1.125rem;
`;

const InstructorEmail = styled.p`
  color: ${(props) => props.theme.colors.gray600};
  font-size: 0.875rem;
`;

const RoleBadge = styled.span`
  background: ${(props) =>
    props.isCreator ? props.theme.colors.primary : props.theme.colors.success};
  color: ${(props) => props.theme.colors.white};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: ${(props) => props.theme.spacing.md};
  display: inline-block;
`;

const ExternalUserCard = styled(Card)`
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.lg};
  }
`;

const UserAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  object-fit: cover;
`;

const GenAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const SuccessMessage = styled.div`
  background: ${(props) => props.theme.colors.success};
  color: ${(props) => props.theme.colors.white};
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  text-align: center;
`;

const ErrorAlert = styled.div`
  background: ${(props) => props.theme.colors.error};
  color: ${(props) => props.theme.colors.white};
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spacing.xl};
  color: ${(props) => props.theme.colors.gray500};

  h3 {
    margin-bottom: ${(props) => props.theme.spacing.md};
    color: ${(props) => props.theme.colors.gray600};
  }
`;

const InstructorManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [externalUsers, setExternalUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [courseData, usersData, lessonsData] = await Promise.all([
        courseService.getById(courseId),
        userService.getAll(),
        lessonService.getByCourse(courseId)
      ]);

      // Permitir acesso ao criador ou instrutores
      const isCreator = courseData.creator_id === user.id;
      const isInstructor =
        Array.isArray(courseData.instructors) &&
        courseData.instructors.map(String).includes(String(user.id));
      if (!isCreator && !isInstructor) {
        navigate('/');
        return;
      }

      setCourse(courseData);

      // IDs de instrutores: criador, course.instructors, e creator_id das lessons
      const instructorIds = new Set();
      if (courseData.creator_id)
        instructorIds.add(String(courseData.creator_id));
      if (Array.isArray(courseData.instructors)) {
        courseData.instructors.forEach((id) => instructorIds.add(String(id)));
      }
      if (Array.isArray(lessonsData)) {
        lessonsData.forEach((lesson) => {
          if (lesson.creator_id) instructorIds.add(String(lesson.creator_id));
        });
      }

      const courseInstructors = usersData.filter((u) =>
        instructorIds.has(String(u.id))
      );
      setInstructors(courseInstructors);
    } catch (error) {
      setError('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  }, [courseId, user.id, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadExternalUsers = async () => {
    setIsLoadingExternal(true);
    try {
      const [externalUsers, localUsers] = await Promise.all([
        externalService.getRandomUsers(8),
        userService.getAll()
      ]);
      // Remove duplicados por email
      const emailsSet = new Set();
      const allUsers = [...localUsers, ...externalUsers].filter((user) => {
        if (emailsSet.has(user.email)) return false;
        emailsSet.add(user.email);
        return true;
      });
      setExternalUsers(allUsers);
    } catch (error) {
      setError('Erro ao carregar usuários externos');
    } finally {
      setIsLoadingExternal(false);
    }
  };

  const removeInstructor = async (instructorId) => {
    if (instructorId === course.creator_id) {
      setError('Não é possível remover o criador do curso');
      return;
    }

    if (!window.confirm('Tem certeza que deseja remover este instrutor?')) {
      return;
    }

    try {
      const updatedInstructors = course.instructors.filter(
        (id) => id !== instructorId
      );

      await courseService.update(courseId, {
        ...course,
        instructors: updatedInstructors
      });

      setCourse((prev) => ({
        ...prev,
        instructors: updatedInstructors
      }));

      setInstructors((prev) =>
        prev.filter((instructor) => instructor.id !== instructorId)
      );
      setMessage('Instrutor removido com sucesso');

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError('Erro ao remover instrutor');
    }
  };

  const addExternalInstructor = async (externalUser) => {
    try {
      const existingUser = instructors.find(
        (instructor) => instructor.email === externalUser.email
      );

      if (existingUser) {
        setError('Este usuário já é instrutor do curso');
        return;
      }

      const newUser = await userService.create({
        name: externalUser.name,
        email: externalUser.email,
        password: '123456'
      });

      const updatedInstructors = [...course.instructors, newUser.id];

      await courseService.update(courseId, {
        ...course,
        instructors: updatedInstructors
      });

      setCourse((prev) => ({
        ...prev,
        instructors: updatedInstructors
      }));

      setInstructors((prev) => [...prev, newUser]);
      setMessage('Instrutor adicionado com sucesso');
      setExternalUsers((prev) =>
        prev.filter((u) => u.email !== externalUser.email)
      );

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError('Erro ao adicionar instrutor');
    }
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  if (!course) {
    return <div>Curso não encontrado</div>;
  }

  return (
    <div>
      <Header>
        <Flex justify="space-between" align="flex-start" mobileColumn>
          <div>
            <Title>Gerenciar Instrutores</Title>
            <p>Curso: {course.name}</p>
          </div>
          <Button
            onClick={() => navigate(`/courses/${courseId}`)}
            variant="secondary"
          >
            Voltar ao Curso
          </Button>
        </Flex>
      </Header>

      {message && <SuccessMessage>{message}</SuccessMessage>}

      {error && <ErrorAlert>{error}</ErrorAlert>}

      <Section>
        <SectionTitle>Instrutores Atuais</SectionTitle>

        {instructors.length === 0 ? (
          <EmptyState>
            <h3>Nenhum instrutor encontrado</h3>
          </EmptyState>
        ) : (
          <Grid>
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id}>
                <RoleBadge isCreator={instructor.id === course.creator_id}>
                  {instructor.id === course.creator_id
                    ? 'Criador'
                    : 'Instrutor'}
                </RoleBadge>

                <InstructorInfo>
                  <InstructorName>{instructor.name}</InstructorName>
                  <InstructorEmail>{instructor.email}</InstructorEmail>
                </InstructorInfo>

                {instructor.id !== course.creator_id && (
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => removeInstructor(instructor.id)}
                  >
                    Remover
                  </Button>
                )}
              </InstructorCard>
            ))}
          </Grid>
        )}
      </Section>

      <Section>
        <Flex justify="space-between" align="center" mobileColumn>
          <SectionTitle>Adicionar Novos Instrutores</SectionTitle>
          <Button
            onClick={loadExternalUsers}
            disabled={isLoadingExternal}
            variant="secondary"
          >
            {isLoadingExternal ? (
              <Flex align="center">
                <LoadingSpinner />
                Carregando...
              </Flex>
            ) : (
              'Buscar Usuários'
            )}
          </Button>
        </Flex>

        {externalUsers.length === 0 ? (
          <EmptyState>
            <h3>Clique em "Buscar Usuários" para ver sugestões</h3>
          </EmptyState>
        ) : (
          <Grid>
            {externalUsers.map((externalUser, index) => (
              <ExternalUserCard key={index}>
                {externalUser.picture ? (
                  <UserAvatar
                    src={externalUser.picture}
                    alt={externalUser.name}
                  />
                ) : (
                  <GenAvatar>
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ display: 'block' }}
                    >
                      <circle cx="12" cy="8" r="4" fill="#bbb" />
                      <rect
                        x="4"
                        y="16"
                        width="16"
                        height="6"
                        rx="3"
                        fill="#bbb"
                      />
                    </svg>
                  </GenAvatar>
                )}

                <InstructorInfo>
                  <InstructorName>{externalUser.name}</InstructorName>
                  <InstructorEmail>{externalUser.email}</InstructorEmail>
                </InstructorInfo>

                <Button
                  onClick={() => addExternalInstructor(externalUser)}
                  variant="success"
                  size="small"
                >
                  Adicionar
                </Button>
              </ExternalUserCard>
            ))}
          </Grid>
        )}
      </Section>
    </div>
  );
};

export default InstructorManagement;
