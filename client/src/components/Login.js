import React, { useState } from "react";
import Title from "./Title";
import { Link } from "react-router-dom";
import Dismiss from "./Dismiss";
import WithFlash from "./WithFlash";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

function Login() {
    const [flash, setFlash] = useState(false);
    const [flashMsg, setFlashMsg] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toLogin, setToLogin] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        if (password.length > 7 && username.length > 3) {
            axios.post("/login", { username, password }).then(res => {
                console.log("errMsg", res.data.errMsg);
                console.log("res", res);
                if (res.data.errMsg) {
                    setFlashMsg(res.data.errMsg);
                    setFlash(true);
                    console.log(res.data.errMsg);
                }
                console.log(res.data.toString());
                if (res.data.toString() === "OK") {
                    setToLogin(true);
                    console.log("allowed to log in");
                }

            });
        } else {
            setFlash(true);
            if (password.length < 8) setFlashMsg("Please provide a proper password");
            if (username.length < 4) setFlashMsg("Please provide an email.");
        }
    }

    function handleUsername(event) {
        setUsername(event.target.value);
    }

    function handlePassword(event) {
        setPassword(event.target.value);
    }

    return (
        <div className="wrapper">
            <div className="small-wrapper">
                <Dismiss></Dismiss>
                {flash && <WithFlash flash={flash} msg={flashMsg} severity='error'></WithFlash>}
                <form action="login" method="post" className="loginForm">
                    <Title name="Login"></Title>
                    <input type="email" placeholder="Email" name="username" onChange={handleUsername} required />
                    <input type="password" placeholder="Password" name="password" onChange={handlePassword} required />
                    <input type="submit" className="submitBtn" value="LOG IN" onClick={handleSubmit} />
                </form>
                <div className="toTheMiddle"><Link to={"/forgot"}> I forgot my password.</Link></div>
                <div className="toTheMiddle">Don't have an account? <Link to="/register">Register.</Link></div>
                {toLogin && <Redirect to='/goals' />}
            </div>

        </div>
    )
}

export default Login;