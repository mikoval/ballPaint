const WIDTH = document.body.clientWidth;
const HEIGHT = document.body.clientHeight;

const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

const div = document.querySelector('#container');

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
const camera =
    new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    );
camera.position.y = 1.0;

const scene = new THREE.Scene();
var DirectionalLight  = new THREE.PointLight( 0xFFFFFF , 1.0, 100);
DirectionalLight.castShadow = true
DirectionalLight.position.y = 20;
DirectionalLight.position.x = 3;
DirectionalLight.position.z = 7;

var AmbientLight  = new THREE.AmbientLight( 0x808080 );


scene.add(camera);
scene.add(DirectionalLight)
scene.add(AmbientLight)

renderer.setSize(WIDTH, HEIGHT);

div.appendChild(renderer.domElement);


var loader = new THREE.TextureLoader();
  var  playerTextureColor;
  var  playerTextureNormal;
  var  playerTextureSpecular;
  var  playerTextureReflection;
  var greenTextureColor, greenTextureNormal,greenTextureSpecular, greenTextureDisplacement,
    redTextureColor, redTextureNormal, redTextureSpecular, redTextureDisplacement, 
    blueTextureColor, blueTextureNormal, blueTextureSpecular, blueTextureDisplacement;

loader.load('tmp.png', function ( texture){
      tmp = texture;
  })

  loader.load('marble/marble_color.jpg', function ( texture){
      playerTextureColor = texture;
  })
  loader.load('marble/marble_norm.jpg', function ( texture){
      playerTextureNormal = texture;
  })
  loader.load('marble/marble_gloss.jpg', function ( texture){
      playerTextureSpecular = texture;
  })
  loader.load('marble/marble_reflection.jpg', function ( texture){
      playerTextureReflection= texture;
  })
  loader.load('red/red_color.jpg', function ( texture){
      redTextureColor = texture;
  })
  loader.load('red/red_norm.jpg', function ( texture){
      redTextureNormal = texture;
  })
  loader.load('red/red_gloss.jpg', function ( texture){
      redTextureSpecular = texture;
  })
  loader.load('red/red_displacement.jpg', function ( texture){
      redTextureDisplacement= texture;
  })

  loader.load('blue/blue_color.jpg', function ( texture){
      blueTextureColor = texture;
  })
  loader.load('blue/blue_norm.jpg', function ( texture){
      blueTextureNormal = texture;
  })
  loader.load('blue/blue_gloss.jpg', function ( texture){
      blueTextureSpecular = texture;
  })
  loader.load('blue/blue_displacement.jpg', function ( texture){
      blueTextureDisplacement= texture;
  })

  loader.load('green/green_color.jpg', function ( texture){
      greenTextureColor = texture;
  })
  loader.load('green/green_norm.jpg', function ( texture){
      greenTextureNormal = texture;
  })
  loader.load('green/green_gloss.jpg', function ( texture){
      greenTextureSpecular = texture;
  })
  loader.load('green/green_displacement.jpg', function ( texture){
      greenTextureDisplacement= texture;
  })
function load(res, size){
  
  if(!greenTextureColor || !greenTextureNormal  || !greenTextureSpecular  || !greenTextureDisplacement 
    ||!redTextureColor  || !redTextureNormal  || !redTextureSpecular  || !redTextureDisplacement 
    ||!blueTextureColor  || !blueTextureNormal  || !blueTextureSpecular  || !blueTextureDisplacement ){
    setTimeout(function(){ load()}, 100);
   
  }
  else{

    game  = new Game(scene, camera,res, size);
  }

}

var game;
  



function update () {
  if(game){
     game.update();

     renderer.render(scene, camera);
  }
 

  requestAnimationFrame(update);
}

requestAnimationFrame(update);