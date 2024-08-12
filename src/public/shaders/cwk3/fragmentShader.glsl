// #define SOLUTION_LIGHT
// #define SOLUTION_BOUNCE
// #define SOLUTION_THROUGHPUT
// #define SOLUTION_HALTON
// #define SOLUTION_AA
// #define SOLUTION_IS 

// this is a flag to turn on unit test
// the pixels on screen should converge to (0.5, 0.5, 0.5), which is a gray color
// this is because I converted direction to color by changing the range of values from (-1, 1) to (0, 1), so that we can see
// the convergence more smoothly (because color has no negative value, but direction has) and therefore the expectation becomes 0.5,
// this also test if the direction has volume of 1.0, which made use of the lengthSquare method (the third method), if this fails the pixel color will be black.
// It is very ambiguous in the pdf what test it is referring to, so I implemented the above two tests.
// btw unit test is meant to be deterministic, self-contained, quickly executed and can be automated, which fails to satisify here.
//#define TEST_RANDOM_DIRECTION

// for enabling direct light sampling (light intensity/emissiveness weighted in pdf) importance sampling
// this method is extended to multiple light sources and verified if spheres has very different positions,
// you can use the flags below to test it.
// #define LIGHT_INTENSITY_WEIGHTED

// uncomment to return the direction of the first iteration sample instead.
// use this to test if the direct light sampling importance sampling is really doing the correct thing
// some color references:
// red: left
// green: upwards
// blue: backwards
// black: downwards
//#define LIGHT_DIRECTION_TEST

// uncomment to change the position to verify implementation,
// this swap the y-axis of the two lights
//#define CHANGE_LIGHT_POSITION

// uncomment change the intensity to verify implementation
// this reduce the intensity of the small ball (left ball),
// a obvious observation will be it converge to black slower when LIGHT_DIRECTION_TEST is also turned on
//#define CHANGE_LIGHT_INTENSITY

precision highp float;

#define M_PI 3.1415

struct Material {
#ifdef SOLUTION_LIGHT
	float intensity;
	vec3 emissiveness;
#endif
  vec3 diffuse;
  vec3 specular;
  float glossiness;
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

const int sphereCount = 4;
const int planeCount = 4;
const int emittingSphereCount = 2;
#ifdef SOLUTION_BOUNCE
const int maxPathLength = 3;
#else
const int maxPathLength = 1;
#endif

struct Scene {
  Sphere[sphereCount] spheres;
  Plane[planeCount] planes;
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
};

// Contains info to sample a direction and this directions probability
struct DirectionSample {
	vec3 direction;
	float probability;
};

HitInfo getEmptyHit() {
  Material emptyMaterial;
#ifdef SOLUTION_LIGHT
	emptyMaterial.emissiveness = vec3(0.0);
#endif
  emptyMaterial.diffuse = vec3(0.0);
  emptyMaterial.specular = vec3(0.0);
  emptyMaterial.glossiness = 0.0;
  return HitInfo(false, 0.0, vec3(0.0), vec3(0.0), emptyMaterial);
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

      	vec3 normal =
          	length(ray.origin - sphere.position) < sphere.radius + 0.001?
          	-normalize(hitPosition - sphere.position) :
      		normalize(hitPosition - sphere.position);

        return HitInfo(
          	true,
          	smallestTInInterval,
          	hitPosition,
          	normal,
          	sphere.material);
    }
    return getEmptyHit();
}

HitInfo intersectPlane(Ray ray, Plane plane) {
  float t = -(dot(ray.origin, plane.normal) + plane.d) / dot(ray.direction, plane.normal);
  vec3 hitPosition = ray.origin + t * ray.direction;
  return HitInfo(
	true,
	t,
	hitPosition,
	normalize(plane.normal),
	plane.material);
    return getEmptyHit();
}

float lengthSquared(const vec3 x) {
  return dot(x, x);
}

