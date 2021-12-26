import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { TypeAndBookProvider } from '../context/TypesAndBooksContext';
import Files from '../pages/FilesPage';
import HomePage from '../pages/HomePage';
import HymnsPage from '../pages/HymnsPage';
import MassesPage from '../pages/MassesPage';
import NotFoundPage from '../pages/NotFound';
import '../styles/App.css';

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
