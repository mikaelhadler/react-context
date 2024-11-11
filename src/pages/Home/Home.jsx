import { Spinner } from "../../components/Spinner/Spinner";
import { useUser } from "../../contexts/WithReducer/reducers/userReducer";

export function Home() {
  const { user, loading, error, users } = useUser();

  return (
    <div className="app">
      <h1 className="text-red-300">Home</h1>
      {loading && <Spinner />}
      {error && <p>Error: {error.message}</p>}
      {user && <p>User: {user.name}</p>}
      <ul className="divide-y divide-gray-200">
        {users.map((person) => (
          <li key={person.email} className="py-4 flex">
            <img className="h-10 w-10 rounded-full" src={person.image} alt="" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{person.name}</p>
              <p className="text-sm text-gray-500">{person.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default { Home };
