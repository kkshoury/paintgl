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


class PenTool{
	constructor(){
		this.id = "2D_PEN_TOOL";
		this.line = [null, null, null, null];
		this.mouseIsDown = false;
		this.mouseHasNotMoved = false;
		this.sampleCount = 0;
	}

	init(){
		this.pathManager = leo.ArtManagers2D.PathManager2D;
	}

	postInit(){
	}

	onMouseDown(e){
		this.mouseIsDown = true;
		this.mouseHasNotMoved = true;
		this.line = setMousePositionFromEvent(e, this.line, 0);
		this.sampleCount++;
	}

	onMouseMove(e){
		if(!this.mouseIsDown){
			return;
		}
		this.mouseHasNotMoved = false;
		this.line = setMousePositionFromEvent(e, this.line, this.sampleCount*2);

		this.handle = this.pathManager.addTempLine(
			this.line[(this.sampleCount-1)*2],
			this.line[(this.sampleCount-1)*2 + 1],
			this.line[(this.sampleCount)*2],
			this.line[(this.sampleCount)*2 + 1]

		);
		this.sampleCount++;
		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
	}

	onMouseUp(e){
		if(this.mouseIsDown && this.sampleCount > 0){
			this.commit();

		}
		else {
			this.pathManager.removeTempLines();
			if(this.line.length > 10000){
				this.line = [];
			}
			
			this.sampleCount = 0;

		}
	}

	commit(){
		this.pathManager.commitPathToLayer(this.handle);
		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
		this.pathManager.removeTempLines();
		this.mouseIsDown = false;
		this.sampleCount = 0;
	}

}