var argv = require('minimist')(process.argv.slice(2)),
    exec = require('child_process').exec,
    moment = require('moment'),
    schedule = require('node-schedule');
    sprintf = require('sprintf-js').sprintf;


var APPLESCRIPT = '/usr/bin/osascript';
var SCRIPT_TEMPLATE = 'display notification "%(text)s" with title "%(title)s" sound name "%(sound)s"';


var callbacks = {
  up: function() {
    console.log("up!");
    toast("Desk up!", "Time to stand!", "BeepRising");
  },
  down: function() {
    console.log("down!");
    toast("Desk down!", "Time to sit.", "BeepFalling");
  }
}

function toast(title, text, sound) {
  var args = { title: title, text: text, sound: sound };
  var script = sprintf(SCRIPT_TEMPLATE, args);
  console.log(script);
  exec('/usr/bin/osascript', ['-e', script]);
}

function loadConfig(config) {
  var jobCount = 0;

  Object.keys(config).forEach(function(callbackName) {
    var callback = callbacks[callbackName];
    config[callbackName].forEach(function(dateStr) {
      var date = moment(dateStr).toDate();
      console.log('scheduled', date, callbackName);
      var job = schedule.scheduleJob(date, callback);
    })
    jobCount++;
  });

  console.log(jobCount.toString() + " jobs scheduled.");
}

function getConfig(argv) {
  var config = {};
  if ('test' in argv) {
    var now = moment();
    config = {
      up:   [ now.clone().add(2, 'seconds').format('YYYY-MM-DD HH:mm:ss') ],
      down: [ now.clone().add(4, 'seconds').format('YYYY-MM-DD HH:mm:ss') ],
    }
    console.log(config);
  } else {
    var configFile = './config.json';
    if ('config' in argv) {
      configFile = argv['config'];
    }
    config = require(configFile);
  }
  return config;
}

function waitForever() {
  setTimeout(waitForever, 10000);
}


loadConfig(getConfig(argv));
waitForever();

