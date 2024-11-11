import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

// ❌ Problema: Múltiplos estados interdependentes causando re-renders desnecessários
export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchPosts();
    fetchComments();
  }, []);

  // Cada atualização causa re-render em todos os consumidores
  const updateUser = (userId, data) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, ...data } : user
    ));
  };

  return (
    <DataContext.Provider value={{ users, posts, comments, updateUser }}>
      {children}
    </DataContext.Provider>
  );
};