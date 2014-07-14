define(['knockout', 'jquery'], function (ko, $) {
	ko.bindingHandlers.edit = {
		init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			var innerBindingContext = bindingContext.extend({
				edit: function () {
					$(element).addClass('editing');
					$(element).find('input:first').focus();
				},
				stopEdit: function () {
					$(element).removeClass('editing');
				}
			});

			if (viewModel.isNew()) {
				innerBindingContext.edit();
			}

			ko.applyBindingsToDescendants(innerBindingContext, element);

			return { controlsDescendantBindings: true };
		}
	}
});