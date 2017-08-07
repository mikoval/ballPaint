function Game(scene, camera){
	this.scene = scene;
	this.camera = camera;
	this.floor = new Floor();
	this.player = new Player();
	this.objs = [];
	this.lights = []
	this.camera.position.x = this.player.position.x;
	this.camera.position.y = this.player.position.y;
	this.camera.position.z = this.player.position.z;
	this.camera.position.y += 5;
	this.camera.position.z += 10;

	this.update = function(){

		var val = this.player.update();
		if(val.hit){
			this.floor.addColor(this.player.position.x, this.player.position.z, this.player.pathColor)
		}
		this.floor.update();
		if(this.player.changed){
			this.setCamera();
			this.player.changed = false;
		}
	}
	this.setCamera = function(){
		
			

		var position = new THREE.Vector3(0, 10, 15);
		var axis = new THREE.Vector3( 0, 1, 0 );
		var angle = -this.player.rotation;
		position.applyAxisAngle( axis, angle );
		position.add(this.player.position);
		camera.position.x = position.x;
		camera.position.y = position.y;
		camera.position.z = position.z;

			
		
		
		this.camera.lookAt(this.player.position); 
	}
	
	
		var cubeGeo = new THREE.CubeGeometry( 51.3, 10, 0.5)
		var cubeMat = new THREE.MeshPhongMaterial({color: 0xffffff})
		cube = new THREE.Mesh(cubeGeo,  cubeMat);
		cube.position.z= 25.5;
		cube.receiveShadow = true;
		scene.add( cube );
		cube = new THREE.Mesh(cubeGeo, cubeMat );
		cube.position.z= -25.5;
		cube.receiveShadow = true;
		scene.add( cube );

		cube = new THREE.Mesh(cubeGeo,  cubeMat);
		cube.rotateY(3.14/2);
		cube.position.x= 25.5;
		cube.receiveShadow = true;
		scene.add( cube );
		cube = new THREE.Mesh(cubeGeo, cubeMat );
		cube.rotateY(3.14/2);
		cube.position.x= -25.5;
		cube.receiveShadow = true;
		scene.add( cube );


		// add the object to the scene
		
	

}
var input = {up:false, down:false, left:false, right:false};
$(document).keypress(function(e) {
    if(e.key == "w"|| e.key =="up"){
    	input.up = true;
    }
    if(e.key == "d"|| e.key =="right"){
    	input.right = true;
    }
    if(e.key == "a"|| e.key =="left"){
    	input.left = true;
    }
    if(e.key == "s"|| e.key =="down"){
    	input.down = true;
    }
    if(e.key == " "){
    	input.jump = true;
    }
});
$(document).keyup(function(e) {
    if(e.key == "w"|| e.key =="up"){
    	input.up = false;
    }
    if(e.key == "d"|| e.key =="right"){
    	input.right = false;
    }
    if(e.key == "a"|| e.key =="left"){
    	input.left = false;
    }
    if(e.key == "s"|| e.key =="down"){
    	input.down = false;
    }
    if(e.key == " "){
    	input.jump = false;
    }
});