// Global variables for controller.js
var watch = null;
var counter = 0;
var globalblob;
var options = {};
var video = null;
var init = false;
var currentStream = null;
var currentTrack = {};
var currentPositionDevice = null;

// Entities
var e_track = { id : null, name : null, size : null, date : null, videoid : null, path : null, sync : null };
var e_video = { id : null, size : null, duration : null, format : null, quality : null };
var e_image = { id : null, name : null, size : null, format : null, quality : null };
var e_map = { id : null, size : null };
var e_event = { id : null, name : null, type : null, date : null };
var e_info = { id : null, avgspeed : null, maxspeed : null, coordinates : null };
// Toast notifications

function toastMessage(message, position){
  window.plugins.toast.showWithOptions({
    message: message,
    duration: "short", // 2000 ms
    position: position,
    addPixelsY:-100,
    styling: {
      opacity: 1, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
      backgroundColor: '#C0A346', // make sure you use #RRGGBB. Default #333333
      textColor: '#027388', // Ditto. Default #FFFFFF
      textSize: 15, // Default is approx. 13.
      cornerRadius: 12, // minimum is 0 (square). iOS default 20, Android default 100
      horizontalPadding: 25, // iOS default 16, Android default 50
      verticalPadding: 25 // iOS default 12, Android default 30
    }
  });
}

// Definition of different controllers used in application
angular.module('starter.controllers', ['ngCordova'])

// Logic of Menu and Modals screens
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // Form data for the login modal
    $scope.loginData = {};

    // Set title and username value
    $scope.title = "LOGIN SCREEN";
    $scope.username = "Enter username";
    //$scope.password = "Enter password";

    // Set value for icons of social media
    $scope.facebook = "";
    $scope.twitter = "";
    $scope.instagram = "";

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/loginSM.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLoginSM = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.loginSM = function() {
      $scope.modal.show();
    };

    // // Perform the login action when the user submits the login form
    // $scope.doLogin = function() {
    //   console.log('Doing login', $scope.loginData);

    //   // Simulate a login delay. Remove this and replace with your login
    //   // code if using a login system
    //   $timeout(function() {
    //     $scope.closeLoginSM();
    //   }, 1000);
    // };

    // Change title of modal screen
    $scope.changeTitle = function(text) {
      $scope.title = text;
    };

    // Clear values of fields in modal screen
    $scope.clearFields = function() {
      console.log('Clearing...');
      $scope.username = "";
      //$scope.password = "Enter password";
      $scope.title = "LOGIN SCREEN";
      $scope.facebook = "";
      $scope.twitter = "";
      $scope.instagram = "";
      $scope.googledrive = "";
    };

    // functions to change visibility of different icons in modal screen
    $scope.changeFacebook = function() {
      $scope.facebook = "button-modal-logo-clicked";
      $scope.twitter = "";
      $scope.instagram = "";
    };

    $scope.changeTwitter = function() {
      $scope.facebook = "";
      $scope.twitter = "button-modal-logo-clicked";
      $scope.instagram = "";
    };

    $scope.changeInstagram = function() {
      $scope.facebook = "";
      $scope.twitter = "";
      $scope.instagram = "button-modal-logo-clicked";
    };

    $scope.changeGoogleDrive = function(){
      $scope.googledrive = "button-gd-active";
    };

})

