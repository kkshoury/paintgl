class MouseInputManager {
	
	constructor(targetComponent) {
		this.MOUSE_DOWN = "MOUSE_DOWN";
		this.MOUSE_UP = "MOUSE_UP";
		this.MOUSE_MOVE = "MOUSE_MOVE";
		this.MOUSE_DOUBLE_CLICK = "MOUSE_DOUBLE_CLICK";
		
		this.targetComponent = targetComponent;
		this.mouseDownListeners = [];
		this.mouseUpListeners = [];
		this.mouseMoveListeners = [];
		this.doubleClickListeners = [];

		var mouseWasDown = false;

		let coords = new CoordinatesListener(targetComponent);
		this.mouseMoveListeners.push(coords);		


		let ondown = function(e){
			this.mouseDownListeners.forEach((listener) => {
				listener.onMouseDown(e);
			}); 
		}

		let onup = function(e){
			this.mouseUpListeners.forEach((listener) => {
				listener.onMouseUp(e);
			}); 
		}

		let onmove = function(e){
			this.mouseMoveListeners.forEach((listener) => {
				listener.onMouseMove(e);
			});
		}

		let ondbl = function(e){
			this.doubleClickListeners.forEach((listener) => {
				listener.onDoubleClick(e);
			});
		}

		if(this.targetComponent){
			this.targetComponent.onmousedown = ondown.bind(this);
			this.targetComponent.onmouseup = onup.bind(this);
			this.targetComponent.onmousemove = onmove.bind(this);
			this.targetComponent.ondblclick = ondbl.bind(this);
		}
	}


	addListener(listener, event) {
		if (!!listener && !!event){
			
			if(event == this.MOUSE_UP) {
				this.mouseUpListeners.push(listener);
				return;
			}
			if(event == this.MOUSE_DOWN){
				this.mouseDownListeners.push(listener);
				return;
			}

			if(event == this.MOUSE_MOVE){
				this.mouseMoveListeners.push(listener);
			}

			if(event == this.MOUSE_DOUBLE_CLICK){
				this.doubleClickListeners.push(listener);
			}
		}
	}

}

class CoordinatesListener{
	constructor(targetComponent){
		this.targetComponent = targetComponent;
	}

	onMouseMove(e){
		let p = getMouseCoords(e);
		document.getElementById("coords").innerHTML = "Coordinates: (" + p[0] + ", " + p[1] + ")"; 
	}
}

function getMouseCoords(evt) {
	let canvas = document.getElementById("canvas");
    let rect = canvas.getBoundingClientRect();
    return [parseInt(evt.clientX - rect.left), 
    		parseInt(evt.clientY - rect.top)];
}
