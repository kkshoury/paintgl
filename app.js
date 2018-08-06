const paintgl = {};
var log = function(t){
	if(log.enableDebugLogging){
		console.log(t);
	}
}
log.enableDebugLogging = false;

paintgl.start = function(){
	paintgl.loadUI();

	let canvas = document.getElementById("canvas");
	paintgl.ArtManagers.CanvasManager = new CanvasManager(canvas);

	paintgl.initIO(canvas);
	paintgl.initManagers(paintgl.ArtManagers.CanvasManager.getWebGLContext());

	let layoutManager = new LayoutManager();
	layoutManager.init();
	document.getElementById("tool-line").checked =true;
}

paintgl.ArtManagers = {};
paintgl.IOManagers = {};
paintgl.ControlManagers = {};

paintgl.initIO = function(canvas){
	let mouseInputManager = new MouseInputManager(canvas);
	paintgl.IOManagers.MouseInputManager = mouseInputManager;

}

paintgl.initManagers = function(gl){
	let pathManager = new PathManager2D(gl);
	let MouseInputManager = paintgl.IOManagers.MouseInputManager;
	let controlPointManager = new ControlPointManager(gl);
	let toolManager = new ToolManager();
	let lineTool = new LineTool();
	let rectangleTool = new RectangleTool();
	let polyTool = new PolygonTool();

	toolManager.addTool(polyTool);
	toolManager.addTool(lineTool);
	toolManager.addTool(rectangleTool);
	toolManager.setActiveTool(lineTool.id);


	paintgl.ArtManagers.PathManager2D = pathManager;
	
	paintgl.ControlManagers.ControlPointManager = controlPointManager;
	paintgl.ControlManagers.ToolManager = toolManager;
	
	paintgl.IOManagers.MouseInputManager.addListener(toolManager, MouseInputManager.MOUSE_DOWN);
	paintgl.IOManagers.MouseInputManager.addListener(toolManager, MouseInputManager.MOUSE_UP);
	paintgl.IOManagers.MouseInputManager.addListener(toolManager, MouseInputManager.MOUSE_MOVE);
	paintgl.IOManagers.MouseInputManager.addListener(toolManager, MouseInputManager.MOUSE_DOUBLE_CLICK);

	paintgl.IOManagers.MouseInputManager.addListener(controlPointManager, MouseInputManager.MOUSE_DOWN);
	paintgl.IOManagers.MouseInputManager.addListener(controlPointManager, MouseInputManager.MOUSE_UP);
	paintgl.IOManagers.MouseInputManager.addListener(controlPointManager, MouseInputManager.MOUSE_MOVE);


	pathManager.init();
	rectangleTool.init();
	lineTool.init();
	polyTool.init();

}

paintgl.loadUI = function(){
	let canvas = document.createElement("canvas");
	canvas.id = "canvas";
	canvas.width = 800;
	canvas.height = 600;
	document.getElementById("maindiv").append(canvas);

	
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
