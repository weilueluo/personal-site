// #define SOLUTION_PROJECTION
// #define SOLUTION_RASTERIZATION
// #define SOLUTION_CLIPPING
// #define SOLUTION_INTERPOLATION
// #define SOLUTION_ZBUFFERING
// #define SOLUTION_AALIAS

precision highp float;
uniform float time;

// Polygon / vertex functionality
const int MAX_VERTEX_COUNT = 8;

uniform ivec2 viewport;

struct Vertex {
    vec4 position;
    vec3 color;
};

struct Polygon {
    // Numbers of vertices, i.e., points in the polygon
    int vertexCount;
    // The vertices themselves
    Vertex vertices[MAX_VERTEX_COUNT];
};

// Appends a vertex to a polygon
void appendVertexToPolygon(inout Polygon polygon, Vertex element) {
    for (int i = 0; i < MAX_VERTEX_COUNT; ++i) {
        if (i == polygon.vertexCount) {
            polygon.vertices[i] = element;
        }
    }
    polygon.vertexCount++;
}

// Copy Polygon source to Polygon destination
void copyPolygon(inout Polygon destination, Polygon source) {
    for (int i = 0; i < MAX_VERTEX_COUNT; ++i) {
        destination.vertices[i] = source.vertices[i];
    }
    destination.vertexCount = source.vertexCount;
}

// Get the i-th vertex from a polygon, but when asking for the one behind the last, get the first again
Vertex getWrappedPolygonVertex(Polygon polygon, int index) {
    if (index >= polygon.vertexCount) index -= polygon.vertexCount;
    for (int i = 0; i < MAX_VERTEX_COUNT; ++i) {
        if (i == index) return polygon.vertices[i];
    }
}

// Creates an empty polygon
void makeEmptyPolygon(out Polygon polygon) {
  polygon.vertexCount = 0;
}


// SOLUTION_RASTERIZATION and culling part

#define INNER_SIDE 0
#define OUTER_SIDE 1

// Assuming a clockwise (vertex-wise) polygon, returns whether the input point 
// is on the inner or outer side of the edge (ab)
int edge(vec2 point, Vertex a, Vertex b) {
#ifdef SOLUTION_RASTERIZATION
    // TODO
	
	// assumed vertex a is the starting point
	// we have a -> b and a -> point
	//       a
	//     /  	//    / -> 	//   b      point
	// if z is pointing out of the screen: < 0 then it is shown above
	// else point is at left of the b which means it is outside
	vec2 ab = b.position.xy - a.position.xy;
	vec2 ap = point.xy - a.position.xy;
	float z = ab.x * ap.y - ab.y * ap.x;  // z component of the cross product
	if (z < 0.0) {
		return INNER_SIDE;
	}
	
#endif
    return OUTER_SIDE;
}

// Clipping part

#define ENTERING 0
#define LEAVING 1
#define OUTSIDE 2
#define INSIDE 3

int getCrossType(Vertex poli1, Vertex poli2, Vertex wind1, Vertex wind2) {
#ifdef SOLUTION_CLIPPING
    // TODO
	
	// check the position of both vertex poli1 -> poli2 with respect to the side defined by wind1 -> wind2
	int side1 = edge(poli1.position.xy, wind1, wind2);
	int side2 = edge(poli2.position.xy, wind1, wind2);
	
	if (side1 == INNER_SIDE && side2 == INNER_SIDE) {
		return INSIDE;
	} else if (side1 == OUTER_SIDE && side2 == OUTER_SIDE) {
		return OUTSIDE;
	} else if (side1 == INNER_SIDE && side2 == OUTER_SIDE) {
		return LEAVING;
	} else {
		return ENTERING;
	}
	
#else
    return INSIDE;
#endif
}

