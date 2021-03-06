'use strict';

function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}

var previousShedinjaWidth = null;
var previousShedinjaHeight = null;
function repositionShedinjaAndAccessories() {
  let shedinja = $("#shedinja");
  let accessories = $(".accessory");

  let shedinjaOldX = parseInt(shedinja.css("left"));
  let shedinjaOldY = parseInt(shedinja.css("top"));

  let shedinjaNewX = ($(window).width() - shedinja.width()) / 2;
  let shedinjaNewY = ($(window).height() - shedinja.height()) / 2;

  shedinjaNewX = Math.max(shedinjaNewX, 0);
  shedinjaNewY = Math.max(shedinjaNewY, 0);

  shedinja
    .css("left", shedinjaNewX.toString() + "px")
    .css("top", shedinjaNewY.toString() + "px");

  let diffX = shedinjaNewX - shedinjaOldX;
  let diffY = shedinjaNewY - shedinjaOldY;

  let isWidthResized = previousShedinjaWidth !== null && previousShedinjaHeight !== null
    && ((previousShedinjaWidth !== shedinja.width()) || (previousShedinjaHeight !== shedinja.height()));

  accessories.each(function () {
    let element = $(this);
    let elementOldX = parseInt(element.css("left"));
    let elementOldY = parseInt(element.css("top"));

    let elementNewX;
    let elementNewY;
    if (isWidthResized) {
      /* Shedinja grew fatter or thinner. Assume other elements resized by the same factor.
        Calculate what their new distance from Shedinja should be. */
      let fractionalXChange = shedinja.width() / previousShedinjaWidth;
      let fractionalYChange = shedinja.height() / previousShedinjaHeight;

      let elementOldDistanceX = elementOldX - shedinjaOldX;
      let elementOldDistanceY = elementOldY - shedinjaOldY;

      let elementNewDistanceX = elementOldDistanceX * fractionalXChange;
      let elementNewDistanceY = elementOldDistanceY * fractionalYChange;

      elementNewX = shedinjaNewX + elementNewDistanceX;
      elementNewY = shedinjaNewY + elementNewDistanceY;
    } else {
      elementNewX = elementOldX + diffX;
      elementNewY = elementOldY + diffY;
    }

    if (element.hasClass("draggable")) {
      // Draggable elements must be clamped to the viewport
      let viewportWidth = $(window).width();
      let viewportHeight = $(window).height();
      let elementNewWidth = element.width();
      let elementNewHeight = element.height();
      elementNewX = clamp(elementNewX, -elementNewWidth / 2, viewportWidth - elementNewWidth / 2);
      elementNewY = clamp(elementNewY, -elementNewHeight / 2, viewportHeight - elementNewHeight / 2);
    }

    element
      .css("left", elementNewX.toString() + "px")
      .css("top", elementNewY.toString() + "px");
  });

  previousShedinjaWidth = shedinja.width();
  previousShedinjaHeight = shedinja.height();
}

repositionShedinjaAndAccessories();

$(window).on("resize.dragdrop", repositionShedinjaAndAccessories);

$("#click-to-continue-text").on("click", function() {
  transitionToPage("./pages/page2.html");
});

var draggedElement = null;
var initialOffsetX = 0;
var initialOffsetY = 0;
var initialDraggedItemX = 0;
var initialDraggedItemY = 0;

function onStartDrag (event) {
  event.preventDefault();
  draggedElement = $(this);
  draggedElement.toggleClass("shrunk", false);
  $(".most-recent-dragged").toggleClass("most-recent-dragged", false);
  draggedElement.toggleClass("most-recent-dragged", true);

  $(".attached.accessory").toggleClass("animating", false);
  $("#shedinja").toggleClass("animating", false);

  if (event.touches) {
    initialOffsetX = event.touches[0].clientX;
    initialOffsetY = event.touches[0].clientY;
  } else {
    initialOffsetX = event.clientX;
    initialOffsetY = event.clientY;
  };

  initialDraggedItemX = parseInt(draggedElement.css("left"));
  initialDraggedItemY = parseInt(draggedElement.css("top"));
};

