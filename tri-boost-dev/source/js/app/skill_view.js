var SkillListView = Backbone.View.extend({
    el:'#skillListView',
    constructor: function() {
        if (!SkillListView.instance) {
            SkillListView.instance = this;
            Backbone.View.apply(SkillListView.instance, arguments);
        }
        return SkillListView.instance;
    },
})
var SkillFormView = Backbone.View.extend({
    el:'#skillFormView'
})
var SkillOutputView = Backbone.View.extend({
    el:'#skillOutputView'
})