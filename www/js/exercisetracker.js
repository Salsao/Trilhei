//Servidor
function slOK(){
  console.log("Carregou ok");
  api.user.login("eduardo", "123456");
  api.on(SLSAPI.User.EVENT_LOGIN_FINISH, loginOk);
}

function SLbegin(){
  var conf = {urlConfServico: "http://sl.wancharle.com.br/mashup/568eaedb64f7f95e7a4fde24"};
  api = new SLSAPI(conf);
  api.on(SLSAPI.Config.EVENT_READY, slOK);

  api.on(SLSAPI.Config.EVENT_FAIL, function(){
  });  
}

function loginOk(){
  console.log(api.user.getUsuario());
}

//enviar para o servidor
function sendTrack(){
  var trajeto = trajetoSelecionado;
  var lista = [];
  trajeto.data.forEach(function(item){
    lista.push([item.latitude, item.longitude]);
  });

  var trajetoString = JSON.stringify(trajeto);
  console.log("stirng", trajetoString);

  var obj = {};
  obj.user = api.user.user_id;
  obj.latitude = trajeto.data[0].latitude;
  obj.longitude = trajeto.data[0].longitude;
  obj.trilha = lista;
  //obj.trilha = trajeto.data.trilha
  //obj.timestamp = trajeto.data.timestamp
  obj.texto = trajeto.key;

  //obj.nome = keySelected;
  //obj.nomeMedia = keyMediaSelected;

  //if (trajeto.id){
  //  alert("ja foi enviadoi");
  //}
  //else {
  api.notes.enviar(obj);
  
  api.on(SLSAPI.Notes.EVENT_ADD_NOTE_FINISH, function(resposta){
    console.log(resposta.id);
    trajeto.id = resposta.id;
    trajetoString = JSON.stringify(trajeto);
    console.log("ENVIOU trajetoString", trajetoString);
    window.localStorage.setItem(trajeto.key, trajetoString);
    api.off(SLSAPI.Notes.EVENT_ADD_NOTE_FINISH);
    enviarMedia();
  });  
  //}

  var mediaLista = [];
  media = JSON.stringify(trajeto.media);
  media = JSON.parse(media);

  //enviar media
  function enviarMedia(){
    console.log("enviarMedia");
    //api.off(SLSAPI.Notes.EVENT_ADD_NOTE_FINISH);
    //api.on(SLSAPI.Notes.EVENT_ADD_NOTE_FINISH, function(resposta){
    function envioOK(res){
      mediaLista.push(res.response);
      console.log(res.response);
      //console.log(typeof(response));
      trajeto.media = mediaLista;
      trajetoString = JSON.stringify(trajeto);
      console.log("enviou midia: trajetoString", trajetoString);
      window.localStorage.setItem(trajeto.key, trajetoString);  
    }

    function envioFAIL(res){
      console.log("enviou falhou feio", res);
    }
      
    //})
    media.forEach(function(item){
      var obj = {};
      obj = item;
      obj.user = api.user.user_id;
      obj.texto = item.comentario;
      obj.fotoURI = item.name;
      obj.cat = item.type;
      obj.latitude = -40;
      obj.longitude = -20;

      //obj.timestamp = item.timestamp;
      if (item.id){
        console.log("ja foi enviado : " , item.id);
        api.notes.enviar(obj, false, envioOK, envioFAIL);  
      }
      else {
        console.log("tentando enviar");
        api.notes.enviar(obj, false, envioOK, envioFAIL);  
      }
    });
  }; 
}

//Ready
$(document).ready(function(){
  $("#btnParar").hide();
  $("#btnFoto").hide();
  $("#btnVideo").hide();
  $("#btnAudio").hide();
  SLbegin();

  /*$(document).on('pagebeforechange', function(e,data){
    console.log(data.toPage, data.options, data.options.direction);
    window.data = data;
    if ($(data.toPage).attr('id') == 'comment'){
      console.log("entrou no if 2");
      data.toPage = '#startTracking';
    }
  });*/
});

//Variaveis
var trajetoSelecionado; //para guardar o trajeto escolhido
var api; //api
var inicioVideo;     // para setar o timestamp do inicio do video
var track_id = '';      // Name/ID of the exercise
var track_id_media = ''; //Name/ID of the exercise media
watch_id = null;    // ID of the geolocation
tracking_data = []; // Array containing GPS position objects
tracking_data_media = []; // Array containing GPS position media

//Função para colocar a posição e nome do arquivo no array data_media, além de setar a posição no arquivo
function PathMedia(position, mediaFiles){
  this.timestampFim = position.timestamp;
  this.name = mediaFiles[0].fullPath;
  this.type = mediaFiles[0].type;
}

