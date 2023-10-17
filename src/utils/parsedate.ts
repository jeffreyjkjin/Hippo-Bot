import dayjs, { Dayjs } from 'dayjs'

const parseDate = (datetime: string): string => {
    if (!dayjs(datetime).isValid()) {
        throw Error(`'${datetime}' is not a valid time for an event.`);
    }

    const date: Dayjs = dayjs(datetime);

    if (date.diff(dayjs()) <= 0) {
        throw Error(`A new event cannot occur in the past.`)
    }

    return date.toISOString();
}   

export default parseDate;
