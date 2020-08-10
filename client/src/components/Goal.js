import React, { useState } from "react";
import { Divider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import axios from "axios";

function updateStreak(goal) {
    goal.streak = 0;
    console.log("streak reset");
    const url = '/updateCompletion/' + goal.id;
    axios.patch(url, { streak: goal.streak }).catch(err => { console.log(err); });
}


function checkPrevDay(goal) {
    const today = new Date();
    const yesterday = new Date(Date.now() - 864e5);
    const prevDayPropFormat = [yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()];
    const todayPropFormat = [today.getFullYear(), today.getMonth(), today.getDate()];
    if (goal.done) {
        const lastDone = goal.done[goal.done.length - 1];
        if (lastDone && lastDone.toString() !== prevDayPropFormat.toString() && lastDone.toString() !== todayPropFormat.toString()) {
            updateStreak(goal);
        }
    }
    return goal;
}

function checkPrevWeek(goal) {
    const today = new Date();
    let dayOfWeek = today.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;
    const [passed, remained] = [(1000 * 60 * 60 * 24 * (dayOfWeek - 1)), (1000 * 60 * 60 * 24 * (7 - dayOfWeek))];
    const weekStart = new Date(today.getTime() - (passed));
    const weekEnd = new Date(today.getTime() + (remained));
    const thisWeek = [today.getFullYear(), today.getMonth(), weekStart.getDate(), weekEnd.getDate()];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekStartPrev = new Date(weekAgo.getTime() - (passed));
    const weekEndPrev = new Date(weekAgo.getTime() + (remained));
    const lastWeek = [weekAgo.getFullYear(), weekAgo.getMonth(), weekStartPrev.getDate(), weekEndPrev.getDate()];
    if (goal.done) {
        const lastDone = goal.done[goal.done.length - 1];
        if (thisWeek.toString() !== lastDone.toString() && lastWeek.toString() !== lastDone.toString()) {
            updateStreak(goal);
        }
    }
    return goal;
}

function checkPrevMonth(goal) {
    const today = new Date();
    const todayPropFormat = [today.getFullYear(), today.getMonth()];
    let prevMonthPropFormat;
    if (today.getMonth() !== 0) {
        prevMonthPropFormat = [today.getFullYear(), today.getMonth() - 1];
    } else {
        prevMonthPropFormat = [today.getFullYear() - 1, 11];
    }
    if (goal.done) {
        const lastDone = goal.done[goal.done.length - 1];
        if (todayPropFormat.toString() !== lastDone.toString() && prevMonthPropFormat.toString() !== lastDone.toString()) {
            updateStreak(goal);
        }
    }
    return goal;
}

function updatedGoal(goal) {
    if (goal.measure === "days") return checkPrevDay(goal);
    if (goal.measure === "weeks") return checkPrevWeek(goal);
    if (goal.measure === "months") return checkPrevMonth(goal);
    return goal;
}



function Goal(props) {

    const [isDeleted, setIsDeleted] = useState(false);
    const goal = updatedGoal(props.goal);



    function convertToSlug(Text) {
        return Text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    }



    function handleDelete() {
        setIsDeleted(true);
        axios.delete(`/deleteGoal/${goal.id}`)
            .then(res => {
                //console.log("deleted");
            })
    }


    return <>
        {!isDeleted && <div className="goal" >
            <div className="streakPlusMeasure"><span className="streak">{goal.streak}</span>
                {goal.streak === 1 ? goal.measure.slice(0, -1) : goal.measure}</div>
            <div className="goalTitle">  {goal.goal}</div>
            <div className="actionIcons">
                <div className='deleteGoal' onClick={handleDelete}><DeleteIcon></DeleteIcon></div>
                <div className="editGoal">
                    <Link
                        to={{ pathname: `/goal/${convertToSlug(goal.goal)}`, goal: goal }}>
                        <EditIcon className="editIcon"></EditIcon></Link>
                </div>
            </div>
        </div>}
        <Divider />
    </>
}


export default Goal;