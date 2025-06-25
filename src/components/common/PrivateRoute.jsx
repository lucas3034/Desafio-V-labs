import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, Flex } from '../../styles/GlobalStyles';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
        <LoadingSpinner />
      </Flex>
    );
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
