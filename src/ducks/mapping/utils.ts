import type {SPSCustomerMapField, SPSValueMap} from "chums-types/edi";
import type {CustomerMap} from "../../appTypes";

export function parseLookupMap(fields:SPSCustomerMapField[]):CustomerMap {
    const map:CustomerMap = {};
    fields.forEach(f => map[f.field] = f.value);
    return map;
}

export function valueMapSorter(a:SPSValueMap, b:SPSValueMap) {
    return a.id - b.id;
}
