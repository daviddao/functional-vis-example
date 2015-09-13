function BioJsFilter(opts) {
	
	/* sanity check */
	if (!(opts.element instanceof $)) { throw new Error("No element given.") }
	var mapper = opts.mapper;
	var select = $("<select multiple>").appendTo(opts.element)
	
	/* all properties of this widget */
	this.arr = newProperty(opts.arr || []);

	function refresh(vals){
    	select.empty();
    	vals.forEach(function(val){
      		select.append( $('<option>', {value: val, text: val}));
    	});
  	}
	this.arr.onValue(function(vals) {
	    refresh(vals.map(mapper));
	});
}