function getMousePos(evt) {
	let canvas = document.getElementById("canvas");
    let rect = canvas.getBoundingClientRect();
    return [(evt.clientX - rect.left) / canvas.width * 2 -1, 
    		(evt.clientY - rect.top) / canvas.height * -2 + 1];
}

class ControlPointManager {
	//stores control points for graphics
	//manages control point rendering and selection
	//fires control point changed events

	constructor(gl){
		this.LOST_CONTROL_EVENT = 1;
		this.CONTROL_POINT_SELECTED_EVENT = 2;
		this.CONTROL_POINT_MOVED_EVENT = 3;

		this.controlPointRenderer = new ControlPointRenderer(gl);
		this.listeners = {};

		this.selectedPointIndex = -1;
		this.mouseIsDown = false;
		this.mouseMovedWhileDown = false;

		//arrays of points (arrays)
		var _controlPoints = [];
		this.getControlPoint = function(index) { return [_controlPoints[index][0], _controlPoints[index][1]];}
		this.setControlPoint = function(index, p) { _controlPoints[index] = p;}
		this.controlPointsArraySize = function(){ return _controlPoints.length;}
		this.addPointsToRenderer = function(){
			for(var p in _controlPoints){
				this.controlPointRenderer.addControlPoint(_controlPoints[p]);
			}
		}
		this.clearControlPoints = function(){ 
			_controlPoints = [];  ///will this cause a leak
			this.controlPointRenderer.clearControlPoints()
		};
		
		paintgl.ArtManagers.CanvasManager.renderer.addRenderer(this.controlPointRenderer);
	}

	registerControlPoint(index, p){
		this.setControlPoint(index, p);
		this.controlPointRenderer.addControlPoints(p);
	}

	fireEvent(event){
		Object.keys(this.listeners).forEach((key) => {
			let l = this.listeners[key];
			if(l && l.handleControlPointEvent){
				l.handleControlPointEvent(event);
			}
		});
	}

	registerListener(listener){
		if(!listener){
			return;
		}

		this.listeners[listener] = listener;
	}

	unregisterListener(listener){
		if(this.listeners[listener]){
			this.listeners[listener] = null;
		}
	}

	checkSelectedPoint(p){
		for(var i = 0; i < this.controlPointsArraySize(); i++){
			let cp;
			try{
				cp = this.getControlPoint(i);
			}
			catch(e){
				continue;
			}	

			if(!cp){
				continue;
			}

			let d = Math.sqrt((cp[0] - p[0])*(cp[0] - p[0]) + (cp[1] - p[1])*(cp[1] - p[1]));
			if(d < 0.02){
				return i;
			}
		}

		return -1;

	}

	onMouseDown(e){
		if(this.controlPointsArraySize() == 0){
			return;
		}

		this.mouseIsDown = true;
		this.mouseMovedWhileDown = false
		let p = getMousePos(e);
		let index = this.checkSelectedPoint(p);
		if(index){
			this.selectedPointIndex = index;
			
			log("fire: point selected");
			this.fireEvent({
				type : this.CONTROL_POINT_SELECTED_EVENT,
				index : this.selectedPointIndex
			});

		} 

	}

	onMouseUp(e){
		if(!this.mouseIsDown || (e.skip && e.skip > 0)){
			e.skip--;
			this.selectedPointIndex = -1;
			return;
		}

		if(this.controlPointsArraySize() == 0){
			return;
		}

		this.mouseIsDown = false;
		this.selectedPointIndex = -1;
		let p = getMousePos(e);
		if(this.mouseMovedWhileDown == false){
			// log("fire: lost control");
			// this.fireEvent({
			// 	type: this.LOST_CONTROL_EVENT,
			// 	mousePosition : p
			// });

		}
		

	}

	onMouseMove(e){
		if(!this.mouseIsDown){
			return;
		}

		if(this.controlPointsArraySize() == 0){
			return;
		}

		this.mouseMovedWhileDown = true;

		if(this.selectedPointIndex != -1){
			let p = getMousePos(e);
			this.setControlPoint(this.selectedPointIndex, p);
			this.controlPointRenderer.clearControlPoints();
			this.addPointsToRenderer();
			paintgl.ArtManagers.CanvasManager.refresh();
			log("fire: control point moved");
			this.fireEvent({
				type : this.CONTROL_POINT_MOVED_EVENT,
				index : this.selectedPointIndex,
				point: p
			});
		}

	}

}