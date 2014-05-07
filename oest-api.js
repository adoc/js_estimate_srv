/*
oEst - Online Estimate API Wrapper

===============================================================================
Created: 2014/05/06
Version: 0.1
Author: https://github.com/adoc/
Denedencies:
    URI     (http://medialize.github.io/URI.js/)
    ~JSON2  (https://github.com/douglascrockford/JSON-js/blob/master/json2.js)
===============================================================================

NOTES for Implementing Developer:

    We decided to not use any JS frameworks like jQuery for now. That might
change!

    Please make sure you have the JSON2 javascript module for older browser
compat (IE<=8, etc.)


    Please be aware that all functions in this code are set to "strict" mode
in case you need to modify them the strict JS conventions are in place
inside these functions.


===============================================================================
Copyright (c) 2014 C. Nicholas Long. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


var OEST_APIURL_BASE = "https://scc1.webmob.net/api/v1"; // DEV API URL
var auth_token = "12345";


(function (window) {
    "use strict";

    var zipUrlTmpl = new URITemplate(OEST_APIURL_BASE+"/zip/{zip}");


/*=============================================================================
Utility Functions
*/

    /* HTTP Request API */
    function httpRequest(url, callback, method, async) {
        var RequestApi,
            that = this;

        method = method || "GET"
        if (typeof async === "undefined" || async === null)
            async = false;

        // Prepare HTTP Request object. (Browser compat for IE<=8)
        if (window.XMLHttpRequest) {
            RequestApi = new XMLHttpRequest();

        } else if (window.ActiveXObject) {
            RequestApi = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            throw "Your browser has no HTTPRequest API that we can find.";
        }

        RequestApi.onload = function (ev) {
            var content_type = this.getResponseHeader('content-type');

            if (content_type.substring(0, 16) === "application/json"){
                this.jsonResponse = JSON.parse(this.response)
            }

            if (typeof callback === "function") {
                callback.apply(this, arguments);
            } else {
                throw "No callback given for response.";
            }
        };

        RequestApi.open(method, url, async);
        RequestApi.send();
    }


/*=============================================================================
Zip Location API wrapper
*/
    
    // async defaults to false and a callback is not neccessary.
    var getZipLocation = function(zip, async, callback) {
        var response;

        callback = callback || function (ev) {
            response = this.jsonResponse;
        };

        var zipurl = zipUrlTmpl.expand({"zip": zip});
        httpRequest(zipurl, callback, "GET", async);
        return response;
    };



/*=============================================================================
Functional Tests
*/
    function tests(){
        // TODO: Implement qUnit or jUnit for tests.
        function testHttpRequest() {
            /* Test httpRequest */
            httpRequest("https://scc1.webmob.net/api/v1/", function (ev) {
                console.log(this.jsonResponse);
                console.log(this.jsonResponse.sig === "On6t5z4edrRLTpaITVECjOmY8Lu8nGswa4WeN7TmNmDDByHtmj8IrvTHWkGMMz6IJilN1rsnSo8bycBkDT8ysSnitogXV2mF");
            });
        }

        return {httpRequest: testHttpRequest};
    }


    // Bind to globals.
    window.$OE = window.oEst = {
        getZipLocation: getZipLocation
    };

    //TODO: Implement require.js hook.

}).call(this, this)



