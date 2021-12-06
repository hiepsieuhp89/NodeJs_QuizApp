const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Question = mongoose.model('Questions');

function getRandomArbitrary(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

router.get('/', (req, res) => {
  res.render("client/index",{});
});

// router.get('/questions/random/10', (req, res) => {
//   Question.find((err, ques) => {
//     if (!err) {
//       ques = ques.map(item => item.toObject());
//       res.send(ques);
//     }
//     else {
//         console.log('Error in retrieving list :' + err);
//     }
//   });
// });

module.exports = router;