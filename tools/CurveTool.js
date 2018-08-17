class CurveTool{
	constructor(){
		this.id = "2D_CURVE_TOOL";
		this.line = [null, null, null, null, null, null, null, null];
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
		
		
	}

	init(paintgl){
		this.pathManager = paintgl.ArtManagers2D.PathManager2D;
		this.controlPointsManager = paintgl.ControlManagers.ControlPointManager;
	}

	start(){
		this.state = this.STATE_DRAW_LINE;
	}

	onMouseDown(e){
		this.mouseIsDown = true;
		this.mouseDidntMove = true;
		if(this.state == this.STATE_EDIT_MODE){
			let mx = e.clipX;
			let my = e.clipY;

			let index = this.controlPointsManager.checkSelectedPoint([mx, my]);
			if(index == -1){
				this.state = this.STATE_DRAW_LINE;
				this.pathManager.commitPathToLayer(this.handle);
				this.pathManager.removeTempLines();
				this.controlPointsManager.unregisterListener(this);
				this.controlPointsManager.clearControlPoints();
				paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
				this.controlPointCount = 0;

				this.line = setMousePositionFromEvent(e, this.line, 0);
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
			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

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

	commit(){
		this.state = this.STATE_EDIT_MODE;
		this.pathManager.commitPathToLayer();
		this.pathManager.removeTempLines();
		this.controlPointsManager.unregisterListener(this);
		this.controlPointsManager.clearControlPoints();
		paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
		this.mouseIsDown = false;
		this.controlPointCount = 0;
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

			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

		}
		else if(e.type === this.controlPointsManager.CONTROL_POINT_SELECTED_EVENT){
			this.state = this.STATE_EDIT_MODE;
		}

	}
}