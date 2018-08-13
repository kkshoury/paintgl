class PaintGL2DRenderingEngine {
	
	constructor(){
		this.stopped = false;
		this.paused = false;

	}

	preInitConfiguration(config){
		this.config = {
			w: config.SETTINGS.GRAPHICS.canvasWidth,
			h: config.SETTINGS.GRAPHICS.canvasHeight,
			bg: config.SETTINGS.GRAPHICS.backgroundColor,
			canvasId: config.SETTINGS.GRAPHICS.canvasId,
			canvasParent : config.SETTINGS.GRAPHICS.canvasParent
		};
	}

	init(context){
		this.scene = new PaintGLScene2D(this.config);
		this.composer = new SceneComposer2D(this.config);
		this.composer.init(this.config);
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
	}

	update(){
		let start = Date.now();
		this.composer.step(this.scene);
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