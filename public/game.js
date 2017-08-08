function Game(scene, camera, res, pathsize){
	$(".choose-resolution").hide();
	this.scene = scene;
	this.camera = camera;
	this.floor = new Floor(res, pathsize, "bottom");
	this.left = new Floor(res, pathsize, "left");
	this.right = new Floor(res, pathsize, "right");
	this.front = new Floor(res, pathsize, "front");
	this.back = new Floor(res, pathsize, "back");
	this.player = new Player();
	this.objs = [];
	this.lights = []
	this.camera.position.x = this.player.position.x;
	this.camera.position.y = this.player.position.y;
	this.camera.position.z = this.player.position.z;
	this.camera.position.y += 10;
	this.camera.position.z += 20;

	this.update = function(){

		this.collisions();

		var val = this.player.update();
		for(var j = 0; j < val.length; j++){
				//this[val[j].side].addColor(val[j].x, val[j].y, this.player.pathColor)
				
				//this[val[j].side].addVelocity(val.x, val.y, this.player.velocity);
		}
		
		for(var i= 0 ; i < this.objs.length; i++){
			var val = this.objs[i].update();
			
			for(var j = 0; j < val.length; j++){
				this[val[j].side].addColor(val[j].x, val[j].y, this.objs[i].pathColor)
				//this[val[j].side].addVelocity(val[j].x, val[j].y, this.objs[i].velocity);
				this[val[j].side].update();
			}

		}
		if(this.player.changed){
			this.setCamera();
			this.player.changed = false;
		}
	}
	this.setCamera = function(){
		
			

		var position = new THREE.Vector3(0, 20, 30);
		var axis = new THREE.Vector3( 0, 1, 0 );
		var angle = -this.player.rotation;
		position.applyAxisAngle( axis, angle );
		position.add(this.player.position);
	
		camera.position.x = position.x;
		camera.position.y = position.y;
		camera.position.z = position.z;

			
		
		
		this.camera.lookAt(this.player.position); 
	}
	this.collisions = function(){
		var obj = this.player;
		for(var j = 0; j < this.objs.length; j++){
			var obj2 = this.objs[j];
			if(obj.position.distanceTo(obj2.position) < obj.radius + obj2.radius){
					var p1 = obj.position.clone();
					var p2 = obj2.position.clone();
					var n = p2.sub(p1).normalize();
					var v1 = obj.velocity.clone();
					var v2 = obj2.velocity.clone();
					
					var v3 = obj.position.clone();
					var v4 = obj2.position.clone();
					var p3 = obj.velocity.clone();
					var p4 = obj2.velocity.clone(); 
					
					var v =  v4.sub(v3);
					var d = p4.sub(p3);
			
					if(v.dot(d) >0)
						continue;
				

					
				
					var a1 = v1.dot(n);
					var a2 = v2.dot(n);
					var m1 =1;
					var m2 = 1
					var vel1 = v1.sub( n.multiplyScalar((a1- a2) *( 2 * m1 * m2) /(m1 + m2)* m2))
					var vel2 = v2.add( n.multiplyScalar((a1- a2) * (2 * m1 * m2) /(m1 + m2)* m1))
					obj.velocity = vel1;
					obj2.velocity = vel2;

			}
		}


		for(var i =0 ; i < this.objs.length; i++){
			var obj = this.objs[i];
			for(var j = i + 1; j < this.objs.length; j++){
				var obj2 = this.objs[j];
				if(obj.position.distanceTo(obj2.position) < obj.radius + obj2.radius){
					var p1 = obj.position.clone();
					var p2 = obj2.position.clone();
					var n = p2.sub(p1).normalize();
					var v1 = obj.velocity.clone();
					var v2 = obj2.velocity.clone();

					var v3 = obj.position.clone();
					var v4 = obj2.position.clone();
					var p3 = obj.velocity.clone();
					var p4 = obj2.velocity.clone(); 
					
					var v =  v4.sub(v3);
					var d = p4.sub(p3);
					
					if(v.dot(d) >=0)
						continue;
					
					

					var a1 = v1.dot(n);
					var a2 = v2.dot(n);
					var m1 = 1
					var m2 = 1
					var vel1 = v1.sub( n.multiplyScalar((a1- a2) * 2 * m1 * m2 /(m1 + m2)* m2))
					var vel2 = v2.add( n.multiplyScalar((a1- a2) * 2 * m1 * m2 /(m1 + m2)* m1))
					obj.velocity = vel1;
					obj2.velocity = vel2;
				}
			}
		}
	}
	
	
		/*var cubeGeo = new THREE.CubeGeometry( 51.3, 10, 0.5)
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
		*/


		// add the object to the scene
		
		var ball1 = new Ball(2,-5,0xFF0000);
		var ball2 = new Ball(15,2,0x00FF00);
		var ball3 = new Ball(-9,-8,0x0000FF);
		
	
		this.objs.push(ball1);
		this.objs.push(ball2);
		this.objs.push(ball3);



}
var input = {up:false, down:false, left:false, right:false};
$(document).keydown(function(e) {
    if(e.key == "w"|| e.key =="up"|| e.key == "ArrowUp"){
    	input.up = true;
    }
    if(e.key == "d"|| e.key =="right"|| e.key == "ArrowRight"){
    	input.right = true;
    }
    if(e.key == "a"|| e.key =="left"|| e.key == "ArrowLeft"){
    	input.left = true;
    }
    if(e.key == "s"|| e.key =="down"|| e.key == "ArrowDown"){
    	input.down = true;
    }
    if(e.key == " "){
    	input.jump = true;
    }
});
$(document).keyup(function(e) {
    if(e.key == "w"|| e.key =="up" || e.key == "ArrowUp"){
    	input.up = false;
    }
    if(e.key == "d"|| e.key =="right" || e.key == "ArrowRight"){
    	input.right = false;
    }
    if(e.key == "a"|| e.key =="left"|| e.key == "ArrowLeft"){
    	input.left = false;
    }
    if(e.key == "s"|| e.key =="down"|| e.key == "ArrowDown"){
    	input.down = false;
    }
    if(e.key == " "){
    	input.jump = false;
    }
});
function motion(event){

  	if(event.beta <-10){
  		input.up = true;
  		input.down = false;
  	}
  	else if(event.beta > 10){
  		input.up = false
  		input.down = true;
  	}
  	else{
  		input.up = false
  		input.down = false;
  	}
  	if(event.gamma > 10){
  		input.left = false;
  		input.right = true;
  	}
  	else if(event.gamma < -10){
  		input.left = true
  		input.right = false;
  	}
  	else{
  		input.left = false
  		input.right = false;
  	}

  
}


window.addEventListener('deviceorientation',motion);
window.addEventListener("devicemotion", function(){
	$(window).trigger("deviceorientation");
}, true);

