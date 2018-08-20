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


class RectangleTool{
	constructor(){
		this.id = "2D_RECTANGLE_TOOL";
		this.line = [null, null, null, null, null, null, null, null];
		this.mouseIsDown = false;
		this.inEditMode = false;
		this.handle = null;
		this.mouseHasNotMoved = false;
		
	}

	init(){
		this.pathManager = leo.ArtManagers2D.PathManager2D;
		this.controlPointsManager = leo.ControlManagers.ControlPointManager;
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
				leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

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
		let bleftx = this.line[0], blefty = this.line[1]; 
		let tleftx = this.line[0], tlefty = this.line[3];
		let trightx = this.line[2], trighty = this.line[3];
		let brightx = this.line[2], brighty = this.line[1];

		// setMousePositionFast(tleftx, tlefty, this.line, 4);
		// setMousePositionFast(brightx, brighty, this.line, 6);

		this.handle = this.pathManager.addTempLine(
			bleftx, blefty, tleftx, tlefty
			);

		this.handle = this.pathManager.addTempLine(
			tleftx, tlefty, trightx, trighty
			);

		this.handle = this.pathManager.addTempLine(
			trightx, trighty, brightx, brighty
			);

		this.handle = this.pathManager.addTempLine(
			brightx, brighty, bleftx, blefty
			);

		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
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
			let bleftx = this.line[0], blefty = this.line[1]; 
			let tleftx = this.line[0], tlefty = this.line[3];
			let trightx = this.line[2], trighty = this.line[3];
			let brightx = this.line[2], brighty = this.line[1];

			this.controlPointsManager.registerControlPoint(1, [bleftx, blefty]);
			this.controlPointsManager.registerControlPoint(2, [tleftx, tlefty]);
			this.controlPointsManager.registerControlPoint(3, [trightx, trighty]);
			this.controlPointsManager.registerControlPoint(4, [brightx, brighty]);
			
			this.controlPointsManager.registerControlPoint(5, [(bleftx + brightx)/2, (brighty + blefty)/2]);
			this.controlPointsManager.registerControlPoint(6, [(bleftx + tleftx) / 2,  (blefty + tlefty)/2]);
			this.controlPointsManager.registerControlPoint(7, [(tleftx + trightx) / 2,  (tlefty + trighty)/2]);
			this.controlPointsManager.registerControlPoint(8, [(brightx + trightx) / 2,  (brighty + trighty)/2]);
			

			leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");


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
		this.inEditMode = false;
		this.pathManager.commitPathToLayer();
		this.pathManager.removeTempLines();
		this.controlPointsManager.unregisterListener(this);
		this.controlPointsManager.clearControlPoints();
		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
		this.mouseIsDown = false;
	}

	handleControlPointEvent(e){

		if(e.type === this.controlPointsManager.LOST_CONTROL_EVENT){
			// this.inEditMode = false;
			// this.pathManager.commitPathToLayer(this.handle);
			// this.pathManager.removeTempLines();
			// this.controlPointsManager.unregisterListener(this);
			// this.controlPointsManager.clearControlPoints();
			// leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

			// log("starting new temp line");
			// this.line = setMousePositionFast(e.mousePosition[0], e.mousePosition[1], this.line, 0);
			// // this.mouseIsDown = true;

		}
		else if(e.type === this.controlPointsManager.CONTROL_POINT_MOVED_EVENT) {
			this.inEditMode = true;
			let index = e.index;
			let cp = this.controlPointsManager.getControlPoint(index);
			
			switch(index){
				case 1:
				this.line[0] = cp[0];
				this.line[1] = cp[1]; break;
				case 2:
				this.line[0] = cp[0];
				this.line[3] = cp[1]; break;
				case 3:
				this.line[2] = cp[0];
				this.line[3] = cp[1]; break;
				case 4:
				this.line[2] = cp[0];
				this.line[1] = cp[1]; break;
				case 5: 
				this.line[1] = cp[1]; break;
				case 6: 
				this.line[0] = cp[0]; break;
				case 7: 
				this.line[3] = cp[1]; break;
				case 8: 
				this.line[2] = cp[0]; break;

			}
			

			this.pathManager.removeTempLines(); //give it id
			let bleftx = this.line[0], blefty = this.line[1]; 
			let tleftx = this.line[0], tlefty = this.line[3];
			let trightx = this.line[2], trighty = this.line[3];
			let brightx = this.line[2], brighty = this.line[1];

			this.handle = this.pathManager.addTempLine(bleftx, blefty, tleftx, tlefty);
			this.handle = this.pathManager.addTempLine(tleftx, tlefty, trightx, trighty);
			this.handle = this.pathManager.addTempLine(trightx, trighty, brightx, brighty);
			this.handle = this.pathManager.addTempLine(brightx, brighty, bleftx, blefty);

			this.controlPointsManager.clearControlPoints();
			this.controlPointsManager.registerControlPoint(1, [bleftx, blefty]);
			this.controlPointsManager.registerControlPoint(2, [tleftx, tlefty]);
			this.controlPointsManager.registerControlPoint(3, [trightx, trighty]);
			this.controlPointsManager.registerControlPoint(4, [brightx, brighty]);
			this.controlPointsManager.registerControlPoint(5, [(bleftx + brightx)/2, (brighty + blefty)/2]);
			this.controlPointsManager.registerControlPoint(6, [(bleftx + tleftx) / 2,  (blefty + tlefty)/2]);
			this.controlPointsManager.registerControlPoint(7, [(tleftx + trightx) / 2,  (tlefty + trighty)/2]);
			this.controlPointsManager.registerControlPoint(8, [(brightx + trightx) / 2,  (brighty + trighty)/2]);

			leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");

		}
		else if(e.type === this.controlPointsManager.CONTROL_POINT_SELECTED_EVENT){
			this.inEditMode = true;
		}

	}
}