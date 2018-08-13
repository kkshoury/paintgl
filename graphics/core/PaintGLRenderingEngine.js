class PaintGL2DRenderingEngine {
	
	constructor(){
		this.stopped = false;
		this.paused = false;

	}

	preinit(){

	}
	init(){
		this.scene = new PaintGLScene2D();
		this.composer = new SceneComposer2D();
		this.reinit();
	}

	postInit(context){
		paintgl.Events.EventEmitter.listen(this.update.bind(this), "SCENE_CHANGED", "SCENE");
	}

	start(){
	
	}

	reset(){
		this.scene.dispose();
		this.composer.dispose();
	}

	reinit(){
		this.composer.init();
	}

	update(){
		let start = Date.now();
		this.composer.step();
		let ms = (Date.now() - start);

	}

	addRenderer(renderer, pass, target, input){
		if(target){
			renderer.target = target;
		}

		if(input){
			renderer.input = input;
		}

		if(renderer.on === false){
			renderer.on = false;
		}
		else {
			renderer.on = true;
		}

		if(!pass){
			pass = 0;
		}
		this.composer.addRenderer(renderer, pass);
	}

}