import PropTypes from 'prop-types';
import './LoginForm.css';

const LoginForm = ({ onSubmit }) => (
  <form id='login-form' onSubmit={onSubmit} className='login-form' data-testid="login-form">
    <input type="email" name="email" placeholder="E-mail" data-testid="email" />
    <input type="password" name="password" placeholder="Password" data-testid="password"/>
    <button type="submit">Login</button>
  </form>
)

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default LoginForm