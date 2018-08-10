class TextureManager2D {
	constructor(){

	}

	createTexture(gl, texture){
		gl.texImage2D(
			gl.TEXTURE_2D, 
			texture.level, 
			texture.internalformat, 
			texture.width, 
			texture.height, 
			texture.border, 
			texture.format, 
			texture.type, 
			texture.data
			);

		  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
 		 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}


}