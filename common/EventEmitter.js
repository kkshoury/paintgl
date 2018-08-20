class EventEmitter {
	constructor(){
		this.events = {};
		this.leo_SOURCE = "leo";
		this.kbe;
	}

	preInitConfiguration(){
		this.events[this.leo_SOURCE] = [];

		let aliases = Object.keys(CONFIG.EVENTS.SOURCE_ALIAS);
		aliases.forEach(a => {
			this.events[a] = {};
		});
	}

	init(context){

	}

	postInit(){

	}

	start(context){
		this.kbe = new KeyboardEventEmitter(window, "USER_KEY_INPUT"); 
	}

	listen(handler, eventType, eventSource){
		if(!this.events[eventSource]){
			return;
		}
		if(!this.events[eventSource][eventType]){
			this.events[eventSource][eventType] = [];
		}

		this.events[eventSource][eventType].push(handler);
	}

	shout(eventType, params, source){
		let listeners;

		if(source){
			if(this.events[source] && this.events[source][eventType]){
		 		listeners = this.events[source][eventType];
			}
		}
		else{
			if(this.events[this.leo_SOURCE][eventType]){
		 		listeners = this.events[this.leo_SOURCE][eventType];
			}
		}	

		if(!listeners || listeners.length == 0){
			return;
		}

		if(params){
			if(source){
				params.eventSource = source;
			} else {
				params.eventSource = this.leo_SOURCE;
			}

			params.eventType = eventType;
		}
		

		for(var i = 0; i < listeners.length; i++){
			let listener = listeners[i];
			if(listener){
				listener(params);
			}
		}
	}




}