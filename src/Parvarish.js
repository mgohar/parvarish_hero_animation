import * as THREE from "three";

const particalTexture1 =
  "https://cdn.jsdelivr.net/gh/mgohar/parvarish_hero_animation@1.0.10/src/Assets/star_04.png";
const showTexture1 =
  "https://cdn.jsdelivr.net/gh/mgohar/parvarish_hero_animation@1.0.10/src/Assets/magic_04.png";
const doctorCloud1Texture =
  "https://cdn.jsdelivr.net/gh/mgohar/parvarish_hero_animation@1.0.10/src/Assets/cloud1.png";
const doctorCloud2Texture =
  "https://cdn.jsdelivr.net/gh/mgohar/parvarish_hero_animation@1.0.10/src/Assets/cloud2.png";
const doctorCloud3Texture =
  "https://cdn.jsdelivr.net/gh/mgohar/parvarish_hero_animation@1.0.10/src/Assets/cloud3.png";
const doctorCloud4Texture =
  "https://cdn.jsdelivr.net/gh/mgohar/parvarish_hero_animation@1.0.10/src/Assets/cloud4.png";

const gs = gsap.timeline();
let devicePrefex = "bg_";
// let FOV = 53;      
// let planeWidth = 1.779;
let draw = document.querySelector(".draw");
let FOV = parseInt(draw.getAttribute("fov"));    
let planeWidth = 1.8;
applyStylesBasedOnScreenSize();

const vshader = `
varying vec2 vUv;
void main() {	
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
const fshader = `
#define PI 3.141592653589
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_duration;
uniform sampler2D u_tex_1;
uniform sampler2D u_tex_2;

varying vec2 vUv;

