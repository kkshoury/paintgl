class ControlPointManager {
	//stores control points for graphics
	//manages control point rendering and selection
	//fires control point changed events

	constructor(){
		this.CONTROL_POINT_SELECTED_EVENT = Symbol();
		this.CONTROL_POINT_MOVED_EVENT = Symbol();

		this.__controlPointRenderer = new ControlPointRenderer();
		this.__listeners = {};

		this.__selectedPointIndex = -1;
		this.__mouseIsDown = false;
		this.__mouseMovedWhileDown = false;
		this.__tmpEvent = {
			type: -1,
			index: -1,
			p: null
		}

		//arrays of points (arrays)
		var _controlPoints = [];
		this.getControlPoint = function(index) { if(index < 0) return null; return [_controlPoints[index][0], _controlPoints[index][1]];}
		this.setControlPoint = function(index, p) {if(index < 0) return; _controlPoints[index] = p;}
		this.controlPointsArraySize = function(){ return _controlPoints.length;}
		this.addPointsToRenderer = function(){
			for(var p in _controlPoints){
				this.__controlPointRenderer.addControlPoint(_controlPoints[p]);
			}
		}
		this.clearControlPoints = function(){ 
			_controlPoints = [];  ///will this cause a leak
			this.__controlPointRenderer.clearControlPoints()
		};
		
	}

	init(leo){
	}


	postInit(leo){
		leo.Events.EventEmitter.listen(this.onMouseDown.bind(this), "MOUSE_DOWN", "GL_WINDOW");
		leo.Events.EventEmitter.listen(this.onMouseUp.bind(this), "MOUSE_UP", "GL_WINDOW");
		leo.Events.EventEmitter.listen(this.onMouseMove.bind(this), "MOUSE_MOVE", "GL_WINDOW");
	}

	start(leo){
		leo.Engine.RenderingEngine2D.addRenderer(this.__controlPointRenderer, 3);

	}
	registerControlPoint(index, p){
		this.setControlPoint(index, p);
		this.__controlPointRenderer.addControlPoints(p);
	}

	fireEvent(event){
		Object.keys(this.__listeners).forEach((key) => {
			let l = this.__listeners[key];
			if(l && l.handleControlPointEvent){
				l.handleControlPointEvent(event);
			}
		});
	}

	registerListener(listener){
		if(!listener){
			return;
		}

		this.__listeners[listener] = listener;
	}

	unregisterListener(listener){
		if(this.__listeners[listener]){
			this.__listeners[listener] = null;
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

		this.__mouseIsDown = true;
		this.__mouseMovedWhileDown = false
		let mx = e.clipX;
		let my = e.clipY;
		let p = [mx, my];

		let index = this.checkSelectedPoint(p);
		if(index){
			this.__selectedPointIndex = index;
			this.__tmpEvent.type = this.CONTROL_POINT_MOVED_EVENT;
			this.__tmpEvent.id = this.__selectedPointIndex;
			this.__tmpEvent.p = p;

			this.fireEvent(this.__tmpEvent);

		} 

	}

	onMouseUp(e){
		if(!this.__mouseIsDown || (e.skip && e.skip > 0)){
			e.skip--;
			this.__selectedPointIndex = -1;
			return;
		}

		if(this.controlPointsArraySize() == 0){
			return;
		}

		this.__mouseIsDown = false;
		this.__selectedPointIndex = -1;
		let mx = e.clipX;
		let my = e.clipY;
	}

	onMouseMove(e){
		if(!this.__mouseIsDown){
			return;
		}

		if(this.controlPointsArraySize() == 0){
			return;
		}

		this.__mouseMovedWhileDown = true;

		if(this.__selectedPointIndex != -1){
			let mx = e.clipX;
			let my = e.clipY;

			let p = [mx, my];

			this.setControlPoint(this.__selectedPointIndex, p);
			this.__controlPointRenderer.clearControlPoints();
			this.addPointsToRenderer();
			leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
			
			this.__tmpEvent.type = this.CONTROL_POINT_MOVED_EVENT;
			this.__tmpEvent.index = this.__selectedPointIndex;
			this.__tmpEvent.p = p;
			this.fireEvent(this.__tmpEvent);
		}

	}

}