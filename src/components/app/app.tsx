import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/services/store';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchUser } from '../../services/slices/authSlice';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Outlet,
  useParams
} from 'react-router-dom';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
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
import { Preloader } from '@ui';

const ProtectedRoute = () => {
  const { user, authChecked } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!authChecked) {
    return <Preloader />;
  }

  if (!user || !user.email) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
};

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  const state = location.state as { background?: Location };
  const background = state && state.background;

  const handleModalClose = () => {
    navigate(-1);
  };

  const OrderModalWrapper = () => {
    const { number } = useParams();

    return (
      <Modal title={`#${number}`} onClose={handleModalClose}>
        <OrderInfo />
      </Modal>
    );
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные маршруты */}

      <Routes location={background || location}>
        {/* публичные */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* защищённые */}
        <Route element={<ProtectedRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
        </Route>

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модалки */}
      {background && (
        <Routes>
          <Route path='/feed/:number' element={<OrderModalWrapper />} />
          <Route
            path='/ingredients/:_id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          {/* Защищённая модалка */}
          <Route element={<ProtectedRoute />}>
            <Route
              path='/profile/orders/:number'
              element={<OrderModalWrapper />}
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
