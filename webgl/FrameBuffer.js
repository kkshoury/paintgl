class FrameBuffer{
	constructor(){
		this.id = 1;//Symbol();

		let texAttachments = [];

		for(var i = 0; i < arguments.length; i++){
			let a = arguments[i];
			let def = getDefault()
			if(a.attachmentPoint){
				def.attachmentPoint = a.attachmentPoint;
			}

			if(a.textureTarget){
				def.textureTarget = a.textureTarget;
			}

			if(a.textureId){
				def.textureId = a.textureId;
			}

			if(a.level){
				def.level = a.level;
			}

			if(a.texWidth){
				def.texWidth = a.texWidth;
			}

			if(a.texHeight){
				def.texHeight = a.texHeight;
			}

			texAttachments.push(def);
		}

		this.attachedTextures = texAttachments;

 		leo.Events.EventEmitter.shout("FRAME_BUFFER_CREATED", this, "GRAPHICS_ENGINE");

 		function getDefault(){
 			let atm = {}
 			atm.attachmentPoint = "COLOR_ATTACHMENT0";
			atm.textureTarget = "TEXTURE_2D";
			atm.textureId = null;
			atm.level = 0;

			return atm;
 		}

	}
}