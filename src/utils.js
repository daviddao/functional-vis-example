function newProperty(initial) {
	var bus = new Kefir.Bus();
	var result = bus.toProperty(initial).skipDuplicates();
	result.plug = function (obs) { bus.plug(obs) };
	result.set = result.emit = function (value) { bus.emit(value) };
	
	var currentValue;
	result.get = function () { return currentValue };
	result.onValue(function (v) { currentValue = v });
	
	return result;
}