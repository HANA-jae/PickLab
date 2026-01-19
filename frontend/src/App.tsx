import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './features/home/pages/HomePage';
import EatHome from './features/eat/pages/EatHome';
import GameHome from './features/game/pages/GameHome';
import TestHome from './features/test/pages/TestHome';
import AdminPage from './features/admin/pages/AdminPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/eat" element={<EatHome />} />
          <Route path="/game" element={<GameHome />} />
          <Route path="/test" element={<TestHome />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