$(".draggable.accessory").on("mousedown.dragdrop", onStartDrag);
$(".draggable.accessory").on("touchstart.dragdrop", onStartDrag);

function onDrag (event) {
  if (draggedElement !== null && draggedElement !== undefined) {
    event.preventDefault();
    let eventX;
    let eventY;
    if (event.touches) {
      eventX = event.touches[0].clientX;
      eventY = event.touches[0].clientY;
    } else {
      eventX = event.clientX;
      eventY = event.clientY;
    };

    let newX = initialDraggedItemX + eventX - initialOffsetX;
    let newY = initialDraggedItemY + eventY - initialOffsetY;

    let currentDraggedItemWidth = parseInt(draggedElement.css("width"));
    let currentDraggedItemHeight = parseInt(draggedElement.css("height"));
    let viewportWidth = $(window).width();
    let viewportHeight = $(window).height();

    newX = clamp(newX, -currentDraggedItemWidth / 2, viewportWidth - currentDraggedItemWidth / 2);
    newY = clamp(newY, -currentDraggedItemHeight / 2, viewportHeight - currentDraggedItemHeight / 2);

    draggedElement
      .css("left", newX.toString() + "px")
      .css("top", newY.toString() + "px");
  };
}

$(document).on("mousemove.dragdrop", onDrag);
$(document).on("touchmove.dragdrop", onDrag);

const shedinjaPositiveDialogue = [
  "Thanks!",
  "Aw wow!",
  "I really appreciate that!",
  "Cool!",
  "Awesome!",
  "That's really sweet of you!",
  "I love it...",
];

const shedinjaCrushDialogue = [
  "O-oh my...",
  "Is this...?",
  "How intimate...",
  "I feel pretty...",
  "Am I cute now...?",
];

const shedinjaGoLeftDialogue = [
  "Try more left...",
  "Too far right...",
  "That's wrong...",
  "Not the right spot...",
  "More to the left...",
];

const shedinjaGoRightDialogue = [
  "Try more to the right...",
  "Too far left...",
  "That's not the sweet spot...",
  "Can't you do better...?",
  "More to the right...",
];

const shedinjaGoUpDialogue = [
  "Needs to go higher up...",
  "Try higher up...",
  "Not there...",
  "Too far down...",
];

const shedinjaGoDownDialogue = [
  "Put it further down...",
  "Not so high up...",
  "That's not it...",
  "Try again...!",
];

function makeShedinjaSpeak (dialogueList) {
  let words = "";
  let randomIndex = Math.floor(
    Math.random() * dialogueList.length
  );
  words = dialogueList[randomIndex];

  let shedinja = $("#shedinja");
  let shedinjaHeadX =
    parseInt(shedinja.css("left"))
    + 0.25 * shedinja.width();
  let shedinjaHeadY =
    parseInt(shedinja.css("top"))
    + 0.3 * shedinja.height();

  // Heuristically good values for positioning Shedinja's speech bubbles
  let leftValue = shedinjaHeadX + (Math.random() - 0.5) * shedinja.width() * 0.1;
  let topValue = shedinjaHeadY - Math.random() * shedinja.height() * 0.15;

  let newSpanElement = $(`
    <span class="shedinja-spoken-words unselectable">${words}</span>
  `)
    .css("left", leftValue.toString() + "px")
    .css("top", topValue.toString() + "px");

  $("#app-content-display-area").append(newSpanElement);

  newSpanElement.fadeOut(1500, function() {
    newSpanElement.remove();
  });
}

const tiaraTargetPercentX = [-0.27, -0.1];
const tiaraTargetPercentY = [-0.31, -0.15];

const necktieTargetPercentX = [-0.15, -0.03];
const necktieTargetPercentY = [0.2, 0.3];

const crocTargetPercentX = [-0.07, 0.025];
const crocTargetPercentY = [0.35, 0.45];

const earringTargetPercentX = [0.36, 0.43];
const earringTargetPercentY = [0.062, 0.127];

