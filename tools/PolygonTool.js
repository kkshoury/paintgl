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


class PolygonTool{
	constructor(){
		this.id = "2D_POLYGON_TOOL";
		this.line = [null, null, null, null, null, null, null, null];
		this.vertexCount = 0;
		this.mouseIsDown = false;
		this.inEditMode = false;
		this.handle = null;
		this.mouseDidntMove = false;
		
		
	}

	init(){
		this.pathManager = paintgl.ArtManagers.PathManager2D;
		this.controlPointsManager = paintgl.ControlManagers.ControlPointManager;
	}

	onMouseDown(e){
		this.mouseIsDown = true;
		this.mouseDidntMove = true;
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
				this.vertexCount = 0;

				this.line = setMousePositionFromEvent(e, this.line, 0);
			}

			return;
		}
		this.line = setMousePositionFromEvent(e, this.line, this.vertexCount * 2);
		this.vertexCount++;

		for(var i = 0; i < this.vertexCount-1 && this.vertexCount > 1 ; i++){
			this.pathManager.addTempLine(
				this.line[i*2],
				this.line[i*2 + 1],
				this.line[(i+1)*2],
				this.line[(i+1)*2 + 1]
				);

		}
		paintgl.ArtManagers.CanvasManager.refresh();

		this.controlPointsManager.unregisterListener(this);
	}

	onMouseMove(e){
		if(!this.mouseIsDown || this.inEditMode){
			return;
		}

		this.mouseDidntMove = false;


		this.pathManager.removeTempLines(); // give it id
		this.controlPointsManager.clearControlPoints();
		if(this.vertexCount > 1){
			this.line = setMousePositionFromEvent(e, this.line, (this.vertexCount-1)*2);
		}
		else {
			this.line = setMousePositionFromEvent(e, this.line, (this.vertexCount)*2);
			this.vertexCount ++;
		}
		for(var i = 0; i < this.vertexCount -1 ; i++){
			this.pathManager.addTempLine(
				this.line[i*2],
				this.line[i*2 + 1],
				this.line[(i+1)*2],
				this.line[(i+1)*2 + 1]
				);

		}

		paintgl.ArtManagers.CanvasManager.refresh();
	}

	onDoubleClick(e){
		this.mouseIsDown = false;
		this.inEditMode = true;
		this.vertexCount--;

		if(this.vertexCount > 2){
			if(this.line[(this.vertexCount - 1) * 2] == this.line[(this.vertexCount - 2)*2]){
				if(this.line[(this.vertexCount - 1) * 2 + 1] == this.line[(this.vertexCount - 2)*2 + 1]){
					this.vertexCount--;
				}
			}
		}
		
		this.pathManager.removeTempLines();
		for(var i = 0; i < this.vertexCount && this.vertexCount > 1 ; i++){
			this.pathManager.addTempLine(
				this.line[i*2],
				this.line[i*2 + 1],
				this.line[((i+1) % this.vertexCount) * 2],
				this.line[((i+1) % this.vertexCount) * 2 + 1]
				);

		}


		this.controlPointsManager.clearControlPoints();
		this.controlPointsManager.registerListener(this);
		for(var i = 0; i < this.vertexCount ; i++){
			this.controlPointsManager.registerControlPoint(i +1, [this.line[i*2], this.line[i*2 + 1]]);
		}

		paintgl.ArtManagers.CanvasManager.refresh();

	}

	onMouseUp(e){
		if(this.inEditMode){
			return;
		}

		if(this.mouseIsDown){
			this.mouseIsDown = false;
			e.skip = 1;
		}
		else {
			for(var i = 0; i < this.vertexCount ; i++){
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
		this.inEditMode = false;
		this.pathManager.commitLine();
		this.pathManager.removeTempLines();
		this.controlPointsManager.unregisterListener(this);
		this.controlPointsManager.clearControlPoints();
		paintgl.ArtManagers.CanvasManager.refresh();
		this.mouseIsDown = false;
		this.vertexCount = 0;
	}

	handleControlPointEvent(e){
		if(e.type === this.controlPointsManager.CONTROL_POINT_MOVED_EVENT) {
			this.inEditMode = true;
			let index = e.index;
			let cp = this.controlPointsManager.getControlPoint(index);
			
			for(var i = 0; i < this.vertexCount; i++){
				if((index -1)== i){
					this.line[i*2] = cp[0];
					this.line[i*2 + 1] = cp[1];

				}
			}
			

			this.pathManager.removeTempLines(); //give it id
			for(var i = 0; i < this.vertexCount; i++){
				this.pathManager.addTempLine(
					this.line[i*2],
					this.line[i*2 + 1],
					this.line[((i+1) % this.vertexCount) * 2],
					this.line[((i+1) % this.vertexCount) * 2 + 1]
				);

			}

			this.controlPointsManager.clearControlPoints();
			for(var i = 0; i < this.vertexCount ; i++){
				this.controlPointsManager.registerControlPoint(i+1, [this.line[i*2], this.line[i*2 + 1]]);
			}

			paintgl.ArtManagers.CanvasManager.refresh();

		}
		else if(e.type === this.controlPointsManager.CONTROL_POINT_SELECTED_EVENT){
			this.inEditMode = true;
			log("Control selected");
			
		}

	}
}