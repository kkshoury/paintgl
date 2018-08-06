class ToolManager{
	constructor(){
		this.tools = {};
		this.activeTool = null;
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
			this.activeTool.commit();
		}

		this.activeTool = this.tools[toolId];
			
	}

	deactivateTools(){

	}

	addTool(tool){
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