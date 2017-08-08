function Player(z, color){
	this.direction = new THREE.Vector3( 0, 0, -1 );
	this.position = new THREE.Vector3(0, 1, 5);
	this.velocity = new THREE.Vector3(0, 0, 0);
	this.rotation = 0;
	this.speed = .4;
	this.changed = true;
	this.orientation =  new THREE.Quaternion();
	this.pathColor = 1;
	this.radius = 1;

	this.time = Date.now();

	var geometry = new THREE.SphereGeometry(this.radius, 128,128);
	
	 
	var material = new THREE.MeshPhongMaterial({map: playerTextureColor,transparent: false, normalMap:playerTextureNormal, specularMap: playerTextureSpecular, reflectionMap: playerTextureReflection, overdraw: 0.5});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.y = this.position.x;
	mesh.position.y = this.position.y;
	mesh.position.z = this.position.z;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	this.obj = mesh;
	scene.add( this.obj );

	this.update= function(){
		var dt = (Date.now() - this.time) / 200;
		this.time = Date.now();

		var x = Math.random();
		if(x<.03){
			this.pathColor = Math.floor(Math.random()*3 ) + 1.0;
		}
		this.inputs(dt);
		this.velocity.y -= 0.3;
		this.velocity.multiplyScalar(0.95)
		if(this.velocity.length() >8.0)
			this.velocity.normalize().multiplyScalar(8.0);

		
		this.position = this.position.add(this.velocity.clone().multiplyScalar( dt ));
		this.changed = true;
		var ret = [];
		if(this.position.y < 1){
			this.position.y = 1;
			this.velocity.y *= -0.6;
			ret.push({hit:true,side: "floor",  x:this.position.x, y:this.position.y})

		}
		if(this.position.x > 24.25){
			this.position.x = 24.25;
			this.velocity.x *= -0.6;
			ret.push({hit:true,side: "left",  x:25-this.position.y, y:-this.position.z})
			
		}
		if(this.position.x < -24.25){
			this.position.x = -24.25;
			this.velocity.x *= -0.6;
			ret.push({hit:true,side: "right",  x:-25 + this.position.y, y:-this.position.z})
		}
		if(this.position.z < -24.25){
			this.position.z = -24.25;
			this.velocity.z *= -0.6;
			ret.push({hit:true,side: "back" , x:-this.position.x, y:-25  + this.position.y })
		}
		if(this.position.z > 24.25){
			this.position.z = 24.25;
			this.velocity.z *= -0.6;
			ret.push({hit:true,side: "front" , x:-this.position.x, y:25 -this.position.y})
		}


		if(Math.abs(this.velocity.x)<0.003){this.velocity.x = 0;}
		if(Math.abs(this.velocity.z)<0.003){this.velocity.z = 0;}


		var mesh = this.obj;
		mesh.position.x = this.position.x;
		mesh.position.y = this.position.y;
		mesh.position.z = this.position.z;
		mesh.rotation.setFromQuaternion(this.orientation);

		return ret;
	}
	this.inputs= function(dt){
		if(input.up){
			this.changed = true;
			this.velocity = this.velocity.add(this.direction.clone().multiplyScalar ( this.speed ))

			var axis = new THREE.Vector3( 0, 1, 0 ).cross(this.direction);
			
			var quaternion = new THREE.Quaternion();
			quaternion.setFromAxisAngle(axis, dt*2);

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
