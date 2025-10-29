import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { registerUser } from '../../services/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/slices/authSlice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      const registerResponse = await dispatch(
        registerUser({ name: userName, email, password })
      ).unwrap();

      const loginResponse = await dispatch(
        loginUser({ email, password })
      ).unwrap();

      navigate('/');
    } catch (err) {
      let message: string;

      if (
        err &&
        typeof err === 'object' &&
        'message' in err &&
        typeof err.message === 'string'
      ) {
        message = err.message;
      } else {
        message = 'Произошла ошибка. Попробуйте еще раз.';
      }
      setErrorText(message);
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
