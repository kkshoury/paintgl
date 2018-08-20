class CircleGeometry2D{
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
	setDimensions(x, y, a, b){
		this.x = 0;
		this.y = y;
		this.r = r;

		this.triangulation = null;

		this.notifyDirty();
	}


	setPoints(bx, by, tx, ty){
		//ellipse

		this.triangulation = null;
		this.notifyDirty();

	}

	getCenter(){
		return [this.x, this.y];
	}

	getRadius(){
		return this.r;
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

		
		//triangulate
		this.resolution = 50;
		let angle = Math.PI * 2.0 / this.resolution;
		let theta = 0;
		for(let i = 0; i < this.resolution; i++){
			let x1 =  this.r * Math.cos(theta) + this.x;
			let y1 = this.r * Math.sin(theta) + this.y;
			theta += angle;

			let x2 = this.r * Math.cos(theta) + this.x;
			let y2 = this.r * Math.sin(theta) + this.y;

			theta+= angle;
			triangulation.push(x1);
			triangulation.push(y1);
			triangulation.push(this.x);
			triangulation.push(this.y);
			triangulation.push(x2);
			triangulation.push(y2);

		}

		this.__dirty = false;

		if(dest){
			this.triangulate(dest);
		}

		return this.triangulation;
	}

	getVertexList(){
		let list = [];
		this.resolution = 50;
		let angle = Math.PI * 2.0 / this.resolution;
		let theta = 0;
		for(let i = 0; i < this.resolution; i++){
			let x1 =  this.r * Math.cos(theta) + this.x;
			let y1 = this.r * Math.sin(theta) + this.y;
			theta += angle;
			list.push(x1);
			list.push(y1);
		}

		return list;

	}

	getCopy(){
		let c = new CircleGeometry2D();
		c.setDimensions(this.x, this.y, this.r);
	}
}