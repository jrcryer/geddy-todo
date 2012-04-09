var Todo = new (function () {

    this.all = function (callback) {
        var todos = [];
        geddy.db.todos.find().sort({status: -1, title: 1}).toArray(function(err, docs){
            // if there's an error, return early
            if (err) {
              return callback(err, null);
            }
            // iterate through the docs and create models out of them
            for (var i in docs) {
              todos.push( geddy.model.Todo.create(docs[i]) )
            }
            return callback(null, todos);
        });
    };

    this.load = function (id, callback) {
        var todo;
        // find a todo in the db
        geddy.db.todos.findOne({id: id}, function(err, doc){
            // if there's an error, return early
            if (err) {
              return callback(err, null);
            }
            // if there's a doc, create a model out of it
            if (doc) {
              todo = geddy.model.Todo.create(doc);
            }
            return callback(null, todo);
        });
    };

    this.save = function (todo, opts, callback) {
 
        if (typeof callback != 'function') {
            callback = function(){};
        }
        cleanTodo = {
            id: todo.id,
            saved: todo.saved,
            title: todo.title,
            status: todo.status
        };
        todo = geddy.model.Todo.create(cleanTodo);
        if (!todo.isValid()) {
            return callback(todo.errors, null);
        }
        geddy.db.todos.findOne({id: todo.id}, function(err, doc){
            if (err) {
                return callback(err, null);
            }
            // if we already have the to do item, update it with the new values
            if (doc) {
                geddy.db.todos.update({id: todo.id}, cleanTodo, function(err, docs){
                   return callback(todo.errors, todo);
                });
            }
            // if we don't already have the to do item, save a new one
            else {
                todo.saved = true;
                geddy.db.todos.save(todo, function(err, docs){
                    return callback(err, docs);
                });
            }
        });
    };

    this.remove = function(id, callback) {
        if (typeof callback != 'function') {
            callback = function(){};
        }
        geddy.db.todos.remove({id: id}, function(err, res){
            callback(err);
        });
    };
})();
exports.Todo = Todo;