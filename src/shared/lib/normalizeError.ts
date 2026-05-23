import axios from 'axios';

export const normalizeError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) {
      return message.join(', ');
    }

    return message || error.message || 'Запит не виконано';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Щось пішло не так';
};
