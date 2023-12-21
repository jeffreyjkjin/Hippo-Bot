const pollSymbols: Map<number, string> = new Map([
    [0, '🇦'],
    [1, '🇧'],
    [2, '🇨'],
    [3, '🇩'],
    [4, '🇪'],
    [5, '🇫'],
    [6, '🇬'],
    [7, '🇭'],
    [8, '🇮'],
    [9, '🇯'],
    [10, '🇰'],
    [11, '🇱'],
    [12, '🇴'],
    [13, '🇲'],
    [14, '🇳'],
    [15, '🇵'],
    [16, '🇶'],
    [17, '🇷'],
    [18, '🇸'],
    [19, '🇹']
]);

/*
     DESC: Retrieves regional indicator at a given index.
      PRE: optionNum is between 0-19.
    PARAM: optionNum - The number of the option.
     POST: Returns symbol.
*/
const getPollSymbol = (optionNum: number): string => {
    return pollSymbols.get(optionNum);
}

export default getPollSymbol;