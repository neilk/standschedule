var argv = require('minimist')(process.argv.slice(2)),
    bunyan = require('bunyan'),
    spawn = require('child_process').spawn,
    moment = require('moment'),
    schedule = require('node-schedule'),
    sprintf = require('sprintf-js').sprintf;

var APPLESCRIPT = '/usr/bin/osascript';
var SCRIPT_TEMPLATE = 'display notification "%(text)s" with title "%(title)s" sound name "%(sound)s"';

var Log = bunyan.createLogger({name: 'standschedule'})
var StartMoment = moment();

var callbacks = {
  up: function() {
    Log.info("up!");
    toast("Desk up!", "Time to stand!", "BeepRising");
  },
  down: function() {
    Log.info("down!");
    toast("Desk down!", "Time to sit.", "BeepFalling");
  }
}

function toast(title, text, sound) {
  var args = { title: title, text: text, sound: sound };
  var script = sprintf(SCRIPT_TEMPLATE, args);
  spawn('/usr/bin/osascript', ['-e', script]);
}

function loadConfig(config) {
  var startDate = StartMoment.toDate();

  Object.keys(config).forEach(function(callbackName) {
    var callback = callbacks[callbackName];
    config[callbackName].forEach(function(dateStr) {
      var date = moment(dateStr).toDate();
      if (date >= startDate) {
        schedule.scheduleJob(date, callback);
        Log.info({'scheduled': [date, callbackName]});
      }
    })
  });

}

function getConfig(argv) {
  var config = {};
  if ('test' in argv) {
    config = {
      up:   [
                StartMoment.clone().add(2, 'seconds').format('YYYY-MM-DD HH:mm:ss'),
                StartMoment.clone().subtract(2, 'seconds').format('YYYY-MM-DD HH:mm:ss')
            ],
      down: [ StartMoment.clone().add(4, 'seconds').format('YYYY-MM-DD HH:mm:ss') ],
    }
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

