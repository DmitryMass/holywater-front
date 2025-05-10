import BuilderPage from '@pages/BuilderPage';
import HomePage from '@pages/HomePage/HomePage';
import NotFoundPage from '@pages/NotFoundPage';
import { PATHS } from '@utils/paths';

import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      <Route path={PATHS.HOME} element={<HomePage />} />
      <Route path={PATHS.BUILDER} element={<BuilderPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
