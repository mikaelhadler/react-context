import { useAbout } from "../../hooks/useAbout";
import { Spinner } from "../../components/Spinner/Spinner";
import { AboutContextProvider } from "../../contexts/AboutContext";

const AboutContent = () => {
  const { email, loading } = useAbout();
  return (
    <>
      <h2>About</h2>
      {loading && <Spinner />}
      {email && <h3>{email}</h3>}
    </>
  );
};
export function About() {
  return <AboutContextProvider>
    <AboutContent />
  </AboutContextProvider>;
}

export default { About };
