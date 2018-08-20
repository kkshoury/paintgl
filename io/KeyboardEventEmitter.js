class KeyboardEventEmitter {
	
	constructor(target) {
		this.eventType = "KEYBOARD_EVENT";

		this.KEY_DOWN = "KEY_DOWN";
		this.KEY_UP = "KEY_UP";
		this.KEY_PRESSED = "KEY_PRESSED";
		this.sourceType = "USER_KEY_INPUT";
		this.target = target;
		
		let ondown = function(e){
			leo.Events.EventEmitter.shout(this.KEY_DOWN, {key: e.keyCode}, this.sourceType);
		}

		let onup = function(e){
			leo.Events.EventEmitter.shout(this.KEY_UP, {key: e.keyCode}, this.sourceType);
		}

		let onpress = function(e){
			leo.Events.EventEmitter.shout(this.KEY_PRESSED, {key: e.keyCode}, this.sourceType);
		}


		if(this.target){
			this.target.onkeydown = ondown.bind(this);
			this.target.onkeyup = onup.bind(this);
			this.target.onkeypress = onpress.bind(this);
		}
	}

}

leo.Keyboard = leo.Keyboard || {};
leo.Keyboard.PLUS = 61;
leo.Keyboard.MINUS = 173;