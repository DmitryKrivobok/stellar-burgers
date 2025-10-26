import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'src/services/store';
import { createOrder, closeOrderModal } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor
  );
  const { orderModalData, orderRequest } = useSelector(
    (state: RootState) => state.order
  );

  const onOrderClick = () => {
    if (!user || !user.email) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!bun) {
      alert('Добавьте булку!');
      return;
    }
    if (orderRequest) return;
    const ingredientsIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    dispatch(createOrder(ingredientsIds));
    dispatch(clearConstructor());
  };

  const constructorItems = {
    bun,
    ingredients
  };

  const handleCloseModal = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};
