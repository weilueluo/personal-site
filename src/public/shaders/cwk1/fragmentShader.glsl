
// #define SOLUTION_CYLINDER_AND_PLANE
// #define SOLUTION_SHADOW
// #define SOLUTION_REFLECTION_REFRACTION
// #define SOLUTION_FRESNEL
// #define SOLUTION_BLOB

precision highp float;
uniform ivec2 viewport; 

struct PointLight {
	vec3 position;
	vec3 color;
};

struct Material {
	vec3  diffuse;
	vec3  specular;
	float glossiness;
#ifdef SOLUTION_REFLECTION_REFRACTION
	float reflectionFactor;
	float refractionIndex;
	float refractionFactor;
#endif
};

struct Sphere {
	vec3 position;
	float radius;
	Material material;
};

struct Plane {
	vec3 normal;
	float d;
	Material material;
};

struct Cylinder {
	vec3 position;
	vec3 direction;  
	float radius;
	Material material;
};

const int blobSphereCount = 3;

struct Blob {
	float isoValue;
	vec3 spherePositions[blobSphereCount];
	Material material;
};

const int lightCount = 2;
const int sphereCount = 3;
const int planeCount = 1;
const int cylinderCount = 2;

struct Scene {
	vec3 ambient;
	PointLight[lightCount] lights;
	Sphere[sphereCount] spheres;
	Plane[planeCount] planes;
	Cylinder[cylinderCount] cylinders;
	Blob blob;
};

struct Ray {
	vec3 origin;
	vec3 direction;
};

// Contains all information pertaining to a ray/object intersection
struct HitInfo {
	bool hit;
	float t;
	vec3 position;
	vec3 normal;
	Material material;
	bool enteringPrimitive;
};

HitInfo getEmptyHit() {
	return HitInfo(
		false, 
		0.0, 
		vec3(0.0), 
		vec3(0.0),
#ifdef SOLUTION_REFLECTION_REFRACTION		
		Material(vec3(0.0), vec3(0.0), 0.0, 0.0, 0.0, 0.0),  // default 1, 1 for empty hit
#else
		Material(vec3(0.0), vec3(0.0), 0.0),
#endif
		false);
}

// Sorts the two t values such that t1 is smaller than t2
void sortT(inout float t1, inout float t2) {
	// Make t1 the smaller t
	if(t2 < t1)  {
		float temp = t1;
		t1 = t2;
		t2 = temp;
	}
}

// Tests if t is in an interval
bool isTInInterval(const float t, const float tMin, const float tMax) {
	return t > tMin && t < tMax;
}

// Get the smallest t in an interval
bool getSmallestTInInterval(float t0, float t1, const float tMin, const float tMax, inout float smallestTInInterval) {
  
	sortT(t0, t1);

	// As t0 is smaller, test this first
	if(isTInInterval(t0, tMin, tMax)) {
		smallestTInInterval = t0;
		return true;
	}

	// If t0 was not in the interval, still t1 could be
	if(isTInInterval(t1, tMin, tMax)) {
		smallestTInInterval = t1;
		return true;
	}  

	// None was
	return false;
}

HitInfo intersectSphere(const Ray ray, const Sphere sphere, const float tMin, const float tMax) {
              
    vec3 to_sphere = ray.origin - sphere.position;
  
    float a = dot(ray.direction, ray.direction);
    float b = 2.0 * dot(ray.direction, to_sphere);
    float c = dot(to_sphere, to_sphere) - sphere.radius * sphere.radius;
    float D = b * b - 4.0 * a * c;
    if (D > 0.0)
    {
		float t0 = (-b - sqrt(D)) / (2.0 * a);
		float t1 = (-b + sqrt(D)) / (2.0 * a);
      
      	float smallestTInInterval;
      	if(!getSmallestTInInterval(t0, t1, tMin, tMax, smallestTInInterval)) {
          return getEmptyHit();
        }
      
      	vec3 hitPosition = ray.origin + smallestTInInterval * ray.direction;      
		
		//Checking if we're inside the sphere by checking if the ray's origin is inside. If we are, then the normal 
		//at the intersection surface points towards the center. Otherwise, if we are outside the sphere, then the normal 
		//at the intersection surface points outwards from the sphere's center. This is important for refraction.
      	vec3 normal = 
          	length(ray.origin - sphere.position) < sphere.radius + 0.001? 
          	-normalize(hitPosition - sphere.position): 
      		normalize(hitPosition - sphere.position);      
		
		//Checking if we're inside the sphere by checking if the ray's origin is inside,
		// but this time for IOR bookkeeping. 
		//If we are inside, set a flag to say we're leaving. If we are outside, set the flag to say we're entering.
		//This is also important for refraction.
		bool enteringPrimitive = 
          	length(ray.origin - sphere.position) < sphere.radius + 0.001 ? 
          	false:
		    true; 

        return HitInfo(
          	true,
          	smallestTInInterval,
          	hitPosition,
          	normal,
          	sphere.material,
			enteringPrimitive);
    }
    return getEmptyHit();
}

