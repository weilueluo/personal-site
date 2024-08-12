// Compile and initialize shader stuff

function _compileShader(gl: WebGLRenderingContext, type: GLenum, shaderCode: string) {
    const shader = gl.createShader(type);

    if (shader === null) {
        console.error("Error while creating shader");
        return null;
    }

    gl.shaderSource(shader, shaderCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error while compiling shader");
        console.log(gl.getShaderInfoLog(shader));
        return null;
    } else {
        return shader;
    }
}

function _initShaderProgram(gl: WebGLRenderingContext, shaderInfos: { type: GLenum; code: string }[]) {
    const shaderProgram = gl.createProgram();

    if (shaderProgram === null) {
        console.error("Error while creating shader program");
        return null;
    }

    shaderInfos.forEach(info => {
        const shader = _compileShader(gl, info.type, info.code);
        if (shader) {
            gl.attachShader(shaderProgram, shader);
        }
    });

    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("Error linking shader program");
        console.log(gl.getProgramInfoLog(shaderProgram));
    }

    gl.useProgram(shaderProgram);
    return shaderProgram;
}

function _initGL(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (canvas == null) {
        throw new Error(`Error: canvas not found for gl, given id=${canvasId}`);
    }
    const gl = canvas.getContext("webgl");

    if (!gl) {
        console.error(`Error: Could not initialize gl context from canvas id ${canvasId}`);
        return null;
    } else {
        return gl;
    }
}

function _initScreenBuffer(gl: WebGLRenderingContext): WebGLBuffer | null {
    const screenVerticesBuffer = gl.createBuffer();
    if (screenVerticesBuffer === null) {
        console.error("Error: screenVerticesBuffer is null");
        return null;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, screenVerticesBuffer);

    const vertices = [
        -1, -1, 0, -1, 1, 0, 1, 1, 0,

        -1, -1, 0, 1, -1, 0, 1, 1, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    return screenVerticesBuffer;
}

function _getSourceCode(id: string) {
    const node = document.getElementById(id) as HTMLScriptElement;
    if (node == null) {
        console.log(`Error: did not find source code with id: ${id}`);
    }

    if (node && node.src) {
        return fetch(node.src).then(res => res.text());
    } else {
        return Promise.resolve(node.innerHTML);
    }
}

function _findShaderScripts(
    gl: WebGLRenderingContext,
    vertexShaderId: string,
    fragmentShaderId: string,
    customFragmentShaderCode = ""
) {
    return [
        _getSourceCode(vertexShaderId).then(code => {
            return {
                type: gl.VERTEX_SHADER,
                code: code,
            };
        }),
        _getSourceCode(fragmentShaderId).then(code => {
            return {
                type: gl.FRAGMENT_SHADER,
                code: customFragmentShaderCode + code,
            };
        }),
    ];
}

async function _initShaders(
    gl: WebGLRenderingContext,
    vertexShaderId: string,
    fragmentShaderId: string,
    customFragmentShaderCode = "",
    screenBuffer: WebGLBuffer
) {
    const shaderScripts = await Promise.all(
        _findShaderScripts(gl, vertexShaderId, fragmentShaderId, customFragmentShaderCode)
    );
    const shaderProgram = _initShaderProgram(gl, shaderScripts);

    if (shaderProgram === null) {
        console.error("Error: shader program is null");
        return null;
    }

    // set static input to shader program

    // position
    const aPosition = gl.getAttribLocation(shaderProgram, "position");
    gl.enableVertexAttribArray(aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, screenBuffer);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0); // 3 vertex per triangle

    // projectionMatrix
    const uProjectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    gl.uniformMatrix4fv(uProjectionMatrix, false, _getIdentityMatrix4f());

    // modelViewMatrix
    const uModelviewMatrix = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
    gl.uniformMatrix4fv(uModelviewMatrix, false, _getIdentityMatrix4f());

    return shaderProgram;
}

