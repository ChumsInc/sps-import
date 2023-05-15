import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchVersion} from "../../api/version";
import {RootState} from "../../app/configureStore";

export interface VersionState {
    version: string|null;
    updated: string|null;
    changed: boolean;
    loading: boolean;
}

const initialState:VersionState = {
    version: null,
    updated: null,
    changed: false,
    loading: false,
}

export const selectVersion = (state:RootState) => state.version.version;

export const loadVersion = createAsyncThunk<string|null>(
    'version/load',
    async () => {
        return await fetchVersion();
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !state.version.loading;
        }
    }
)

const versionReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadVersion.pending, (state) => {
        state.loading = true;
    })
        .addCase(loadVersion.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload && state.version && state.version !== action.payload) {
                state.changed = true;
            }
            state.version = action.payload;
        })
        .addCase(loadVersion.rejected, (state, action) => {
            state.loading = false;
        })
});

export default versionReducer;
