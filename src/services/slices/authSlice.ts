import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';


import {
  getUserApi,
  updateUserApi,
  registerUserApi,
  loginUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  logoutApi
} from '../../utils/burger-api';


interface AuthState {
  user: TUser;
  isLoading: boolean;
  error: string | null;
  authChecked: boolean; 
}


const initialState: AuthState = {
  user: {
    name: '',
    email: '',
  },
  isLoading: false,
  error: null,
  authChecked: false,
};

// Регистрация
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; name: string }, thunkAPI) => {
    const response = await registerUserApi(data);
    return response;
  }
);

// Вход
export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, thunkAPI) => {
    const response = await loginUserApi(data);
    return response;
  }
);

// Получение данных пользователя
export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, thunkAPI) => {
  try {
    const response = await getUserApi();
    return response.user;
  } catch (error) {
    return thunkAPI.rejectWithValue('Не удалось получить данные пользователя');
  }
});

// Обновление пользователя
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<TUser>, thunkAPI) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

// Забыл пароль
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data: { email: string }) => {
    await forgotPasswordApi(data);
  }
);

// Сброс пароля
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { password: string; token: string }) => {
    await resetPasswordApi(data);
  }
);

// Выход
export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
});

// Создаем слайс
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Можно добавить синхронные редьюсеры
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Обработка регистрации
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка регистрации';
      });

    // Обработка входа
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка входа';
      });

    // Обработка получения данных пользователя
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.authChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.user = {
          name: '',
          email: '',
        };
        state.authChecked = true; // завершена проверка, и пользователь не авторизован
      });

    // Обработка обновления пользователя
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка обновления';
      });

    // Обработка сброса пароля / восстановления
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка при сбросе пароля';
      });

    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка при сбросе пароля';
      });

    // Выход
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = {
          name: '',
          email: '',
        };
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка выхода';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;