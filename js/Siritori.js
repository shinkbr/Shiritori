"use strict";

function submitWord(){
  var input = $("#word-input");
  var text = input.val();
  addWordToHistory(text);

  input.val("");
}

function addWordToHistory(word){
  var li = $("<li>", {class: "used-word", text: word});

  var wordHistory = $("#word-history");
  wordHistory.prepend(li);
}