const blushTargetPercentX = [-0.25, -0.2];
const blushTargetPercentY = [0.022, 0.068];

function onDragEnd (event) {
  if (draggedElement !== null && draggedElement !== undefined) {
    event.preventDefault();

    // Check if sufficiently close to Shedinja's beautiful head
    let shedinja = $("#shedinja");
    let shedinjaCenterX =
      parseInt(shedinja.css("left"))
      + shedinja.width() / 2;
    let shedinjaCenterY =
      parseInt(shedinja.css("top"))
      + shedinja.height() / 2;
    let currentDraggedItemCenterX =
      parseInt(draggedElement.css("left"))
      + draggedElement.width() / 2;
    let currentDraggedItemCenterY =
      parseInt(draggedElement.css("top"))
      + draggedElement.height() / 2;

    let percentOffsetX = (currentDraggedItemCenterX - shedinjaCenterX) / shedinja.width();
    let percentOffsetY = (currentDraggedItemCenterY - shedinjaCenterY) / shedinja.height();

    let wasSuccessful;
    if (draggedElement.attr("id") === "tiara") {
      wasSuccessful = onItemDropped(
        percentOffsetX,
        percentOffsetY,
        tiaraTargetPercentX,
        tiaraTargetPercentY,
        shedinjaPositiveDialogue,
      );
    }
    else if (draggedElement.attr("id") === "necktie") {
      wasSuccessful = onItemDropped(
        percentOffsetX,
        percentOffsetY,
        necktieTargetPercentX,
        necktieTargetPercentY,
        shedinjaPositiveDialogue,
      );
    }
    else if (draggedElement.attr("id") === "croc") {
      wasSuccessful = onItemDropped(
        percentOffsetX,
        percentOffsetY,
        crocTargetPercentX,
        crocTargetPercentY,
        shedinjaPositiveDialogue,
      );
    }
    else if (draggedElement.attr("id") === "earring") {
      wasSuccessful = onItemDropped(
        percentOffsetX,
        percentOffsetY,
        earringTargetPercentX,
        earringTargetPercentY,
        shedinjaPositiveDialogue,
      );
    }
    else if (draggedElement.attr("id") === "blush") {
      wasSuccessful = onItemDropped(
        percentOffsetX,
        percentOffsetY,
        blushTargetPercentX,
        blushTargetPercentY,
        shedinjaCrushDialogue,
      );
    }

    if (wasSuccessful) {
      draggedElement
        .toggleClass("shrunk", false)
        .toggleClass("draggable", false)
        .toggleClass("attached", true)
        .toggleClass("most-recent-dragged", false)
        .attr("draggable", false)
        .off(".dragdrop");
    } else {
      draggedElement.toggleClass("shrunk", true);
    }

    $(".attached.accessory").toggleClass("animating", true);
    shedinja.toggleClass("animating", true);
    draggedElement = null;

    if ($(".accessory.draggable").length == 0) {
      onAllAccessoriesAttached();
    }
  }
};

$(document).on("mouseup.dragdrop", onDragEnd);
$(document).on("touchend.dragdrop", onDragEnd);

function onItemDropped(percentOffsetX, percentOffsetY, targetXArray, targetYArray, successDialogue) {
  if (percentOffsetX < targetXArray[0]) {
    makeShedinjaSpeak(shedinjaGoRightDialogue);
    return false;
  }
  else if (percentOffsetX > targetXArray[1]) {
    makeShedinjaSpeak(shedinjaGoLeftDialogue);
    return false;
  }
  else if (percentOffsetY < targetYArray[0]) {
    makeShedinjaSpeak(shedinjaGoDownDialogue);
    return false;
  }
  else if (percentOffsetY > targetYArray[1]) {
    makeShedinjaSpeak(shedinjaGoUpDialogue);
    return false;
  }
  else {
    makeShedinjaSpeak(successDialogue);
    return true;
  }
}

function onAllAccessoriesAttached() {
  $("#success-message").show();
};
