import {fetchJSON} from "chums-components";
import {CustomerLookupResponse, CustomerMap, SPSCustomerLookup} from "../appTypes";
import {SPSCustomerMap, SPSCustomerOptions, SPSValueMap, SPSCustomerKey} from "sps-integration-types";

export async function fetchSearchCustomer(value:string, signal: AbortSignal|null):Promise<SPSCustomerLookup[]> {
    try {
        if (!value || !value.trim()) {
            return [];
        }
        const url = `/api/search/customer/chums/:value`
            .replace(':value', encodeURIComponent(value));
        const res = await fetchJSON<CustomerLookupResponse>(url, {cache: 'no-cache', signal});
        return res.result ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchSearchCustomer()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSearchCustomer()", err);
        return Promise.reject(new Error('Error in fetchSearchCustomer()'));
    }
}

export async function postCustomerLookupMapping(customer: SPSCustomerKey, map: CustomerMap, options: SPSCustomerOptions): Promise<SPSCustomerMap[]> {
    try {
        const url: string = '/api/partners/sps/customers/chums/:ARDivisionNo-:CustomerNo'
            .replace(':ARDivisionNo', encodeURIComponent(customer.ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(customer.CustomerNo));
        const LookupFields = Object.keys(map).map(key => ({field: key, value: map[key]}));
        const body = JSON.stringify({LookupFields, options});
        const response = await fetchJSON<{ customers: SPSCustomerMap[] }>(url, {method: "POST", body});
        return response?.customers ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postCustomerLookupMapping()", err.message);
            return Promise.reject(err);
        }
        console.debug("postCustomerLookupMapping()", err);
        return Promise.reject(new Error('Error in postCustomerLookupMapping()'));
    }
}

export async function postCustomerMapping(customer:SPSCustomerKey, map:SPSValueMap):Promise<SPSValueMap[]> {
    try {
        const url = '/api/partners/sps/mapping/chums/:ARDivisionNo-:CustomerNo'
            .replace(':ARDivisionNo', encodeURIComponent(customer.ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(customer.CustomerNo));
        const body = JSON.stringify(map);
        const response = await fetchJSON<{mapping: SPSValueMap[]}>(url, {method: "POST", body});
        return response?.mapping ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postCustomerMapping()", err.message);
            return Promise.reject(err);
        }
        console.debug("postCustomerMapping()", err);
        return Promise.reject(new Error('Error in postCustomerMapping()'));
    }
}
