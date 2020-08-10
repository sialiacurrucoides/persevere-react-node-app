function calculateCurrDate(measure) {
    const today = new Date();
    let dayOfWeek = today.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;
    const [passed, remained] = [(1000 * 60 * 60 * 24 * (dayOfWeek - 1)), (1000 * 60 * 60 * 24 * (7 - dayOfWeek))];
    const weekStart = new Date(today.getTime() - (passed));;
    const weekEnd = new Date(today.getTime() + (remained));;
    let newDoneDate;
    switch (measure) {
        case 'days':
            newDoneDate = [today.getFullYear(), today.getMonth(), today.getDate()];
            break;
        case 'weeks':
            newDoneDate = [today.getFullYear(), today.getMonth(), weekStart.getDate(), weekEnd.getDate()];
            break;
        case 'months':
            newDoneDate = [today.getFullYear(), today.getMonth()];
            break;
        default:
    }
    return newDoneDate;
}

export default calculateCurrDate;