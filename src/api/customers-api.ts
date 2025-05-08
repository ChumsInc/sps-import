import {SPSCustomerMap, SPSValueMap, SPSCustomerKey} from "sps-integration-types";
import {fetchJSON} from "@chumsinc/ui-utils";


export async function fetchCustomers():Promise<SPSCustomerMap[]>{
    try {
        const url = `/api/partners/sps/customers/`;
        const res = await fetchJSON<{customers: SPSCustomerMap[]}>(url, {cache: 'no-cache'});
        return res?.customers ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("loadCustomers()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadCustomers()", err);
        return Promise.reject(new Error('Error in loadCustomers()'));
    }
}

export async function fetchCustomerMapping(customer:SPSCustomerKey):Promise<SPSValueMap[]> {
    try {
        const url = `/api/partners/sps/mapping/${encodeURIComponent(customer.Company)}/${encodeURIComponent(customer.ARDivisionNo)}-${encodeURIComponent(customer.CustomerNo)}`;
        const response = await fetchJSON<{mapping: SPSValueMap[]}>(url, {cache: 'no-cache'})
        return response?.mapping ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchCustomerMapping()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCustomerMapping()", err);
        return Promise.reject(new Error('Error in fetchCustomerMapping()'));
    }
}