// Logic of TrackRecord screen
.controller('TrackRecordCtrl', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform, $cordovaSQLite, $ionicPopup, $timeout) {


      function showLoading() {
        $ionicLoading.show({
          template: '<div class="loading-color"><b>Saving track...<b></div>',
          duration: 2000
        }).then(function(){
          console.log("The loading indicator is now displayed");
        });
      };
      
      function hideLoading(){
        $ionicLoading.hide().then(function(){
          console.log("The loading indicator is now hidden");
        });
      };
      
      /////////////////////////////////////////////////
      ///////////////// AUXILIAR DIVS /////////////////
      /////////////////////////////////////////////////

      $scope.show = "display-on";
      $scope.notshow = "display-off";
      // $scope.opacity = ""

      $scope.hideAuxDiv = function(){
        $scope.show = "display-off";
        $scope.notshow = "display-on";
        // $scope.opacity = "opacity"
      }

      $scope.showAuxDiv = function(){
        $scope.show = "display-on";
        $scope.notshow = "display-off";
        // $scope.opacity = ""
      }

      /////////////////////////////////////////////////
      ///////////// POPUP FOR ACCIDENT ////////////////
      /////////////////////////////////////////////////

       // Alert dialog to cancel alert, or call to who are configured
      $scope.showAlert = function(title, template, timeout, accident) {
        var alertPopup = $ionicPopup.alert({
          // title: 'ACCIDENT DETECTED!',
          // template: 'IS NOT AN ACCIDENT ? THEN CLICK BUTTON.'
          title: title,
          template: template
        });

        alertPopup.then(function(res) {
          console.log('ALERT ACCIDENT PROCESS STOPPED.');
        });

        $timeout(function() {
          // Accident
          alertPopup.close(); //close the popup after 3 seconds for some reason
          if(accident){
            $scope.ManageAlertActions();
          }
        }, timeout);
      };

      $scope.ManageAlertActions = function(){
        if(localConfig.EmergencyAlert == "true"){
          if(localConfig.CallMedic == "true"){
            if(localConfig.MedicPhone != ""){
              //$scope.Call(localConfig.MedicPhone);
            }
          }
          else if(localConfig.CallPolice == "true"){
            //$scope.Call(localConfig.PolicePhone);
          }
        }
        else if(localConfig.FamilyAlert == "true"){
          if(localConfig.SendSms == "true"){
            // $scope.SendSMS(localConfig.FamilyPhone);
          }

          if(localConfig.CallFamily == "true"){
            if(localConfig.FamilyPhone != ""){
              $scope.Call(localConfig.FamilyPhone);
            }
          }
        }
      }

        // Alert dialog to cancel alert, or call to who are configured
        $scope.showAdvice = function(title, template) {
          var alertPopup = $ionicPopup.confirm({
            title: title,
            template: template,
            buttons: [
                      {   
                        text: '<b>Cancel<b>',
                        type: 'button-positive'
                      } ,
                      {
                        text: '<b>OK</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            cordova.plugins.diagnostic.switchToLocationSettings();
                        }
                      }
                    ]
          });

          // alertPopup.then(function(res) {
          //   if(res) {
          //     // console.log('You are sure');
          //     // $state.go('app.trackhistory');
          //     // Open settings
          //     cordova.plugins.diagnostic.switchToLocationSettings();
          //   } else {
          //     // console.log('You are not sure');
          //   }
          // });

          // $timeout(function() {
          //   alertPopup.close(); //close the popup after 3 seconds
          //   $state.go('app.trackhistory');
          // }, 2000);
        };

      //////////////////////////////////////////
      //////////// DETECT ACCIDENT /////////////
      //////////////////////////////////////////

      // Functions to activate/deactivate detection of accidents
      $scope.ActivateDetector = function(){
        // shake.startWatch(onShake, 40, onError);
      }

      $scope.DeactivateDetector = function(){
        shake.stopWatch();
      }

      // On accident detected
      onShake = function () {
        // Fired when a shake is detected
        console.log("Detected accident");
        var waitTime = 5*1000;
        if(localConfig.EmergencyAlert == "true"){
          if(localConfig.AlertTimeEmergency == "")
          {
            //waitTime = Number(localConfig.AlertTimeEmergency) * 1000;
          }
          else{
            waitTime = Number(localConfig.AlertTimeEmergency) * 1000;
          }
        }
        else if(localConfig.FamilyAlert == "true"){
          if(localConfig.AlertTimeFamily == "")
          {
            // waitTime = Number(localConfig.AlertTimeFamily) * 1000;
          }
          else{
            waitTime = Number(localConfig.AlertTimeEmergency) * 1000;
          }
        }
        $scope.showAlert('<div class="loading-color"><b>ACCIDENT DETECTED<b></div>', '<div class="loading-color"><b>Is not and accident? Then click [Cancel] button.<b></div>', waitTime, true);
      };
      
      onError = function () {
        // Fired when there is an accelerometer error (optional)
        console.log("Unknow error detection...");
      };
  
      /////////////////////////////////////////////////
      //////////////// GOOGLE MAPS ////////////////////
      /////////////////////////////////////////////////

      // Settings for google maps
      var optionsPosition = {timeout: 4000, enableHighAccuracy: true, maximumAge:100};
   
      var mapOptions = {
        center: $scope.latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl:false,
        streetViewControl:false,
        mapTypeControl:false,
        disableDefaultUI: true
      };
      
      var watchOptions = {
        timeout : 500,
        enableHighAccuracy: true, // may cause errors if true
        maximumAge: 100
      };

      var marker = null;
      var infoWindow = null;

      $scope.currentMapTrack = null;
      $scope.isTracking = false;
      $scope.trackedRoute = [];
      $scope.previousTracks = [];

      $scope.info = {};

      // Get current position of device
      $scope.getPosition = function(){
        // window.localStorage.setItem("AllowGps", "true");
        navigator.geolocation.getCurrentPosition(successPosition, errorPosition, optionsPosition);

        //$cordovaGeolocation.getCurrentPosition(options).then(function(position){        
        function successPosition(position){
          
          $scope.info = {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude,
            speed : position.coords.speed
          }

          // info entity
          e_info = { 
            id : trackids, 
            avgspeed : 0, 
            maxspeed : $scope.info.speed, 
            coordinates : $scope.info.latitude + "," + $scope.info.longitude 
          };

          currentPositionDevice = {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
          }

          // map entity
          e_map = { 
            id : trackids, 
            size : 0 
          };

          $scope.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          if($scope.map == undefined){
            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
          }
          $scope.map.setCenter($scope.latLng);
          //$scope.map.setZoom(16);

          marker = new google.maps.Marker({
            position: $scope.latLng
          });

          infoWindow = new google.maps.InfoWindow({
            content: "Starter track position"
          });

          google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open($scope.map, marker);
          });

          marker.setMap($scope.map);
          $scope.map.setCenter(marker.getPosition());
          $scope.map.setZoom(16);
        }
        
        function errorPosition(error){
          console.log("Could not get location");
        }
      }

      // Locate client on click
      $scope.locateClient = function(){
        navigator.geolocation.getCurrentPosition(successPosition2, errorPosition2, optionsPosition);
        // $cordovaGeolocation.getCurrentPosition(optionsPosition).then(function(position){
        function successPosition2(position){
          
          $scope.info = {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude,
            speed : position.coords.speed
          }

          // info entity
          e_info = { 
            id : trackids, 
            avgspeed : 0, 
            maxspeed : $scope.info.speed, 
            coordinates : $scope.info.latitude + "," + $scope.info.longitude 
          };

          currentPositionDevice = {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
          }

          // map entity
          e_map = { 
            id : trackids, 
            size : 0 
          };
          
          $scope.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          if($scope.map == undefined){
            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
          }

          $scope.map.setCenter($scope.latLng);
          marker = new google.maps.Marker({
            position: $scope.latLng
          });

          // infoWindow = new google.maps.InfoWindow({
          //   content: "Actual position!"
          // });

          // google.maps.event.addListener(marker, 'click', function () {
          //   infoWindow.open($scope.map, marker);
          // });

          marker.setMap($scope.map);
          $scope.map.setCenter(marker.getPosition());

          $scope.showAlert('<div class="loading-color"><b>CURRENT POSITION<b></div>', '<div class="loading-color"><b>Coordinates: ' + position.coords.latitude + ',' + position.coords.longitude + "<b></div>", 1000, false);
        }

        function errorPosition2(error){
          console.log("Could not get location");
        }
      };

      // Update position of device on demand a draw path
      $scope.updatePosition = function(position){

          $scope.info = {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude,
            speed : position.coords.speed
          }

          // info entity
          e_info = { 
            id : trackids, 
            avgspeed : 0, 
            maxspeed : $scope.info.speed, 
            coordinates : $scope.info.latitude + "," + $scope.info.longitude 
          };
          
          currentPositionDevice = {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
          }

          // map entity
          e_map = { 
            id : trackids, 
            size : 0 
          };
          
          $scope.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          if($scope.map == undefined){
            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
          }
          $scope.map.setCenter($scope.latLng);
          $scope.trackedRoute.push({ lat: position.coords.latitude, lng: position.coords.longitude });
          $scope.redrawPath($scope.trackedRoute);
      }

      // Load historic routes from DB
      $scope.loadHistoricRoutes = function() {
        var query = "SELECT * FROM ROUTE";
    
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res){
              $scope.previousTracks = res;
            }
        }, function (err) {
            console.log(err);
        });
      };

      // Save route to DB
      $scope.SaveRoute = function(newRoute){
        var id = newRoute.trackid;
        var points = newRoute.path;
        var query = "INSERT INTO SUS1 (trackid, pointlatitude, pointlongitude)";
        var i = 0;
        while(i<points.length){
          if(i==0){
            query = query + "VALUES ("+ id + "," + points[i].lat +"," + points[i].lng + "),";
          }          
          else if (i == (points.length-1)){
            query = query + "("+ id + "," + points[i].lat +"," + points[i].lng + ");";
          }
          else{
            query = query + " ("+ id + "," + points[i].lat +"," + points[i].lng + "),";
          }
          i++;
        }
               
        $cordovaSQLite.execute(db, query).then(function(res) {
            console.log("Route added.");
        }, function (err) {
            console.log(err);
        });
      };
      
      $scope.checkLocationBefore = function(){
        cordova.plugins.diagnostic.isLocationAvailable(function(available){
          console.log("Network location is " + (available ? "available" : "not available"));
          if(!available){
            $scope.showAdvice('<div class="loading-color"><b>LOCATION DISABLED<b></div>', '<div class="loading-color"><b>Enable location first by clicking on [OK] button.<b></div>');
          }
        }, function(error){
          console.error("The following error occurred: "+error);

        });
      }

      // Start detection of location
      $scope.startTracking = function() {
        // $scope.isTracking = true;
        $scope.checkLocationBefore();
        $scope.trackedRoute = [];
        $scope.watch = navigator.geolocation.watchPosition(successWatch, errorWatch, watchOptions);
        // watch = $cordovaGeolocation.watchPosition(watchOptions);
        // watch.then(
        //   null,
        //   function(err) {
        //     // error
        //     console.log("TIMEOUUUUUUUUUUUUUUUUUUT...")
        //   },
        //   function(position) {
        //    $scope.updatePosition(position);
        //    console.log("DETECTED CHANGE POSITION...")
        // });
      }

      function successWatch(position){
        $scope.updatePosition(position);
        console.log("DETECED NEW POSITION...")
      }
      
      function errorWatch(){
        console.log("ERROR IN WATCH POSITION...")
      }
    
      // Draw path on map
      $scope.redrawPath = function(path) {
        if ($scope.currentMapTrack) {
          $scope.currentMapTrack.setMap(null);
        }
    
        if (path.length > 1) {
          $scope.currentMapTrack = new google.maps.Polyline({
                                                        path: path,
                                                        geodesic: true,
                                                        strokeColor: '#ff00ff',
                                                        strokeOpacity: 1.0,
                                                        strokeWeight: 3
                                                      });
          $scope.currentMapTrack.setMap($scope.map);
        }
      }

      // Stop detection of location
      $scope.stopTracking = function() {
        // trackids = trackids + 1;
        showLoading();
        var newRoute = { trackid: trackids, path: $scope.trackedRoute };

        // previousTracks.push(newRoute);
        // storage.set('routes', previousTracks);
        $scope.SaveRoute(newRoute);
      
        // $scope.isTracking = false;
        // watch.clearWatch();
        navigator.geolocation.clearWatch($scope.watch);
        if($scope.currentMapTrack){
          $scope.currentMapTrack.setMap(null);
        }
        // hideLoading();
        // toastMessage("Saved track","bottom");
      }
      
      
      // $scope.showHistoryRoute = function(route) {
      //   redrawPath(route);
      // }

      $scope.checkLocation = function(){
        cordova.plugins.diagnostic.isLocationAvailable(function(available){
          console.log("Network location is " + (available ? "available" : "not available"));
          if(!available){
            //$scope.showAlert('[   LOCATION DISABLED   ]', 'To track device in maps location have to be enabled. Check it!', 2000, false);
            toastMessage("Location is not enabled", "bottom");
          }
        }, function(error){
          console.error("The following error occurred: "+error);
        });
      }

      // On enter screen activate detection
      $scope.$on('$ionicView.beforeEnter', function(){
        if(platformready){
          //$scope.startCameraAbove();
          //$scope.startRecord();
          $scope.checkLocation();
          $scope.ActivateDetector();
        }
      });

      // On leave screen stop record
      $scope.$on('$ionicView.leave', function(){
        if($scope.Istracking){
          $scope.stopRecord();
        }
      });

      // $scope.$on('$ionicView.beforeleave', function(){
      //   // Anything you can think of
      // });

      ///////////////////////////////
      ////// SCREEN RECORD //////////
      ///////////////////////////////

      // Start video and generation of track
      $scope.startRecord = function(){
        getDateNow();
        // window.localStorage.setItem("AllowVideo", "true");
        $scope.isTracking = true;
        
        if(!init){
          $scope.InitMediaRecorder();
        }
        else{          
          $scope.InitMediaRecorder();
          // video.play();
          // video.srcObject = currentStream;
          // mediaRecorder.startRecord();
        }

        $scope.getPosition();
        $scope.startTracking();
        $scope.ActivateDetector();
      }

      // Stop video and save track
      $scope.stopRecord = function(){
        trackids = Number(trackids) + 1;
        window.localStorage.setItem("trackids", trackids);
        $scope.isTracking = false;
        //video.pause();
        video.srcObject = null;
        //mediaRecorder.stream = null;
        mediaRecorder.stop();

        // Stop stream and finish cam device
        mediaRecorder.stream.getVideoTracks()[0].stop();
        $scope.stopTracking();
        $scope.DeactivateDetector();
      }

      // Init stream of video
      $scope.InitMediaRecorder = function(){
        navigator.mediaDevices.getUserMedia({
          'audio': true,
          'video': {
            facingMode: 'environment'
            },
        }).then(function(stream) {
            CurrentStream = stream;

            video = document.getElementById('video');
            var videoWidth = 411;
            var videoHeight = 390;
            video.width = videoWidth;
            video.height = videoHeight;
            video.controls = false;
            video.muted = true;
            video.srcObject = CurrentStream;
            video.play();

            options = {
              'mimeType' : 'video/webm\;codecs=h264'
            }

            // TODO IMPROVE QUALITY
            mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorder.stream = stream;
            mediaRecorder.videoWidth = 640;
            mediaRecorder.videoHeight = 480;
            mediaRecorder.audioBitsPerSecond = 3000000;
            mediaRecorder.videoBitsPerSecond = 3000000;
            
            mediaRecorder.onstart = function() {
              console.log('Recording Started');
            };
        
            mediaRecorder.onstop = function() {
              console.log('Recording Stopped');
            };
    
            mediaRecorder.ondataavailable = function(blob) {
              window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                console.log('file system open: ' + fs.name);
                
                e_video = { 
                  id : trackids, 
                  size : 0, 
                  duration : 0, 
                  format : 'mp4', 
                  quality : '640x480' 
                };
                        
                // track entity
                e_track = { 
                  id : trackids, 
                  name : "Track-" + trackids + "_" + today + "_Video.mp4", 
                  size : 0, 
                  date : today, 
                  videoid : trackids, 
                  path : folderName, 
                  sync : 0 
                };

                var directoryEntry = fs.root;
                var folderName = pathFiles;
                directoryEntry.getDirectory(folderName, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail);
                
                function onDirectorySuccess(){
                  saveFile(directoryEntry, blob.data, folderName, "Track-" + trackids + "_" + today + "_Video.mp4");
                }

                function onDirectoryFail(){
                  console.log("Error creating directory...");
                }
              });
            };

            mediaRecorder.start();
          });
      }
      
      // Save file to device
      function saveFile(dirEntry, fileData, folderName, fileName) {
        // window.localStorage.setItem("AllowStorage", "true");
        dirEntry.getFile(folderName + '/' + fileName, { create: true, exclusive: false }, function (fileEntry) {
            writeFile(fileEntry, fileData);
            $scope.insertContentAuditory(fileName, "video");
        }, onErrorCreateFile);
      }

      // Write data to file
      function writeFile(fileEntry, dataObj, isAppend) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function() {
                console.log("Successful file write...");
            };
            fileWriter.onerror = function(e) {
                console.log("Failed file write: " + e.toString());
            };
            fileWriter.write(dataObj);
        });
      }
    
      function onErrorCreateFile() {
        console.log("Create file fail...");
      }

      // Take screenshot of device
      $scope.GetPhoto = function(){
        window.localStorage.setItem("AllowPhoto", "true");
        numPictures = numPictures + 1;
        getDateNow();
        $scope.fileScreenshot = "Track-" + trackids + "_" + today + "_ScreenShot-" + numPictures;
        
        // image entity
        e_image = {
          id : trackids,
          name : $scope.fileScreenshot,
          size : null, 
          format : 'jpg', 
          quality : '' 
        }

        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            //$scope.showAlert('[   Screenshot created   ]', 'Save as:' + $scope.fileScreenshot, 3000, false);
            toastMessage("Screenshot saved","bottom");
            $scope.insertContentAuditory($scope.fileScreenshot, "photo");
          }
        },'jpg',100, $scope.fileScreenshot);
      }

    //////////////////////////////////////////
    ///////////// CALL & MESSAGE /////////////
    //////////////////////////////////////////
    
    // Automatic call on accident detected
    $scope.Call = function(number){
      // Call by contact name
      // window.localStorage.setItem("AllowPhone", "true");
      cordova.plugins.CordovaCall.callNumber(number, onCallOk, onCallKO);

      //simulate your friend answering the call 5 seconds after you call
      // setTimeout(function(){
      //   cordova.plugins.CordovaCall.connectCall();
      // }, 5000);
    }

    function onCallOk(){
      console.log("Calling to...");
    }

    function onCallKO(){
      console.log("Error calling to...");
    }

    // var phoneNumber = "620381230";
    // var textMessage = "This is a test message, fuck yeah!"
    var optionsSMS = {};

    // On activate send sms, need request permission
    // $scope.requestSMS = function() {
    //   var success = function (hasPermission) { 
    //     if (!hasPermission) {
    //         sms.requestPermission(function() {
    //             console.log('[OK] Permission accepted')
    //         }, function(error) {
    //             console.info('[WARN] Permission not accepted')
    //             // Handle permission not accepted
    //         })
    //     }
    //     $scope.SendSMS();
    //   };
    //   var error = function (e) { alert('Something went wrong:' + e); };
    //   sms.hasPermission(success, error);
    // }
    
    // Send sms to a number
    $scope.SendSMS = function(number){
      // window.localStorage.setItem("AllowSms", "true");
      var textmessage;
      if(currentPositionDevice != null){
        textmessage = "I have an accident. Please call emergency and police services.";
      }else{
        textmessage = "I have an accident in this coordinates:" + currentPositionDevice.latitude + "," + currentPositionDevice.latitude + ". Please call emergency and police services.";
      }
      sms.send(number, textMessage, optionsSMS, function(message) {
        console.log("success: send message."); //+ message);
        $scope.showAlert('[   SMS sended   ]', 'To:' + number, 1000, false);
        // navigator.notification.alert(
        //   'Message to ' + number + ' has been sent.',
        //   null,
        //   'Message Sent',
        //   'Done'
        // );
      }, function(error) {
        console.log("code: " + error.code + ", message: " + error.message);
      });
    }

    //////////////////////////////////////////
    ///////// SHARE WITH SOCIAL MEDIA ////////
    //////////////////////////////////////////

    // Open facebook and share a message
    $scope.ShareWithFacebook = function(){
      var title = "Incident";
      if(currentPositionDevice != null){
        description = "Incident at this coordinates: (" + currentPositionDevice.latitude + "," + currentPositionDevice.latitude + "), take care!";
      }else{
        description = "Incident, take care!";
      } 

      window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(description, null /* img */, null /* url */, 'Press paste!', 
        function() {
                      console.log('share ok');
                      $scope.insertEventAuditory("facebook", title, description);
                    }, 
        function(errormsg)
                          {
                            alert(errormsg)
                          }
      )
    }

    // Open twitter and share a message
    $scope.ShareWithTwitter = function(){
      var title = "Incident";
      if(currentPositionDevice != null){
        description = "Incident at this coordinates: (" + currentPositionDevice.latitude + "," + currentPositionDevice.longitude + "), take care!";
      }else{
        description = "Incident, take care!";
      } 
      
      window.plugins.socialsharing.shareViaTwitter('', null /* img */, description,
        function() {
                    console.log('share ok');
                    $scope.insertEventAuditory("twitter", title, description);
                  }, 
        function(errormsg)
              {
                alert(errormsg)
              }
      )
    }

    // Open Instagram and share a message
    $scope.ShareWithInstagram = function(){
      var title = "Incident";
      if(currentPositionDevice != null){
        description = "Incident at this coordinates: (" + currentPositionDevice.latitude + "," + currentPositionDevice.longitude + "), take care!";
      }else{
        description = "Incident, take care!";
      } 
      
      window.plugins.socialsharing.shareViaInstagram(description, '', 
        function(){
                      console.log('share ok');
                      $scope.insertEventAuditory("instagram", title, description);
                  }, 
        function(errormsg)
                  {
                    alert(errormsg)
                  }
      )
    }

    // Open Whatsapp and share a message
    $scope.ShareWithWhatsApp = function(){
      var title = "Incident";
      var description;
      if(currentPositionDevice != null){
        description = "Incident at this coordinates: (" + currentPositionDevice.latitude + "," + currentPositionDevice.longitude + "), take care!";
      }else{
        description = "Incident, take care!";
      } 
      
      $scope.showPopup(title, description);
      // window.plugins.socialsharing.shareViaWhatsAppToReceiver('+34666555444', description, null /* img */, null /* url */, 
      //   function() {
      //                 console.log('share ok');
      //                 $scope.insertEventAuditory("whatsapp", title, description);
      //             }, 
      //   function(errormsg)
      //                     {
      //                       alert(errormsg)
      //                     }
      // )
    }

    // Triggered on a button click, or some other target
    $scope.showPopup = function(title, description) {
      $scope.data = {};

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.phone">',
        title: '<div class="loading-color"><b>ENTER PHONE NUMBER<b></div>',
        subTitle: '',
        scope: $scope,
        buttons: [
          { text: '<b>Cancel<b>',
            type: 'button-positive'
          },
          {
            text: '<b>Continue</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.phone) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {

                window.plugins.socialsharing.shareViaWhatsAppToReceiver('+34'+ $scope.data.phone, description, null /* img */, null /* url */, 
                  function() {
                      console.log('share ok');
                      $scope.insertEventAuditory("whatsapp", title, description);
                  }, 
                  function(errormsg)
                          {
                            alert(errormsg)
                          }
                  )
                // return $scope.data.phone;
              }
            }
          }
        ]
      });

      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });

      $timeout(function() {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 20000);
    };


    // Save event in DB
    $scope.insertEventAuditory = function(type, title, description){
      var sm;
      switch(type){
        case "facebook":
          sm = 1;
          break;
        case "twitter":
          sm = 2;
          break;
        case "instagram":
          sm = 3;
          break;
        case "whatsapp":
          sm = 4;
          break;
      }

      var id = Number(ea_id) + 1;
      getDatetime();
      var date = now;
      var query = "INSERT INTO EVENT_AUDITORY (ea_id, ea_type, ea_date_generated, ea_tile, ca_description)";
          query = query + "VALUES ("+ id + "," + date +"," + title + "," + description + "),";
       
      // event entity
      e_event = { 
        id : id, 
        name : title +","+ description, 
        type : sm, 
        date : date 
      };
      
      $cordovaSQLite.execute(db, query).then(function(res) {
          console.log("Event added.");
      }, function (err) {
          console.log(err);
      });
    };

    // Save route to DB
    $scope.insertContentAuditory = function(filename, type){
      var content;
      switch(type){
        case "video":
          content = 1;
          break;
        case "photo":
          content = 2;  
          break;
      }

      var name = filename;
      var id = Number(ca_id) + 1;
      getDatetime();
      var date = now;
      var query = "INSERT INTO CONTENT_AUDITORY (ca_id, ca_type_content, ca_date_generated, ca_name, ca_size, ca_sync))";
          query = query + "VALUES ("+ id + "," + content +"," + date + "," + name + ", 0, 0)";
              
      $cordovaSQLite.execute(db, query).then(function(res) {
          console.log("Content added.");
      }, function (err) {
          console.log(err);
      });
    };

    $ionicPlatform.ready(function() {
      $scope.getPosition();
    });

})

