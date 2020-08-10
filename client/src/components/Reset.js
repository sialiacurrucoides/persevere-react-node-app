import React, { useState } from 'react';
import Title from "./Title";
import WithFlash from "./WithFlash";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

function Reset(props) {
    const [flash, setFlash] = useState(false);
    const [flashMsg, setFlashMsg] = useState('');
    const [psw1, setPsw1] = useState("");
    const [psw2, setPsw2] = useState("");
    const [severity, setSeverity] = useState("error");
    const [toLogin, setToLogin] = useState(false);

    const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;


    function handlePsw1(event) {
        setPsw1(event.target.value);
        if (re.test(event.target.value)) setFlash(false);
    }

    function handlePsw2(event) {
        setPsw2(event.target.value);
        if (psw1 === event.target.value) setFlash(false);
    }

    function comparePsws(event) {
        if (psw1 !== psw2) {
            setFlashMsg("the passwords do not match");
            setFlash(true);
        }
    }

    function validatePsw() {
        if (!re.test(psw1)) {
            setFlashMsg("Min. 8 characters, min. one uppercase, min. one lowercase letter");
            setFlash(true);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const url = props.location.pathname;
        axios.post(url, { password: psw1, confirm: psw2 }).then(res => {

            if (res.errMsg) {
                setFlashMsg(res.errMsg);
                setFlash(true);
            }
            if (res.data.successMsg) {
                setSeverity("success");
                setFlashMsg(res.data.successMsg);
                setFlash(true);
                setTimeout(() => {
                    setToLogin(true);
                }, 1000);
            }
        });
    }

    return (
        <div className="wrapper">
            <div className="small-wrapper">
                <WithFlash flash={flash} msg={flashMsg} severity={severity}></WithFlash>
                <form className="myForm" method="post" action="/reset">
                    <Title name="New password request"></Title>
                    <input type="password" placeholder="Password (min. 8 characters, min. 1 number, min. 1 upparcase, min. 1 lowercase)"
                        onChange={handlePsw1}
                        onBlur={validatePsw}
                        name="password"
                        value={psw1}
                        required />
                    <input type="password" placeholder="Confirm password"
                        onChange={handlePsw2}
                        onBlur={comparePsws}
                        name="password2"
                        value={psw2}
                    />
                    <input type="submit" className="submitBtn" value="SEND" onClick={handleSubmit} />
                </form>
                {toLogin && <Redirect to='/login' />}
            </div>
        </div>
    )
}

export default Reset;