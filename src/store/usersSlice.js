import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

// Async Thunks
export const fetchUsers = createAsyncThunk("users/fetchUsers", async (includeDeleted = false, { rejectWithValue }) => {
  try {
    const response = await api.get(`/users${includeDeleted ? '?deleted=true' : ''}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Alias fetchUsers as loadSampleData to match the naming convention used in other slices and expected by components
export const loadSampleData = fetchUsers;

export const addUser = createAsyncThunk("users/addUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateUser = createAsyncThunk("users/updateUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.put(`/users/${userData.id}`, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (userId, { rejectWithValue }) => {
  try {
    await api.delete(`/users/${userId}`);
    return userId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const restoreUser = createAsyncThunk("users/restoreUser", async (userId, { rejectWithValue }) => {
  try {
    await api.put(`/users/${userId}/restore`);
    return userId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add User
      .addCase(addUser.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.list.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User (handles soft delete by updating the user's state)
      .addCase(deleteUser.fulfilled, (state, action) => {
         const index = state.list.findIndex((u) => u.id === action.payload);
         if (index !== -1) {
            state.list[index].isDeleted = true;
            state.list[index].status = 'Suspended';
         }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        const index = state.list.findIndex((u) => u.id === action.payload);
        if (index !== -1) {
          state.list[index].isDeleted = false;
          state.list[index].status = 'Active';
        }
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;