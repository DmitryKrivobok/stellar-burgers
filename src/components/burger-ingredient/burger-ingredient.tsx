import { FC, memo } from 'react';
import { useLocation} from 'react-router-dom';
import { addIngredient } from '../../services/slices/constructorSlice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch} from 'react-redux';
import { AppDispatch } from 'src/services/store';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
   const dispatch = useDispatch();

    const handleAdd = () => {
      console.log('Adding ingredient:', ingredient);
     dispatch(addIngredient(ingredient));
    };
    

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{background: location}}
        handleAdd={handleAdd}
      />
    );
  }
);