HitInfo intersectScene(Scene scene, Ray ray, const float tMin, const float tMax)
{
    HitInfo best_hit_info;
    best_hit_info.t = tMax;
  	best_hit_info.hit = false;

    for (int i = 0; i < sphereCount; ++i) {
        Sphere sphere = scene.spheres[i];
        HitInfo hit_info = intersectSphere(ray, sphere, tMin, tMax);

        if(	hit_info.hit &&
           	hit_info.t < best_hit_info.t &&
           	hit_info.t > tMin)
        {
            best_hit_info = hit_info;
        }
    }

    for (int i = 0; i < planeCount; ++i) {
        Plane plane = scene.planes[i];
        HitInfo hit_info = intersectPlane(ray, plane);

        if(	hit_info.hit &&
           	hit_info.t < best_hit_info.t &&
           	hit_info.t > tMin)
        {
            best_hit_info = hit_info;
        }
    }

  return best_hit_info;
}

// Converts a random integer in 15 bits to a float in (0, 1)
float randomInetegerToRandomFloat(int i) {
	return float(i) / 32768.0;
}

// Returns a random integer for every pixel and dimension that remains the same in all iterations
int pixelIntegerSeed(const int dimensionIndex) {
  vec3 p = vec3(gl_FragCoord.xy, dimensionIndex);
  vec3 r = vec3(23.14069263277926, 2.665144142690225,7.358926345 );
  return int(32768.0 * fract(cos(dot(p,r)) * 123456.0));
}

// Returns a random float for every pixel that remains the same in all iterations
float pixelSeed(const int dimensionIndex) {
  	return randomInetegerToRandomFloat(pixelIntegerSeed(dimensionIndex));
}

// The global random seed of this iteration
// It will be set to a new random value in each step
uniform int globalSeed;
int randomSeed;
void initRandomSequence() {
  randomSeed = globalSeed + pixelIntegerSeed(0);
}

// Computes integer  x modulo y not available in most WEBGL SL implementations
int mod(const int x, const int y) {
  return int(float(x) - floor(float(x) / float(y)) * float(y));
}

// Returns the next integer in a pseudo-random sequence
int rand() {
  	randomSeed = randomSeed * 1103515245 + 12345;
	return mod(randomSeed / 65536, 32768);
}

// Returns the next float in this pixels pseudo-random sequence
float uniformRandom() {
	return randomInetegerToRandomFloat(rand());
}

// Returns the ith prime number for the first 20
const int maxDimensionCount = 10;
int prime(const int index) {
  if(index == 0) return 2;
  if(index == 1) return 3;
  if(index == 2) return 5;
  if(index == 3) return 7;
  if(index == 4) return 11;
  if(index == 5) return 13;
  if(index == 6) return 17;
  if(index == 7) return 19;
  if(index == 8) return 23;
  if(index == 9) return 29;
  if(index == 10) return 31;
  if(index == 11) return 37;
  if(index == 12) return 41;
  if(index == 13) return 43;
  if(index == 14) return 47;
  if(index == 15) return 53;
  return 2;
}

#ifdef SOLUTION_HALTON
#endif

float halton(const int sampleIndex, const int dimensionIndex) {
#ifdef SOLUTION_HALTON
	// https://en.wikipedia.org/wiki/Halton_sequence
	float b = float(prime(dimensionIndex));
	float i = float(sampleIndex);
	
	float f = 1.0;
	float r = 0.0;
	
	for(int _=0; _ >= 0; _++) { // a loop that is always true
		// while true loop should have condition break at the top
		if (i <= 0.0) {
			break;
		}
		f /= b;  // move to current position at the decimal part
		r += f * mod(i, b);  // get the current position value and offset to that position, concatenate to the result
		i = floor(i / b);  // move to next position, this also ensure this loop will always terminate because it divide by a number larger than 1 at every iteration
	}
	
	// The halton sequence is a great way to generate pseudo random number, so that we can cover the space evenly and avoid unlucky
	// however, since the algorithm is deterministic pixel-wise,
	// it will generate the image with some undesired regular pattern,
	// to avoid this, we can simply add a offset that is unique to each individual pixel,
	// so that every pixel has different sample sequence.
	// To do this, I use the pixelSeed method which returns a random float for every pixel 
	// that remains the same in all iterations per dimension, so that we only offset the pixel by some amount
	// without changing the pattern the of sequence.
	// Note that the pixelSeed method always return a positive float with 16 bits in the integer side and 16 bits in the decimal side,
	// So next I take only the fraction part of the offseted value because it should remain in (0, 1).
	// Note that to avoid increment offset only, we should subtract by 8 bits, however, we only take the decimal side, 
	// and the overflowed value will rotate back starting from zero so it does not matter.
	float offset = pixelSeed(dimensionIndex);
	r = fract(r + offset);
	return r;
#else
  // Put your implementation of halton in the #ifdef above 
  return 0.0;
#endif
}

