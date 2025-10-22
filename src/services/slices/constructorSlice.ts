import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient,TOrder , TConstructorIngredient } from '../../utils/types';
import { orderBurgerApi } from '../../utils/burger-api';


interface IBurgerConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[]; // без _id
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
      state.price = (state.bun.price * 2) + state.ingredients.reduce((sum, i) => sum + i.price, 0);
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
      console.log('Текущее состояние ingredients:', state.ingredients);
      state.ingredients.push(action.payload as TConstructorIngredient);
      state.price += action.payload.price;
    },
    removeIngredient(state, action: PayloadAction<string>) {
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
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
/*
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
     
    },
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

*/