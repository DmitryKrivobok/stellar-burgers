/// <reference types="jest" />

import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import orderSlice, {
  fetchFeeds,
  fetchOrders,
  fetchOrderByNumber
} from './orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '654321',
  status: 'done',
  name: 'Классический бургер',
  number: 12345,
  createdAt: '2025-01-01T10:00:00.000Z',
  updatedAt: '2025-01-01T10:05:00.000Z',
  ingredients: ['1', '2', '3']
};

const mockFeedData = {
  orders: [mockOrder],
  total: 100,
  totalToday: 10
};

describe('orderSlice тесты', () => {
  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        order: orderSlice
      }
    });
  });

  test('fetchFeeds.pending: устанавливает loading = true, очищает error', () => {
    store.dispatch(fetchFeeds.pending('requestId'));
    const state = store.getState().order;

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fetchFeeds.fulfilled: заполняет orders, total, totalToday, сбрасывает loading', () => {
    store.dispatch(fetchFeeds.fulfilled(mockFeedData, 'requestId'));
    const state = store.getState().order;

    expect(state.orders).toEqual(mockFeedData.orders);
    expect(state.total).toBe(mockFeedData.total);
    expect(state.totalToday).toBe(mockFeedData.totalToday);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('fetchFeeds.rejected: устанавливает error, сбрасывает loading', () => {
    store.dispatch(fetchFeeds.rejected(null, 'Ошибка при получении заказов'));

    const state = store.getState().order;

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка при получении заказов');
  });

  test('fetchOrders.pending: устанавливает loading = true, очищает error', () => {
    store.dispatch(fetchOrders.pending('requestId'));
    const state = store.getState().order;

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fetchOrders.fulfilled: заполняет orders, сбрасывает loading', () => {
    const mockOrders = [mockOrder, { ...mockOrder, number: 12346 }];
    store.dispatch(fetchOrders.fulfilled(mockOrders, 'requestId'));

    const state = store.getState().order;

    expect(state.orders).toEqual(mockOrders);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('fetchOrders.rejected: устанавливает error, сбрасывает loading', () => {
    const errorMessage = 'Ошибка при получении заказов';

    store.dispatch(fetchOrders.rejected(null, errorMessage));

    const state = store.getState().order;

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('fetchOrderByNumber.pending: устанавливает orderRequest = true, очищает orderError, обнуляет orderModalData', () => {
    const requestId = 'requestId';
    const orderNumber = 12345;

    store.dispatch(fetchOrderByNumber.pending(requestId, orderNumber));

    const state = store.getState().order;

    expect(state.orderRequest).toBe(true);
    expect(state.orderSuccess).toBe(false);
    expect(state.orderError).toBeNull();
    expect(state.orderModalData).toBeNull();
  });

  test('fetchOrderByNumber.fulfilled: заполняет orderModalData, устанавливает orderSuccess = true, сбрасывает orderRequest', () => {
    const orderNumber = 12345;
    store.dispatch(
      fetchOrderByNumber.fulfilled(mockOrder, 'requestId', orderNumber)
    );
    const state = store.getState().order;

    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.orderSuccess).toBe(true);
    expect(state.orderRequest).toBe(false);
    expect(state.orderError).toBeNull();
  });

  test('fetchOrderByNumber.rejected: устанавливает orderError, сбрасывает orderRequest и orderSuccess, обнуляет orderModalData', () => {
    const errorMessage = 'Заказ не найден';
    const orderNumber = 12345;
    store.dispatch(fetchOrderByNumber.rejected(null, 'requestId', orderNumber));

    const state = store.getState().order;

    expect(state.orderError).toBe(undefined);
    expect(state.orderRequest).toBe(false);
    expect(state.orderSuccess).toBe(false);
    expect(state.orderModalData).toBeNull();
  });
});
