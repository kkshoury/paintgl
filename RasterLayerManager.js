class RasterLayerManager{

	constructor(){
		this.orderedLayers = [];
		this.w;
		this.h;
	}

	preInitConfiguration(config){
		this.w = config.SETTINGS.GRAPHICS.canvasWidth;
		this.h = config.SETTINGS.GRAPHICS.canvasHeight;
	}

	init(paintgl){
		this.renderer = new RasterLayerRenderer();
		let layer = this.addLayer("default", this.w, this.h, 0);
		this.renderer.input = layer.texture.id;
		

	}

	postInit(){
		leo.Engine.RenderingEngine2D.addRenderer(this.renderer, 0);

	}

	start(){

	}

	addLayer(name, width, height, index){
		if(!index){
			index = this.orderedLayers.length;
		}

		let texture = new Texture2D(width, height);

		let layer = {
			"name": name,
			"index": index,
			"texture": texture,
			"x": 0,
			"y":0

		};

		this.orderedLayers.push(layer);
		leo.Events.EventEmitter.shout("RASTER_LAYER_ADDED", layer,"LAYERS");

		return layer;
	}

	removeLayer(){

	}

	hideLayer(){

	}

	swapLayers(){

	}




}