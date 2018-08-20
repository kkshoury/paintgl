class ToolManager{
	constructor(){
		this.tools = {};
		this.activeTool = null;
	}

	init(paintgl){
	}
	
	postInit(paintgl){
		
		paintgl.Events.EventEmitter.listen(this.onMouseDown.bind(this), "MOUSE_DOWN", "GL_WINDOW");
		paintgl.Events.EventEmitter.listen(this.onMouseUp.bind(this), "MOUSE_UP", "GL_WINDOW");
		paintgl.Events.EventEmitter.listen(this.onMouseMove.bind(this), "MOUSE_MOVE", "GL_WINDOW");
		paintgl.Events.EventEmitter.listen(this.onDoubleClick.bind(this), "MOUSE_DOUBLE_CLICK", "GL_WINDOW");

		paintgl.Events.EventEmitter.listen((function(toolState){
			this.setActiveTool(toolState.toolClass);
		}).bind(this), "TOOL_SELECTED", "UI_TOOLS");

		
		
	}

	start(){
		let pentool = new PenTool();
		this.addTool(pentool);
		this.addTool(new PolygonTool());
		this.addTool(new RectangleTool());
		this.addTool(new LinestripTool());
		this.addTool(new LineTool());
		this.addTool(new EraserTool());
		this.addTool(new BrushTool());
		this.addTool(new CurveTool());

		Object.values(this.tools).forEach(tool => {tool.init(paintgl)});
		this.setActiveTool(pentool.id);
		
	}

	enableTool(toolId){
		this.tools[toolId].setEnabled(true);
	}

	disableTool(toolId){
		this.tools[toolId].setEnabled(false);
	}

	setActiveTool(toolId){
		if(!this.tools[toolId]){
			return;
		}
		
		if(this.activeTool != null){
			if(this.activeTool.commit){
				this.activeTool.commit();
			}

			if(this.activeTool.stop){
				this.activeTool.stop();
			}
		}

		this.activeTool = this.tools[toolId];
		if(this.activeTool.start){
			this.activeTool.start();
		}
			
	}

	deactivateTools(){
		Object.values(this.tools).forEach(tool => this.disableTool(tool));
	}

	addTool(tool){
		if(tool && tool.id && this.tools[tool.id]){
			log("Dublicate tool: " + tool.id);
		}
		this.tools[tool.id] = tool;
	}

	onMouseUp(e){
		if(this.activeTool && this.activeTool.onMouseUp){
			this.activeTool.onMouseUp(e);
		}

	}

	onMouseMove(e){
		if(this.activeTool && this.activeTool.onMouseMove){
			this.activeTool.onMouseMove(e);
		}
	}

	onMouseDown(e){
		if(this.activeTool && this.activeTool.onMouseDown){
			this.activeTool.onMouseDown(e);
		}
	}

	onDoubleClick(e){
		if(this.activeTool && this.activeTool.onDoubleClick){
			this.activeTool.onDoubleClick(e);
		}
	}

	
}