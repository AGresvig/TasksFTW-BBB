define([
  // Application.
  "app",

  //Import tasks module
  "modules/tasks"
],

function(app, Tasks) {

    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
        routes: {
          "": "index"
        },

        index: function() {

            // Create a new Task List.
            var tasksCollection = new Tasks.Collection();

            // Use the "taskSection" template layout.
            app.useLayout('layouts/taskSection').setViews({
                // Attach the root content View to the layout.
                ".addTask": new Tasks.AddView({
                    collection: tasksCollection
                }),

                // Attach the stats View into the content View.
                ".tasks": new Tasks.ListView({
                    collection: tasksCollection
                })/*,

                // Attach the list View into the content View.
                ".list": new Todo.Views.List({
                collection: list
                })*/
            }).render();

            // Fetch existing tasks from the server
            tasksCollection.fetch();
        }
    });

  return Router;

});
