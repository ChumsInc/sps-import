import {fetchExistingPurchaseOrder, postFile, postImportToSage} from "../../api/csv-import-api";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {selectExistingPOLoading, selectImporting, selectProcessing} from "./csv-import-selectors";
import type {SPSConversionResponse, SPSSalesOrder} from "chums-types/edi";
import type {RootState} from "@/app/configureStore";
import type {ExistingPurchaseOrder, SalesOrderImportResponse} from "../../appTypes";


export const parseFile = createAsyncThunk<SPSConversionResponse, File>(
    'csvImport/parseFile',
    async (arg) => {
        return await postFile(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return !selectProcessing(state);
        }
    }
)
export const loadExistingPurchaseOrder = createAsyncThunk<ExistingPurchaseOrder | null, SPSSalesOrder | null>(
    'csvImport/loadExistingPurchaseOrder',
    async (arg) => {
        return await fetchExistingPurchaseOrder(arg!);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && !(selectExistingPOLoading(state));
        }
    }
)

export const importToSage = createAsyncThunk<SalesOrderImportResponse|null, SPSSalesOrder>(
    'csvImport/importToSage',
    async (arg) => {
        return await postImportToSage(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && !selectImporting(state);
        }
    }
)
