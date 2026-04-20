import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const InvoiceProtectedRoute = ({ children }) => {
  const isAuthenticated = authAPI.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/invoice-login" replace />;
  }
  
  return children;
};

export default InvoiceProtectedRoute;