// This function assumes that the segments are not parallel or collinear.
Vertex intersect2D(Vertex a, Vertex b, Vertex c, Vertex d) {
#ifdef SOLUTION_CLIPPING
    // TODO
	
	// line equation 1
	float m1 = (b.position.y - a.position.y) / (b.position.x - a.position.x);
	float c1 = b.position.y - (m1 * b.position.x);
	
	// line equation 2
	float m2 = (d.position.y - c.position.y) / (d.position.x - c.position.x);
	float c2 = d.position.y - (m2 * d.position.x);
	
	// intersection
	float intersect_x = (c2 - c1) / (m1 - m2);
	float intersect_y = m1 * intersect_x + c1;
	
	// calculate the z depth
	float s = length(a.position.xy - b.position.xy);
	float z1 = a.position.z;
	float z2 = b.position.z;
	float zt = 1.0 / ((1.0/z1) + s * ((1.0/z2) - (1.0/z1)));
	
	return Vertex(vec4(intersect_x, intersect_y, zt, 1), a.color);
	
#else
    return a;
#endif
}

void sutherlandHodgmanClip(Polygon unclipped, Polygon clipWindow, out Polygon result) {
    Polygon clipped;
    copyPolygon(clipped, unclipped);

    // Loop over the clip window
    for (int i = 0; i < MAX_VERTEX_COUNT; ++i) {
        if (i >= clipWindow.vertexCount) break;

        // Make a temporary copy of the current clipped polygon
        Polygon oldClipped;
        copyPolygon(oldClipped, clipped);

        // Set the clipped polygon to be empty
        makeEmptyPolygon(clipped);

        // Loop over the current clipped polygon
        for (int j = 0; j < MAX_VERTEX_COUNT; ++j) {
            if (j >= oldClipped.vertexCount) break;
            
            // Handle the j-th vertex of the clipped polygon. This should make use of the function 
            // intersect() to be implemented above.
			
#ifdef SOLUTION_CLIPPING
            // TODO
			Vertex wind1 = getWrappedPolygonVertex(clipWindow, i);
			Vertex wind2 = getWrappedPolygonVertex(clipWindow, i+1);
			Vertex poli1 = getWrappedPolygonVertex(oldClipped, j);
			Vertex poli2 = getWrappedPolygonVertex(oldClipped, j+1);
			
			int crossType = getCrossType(poli1, poli2, wind1, wind2);
			
			// handle the poli1 and intersection but not poli2, as it will be handled in the next iteration
			if (crossType == INSIDE) {
				appendVertexToPolygon(clipped, getWrappedPolygonVertex(oldClipped, j));
			} else if (crossType == LEAVING) {
				appendVertexToPolygon(clipped, getWrappedPolygonVertex(oldClipped, j));
				appendVertexToPolygon(clipped, intersect2D(poli1, poli2, wind1, wind2));
			} else if (crossType == ENTERING) {
				appendVertexToPolygon(clipped, intersect2D(poli1, poli2, wind1, wind2));
			}
#else
            appendVertexToPolygon(clipped, getWrappedPolygonVertex(oldClipped, j));
#endif
        }
    }

    // Copy the last version to the output
    copyPolygon(result, clipped);
}



// Returns if a point is inside a polygon or not
bool isPointInPolygon(vec2 point, Polygon polygon) {
    // Don't evaluate empty polygons
    if (polygon.vertexCount == 0) return false;
    // Check against each edge of the polygon
    bool rasterise = true;
    for (int i = 0; i < MAX_VERTEX_COUNT; ++i) {
        if (i < polygon.vertexCount) {
#ifdef SOLUTION_RASTERIZATION
            // TODO
			Vertex a = getWrappedPolygonVertex(polygon, i);
			Vertex b = getWrappedPolygonVertex(polygon, i+1);
			// if any edge rejected, return false immediately
			if (edge(point, a, b) == OUTER_SIDE) {
				return false;
			}
#else
            rasterise = false;
#endif
        }
    }
    return rasterise;
}

