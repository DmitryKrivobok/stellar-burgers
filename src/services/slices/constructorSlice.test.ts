/// <reference types="jest" />


import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import constructorSlice, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from './constructorSlice';
import { TIngredient } from '../../utils/types';


const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 150,
  price: 50,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const mockIngredient1: TIngredient = {
  _id: 'ingr-1',
  name: 'Cheese',
  type: 'main',
  proteins: 8,
  fat: 7,
  carbohydrates: 1,
  calories: 90,
  price: 30,
  image: 'cheese.png',
  image_large: 'cheese-large.png',
  image_mobile: 'cheese-mobile.png'
};

const mockIngredient2: TIngredient = {
  _id: 'ingr-2',
  name: 'Tomato',
  type: 'main',
  proteins: 1,
  fat: 0,
  carbohydrates: 4,
  calories: 20,
  price: 20,
  image: 'tomato.png',
  image_large: 'tomato-large.png',
  image_mobile: 'tomato-mobile.png'
};

describe('тесты слайса конструктора', () => {
  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        burgerConstructor: constructorSlice
      }
    });
  });

  test('проверка инициализации состояния', () => {
    const result = store.getState().burgerConstructor;
    expect(result).toEqual({
      bun: null,
      ingredients: [],
      price: 0
    });
  });

  test('добавление булочки (addBun)', () => {
    store.dispatch(addBun(mockBun));
    const state = store.getState().burgerConstructor;

    expect(state.bun).toStrictEqual(mockBun);
    expect(state.price).toBe(0);
  });

  test('добавление ингредиента (addIngredient)', () => {
    store.dispatch(addIngredient(mockIngredient1));
    store.dispatch(addIngredient(mockIngredient2));

    const state = store.getState().burgerConstructor;

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toMatchObject({
      _id: mockIngredient1._id,
      name: mockIngredient1.name,
      price: mockIngredient1.price
    });
    expect(state.ingredients[1]).toMatchObject({
      _id: mockIngredient2._id,
      name: mockIngredient2.name,
      price: mockIngredient2.price
    });
    expect(state.price).toBe(mockIngredient1.price + mockIngredient2.price);
  });

  test('удаление ингредиента (removeIngredient)', () => {
    store.dispatch(addIngredient(mockIngredient1));
    store.dispatch(addIngredient(mockIngredient2));

    store.dispatch(removeIngredient(mockIngredient1._id));

    const state = store.getState().burgerConstructor;

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(mockIngredient2._id);
    expect(state.price).toBe(mockIngredient2.price);
  });

  test('состояние не меняется, если removeIngredient не нашёл ингредиент', () => {
    store.dispatch(addIngredient(mockIngredient1));

    store.dispatch(removeIngredient('non-existent-id'));

    const state = store.getState().burgerConstructor;

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(mockIngredient1._id);
    expect(state.price).toBe(mockIngredient1.price);
  });

  test('перемещение ингредиента вверх (moveIngredientUp)', () => {
    store.dispatch(addIngredient(mockIngredient1));
    store.dispatch(addIngredient(mockIngredient2));

    store.dispatch(moveIngredientUp(1));

    const state = store.getState().burgerConstructor;

    expect(state.ingredients[0]._id).toBe(mockIngredient2._id);
    expect(state.ingredients[1]._id).toBe(mockIngredient1._id);
  });

  test('не должен перемещать ингредиент, если индекс равен 0 (moveIngredientUp)', () => {
    store.dispatch(addIngredient(mockIngredient1));
    store.dispatch(addIngredient(mockIngredient2));

    store.dispatch(moveIngredientUp(0));

    const state = store.getState().burgerConstructor;

    expect(state.ingredients[0]._id).toBe(mockIngredient1._id);
    expect(state.ingredients[1]._id).toBe(mockIngredient2._id);
  });

  test('перемещение ингредиента вниз (moveIngredientDown)', () => {
    store.dispatch(addIngredient(mockIngredient1));
    store.dispatch(addIngredient(mockIngredient2));

    store.dispatch(moveIngredientDown(0));

    const state = store.getState().burgerConstructor;

    expect(state.ingredients[0]._id).toBe(mockIngredient2._id);
    expect(state.ingredients[1]._id).toBe(mockIngredient1._id);
  });

  test('не должен перемещать ингредиент, если он последний (moveIngredientDown)', () => {
    store.dispatch(addIngredient(mockIngredient1));
    store.dispatch(addIngredient(mockIngredient2));

    store.dispatch(moveIngredientDown(1));

    const state = store.getState().burgerConstructor;

    expect(state.ingredients[0]._id).toBe(mockIngredient1._id);
    expect(state.ingredients[1]._id).toBe(mockIngredient2._id);
  });

  test('очистка конструктора clearConstructor', () => {
    store.dispatch(addBun(mockBun));
    store.dispatch(addIngredient(mockIngredient1));

    store.dispatch(clearConstructor());

    const state = store.getState().burgerConstructor;

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
    expect(state.price).toBe(0);
  });

  test('проверка перемещения вверх при пустом списке ингредиентов', () => {
    store.dispatch(moveIngredientUp(0));
    const state = store.getState().burgerConstructor;
    expect(state.ingredients).toHaveLength(0);
  });

  test('проверка перемещения вниз при пустом списке ингредиентов', () => {
    store.dispatch(moveIngredientDown(0));
    const state = store.getState().burgerConstructor;
    expect(state.ingredients).toHaveLength(0);
  });
});

