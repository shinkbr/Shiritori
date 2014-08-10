"use strict";

var nextFirstChar;
var firstTime = true;
var count = 1;
var timeLeft = 10;
var timer;

var maxRecord = localStorage.record;

function init(){
  if(typeof maxRecord !== "undefined"){
    $("#max-record").text("過去最高: " + maxRecord);
  }
}


function playerSubmit(){
  var inputText = $("#word-input").val();
  var firstChar = inputText.charAt(0);
  var lastChar = inputText.charAt(inputText.length-1);

  $("#word-input").val("");

  if(lastChar === "ん"){
    $("#next").text("「ん」で終わっています");
    return;
  }
  else if(!firstTime && (firstChar !== nextFirstChar)){
    $("#next").text("最初の文字が違います");
    return;
  }

  var matchedWords = dict[firstChar].filter(matchElement, {"text": inputText});

  // submit and call computerSubmit if word is legal
  if(matchedWords.length > 0){
    if(firstTime){
      timer = setInterval(countDown, 1000);
    }
    var word = matchedWords[Math.floor(matchedWords.length * Math.random())];
    submit(word, true);
    computerSubmit(word["lastChar"]);
    $("#record").text("記録: " + count);
    count++;
    timeLeft = 10;
  }
  else {
    $("#next").text("'" + inputText + "'は辞書に見つかりませんでした");
  }
}

function computerSubmit(firstChar){
  var word = wordStartingWith(firstChar);
  if(typeof word !== 'undefined'){
    submit(word, false);
  }
  else{
    alert("You win!");
  }
}

function wordStartingWith(firstChar){
  var candidates = dict[firstChar].filter(matchUnusedElement);
  var word = candidates[Math.floor(candidates.length * Math.random())];

  return word;
}

function submit(word, isPlayer){
  addWordToList(word, isPlayer);
  word["used"] = true;

  // on success
  nextFirstChar = word["lastChar"];
  firstTime = false;
  $("#next").text("次 => " + word["lastChar"]);
  $("#word-input").attr("placeholder", nextFirstChar + "...");
}

function addWordToList(word, isPlayer){
  var listText = word["hiragana"] + "(" + word["kanji"] + ") => " + word["lastChar"];
  var li = $("<div>", {class: "used-word"});


  if(isPlayer){
    var leftDiv = $("<div>", {class: "left-div", text: count + "."});
    var parWord = $("<p>", {text:word["hiragana"] + "（" + word["kanji"] + "）"});
  }
  else{
    var img = $("<img>").attr({class: "firefox-logo", src: "img/computer_icon.png"});
    var leftDiv = $("<div>", {class: "left-div"}).append(img);
    var parWord = $("<p>", {text: word["hiragana"] + "（" + word["kanji"] + "）"});
  }

  li.append(leftDiv);
  li.append(parWord);

  if(isPlayer)
    li.addClass("player");
  else
    li.addClass("computer");

  $("#word-history").prepend(li);
}

function matchElement(element){
  return element["hiragana"] === this["text"] && !element["used"] && element["lastChar"] !== "ん";
}

function matchUnusedElement(element){
  return !element["used"] && element["lastChar"] !== "ん";
}

function countDown(){
  $("#time-limit").text("残り時間: " + --timeLeft);

  if(timeLeft < 1){
    clearInterval(timer);
    $("#time-limit").text("時間切れ");
    if(maxRecord && count > maxRecord){
      localStorage.setItem("record", count - 1);
    }
    else if(!maxRecord){
      localStorage.setItem("record", count - 1);
    }
  }
}
