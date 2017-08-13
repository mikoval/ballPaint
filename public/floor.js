var fluidWidth = 512;
var fluidHeight = 512;
 dt = 1/60;
dx = 1.0;
dy = 1.0;

function Floor(res, pathsize, type){
   
    fluidWidth =res
    fluidHeight = res
	
	this.densityA = new THREE.WebGLRenderTarget( fluidWidth , fluidHeight, {depthBuffer: false, stencilBuffer:false, minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter,type: THREE.HalfFloatType,});
	this.densityB = new THREE.WebGLRenderTarget( fluidWidth , fluidHeight, {depthBuffer: false, stencilBuffer:false, minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, type: THREE.HalfFloatType} );
	var geometry = new THREE.PlaneGeometry( 50, 50 );
	var material = new THREE.MeshPhongMaterial({map: this.densityA});
	var mesh = new THREE.Mesh( geometry, material );
	mesh.frustumCulled = false;
	if(type == "bottom"){
		mesh.rotateX(-3.14/2);
		mesh.position.z = 0
		mesh.position.y = 0;
		mesh.position.x = 0;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
	}
	else if(type == "front"){
		mesh.rotateY(3.14);

		mesh.position.z = 25;
		mesh.position.y = 25;
		mesh.position.x = 0;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
	}
	else if(type == "back"){
        mesh.rotateZ(3.14);
		mesh.position.z = -25;
		mesh.position.y = 25;
		mesh.position.x = 0;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
	}
	else if(type == "left"){
		mesh.rotateY(-3.14/2);
        mesh.rotateZ(-3.14/2);
		mesh.position.z = 0;
		mesh.position.y = 25;
		mesh.position.x = 25;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
	}
	else if(type == "right"){
		mesh.rotateY(3.14/2);
        mesh.rotateZ(3.14/2);
		mesh.position.z = 0;
		mesh.position.y = 25;
		mesh.position.x = -25;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
	}

	this.obj = mesh;
	this.update = function(){
		//this.fluidUpdate();
		this.obj.material.map = this.densityA.texture;

	}
	this.addColor = function(x, y, color){

		this.addDensityMaterial.uniforms.densitySource.value.x = 5.0;
        if(color == 1.0)
            this.addDensityMaterial.uniforms.densitySource.value.y = 1.0;
        else if(color == 2.0)
            this.addDensityMaterial.uniforms.densitySource.value.y = 2.0;
        else if (color == 3.0)
            this.addDensityMaterial.uniforms.densitySource.value.y = 3.0;
        this.addDensityMaterial.uniforms.densitySource.value.z = ((x)/50 + 0.5) * fluidWidth;
        this.addDensityMaterial.uniforms.densitySource.value.w = (1.0 - ((y)/50 + 0.5)) *  fluidHeight;


		this.addDensityMaterial.uniforms.bufferTexture.value = this.densityA.texture;

		renderer.render(this.addDensityScene,this.fluidCamera,this.densityB,true);
		this.swapDensity();

	}
	
	this.plane = new THREE.PlaneBufferGeometry( fluidWidth, fluidHeight );

	 //diffuse 
   

    //add density
    this.addDensityScene = new THREE.Scene();

    this.addDensityMaterial = new THREE.ShaderMaterial( {
        uniforms: {
         bufferTexture: { type: "t", value: this.densityA.texture },
         res : {type: 'v2',value:new THREE.Vector2(fluidWidth,fluidHeight)},
         densitySource: {type:"v4",value:new THREE.Vector4(0,0,0,0)},
         densitySize: {type:"f",value:pathsize},
        },
        fragmentShader: document.getElementById( 'AddDensityShader' ).innerHTML
    } );
    this.addDensityObject = new THREE.Mesh( this.plane, this.addDensityMaterial );

    this.addDensityScene.add(this.addDensityObject);



  

    //erase texture
    this.eraseScene = new THREE.Scene();

    this.eraseMaterial = new THREE.ShaderMaterial( {
        uniforms: {

        },
        fragmentShader: document.getElementById( 'EraseShader' ).innerHTML
    } );
    this.eraseObject = new THREE.Mesh( this.plane, this.eraseMaterial );

    this.eraseScene.add(this.eraseObject);




	this.fluidCamera = new THREE.OrthographicCamera( fluidWidth / - 2, fluidWidth / 2, fluidHeight / 2, fluidHeight / - 2, 1, 1000 );
	this.fluidCamera.position.z = 2;

	
	



	scene.add( this.obj );

	
    this.swapDensity= function(){

        var t = this.densityA;
        this.densityA = this.densityB;
        this.densityB = t;
    }
    

    renderer.render(this.eraseScene,this.fluidCamera,this.densityB,true);
    this.swapDensity();
    this.update();
}


