class KeyboardEventEmitter {
	
	constructor(target) {
		this.eventType = "KEYBOARD_EVENT";

		this.KEY_DOWN = "KEY_DOWN";
		this.KEY_UP = "KEY_UP";
		this.KEY_PRESSED = "KEY_PRESSED";
		this.sourceType = "USER_KEY_INPUT";
		this.target = target;
		
		let ondown = function(e){
			paintgl.Events.EventEmitter.shout(this.KEY_DOWN, {key: e.keyCode}, this.sourceType);
		}

		let onup = function(e){
			paintgl.Events.EventEmitter.shout(this.KEY_UP, {key: e.keyCode}, this.sourceType);
		}

		let onpress = function(e){
			paintgl.Events.EventEmitter.shout(this.KEY_PRESSED, {key: e.keyCode}, this.sourceType);
		}


		if(this.target){
			this.target.onkeydown = ondown.bind(this);
			this.target.onkeyup = onup.bind(this);
			this.target.onkeypress = onpress.bind(this);
		}
	}

}

paintgl.Keyboard = paintgl.Keyboard || {};
paintgl.Keyboard.PLUS = 61;
paintgl.Keyboard.MINUS = 173;