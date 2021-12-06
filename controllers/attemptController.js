const express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongoose = require("mongoose");
const Attempt = mongoose.model("Attempts");
const Question = mongoose.model("Questions");

router.post("/", (req, res) => {
  var questions;

  Question.find((err, ques) => {
    if (!err) {
      questions = ques.map((item) => item.toObject());
      const shuffled = questions.sort(() => 0.5 - Math.random());
      // lấy 10 câu hỏi bất kỳ
      questions = shuffled.slice(0, 10);

      var attempt = new Attempt();
      attempt.questions = questions;
      attempt.startAt = new Date();
      attempt.completed = false;
      attempt.save((err, doc) => {
        if (!err) res.status(201).send(attempt);
        else {
          console.log("Error creating new attempt : " + err);
        }
      });
    } else {
      console.log("Error in retrieving questions :" + err);
    }
  }).select("-correctAnswer");
});

router.post("/:id/submit", urlencodedParser, async (req, res) => {
  console.log(req.body);
  //save this attempt completed true and check score
  Attempt.findById(req.params.id, (err, doc) => {
    if (!err) {
      doc.completed = true;
      doc.save(() => {
        // let check score
        var score = 0;
        var correctAnswer = {};
        const checkQuestion = async function (key, value) {
          await Question.findById(key, (err, result) => {
            correctAnswer[key] = result.correctAnswer;
            console.log(
              `Checking score for question id: ${key}, user answer: ${value}`,
            );
            if (!err) {
              console.log(`Question answer is ${result.correctAnswer}`);

              //answer is correct
              if (result.correctAnswer == value) {
                score++;
                console.log("1 point for this answer");
                console.log("Score now is " + score);
              }
              //answer is not correct
              else console.log("0 point for this answer");
            }
            //cannot find the question with provided id
            else {
              console.log("Error find the question : " + err);
            }
          });
        };
        async function checkEach() {
          for (const [key, value] of Object.entries(req.body.answers)) {
            await checkQuestion(key, value);
          }
          return true;
        }
        async function waitForMark() {
          await checkEach();
          console.log(`Overall score is ${score}`);
          //make score text
          let scoreText = "";

          if (score < 5) scoreText = "Practice more to improve it :D";
          else if (score < 7) scoreText = "Good, keep up!";
          else if (score < 9) scoreText = "Well done!";
          else scoreText = "Perfect!!";

          //end making score text

          //return response to client
          let response = {
            correctAnswers: correctAnswer,
            answers: req.body.answers,
            score: score,
            scoreText: scoreText,
            completed: true,
          };
          res.send(response);
        }
        waitForMark();
      });
    } else {
      console.log("Error find the attempt : " + err);
    }
  });
});

module.exports = router;
