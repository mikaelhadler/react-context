import LoginForm from '../../components/LoginForm/LoginForm'

export function Login() {
  const onSubmit = () => {
    alert('submit')
  }
  return (
    <LoginForm onSubmit={onSubmit} />
  )
}

export default Login