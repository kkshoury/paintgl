class ModelHandler{
	constructor(){
		paintgl.Events.EventEmitter.listen(this.createModel.bind(this), "MODEL_CREATED", "GRAPHICS_ENGINE");
		// paintgl.Events.EventEmitter.listen(null, "MODEL_PROPERTY_CHANGED", "GRAPHICS_ENGINE");
		paintgl.Events.EventEmitter.listen(this.createModel.bind(this), "MODEL_ALTERED", "GRAPHICS_ENGINE");

		this.__staticModels = {};
		this.__dynamicModels = {};
		// this.__streamingModels = {};

		this.__modelsNeedBuffering = {};
		// this.__modelsPropertyChanged = []; 

		this.hGen = new HandleGenerator();
	}


	createModel(model){
		var handle = this.hGen.newHandle();
		model.__ModelEngine_getHandle = function(){return handle;}
		if(model.isStaticGeometry()){
			this.__staticModels[model.__ModelEngine_getHandle()] = model;
		}
		else {
			this.__dynamicModels[model.__ModelEngine_getHandle()] = model;
		}

		var ModelEngine_needsBuffering = true; 
		model.__ModelEngine_getNeedsBuffering = function(){ return ModelEngine_needsBuffering;}

		model.__ModelEngine_setNeedsBuffering = function(bool){
			ModelEngine_needsBuffering = bool;
			if(!this.__modelsNeedBuffering[model.__ModelEngine_getHandle()]){
				this.__modelsNeedBuffering[model.__ModelEngine_getHandle()] = true;
			}

		}.bind(this);

	}

	disposeModel(model){
		if(!model.__ModelEngine_getHandle()){
			return false;
		}

		let handle = model.__ModelEngine_getHandle();	

		let model = this.__staticModels[handle] || this.__dynamicModels[model];
		delete this.__staticModels[handle];
		delete this.__dynamicModels[handle];

		if(this.__modelsNeedBuffering[handle]){
			delete this.__modelsNeedBuffering[handle];
		}

		if(model.dispose){
			model.dispose();
		}

		return true;

	}


	modelAltered(model){

	}





}