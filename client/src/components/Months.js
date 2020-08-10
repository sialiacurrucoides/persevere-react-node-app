import React from "react";
import Unit from "./Unit";

function Months(props) {
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    let today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const howMany = 12;
    const months = [];
    const doneMonths = props.done;

    for (let i = howMany - 1; i >= 0; i--) {
        let extractMonthNr = month - i;
        let yearOfUnit = year;
        extractMonthNr = (month - i < 0) ? 12 - (i - month) : (month - i);
        yearOfUnit = (month - i < 0) ? --yearOfUnit : yearOfUnit;
        months.push({
            id: i,
            month: monthNames[extractMonthNr] || 5,
            isDone: false,
            isCurrent: false,
            yearMonth: [yearOfUnit, extractMonthNr]
        });
    }

    if (doneMonths.length > 0) {
        const dates = months.map(item => item.yearMonth);

        doneMonths.forEach((item) => {
            for (let t = 0; t < dates.length; t++) {
                if (item.toString() === dates[t].toString()) {
                    months[t].isDone = true;
                }
            }
        });
    }

    /* the last item is special because represents the actual date */
    months[howMany - 1].isCurrent = true;

    return <>
        <div className="calendar">
            {months.map(item => <Unit key={item.id}
                month={' '}
                date1={item.month}
                date2={item.yearMonth[0]}
                fullDate={item.yearMonth}
                wasDone={item.isDone}
                isCurrent={item.isCurrent}
                goal={props.goal}
                calendar={"now"}
                measure="months"></Unit>)}
        </div>
    </>
}

export default Months;