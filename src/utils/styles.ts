import { twMerge } from 'tailwind-merge';

// Функция для объединения классов Tailwind
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return twMerge(classes.filter(Boolean) as string[]);
};
