import { createContext } from "react";

export const WithReducerChildOneContext = createContext();

export const WithReducerChildOneProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <WithReducerChildOneContext.Provider value={{ state, dispatch }}>
      {children}
    </WithReducerChildOneContext.Provider>
  );
};

export default WithReducerChildOneContext;
