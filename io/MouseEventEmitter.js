class MouseEventEmitter {
	
	constructor(targetComponent, sourceType) {
		this.eventType = "MOUSE_EVENT";

		this.MOUSE_DOWN = "MOUSE_DOWN";
		this.MOUSE_UP = "MOUSE_UP";
		this.MOUSE_MOVE = "MOUSE_MOVE";
		this.MOUSE_DOUBLE_CLICK = "MOUSE_DOUBLE_CLICK";
		this.sourceType = sourceType;
		
		this.targetComponent = targetComponent;
		var mouseWasDown = false;

		/* use this function if MouseEvent.offetX and MouseEvent.clipY are not supported*/
		function __getMousePosInClipCoordinates(evt, target) {
		    // let rect = target.getBoundingClientRect();
		    evt.clipX = (evt.offsetX) / target.width * 2 -1;
		    evt.clipY = (evt.offsetY) / target.height * -2 + 1;;
		}

		let coords = new CoordinatesListener(targetComponent);

		let ondown = function(e){
			__getMousePosInClipCoordinates(e, this.targetComponent);
			leo.Events.EventEmitter.shout(this.MOUSE_DOWN, e, this.sourceType);
			e.stopPropagation();
		}

		let onup = function(e){
			__getMousePosInClipCoordinates(e, this.targetComponent);
			leo.Events.EventEmitter.shout(this.MOUSE_UP, e, this.sourceType);
			e.stopPropagation();
		}

		let onmove = function(e){
			__getMousePosInClipCoordinates(e, this.targetComponent);
			leo.Events.EventEmitter.shout(this.MOUSE_MOVE, e, this.sourceType);
			e.stopPropagation();
		}

		let ondbl = function(e){
			__getMousePosInClipCoordinates(e, this.targetComponent);
			leo.Events.EventEmitter.shout(this.MOUSE_DOUBLE_CLICK, e, this.sourceType);
			e.stopPropagation();
		}

		if(this.targetComponent){
			this.targetComponent.onmousedown = ondown.bind(this);
			this.targetComponent.onmouseup = onup.bind(this);
			this.targetComponent.onmousemove = onmove.bind(this);
			this.targetComponent.ondblclick = ondbl.bind(this);
		}
	}

}

class CoordinatesListener{
	constructor(targetComponent){
		this.targetComponent = targetComponent;
		this.getMouseCoords = function(evt) {
		    let rect = this.targetComponent.getBoundingClientRect();
		    return [parseInt(evt.clientX - rect.left), 
		    		parseInt(evt.clientY - rect.top)];
		}

	}

	onMouseMove(e){
		let p = this.getMouseCoords(e);
		document.getElementById("coords").innerHTML = "Coordinates: (" + p[0] + ", " + p[1] + ")"; 
	}
}

