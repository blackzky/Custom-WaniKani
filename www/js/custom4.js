// ==UserScript==
// @name        Wanikani Review SRS/Level Indicator
// @namespace   mempo
// @author      Mempo
// @description Show current SRS level and how many are left before levelling up
// @run-at      document-end
// @include     https://www.wanikani.com/review/session*
// @include     http://www.wanikani.com/review/session*
// @version     1.4.3
// @run-at      document-end
// @grant       none
// ==/UserScript==

console.log('/// start of WK Review SRS Indicator');


var css =
    '#additional-content ul li {' +
    '    width: 16.5% !important' +
    '}                          ' +
    '.progress-circle {' +
    '    display: inline-block;     ' +
    '    width: 10px;  ' +
    '    height: 10px; ' +
    '    background-color: transparent;' +
    '    border: 5px solid transparent;' +
    '    border-radius: 50%; ' +
    '    margin: 0 2px; ' +
    '}                      ' +
    '.progress-apprentice { ' +
    '    border-color: #DD0093;' +
    '} ' +
    '.progress-guru { ' +
    '    border-color: #882D9E;' +
    '} ' +
    '.progress-master { ' +
    '    border-color: #294DDB;' +
    '} ' +
    '.progress-enlightened { ' +
    '    border-color: #0093DD;' +
    '} ' +
    '.progress-burned { ' +
    '    border-color: #434343;' +
    '} ' +
    //COMPLETED CIRCLES
    '.progress-apprentice-complete { ' +
    '    background-color: #DD0093;' +
    '} ' +
    '.progress-guru-complete { ' +
    '    background-color: #882D9E;' +
    '} ' +
    '.progress-master-complete { ' +
    '    background-color: #294DDB;' +
    '} ' +
    '.progress-enlightened-complete { ' +
    '    background-color: #0093DD;' +
    '} ' +
    '.progress-burned-complete { ' +
    '    background-color: #434343;' +
    '} ';

var cssDynamicWidth =
    '#additional-content ul li {' +
    '    width: 12.4% !important' +
    '} ';

var progress_circle_apprentice = '<div id="progress-circle" class="progress-circle progress-apprentice"></div>';
var progress_circle_guru = '<div id="progress-circle" class="progress-circle progress-guru"></div>';
var progress_circle_master = '<div id="progress-circle" class="progress-circle progress-master"></div>';
var progress_circle_enlightened = '<div id="progress-circle" class="progress-circle progress-enlightened"></div>';
var progress_circle_burned = '<div id="progress-circle" class="progress-circle progress-burned"></div>';

var progress_circle_apprentice_completed = '<div id="progress-circle" class="progress-circle  progress-apprentice progress-apprentice-complete"></div>';
var progress_circle_guru_completed = '<div id="progress-circle" class="progress-circle progress-guru progress-guru-complete"></div>';
var progress_circle_master_completed = '<div id="progress-circle" class="progress-circle progress-master progress-master-complete"></div>';
var progress_circle_enlightened_completed = '<div id="progress-circle" class="progress-circle progress-enlightened progress-enlightened-complete"></div>';
var progress_circle_burned_completed = '<div id="progress-circle" class="progress-circle progress-burned progress-burned-complete"></div>';

addStyle(css);

$('#additional-content ul').append('<li><span id="level_indicator" title="SRS level"><div id="srs-progress-wrapper"></div></span></li>');

