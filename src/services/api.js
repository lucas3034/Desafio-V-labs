import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';
const EXTERNAL_API_URL = 'https://randomuser.me/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const authService = {
  async login(email, password) {
    try {
      const response = await api.get('/users');
      const user = response.data.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Email ou senha inválidos');
      }
      
      return user;
    } catch (error) {
      throw new Error('Erro ao fazer login');
    }
  }
};

export const userService = {
  async getAll() {
    const response = await api.get('/users');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async create(userData) {
    const existingUsers = await api.get('/users');
    const emailExists = existingUsers.data.some(u => u.email === userData.email);
    if (emailExists) {
      throw new Error('Já existe um usuário com este email');
    }
    const response = await api.post('/users', userData);
    return response.data;
  },

  async update(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/users/${id}`);
  }
};

export const courseService = {
  async getAll() {
    const response = await api.get('/courses');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  async create(courseData) {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  async update(id, courseData) {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/courses/${id}`);
  },

  async getUserCourses(userId) {
    const response = await api.get('/courses');
    return response.data.filter(course => 
      course.creator_id === userId || course.instructors.includes(userId)
    );
  }
};

export const lessonService = {
  async getAll() {
    const response = await api.get('/lessons');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },

  async getByCourse(courseId) {
    const response = await api.get(`/lessons?course_id=${courseId}`);
    return response.data;
  },

  async create(lessonData) {
    const processedData = {
      ...lessonData,
      creator_id: parseInt(lessonData.creator_id, 10)
    };
    console.log('API: Salvando aula com dados processados:', processedData);
    const response = await api.post('/lessons', processedData);
    return response.data;
  },

  async update(id, lessonData) {
    const response = await api.put(`/lessons/${id}`, lessonData);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/lessons/${id}`);
  },

  async search(courseId, filters = {}) {
    const response = await api.get(`/lessons?course_id=${courseId}`);
    let lessons = response.data;

    if (filters.title) {
      lessons = lessons.filter(lesson => 
        lesson.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.status) {
      lessons = lessons.filter(lesson => lesson.status === filters.status);
    }

    return lessons;
  }
};

export const externalService = {
  async getRandomUsers(count = 5) {
    try {
      const response = await axios.get(`${EXTERNAL_API_URL}?results=${count}`);
      return response.data.results.map(user => ({
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        picture: user.picture.medium
      }));
    } catch (error) {
      throw new Error('Erro ao buscar usuários externos');
    }
  }
};