function fail(error) {
  var msg = 'An error occurred during capture: ' + error.code;
}

function success(){
  console.log("OK");
}

//Mover e renomear o arquivo de áudio
function successMoveTo(entry) {
  var folder = "GravacoesAudioTrilha";
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

//Se a capture foi sucesso
function captureSuccess(mediaFiles) {
  var i, len;
  for (i = 0, len = mediaFiles.length; i < len; i += 1) {

    var path3 = mediaFiles[i].fullPath;
    var path2 = path3.slice(0, 5) + "//" + path3.slice(5);
    window.resolveLocalFileSystemURI(path2, successMoveTo, fail);

    //renomear arquivo de audio
    if (mediaFiles[i].type == "audio/3gpp"){
      mediaFiles[i].name = mediaFiles[i].name.replace("3gpp", "wav");
      mediaFiles[i].fullPath = mediaFiles[i].fullPath.slice(0,25) + "GravacoesAudioTrilha/" + mediaFiles[i].name;
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

// Called if something bad happens.
function captureError(error) {
    var msg = 'An error occurred during capture: ' + error.code;
    console.log(msg, 'Uh oh!');
    //$.mobile.changePage( "#startTracking", { });
    console.log("ERRO FODEU");
}

//FOTO
function capturePhoto() {
    // Launch device camera application,
    navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
}

//VIDEO
function captureVideo() {
    // Launch device video recording application,
    //TESTE
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
      //FIM TESTE
    navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1});
}

//AUDIO
function captureAudio() {
    // Launch device audio recording application,
    navigator.device.capture.captureAudio(captureSuccess, captureError, {limit: 1});
}

//Salvar comentario do audio
function salvarComentario(){

  comentario = $("#save_comment").val();
  $("#save_comment").val('');
  tamanho_tdm = tracking_data_media.length -1;
  tracking_data_media[tamanho_tdm].comentario = comentario;
}

//GPS
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
function startTracking_start(){

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
      //pegar cada ponto após estar 5 metros a distância do anterior
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
    { frequency: 3000, enableHighAccuracy: true }
  );
  
  // Tidy up the UI
  track_id = $("#track_id").val();
  track_id_media = track_id + "_media";
  track_id_bckup = track_id;

  //Verify if already exists and insert (number) on the name in case it exists
  j = 1;
  tracks_recorded = window.localStorage.length;
  for (var i = 0; i < tracks_recorded; i++) {
    if(window.localStorage.key(i) == track_id){
      track_id = track_id_bckup + " (" + j + ")";
      track_id_media = track_id_bckup + "_media";
      j++;
    }
  };
  
  $("#track_id").hide();
  $("#startTracking_status").html("Traçando rota: <strong>" + track_id + "</strong>");

}

//Parar trajeto
function startTracking_stop(){

  $("#btnIniciar").toggle();
  $("#btnParar").toggle();
  $("#btnFoto").toggle();
  $("#btnVideo").toggle();
  $("#btnAudio").toggle();

  // Stop tracking the user
  navigator.geolocation.clearWatch(watch_id);

  // Save the tracking data
  window.localStorage.setItem(track_id, JSON.stringify({key: track_id, data: tracking_data, media: tracking_data_media}));
  
  // Reset watch_id and tracking_data 
  watch_id = null;
  tracking_data = [];
  tracking_data_media = [];

  // Tidy up the UI
  $("#track_id").val("").show();
  $("#startTracking_status").html("Rota traçada: <strong>" + track_id + "</strong>");
}

//Limpar dados
$("#home_clearstorage_button").live('click', function(){
	window.localStorage.clear();
});

//Abrir página de histórico
$('#history').live('pageshow', function () {

  var conta_errado = 0;
	// Count the number of entries in localStorage and display this information to the user
	tracks_recorded = window.localStorage.length;
  for (var i = 0; i < tracks_recorded; i++) {
    if(window.localStorage.key(i).indexOf("_media") != -1){
      conta_errado++;
    }
  };

  var tracks_certo = tracks_recorded - conta_errado;

	$("#tracks_recorded").html("<div style='margin-bottom:20px;'><strong>" + tracks_certo + "</strong> rota(s) salva(s)</div>");
	
	// Empty the list of recorded tracks
	$("#history_tracklist").empty();
	
	// Iterate over all of the recorded tracks, populating the list
	for(i=0; i<tracks_recorded; i++){
    if(window.localStorage.key(i).indexOf("_media") == -1){
		  $("#history_tracklist").append("<li><a href='#track_info' style='min-height: 20px;' data-ajax='false'>" + window.localStorage.key(i) + "</a></li>");
    }
	}
	
	// Tell jQueryMobile to refresh the list
	$("#history_tracklist").listview('refresh');

});

// When the user clicks a link to view track info, set/change the track_id attribute on the track_info page.
$("#history_tracklist li a").live('click', function(){

	$("#track_info").attr("track_id", $(this).text());
	
});

/*
function getLatLon(){
  //Pegar o timestamp, verificar com o trajeto e descobrir a latitude e longitude
  distBckp = 0;
  mediaLat = 0;
  mediaLon = 0;
  counter = 0;
  k = 0;
  trajeto.data.forEach(function(item){
    if (distBckp == 0){
      distBckp =  Math.abs(trajeto.media[i].timestampFim - item.timestamp);
      mediaLat = item.latitude;
      mediaLon = item.longitude;
      //mediaLat = item.trilha.latitude;
      //mediaLon = item.trilha.longitude;
      k = counter;
    }
    else if (Math.abs(trajeto.media[i].timestampFim - item.timestamp) < distBckp){
      distBckp = Math.abs(trajeto.media[i].timestampFim - item.timestamp);
      mediaLat = item.latitude;
      mediaLon = item.longitude;
      //mediaLat = item.trilha.latitude;
      //mediaLon = item.trilha.longitude;
      k = counter;
    }
    counter++;
  });
  return mediaLat, mediaLon, k;
}*/

// When the user views the Track Info page
$('#track_info').live('pageshow', function(){

  // Find the track_id of the workout they are viewing
  var key = $(this).attr("track_id");
  var key_media = key + "_media";
  //keySelected = key;
  //keyMediaSelected = key_media;
  
  // Update the Track Info page header to the track_id
  $("#track_info div[data-role=header] h1").text(key);
  
  //Pega correto alert(key);
  var trajeto = window.localStorage.getItem(key);
  console.log("DATA: ", trajeto); 
  
  // Turn the stringified GPS data back into a JS object
  trajeto = JSON.parse(trajeto);
  console.log("DATA JSON: ", trajeto);

  trajetoSelecionado = trajeto;

  // Calculate the total distance travelled
  total_km = 0;

  for(i = 0; i < trajeto.data.length - 1; i++){
    total_km += gps_distance(trajeto.data[i].latitude, trajeto.data[i].longitude, trajeto.data[i+1].latitude, trajeto.data[i+1].longitude);
    //total_km += gps_distance(trajeto.data[i].trilha.latitude, trajeto.data[i].trilha.longitude, trajeto.data[i+1].trilha.latitude, trajeto.data[i+1].trilha.longitude);
  }
  
  total_km_rounded = total_km.toFixed(2);
  
  // Calculate the total time taken for the track
  start_time = new Date(trajeto.data[0].timestamp).getTime();
  end_time = new Date(trajeto.data[trajeto.data.length-1].timestamp).getTime();

  total_time_ms = end_time - start_time;
  total_time_s = total_time_ms / 1000;
  
  final_time_m = Math.floor(total_time_s / 60);
  final_time_s = (total_time_s - (final_time_m * 60)).toFixed(2);

  // Display total distance and time
  $("#track_info_info").html('Percorreu <strong>' + total_km_rounded + '</strong> km(s) em <strong>' + final_time_m + 'minuto(s)</strong> e <strong>' + final_time_s + 'segundo(s)</strong>');
  
  // Set the initial Lat and Long of the Google Map
  var myLatLng = new google.maps.LatLng(trajeto.data[0].latitude, trajeto.data[0].longitude);
  //var myLatLng = new google.maps.LatLng(trajeto.data[0].trilha.latitude, trajeto.data[0].trilha.longitude);

  // Google Map options
  var myOptions = {
    zoom: 15,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  // Create the Google Map, set options
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  // Colocar marcadores onde foi feito alguma captura de media
  for(i = 0; i < trajeto.media.length; i++){

    //Pegar o timestamp, verificar com o trajeto e descobrir a latitude e longitude
    distBckp = 0;
    mediaLat = 0;
    mediaLon = 0;
    counter = 0;
    k = 0;
    arrayMarker = [];
    trajeto.data.forEach(function(item){
      if (distBckp == 0){
        distBckp =  Math.abs(trajeto.media[i].timestampFim - item.timestamp);
        mediaLat = item.latitude;
        mediaLon = item.longitude;
        //mediaLat = item.trilha.latitude;
        //mediaLon = item.trilha.longitude;
        k = counter;
      }
      else if (Math.abs(trajeto.media[i].timestampFim - item.timestamp) < distBckp){
        distBckp = Math.abs(trajeto.media[i].timestampFim - item.timestamp);
        mediaLat = item.latitude;
        mediaLon = item.longitude;
        //mediaLat = item.trilha.latitude;
        //mediaLon = item.trilha.longitude;
        k = counter;
      }
      counter++;
    });

      

    //verificar se ja existe um marker naquele local
    if(arrayMarker.length != 0){
      for(i=0; i<arrayMarker.length; i++){
      if (mediaLat == arrayMarker[i][0] && mediaLon == arrayMarker[i][1]){
        if (trajeto.data[k + 1]){
          mediaLat = trajeto.data[k].latitude + (trajeto.data[k].latitude - trajeto.data[k + 1].latitude);
          mediaLon = trajeto.data[k].longitude + (trajeto.data[k].longitude - trajeto.data[k + 1].longitude);
          //mediaLat = trajeto.data[k].trilha.latitude + (trajeto.data[k].trilha.latitude - trajeto.data[k + 1].trilha.latitude);
          //mediaLon = trajeto.data[k].trilha.longitude + (trajeto.data[k].trilha.longitude - trajeto.data[k + 1].trilha.longitude);
        }
        else if (trajeto.data[k - 1]){
          mediaLat = trajeto.data[k - 1].latitude + (trajeto.data[k - 1].latitude - trajeto.data[k].latitude);
          mediaLon = trajeto.data[k - 1].longitude + (trajeto.data[k - 1].longitude - trajeto.data[k].longitude);
          //mediaLat = trajeto.data[k - 1].trilha.latitude + (trajeto.data[k - 1].trilha.latitude - trajeto.data[k].trilha.latitude);
          //mediaLon = trajeto.data[k - 1].trilha.longitude + (trajeto.data[k - 1].trilha.longitude - trajeto.data[k].trilha.longitude);
        } 
      }
    }  
    }
      
    arrayMarker.push([mediaLat, mediaLon]);

    //inserir a mídia no mapa
    var myLatLng_media = new google.maps.LatLng(mediaLat, mediaLon);
    var titulo;

    if (trajeto.media[i].type == "image/jpeg"){
      //$("#media_file").html("<img style='width:250px;' src='" + path_media.name + "'></img>");
      titulo = '<div>' + trajeto.media[i].comentario + '<div>' + '<img style="width:120px;" src="' + trajeto.media[i].name + '"></img>' + '</div>' + '</div>';
    }
    else if (trajeto.media[i].type == "video/mp4"){
      //$("#media_file").html("<video width='250px' height='250px' controls><source src='" + path_media.name + "' type='video/mp4'></video>");
      titulo = '<div>' + trajeto.media[i].comentario + '<div>' + '<video id="vid" width="220px" height="200px" controls><source src="' + trajeto.media[i].name + '" type="video/mp4"></video>' + '</div>' + '</div>';
    }
    else if (trajeto.media[i].type == "audio/wav"){
      //$("#media_file").html("<audio controls><source src='" + path_media.name + "'></audio>"); //Audio nao esta funcionando para mostrar
      titulo = '<div>' + trajeto.media[i].comentario + '<div>' + '<audio controls><source src="' + trajeto.media[i].name + '"></audio>' + '</div>' + '</div>';
    }

    var prevMarker = false;
      
      

    var marker = new google.maps.Marker({
      position: myLatLng_media,
      map: map,
      clickable: true
    });

    marker.info = new google.maps.InfoWindow({
      content: titulo
    });

    google.maps.event.addListener(marker, 'click', function() {
      if (prevMarker){
        prevMarker.close();
      }
      prevMarker = this.info;
      var marker_map = this.getMap();
      this.info.open(marker_map, this);

      $('#vid').bind('timeupdate', function(e) {
        this.currentTime;
      });
    });

  }

  var trackCoords = [];
  
  // Add each GPS entry to an array
  for(i=0; i<trajeto.data.length; i++){
    trackCoords.push(new google.maps.LatLng(trajeto.data[i].latitude, trajeto.data[i].longitude));
    //trackCoords.push(new google.maps.LatLng(trajeto.data[i].trilha.latitude, trajeto.data[i].trilha.longitude));
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
});

//updater marker position as the video go //pegar o tempo decorrido (a cada 5seg por exemplo) e adicionar ao timestamp do videoInicio
//e procurar uma nova LatLon e updateTracker
/*
function updateMarkerVideo(){
  var mediaElement = document.getElementById('vid');
  console.log("if ", mediaElement.currentTime);
  function changeMarkerPosition(marker, tempoDecorrido) {
    pegarLatLon(timestampInicio + tempoDecorrido); //pegar todos do inicio até o fim do vídeo.
    marker.setPosition(latlng);
  }
}
*/