// Logic of TrackHistory screen
.controller('TrackHistoryCtrl', function($scope, $stateParams, $ionicHistory) {

  // Get data of track selected
  $scope.viewTrack = function(name, url){
    currentTrack = {
      name: name,
      url: url
    };
  }

  // On enter readfiles from device path
  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.readFiles();
  });

  // Function to readfiles from path
  $scope.readFiles = function (){
    // pathFiles = cordova.file.externalRootDirectory;
    $scope.tracks = [];
      window.resolveLocalFileSystemURL(path + '/' + pathFiles,
        function (fileSystem) {
          var reader = fileSystem.createReader();
          reader.readEntries(
            function (entries) {
              for (i=0;i<entries.length;i++){
                if(entries[i].isFile && entries[i].name.includes("mp4")){
                  $scope.tracks.push(entries[i]);
                }
              } 
             // $scope.tracks;
              console.log(entries);
            },
            function (err) {
              console.log(err);
            }
          );
        }, function (err) {
          console.log(err);
        }
    );
  }

})

// Logic of TrackPlayer screen
.controller('TrackPlayerCtrl', function($scope, $stateParams, $ionicPopup, $timeout, $state) {
  // $scope.trackId = $stateParams.trackId;

  // Alert dialog to cancel alert, or call to who are configured
  $scope.showAdvice = function(title, template) {
    var alertPopup = $ionicPopup.confirm({
      title: title,
      template: template
    });

    alertPopup.then(function(res) {
      if(res) {
        // console.log('You are sure');
        $scope.confirmDeleteFile();
      } else {
        // console.log('You are not sure');
      }
    });

    // $timeout(function() {
    //   alertPopup.close(); //close the popup after 3 seconds
    //   $state.go('app.trackhistory');
    // }, 2000);
  };

  var videoUrl = null;
  var player = document.getElementById('player');

  // On enter load track in video control
  $scope.$on('$ionicView.beforeEnter', function(){
    if(platformready){
      videoUrl = currentTrack.url;
      player = document.getElementById('player');
      player.src = window.Ionic.WebView.convertFileSrc(videoUrl);
      player.controls = true;
      player.autoplay = true;
      //player.loop = true;
    }
  });

  // On click back, go to TrackHistory
  $scope.goBack = function(){
      // document.location = '#/app/trackhistory';
      $ionicHistory.backView().go();
  }

  // Function to delete file
  $scope.DeleteFile = function(){
    $scope.showAdvice('<div class="loading-color"><b>Delete action<b></div>', '<div class="loading-color"><b>Are you sure you want to delete track: ' + currentTrack.name + '?<b></div>');
  }

  $scope.confirmDeleteFile = function(){
    filename = currentTrack.name;
    window.resolveLocalFileSystemURL(path + '/' + pathFiles, function(dir) {
      dir.getFile(filename, {create:false}, function(fileEntry) {
                  fileEntry.remove(function(){
                      // The file has been removed succesfully
                      console.log("DELETED FILE" + currentTrack.name);
                      $state.go('app.trackhistory');
                  },function(error){
                      // Error deleting the file
                  },function(){
                     // The file doesn't exist
                  });
      });
    });
  }

})

