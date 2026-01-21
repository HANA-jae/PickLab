import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import HomePage from './features/home/pages/HomePage';
import EatHome from './features/eat/pages/EatHome';
import GameHome from './features/game/pages/GameHome';
import QuizHome from './features/quiz/pages/QuizHome';
import AdminPage from './features/admin/pages/AdminPage';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/eat" element={<EatHome />} />
            <Route path="/game" element={<GameHome />} />
            <Route path="/quiz" element={<QuizHome />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
}

export default App;
