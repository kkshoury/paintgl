class SweepGeometry2D{
	constructor(){

	}

	setDirty(){
		this.__dirty = true;
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
				if(target.notifyDirty){
					target.notifyDirty();
				}
			});
		}
	}

	removeDirtyListener(target){
			if(!target){
				return;
			}
			
			let index = this.__notifyList.indexOf(target);
			if(index != -1){
				this.__notifyList.splice(index, 1);
			}
		}
		
	setShape(geoemtry2D){
		this.shape = geoemtry2D;
		this.triangulation = null;
		if(geoemtry2D.notifyDirty){
			geoemtry2D.notifyDirty(this)
		}
		this.notifyDirty();
	}

	setPath(path){
		this.path = path;
		this.triangulation = null;
		if(path && path.notifyDirty){
			path.notifyDirty(this);
		}
		this.notifyDirty();
	}

	addToPath(x, y){
		if(!this.path){
			this.path = [];
		}

		this.path.push(x);
		this.path.push(y);

		this.triangulation = null;
		this.notifyDirty();
	}

	setRenderer(renderer){
		this.renderer = renderer;
		renderer.addModel(this);
	}

	triangulate(dest){
		if(this.triangulation && !this.__dirty){
			if(dest)
			for(var i = 0; i <this.triangulation.length; i++){
				dest.push(this.triangulation[i]);
			}

			return this.triangulation;;
		}

		this.triangulation = [];
		let l = this.shape.getLength();
		let w = this.shape.getWidth();

		let prevRect = null;
		for(var i = 0; this.path && i < this.path.length/2; i++){
			let x = this.path[i * 2];
			let y = this.path[i * 2 + 1];

			let rect = new RectangleGeometry2D();
			rect.setDimensions(x, y, l, w);
			rect.triangulate(this.triangulation);

			if(prevRect){
				let v = rect.getVertexList();
				let pv = prevRect.getVertexList();

				for(let j = 0; j < v.length; j+=2){
					let nextJ = (j + 2) % v.length;
					this.triangulation.push(pv[j]);
					this.triangulation.push(pv[j + 1]);

					this.triangulation.push(pv[nextJ]);
					this.triangulation.push(pv[nextJ + 1]);

					this.triangulation.push(v[j]);
					this.triangulation.push(v[j + 1]);

					this.triangulation.push(v[j]);
					this.triangulation.push(v[j + 1]);

					this.triangulation.push(pv[nextJ]);
					this.triangulation.push(pv[nextJ + 1]);

					this.triangulation.push(v[nextJ]);
					this.triangulation.push(v[nextJ + 1]);

				}
			}

			prevRect = rect;
		}

		if(dest){
			this.triangulate(dest);
		}

		this.__dirty = false;

		return this.triangulation;
	}

}