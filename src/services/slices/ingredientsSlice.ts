import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

interface IIngredientsState {
  data: TIngredient[];
  isLoading: boolean;
  error: string | null;
  selectedIngredient: TIngredient | null;
}

const initialState: IIngredientsState = {
  data: [],
  isLoading: false,
  error: null,
  selectedIngredient: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetch', async (_, thunkAPI) => {
  try {
    const response = await getIngredientsApi();
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Не удалось загрузить ингредиенты';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setSelectedIngredient(state, action) {
      state.selectedIngredient = action.payload;
    },
    clearSelectedIngredient(state) {
      state.selectedIngredient = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка при загрузке ингредиентов';
      });
  }
});

export const { setSelectedIngredient, clearSelectedIngredient } =
  ingredientsSlice.actions;

export default ingredientsSlice.reducer;
