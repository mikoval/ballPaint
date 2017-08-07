var fluidWidth = 512;
var fluidHeight = 512;
 dt = 1/60;
dx = 1.0;
dy = 1.0;
function Floor(res, pathsize, type){
   
    fluidWidth =res
    fluidHeight = res
	this.velocityA = new THREE.WebGLRenderTarget( fluidWidth , fluidHeight, {depthBuffer: false, stencilBuffer:false, minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter,type: THREE.HalfFloatType,});
    this.velocityB = new THREE.WebGLRenderTarget( fluidWidth , fluidHeight, {depthBuffer: false, stencilBuffer:false, minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, type: THREE.HalfFloatType} );
	this.divergenceTexture = new THREE.WebGLRenderTarget( fluidWidth , fluidHeight, {depthBuffer: false, stencilBuffer:false,  minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter,type: THREE.HalfFloatType});
	this.pressureTexture = new THREE.WebGLRenderTarget( fluidWidth , fluidHeight, {depthBuffer: false, stencilBuffer:false, minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter,type: THREE.HalfFloatType});
	this.pressureTexture2 = new THREE.WebGLRenderTarget( fluidWidth , fluidHeight, {depthBuffer: false, stencilBuffer:false, minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter,type: THREE.HalfFloatType});
	this.densityA = new THREE.WebGLRenderTarget( fluidWidth , fluidHeight, {depthBuffer: false, stencilBuffer:false, minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter,type: THREE.FloatType,});
	this.densityB = new THREE.WebGLRenderTarget( fluidWidth , fluidHeight, {depthBuffer: false, stencilBuffer:false, minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, type: THREE.FloatType} );
	var geometry = new THREE.PlaneGeometry( 50, 50 );
	var material = new THREE.MeshPhongMaterial({map: this.densityA});
	var mesh = new THREE.Mesh( geometry, material );
	
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
        console.log('addingcolor');

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
	this.addVelocity = function(x, y, vel){

		this.addVelocityMaterial.uniforms.velocitySource.value.x = -10 * vel.x

        this.addVelocityMaterial.uniforms.velocitySource.value.y =  vel.z
        

        this.addVelocityMaterial.uniforms.velocitySource.value.z = ((x)/50 + 0.5) * fluidWidth;;
        this.addVelocityMaterial.uniforms.velocitySource.value.w = (1.0 - ((y)/50 + 0.5)) *  fluidHeight;


        //add velocity
        this.addVelocityMaterial.uniforms.bufferTexture.value = this.velocityA.texture;
        renderer.render(this.addVelocityScene,this.fluidCamera,this.velocityB,true);
        this.swapVelocity();
	}
	this.fluidUpdate = function (){
		 //velocity step
       	this.velocityStep();
            //density step
        this.densityStep();
        //console.log("updating fluid")
	}


	this.plane = new THREE.PlaneBufferGeometry( fluidWidth, fluidHeight );

	 //diffuse 
    this.diffuseScene = new THREE.Scene();

    this.diffuseMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            x: { type: "t", value: this.velocityA.texture },
            b: { type: "t", value: this.velocityA.texture },
            res : {type: 'v2',value:new THREE.Vector2(fluidWidth,fluidHeight)},
            alpha: { type: "f", value: 0.0 },
            rBeta: { type: "f", value: 0.0 },
        },
        fragmentShader: document.getElementById( 'DiffusionShader' ).innerHTML
    } );
    this.diffuseObject = new THREE.Mesh( this.plane, this.diffuseMaterial );

    this.diffuseScene.add(this.diffuseObject);

    //add velocity
    this.addVelocityScene = new THREE.Scene();

    this.addVelocityMaterial = new THREE.ShaderMaterial( {
        uniforms: {
         bufferTexture: { type: "t", value: this.velocityA.texture },
         res : {type: 'v2',value:new THREE.Vector2(fluidWidth,fluidHeight)},
         velocitySource: {type:"v4",value:new THREE.Vector4(0,0,0,0)},
         velocitySize: {type:"f",value:3.0},

        },
        fragmentShader: document.getElementById( 'AddVelocityShader' ).innerHTML
    } );
    this.addVelocityObject = new THREE.Mesh( this.plane, this.addVelocityMaterial );

    this.addVelocityScene.add(this.addVelocityObject);

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



    //advect 
    this.advectScene = new THREE.Scene();

    this.advectMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            velocity: { type: "t", value: this.velocityA.texture },
            quantity: { type: "t", value: this.velocityA.texture },
            dx: { type: "f", value: 0.0 },
            timestep: { type: "f", value: 0.0 },

            res : {type: 'v2',value:new THREE.Vector2(fluidWidth,fluidHeight)},

        },
        fragmentShader: document.getElementById( 'AdvectionShader' ).innerHTML
    } );
    this.advectObject = new THREE.Mesh( this.plane, this.advectMaterial );

    this.advectScene.add(this.advectObject);

    //divergence 
    this.divergenceScene = new THREE.Scene();

    this.divergenceMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            velocity: { type: "t", value: this.velocityA.texture },
            res : {type: 'v2',value:new THREE.Vector2(fluidWidth,fluidHeight)},
        },
        fragmentShader: document.getElementById( 'DivergenceShader' ).innerHTML
    } );
    this.divergenceObject = new THREE.Mesh( this.plane, this.divergenceMaterial );

    this.divergenceScene.add(this.divergenceObject);

    //gradient
    this.gradientScene = new THREE.Scene();

    this.gradientMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            velocity: { type: "t", value: this.velocityA.texture },
            pressure: { type: "t", value: this.velocityA.texture },
            res : {type: 'v2',value:new THREE.Vector2(fluidWidth,fluidHeight)},
        },
        fragmentShader: document.getElementById( 'GradientShader' ).innerHTML
    } );
    this.gradientObject = new THREE.Mesh( this.plane, this.gradientMaterial );

    this.gradientScene.add(this.gradientObject);


    //gradient
    this.boundaryScene = new THREE.Scene();

    this.boundaryMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            texture: { type: "t", value: this.velocityA.texture },
            res : {type: 'v2',value:new THREE.Vector2(fluidWidth,fluidHeight)},
            scale: { type: "f", value: 0.0 },
        },
        fragmentShader: document.getElementById( 'BoundaryShader' ).innerHTML
    } );
    this.boundaryObject = new THREE.Mesh( this.plane, this.boundaryMaterial );

    this.boundaryScene.add(this.boundaryObject);

   


    //show velocity
    this.showVelocityScene = new THREE.Scene();

    this.showVelocityMaterial = new THREE.ShaderMaterial( {
        uniforms: {
         bufferTexture: { type: "t", value: this.velocityA.texture },
         
         res : {type: 'v2',value:new THREE.Vector2(fluidWidth,fluidHeight)},

        },
        fragmentShader: document.getElementById( 'DisplayVelocityShader' ).innerHTML
    } );
    this.showVelocityObject = new THREE.Mesh( this.plane, this.showVelocityMaterial );

    this.showVelocityScene.add(this.showVelocityObject);

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

	//Render everything!
    this.swapColor = function(){
        var t = this.colorA;
        this.colorA = this.colorB;
        this.colorB = t;
    }
    this.swapVelocity= function(){
        var t = this.velocityA;
        this.velocityA = this.velocityB;
        this.velocityB = t;
    }
    this.swapPressure = function(){
        var t = this.pressureTexture;
        this.pressureTexture = this.pressureTexture2;
        this.pressureTexture2 = t;
    }
    this.swapDensity= function(){

        var t = this.densityA;
        this.densityA = this.densityB;
        this.densityB = t;
    }
    this.velocityStep = function(){
        this.advectVelocity();

        //diffuseVelocity();

        this.computePressure();

    }
    this.advectVelocity = function(){
            this.boundaryMaterial.uniforms.scale.value = -1.0;
            this.boundaryMaterial.uniforms.texture.value = this.velocityA.texture;
            renderer.render(this.boundaryScene,this.fluidCamera,this.velocityB,true);
            this.swapVelocity();

            this.advectMaterial.uniforms.timestep.value = dt;
            this.advectMaterial.uniforms.dx.value = dx;
            this.advectMaterial.uniforms.quantity.value = this.velocityA.texture;
            this.advectMaterial.uniforms.velocity.value = this.velocityA.texture;
            
            renderer.render(this.advectScene,this.fluidCamera,this.velocityB,true);
            this.swapVelocity();

            this.boundaryMaterial.uniforms.scale.value = -1.0;
            this.boundaryMaterial.uniforms.texture.value = this.velocityA.texture;
            renderer.render(this.boundaryScene,this.fluidCamera,this.velocityB,true);
            this.swapVelocity();
    }
    this.diffuseVelocity= function(){
            v = 1.0;

            this.boundaryMaterial.uniforms.scale.value = -1.0;
            this.diffuseMaterial.uniforms.alpha.value = (dx*dx) * v * dt ;
            this.diffuseMaterial.uniforms.rBeta.value = 1.0/(4.0 + (dx*dx) * v * dt )

            for (var i = 0; i < 0; i ++ ){
                this.diffuseMaterial.uniforms.x.value = this.velocityA.texture;
                this.diffuseMaterial.uniforms.b.value = this.velocityA.texture;
                

                renderer.render(this.diffuseScene,this.fluidCamera,this.velocityB,true);
                this.swapVelocity();

               

            }
            
            this.boundaryMaterial.uniforms.scale.value = -1.0;
            this.boundaryMaterial.uniforms.texture.value = this.velocityA.texture;
            renderer.render(this.boundaryScene,this.fluidCamera,this.velocityB,true);
            this.swapVelocity();
    }
    this.computePressure = function(){

            renderer.render(this.eraseScene,this.fluidCamera,this.pressureTexture,true);
            renderer.render(this.eraseScene,this.fluidCamera,this.pressureTexture2,true);
            //compute divergence
            this.divergenceMaterial.uniforms.velocity.value = this.velocityA.texture;
            renderer.render(this.divergenceScene,this.fluidCamera,this.divergenceTexture,true);
            
            // compute pressure
            this.boundaryMaterial.uniforms.scale.value = 1.0;
            this.diffuseMaterial.uniforms.alpha.value = -1 ;
            this.diffuseMaterial.uniforms.rBeta.value = 0.25;
            this.diffuseMaterial.uniforms.b.value = this.divergenceTexture.texture;
            for (var i = 0; i <25; i ++ ){
                this.diffuseMaterial.uniforms.x.value = this.pressureTexture.texture;
                renderer.render(this.diffuseScene,this.fluidCamera,this.pressureTexture2,true);
                this.swapPressure();

                this.boundaryMaterial.uniforms.texture.value = this.pressureTexture.texture;
                renderer.render(this.boundaryScene,this.fluidCamera,this.pressureTexture2,true);
                this.swapPressure();
            

            }


            //subtract pressure
            this.gradientMaterial.uniforms.velocity.value = this.velocityA.texture;
            this.gradientMaterial.uniforms.pressure.value = this.pressureTexture.texture;
            renderer.render(this.gradientScene,this.fluidCamera,this.velocityB,true);
            this.swapVelocity();

    }
    this.densityStep = function(){
        this.advectDensity();

        //diffuseDensity();
    }
    this.advectDensity = function(){
            //advect density

            this.advectMaterial.uniforms.timestep.value = dt;
            this.advectMaterial.uniforms.dx.value = dx;
            this.advectMaterial.uniforms.quantity.value = this.densityA.texture;
            this.advectMaterial.uniforms.velocity.value = this.velocityA.texture;
            

            renderer.render(this.advectScene,this.fluidCamera,this.densityB,true);
            this.swapDensity();
    }

    renderer.render(this.eraseScene,this.fluidCamera,this.densityB,true);
    this.swapDensity();
    this.update();
}


