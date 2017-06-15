/**
 * Created by nkatz on 7/23/15.
 */


function VideoComponent( _video )
{
    console.log( "VIDEO COMP CONST :: ", _video );

    this.video = _video;
    this.init();
}


VideoComponent.videoEventList = [
    Constants.VIDEO_0_PERCENT,
    Constants.VIDEO_25_PERCENT,
    Constants.VIDEO_50_PERCENT,
    Constants.VIDEO_75_PERCENT,
    Constants.VIDEO_100_PERCENT
];


VideoComponent.prototype.destroy = function()
{
    this.removeListeners();
    this.pauseVideo();
    this.removeAllVideoEvents();

    this.videos = null;
    this.events = null;
    this.video.vidComp = null;
    this.video = null;
    this.currentVidVo = null;
    this.isPlaying = null;
    this.isMuted = null;
    this.playerID = null;
    this.initVideoID = null;
    this.vidDuration = null;
    this.videoProgress = null;
    this.firedProgressEvents = null;
};


VideoComponent.prototype.init = function()
{
    console.log( "VIDEO COMP INIT :: ", this.video );

    this.video.vidComp = this;
    this.loopVideoNum = 0;
    this.isPlaying = false;
    this.isMuted = false;
    this.playerID = 'default';
    this.initVideoID = '';
    this.firedProgressEvents = [];
    this.startMuted = true;
    this.userMuted = false;

    this.vidDuration = 0;
    this.videoProgress = 0;
    this.isEngaged = false;
    this.isEngagedTimerRunning = false;

    this.setListeners();
};


VideoComponent.prototype.addVideo = function( _mp4, _webm, _ogg, _id )
{
    if( !this.videos ) this.videos = {};

    var vidVo = new VideoVO();
    vidVo.pathMP4 = _mp4;
    vidVo.pathWEBM = _webm;
    vidVo.pathOGG = _ogg;
    vidVo.videoReportingID = _id;

    this.videos[_id] = vidVo;

    console.log( "VIDEO COMP ADD VIDEO :: ", vidVo );
};


VideoComponent.prototype.addVideoEvent = function( _scope, _event, _callback )
{
    if( !this.events ) this.events = {};

    var eventVo = new VideoEventVO();
    eventVo.event = _event;
    eventVo.callback = _callback;
    eventVo.scope = _scope;

    if( !this.events[_event] ) this.events[_event] = [];
    this.events[_event].push( eventVo );
};


VideoComponent.prototype.removeVideoEvent = function( _scope, _event, _callback )
{
    if( !this.events || !this.events[_event] ) return;

    var events = this.events[_event];
    var length = events.length;
    var event;

    for( var i = 0; i < length; i++ )
    {
        event = events[i];
        if( event.scope == _scope && event.callback == _callback )
        {
            events.splice( i, 1 );
            break;
        }
    }
};


VideoComponent.prototype.removeAllVideoEvents = function()
{
    for( var event in this.events )
    {
        delete this.events[event];
    }

    this.events = {};
};


VideoComponent.prototype.addProgressEvent = function( _scope, _time, _videoID, _method, _fromEnd )
{
    if( !this.progressEventManager ) this.progressEventManager = new ProgressEventManager();
    this.progressEventManager.addProgressEvent( _scope, _time, _videoID, _method, _fromEnd );
};


VideoComponent.prototype.resetProgressEvents = function()
{
    if( this.progressEventManager ) this.progressEventManager.resetEvents();
};


VideoComponent.prototype.clearProgressEvents = function()
{
    if( this.progressEventManager ) this.progressEventManager.clearProgressEvents();
};


VideoComponent.prototype.playInitVideo = function()
{
    if( !this.initVideoID ) return;

    console.log( "VIDEO COMP PLAY INIT VIDEO :: " + this.initVideoID );

    this.setUpVideo( this.initVideoID );
    this.playVideo();
};


VideoComponent.prototype.setCurrentVideo = function( _vidID )
{
    this.currentVidVo = this.videos[_vidID];
    if( !this.currentVidVo ) return;

    this.setUpVideo();
};


VideoComponent.prototype.playVideoByID = function( _id )
{
    console.log( "VIDEO COMP PLAY VIDEO BY ID :: " + _id );

    this.setUpVideo(_id);
    this.playVideo();
};