// Logic of Configuration screen
.controller('ConfigurationCtrl', function($scope, $stateParams, $ionicPopup, $timeout) {
  
  // Alert dialog to advice of actions in configuration screen
  $scope.showAlert = function(title, template) {
    var alertPopup = $ionicPopup.confirm({
      title: title,
      template: template
    });

    alertPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        // $state.go('app.trackhistory');
      } else {
        console.log('You are not sure');
      }
    });

    // $timeout(function() {
    //   // Accident
    //   alertPopup.close(); //close the popup after 3 seconds
    // }, 2000);
  };

  // Set controls on local variables
  var emergencyalert = document.getElementById("emergencyalert");
  var familyalert = document.getElementById("familyalert");
  var emergencytext = document.getElementById("emergencytext");
  var emergencyvalue = document.getElementById("emergencyvalue");
  var policetext = document.getElementById("policetext");
  var policevalue = document.getElementById("policevalue");
  var alerttext = document.getElementById("alerttext");
  // var alertvalue = document.getElementById("alertvalue");
  var phonetext = document.getElementById("phonetext");
  var phonevalue = document.getElementById("phonevalue");
  var sms = document.getElementById("sms");
  var alert2text = document.getElementById("alert2text");
  // var alert2value = document.getElementById("alert2value");

  // On enter load configuration from localStorage
  $scope.$on('$ionicView.beforeEnter', function(){
      if(localConfig.EmergencyAlert == "true"){
        // Onyl emergency alert activated
        emergencyalert.disabled = false;
        familyalert.disabled = true;
        
        phonetext.disabled = true;
        phonevalue.disabled = true;
        sms.disabled = true;
        alert2text.disabled = true;
        // alert2value.disabled = true;

        alerttext.disabled = false;
        // alertvalue.disabled = false;
        
        if(localConfig.CallMedic == "true"){
          policetext.disabled = true;
          policevalue.disabled = true;
          emergencytext.disabled = false;
          emergencyvalue.disabled = false;
          emergencyvalue.checked = true;
        }else if (localConfig.CallPolice){
          policetext.disabled = false;
          policevalue.disabled = false;
          emergencytext.disabled = true;
          emergencyvalue.disabled = true;
          policevalue.checked = true;
        }
      }
      else if (localConfig.FamilyAlert == "true"){
        // Only family alert activated
        emergencyalert.disabled = true;
        familyalert.disabled = false;

        policetext.disabled = true;
        policevalue.disabled = true;
        emergencytext.disabled = true;
        emergencyvalue.disabled = true;
        alerttext.disabled = true;
        // alertvalue.disabled = true;

        phonetext.disabled = false;
        phonevalue.disabled = false;
        sms.disabled = false;
        alert2text.disabled = false;
        // alert2value.disabled = false;
        if(localConfig.CallFamily == "true") phonevalue.checked = true;
        if(localConfig.SendSms == "true") sms.checked = true;
      }

      // All activated
      emergencyalert.disabled = false;
      familyalert.disabled = false;
      emergencytext.disabled = false;
      emergencyvalue.disabled = false;
      policetext.disabled = false;
      policevalue.disabled = false;
      alerttext.disabled = false;
      // alertvalue.disabled = false;
      phonetext.disabled = false;
      phonevalue.disabled = false;
      sms.disabled = false;
      alert2text.disabled = false;
      // alert2value.disabled = false;

      emergencytext.value = window.localStorage.getItem("MedicPhone");
      policetext.value = window.localStorage.getItem("PolicePhone");
      phonetext.value = window.localStorage.getItem("FamilyPhone");
      alerttext.value = window.localStorage.getItem("AlertTimeEmergency");
      alert2text.value = window.localStorage.getItem("AlertTimeFamily");
    }
  );

  // On click emergency set controls
  $scope.emergencyAlert = function(){
    familyalert.disabled = !familyalert.disabled;        
    phonetext.disabled = !phonetext.disabled;
    phonevalue.disabled = !phonevalue.disabled;
    sms.disabled = !sms.disabled;
    alert2text.disabled = !alert2text.disabled;
    // alert2value.disabled = !alert2value.disabled;
  };

  // On click family set controls
  $scope.familyAlert = function(){
    emergencyalert.disabled = !emergencyalert.disabled;        
    emergencytext.disabled = !emergencytext.disabled;
    emergencyvalue.disabled = !emergencyvalue.disabled;
    policetext.disabled = !policetext.disabled;
    policevalue.disabled = !policevalue.disabled;
    alerttext.disabled = !alerttext.disabled;
    // alertvalue.disabled = !alertvalue.disabled;
  };

  $scope.medic = function(){
    policetext.disabled = !policetext.disabled;
    policevalue.disabled = !policevalue.disabled;
  };

  $scope.police = function(){
    emergencytext.disabled = !emergencytext.disabled;
    emergencyvalue.disabled = !emergencyvalue.disabled;
  };

  // On click clear button, clear values
  $scope.clearFields = function(){
    // TODO: clear all data
    // redirect same screen
    emergencytext.value = "";
    policetext.value = "";
    phonetext.value = "";
    alerttext.value = "";
    alert2text.value = "";
    $scope.showAlert('<div class="loading-color"><b>CLEAR FIELDS<b></div>', '<div class="loading-color"><b>Are you sure you want to clear values?<b></div>');
  }

  // On click save button save to localStorage
  $scope.saveFields = function(){
    window.localStorage.setItem("EmergencyAlert", emergencyalert.checked);
    window.localStorage.setItem("FamilyAlert", familyalert.checked);
    window.localStorage.setItem("CallMedic", emergencyvalue.checked);
    window.localStorage.setItem("CallPolice", policevalue.checked);
    window.localStorage.setItem("CallFamily", phonevalue.checked);
    window.localStorage.setItem("SendSms", sms.checked);
    // window.localStorage.setItem("AlertTimeEmergency", "5");
    // window.localStorage.setItem("AlertTimeFamily", "5");
    
    if(emergencyalert.checked){
      window.localStorage.setItem("MedicPhone", emergencytext.value);
      window.localStorage.setItem("PolicePhone", policetext.value);
      window.localStorage.setItem("AlertTimeEmergency", alerttext.value);
    }
    else if(familyalert.checked){
      window.localStorage.setItem("FamilyPhone", phonetext.value);
      window.localStorage.setItem("AlertTimeFamily", alert2text.value);
    }
    $scope.showAlert('<div class="loading-color"><b>SAVE CHANGES<b></div>', '<div class="loading-color"><b>Are you sure you want to save values?<b></div>');
  }
})

