/**
 * Created by nkatz on 7/24/15.
 */


var Constants = {};

// tracking event strings
Constants.TRACKING_EXIT_CLICKED       = "exitClicked";
Constants.TRACKING_EXIT_FIRED         = "exitFired";
Constants.TRACKING_FIRE_EXIT          = "fireExit";
Constants.TRACKING_DYNAMIC_EXIT       = "dynamicExit";
Constants.TRACKING_TRACK_COUNTER      = "trackCounter";
Constants.TRACKING_TIMER_START        = "timerStart";
Constants.TRACKING_TIMER_STOP         = "timerStop";
Constants.TRACKING_STOP_ALL_TIMERS    = "stopAllTimers";
Constants.TRACKING_COLLAPSE_UNIT      = "collapseUnit";
Constants.TRACKING_CLOSE_UNIT         = "closeUnit";
Constants.TRACKING_EXPAND_UNIT        = "expandUnit";
Constants.TRACKING_START_EXPANDED     = "startExpanded";

// video event strings
Constants.VIDEO_PROGRESS			  = "progress";
Constants.VIDEO_UNMUTED			      = "unmuted";
Constants.VIDEO_MUTED			      = "muted";
Constants.VIDEO_ERROR				  = "error";
Constants.VIDEO_STOPPED			      = "stopped";
Constants.VIDEO_COMPLETE			  = "complete";
Constants.VIDEO_LOOP_COMPLETE		  = "loop complete";
Constants.VIDEO_STARTED			      = "started";
Constants.VIDEO_CLEARED			      = "cleared";
Constants.VIDEO_PAUSED			      = "paused";
Constants.VIDEO_PLAYING               = "playing";
Constants.VIDEO_RESUMED			      = "resumed";
Constants.VIDEO_BUFFER_EMPTY		  = "buffer empty";
Constants.VIDEO_BUFFER_FULL		      = "buffer full";
Constants.VIDEO_SHOW_BUFFER		      = "show buffer";
Constants.VIDEO_HIDE_BUFFER		      = "hide buffer";
Constants.VIDEO_READY				  = "ready";
Constants.VIDEO_LOADED                = "loaded";
Constants.VIDEO_ON_CUEPOINT   	      = "cue point";
Constants.UPDATE_VIDEO_ID		      = "update video id";
Constants.VIDEO_UPDATED		          = "updated";
Constants.VIDEO_REPLAYING		      = "replaying";
Constants.VIDEO_TIMECODE		      = "timecode";

Constants.VIDEO_LOAD_PROGRESS		  = "videoLoadProgress";

Constants.VIDEO_0_PERCENT             = "video 0% complete";
Constants.VIDEO_25_PERCENT            = "video 25% complete";
Constants.VIDEO_50_PERCENT            = "video 50% complete";
Constants.VIDEO_75_PERCENT            = "video 75% complete";
Constants.VIDEO_100_PERCENT           = "video 100% complete";

Constants.SHOW_BUFFERING 			  = "showBuffering";
Constants.HIDE_BUFFERING 			  = "hideBuffering";

// controls events
Constants.MUTE_VIDEO  			      = "muteVideo";
Constants.UNMUTE_VIDEO  			  = "unmuteVideo";

Constants.PLAY_VIDEO  			      = "playVideo";
Constants.PAUSE_VIDEO  			      = "pauseVideo";

Constants.SEEK_VIDEO                  = "seekVideo";
Constants.STOP_VIDEO                  = "stopVideo";

Constants.VIDEO_FULLSCREEN_OPENED     = "fullScreenOpened";
Constants.VIDEO_FULLSCREEN_CLOSED     = "fullScreenClosed";

Constants.PLAY_WITH_SOUND_CALLED      = "playWithSoundCalled";

Constants.VIDEO_ENGAGED_PLAYING       = "videoEngagedPlaying";
Constants.VIDEO_ENGAGED_COMPLETE      = "videoEngagedComplete";
Constants.VIDEO_ENGAGED_MIDPOINT      = "videoEngagedMidpoint";

Constants.VIDEO_TIMER_START           = "videoTimerStart";
Constants.VIDEO_TIMER_END             = "videoTimerEnd";

Constants.VIDEO_ENGAGED_TIMER_START   = "videoEngagedTimerStart";
Constants.VIDEO_ENGAGED_TIMER_END     = "videoEngagedTimerEnd";

Constants.REPLAY_SELECTED             = "replay";
Constants.REPLAY_WITH_SOUND_SELECTED  = "replayWithSound";
Constants.SHOW_FULLSCREEN             = "showFullscreen";

Constants.GLOBAL_CLICK                = "globalClick";
Constants.GLOBAL_OVER                 = "globalOver";
Constants.GLOBAL_OUT                  = "globalOut";

Constants.mouseEvents = {
    tap:"touchstart",
    click:"click",
    over:"mouseover",
    out:"mouseout",
    enter:"mouseenter",
    leave:"mouseleave",
    move:"mousemove",
    down:"mousedown",
    up:"mouseup"
};