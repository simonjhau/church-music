import './App.css';
import NavigationBar from './NavigationBar';
import Home from './Home';
import Hymns from './Hymns';
import Files from './Files';
import Masses from './Masses';
import { TypeAndBookProvider } from './TypesAndBooksContext.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './NotFound';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <div className="content">
          <TypeAndBookProvider>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/hymns" element={<Hymns />} />
              <Route exact path="/files" element={<Files />} />
              <Route exact path="/masses" element={<Masses />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TypeAndBookProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;
