import { useReducer } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { userReducer, userDispatch } from "./hooks/useUser";
import Spinner from "./components/Spinner/Spinner";

import "./App.css";

export default function App() {
  return (
    <Router>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
        </ul>
      </nav>
      <main className="container">
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

function Home() {
  const [state, dispatch] = useReducer(userReducer);
  const { login, logout } = userDispatch(dispatch);

  return (
    <div className="app">
      {state?.loading && <Spinner />}
      {state?.user && <h1>Welcome, {state.user.name}!</h1>}
      <button className="primary" onClick={() => login({ name: "John Doe", ...state })}>Login</button>
      <button className="secondary" onClick={() => logout()}>Logout</button>
    </div>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
