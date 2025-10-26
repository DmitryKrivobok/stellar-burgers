import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { storeTokens } from '../../utils/cookie';

import {
  getUserApi,
  updateUserApi,
  registerUserApi,
  loginUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  logoutApi,
  TLoginData,
  refreshToken
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
    email: ''
  },
  isLoading: false,
  error: null,
  authChecked: false
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
/*
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }, thunkAPI)=> {
    try {
      const res = await loginUserApi(data);
      const { user, refreshToken, accessToken } = res;

      storeTokens(refreshToken, accessToken);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue('Login failed');
    }
  }
);*/

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data, thunkAPI) => {
    const res = await loginUserApi(data);
    if (!res.success) {
      return thunkAPI.rejectWithValue('Login failed');
    }
    const { user, refreshToken, accessToken } = res;
    storeTokens(refreshToken, accessToken);
    return user;
  }
);

// Получение данных пользователя  async (_, thunkAPI)
/*
export const fetchUser = createAsyncThunk('user/fetch', async (_, thunkAPI) => {
  try {
    const data = await getUserApi();
    return data.user; // возвращаем только пользователя
  } catch (error) {
    // можно дополнительно обработать ошибок или оставить так
    return thunkAPI.rejectWithValue(error);
  }
});*/

export const fetchUser = createAsyncThunk('user/fetch', async (_, thunkAPI) => {
  try {
    const data = await getUserApi();
    return data.user;
  } catch (error) {

    await refreshToken();
    
    return thunkAPI.rejectWithValue(error);
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
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
        console.log('слайс логин', action.payload);
        state.isLoading = false;
        state.user = action.payload;
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
        console.log('юзер после логина', action.payload);
        state.isLoading = false;
        state.user = action.payload;
        state.authChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.user = {
          name: '',
          email: ''
        };
        state.authChecked = false;
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
          email: ''
        };
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка выхода';
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
