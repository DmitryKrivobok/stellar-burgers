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
  useNavigate
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

interface IProtectedRouteProps {
  //isAuth: boolean;
  children?: React.ReactNode;
}
/*
const ProtectedRoute: React.FC = ( {children }) => {
  const { user, authChecked } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!authChecked) {
    // Можно показывать прелоадер или ничего
    return <Preloader />;
  }

  if (!user || !user.email) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
*/

const ProtectedRoute = ({ children }: IProtectedRouteProps) => {
  //const user = useSelector((state: RootState) => state.auth.user);
  // const authChecked = useSelector((state: RootState) => state.auth.authChecked);
  const { user, authChecked } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  if (!authChecked) {
    //return <Preloader />;
  }

  if (!user || !user.email) {
    return <Navigate to='/login' state={{ from: location }} replace />;
    //navigate('/login', { state: { from: location.pathname } });
    //return;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log('Вызов fetchUser');
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  // const { user } = useSelector((state: RootState) => state.auth);
  //const authChecked = useSelector((state: RootState) => state.auth.authChecked);

  const state = location.state as { background?: Location };
  const background = state && state.background;

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные маршруты */}
      <Routes>
        {/* публичные */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        {/*} <Route path='/profile' element={<Profile />} />*/}

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
          {/* Защищённая модалка */}
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

/*

 return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='*' element={<NotFound404 />} />
       
        <Route
          element={
            <ProtectedRoute>
             
            </ProtectedRoute>
          }
        >
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

       
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

     
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

interface IProtectedRouteProps {
  //isAuth: boolean;
  children?: React.ReactNode;
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
      
      <Routes location={background || location}>
       
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route element={<ProtectedRoute isAuth={isAuth}/>}>
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

       
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      
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
*/
