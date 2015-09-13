"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

function BioJsPieChart(opts) {
	var _this = this;

	/* sanity check */
	if (!(opts.element instanceof $)) {
		throw new Error("No element given.");
	}

	/* all properties of this widget */
	this.model = newProperty(opts.model || []);
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
			type: "pie",
			onclick: function onclick(_ref) {
				var id = _ref.id;
				clicks.emit(id);
			},
			// onmouseover() { chart.focus() },
			order: null // sort by loading order
		},
		size: {
			width: 200,
			height: 200
		}
	});

	/* keep the DOM up to date with the model and selected properties */
	var originalColors = {};
	Kefir.combine([this.model, this.selected]).onValue(function (_ref) {
		var _ref2 = _slicedToArray(_ref, 2);

		var values = _ref2[0];
		var selected = _ref2[1];

		// console.log(values);
		values = _.countBy(values);
		var data = _.sortBy(_.map(values, function (val, key) {
			return [key, val];
		}), function (a) {
			return a[0];
		});
		var d = _.difference(_.pluck(chart.data(), "id"), _.keys(values));
		chart.load({
			columns: data,
			unload: d
		});
		var nonSelected = _.difference(selected, _.keys(values));
		originalColors = chart.data.colors();
		var colors = _.mapValues(values, function (i, x) {
			return selected.indexOf(x) !== -1 ? null : "lightgray";
		});
		chart.data.colors(colors);
	});

	/* handle clicks to change the selection */
	Kefir.sampledBy([this.selected], [clicks], function (s, id) {
		return [s, id];
	}).onValue(function (_ref) {
		var _ref2 = _slicedToArray(_ref, 2);

		var selected = _ref2[0];
		var id = _ref2[1];

		_this.selected.emit(_.xor(selected, [id]));
	});
}