/**
 * Created by nkatz on 7/17/15.
 */

function MouseEventManager( target )
{
    this.debug = false;
    this.btnList = {};
    this.target = target;
    this.target.parent = this;
    this.setListeners();
};


MouseEventManager.eventTypes = {
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



MouseEventManager.prototype.addButton = function( _scope, _btnName, _click, _over, _out, _enter, _leave, _down, _up )
{
    if( !this.btnList ) this.btnList = {};
    this.btnList[_btnName] = { scope:_scope, click:_click, over:_over, out:_out, enter:_enter, leave:_leave, down:_down, up:_up };
};


MouseEventManager.prototype.addButtons = function( _scope, _btns, _click, _over, _out, _enter, _leave, _down, _up  )
{
    if( !_btns || _btns.length == 0 ) return;

    var btn;
    var length = _btns.length;

    for( var i = 0; i < length; i++ )
    {
        btn = _btns[i];
        if( !btn ) continue;

        this.addButton( _scope, btn, _click, _over, _out, _enter, _leave, _down, _up );
    }
};


MouseEventManager.prototype.removeButton = function( _id )
{
    delete this.btnList[_id];
};


MouseEventManager.prototype.removeButtons = function( _ids )
{
    if( !_ids || _ids.length == 0 ) return;

    var length = _ids.length;
    for( var i = 0; i < length; i++ )
    {
        this.removeButton( _ids[i] );
    }
};


MouseEventManager.prototype.outBtnEvent = function( e )
{
    e.preventDefault();

    if( this.parent.debug ) console.log( "\n\nMOUSE EVENT MANAGER ::: BTN OUT ::: " + e.target.id + "\n\n" );

    if( !this.parent.btnList ) return;

    if( this.parent.btnList[e.target.id] && this.parent.btnList[e.target.id].out )
    {
        this.parent.btnList[e.target.id].scope[this.parent.btnList[e.target.id].out]( e.target, e );
    }
};


MouseEventManager.prototype.overBtnEvent = function( e )
{
    e.preventDefault();

    if( this.parent.debug ) console.log( "\n\nMOUSE EVENT MANAGER ::: BTN OVER ::: " + e.target.id );

    if( !this.parent.btnList ) return;

    if( this.parent.btnList[e.target.id] && this.parent.btnList[e.target.id].over )
    {
        this.parent.btnList[e.target.id].scope[this.parent.btnList[e.target.id].over]( e.target, e );
    }
};


MouseEventManager.prototype.enterBtnEvent = function( e )
{
    e.preventDefault();

    if( this.parent.debug ) console.log( "\n\nMOUSE EVENT MANAGER ::: BTN ENTER ::: " + e.target.id );

    if( !this.parent.btnList ) return;

    if( this.parent.btnList[e.target.id] && this.parent.btnList[e.target.id].enter )
    {
        this.parent.btnList[e.target.id].scope[this.parent.btnList[e.target.id].enter]( e.target, e );
    }
};


MouseEventManager.prototype.leaveBtnEvent = function( e )
{
    e.preventDefault();

    if( this.parent.debug ) console.log( "\n\nMOUSE EVENT MANAGER ::: BTN LEAVE ::: " + e.target.id );

    if( !this.parent.btnList ) return;

    if( this.parent.btnList[e.target.id] && this.parent.btnList[e.target.id].leave )
    {
        this.parent.btnList[e.target.id].scope[this.parent.btnList[e.target.id].leave]( e.target, e );
    }
};


MouseEventManager.prototype.downBtnEvent = function( e )
{
    e.preventDefault();

    if( this.parent.debug ) console.log( "\n\nMOUSE EVENT MANAGER ::: BTN DOWN ::: " + e.target.id );

    if( !this.parent.btnList ) return;

    if( this.parent.btnList[e.target.id] && this.parent.btnList[e.target.id].down )
    {
        this.parent.btnList[e.target.id].scope[this.parent.btnList[e.target.id].down]( e.target, e );
    }
};


MouseEventManager.prototype.upBtnEvent = function( e )
{
    e.preventDefault();

    if( this.parent.debug ) console.log( "\n\nMOUSE EVENT MANAGER ::: BTN UP ::: " + e.target.id );

    if( !this.parent.btnList ) return;

    if( this.parent.btnList[e.target.id] && this.parent.btnList[e.target.id].up )
    {
        this.parent.btnList[e.target.id].scope[this.parent.btnList[e.target.id].up]( e.target, e );
    }
};


MouseEventManager.prototype.clickBtnEvent = function( e )
{
    e.preventDefault();

    if( this.parent.debug ) console.log( "\n\nMOUSE EVENT MANAGER ::: BTN CLICKED ::: ", e.target.id, "\n\n" );

    if( !this.parent.btnList ) return;

    if( this.parent.btnList[e.target.id] && this.parent.btnList[e.target.id].click )
    {
        this.parent.btnList[e.target.id].scope[this.parent.btnList[e.target.id].click]( e.target, e );
    }
};


MouseEventManager.prototype.setListeners = function()
{
    this.target.addEventListener( MouseEventManager.eventTypes.click,   this.clickBtnEvent, false );
    this.target.addEventListener( MouseEventManager.eventTypes.over,    this.overBtnEvent, false );
    this.target.addEventListener( MouseEventManager.eventTypes.out,     this.outBtnEvent, false );
    this.target.addEventListener( MouseEventManager.eventTypes.enter,   this.enterBtnEvent, false );
    this.target.addEventListener( MouseEventManager.eventTypes.leave,   this.leaveBtnEvent, false );
    this.target.addEventListener( MouseEventManager.eventTypes.down,    this.downBtnEvent, false );
    this.target.addEventListener( MouseEventManager.eventTypes.up,      this.upBtnEvent, false );
};


MouseEventManager.prototype.removeListeners = function()
{
    this.target.removeEventListener( MouseEventManager.eventTypes.click,    this.clickBtnEvent, false );
    this.target.removeEventListener( MouseEventManager.eventTypes.over,     this.overBtnEvent, false );
    this.target.removeEventListener( MouseEventManager.eventTypes.out,      this.outBtnEvent, false );
    this.target.removeEventListener( MouseEventManager.eventTypes.enter,    this.enterBtnEvent, false );
    this.target.removeEventListener( MouseEventManager.eventTypes.leave,    this.leaveBtnEvent, false );
    this.target.removeEventListener( MouseEventManager.eventTypes.down,     this.downBtnEvent, false );
    this.target.removeEventListener( MouseEventManager.eventTypes.up,       this.upBtnEvent, false );
};