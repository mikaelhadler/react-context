import { Switch, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { About } from "./pages/About/About";
import { Users } from "./pages/Users/Users";
import { Login } from "./pages/Login/Login";
import { WithReducer } from "./pages/WithReducer/WithReducer";
import { WithoutReducer } from "./pages/WithoutReducer/WithoutReducer";

export function Outlet() {
  return (
    <main className="container">
      <Switch>
        <Route path="/with-reducer-context">
          <WithReducer />
        </Route>
        <Route path="/without-reducer-context">
          <WithoutReducer />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </main>
  );
}

export default { Outlet };
