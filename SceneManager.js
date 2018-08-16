class PaintGLScene2D{
	constructor(config){
		//camera
		//animator
		//controller
		//lights
		//materials???
		//renderUnits???
		this.backgroundColor = config.bg;
		this.viewportDim = [0, 0, config.w, config.h];
		this.viewportChanged = true;
	}

	init(){
	}

	setBackgroundColor(r, g, b, a){
		this.backgroundColor[0] = r;
		this.backgroundColor[1] = g;
		this.backgroundColor[2] = b;
		this.backgroundColor[3] = a;
	}

	setViewportDimensions(x, y, w, h){
		this.viewportDim[0] = x;
		this.viewportDim[1] = y;
		this.viewportDim[2] = w;
		this.viewportDim[3] = h;
		this.viewportChanged = true;
	}
	
}
