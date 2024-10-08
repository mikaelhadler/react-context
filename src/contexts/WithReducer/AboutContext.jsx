import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getUser } from "../../api/dummy-json";

const initialState = {
  about: null,
  loading: false,
  nickname: ''
};

export const AboutContext = createContext(initialState);
export const useAbout = () => useContext(AboutContext);
export const AboutContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(initialState.loading);
  const [about, setAbout] = useState(initialState.about);

  const setNickname = (nickname) => {
    setAbout((prev) => ({ ...prev, nickname }));
  }

  const getUserDetails = async () => {
    try {
      setLoading(true)
      setAbout(await getUser());
    } catch (error) {
      console.error('getUserDetails', error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <AboutContext.Provider
      value={{
        ...about,
        loading,
        setNickname
      }}
    >
      {children}
    </AboutContext.Provider>
  );
};

AboutContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default { AboutContext, useAbout, AboutContextProvider };