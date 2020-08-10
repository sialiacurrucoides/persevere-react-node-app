import React, { useState } from "react";
import Unit from "./Unit";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
let today = new Date();
let day = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();
const howMany = 14;

function nowDates(doneDays) {
    let days = [];
    for (let i = howMany - 1; i >= 0; i--) {
        let date = new Date(year, month, day - i);
        days.push({
            id: i,
            month: months[date.getMonth()],
            day: date.getDate(),
            dayName: date.getDay() === 0 ? 'Sun' : weekdays[date.getDay() - 1],
            isDone: false,
            yearMonthDayNum: [date.getFullYear(), date.getMonth(), date.getDate()],
            isCurrentDay: false
        });
    }
    /* the last item is special because represents the actual date */
    days[howMany - 1].isCurrentDay = true;

    if (doneDays.length > 0) {
        const dates = days.map(item => item.yearMonthDayNum);

        doneDays.forEach((item) => {
            for (let t = 0; t < dates.length; t++) {
                if (item.toString() === dates[t].toString()) {
                    days[t].isDone = true;
                }
            }
        });
    }
    return days;
}

function calcPrevDates(doneDays) {
    let prevDays = [];
    let prevFinal = new Date(today.getTime() - (60 * 60 * 24 * howMany * 1000));
    for (let i = howMany - 1; i >= 0; i--) {
        let date = new Date(prevFinal - (60 * 60 * 24 * i * 1000));
        prevDays.push({
            id: i,
            month: months[date.getMonth()],
            day: date.getDate(),
            dayName: date.getDay() === 0 ? 'Sun' : weekdays[date.getDay() - 1],
            isDone: false,
            yearMonthDayNum: [date.getFullYear(), date.getMonth(), date.getDate()],
            isCurrentDay: false
        });
    }
    if (doneDays.length > 0) {
        const dates = prevDays.map(item => item.yearMonthDayNum);

        doneDays.forEach((item) => {
            for (let t = 0; t < dates.length; t++) {
                if (item.toString() === dates[t].toString()) {
                    prevDays[t].isDone = true;
                }
            }
        });
    }
    return prevDays;
}

function calcNextDays() {
    let nextDays = [];
    let nextFinal = new Date(today.getTime() + (60 * 60 * 24 * howMany * 1000));
    for (let i = howMany - 1; i >= 0; i--) {
        let date = new Date(nextFinal - (60 * 60 * 24 * i * 1000));
        nextDays.push({
            id: i,
            month: months[date.getMonth()],
            day: date.getDate(),
            dayName: date.getDay() === 0 ? 'Sun' : weekdays[date.getDay() - 1],
            isDone: false,
            yearMonthDayNum: [date.getFullYear(), date.getMonth(), date.getDate()],
            isCurrentDay: false
        });
    }
    console.log(nextDays);
    return nextDays;
}


function Days(props) {

    const doneDays = props.done;
    let days = nowDates(doneDays);
    const [whichCalendar, setWhichCalendar] = useState('now');
    const [datesToRender, setDatesToRender] = useState(days);

    function prevDates() {
        setDatesToRender(calcPrevDates(doneDays));
        setWhichCalendar("prev");
    }

    function nextDates() {
        setDatesToRender(calcNextDays());
        setWhichCalendar("next");
    }

    function backToCurrentTable() {
        setDatesToRender(days);
        setWhichCalendar("now");
    }

    return <>
        <div className="dateField">
            {whichCalendar === "now" && <div className="navigateCalendar">
                <div className="navigationArrow" ><ArrowBackIosIcon onClick={prevDates} ></ArrowBackIosIcon></div>
            </div>}
            {whichCalendar === "next" && <div className="navigateCalendar">
                <div className="navigationArrow" ><ArrowBackIosIcon onClick={backToCurrentTable} ></ArrowBackIosIcon></div>
            </div>}
            <div className="calendar">
                {datesToRender.map(item => <Unit key={item.id}
                    month={item.month}
                    date1={item.day}
                    date2={item.dayName}
                    fullDate={item.yearMonthDayNum}
                    wasDone={item.isDone}
                    isCurrent={item.isCurrentDay}
                    goal={props.goal}
                    calendar={whichCalendar}
                    measure="days"></Unit>)}

            </div>
            {whichCalendar === "now" && <div className="navigateCalendar">
                <div className="navigationArrow" ><ArrowForwardIosIcon onClick={nextDates} ></ArrowForwardIosIcon></div>
            </div>}
            {whichCalendar === "prev" && <div className="navigateCalendar">
                <div className="navigationArrow" ><ArrowForwardIosIcon onClick={backToCurrentTable} ></ArrowForwardIosIcon></div>
            </div>}
        </div>
    </>
}

export default Days;