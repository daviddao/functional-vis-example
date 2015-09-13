export function BioJsPieChart(opts) {
	
	/* sanity check */
	if (!(opts.element instanceof $)) { throw new Error("No element given.") }
	
	/* all properties of this widget */
	this.model    = newProperty(opts.model    || []);
	this.selected = newProperty(opts.selected || []);
	
	/* add the default BioJS CSS class */
	opts.element.addClass("biojs_widget");
	
	/* click stream */
	var clicks = new Kefir.Bus();
	
	/* create the pie chart in the DOM */
	var chart = c3.generate({
		bindto: opts.element[0],
	    data: {
	        // iris data from R
	        columns: [],
	        type : 'pie',
	        onclick({id}) { clicks.emit(id) },
	        // onmouseover() { chart.focus() },
			order: null // sort by loading order
	    },
	    size:{
	    	width: 200,
	    	height: 200
	    }
	});
	
	/* keep the DOM up to date with the model and selected properties */
	var originalColors = {};
	Kefir.combine([this.model, this.selected]).onValue(([values, selected]) => {
		// console.log(values);
		values = _.countBy(values);
		var data = _.sortBy(_.map(values, (val, key) => [key, val]), a => a[0]);
		var d = _.difference(_.pluck(chart.data(), "id"), _.keys(values));
	   	chart.load({
	   		columns: data,
	   		unload: d
	   	});
	   	var nonSelected = _.difference(selected,  _.keys(values));
	   	originalColors = chart.data.colors();
	   	var colors = _.mapValues(values, (i, x) => (selected.indexOf(x) !== -1) ? null : "lightgray");
	   	chart.data.colors(colors);
	});
	
	/* handle clicks to change the selection */
	Kefir.sampledBy([this.selected], [clicks], (s, id) => [s, id]).onValue(([selected, id]) => {
		this.selected.emit(_.xor(selected, [id]));
	});
}