async function _initPathTracer(
    gl: WebGLRenderingContext,
    canvasId: string,
    screenBuffer: WebGLBuffer,
    vertexShaderId: string,
    tonemapShaderId: string
) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

    // add copyProgram
    const script = await Promise.all(_findShaderScripts(gl, vertexShaderId, tonemapShaderId));
    const copyProgram = _initShaderProgram(gl, script);
    if (copyProgram === null) {
        console.error("Error: copy program is null");
        return;
    }

    const aPosition = gl.getAttribLocation(copyProgram, "position");
    gl.enableVertexAttribArray(aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, screenBuffer);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0); // 3 vertex per triangle

    // extension needed for float texture
    const floatTextures = gl.getExtension("OES_texture_float");
    if (!floatTextures) {
        console.error("Error: no floating point texture support");
        return;
    }

    // add texture
    const rttTexture = gl.createTexture();
    if (!rttTexture) {
        console.error("Error: create texture failed");
    }
    gl.bindTexture(gl.TEXTURE_2D, rttTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // add framebuffer
    const rttFramebuffer = gl.createFramebuffer();
    if (!rttFramebuffer) {
        console.log("Error create framebuffer failed");
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        console.log("Error: frame buffer status is not complete");
    }

    return {
        copyProgram: copyProgram,
        rttTexture: rttTexture,
        rttFramebuffer: rttFramebuffer,
    };
}

function _drawCanvas(
    gl: WebGLRenderingContext,
    canvasId: string,
    time: number,
    shaderProgram: WebGLProgram,
    screenBuffer: WebGLBuffer
) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const width = canvas.width;
    const height = canvas.height;

    // vertex shader input
    const aPosition = gl.getAttribLocation(shaderProgram, "position");
    gl.enableVertexAttribArray(aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, screenBuffer);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

    // fragment shader input

    // viewport
    gl.viewport(0, 0, width, height);
    gl.uniform2iv(gl.getUniformLocation(shaderProgram, "viewport"), [width, height]);

    // time
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "time"), time);

    // draw scene, just 2 triangles, 3 vertices each: 2*3=6
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function _drawPathTracerCanvas(
    gl: WebGLRenderingContext,
    canvasId: string,
    rttFramebuffer: WebGLFramebuffer | null,
    rttTexture: WebGLTexture | null,
    shaderProgram: WebGLProgram,
    copyProgram: WebGLProgram,
    currentFrame: number
) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const width = canvas.width;
    const height = canvas.height;

    // render in the texture first
    gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
    gl.viewport(0, 0, width, height);

    // use the actual shading program
    gl.useProgram(shaderProgram);

    // set some input variables
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "globalSeed"), Math.random() * 32768.0);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "baseSampleIndex"), currentFrame);
    gl.uniform2i(gl.getUniformLocation(shaderProgram, "resolution"), width, height);

    // blend previous with current
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    /////////////////////////////////////////////////////

    // switch to actual canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // use the accumulated texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, rttTexture);
    gl.viewport(0, 0, width, height);

    // use the program that divide the color by number of samples
    gl.useProgram(copyProgram);

    // set input variables, including the sampleCount which used to divide the color sum
    gl.uniform1i(gl.getUniformLocation(copyProgram, "sampleCount"), currentFrame + 1);
    gl.uniform1i(gl.getUniformLocation(copyProgram, "radianceTexture"), 0);
    gl.uniform2i(gl.getUniformLocation(copyProgram, "resolution"), width, height);

    // disable blending
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);

    // actual drawing
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// utilities

function _getTime() {
    const date = new Date();
    return date.getMinutes() * 60.0 + date.getSeconds() + date.getMilliseconds() / 1000.0;
}

function _getIdentityMatrix4f() {
    const arr = new Float32Array(16);
    arr[0] = arr[5] = arr[10] = arr[15] = 1.0;
    return arr;
}

