var Shaders = Shaders || {};

function createProgram(gl, vertexShader, fragmentShader) {
  // create a program.
  var program = gl.createProgram();
 
  // attach the shaders.
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
 
  // link the program.
  gl.linkProgram(program);
 
  // Check if it linked.
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
      // something went wrong with the link
      throw ("program filed to link:" + gl.getProgramInfoLog (program));
  }
 
  return program;
};

Shaders.createProgram = function(gl){
	let vs = compileShader(gl, simpleVertexShaderColorCode, gl.VERTEX_SHADER);
	let fs = compileShader(gl, simpleFragmentShaderCode, gl.FRAGMENT_SHADER);

	let program = createProgram(gl, vs, fs);

	return program;
}

Shaders.createControlPointProgram = function(gl){
	let vs = compileShader(gl, simpleVertexShaderCode, gl.VERTEX_SHADER);
	let fs = compileShader(gl, redFragmentShader, gl.FRAGMENT_SHADER);

	let program = createProgram(gl, vs, fs);

	return program;
} 



function compileShader(gl, shaderSource, shaderType) {
  // Create the shader object
  var shader = gl.createShader(shaderType);
 
  // Set the shader source code.
  gl.shaderSource(shader, shaderSource);
 
  // Compile the shader
  gl.compileShader(shader);
 
  // Check if it compiled
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }
 
  return shader;
}

let simpleVertexShaderCode = 
	    "attribute vec2 a_position;" 
	+   "void main() {"
	+ 	  "gl_Position = vec4(a_position, 0.0, 1.0);"
	+ 	  "gl_PointSize = 6.0;"
	+"}"

  let simpleVertexShaderColorCode = 
      "attribute vec2 a_position;" 
  +   "uniform vec4 u_color;"
  +   "varying vec4 v_color;"
  +   "void main() {"
  +     "v_color = u_color;"
  +     "gl_Position = vec4(a_position, 0.0, 1.0);"
  +     "gl_PointSize = 6.0;"
  +"}"

let simpleFragmentShaderCode =     
	   "precision mediump float;"
    + "varying vec4 v_color;"
    + "void main() {"
    + 	"gl_FragColor = v_color;"
    + "}";

let redFragmentShader =     
	"precision mediump float;"
    + "void main() {"
    + 	"gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);"
    + "}";