HitInfo intersectPlane(const Ray ray,const Plane plane, const float tMin, const float tMax) {
#ifdef SOLUTION_CYLINDER_AND_PLANE
	float d_n = dot(ray.direction, plane.normal);
	if (d_n == 0.0) {
		// plane parallel to ray
		return getEmptyHit(); 
	}
	vec3 planePosition = plane.normal * plane.d;
	float t = (dot(planePosition, plane.normal) - dot(ray.origin, plane.normal)) / d_n;
	
	vec3 normal;
	bool enteringPrimitive;
	if (ray.origin.y > planePosition.y) {  // if hitting from above
		normal = plane.normal;
		//enteringPrimitive = true;
	} else {
		normal = -plane.normal;
		//enteringPrimitive = false;
	}
	if (t >= 0.0 && isTInInterval(t, tMin, tMax)) {
		return HitInfo(
			true,
			t,
			ray.origin + t * ray.direction,
			normal,
			plane.material,
			false
		);
	}
#endif  
	return getEmptyHit();
}

float lengthSquared(vec3 x) {
	return dot(x, x);
}

HitInfo intersectCylinder(const Ray ray, const Cylinder cylinder, const float tMin, const float tMax) {
#ifdef SOLUTION_CYLINDER_AND_PLANE
	// pa = cylinder position
	// va = cylinder direction
	// r = radius
	// p = ray position
	// v = ray direction
	// t = ray t
	
	// a = (v-(v,va)va)^2
	// b =2(v-(v,va)va, delta_p - (delta_p, va)va)
	// c = (delta_p - (delta_p, va)va)^2 -r^2
	// delta_p = p-pa
	
	//struct Cylinder {
	//	vec3 position;
	//	vec3 direction;  
	//	float radius;
	//	Material material;
	//};
	
	vec3 delta_p = ray.origin - cylinder.position;
	float vva = dot(ray.direction, cylinder.direction);
	vec3 vvvava = ray.direction - (vva * cylinder.direction);
	float a = dot(vvvava, vvvava);
	float b = 2.0 * dot(vvvava, delta_p - dot(delta_p, cylinder.direction) * cylinder.direction);
	
	vec3 dpdpvava = delta_p - dot(delta_p, cylinder.direction) * cylinder.direction;
	float c = dot(dpdpvava, dpdpvava) - pow(cylinder.radius, 2.0);
	
	float determinant = (b * b) - (4.0 * a * c);
    if (determinant > 0.0)
    {
		float t0 = (-b - sqrt(determinant)) / (2.0 * a);
		float t1 = (-b + sqrt(determinant)) / (2.0 * a);
      
      	float smallestTInInterval;
      	if(!getSmallestTInInterval(t0, t1, tMin, tMax, smallestTInInterval)) {
          return getEmptyHit();
        }
		vec3 hitPosition = ray.origin + smallestTInInterval * ray.direction;
		vec3 hitPositionOnAxis = cylinder.position + dot((hitPosition-cylinder.position), cylinder.direction) * cylinder.direction;
		vec3 axisToHitPosition = hitPosition - hitPositionOnAxis;
      	vec3 normal = normalize(axisToHitPosition);   
		bool enteringPrimitive = length(ray.origin - hitPositionOnAxis) >= (cylinder.radius + 0.001);

        return HitInfo(
          	true,
          	smallestTInInterval,
          	hitPosition,
          	normal,
          	cylinder.material,
			enteringPrimitive
		);
	}
	
#endif  
    return getEmptyHit();
}

