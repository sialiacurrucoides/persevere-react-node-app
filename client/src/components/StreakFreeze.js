import React, { useState } from "react";
import axios from "axios";
import calculateCurrDate from "../utils/calculateCurrDate";
import Tooltip from '@material-ui/core/Tooltip';

function StreakFreeze(props) {

    const streakExplanation = "If you do not want to lose your streak, but you could not achieve your goal, you can apply streak freeze a few times. Life can be complicated, but if you need too many freezes you might need to reevaluate your motivations.";

    function handleFreeze() {
        let newDoneDate = calculateCurrDate(props.goal.measure);

        async function updateData() {
            let newDoneDates = props.goal.done; newDoneDates.push(newDoneDate);
            let newFreezedDates = props.goal.freezedDates; newFreezedDates.push(newDoneDate);
            try {
                const newStreak = props.goal.streak + 1;
                const url = '/updateCompletion/' + props.goal.id;
                const response = await axios.patch(url, {
                    done: newDoneDates,
                    streak: newStreak,
                    availableStreakFreeze: props.goal.availableStreakFreeze - 1,
                    freezedDates: newFreezedDates
                });

                document.querySelector(".streak").innerHTML = newStreak;
                document.querySelector("#freezeNr").innerHTML = props.goal.availableStreakFreeze - 1;
            } catch (e) {
                console.log(`😱 Axios request failed: ${e}`);
            }
        }
        const lastFreeze = props.goal.freezedDates.slice(-1)[0];
        console.log("goal", props.goal);
        console.log("lastFreeze", lastFreeze, "newDoneDate", newDoneDate);
        if (newDoneDate.toString() !== lastFreeze.toString()) {
            updateData();
        } else {
            alert("You already applied a streak!");
        }


    }

    return (
        <Tooltip title={streakExplanation}>
            <div className="streak-freeze">
                <p><span id="freeze" onClick={handleFreeze}> Streak freeze </span> available: <span id="freezeNr">{props.goal.availableStreakFreeze}</span></p>
            </div>
        </Tooltip>
    )
}

export default StreakFreeze;