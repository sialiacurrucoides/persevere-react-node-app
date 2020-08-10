import React from "react";
import Unit from "./Unit";

function Weeks(props) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    let today = new Date();
    const howMany = 14;
    const weeks = [];
    const doneWeeks = props.done;
    let dayOfWeek = today.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;
    const [passed, remained] = [(1000 * 60 * 60 * 24 * (dayOfWeek - 1)), (1000 * 60 * 60 * 24 * (7 - dayOfWeek))];


    for (let i = howMany - 1; i >= 0; i--) {
        let date = new Date(today.getTime() - (60 * 60 * 24 * 7 * i * 1000));
        /* claculate the start and end of the given week */
        let weekStart = new Date(date.getTime() - (passed));
        let weekEnd = new Date(date.getTime() + (remained));

        weeks.push({
            id: i,
            month: months[date.getMonth()],
            weekStart: weekStart.getDate() + "-",
            weekEnd: weekEnd.getDate(),
            isDone: false,
            yearMonthStartEnd: [date.getFullYear(), date.getMonth(), weekStart.getDate(), weekEnd.getDate()],
            isCurrent: false
        });
    }
    if (doneWeeks.length > 0) {
        const dates = weeks.map(item => item.yearMonthStartEnd);

        doneWeeks.forEach((item) => {
            for (let t = 0; t < dates.length; t++) {
                if (item.toString() === dates[t].toString()) {
                    weeks[t].isDone = true;
                }
            }
        });
    }

    /* the last item is special because represents the actual date */
    weeks[howMany - 1].isCurrent = true;

    return <>
        <div className="calendar">
            {weeks.map(item => <Unit key={item.id}
                month={item.month}
                date1={item.weekStart}
                date2={item.weekEnd}
                fullDate={item.yearMonthStartEnd}
                wasDone={item.isDone}
                isCurrent={item.isCurrent}
                goal={props.goal}
                calendar={"now"}
                measure="weeks"></Unit>)}
        </div>
    </>
}

export default Weeks;