// This is the index of the sample controlled by the framework.
// It increments by one in every call of this shader
uniform int baseSampleIndex;

// Returns a well-distributed number in (0,1) for the dimension dimensionIndex
float sample(const int dimensionIndex) {
#ifdef SOLUTION_HALTON
	return halton(baseSampleIndex, dimensionIndex);
#else
  // Use the Halton sequence for variance reduction in the #ifdef above
  return uniformRandom();
#endif
}

// This is a helper function to sample two-dimensionaly in dimension dimensionIndex
vec2 sample2(const int dimensionIndex) {
  return vec2(sample(dimensionIndex + 0), sample(dimensionIndex + 1));
}

vec3 sample3(const int dimensionIndex) {
  return vec3(sample(dimensionIndex + 0), sample(dimensionIndex + 1), sample(dimensionIndex + 2));
}

// This is a register of all dimensions that we will want to sample.
// Thanks to Iliyan Georgiev from Solid Angle for explaining proper housekeeping of sample dimensions in ranomdized Quasi-Monte Carlo
//
// So if we want to use lens sampling, we call sample(LENS_SAMPLE_DIMENSION).
//
// There are infinitely many path sampling dimensions.
// These start at PATH_SAMPLE_DIMENSION.
// The 2D sample pair for vertex i is at PATH_SAMPLE_DIMENSION + PATH_SAMPLE_DIMENSION_MULTIPLIER * i + 0
#define ANTI_ALIAS_SAMPLE_DIMENSION 0
#define LENS_SAMPLE_DIMENSION 2
#define PATH_SAMPLE_DIMENSION 4

// This is 2 for two dimensions and 2 as we use it for two purposese: NEE and path connection
#define PATH_SAMPLE_DIMENSION_MULTIPLIER (2 * 2)

vec3 getEmission(const Material material, const vec3 normal) {
#ifdef SOLUTION_LIGHT
	
	// Gamma:
	// The use of gamma is to modify the physical brightness to perceived brightness, this process is called gamma correction.
	// The reason for it is that human eye has greater sensitivity in dark differences than bright differences,
	// and in our coursework, it is defined by the power-law expression: output = A * pow(input, gamma),
	// where A is a constant defined by luminance and gamma is an exponent less than 1 (encoding gamma).
	
	return material.emissiveness * material.intensity;
#else
  	// This is wrong. It just returns the diffuse color so that you see something to be sure it is working.
  	return material.diffuse;
#endif
}

vec3 getReflectance(const Material material, const vec3 normal, const vec3 inDirection, const vec3 outDirection) {
#ifdef SOLUTION_THROUGHPUT
	// physically correct phong model
	float n = material.glossiness;
	vec3 reflectDirection = normalize(reflect(inDirection, normal));
	
	// for energy conservation
	float normFactor = (n + 2.0) / (2.0 * M_PI);
	// the scaling of reflected light it received, which decrease exponentially according to the n parameter of the phong model
	// depending on the angle between the current scattered direction and the actual reflecting direction
	float weight = pow(max(0.0, dot(outDirection, reflectDirection)), n);
	
	return material.specular * normFactor * weight;
#else
  return vec3(1.0);
#endif
}

