import React, { useState } from "react";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Congrat from "./Congrat";
import axios from "axios";
import calculateCurrDate from "../utils/calculateCurrDate";


function Unit(props) {
    const [wasClickedAlready, setWasClickedAlready] = useState(props.wasDone);
    const [wasCompleted, setWasCompleted] = useState(false);
    const [isActivePopup, setIsActivePopup] = useState(false);
    const [checkedCurrDate, setCheckCurrDate] = useState(false);
    const [streak, setStreak] = useState(props.goal.streak);
    const [doneDates, setDoneDates] = useState(props.goal.done);
    console.log(props.wasDone, " - ", wasCompleted);
    let wasFreezed = false;
    for (let actDate of props.goal.freezedDates) {
        if (props.fullDate.toString() === actDate.toString()) {
            wasFreezed = true;
        }
    }


    function clickHandler() {
        let newDoneDate = calculateCurrDate(props.goal.measure);
        if (props.isCurrent && !wasClickedAlready && !checkedCurrDate) {
            setWasClickedAlready(true);
            setWasCompleted(true);
            setIsActivePopup(true);
            setTimeout(() => {
                setIsActivePopup(false);
            }, 1000);

            /* send update to the database */

            let newDoneDates = props.goal.done; newDoneDates.push(newDoneDate);
            async function updateData() {
                try {
                    const newStreak = streak + 1;
                    const url = '/updateCompletion/' + props.goal.id;
                    const response = await axios.patch(url, { done: newDoneDates, streak: newStreak });
                    setStreak(streak + 1);
                    //console.log('👉 Returned data:', response);
                    setCheckCurrDate(true);
                    document.querySelector(".streak").innerHTML = newStreak;
                    document.querySelector(".currentDay").classList.toggle("undoTheDay");
                } catch (e) {
                    console.log(`😱 Axios request failed: ${e}`);
                }
            }
            updateData();
        }

        if (checkedCurrDate) {
            setWasCompleted(false);
            async function undoUpdate() {
                try {
                    const url = '/updateCompletion/' + props.goal.id;
                    await axios.patch(url, { done: props.goal.done.pop(), streak: streak - 1 });
                    //console.log('👉 Returned data:', response);
                    document.querySelector(".undoTheDay").classList.toggle("undoTheDay");
                    document.querySelector(".streak").innerHTML = streak - 1;
                    setStreak(streak - 1);
                    setCheckCurrDate(false);
                    setWasClickedAlready(false);
                } catch (e) {
                    console.log(`😱 Axios request failed: ${e}`);
                }
            }
            undoUpdate();
        }
    }

    return <>
        <div className={props.isCurrent ? "unit currentDay" : "unit"} onClick={clickHandler}>
            <p><small>{props.month}</small></p>
            <p className={props.measure === 'weeks' ? "" : "middleValue"}><small>{props.date1} </small></p>
            <p><small>{props.date2}</small></p>
            {props.wasDone && !wasCompleted && <CheckCircleIcon className={wasFreezed ? "freezed" : "completed"}></CheckCircleIcon>}
            {(props.calendar === "now" && wasCompleted) && <CheckCircleIcon className={wasFreezed ? "freezed" : "completed"}></CheckCircleIcon>}

        </div>
        {isActivePopup && <Congrat></Congrat>}

    </>
}

export default Unit;