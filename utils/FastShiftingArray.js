/*
	Order is not important in this array class.
*/
class FastShifitingArray{
	constructor(initialCapacity){
		let __array = Array(initialCapacity);
		let __size = 0;
	
		this.push = functions(x){
			__array[__size++] = x;
		}

	}

}

class HandlerGenerator {
	constructor(){
		let count = 1;
		
		this.newHandle = function(){
			count++;
			return count - 1;
		}
	}
}