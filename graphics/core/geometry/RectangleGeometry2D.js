class RectangleGeometry2D{
	constructor(){
		this.__dirty = true;
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
				if(target.setDirty){
					target.setDirty();
				}
			});
		}
	}

	/*values in clip coordinates */
	setDimensions(x, y, l, w){
		this.l = l;
		this.w = w;
		this.cx = x;
		this.cy = y;

		this.bx = this.cx - w / 2.0;
		this.by = this.cy - l / 2.0;
		this.tx = this.cx + w / 2.0;
		this.ty = this.cy + l / 2.0;

		this.triangulation = null;

		this.notifyDirty();
	}


	setPoints(bx, by, tx, ty){
		if(bx > tx){
			let t = bx;
			bx = tx;
			tx = t;
		}

		if(ty < by){
			let t = ty;
			ty = by;
			by = t;
		}
		this.bx = bx;
		this.by = by;
		this.ty = ty;
		this.tx = tx;

		this.cx = (tx + bx) / 2.0;
		this.cy = (ty + by) / 2.0;

		this.l = ty - by;
		this.w = tx - bx;

		this.triangulation = null;
		this.notifyDirty();

	}

	getCenter(){
		return [this.cx, this.cy];
	}

	getWidth(){
		return this.w;
	}

	getLength(){
		return this.l;
	}

	triangulate(dest){
		if(this.triangulation){
			if(dest){
				for(var i = 0; i <this.triangulation.length  && dest; i++){
					dest.push(this.triangulation[i]);
				}
			}
			return this.triangulation;;

		}

		this.triangulation = [];

		this.triangulation.push(this.tx);
		this.triangulation.push(this.ty);
		this.triangulation.push(this.bx);
		this.triangulation.push(this.ty);
		this.triangulation.push(this.bx);
		this.triangulation.push(this.by);

		this.triangulation.push(this.tx);
		this.triangulation.push(this.ty);
		this.triangulation.push(this.bx);
		this.triangulation.push(this.by);
		this.triangulation.push(this.tx);
		this.triangulation.push(this.by);

		this.__dirty = false;

		if(dest){
			this.triangulate(dest);
		}

		return this.triangulation;
	}

	getVertexList(){
		let list = [];
		list.push(this.tx);
		list.push(this.ty);
		list.push(this.bx);
		list.push(this.ty);
		list.push(this.bx);
		list.push(this.by);
		list.push(this.tx);
		list.push(this.by);

		return list;

	}

}