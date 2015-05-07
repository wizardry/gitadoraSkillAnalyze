define([
	'underscore',
	'backbone'
],function(_,Backbone){

	var AnalyzeFormView = Backbone.View.extend({
		render:function(){
			var template = $.load('../templates/analyzeForm.html');
			this.$el.html(template);
			var analyzeView = new AnalyzeView({collection:this.collection});
			this.$()
			return this.$('#test').html(analyzeView.render().el);
		},

	})

})
;
