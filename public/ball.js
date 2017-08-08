function Ball(x, z, color){
	this.direction = new THREE.Vector3( 0, 0, -1 );
	this.position = new THREE.Vector3(x, 3.0, z);
	this.velocity = new THREE.Vector3(0, 0, 0);
	this.rotation = 0;
	this.orientation =  new THREE.Quaternion();
	this.radius = 3;
	this.time = Date.now();
	if(color == 0xFF0000){
		this.pathColor = 1;
	}
	if(color == 0x00FF00){
		this.pathColor = 2;
	}
	if(color == 0x0000FF){
		this.pathColor = 3;
	}
	

	var geometry = new THREE.SphereGeometry(this.radius, 32,32);
	
	var material;
	if(color == 0xFF0000) {
		console.log("red");
		material = new THREE.MeshPhongMaterial({map:redTextureColor, normalMap: redTextureNormal, overdraw: 0.5});
	}
	if(color == 0x00FF00) {
		material = new THREE.MeshPhongMaterial({map:greenTextureColor, normalMap: greenTextureNormal, overdraw: 0.5});
	}
	if(color == 0x0000FF) {
		material = new THREE.MeshPhongMaterial({map:blueTextureColor, normalMap: blueTextureNormal, overdraw: 0.5});
	}
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.x = this.position.x;
	mesh.position.y = this.position.y;
	mesh.position.z = this.position.z;
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	this.obj = mesh;
	scene.add( this.obj );

	this.update= function(){
		var dt = (Date.now() - this.time) / 200;
		this.time = Date.now();
		this.velocity.y -= 0.3;
		this.velocity.multiplyScalar(0.99)
		if(this.velocity.length() >16.0)
			this.velocity.normalize().multiplyScalar(16.0);

		this.position = this.position.add(this.velocity.clone().multiplyScalar(0.1));
		this.changed = true;
		var ret = [];
		if(this.position.y < 3){
			this.position.y = 3;
			this.velocity.y *= -0.6;
			ret.push({hit:true,side: "floor",  x:this.position.x, y:this.position.z})
		
		}
		if(this.position.x > 22.25){
			this.position.x = 22.25;
			this.velocity.x *= -0.6;
			ret.push({hit:true,side: "left",  x:25-this.position.y, y:-this.position.z})
			
		}
		if(this.position.x < -22.25){
			this.position.x = -22.25;
			this.velocity.x *= -0.6;
			ret.push({hit:true,side: "right",  x:-25 + this.position.y, y:-this.position.z})
		}
		if(this.position.z < -22.25){
			this.position.z = -22.25;
			this.velocity.z *= -0.6;
			ret.push({hit:true,side: "back" , x:-this.position.x, y:-25  + this.position.y })
		}
		if(this.position.z > 22.25){
			this.position.z = 22.25;
			this.velocity.z *= -0.6;
			ret.push({hit:true,side: "front" , x:-this.position.x, y:25 -this.position.y})
		}
		if(Math.abs(this.velocity.x) < 0.01)this.velocity.x = 0;
		if(Math.abs(this.velocity.z) < 0.01)this.velocity.z = 0;

		var dir = this.velocity.clone().normalize();

		dir.y = 0;
		var axis = new THREE.Vector3( 0, 1, 0 ).cross(dir).normalize();
		
			
		var quaternion = new THREE.Quaternion();
		var v = this.velocity.clone()
		var rot =  Math.pow((v.x * v.x + v.z * v.z),1.7)
		//console.log(rot);
		//if(rot > 0.5)rot = 0.1;
		//if(rot < 0.0012) rot = 0;
		quaternion.setFromAxisAngle(axis,rot * dt );

		this.orientation = quaternion.multiply (this.orientation);

		


		var mesh = this.obj;
		mesh.position.x = this.position.x;
		mesh.position.y = this.position.y;
		mesh.position.z = this.position.z;
		mesh.rotation.setFromQuaternion(this.orientation);

		return ret;


	}
	
	
}