uniform float time;

HitInfo intersectBlob(const Ray ray, const Blob blob, const float tMin, const float tMax) {
#ifdef SOLUTION_BLOB
#else
	// Put your blob intersection code here!
#endif
    return getEmptyHit();
}

HitInfo getBetterHitInfo(const HitInfo oldHitInfo, const HitInfo newHitInfo) {
	if(newHitInfo.hit)
  		if(newHitInfo.t < oldHitInfo.t)  // No need to test for the interval, this has to be done per-primitive
          return newHitInfo;
  	return oldHitInfo;
}

HitInfo intersectScene(const Scene scene, const Ray ray, const float tMin, const float tMax) {
	HitInfo bestHitInfo;
	bestHitInfo.t = tMax;
	bestHitInfo.hit = false;
	
	bool blobSolo = false;	
#ifdef SOLUTION_BLOB
	blobSolo = true;
#endif
	
	if(blobSolo) {
		bestHitInfo = getBetterHitInfo(bestHitInfo, intersectBlob(ray, scene.blob, tMin, tMax));		
	} else {
		for (int i = 0; i < planeCount; ++i) {
			bestHitInfo = getBetterHitInfo(bestHitInfo, intersectPlane(ray, scene.planes[i], tMin, tMax));
		}

		for (int i = 0; i < sphereCount; ++i) {
			bestHitInfo = getBetterHitInfo(bestHitInfo, intersectSphere(ray, scene.spheres[i], tMin, tMax));
		}

		for (int i = 0; i < cylinderCount; ++i) {
			bestHitInfo = getBetterHitInfo(bestHitInfo, intersectCylinder(ray, scene.cylinders[i], tMin, tMax));
		}
	}
	
	return bestHitInfo;
}

vec3 shadeFromLight(
  const Scene scene,
  const Ray ray,
  const HitInfo hit_info,
  const PointLight light)
{ 
  vec3 hitToLight = light.position - hit_info.position;
  
  vec3 lightDirection = normalize(hitToLight);
  vec3 viewDirection = normalize(hit_info.position - ray.origin);
  vec3 reflectedDirection = reflect(viewDirection, hit_info.normal);
  float diffuse_term = max(0.0, dot(lightDirection, hit_info.normal));
  float specular_term  = pow(max(0.0, dot(lightDirection, reflectedDirection)), hit_info.material.glossiness);

#ifdef SOLUTION_SHADOW
	float visibility = 1.0;
	if (hit_info.hit) {
		Ray hitToLightRay;
		hitToLightRay.origin = hit_info.position;
		hitToLightRay.direction = lightDirection;
		HitInfo hitToLightHitInfo = intersectScene(scene, hitToLightRay, 0.0001, length(hitToLight));
		if (hitToLightHitInfo.hit) {
			visibility = 0.0;
		}
	}
#else
  // Put your shadow test here
  float visibility = 1.0;
#endif

  return 	visibility * 
    		light.color * (
    		specular_term * hit_info.material.specular +
      		diffuse_term * hit_info.material.diffuse);
}

vec3 background(const Ray ray) {
  // A simple implicit sky that can be used for the background
  return vec3(0.2) + vec3(0.8, 0.6, 0.5) * max(0.0, ray.direction.y);
}

// It seems to be a WebGL issue that the third parameter needs to be inout instea dof const on Tobias' machine
vec3 shade(const Scene scene, const Ray ray, inout HitInfo hitInfo) {
  
  	if(!hitInfo.hit) {
  		return background(ray);
  	}
	
	//return vec3(0.5) * hitInfo.normal + vec3(0.5);
  
    vec3 shading = scene.ambient * hitInfo.material.diffuse;
    for (int i = 0; i < lightCount; ++i) {
        shading += shadeFromLight(scene, ray, hitInfo, scene.lights[i]); 
    }
    return shading;
}


