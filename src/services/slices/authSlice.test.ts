/// <reference types="jest" />

import { clearError, initialState } from './authSlice';
import reducer from './authSlice';

import {
  registerUser,
  loginUser,
  fetchUser,
  updateUser,
  forgotPassword,
  resetPassword,
  logout
} from './authSlice';
import type { TUser } from '@utils-types';

const mockUser: TUser = {
  name: 'Иван',
  email: 'ivan@example.com'
};

describe('authSlice', () => {
  describe('Начальное состояние', () => {
    test('должно содержать дефолтные значения', () => {
      expect(initialState).toEqual({
        user: { name: '', email: '' },
        isLoading: false,
        error: null,
        authChecked: false
      });
    });
  });

  describe('Редьюсер: clearError', () => {
    test('обнуляет поле error', () => {
      const state = {
        ...initialState,
        error: 'Какая-то ошибка'
      };

      const nextState = reducer(state, clearError());

      expect(nextState.error).toBeNull();
    });

    test('не изменяет остальные поля', () => {
      const state = {
        ...initialState,
        isLoading: true,
        user: mockUser,
        authChecked: true
      };

      const nextState = reducer(state, clearError());

      expect(nextState.isLoading).toBe(true);
      expect(nextState.user).toEqual(mockUser);
      expect(nextState.authChecked).toBe(true);
    });
  });

  describe('Async thunk: registerUser', () => {
    describe('pending', () => {
      test('устанавливает isLoading=true и обнуляет error', () => {
        const nextState = reducer(
          initialState,
          registerUser.pending('reqId', {
            email: 'a@b.com',
            password: '123',
            name: 'Test'
          })
        );

        expect(nextState.isLoading).toBe(true);
        expect(nextState.error).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('сохраняет пользователя и сбрасывает isLoading', () => {
        const payload = {
          success: true,
          refreshToken: 'mock-refresh-token',
          accessToken: 'mock-access-token',
          user: mockUser
        };

        const nextState = reducer(
          initialState,
          registerUser.fulfilled(payload, 'reqId', {
            email: 'a@b.com',
            password: '123',
            name: 'Test'
          })
        );

        expect(nextState.user).toEqual(mockUser);
        expect(nextState.isLoading).toBe(false);
      });
    });

    describe('rejected', () => {
      test('устанавливает error и сбрасывает isLoading', () => {
        const error = new Error('Ошибка регистрации');
        const requestId = 'reqId';
        const arg = { email: 'a@b.com', password: '123', name: 'Test' };

        const nextState = reducer(
          initialState,
          registerUser.rejected(error, requestId, arg, undefined)
        );

        expect(nextState.isLoading).toBe(false);
        expect(nextState.error).toBe('Ошибка регистрации');
      });
    });

    describe('Async thunk: loginUser', () => {
      describe('pending', () => {
        test('устанавливает isLoading=true и обнуляет error', () => {
          const nextState = reducer(
            initialState,
            loginUser.pending('reqId', { email: 'a@b.com', password: '123' })
          );

          expect(nextState.isLoading).toBe(true);
          expect(nextState.error).toBeNull();
        });
      });

      describe('fulfilled', () => {
        test('сохраняет пользователя, устанавливает authChecked и сбрасывает isLoading', () => {
          const nextState = reducer(
            initialState,
            loginUser.fulfilled(mockUser, 'reqId', {
              email: 'a@b.com',
              password: '123'
            })
          );

          expect(nextState.user).toEqual(mockUser);
          expect(nextState.authChecked).toBe(true);
          expect(nextState.isLoading).toBe(false);
        });
      });

      describe('rejected', () => {
        test('устанавливает error и сбрасывает isLoading', () => {
          const error = new Error('Ошибка входа');

          const requestId = 'reqId';

          const arg = { email: 'user@example.com', password: '123456' };

          const nextState = reducer(
            initialState,
            loginUser.rejected(error, requestId, arg, undefined)
          );

          expect(nextState.isLoading).toBe(false);
          expect(nextState.error).toBe('Ошибка входа');
        });
      });
    });

    describe('Async thunk: fetchUser', () => {
      describe('pending', () => {
        test('устанавливает isLoading=true и обнуляет error', () => {
          const nextState = reducer(initialState, fetchUser.pending('reqId'));

          expect(nextState.isLoading).toBe(true);
          expect(nextState.error).toBeNull();
        });
      });

      describe('fulfilled', () => {
        test('сохраняет пользователя, устанавливает authChecked и сбрасывает isLoading', () => {
          const nextState = reducer(
            initialState,
            fetchUser.fulfilled(mockUser, 'reqId')
          );

          expect(nextState.user).toEqual(mockUser);
          expect(nextState.authChecked).toBe(true);
          expect(nextState.isLoading).toBe(false);
        });
      });

      describe('rejected', () => {
        test('сбрасывает пользователя, устанавливает authChecked=true и isLoading=false', () => {
          const error = new Error();

          const requestId = 'reqId';

          const arg = undefined;

          const nextState = reducer(
            initialState,
            fetchUser.rejected(error, requestId, arg, undefined)
          );

          expect(nextState.user).toEqual({ name: '', email: '' });
          expect(nextState.authChecked).toBe(true);
          expect(nextState.isLoading).toBe(false);
        });
      });
    });

    describe('Async thunk: updateUser', () => {
      describe('pending', () => {
        test('устанавливает isLoading=true и обнуляет error', () => {
          const nextState = reducer(
            initialState,
            updateUser.pending('reqId', { name: 'Новый' })
          );

          expect(nextState.isLoading).toBe(true);
          expect(nextState.error).toBeNull();
        });
      });

      describe('fulfilled', () => {
        test('обновляет поля пользователя и сбрасывает isLoading', () => {
          const state = {
            ...initialState,
            user: { name: 'Иван', email: 'ivan@ex.com' }
          };

          const updatedUser = { name: 'Петя', email: 'petya@example.com' };

          const nextState = reducer(
            state,
            updateUser.fulfilled(updatedUser, 'reqId', updatedUser)
          );

          expect(nextState.user.name).toBe('Петя');
          expect(nextState.user.email).toBe('petya@example.com');
          expect(nextState.isLoading).toBe(false);
        });

        describe('rejected', () => {
          test('устанавливает error и сбрасывает isLoading', () => {
            const error = new Error('Ошибка обновления');

            const requestId = 'reqId';
            const arg = { name: 'Петя' };
            const nextState = reducer(
              initialState,
              updateUser.rejected(error, requestId, arg, undefined)
            );

            expect(nextState.isLoading).toBe(false);
            expect(nextState.error).toBe('Ошибка обновления');
          });
        });
      });
    });
  });

  describe('Async thunk: forgotPassword', () => {
    describe('pending', () => {
      test('устанавливает isLoading=true и обнуляет error', () => {
        const nextState = reducer(
          initialState,
          forgotPassword.pending('reqId', { email: 'user@example.com' })
        );

        expect(nextState.isLoading).toBe(true);
        expect(nextState.error).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('сбрасывает isLoading после успешного вызова', () => {
        const nextState = reducer(
          initialState,
          forgotPassword.fulfilled(undefined, 'reqId', {
            email: 'user@example.com'
          })
        );

        expect(nextState.isLoading).toBe(false);
      });
    });

    describe('rejected', () => {
      test('устанавливает error и сбрасывает isLoading при ошибке', () => {
        const error = new Error('Ошибка отправки запроса на сброс пароля');
        const requestId = 'reqId';
        const arg = { email: 'user@example.com' };

        const nextState = reducer(
          initialState,
          forgotPassword.rejected(error, requestId, arg, undefined)
        );

        expect(nextState.isLoading).toBe(false);
        expect(nextState.error).toBe('Ошибка отправки запроса на сброс пароля');
      });
    });
  });

  describe('Async thunk: resetPassword', () => {
    describe('pending', () => {
      test('устанавливает isLoading=true и обнуляет error', () => {
        const nextState = reducer(
          initialState,
          resetPassword.pending('reqId', {
            password: 'newpass123',
            token: 'reset-token'
          })
        );

        expect(nextState.isLoading).toBe(true);
        expect(nextState.error).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('сбрасывает isLoading после успешного сброса пароля', () => {
        const nextState = reducer(
          initialState,
          resetPassword.fulfilled(undefined, 'reqId', {
            password: 'newpass123',
            token: 'reset-token'
          })
        );

        expect(nextState.isLoading).toBe(false);
      });
    });

    describe('rejected', () => {
      test('устанавливает error и сбрасывает isLoading при ошибке', () => {
        const error = new Error('Ошибка сброса пароля');
        const requestId = 'reqId';
        const arg = { password: 'newpass123', token: 'reset-token' };

        const nextState = reducer(
          initialState,
          resetPassword.rejected(error, requestId, arg, undefined)
        );

        expect(nextState.isLoading).toBe(false);
        expect(nextState.error).toBe('Ошибка сброса пароля');
      });
    });
  });

  describe('Async thunk: logout', () => {
    describe('pending', () => {
      test('устанавливает isLoading=true и обнуляет error', () => {
        const nextState = reducer(initialState, logout.pending('reqId'));

        expect(nextState.isLoading).toBe(true);
        expect(nextState.error).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('сбрасывает пользователя и isLoading после выхода', () => {
        const stateWithUser = {
          ...initialState,
          user: { name: 'Иван', email: 'ivan@example.com' },
          authChecked: true
        };

        const nextState = reducer(
          stateWithUser,
          logout.fulfilled(undefined, 'reqId')
        );

        expect(nextState.user).toEqual({ name: '', email: '' });
        expect(nextState.isLoading).toBe(false);
      });
    });

    describe('rejected', () => {
      test('устанавливает error и сбрасывает isLoading при ошибке выхода', () => {
        const error = new Error('Ошибка выхода из системы');
        const requestId = 'reqId';

        const nextState = reducer(
          initialState,
          logout.rejected(error, requestId, undefined, undefined)
        );

        expect(nextState.isLoading).toBe(false);
        expect(nextState.error).toBe('Ошибка выхода из системы');
      });
    });
  });
});
