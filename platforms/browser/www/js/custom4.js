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
    '    width: 3px;  ' +
    '    height: 3px; ' +
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
$.jStorage.listenKeyChange('currentItem', showLevel);

function showLevel() {
    var level = $.jStorage.get('currentItem').srs;
    var $wrapper = $('#srs-progress-wrapper');
    var newContent = "";
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
    } else if (level < 7) { //Guru [5,6]
        if (level === 5) {
            newContent += progress_circle_guru_completed;
            newContent += progress_circle_guru;
        } else {
            newContent += progress_circle_guru_completed;
            newContent += progress_circle_guru_completed;
            newContent += progress_circle_master;
        }
    } else if (level === 7) { //Master
        newContent += progress_circle_master_completed;
        newContent += progress_circle_enlightened;
    } else if (level === 8) { //Enlightened
        newContent += progress_circle_enlightened_completed;
        newContent += progress_circle_burned;
    }
    //console.log('##### srs level is ' + level);
    $wrapper.html(newContent);

    // Item level
    $("span#level_indicator").attr("title", "Level " + $.jStorage.get('currentItem').level);
}

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

    $("#level_indicator").css('width', '10em');
}

calculateDynamicWidth();
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

showLevel();
console.log("[Loaded] Wanikani Review SRS/Level Indicator");