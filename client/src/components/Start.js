import React from "react";
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";

function Start() {
    return (
        <div className="wrapper mainPage">
            <div className="mainContent">
                <h1 className="mainTitle">Persevere</h1>
                <p>Build up streaks showing your <strong>commitment</strong> to your goals!</p>
                <div className="inButtons">
                    <Link to="/login" underline="hover"><Button >LOG IN</Button></Link>
                    <Link to="/register" underline="none"><Button>REGISTER</Button></Link>
                </div>
            </div>
        </div>
    )
}

export default Start;