import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const context = createContext(null);

const UserProvider = ({ children }) => {

    const [user, setUser] = useState({});

    useEffect(() => {
        axios.get("/user")
            .then(res => {
                setUser(res);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <context.Provider value={user}>
            {children}
        </context.Provider>
    );
};

UserProvider.context = context;

export default UserProvider;