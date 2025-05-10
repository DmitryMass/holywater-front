import { PATHS } from '@utils/paths';

import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="bg-base-200 flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="text-primary-focus mb-4 text-6xl font-bold">404</div>
        <h1 className="text-base-content mb-6 text-2xl font-bold md:text-4xl">
          Сторінку не знайдено
        </h1>
        <p className="text-base-content/70 mx-auto mb-8 max-w-md">
          Упс! Здається, запитувана сторінка не існує або була переміщена.
        </p>
        <Link to={PATHS.HOME} className="btn btn-primary btn-lg">
          Повернутися на головну
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
