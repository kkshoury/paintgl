class WebGLContextSingletonFactory{
	constructor(canvas){
		this.context = null;
	}

	setContextSource(src){
		this.context = src.getContext("webgl");
		src.getContext = function(){
			errlog("Can't access context");
		}
	}

	getWebGLContext(){
		if(!this.context){
			return null;
		}
		return this.context;
	}

}

