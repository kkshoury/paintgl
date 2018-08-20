var CONFIG = CONFIG || {};

CONFIG.STARTUP = CONFIG.STARTUP || {};


// leo.ArtManagers2D = {};
// leo.IOManagers = {};
// leo.ControlManagers = {};

CONFIG.STARTUP.INIT = function(){
	return {

		"Events": {
			"EventEmitter": EventEmitter 
		},

		"ArtManagers2D": {
			"PathManager2D": PathManager2D

		},

		"IOManagers" : {
			// "MouseEventEmitter": MouseEventEmitter

		},

		"ControlManagers": {
			"ToolManager": ToolManager,
			"ControlPointManager": ControlPointManager

		},

		"UIManagers" : {
			"LayoutManager": LayoutManager,
			// "PopupComposer": PopupComposer

		},

		"Engine" : {
			"RenderingEngine2D" : RenderingEngine2D
			
		},

		"Advanced2D": {
			"RasterLayerManager": RasterLayerManager

		}


	}

}