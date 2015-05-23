// require.js looks for the following global when initializing
var require = {
    baseUrl: "/users/",
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        "bootstrap": "bower_modules/components-bootstrap/js/bootstrap.min",
        "crossroads": "bower_modules/crossroads/dist/crossroads.min",
        "hasher": "bower_modules/hasher/dist/js/hasher.min",
        "jquery": "bower_modules/jquery/jquery.min",
        "knockout": "bower_modules/knockout/dist/knockout",
        "knockout-projections": "bower_modules/knockout-projections/dist/knockout-projections",
        "signals": "bower_modules/js-signals/dist/signals.min",
        "text": "bower_modules/requirejs-text/text",
        "validate": "bower_modules/jquery-validation/dist/jquery.validate",
        "notify": "bower_modules/notifyjs/dist/notify",
        "notify-custom": "scripts/notify-custom",
        "chosen": "bower_modules/chosen_v1.3.0/chosen.jquery",
        "moment": "bower_modules/moment/min/moment-with-locales.min",
        "datepicker": "bower_modules/bootstrap-datepicker/js/bootstrap-datepicker",
        "datepicker-locale": "bower_modules/bootstrap-datepicker/js/locales/bootstrap-datepicker.es",
        "pace": "bower_modules/pace/pace.min",
        "simplegrid": "scripts/ko.simplegrid",
        "backstretch": "scripts/jquery.backstretch.min",
        "functions": "scripts/functions"
    },
    shim: {
        "bootstrap": {deps: ["jquery"]},
        "chosen": {deps: ["jquery"]},
        "datepicker": {deps: ["jquery", "bootstrap"]},
        "validate": {deps: ["jquery"]},
        "notifyjs": {
            deps: ["jquery"]
        },
        "notify": {
            deps: ["jquery"]
        },
        "simplegrid": {
            deps: ["knockout"]
        },
        "datepicker-locale": {
            deps: ["datepicker"]
        },
        "base64": {
            deps: ["jquery"]
        },
        "backstretch": {
            deps: ["jquery"]
        },
        "notify-custom": {
            deps: ["jquery", "notify"]
        },
        "functions": {
            deps: [
                "jquery",
                "notify-custom",
                "bootstrap",
                "backstretch",
                "validate",
                "chosen",
                "datepicker-locale",
                "moment"
            ]
        }
    }
};
