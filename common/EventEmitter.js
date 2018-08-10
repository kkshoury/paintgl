class EventEmitter {
	constructor(){
		this.events = {};
		this.PAINTGL_SOURCE = "PAINTGL";
	}

	preInit(){
		this.events[this.PAINTGL_SOURCE] = [];

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
		 	listeners = this.events[source][eventType];
		}
		else{
		 	listeners = this.events[this.PAINTGL_SOURCE][eventType];
		}	

		if(!listeners || listeners.length == 0){
			return;
		}

		if(params){
			if(source){
				params.eventSource = source;
			} else {
				params.eventSource = this.PAINTGL_SOURCE;
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