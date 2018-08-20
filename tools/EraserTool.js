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
		this.shape.setDimensions(0, 0, 0.1, 0.1 * 600/800.0);
		this.renderer = new MeshRenderer2D();
		this.eraserModel = new Model();
		this.eraserModel.addGeometry(this.shape);
		this.lineRenderer = new LineRenderer();

	}

    postInit(leo){
    	
	}

	start(){
		let layer = leo.Advanced2D.RasterLayerManager.orderedLayers[0];
		this.fb = new FrameBuffer({
			"textureId" : layer.texture.id, 
			"texWidth": layer.texture.width,
			"texHeight": layer.texture.height
		});

		this.sweep = new SweepGeometry2D();
		this.sweep.setShape(this.shape);
		
		
		this.sweepModel = new Model();
		this.sweepModel.addGeometry(this.sweep);
		this.sweepModel.setRenderer(this.renderer);
		
		this.eraserModel.setRenderer(this.renderer);
		leo.Engine.RenderingEngine2D.addRenderer(this.renderer, 2);


	}

	onMouseDown(e){
		this.mouseIsDown = true;
		this.mouseHasNotMoved = true;
		this.line = setMousePositionFromEvent(e, this.line, 0);
		this.sampleCount++;

		this.sweep = new SweepGeometry2D();
		this.sweep.setShape(this.shape);
		
		
		this.sweepModel = new Model();
		this.sweepModel.addGeometry(this.sweep);
		this.sweepModel.setRenderer(this.renderer);
	}

	onMouseMove(e){
		this.eraserModel.translate(e.clipX, e.clipY);
		this.eraserModel.update();
		if(!this.mouseIsDown){
			leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
		}


		if(!this.mouseIsDown){
			return;
		}
		this.mouseHasNotMoved = false;
		this.line = setMousePositionFromEvent(e, this.line, this.sampleCount*2);

		this.sweep.addToPath(e.clipX, e.clipY);
		this.sweepModel.update();

		// this.handle = this.pathManager.addTempLine(
		// 	this.line[(this.sampleCount-1)*2],
		// 	this.line[(this.sampleCount-1)*2 + 1],
		// 	this.line[(this.sampleCount)*2],
		// 	this.line[(this.sampleCount)*2 + 1]

		// );
		this.sampleCount++;
		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
	}

	onMouseUp(e){
		if(this.mouseIsDown && this.sampleCount > 0){
			this.renderer.target = this.fb.id;
			leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
			this.renderer.target = null;
			this.renderer.removeModels();
			this.eraserModel.setRenderer(this.renderer);
			leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

			this.commit();
			this.mouseIsDown = false;


		}
		else {
			// this.pathManager.removeTempLines();
			if(this.line.length > 10000){
				this.line = [];
			}
			
			this.sampleCount = 0;

		}

		this.mouseIsDown = false;
	}

	commit(){
		// this.pathManager.commitPathToLayer(this.handle);
		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
		// this.pathManager.removeTempLines();
		this.mouseIsDown = false;
		this.sampleCount = 0;
	}

}