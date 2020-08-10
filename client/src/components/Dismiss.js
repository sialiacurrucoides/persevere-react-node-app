import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { Link } from "react-router-dom";

function Dismiss() {

    return (
        <div className="dismiss">
            <Link to="/">
                <CloseIcon></CloseIcon>
            </Link>
        </div>
    )
}

export default Dismiss;