Ray getFragCoordRay(const vec2 frag_coord) {
  	float sensorDistance = 1.0;
  	vec2 sensorMin = vec2(-1, -0.5);
  	vec2 sensorMax = vec2(1, 0.5);
  	vec2 pixelSize = (sensorMax- sensorMin) / vec2(viewport.x, viewport.y);
  	vec3 origin = vec3(0, 0, sensorDistance);
    vec3 direction = normalize(vec3(sensorMin + pixelSize * frag_coord, -sensorDistance));  
  
  	return Ray(origin, direction);
}

void reflect(const in Ray ray, const in HitInfo hitInfo, out vec3 reflectDirection) {
	vec3 hitToRay = normalize(ray.origin - hitInfo.position);
	reflectDirection = -hitToRay + 2.0 * max(0.0, dot(hitInfo.normal, hitToRay)) * hitInfo.normal;
}

void refract(const in Ray ray, const in HitInfo hitInfo, const in float sourceIOR, const in float destIOR,
			 out bool totalInternalReflection, out vec3 refractDirection) {
	vec3 hitToRay = normalize(ray.origin - hitInfo.position);

	float eta12 = sourceIOR / destIOR;
	float alpha = acos(dot(hitToRay, hitInfo.normal));
	float root = 1.0 + pow(eta12, 2.0) * (pow(cos(alpha), 2.0) - 1.0);
	
	totalInternalReflection = root < 0.0;
	refractDirection = (-eta12 * hitToRay) + (hitInfo.normal * (eta12 * cos(alpha) - sqrt(root)));
}

float fresnel(const in Ray ray, const in HitInfo hitInfo, const in float eta2, const in float eta1) {
#ifdef SOLUTION_FRESNEL
	// https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-shading/reflection-refraction-fresnel
	bool totalInternalReflection;
	vec3 refractDirection;
	refract(ray, hitInfo, eta2, eta1, totalInternalReflection, refractDirection);
	if (totalInternalReflection) {
		return 1.0;
	}
	
	vec3 rayToHit = normalize(hitInfo.position - ray.origin);
	float cos1 = dot(rayToHit, hitInfo.normal);
	float cos2 = dot(refractDirection, hitInfo.normal);
	
	float reflectS = pow(((eta2 * cos1 - eta1 * cos2) / (eta2 * cos1 + eta1 * cos2)), 2.0);
	float reflectP = pow(((eta1 * cos2 - eta2 * cos1) / (eta1 * cos2 + eta2 * cos1)), 2.0);
	
	float reflectance = (reflectS + reflectP) / 2.0;
	
	return reflectance;
#else
  	// Put your code to compute the Fresnel effect here
	return 1.0;
#endif
}

