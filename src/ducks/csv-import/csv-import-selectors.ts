import {RootState} from "../../app/configureStore";

export const selectProcessing = (state:RootState) => state.csvImport.processing;
export const selectSalesOrder = (state:RootState) => state.csvImport.salesOrder;
export const selectCSVLines = (state:RootState) => state.csvImport.csvLines;
export const selectCSVHeader = (state:RootState) => {
    const [header] = state.csvImport.csvLines.filter(line => line['Record Type'] === 'H');
    return header ?? null;
}
export const selectExistingPO = (state:RootState) => state.csvImport.existingPO;
export const selectExistingPOLoading = (state:RootState) => state.csvImport.existingPOLoading;

export const selectImportResult = (state:RootState) => state.csvImport.importResult;
export const selectImporting = (state:RootState) => state.csvImport.importing;
export const selectValidationRequired = (state:RootState) => state.csvImport.validationRequired;
