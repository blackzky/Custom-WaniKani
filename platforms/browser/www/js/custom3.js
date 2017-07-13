// Custom script by nameless
// Add a next button for the Custom-WaniKani Reviewer App

function main() {
    init();


    function init() {
        // Hide some stuff		
        $("#option-kana-chart").hide();
        $("#option-last-items").hide();

        // Add next button
        var next = $('<button/>', {
            text: 'Next',
            style: 'position: fixed; bottom: 10px; width: 100%; height: 3em;',
            click: function() {
                $(".icon-chevron-right").parent().click();
            }
        });
        $("body").append(next).end();
    }

}

var script = document.createElement('script');
script.appendChild(document.createTextNode('(' + main + ')();'));
(document.body || document.head || document.documentElement).appendChild(script);

console.log("[Loaded] WK Next Button");