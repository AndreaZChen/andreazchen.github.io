'use strict';

var bouncingWords = [
  "Transphobia",
  "Homophobia",
  "Ableism",
  "Marmite",
  "Toxic masculinity",
  "Racism",
  "Repetitive strain injuries",
  "Drake himself",
];

function addBouncingWordsToHtml() {
  var newHtml = "";
  bouncingWords.forEach(function(word) {
    var delay = Math.random() * 1000;
    newHtml +=
      `<div
        class="bouncing-words-wrapper"
        style="animation-delay: -${delay}s"
      >
        <div style="animation-delay: -${delay}s">
          <div style="animation-delay: -${delay}s">
            <span style="animation-delay: -${delay}s">
              ${word}
            </span>
          </div>
        </div>
      </div>`;
  });
  
  document.getElementById("bounce-area").innerHTML = newHtml;
};

addBouncingWordsToHtml();