void main (void)
{
  vec2 p =  vUv;
  float len = length(p);
  vec2 ripple = vUv + (p/len)*cos(len*12.0-u_time*4.0)*0.03;
  float delta = u_time/u_duration;
  vec2 uv = mix(ripple, vUv, delta);
  vec3 col1 = texture2D(u_tex_1, uv).rgb;
  vec3 col2 = texture2D(u_tex_2, uv).rgb;
  float fade = smoothstep(delta*11.4, delta*12.5, len);
  vec3 color = mix(col2, col1, fade);
  gl_FragColor = vec4(color, 1.0); 
}
`;

const scene = new THREE.Scene();
// Variables================================
const Size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
let index = -1;
// CAMERA
const camera = new THREE.PerspectiveCamera(FOV, Size.width / Size.height);
// const camera = new THREE.OrthographicCamera(Size.width / - 2, Size.width / 2, Size.height / 2, Size.height / - 2, 1, 1000);

const canvas = document.querySelector(".draw");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const clock = new THREE.Clock();
const particalTextureT = new THREE.TextureLoader().load(particalTexture1);
const snowTextureT = new THREE.TextureLoader().load(showTexture1);
const doctorCloud1TextureT = new THREE.TextureLoader().load(
  doctorCloud1Texture
);
const doctorCloud2TextureT = new THREE.TextureLoader().load(
  doctorCloud2Texture
);
const doctorCloud3TextureT = new THREE.TextureLoader().load(
  doctorCloud3Texture
);
const doctorCloud4TextureT = new THREE.TextureLoader().load(
  doctorCloud4Texture
);

// Ripple Effect Geometry================================
const geometry = new THREE.PlaneGeometry(planeWidth, 1);
const uniforms = {
  u_tex_1: { value: null },
  u_tex_2: { value: null },
  u_duration: { value: 1.8 },
  u_time: { value: 0.0 },
  u_mouse: { value: { x: 0.0, y: 0.0 } },
  u_resolution: { value: { x: 0, y: 0 } },
};
const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vshader,
  fragmentShader: fshader,
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
camera.position.z = 1;
// Add particals for First screen 1================================
// CREATE PARTICALS

// CLOUDS FOR DOCTOR SCREEN
const cloud1Group = new THREE.Group();
const cloud1Geomatery = new THREE.PlaneGeometry(0.6, 0.08);
const cloud1Material = new THREE.MeshBasicMaterial({
  color: "white",
  transparent: true,
  alphaMap: doctorCloud1TextureT,
  opacity: 0.2,
});
const cloud1 = new THREE.Mesh(cloud1Geomatery, cloud1Material);
cloud1.position.set(-0.8, 0.23);
scene.add(cloud1Group);
cloud1Group.add(cloud1);
// 2
const cloud2Geomatery = new THREE.PlaneGeometry(0.6, 0.08);
const cloud2Material = new THREE.MeshBasicMaterial({
  color: "white",
  transparent: true,
  alphaMap: doctorCloud2TextureT,
  opacity: 0.2,
});
const cloud2 = new THREE.Mesh(cloud2Geomatery, cloud2Material);
cloud2.position.set(-0.3, 0.42);
cloud1Group.add(cloud2);
// 3
const cloud3Geomatery = new THREE.PlaneGeometry(0.6, 0.08);
const cloud3Material = new THREE.MeshBasicMaterial({
  color: "white",
  transparent: true,
  alphaMap: doctorCloud3TextureT,
  opacity: 0.2,
});
const cloud3 = new THREE.Mesh(cloud3Geomatery, cloud3Material);
cloud3.position.set(0.9, 0.35);
cloud1Group.add(cloud3);
// 4
const cloud4Geomatery = new THREE.PlaneGeometry(0.6, 0.08);
const cloud4Material = new THREE.MeshBasicMaterial({
  color: "white",
  transparent: true,
  alphaMap: doctorCloud4TextureT,
  opacity: 0.2,
});
const cloud4 = new THREE.Mesh(cloud4Geomatery, cloud4Material);
cloud4.position.set(0.5, 0.23);
cloud1Group.add(cloud4);

// STARTS ELEMENTS ==========================
const star1Geomatery = new THREE.PlaneGeometry(0.03, 0.03);
const star1Material = new THREE.MeshBasicMaterial({
  color: "white",
  transparent: true,
  alphaMap: particalTextureT,
  opacity: 1,
});

// SNOW ELEMENTS =========================
const snow1Material = new THREE.MeshBasicMaterial({
  color: "white",
  transparent: true,
  alphaMap: snowTextureT,
  opacity: 1,
});
// SHINE ELEMENTS =========================
const shine1Material = new THREE.MeshBasicMaterial({
  color: "white",
  transparent: true,
  alphaMap: particalTextureT,
  opacity: 1,
});
// Define the range for the stars
const minX = -1;
const maxX = 1;
const minY = -0.1;
const maxY = 0.5;
const starGroup = new THREE.Group();
const snowGroup = new THREE.Group();
const shineGroup = new THREE.Group();
scene.add(starGroup, snowGroup, shineGroup);

// STARS ================================
for (let i = 0; i < 150; i++) {
  const randomX = Math.random() * (maxX - minX) + minX;
  const randomY = Math.random() * (maxY - minY) + minY;
  const star = new THREE.Mesh(star1Geomatery, star1Material);
  if (randomX >= 0.2 || randomX <= -0.2) {
    star.position.set(randomX, randomY, 0);
  } else {
    star.position.set(randomX, randomY, -5);
  }
  starGroup.add(star);
}
// SNOW ================================
for (let i = 0; i < 200; i++) {
  const randomX = Math.random() * (maxX - minX) + minX;
  const randomY = Math.random() * (1.5 - minY) + minY;
  const snow = new THREE.Mesh(
    new THREE.PlaneGeometry(0.015, 0.015),
    snow1Material
  );
  if (randomX >= 0.2 || randomX <= -0.2) {
    snow.position.set(randomX, randomY, 0);
  } else {
    snow.position.set(randomX, randomY, -5);
  }
  snowGroup.add(snow);
}
// Shine ================================
for (let i = 0; i < 50; i++) {
  const randomX = Math.random() * (maxX - minX) + minX;
  const randomY = Math.random() * (maxY - -1) - 1;
  const shine = new THREE.Mesh(
    new THREE.PlaneGeometry(0.03, 0.03),
    shine1Material
  );
  if (randomX >= 0.2 || randomX <= -0.2) {
    shine.position.set(randomX, randomY, 0);
  } else {
    shine.position.set(randomX, randomY, -5);
  }
  shineGroup.add(shine);
}

// End first screen================================

onWindowResize();

window.addEventListener("resize", onWindowResize, false);
document.addEventListener("mousemove", move);

function move(evt) {
  uniforms.u_mouse.value.x = evt.touches ? evt.touches[0].clientX : evt.clientX;
  uniforms.u_mouse.value.y = evt.touches ? evt.touches[0].clientY : evt.clientY;
}

function onWindowResize(event) {
  const aspectRatio = window.innerWidth / window.innerHeight;
  let width, height;
  if (aspectRatio >= 2 / 1.5) {
    console.log("resize: Use width");
    width = 1;
    height = (window.innerHeight / window.innerWidth) * width;
  } else {
    console.log("resize: Use height");
    height = 1.5 / 2;
    width = (window.innerWidth / window.innerHeight) * height;
  }
  camera.left = -width;
  camera.right = width;
  camera.top = height;
  camera.bottom = -height;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = window.innerWidth;
  uniforms.u_resolution.value.y = window.innerHeight;
}

let starIndex = 0;
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  starGroup.children.forEach((object) => {
    if (object.material) {
      if (starIndex % 2 === 0) {
        object.scale.set(
          Math.abs(Math.sin(elapsedTime) * 1),
          Math.abs(Math.sin(elapsedTime) * 1)
        );
      } else {
        object.scale.set(
          Math.abs(Math.cos(elapsedTime) * 1),
          Math.abs(Math.cos(elapsedTime) * 1)
        );
      }
      if (index == -1) {
        object.material.opacity = 1;
      } else {
        object.material.opacity = 0;
      }

      starIndex++;
    }
  });
  snowGroup.children.forEach((object) => {
    if (object.material) {
      object.position.y += -0.001;
      if (object.position.y <= -0.5) {
        object.position.y = 1;
      }

      if (index == 0) {
        object.material.opacity = 1;
      } else {
        object.material.opacity = 0;
      }

      starIndex++;
    }
  });
  shineGroup.children.forEach((object) => {
    if (object.material) {
      object.position.y += 0.001;
      if (object.position.y >= 0.5) {
        object.position.y = -1;
      }

      if (index == 1) {
        object.material.opacity = 1;
      } else {
        object.material.opacity = 0;
      }

      starIndex++;
    }
  });
  cloud1Group.children.forEach((object) => {
    if (object.material) {
      object.position.x += 0.0003;
      if (object.position.x >= 1.5) {
        object.position.x = -1.5;
      }
    }
  });

  if (uniforms.u_time.value < uniforms.u_duration.value) {
    uniforms.u_time.value += delta;
  } else {
    uniforms.u_time.value = uniforms.u_duration.value;
  }
  renderer.render(scene, camera);
}

const images = [];
const loader = new THREE.TextureLoader();
loader.setPath(
  "https://cdn.jsdelivr.net/gh/mgohar/parvarish_hero_animation@1.0.10/src/Assets/"
);
loader.wrapS = THREE.RepeatWrapping;
loader.wrapT = THREE.RepeatWrapping;
loadNextImage(loader);
const circle = document.querySelector(".bz-circle");

function loadNextImage(loader) {
  index++;
  if (index > 3) {
    index = 0;
    uniforms.u_tex_1.value = images[0];
    uniforms.u_tex_2.value = images[1];
    uniforms.u_time.value = 0;

    const circle = document.querySelector(".bz-circle");
    setTimeout(() => {
      circle.style.transform = `translate(${(window.innerWidth - 60) / 2}px, ${
        (window.innerHeight - 60) / 2
      }px)`;
    }, 60);

    next.onclick = function (e) {
      uniforms.u_time.value = 0;

      index++;
      console.log("E:", e);
      const followImage = document.querySelector(`.bz-circle-image`);
      const imageContainer = document.querySelector(`.bz-circle`);
      const circle = document.querySelector(".bz-circle");

      const x =
        e.clientX - container.offsetLeft - imageContainer.offsetWidth / 2;
      const y =
        e.clientY - container.offsetTop - imageContainer.offsetHeight / 2;
      const x1 = e.clientX - container.offsetLeft - followImage.offsetWidth / 2;
      const y1 = e.clientY - container.offsetTop - followImage.offsetHeight / 2;
      imageContainer.style.transition = "all 0.2s ease";
      if (window.innerWidth <= 576) {
        circle.style.height = "10px";
        circle.style.width = "10px";
        circle.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        setTimeout(() => {
          circle.style.height = "60px";
          circle.style.width = "60px";
          circle.style.transform = `translate(${x}px, ${y}px)`;
        }, 400);
      } else {
        circle.style.height = "20px";
        circle.style.width = "20px";
        circle.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        setTimeout(() => {
          circle.style.height = "200px";
          circle.style.width = "200px";
          circle.style.transform = `translate(${x}px, ${y}px)`;
        }, 400);
      }

      switch (index) {
        case 0:
          uniforms.u_tex_1.value = images[0];
          uniforms.u_tex_2.value = images[1];
          followImage.src = `https://cdn.jsdelivr.net/gh/mgohar/parvarish_hero_animation@1.0.10/src/Assets/bg_${2}.png`;
          break;
        case 1:
          uniforms.u_tex_1.value = images[1];
          uniforms.u_tex_2.value = images[2];
          followImage.src = `https://cdn.jsdelivr.net/gh/mgohar/parvarish_hero_animation@1.0.10/src/Assets/bg_${3}.png`;
          break;
        case 2:
          uniforms.u_tex_1.value = images[2];
          uniforms.u_tex_2.value = images[3];
          followImage.src = `https://cdn.jsdelivr.net/gh/mgohar/parvarish_hero_animation@1.0.10/src/Assets/bg_${0}.png`;
          break;
        case 3:
          uniforms.u_tex_1.value = images[3];
          uniforms.u_tex_2.value = images[0];
          followImage.src = `https://cdn.jsdelivr.net/gh/mgohar/parvarish_hero_animation@1.0.10/src/Assets/bg_${1}.png`;
          index = -1;
          break;

        default:
          break;
      }
    };

    animate();
  } else {
    loader.load(`${devicePrefex}${index}.png`, function (tex) {
      images.push(tex);
      loadNextImage(loader);
    });
  }
}