VideoComponent.prototype.setUpVideo = function( _id )
{
    console.log( "VIDEO COMP SET UP VIDEO :: " + _id );

    this.stopVideoTimer();

    this.currentVidVo = this.videos[_id];
    if( !this.currentVidVo ) return;

    this.firedProgressEvents = [];
    this.video.setAttribute( 'src', this.getVideoPath());
};


/* VIDEO CONTROLLER METHODS */
VideoComponent.prototype.playVideo = function( _isUser )
{
    console.log( "VIDEO COMPONENT :: PLAY VIDEO CALLED :: " + _isUser );

    if( !this.video || !this.currentVidVo ) return;
    if( _isUser ) this.isEngaged = true;
    this.video.play();
};


VideoComponent.prototype.pauseVideo = function( _isUser )
{
    console.log( "VIDEO COMPONENT :: PAUSE VIDEO CALLED :: " + _isUser );

    if( !this.video ) return;
    if( _isUser ) this.setEngaged( true );
    this.video.pause();
};


VideoComponent.prototype.replayVideo = function()
{
    if( !this.video || !this.currentVidVo )
    {
        this.playInitVideo();
        return;
    }

    this.isEngaged = true;
    this.video.currentTime = 0;
    this.firedProgressEvents = [];
    this.sendVideoEvent( Constants.VIDEO_REPLAYING );
    this.video.play();
};


VideoComponent.prototype.muteVideo = function( _isUser )
{
    if( !this.video ) return;

    if( _isUser ) this.userMuted = true;
    this.video.muted = true;
    this.isMuted = true;
};


VideoComponent.prototype.unmuteVideo = function( _isUser )
{
    if( !this.video ) return;

    if( _isUser ) this.userMuted = false;
    this.setEngaged();
    this.video.muted = false;
    this.isMuted = false;
};


VideoComponent.prototype.seekVideo = function( pos, _isUser )
{
    console.log( "VIDEO COMPONENT :: SEEK VIDEO CALLED :: " + pos );
    if( !this.video ) return;
    if( _isUser ) this.setEngaged();
    this.video.currentTime = this.vidDuration * pos;
};


VideoComponent.prototype.stopAndResetVideo = function()
{
    if( !this.isPlaying ) return;

    this.pauseVideo();
    this.video.currentTime = 0;
    this.sendVideoEvent( Constants.VIDEO_STOPPED );
};


/* VIDEO EVENTS */
VideoComponent.prototype.videoComplete = function( e )
{
    if( !this.vidComp ) return;

    this.vidComp.isPlaying = false;
    //this.vidComp.updateUnfiredVideoEvents();
    this.firedProgressEvents = [];
    this.vidComp.sendVideoEvent( Constants.VIDEO_COMPLETE );
};


VideoComponent.prototype.audioUpdated = function( e )
{
    if( !this.vidComp ) return;

    if( this.muted ) this.vidComp.sendVideoEvent( Constants.VIDEO_MUTED );
    else this.vidComp.sendVideoEvent( Constants.VIDEO_UNMUTED );
};


VideoComponent.prototype.metaDataLoaded = function( e )
{
    if( !this.vidComp ) return;

    console.log( "META DATA LOADED :: ", this );
    this.vidComp.vidDuration = this.duration;
    this.vidComp.sendVideoEvent( Constants.VIDEO_STARTED );
    this.vidComp.isVideoMuted();
};


VideoComponent.prototype.videoPlaying = function( e )
{
    if( !this.vidComp ) return;

    this.vidComp.isPlaying = true;
    this.vidComp.startVideoTimer();
    this.vidComp.updateVideoProps();
    this.vidComp.sendVideoEvent( Constants.VIDEO_PLAYING );
};


VideoComponent.prototype.videoPaused = function( e )
{
    if( !this.vidComp || !this.vidComp.isPlaying ) return;

    this.vidComp.isPlaying = false;
    this.vidComp.stopVideoTimer();
    this.vidComp.sendVideoEvent( Constants.VIDEO_PAUSED );
};


VideoComponent.prototype.videoCanplay = function( e )
{
    console.log( "video can play" );
    console.log( e );
};


VideoComponent.prototype.videoError = function( e )
{
    console.log( "video error" );
    console.log( e );
};


VideoComponent.prototype.timerUpdated = function( e )
{
    this.vidComp.updateVideoProps();
    this.vidComp.sendVideoEvent( Constants.VIDEO_UPDATED );
};


