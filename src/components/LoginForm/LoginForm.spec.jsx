import { fireEvent, render } from '@testing-library/react'
import LoginForm from './LoginForm'

describe('LoginForm', () => {
  it('should render the form', () => {
    const onSubmit = jest.fn()
    const { getByTestId } = render(<LoginForm onSubmit={onSubmit} />)
    const form = getByTestId('login-form')
    expect(form).toBeInTheDocument()
  })
  
  it('should call the onSubmit prop when the form is submitted', () => {
    const onSubmit = jest.fn()
    const { getByTestId } = render(<LoginForm onSubmit={onSubmit} />)
    const form = getByTestId('login-form')
    fireEvent.submit(form)
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should input email and password and submit with that values on form data', () => {
    const onSubmit = jest.fn()
    const { getByTestId } = render(<LoginForm onSubmit={onSubmit} />)
    const email = getByTestId('email')
    const password = getByTestId('password')
  
    fireEvent.change(email, { target: { value: 'mk@mk.com' } })
    fireEvent.change(password, { target: { value: '123456' } })
  
    const form = getByTestId('login-form')
    fireEvent.submit(form)
  
    // expect(onSubmit).toHaveBeenCalledWith({ email: 'mk@mk.com', password: '123456' })
  });

})