# CourseSphere - Gestão de Cursos Online Colaborativa

Uma plataforma completa para gerenciamento colaborativo de cursos e aulas, permitindo múltiplos instrutores e estudantes autenticados interagirem de forma eficiente.

## 📋 Sobre o Projeto

O CourseSphere foi desenvolvido como resposta ao **Desafio Front-End - Edital 38-2025**, seguindo rigorosamente todos os requisitos especificados:

### ✅ Funcionalidades Implementadas

- **Autenticação completa** com controle de acesso
- **CRUD de Cursos** com controle de permissões
- **CRUD de Aulas** com regras de negócio específicas
- **Busca e filtros** avançados com paginação
- **Gerenciamento de Instrutores** com API externa
- **Validações robustas** em todos os formulários
- **Interface responsiva** e experiência do usuário otimizada
- **Feedbacks visuais** (loading, erro, sucesso)

### 🎯 Entidades e Regras de Negócio

#### User
- **Atributos**: name, email, password
- **Validações**: Email único, senha mínima 6 caracteres
- **Regras**: Apenas usuários autenticados acessam a plataforma

#### Course
- **Atributos**: name, description, start_date, end_date, creator_id, instructors
- **Validações**: Nome mínimo 3 caracteres, descrição máximo 500 caracteres, end_date posterior a start_date
- **Regras**: 
  - Apenas o criador pode editar/excluir o curso
  - Apenas o criador pode gerenciar instrutores

#### Lesson
- **Atributos**: title, status, publish_date, video_url, course_id, creator_id
- **Validações**: Título mínimo 3 caracteres, data futura, URL de vídeo válida
- **Regras**:
  - Qualquer instrutor do curso pode criar aulas
  - Apenas o criador da aula ou criador do curso pode editar/excluir

## 🚀 Tecnologias Utilizadas

- **React 18** com Hooks
- **React Router DOM** para navegação
- **Styled Components** para estilização
- **Axios** para requisições HTTP
- **JSON Server** como API local
- **Concurrently** para execução simultânea de servidores

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/coursesphere.git
cd coursesphere
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto em modo desenvolvimento**
```bash
npm run dev
```

Este comando iniciará simultaneamente:
- **Frontend React**: http://localhost:3000
- **API JSON Server**: http://localhost:3001

### Comandos Disponíveis

```bash
# Iniciar apenas o frontend
npm start

# Iniciar apenas a API
npm run server

# Iniciar frontend + API simultaneamente
npm run dev

# Build para produção
npm run build

# Executar testes
npm test
```

## 👤 Credenciais de Teste

Para facilitar os testes, utilize as seguintes credenciais:

**Usuário 1:**
- Email: `joao@example.com`
- Senha: `123456`

**Usuário 2:**
- Email: `maria@example.com` 
- Senha: `123456`

**Usuário 3:**
- Email: `pedro@example.com`
- Senha: `123456`

