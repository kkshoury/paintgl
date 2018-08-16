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


class BrushTool{
	constructor(){
		this.id = "2D_BRUSH_TOOL";
		this.line = [null, null, null, null];
		this.mouseIsDown = false;
		this.mouseHasNotMoved = false;
		this.sampleCount = 0;
		this.brushColor = [0.0, 0.0, 0.0, 1.0];
	}

	init(){
		// this.pathManager = paintgl.ArtManagers2D.PathManager2D;
		this.shape = new RectangleGeometry2D();
		this.shape.setDimensions(0, 0, 0.1, 0.1);
		this.renderer = new MeshRenderer2D();
		this.lineRenderer = new LineRenderer();

		paintgl.Events.EventEmitter.listen(this.setColor.bind(this),
			"COLOR_CHANGED", 
			"UI");

	}

    postInit(paintgl){
    	
	}

	setColor(c){
		if(this.sweepModel){
			this.sweepModel.setColor(c);
			this.sweepModel.update();

		}

		if(this.brushModel){
			this.brushModel.setColor(c);
			this.brushModel.update();
			
		}

		this.brushColor  = c;
	}

	start(){
		let layer = paintgl.Advanced2D.RasterLayerManager.orderedLayers[0];
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
		if(this.brushColor){
			this.sweepModel.setColor(this.brushColor);
			
		}

		this.brushModel = new Model();
		this.brushModel.addGeometry(this.shape);
		if(this.brushColor){
			this.brushModel.setColor(this.brushColor);
			
		}

		this.brushModel.setRenderer(this.renderer);
		paintgl.Engine.RenderingEngine2D.addRenderer(this.renderer, 2);


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
		if(this.brushColor){
			this.sweepModel.setColor(this.brushColor);
		}
	}

	onMouseMove(e){
		this.brushModel.translate(e.clipX, e.clipY);
		this.brushModel.update();
		if(!this.mouseIsDown){
			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
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
		paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
	}

	onMouseUp(e){
		if(this.mouseIsDown && this.sampleCount > 0){
			this.renderer.target = this.fb.id;
			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
			this.renderer.target = null;
			this.renderer.removeModels();
			this.brushModel.setRenderer(this.renderer);
			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

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
		paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
		// this.pathManager.removeTempLines();
		this.mouseIsDown = false;
		this.sampleCount = 0;
	}

}