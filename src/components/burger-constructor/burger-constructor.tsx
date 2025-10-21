import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch} from 'react-redux';
import { RootState, AppDispatch } from 'src/services/store';
import {createOrder,
  closeOrderModal } from '../../services/slices/constructorSlice';


export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const dispatch = useDispatch<AppDispatch>();

  // Получаем данные из стейта слайса
  const {
    bun,
    ingredients,
    orderRequest,
    orderSuccess,
    orderError,
    orderModalData,
    price,
  } = useSelector((state: RootState) => state.constructor);

  // Рассчитывать цену дополнительно не нужно, т.к. она считается уже в слайсе, но если надо — можем воспользоваться price из стора

  // Обработчик клика по кнопке "Оформить заказ"
  const onOrderClick = () => {
    if (!bun) {
      alert('Добавьте булку!');
      return;
    }
    if (orderRequest) return; // чтобы не создавать дублирующие запросы

    // Собираем массив _id для передачи в createOrder
    // Согласно API булка добавляется дважды — в начале и в конце
    const ingredientsIds = [

      bun._id,
      ...ingredients.map(item => item._id),
      bun._id,
    ];

    dispatch(createOrder(ingredientsIds));
  };

  // Закрыть модалку с заказом (вызывать при закрытии модального окна)
  const onCloseModal = () => {
    dispatch(closeOrderModal());
  };
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      //constructorItems={constructorItems}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
  //const constructorState = useSelector((state: RootState) => state.constructor);
  //const orderState = useSelector((state: RootState) => state.order);

  // Формируем constructorItems
  /*
  const constructorItems = {
    bun: constructorState.bun,
    ingredients: constructorState.fillings,
  };
*/
  // orderRequest — загрузка заказа
  //const orderRequest = orderState.loading;

  // orderModalData — детали заказа
  //const orderModalData = orderState.orderDetails;
 // const constructorState = useSelector((state: RootState) => state.constructor);
  //const orderState = useSelector((state: RootState) => state.order);
/*
  const constructorItems = {
    bun: constructorState.bun,
    ingredients: constructorState.fillings,
  };

  const orderRequest = orderState.loading;
  const orderModalData = orderState.orderDetails;    
  /*
  const constructorItems = useSelector((state: RootState) => ({
    bun: state.constructor.bun,
    ingredients: state.constructor.fillings
  }));
  */
 // const orderRequest = useSelector((state: RootState) => state.order.loading);
  //const orderModalData = useSelector((state: RootState) => state.order.modalData);
  /*
  const constructorItems = {
    bun: {
      price: 0,
     
    },
    ingredients: []
  };

  const orderRequest = false;

  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
  };
  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  //return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      //constructorItems={constructorItems}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
*/