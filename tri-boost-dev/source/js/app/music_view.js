var MusicListView = Backbone.View.extend({
    el:'#musicListView',
    constructor: function() {
        if (!MusicListView.instance) {
            MusicListView.instance = this;
            Backbone.View.apply(MusicListView.instance, arguments);
        }
        return MusicListView.instance;
    },

})
var MusicFormView = Backbone.View.extend({
    el:'#musicFormView'
})
var MusicOutputView = Backbone.View.extend({
    el:'#musicOutputView'
})