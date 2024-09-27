import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useAbout } from "../../contexts/WithReducer/AboutContext";
import { Spinner } from "../../components/Spinner/Spinner";
import { AboutContextProvider } from "../../contexts/WithReducer/AboutContext";
import './About.css'

let HeaderRerenderCounter = 0
const HeaderComponent = ({ email }) => <h3>Email: {email}</h3>
HeaderComponent.propTypes = {
  email: PropTypes.string.isRequired
}
const Header = () => {
  const { email } = useAbout();
  return email && useMemo(() => <HeaderComponent email={email}/>, [email])
};

const NickName = () => {
  const { nickname } = useAbout();
  const NickNameComponent = useMemo(() => <h3>Nickname: {nickname}</h3>, [nickname]);

  return nickname && NickNameComponent
}

let FormRerenderCounter = 0;
const Form = () => {
  const { nickname, setNickname } = useAbout();
  const [nick, setNick] = useState(nickname || '');
  console.log('Rerender - Form', FormRerenderCounter++);
  return (
    <div className='form'>
      <input value={nick} onChange={e => setNick(e.target.value)} placeholder='Type your nickname here' />
      <button onClick={() => setNickname(nick)}>Set Nickname</button>
    </div>
  );
}

let AboutContentRerenderCounter = 0;
const AboutContent = () => {
  const { loading } = useAbout();
  console.log('Rerender - AboutContent', AboutContentRerenderCounter++);
  return loading ? (
    <Spinner />
  ) : (
    <>
      <h2>About</h2>
      <Header />
      <NickName />
      <Form />
    </>
  );
};
export function About() {
  return (
    <AboutContextProvider>
      <AboutContent />
    </AboutContextProvider>
  );
}

export default { About };
