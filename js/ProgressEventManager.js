/** ProgressEventManager
 * -------------------------------------------------------------------------------------
 * @ description: acts as a mini model for video progress events.
 * @ developer: Neil Katz
 * @ version: 1.0.0  04.13.2014
 * -------------------------------------------------------------------------------------
 * */


function ProgressEventManager() {}


ProgressEventManager.prototype.progressEvents_obj = {};


ProgressEventManager.prototype.destroy = function()
{
	this.clearProgressEvents();
};


/**
 * add a percent value between 0 and 1 that fires a method when video reaches that point of the video.
 */
ProgressEventManager.prototype.addProgressEvent = function( scope, time, videoID, method, fromEnd )
{
	if( !time )
	{
		console.log( "ALARM!!! ADD PROGRESS EVENT MUST INCLUDE A VALID NUMBER BETWEEN 0 AND 1 OR TIME AS STRING" );
		return;
	}

	if( !videoID )
	{
		console.log( "ALARM!!! ADD PROGRESS EVENT MUST INCLUDE A VALID VIDEO REPORTING ID" );
		return;
	}

	if( method == null )
	{
		console.log( "ALARM!!! ADD PROGRESS EVENT MUST INCLUDE A VALID CALL BACK FUNCTION" );
		return;
	}

	if( !this.progressEvents_obj ) this.progressEvents_obj = {};
	if( !this.progressEvents_obj[videoID] ) this.progressEvents_obj[videoID] = [];

	var timePos = this.convertToSeconds( time );
	this.progressEvents_obj[videoID].push({ videoID:videoID, scope:scope, time:timePos, value:time, callback:method, fired:false, fromEnd:fromEnd });

	this.progressEvents_obj[videoID].sortByObjectProp( 'time' );
};


ProgressEventManager.prototype.convertToSeconds = function( _time )
{
	var timeArray;
	var minutes;
	var time;

	if( _time.indexOf( ":" ) == -1 )
	{
		time = Number( _time );
	}
	else
	{
		timeArray = _time.split( ":" );
		minutes = Number( timeArray[0] | 0 ) * 60;
		time = minutes + Number( timeArray[1] );
	}

	return time;
};


ProgressEventManager.prototype.getProgressList = function( _videoID )
{
	if( !this.progressEvents_obj || !this.progressEvents_obj[_videoID] || this.progressEvents_obj[_videoID].length == 0 ) return null;
	return this.progressEvents_obj[_videoID];
};


ProgressEventManager.prototype.clearProgressEvents = function()
{
	var eventList;
	var length;

	for ( eventList in this.progressEvents_obj )
	{
		length = eventList.length;

		for( var i = 0; i < length; i++ )
		{
			eventList[i] = null;
		}
	}

	this.progressEvents_obj = null;
};


ProgressEventManager.prototype.resetEvents = function()
{
	var eventList;
	var item;
	var length;

	for ( var index in this.progressEvents_obj )
	{
		eventList = this.progressEvents_obj[index];
		length = eventList.length;

		for( var i = 0; i < length; i++ )
		{
			item = eventList[i];
			if( item ) item.fired = false;
		}
	}
};
