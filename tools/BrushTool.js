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
		this.brushSize = 1;
	}

	init(){
		// this.pathManager = leo.ArtManagers2D.PathManager2D;
		this.shape = new RectangleGeometry2D();
		this.shape.setDimensions(0, 0, this.brushSize * 0.03, this.brushSize * 0.03 * 800/1200.0);
		this.renderer = new MeshRenderer2D();
		this.lineRenderer = new LineRenderer();
		leo.Events.EventEmitter.listen(this.keyPressed.bind(this), "KEY_DOWN", "USER_KEY_INPUT");
		leo.Events.EventEmitter.listen(this.setColor.bind(this),
			"COLOR_CHANGED", 
			"UI");

	}

    postInit(leo){
    	
	}

	keyPressed(e){
		if(e.key === leo.Keyboard.MINUS){
			this.decrementBrushSize();
			this.shape.setDimensions(0, 0, this.brushSize * 0.03, this.brushSize * 0.03 * 800/1200.0);
			leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

		}

		if(e.key === leo.Keyboard.PLUS){
			this.increamentBrushSize();
			this.shape.setDimensions(0, 0, this.brushSize * 0.03, this.brushSize * 0.03 * 800/1200.0);
			leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

		}
	}
	increamentBrushSize(){
		if(this.brushSize >= 10){
			this.brushSize = 10;
			return;
		}

		this.brushSize++;
	}

	decrementBrushSize(){
		if(this.brushSize <= 1){
			this.brushSize = 1;
			return;
		}
		this.brushSize--;
	}
	setColor(c){
		if(this.sweepModel){
			this.sweepModel.setColor(c);
		}

		if(this.brushModel){
			this.brushModel.setColor(c);
		}

		this.brushColor  = c;
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

		if(this.brushColor){
			this.sweepModel.setColor(this.brushColor);
			
		}

		this.brushModel = new Model();
		this.brushModel.addGeometry(this.shape);
		if(this.brushColor){
			this.brushModel.setColor(this.brushColor);
			
		}

		this.renderer.addModel(this.brushModel);
		leo.Engine.RenderingEngine2D.addRenderer(this.renderer, 2);


	}

	deactivate(){
		this.sweep.setPath(null);
		this.renderer.removeModel(this.brushModel);
		this.renderer.removeModel(this.sweepModel);
		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

	}

	onMouseDown(e){
		this.mouseIsDown = true;
		this.mouseHasNotMoved = true;
		this.line = setMousePositionFromEvent(e, this.line, 0);
		this.sampleCount++;

		this.sweep.setPath(null);
		
		if(this.brushColor){
			this.sweepModel.setColor(this.brushColor);
		}
	}

	onMouseMove(e){
		this.brushModel.translate(e.clipX, e.clipY);
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
		this.renderer.removeModel(this.brushModel);
		this.renderer.target = this.fb.id;
		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
		this.renderer.target = null;
		this.renderer.addModel(this.brushModel);
		this.sweep.setPath(null);
		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
	}


}