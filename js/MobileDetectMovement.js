/**
 * Created by nkatz on 5/3/16.
 */
function MobileDetectMovement()
{
	var x = 0;
	var y = 0;
	var z = 0;

	var alpha = 0;
	var beta = 0;
	var gamma = 0;

	var propList = {};
	var listenersSet = false;

	this.addPropListener = function( _scope, _callback )
	{
		if( !propList ) propList = {};

		propList.scope = _scope;
		propList.callback = _callback;

		setListeners();
	};

	function setListeners()
	{
		if( listenersSet ) return;
		listenersSet = true;

		if( window.DeviceMotionEvent == undefined )
		{
			console.log( "DEVICE MOTION EVENTS NOT SUPPORTED ON THIS DEVICE" );
			return;
		}

		window.ondevicemotion = motionEventHandler;
	}

	function motionEventHandler( e )
	{
		x = e.accelerationIncludingGravity.x;
		y = e.accelerationIncludingGravity.y;
		z = e.accelerationIncludingGravity.z;

		if( e.rotationRate )
		{
			alpha = e.rotationRate.alpha;
			beta = e.rotationRate.beta;
			gamma = e.rotationRate.gamma;
		}

		//console.log( "" );
		//console.log( "" );
		//console.log( "MOTIION EVENT FIRED X: " + x );
		//console.log( "MOTIION EVENT FIRED Y: " + y );
		//console.log( "MOTIION EVENT FIRED Z: " + z );
		//
		//console.log( "MOTIION EVENT FIRED ALPHA: " + alpha );
		//console.log( "MOTIION EVENT FIRED BETA: " + beta );
		//console.log( "MOTIION EVENT FIRED GAMMA: " + gamma );
		//console.log( "" );
		//console.log( "" );

		fireCallback();
	}

	function fireCallback()
	{
		var scope  = propList.scope;
		var callback = propList.callback;
		var returnObj = {};

		if( !scope || !callback )
		{
			console.log( "ERROR :: NO SCOPE OR CALLBACK VALUE PASSED" );
		}

		returnObj.x = x;
		returnObj.y = y;
		returnObj.z = z;

		returnObj.alpha = alpha;
		returnObj.beta = beta;
		returnObj.gamma = gamma;

		scope[callback]( returnObj );
	}
}