var attemptId = 0;

//Xác định các nút và phần câu hỏi
var content = document.getElementById("content");
var quiz = document.getElementById("quiz");
var startbtn = document.getElementById("startbtn");
var cmpbtn = document.getElementById("cmpbtn");
var resultbanner = document.getElementById("resultbanner");

$(document).ready(function() {   
  $(document).on('click','.answeritem.active',function(e){
    $(this).parent().find('.answeritem').css("background-color","#f1f1f1");
    $(this).css("background-color","#ddd");
    $(this).find("input.radioSelect").prop("checked", true);
  }) 
})
function restart(){
  attemptId = 0;
  quiz.innerHTML = "";
  startbtn.style.display = "inherit";
  cmpbtn.style.display = "none";
  $('#resultbanner').hide();
}
function showResultBanner(score,scoreText){
  cmpbtn.style.display = "none";
  $('#resultbanner').show();
  $('.sbpara.score').html(score+"/10");
  $('.sbpara.scorePercent').html((score * 10)+"%");
  $('.sbpara.scoreText').html(scoreText);
}
//hiển thị text html
function htmlEncode ( html )
{
    return html.replace(/[&"'\<\>]/g, function(c) 
    {
          switch (c) 
          {
              case "&":
                return "&amp;";
              case "'":
                return "&#39;";
              case '"':
                return "&quot;";
              case "<":
                return "&lt;";
              default:
                return "&gt;";
          }
    });
};

//bấm submit bài làm
function submit(){
  let formData = new FormData(document.getElementById('submitForm'));
  let answers = {};
  formData.forEach((value, key) => answers[key] = parseInt(value));

  //Tạo data json submit bài làm user
  var dataJson = {
    attemptId: attemptId,
    answers: answers
  };
  fetch('/attempts/'+attemptId+'/submit',{
    method: "POST",
    body: JSON.stringify(dataJson),
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  .then(
    function(response) {
      // if (response.status !== 200) {
      //   console.log('Lỗi, mã lỗi ' + response.status);
      //   questions = 0;
      //   return;
      // }
      // parse response data
      response.json().then(data => {

        $('.answeritem input').prop('disabled','true').prop('readonly','true');

        $('.answeritem').addClass('incorrectAnswer').removeClass('active');

        for (const [key, value] of Object.entries(data.correctAnswers)) {
          $('input[name="'+key+'"][value="'+value+'"]').parent().removeClass('incorrectAnswer').addClass('correctAnswer');
        }
        for (const [key, value] of Object.entries(data.answers)) {
          $('input[name="'+key+'"][value="'+value+'"]').parent().addClass('yourAnswer');
        }
        showResultBanner(data.score,data.scoreText);
        //alert(data.scoreText);
        console.log(data);
      })
    }
  )
  .catch(err => {
    console.log('Error :-S', err)
  });
}
//bấm bắt đầu bài làm
function showquiz(){

  var html = "";
  var questions;

  fetch('/attempts/',{ method: "POST"})
  .then(
    function(response) {
      // if (response.status !== 200) {
      //   console.log('Lỗi, mã lỗi ' + response.status);
      //   questions = 0;
      //   return;
      // }
      // parse response data
      response.json().then(data => {
        attemptId = data._id;
        questions = data.questions;
        console.log(questions);
        html = questions.map(function(obj,key){

          let objToHtml = 
          `<div class="quizitem">
            <div class="quizdeter">Question `+(key+1)+` of 10</div>
            <div class="quizques">`+htmlEncode(obj.text)+`</div>
            <div class="quizanswer">`;
          
          let answerToHtml = obj.answers.map(function(ans, id){
            return `<div class="answeritem active">
                      <input type="radio" class="radioSelect" name="`+obj._id+`" value=`+id+`>`+htmlEncode(ans)+
                    `<div class="answerLabel">
                      <div class="yourAnswerLabel">Your answer</div>
                      <div class="correctAnswerLabel">Correct answer</div>
                    </div>
                    </div>`;
          }).join("");

          objToHtml += answerToHtml + `</div></div>`;
              
          return objToHtml;

        }).join("");

        quiz.innerHTML = html;
        startbtn.style.display = "none";
        cmpbtn.style.display = "block";
      })
    }
  )
  .catch(err => {
    console.log('Error :-S', err)
  });
}