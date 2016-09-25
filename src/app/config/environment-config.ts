/**
 * Created by musale on 6/28/16.
 */
var productionUrl = "www.tumacredo.com";
var stagingUrl = "lb.tumacredo-stag.a087b769.svc.dockerapp.io:9000";
var localhostUrl = ["localhost", "127.0.0.1", "192.168.99.100"];

var development
    = false;
var production = false;

// considering staging and localhost as development
if (localhostUrl.indexOf(window.location.hostname) > -1 || window.location.hostname===stagingUrl){
    development = true;
}
else if (window.location.hostname === productionUrl) {
    production = true;
}
