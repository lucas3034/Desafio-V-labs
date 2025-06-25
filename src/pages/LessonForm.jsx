import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { lessonService, courseService } from '../services/api';
import { useForm } from '../hooks/useForm';
import { lessonValidationRules } from '../utils/validation';
import SuccessModal from '../components/common/SuccessModal';
import { 
  Card, 
  Button, 
  Input, 
  Select,
  Label, 
  ErrorMessage, 
  FormGroup, 
  Flex,
  LoadingSpinner 
} from '../styles/GlobalStyles';

const PageHeader = styled.div`
  background: ${props => props.theme.colors.primaryGradient};
  color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.xl} 0;
  margin-bottom: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  text-align: center;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const FormCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
  box-shadow: ${props => props.theme.shadows.lg};
  padding: ${props => props.theme.spacing.xl};
`;

const ButtonGroup = styled(Flex)`
  margin-top: ${props => props.theme.spacing.xl};
  padding-top: ${props => props.theme.spacing.xl};
  border-top: 1px solid ${props => props.theme.colors.gray200};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const SuccessMessage = styled.div`
  background: ${props => props.theme.colors.success};
  color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const ErrorAlert = styled.div`
  background: ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const CourseInfo = styled.div`
  background: ${props => props.theme.colors.gray50};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  border-left: 4px solid ${props => props.theme.colors.primary};
  
  h3 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: ${props => props.theme.spacing.sm};
    font-size: ${props => props.theme.typography.fontSize.lg};
  }
  
  p {
    color: ${props => props.theme.colors.gray600};
    font-size: ${props => props.theme.typography.fontSize.base};
    line-height: 1.5;
  }
`;

const VideoPreview = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  width: 240px;
  height: 180px;
  background: ${props => props.theme.colors.gray100};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.gray200};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    color: ${props => props.theme.colors.gray500};
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
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

const LessonForm = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!lessonId;
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateAll, setValues } = useForm(
    {
      title: '',
      status: 'draft',
      publish_date: '',
      video_url: ''
    },
    lessonValidationRules
  );

  const loadInitialData = useCallback(async () => {
    try {
      const courseData = await courseService.getById(courseId);
      setCourse(courseData);

      const userId = parseInt(user.id, 10);
      const isCreator = parseInt(courseData.creator_id, 10) === userId;
      const isInstructor = courseData.instructors.some(instructorId => 
        parseInt(instructorId, 10) === userId
      );
      
      if (!isInstructor && !isCreator) {
        console.warn('Acesso negado ao formulário de aula. Usuário não é criador nem instrutor.');
        navigate('/');
        return;
      }

      if (isEditing) {
        const lesson = await lessonService.getById(lessonId);
        
        const isCourseCreator = parseInt(courseData.creator_id, 10) === userId;
        const isLessonCreator = parseInt(lesson.creator_id, 10) === userId;

        if (!isCourseCreator && !isLessonCreator) {
          console.warn('Acesso negado à edição da aula. Usuário não é criador do curso nem da aula.');
          navigate(`/courses/${courseId}`);
          return;
        }

        setValues({
          title: lesson.title,
          status: lesson.status,
          publish_date: lesson.publish_date,
          video_url: lesson.video_url
        });
      }
    } catch (error) {
      setSubmitError('Erro ao carregar dados');
      navigate('/');
    } finally {
      setIsLoadingData(false);
    }
  }, [courseId, lessonId, isEditing, user.id, navigate, setValues]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    const thumbnailUrl = getYouTubeThumbnail(values.video_url);
    setThumbnailPreview(thumbnailUrl);
  }, [values.video_url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    setIsLoading(true);
    setSubmitMessage('');
    setSubmitError('');

    try {
      const lessonData = {
        ...values,
        course_id: parseInt(courseId, 10),
        creator_id: parseInt(user.id, 10)
      };

      console.log('Salvando aula com dados:', lessonData);
      console.log('courseId original:', courseId, 'tipo:', typeof courseId);
      console.log('course_id convertido:', lessonData.course_id, 'tipo:', typeof lessonData.course_id);

      if (isEditing) {
        await lessonService.update(lessonId, lessonData);
        setSubmitMessage('Aula atualizada com sucesso!');
        setShowSuccess(true);
      } else {
        const newLesson = await lessonService.create(lessonData);
        console.log('Nova aula criada:', newLesson);
        setSubmitMessage('Aula criada com sucesso!');
        setShowSuccess(true);
      }

      setTimeout(() => {
        setShowSuccess(false);
        if (window.refreshCourseDetails) {
          window.refreshCourseDetails();
        }
        navigate(`/courses/${courseId}`);
      }, 3000);
    } catch (error) {
      setSubmitError('Erro ao salvar aula. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/courses/${courseId}`);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (isLoadingData) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <div>
      <PageHeader>
        <Title>{isEditing ? 'Editar Aula' : 'Criar Nova Aula'}</Title>
      </PageHeader>

      <FormCard>
        {course && (
          <CourseInfo>
            <h3>Curso: {course.name}</h3>
            <p>{course.description || 'Sem descrição disponível'}</p>
          </CourseInfo>
        )}

        <SuccessModal
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          title={isEditing ? 'Aula atualizada com sucesso!' : 'Aula criada com sucesso!'}
          text={
            isEditing
              ? 'As informações da aula foram atualizadas com sucesso.'
              : 'A nova aula foi criada com sucesso.'
          }
          extraButton={
            <Button variant="primary" onClick={() => navigate('/')}>
              Voltar ao menu
            </Button>
          }
        />

        {submitError && (
          <ErrorAlert>
            {submitError}
          </ErrorAlert>
        )}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Título da Aula *</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.title && errors.title}
              placeholder="Digite o título da aula"
            />
            {touched.title && errors.title && (
              <ErrorMessage>{errors.title}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="video_url">URL do Vídeo *</Label>
            <Input
              id="video_url"
              name="video_url"
              type="url"
              value={values.video_url}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.video_url && errors.video_url}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {touched.video_url && errors.video_url && (
              <ErrorMessage>{errors.video_url}</ErrorMessage>
            )}
            {values.video_url && (
              <VideoPreview>
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Pré-visualização do vídeo" />
                ) : (
                  <span>Pré-visualização indisponível</span>
                )}
              </VideoPreview>
            )}
          </FormGroup>

          <Flex gap="1rem" mobileColumn>
            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="status">Status *</Label>
              <Select
                id="status"
                name="status"
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.status && errors.status}
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="archived">Arquivado</option>
              </Select>
              {touched.status && errors.status && (
                <ErrorMessage>{errors.status}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="publish_date">Data de Publicação *</Label>
              <Input
                id="publish_date"
                name="publish_date"
                type="date"
                value={values.publish_date}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.publish_date && errors.publish_date}
                min={getTodayDate()}
              />
              {touched.publish_date && errors.publish_date && (
                <ErrorMessage>{errors.publish_date}</ErrorMessage>
              )}
            </FormGroup>
          </Flex>

          <ButtonGroup justify="flex-end" gap="1rem">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Flex align="center" justify="center">
                  <LoadingSpinner />
                  {isEditing ? 'Atualizando...' : 'Criando...'}
                </Flex>
              ) : (
                isEditing ? 'Atualizar Aula' : 'Criar Aula'
              )}
            </Button>
          </ButtonGroup>
        </form>
      </FormCard>
    </div>
  );
};

export default LessonForm;
