var playBtn = document.getElementById("play-button").focus();
var videoElement = document.getElementById('video-element');
videoElement.addEventListener('ended', (event) => {
    document.querySelector('#skip-button').disabled = false;
    document.getElementById("page-content").style.display = "none";
      createCell()
  });
var adsLoaded = false;
var adContainer;
var adDisplayContainer;
var adsLoader;
var adsManager;

document.addEventListener("DOMContentLoaded", function(){
    var box = document.getElementById('adblock');
        if(!box.getBoundingClientRect().width) {
        console.log("AddBlock Is turn on")
         document.querySelector(".addBlockIsTurnOn").innerText = "It seems you are using the addBlock program. Please turn it off and enjoy";
    }
    
});

document.onkeydown = function (event) {
  if(event.code == "Enter" && event.target.id == "play-button"){
        document.querySelector('#skip-button').disabled = true
      videoElement.play();
  }
  else if(event.code == "Enter" && event.target.id == "skip-button"){
        onContentPauseRequested()
      document.getElementById("page-content").style.display = "none";
      createCell()
  } else if(event.code == "ArrowRight"){
      document.getElementById("skip-button").focus();
  }
  else if(event.code == "ArrowLeft"){
      document.getElementById("play-button").focus();
  }
}

window.addEventListener('load', function(event) {
  initializeIMA();
  videoElement.addEventListener('play', function(event) {
    loadAds(event);
  });
});

window.addEventListener('resize', function(event) {
  console.log("window resized");
  if(adsManager) {
    var width = videoElement.clientWidth;
    var height = videoElement.clientHeight;
    adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
  }
});
function initializeIMA() {
  console.log("initializing IMA");
  adContainer = document.getElementById('ad-container');
  adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement);
  adsLoader = new google.ima.AdsLoader(adDisplayContainer);
  adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      onAdsManagerLoaded,
      false);
  adsLoader.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      onAdError,
      false);
  videoElement.addEventListener('ended', function() {
    adsLoader.contentComplete();
  });

  var adsRequest = new google.ima.AdsRequest();
  adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
      'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
      'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
      'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';

  adsRequest.linearAdSlotWidth = videoElement.clientWidth;
  adsRequest.linearAdSlotHeight = videoElement.clientHeight;
  adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
  adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;

 
  adsLoader.requestAds(adsRequest);
}

function loadAds(event) {
    if(adsLoaded) {
    return;
  }
  adsLoaded = true;
  videoElement.play

  event.preventDefault();

    videoElement.load();
  adDisplayContainer.initialize();

  var width = videoElement.clientWidth;
  var height = videoElement.clientHeight;
  try {
    adsManager.init(width, height, google.ima.ViewMode.NORMAL);
    adsManager.start();
  } catch (adError) {
    console.log("AdsManager could not be started");
    videoElement.play();
  }
}
function onAdsManagerLoaded(adsManagerLoadedEvent) {
   adsManager = adsManagerLoadedEvent.getAdsManager(
      videoElement);
      
  adsManager.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      onAdError);
      adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
      onContentPauseRequested);
  adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
      onContentResumeRequested);
      adsManager.addEventListener(
      google.ima.AdEvent.Type.LOADED,
      onAdLoaded);
}
function onContentPauseRequested() {
  videoElement.pause();
}

function onContentResumeRequested() {
  videoElement.play();
}
function onAdError(adErrorEvent) {
  // Handle the error logging.
  console.log(adErrorEvent.getError());
  if(adsManager) {
    adsManager.destroy();
  }
}

function onAdLoaded(adEvent) {
  var ad = adEvent.getAd();
  if (!ad.isLinear()) {
    videoElement.play();
  }
}