import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  orderBurgerApi,
  getOrdersApi,
  getFeedsApi,
  getOrderByNumberApi
} from '../../utils/burger-api';

interface OrderState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  placingOrder: boolean;
  placeOrderError: string | null;
  orderNumber?: number;
  // Здесь основной объект текущего заказа
  orderModalData: TOrder | null;
  // Для статуса заказа
  orderRequest: boolean;
  orderSuccess: boolean;
  orderError: string | null;
}

const initialState: OrderState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  placingOrder: false,
  placeOrderError: null,
  orderNumber: undefined,
  orderModalData: null,
  orderRequest: false,
  orderSuccess: false,
  orderError: null
};

export const fetchFeeds = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/fetchFeeds', async (_, thunkAPI) => {
  try {
    const data = await getFeedsApi();
    return data.orders;
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

export const fetchOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/fetchOrders', async (_, thunkAPI) => {
  try {
    const orders = await getOrdersApi();
    return orders; // здесь точно ТOrder[]
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('burgerConstructor/createOrder', async (ingredientsIds, thunkAPI) => {
  try {
    const response = await orderBurgerApi(ingredientsIds);
    return response.order;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Ошибка при оформлении заказа'
    );
  }
});

export const placeOrder = createAsyncThunk<
  { order: TOrder }, // ответ с заказом
  string[], // массив id ингредиентов
  { rejectValue: string }
>('order/placeOrder', async (ingredientIds, thunkAPI) => {
  try {
    const response = await orderBurgerApi(ingredientIds);
    return { order: response.order };
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (orderNumber, thunkAPI) => {
  try {
    const response = await getOrderByNumberApi(orderNumber);

    if (!response?.orders?.length) {
      return thunkAPI.rejectWithValue('Заказ не найден');
    }
    return response.orders[0];
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.message || 'Ошибка при получении заказа'
    );
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.orderSuccess = false;
      state.orderError = null;
    }
  },
  extraReducers: (builder) => {
    //fetchFeeds
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        console.log('Полученые заказы:', action.payload);
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка при получении заказов';
      });
    //fetchOrders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка при получении заказов';
      });
    //placeOrder
    builder
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
        state.placeOrderError = null;
      })
      .addCase(
        placeOrder.fulfilled,
        (state, action: PayloadAction<{ order: TOrder }>) => {
          console.log('Полученый заказ:', action.payload);
          state.placingOrder = false;
          state.orders = [...state.orders, action.payload.order];
          //state.orders.push(action.payload.order);
          state.orderNumber = action.payload.order.number;
        }
      )
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingOrder = false;
        state.placeOrderError = action.payload || 'Ошибка оформления заказа';
      });
    //createOrder
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
        state.orderSuccess = false;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          console.log('Полученый заказ:', action.payload);
          state.orderModalData = action.payload;
          state.orders = [...state.orders, action.payload];
          state.orderRequest = false;
          state.orderSuccess = true;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload || 'Неизвестная ошибка';
      });
    //fetchOrderByNumber
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.orderSuccess = false;
        state.orderError = null;
        state.orderModalData = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderSuccess = true;
          state.orderError = null;
          state.orderModalData = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderSuccess = false;
        state.orderError = action.payload as string;
        state.orderModalData = null;
      });
  }
});

export const { closeOrderModal } = orderSlice.actions;

export default orderSlice.reducer;
