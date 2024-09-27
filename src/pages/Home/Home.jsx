import { Spinner } from "../../components/Spinner/Spinner";
import { useUser } from "../../contexts/WithReducer/reducers/userReducer";

export function Home() {
  const { user, loading, error } = useUser();

  return (
    <div className="app">
      <h1>Home</h1>
      {loading && <Spinner />}
      {error && <p>Error: {error.message}</p>}
      {user && <p>User: {user.name}</p>}
    </div>
  );
}

export default { Home }