VideoComponent.prototype.isVideoMuted = function()
{
    if( this.startMuted || this.userMuted ) this.muteVideo();
    else this.unmuteVideo();
};


/**
 * Updates progress bar load bar, only works on progressive loads.
 */
VideoComponent.prototype.updateLoad = function( e )
{
    var loadProgress;
    if ( this.buffered && this.buffered.length > 0 && this.buffered.end && this.duration)
    {
        loadProgress = this.buffered.end(0) / this.vidComp.vidDuration;
        this.vidComp.sendVideoEvent( Constants.VIDEO_LOAD_PROGRESS, loadProgress );
    }
};


VideoComponent.prototype.showBuffer = function( e )
{
    this.vidComp.sendVideoEvent( Constants.VIDEO_SHOW_BUFFER );
};


VideoComponent.prototype.updateProgress = function()
{
    this.videoProgress = ( this.video.currentTime / this.vidDuration ) || 0;
    var eventType;

    if( this.videoProgress > 0 && !this.isFired( Constants.VIDEO_0_PERCENT )) eventType = Constants.VIDEO_0_PERCENT;
    else if( this.videoProgress > .25 && !this.isFired( Constants.VIDEO_25_PERCENT )) eventType = Constants.VIDEO_25_PERCENT;
    else if( this.videoProgress > .5 && !this.isFired( Constants.VIDEO_50_PERCENT )) eventType = Constants.VIDEO_50_PERCENT;
    else if( this.videoProgress > .75 && !this.isFired( Constants.VIDEO_75_PERCENT )) eventType = Constants.VIDEO_75_PERCENT;
    else if( this.videoProgress > .98 && !this.isFired( Constants.VIDEO_100_PERCENT )) eventType = Constants.VIDEO_100_PERCENT;

    if( !this.isFired( eventType ) && eventType != undefined )
    {
        this.sendVideoEvent( eventType );
        this.firedProgressEvents.push( eventType );
    }
};


VideoComponent.prototype.isFired = function( _event )
{
    if( !this.firedProgressEvents ) return -1;
    return ( this.firedProgressEvents.indexOf( _event ) > -1 );
};


// TODO :: need to add can play video types check and return correct one.
VideoComponent.prototype.getVideoPath = function()
{
    var codecs = [
        {type:'video/mp4; codecs="avc1.4D401E, mp4a.40.2"', path:'pathMP4'},
        {type:'video/webm; codecs="vp8.0, vorbis"', path:'pathWEBM'},
        {type:'video/ogg; codecs="theora, vorbis"', path:'pathOGG'}
    ];

    for( var index in codecs )
    {
        var canPlay = this.video.canPlayType( codecs[ index ].type );
        if( canPlay == "probably" )
        {
            return this.currentVidVo[ codecs[ index ].path ];
            break;
        }
    }

    return this.currentVidVo.pathMP4;
};


VideoComponent.prototype.sendVideoEvent = function( _event, _data )
{
    if( !this.currentVidVo ) return;

    NotificationManager.sendNotification( _event, { playerID:this.playerID, videoID:this.currentVidVo.videoReportingID, data:_data });
    this.engagedVideoTracking( _event );

    var events = this.events[_event];
    var eventVo;

    for ( var index in events )
    {
        // fires local event for all registered listeners
        eventVo = events[index];
        if( !eventVo.hasOwnProperty( 'callback' ) ) continue;
        eventVo.scope[eventVo.callback]({ type:eventVo.event, playerID:this.playerID, videoID:this.currentVidVo.videoReportingID, data:_data });
    }
};


// anything that needs to be updated on video tick goes here.
VideoComponent.prototype.updateVideoProps = function()
{
    this.updateProgress();
    this.updateTimeCode();
    this.checkForProgressCallback();
};


VideoComponent.prototype.updateTimeCode = function()
{
    if( !this.events[Constants.VIDEO_TIMECODE] ) return;
    this.sendVideoEvent( Constants.VIDEO_TIMECODE, formateTime( this.video.currentTime * 1000 ));
};


