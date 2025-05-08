import {SPSConversionResponse, SPSSalesOrder} from "sps-integration-types";
import {ExistingPurchaseOrder, ExistingPurchaseOrderResponse, SalesOrderImportResponse} from "../appTypes";
import {fetchJSON} from "@chumsinc/ui-utils";
import {isExistingPO} from "../typeUtils";

export async function postFile(file: File): Promise<SPSConversionResponse> {
    return new Promise((resolve, reject) => {
        try {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.upload.addEventListener('progress', ev => {
                console.log(file.name, `${(ev.loaded / ev.total) * 100}%`);
            });

            xhr.upload.addEventListener('loadstart', () => {
                console.log(file.name, 'loadstart');
            });

            xhr.upload.addEventListener('abort', (ev) => {
                console.log(file.name, 'abort', ev);
                return reject(new Error('File upload aborted'));
            });

            xhr.upload.addEventListener('error', (ev) => {
                console.log(file.name, 'error', ev);
                return reject(new Error('File upload error'));
            });

            xhr.upload.addEventListener('timeout', (ev) => {
                console.log(file.name, 'timeout', ev);
                return reject(new Error('File upload timeout'));
            });

            xhr.upload.addEventListener('load', (ev) => {
                console.log(file.name, 'load', ev);
            });

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const {SalesOrder, mapping, csvLines, customer, ItemCodes, unitsOfMeasure} = xhr.response;
                    resolve({SalesOrder, mapping, csvLines, customer, ItemCodes, unitsOfMeasure})
                }
            };

            const url = '/api/partners/sps/upload';
            const formData = new FormData();
            formData.append(file.name, file, file.name);
            xhr.open('POST', url, true);
            xhr.send(formData);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.debug("postFile()", err.message);
                return reject(err);
            }
            console.debug("postFile()", err);
            return reject(new Error('Error in postFile()'));
        }
    })
}

export async function fetchExistingPurchaseOrder({ARDivisionNo, CustomerNo, CustomerPONo}: {
    ARDivisionNo: string;
    CustomerNo: string;
    CustomerPONo: string;
}): Promise<ExistingPurchaseOrder | null> {
    try {
        if (!ARDivisionNo || !CustomerNo) {
            return null;
        }
        const url = '/node-sage/api/CHI/salesorder/:ARDivisionNo-:CustomerNo/po/:CustomerPONo'
            .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(CustomerNo))
            .replace(':CustomerPONo', encodeURIComponent(CustomerPONo));
        const res = await fetchJSON<ExistingPurchaseOrderResponse>(url, {
            credentials: "same-origin",
            cache: 'no-cache'
        });
        if (isExistingPO(res?.SalesOrder ?? null)) {
            return res?.SalesOrder ?? null;
        }
        return null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("getExistingSalesOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("getExistingSalesOrder()", err);
        return Promise.reject(new Error('Error in getExistingSalesOrder()'));
    }
}

export async function postImportToSage(salesOrder: SPSSalesOrder): Promise<SalesOrderImportResponse|null> {
    try {
        const url = '/sage/api/sps-import.php';
        return await fetchJSON<SalesOrderImportResponse>(url, {method: 'POST', body: JSON.stringify(salesOrder)});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postImportToSage()", err.message);
            return Promise.reject(err);
        }
        console.debug("postImportToSage()", err);
        return Promise.reject(new Error('Error in postImportToSage()'));
    }
}