vec3 getGeometricTerm(const Material material, const vec3 normal, const vec3 inDirection, const vec3 outDirection) {
#ifdef SOLUTION_THROUGHPUT
	// the geometry term is cosine angle between normal and outgoing direction
	// we no need to check if this is negative because it is impossible (unless some floating point error near horizon but I did not observe any), but we can do it if we want
	return vec3(dot(normal, outDirection));
#else
  return vec3(1.0);
#endif
}

vec3 sphericalToEuclidean(float theta, float phi) {
	float x = sin(theta) * cos(phi);
	float y = sin(theta) * sin(phi);
	float z = cos(theta);
	return vec3(x, y, z);
}

// return true if two given float numbers are equal, by a threshold
bool floatEqual(const in float value1, const in float value2) {
	const float threshold = 0.0001;
	
	return abs(value1 - value2) < threshold;
}


vec3 getRandomDirection(const int dimensionIndex) {

#ifdef SOLUTION_BOUNCE
	
	// The two logical parts are the sample2 and sphericalToEuclidean functions
	
	vec2 xi = sample2(dimensionIndex);

	float theta_polar = acos(2.0 * xi[0] - 1.0);
	float phi_azimuthal = xi[1] * 2.0 * M_PI;

	vec3 euclideanDirection = sphericalToEuclidean(theta_polar, phi_azimuthal);

#ifdef TEST_RANDOM_DIRECTION
	// also check out my test here: https://github.com/Redcxx/3d_sphere_random_sampling
	if (!floatEqual(lengthSquared(euclideanDirection), 1.0)) {  
		// if we did not receive a unit vector, then give it black color,
		return vec3(0.0);
	}
#endif

	return euclideanDirection;
#else
	// Put your code to compute a random direction in 3D in the #ifdef above
	return vec3(0);
#endif
}

mat3 transpose(mat3 m) {
	return mat3(
		m[0][0], m[1][0], m[2][0],
		m[0][1], m[1][1], m[2][1],
		m[0][2], m[1][2], m[2][2]
	);
}

// This function creates a matrix to transform from global space into a local space oriented around the normal.
// Might be useful for importance sampling BRDF / the geometric term.
mat3 makeLocalFrame(const vec3 normal) {
#ifdef SOLUTION_IS
	
	// find any new axis for local coordinate system that is perpendicular to normal
	vec3 perpendicular;
	if (abs(normal.x) > abs(normal.y)) {  // whether to use x or y to construct perpendicular axis
		perpendicular = vec3(normal.z, 0, -normal.x) / sqrt(normal.x * normal.x + normal.z * normal.z);
	} else {
		perpendicular = vec3(0, -normal.z, normal.y) / sqrt(normal.y * normal.y + normal.z * normal.z);
	}
    
	// find the third axis by cross product
    vec3 thirdAxis = cross(perpendicular, normal);
	
	// use these three axis to construct a transformation that turn global coordinate system to local
    return mat3(perpendicular, thirdAxis, normal);
	
#else
	return mat3(1.0);
#endif
}

// for importance sampling, we have 3 distributions: 2 light sources + 1 cosine weighted normal
#define N_DISTS 3

// this function normalize the given weights, so that it keeps the relative ratio and sum to 1.0
// effectively same as: weights /= sum(weights)
void normalizeWeights(inout float[N_DISTS] weights) {
	float sum = 0.0;
	for (int i = 0; i < N_DISTS; i++) {
		sum += weights[i];
	}
	for (int i = 0; i < N_DISTS; i++) {
		 weights[i] /= sum;
	}
}

// this function sample according to the given weight, returning the chosen index
int sampleByWeights(float[N_DISTS] weights, int dimensionIndex) {
	float r = sample(dimensionIndex);
	
	// check which weights does that random number falls into
	float accum = 0.0;
	for (int i = 0; i < N_DISTS; i++) {
		accum += weights[i];
		if (r < accum) {
			// it falls into this range
			return i;
		}
	}
	
	// should not happen, if this happened then sum of weights is less than 1.0, but it should be equal to 1.0
	return -1;
}

// square the given number, for readability
float square(float x) {
	return x * x;
}

