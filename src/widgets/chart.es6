export function BioJsChart(opts) {
	
	/* sanity check */
	if (!(opts.element instanceof $)) { throw new Error("No element given.") }
	var mapper = opts.mapper;
	var selectBox = $("<select multiple>").appendTo(opts.element)
	
	/* all properties of this widget */
	this.model    = newProperty(opts.model    || []);
	this.selected = newProperty(opts.selected || []);

	/* keep the DOM up to date with the model and selected properties */
	Kefir.combine([this.model, this.selected]).onValue(([values, selected]) => {
		values = _.uniq(values);
    	selectBox.empty();
    	values.forEach((val) => {
    		var opt = $('<option>', {value: val, text: val});
      		selectBox.append(opt);
      		if(selected.indexOf(val) >= 0){
      			opt.prop('selected', true)
      		}
    	});
	});
	
	/* keep the selected property up to date with the DOM */
	selectBox.on("change", (e) => {
		var names = selectBox.children().toArray().filter(el => el.selected).map(el => el.value);
		this.selected.emit(names);
	});
}