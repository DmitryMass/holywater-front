import { PATHS } from '@utils/paths';

import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #2a0845 0%, #1b133e 100%)',
        backgroundSize: 'cover',
      }}
    >
      <div className="bg-base-100 bg-opacity-10 max-w-3xl rounded-lg p-8 text-center shadow-xl backdrop-blur-sm">
        <h1
          className="font-dancing-script mb-4 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
          style={{ backgroundImage: 'linear-gradient(90deg, #f5a1ff 0%, #8662c7 100%)' }}
        >
          Web Builder
        </h1>

        <div className="text-basic mb-8 max-w-sm text-white/90">
          <p className="mb-4">
            Створюйте та налаштовуйте інтерфейс для мобільного додатку за допомогою простого та
            зручного конструктора.
          </p>
          <p>
            Додавайте секції, елементи, налаштовуйте їх властивості та отримуйте готову конфігурацію
            інтерфейсу.
          </p>
        </div>

        <div className="space-y-4 md:flex md:justify-center md:space-y-0 md:space-x-4">
          <Link
            to={PATHS.BUILDER}
            className="btn btn-primary btn-lg group hover:shadow-primary/50 px-8 shadow-lg transition-all duration-300"
          >
            Відкрити конструктор
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 text-sm text-white/50">
        © 2025 My Drama-Web. Усі права захищені.
      </div>
      <div className="absolute bottom-10 text-sm text-white/50">
        Developed by{' '}
        <a
          href="https://www.linkedin.com/in/dmitry-moskalenko-69a19a226/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dmytro Moskalenko
        </a>
      </div>
    </div>
  );
};

export default HomePage;
