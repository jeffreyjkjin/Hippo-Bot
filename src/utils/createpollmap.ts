/*
     DESC: Creates a map with options as keys and values as array of voters.
      PRE: option is not an empty string.
    PARAM: option - A comma separated string containing all of the users poll options.
     POST: Returns map.
*/
const createPollMap = (options: string): Map<string, Array<string>> => {
    const map: Map<string, Array<string>> = new Map();

    const parsedOptions: string[] = options.split(',').filter((option: string): string => {
        // remove options that are just white space
        option = option.trim();
        return option.length > 0 && option;
    });

    parsedOptions.forEach((option: string) => {
        map.set(option, []);
    });

    return map;
}

export default createPollMap;