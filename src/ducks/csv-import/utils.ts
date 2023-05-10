import {SPSValueMap, SPSOrderLine} from "sps-integration-types";


export const mappingSorter = (a:SPSValueMap, b:SPSValueMap) => {
    return a.id - b.id;
}

export const csvLineSorter = (a:SPSOrderLine, b:SPSOrderLine) => {
    return +a._index - +b._index;
}
