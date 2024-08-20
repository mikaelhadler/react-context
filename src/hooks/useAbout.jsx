import { useContext } from "react";
import { AboutContext } from "../contexts/AboutContext";

export const useAbout = () => {
  const context = useContext(AboutContext);
  if (!context) {
    throw new Error(
      "useAbout must be used within a AboutContext"
    );
  }
  return context;
};

export default { useAbout };
