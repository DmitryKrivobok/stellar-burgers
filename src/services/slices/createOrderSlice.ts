import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';

interface OrderState {
  orderRequest: boolean;
  orderError: string | null;
  data: TOrder | null;
  orders: TOrder[];
  orderCreated: boolean;
}

const initialState: OrderState = {
  orderRequest: false,
  orderError: null,
  data: null,
  orders: [],
  orderCreated: false
};

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

 export const createOrderSlice = createSlice({
  name: 'createOrder',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.data = null;
      state.orderCreated = false;
      state.orderError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
        state.data = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.data = action.payload;
          state.orders = [...state.orders, action.payload];
          state.orderRequest = false;
          state.orderError = null;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload || 'Неизвестная ошибка';
      });
  }
});

export const { closeOrderModal } = createOrderSlice.actions;
export default createOrderSlice.reducer;
