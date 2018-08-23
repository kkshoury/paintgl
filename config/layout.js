var CONFIG = CONFIG || {};

CONFIG.LAYOUT = CONFIG.LAYOUT || {};

CONFIG.LAYOUT.RIBBON = CONFIG.LAYOUT.RIBBON || {};

CONFIG.LAYOUT.RIBBON.TOOLBAR = {
	"UI_2D_DRAW":
	{
		name: "tools",
		maxColumnCountAbsolute: 7,
		maxColumnCountRatio: 2,
		list: [
			{id: "tool-pen"},
			{id: "tool-line"},
			{id: "tool-rectangle"},
			{id: "tool-linestrip"},
			{id: "tool-polygon"},
			{id: "tool-circle"},
			{id: "tool-curve"},
			{id: "tool-brush"},
			// {id: "tool-eraser"},
			{id: "tool-fill"}
			// {id: "tool-selectbox"},
			// {id: "tool-selectfree"},
			// {id: "tool-undo"},
			// {id: "tool-redo"}
		]
	},
	"UI_2D_EDIT":
	{
		name: "tools",
		maxColumnCountAbsolute: 7,
		maxColumnCountRatio: 2,
		list: [
			{id: "tool-eraser"},
			{id: "tool-selectbox"},
			{id: "tool-selectfree"},
			{id: "tool-undo"},
			{id: "tool-redo"}
		]
	},
	"UI_COLOR_BAR":
	{
		name: "Colors",
		maxColumnCountAbsolute: 7,
		maxColumnCountRatio: 2,
		list: [
			{id: "black"}, {id: "white"}, {id: "red"}, {id: "green"}, {id: "blue"}, {id: "yellow"},
			{id: "0"}, {id: "1"}, {id: "2"}, {id: "3"}, {id: "4"}, {id: "5"}, {id: "6"}, {id: "7"}, 
			{id: "8"}, {id: "9"}, {id: "10"}, {id: "11"}, {id: "12"}, {id: "13"}, {id: "14"}, 
			{id: "15"}, {id: "16"} ,{id: "17"}, {id: "18"}, {id: "19"}, {id: "20"}, {id: "21"}
		]
	}
	
}