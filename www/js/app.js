// Ionic Starter App

// Starter global variables
var db = null;
var hidemenu = "";
var nobackground = false;
var trackids = null;
var mediaRecorder;
var platformready = false;
var path;
var pathFiles = "Tracks";
var today;
var numPictures = 0;
var localConfig = {};

// Get actual date
function getDateNow(){
  today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 
  
  if(mm<10) 
  {
      mm='0'+mm;
  } 
  today = mm+'-'+dd+'-'+yyyy;
}


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default 
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }

    platformready = true;
    
    var optionsDB = {
      name: 'TDDM.db',
      location: 'default',
      androidDatabaseProvider: 'system'
    }

    ///////////////////////////////
    //////////// INIT DB //////////
    ///////////////////////////////
    
    if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB(optionsDB);
    } else {
      // Ionic serve syntax
      db = window.openDatabase(optionsDB, "1.0", "TDDM", -1);
    }

    if(db != null && db != undefined)
    {
      $cordovaSQLite.execute(db, "SELECT * FROM SUS1").then(function(res){
        console.log(res);
        //var query = "INSERT INTO SUS1 (trackId, pointlatitude, pointlongitude) VALUES ('0','1.0', '1.0')";
        //$cordovaSQLite.execute(db, query);
      }, function(err){
        // $cordovaSQLite.execute(db, "DROP TABLE ROUTE");
        // $cordovaSQLite.execute(db, "DROP TABLE SUS1");
        $cordovaSQLite.execute(db, "CREATE TABLE SUS1 (trackid text, pointlatitude text, pointlongitude text)");
        // var query = "INSERT INTO ROUTE (trackId, pointlatitude, pointlongitude) VALUES ('0','1.0', '1.0')";
        // $cordovaSQLite.execute(db, query);
      });
    }
    else
    {
      console.log("Error creating, accessing DB...")
    }

    // Set date on init
    getDateNow();

    // Set value for trackids
    if(window.localStorage.getItem("trackids") == undefined){
      window.localStorage.setItem("trackids", 0);
    }

    // Get value for trackids
    trackids = window.localStorage.getItem("trackids");

    // On device ready, restore configuration
    if (window.localStorage.getItem("AllowGps") == undefined)
    {
      window.localStorage.setItem("AllowGps", "false");
      window.localStorage.setItem("AllowVideo", "false");
      window.localStorage.setItem("AllowAudio", "false");
      window.localStorage.setItem("AllowPhoto", "false");
      window.localStorage.setItem("AllowStorage", "false");
      window.localStorage.setItem("AllowSms", "false");
      window.localStorage.setItem("AllowPhone", "false");
      window.localStorage.setItem("EmergencyAlert", "false");
      window.localStorage.setItem("FamilyAlert", "false");
      window.localStorage.setItem("CallMedic", "false");
      window.localStorage.setItem("CallPolice", "false");
      window.localStorage.setItem("CallFamily", "false");
      window.localStorage.setItem("SendSms", "false");
      window.localStorage.setItem("AlertTimeEmergency", "5");
      window.localStorage.setItem("AlertTimeFamily", "5");
      window.localStorage.setItem("MedicPhone", "");
      window.localStorage.setItem("PolicePhone", "");
      window.localStorage.setItem("FamilyPhone", "");
      window.localStorage.setItem("ShowPermissions", "true");
    }

    localConfig = {
      AllowGps : window.localStorage.getItem("AllowGps"),
      AllowVideo : window.localStorage.getItem("AllowVideo"),
      AllowAudio : window.localStorage.getItem("AllowAudio"),
      AllowPhoto : window.localStorage.getItem("AllowPhoto"),
      AllowStorage : window.localStorage.getItem("AllowStorage"),
      AllowSms : window.localStorage.getItem("AllowSms"),
      AllowPhone : window.localStorage.getItem("AllowPhone"),
      EmergencyAlert : window.localStorage.getItem("EmergencyAlert"),
      FamilyAlert : window.localStorage.getItem("FamilyAlert"),
      CallMedic : window.localStorage.getItem("CallMedic"),
      CallPolice : window.localStorage.getItem("CallPolice"),
      CallFamily : window.localStorage.getItem("CallFamily"),
      SendSms : window.localStorage.getItem("SendSms"),
      AlertTimeEmergency : window.localStorage.getItem("AlertTimeEmergency"),
      AlertTimeFamily : window.localStorage.getItem("AlertTimeFamily"),
      MedicPhone : window.localStorage.getItem("MedicPhone"),
      PolicePhone : window.localStorage.getItem("PolicePhone"),
      FamilyPhone : window.localStorage.getItem("FamilyPhone"),
      ShowPermissions : window.localStorage.getItem("ShowPermissions")
    };
    
    // Check permissions granted for app

    // //check location
    // cordova.plugins.diagnostic.getLocationAuthorizationStatus(function(status){
    //     switch(status){
    //         case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
    //             console.log("Permission not requested");
    //             break;
    //         case cordova.plugins.diagnostic.permissionStatus.DENIED:
    //             console.log("Permission denied");
    //             break;
    //         case cordova.plugins.diagnostic.permissionStatus.GRANTED:
    //             console.log("Permission granted always");
    //             window.localStorage.setItem("AllowGps", "true");
    //             localConfig.AllowGps = true;
    //             break;
    //         case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
    //             console.log("Permission granted only when in use");
    //             break;
    //     }
    // }, function(error){
    //     console.error("The following error occurred: "+error);
    // });

    // //check audio
    // cordova.plugins.diagnostic.getMicrophoneAuthorizationStatus(function(status){
    //   if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
    //       console.log("Microphone use is authorized");
    //       window.localStorage.setItem("AllowAudio", "true");
    //       localConfig.AllowAudio = true;
    //     }
    // }, function(error){
    //     console.error("The following error occurred: "+error);
    // });

    // //check camera
    // cordova.plugins.diagnostic.isCameraAuthorized({
    //     successCallback: function(authorized){
    //         console.log("App is " + (authorized ? "authorized" : "denied") + " access to the camera");
    //         window.localStorage.setItem("AllowVideo", "true");
    //         localConfig.AllowVideo = true;
    //     },
    //     errorCallback: function(error){
    //         console.error("The following error occurred: "+error);
    //     }, 
    //     externalStorage: false
    // });

    // //check storage
    // cordova.plugins.diagnostic.getExternalStorageAuthorizationStatus(function(status){
    //   if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
    //       console.log("External storage use is authorized");
    //       window.localStorage.setItem("AllowStorage", "true");
    //       localConfig.AllowStorage = true;
    //   }
    // }, function(error){
    //     console.error("The following error occurred: "+error);
    // });

    //check phone
    //check sms
    //Couldn't detect

    // path = cordova.file.externalRootDirectory;

    $state.go('app.trackrecord');
  });
})

