import React from "react";
import Title from "./Title";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from '@material-ui/icons/Home';
import { Link } from "react-router-dom";
import GoalTitle from "./GoalTitle";


function Header(props) {


    function truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
    };

    function handleLogout() {
        fetch('/logout', { credentials: 'same-origin' }).then(
            console.log("Logged out")
        );
    }


    return (
        <div className="header">
            <div className={props.homeVisible ? 'home' : 'home invisible'}>
                <Link to={`/goals`}>
                    <HomeIcon></HomeIcon>
                </Link>
            </div>
            {props.isGoalTitle ? <GoalTitle name={truncate(props.title, 25)} title={props.title} importance={props.importance}></GoalTitle> : <Title name={truncate(props.title, 28)}></Title>}
            <div className="out">
                <Link to="/">
                    <ExitToAppIcon onClick={handleLogout}></ExitToAppIcon>
                </Link>
            </div>
        </div>
    )
}

export default Header;