// Logic of Faqs screen
.controller('FaqsCtrl', function($scope, $stateParams) {

    $scope.explanation = '';
    $scope.showEx = false;

    $scope.show1 = false;
    $scope.show2 = false;
    $scope.show3 = false;
    $scope.show4 = false;
    $scope.show5 = false;

    // On click + button open selected question
    $scope.open = function(num){
      switch(num){
        case 1:
          if($scope.explanation == null){
            $scope.explanation = "To save a track you onyle have to press play on Track Record, once you click on stop button track will be saved automatically.";
            $scope.show2 = $scope.show3 = $scope.show4 = $scope.show5 = true;
          }
          else{
            $scope.explanation = null;
            $scope.show2 = $scope.show3 = $scope.show4 = $scope.show5 = false;
          }
          break;
        case 2:
          if($scope.explanation == null){
            $scope.explanation = 'To find a track, you have to go to Track History and search for it with the help of finder.';
            $scope.show1 = $scope.show3 = $scope.show4 = $scope.show5 = true;
          }
          else{
            $scope.explanation = null;
            $scope.show1 = $scope.show3 = $scope.show4 = $scope.show5 = false;
          }
          break;
        case 3:
          if($scope.explanation == null){
            $scope.explanation = 'At the moment, is not able to sync data with cloud. In future versions will be a new functionality.';
            $scope.show1 = $scope.show2 = $scope.show4 = $scope.show5 = true;
          }
          else{
            $scope.explanation = null;
            $scope.show1 = $scope.show2 = $scope.show4 = $scope.show5 = false;
          }
          break;
        case 4:
          if($scope.explanation == null){
            $scope.explanation = 'For configure alerts you have to go to Configuration and set different paramets like emergency o family alert.';
            $scope.show1 = $scope.show3 = $scope.show2 = $scope.show5 = true;
          }
          else{
            $scope.explanation = null;
            $scope.show1 = $scope.show3 = $scope.show2 = $scope.show5 = false;
          }
          break;
        case 5:
          if($scope.explanation == null){
            $scope.explanation = 'For alert with social media you have to click button with "+" in Track Record an select a social media.';
            $scope.show1 = $scope.show3 = $scope.show4 = $scope.show2 = true;
          }
          else{
            $scope.explanation = null;
            $scope.show1 = $scope.show3 = $scope.show4 = $scope.show2 = false;
          }
          break;
      }
    };

})

