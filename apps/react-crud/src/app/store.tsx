import { configureStore } from "@reduxjs/toolkit";
import { api } from "./Modules/Slices/slice";
import { GridApi } from "./Modules/Slices/gridSlice";


export const store = configureStore({
    reducer:{
        [api.reducerPath] : api.reducer,
        [GridApi.reducerPath] : GridApi.reducer
    },
    middleware:(getDefaultMiddleWare) => getDefaultMiddleWare().concat(api.middleware, GridApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;