// sample a direction from the samplePosition to the sphere
vec3 sampleSphericalLight(const int dimensionIndex, const vec3 samplePosition, const Sphere sphere) {
	vec2 xi = sample2(dimensionIndex);
    
    float cosMaxAngle = sqrt(1.0 - square(sphere.radius / length(sphere.position - samplePosition)));
    float theta = acos(1.0 - xi[0] + xi[0] * cosMaxAngle);
    float phi = 2.0 * M_PI * xi[1];
	
	return sphericalToEuclidean(theta, phi);
}

// sample a direction on the hemisphere cosine distribution on the z-axis
vec3 sampleCosine(const int dimensionIndex) {
	vec2 xi = sample2(dimensionIndex);
	
	float theta = asin(sqrt(xi[0]));
	float phi = 2.0 * M_PI * xi[1];
	
	return sphericalToEuclidean(theta, phi); 
}

// return the probability of the sample direction in the distribution of the light sphere sampling,
// return zero if it is not in the sphere direction
float sphereLightProbability(vec3 sampledDirection, Sphere sphere, vec3 samplePosition) {
	
	// tolerence for sampled direction should stay within the light direction
	const float tolerence = 1e-3;
	
	float cosAngleMax = sqrt(1.0 - square(sphere.radius / length(samplePosition - sphere.position)));
	vec3 lightNormal = normalize(sphere.position - samplePosition);
	
	if (dot(lightNormal, sampledDirection) < (cosAngleMax - tolerence)) {
		// not within direction towards the spherical light
		return 0.0;
	}
	
	return 1.0 / (2.0 * M_PI * (1.0 - cosAngleMax));
}

// return the probability of the sample direction in the cosine distribution on given normal
float cosineProbability(vec3 sampledDirection, vec3 normal) {
	float cosTheta = dot(sampledDirection, normal);
	return max(0.0, 1.0 / M_PI * cosTheta);  // if less than 0.0, then it is not within the hemisphere
}

// return the sum (weighted so that it still sum to 1.0) probability of the sample direction
float lightIntensityProbability(vec3 sampledDirection, Sphere sphere1, Sphere sphere2, float[3] weights, vec3 samplePosition, vec3 normal) {
	
	float light1Prob = sphereLightProbability(sampledDirection, sphere1, samplePosition);
	float light2Prob = sphereLightProbability(sampledDirection, sphere2, samplePosition);
	float cosineProb = cosineProbability(sampledDirection, normal);
	
	return light1Prob * weights[0] + light2Prob * weights[1] + cosineProb * weights[2];
}

DirectionSample sampleDirection(const vec3 normal, const int dimensionIndex, const vec3 hitPosition, const Scene scene) {
	
	DirectionSample result;
	
#ifdef SOLUTION_IS
	// The most basic job I expect from importance sampling is quicker convergence, because the sampling distribution is closer to the actual distribution therefore paying more attention
	// to direction that contribute more light, we also divide by the pdf so that they have the same expectation and thus converge to the same result.
	// For infinitely many samples, for with / without importance sampling, there should not be any difference because they have the same expectation.
	
	#ifdef LIGHT_INTENSITY_WEIGHTED
		// here I implement multiple light importance sampling, integrating with the original cosine importance sampling to ensure completeness and convergence to same result.
	
		// first define the weights and normals for each light source
		// weighted by intensity
		float weights[3];
		weights[0] = scene.spheres[0].material.intensity;
		weights[1] = scene.spheres[1].material.intensity;
		// if divide by 2 then all three distributions will be the same, but since light is more important than the cosine term, we divide by something larger than 2
		weights[2] = (weights[0] + weights[1]) / 5.0;  
		normalizeWeights(weights);  // ensure weights sum to 1.0 while keeping relative difference

		// next define the normals towards the light position
		// sample a normal by their weights
		vec3 sampleNormal;
		vec3 sampleDirection;
	
		const int WEIGHT_SAMPLE_INDEX = maxPathLength * 2 + 6;  // an index that is not used anywhere else: 2 more than the max possible PATH_SAMPLE_INDEX
		
		// choose a distribution and sample accordingly
	 	int sampledIndex = sampleByWeights(weights, WEIGHT_SAMPLE_INDEX);
		if (sampledIndex == 0) {
			sampleDirection = sampleSphericalLight(dimensionIndex, hitPosition, scene.spheres[0]);
			sampleNormal = normalize(scene.spheres[0].position - hitPosition);
			
		} else if(sampledIndex == 1) {
			sampleDirection = sampleSphericalLight(dimensionIndex, hitPosition, scene.spheres[1]);
			sampleNormal = normalize(scene.spheres[1].position - hitPosition);
			
		} else {
			sampleDirection = sampleCosine(dimensionIndex);
			sampleNormal = normal;
		}
		
		result.direction = makeLocalFrame(sampleNormal) * sampleDirection;
		result.probability = lightIntensityProbability(result.direction, scene.spheres[0], scene.spheres[1], weights, hitPosition, normal);
	
	#else
		// sample and convert to local sampled position
		result.direction = makeLocalFrame(normal) * sampleCosine(dimensionIndex);
		// 1/pi because it is the constant of the probability integral
		// cos(theta) because the probability is now cosine weighted
		result.probability = cosineProbability(result.direction, normal);
	#endif
	
#else
	// Put yout code to compute Importance Sampling in the #ifdef above 
	result.direction = getRandomDirection(dimensionIndex);	
	result.probability = 1.0;
#endif
	return result;
}


