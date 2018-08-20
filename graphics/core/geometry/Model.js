class Model{
	constructor(silent){
		this.__models = null;
		this.__geometry = null;
		this.__color = [1.0 , 1.0, 1.0, 1.0];

		this.__quaternion = null;

		if(!silent){
			leo.Events.EventEmitter.shout("MODEL_CREATED", this, "GRAPHICS_ENGINE");
		}

		this.__visible = true;
		this.__transparent = false;
		this.__colors = null;
		this.__normals = null;
		this.__bbMin = null;
		this.__bbMax = null;
		this.__renderer = null;
		this.__requiresRebuffer = true;

		this.__dirty = true;

	}

	setColor(color){
		this.__color = [color[0], color[1], color[2], color[3]];
		this.setDirty();
		this.notifyDirty();
	}

	notifyDirty(target){
		if(target){
			if(!this.__notifyList){
				this.__notifyList = [];
			}
			this.__notifyList.push(target);
			return;
		}
		else {
			this.setDirty();
			if(!this.__notifyList){
				return;
			}
			
			this.__notifyList.forEach(target => {
				if(target.setDirty){
					target.setDirty();
				}
			});

		}
	}

	setDirty(){
		this.mat4Float32Array = null;
		this.vertexFloat32Array = null;
		this.colorFloat32Array = null;
		this.__dirty = true;
	}

	classId() {return "MODEL2D";}
	static staticClassId() {return "MODEL2D";}

	addModel(model2D){
		if(!this.__models){
			this.models = [];
		}
		if(model2D && model2D.classId() == Model2D.staticClassID()){
			this.__models.push(model2D);
			if(model2D.notifyDirty){
				model2D.notifyDirty(this);
			}
			return true;
		}
		else { 
			return false;
		}

		this.setDirty();
	}

	addGeometry(g){
		if(!this.__geometry){
			this.__geometry = [];
		}

		this.__geometry.push(g);
		if(g.notifyDirty){
			g.notifyDirty(this);
		}

		this.setDirty();
	}

	setRenderer(renderer){
		if(renderer == null){
			this.__renderer.removeModels();
			return;
		}

		if(this.__renderer != null){
			//remove from renderer
		}

		this.__renderer = renderer;
		//inform renderer
		renderer.addModel(this);
	}


	getVertexFloat32Array(){
		if(this.vertexFloat32Array){
			return this.vertexFloat32Array;
		}

		let ver = [];
		this.__geometry.forEach(g => {
			let tr = g.triangulate();
			tr.forEach(v => {
				ver.push(v);
				
			});
		});

		this.vertexFloat32Array = new Float32Array(ver); 
		return this.vertexFloat32Array;

	}

	getColorFloat32Array(){
		if(this.colorFloat32Array){
			return this.colorFloat32Array;
		}

		this.colorFloat32Array = [];

		let ver = this.getVertexFloat32Array();

		for(var i = 0 ; i < ver.length/2; i++){
				this.colorFloat32Array.push(this.__color[0]);
				this.colorFloat32Array.push(this.__color[1]);
				this.colorFloat32Array.push(this.__color[2]);
				this.colorFloat32Array.push(this.__color[3]);
		}
		this.colorFloat32Array = new Float32Array(this.colorFloat32Array);
		return this.colorFloat32Array;

	}

	getMat4Float32Array(){
		//row major order

		if(this.mat4Float32Array){
			return this.mat4Float32Array;
		}

		this.mat4Float32Array = [];

		let ver = this.getVertexFloat32Array();
		for(var i = 0 ; i < ver.length/2; i++){
			this.mat4Float32Array.push(1.0);
			this.mat4Float32Array.push(0.0);
			this.mat4Float32Array.push(0);
			// this.mat4Float32Array.push(0.0);
			
			this.mat4Float32Array.push(0.0);
			this.mat4Float32Array.push(1.0);
			this.mat4Float32Array.push(0.0);
			// this.mat4Float32Array.push(0.0);
			
			this.mat4Float32Array.push(0.0);
			this.mat4Float32Array.push(0.0);
			this.mat4Float32Array.push(1.0);
			// this.mat4Float32Array.push(0.0);

			// this.mat4Float32Array.push(0.0);
			// this.mat4Float32Array.push(0.0);
			// this.mat4Float32Array.push(0.0);
			// this.mat4Float32Array.push(1.0);
		}

		this.mat4Float32Array = new Float32Array(this.mat4Float32Array);
		return this.mat4Float32Array;
	}

	translate (x, y, z){
		let m = this.getMat4Float32Array();
		for(var i = 0; i < m.length/9; i++){
			m[i * 9 + 2] = x;
			m[i * 9 + 5] = y;
			
		}
	}

	update(){
		if(this.__renderer){
			this.__renderer.update(this);
		}
	}
}