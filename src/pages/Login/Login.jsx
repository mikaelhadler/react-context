import { useReducer } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import { userDispatch, userReducer } from "../../hooks/useUser";

export function Login() {
  const [state, dispatch] = useReducer(userReducer);
  const { login, logout } = userDispatch(dispatch);
  
  {
    state?.loading ? <Spinner /> : null;
  }
  {
    state?.user && <h1>Welcome, {state.user.name}!</h1>;
  }
  <button
    className="primary"
    onClick={() => login({ name: "John Doe", ...state })}
  >
    Login
  </button>;
  {
    state?.user && (
      <button className="secondary" onClick={() => logout()}>
        Logout
      </button>
    );
  }
  const onSubmit = (e) => {
    e.preventDefault()
    console.log({
      email: e.target.email.value,
      password: e.target.password.value
    });
    
  };
  return <LoginForm onSubmit={onSubmit} />;
}

export default Login;
