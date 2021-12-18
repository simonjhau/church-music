import '../styles/App.css';
import NavigationBar from '../components/NavigationBar';
import HomePage from '../pages/HomePage';
import HymnsPage from '../pages/HymnsPage';
import Files from '../pages/FilesPage';
import MassesPage from '../pages/MassesPage';
import { TypeAndBookProvider } from '../context/TypesAndBooksContext';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFoundPage from '../pages/NotFound';

const App: React.FC<{}> = () => {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <div className="content">
          <TypeAndBookProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/hymns" element={<HymnsPage />} />
              <Route path="/files" element={<Files />} />
              <Route path="/masses" element={<MassesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </TypeAndBookProvider>
        </div>
      </div>
    </Router>
  );
};

export default App;
