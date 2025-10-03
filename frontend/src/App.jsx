import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Preferences from './pages/Preferences';
import GenerateContent from './pages/GenerateContent';
import Posts from './pages/Posts';
import Calendar from './pages/Calendar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/preferences"
            element={
              <PrivateRoute>
                <Preferences />
              </PrivateRoute>
            }
          />
          <Route
            path="/generate"
            element={
              <PrivateRoute>
                <GenerateContent />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <PrivateRoute>
                <Posts />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <Calendar />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
