const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    id: Number,
    goal: String,
    streak: Number,
    measure: String,
    done: Array,
    importance: String,
    userID: Number,
    availableStreakFreeze: Number,
    freezedDates: Array
});

const Goal = mongoose.model('Goal', GoalSchema);

module.exports = Goal;