// Use a switch statement to apply different styles based on screen size
function applyStylesBasedOnScreenSize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (windowWidth >= 1400) {
    setTimeout(() => {
      circle.style.transform = `translate(${(window.innerWidth - 200) / 2}px, ${
        (window.innerHeight - 200) / 2
      }px)`;
    }, 0);
    devicePrefex = "bg_";
    console.log("XX-L screen", windowWidth, windowHeight);
  } else if (windowWidth >= 1200) {
    setTimeout(() => {
      circle.style.transform = `translate(${(window.innerWidth - 200) / 2}px, ${
        (window.innerHeight - 200) / 2
      }px)`;
    }, 0);
    devicePrefex = "bg_";
    console.log("Extra-large screen", windowWidth, windowHeight);
  } else if (windowWidth >= 992) {
    setTimeout(() => {
      // circle.style.transform = `translate(${(window.innerWidth - 200) / 2}px, ${
      //   (window.innerHeight - 200) / 2
      // }px)`;
    }, 0);
    devicePrefex = "md_";
    console.log("Large screen", windowWidth, windowHeight);
  } else if (windowWidth >= 576) {
    setTimeout(() => {
      circle.style.transform = `translate(${(window.innerWidth - 60) / 2}px, ${
        (window.innerHeight - 60) / 2
      }px)`;
    }, 0);
    devicePrefex = "md_";
    console.log("Medium screen", windowWidth, windowHeight);
  } else {
    setTimeout(() => {
      circle.style.transform = `translate(${(window.innerWidth - 60) / 2}px, ${
        (window.innerHeight - 60) / 2
      }px)`;
    }, 0);
    devicePrefex = "sm_";
    FOV = 41;
    console.log("Small screen", windowWidth, windowHeight);
  }

  if (windowHeight > 1000) {
    FOV = 53;
    planeWidth = 1.779;
  } else if (windowHeight > 900) {
    FOV = 48;
    planeWidth = 1.8;
  }
}

// Call the function when the page loads and when the window is resized
window.addEventListener("load", applyStylesBasedOnScreenSize);
window.addEventListener("resize", applyStylesBasedOnScreenSize);
