export default function BioJsSlider(opts) {
	
	/* sanity check */
	if (!(opts.element instanceof $)) { throw new Error("No element given.") }
	
	/* all properties of this widget */
	this.text  = newProperty(opts.text || "");
	this.min   = newProperty(opts.min || 0);
	this.max   = newProperty(opts.max || 100);
	this.step  = newProperty(opts.step || 0);
	this.value = newProperty(opts.value || 0);

	/* add the default BioJS CSS class */
	//opts.element.addClass("biojs_widget");

	/* populate the DOM element */
	var label  = $('<span>');
	var slider = $('<input type="range">');
	var value  = $('<span>');
	$('<label>').append(label).append(slider).append(value).appendTo(opts.element);
	
	/* keep the text up to date with the model */
	this.text.onValue((text) => { label.text(text) });
	
	/* keep the value label up to date with the model */
	this.value.onValue((v) => { value.text(v) });
	
	/* keep the value consistent with the min, max and step */
	this.value.plug(Kefir.combine([this.value, this.min]).filter(A => A[0] < A[1]).map(A => A[1]));
	this.value.plug(Kefir.combine([this.value, this.max]).filter(A => A[0] > A[1]).map(A => A[1]));
	
	/* keep the slider up to date with the model */
	['min', 'max', 'step', 'value'].forEach((prop) => {
		this[prop].onValue((v) => { slider.prop(prop, v) });
	});
	
	/* keep the model up to date with the slider */
	slider.on('change input', () => { this.value.emit(parseInt(slider.val(), 10)) });
	
}
