import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { getUser } from "../api/github";

export const useUser = () => useContext(UserContext);

export const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: { ...action.user },
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    case "LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    default:
      return state;
  }
};

export const userDispatch = (dispatch) => ({
  login: async () => {
    try {
      dispatch({ type: "LOADING", loading: true });
      dispatch({ type: "LOGIN", user: await getUser() });
    } catch (error) {
      dispatch({ type: "ERROR", error });
    } finally {
      dispatch({ type: "LOADING", loading: false });
    }
  },
  logout: () => dispatch({ type: "LOGOUT" }),
});
