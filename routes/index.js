const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

router.post("/create", function (req, res) {
    const submittedGoal = req.body.newGoal;

    const goal = new Goal({
        id: submittedGoal.id,
        goal: submittedGoal.goal,
        streak: submittedGoal.streak,
        measure: submittedGoal.measure,
        done: submittedGoal.done,
        importance: submittedGoal.importance,
        userID: submittedGoal.userID,
        availableStreakFreeze: submittedGoal.availableStreakFreeze,
        freezedDates: submittedGoal.freezedDates
    });
    goal.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.send("success");
        }
    });

});

router.patch("/updateCompletion/:id", function (req, res) {

    const updateObject = req.body;
    const goalID = req.params.id;
    Goal.updateMany({ id: goalID }, { $set: updateObject }, (err) => {
        if (err) {
            console.log(err);
            res.send("something went wrong");
        } else {
            res.send("data sent");
        }
    });

});


router.get("/goalsData/:id", (req, res) => {
    const userID = req.params.id;

    Goal.find({ userID: userID }, (err, obj) => {
        if (err) {
            console.log(err);
            res.send("something went wrong");
        } else {
            if (obj) {
                res.send(obj);
            } else {
                res.send([]);
            }
        }
    });

});

router.delete("/deleteGoal/:id", (req, res) => {
    console.log("deleting server side");
    const goalID = req.params.id;
    Goal.deleteOne({ id: goalID }, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });

});


module.exports = router;