//dual language
function language_port(){
  window.localStorage.setItem("language", "pt");
  document.location.href = "file:///android_asset/www/index-pt.html";
}

function language_eng(){
  window.localStorage.setItem("language", "en");
  document.location.href = "file:///android_asset/www/index-us.html";
}

var language = 0;
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  if (language === 0) {
    if (window.localStorage.getItem("language") == "pt")
      document.location.href = "file:///android_asset/www/index-pt.html";
    else if (window.localStorage.getItem("language") == "en")
      document.location.href = "file:///android_asset/www/index-us.html";
    else
      $("#idioma").html("<p class='opening-message'> Choose your language:</p><a id='btnPortuguese' type='button' class='ui-btn ui-shadow' onclick='language_port()'>Portuguese</a><a id='btnEnglish' type='button' class='ui-btn ui-shadow' onclick='language_eng()'>English</a>");
  }
}

//Server
function slOK(){
  api.user.login("eduardo", "123456");
  api.on(SLSAPI.User.EVENT_LOGIN_FINISH, loginOk);
}

function SLbegin(){
  var conf = {urlConfServico: "http://sl.wancharle.com.br/mashup/568eaedb64f7f95e7a4fde24"};
  api = new SLSAPI(conf);
  api.off(SLSAPI.Config.EVENT_READY);
  api.on(SLSAPI.Config.EVENT_READY, slOK);
  api.off(SLSAPI.Config.EVENT_FAIL);
  api.on(SLSAPI.Config.EVENT_FAIL, function(){
    if (language === 1)
      showMessage("Error no servidor, por favor tente mais tarde");
    else
      showMessage("Server error, please try again later");
    setTimeout(hideMessage, 3500);
  });  
}

function loginOk(){
  sendTrack();
}

function TrySend(){
  SLbegin();
}

//send to server
function sendTrack(){
  var trajeto = trajetoSelecionado;
  clonado = clone(trajetoSelecionado.data);
  var lista = [];
  trajeto.data.forEach(function(item){
    lista.push([item.latitude, item.longitude]);
  });

  var trajetoString = JSON.stringify(trajeto);

  var obj = {};
  obj.user = api.user.user_id;
  obj.latitude = trajeto.data[0].latitude;
  obj.longitude = trajeto.data[0].longitude;
  obj.trilha = lista;
  obj.texto = trajeto.key;

  api.notes.enviar(obj);
  
  api.on(SLSAPI.Notes.EVENT_ADD_NOTE_FINISH, function(resposta){
    trajeto.id = resposta.id;
    trajetoString = JSON.stringify(trajeto);
    if (language === 1)
      showMessage("Trajeto " + track_id + " enviado");
    else
      showMessage("Track " + track_id + " sent");
    setTimeout(hideMessage, 3500);
    window.localStorage.setItem(clonado.key, JSON.stringify({key: clonado.key, data: clonado.data, media: clonado.media}));
    api.off(SLSAPI.Notes.EVENT_ADD_NOTE_FINISH);
    enviarMedia();
  });  

  var mediaLista = [];
  media = JSON.stringify(trajeto.media);
  media = JSON.parse(media);

  //send media
  function enviarMedia(){
    function envioOK(res){
      mediaLista.push(res.response);
      trajeto.media = mediaLista;
      trajetoString = JSON.stringify(trajeto);
      window.localStorage.setItem(clonado.key, JSON.stringify({key: clonado.key, data: clonado.data, media: clonado.media}));
    }

    function envioFAIL(res){
      if (language === 1)
        showMessage("Ocorreu um erro ao enviar o trajeto " + track_id);
      else
        showMessage("An error occurred while sending track " + track_id);
      setTimeout(hideMessage, 3500);
    }
      
    media.forEach(function(item){
      var obj = {};
      obj = item;
      obj.user = api.user.user_id;
      obj.texto = item.comentario;
      obj.fotoURI = item.name;
      obj.cat = item.type;
      latlon = getLatLon(item.timestampFim);
      obj.latitude = latlon[0];
      obj.longitude = latlon[1];
      obj.id_parent = trajeto.hashid;

      if (item.id){
        api.notes.enviar(obj, false, envioOK, envioFAIL);  
      }
      else {
        api.notes.enviar(obj, false, envioOK, envioFAIL);  
      }
    });
    window.localStorage.setItem(clonado.key, JSON.stringify({key: clonado.key, data: clonado.data, media: clonado.media}));
  }; 
}

