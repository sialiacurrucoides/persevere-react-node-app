import React, { useEffect, useState } from 'react';
import Title from "./Title";
import WithFlash from "./WithFlash";
import axios from "axios";

function Forgot() {

    const [flash, setFlash] = useState(null);
    const [flashObj, setFlashObj] = useState({
        severity: 'info',
        message: ''
    });

    const handleSubmit = e => {
        e.preventDefault();
        const email = e.target.parentNode.childNodes[1].value;
        axios.post("/forgot", { email }).then(res => {
            console.log(res.data);
            if (res !== 'noU') {
                setFlashObj(checkEmail(email, res.data));
            } else {
                setFlashObj(checkEmail(email, ''));
            }
            setFlash(true);
            setTimeout(() => {
                setFlash(null);
            }, 5000);
        });

    };

    const checkEmail = (email, resEmail) => {
        const flashObj = {}

        if (email === resEmail) {
            flashObj.message = 'An email was sent to your account!';
            flashObj.severity = 'success';
        } else {
            flashObj.message = 'No such email.';
            flashObj.severity = 'error';
        }

        return flashObj;
    };

    return (
        <div className="wrapper">
            <div className="small-wrapper">
                <WithFlash flash={flash} msg={flashObj.message} severity={flashObj.severity}></WithFlash>
                <form className="myForm" method="post" action="/registration">
                    <Title name="New password request"></Title>
                    <input type="email" placeholder="Email" name="email" required />
                    <input type="submit" className="submitBtn" value="SEND" onClick={handleSubmit} />
                </form>
            </div>
        </div>
    )
}

export default Forgot;