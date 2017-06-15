/**
 * Created by nkatz on 7/23/15.
 */


VRVideoComponent.inherits( VideoComponent );
function VRVideoComponent( _video )
{
    console.log( "VR VIDEO COMP CONST CALLED" );
    VideoComponent.apply( this, arguments );
}


VRVideoComponent.prototype.setValues = function( _videoTarget, _vidWidth, _vidHeight, _viewWidth, _viewHeight )
{
    THREE.ImageUtils.crossOrigin = '*';

    this.videoTarget    = _videoTarget;

    this.manualControl = false;
    this.longitude = 100;
    this.latitude = 0;
    this.savedX = 0;
    this.savedY = 0;
    this.savedLongitude = 0;
    this.savedLatitude = 0;

    this.videoWidth = _vidWidth;
    this.videoHeight = _vidHeight;

    this.viewWidth = _viewWidth;
    this.viewHeight = _viewHeight;

    this.videoTarget.addEventListener( "mousedown", createDelegate( this, this.onDocumentMouseDown ), false);
    this.videoTarget.addEventListener( "mousemove", createDelegate( this, this.onDocumentMouseMove ), false);
    document.addEventListener( "mouseup", createDelegate( this, this.onDocumentMouseUp ), false);

    this.setUpRender();
};


VRVideoComponent.prototype.destroy = function()
{

};


VRVideoComponent.prototype.setUpRender = function( _id )
{
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( this.viewWidth, this.viewHeight );
    this.videoTarget.appendChild( this.renderer.domElement );

    this.scene = new THREE.Scene();

    var cameraPosition = 1000;
    var vFOV_rad = 2 * Math.atan( this.viewHeight / ( 2 * cameraPosition ));
    var vFOV = Math.degrees( vFOV_rad );

    this.camera = new THREE.PerspectiveCamera( 60, this.viewWidth / this.viewHeight, 1, 1000 );
    this.camera.target = new THREE.Vector3( 0, 0, 0 );

    this.sphere = new THREE.SphereGeometry( 100, 100, 40 );
    this.sphere.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ));

    this.videoImage = document.createElement( 'canvas' );
    this.videoImage.width = this.videoWidth;
    this.videoImage.height = this.videoHeight;

    this.videoImageContext = this.videoImage.getContext( '2d' );

    this.videoTexture = new THREE.Texture( this.videoImage );
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;

    this.movieMaterial = new THREE.MeshBasicMaterial( { map:this.videoTexture, overdraw:true });

    this.sphereMesh = new THREE.Mesh( this.sphere, this.movieMaterial );
    this.scene.add( this.sphereMesh );
};


VRVideoComponent.prototype.addElement = function()
{
    //// adds element to div layer over video.
    //if( !this.elementDiv )
    //{
    //    this.elementDiv = document.createElement( 'div' );
    //    this.elementDiv.id = 'elementLayer';
    //    //this.elementDiv.style.width =
    //    //this.elementDiv.style.height =
    //    //this.videoTarget.
    //}
	//
    //var xPos = 860;
    //var yPos = 460;
    //var element = "<div id='element' class='circle' ></div>";
	//
    //// Adds element to sphere.
    //this.hotSpot = new THREE.Object3D();
    ////sprite.position.set( 0, 0, 0 );
	//
    ////var meshMaterial = new THREE.Mesh( movieGeometry, movieMaterial );
    ////meshMaterial.position.set(0, 0, 0);
	//
    //var square = new THREE.PlaneGeometry( 100, 100, 4, 4 );
    //var sphereGeometry = new THREE.SphereGeometry( 5, 20, 20 );
    //var meshMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
    //var mesh = new THREE.Mesh( sphereGeometry, meshMaterial );
	//
    //// position the sphere
    //this.hotSpot.position.x = 0;
    //this.hotSpot.position.y = 0;
    //this.hotSpot.position.z = -100;
	//
    ////sprite.add
    //this.hotSpot.add( mesh );
    //this.scene.add( this.hotSpot );
    //this.camera.lookAt( this.hotSpot.position );
};


