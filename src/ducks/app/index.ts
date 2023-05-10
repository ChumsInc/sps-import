import {Tab} from "chums-components";
import {createAction, createReducer} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";

export interface AppState {
    tabs: Tab[]
    currentTabId: string;
}

export const initialAppState: AppState = {
    tabs: [],
    currentTabId: '',
}

export const setTabs = createAction<Tab[]>('app/setTabs');
export const updateTab = createAction<Tab>('app/updateTab');
export const setCurrentTab = createAction<string>('app/setCurrentTab');

export const selectTabs = (state:RootState) => state.app.tabs;
export const selectCurrentTab = (state:RootState) => state.app.currentTabId;

const appReducer = createReducer(initialAppState, (builder) => {
    builder
        .addCase(setTabs, (state, action) => {
            state.tabs = action.payload;
        })
        .addCase(setCurrentTab, (state, action) => {
            state.currentTabId = action.payload;
        })
        .addCase(updateTab, (state, action) => {
            state.tabs = state.tabs.map(t => t.id === action.payload.id ? action.payload : t);
        })
})

export default appReducer;