vec3 directionToColor(vec3 direction) {
	return abs(direction);
}

vec3 samplePath(const Scene scene, const Ray initialRay) {
	
#ifdef TEST_RANDOM_DIRECTION
	// in this case the involved function is directionToColor, so that we can project color to screen and check it
	return directionToColor(getRandomDirection(0));
#endif

  // Initial result is black
  vec3 result = vec3(0);

  Ray incomingRay = initialRay;
  vec3 throughput = vec3(1.0);
  for(int i = 0; i < maxPathLength; i++) {
    HitInfo hitInfo = intersectScene(scene, incomingRay, 0.001, 10000.0);

    if(!hitInfo.hit) return result;
  	
	result += throughput * getEmission(hitInfo.material, hitInfo.normal);

    Ray outgoingRay;
	DirectionSample directionSample;
#ifdef SOLUTION_BOUNCE
	  outgoingRay.origin = hitInfo.position;
	  
	  int dimensionIndex = PATH_SAMPLE_DIMENSION + 2 * i;
	  directionSample = sampleDirection(hitInfo.normal, dimensionIndex, hitInfo.position, scene);
	  #ifdef LIGHT_DIRECTION_TEST
	  	return directionSample.direction;
	  #endif
	  outgoingRay.direction = directionSample.direction;
	  
#else
	 // Put your code to compute the next ray in the #ifdef above
#endif

#ifdef SOLUTION_THROUGHPUT
	vec3 geometryTerm = getGeometricTerm(hitInfo.material, hitInfo.normal, incomingRay.direction, outgoingRay.direction);
	vec3 reflectance = getReflectance(hitInfo.material, hitInfo.normal, incomingRay.direction, outgoingRay.direction);
	
	// we need to multiply by the geometry term due to the weakening of irradiance
	vec3 specularTerm = reflectance * geometryTerm;
	vec3 diffuseTerm = hitInfo.material.diffuse * geometryTerm / M_PI;  // divide by pi as explained by tobias 
	
	// throughput is scaled by the sum of specular and diffuse term
	throughput *= specularTerm + diffuseTerm;
	
#else
    // Compute the proper throughput in the #ifdef above 
    throughput *= 0.1;
#endif

#ifdef SOLUTION_IS
	// divide by the probability of this sample to get the same expectation, so that they converge to same result
	// multiply by another 4 pi to match the incorrect framework, because it did not divide by 1/(4pi) for uniform distribution (which it really should).
	throughput /= directionSample.probability * 4.0 * M_PI;
#else
	// Without Importance Sampling, there is nothing to do here. 
	// Put your Importance Sampling code in the #ifdef above
#endif

#ifdef SOLUTION_BOUNCE
	incomingRay = outgoingRay;
#else
	// Put some handling of the next and the current ray in the #ifdef above
#endif
  }
  return result;
}