function _activeSolutionsToCode(solutions: Set<string>) {
    let code = "";
    for (const solution of solutions) {
        switch (String(solution)) {
            // cwk 1
            case "SOLUTION_FRESNEL":
                code += "#define SOLUTION_FRESNEL\n";
            // eslint-disable-next-line no-fallthrough
            case "SOLUTION_REFLECTION_REFRACTION":
                code += "#define SOLUTION_REFLECTION_REFRACTION\n";
            // eslint-disable-next-line no-fallthrough
            case "SOLUTION_SHADOW":
                code += "#define SOLUTION_SHADOW\n";
            // eslint-disable-next-line no-fallthrough
            case "SOLUTION_CYLINDER_AND_PLANE":
                code += "#define SOLUTION_CYLINDER_AND_PLANE\n";
                break;
            // cwk 2
            case "SOLUTION_AALIAS":
                code += "#define SOLUTION_AALIAS\n";
            // eslint-disable-next-line no-fallthrough
            case "SOLUTION_ZBUFFERING":
                code += "#define SOLUTION_ZBUFFERING\n";
            // eslint-disable-next-line no-fallthrough
            case "SOLUTION_INTERPOLATION":
                code += "#define SOLUTION_INTERPOLATION\n";
            // eslint-disable-next-line no-fallthrough
            case "SOLUTION_CLIPPING":
                code += "#define SOLUTION_CLIPPING\n";
            // eslint-disable-next-line no-fallthrough
            case "SOLUTION_RASTERIZATION":
                code += "#define SOLUTION_RASTERIZATION\n";
            // eslint-disable-next-line no-fallthrough
            case "SOLUTION_PROJECTION":
                code += "#define SOLUTION_PROJECTION\n";
                break;
            // cwk 3
            case "SOLUTION_MIS":
                code += "#define LIGHT_INTENSITY_WEIGHTED\n";
            // eslint-disable-next-line no-fallthrough
            case "SOLUTION_IS":
                code += "#define SOLUTION_IS\n";
            // eslint-disable-next-line no-fallthrough
            case "SOLUTION_AA":
                code += "#define SOLUTION_AA\n";
            // eslint-disable-next-line no-fallthrough
            case "SOLUTION_HALTON":
                code += "#define SOLUTION_HALTON\n";
            // eslint-disable-next-line no-fallthrough
            case "SOLUTION_THROUGHPUT":
                code += "#define SOLUTION_THROUGHPUT\n";
            // eslint-disable-next-line no-fallthrough
            case "SOLUTION_BOUNCE":
                code += "#define SOLUTION_BOUNCE\n";
            // eslint-disable-next-line no-fallthrough
            case "SOLUTION_LIGHT":
                code += "#define SOLUTION_LIGHT\n";
                break;
            // cwk 3 custom
            case "CHANGE_LIGHT_POSITION":
                code += "#define CHANGE_LIGHT_POSITION\n";
                break;
            case "CHANGE_LIGHT_INTENSITY":
                code += "#define CHANGE_LIGHT_INTENSITY\n";
                break;

            default:
                console.warn(`Provided solution is not one of available options: ${solution}`);
                break;
        }
    }
    return code;
}

export class ShaderFramework {
    private gl: WebGLRenderingContext | null = null;
    private screenBuffer: WebGLBuffer | null = null;
    private shaderProgram: WebGLProgram | null = null;

    // for path tracer
    private rttFramebuffer: WebGLFramebuffer | null = null;
    private rttTexture: WebGLTexture | null = null;
    private copyProgram: WebGLProgram | null = null;
    private currentFrame = 0;
    private maxFrame = 0;

    // interaction
    private running = false;
    private frameCallback: (() => void) | null = null;

    private activeSolutions: Set<string> = new Set();

    public constructor(
        private readonly canvasId: string,
        private readonly vertexShaderId: string,
        private readonly fragmentShaderId: string,
        private readonly isPathTracer = false,
        private readonly tonemapShaderId: string | null = null
    ) {}

