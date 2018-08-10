class LayoutManager{
	constructor(){

	}

	init(){
		// this.setupTopRibbon();
		
	}

  start(){
    this.drawUI();
  }

  drawUI(){
    let _layout = CONFIG.LAYOUT.RIBBON.TOOLBAR["UI_TOOLBAR"];
    let _tools = CONFIG.TOOLS;
    let toolbar = React.createElement(Toolbar, {className: "ribbonContainer", id: "toolbar", name: "Tools", 
                handleClick : setLine, items: _layout, itemProps: _tools});

    let _colorLayout = CONFIG.LAYOUT.RIBBON.TOOLBAR["UI_COLOR_BAR"];
    let _colors = CONFIG.COLORS.supportedColors.colors;
    let colorBar = React.createElement(ColorBar, {className: "ribbonContainer", id: "colorbar", name: "Colors", handleClick: alert, items: _colorLayout,
                  itemProps: _colors});

    let div = React.createElement("div", null, toolbar, colorBar);
    ReactDOM.render(div, document.getElementById("top"));
  }
	

	// setupTopRibbon(){}
		
}

class Toolbar extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = props.handleClick;
    let items = this.props.items;
    let itemProps = this.props.itemProps;
    this.name = this.props.name;

    this.loadedToolProps = [];

    for(var i = 0; i < items.list.length; i++){ //should not be .list
    	let id = items.list[i].id;
    	let tool = itemProps[id];
    	if(tool && tool.load == true){
    		let prop = {};
    		prop.name = this.name;
    		prop.id = id;
    		prop.key = id;
    		prop.isChecked = false;
    		prop.toolClass = tool.toolClass;
    		
    		if(tool.enabled == false){
    			prop.disabled = true;
    		}
    		else {
    			prop.disabled = false;
    		}

    		this.loadedToolProps.push(prop);
    	}

    }

  }

 
  render(){
  	let size = this.loadedToolProps.length;
    let maxColumns = Math.ceil(size / 2.0);
    let children = [];

    var r = 1;
    var c = 0;
    children.push([]);
  	for(let i = 0 ; i <size; i++){
  		let child = React.createElement(Tool, this.loadedToolProps[i], null);
      children[r-1].push(child);
      c++;
      if(c == maxColumns){
        r++;
        children.push([]);
        c = 0;
      }
  	}

    let div = [];
    for(let i = 0; i < r; i++){
      div.push(React.createElement("div", null, children[i]));
    }

  	let label = React.createElement("div", {className: "label"}, this.name);

    div.push(label);
    return React.createElement("div", {id : this.props.id, className: this.props.className}, div);
      
  }
}


class ColorBar extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = props.handleClick;
    let items = this.props.items;
    let itemProps = this.props.itemProps;
    this.name = this.props.name;

    this.loadedColorProps = [];

    for(var i = 0; i < items.list.length; i++){ //should not be .list
      let id = items.list[i].id;
      let color = itemProps[id];
      if(color && color.load == true){
        let prop = {};
        prop.name = this.name;
        prop.id = id;
        prop.key = id;
        prop.isChecked = false;
        prop.r = color.r;
        prop.g = color.g;
        prop.b = color.b;

        if(color.enabled == false){
          prop.disabled = true;
        }
        else {
          prop.disabled = false;
        }

        this.loadedColorProps.push(prop);
      }

    }

  }

 
  render(){
    let size = this.loadedColorProps.length;
    let maxColumns = Math.ceil(size / 2.0);
    let children = [];

    var r = 1;
    var c = 0;
    children.push([]);
    for(let i = 0 ; i <size; i++){
      let child = React.createElement(Color, this.loadedColorProps[i], null);
      children[r-1].push(child);
      c++;
      if(c == maxColumns){
        r++;
        children.push([]);
        c = 0;
      }
    }

    let div = [];
    for(let i = 0; i < r; i++){
      div.push(React.createElement("div", null, children[i]));
    }

    let label = React.createElement("div", {className: "label"}, this.name);

    div.push(label);
    return React.createElement("div", {id : this.props.id, className: this.props.className}, div);
      
  }
}

class Tool extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    	toolClass : props.toolClass,
      checked : this.props.isChecked
    };
  }

    

  toggle(){
      this.setState({
        checked : !this.state.checked
      });

      paintgl.Events.EventEmitter.shout("TOOL_SELECTED", this.state, "UI_TOOLS");
    	// paintgl.ControlManagers.ToolManager.setActiveTool(this.state.toolClass);
   }

  render() {
  	let props = {
  			name: this.props.name, className:"tool", checked : this.state.checked,
        	id : this.props.id, type : "radio", onClick : this.toggle.bind(this)
    	};

    if(this.props.disabled == true){
    	props.disabled = true;
    }
  	
  	let input = React.createElement(
  		"input", 
  		props,
     	null);

  	let label = React.createElement("label", {htmlFor: this.props.id}, null);
  	
  	return React.createElement("div", null, input, label);
   
  }
}

class Color extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      checked: this.props.isChecked
    };
  }

  toggle(){
      this.setState({
        checked : !this.state.checked
      });     
      paintgl.ArtManagers2D.PathManager2D.setLineColor(this.props.r/255.0, this.props.g / 255.0, this.props.b / 255.0, 1.0);
   }

  render() {
    let props = {
        name: this.props.name, className:"colors", checked : this.state.checked,
          id : this.props.id, type : "radio", onClick : this.toggle.bind(this)
      };

    if(this.props.disabled == true){
      props.disabled = true;
    }
    
    let input = React.createElement(
      "input", 
      props,
      null);
    let label = React.createElement("label", {htmlFor: this.props.id, 
      style: {"color" : "rgb(" + this.props.r + ", " + this.props.g + ", " + this.props.b + ")",
        "background-color" : "rgb(" + this.props.r + ", " + this.props.g + ", " + this.props.b + ")"}
    }, null);

    
    return React.createElement("div", null, input, label);
   
  }
}