bool isPointOnPolygonVertex(vec2 point, Polygon polygon) {
    for (int i = 0; i < MAX_VERTEX_COUNT; ++i) {
        if (i < polygon.vertexCount) {
          	ivec2 pixelDifference = ivec2(abs(polygon.vertices[i].position.xy - point) * vec2(viewport));
          	int pointSize = viewport.x / 200;
            if( pixelDifference.x <= pointSize && pixelDifference.y <= pointSize) {
              return true;
            }
        }
    }
    return false;
}

float triangleArea(vec2 a, vec2 b, vec2 c) {
    // https://en.wikipedia.org/wiki/Heron%27s_formula
    float ab = length(a - b);
    float bc = length(b - c);
    float ca = length(c - a);
    float s = (ab + bc + ca) / 2.0;
    return sqrt(max(0.0, s * (s - ab) * (s - bc) * (s - ca)));
}

Vertex interpolateVertex(vec2 point, Polygon polygon) {
    vec3 colorSum = vec3(0.0);
    vec4 positionSum = vec4(0.0);
    float weight_sum = 0.0;
	float weight_corr_sum = 0.0;
    
	for (int i = 0; i < MAX_VERTEX_COUNT; ++i) {
        if (i < polygon.vertexCount) {
#if defined(SOLUTION_INTERPOLATION) || defined(SOLUTION_ZBUFFERING)
            // TODO
 			Vertex v = getWrappedPolygonVertex(polygon, i);
			Vertex v1 = getWrappedPolygonVertex(polygon, i+1);
			Vertex v2 = getWrappedPolygonVertex(polygon, i+2);
			float weight = triangleArea(point, v1.position.xy, v2.position.xy);
			float area = triangleArea(v.position.xy, v1.position.xy, v2.position.xy);
			weight_sum += weight;
			weight_corr_sum += weight / v.position.z;
#endif

#ifdef SOLUTION_ZBUFFERING
            // TODO
			
			// without divide is closer to pdf result, but should probably be used
			//positionSum += v.position * weight / v.position.z;
			positionSum += v.position * weight;
#endif

#ifdef SOLUTION_INTERPOLATION
            // TODO
			colorSum += v.color * weight / v.position.z;
#endif
        }
    }
    Vertex result = polygon.vertices[0];
  
#ifdef SOLUTION_INTERPOLATION
    // TODO
	result.color = colorSum / weight_corr_sum;
#endif
	
#ifdef SOLUTION_ZBUFFERING
    // TODO
	
	// weight_sum is closer to pdf result, but weight_corr_sum should probably be used
	result.position = positionSum / weight_sum;
#endif

  return result;
}

// Projection part

// Used to generate a projection matrix.
mat4 computeProjectionMatrix() {
    mat4 projectionMatrix = mat4(1);
  
  	float aspect = float(viewport.x) / float(viewport.y);  
  	float imageDistance = 2.0;

	float xMin = -0.5;
	float yMin = -0.5;
	float xMax = 0.5;
	float yMax = 0.5;

#ifdef SOLUTION_PROJECTION

	float w = xMax - xMin;
	float h = yMax - yMin;
	float x = xMax + xMin;
	float y = yMax + yMin;
	float d = imageDistance;
	
	// scale to match aspect
	w *= aspect;
	
	// matrix below are tranposed as glsl is column major
	
	// step 1 & 2
	mat4 translate = mat4(
		  1, 0, 0, -x,
		  0, 1, 0, -y,
	      0, 0, 1, -d,
		  0, 0, 0, 1
	);

	// step 3
	mat4 sheer = mat4(
		d/w,   0,-x/w, 0,
		  0, d/h,-y/h, 0,
	      0,   0,   1, 0,
		  0,   0,   0, 1
	);

	// step 4
	mat4 scale = mat4(
		  1.0/d,     0,     0, 0,
		      0, 1.0/d,     0, 0,
	          0,     0, 1.0/d, 0,
		      0,     0,     0, 1
	);
	
	// perspective
	mat4 perspective = mat4(
		  1, 0,    0, 0,
		  0, 1,    0, 0,
	      0, 0,    1, 0,
		  0, 0,1.0/d, 1
	);
	
	// apply from left to right
	projectionMatrix = translate * sheer * scale * perspective;
#endif

    return projectionMatrix;
}

