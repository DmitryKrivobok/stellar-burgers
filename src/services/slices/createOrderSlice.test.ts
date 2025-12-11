/// <reference types="jest" />

import { createOrder, closeOrderModal, initialState } from './createOrderSlice';
import reducer from './createOrderSlice';
import type { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'order-123',
  name: 'Cheese Burger',
  number: 1001,
  status: 'created',
  createdAt: '2025-12-03T12:00:00Z',
  updatedAt: '2025-12-03T12:00:00Z',
  ingredients: ['ing-1', 'ing-2']
};

const mockIngredients = ['ing-1', 'ing-2', 'ing-3'];

describe('createOrderSlice', () => {
  test('должно иметь корректное начальное состояние', () => {
    expect(initialState).toEqual({
      orderRequest: false,
      orderError: null,
      data: null,
      orders: [],
      orderCreated: false
    });
  });

  describe('Редьюсер: closeOrderModal', () => {
    test('обнуляет data, сбрасывает orderCreated и orderError', () => {
      const state = {
        ...initialState,
        data: mockOrder,
        orderCreated: true,
        orderError: 'Ошибка сети'
      };

      const nextState = reducer(state, closeOrderModal());

      expect(nextState.data).toBeNull();
      expect(nextState.orderCreated).toBe(false);
      expect(nextState.orderError).toBeNull();
    });

    test('не изменяет orderRequest и orders', () => {
      const state = {
        ...initialState,
        orderRequest: true,
        orders: [mockOrder]
      };

      const nextState = reducer(state, closeOrderModal());

      expect(nextState.orderRequest).toBe(true);
      expect(nextState.orders).toEqual([mockOrder]);
    });
  });

  describe('extraReducers: createOrder (async thunk)', () => {
    describe('pending', () => {
      test('устанавливает orderRequest=true, обнуляет data и orderError', () => {
        const nextState = reducer(
          initialState,
          createOrder.pending('requestId', mockIngredients)
        );

        expect(nextState.orderRequest).toBe(true);
        expect(nextState.data).toBeNull();
        expect(nextState.orderError).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('сохраняет data, добавляет заказ в orders, сбрасывает request и error', () => {
        const nextState = reducer(
          initialState,
          createOrder.fulfilled(mockOrder, 'requestId', mockIngredients)
        );

        expect(nextState.data).toEqual(mockOrder);
        expect(nextState.orders).toEqual([mockOrder]);
        expect(nextState.orderRequest).toBe(false);
        expect(nextState.orderError).toBeNull();
      });

      test('добавляет новый заказ к существующим в orders', () => {
        const stateWithOrders = {
          ...initialState,
          orders: [mockOrder]
        };

        const newOrder: TOrder = {
          _id: 'order-456',
          name: 'Veggie Burger',
          number: 1002,
          status: 'created',
          createdAt: '2025-12-03T13:00:00Z',
          updatedAt: '2025-12-03T13:00:00Z',
          ingredients: ['ing-3']
        };

        const nextState = reducer(
          stateWithOrders,
          createOrder.fulfilled(newOrder, 'requestId', mockIngredients)
        );

        expect(nextState.orders).toEqual([mockOrder, newOrder]);
      });
    });

    describe('rejected', () => {
      test('устанавливает orderError с payload и сбрасывает orderRequest', () => {
        const errorMessage = 'Ошибка сервера';
        const error = new Error(errorMessage);

        const nextState = reducer(
          initialState,
          createOrder.rejected(
            error,
            'requestId',
            mockIngredients,
            errorMessage
          )
        );

        expect(nextState.orderRequest).toBe(false);
        expect(nextState.orderError).toBe(errorMessage);
      });

      test('использует дефолтное сообщение при отсутствии payload', () => {
        const error = new Error('Unknown error');

        const nextState = reducer(
          initialState,
          createOrder.rejected(error, 'requestId', mockIngredients, undefined)
        );

        expect(nextState.orderRequest).toBe(false);
        expect(nextState.orderError).toBe('Неизвестная ошибка');
      });
    });
  });
});
