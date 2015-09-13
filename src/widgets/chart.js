"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

function BioJsChart(opts) {
	var _this = this;

	/* sanity check */
	if (!(opts.element instanceof $)) {
		throw new Error("No element given.");
	}
	var mapper = opts.mapper;
	var selectBox = $("<select multiple>").appendTo(opts.element);

	/* all properties of this widget */
	this.model = newProperty(opts.model || []);
	this.selected = newProperty(opts.selected || []);

	/* keep the DOM up to date with the model and selected properties */
	Kefir.combine([this.model, this.selected]).onValue(function (_ref) {
		var _ref2 = _slicedToArray(_ref, 2);

		var values = _ref2[0];
		var selected = _ref2[1];

		values = _.uniq(values);
		selectBox.empty();
		values.forEach(function (val) {
			var opt = $("<option>", { value: val, text: val });
			selectBox.append(opt);
			if (selected.indexOf(val) >= 0) {
				opt.prop("selected", true);
			}
		});
	});

	/* keep the selected property up to date with the DOM */
	selectBox.on("change", function (e) {
		var names = selectBox.children().toArray().filter(function (el) {
			return el.selected;
		}).map(function (el) {
			return el.value;
		});
		_this.selected.emit(names);
	});
}