import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { createOrder, closeOrderModal } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
//import { clearOrderModalData } from '../../services/slices/orderSlice';
import { useNavigate } from 'react-router-dom';


export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  useEffect(() => {
  //   dispatch(clearOrderModalData());
  //  });

  const user = useSelector((state: RootState) => state.auth.user);

  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor
  );
  const { orderModalData, orderRequest } = useSelector(
    (state: RootState) => state.order
  );

  const onOrderClick = () => {
    if (!user || !user.email) {
      navigate('/login' ); //{ state: { from: location.pathname}}
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
    //dispatch(clearOrderModalData());
  };

  const constructorItems = {
    bun,
    ingredients
  };
const handleCloseModal = () => {
    closeOrderModal();
    navigate(-1);
    return;
  };
  // const handleCloseModal = () => {
  //   console.log('Закрываем модалку');
  //   dispatch(closeOrderModal());
  // };

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
