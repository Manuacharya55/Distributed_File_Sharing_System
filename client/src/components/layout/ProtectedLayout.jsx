import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavBar from '../headers/NavBar';
import Footer from '../headers/Footer';

const ProtectedLayout = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <NavBar />
      <Outlet />
      <Footer/>
    </>
  );
};

export default ProtectedLayout;
