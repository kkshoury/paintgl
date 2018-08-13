var CONFIG = CONFIG || {};

CONFIG.STARTUP = CONFIG.STARTUP || {};


// paintgl.ArtManagers2D = {};
// paintgl.IOManagers = {};
// paintgl.ControlManagers = {};

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
			"LayoutManager": LayoutManager

		},

		"Engine" : {
			"RenderingEngine2D" : PaintGL2DRenderingEngine
			
		},

		"Advanced2D": {
			"RasterLayerManager": RasterLayerManager

		}


	}

}