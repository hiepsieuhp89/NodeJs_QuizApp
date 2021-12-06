const mongoose = require('mongoose');

var attemptSchema = new mongoose.Schema({
    questions: {
        type: Array,
    },
    startAt: {
        type: Date
    },
    completed: {
        type: Boolean
    },
});

mongoose.model('Attempts', attemptSchema);