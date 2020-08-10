import React from "react";
import Header from "./Header";
import Days from "./Days";
import Weeks from "./Weeks";
import Months from "./Months";
import StreakFreeze from "./StreakFreeze";

function GoalPage(props) {
    let goal;
    if (props.location.goal) {
        goal = props.location.goal;
    } else {
        goal = {
            id: Math.floor(Math.random() * 100),
            goal: "Your goal",
            streak: 0,
            measure: "weeks",
            done: [],
            importance: "nothing  is important",
            userID: 0
        };
    }


    return <div className="wrapper">
        <div className="small-wrapper">
            <Header title={goal.goal} homeVisible="true" importance={goal.importance} isGoalTitle={true} userID={goal.userID}></Header>
            <p className="streakLine"><span className="streak">{goal.streak}</span> </p>
            <p className="streakLine"><small>{goal.measure}</small></p>
            {goal.measure === "days" && <Days done={goal.done} goal={goal}></Days>}
            {goal.measure === "weeks" && <Weeks done={goal.done} goal={goal}></Weeks>}
            {goal.measure === "months" && <Months done={goal.done} goal={goal}></Months>}
            <StreakFreeze goal={goal}></StreakFreeze>
        </div>
    </div>
}

export default GoalPage;