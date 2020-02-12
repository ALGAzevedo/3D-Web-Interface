
var candidatos = [];

var mala = new THREE.Group();
var candeeiro = new THREE.Group();
var rodarObj = new THREE.Mesh();
var pararObj = new THREE.Mesh();
var roda = false;
var black = new THREE.Color();
var purple = new THREE.Color();
var ligado = false;

var animacao;

var intLuz = 2.1;

//SCENE

var cena = new THREE.Scene();



//RENDERER
var renderer = new THREE.WebGLRenderer();

cena.background = new THREE.Color('grey');

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


//CAMERA

var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 5000);
camera.rotation.y = 45 / 180 * Math.PI;


var eixos = new THREE.AxesHelper();

//cena.add(eixos);

camera.position.x = 4.5;
camera.position.y = 3;
camera.position.z = 7;


//GRID

var grelha = new THREE.GridHelper();
//cena.add(grelha);


//CONTROLS
var controls = new THREE.OrbitControls(camera, renderer.domElement);

//Relogio

var relogio = new THREE.Clock();

//Mixer

var misturador = new THREE.AnimationMixer(cena);


//LUZ
var luzAmbiente = new THREE.AmbientLight(0xffffff, 3);
cena.add(luzAmbiente);

var luzPonto1 = new THREE.PointLight("white", intLuz);
luzPonto1.position.set(5, 5, -4);
cena.add(luzPonto1);

var luzPonto2 = new THREE.PointLight("white", intLuz);
luzPonto2.position.set(5, 5, 5);
cena.add(luzPonto2);

var luzPonto3 = new THREE.PointLight("white", intLuz);
luzPonto3.position.set(-5, 5, 5);
//cena.add(luzPonto3);

var luzPonto4 = new THREE.PointLight("white", intLuz);
luzPonto4.position.set(-5, 5, -3);
//cena.add(luzPonto4);







var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(5, 5, 3);
spotLight.castShadow = true;
spotLight.intensity = 2;
spotLight.angle = 0.5;
spotLight.penumbra = 0.3;
cena.add(spotLight);

var spotLight2 = new THREE.SpotLight(0xffffff);
spotLight2.position.set(0, 8, 0);
spotLight2.castShadow = true;
spotLight2.intensity = 2;
spotLight2.angle = 0.2;
spotLight2.penumbra = 0.4;
spotLight2.target.position.set(-9, 2, 0);
cena.add(spotLight2.target);
cena.add(spotLight2);


 var spotLightHelper = new THREE.SpotLightHelper( spotLight2 );
//cena.add( spotLightHelper );
 

/* var sphereSize = 0.3;
var pointLightHelper1 = new THREE.PointLightHelper(luzPonto1, sphereSize);
cena.add(pointLightHelper1);


var pointLightHelper2 = new THREE.PointLightHelper(luzPonto2, sphereSize);
cena.add(pointLightHelper2);

var pointLightHelper3 = new THREE.PointLightHelper(luzPonto3, sphereSize);
cena.add(pointLightHelper3);

var pointLightHelper4 = new THREE.PointLightHelper(luzPonto4, sphereSize);
cena.add(pointLightHelper4);
 */
//Função para FPS
/* var stats = new Stats();
stats.showPanel(1);

document.body.appendChild(stats.domElement);
 */

var acao = null;


var carregador = new THREE.GLTFLoader();

carregador.load('Cena.gltf', function (gltf) {

	cena.add(gltf.scene);

	animacao = THREE.AnimationClip.findByName(gltf.animations, 'KeyAction');
	acao = misturador.clipAction(animacao);
	acao.setLoop(THREE.Loop);
	acao.clampWhenFinished = true;
	acao.enable = true;
	acao.timeScale = -1;
	acao.repetitions = 1;


	cena.traverse(function (elemento) {

		if (elemento.isMesh) {
			elemento.castShadow = true;
			elemento.receiveShadow = true;

			candidatos.push(elemento);
		}

		renderer.shadowMap.enabled = true;


		mala = cena.getObjectByName('Mala');
		rodarObj = cena.getObjectByName('Rodar');
		pararObj = cena.getObjectByName('Parar');
		candeeiro = cena.getObjectByName('Candeeiro');

		black.copy(rodarObj.material.color);
		purple.copy(pararObj.material.color);


	})
	black.copy(rodarObj.material.color);
	purple.copy(pararObj.material.color);

})



function animar() {

	renderer.render(cena, camera);
	misturador.update(relogio.getDelta());
	rodar();
	ligar();

	requestAnimationFrame(animar);
}

//RAYCASTER

var raycaster = new THREE.Raycaster();
var rato = new THREE.Vector2();

window.onclick = function (evento) {

	rato.x = (evento.clientX / window.innerWidth) * 2 - 1;
	rato.y = -(evento.clientY / window.innerHeight) * 2 + 1;

	pegarPrimeiro();
}

// Criar e adicinonar um AudioListener
var listener = new THREE.AudioListener();
camera.add(listener);

// Criar uma fonte de som global
var som = new THREE.Audio(listener);

// Carregar um som e colocá-lo no buffer to objecto som.
var audioLoader = new THREE.AudioLoader();
audioLoader.load('sounds/zipper.ogg', function (buffer) {
	som.setBuffer(buffer);
	som.setLoop(false);
	som.setVolume(0.5);
});




var intersetados;
var cont = 2;
function pegarPrimeiro() {

	raycaster.setFromCamera(rato, camera);

	intersetados = raycaster.intersectObjects(candidatos);

	if (intersetados[0].object.parent.name == "Mala") {
		if (cont % 2 == 0) {
			acao.timeScale = 1;
			som.playbackRate = 1;
			som.play();
		}
		else {
			acao.timeScale = -1.8;
			som.playbackRate = 0.5;
			som.play();
		}
		cont += 1;
		acao.play().reset();
	}

	if (intersetados[0].object.name == "Rodar") {
		roda = true;
		rodarObj.material.color.set(purple);
		pararObj.material.color.set(black);
	}
	if (intersetados[0].object.name == "Parar") {
		roda = false;
		pararObj.material.color.set(purple);
		rodarObj.material.color.set(black);
	}
	if(intersetados[0].object.parent.name == "Candeeiro"){
		ligado = !ligado;
	}


}

var gui = new dat.GUI();

var conf = { color: '#ffffff' };
gui.addColor(conf, 'color').onChange(function (colorValue) {
	for (i = 0; i < mala.children.length; i++) {
		mala.children[i].material.color.set(colorValue);
		mala.children[i].material.lightMapIntensity = 2;
	}

});


function rodar() {
	if (roda) {
		mala.rotateY(0.01);
	}
}

function ligar(){
	if(ligado){
		luzAmbiente.visible = luzPonto1.visible = 
		luzPonto2.visible = luzPonto3.visible = luzPonto4.visible = spotLight.visible = true;
		spotLight2.visible = false;
	}
	else{
		luzAmbiente.visible = luzPonto1.visible = 
		luzPonto2.visible = luzPonto3.visible = luzPonto4.visible = spotLight.visible = false;
		spotLight2.visible = true;
	}
}


animar();