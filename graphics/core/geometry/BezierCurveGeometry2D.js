class BezierCurveGeometry2D{
	constructor(){
		this.controlPoints = [];
	}

	setControlPoints(points){
		this.controlPoints = points;
	}

	getVertices(){
		let i = 1 / 500.0;
		let vert = [];
		for(let t = 0; t <= 1.0; t+=i){
			let x = (1-t)*(1-t) * this.controlPoints[0]
						+ 2 * (1-t) *t*this.controlPoints[2]
						+ t*t*this.controlPoints[4] ;

			let y = (1-t)*(1-t) * this.controlPoints[1]
						+ 2 * (1-t) *t*this.controlPoints[3]
						+ t*t*this.controlPoints[5] ;
		
			vert.push(x);
			vert.push(y);
		}	
		
		return vert;
	}
}