import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Ajusta la ruta según estructura
import api from '../../api'; // Your axios instance
import toast from 'react-hot-toast';

const AxiosInterceptor = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    // Variable para guardar la referencia del interceptor y poder expulsarlo después
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Verificar si es un error de suspensión o no autorizado crítico
        if (error.response) {
          const { status, data } = error.response;

          // Caso: Usuario Suspendido
          if (status === 403 && (data?.message?.toLowerCase().includes('suspen') || data?.error?.toLowerCase().includes('suspen'))) {
            toast.error("Tu cuenta ha sido suspendida por seguridad. Contacta al administrador.");
            logout();
            navigate('/login');
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup: remover el interceptor cuando el componente se desmonte
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [logout, navigate]);

  return null; // Este componente no renderiza nada visualmente
};

export default AxiosInterceptor;
