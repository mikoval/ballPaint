function Player(z, color){
	this.direction = new THREE.Vector3( 0, 0, -1 );
	this.position = new THREE.Vector3(0, 1, 5);
	this.velocity = new THREE.Vector3(0, 0, 0);
	this.rotation = 0;
	this.speed = .2;
	this.changed = true;
	this.orientation =  new THREE.Quaternion();
	this.pathColor = 1;

	var geometry = new THREE.SphereGeometry(1, 16,16);
	
	 
	var material = new THREE.MeshPhongMaterial({map: playerTexture, overdraw: 0.5});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.y = this.position.x;
	mesh.position.y = this.position.y;
	mesh.position.z = this.position.z;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	this.obj = mesh;
	scene.add( this.obj );

	this.update= function(){
		var x = Math.random();
		if(x<.01){
			this.pathColor = Math.floor(Math.random()*3 ) + 1.0;
		}
		this.inputs()
		this.velocity.y -= 0.3;
		this.velocity.multiplyScalar(0.97)
		if(this.velocity.length() >8.0)
			this.velocity.normalize().multiplyScalar(8.0);

		this.position = this.position.add(this.velocity.clone().multiplyScalar(0.1));
		this.changed = true;
		var ret = {};
		if(this.position.y < 1){
			this.position.y = 1;
			this.velocity.y *= -0.6;
			ret.hit = true;
		}
		if(this.position.x > 24.25){
			this.position.x = 24.25;
			this.velocity.x *= -0.6;
			
		}
		if(this.position.x < -24.25){
			this.position.x = -24.25;
			this.velocity.x *= -0.6;
		}
		if(this.position.z < -24.25){
			this.position.z = -24.25;
			this.velocity.z *= -0.6;
		}
		if(this.position.z > 24.25){
			this.position.z = 24.25;
			this.velocity.z *= -0.6;
		}





		var mesh = this.obj;
		mesh.position.x = this.position.x;
		mesh.position.y = this.position.y;
		mesh.position.z = this.position.z;
		mesh.rotation.setFromQuaternion(this.orientation);

		return ret;
	}
	this.inputs= function(){
		if(input.up){
			this.changed = true;
			this.velocity = this.velocity.add(this.direction.clone().multiplyScalar ( this.speed ))

			var axis = new THREE.Vector3( 0, 1, 0 ).cross(this.direction);
			
			var quaternion = new THREE.Quaternion();
			quaternion.setFromAxisAngle(axis, 0.2);

			this.orientation = quaternion.multiply (this.orientation);
		}
		if(input.down){
			this.changed = true;
			this.velocity = this.velocity.add(this.direction.clone().multiplyScalar ( -this.speed ))

			var axis = new THREE.Vector3( 0, 1, 0 ).cross(this.direction);
			
			var quaternion = new THREE.Quaternion();
			quaternion.setFromAxisAngle(axis, -0.2);

			this.orientation = quaternion.multiply (this.orientation);


		}
		if(input.right){
			this.changed = true;
			var axis = new THREE.Vector3( 0, 1, 0 );
			var angle = -0.05;
			this.rotation -= angle;
			this.direction.applyAxisAngle( axis, angle );

		}
		if(input.left){
			this.changed = true;
			var axis = new THREE.Vector3( 0, 1, 0 );
			var angle = 0.05;
			this.rotation -= angle;
			this.direction.applyAxisAngle( axis, angle );
		}
		if(input.jump){
			if(this.position.y < 1.1 && this.velocity.y < 1.0) {
				console.log('jumping')
				this.velocity.y = 8;
			}
		}
	}
	
}
