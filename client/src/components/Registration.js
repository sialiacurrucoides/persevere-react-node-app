import React, { useState } from "react";
import Title from "./Title";
import Pdf_PP from "../PrivacyPolicy.pdf";
import Pdf_TOU from "../TermsOfUse.pdf";
import Checkbox from '@material-ui/core/Checkbox';
import Dismiss from "./Dismiss";
import { Link } from "react-router-dom";
import WithFlash from "./WithFlash";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

function Registration() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [psw1, setPsw1] = useState("");
    const [psw2, setPsw2] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [isValidPsw, setIsValidPsw] = useState(true);
    const [agreed, setAgreed] = useState(false);
    const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    const [flash, setFlash] = useState(false);
    const [flashMsg, setFlashMsg] = useState('');
    const [toRegister, setToRegister] = useState(false);


    function handlePsw1(event) {
        setPsw1(event.target.value);
        if (re.test(event.target.value)) setIsValidPsw(true);
    }

    function handlePsw2(event) {
        setPsw2(event.target.value);
        if (psw1 === event.target.value) setPasswordsMatch(true);
    }

    function handleName(event) {
        setName(event.target.value);
    }

    function handleMail(event) {
        setEmail(event.target.value);
    }

    function comparePsws(event) {
        if (psw1 !== psw2) {
            setPasswordsMatch(false);
        }
    }

    function validatePsw() {
        if (!re.test(psw1)) setIsValidPsw(false);
    }


    function handleAgreement() {
        setAgreed(!agreed);
    }

    function onTermsClick() {
        window.open(Pdf_TOU);
    }

    function onPrivacyPolicy() {
        window.open(Pdf_PP);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (isValidPsw && passwordsMatch) {
            const data = {
                name,
                email,
                password: psw1,
                password2: psw2
            }
            axios.post("/registration", data).then(res => {

                if (res.data.errMsg) {
                    setFlashMsg(res.data.errMsg);
                    setFlash(true);

                }
                if (res.data.toString() === "OK") {
                    setToRegister(true);
                    console.log("allowed to register");
                }

            });
        }
    }

    return (
        <div className="wrapper">
            <div className="small-wrapper">
                <Dismiss></Dismiss>
                {flash && <WithFlash flash={flash} msg={flashMsg} severity='error'></WithFlash>}
                <form className="myForm" method="post" action="/registration">
                    <Title name="Registration"></Title>
                    <input type="text" placeholder="Name" name="name" onChange={handleName} />
                    <input type="email" placeholder="Email" name="email" required onChange={handleMail} />
                    <input type="password" placeholder="Password (min. 8 characters, min. 1 number, min. 1 upparcase, min. 1 lowercase)"
                        onChange={handlePsw1}
                        onBlur={validatePsw}
                        name="password"
                        value={psw1}
                        required />
                    {!isValidPsw && <p className="errorMsg"><small>min. 8 characters, min. 1 number, min. 1 upparcase, min. 1 lowercase</small></p>}
                    <input type="password" placeholder="Confirm password"
                        onChange={handlePsw2}
                        onBlur={comparePsws}
                        name="password2"
                        value={psw2}
                    />
                    {!passwordsMatch && <p className="errorMsg"><small>The passwords do not match.</small></p>}
                    <div className="agreement">
                        <Checkbox color="default" onChange={handleAgreement} required={true} />
                         I agree with the &nbsp;
                        <a onClick={onTermsClick}> Terms of Use </a>&#160; and &nbsp;
                        <a onClick={onPrivacyPolicy}> Privacy Policy </a>
                    </div>
                    <input type="submit" className="submitBtn" value="REGISTER" onClick={handleSubmit} />
                </form>
                <div className="toTheMiddle">Already have an account? <Link to="/login">Log in.</Link></div>
                {toRegister && <Redirect to='/login' />}
            </div>
        </div>
    )
}

export default Registration;

