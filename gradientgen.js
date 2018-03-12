// Global size
var size = 200;

// Entry point into the script
function load() {
    display.init();
    update();
}

// The canvas display
var display = {
    canvas: document.getElementById("display"),
    init: function() {
        this.canvas.width = size;
        this.canvas.height = size;
        this.context = this.canvas.getContext("2d");
    }
}

// The form
var form = {
    bg: document.getElementById("bg"),
    colors: [
        document.getElementById("0"),
        document.getElementById("1"),
        document.getElementById("2")],
    size: document.getElementById("size"),
    rot: document.getElementById("rot"),
    res: document.getElementById("res"),
}

// Update the display
function update() {
    // Update and create locals
    size = form.size.value;
    res = parseInt(form.res.value);
    display.canvas.width = size;
    display.canvas.height = size;
    
    // Re-draw the display
    display.context.clearRect(0, 0, size, size);
    for(var y = 0; y <= size; y+=res) {
        for(var x = 0; x <= size; x+=res) {
            display.context.fillStyle = genPixel(x, y);
            display.context.fillRect(x, y, res, res);
        }
    }
}

function addColor() {
    
}

// Point-to-line distance (credit to Wikipedia)
function distance(x, y, theta) {
    theta *= Math.PI / 180;
    p = {
        x: size/2 + size * Math.cos(theta) / Math.sqrt(2),
        y: size/2 - size * Math.sin(theta) / Math.sqrt(2),
    };
    a = Math.cos(theta);
    b = -Math.sin(theta);
    c = p.y*Math.sin(theta) - p.x*Math.cos(theta);
    d = Math.abs(a*x + b*y + c) / Math.sqrt(a*a + b*b);
    return d
}

// Convert hex string to rgb values (credit to Tim Down on Stackoverflow)
function rgb(color) {
    var split = /^#(..)(..)(..)/.exec(color);
    return [
        parseInt(split[1], 16),
        parseInt(split[2], 16),
        parseInt(split[3], 16),
    ];
}

// Generate a single pixel's color value
function genPixel(x, y) {
    pixel = rgb(form.bg.value);
    
    blend = [0, 0, 0];
    alpha = 0;
    
    for(var n = 0; n < form.colors.length; n++) {
        color = rgb(form.colors[n].value);
        theta = n * 360/form.colors.length + rot.value;
        d = distance(x, y, theta);
        a = Math.max(1 - (d / (5/4 * size)), 0);
        
        // Complex blending that evenly blends the gradient colors, then normals with the background color
        for(var m = 0; m <= 2; m++) {
            blend[m] += a*color[m];
        }
        alpha += a;
    }
    
    alpha = Math.min(alpha, 1);
    for(var m = 0; m <= 2; m++) {
        pixel[m] = pixel[m]*(1-alpha) + blend[m]*alpha;
    }
    
    return "rgba("+pixel[0]+","+pixel[1]+","+pixel[2]+",255)"
}
