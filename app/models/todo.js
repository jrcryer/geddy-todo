
var Todo = function () {
  
  // Properties
  this.property('id', 'string', {required: true});
  this.property('title', 'string', {required: true});
  this.property('status', 'string', {required: true});
  
  // Validation
  this.validatesPresent('title');
  this.validatesLength('title', {min: 5});
  this.validatesWithFunction('status', function(status) {
      return status == 'open' || status == 'done';
  });
};
Todo = geddy.model.register('Todo', Todo);

