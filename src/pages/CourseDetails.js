import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { courseService, lessonService, userService } from '../services/api';
import { usePagination } from '../hooks/usePagination';
import {
  Card,
  Button,
  Input,
  Select,
  Grid,
  Flex,
  LoadingSpinner,
  Badge
} from '../styles/GlobalStyles';
import Pagination from '../components/common/Pagination';

const PageHeader = styled.div`
  background: ${(props) => props.theme.colors.primaryGradient};
  color: ${(props) => props.theme.colors.white};
  padding: ${(props) => props.theme.spacing.xxxl} 0;
  margin: -${(props) => props.theme.spacing.xl} -${(props) =>
      props.theme.spacing.xl}
    ${(props) => props.theme.spacing.xl};
  border-radius: 0 0 ${(props) => props.theme.borderRadius.xxl}
    ${(props) => props.theme.borderRadius.xxl};
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

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.spacing.lg};
`;

const CourseTitle = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSize['4xl']};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CourseSubtitle = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  opacity: 0.9;
  line-height: 1.5;
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const StatItem = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  border: 1px solid rgba(255, 255, 255, 0.2);

  .number {
    font-size: ${(props) => props.theme.typography.fontSize['2xl']};
    font-weight: ${(props) => props.theme.typography.fontWeight.bold};
    margin-bottom: ${(props) => props.theme.spacing.xs};
  }

  .label {
    font-size: ${(props) => props.theme.typography.fontSize.sm};
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  flex-wrap: wrap;
  margin-top: ${(props) => props.theme.spacing.xl};

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const CourseInfoCard = styled(Card)`
  margin-bottom: ${(props) => props.theme.spacing.xl};
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.white} 0%,
    ${(props) => props.theme.colors.gray50} 100%
  );
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${(props) => props.theme.spacing.xl};
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const InfoSection = styled.div`
  .title {
    color: ${(props) => props.theme.colors.primary};
    font-size: ${(props) => props.theme.typography.fontSize.sm};
    font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: ${(props) => props.theme.spacing.sm};
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing.xs};
  }

  .content {
    color: ${(props) => props.theme.colors.gray800};
    font-size: ${(props) => props.theme.typography.fontSize.base};
    font-weight: ${(props) => props.theme.typography.fontWeight.medium};
    line-height: 1.5;
  }
`;

const InstructorsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.sm};
`;

const InstructorChip = styled.div`
  background: ${(props) => props.theme.colors.primaryGradient};
  color: ${(props) => props.theme.colors.white};
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  box-shadow: ${(props) => props.theme.shadows.md};

  &::before {
    content: '👨‍🏫';
    font-size: 1rem;
  }
`;

const LessonsSection = styled.div`
  margin-top: ${(props) => props.theme.spacing.xl};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize['2xl']};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.gray800};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};

  &::before {
    content: '🎓';
    font-size: 1.5rem;
  }
`;

const FiltersCard = styled(Card)`
  margin-bottom: ${(props) => props.theme.spacing.xl};
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.white} 0%,
    ${(props) => props.theme.colors.accent}05 100%
  );
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: ${(props) => props.theme.spacing.md};
  align-items: end;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const LessonCard = styled(Card)`
  transition: all ${(props) => props.theme.transitions.normal};
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) => props.theme.colors.primaryGradient};
    transform: scaleX(0);
    transition: transform ${(props) => props.theme.transitions.normal};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${(props) => props.theme.shadows.xl};

    &::before {
      transform: scaleX(1);
    }
  }
`;

const LessonHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const VideoThumbnail = styled.a`
  width: 120px;
  height: 90px;
  background: ${(props) => props.theme.colors.gray200};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.white};
  font-size: 2rem;
  box-shadow: ${(props) => props.theme.shadows.md};
  flex-shrink: 0;
  overflow: hidden;
  transition: transform ${(props) => props.theme.transitions.normal};

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LessonContent = styled.div`
  flex: 1;
`;

const LessonTitle = styled.h3`
  color: ${(props) => props.theme.colors.gray800};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  line-height: 1.3;
`;

const LessonMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.colors.gray500};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  margin-bottom: ${(props) => props.theme.spacing.lg};

  .meta-item {
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing.xs};
  }
`;

const StatusBadge = styled(Badge)`
  background: ${(props) => {
    switch (props.status) {
      case 'published':
        return props.theme.colors.success;
      case 'draft':
        return props.theme.colors.warning;
      case 'archived':
        return props.theme.colors.gray400;
      default:
        return props.theme.colors.gray400;
    }
  }};
`;

const LessonActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${(props) => props.theme.spacing.lg};
  border-top: 1px solid ${(props) => props.theme.colors.gray100};
  margin-top: ${(props) => props.theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spacing.xxxl};
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.gray50} 0%,
    ${(props) => props.theme.colors.white} 100%
  );
  border-radius: ${(props) => props.theme.borderRadius.xl};
  border: 2px dashed ${(props) => props.theme.colors.gray200};

  .icon {
    font-size: 4rem;
    margin-bottom: ${(props) => props.theme.spacing.lg};
  }

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
  min-height: 400px;
`;

