// 1. Create Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

// 2. Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1d2126); // Dark background
document.body.appendChild(renderer.domElement);

// 3. Lighting setup
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 5, 5);  // Main light positioned at an angle to create shading contrast
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040, 2));  // Increased ambient light to keep the sphere light but dynamic

// 4. Add a bottom-left rim light
const rimLight = new THREE.PointLight(0xFFFFFF, 0.5, 50); // Soft rim light with lower intensity
rimLight.position.set(-2, -2, 2); // Position the rim light at the bottom-left of the sphere
scene.add(rimLight);

// 5. Create a geodesic sphere (icosphere)
const geometry = new THREE.IcosahedronGeometry(1, 3); // More subdivisions for smoothness
const material = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0, // Off-white for a lighter overall color
    roughness: 0.6,  // Slight roughness for texture detail
    metalness: 0.1,  // Light metallic effect
    flatShading: true,  // Maintain hard edges for polygonal look
    emissive: 0x1d2126,  // Subtle emissive to enhance depth in darker areas
    emissiveIntensity: 0.05, // Subtle glow for depth without affecting highlights
});

// Create the sphere mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Convert to BufferGeometry for vertex manipulation
const positions = geometry.attributes.position.array;
const originalPositions = new Float32Array(positions.length);
originalPositions.set(positions);

// 6. Track mouse position
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let hitLocal = null;

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// 7. Set deformation limits and thresholds
const maxDeformationDistance = 0.2;
const returnSpeed = 0.03;
const influenceRange = 0.5;
const returnThreshold = 0.03;
const initialMovementSpeed = 0.03;

// 8. Animate function with deformation & rotation handling
function animate() {
    requestAnimationFrame(animate);

    // Raycast to detect intersections with the sphere
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(sphere);

    // Convert intersection points to the sphere's local space
    const inverseWorldMatrix = new THREE.Matrix4().copy(sphere.matrixWorld).invert();
    hitLocal = null;
    if (intersects.length > 0) {
        hitLocal = intersects[0].point.clone().applyMatrix4(inverseWorldMatrix);
    }

    // Go through each vertex and apply smooth deformation
    for (let i = 0; i < positions.length; i += 3) {
        let dx = 0, dy = 0, dz = 0;
        let affected = false;

        // Get the original vertex position (local space)
        const localVertex = new THREE.Vector3(originalPositions[i], originalPositions[i + 1], originalPositions[i + 2]);

        if (hitLocal) {
            // Calculate distance from the intersection point in local space
            const distance = localVertex.distanceTo(hitLocal);

            if (distance < influenceRange) { 
                const force = (1.0 - distance) * initialMovementSpeed;

                // Calculate direction to move the vertex (in X, Y only)
                const deltaX = localVertex.x - hitLocal.x;
                const deltaY = localVertex.y - hitLocal.y;

                // Normalize the direction to only move along the X and Y axes
                const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const normalizedX = deltaX / magnitude;
                const normalizedY = deltaY / magnitude;

                // Apply the deformation (push away from the mouse in X and Y direction only)
                dx = normalizedX * force;
                dy = normalizedY * force;
                affected = true;
            }
        }

        // Apply smooth deformation and movement
        if (affected) {
            // Apply the displacement, but gradually
            positions[i] += dx;
            positions[i + 1] += dy;

            // Clamp the displacement so that it doesn't exceed maxDeformationDistance
            const displacement = new THREE.Vector3(positions[i] - localVertex.x, positions[i + 1] - localVertex.y, positions[i + 2] - localVertex.z);
            if (displacement.length() > maxDeformationDistance) {
                displacement.setLength(maxDeformationDistance);
                positions[i] = localVertex.x + displacement.x;
                positions[i + 1] = localVertex.y + displacement.y;
            }
        } else {
            // Smooth return to original position if not affected by the mouse
            const localReturnDistance = localVertex.distanceTo(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
            if (localReturnDistance > returnThreshold) {
                // Slow down the return speed (lower value results in slower return)
                positions[i] = THREE.MathUtils.lerp(positions[i], localVertex.x, returnSpeed);
                positions[i + 1] = THREE.MathUtils.lerp(positions[i + 1], localVertex.y, returnSpeed);
                positions[i + 2] = THREE.MathUtils.lerp(positions[i + 2], localVertex.z, returnSpeed);
            }
        }
    }

    geometry.attributes.position.needsUpdate = true;

    // Rotate the sphere slightly for a natural dynamic effect
    sphere.rotation.x += 0.002;
    sphere.rotation.y += 0.002;

    renderer.render(scene, camera);
}

animate();
