const leo = {};
var dlog = function(t){
	if(log.enableDebugLogging){
		console.log(t);
	}
}

var log = function(msg, src){
	if(!src){
		console.log("leo: " + msg);
	}
	else if(src){
		console.log("leo<" + src + ">: " + msg);
	}
}


log.enableDebugLogging = false;

leo.start = function(config){
	if(!config){
		log("Failed to start. No cofiguration file");
		return;
	}

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
		leo[ucs] = leo[ucs] || {};
		Object.keys(initManagers[ucs]).forEach(contextObjectKey => {
			(leo[ucs])[contextObjectKey] = new (initManagers[ucs])[contextObjectKey]();
			if((leo[ucs])[contextObjectKey].preInitConfiguration){
				(leo[ucs])[contextObjectKey].preInitConfiguration(config);
			}
		})
	});

	Object.values(leo).forEach(v => {
		Object.values(v).forEach(ctx => {
			if(ctx.init){
				ctx.init(leo);
			}
		})
	});

	Object.values(leo).forEach(v => {
		Object.values(v).forEach(ctx => {
			if(ctx.postInit){
				ctx.postInit(leo);
			}
		})
	});

	Object.values(leo).forEach(v => {
		Object.values(v).forEach(ctx => {
			if(ctx.start){
				ctx.start(leo);
			}
		})
	})

	
	return true;

}
