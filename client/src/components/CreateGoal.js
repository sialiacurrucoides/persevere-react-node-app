import React, { useState } from "react";
import Button from '@material-ui/core/Button';
import Header from "./Header";
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';

function CreateGoal(props) {
    const [measures, setMeasures] = useState(['days', 'weeks', 'months']);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const [measureSelected, setMeasureSelected] = useState(false);

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClose2 = () => {
        setAnchorEl2(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'provide-importance' : undefined;
    const open2 = Boolean(anchorEl2);
    const id2 = open ? 'provide-measure' : undefined;

    let authorized, goal;
    if (!props.location.goal) {
        authorized = false;
        goal = {
            name: "No one",
            user: 0
        }
    } else {
        authorized = true;
        goal = props.location.goal;
    }

    const [moveOn, setMoveOn] = useState(false);
    const [newGoal, setNewGoal] = useState({
        goal: goal.name || "",
        streak: 0,
        done: [[]],
        availableStreakFreeze: 3,
        freezedDates: [[]],
        userID: goal.user || 0
    });


    function handleMeasuresClick(event) {

        const chosenMeasure = event.currentTarget.value;
        let otherMeasures = measures.filter(item => item !== chosenMeasure);
        setMeasureSelected(true);
        setMeasures([chosenMeasure, ...otherMeasures]);
        const creationTime = new Date();
        setNewGoal(prevValue => {
            return {
                ...prevValue,
                measure: chosenMeasure,
                id: creationTime.getTime()
            };
        });
        let buttons = document.querySelectorAll(".measureBtn");
        buttons[0].classList.remove("unselectedMeasure");
        buttons[0].classList.add("selectedMeasure");
        for (let i = 1; i <= 2; i++) {
            buttons[i].classList.remove("selectedMeasure");
            buttons[i].classList.add("unselectedMeasure");
        }

    }

    function importanceInputHandler(event) {
        const reason = event.target.value;
        setNewGoal(prevValue => {
            return {
                ...prevValue,
                importance: reason,
            };
        });
    }

    function handleSubmit(event) {

        if (newGoal.importance === undefined) {
            setAnchorEl(document.querySelector(".reason"));
            //alert("Think about why is important!");
        } else {
            if (measureSelected) {
                axios.post('/create', { newGoal })
                    .then(res => {
                    }).then(() => setMoveOn(true));
            } else {
                setAnchorEl2(document.querySelector(".measureBtns"));
            }

        }


    }


    return (
        <div className="wrapper">
            {authorized && <div className="small-wrapper">
                <form action="/create" method="post" className="createGoal">
                    <Header title={newGoal.goal} homeVisible="true"></Header>
                    <textarea className="reason" type="text"
                        name="importance"
                        placeholder="It is important because..."
                        onChange={importanceInputHandler} />
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <p className="popOver">Think about why is it important!</p>
                    </Popover>
                    <div className="measureBtns">
                        <Button className="measureBtn" id={measures[0]} variant="contained" onClick={handleMeasuresClick} value={measures[0]}>{measures[0]}</Button>
                        <Button className="measureBtn" id={measures[1]} variant="contained" onClick={handleMeasuresClick} value={measures[1]}>{measures[1]}</Button>
                        <Button className="measureBtn" id={measures[2]} variant="contained" onClick={handleMeasuresClick} value={measures[2]}>{measures[2]}</Button>
                    </div>
                    <Popover
                        id={id2}
                        open={open2}
                        anchorEl={anchorEl2}
                        onClose={handleClose2}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <p className="popOver">Please select a unit!</p>
                    </Popover>
                    <Button className="submitBtn" variant="contained" onClick={handleSubmit} >CREATE</Button>
                    {moveOn && <Redirect to={`/goals`} />}
                </form>
            </div>}
        </div>
    )
}

export default CreateGoal;