uniform ivec2 resolution;
Ray getFragCoordRay(const vec2 fragCoord) {

  	float sensorDistance = 1.0;
  	vec3 origin = vec3(0, 0, sensorDistance);
  	vec2 sensorMin = vec2(-1, -0.5);
  	vec2 sensorMax = vec2(1, 0.5);
  	vec2 pixelSize = (sensorMax - sensorMin) / vec2(resolution);
    vec3 direction = normalize(vec3(sensorMin + pixelSize * fragCoord, -sensorDistance));

  	float apertureSize = 0.0;
  	float focalPlane = 100.0;
  	vec3 sensorPosition = origin + focalPlane * direction;
  	origin.xy += apertureSize * (sample2(LENS_SAMPLE_DIMENSION) - vec2(0.5));
  	direction = normalize(sensorPosition - origin);

  	return Ray(origin, direction);
}

vec3 colorForFragment(const Scene scene, const vec2 fragCoord) {
  	initRandomSequence();

#ifdef SOLUTION_AA
	
	#define USE_INFINITE_PRECISION
	//#define USE_NxN_BOX_FILTER
	
	#ifdef USE_INFINITE_PRECISION
		// The framework will average for us, so we can just sample a random point in the current pixel area with uniform offset.
		// get random offset from range: (-0.5, 0.5), and we can get a average color at a larger resolution.
		vec2 offset = sample2(ANTI_ALIAS_SAMPLE_DIMENSION) - 0.5;
		vec2 sampleCoord = fragCoord + offset;
	#endif
	
	#ifdef USE_NxN_BOX_FILTER
		// alternatively, we divide the current pixel to (samplesPerSide x samplesPerSide) 
		// grid and choose one region in the grid with equal probability (definition of box filter).

		// This specify the the amount of samples around the fragCoord to sample of the box filter.
		// It should be an positive integer and samplesPerSide <= 0 is undefined.
		// e.g.: 3 = 3x3 box filter
		const int samplesPerSide = 3;

		// first randomly sample two integer of range [0, samplesPerSide), this is the index coordinate
		// index is the coordinate at the top left of the sampleCoord
		vec2 index = floor(sample2(ANTI_ALIAS_SAMPLE_DIMENSION)) * float(samplesPerSide));
		// to find the offset needed to move from top left coordinate to middle coordinate,
		// we first calculate the side length of each sample
		float sideLengthPerSample = 1.0 / float(samplesPerSide);
		// then we move the top left coordinate to middle by adding half of side length
		vec2 coord = index + (sideLengthPerSample / 2.0);
		// then we find the offset needed to move fragCoord to the sample coordinate,
		// we have assumed the fragCoord is at the middle of a 1x1 pixels (0.5, 0.5)
		vec2 offset = coord - 0.5;
		// apply to offset to the sample coordinate
		vec2 sampleCoord = fragCoord + offset;
	#endif
	
#else  	
	// Put your anti-aliasing code in the #ifdef above
	vec2 sampleCoord = fragCoord;
#endif
    return samplePath(scene, getFragCoordRay(sampleCoord));
}


