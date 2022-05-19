import { useAuth0 } from '@auth0/auth0-react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import Loading from '../components/General/Loading/Loading';
import NavigationBar from '../components/General/NavigationBar/NavigationBar';
import { TypeAndBookProvider } from '../context/TypesAndBooksContext';
import CalendarPage from '../pages/CalendarPage';
import HomePage from '../pages/HomePage';
import HymnsPage from '../pages/HymnsPage';
import MassesPage from '../pages/MassesPage';
import NotFoundPage from '../pages/NotFound';
import '../styles/App.css';

const App: React.FC<{}> = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <NavigationBar />
      <div className="content">
        <TypeAndBookProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hymns"
              element={
                <ProtectedRoute>
                  <HymnsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/masses"
              element={
                <ProtectedRoute>
                  <MassesPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </TypeAndBookProvider>
      </div>
    </div>
  );
};

export default App;
