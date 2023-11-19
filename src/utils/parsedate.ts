import dayjs, { Dayjs } from 'dayjs'

/*
     DESC: Tries to parse the user's input into a valid date.
    PARAM: datetime - Datetime given by the user.
     POST: Returns parsed date in ISO8061 format.
*/
const parseDate = (datetime: string): string => {
    if (!dayjs(datetime).isValid()) {
        throw `'${datetime}' is not a valid time for an event.`;
    }

    const date: Dayjs = dayjs(datetime).second(0).millisecond(0);

    if (date.diff(dayjs()) <= 0) {
        throw 'A new event cannot occur in the past.';
    }

    return date.toISOString();
}   

export default parseDate;
