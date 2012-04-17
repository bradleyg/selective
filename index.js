module.exports.select = function(fields, options, cb) {
  return new selector(fields, options, cb).run();
}

var selector = function(fields, options, cb) {
  this.fields = fields;
  this.options = options;
  this.errors = [];
  this.cb = cb;
}

selector.prototype.run = function(){
  var self = this;

  this.getGroups();
  this.checkFields();

  process.nextTick(function(){
    if (self.errors.length > 0) {    
      return self.cb(self.errors);
    }
    self.cb(null, self.fields);
  });
}

selector.prototype.getGroups = function() {
  var group = [];
  var nonGroup = [];

  this.options.forEach(function(option){

    if(option.indexOf('#') !== -1){
      group.push(option.replace('#', ''));
    }
    else {
      nonGroup.push(option);
    }  
  });

  var groupExists = false;

  Object.keys(this.fields).forEach(function(key){
    if(group.indexOf(key) !== -1){
      groupExists = true;
    }    
  });

  this.options = groupExists ? group.concat(nonGroup) : nonGroup;
}

selector.prototype.checkFields = function() {
  var self = this;

  var nonValid = Object.keys(this.fields);
  var errors = [];

  this.options.forEach(function(option){
    var escaped = option.replace('*', '');
    var key = nonValid.indexOf(escaped);

    if(key !== -1){
      delete nonValid[key];          
    }

    if(typeof self.fields[escaped] === 'undefined' && option.indexOf('*') === -1){      
      self.addError(escaped, 'Missing Field');
    }
  });

  nonValid.forEach(function(field){          
    self.addError(field, 'Invalid Field');
  });

}

selector.prototype.addError = function(field, type) {
  this.errors.push({
    field: field,
    type: type
  }); 
}