/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        $(function() {
            // Add deffered objects --This will allow us to dynamically load javascript files with one callback...
            var csLength = app.customScripts.length;
            var defferedObjs = [];
            for (var i = 0; i < csLength; i++) {
                defferedObjs.push($.get(app.customScripts[i]));
            }

            // Use apply() instead of normally calling the $.when() function since we need to pass an array of $.get() defferred objects...
            $.when.apply(this, defferedObjs)
                .then(function() {
                    var data = arguments; // Important! --Cache the 'arguments' object so that we can refer to it on the code block below
                    var ref = cordova.InAppBrowser.open('https://www.wanikani.com/review/session', '_blank', 'location=no,zoom=no');

                    ref.addEventListener('loadstop', function() {
                        for (var j = 0; j < csLength; j++) {
                            // Use index 0 of the cached 'data' object (arguments --passed to the then() after the $.when() has succeeded) 
                            // Indexes of 'data' [0 - data, 0 - textStatus, 0 - jqXHR]
                            ref.executeScript({ code: data[j][0] }, app.customScriptAdded(j));
                        }
                    });

                    $('p#msg').hide();
                }, function(res) {
                    $('p#msg').text('Failed to load one of the custom user scripts').addClass('error-text');
                });
        });
    },

    customScriptAdded: function(index) {
        console.log(app.customScripts[index] + ' was added...');
    },

    // List of custom user scripts that will be injected to the Review Session Page of WaniKani
    customScripts: [
        'js/custom1.js',
        'js/custom2.js',
        'js/custom3.js'
    ],
};