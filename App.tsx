import React from 'react';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import ResultPage from './pages/ResultPage';
import { useAppContext } from './context/AppContext';
import { Loader } from './components/Loader';

const App: React.FC = () => {
  const { page, isLoading } = useAppContext();

  const renderPage = () => {
    switch (page.name) {
      case 'home':
        return <HomePage />;
      case 'details':
        return <DetailsPage experienceId={page.experienceId} />;
      case 'checkout':
        return <CheckoutPage />;
      case 'result':
        return <ResultPage status={page.status} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="bg-secondary-bg min-h-screen text-text-primary">
      <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-lg">
        {isLoading && <Loader />}
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
