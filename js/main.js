function Banner()
{
    "use strict";
}


// VIDEO SET UP.
// ==================================================================================================================
Banner.setUpVideo = function()
{
    console.log( "BANNER SETUP VIDEO CALLED" );

    this.VRPlayer = new VRVideoComponent( this.video );
    this.VRPlayer.setValues( this.videoTarget, 3200, 1600, 1260, 630 );
    //this.VRPlayer.init();
    this.VRPlayer.playerID = "videoPlayer";

    // starts video without sound.
    this.VRPlayer.startMuted = true;

    // add video events
    this.VRPlayer.addVideoEvent( this, Constants.VIDEO_COMPLETE, 'videoComplete' );
    this.VRPlayer.addVideoEvent( this, Constants.VIDEO_PLAYING, 'videoPlaying' );
    this.VRPlayer.addVideoEvent( this, Constants.VIDEO_TIMECODE, 'updateTimecode' );

    this.VRPlayer.addVideo( "gb_360_video_v03b_injected.mp4", '', '', 'testvideo' );

    this.controls           = new VideoControls();
    this.controls.parent    = this;
    this.controls.vidPlayer = this.VRPlayer;

    this.controls.videoCompDiv  = document.getElementById( 'videoComponent' );
    this.controls.controlsDiv   = this.controlsDiv;

    // play pause button
    this.controls.playPauseBtn  = document.getElementById('user_playPause');

    // audio button
    this.controls.audioBtn      = document.getElementById('user_audio');

    this.controls.progressDiv   = document.getElementById('user_progress');
    this.controls.progressBar   = document.getElementById('user_progressBar');
    this.controls.loadBar       = document.getElementById('user_loadBar');
    this.controls.slider        = document.getElementById('user_slider');

    // init controls
    this.controls.init();
    this.controls.enable( true );

    Banner.playInitVideo();
};


Banner.updateTimecode = function( _data )
{
    Banner.timeCode.innerText = _data.data;
};


// PLAYS INITIAL VIDEO
// ==================================================================================================================
Banner.playInitVideo = function()
{
    this.VRPlayer.playVideoByID( 'testvideo' );
};


// USER SELECTS REPLAY FROM END FRAME OR CLICK FOR SOUND
// ==================================================================================================================
Banner.playUserVideo = function()
{
    //this.vidPlayer.resetProgressEvents();
    //this.vidPlayer.startMuted = false;
    //this.vidPlayer.playVideoByID(  );
};


// FIRES AFTER VIDEO HAS STARTED PLAYING.
// ==================================================================================================================
Banner.videoPlaying = function()
{

};


// VIDEO HAS FINISHED, CHECKS IF THE INITIAL ANIMATION HAS PLAYED AND WILL SHOW IT IF IT HASN'T.
// ==================================================================================================================
Banner.videoComplete = function()
{
    Banner.playInitVideo();
};


Banner.motionUpdated = function( _data )
{
    console.log( "MOTION UPDATED :: ", _data );
};


// FIRED ON AD LOAD, SETS UP ALL THE INITIAL VALUES AND STARTS THE AD.
// ==================================================================================================================
Banner.init = function()
{
    Banner.video                = document.getElementById('video');
    Banner.videoTarget          = document.getElementById('VRVideoTarget');
    Banner.controlsDiv          = document.getElementById('controls');
    Banner.timeCode             = document.getElementById('timeCode');

    SVGLib.addSVGByClass( 'playBtnSVG',  SVGLib.PLAY_BTN );
    SVGLib.addSVGByClass( 'pauseBtnSVG', SVGLib.PAUSE_BTN );
    SVGLib.addSVGByClass( 'audioOnBtnSVG', SVGLib.AUDIO_BTN );
    SVGLib.addSVGByClass( 'audioOffBtnSVG', SVGLib.AUDIO_BTN_DISABLED );

    Banner.setUpVideo();
};


// AD LOAD EVENT LISTENER
// ==================================================================================================================
window.onload = Banner.init;