VRVideoComponent.prototype.isVisible = function( _ele )
{
    //var frustum = new THREE.Frustum();
    //var cameraViewProjectionMatrix = new THREE.Matrix4();
	//
    //this.camera.updateMatrixWorld();
    //this.camera.matrixWorldInverse.getInverse( this.camera.matrixWorld );
	//
    //cameraViewProjectionMatrix.multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse );
    //frustum.setFromMatrix( cameraViewProjectionMatrix );
	//
    //console.log( frustum.intersectsObject( _ele ) );
};


// OVER RIDE :: from VideoComponent
VRVideoComponent.prototype.videoPlaying = function( e )
{
    if( !this.vidComp ) return;
    this.vidComp.startProcess();
    console.log( "VR COMP VIDEO PLAYING CALLED" );
    this.vidComp.super.videoPlaying.call( this );
};


// OVER RIDE :: from VideoComponent
VRVideoComponent.prototype.videoPaused = function( e )
{
    if( !this.vidComp ) return;
    this.vidComp.stopProcess();
    console.log( "VR COMP VIDEO PAUSED CALLED" );
    this.vidComp.super.videoPaused.call( this );
};


// OVER RIDE :: from VideoComponent
VRVideoComponent.prototype.videoComplete = function( e )
{
    if( !this.vidComp ) return;
    this.vidComp.stopProcess();
    console.log( "VR COMP VIDEO COMPLETE CALLED" );
    this.vidComp.super.videoComplete.call( this );
};


VRVideoComponent.prototype.onDocumentMouseDown = function( event )
{
    event.preventDefault();

    this.manualControl = true;

    this.savedX = event.clientX;
    this.savedY = event.clientY;

    this.savedLongitude = this.longitude;
    this.savedLatitude = this.latitude;
};


// when the mouse moves, if in manual control we adjust coordinates
VRVideoComponent.prototype.onDocumentMouseMove = function( event )
{
    if( this.manualControl )
    {
        this.longitude = ( this.savedX - event.clientX ) * 0.1 + this.savedLongitude;
        this.latitude = ( event.clientY - this.savedY ) * 0.1 + this.savedLatitude;
    }
};


// when the mouse is released, we turn manual control off
VRVideoComponent.prototype.onDocumentMouseUp = function( event )
{
    this.manualControl = false;
};


VRVideoComponent.prototype.startProcess = function()
{
    this.animationFrame = new AnimationFrameUtil();
    this.animationFrame.setAnimation( this, 60, 'processFrame' );
    this.animationFrame.startAnimation();
};


VRVideoComponent.prototype.stopProcess = function()
{
    //this.animationFrame.stopAnimation();
};


VRVideoComponent.prototype.processFrame = function( data )
{
    var targetX = 10 * Math.sin( THREE.Math.degToRad( 90 - this.latitude )) * Math.cos( THREE.Math.degToRad( this.longitude ));
    var targetY = 10 * Math.cos( THREE.Math.degToRad( 90 - this.latitude ));
    var targetZ = 10 * Math.sin( THREE.Math.degToRad( 90 - this.latitude )) * Math.sin( THREE.Math.degToRad( this.longitude ));

    TweenLite.to( this.camera.target, .5, { x:targetX, y:targetY, z:targetZ });
    this.camera.lookAt( this.camera.target );

    this.videoImageContext.clearRect( 0, 0, this.videoWidth, this.videoHeight );
    this.videoImageContext.drawImage( this.video, 0, 0 );
    this.videoTexture.needsUpdate = true;

    this.renderer.render( this.scene, this.camera );
};


// Converts from degrees to radians.
Math.radians = function(degrees)
{
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians)
{
    return radians * 180 / Math.PI;
};