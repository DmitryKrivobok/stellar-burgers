import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from 'react-redux';
import { logout } from '../../services/slices/authSlice';
import { AppDispatch } from '../../services/store';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
