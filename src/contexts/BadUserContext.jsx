import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

// ❌ Problema: Hook com chamada API dentro do contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const useUserData = () => {
    useEffect(() => {
      const fetchUser = async () => {
        const response = await fetch('/api/user');
        const data = await response.json();
        setUser(data);
      };
      fetchUser();
    }, []);

    return user;
  };

  return (
    <UserContext.Provider value={{ user, useUserData }}>
      {children}
    </UserContext.Provider>
  );
};