import React from "react";
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';

function Congrat() {
    const messages = ["Awesome!", "Great!", "Nice job!", "Hurray!", "Well done"];

    function chooseCongratMsg() {
        const msg = Math.floor(Math.random() * messages.length);
        return messages[msg];
    }
    return <>
        <div className="congrat">
            <p className="smile"><EmojiEmotionsIcon fontSize="inherit"></EmojiEmotionsIcon></p>
            <p>{chooseCongratMsg()}</p>
        </div>
    </>
}

export default Congrat;