// Used to generate a simple "look-at" camera. 
mat4 computeViewMatrix(vec3 VRP, vec3 TP, vec3 VUV) {
    mat4 viewMatrix = mat4(1);

#ifdef SOLUTION_PROJECTION
    // TODO
	
	// find the "look at" vector
	vec3 VPN = TP - VRP;
	
	// compute n, u, v that define the camera position 
	vec3 n = normalize(VPN);
	vec3 u = normalize(cross(VUV, n));
	vec3 v = cross(n, u);
	float qu = dot(VRP, u);
	float qv = dot(VRP, v);
	float qn = dot(VRP, n);
	
	viewMatrix = mat4(
		u[0], u[1], u[2],-qu,
		v[0], v[1], v[2],-qv,
		n[0], n[1], n[2],-qn,
		   0,    0,    0,  1
	);
	
#endif
    return viewMatrix;
}

vec3 getCameraPosition() {  
    //return 10.0 * vec3(sin(time * 1.3), 0, cos(time * 1.3));
	return 10.0 * vec3(sin(0.0), 0, cos(0.0));
}

// Takes a single input vertex and projects it using the input view and projection matrices
vec4 projectVertexPosition(vec4 position) {

    // Set the parameters for the look-at camera.
    vec3 TP = vec3(0, 0, 0);
  	vec3 VRP = getCameraPosition();
    vec3 VUV = vec3(0, 1, 0);

    // Compute the view matrix.
    mat4 viewMatrix = computeViewMatrix(VRP, TP, VUV);

    // Compute the projection matrix.
    mat4 projectionMatrix = computeProjectionMatrix();
  
#ifdef SOLUTION_PROJECTION
    // TODO
	
	// view first then projection
	position = position * viewMatrix * projectionMatrix;
	
	// perspective division
	position = position / position.w;
	
	return position;
#else
    return position;
#endif
}

// Projects all the vertices of a polygon
void projectPolygon(inout Polygon projectedPolygon, Polygon polygon) {
    copyPolygon(projectedPolygon, polygon);
    for (int i = 0; i < MAX_VERTEX_COUNT; ++i) {
        if (i < polygon.vertexCount) {
            projectedPolygon.vertices[i].position = projectVertexPosition(polygon.vertices[i].position);
        }
    }
}

// Draws a polygon by projecting, clipping, ratserizing and interpolating it
void drawPolygon(
  vec2 point, 
  Polygon clipWindow, 
  Polygon oldPolygon, 
  inout vec3 color, 
  inout float depth)
{
    Polygon projectedPolygon;
    projectPolygon(projectedPolygon, oldPolygon);  
  
    Polygon clippedPolygon;
    sutherlandHodgmanClip(projectedPolygon, clipWindow, clippedPolygon);

    if (isPointInPolygon(point, clippedPolygon)) {
      
        Vertex interpolatedVertex = interpolateVertex(point, projectedPolygon);

#if defined(SOLUTION_ZBUFFERING)
        // TODO: Put your code to handle z buffering here
		if (depth > interpolatedVertex.position.z) {
			// we found a interpolatedVertex nearer to the screen
			color = interpolatedVertex.color;
			depth = interpolatedVertex.position.z;
		}
#else
      color = interpolatedVertex.color;
      depth = interpolatedVertex.position.z;      
#endif
   }
  
   if (isPointOnPolygonVertex(point, clippedPolygon)) {
        color = vec3(1);
   }
}

// Main function calls

