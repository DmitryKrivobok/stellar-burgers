import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '../../utils/types';

interface IBurgerConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  price: number;
}

const initialState: IBurgerConstructorState = {
  bun: null,
  ingredients: [],
  price: 0
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
      state.ingredients = [
        ...state.ingredients,
        action.payload as TConstructorIngredient
      ];
      state.price += action.payload.price;
    },
    removeIngredient(state, action: PayloadAction<string>) {
      const index = state.ingredients.findIndex(
        (item) => item._id === action.payload
      );
      if (index !== -1) {
        state.price -= state.ingredients[index].price;
        state.ingredients.splice(index, 1);
      }
    },
    moveIngredientUp(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index <= 0 || index >= state.ingredients.length) return;
      const newIngredients = [...state.ingredients];
      [newIngredients[index - 1], newIngredients[index]] = [
        newIngredients[index],
        newIngredients[index - 1]
      ];
      state.ingredients = newIngredients;
    },
    moveIngredientDown(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index < 0 || index >= state.ingredients.length - 1) return;
      const newIngredients = [...state.ingredients];
      [newIngredients[index], newIngredients[index + 1]] = [
        newIngredients[index + 1],
        newIngredients[index]
      ];
      state.ingredients = newIngredients;
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
      state.price = 0;
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredientUp,
  moveIngredientDown
} = constructorSlice.actions;

export default constructorSlice.reducer;
