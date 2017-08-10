var damping = 1.0;
var accuracy = 3;

function verletObj(points, springs){
	this.type = "obj";
	this.points = points;
	this.springs = springs;

	this.update = function(position, objs){
		
		this.updatePosition();
		this.setCenter();
		var arr = []
		for(var i = 0 ; i < accuracy;i++){
			this.updateSprings();

			var hits = this.constrain(position);

			for(var j = 0; j< hits.length; j++){
				arr.push(hits[j]);
			}
			this.rigidForce(position, objs);
			
		}
		
		return arr;
		
		
	}
	this.updatePosition = function(){
		for(var i = 0; i < this.points.length; i++){
			this.points[i].update();
		}

	}
	this.updateSprings = function(){
		for(var i = 0; i < this.springs.length; i++){
			this.springs[i].update();
		}
	}
	this.constrain = function(position){

		var arr = []
		for(var i = 0; i < this.points.length; i++){
			var hits = this.points[i].constrain(position);
			
			for(var j = 0; j < hits.length; j++){

				arr.push(hits[j]);
			}
		}
		return arr;
	}
	this.rigidForce = function(position, objs){
		
		var obj = {x:this.cx, y:this.cy, z:this.cz};
		var dist = distance3D(obj, position);
		if(dist < 4.3){
			var dx  = position.x - obj.x;
			var dy  = position.y - obj.y;
			var dz  = position.z - obj.z;
			for(var i = 0; i < this.points.length; i++){
				this.points[i].x -= dx * 0.3;
				this.points[i].y -= dy * 0.3 ;
				this.points[i].z -= dz * 0.3
			}
		}
		for(var i = 0; i < objs.length; i++){
			var p = {x: this.cx, y:this.cy, z:this.cz};
			var length = distance3D(p, objs[i]);
			var target = 8;

			if(length < target){
				console.log("hit")

				var dx  = objs[i].x - obj.x;
				var dy  = objs[i].y - obj.y;
				var dz  = objs[i].z - obj.z;
			    
			    for(var i = 0; i < this.points.length; i++){
					this.points[i].x -= dx * 0.01;
					this.points[i].y -= dy * 0.01 ;
					this.points[i].z -= dz * 0.01
				}

			}
		}
	}
	this.setCenter = function(){
		var cx = 0;
		var cy = 0;
		var cz = 0;
		for(var i = 0; i < this.points.length; i++){
			cx += this.points[i].x;
			cy += this.points[i].y;
			cz += this.points[i].z;
		}
		cx /= this.points.length;
		cy /= this.points.length;
		cz /= this.points.length;
		this.cx = cx;
		this.cy = cy;
		this.cz = cz;
	}
	this.setCenter();

	this.drawWithLines = function(){
		for(var i = 0; i < this.springs.length; i++){
			this.springs[i].draw();
		}
		for(var i = 0; i < this.points.length; i++){
			this.points[i].draw();
		}
	}
	this.draw = function(){
		stroke("#000000")
		strokeWeight(3);
		fill("#FF5050");
		beginShape();
		for(var i =0; i < this.points.length; i++){
			vertex(this.points[i].x, this.points[i].y);
		}
		endShape(CLOSE);
	}

}


