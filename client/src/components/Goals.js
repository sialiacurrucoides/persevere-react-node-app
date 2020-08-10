import React, { useState, useContext } from "react";
import Fab from "@material-ui/core/Fab";
import { Link } from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
import Header from "./Header";
import Goal from "./Goal";
import Title from "./Title";
import axios from "axios";
import UserProvider from "../contexts/UserProvider";
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from "./LoadingIndicator";
import Popover from '@material-ui/core/Popover';
import Tips from "./Tips";

function Goals() {
    let currUser = useContext(UserProvider.context);
    const [userID, setUserID] = useState(0);
    //const userID = props.location.search.split("=")[1]; - old strategy with q params
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'give-a-goal' : undefined;

    if (userID === 0) {
        const userProvider = new Promise((resolve, reject) => {
            if (currUser.data.dateid > 0) {
                resolve(currUser.data);
            }
        });
        userProvider.then(
            (user) => {
                setUserID(user.dateid);
                getGoalsData();
            }
        ).catch(
            () => console.log("Something went wrong.")
        );
    }


    function getGoalsData() {
        trackPromise(
            axios.get("/goalsData/" + currUser.data.dateid).then(response => {
                setGoals(response.data);
                console.log("data arrived");
            }));
    }


    function handleInput(event) {
        setNewGoal(event.target.value);
    }

    function handleAddReq(event) {
        if (newGoal === "") {
            setAnchorEl(event.currentTarget);
            //alert("Please name a goal before clicking the add button.");
            event.preventDefault();
        }
    }


    return (
        <div className="wrapper">
            {userID !== 0 && <div className="small-wrapper">
                <Tips></Tips>
                <Header title="Add a new goal" homVisible="false" isGoalTitle={false}></Header>
                <div className="createNew">
                    <input type="text" onChange={handleInput} placeholder="My goal (short title)" value={newGoal} />
                    <Link to={{ pathname: '/create', goal: { name: newGoal, user: userID } }} className="addLink" onClick={handleAddReq}><Fab className="addBtn" aria-label="add">
                        <AddIcon></AddIcon>
                    </Fab></Link>
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
                        <p className="popOver">Please name a goal before clicking the add button.</p>
                    </Popover>
                </div>
                <Title name="Current goals"></Title>
                <LoadingIndicator />
                {goals.map(item => <Goal key={item.id} goal={item}></Goal>)}
            </div>}
        </div>
    )
}


export default Goals;