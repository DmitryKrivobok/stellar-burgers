import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import React from 'react';
import { useDispatch, useSelector, RootState } from '../../services/store';
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

const PublicRoute = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (user.email !== '') {
    return <Navigate to='/' state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
};

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route element={<PublicRoute />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>

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
