const mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
    answers: {
        type: Array,
    },
    text: {
        type: String
    },
    correctAnswer: {
        type: Number
    }
});

mongoose.model('Questions', questionSchema);