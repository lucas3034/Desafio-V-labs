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

const RemoveButton = styled(Button)`
  min-width: 80px;
  max-width: 100%;
  width: auto;
  white-space: nowrap;
  flex-shrink: 0;
`;

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

const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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

    const isCreator = courseData.creator_id === user.id;
      const isInstructor =
        Array.isArray(courseData.instructors) &&
        courseData.instructors.map(String).includes(String(user.id));
      if (!isCreator && !isInstructor) {
        navigate('/');
        return;
      }

      setCourse(courseData);

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


  const addExternalInstructor = async (externalUser) => {
    try {
      const alreadyInstructor = instructors.find(
        (instructor) => instructor.email === externalUser.email
      );
      if (alreadyInstructor) {
        setError('Este usuário já é instrutor do curso');
        return;
      }

      const allUsers = await userService.getAll();
      const existingUser = allUsers.find(
        (u) => u.email === externalUser.email
      );

      let userToAdd;
      if (existingUser) {
        userToAdd = existingUser;
      } else {
        userToAdd = await userService.create({
          name: externalUser.name,
          email: externalUser.email,
          password: '123456'
        });
      }

      const updatedInstructors = Array.isArray(course.instructors)
        ? [...course.instructors, userToAdd.id]
        : [userToAdd.id];

      await courseService.update(courseId, {
        ...course,
        instructors: updatedInstructors
      });

      setCourse((prev) => ({
        ...prev,
        instructors: updatedInstructors
      }));

      setInstructors((prev) => [...prev, userToAdd]);
      setMessage('Instrutor adicionado com sucesso');
      setExternalUsers((prev) =>
        prev.filter((u) => u.email !== externalUser.email)
      );

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError(error?.message || 'Erro ao adicionar instrutor');
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
        <SectionTitle>Instrutores do Curso</SectionTitle>
        {instructors.length === 0 ? (
          <EmptyState>
            <h3>Nenhum instrutor associado a este curso.</h3>
          </EmptyState>
        ) : (
          <Grid>
            {instructors.map((inst) => (
              <Card
                key={inst.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  flexWrap: 'wrap',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <AvatarWrapper>
                  {inst.picture ? (
                    <UserAvatar src={inst.picture} alt={inst.name} />
                  ) : (
                    <GenAvatar>
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                        <circle cx="18" cy="18" r="18" fill="#e0e0e0"/>
                        <path d="M18 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm0 3c-4.418 0-12 2.21-12 6.6V30h24v-2.4c0-4.39-7.582-6.6-12-6.6z" fill="#bdbdbd"/>
                      </svg>
                    </GenAvatar>
                  )}
                </AvatarWrapper>
                <div style={{ flex: 1 }}>
                  <InstructorName>{inst.name}</InstructorName>
                  <InstructorEmail>{inst.email}</InstructorEmail>
                </div>
                <RemoveButton
                  variant="danger"
                  size="small"
                  onClick={async () => {
                    try {
                  if (inst.id === course.creator_id) {
                        setError('Não é possível remover o criador do curso');
                        return;
                      }
                  const updatedInstructors = instructors.filter(i => i.id !== inst.id).map(i => i.id);
                      await courseService.update(courseId, {
                        ...course,
                        instructors: updatedInstructors
                      });
                  const lessons = await lessonService.getByCourse(courseId);
                      await Promise.all(
                        lessons
                          .filter(lesson => String(lesson.creator_id) === String(inst.id))
                          .map(lesson =>
                            lessonService.update(lesson.id, {
                              ...lesson,
                              creator_id: null
                            })
                          )
                      );
                      setInstructors(prev => prev.filter(i => i.id !== inst.id));
                      setMessage('Instrutor removido com sucesso');
                      setTimeout(() => setMessage(''), 3000);
                    } catch {
                      setError('Erro ao remover instrutor');
                    }
                  }}
                  disabled={inst.id === user.id || inst.id === course.creator_id}
                  title={
                    inst.id === user.id
                      ? "Você não pode se remover"
                      : inst.id === course.creator_id
                      ? "Não é possível remover o criador do curso"
                      : "Remover instrutor"
                  }
                >
                  Remover
                </RemoveButton>
              </Card>
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
    <AvatarWrapper>
      {externalUser.picture ? (
        <UserAvatar
          src={externalUser.picture}
          alt={externalUser.name}
        />
      ) : (
        <GenAvatar>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <circle cx="18" cy="18" r="18" fill="#e0e0e0"/>
            <path d="M18 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm0 3c-4.418 0-12 2.21-12 6.6V30h24v-2.4c0-4.39-7.582-6.6-12-6.6z" fill="#bdbdbd"/>
          </svg>
        </GenAvatar>
      )}
    </AvatarWrapper>
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
