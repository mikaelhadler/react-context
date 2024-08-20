import { Switch, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { About } from "./pages/About/About";
import { Users } from "./pages/Users/Users";

export function Outlet() {
  return (
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
  );
}

export default { Outlet };
