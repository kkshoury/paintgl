class CurveTool{
	constructor(){
		this.id = "2D_CURVE_TOOL";
		this.line = [];
		this.controlPointCount = 0;
		this.mouseIsDown = false;
		this.STATE_DRAW_LINE = 0;
		this.STATE_ADD_CONTROL_POINT = 1;
		this.STATE_EDIT_MODE = 2;
		this.maxControlPoints = 4;
		this.state = this.STATE_DRAW_LINE;
		this.handle = null;
		this.mouseDidntMove = false;
		this.pathManager = null;
		this.controlPointsManager = null;
		this.curveColor = [0.0, 0.0, 0.0, 1.0];
		this.curveSize = 1;
		
		
	}

	init(paintgl){
		this.curveSize = 1;
		this.pathManager = paintgl.ArtManagers2D.PathManager2D;
		this.controlPointsManager = paintgl.ControlManagers.ControlPointManager;
		this.meshRenderer = new MeshRenderer2D();
		this.sweep = null;
		this.shape = new RectangleGeometry2D();
		this.shape.setDimensions(0, 0, 0.01, 0.01 * 600/800.0);
		this.curveModel = new Model();
		paintgl.Events.EventEmitter.listen(this.setColor.bind(this),
			"COLOR_CHANGED", 
			"UI");

		let layer = paintgl.Advanced2D.RasterLayerManager.orderedLayers[0];
		this.fb = new FrameBuffer({
			"textureId" : layer.texture.id, 
			"texWidth": layer.texture.width,
			"texHeight": layer.texture.height
		});


	}

	increamentCurveSize(){
		if(this.curveSize >= 10){
			this.curveSize = 10;
			return;
		}

		this.curveSize++;
	}

	decrementCurveSize(){
		if(this.curveSize <= 1){
			this.curveSize = 1;
			return;
		}
		this.curveSize--;
	}

	setColor(color){
		if(this.curveColor){
			this.curveColor = color;
		}

		if(this.curveModel){
			this.curveModel.setColor(this.curveColor);
			this.curveModel.update();
		}
	}

	start(){
		this.curveSize = 1;
		this.state = this.STATE_DRAW_LINE;
		this.curveModel.setRenderer(this.meshRenderer);
		this.sweep = new SweepGeometry2D();
		this.sweep.setShape(this.shape);
		this.curveModel.addGeometry(this.sweep);
		paintgl.Engine.RenderingEngine2D.addRenderer(this.meshRenderer, 3);
		this.curveModel.setColor(this.curveColor);
		paintgl.Events.EventEmitter.listen(this.keyPressed.bind(this), "KEY_DOWN", "USER_KEY_INPUT");
		
	}

	commit(){
		this.state = this.STATE_DRAW_LINE;
		this.controlPointCount = 0;
		this.mouseIsDown = false;
		
		this.pathManager.removeAllPaths();
		this.controlPointsManager.unregisterListener(this);
		this.controlPointsManager.clearControlPoints();

		if(this.line.length >= 6){
			this.meshRenderer.target = this.fb.id;
			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
			this.meshRenderer.target = null;
			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
		}
		
		this.curveModel.setRenderer(null);
		

	}

	onMouseDown(e){
		this.mouseIsDown = true;
		this.mouseDidntMove = true;
		if(this.state == this.STATE_EDIT_MODE){
			let mx = e.clipX;
			let my = e.clipY;

			let index = this.controlPointsManager.checkSelectedPoint([mx, my]);
			if(index == -1){
				this.commit();
			}

			return;
		}

		if(this.state == this.STATE_DRAW_LINE){
			this.line = setMousePositionFromEvent(e, this.line, this.controlPointCount * 2);
			this.controlPointCount++;

			for(var i = 0; i < this.controlPointCount-1 && this.controlPointCount > 1 ; i++){
				this.pathManager.addTempLine(
					this.line[i*2],
					this.line[i*2 + 1],
					this.line[(i+1)*2],
					this.line[(i+1)*2 + 1]
					);

			}
			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

			this.controlPointsManager.unregisterListener(this);

			if(this.controlPointCount == 2){
				this.state = this.STATE_ADD_CONTROL_POINT;
			}

			return;
		}

		if(this.state == this.STATE_ADD_CONTROL_POINT){
			this.pathManager.removeTempLines();
			setMousePositionFast(this.line[2], this.line[3], this.line, 4);
			this.line = setMousePositionFromEvent(e, this.line, 2);
			this.controlPointCount++;

			for(var i = 0; i < this.controlPointCount-1 && this.controlPointCount > 1 ; i++){
				this.pathManager.addTempLine(
					this.line[i*2],
					this.line[i*2 + 1],
					this.line[(i+1)*2],
					this.line[(i+1)*2 + 1]
					);

			}

			let curve = new BezierCurveGeometry2D();
			curve.setControlPoints(this.line);
			let vert = curve.getVertices();
			this.sweep.setPath(vert);
			this.curveModel.setRenderer(this.meshRenderer);
			this.curveModel.update();

			// paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

			this.state == this.STATE_EDIT_MODE;
			this.controlPointsManager.registerListener(this);
			for(var i = 0; i < this.controlPointCount ; i++){
				this.controlPointsManager.registerControlPoint(i +1, [this.line[i*2], this.line[i*2 + 1]]);
			}

			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

		}
		
	}

	onMouseMove(e){
		if(!this.mouseIsDown || this.state == this.STATE_EDIT_MODE){
			return;
		}

		this.mouseDidntMove = false;

		if(this.state == this.STATE_DRAW_LINE){
			this.pathManager.removeTempLines(); // give it id
			this.controlPointsManager.clearControlPoints();
			if(this.controlPointCount > 1){
				this.line = setMousePositionFromEvent(e, this.line, (this.controlPointCount-1)*2);
			}
			else {
				this.line = setMousePositionFromEvent(e, this.line, (this.controlPointCount)*2);
				this.controlPointCount ++;
			}
			for(var i = 0; i < this.controlPointCount -1 ; i++){
				this.pathManager.addTempLine(
					this.line[i*2],
					this.line[i*2 + 1],
					this.line[(i+1)*2],
					this.line[(i+1)*2 + 1]
					);

			}

			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");



			return;
		}

		
	}

	onDoubleClick(e){
		this.mouseIsDown = false;
		this.state = this.STATE_EDIT_MODE;
		this.controlPointCount--;

		if(this.controlPointCount > 2){
			if(this.line[(this.controlPointCount - 1) * 2] == this.line[(this.controlPointCount - 2)*2]){
				if(this.line[(this.controlPointCount - 1) * 2 + 1] == this.line[(this.controlPointCount - 2)*2 + 1]){
					this.controlPointCount--;
				}
			}
		}
		
		this.pathManager.removeTempLines();
		for(var i = 0; i < (this.controlPointCount -1) && this.controlPointCount > 1 ; i++){
			this.pathManager.addTempLine(
				this.line[i*2],
				this.line[i*2 + 1],
				this.line[((i+1)) * 2],
				this.line[((i+1)) * 2 + 1]
				);

		}


		this.controlPointsManager.clearControlPoints();
		this.controlPointsManager.registerListener(this);
		for(var i = 0; i < this.controlPointCount ; i++){
			this.controlPointsManager.registerControlPoint(i +1, [this.line[i*2], this.line[i*2 + 1]]);
		}

		paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

	}

	onMouseUp(e){
		if(this.state == this.STATE_EDIT_MODE){
			return;
		}
		
		if(this.controlPointCount == 2){
			this.state = this.STATE_ADD_CONTROL_POINT;
		}

		if(this.mouseIsDown){
			this.mouseIsDown = false;
			e.skip = 1;
		}
		else {
			for(var i = 0; i < this.controlPointCount ; i++){
				this.line[i*2] = null;
				this.line[i*2+1] = null;
			}
		}
	}


	isDrawing(){

	}

	isEditing(){

	}

	keyPressed(e){
		if(e.key === paintgl.Keyboard.MINUS){
			this.decrementCurveSize();
			this.shape.setDimensions(0, 0, this.curveSize * 0.01, this.curveSize * 0.01 * 600/800.0);
			if(this.curveModel){
				this.curveModel.update();
			}
			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

		}

		if(e.key === paintgl.Keyboard.PLUS){
			this.increamentCurveSize();
			this.shape.setDimensions(0, 0, this.curveSize * 0.01, this.curveSize * 0.01 * 600/800.0);
			if(this.curveModel){
				this.curveModel.update();
			}
			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

		}
	}

	handleControlPointEvent(e){
		if(e.type === this.controlPointsManager.CONTROL_POINT_MOVED_EVENT) {
			this.state = this.STATE_EDIT_MODE;
			let index = e.index;
			let cp = this.controlPointsManager.getControlPoint(index);
			
			for(var i = 0; i < this.controlPointCount; i++){
				if((index -1)== i){
					this.line[i*2] = cp[0];
					this.line[i*2 + 1] = cp[1];

				}
			}
			

			this.pathManager.removeTempLines(); //give it id
			for(var i = 0; i < this.controlPointCount - 1; i++){
				this.pathManager.addTempLine(
					this.line[i*2],
					this.line[i*2 + 1],
					this.line[((i+1)) * 2],
					this.line[((i+1)) * 2 + 1]
				);

			}

			this.controlPointsManager.clearControlPoints();
			for(var i = 0; i < this.controlPointCount ; i++){
				this.controlPointsManager.registerControlPoint(i+1, [this.line[i*2], this.line[i*2 + 1]]);
			}

			let curve = new BezierCurveGeometry2D();
			curve.setControlPoints(this.line);
			let vert = curve.getVertices();
			this.sweep.setPath(vert);
			this.curveModel.update();

			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

		}
		else if(e.type === this.controlPointsManager.CONTROL_POINT_SELECTED_EVENT){
			this.state = this.STATE_EDIT_MODE;
		}

	}
}