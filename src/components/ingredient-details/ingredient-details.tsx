import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'src/services/store';
import { useParams } from 'react-router-dom';
import {
  setSelectedIngredient,
  clearSelectedIngredient,
  fetchIngredients
} from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { _id } = useParams<{ _id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const ingredients = useSelector((state: RootState) => state.ingredients.data);
  const isLoading = useSelector(
    (state: RootState) => state.ingredients.isLoading
  );
  const selectedIngredient = useSelector(
    (state: RootState) => state.ingredients.selectedIngredient
  );

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  useEffect(() => {
    if (ingredients.length && _id) {
      const ingredient = ingredients.find((item) => item._id === _id);
      dispatch(setSelectedIngredient(ingredient ?? null));
    }
  }, [_id, ingredients, dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (!selectedIngredient) {
    return <p>Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={selectedIngredient} />;
};
