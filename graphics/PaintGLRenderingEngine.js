class PaintGL2DRenderingEngine {
	
	constructor(){

	}

	preinit(){

	}
	init(){
		this.scene = new PaintGLScene2D();
		this.composer = new SceneComposer2D();
		this.reinit();
	}

	postInit(context){
		paintgl.Events.EventEmitter.listen(this.refresh.bind(this), "SCENE_CHANGED", "SCENE");
	}

	start(){
	
	}

	reinit(){
		this.composer.init();
	}

	refresh(){
		this.composer.render();
	}

	addRenderer(renderer){
		this.composer.addRenderer(renderer);
	}

}