// Logic of Permissions screen
.controller('PermissionsCtrl', function($scope, $stateParams, $state, $ionicPopup, $timeout) {

  $scope.hideLocation2 = "display-off";
  $scope.hideAudio2 = "display-off";
  $scope.hideRecord2 = "display-off";
  $scope.hideStorage2 = "display-off";
  $scope.hidePhone2 = "display-off";
  $scope.hideSms2 = "display-off";
  $scope.hideLocation = "display-on";
  $scope.hideAudio = "display-on";
  $scope.hideRecord = "display-on";
  $scope.hideStorage = "display-on";
  $scope.hidePhone = "display-on";
  $scope.hideSms = "display-on";

  // On enter get allowed permissions
  $scope.$on('$ionicView.beforeEnter', function(){
    if(window.localStorage.getItem("ShowPermissions") == "false"){
        $state.go('app.trackrecord');
        return;
    }

    if (window.localStorage.AllowGps == "true") {
      $scope.hideLocation = "display-off"; 
      $scope.hideLocation2 = "display-on"; 
      $scope.gl = "button-modal-logo-clicked";
    }
    if (window.localStorage.AllowAudio == "true") {
      $scope.hideAudio = "display-off"; 
      $scope.hideAudio2 = "display-on"; 
      $scope.ga = "button-modal-logo-clicked";
    }
    if (window.localStorage.AllowVideo == "true") {
      $scope.hideRecord = "display-off"; 
      $scope.hideRecord2 = "display-on"; 
      $scope.gr = "button-modal-logo-clicked";
    }
    if (window.localStorage.AllowStorage == "true") {
      $scope.hideStorage = "display-off"; 
      $scope.hideStorage2 = "display-on"; 
      $scope.gst = "button-modal-logo-clicked";
    }
    if (window.localStorage.AllowPhone == "true") {
      $scope.hidePhone = "display-off"; 
      $scope.hidePhone2 = "display-on"; 
      $scope.gp = "button-modal-logo-clicked";
    }
    if (window.localStorage.AllowSms == "true") {
      $scope.hideSms = "display-off"; 
      $scope.hideSms2 = "display-on"; 
      $scope.gs = "button-modal-logo-clicked";
    }
  });
  

  $scope.RequestPermission = function(button) {

      switch(button){
        case 1:
          cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
            switch(status){
                case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                    console.log("Permission not requested");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED:
                    console.log("Permission denied");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                    console.log("Permission granted always");
                    window.localStorage.setItem("AllowGps", "true");
                    localConfig.AllowGps = true;
                    $scope.hideLocation = "display-off"; 
                    $scope.hideLocation2 = "display-on"; 
                    $scope.gl = "button-modal-logo-clicked";
                    break;
                case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                    console.log("Permission granted only when in use");
                    break;
            }
          }, function(error){
              console.error(error);
          }, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);
        break;
        case 2:
          cordova.plugins.diagnostic.requestMicrophoneAuthorization(function(status){
            if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
                console.log("Microphone use is authorized");
                window.localStorage.setItem("AllowAudio", "true");
                localConfig.AllowAudio = true;
                $scope.hideAudio = "display-off"; 
                $scope.hideAudio2 = "display-on"; 
                $scope.ga = "button-modal-logo-clicked";
            }
          }, function(error){
              console.error(error);
          });
        break;
        case 3:
          cordova.plugins.diagnostic.requestCameraAuthorization(
              function(status){
                  console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
                  window.localStorage.setItem("AllowVideo", "true");
                  localConfig.AllowVideo = true;
                  $scope.hideRecord = "display-off"; 
                  $scope.hideRecord2 = "display-on"; 
                  $scope.gr = "button-modal-logo-clicked";
              }, function(error){
                  console.error("The following error occurred: "+error);
              }, false
          );   
        break;
        case 4:
          cordova.plugins.diagnostic.requestExternalStorageAuthorization(function(status){
            console.log("Authorization request for external storage use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
            window.localStorage.setItem("AllowStorage", "true");
            localConfig.AllowStorage = true;
            $scope.hideStorage = "display-off"; 
            $scope.hideStorage2 = "display-on"; 
            $scope.gst = "button-modal-logo-clicked";
          }, function(error){
              console.error(error);
          });
        break;
        case 5:
          // cordova.plugins.CordovaCall.sendCall('Grant Perission');
          // setTimeout(function(){
          //   cordova.plugins.CordovaCall.endCall();
          // },1);
        break;
        case 6:
          sms.requestPermission(function() {
            console.log('[OK] Permission accepted')
            window.localStorage.setItem("AllowSms", "true");
            localConfig.AllowSms = true;
            $scope.hideSms = "display-off"; 
            $scope.hideSms2 = "display-on"; 
            $scope.gs = "button-modal-logo-clicked";
          }, function(error) {
              console.info('[WARN] Permission not accepted')
              // Handle permission not accepted
          })
        break;
      }
  };
  
  $scope.checkPermissions = function(){   
    if (localConfig.AllowGps == "false") {
      $scope.showError();
      return;
    }
    if (localConfig.AllowAudio == "false") {
      $scope.showError();
      return;
    }
    if (localConfig.AllowVideo == "false") {
      $scope.showError();
      return;
    }
    if (localConfig.AllowStorage == "false") {
      $scope.showError();
      return;
    }
    // if (localConfig.AllowPhone == "false") {
    //   $scope.showError();
    //   return;
    // }
    if (localConfig.AllowSms == "false") {
      $scope.showError();
      return;
    }

    // Set that we have all permissions to avoid enter again on Permissions screen
    window.localStorage.setItem("ShowPermissions", "false");
    $state.go('app.trackrecord');
  }

  $scope.OpenSettings = function(){
    cordova.plugins.diagnostic.switchToSettings(function(){
      console.log("Successfully switched to Settings app");
      }, function(error){
          console.error("The following error occurred: "+error);
      });
  }

  // Alert dialog to cancel alert, or call to who are configured
  $scope.showError = function() {
      var alertPopup = $ionicPopup.alert({
      title: '<div class="loading-color"><b>MISSING PERMISSIONS<b></div>',
      template: '<div class="loading-color">All permissions must be granted for a correct function of application.</div>',
      buttons: [
        {   
          text: '<b>OK<b>',
          type: 'button-positive'
        }
      ]
    });

    alertPopup.then(function(res) {
      console.log('');
    });

    $timeout(function() {
      // Accident
      alertPopup.close(); //close the popup after 3 seconds
    }, 3000);
  };
});
