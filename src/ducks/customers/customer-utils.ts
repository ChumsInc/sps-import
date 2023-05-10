import {SortProps} from "chums-types";
import {SPSCustomerMap, SPSValueMap, SPSCustomerKey} from "sps-integration-types";

export const customerNo = (c: SPSCustomerKey | null) => {
    if (!c || !c.ARDivisionNo || !c.CustomerNo) {
        return null;
    }
    return `${c.ARDivisionNo.toUpperCase()}-${c.CustomerNo.toUpperCase()}`;
}

export function isSameCustomer(a: SPSCustomerKey, b: SPSCustomerKey) {
    return a.Company === b.Company
        && customerNo(a) === customerNo(b);
}

export const customerSorter = (sort: SortProps<SPSCustomerMap>) =>
    (a: SPSCustomerMap, b: SPSCustomerMap) => {
        const sortMod = sort.ascending ? 1 : -1;
        switch (sort.field) {
            case 'CustomerNo':
                return ((customerNo(a) ?? '') > (customerNo(b) ?? '') ? 1 : -1) * sortMod;
            case 'CustomerName':
                return (
                    a.CustomerName.toLowerCase() === b.CustomerName.toLowerCase()
                        ? ((customerNo(a) ?? '') > (customerNo(b) ?? '') ? 1 : -1)
                        : (a.CustomerName.toLowerCase() > b.CustomerName.toLowerCase() ? 1 : -1)
                ) * sortMod;
            case 'LookupFields':
                return (
                    JSON.stringify(a.LookupFields).toLowerCase() === JSON.stringify(b.LookupFields).toLowerCase()
                        ? (a.id - b.id)
                        : (JSON.stringify(a.LookupFields).toLowerCase() > JSON.stringify(b.LookupFields).toLowerCase()
                        ? 1 : -1)
                ) * sortMod;
            default:
                return (a.id - b.id) * sortMod;
        }
    }

export const customerMappingSorter = ({field, ascending}:SortProps<SPSValueMap>) =>
    (a:SPSValueMap, b:SPSValueMap) => {
    const sortMod = ascending ? 1 : -1;
        switch (field) {
            case 'CustomerValue':
            case 'MapField':
            case 'MappedValue':
                return (
                    (a[field] ?? '').toLowerCase() === (b[field] ?? '').toLowerCase()
                        ? (a.id - b.id)
                        : ((a[field] ?? '').toLowerCase() > (b[field] ?? '').toLowerCase() ? 1 : -1)
                ) * sortMod;
            default:
                return (a.id - b.id) * sortMod;
        }
    }



/*

 */
