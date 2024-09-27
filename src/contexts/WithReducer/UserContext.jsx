import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  user: null,
  loading: false
};

const UserContext = createContext(initialState);

const UserProvider = ({ reducer, initialState, children }) => (
  <UserContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </UserContext.Provider>
);

UserProvider.propTypes = {
  reducer: PropTypes.func.isRequired,
  initialState: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };