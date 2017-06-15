

AnimationFrameUtil = function() {};

AnimationFrameUtil.prototype.animation = {};
AnimationFrameUtil.prototype.updateDelegate = null;
AnimationFrameUtil.prototype.isPlaying = false;
AnimationFrameUtil.prototype.isStopped = false;


AnimationFrameUtil.prototype.setAnimation = function( _scope, _fps, _update, _complete, _duration )
{
    this.animation              = new AnimationFrameUtil.AnimationVO();
    this.animation.scope        = _scope;
    this.animation.fps          = _fps;
    this.animation.frameTime    = 1000 / _fps;
    this.animation.update       = _update;
    this.animation.complete     = _complete;
    this.animation.duration     = _duration || -1;
    this.animation.then         = 0;
    this.animation.currentTime  = 0;

    this.updateDelegate = createDelegate( this, this.updateAnimation );
};


AnimationFrameUtil.prototype.startAnimation = function()
{
    if( !this.animation ) return;

    this.isPlaying = true;
    this.isStopped = false;
    this.animation.then = Date.now();
    requestAnimFrame( this.updateDelegate, this );
};


AnimationFrameUtil.prototype.stopAnimation = function()
{
    this.isPlaying = false;
    this.isStopped = true;
};


AnimationFrameUtil.prototype.pauseAnimation = function()
{
    this.isPlaying = false;
};


AnimationFrameUtil.prototype.resumeAnimation = function()
{
    this.isPlaying = true;
};


AnimationFrameUtil.prototype.removeAnimation = function()
{
    this.isPlaying = false;
    this.animation = null;
    this.updateDelegate = null;
};


AnimationFrameUtil.prototype.animationComplete = function()
{
    this.isPlaying = false;
    if( this.animation.complete ) this.animation.scope[this.animation.complete]();
};


AnimationFrameUtil.prototype.updateAnimation = function()
{
    if( !this.isPlaying ) return;

    // checks for complete
    if( this.animation.duration !== -1 && this.animation.currentTime >= this.animation.duration )
    {
        this.animationComplete();
        return;
    }

    var now = Date.now();
    var elapsed = now - this.animation.then;

    if( elapsed >= this.animation.frameTime )
    {
        this.animation.currentTime += ( this.animation.frameTime / 1000);
        if( this.animation.update ) this.animation.scope[this.animation.update]();
        this.animation.then = Date.now();
    }

    if( this.isStopped ) this.removeAnimation();
    else requestAnimFrame( this.updateDelegate, this );
};


AnimationFrameUtil.AnimationVO = function()
{
    this.scope      = null;
    this.fps        = 0;
    this.duration   = 0;
    this.update     = null;
    this.complete   = null;
};


window.requestAnimFrame = (function()
{
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback, element )
        {
            window.setTimeout(callback, 1000 / 60);
        };
})();