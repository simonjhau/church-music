import './App.css';
import NavigationBar from './components/NavigationBar';
import Home from './Home';
import HymnsPage from './pages/HymnsPage';
import Files from './pages/FilesPage';
import MassesPage from './pages/MassesPage';
import { TypeAndBookProvider } from './TypesAndBooksContext.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFoundPage from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <div className="content">
          <TypeAndBookProvider>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/hymns" element={<HymnsPage />} />
              <Route exact path="/files" element={<Files />} />
              <Route exact path="/masses" element={<MassesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </TypeAndBookProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;
