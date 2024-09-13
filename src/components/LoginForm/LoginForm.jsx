import PropTypes from 'prop-types';

function LoginForm({ onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <input type="email" name="username" placeholder="E-mail" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  )
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default LoginForm