/**
 * Created by nkatz on 7/28/15.
 */


function VideoControls()
{
    this.parent       = null;
    this.vidPlayer     = null;
    this.controlsDiv  = null;
    this.videoCompDiv = null;

    this.playPauseBtn = null;
    this.replayBtn = null;

    this.progressBar = null;
    this.loadBar = null;
    this.progressDiv = null;
    this.slider = null;
    this.audioBtn = null;
    this.fullscreenBtn = null;
    this.rollOffTime = 3;

    this.autoShowHideControls = true;
    this.isVideoComplete = true;
    this.isControlsShown = false;

    // progress / slider values
    this.progressWidth = 0;
    this.dragging = false;
    this.sliderInitX = 0;
    this.sliderInitGlobalX = -1;
    this.sliderTransition = '';

    this.videoSelectorBtns = null;
    this.currentVideoBtn = null;
    this.videoID = null;

    this.mouseManager = null;
    this.valuesSet = false;
}


VideoControls.prototype.destroy = function()
{
    this.clearTimer();

    this.videoCompDiv.onmousemove = null;
    this.videoCompDiv.onmouseup = null;

    this.slider.controls = null;
    this.videoCompDiv.controls = null;

    this.vidPlayer     = null;
    this.controlsDiv  = null;
    this.videoCompDiv = null;

    this.playPauseBtn = null;
    this.replayBtn = null;

    this.progressBar = null;
    this.slider = null;
    this.audioBtn = null;
    this.fullscreenBtn = null;

    this.autoShowHideControls = true;
    this.isVideoComplete = true;
    this.isControlsShown = false;

    this.dragging = false;
    this.sliderTransition = null;

    this.videoSelectorBtns = null;
    this.currentVideoBtn = null;
    this.isEnabled = false;

    this.timer = null;
    this.parent = null;
};


VideoControls.prototype.init = function()
{
    //console.log( "VIDEO CONTROLS INIT CALLED :: ", this.playPauseBtn );

    if( this.mouseManager ) return;

    this.mouseManager = new MouseEventManager( this.videoCompDiv );
    //this.mouseManager.debug = true;
    if( this.autoShowHideControls ) this.mouseManager.addButton( this, this.videoCompDiv.id, null, null, null, 'showControls', 'hideControls' );
    if( this.playPauseBtn )         this.mouseManager.addButton( this, this.playPauseBtn.id, 'btnClicked' );
    if( this.audioBtn )             this.mouseManager.addButton( this, this.audioBtn.id, 'btnClicked' );
    if( this.fullscreenBtn )        this.mouseManager.addButton( this, this.fullscreenBtn.id, 'btnClicked' );
    if( this.replayBtn )            this.mouseManager.addButton( this, this.replayBtn.id, 'btnClicked' );

    if( this.slider && this.progressDiv )
    {
        this.slider.controls = this;
        this.videoCompDiv.controls = this;

        this.mouseManager.addButton( this, this.slider.id, null, null, null, null, null, 'sliderMouseDown' );
        this.mouseManager.addButton( this, this.progressDiv.id, 'btnClicked' );
        this.videoCompDiv.onmousemove = this.draggingSlider;
    }

    if( this.videoSelectorBtns )
    {
        for ( var i in this.videoSelectorBtns )
        {
            this.mouseManager.addButton( this, i, 'playUserVideo' );
        }
    }

    this.showPause();
    this.addListeners();
};


VideoControls.prototype.updatePlayerTarget = function( _vidPlayer )
{
    this.removeListeners();
    if( this.vidPlayer ) this.vidPlayer.clearEvents();
    this.vidPlayer = _vidPlayer;
    this.addListeners();
};


VideoControls.prototype.setValues = function()
{
    if( !this.slider || !this.progressDiv || this.valuesSet ) return;

    this.valuesSet = true;
    this.progressWidth = this.progressDiv.clientWidth;
    this.sliderLeft = - this.slider.clientWidth * .5;
    this.sliderRight = this.progressWidth - this.slider.clientWidth * .5;
    if( this.sliderInitGlobalX == -1 ) this.sliderInitGlobalX = this.findPosX( this.slider );
};


VideoControls.prototype.enable = function( isEnabled )
{
    this.isEnabled = isEnabled;
};


VideoControls.prototype.addVideoBtn = function( _btn, _videoID, _handleSelected )
{
    if( !this.videoSelectorBtns ) this.videoSelectorBtns = {};
    this.videoSelectorBtns[_btn.id] = { btn:_btn, id:_videoID, handleSelected:_handleSelected };
};


VideoControls.prototype.sliderMouseDown = function()
{
    this.sliderTransition = this.slider.style.transition;
    this.slider.style.transition = 'none';
    this.dragging = true;

    this.videoCompDiv.onmouseup = this.sliderMouseUp;
    this.pauseVideo();
};


