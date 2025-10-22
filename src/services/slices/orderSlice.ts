import { createSlice, PayloadAction,createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TIngredient ,TOrdersData } from '@utils-types';
import { orderBurgerApi, getOrdersApi} from '../../utils/burger-api';


interface OrderState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;          
  error: string | null;      
  placingOrder: boolean;      
  placeOrderError: string | null; 
  orderNumber?: number;

  // новые поля
  orderRequest: boolean;
  orderSuccess: boolean;
  orderError: string | null;
  orderModalData: TOrder | null;
}

// Начальное состояние
const initialState: OrderState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  placingOrder: false,
  placeOrderError: null,
  orderNumber: undefined,

  // новые поля
  orderRequest: false,
  orderSuccess: false,
  orderError: null,
  orderModalData: null,
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>(
  'burgerConstructor/createOrder',
  async (ingredientsIds, thunkAPI) => {
    try {
      const response = await orderBurgerApi(ingredientsIds);
      return response.order;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Ошибка при оформлении заказа');
    }
  }
);

// Асинхронный thunk для получения списка заказов пользователя
export const fetchOrders = createAsyncThunk<
  TOrder[], // успешный результат
  void, // аргумент (нет)
  { rejectValue: string }
>('order/fetchOrders', async (_, thunkAPI) => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

// Асинхронный thunk для создания нового заказа
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

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // закрытие модального окна и сброс статусов
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.orderSuccess = false;
      state.orderError = null;
    },
  },
  extraReducers: (builder) => {
    // Обработка fetchOrders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.orders = action.payload;
          // добавbnm их к state total и totalToday
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка при получении заказов';
      });

    // Обработка placeOrder
    builder
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
        state.placeOrderError = null;
      })
      .addCase(
        placeOrder.fulfilled,
        (state, action: PayloadAction<{ order: TOrder }>) => {
          state.placingOrder = false;
          // Добавляем заказ в список заказов
          state.orders.push(action.payload.order);
          // Сохраняем номер заказа
          state.orderNumber = action.payload.order.number;
        }
      )
      .addCase(
        placeOrder.rejected,
        (state, action) => {
          state.placingOrder = false;
          state.placeOrderError = action.payload || 'Ошибка оформления заказа';
        }
      );

    // Обработка createOrder
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
        state.orderSuccess = false;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderModalData = action.payload;
          state.orderRequest = false;
          state.orderSuccess = true;
        }
      )
      .addCase(
        createOrder.rejected,
        (state, action) => {
          state.orderRequest = false;
          state.orderError = action.payload || 'Неизвестная ошибка';
        }
      );
  },
});

export const { closeOrderModal } = orderSlice.actions;

export default orderSlice.reducer;

/// Тип состояния слайса заказа
/*
interface OrderState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  placingOrder: boolean;
  placeOrderError: string | null;
  orderNumber?: number; // номер последнего созданного заказа
}

// Инициализация состояния
const initialState: OrderState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  placingOrder: false,
  placeOrderError: null,
  orderNumber: undefined,
};

// Асинхронный thunk для получения списка заказов пользователя
export const fetchOrders = createAsyncThunk<
  TOrder[], // успешный результат
  void, // аргумент (нет)
  { rejectValue: string }
>('order/fetchOrders', async (_, thunkAPI) => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

// Асинхронный thunk для создания нового заказа
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

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderState(state) {
      state.error = null;
      state.placeOrderError = null;
      state.orderNumber = undefined;
    }
  },
  extraReducers: (builder) => {
    // Загрузка заказов
    builder.addCase(fetchOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action: PayloadAction<TOrder[]>) => {
      state.loading = false;
      state.orders = action.payload;
      state.error = null;
      // Можно дополнительно подсчитывать total и totalToday, если они есть в данных API
      // Для примера оставим пустыми
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch orders';
    });

    // Создание заказа
    builder.addCase(placeOrder.pending, (state) => {
      state.placingOrder = true;
      state.placeOrderError = null;
    });
    builder.addCase(placeOrder.fulfilled, (state, action) => {
      state.placingOrder = false;
      state.placeOrderError = null;
      state.orderNumber = action.payload.order.number;
      // Можно добавить заказ в список, если нужно
      state.orders.push(action.payload.order);
    });
    builder.addCase(placeOrder.rejected, (state, action) => {
      state.placingOrder = false;
      state.placeOrderError = action.payload || 'Failed to place order';
    });
  },
});

export const { clearOrderState } = orderSlice.actions;

export default orderSlice.reducer;
*/
/*
interface ModalData {
    id: string;
    title: string;
    description?: string;
  }

// Определим интерфейс состояния заказа
interface OrderState {
  orderDetails: TOrder | null; // информация о заказе
  ingredients: TIngredient[]; // список ингредиентов
  orderNumber?: number; // номер заказа
  loading: boolean;//'idle' | 'loading' | 'succeeded' | 'failed'; // статус загрузки
  error: string | null; // сообщение об ошибке
  modalData?: ModalData; 
}

// Изначальное состояние
const initialState: OrderState = {
  orderDetails: null,
  ingredients: [],
  orderNumber: undefined,
  loading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk(
  'order/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getIngredientsApi();
      return data; // предполагается, что data — это массив ингредиентов
    } catch (err) {
      // Можно обработать ошибку более подробно, если нужно
      return rejectWithValue('Ошибка загрузки ингредиентов');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getOrdersApi();
      return data; // предполагается, что data — это массив заказов
    } catch (err) {
      return rejectWithValue('Ошибка загрузки заказов');
    }
  }
);

export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (ingredientsIDs: string[], { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientsIDs);
      return data.order; // предполагается, что в ответе есть объект заказа
    } catch (err) {
      return rejectWithValue('Ошибка при отправке заказа');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderDetails(state, action: PayloadAction<TOrder>) {
      state.orderDetails = action.payload;
    },
    setIngredients(state, action: PayloadAction<TIngredient[]>) {
      state.ingredients = action.payload;
    },
    setOrderNumber(state, action: PayloadAction<number>) {
      state.orderNumber = action.payload;
    },
    setStatus(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearOrder(state) {
      state.orderDetails = null;
      state.ingredients = [];
      state.orderNumber = undefined;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setOrderDetails,
  setIngredients,
  setOrderNumber,
  setStatus,
  setError,
  clearOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
*/

//использование в коспоненте

/*
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchOrders, placeOrder, clearOrderState } from './orderSlice';

// Получение списка заказов
const dispatch = useAppDispatch();
useEffect(() => {
  dispatch(fetchOrders());
}, [dispatch]);

const orders = useAppSelector(state => state.order.orders);
const loading = useAppSelector(state => state.order.loading);
const error = useAppSelector(state => state.order.error);

// Создание заказа
const handleOrder = (ingredientIds: string[]) => {
  dispatch(placeOrder(ingredientIds));
};
*/