import './App.css';
import NavigationBar from './NavigationBar';
import Home from './Home';
import Hymns from './Hymns';
import Files from './Files';
import { FileTypeAndBookProvider } from './FileTypesAndBooksContext';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './NotFound';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <div className="content">
          <FileTypeAndBookProvider>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/hymns" element={<Hymns />} />
              <Route exact path="/files" element={<Files />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </FileTypeAndBookProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;
