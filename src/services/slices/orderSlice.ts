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
  orderModalData: TOrder | null;
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
  Partial<OrderState>,
  void,
  { rejectValue: string }
>('order/fetchFeeds', async (_, thunkAPI) => {
  try {
    const data = await getFeedsApi();
    return data;
  } catch (err) {
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(
        err.message || 'Ошибка при загрузке данных'
      );
    } else {
      return thunkAPI.rejectWithValue('Ошибка при загрузке данных');
    }
  }
});

export const fetchOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/fetchOrders', async (_, thunkAPI) => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (err) {
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(
        err.message || 'Ошибка при получении заказов'
      );
    } else {
      return thunkAPI.rejectWithValue('Ошибка при получении заказов');
    }
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
  } catch (err) {
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(
        err.message || 'Ошибка при оформлении заказа'
      );
    } else {
      return thunkAPI.rejectWithValue('Ошибка при оформлении заказа');
    }
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
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Ошибка при получении заказа';
    return thunkAPI.rejectWithValue(message);
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
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
        state.total = action.payload.total || 0;
        state.totalToday = action.payload.totalToday || 0;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка при получении заказов';
      });

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

    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
        state.orderSuccess = false;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          console.log('создали заказ', action.payload);
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
