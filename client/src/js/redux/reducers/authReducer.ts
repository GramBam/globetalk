import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import authService from "../services/authService";

// Get user from localstorage
const user = JSON.parse(localStorage.getItem("user") as string);

export type User = {
  username: string;
  email: string;
  token: string;
  _id: string;
  avatar: string;
};

export type UserState = {
  user: User;
  isLoading: boolean;
};

const initialState: UserState = {
  user: user ? user : null,
  isLoading: false,
};

// Register new user
export const register = createAsyncThunk(
  "auth/register",
  async (
    user: {
      username: string;
      email: string;
      password: string;
    },
    thunkAPI
  ) => {
    try {
      return await authService.register(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (
    user: {
      email: string;
      password: string;
    },
    thunkAPI
  ) => {
    try {
      return await authService.login(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// @ts-ignore
export const logout = createAction("auth/logout", () => {
  authService.logout();
  return {};
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // @ts-ignore
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
