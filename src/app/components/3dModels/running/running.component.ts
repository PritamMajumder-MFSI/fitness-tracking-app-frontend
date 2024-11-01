import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-running',
  standalone: true,
  imports: [],
  templateUrl: './running.component.html',
  styleUrls: ['./running.component.scss'],
})
export class RunningComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;
  private mixer: THREE.AnimationMixer | undefined;
  private isDragging = false;
  private previousMousePosition = { x: 0 };
  private model: THREE.Object3D | undefined;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createThreeJsBox();
  }

  createThreeJsBox(): void {
    const container = this.canvasContainer.nativeElement;

    const scene = new THREE.Scene();
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const containerSizes = {
      width: container.clientWidth,
      height: container.clientHeight,
    };

    this.camera = new THREE.PerspectiveCamera(
      75,
      containerSizes.width / containerSizes.height,
      2,
      4
    );
    this.camera.position.z = 3;
    scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(containerSizes.width, containerSizes.height);
    container.appendChild(this.renderer.domElement);

    const loader = new GLTFLoader();
    loader.load(
      '3dModels/boy_jogging.glb',
      (gltf) => {
        this.model = gltf.scene;
        scene.add(this.model);

        this.model.position.set(0, -1.5, 0);
        this.model.scale.set(1, 1, 1);

        this.mixer = new THREE.AnimationMixer(this.model);
        const action = this.mixer.clipAction(gltf.animations[0]);
        action.play();
      },
      undefined,
      (error) => {
        console.error('An error occurred loading the model:', error);
      }
    );

    window.addEventListener('resize', () =>
      this.onWindowResize(container, scene)
    );

    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      if (this.mixer) this.mixer.update(delta);

      this.renderer.render(scene, this.camera);
      window.requestAnimationFrame(animate);
    };

    animate();

    this.renderer.domElement.addEventListener(
      'mousedown',
      this.onMouseDown.bind(this),
      false
    );
    this.renderer.domElement.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this),
      false
    );
    this.renderer.domElement.addEventListener(
      'mouseup',
      this.onMouseUp.bind(this),
      false
    );
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.previousMousePosition.x = event.clientX;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.model) return;

    const deltaX = event.clientX - this.previousMousePosition.x;
    const rotationSpeed = 0.005;
    this.model.rotation.y += deltaX * rotationSpeed;
    this.previousMousePosition.x = event.clientX;
  }

  onMouseUp(): void {
    this.isDragging = false;
  }

  onWindowResize(container: HTMLElement, scene: THREE.Scene): void {
    const containerSizes = {
      width: container.clientWidth,
      height: container.clientHeight,
    };

    this.camera.aspect = containerSizes.width / containerSizes.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(containerSizes.width, containerSizes.height);
    this.renderer.render(scene, this.camera);
  }
}
