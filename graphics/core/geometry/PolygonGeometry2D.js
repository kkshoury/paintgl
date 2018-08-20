class PolygonGeometry2D{
	constructor(silent){
		this.__dirty = true;
		this.__vertices = [];
		this.closed = true;
		this.hollow = false;

		//indices
		this.__triangulation = [];

		if(!silent){
			paintGl.Events.EventEmitter.shout("GEOMETRY_ADDED", this, "GRAPHICS_ENGINE");
		}

	}


	addVertex(index, v){

	}

	removeVertex(index){

	}

	getVertex(index){

	}

	pushVertex(v){

	}

	setVertices(vertices){

	}

	getVertices(){

	}

	setSquarGeometry(centerX, centerY, centerZ, side){

	}

	setRecatangleGeometry(centerX, centerY, centerZ, l, w){

	}

	setCircleGeometry(centerX, centerY, centerZ, radius, resolution){

	}

	getPositiveNormal(){

	}

	getNegativeNormal(){

	}

	getPlane(){

	}

	triangulate(){
		if(!this.__dirty){
			return this.triangulation;
		}

		//triangulate
		this.__dirty = false;

	}

	dispose(){

	}

	detach(){

	}

	attach(){
		
	}





}

