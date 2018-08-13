const paintgl = {};
var dlog = function(t){
	if(log.enableDebugLogging){
		console.log(t);
	}
}

var log = function(msg, src){
	if(!src){
		console.log("paintgl: " + msg);
	}
	else if(src){
		console.log("paintgl<" + src + ">: " + msg);
	}
}


log.enableDebugLogging = false;

paintgl.start = function(config){
	if(!config){
		log("Failed to start. No cofiguration file");
		return;
	}

	paintgl.loadUI();
	let result = init(config);

	if(!result){
		log("Failed to start. Cannot init");
	}
	document.getElementById("tool-line").checked =true;
}

function init(config){
	if(!config){
		log("Failed to start. No cofiguration file");
		return false;
	}

	let initManagers = config.STARTUP.INIT();

	let upperContextStrings = Object.keys(initManagers);

	upperContextStrings.forEach(ucs => {
		paintgl[ucs] = paintgl[ucs] || {};
		Object.keys(initManagers[ucs]).forEach(contextObjectKey => {
			(paintgl[ucs])[contextObjectKey] = new (initManagers[ucs])[contextObjectKey]();
			if((paintgl[ucs])[contextObjectKey].preInitConfiguration){
				(paintgl[ucs])[contextObjectKey].preInitConfiguration(config);
			}
		})
	});

	Object.values(paintgl).forEach(v => {
		Object.values(v).forEach(ctx => {
			if(ctx.init){
				ctx.init(paintgl);
			}
		})
	});

	Object.values(paintgl).forEach(v => {
		Object.values(v).forEach(ctx => {
			if(ctx.postInit){
				ctx.postInit(paintgl);
			}
		})
	});

	Object.values(paintgl).forEach(v => {
		Object.values(v).forEach(ctx => {
			if(ctx.start){
				ctx.start(paintgl);
			}
		})
	})


	return true;

}

paintgl.loadUI = function(){
	// let canvas = document.createElement("canvas");
	// canvas.id = "canvas";
	// canvas.width = 800;
	// canvas.height = 600;
	// document.getElementById("maindiv").append(canvas);

	
}

setRectangle = function(){
	paintgl.ControlManagers.ToolManager.setActiveTool("RECTANGLE_TOOL");
}

setLine = function(){
	paintgl.ControlManagers.ToolManager.setActiveTool("LINE_TOOL");
}

setPolygon = function(){
	paintgl.ControlManagers.ToolManager.setActiveTool("POLYGON_TOOL");

}