//exclude confirmation
function onConfirm(button) {
    if (button == 1) {
      var ex = deleted;
      window.localStorage.removeItem(ex);
      var ex_media = ex + "_media";
      window.localStorage.removeItem(ex_media);
      $.mobile.changePage( "#history", { changeHash: false });
    }
}

//clone
var clonado = [];
function clone(obj) {
  var outpurArr = new Array();
  for (var i in obj) {
    outpurArr[i] = typeof (obj[i]) == 'object' ? this.clone(obj[i]) : obj[i];
  }
  return outpurArr;
}

//remove track
function removeTrack(){
  if (language === 1)
    navigator.notification.confirm(
      'Você tem certeza que deseja excluir o trajeto selecionado?',
      onConfirm,
      'Excluir',
      ['SIM','NÃO']
    );
  else
    navigator.notification.confirm(
      'Are you sure you want to delete the selected track?',
      onConfirm,
      'Delete',
      ['YES','NO']
    );
}

$(document).ready(function(){
  $("#btnParar").hide();
  $("#btnFoto").hide();
  $("#btnVideo").hide();
  $("#btnAudio").hide();

  $('.bxslider').bxSlider({
    slideWidth: 'auto'
  });

  //Button GO on keyboard
  $(document).ready(function() {
    $('input').keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if ( (code==13) || (code==10))
            {
            $(this).blur();
            return false;
            }
        });
    });

  //Don't register the 'comment' page in history (so the user don't go there by pressing 'back'
  $(document).on('pagebeforechange', function(e,data){
    window.data = data;
    if ($(data.toPage).attr('id') == 'comment' && $(data.prevPage.attr('id') == 'startTracking')){
      data.options.changeHash = false;
    }
    //Don't go to deleted track
    if ($(data.prevPage).attr('id') == 'history'){
      data.options.changeHash = false;
    }
  });
});

//Ajax Messages
function showMessage(mensagem) {
    $.mobile.loading( 'show', {
        text: mensagem,
        textVisible: true,
        theme: 'b',
        textonly : true,
        html: ''
    });
};

function hideMessage() {
    $.mobile.loading( 'hide' );
};

//variables
var deleted; //to delete a track
var trajetoSelecionado; //store chosen track
var api; //api
var inicioVideo;     // set timestamp on begging of video
var track_id = '';      // Name/ID of the exercise
var track_id_media = ''; //Name/ID of the exercise media
watch_id = null;    // ID of the geolocation
tracking_data = []; // Array containing GPS position objects
tracking_data_media = []; // Array containing GPS position media
tituloMedia = '';

//Set position and name of the file into array data_media
function PathMedia(position, mediaFiles){
  this.timestampFim = position.timestamp;
  this.name = mediaFiles[0].fullPath;
  this.type = mediaFiles[0].type;
}

function fail(error) {
  var msg = 'An error occurred during capture: ' + error.code;
}

function success(){
}

//Move and rename audio file
function successMoveTo(entry) {
  var folder = "AudioRecordTrilha";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
        function (fileSys) {
            fileSys.root.getDirectory(folder, {create: true, exclusive: false},
                function (directory) {
                    var newName = entry.fullPath.slice(1);
                    newName = newName.replace("3gpp", "wav");
                    entry.moveTo(directory, newName,
                        success, fail);
            }, fail);
    }, fail);
}

function captureSuccess(mediaFiles) {
  var i, len;
  for (i = 0, len = mediaFiles.length; i < len; i += 1) {

    var path3 = mediaFiles[i].fullPath;
    var path2 = path3.slice(0, 5) + "//" + path3.slice(5);
    window.resolveLocalFileSystemURI(path2, successMoveTo, fail);

    //Rename audio file
    if (mediaFiles[i].type == "audio/3gpp"){
      mediaFiles[i].name = mediaFiles[i].name.replace("3gpp", "wav");
      mediaFiles[i].fullPath = mediaFiles[i].fullPath.slice(0,25) + "AudioRecordTrilha/" + mediaFiles[i].name;
      mediaFiles[i].fullPath = mediaFiles[i].fullPath.replace("3gpp", "wav");
      mediaFiles[i].localURL = mediaFiles[i].localURL.replace("3gpp", "wav");
      mediaFiles[i].type = mediaFiles[i].type.replace("3gpp", "wav");
    }
    
    navigator.geolocation.getCurrentPosition(
      function(position){
        var path_media = new PathMedia(position, mediaFiles);
        if (path_media.type == "image/jpeg"){
          $("#media_file").html("<img style='width:220px;' src='" + path_media.name + "'></img>");
        }
        else if (path_media.type == "video/mp4"){
          path_media.timestampInicio = inicioVideo;
          $("#media_file").html("<video width='250px' height='250px' controls><source src='" + path_media.name + "' type='video/mp4'></video>");
        }
        else if (path_media.type == "audio/wav"){
          $("#media_file").html("<audio controls><source src='" + path_media.name + "'></audio>");
        }
        tracking_data_media.push(path_media);
    }, function(error){
        console.log(error);
    }, { enableHighAccuracy: true });
  }
}

