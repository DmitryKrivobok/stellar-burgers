import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch} from 'react-redux';
import { RootState, AppDispatch } from 'src/services/store';
import {createOrder,closeOrderModal } from '../../services/slices/orderSlice'


export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const dispatch = useDispatch<AppDispatch>();

  const {
    bun,
    ingredients,
   price,
  } = useSelector((state: RootState) => state.constructor);

 //const constructorItems = useSelector((state: RootState) => state.constructor);
  const {orderModalData, orderRequest} = useSelector((state: RootState) => state.order);
 

  // Обработчик клика по кнопке "Оформить заказ"
  const onOrderClick = () => {
    if (!bun) {
      alert('Добавьте булку!');
      return;
    }
    if (orderRequest) return; // чтобы не создавать дублирующие запросы

    // Собираем массив _id для передачи в createOrder
    // Согласно API булка добавляется дважды — в начале и в конце
    // 
    
    const ingredientsIds = [

      bun._id,
      ...ingredients.map(item => item._id),
      bun._id,
    ];

    dispatch(createOrder(ingredientsIds));
  }; 

  const constructorItems = [
    ...(bun ? [bun] : []),
    ...(ingredients ?? []),
  ];
  
  const onCloseModal = () => {
    dispatch(closeOrderModal());
  };
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      //constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};


  
 
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