void loadScene1(inout Scene scene) {

#ifdef CHANGE_LIGHT_POSITION
  scene.spheres[0].position = vec3(7, 3, -12);
#else
  scene.spheres[0].position = vec3(7, -2, -12);
#endif
  scene.spheres[0].radius = 2.0;
#ifdef SOLUTION_LIGHT  
  // Set the value of the missing property
  scene.spheres[0].material.emissiveness = vec3(0.9, 0.9, 0.5);
  scene.spheres[0].material.intensity = 150.0;
  
#endif

  scene.spheres[0].material.diffuse = vec3(0.0);
  scene.spheres[0].material.specular = vec3(0.0);
  scene.spheres[0].material.glossiness = 10.0;

#ifdef CHANGE_LIGHT_POSITION
  scene.spheres[1].position = vec3(-8, -2, -13);
#else
  scene.spheres[1].position = vec3(-8, 4, -13);
#endif
  scene.spheres[1].radius = 1.0;
#ifdef SOLUTION_LIGHT  
  // Set the value of the missing property
  scene.spheres[1].material.emissiveness = vec3(0.8, 0.3, 0.1);
	
#ifdef CHANGE_LIGHT_INTENSITY
  scene.spheres[1].material.intensity = 30.0;
#else
  scene.spheres[1].material.intensity = 150.0;
#endif
#endif
  scene.spheres[1].material.diffuse = vec3(0.0);
  scene.spheres[1].material.specular = vec3(0.0);
  scene.spheres[1].material.glossiness = 10.0;

  scene.spheres[2].position = vec3(-2, -2, -12);
  scene.spheres[2].radius = 3.0;
#ifdef SOLUTION_LIGHT  
  // Set the value of the missing property
  scene.spheres[2].material.emissiveness = vec3(0.0);
  scene.spheres[2].material.intensity = 0.0;
#endif  
  scene.spheres[2].material.diffuse = vec3(0.2, 0.5, 0.8);
  scene.spheres[2].material.specular = vec3(0.8);
  scene.spheres[2].material.glossiness = 40.0;  

  scene.spheres[3].position = vec3(3, -3.5, -14);
  scene.spheres[3].radius = 1.0;
#ifdef SOLUTION_LIGHT  
  // Set the value of the missing property
  scene.spheres[3].material.emissiveness = vec3(0.0);
  scene.spheres[3].material.intensity = 0.0;
#endif  
  scene.spheres[3].material.diffuse = vec3(0.9, 0.8, 0.8);
  scene.spheres[3].material.specular = vec3(1.0);
  scene.spheres[3].material.glossiness = 10.0;  

  scene.planes[0].normal = vec3(0, 1, 0);
  scene.planes[0].d = 4.5;
#ifdef SOLUTION_LIGHT    
  // Set the value of the missing property
  scene.planes[0].material.emissiveness = vec3(0.0);
  scene.planes[0].material.intensity = 0.0;
#endif
  scene.planes[0].material.diffuse = vec3(0.8);
  scene.planes[0].material.specular = vec3(0);
  scene.planes[0].material.glossiness = 50.0;    

  scene.planes[1].normal = vec3(0, 0, 1);
  scene.planes[1].d = 18.5;
#ifdef SOLUTION_LIGHT    
  // Set the value of the missing property
  scene.planes[1].material.emissiveness = vec3(0.0);
  scene.planes[1].material.intensity = 0.0;
#endif
  scene.planes[1].material.diffuse = vec3(0.9, 0.6, 0.3);
  scene.planes[1].material.specular = vec3(0.02);
  scene.planes[1].material.glossiness = 3000.0;

  scene.planes[2].normal = vec3(1, 0,0);
  scene.planes[2].d = 10.0;
#ifdef SOLUTION_LIGHT    
  // Set the value of the missing property
  scene.planes[2].material.emissiveness = vec3(0.0);
  scene.planes[2].material.intensity = 0.0;
#endif
  scene.planes[2].material.diffuse = vec3(0.2);
  scene.planes[2].material.specular = vec3(0.1);
  scene.planes[2].material.glossiness = 100.0; 

  scene.planes[3].normal = vec3(-1, 0,0);
  scene.planes[3].d = 10.0;
#ifdef SOLUTION_LIGHT    
  // Set the value of the missing property
  scene.planes[3].material.emissiveness = vec3(0.0);
  scene.planes[3].material.intensity = 0.0;
#endif
  scene.planes[3].material.diffuse = vec3(0.2);
  scene.planes[3].material.specular = vec3(0.1);
  scene.planes[3].material.glossiness = 100.0; 
}


void main() {
  // Setup scene
  Scene scene;
  loadScene1(scene);

  // compute color for fragment
  gl_FragColor.rgb = colorForFragment(scene, gl_FragCoord.xy);
  gl_FragColor.a = 1.0;
}
