var isodate = require('isodate'),
    schedule = require('node-schedule');


var config = require('./config.json');


function log(s) {
  var d = (new Date()).toISOString();
  console.log( d + " " + s)
}

var callbacks = {
  up: function() {
    log("up!");
  },
  down: function() {
    log("down!");
  }
}

var jobs = [];

config.alerts.forEach(function(alert) {
  var date = isodate(alert.date);
  var job = schedule.scheduleJob(date, callbacks[alert.type]);
  jobs.push(job);
});

console.log(jobs.length.toString() + " jobs scheduled.")

(function wait() {
  if (jobs.length) {
    setTimeout(wait, 1000);
  }
})();