const getYouTubeThumbnail = (url) => {
  if (!url || typeof url !== 'string') return null;
  let videoId;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.split('/')[1];
    } else if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v');
    }
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
  } catch (e) {
    return null;
  }
  return null;
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    title: '',
    status: ''
  });

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    hasNextPage,
    hasPreviousPage,
    reset: resetPagination
  } = usePagination(filteredLessons, 6);

  const loadData = useCallback(async () => {
    try {
      const [courseData, lessonsData, usersData] = await Promise.all([
        courseService.getById(id),
        lessonService.getByCourse(id),
        userService.getAll()
      ]);

      console.log('DEBUG - Carregando dados do curso:', id);
      console.log('DEBUG - Curso encontrado:', courseData);
      console.log('DEBUG - Aulas encontradas:', lessonsData);
      console.log('DEBUG - Usuário atual:', user);

      setCourse(courseData);
      setLessons(lessonsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate, user]);

  // Função para refresh manual
  const refreshLessons = useCallback(async () => {
    try {
      const lessonsData = await lessonService.getByCourse(id);
      console.log('Refresh das aulas:', lessonsData);
      setLessons(lessonsData);
    } catch (error) {
      console.error('Erro ao recarregar aulas:', error);
    }
  }, [id]);

  // Expor função de refresh para uso global
  window.refreshCourseDetails = refreshLessons;

  const applyFilters = useCallback(() => {
    let filtered = [...lessons];

    if (filters.title) {
      filtered = filtered.filter((lesson) =>
        lesson.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((lesson) => lesson.status === filters.status);
    }

    setFilteredLessons(filtered);
  }, [lessons, filters.title, filters.status]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    applyFilters();
    resetPagination();
  }, [lessons, filters.title, filters.status, applyFilters, resetPagination]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      status: ''
    });
  };

  const getUserName = (userId) => {
    const foundUser = users.find((u) => u.id === userId);
    return foundUser ? foundUser.name : 'Usuário não encontrado';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isCreator = () => {
    if (!course || !user) return false;
    const userId = parseInt(user.id, 10);
    const creatorId = parseInt(course.creator_id, 10);
    return creatorId === userId;
  };

  const isInstructor = () => {
    if (!course || !user) return false;
    const userId = parseInt(user.id, 10);
    console.log('DEBUG - Verificando se é instrutor:');
    console.log('User ID:', userId, 'Tipo:', typeof userId);
    console.log('Course instructors:', course.instructors);
    console.log('Is creator:', isCreator());

    // Verificar se é instrutor (comparando tanto string quanto number)
    const isInstructorResult =
      (Array.isArray(course.instructors) &&
        course.instructors.some((instructorId) => {
          const instructorIdNum = parseInt(instructorId, 10);
          return instructorIdNum === userId;
        })) ||
      isCreator();

    console.log('Resultado isInstructor:', isInstructorResult);
    return isInstructorResult;
  };

  const canEditLesson = (lesson) => {
    return isCreator() || lesson.creator_id === parseInt(user.id, 10);
  };

  const handleDeleteCourse = async () => {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      try {
        await courseService.delete(id);
        navigate('/');
      } catch (error) {
        alert('Erro ao excluir curso');
      }
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Tem certeza que deseja excluir esta aula?')) {
      try {
        await lessonService.delete(lessonId);
        setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      } catch (error) {
        alert('Erro ao excluir aula');
      }
    }
  };

  const getStatusCount = (status) => {
    return lessons.filter((lesson) => lesson.status === status).length;
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'draft':
        return 'Rascunho';
      case 'archived':
        return 'Arquivado';
      default:
        return status;
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
      <PageHeader>
        <HeaderContent>
          <div style={{ marginBottom: '1rem' }}>
            <Button onClick={() => navigate(-1)} variant="secondary">
              &larr; Voltar
            </Button>
          </div>
          <CourseTitle>{course.name}</CourseTitle>
          <CourseSubtitle>
            {course.description || 'Explore o conteúdo deste curso incrível'}
          </CourseSubtitle>

          <QuickStats>
            <StatItem>
              <div className="number">{lessons.length}</div>
              <div className="label">Total de Aulas</div>
            </StatItem>
            <StatItem>
              <div className="number">{getStatusCount('published')}</div>
              <div className="label">Publicadas</div>
            </StatItem>
            <StatItem>
              <div className="number">{getStatusCount('draft')}</div>
              <div className="label">Rascunhos</div>
            </StatItem>
            <StatItem>
              <div className="number">
                {Array.isArray(course.instructors)
                  ? course.instructors.length
                  : 0}
              </div>
              <div className="label">Instrutores</div>
            </StatItem>
          </QuickStats>

          <ActionButtons>
            {isInstructor() && (
              <Button
                as={Link}
                to={`/courses/${id}/lessons/new`}
                variant="secondary"
                size="large"
              >
                ➕ Nova Aula
              </Button>
            )}
            {isCreator() && (
              <>
                <Button
                  as={Link}
                  to={`/courses/${id}/instructors`}
                  variant="secondary"
                  size="large"
                >
                  👥 Gerenciar Instrutores
                </Button>
                <Button
                  as={Link}
                  to={`/courses/${id}/edit`}
                  variant="secondary"
                  size="large"
                >
                  ✏️ Editar Curso
                </Button>
                <Button
                  onClick={handleDeleteCourse}
                  variant="danger"
                  size="large"
                >
                  🗑️ Excluir Curso
                </Button>
              </>
            )}
          </ActionButtons>
        </HeaderContent>
      </PageHeader>

      <CourseInfoCard>
        <InfoGrid>
          <InfoSection>
            <div className="title">📅 Data de Início</div>
            <div className="content">{formatDate(course.start_date)}</div>
          </InfoSection>

          <InfoSection>
            <div className="title">🏁 Data de Fim</div>
            <div className="content">{formatDate(course.end_date)}</div>
          </InfoSection>

          <InfoSection>
            <div className="title">👤 Criador do Curso</div>
            <div className="content">{getUserName(course.creator_id)}</div>
          </InfoSection>

          <InfoSection>
            <div className="title">👨‍🏫 Instrutores</div>
            <InstructorsList>
              {(Array.isArray(course.instructors)
                ? course.instructors
                : []
              ).map((instructorId) => (
                <InstructorChip key={instructorId}>
                  {getUserName(instructorId)}
                </InstructorChip>
              ))}
            </InstructorsList>
          </InfoSection>
        </InfoGrid>
      </CourseInfoCard>

      <LessonsSection>
        <SectionHeader>
          <SectionTitle>Aulas do Curso</SectionTitle>
          {isInstructor() && (
            <Button
              as={Link}
              to={`/courses/${id}/lessons/new`}
              variant="gradient"
            >
              ➕ Adicionar Aula
            </Button>
          )}
        </SectionHeader>

        <FiltersCard>
          <FiltersGrid>
            <div>
              <Input
                name="title"
                placeholder="🔍 Buscar por título da aula..."
                value={filters.title}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Todos os status</option>
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="archived">Arquivado</option>
              </Select>
            </div>
            <div>
              <Button variant="secondary" onClick={clearFilters}>
                🗑️ Limpar
              </Button>
            </div>
          </FiltersGrid>
        </FiltersCard>

        {filteredLessons.length === 0 ? (
          <EmptyState>
            <div className="icon">🎓</div>
            <h3>
              {lessons.length === 0
                ? 'Nenhuma aula criada ainda'
                : 'Nenhuma aula encontrada'}
            </h3>
            <p>
              {lessons.length === 0
                ? 'Este curso ainda não possui aulas. Que tal criar a primeira?'
                : 'Nenhuma aula corresponde aos filtros aplicados. Tente ajustar os critérios de busca.'}
            </p>
            {isInstructor() && lessons.length === 0 && (
              <Button
                as={Link}
                to={`/courses/${id}/lessons/new`}
                variant="gradient"
                size="large"
              >
                🚀 Criar Primeira Aula
              </Button>
            )}
          </EmptyState>
        ) : (
          <>
            <Grid>
              {paginatedData.map((lesson) => {
                const thumbnailUrl = getYouTubeThumbnail(lesson.video_url);
                return (
                  <LessonCard
                    key={lesson.id}
                    onClick={() =>
                      window.open(
                        lesson.video_url,
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                  >
                    <LessonHeader>
                      <VideoThumbnail
                        href={lesson.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt={`Thumbnail for ${lesson.title}`}
                          />
                        ) : (
                          '📹'
                        )}
                      </VideoThumbnail>
                      <LessonContent>
                        <LessonTitle>{lesson.title}</LessonTitle>
                        <LessonMeta>
                          <div className="meta-item">
                            <span>👤</span>
                            <span>{getUserName(lesson.creator_id)}</span>
                          </div>
                          <div className="meta-item">
                            <span>📅</span>
                            <span>{formatDate(lesson.publish_date)}</span>
                          </div>
                        </LessonMeta>
                      </LessonContent>
                    </LessonHeader>

                    <LessonActions onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={lesson.status}>
                        {getStatusText(lesson.status)}
                      </StatusBadge>

                      {canEditLesson(lesson) && (
                        <Flex gap="0.5rem">
                          <Button
                            as={Link}
                            to={`/courses/${id}/lessons/${lesson.id}/edit`}
                            variant="secondary"
                            size="small"
                          >
                            ✏️ Editar
                          </Button>
                          <Button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            variant="danger"
                            size="small"
                          >
                            🗑️ Excluir
                          </Button>
                        </Flex>
                      )}
                    </LessonActions>
                  </LessonCard>
                );
              })}
            </Grid>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
            />
          </>
        )}
      </LessonsSection>
    </div>
  );
};

export default CourseDetails;
