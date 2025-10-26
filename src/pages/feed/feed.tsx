import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from 'src/services/store';
import { useEffect } from 'react';
import { fetchFeeds } from '../../services/slices/orderSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  //const orders: TOrder[] = [];
  const dispatch = useDispatch<AppDispatch>();
  const orders: TOrder[] = useSelector(
    (state: RootState) => state.order.orders
  );

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  useEffect(() => {
    handleGetFeeds();
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