## 🗂️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── common/         # Componentes comuns (Pagination, PrivateRoute)
│   └── layout/         # Componentes de layout
├── context/            # Contextos React (AuthContext)
├── hooks/              # Hooks customizados (useForm, usePagination)
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── styles/             # Estilos globais e tema
└── utils/              # Utilitários e validações
```

## 🎨 Funcionalidades Detalhadas

![image](https://github.com/user-attachments/assets/09f84222-035f-4cdb-818c-b66bbca9ee9d)

![image](https://github.com/user-attachments/assets/0e67dce6-433c-470c-bb7d-a64ca5718444)

### 1. Sistema de Autenticação
- Login com validação de email e senha
- Proteção de rotas privadas
- Persistência de sessão no localStorage
- Logout seguro

![image](https://github.com/user-attachments/assets/99b8eed1-3c5c-44e2-b1c1-3dc84814e285)


### 2. Dashboard
- Lista de cursos do usuário (criador ou instrutor)
- Informações resumidas de cada curso
- Indicação visual do papel do usuário
- Criação rápida de novos cursos

![image](https://github.com/user-attachments/assets/4cd7284a-3bd8-4bcf-86d2-bb153a0f3f81)

### 3. Gestão de Cursos
- Formulário completo de criação/edição
- Validações em tempo real
- Controle de permissões por função
- Visualização detalhada com metadados

![image](https://github.com/user-attachments/assets/8df8f743-5189-4700-8b00-ea288d002409)

### 4. Gestão de Aulas
- CRUD completo com regras específicas
- Busca por título
- Filtros por status (draft, published, archived)
- Paginação de resultados
- Preview de vídeos

![image](https://github.com/user-attachments/assets/b75c9946-9ecf-4f5f-a5ce-2341d4dab94d)

### 5. Gerenciamento de Instrutores
- Visualização de instrutores atuais
- Adição via API externa (RandomUser.me)
- Remoção de instrutores
- Feedbacks visuais de ações

![image](https://github.com/user-attachments/assets/331ee3bb-26e6-4f1e-957b-5875b23fded8)

### 6. Sistema de Busca e Filtros
- Campo de busca por título de aulas
- Filtros combinados (status + curso)
- Resultados paginados
- Performance otimizada

## 🔒 Controle de Permissões

### Criador do Curso
- ✅ Editar/excluir curso
- ✅ Gerenciar lista de instrutores
- ✅ Criar, editar e excluir qualquer aula do curso

### Instrutor Colaborador
- ✅ Visualizar detalhes do curso
- ✅ Criar novas aulas
- ✅ Editar/excluir apenas suas próprias aulas
- ❌ Editar curso ou gerenciar instrutores

## 🌐 APIs Utilizadas

### API Local (JSON Server)
- **Base URL**: http://localhost:3001
- **Endpoints**: 
  - `/users` - Gestão de usuários
  - `/courses` - Gestão de cursos
  - `/lessons` - Gestão de aulas

### API Externa
- **RandomUser.me**: Para sugestão de novos instrutores
- **Endpoint**: https://randomuser.me/api

## 📱 Responsividade

O projeto foi desenvolvido com abordagem **mobile-first** e é totalmente responsivo, funcionando perfeitamente em:
- 📱 Dispositivos móveis (320px+)
- 📟 Tablets (768px+)
- 💻 Desktops (1024px+)

## 🎯 Diferenciais Implementados

- ✅ **Estrutura organizada** seguindo boas práticas
- ✅ **Hooks customizados** para lógicas reutilizáveis
- ✅ **Layout responsivo** e agradável
- ✅ **Feedbacks visuais** em todas as interações
- ✅ **Página de erro** personalizada
- ✅ **Utilização de API externa** para instrutores
- ✅ **Validações robustas** em todos os formulários

## 🐛 Tratamento de Erros

- Páginas de erro personalizadas (403, 404, 500)
- Mensagens de erro contextualizadas
- Fallbacks para falhas de rede
- Validações client-side e server-side

## 🔄 Estado e Performance

- Context API para gerenciamento de estado global
- Hooks customizados para lógicas específicas
- Lazy loading de componentes quando possível
- Otimização de re-renders

## 📊 Estrutura de Dados

### Usuários (users)
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "123456"
}
```

### Cursos (courses)
```json
{
  "id": 1,
  "name": "React Fundamentals",
  "description": "Aprenda os conceitos fundamentais do React",
  "start_date": "2025-01-15",
  "end_date": "2025-03-15",
  "creator_id": 1,
  "instructors": [1, 2]
}
```

### Aulas (lessons)
```json
{
  "id": 1,
  "title": "Introdução ao React",
  "status": "published",
  "publish_date": "2025-01-20",
  "video_url": "https://www.youtube.com/watch?v=example",
  "course_id": 1,
  "creator_id": 1
}
```

## 🚀 Deploy

O projeto está pronto para deploy em plataformas como:
- **Netlify**
- **Vercel** 
- **GitHub Pages**

Para build de produção:
```bash
npm run build
```

## 🤝 Contribuição

Este projeto foi desenvolvido seguindo as especificações do Edital 38-2025. Para contribuições:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos/teste técnico conforme Edital 38-2025.

---

**Desenvolvido com ❤️ seguindo todas as especificações do Desafio Front-End**
