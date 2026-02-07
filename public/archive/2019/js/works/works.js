
var framework = null;
const canvasId = 'glCanvas';


function create_cwk1_framework(canvasId) {
    return new Framework(
        canvasId, 
        vertexShaderId = 'cwk1-vertex-shader', 
        fragmentShaderId = 'cwk1-fragment-shader', 
        isPathTracer = false, 
        tonemapShaderId = null
    )
}


function create_cwk2_framework(canvasId) {
    return new Framework(
        canvasId, 
        vertexShaderId = 'cwk2-vertex-shader', 
        fragmentShaderId = 'cwk2-fragment-shader', 
        isPathTracer = false, 
        tonemapShaderId = null
    )
}

function create_cwk3_framework(canvasId) {
    return new Framework(
        canvasId, 
        vertexShaderId = 'cwk3-vertex-shader', 
        fragmentShaderId = 'cwk3-fragment-shader', 
        isPathTracer = true, 
        tonemapShaderId = 'cwk3-tonemap-shader', 
    )
}

function enable_UCLCG_work() {

}

function disable_UCLCG_work() {
    let canvas = document.getElementById(canvasId);
    canvas.width = 0;
    canvas.height = 0;
}


$('.link').on('click', e => {
    $('#wrapper').toggleClass('passive-state');
});

$('#uclcg-link').on('click', e => {
    $('.works-container').toggleClass('uclcg-active active-state');
});

function adjustCanvasSize() {

    let canvasContainer = document.querySelector('.canvas-container');
    let canvas = document.querySelector('.gl-canvas');

    // set to container size
    canvas.width  = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;

    // reduce a bit for some margin
    canvas.width -= canvas.width * 0.1;
    canvas.height -= canvas.height * 0.2;;

    // ensure 1 : 2 height width ratio
    if (canvas.width / 2.0 < canvas.height) {
        canvas.height = canvas.width / 2.0;
    } else if (canvas.height * 2 < canvas.width) {
        canvas.width = canvas.height * 2;
    }
}

$('.uclcg-container').on('transitionend webkitTransitionEnd oTransitionEnd', () => adjustCanvasSize());

function stopCurrentFramework() {
    framework && framework.stop();
}

$('#coursework1').on('click', () => {
    stopCurrentFramework()
    framework = create_cwk1_framework(canvasId);
    framework.initialize().then(() => framework.drawCanvas());
    $('.uclcg-container')
        .addClass('coursework1-active')
        .removeClass('coursework2-active coursework3-active');
});

$('#coursework2').on('click', () => {
    stopCurrentFramework()
    framework = create_cwk2_framework(canvasId);
    framework.initialize().then(() => framework.drawCanvas());
    $('.uclcg-container')
        .addClass('coursework2-active')
        .removeClass('coursework1-active coursework3-active');
});

$('#coursework3').on('click', () => {
    stopCurrentFramework()
    framework = create_cwk3_framework(canvasId);
    framework.initialize().then(() => framework.start(1000));
    $('.uclcg-container')
        .addClass('coursework3-active')
        .removeClass('coursework1-active coursework2-active');
});


function addFrameworkSolution(id) {
    let tag = 'SOLUTION_' + id.replaceAll('-', '_').toUpperCase();
    if (framework) {
        framework.stop(); 
        framework.clearSolutions();
        framework.addSolution(tag);
        framework.restart();
    }
}

function setActiveState(id) {
    $('.option-button').removeClass('active-state');
    switch(id) {
        // cwk 1
        case 'fresnel': $('#fresnel').addClass('active-state');
        case 'reflection-refraction': $('#reflection-refraction').addClass('active-state');
        case 'cylinder-and-plane': $('#cylinder-and-plane').addClass('active-state');
        break;
        // cwk 2
        case 'aalias': $('#aalias').addClass('active-state');
        case 'zbuffering': $('#zbuffering').addClass('active-state');
        case 'interpolation': $('#interpolation').addClass('active-state');
        case 'clipping': $('#clipping').addClass('active-state');
        case 'rasterization': $('#rasterization').addClass('active-state');
        case 'projection': $('#projection').addClass('active-state');
        break;
        // cwk 3
        case 'mis': $('#mis').addClass('active-state');
        case 'is': $('#is').addClass('active-state');
        case 'aa': $('#aa').addClass('active-state');
        case 'halton': $('#halton').addClass('active-state');
        case 'throughput': $('#throughput').addClass('active-state');
        case 'bounce': $('#bounce').addClass('active-state');
        case 'light': $('#light').addClass('active-state');
        break;

        default:
            console.log(`set active state id invalid: ${id}`);
            break;
    }
}

$('.option-button').on('click', e => {
    addFrameworkSolution(e.target.id);
    setActiveState(e.target.id)
});