import dayjs from "dayjs";

export function mappedDate(csvDate:string, add: number):string {
    if (!csvDate) {
        return csvDate;
    }
    const date = dayjs(csvDate);
    return date.add(add, 'd').format('ddd MM/DD/YYYY');
}
