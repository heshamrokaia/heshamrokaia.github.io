class OrbitControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement || document;
    this.target = new THREE.Vector3();
    this.enableDamping = false;
    this.dampingFactor = 0.05;
    this.rotateSpeed = 1.0;

    this.spherical = new THREE.Spherical();
    this.spherical.setFromVector3(camera.position.clone().sub(this.target));

    this.rotateStart = new THREE.Vector2();
    this.rotateEnd = new THREE.Vector2();
    this.rotateDelta = new THREE.Vector2();

    this.state = 'none';

    this.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
  }

  onPointerDown(event) {
    if (event.isPrimary === false) return;
    this.state = 'rotate';
    this.rotateStart.set(event.clientX, event.clientY);
    document.addEventListener('pointermove', this.onPointerMoveBind = this.onPointerMove.bind(this));
    document.addEventListener('pointerup', this.onPointerUpBind = this.onPointerUp.bind(this));
  }

  onPointerMove(event) {
    if (this.state !== 'rotate') return;
    this.rotateEnd.set(event.clientX, event.clientY);
    this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).multiplyScalar(this.rotateSpeed / 200);

    this.spherical.theta -= this.rotateDelta.x;
    this.spherical.phi -= this.rotateDelta.y;
    const EPS = 0.000001;
    this.spherical.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.spherical.phi));

    this.updateCamera();
    this.rotateStart.copy(this.rotateEnd);
  }

  onPointerUp() {
    document.removeEventListener('pointermove', this.onPointerMoveBind);
    document.removeEventListener('pointerup', this.onPointerUpBind);
    this.state = 'none';
  }

  updateCamera() {
    const offset = new THREE.Vector3();
    offset.setFromSpherical(this.spherical);
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
  }

  update() {
    // basic damping
    if (this.enableDamping) {
      // not implemented; placeholder for compatibility
    }
  }
}

THREE.OrbitControls = OrbitControls;