function captureError(error) {
    var msg = 'An error occurred during capture: ' + error.code;
    $.mobile.changePage( "#startTracking", { changeHash: false });
}

function capturePhoto() {
    navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
}

function captureVideo() {
    watch_video = navigator.geolocation.getCurrentPosition(
  
    // Success
      function(position){
        inicioVideo = position.timestamp;
      },
      
      // Error
      function(error){
        console.log(error);
      },
      
      // Settings
      { enableHighAccuracy: true });
      
    navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1});
}

function captureAudio() {
    flagPreventCommentPage = true;
    navigator.device.capture.captureAudio(captureSuccess, captureError, {limit: 1});
}

function saveComment(){

  comentario = $("#save_comment").val();
  $("#save_comment").val('');
  tamanho_tdm = tracking_data_media.length -1;
  tracking_data_media[tamanho_tdm].comentario = comentario;
}

function gps_distance(lat1, lon1, lat2, lon2)
{
	// http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // km
    var dLat = (lat2-lat1) * (Math.PI / 180);
    var dLon = (lon2-lon1) * (Math.PI / 180);
    var lat1 = lat1 * (Math.PI / 180);
    var lat2 = lat2 * (Math.PI / 180);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    
    return d;
}

// Function for saving correctly the position and timestamp
function Path(position) {
        this.trilha = {"latitude" : position.coords.latitude, "longitude" : position.coords.longitude};
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.timestamp = position.timestamp;
}

//Iniciar trajeto
function startTrack(){

  $("#btnIniciar").toggle();
  document.getElementById("btnParar").style.display = "block";
  document.getElementById("btnFoto").style.display = "block";
  document.getElementById("btnVideo").style.display = "block";
  document.getElementById("btnAudio").style.display = "block";
  var positionBckp;
  flag = 0;
  
  watch_id = navigator.geolocation.watchPosition(
  
    // Success
    function(position){
      if (flag == 0){
        var path = new Path(position);
        tracking_data.push(path);
        positionBckp = position;
        flag = 1;
      }
      //Get position only when it's 5 meters away from previous
      else if (gps_distance(position.coords.latitude, position.coords.longitude, positionBckp.coords.latitude, positionBckp.coords.longitude)*1000 > 5){
        var path = new Path(position);
        tracking_data.push(path);
        positionBckp = position;
      }
    },
    
    // Error
    function(error){
      console.log(error);
    },
    
    // Settings
    { enableHighAccuracy: true }
  );
  
  track_id = $("#track_id").val();
  track_id = $.trim(track_id);
  track_id_media = track_id + "_media";
  track_id_bckup = track_id;

  //Verify if name of track already exists and insert (number) on the name in case it exists
  j = 1;
  tracks_recorded = window.localStorage.length;
  for (var i = 0; i < tracks_recorded; i++) {
    if(window.localStorage.key(i) == track_id || track_id == "" || track_id == " "){
      track_id = track_id_bckup + "(" + j + ")";
      track_id_media = track_id_bckup + "_media";
      j++;
    }
  };
  
  $("#track_id").hide();
  if (language === 1) {
    $("#startTracking_status").html("Trajeto em percurso: <strong>" + track_id + "</strong>");
    $("#startTracking_warning").html("Sem GPS ligado o trajeto não será gravado.");
  }
  else {
    $("#startTracking_status").html("Tracking: <strong>" + track_id + "</strong>");
    $("#startTracking_warning").html("Without GPS the track will not be recorded.");
  }
}

