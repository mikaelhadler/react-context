import { createSlice, createSelector } from '@reduxjs/toolkit';

const itemsSlice = createSlice({
  name: 'items',
  initialState: [],
  reducers: {
    addItem: (state, action) => {
      state.push(action.payload);
    }
  }
});

// ✅ Seletores memorizados para melhor performance
export const selectItems = state => state.items;
export const selectItemCount = createSelector(
  selectItems,
  items => items.length
);