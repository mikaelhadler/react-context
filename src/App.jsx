import { BrowserRouter as Router } from "react-router-dom";

import { Navbar } from "./components/Navbar/Navbar";
import { Outlet } from "./Outlet";

import "./App.css";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Outlet />
    </Router>
  );
}