function stopTrack(){

  $("#btnIniciar").toggle();
  $("#btnParar").toggle();
  $("#btnFoto").toggle();
  $("#btnVideo").toggle();
  $("#btnAudio").toggle();
  if (language === 1)
    showMessage("Trajeto " + track_id + " salvo na página de Históricos");
  else
    showMessage("Track " + track_id + " saved on History page");
  setTimeout(hideMessage, 3500);

  navigator.geolocation.clearWatch(watch_id);

  window.localStorage.setItem(track_id, JSON.stringify({key: track_id, data: tracking_data, media: tracking_data_media}));
  
  watch_id = null;
  tracking_data = [];
  tracking_data_media = [];

  $("#track_id").val("").show();
  if (language === 1) {
    $("#startTracking_status").html("Último trajeto traçado: <strong>" + track_id + "</strong>");
    $("#startTracking_warning").html("");
  }
  else {
    $("#startTracking_status").html("Last track saved: <strong>" + track_id + "</strong>");
    $("#startTracking_warning").html("");
  }
}

//Erase data
$("#home_clearstorage_button").live('click', function(){
	window.localStorage.clear();
});

//Open history page
$('#history').live('pageshow', function () {

	tracks_recorded = window.localStorage.length;
  var tracks_certo = 0;

	$("#history_tracklist").empty();
	
	for(i=0; i<tracks_recorded; i++){
    if(window.localStorage.key(i).indexOf("_media") == -1 && window.localStorage.key(i).indexOf("Usuario") == -1 && window.localStorage.key(i).indexOf("logginTime") == -1 && window.localStorage.key(i).indexOf("user_id") == -1 && window.localStorage.key(i).indexOf("undefined") == -1 && window.localStorage.key(i).indexOf("language") == -1){
      tracks_certo++;
		  $("#history_tracklist").append("<li><a href='#track_info' style='min-height: 20px;' data-ajax='false'>" + window.localStorage.key(i) + "</a></li>");
    }
	}

  if (language === 1)
    $("#tracks_recorded").html("<div style='margin-bottom:20px;'><strong>" + tracks_certo + "</strong> trajeto(s).</div>");
  else
    $("#tracks_recorded").html("<div style='margin-bottom:20px;'><strong>" + tracks_certo + "</strong> track(s).</div>");
	
	$("#history_tracklist").listview('refresh');

});

// When the user clicks a link to view track info, set/change the track_id attribute on the track_info page.
$("#history_tracklist li a").live('click', function(){

	$("#track_info").attr("track_id", $(this).text());
	
});

//Get Latitude and Longitude using timestamp
function getLatLon(time){
  var trajeto = trajetoSelecionado;
  distBckp = 0;
  mediaLat = 0;
  mediaLon = 0;
  counter = 0;
  k = 0;
  trajeto.data.forEach(function(item){
    if (distBckp == 0){
      distBckp =  Math.abs(time - item.timestamp);
      mediaLat = item.latitude;
      mediaLon = item.longitude;
      k = counter;
    }
    else if (Math.abs(time - item.timestamp) < distBckp){
      distBckp = Math.abs(time - item.timestamp);
      mediaLat = item.latitude;
      mediaLon = item.longitude;
      k = counter;
    }
    counter++;
  });
  var latlon = [mediaLat, mediaLon];
  return latlon;
}

