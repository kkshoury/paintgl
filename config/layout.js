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
			{id: "color-0"}, {id: "color-1"}, {id: "color-2"}, {id: "color-3"}, {id: "color-4"}, {id: "color-5"}, {id: "color-6"}, {id: "color-7"}, 
			{id: "color-8"}, {id: "color-9"}, {id: "color-10"}, {id: "color-11"}, {id: "color-12"}, {id: "color-13"}, {id: "color-14"}, 
			{id: "color-15"}, {id: "color-16"} ,{id: "color-17"}, {id: "color-18"}, {id: "color-19"}, {id: "color-20"}, {id: "color-21"}
		]
	}
	
}