vec3 colorForFragment(const Scene scene, const vec2 fragCoord) {
      
    Ray initialRay = getFragCoordRay(fragCoord);  
  	HitInfo initialHitInfo = intersectScene(scene, initialRay, 0.001, 10000.0);  
  	vec3 result = shade(scene, initialRay, initialHitInfo);
	
  	Ray currentRay;
  	HitInfo currentHitInfo;
  	
  	// Compute the reflection
  	currentRay = initialRay;
  	currentHitInfo = initialHitInfo;
  	
  	// The initial strength of the reflection
  	float reflectionWeight = 1.0;
	
  	float currentIOR = 1.0;
  	
  	const int maxReflectionStepCount = 2;
  	for(int i = 0; i < maxReflectionStepCount; i++) {
      
      if(!currentHitInfo.hit) break;
      
#ifdef SOLUTION_REFLECTION_REFRACTION
		reflectionWeight *= currentHitInfo.material.reflectionFactor;
#else
#endif
      
#ifdef SOLUTION_FRESNEL
		float reflectRate = fresnel(currentRay, currentHitInfo, currentIOR, currentHitInfo.material.refractionIndex);
		reflectionWeight *= reflectRate;
#else
      // Replace with Fresnel code
#endif
      
      Ray nextRay;
#ifdef SOLUTION_REFLECTION_REFRACTION
		nextRay.origin = currentHitInfo.position;
		reflect(currentRay, currentHitInfo, nextRay.direction);
		currentIOR = currentHitInfo.material.refractionIndex;
#else
#endif
      currentRay = nextRay;
      
      currentHitInfo = intersectScene(scene, currentRay, 0.001, 10000.0);    
            
      result += reflectionWeight * shade(scene, currentRay, currentHitInfo);
    }
  
  	// Compute the refraction
  	currentRay = initialRay;  
  	currentHitInfo = initialHitInfo;
   
  	// The initial medium is air
  	currentIOR = 1.0;

  	// The initial strength of the refraction.
  	float refractionWeight = 1.0;
  
  	const int maxRefractionStepCount = 2;
  	for(int i = 0; i < maxRefractionStepCount; i++) {
      
#ifdef SOLUTION_REFLECTION_REFRACTION
		refractionWeight *= currentHitInfo.material.refractionFactor;
#else
      // Replace with Fresnel code
#endif

#ifdef SOLUTION_FRESNEL
		float reflectRate = fresnel(currentRay, currentHitInfo, currentIOR, currentHitInfo.material.refractionIndex);
		refractionWeight *= (1.0 - reflectRate);
#else
      // Put Fresnel code here
#endif      

      Ray nextRay;

#ifdef SOLUTION_REFLECTION_REFRACTION      
		float sourceIOR = currentIOR;
		float destIOR = currentHitInfo.enteringPrimitive ? currentHitInfo.material.refractionIndex : 1.0;
		
		nextRay.origin = currentHitInfo.position;

		bool totalInternalRefraction;
		refract(currentRay, currentHitInfo, sourceIOR, destIOR, totalInternalRefraction, nextRay.direction);
		if (totalInternalRefraction) {
			break;
		}
		
		currentRay = nextRay;
		currentIOR = destIOR;
#else
	// Put your code to compute the reflection ray and track the IOR
#endif
      currentHitInfo = intersectScene(scene, currentRay, 0.001, 10000.0);
            
      result += refractionWeight * shade(scene, currentRay, currentHitInfo);
      
      if(!currentHitInfo.hit) break;
    }
  return result;
}


Material getDefaultMaterial() {
#ifdef SOLUTION_REFLECTION_REFRACTION
	return Material(vec3(0.3), vec3(0), 0.0, 0.0, 0.0, 0.0);  // default reflection and refrative index = 1
#else
  return Material(vec3(0.3), vec3(0), 0.0);
#endif
}

Material getPaperMaterial() {
#ifdef SOLUTION_REFLECTION_REFRACTION
	return Material(vec3(0.7, 0.7, 0.7), 
					vec3(0, 0, 0), 
					5.0,
					0.0,
					0.0,  // https://www.engineeringtoolbox.com/light-material-reflecting-factor-d_1842.html
				   	0.0  // https://www.spiedigitallibrary.org/conference-proceedings-of-spie/6053/60530X/Determination-of-the-refractive-index-of-paper-with-clearing-agents/10.1117/12.660416.short
				   );
#else
  return Material(vec3(0.7, 0.7, 0.7), vec3(0, 0, 0), 5.0);
#endif
}

Material getPlasticMaterial() {
#ifdef SOLUTION_REFLECTION_REFRACTION
	return Material(vec3(0.9, 0.3, 0.1), 
					vec3(1.0), 
					10.0,
					0.5,  // lowered to make it closer to cwk pdf https://www.3rxing.org/question/91b899a2cd644117448.html#:~:text=%E4%BA%BA%E7%9A%84%E6%89%8B%E6%8E%8C%E5%BF%83%20%20%20%20%20%20%20%20%20%20%20%2075%25-,%E4%B8%8D%E9%80%8F%E6%98%8E%E7%99%BD%E8%89%B2%E5%A1%91%E6%96%99%20%20%20%20%20%20%20%2087%25,-%E7%99%BD%E7%94%BB%E7%BA%B8
					1.45, // https://www.addoptics.nl/optics-explained/refractive-index-of-plastic/#:~:text=Most%20plastics%20have%20a%20refractive,range%20of%201.3%20to%201.6.
					0.0
				   );
#else
	return Material(vec3(0.9, 0.3, 0.1), vec3(1.0), 10.0);
#endif
}

Material getGlassMaterial() {
#ifdef SOLUTION_REFLECTION_REFRACTION
	return Material(vec3(0.0), 
					vec3(0.0), 
					5.0,
					// http://www1.udel.edu/chem/sneal/sln_tchng/CHEM620/CHEM620/Chi_4._Light_at_Interfaces.html#:~:text=For%20glass%20and%20air%2C%20which,the%20reflection
					0.96, 
					1.5,
					1.0
				   );
#else
	return Material(vec3(0.0), vec3(0.0), 5.0);
#endif
}

