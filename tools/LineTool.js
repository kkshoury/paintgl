function setMousePositionFromEvent(e, destination, startIndex){
	let canvas = document.getElementById("canvas");
    let rect = canvas.getBoundingClientRect();
    destination[startIndex] =(e.clientX - rect.left) / canvas.width * 2 -1; 
    destination[startIndex + 1] = (e.clientY - rect.top) / canvas.height * -2 + 1;
    return destination;
}

function setMousePositionFast(x, y, destination, startIndex){
	let canvas = document.getElementById("canvas");
    let rect = canvas.getBoundingClientRect();
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
		this.pathManager = paintgl.ArtManagers.PathManager2D;
		this.controlPointsManager = paintgl.ControlManagers.ControlPointManager;
	}

	onMouseDown(e){
		this.mouseIsDown = true;
		this.mouseHasNotMoved = true;

		if(this.inEditMode){
			let p = getMousePos(e);
			let index = this.controlPointsManager.checkSelectedPoint(p);
			if(index == -1){
				this.inEditMode = false;
				this.pathManager.commitLine(this.handle);
				this.pathManager.removeTempLines();
				this.controlPointsManager.unregisterListener(this);
				this.controlPointsManager.clearControlPoints();
				paintgl.ArtManagers.CanvasManager.refresh();

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
		paintgl.ArtManagers.CanvasManager.refresh();


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
			
			paintgl.ArtManagers.CanvasManager.refresh();


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
		this.pathManager.commitLine(this.handle);
		this.pathManager.removeTempLines();
		this.controlPointsManager.unregisterListener(this);
		this.controlPointsManager.clearControlPoints();
		paintgl.ArtManagers.CanvasManager.refresh();
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
			paintgl.ArtManagers.CanvasManager.refresh();

		}
		else if(e.type === this.controlPointsManager.CONTROL_POINT_SELECTED_EVENT){
			this.inEditMode = true;
			log("Control selected");
			
		}

	}
}