VideoControls.prototype.sliderMouseUp = function( e )
{
    // if we were dragging the play video
    if( this.controls.dragging ) this.controls.playVideo();

    // dragging flag to false
    this.controls.dragging = false;

    // renable slider transition
    this.controls.slider.style.transition = this.controls.sliderTransition;

    // kill listeners
    this.onmouseup = null;
};


VideoControls.prototype.draggingSlider = function( e )
{
    if( !this.controls.isEnabled ) return;

    this.controls.startTimer();
    this.controls.showControls();

    if( !this.controls.dragging )
    {
        return;
    }

    var pos = ( e.pageX - this.controls.sliderInitGlobalX ) + this.controls.sliderInitX - ( this.controls.slider.clientWidth * .5 );

    pos = ( pos < this.controls.sliderLeft ) ? this.controls.sliderLeft : pos;
    pos = ( pos > this.controls.sliderRight ) ? this.controls.sliderRight : pos;

    this.controls.slider.style.left = pos + 'px';
    this.controls.progressBar.style.width = (( pos + this.controls.slider.clientWidth * .5 ) - this.controls.sliderInitX ) + 'px';

    var vidPos = (( pos + this.controls.slider.clientWidth * .5 ) - this.controls.sliderInitX ) / this.controls.progressWidth;
    this.controls.vidPlayer.seekVideo( vidPos );
};


VideoControls.prototype.startTimer = function()
{
    if( this.rollOffTime == -1 ) return;

    this.clearTimer();

    this.timer = setTimeout( createDelegate( this, this.hideControls ), this.rollOffTime * 1000 );
};


VideoControls.prototype.clearTimer = function()
{
    if( this.timer )
    {
        clearTimeout( this.timer );
        this.timer = null;
    }
};


VideoControls.prototype.btnClicked = function( _btn, event )
{
    console.log( "CONTROLS :: BTN CLICKED :: ", _btn.id );

    switch( _btn )
    {
        case this['playPauseBtn']:
            this.playPauseVideo( true );
            break;

        case this['audioBtn']:
            this.audioToggle( true );
            break;

        case this['progressDiv']:
            this.progressClicked( event );
            break;

        case this['replayBtn']:
            this.replayVideo();
            break;
    }
};


VideoControls.prototype.replayVideo = function()
{
    this.vidPlayer.replayVideo();
    this.updateLoadBar( 1 );
};


VideoControls.prototype.playUserVideo = function( _btn )
{
    var btnObj = this.videoSelectorBtns[_btn.id];
    if( btnObj )
    {
        this.videoID = btnObj.id;
        this.vidPlayer.playVideoByID( btnObj.id );
        this.updateSelectedVideoBtns( _btn );
    }
};


VideoControls.prototype.selectVideoBtn = function( _btn )
{
    if( !_btn ) return;

    this.unselectVideoBtn( this.currentVideoBtn );

    addClass( _btn, 'videoBtn_selected' );
    this.currentVideoBtn = _btn;
};


VideoControls.prototype.unselectVideoBtn = function( _btn )
{
    if( !_btn ) return;
    removeClass( _btn, 'videoBtn_selected' );
};


VideoControls.prototype.updateSelectedVideoBtns = function( _btn )
{
    if( _btn )
    {
        this.selectVideoBtn( _btn );
        return;
    }

    for ( var btnObj in this.videoSelectorBtns )
    {
        if( this.videoID == this.videoSelectorBtns[btnObj].id && this.videoSelectorBtns[btnObj].handleSelected )
        {
            this.selectVideoBtn( this.videoSelectorBtns[btnObj].btn );
            break;
        }
    }
};


VideoControls.prototype.playPauseVideo = function( _isUser )
{
    console.log( "CONTROLS :: PLAYPAUSE VIDEO CLICKED :: " + _isUser );
    if( this.vidPlayer.isPlaying ) this.pauseVideo( _isUser );
    else this.playVideo( _isUser );
};



VideoControls.prototype.playVideo = function( _isUser )
{
    console.log( "CONTROLS :: PLAY VIDEO CLICKED :: " + _isUser );
    this.vidPlayer.playVideo( _isUser );
};


VideoControls.prototype.pauseVideo = function( _isUser )
{
    console.log( "CONTROLS :: PAUSE VIDEO CLICKED :: " + _isUser );
    this.vidPlayer.pauseVideo( _isUser );
};


VideoControls.prototype.audioToggle = function( _isUser )
{
    if( this.vidPlayer.isMuted )
    {
        this.vidPlayer.unmuteVideo( _isUser );
    }
    else
    {
        this.vidPlayer.muteVideo( _isUser );
    }
};


VideoControls.prototype.seekVideo = function( pos, _isUser )
{
    console.log( "SEEK VIDEO CALLED :: " + pos );
    this.vidPlayer.seekVideo( pos, _isUser );
};


VideoControls.prototype.progressClicked = function( e )
{
    var x = e.offsetX ? e.offsetX : e.layerX;
    var pos = x / this.progressWidth;

    this.seekVideo( pos, true );
};


