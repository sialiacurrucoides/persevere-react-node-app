import React from "react";
import Tooltip from '@material-ui/core/Tooltip';

function GoalTitle(props) {

    const toolTipMsg = `${props.title}: ${props.importance}`;

    return (
        <Tooltip title={toolTipMsg}>
            <p className="title">{props.name}</p>
        </Tooltip>
    )
}

export default GoalTitle;