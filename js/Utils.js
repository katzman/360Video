function createDelegate(object, method)
{
    var shim = function()
    {
        return method.apply(object, arguments);
    };

    return shim;
}


function hasClass( ele, cls )
{
    return !!ele.className.match( new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}


function addClass(ele,cls)
{
    if( !hasClass(ele,cls)) ele.className += " " + cls;
}


function removeClass( ele, cls )
{
    if( hasClass( ele, cls ) )
    {
        var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
        ele.className = ele.className.replace( reg,' ' );
    }
}


function whichAnimationEvent()
{
    var t;
    var el = document.createElement("fakeelement");

    var animations = {
        "animation"      : "animationend",
        "OAnimation"     : "oAnimationEnd",
        "MozAnimation"   : "animationend",
        "WebkitAnimation": "webkitAnimationEnd"
    };

    for ( t in animations )
    {
        if ( el.style[t] !== undefined )
        {
            return animations[t];
        }
    }
}


function whichTransitionEvent()
{
    var t;
    var el = document.createElement("fakeelement");

    var transitions = {
        "transition"      : "transitionend",
        "OTransition"     : "oTransitionEnd",
        "MozTransition"   : "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
    };

    for( t in transitions )
    {
        if ( el.style[t] !== undefined )
        {
            return transitions[t];
        }
    }
}


String.prototype.compare = function(x)
{
    if( !x.charCodeAt ) return -1;

    var result = this.charCodeAt(0) - x.charCodeAt(0);
    if( !result ) return this.substr(1).compare( x.substr(1) );

    return result;
};


Array.prototype.sortByObjectProp = function( prop, reverse )
{
    var sorter = function( a, b )
    {
        var aa = a[prop];
        var bb = b[prop];

        if( aa + 0 == aa && bb + 0 == bb ) return aa - bb; // checks if number
        else if( aa.compare ) return aa.compare( bb ); // aa-bb does not work

        return 0;
    };

    this.sort( function( a, b )
    {
        var result = sorter( a, b );
        if( reverse ) result *= -1;
        return result;
    });
};


Function.prototype.inherits = function( parent )
{
    this.prototype = Object.create( parent.prototype );
    //this.prototype.constructor = parent;
    this.prototype.super = parent.prototype;
};


function isInViewport( _element )
{
    var rect;
    rect = _element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= ( window.innerHeight || document.documentElement.clientHeight ) &&
        rect.right <= ( window.innerWidth || document.documentElement.clientWidth )
    );
}


function formateTime( duration )
{
    var milliseconds = parseInt(( duration % 1000 ) / 100 );
    var seconds = parseInt(( duration / 1000 ) % 60 );
    var minutes = parseInt(( duration / ( 1000 * 60 )) % 60 );
    var hours = parseInt(( duration / ( 1000 * 60 * 60 )) % 24 );

    hours = ( hours < 10 ) ? "0" + hours : hours;
    minutes = ( minutes < 10 ) ? "0" + minutes : minutes;
    seconds = ( seconds < 10 ) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}


function addSVGByID( _element, _id )
{
    if( !_id || !_element ) return;

    var target = document.getElementById( _element );
    target.style.pointerEvents = 'none';
    target.innerHTML = _id;
}


function addSVGByClass( _class, _id )
{
    if( !_id || !_class ) return;

    var targets = document.getElementsByClassName( _class );
    if( !targets ) return;

    var length = targets.length;
    if( length == undefined || length < 1 ) return;

    var element;

    for( var i = 0; i < length; i++ )
    {
        element = targets[i];
        if( !element ) continue;

        element.style.pointerEvents = 'none';
        element.innerHTML = _id;
    }
}


function setBackgroundImageByClassName( _class, _imagePath )
{
    var element;
    var sprites = document.getElementsByClassName( _class );
    for( var index in sprites )
    {
        element = sprites[index];
        if( !element || !element.style ) continue;
        element.style.backgroundImage = "url("+ _imagePath +")";
    }
}