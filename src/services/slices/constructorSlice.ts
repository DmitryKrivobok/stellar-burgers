import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient,TOrder , TConstructorIngredient } from '../../utils/types';
import { getIngredientsApi, orderBurgerApi } from '../../utils/burger-api';

 

interface IBurgerConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];  // без уникального id, используем _id
  orderRequest: boolean;
  orderSuccess: boolean;
  orderError: string | null;
  orderModalData: TOrder | null;
  price: number;
}

const initialState: IBurgerConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderSuccess: false,
  orderError: null,
  orderModalData: null,
  price: 0
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

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
      // пересчёт цены: булка считается дважды, плюс ингредиенты
      state.price = (state.bun.price * 2) + state.ingredients.reduce((sum, i) => sum + i.price, 0);
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
     state.ingredients.push(action.payload as TConstructorIngredient);
    state.price += action.payload.price;
     
    },/*
    addIngredient(state, action: PayloadAction<TIngredient>) {
      if (!state.ingredients) {
        state.ingredients = [];
      }
      state.ingredients.push(action.payload as TConstructorIngredient);
      state.price += (action.payload as TIngredient).price;
    },*/
    removeIngredient(state, action: PayloadAction<string>) {
      // Удаляем по _id (будут удалены первые совпадения)
      const index = state.ingredients.findIndex(item => item._id === action.payload);
      if (index !== -1) {
        state.price -= state.ingredients[index].price;
        state.ingredients.splice(index, 1);
      }
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
      state.price = 0;
      state.orderRequest = false;
      state.orderSuccess = false;
      state.orderError = null;
      state.orderModalData = null;
    },
    closeOrderModal(state) {
      state.orderModalData = null;
      state.orderSuccess = false;
      state.orderError = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createOrder.pending, state => {
        state.orderRequest = true;
        state.orderError = null;
        state.orderSuccess = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload;
        state.orderRequest = false;
        state.orderSuccess = true;
        // После оформления очищаем конструктор
        state.bun = null;
        state.ingredients = [];
        state.price = 0;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload || 'Неизвестная ошибка';
      });
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  clearConstructor,
  closeOrderModal
} = constructorSlice.actions;

export default constructorSlice.reducer;

/*

// AsyncThunk для загрузки ингредиентов из API
export const fetchIngredients = createAsyncThunk(
  'constructor/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const ingredients = await getIngredientsApi();
      return ingredients;
    } catch (err) {
      return rejectWithValue('Ошибка загрузки ингредиентов');
    }
  }
);

// AsyncThunk для размещения заказа на сервере
// Передается массив id ингредиентов (как в вашем orderBurgerApi)
export const placeOrder = createAsyncThunk<
  TOrder,         // тип возвращаемых данных при успехе
  string[],       // параметры (массив id ингредиентов)
  { rejectValue: string }
>(
  'constructor/placeOrder',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds); // ваш API вызов
      return response.order;
    } catch (err) {
      return rejectWithValue('Ошибка оформления заказа');
    }
  }
);*/
/*
export const placeOrder = createAsyncThunk<
  TOrder, // возвращаемое значение
  string[],   // аргумент — массив id ингредиентов
  { rejectValue: string }
>(
  'constructor/placeOrder',
  async (ingredientIds, thunkAPI) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      if (!response.success) {
        return thunkAPI.rejectWithValue('Ошибка сервера');
      }
      // Response содержит объект {success: boolean, order: TOrder, name: string}
      const { order } = response;
      return order; // предполагаем, что тип TOrder совпадает с TOrderInfo
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка сети');
    }
  }
);*/
/*
interface IConstructorState {
  bun: TIngredient | null;
  fillings: TConstructorIngredient [];
  loading: boolean;
  order: TOrder | null;
  error: string | null;
}

// начальное состояние
const initialState: IConstructorState = {
  bun: null,
  fillings: [],
  loading: false,
  order: null,
  error: null,
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    addFillings(state, action: PayloadAction<TConstructorIngredient[]>) {
      state.fillings = action.payload;
    },
    clearOrder(state) {
      state.order = null;
      state.error = null;
    },
    clearConstructor(state) {
      state.bun = null;
      state.fillings = [];
      state.order = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.order = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = {
          ...action.payload,
          // если нужно, м.б. дополнительно обработать order
        } as TOrder;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка';
      });
  },
});

export const { addBun, addFillings, clearOrder, clearConstructor } = constructorSlice.actions;

export default constructorSlice.reducer;*/
/*
// Тип состояния слайса конструктора
interface ConstructorState {
  ingredients: TIngredient[];   // доступные ингредиенты (из API)
  bun: TIngredient | null;      // выбранная булочка
  fillings: TIngredient [];      // выбранные начинки
  order: TOrder | null;          // данные размещённого заказа
  loading: boolean;
  error: string | null;
}

// AsyncThunk для загрузки ингредиентов из API
export const fetchIngredients = createAsyncThunk(
  'constructor/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const ingredients = await getIngredientsApi();
      return ingredients;
    } catch (err) {
      return rejectWithValue('Ошибка загрузки ингредиентов');
    }
  }
);

// AsyncThunk для размещения заказа на сервере
// Передается массив id ингредиентов (как в вашем orderBurgerApi)
export const placeOrder = createAsyncThunk<
  TOrder,         // тип возвращаемых данных при успехе
  string[],       // параметры (массив id ингредиентов)
  { rejectValue: string }
>(
  'constructor/placeOrder',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds); // ваш API вызов
      return response.order;
    } catch (err) {
      return rejectWithValue('Ошибка оформления заказа');
    }
  }
);

// Изначальное состояние слайса
const initialState: ConstructorState = {
  ingredients: [],
  bun: null,
  fillings: [],
  order: null,
  loading: false,
  error: null,
};

// Сам слайс конструктора
const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    // добавление ингридиента в конструктор
    
    addIngredient(state, action: PayloadAction<TIngredient>) {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.bun = ingredient;
      } else {
        state.fillings.push(ingredient);
      }
    },
    // удаление ингредиента из конструтора по индексу
    removeIngredient(state, action: PayloadAction<number>) {
      state.fillings.splice(action.payload, 1);
    },
    // перемещение ингредиента внутри начинки (для drag & drop)
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const item = state.fillings.splice(fromIndex, 1)[0];
      state.fillings.splice(toIndex, 0, item);
    },
    // очистить конструктор (например, после оформления)
    clearConstructor(state) {
      state.bun = null;
      state.fillings = [];
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // загрузка ингредиентов
    builder.addCase(fetchIngredients.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      state.loading = false;
      state.ingredients = action.payload;
    });
    builder.addCase(fetchIngredients.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // оформление заказа
    builder.addCase(placeOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.order = null;
    });
    builder.addCase(placeOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });
    builder.addCase(placeOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      return state;
    });
  },
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} = constructorSlice.actions;

export default constructorSlice.reducer;
*/