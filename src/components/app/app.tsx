import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import React from 'react';
import { ReactNode, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Link,
  Outlet,
  Router
} from 'react-router-dom';
import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails,
  BurgerConstructor
} from '@components';
import {
  Login,
  Feed,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { title } from 'process';
import { ModalUI } from '@ui';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/services/store';
//import { fetchIngredients } from '../../services/slices/ingredientsSlice';

interface IProtectedRouteProps {
  isAuth: boolean;
  children?: ReactNode;
}
const ProtectedRoute = ({ isAuth, children }: IProtectedRouteProps) => {
  if (!isAuth) {
    return <Navigate to='/login' replace />;
  }
  return <>{children}</>;
};

// Хук авторизации (пример)
const useAuth = () => {
  // Всегда авторизован; замените своим состоянием авторизации
  const [isAuth] = useState<boolean>(true);
  return { isAuth };
};

const App: React.FC = () => {
  const { isAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { background?: Location };
  const background = state && state.background;
  //const background = location.state && (location.state as any).background;


  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      {/* 
        Используем background как location для Routes, чтобы при наличии background
        отображать страницу под модальным окном.
      */}
      <Routes location={background || location}>
       
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route element={<ProtectedRoute isAuth={isAuth} />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Order Details' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />

        </Route>

        {/* Маршруты для страниц логина и регистрации (если нужно их сделать публичными) */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Если есть background, показываем модалки поверх */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Order Details' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:_id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Order Details' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
