import { createReducer, on } from '@ngrx/store';
import { loginSuccess, registerSuccess, logout, loginFailure, registerFailure } from './auth.actions';

export interface AuthState {
  token: string | null;
  user: { id: number; email: string; username: string } | null;
  error: string | null;
  loading: boolean;
}

export const initialState: AuthState = {
  token: localStorage.getItem('access_token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  error: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, registerSuccess, (state, { token, user }) => ({
    ...state,
    token,
    user,
    error: null,
    loading: false,
  })),
  on(loginFailure, registerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(logout, () => ({
    token: null,
    user: null,
    error: null,
    loading: false,
  })),
);
