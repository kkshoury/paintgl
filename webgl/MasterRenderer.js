class PaintingArtListener {
	constructor(gl){
		this.renderers = [];
		this.gl = gl;
	}

	addRenderer(renderer){
		if(renderer){
			this.renderers.push(renderer);
		}
	}

	render(){
		this.gl.clearColor(1, 1, 1, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.renderers.forEach((r) => {
			r.render(this.gl);
		});
	}

	setColor(color){
		this.color = color;
	}
}