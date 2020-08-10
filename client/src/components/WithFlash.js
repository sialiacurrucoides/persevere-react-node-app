import React from "react";
import Alert from '@material-ui/lab/Alert';
import Fade from '@material-ui/core/Fade';

const styles = {
    alert: {
        left: '0',
        pointerEvents: 'none',
        position: 'relative',
        top: 0,
        width: '100%',
        zIndex: '1500',
    }
};

function WithFlash(props) {

    return (
        <div>
            <Fade in={props.flash} timeout={{ enter: 300, exit: 1000 }}>
                <Alert style={styles.alert} severity={props.severity}>{props.msg}</Alert>
            </Fade>
        </div>
    )
};

export default WithFlash;