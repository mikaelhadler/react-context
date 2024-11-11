import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

// ❌ Problema: Cada atualização re-renderiza todos os componentes consumidores
export const DataProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems(prev => [...prev, item]);
  };

  return (
    <DataContext.Provider value={{ items, addItem }}>
      {children}
    </DataContext.Provider>
  );
};