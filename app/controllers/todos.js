
var Todos = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
  
  // List all items
  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.adapter.Todo.all(function(err, todos){
      self.respond({params: params, todos: todos});
    });
  };
  
  // Add a new item
  this.add = function (req, resp, params) {
    this.respond({params: params});
  };
  
  // Persist new todo
  this.create = function (req, resp, params) {
    var self = this,
        todo = geddy.model.Todo.create({
          id: geddy.string.uuid(10),
          title: params.title,
          status: 'open'
        });

    todo.save(function(err, data) {
        if(err) {
          params.errors = err;
          self.transfer('add');
        }
        else {
          self.redirect({controller: self.name});
        }
    });
  };
   
  // Edit an existing todo
  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Todo.load(params.id, function(err, todo){
      self.respond({params: params, todo: todo});
    });
  };
  
  // Modify an existing todo
  this.update = function (req, resp, params) {
    var self = this;
    geddy.model.adapter.Todo.load(params.id, function (err, todo) {
      todo.title = params.title;
      todo.status = params.status;
    
      todo.save(function (err, data) {
        if (err) {
          params.errors = err;
          self.transfer('edit');
        }
        else {
          self.redirect({controller: self.name});
        }
      });
    });
  };
  
  // Remove a todo
  this.remove = function (req, resp, params) {
    var self = this;
    geddy.model.adapter.Todo.remove(params.id, function(err){
      if (err) {
        params.errors = err;
        self.transfer('edit');
      }
      else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Todos = Todos;

