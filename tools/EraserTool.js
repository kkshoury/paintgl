function setMousePositionFromEvent(e, destination, startIndex){
    destination[startIndex] = e.clipX; 
    destination[startIndex + 1] = e.clipY;
    return destination;
}

function setMousePositionFast(x, y, destination, startIndex){
	destination[startIndex] = x; 
    destination[startIndex + 1] =  y;
    return destination;
}


class EraserTool{
	constructor(){
		this.id = "2D_ERASER_TOOL";
		this.line = [null, null, null, null];
		this.mouseIsDown = false;
		this.mouseHasNotMoved = false;
		this.sampleCount = 0;
	}

	init(){
		// this.pathManager = leo.ArtManagers2D.PathManager2D;
		this.shape = new RectangleGeometry2D();
		this.shape.setDimensions(0, 0, 0.1, 0.1 * 800/1200.0);
		this.renderer = new MeshRenderer2D();
		this.eraserModel = new Model();
		this.eraserModel.addGeometry(this.shape);
		this.lineRenderer = new LineRenderer();

	}

    postInit(leo){
    	
	}

	activate(){
		let layer = leo.Advanced2D.RasterLayerManager.orderedLayers[0];
		this.fb = new FrameBuffer({
			"textureId" : layer.texture.id, 
			"texWidth": layer.texture.width,
			"texHeight": layer.texture.height
		});

		this.sweep = new SweepGeometry2D();
		this.sweep.setShape(this.shape);
		this.sweep.setPath(null);
		
		
		this.sweepModel = new Model();
		this.sweepModel.addGeometry(this.sweep);
		this.renderer.addModel(this.sweepModel);
		this.renderer.addModel(this.eraserModel);
		this.eraserModel.setColor([0.95, 0.95, 0.95, 1]);

		leo.Engine.RenderingEngine2D.addRenderer(this.renderer, 2);


	}

	deactivate(){
		this.sweep.setPath(null);
		this.renderer.removeModel(this.eraserModel);
		this.renderer.removeModel(this.sweepModel);	
		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");


	}

	onMouseDown(e){
		this.mouseIsDown = true;
		this.mouseHasNotMoved = true;
		this.line = setMousePositionFromEvent(e, this.line, 0);
		this.sampleCount++;

		this.sweep.setPath(null);
	}

	onMouseMove(e){
		this.eraserModel.translate(e.clipX, e.clipY);
		
		if(!this.mouseIsDown){
			leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
		}

		if(!this.mouseIsDown){
			return;
		}

		this.mouseHasNotMoved = false;
		this.line = setMousePositionFromEvent(e, this.line, this.sampleCount*2);

		this.sweep.addToPath(e.clipX, e.clipY);

		this.sampleCount++;
		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
	}

	onMouseUp(e){
		if(this.mouseIsDown && this.sampleCount > 0){
			this.commitToLayer();
		}
		else {
			if(this.line.length > 10000){
				this.line = [];
			}
			
		}

		this.sampleCount = 0;
		this.mouseIsDown = false;
	}

	commitToLayer(){
		this.renderer.removeModel(this.eraserModel);
		this.renderer.target = this.fb.id;
		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
		this.renderer.target = null;
		this.renderer.addModel(this.eraserModel);
		this.sweep.setPath(null);
		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
	}

}