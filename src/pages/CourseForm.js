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
import Modal from '../components/common/Modal';
import { MdCheckCircleOutline } from 'react-icons/md';

const Header = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.gray800};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const FormCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
`;

const ButtonGroup = styled(Flex)`
  margin-top: ${(props) => props.theme.spacing.xl};
  padding-top: ${(props) => props.theme.spacing.xl};
  border-top: 1px solid ${(props) => props.theme.colors.gray200};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

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

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditing);
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setValues
  } = useForm(
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

      // Permitir acesso ao criador ou instrutores
      const isCreator = course.creator_id === user.id;
      const isInstructor =
        Array.isArray(course.instructors) &&
        course.instructors.map(String).includes(String(user.id));
      if (!isCreator && !isInstructor) {
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
    setSubmitError('');

    try {
      const courseData = {
        ...values,
        creator_id: user.id,
        instructors: isEditing ? undefined : [user.id]
      };

      if (isEditing) {
        await courseService.update(id, courseData);
        setShowSuccess(true);
      } else {
        await courseService.create(courseData);
        setShowSuccess(true);
        // Remover navegação automática, usuário decide quando voltar
        // setTimeout(() => {
        //   navigate(`/courses/${newCourse.id}`);
        // }, 1500);
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
    <>
      <Modal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        closeOnOverlayClick={false}
        hideCloseButton={true}
      >
        <SuccessContent>
          <SuccessIcon />
          <SuccessTitle>
            Curso {isEditing ? 'atualizado' : 'criado'} com sucesso!
          </SuccessTitle>
          <SuccessText>
            {isEditing
              ? 'As informações do curso foram atualizadas com sucesso.'
              : 'O novo curso foi criado com sucesso.'}
          </SuccessText>
          <SuccessButtonGroup>
            <SuccessCloseButton onClick={() => setShowSuccess(false)}>
              Fechar
            </SuccessCloseButton>
            <Button variant="primary" onClick={() => navigate('/')}>
              Voltar ao menu
            </Button>
          </SuccessButtonGroup>
        </SuccessContent>
      </Modal>
      <div>
        <Header>
          <div style={{ marginBottom: '1rem' }}>
            <Button onClick={() => navigate(-1)} variant="secondary">
              &larr; Voltar
            </Button>
          </div>
          <Title>{isEditing ? 'Editar Curso' : 'Criar Novo Curso'}</Title>
        </Header>

        <FormCard>
          {submitError && (
            <ErrorMessage style={{ marginBottom: 16 }}>
              {submitError}
            </ErrorMessage>
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

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Flex align="center" justify="center">
                    <LoadingSpinner />
                    {isEditing ? 'Atualizando...' : 'Criando...'}
                  </Flex>
                ) : isEditing ? (
                  'Atualizar Curso'
                ) : (
                  'Criar Curso'
                )}
              </Button>
            </ButtonGroup>
          </form>
        </FormCard>
      </div>
    </>
  );
};

export default CourseForm;
