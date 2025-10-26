import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUser } from '../../services/slices/authSlice';
import { AppDispatch } from '../../services/store';
import { useDispatch } from 'react-redux';

export const Login: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
