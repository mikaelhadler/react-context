import { useReducer } from "react";
import { userReducer, userDispatch } from "../../hooks/useUser";
import { Spinner } from "../../components/Spinner/Spinner";
let count = 0;
export function Home() {
  const [state, dispatch] = useReducer(userReducer);
  const { login, logout } = userDispatch(dispatch);
  console.log('Home - Rerender', count++);
  
  return (
    <div className="app">
      {state?.loading ? <Spinner /> : null}
      {state?.user && <h1>Welcome, {state.user.name}!</h1>}
      <button className="primary" onClick={() => login({ name: "John Doe", ...state })}>Login</button>
      <button className="secondary" onClick={() => logout()}>Logout</button>
    </div>
  );
}

export default { Home }