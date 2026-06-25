import type {SPSValueMap, SPSOrderLine} from "chums-types/edi";


export const mappingSorter = (a:SPSValueMap, b:SPSValueMap) => {
    return a.id - b.id;
}

export const csvLineSorter = (a:SPSOrderLine, b:SPSOrderLine) => {
    return +a._index - +b._index;
}
