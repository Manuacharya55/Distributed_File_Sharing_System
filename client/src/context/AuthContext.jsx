import { createContext, useContext, useState, useMemo } from 'react';
import axios from 'axios';
import { setToken as setApiToken } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(localStorage.getItem('token'));

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    setToken_(newToken);
  };

  useMemo(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setApiToken(token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setApiToken(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
