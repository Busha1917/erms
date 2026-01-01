import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const fetchDepartments = createAsyncThunk("departments/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/departments");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addDepartment = createAsyncThunk("departments/add", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/departments", data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateDepartment = createAsyncThunk("departments/update", async (data, { rejectWithValue }) => {
  try {
    const response = await api.put(`/departments/${data.id}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteDepartment = createAsyncThunk("departments/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/departments/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const departmentsSlice = createSlice({
  name: "departments",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const index = state.list.findIndex(d => d._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.list = state.list.filter(d => d._id !== action.payload);
      });
  },
});

export default departmentsSlice.reducer;