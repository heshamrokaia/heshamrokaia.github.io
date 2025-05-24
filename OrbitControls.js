// Minimal OrbitControls replacement
// Provides basic orbiting with mouse drag and scroll zoom around the origin.
// MIT License
(function(){
  function SimpleOrbitControls(camera, domElement){
    this.camera = camera;
    this.domElement = domElement;
    this.enabled = true;
    this.target = new THREE.Vector3();
    this.isDragging = false;
    this.spherical = new THREE.Spherical();

    const offset = camera.position.clone().sub(this.target);
    this.spherical.setFromVector3(offset);

    domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    domElement.addEventListener('wheel', this.onMouseWheel.bind(this));
  }

  SimpleOrbitControls.prototype.onMouseDown = function(event){
    if(!this.enabled) return;
    this.isDragging = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    document.addEventListener('mousemove', this.onMouseMoveBind = this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUpBind = this.onMouseUp.bind(this));
  };

  SimpleOrbitControls.prototype.onMouseMove = function(event){
    if(!this.isDragging) return;
    const deltaX = event.clientX - this.lastX;
    const deltaY = event.clientY - this.lastY;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    const ROTATE_SPEED = 0.005;
    this.spherical.theta -= deltaX * ROTATE_SPEED;
    this.spherical.phi -= deltaY * ROTATE_SPEED;
    const EPS = 0.000001;
    this.spherical.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.spherical.phi));
    this.update();
  };

  SimpleOrbitControls.prototype.onMouseUp = function(){
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMoveBind);
    document.removeEventListener('mouseup', this.onMouseUpBind);
  };

  SimpleOrbitControls.prototype.onMouseWheel = function(event){
    if(!this.enabled) return;
    const ZOOM_SPEED = 0.1;
    this.spherical.radius *= (1 + (event.deltaY > 0 ? ZOOM_SPEED : -ZOOM_SPEED));
    this.spherical.radius = Math.max(0.1, this.spherical.radius);
    this.update();
  };

  SimpleOrbitControls.prototype.update = function(){
    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
  };

  window.THREE = window.THREE || {};
  THREE.OrbitControls = SimpleOrbitControls;
})();
