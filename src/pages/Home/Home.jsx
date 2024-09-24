import { useReducer } from "react";
import { userReducer, userDispatch } from "../../hooks/useUser";
import { Spinner } from "../../components/Spinner/Spinner";
let count = 0;
export function Home() {
  
  console.log('Home - Rerender', count++);
  
  return (
    <div className="app">
      
    </div>
  );
}

export default { Home }