function verletPoint3D(x, y,z, maxX=25, maxZ=25, bounce = 0.9, friction = 1.0, gravity = {x:0, y:-0.03, z:0}){
	this.type = "point";
	this.x=x; 
	this.y=y;
	this.z=z;
	this.xOld=x;
	this.yOld=y;
	this.zOld=z;
	this.bounce = bounce;
	this.friction = friction;
	this.gravity = gravity;
	this.time = Date.now();
	this.update = function(){
		var dt = (Date.now() - this.time) / 20;
		this.time = Date.now();
		if(dt > 2)
			dt = 2;
		var vx = (this.x - this.xOld) * this.friction;
		var vy = (this.y - this.yOld) * this.friction;
		var vz = (this.z - this.zOld) * this.friction;
		this.xOld = this.x;
		this.yOld = this.y;
		this.zOld = this.z;
		this.x += vx;
		this.y += vy;
		this.z += vz;
		this.y += this.gravity.y * dt;
		this.x += this.gravity.x * dt;
		this.z += this.gravity.z * dt;
		

		
	}
	this.setGravity = function(gravity){
		this.gravity = gravity;
	}
	this.constrain = function(position){
		var vx = (this.x - this.xOld) ;
		var vy = (this.y - this.yOld) ;
		var vz = (this.z - this.zOld) ;

	


		var arr = []
		if(this.x  > 25){
			this.x = 25;
			this.xOld = this.x + vx * this.bounce;
			arr.push({hit:true,side: "left",  x:25-this.y, y:-this.z})

		}
		if(this.x <-25){
			this.x  = -25;
			this.xOld = this.x + vx * this.bounce;
			arr.push({hit:true,side: "right",  x:-25 + this.y, y:-this.z})
		}
		if(this.z > 25 ){
			this.z = 25 ;
			this.zOld = this.z + vz * this.bounce;
			arr.push({hit:true,side: "front" , x:-this.x, y:25 -this.y})
			

		}
		if(this.z  <-25){
			this.z = -25;
			this.zOld = this.z + vz * this.bounce;
			arr.push({hit:true,side: "back" , x:-this.x, y:-25  + this.y })

		}
		if(this.y  < 0){
			this.y = 0;
			this.yOld = this.y + vy * this.bounce;
			arr.push({hit:true,side: "floor",  x:this.x, y:this.z})
		}

			var p = {x: this.x, y:this.y, z:this.z};

		var length = distance3D(p, position);
		var target = 3;

		if(length < target){
			var x = this.x - position.x;
		    var y = this.y - position.y;
		    var z = this.z - position.z;
		    var mag = Math.sqrt(x*x + y*y + z*z)
		    
		    this.x = position.x + 1* target * x/mag ;
		    this.y = position.y + 1 * target * y/mag  ;
		    this.z = position.z + 1 * target *  z/mag ;

		}
		

		return arr;
	}
}

function verletStick3D(p1, p2, distance, rigid){
	this.type = "stick";
	this.p1 = p1;
	this.p2 = p2; 
	this.distance = distance;
	this.rigid = rigid;
	this.update = function(){

		var dx = this.p1.x - this.p2.x;
		var dy = this.p1.y - this.p2.y;
		var dz = this.p1.z - this.p2.z;
		var distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
		var difference = this.distance - distance;
		var percent = difference / distance / 2;
		var offsetX = dx * percent * this.rigid;
		var offsetY = dy * percent * this.rigid;
		var offsetZ = dz * percent * this.rigid;
		this.p1.x += offsetX;
		this.p1.y += offsetY;
		this.p1.z += offsetZ;
		this.p2.x -= offsetX;
		this.p2.y -= offsetY;
		this.p2.z -= offsetZ;

	}
	
}

function verletFromMesh(x, y , z, vertices, faces, maxX, maxY){
	var points  = [];
	for(var i = 0; i < vertices.length; i++){
		
		var p = new verletPoint3D(vertices[i].x + x, vertices[i].y + y, vertices[i].z + z, maxX, maxY, 1, 0.95);
		points.push(p);

	}
	
	var springs = []
	
	for(var i = 0; i < faces.length; i++){
		var face = faces[i];
		var p1 = face.a;
		var p2 = face.b;
		var p3 = face.c;
		springs.push(new verletStick3D( p1,p2, distance3D(p1, p2), 1) )
		springs.push(new verletStick3D( p2,p3, distance3D(p2, p3), 1) )
		springs.push(new verletStick3D( p3,p1, distance3D(p3, p1), 1) )
	}
	for(var i = 0; i < points.length; i++){
		var p1 = points[i];
		var max = 0;
		var ind = 0;

		
		for(var j= 0; j < points.length; j++){
			var p2 = points[j];
			
			var dist = distance3D(p1, p2);
			if(dist > max){
				max = dist;
				ind = j
			}
			
			
			

		}
		var p2 = points[ind];
		var dist = distance3D(p1,p2);
	
		springs.push(new verletStick3D( p1,p2, dist, 0.1) )

	}
	for(var i = 0; i < points.length; i++){
		var p1 = points[i];


		
		for(var j= i + 1; j < points.length; j++){
			var p2 = points[j];
			
			var dist = distance3D(p1, p2);
			if(dist < 4)
				springs.push(new verletStick3D( p1,p2, dist, 0.2) )
			
			
			
			

		}
		

	}



	return new verletObj(points, springs);
}

function distance3D(p1, p2){
	var x = (p2.x - p1.x );
	var y = (p2.y - p1.y );
	var z = (p2.z - p1.z );
	return Math.sqrt(x*x + y*y + z*z);
}

