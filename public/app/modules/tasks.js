// Tasks module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Tasks = app.module();

  // Default Model.
  Tasks.Model = Backbone.Model.extend({
      //Default values for new objects
      defaults: {
          completed   : false
      },

      //Custom parse method so "id" property is assigned properly
      parse: function(response) {
          response.id = response._id;
          return response;
      }
  });

  // Default Collection.
  Tasks.Collection = Backbone.Collection.extend({
    model: Tasks.Model,
    url: '/api/tasks'
  });

  Tasks.AddView = Backbone.View.extend({
      template: 'addTask',

      events: {
          "click #add-button" : 'addTask'
      },

      addTask: function(event) {
          event.preventDefault();

          var tagsString = this.$(".tagsInput").val();
          var tags = tagsString.replace(" ", "").split(",");

          this.collection.create(this.newAttributes());
          this.$(".taskInput").val("");
          this.$(".tagsInput").val("");
      },

      // Generate the attributes for a new Task
      newAttributes: function() {
          return {
              description: this.$(".taskInput").val(),
              tags: this.$(".tagsInput").val().replace(" ", "").split(",")
          };
      }
  });

  Tasks.ListView = Backbone.View.extend({
      tagName: 'ul',
      id: 'tasklist',
      className: 'unstyled',

      initialize: function(options) {
          this.collection.on("reset", function() {
              this.render();
          }, this);

          this.collection.on("add", function(item) {
              this.insertView(new Tasks.ItemView({
                  model: item
              })).render();
          }, this);
      },

      beforeRender: function(manage) {
          this.collection.each(function(item) {
              this.insertView(new Tasks.ItemView({
                  model: item
              })).render();
          }, this);
        }
  });

  Tasks.ItemView = Backbone.View.extend({
      template: 'task',

      initialize: function() {
          //Re-render when model data changes
          this.model.on("change", function() {
              this.render();
          }, this);

          //Remove view when model data is deleted
          this.model.on("destroy", function() {
              this.remove();
          }, this);
      },

      //Custom serialize so we can get property names easier in templates
      serialize: function() {
          return {
              task: this.model.attributes
          };
      }
  });

  // Return the module for AMD compliance.
  return Tasks;

});
