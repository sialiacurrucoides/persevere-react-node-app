import axios from "axios";

function getGoalByID(id) {
    const url = "/goalsData/" + id;
    axios.get(url).then(response => {
        return response.data;
    });

}

export default getGoalByID;