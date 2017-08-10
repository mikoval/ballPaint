function CubeSoft(x, z, color){

	this.direction = new THREE.Vector3( 0, 0, -1 );
	this.position = new THREE.Vector3(x, 3.0, z);
	this.velocity = new THREE.Vector3(0, 0, 0);
	this.rotation = 0;
	this.orientation =  new THREE.Quaternion();
	this.radius = 4;
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
	

	var geometry = new THREE.BoxGeometry(this.radius*1.5, this.radius*1.5, this.radius*1.5,4, 4,4);

	geometry.dynamic = true;

	var vertices = geometry.vertices;
	var faces = geometry.faces;
	this.verlet = new verletCubeFromMesh(x, 10, z, vertices, faces, 32,32);

	var material;
	if(color == 0xFF0000) {
		console.log("red");
		material = new THREE.MeshPhongMaterial({map:redTextureColor, normalMap: redTextureNormal, specularMap: redTextureSpecular, overdraw: 0.5});
	}
	if(color == 0x00FF00) {
		material = new THREE.MeshPhongMaterial({map:greenTextureColor, normalMap: greenTextureNormal,specularMap: greenTextureSpecular, overdraw: 0.5});
	}
	if(color == 0x0000FF) {
		material = new THREE.MeshPhongMaterial({map:blueTextureColor, normalMap: blueTextureNormal,specularMap: blueTextureSpecular, overdraw: 0.5});
	}
	material.side = THREE.DoubleSide;
	var mesh = new THREE.Mesh(geometry, material);
	mesh.frustumCulled = false;
	mesh.castShadow = true;
	//mesh.receiveShadow = true;
	
	this.obj = mesh;
	scene.add( this.obj );

	this.update= function(position, objs){
		

		var hits = this.verlet.update(position, objs);

		for(var i= 0; i < this.verlet.points.length; i++){

			this.obj.geometry.vertices[i].x = this.verlet.points[i].x;
			this.obj.geometry.vertices[i].y = this.verlet.points[i].y;
			this.obj.geometry.vertices[i].z = this.verlet.points[i].z;
			//this.obj.geometry.computeFlatVertexNormals ()
			this.obj.geometry.computeVertexNormals();
			this.obj.geometry.verticesNeedUpdate = true;
			this.obj.geometry.normalsNeedUpdate = true;



		}


		return hits;


	}
	
	
}
