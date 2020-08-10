import React from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

function LoadingIndicator() {
    const { promiseInProgress } = usePromiseTracker();
    return (
        promiseInProgress &&
        <div className="loader">
            <Loader type="ThreeDots" color="#8ec6c5" height="80" width="80" />
        </div>
    );
}

export default LoadingIndicator;