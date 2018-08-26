class PathManager2D {
	//listens for user input
	//creates Line objects

	constructor(){
		var __tempLines = [];
		this.lineRenderer = new LineRenderer();
		this.thickness = 0;
	
		var __handle = 0;
		var __committedHandles = [];
		var __tempHandles = [];
		var __sweeps = [];
		var __added = false;
		function getNewLineHandle(){
			return __handle++;
		}

		this.updateLinesWithThickness = function(){
			if(this.thickness == 0){
				this.pathModel.dispose();
				// this.meshRenderer.removeModel(this.pathModel);
				return;
			}

			else {
				this.shape.setDimensions(0, 0, this.thickness, this.thickness);
			}

		}

		this.addTempLine = function(x1, y1, x2, y2){
			if(arguments.length != 4){
				return -1;
			}

			let handle = getNewLineHandle();
			for(var i = 0; i < arguments.length; i++){
				__tempLines[handle*4 + i] = arguments[i];
			}

			let sweep = new SweepGeometry2D();
			sweep.setShape(this.shape);
			sweep.addToPath(x1, y1);
			sweep.addToPath(x2, y2);

			this.pathModel.addGeometry(sweep);

			this.lineRenderer.addTempLine([
				__tempLines[handle*4],
				__tempLines[handle*4 + 1],
				__tempLines[handle*4 + 2],
				__tempLines[handle*4 + 3] 
				]);


			return handle++;
		}

		this.removeTempLines = function(handle){
			__tempLines = [];
			__handle = 0;
			this.lineRenderer.removeTempLine();
			// this.meshRenderer.removeModel(this.pathModel);
			this.pathModel.dispose();
		}

		this.commitPathToLayer = function(){
			for(var i = 0; i < __tempLines.length; i+=4){
			this.lineRenderer.addLine(
				__tempLines[i],
				__tempLines[i + 1],
				__tempLines[i + 2],
				__tempLines[i + 3] 
				);
			}

			__tempLines = [];
			__handle = 0;

			if(this.thickness == 0){
				this.lineRenderer.target = this.fb.id;
			}
			else {
				this.meshRenderer.target = this.fb.id;
			}

			leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
			this.lineRenderer.target = null;
			this.meshRenderer.target = null;
			this.pathModel.dispose();
			this.lineRenderer.clearLines();

		}
		
		this.removeAllPaths = function(){
			// this.meshRenderer.removeModel(this.pathModel);
			this.pathModel.dispose();
			this.lineRenderer.clearLines();
			__tempLines = [];
			__handle = 0;
		}	
	}

	
	setThickness(size){
		this.thickness = size;
		this.updateLinesWithThickness();
	}

	increamenThickness(){
		if(this.thickness < 0.2){
			this.thickness+= 0.02;
		}
		else {
			this.thickness = 0.2;
		}
		this.updateLinesWithThickness();

	}

	decrementThickness(){
		this.thickness-=-0.02;
		if(this.thickness < 0){
			this.thickness = 0;
		}
		this.updateLinesWithThickness();

	}

	init(leo){
	}

	postInit(leo){
		let layer = leo.Advanced2D.RasterLayerManager.orderedLayers[0];
		this.fb = new FrameBuffer({
			"textureId" : layer.texture.id, 
			"texWidth": layer.texture.width,
			"texHeight": layer.texture.height
		});
		leo.Engine.RenderingEngine2D.addRenderer(this.lineRenderer, 1);

	}

	start(){
		this.shape = new RectangleGeometry2D();
		
		this.pathModel = new Model();
		this.meshRenderer = new MeshRenderer2D();
		this.meshRenderer.addModel(this.pathModel);
		this.setThickness(0.005);
		this.setLineColor(0.0, 0.0, 0.0, 1.0);
		leo.Engine.RenderingEngine2D.addRenderer(this.meshRenderer, 3);

	}

	setLineColor(r, g, b, a){
		this.lineRenderer.setLineColor(r, g, b, a);
		this.pathModel.setColor([r, g, b, a]);
		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
	}

}