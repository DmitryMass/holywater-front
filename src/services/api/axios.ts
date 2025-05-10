import axios from 'axios';
import { toast } from 'sonner';

// API URL из переменных окружения или по умолчанию для разработки
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Создаем инстанс axios с настройками по умолчанию
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 секунд таймаут
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Перехватчик запросов для добавления общей логики к каждому запросу
axiosInstance.interceptors.request.use(
  (config) => {
    // Здесь можно добавить авторизационный заголовок, если необходимо
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов для обработки ошибок и формирования стандартного формата
axiosInstance.interceptors.response.use(
  (response) => {
    // Успешный ответ
    return response;
  },
  (error) => {
    // Обработка ошибок
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Сталася помилка при зверненні до сервера';

    // Показываем уведомление об ошибке, если это не отключено
    // Заголовок X-Skip-Toast-Error можно добавить, чтобы избежать дублирования тостов
    if (!error.config?.headers?.['X-Skip-Toast-Error']) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