// Configuration of route navigation, routes of different screens
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.trackrecord', {
    url: '/trackrecord',
    views: {
      'menuContent': {
        templateUrl: 'templates/trackrecord.html',
        controller: 'TrackRecordCtrl'
      }
    }
  })
  .state('app.trackhistory', {
      url: '/trackhistory',
      views: {
        'menuContent': {
          templateUrl: 'templates/trackhistory.html',
          controller: 'TrackHistoryCtrl'
        }
      }
    })
  .state('app.trackplayer', {
    url: '/trackplayer',
    views: {
      'menuContent': {
        templateUrl: 'templates/trackplayer.html',
        controller: 'TrackPlayerCtrl'
      }
    }
  })
  .state('app.configuration', {
    url: '/configuration',
    views: {
      'menuContent': {
        templateUrl: 'templates/configuration.html',
        controller: 'ConfigurationCtrl'
      }
    }
  })
  .state('app.faqs', {
    url: '/faqs',
    views: {
      'menuContent': {
        templateUrl: 'templates/faqs.html',
        controller: 'FaqsCtrl'
      }
    }
  })
  .state('app.permissions', {
    url: '/permissions',
    views: {
      'menuContent': {
        templateUrl: 'templates/permissions.html',
        controller: 'PermissionsCtrl'
      }
    }
  })
  .state('app.load', {
    url: '/load',
    views: {
      'menuContent': {
        templateUrl: 'templates/load.html',
        controller: 'AppCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/trackrecord');
});
