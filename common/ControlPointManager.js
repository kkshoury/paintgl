class ControlPointManager {
	//stores control points for graphics
	//manages control point rendering and selection
	//fires control point changed events

	constructor(){
		this.LOST_CONTROL_EVENT = 1;
		this.CONTROL_POINT_SELECTED_EVENT = 2;
		this.CONTROL_POINT_MOVED_EVENT = 3;

		this.controlPointRenderer = new ControlPointRenderer();
		this.listeners = {};

		this.selectedPointIndex = -1;
		this.mouseIsDown = false;
		this.mouseMovedWhileDown = false;
		this.__tmpEvent = {
			type: -1,
			index: -1,
			p: null
		}

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
		
	}

	init(paintgl){
	}

	postInit(paintgl){
		paintgl.Events.EventEmitter.listen(this.onMouseDown.bind(this), "MOUSE_DOWN", "GL_WINDOW");
		paintgl.Events.EventEmitter.listen(this.onMouseUp.bind(this), "MOUSE_UP", "GL_WINDOW");
		paintgl.Events.EventEmitter.listen(this.onMouseMove.bind(this), "MOUSE_MOVE", "GL_WINDOW");
		paintgl.Engine.RenderingEngine2D.addRenderer(this.controlPointRenderer, 3);
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
		let mx = e.clipX;
		let my = e.clipY;
		let p = [mx, my];

		let index = this.checkSelectedPoint(p);
		if(index){
			this.selectedPointIndex = index;
			this.__tmpEvent.type = this.CONTROL_POINT_MOVED_EVENT;
			this.__tmpEvent.id = this.selectedPointIndex;
			this.__tmpEvent.p = p;

			this.fireEvent(this.__tmpEvent);

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
		let mx = e.clipX;
		let my = e.clipY;
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
			let mx = e.clipX;
			let my = e.clipY;

			let p = [mx, my];

			this.setControlPoint(this.selectedPointIndex, p);
			this.controlPointRenderer.clearControlPoints();
			this.addPointsToRenderer();
			paintgl.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
			
			this.__tmpEvent.type = this.CONTROL_POINT_MOVED_EVENT;
			this.__tmpEvent.index = this.selectedPointIndex;
			this.__tmpEvent.p = p;
			this.fireEvent(this.__tmpEvent);
		}

	}

}