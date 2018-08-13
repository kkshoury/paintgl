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


class LineTool{
	constructor(){
		this.id = "2D_LINE_TOOL";
		this.line = [null, null, null, null];
		this.mouseIsDown = false;
		this.inEditMode = false;
		this.handle = null;
		this.mouseHasNotMoved = false;
	}

	init(){
		this.pathManager = paintgl.ArtManagers2D.PathManager2D;
		this.controlPointsManager = paintgl.ControlManagers.ControlPointManager;
	}

	postInit(){
	}

	onMouseDown(e){
		this.mouseIsDown = true;
		this.mouseHasNotMoved = true;

		if(this.inEditMode){
			let mx = e.clipX;
			let my = e.clipY;

			let index = this.controlPointsManager.checkSelectedPoint([mx, my]);
			if(index == -1){
				this.inEditMode = false;
				this.pathManager.commitPathToLayer(this.handle);
				this.pathManager.removeTempLines();
				this.controlPointsManager.unregisterListener(this);
				this.controlPointsManager.clearControlPoints();
				paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

				this.line = setMousePositionFromEvent(e, this.line, 0);
			}

			return;
		}
		this.line = setMousePositionFromEvent(e, this.line, 0);
		this.controlPointsManager.unregisterListener(this);
	}

	onMouseMove(e){
		if(!this.mouseIsDown || this.inEditMode){
			return;
		}

		this.mouseHasNotMoved = false;


		this.pathManager.removeTempLines(); // give it id
		this.controlPointsManager.clearControlPoints();
		this.line = setMousePositionFromEvent(e, this.line, 2);
		this.handle = this.pathManager.addTempLine(
			this.line[0],
			this.line[1],
			this.line[2],
			this.line[3]
			);
		paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");


	}

	onMouseUp(e){
		if(this.inEditMode){
			return;
		}

		if(this.mouseIsDown){

			if(this.mouseHasNotMoved){
				this.mouseIsDown = false;
				this.mouseHasNotMoved = false;
				return;
			}

			this.mouseIsDown = false;
			this.inEditMode = true;
			e.skip = 1;
			this.controlPointsManager.registerListener(this);
			this.controlPointsManager.registerControlPoint(
				1, [this.line[0], this.line[1]]);
			this.controlPointsManager.registerControlPoint(
				2, [this.line[2], this.line[3]]);
			
			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");


		}
		else {
			this.line[0] = null;
			this.line[1] = null;
			this.line[2] = null;
			this.line[3] = null;
		}
	}


	isDrawing(){

	}

	isEditing(){

	}

	commit(){
		this.pathManager.commitPathToLayer(this.handle);
		this.pathManager.removeTempLines();
		this.controlPointsManager.unregisterListener(this);
		this.controlPointsManager.clearControlPoints();
		paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
		this.inEditMode = false;
		this.mouseIsDown = false;
	}

	handleControlPointEvent(e){

		if(e.type === this.controlPointsManager.LOST_CONTROL_EVENT){
			

		}
		else if(e.type === this.controlPointsManager.CONTROL_POINT_MOVED_EVENT) {
			this.inEditMode = true;
			let index = e.index;
			let cp = this.controlPointsManager.getControlPoint(index);
			if(index == 1){
				this.line[0] = cp[0];
				this.line[1] = cp[1];
			}
			else if (index == 2){
				this.line[2] = cp[0];
				this.line[3] = cp[1];
			}

			this.pathManager.removeTempLines(); //give it id
			this.handle = this.pathManager.addTempLine(
				this.line[0],
				this.line[1],
				this.line[2],
				this.line[3]
			);
			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

		}
		else if(e.type === this.controlPointsManager.CONTROL_POINT_SELECTED_EVENT){
			this.inEditMode = true;
		}

	}
}