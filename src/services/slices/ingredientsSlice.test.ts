/// <reference types="jest" />


import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import ingredientsSlice, {
  fetchIngredients,
  setSelectedIngredient,
  clearSelectedIngredient
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Cheese',
  type: 'main',
  proteins: 20,
  fat: 10,
  carbohydrates: 5,
  calories: 150,
  price: 100,
  image: 'cheese.png',
  image_large: 'cheese-large.png',
  image_mobile: 'cheese-mobile.png'
};

describe('тесты слайса ингредиентов', () => {
  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ingredients: ingredientsSlice
      }
    });
  });

  test('fetchIngredients.pending: устанавливает isLoading = true, очищает error', () => {
    store.dispatch(fetchIngredients.pending('requestId'));

    const state = store.getState().ingredients;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.data).toEqual([]);
  });

  test('fetchIngredients.fulfilled: сохраняет data, сбрасывает isLoading', () => {
    const mockData = [
      mockIngredient,
      { ...mockIngredient, _id: '2', name: 'Tomato' }
    ];

    store.dispatch(fetchIngredients.fulfilled(mockData, 'requestId'));

    const state = store.getState().ingredients;

    expect(state.data).toEqual(mockData);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('fetchIngredients.rejected — обработка ошибки', () => {
    store.dispatch(
      fetchIngredients.rejected(null, 'Ошибка при загрузке ингредиентов')
    );

    const state = store.getState().ingredients;

    expect(state.error).toBe('Ошибка при загрузке ингредиентов');
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual([]);
  });

  test('setSelectedIngredient: устанавливает selectedIngredient', () => {
    store.dispatch(setSelectedIngredient(mockIngredient));

    const state = store.getState().ingredients;

    expect(state.selectedIngredient).toStrictEqual(mockIngredient);
  });

  test('clearSelectedIngredient: сбрасывает selectedIngredient в null', () => {
    store.dispatch(setSelectedIngredient(mockIngredient));

    store.dispatch(clearSelectedIngredient());

    const state = store.getState().ingredients;

    expect(state.selectedIngredient).toBeNull();
  });
});
