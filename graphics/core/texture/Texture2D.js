class Texture2D{
	constructor(width, height, data, read){
		this.getWidth = function() {return width;}
		this.getHeight = function() {return height};

		this.level = 0;
  		this.internalformat = "RGBA";
 		this.border = 0;
  		this.format = "RGBA";
  		this.type = "UNSIGNED_BYTE";
 		this.data = data || null; //could be null if texture is used for write

 		// let cols = [];
 		// for(var i = 0; i < height*width; i++){
 		// 		if(i < height*width/2){
 		// 			cols.push(255);
 		// 			cols.push(0);
 		// 			cols.push(0);
 		// 			cols.push(255);
 		// 		}
 		// 		else {
 		// 			cols.push(0);
 		// 			cols.push(255);
 		// 			cols.push(0);
 		// 			cols.push(255);
 		// 		}
 				
 			
 		// }

 		// this.data = new Uint8Array(cols);

 		this.id = 1;//Symbol();
 		this.forRead = read;
 		this.width = width;
 		this.height = height;
 		leo.Events.EventEmitter.shout("TEXTURE_CREATED", {id: this.id, props: this}, "GRAPHICS_ENGINE");



	}

}