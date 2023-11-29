import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import earthImage from "/images/earth.jpg";

let scene, camera, renderer, pointLight, controls;

window.addEventListener("load", init);

function init() {
  setEarth();
  animate();
  window.addEventListener("resize", onWindowSize);
}

function setEarth() {
  scene = new THREE.Scene();

  // PerspectiveCamera(視野角, アスペクト比, 開始距離, 終了距離)
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 500);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio); // 画面サイズが変わっても画質が悪くならないようにする
  document.body.appendChild(renderer.domElement);

  // テクスチャ
  let texture = new THREE.TextureLoader().load(earthImage);

  // 骨格: SphereGeometry(半径, widthセグメント, heightセグメント)　※セグメントの数値が大きいほどキレイな球体になる
  let ballGeometry = new THREE.SphereGeometry(100, 64, 32);

  // 材質
  let ballMaterial = new THREE.MeshPhysicalMaterial({ map: texture });

  // メッシュ化: ジオメトリ+マテリアル
  let ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ballMesh);

  // 並行光源を追加
  let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // ポイント光源を追加
  pointLight = new THREE.PointLight(0xffffff, 1, 0, 0);
  pointLight.position.set(-200, -200, -200);
  scene.add(pointLight);

  // ポイント光源がどこにあるのかを特定する
  let pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  // マウス操作
  controls = new OrbitControls(camera, renderer.domElement);
}

function onWindowSize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function animate() {
  // ポイント光源を球の周りを巡回させる
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500),
  );

  requestAnimationFrame(animate);

  // レンダリング
  renderer.render(scene, camera);
}