Material getSteelMirrorMaterial() {
#ifdef SOLUTION_REFLECTION_REFRACTION
	return Material(vec3(0.1), 
					vec3(0.3), 
					20.0,
					0.5,  // https://www.engineeringtoolbox.com/light-material-reflecting-factor-d_1842.html
				    3.3,  // https://www.filmetrics.com/refractive-index-database/Stainless-Steel#:~:text=For%20a%20typical%20sample%20of,nm%20are%202.75681%20and%203.792016.
					0.0
				   );
#else
	return Material(vec3(0.1), vec3(0.3), 20.0);
#endif
}

Material getMetaMaterial() {
#ifdef SOLUTION_REFLECTION_REFRACTION
	return Material(vec3(0.1, 0.2, 0.5), vec3(0.3, 0.7, 0.9), 20.0, 0.0, 0.0, 0.0);  // TODO: what is meta material
#else
	return Material(vec3(0.1, 0.2, 0.5), vec3(0.3, 0.7, 0.9), 20.0);
#endif
}

vec3 tonemap(const vec3 radiance) {
  const float monitorGamma = 2.0;
  return pow(radiance, vec3(1.0 / monitorGamma));
}

void main() {
	// Setup scene
	Scene scene;
	scene.ambient = vec3(0.12, 0.15, 0.2);

	// Lights
	scene.lights[0].position = vec3(5, 15, -5);
	scene.lights[0].color    = 0.5 * vec3(0.9, 0.5, 0.1);

	scene.lights[1].position = vec3(-15, 5, 2);
	scene.lights[1].color    = 0.5 * vec3(0.1, 0.3, 1.0);

	// Primitives
	scene.spheres[0].position            	= vec3(10, -5, -16);
	scene.spheres[0].radius              	= 6.0;
	scene.spheres[0].material 				= getPaperMaterial();

	scene.spheres[1].position            	= vec3(-7, -2, -13);
	scene.spheres[1].radius             	= 4.0;
	scene.spheres[1].material				= getPlasticMaterial();

	scene.spheres[2].position            	= vec3(0, 0.5, -5);
	scene.spheres[2].radius              	= 2.0;
	scene.spheres[2].material   			= getGlassMaterial();

	scene.planes[0].normal            		= normalize(vec3(0, 0.8, 0));
	scene.planes[0].d              			= -4.5;
	scene.planes[0].material				= getSteelMirrorMaterial();

	scene.cylinders[0].position            	= vec3(-1, 1, -26);
	scene.cylinders[0].direction            = normalize(vec3(-2, 2, -1));
	scene.cylinders[0].radius         		= 1.5;
	scene.cylinders[0].material				= getPaperMaterial();

	scene.cylinders[1].position            	= vec3(4, 1, -5);
	scene.cylinders[1].direction            = normalize(vec3(1, 4, 1));
	scene.cylinders[1].radius         		= 0.4;
	scene.cylinders[1].material				= getPlasticMaterial();
	
	scene.blob.isoValue 					= 0.3;
	scene.blob.material 					= getMetaMaterial();	
	
	const bool animateBlobs = false;
	if(animateBlobs) {
		scene.blob.spherePositions[0] 			= vec3(+3.0 + sin(time * 3.0) * 3.0, -1, -12);
		scene.blob.spherePositions[1] 			= vec3(-1, +3, -12.0 + 3.0 * sin(time));
		scene.blob.spherePositions[2] 			= vec3(-3, -1.0 + 3.0 * cos(2.0 * time), -9);		
	} else {
		scene.blob.spherePositions[0] 			= vec3(+3, -0, -11);
		scene.blob.spherePositions[1] 			= vec3(-1, +4, -12);
		scene.blob.spherePositions[2] 			= vec3(-2, -2, -9);		
	}

	// compute color for fragment
	gl_FragColor.rgb = tonemap(colorForFragment(scene, gl_FragCoord.xy));
	gl_FragColor.a = 1.0;

}
