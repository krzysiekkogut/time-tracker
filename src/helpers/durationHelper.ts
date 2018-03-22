export const getDurationString = (durationMilliseconds: number): string => {
    const secondInMilliseconds = 1000;
    const minuteInMilliseconds = 60 * secondInMilliseconds;
    const hourInMilliseconds = 60 * minuteInMilliseconds;
    const dayInMilliseconds = 24 * hourInMilliseconds;

    let result = '';

    if (durationMilliseconds >= dayInMilliseconds) {
        result += `${Math.floor(durationMilliseconds / dayInMilliseconds)}d `;
        durationMilliseconds %= dayInMilliseconds;
    }

    result += `${('00' + Math.floor(durationMilliseconds / hourInMilliseconds)).substr(-2, 2)}h:`;
    durationMilliseconds %= hourInMilliseconds;

    result += `${('00' + Math.floor(durationMilliseconds / minuteInMilliseconds)).substr(-2, 2)}m`;
    durationMilliseconds %= minuteInMilliseconds;

    return result;
};
