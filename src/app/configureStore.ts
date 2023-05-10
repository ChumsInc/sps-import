import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import csvImportReducer from '../ducks/csv-import';
import mappingReducer from '../ducks/mapping';
import customersReducer from "../ducks/customers";
import alertsReducer from "../ducks/alerts";
import appReducer from "../ducks/app";


const rootReducer = combineReducers({
    alerts: alertsReducer,
    app: appReducer,
    customers: customersReducer,
    csvImport: csvImportReducer,
    mapping: mappingReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
