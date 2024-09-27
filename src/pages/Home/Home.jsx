import { useReducer } from "react";
import { Spinner } from "../../components/Spinner/Spinner";
import { useUser } from "../../contexts/WithReducer/reducers/userReducer";

let count = 0;
export function Home() {
  const { user, loading, error } = useUser();

  return (
    <div className="app">

    </div>
  );
}

export default { Home }