VideoComponent.prototype.checkForProgressCallback = function()
{
    if( !this.progressEventManager || !this.progressEventManager.getProgressList( this.currentVidVo.videoReportingID )) return;

    var eventList = this.progressEventManager.getProgressList( this.currentVidVo.videoReportingID );
    var obj;
    var checkTime;
    var length = eventList.length;

    for( var i = 0; i < length; i++ )
    {
        obj = eventList[ i ];
        checkTime = ( obj.fromEnd ) ? this.vidDuration - obj.time : obj.time;

        if( this.video.currentTime >= checkTime && checkTime != -1 && !obj.fired  )
        {
            obj.fired = true;
            obj.scope[obj.callback]( obj );
        }
    }
};


VideoComponent.prototype.startVideoTimer = function()
{
    if( !this.currentVidVo || !this.currentVidVo.videoReportingID ) return;

    if( this.isEngaged ) this.setEngaged();
    this.sendVideoEvent( Constants.VIDEO_TIMER_START, this.currentVidVo.videoReportingID );
};


VideoComponent.prototype.setEngaged = function( _isPaused )
{
    this.sendVideoEvent( Constants.VIDEO_ENGAGED_PLAYING );
    this.isEngaged = true;

    if( this.isEngagedTimerRunning || !this.isPlaying || _isPaused ) return;
    this.isEngagedTimerRunning = true;
    this.sendVideoEvent( Constants.VIDEO_ENGAGED_TIMER_START );
};


VideoComponent.prototype.stopVideoTimer = function()
{
    if( !this.currentVidVo || !this.currentVidVo.videoReportingID ) return;

    if( this.isEngaged && this.isEngagedTimerRunning ) this.sendVideoEvent( Constants.VIDEO_ENGAGED_TIMER_END );
    this.isEngagedTimerRunning = false;

    this.sendVideoEvent( Constants.VIDEO_TIMER_END, this.currentVidVo.videoReportingID );
};


VideoComponent.prototype.engagedVideoTracking = function( _event )
{
    if( !this.isEngaged ) return;

    switch( _event )
    {
        case Constants.VIDEO_PLAYING:
            this.sendVideoEvent( Constants.VIDEO_ENGAGED_PLAYING );
            break;

        case Constants.VIDEO_50_PERCENT:
            this.sendVideoEvent( Constants.VIDEO_ENGAGED_MIDPOINT );
            break;

        case Constants.VIDEO_COMPLETE:
            this.sendVideoEvent( Constants.VIDEO_ENGAGED_COMPLETE );
            break;
    }
};


VideoComponent.prototype.setListeners = function()
{
    console.log( "VIDEO COMP SET LISTENERS CALLED" );

    this.video.addEventListener( 'ended',           this.videoComplete,  false );
    this.video.addEventListener( 'volumechange',    this.audioUpdated,   false );
    this.video.addEventListener( 'error',           this.videoError,     false );
    this.video.addEventListener( 'loadedmetadata',  this.metaDataLoaded, false );
    this.video.addEventListener( 'play',            this.videoPlaying,   false );
    this.video.addEventListener( 'pause',           this.videoPaused,    false );
    this.video.addEventListener( 'canplay',         this.videoCanplay,   false );
    this.video.addEventListener( 'timeupdate',      this.timerUpdated,   false );
    this.video.addEventListener( 'waiting',         this.showBuffer,     false );
    this.video.addEventListener( 'progress',        this.updateLoad,     false );
};


VideoComponent.prototype.removeListeners = function()
{
    this.video.removeEventListener( 'ended',           this.videoComplete,  false );
    this.video.removeEventListener( 'volumechange',    this.audioUpdated,   false );
    this.video.removeEventListener( 'error',           this.videoError,     false );
    this.video.removeEventListener( 'loadedmetadata',  this.metaDataLoaded, false );
    this.video.removeEventListener( 'play',            this.videoPlaying,   false );
    this.video.removeEventListener( 'pause',           this.videoPaused,    false );
    this.video.removeEventListener( 'canplay',         this.videoCanplay,   false );
    this.video.removeEventListener( 'timeupdate',      this.timerUpdated,   false );
    this.video.removeEventListener( 'waiting',         this.showBuffer,     false );
    this.video.removeEventListener( 'progress',        this.updateLoad,     false );
};


function VideoVO()
{
    this.mmID = '';
    this.pathMP4 = '';
    this.pathWEBM = '';
    this.pathOGG = '';
    this.videoReportingID = '';
};


function VideoEventVO()
{
    this.event = '';
    this.scope = '';
    this.callback = '';
};