VideoControls.prototype.showPlay = function()
{
    if( !this.isEnabled || !this.playPauseBtn ) return;
    removeClass(this.playPauseBtn, 'controls_playPause_paused');
};


VideoControls.prototype.showPause = function()
{
    if( !this.isEnabled || !this.playPauseBtn ) return;
    addClass(this.playPauseBtn, 'controls_playPause_paused');
};


VideoControls.prototype.showMuted = function()
{
    if( !this.audioBtn ) return;
    addClass( this.audioBtn, "controls_audio_muted" );
};


VideoControls.prototype.showUnmuted = function()
{
    if( !this.audioBtn ) return;
    removeClass( this.audioBtn, "controls_audio_muted" );
};


VideoControls.prototype.updateSlider = function()
{
    if( this.dragging || !this.slider ) return;

    var pos = Math.round(( this.progressWidth * this.vidPlayer.videoProgress ));
    var sliderPos = this.sliderInitX + pos - this.slider.clientWidth *.5;

    if( sliderPos > ( this.sliderInitX + this.progressWidth ))
    {
        sliderPos = this.sliderInitX + this.progressWidth - this.slider.clientWidth * .5;
    }

    if( sliderPos < this.sliderInitX )
    {
        sliderPos = this.sliderInitX - this.slider.clientWidth * .5;
    }

    this.progressBar.style.width = pos + 'px';
    this.slider.style.left = sliderPos + 'px';
};


VideoControls.prototype.stopAndResetVideo = function()
{
    this.vidPlayer.stopAndResetVideo();
    this.resetControls();
};


VideoControls.prototype.pauseAndResetVideo = function()
{
    this.vidPlayer.pauseVideo();
    this.resetControls();
};


VideoControls.prototype.resetControls = function()
{
    this.unselectVideoBtn( this.currentVideoBtn );
    if( this.slider ) this.slider.style.left = this.sliderInitX + 'px';
    if( this.progressBar ) this.progressBar.style.width = 0;
    if( this.loadBar ) this.loadBar.style.width = 0;
};


VideoControls.prototype.showControls = function()
{
    if( !this.controlsDiv || this.isVideoComplete || this.isControlsShown || !this.autoShowHideControls ) return;

    this.isControlsShown = true;

    addClass( this.controlsDiv, "showControls" );
    removeClass( this.controlsDiv, "hideControls" );
};


VideoControls.prototype.hideControls = function()
{
    if( !this.controlsDiv || !this.autoShowHideControls ) return;

    this.isControlsShown = false;
    removeClass( this.controlsDiv, "showControls" );
    addClass( this.controlsDiv, "hideControls" );
};


VideoControls.prototype.updateLoadBar = function( _progress )
{
    if( !this.loadBar ) return;

    var pos = Math.round(( this.progressWidth * _progress ));
    this.loadBar.style.width = pos + 'px';
};


// process video events
VideoControls.prototype.videoUpdated = function( _event )
{
    this.videoID = _event.videoID;

    //console.log( "CONTROLS VIDEO UPDATED :: " + _event.type );

    switch( _event.type )
    {
        case Constants.VIDEO_STARTED:
        case Constants.VIDEO_REPLAYING:
            this.isVideoComplete = false;
            this.updateSelectedVideoBtns();
            this.setValues();
            break;

        case Constants.VIDEO_COMPLETE:
            this.isVideoComplete = true;
            this.hideControls();
            this.resetControls();
            break;

        case Constants.VIDEO_MUTED:
            this.showMuted();
            break;

        case Constants.VIDEO_UNMUTED:
            this.showUnmuted();
            break;

        case Constants.VIDEO_PAUSED:
            this.showPlay();
            break;

        case Constants.VIDEO_PLAYING:
        case Constants.VIDEO_RESUMED:
            this.isVideoComplete = false;
            this.showPause();
            break;

        case Constants.VIDEO_STOPPED:
            this.unselectVideoBtn( this.currentVideoBtn );
            this.resetControls();
            break;

        case Constants.VIDEO_UPDATED:
            this.updateSlider();
            break;

        case Constants.VIDEO_LOAD_PROGRESS:
            this.updateLoadBar( _event.data );
            break;
    }
};


// finds global x pos of item
VideoControls.prototype.findPosX = function( item )
{
    var curleft = item.offsetLeft;
    while( item = item.offsetParent )
    {
        curleft += item.offsetLeft;
    }

    return curleft;
};


VideoControls.prototype.addListeners = function()
{
    if( !this.vidPlayer ) return;

    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_COMPLETE, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_REPLAYING, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_MUTED, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_UNMUTED, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_PAUSED, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_PLAYING, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_RESUMED, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_STOPPED, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_STARTED, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_UPDATED, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_LOAD_PROGRESS, 'videoUpdated' );
};


VideoControls.prototype.removeListeners = function()
{
    console.log( "REMOVING LISTENERS :: " + this.vidPlayer );

    if( !this.vidPlayer ) return;
    this.vidPlayer.removeAllVideoEvents();
};