    async _initializePathTracer() {
        if (!this.gl) {
            console.log("Error: gl is not initialized");
            return;
        }
        if (!this.screenBuffer) {
            console.error("Error: screen buffer is not initialized");
            return;
        }
        if (!this.tonemapShaderId) {
            console.error("Error: tonemapShaderId is not initialized");
            return;
        }
        const res = await _initPathTracer(
            this.gl,
            this.canvasId,
            this.screenBuffer,
            this.vertexShaderId,
            this.tonemapShaderId
        );
        if (!res) {
            console.error("Error: path tracer initialization failed");
            return;
        }
        this.rttFramebuffer = res.rttFramebuffer;
        this.rttTexture = res.rttTexture;
        this.copyProgram = res.copyProgram;
    }

    _incrementFrame() {
        this.currentFrame += 1;
    }

    _run() {
        if (this.running && this.getCurrentFrame() < this.getMaxFrame()) {
            this.drawCanvas();
            this._incrementFrame();
            this.frameCallback && this.frameCallback();
            window.requestAnimationFrame(() => this._run());
        }
    }

    _resetGL() {
        this.gl = _initGL(this.canvasId);
    }

    _resetBuffer() {
        if (!this.gl) {
            console.error("Error: gl is not initialized");
            return;
        }
        this.screenBuffer = _initScreenBuffer(this.gl);
    }

    async _resetShaders() {
        const customFragmentShaderCode = _activeSolutionsToCode(this.activeSolutions);
        if (!this.gl) {
            console.error("Error: gl is not initialized");
            return;
        }
        if (!this.screenBuffer) {
            console.error("Error: screen buffer is not initialized");
            return;
        }
        this.shaderProgram = await _initShaders(
            this.gl,
            this.vertexShaderId,
            this.fragmentShaderId,
            customFragmentShaderCode,
            this.screenBuffer
        );
    }

    //
    // function for framework user
    //

    start(maxFrame = 1) {
        this.setCurrentFrame(0);
        this.setMaxFrame(maxFrame);

        this.running = true;
        this._run();
    }

    stop() {
        this.running = false;
    }

    continue() {
        this.running = true;
        this._run();
    }

    restart() {
        this.stop();
        this.initialize().then(() => this.start(this.getMaxFrame()));
    }

    getCurrentFrame() {
        return this.currentFrame;
    }

    getMaxFrame() {
        return this.maxFrame;
    }

    setMaxFrame(maxFrame: number) {
        this.maxFrame = maxFrame;
    }

    setCurrentFrame(frame: number) {
        this.currentFrame = frame;
    }

    setFrameCallback(callback: () => void) {
        this.frameCallback = callback;
    }

    addSolution(solution: string) {
        this.activeSolutions.add(solution);
    }

    hasSolution(solution: string) {
        return this.activeSolutions.has(solution);
    }

    clearSolutions() {
        this.activeSolutions.clear();
    }

    toggleSolution(solution: string) {
        if (this.hasSolution(solution)) {
            this.removeSolution(solution);
        } else {
            this.addSolution(solution);
        }
    }

    removeSolution(solution: string) {
        this.activeSolutions.delete(solution);
    }

    async initialize() {
        this._resetGL();
        this._resetBuffer();
        await this._resetShaders();
        if (!this.gl) {
            console.error("Error: gl is not initialized");
            return;
        }
        this.gl.clearColor(0.5, 0.5, 0.5, 1.0); // default gray background
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        if (this.isPathTracer) {
            await this._initializePathTracer();
        }
    }

    drawCanvas() {
        if (!this.gl) {
            console.error("Error: gl is not initialized");
            return;
        }
        if (!this.shaderProgram) {
            console.error("Error: shader program is not initialized");
            return;
        }
        if (!this.screenBuffer) {
            console.error("Error: screen buffer is not initialized");
            return;
        }

        if (this.isPathTracer) {
            if (this.copyProgram === null) {
                console.error("Error: copy program is not initialized");
                return;
            }
            _drawPathTracerCanvas(
                this.gl,
                this.canvasId,
                this.rttFramebuffer,
                this.rttTexture,
                this.shaderProgram,
                this.copyProgram,
                this.getCurrentFrame()
            );
        } else {
            _drawCanvas(this.gl, this.canvasId, _getTime(), this.shaderProgram, this.screenBuffer);
        }
    }
}