// When the user views the Track Info page
$('#track_info').live('pageshow', function(){

  var key = $(this).attr("track_id");
  var key_media = key + "_media";
  deleted = key;
  
  if (language === 1)
    $("#track_name").html(key + '<a href="" data-role="button" data-icon="delete" onclick="removeTrack();" style="float: right; text-decoration: none;">Excluir</a>');
  else
    $("#track_name").html(key + '<a href="" data-role="button" data-icon="delete" onclick="removeTrack();" style="float: right; text-decoration: none;">Delete</a>');

  var trajeto = window.localStorage.getItem(key);
  
  trajeto = JSON.parse(trajeto);

  trajetoSelecionado = trajeto;

  if (!(typeof google === 'object' && typeof google.maps === 'object')) {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src  = "http://maps.googleapis.com/maps/api/js?key=AIzaSyDD353fOPh-KBUQ-2ekPCg75uxXRn0D9Tk&sensor=false";
    $("head").append(s);  
  }

  if (trajeto.data.length > 1 && typeof google === 'object' && typeof google.maps === 'object'){

  // Calculate the total distance travelled
  kmTravelled = 0;

  for(i = 0; i < trajeto.data.length - 1; i++){
    kmTravelled += gps_distance(trajeto.data[i].latitude, trajeto.data[i].longitude, trajeto.data[i+1].latitude, trajeto.data[i+1].longitude);
  }
  
  kmTravelledRounded = kmTravelled.toFixed(2);
  
  // Calculate the total time taken for the track
  startTime = new Date(trajeto.data[0].timestamp).getTime();
  endTime = new Date(trajeto.data[trajeto.data.length-1].timestamp).getTime();

  totalTimeSeconds = (endTime - startTime)/1000;
  
  finalTimeMinutes = Math.floor(totalTimeSeconds / 60);
  finalTimeSeconds = (totalTimeSeconds - (finalTimeMinutes * 60)).toFixed(2);

  // Display total distance and time
  if (language === 1)
    $("#track_info_info").html('Percorreu <strong>' + kmTravelledRounded + '</strong> km(s) em <strong>' + finalTimeMinutes + ' minuto(s)</strong> e <strong>' + finalTimeSeconds + ' segundo(s).</strong>');
  else
    $("#track_info_info").html('Travelled <strong>' + kmTravelledRounded + '</strong> km(s) in <strong>' + finalTimeMinutes + ' minute(s)</strong> and <strong>' + finalTimeSeconds + ' second(s).</strong>');
  
  // Set the initial Lat and Long of the Google Map
  var myLatLng = new google.maps.LatLng(trajeto.data[0].latitude, trajeto.data[0].longitude);

  // Google Map options
  var myOptions = {
    zoom: 15,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  // Create the Google Map, set options
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  arrayMarker = [];

  // Insert markers where the user inserted a media
  for(i = 0; i < trajeto.media.length; i++){

    distBckp = 0;
    mediaLat = 0;
    mediaLon = 0;
    counter = 0;
    k = 0;
    flagMarker = false;
    if(trajeto.media[i].type == "video/mp4"){
      timeMedia = trajeto.media[i].timestampInicio;
    }
    else{
      timeMedia = trajeto.media[i].timestampFim; 
    }
    trajeto.data.forEach(function(item){
      if (distBckp == 0){
        distBckp =  Math.abs(timeMedia - item.timestamp);
        mediaLat = item.latitude;
        mediaLon = item.longitude;
        k = counter;
      }
      else if (Math.abs(timeMedia - item.timestamp) < distBckp){
        distBckp = Math.abs(timeMedia - item.timestamp);
        mediaLat = item.latitude;
        mediaLon = item.longitude;
        k = counter;
      }
      counter++;
    });

    //Check if already exists a marker in one place
    if(arrayMarker.length != 0){
      for(t=0; t<arrayMarker.length; t++){
        if (mediaLat == arrayMarker[t][0] && mediaLon == arrayMarker[t][1]){
          //Same place
          tituloInicio = '<div class="slider"><ul class="bxslider">';
          if (trajeto.media[i].type == "image/jpeg"){
            tituloMedia = tituloMedia + '<li class="ajust-size">' + trajeto.media[i].comentario + '<img style="width:120px;" draggable="false" src="' + trajeto.media[i].name + '"></img></li>';  
          }
          else if (trajeto.media[i].type == "video/mp4"){
            tituloMedia = tituloMedia + '<li class="ajust-size-video">' + trajeto.media[i].comentario + '<video id="vid" draggable="false" width="220px" height="200px" controls><source src="' + trajeto.media[i].name + '" type="video/mp4"></video></li>';
          }
          else if (trajeto.media[i].type == "audio/wav"){
            tituloMedia = tituloMedia + '<li class="ajust-size-audio">' + '<div class="comment-audio">' + trajeto.media[i].comentario + '</div>' + '<audio controls style="width: 259px"><source src="' + trajeto.media[i].name + '"></audio></li>';
          }
          tituloFim = '</ul></div>';
          flagMarker = true;
        }
      }  
    }
    if (!flagMarker){
      if (trajeto.media[i].type == "image/jpeg"){
            tituloMedia = '<li class="ajust-size">' + trajeto.media[i].comentario + '<img style="width:120px;" draggable="false" src="' + trajeto.media[i].name + '"></img></li>';  
          }
          else if (trajeto.media[i].type == "video/mp4"){
            tituloMedia = '<li class="ajust-size-video">' + trajeto.media[i].comentario + '<video id="vid" draggable="false" width="220px" height="200px" controls><source src="' + trajeto.media[i].name + '" type="video/mp4"></video></li>';
          }
          else if (trajeto.media[i].type == "audio/wav"){
            tituloMedia = '<li class="ajust-size-audio">' + trajeto.media[i].comentario + '<audio controls style="width: 259px"><source src="' + trajeto.media[i].name + '"></audio></li>';
          }
    }
      
    arrayMarker.push([mediaLat, mediaLon]);

    //Insert media on map
    var myLatLng_media = new google.maps.LatLng(mediaLat, mediaLon);
    var titulo;

    if (trajeto.media[i].type == "image/jpeg"){
      titulo = '<div style="width: 171px; height: 253px;">' + trajeto.media[i].comentario + '<div>' + '<img style="width:120px;" src="' + trajeto.media[i].name + '"></img>' + '</div>' + '</div>';
    }
    else if (trajeto.media[i].type == "video/mp4"){
      titulo = '<div>' + trajeto.media[i].comentario + '<div>' + '<video id="vid" width="220px" height="200px" controls><source src="' + trajeto.media[i].name + '" type="video/mp4"></video>' + '</div>' + '</div>';
    }
    else if (trajeto.media[i].type == "audio/wav"){
      titulo = '<div>' + trajeto.media[i].comentario + '<div>' + '<audio controls><source src="' + trajeto.media[i].name + '"></audio>' + '</div>' + '</div>';
    }

    var prevMarker = false;

    var marker = new google.maps.Marker({
      position: myLatLng_media,
      map: map,
      clickable: true,
      time: timeMedia,
      bxslider: true
    });

    if (!flagMarker){
      marker.info = new google.maps.InfoWindow({
        content: titulo
      });  
    }
    else {
      marker.info = new google.maps.InfoWindow({
        content: tituloInicio + tituloMedia + tituloFim
      });  
    }
    
    google.maps.event.addListener(marker, 'click', function() {
      if (prevMarker){
        prevMarker.close();
      }
      prevMarker = this.info;
      var marker_map = this.getMap();
      this.info.open(marker_map, this);
      marker_map.setCenter(this.getPosition());
      marker1 = this;

      //When it's more than one media in the same place
      if (this.bxslider){
        $('.bxslider').bxSlider({
          infiniteLoop: false,
          minSlides: 1, 
          maxSlides: 1,
          moveSlides: 1,
          pager: false,
          preventDefaultSwipeY: true
        });
        this.bxslider = false;
      }
      
      var oldPos = false;
      var newCenter = false;

      //Update the marker and centralize the map
      $('#vid').bind('timeupdate', function(e) {
        latlon = getLatLon(marker1.time + this.currentTime * 1000);
        if (oldPos){
          diffLat = marker_map.getCenter().lat() + (latlon[0] - oldPos[0]);
          diffLon = marker_map.getCenter().lng() + (latlon[1] - oldPos[1]);
          newCenter = new google.maps.LatLng(diffLat, diffLon);
        }
        oldPos = latlon;
        var newPos = new google.maps.LatLng(latlon[0], latlon[1]);
        marker1.setPosition(newPos);
        if (newCenter){
          map.panTo(newCenter);
        }
      });
    });
  }

  var trackCoords = [];
  
  // Add each GPS entry to an array
  for(i=0; i<trajeto.data.length; i++){
    trackCoords.push(new google.maps.LatLng(trajeto.data[i].latitude, trajeto.data[i].longitude));
  }
  
  // Plot the GPS entries as a line on the Google Map
  var trackPath = new google.maps.Polyline({
    path: trackCoords,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  // Apply the line to the map
  trackPath.setMap(map); 

  $("#sendTrack").show();
  $("#map_canvas").show();
  }
  else if(trajeto.data.length < 2) {
    $("#sendTrack").hide();
    $("#map_canvas").hide();
    if (language === 1)
      $("#track_info_info").html('Trajeto vazio.');
    else
      $("#track_info_info").html('Empty Track.');
  }
  else {
    $("#sendTrack").hide();
    $("#map_canvas").hide();
    if (language === 1)
      $("#track_info_info").html('Ligue a internet para visualizar o mapa.');
    else
      $("#track_info_info").html('Turn on the internet to view the map.');
  }
});