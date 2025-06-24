import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/api';
import { useForm } from '../hooks/useForm';
import { courseValidationRules } from '../utils/validation';
import { 
  Card, 
  Button, 
  Input, 
  TextArea,
  Label, 
  ErrorMessage, 
  FormGroup, 
  Flex,
  LoadingSpinner 
} from '../styles/GlobalStyles';

const Header = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.gray800};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FormCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
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

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditing);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const { values, errors, touched, handleChange, handleBlur, validateAll, setValues } = useForm(
    {
      name: '',
      description: '',
      start_date: '',
      end_date: ''
    },
    courseValidationRules
  );

  const loadCourse = useCallback(async () => {
    try {
      const course = await courseService.getById(id);
      
      if (course.creator_id !== user.id) {
        navigate('/');
        return;
      }

      setValues({
        name: course.name,
        description: course.description || '',
        start_date: course.start_date,
        end_date: course.end_date
      });
    } catch (error) {
      setSubmitError('Erro ao carregar dados do curso');
    } finally {
      setIsLoadingData(false);
    }
  }, [id, user.id, navigate, setValues]);

  useEffect(() => {
    if (isEditing) {
      loadCourse();
    }
  }, [isEditing, loadCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    setIsLoading(true);
    setSubmitMessage('');
    setSubmitError('');

    try {
      const courseData = {
        ...values,
        creator_id: user.id,
        instructors: isEditing ? undefined : [user.id]
      };

      if (isEditing) {
        await courseService.update(id, courseData);
        setSubmitMessage('Curso atualizado com sucesso!');
      } else {
        const newCourse = await courseService.create(courseData);
        setSubmitMessage('Curso criado com sucesso!');
        setTimeout(() => {
          navigate(`/courses/${newCourse.id}`);
        }, 1500);
      }
    } catch (error) {
      setSubmitError('Erro ao salvar curso. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(isEditing ? `/courses/${id}` : '/');
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
      <Header>
        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={() => navigate(-1)} variant="secondary">&larr; Voltar</Button>
        </div>
        <Title>{isEditing ? 'Editar Curso' : 'Criar Novo Curso'}</Title>
      </Header>

      <FormCard>
        {submitMessage && (
          <SuccessMessage>
            {submitMessage}
          </SuccessMessage>
        )}

        {submitError && (
          <ErrorAlert>
            {submitError}
          </ErrorAlert>
        )}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Nome do Curso *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.name && errors.name}
              placeholder="Digite o nome do curso"
            />
            {touched.name && errors.name && (
              <ErrorMessage>{errors.name}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Descrição</Label>
            <TextArea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.description && errors.description}
              placeholder="Descreva o curso (máximo 500 caracteres)"
              rows={4}
            />
            {touched.description && errors.description && (
              <ErrorMessage>{errors.description}</ErrorMessage>
            )}
          </FormGroup>

          <Flex gap="1rem" mobileColumn>
            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="start_date">Data de Início *</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={values.start_date}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.start_date && errors.start_date}
              />
              {touched.start_date && errors.start_date && (
                <ErrorMessage>{errors.start_date}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="end_date">Data de Fim *</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={values.end_date}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.end_date && errors.end_date}
              />
              {touched.end_date && errors.end_date && (
                <ErrorMessage>{errors.end_date}</ErrorMessage>
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
                isEditing ? 'Atualizar Curso' : 'Criar Curso'
              )}
            </Button>
          </ButtonGroup>
        </form>
      </FormCard>
    </div>
  );
};

export default CourseForm;
