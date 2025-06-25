import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './context/AuthContext';
import { GlobalStyle, theme } from './styles/GlobalStyles';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/common/PrivateRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CourseForm from './pages/CourseForm';
import CourseDetails from './pages/CourseDetails';
import LessonForm from './pages/LessonForm';
import InstructorManagement from './pages/InstructorManagement';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/courses/new" element={
              <PrivateRoute>
                <Layout>
                  <CourseForm />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/courses/:id" element={
              <PrivateRoute>
                <Layout>
                  <CourseDetails />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/courses/:id/edit" element={
              <PrivateRoute>
                <Layout>
                  <CourseForm />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/courses/:courseId/lessons/new" element={
              <PrivateRoute>
                <Layout>
                  <LessonForm />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/courses/:courseId/lessons/:lessonId/edit" element={
              <PrivateRoute>
                <Layout>
                  <LessonForm />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/courses/:courseId/instructors" element={
              <PrivateRoute>
                <Layout>
                  <InstructorManagement />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/404" element={<ErrorPage code="404" />} />
            <Route path="*" element={<ErrorPage code="404" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
