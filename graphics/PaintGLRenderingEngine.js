class PaintGL2DRenderingEngine {
	
	constructor(){

	}

	preinit(){

	}
	init(){
		this.paintingManager = new PaintGL2DPaintingManager();
		this.reinit();
		this.paintingArtListener = new PaintingArtListener(this.paintingManager.getContext());
	}

	postInit(){
	}

	start(){
	}

	reinit(){
		this.paintingManager.init();
	}

	refresh(){
		this.paintingArtListener.render(this.paintingManager.getContext());

	}

	addRenderer(renderer){
		this.paintingArtListener.addRenderer(renderer);
	}

}