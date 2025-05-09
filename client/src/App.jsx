import dotenv from 'dotenv'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Beneficiaries from './pages/Beneficiaries';
import HealthStatus from './pages/HealthStatus';
import axios from 'axios';

// Set up axios defaults
const token = "3f2504e0-4f89-11ed-a861-0242ac120002"
axios.defaults.baseURL = "https://poshan-tau.vercel.app/"
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link to="/" className="navbar-brand">Poshan Tracker</Link>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/beneficiaries" className="nav-link">Beneficiaries</Link>
            </li>
            <li className="nav-item">
              <Link to="/health-status" className="nav-link">Health Status</Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/health-status" element={<HealthStatus />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;