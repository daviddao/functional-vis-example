export default function BioJsTable(opts) {
	/* sanity check */
	if (!(opts.element instanceof $)) { throw new Error("No element given.") }
	
	/* all properties of this widget */
	this.model = newProperty(opts.model || []);
	
	/* add the default BioJS CSS class */
	opts.element.addClass("biojs_widget");
	
	/* populate the DOM element */
	var table = $('<table class="BioJsTable">');
	table.appendTo(opts.element);
	
	/* keep the table up to date with the model */
	this.model.onValue((model) => { 
		table.empty();
		
		if(model.length > 0){
			var header = $("<thead>");
			Object.keys(model[0]).forEach( (cell) => {
				header.append($("<th>").text(cell));	
			});
			table.append(header);
		}
		
		model.forEach((row) => {
			var rowEl = $("<tr>");
			Object.keys(row).forEach( (cell) => {
				rowEl.append($("<td>").text(row[cell]));	
			});
			table.append(rowEl);
		})
	});
}