//Shout-out to rfindley for the fix!
$.jStorage.listenKeyChange('currentItem', function() {
    var level = $.jStorage.get('currentItem').srs;
    var $wrapper = $('#srs-progress-wrapper');
    var newContent = "";
    var levelSTR = "N/A";
    if (level < 5) { //Apprentice [1,4]
        for (var i = 0; i < level; i++) {
            newContent += progress_circle_apprentice_completed;
        }
        for (var i = 0; i < (4 - level); i++) {
            newContent += progress_circle_apprentice;
        }
        if (level === 4) { //YAY, about to level up!
            newContent += progress_circle_guru;
        }
        levelSTR = "Apprentice: " + level;
    } else if (level < 7) { //Guru [5,6]
        if (level === 5) {
            newContent += progress_circle_guru_completed;
            newContent += progress_circle_guru;
        } else {
            newContent += progress_circle_guru_completed;
            newContent += progress_circle_guru_completed;
            newContent += progress_circle_master;
        }
        levelSTR = "Guru: " + level;
    } else if (level === 7) { //Master
        newContent += progress_circle_master_completed;
        newContent += progress_circle_enlightened;
        levelSTR = "Master";
    } else if (level === 8) { //Enlightened
        newContent += progress_circle_enlightened_completed;
        newContent += progress_circle_burned;
        levelSTR = "Enlightened";
    }
    //console.log('##### srs level is ' + level);
    $wrapper.html(newContent);

    // Item level
    $("span#level_indicator").attr("title", "Level " + levelSTR);
});

///////// Button observer
// select the target node
var target = document.querySelector('#additional-content ul');

// create an observer instance
var observer = new MutationObserver(function(mutations) {
    calculateDynamicWidth();
    fixAnswerExceptionPosition();
});

// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true };

// pass in the target node, as well as the observer options
observer.observe(target, config);


function calculateDynamicWidth() {
    var liCount = $('#additional-content ul').children().size();

    $('#additional-content ul li').toArray().forEach(
        function(item, index, list) {
            if (item.classList.contains("ignore_in_width_calc")) {
                liCount--;
            }
        }
    );
    var percentage = 100 / liCount;
    percentage -= 0.1;
    //console.log('width percentage is: ' + percentage);
    cssDynamicWidth =
        '#additional-content ul li {' +
        '    width: ' + percentage + '% !important' +
        '} ';


    addStyle(cssDynamicWidth);
}

calculateDynamicWidth();
fixAnswerExceptionPosition();
//console.log(' ##########  script ended');

function addStyle(aCss) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (head) {
        style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = aCss;
        head.appendChild(style);
        return style;
    }
    return null;
}

function fixAnswerExceptionPosition() {

    var buttonWidthPercentage = parseFloat(window.getComputedStyle(document.querySelector('#additional-content ul li:nth-last-child(1)')).width);
    var bodyWidth = parseFloat(window.getComputedStyle(document.querySelector('body')).width) - 20; //10px margin on both sides
    var buttonWidth = bodyWidth * buttonWidthPercentage / 100;
    //console.log(buttonWidthPercentage+'/'+bodyWidth+'/'+buttonWidth+'/');
    var answerExceptionWidth = 400;
    var newPosition = -200 + (buttonWidth / 2); //padding


    var i = 0;
    var positionInList = -1;
    var ignore_width_calc_button_amount = 0;
    //console.log('####inside fixanswer');
    for (i = 0; i < $('#additional-content ul').children().size() - 1; i++) {
        if ($('#additional-content ul').children()[i].id === "option-item-info") {
            positionInList = i - ignore_width_calc_button_amount; //WKWBE script
            console.log('positioninlist is: ' + positionInList);
        }
        if ($('#additional-content ul').children()[i].classList.contains("ignore_in_width_calc")) {
            ignore_width_calc_button_amount++;
        }
    }

    if (positionInList !== -1) {
        newPosition += (positionInList * buttonWidth);
        //console.log('##### new position is: ' + newPosition);
    } else {
        //console.log('##### Whoops, where did #option-item-info go?');
        return;
    }


    var cssAnswerException =
        '#additional-content #answer-exception {' +
        '    width: 400px !important;' +
        '    left: ' + newPosition + 'px !important;' +
        '}    ' +
        '#answer-exception span::before {' +
        '    left: 50% !important;' +
        '}    ' +
        '#additional-content #answer-exception span {' +
        '    width: inherit !important;' +
        '}    ';

    //console.log('@@@@@@@@@@@@@@@');
    addStyle(cssAnswerException);

}

console.log("[Loaded] Wanikani Review SRS/Level Indicator");