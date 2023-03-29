export const getTimeBetweenDates = (initial:Date, final:Date) => {
    return Math.ceil(Math.abs(final.getTime()-initial.getTime())/1000);
}