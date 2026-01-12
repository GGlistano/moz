import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoanApplicationPage from './pages/LoanApplicationPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/solicitar" element={<LoanApplicationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
