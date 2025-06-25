export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

export const validateFutureDate = (date) => {
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return dateObj >= today;
};

export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end > start;
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateVideoUrl = (url) => {
  if (!validateUrl(url)) return false;
  
  const videoPatterns = [
    /youtube\.com\/watch\?v=/,
    /youtu\.be\//,
    /vimeo\.com\//,
    /\.mp4$/,
    /\.webm$/,
    /\.ogg$/
  ];
  
  return videoPatterns.some(pattern => pattern.test(url));
};

export const courseValidationRules = {
  name: {
    required: true,
    minLength: 3,
    requiredMessage: 'Nome do curso é obrigatório',
    minLengthMessage: 'Nome deve ter pelo menos 3 caracteres'
  },
  description: {
    maxLength: 500,
    maxLengthMessage: 'Descrição deve ter no máximo 500 caracteres'
  },
  start_date: {
    required: true,
    custom: (value) => {
      if (!validateDate(value)) return 'Data de início inválida';
      return null;
    }
  },
  end_date: {
    required: true,
    custom: (value, allValues) => {
      if (!validateDate(value)) return 'Data de fim inválida';
      if (allValues.start_date && !validateDateRange(allValues.start_date, value)) {
        return 'Data de fim deve ser posterior à data de início';
      }
      return null;
    }
  }
};

export const lessonValidationRules = {
  title: {
    required: true,
    minLength: 3,
    requiredMessage: 'Título da aula é obrigatório',
    minLengthMessage: 'Título deve ter pelo menos 3 caracteres'
  },
  status: {
    required: true,
    requiredMessage: 'Status é obrigatório'
  },
  publish_date: {
    required: true,
    custom: (value) => {
      if (!validateDate(value)) return 'Data de publicação inválida';
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate < today) return 'Data de publicação deve ser hoje ou uma data futura';
      return null;
    }
  },
  video_url: {
    required: true,
    custom: (value) => {
      if (!validateVideoUrl(value)) return 'URL de vídeo inválida';
      return null;
    }
  }
};

export const userValidationRules = {
  name: {
    required: true,
    requiredMessage: 'Nome é obrigatório'
  },
  email: {
    required: true,
    custom: (value) => {
      if (!validateEmail(value)) return 'Email inválido';
      return null;
    }
  },
  password: {
    required: true,
    minLength: 6,
    requiredMessage: 'Senha é obrigatória',
    minLengthMessage: 'Senha deve ter pelo menos 6 caracteres'
  }
};

export const loginValidationRules = {
  email: {
    required: true,
    custom: (value) => {
      if (!validateEmail(value)) return 'Email inválido';
      return null;
    }
  },
  password: {
    required: true,
    requiredMessage: 'Senha é obrigatória'
  }
};