void drawScene(vec2 pixelCoord, inout vec3 color) {
    color = vec3(0.3, 0.3, 0.3);
  
  	// Convert from GL pixel coordinates 0..N-1 to our screen coordinates -1..1
    vec2 point = 2.0 * pixelCoord / vec2(viewport) - vec2(1.0);

    Polygon clipWindow;
    clipWindow.vertices[0].position = vec4(-0.65,  0.95, 1.0, 1.0);
    clipWindow.vertices[1].position = vec4( 0.65,  0.75, 1.0, 1.0);
    clipWindow.vertices[2].position = vec4( 0.75, -0.65, 1.0, 1.0);
    clipWindow.vertices[3].position = vec4(-0.75, -0.85, 1.0, 1.0);
    clipWindow.vertexCount = 4;

  	// Draw the area outside the clip region to be dark
    color = isPointInPolygon(point, clipWindow) ? vec3(0.5) : color;

    const int triangleCount = 2;
    Polygon triangles[triangleCount];
  
    triangles[0].vertices[0].position = vec4(-3, -2, 0.0, 1.0);
    triangles[0].vertices[1].position = vec4(4, 0, 3.0, 1.0);
    triangles[0].vertices[2].position = vec4(-1, 2, 0.0, 1.0);
    triangles[0].vertices[0].color = vec3(1.0, 1.0, 0.2);
    triangles[0].vertices[1].color = vec3(0.8, 0.8, 0.8);
    triangles[0].vertices[2].color = vec3(0.5, 0.2, 0.5);
    triangles[0].vertexCount = 3;
  
    triangles[1].vertices[0].position = vec4(3.0, 2.0, -2.0, 1.0);
  	triangles[1].vertices[2].position = vec4(0.0, -2.0, 3.0, 1.0);
    triangles[1].vertices[1].position = vec4(-1.0, 2.0, 4.0, 1.0);
    triangles[1].vertices[1].color = vec3(0.2, 1.0, 0.1);
    triangles[1].vertices[2].color = vec3(1.0, 1.0, 1.0);
    triangles[1].vertices[0].color = vec3(0.1, 0.2, 1.0);
    triangles[1].vertexCount = 3;	
	
    float depth = 10000.0;
    // Project and draw all the triangles
    for (int i = 0; i < triangleCount; i++) {
        drawPolygon(point, clipWindow, triangles[i], color, depth);
    }   
}

vec3 drawOffsetedPixel(in float xOffset, in float yOffset) {
	vec2 coord = gl_FragCoord.xy;
	coord.x += xOffset;
	coord.y += yOffset;
	vec3 color;
	drawScene(coord, color);
	return color;
}

void main() {
	
	vec3 color = vec3(0);
	
#ifdef SOLUTION_AALIAS
	
	// This is the "sample rate" for each side
	// as it need to be a square. Use this to trade quality and speed.
	// samplesPerSide = 1: no antialias
	// samplesPerSide < 1: undefined
	// samplesPerSide > 1: antialias that control the samples per side, so the actual number of samples is samplesPerSide * samplesPerSide
	const int samplesPerSide = 3;
	
	// use the following code for averging the neighboring pixels
	float stepSize = 1.0 / float(samplesPerSide);
	
	vec3 colorSum = vec3(0);
	for (int i = 0; i < samplesPerSide; i++) {
		float xLocal = float(i) * stepSize + stepSize / 2.0;
		for (int j = 0; j < samplesPerSide; j++) {
			float yLocal = float(j) * stepSize + stepSize / 2.0;
			colorSum += drawOffsetedPixel(xLocal-0.5, yLocal-0.5);
		}
	}
	
	color = colorSum / (float(samplesPerSide) * float(samplesPerSide));
	
	
#else
    drawScene(gl_FragCoord.xy, color);
#endif
	
	gl_FragColor.rgb = color;	
    gl_FragColor.a = 1.0;
}