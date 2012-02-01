/*!
 * Copyright (c) 2011 Bradley Griffiths <bradley.griffiths@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
 
module.exports.select = function(fields, options, cb) {
  return new selector(fields, options, cb).run();
}

// construct
var selector = function(fields, options, cb) {
  this.fields = fields;
  this.options = options;
  this.errors = [];
  this.cb = cb;
}

// run the field validation
selector.prototype.run = function(){
  var self = this;
  
  this.getGroups();
  this.checkFields();
  
  // pretent to be async not to break anything
  process.nextTick(function(){
    if (self.errors.length > 0) {    
      return self.cb(self.errors);
    }
    self.cb(null, self.fields);
  });
}

// check the fields sent for groups and require an entire group if one is sent
selector.prototype.getGroups = function() {
  var group = [];
  var nonGroup = [];
  
  // loop though the options
  this.options.forEach(function(option){
    
    // see if the option is part of a group, if so push it into the group array
    if(option.indexOf('#') !== -1){
      group.push(option.replace('#', ''));
    }
    else {
      // it's not part of a group
      nonGroup.push(option);
    }  
  });

  var groupExists = false;
  
  // loop through the fields we are checking and see if any of them belong to a group
  Object.keys(this.fields).forEach(function(key){
    if(group.indexOf(key) !== -1){
      groupExists = true;
    }    
  });

  // if a group exists add all of the fields for that group to the options array
  this.options = groupExists ? group.concat(nonGroup) : nonGroup;
}

// check the fields for valid / invalid params
selector.prototype.checkFields = function() {
  var self = this;
  
  // create a nonValid array from the fields sent and delete from it
  var nonValid = Object.keys(this.fields);
  var errors = [];

  // loop the options and remove optional field signifiers ("*") then delete from nonValid
  this.options.forEach(function(option){
    var escaped = option.replace('*', '');
    var key = nonValid.indexOf(escaped);

    if(key !== -1){
      delete nonValid[key];          
    }
    
    // if the field does not exist in the options object add an error
    if(typeof self.fields[escaped] === 'undefined' && option.indexOf('*') === -1){      
      self.addError(escaped, 'Missing Field');
    }
  });
  
  // whatever is left is invalid, add an error
  nonValid.forEach(function(field){          
    self.addError(field, 'Invalid Field');
  });
  
}

// push errors to the global array
selector.prototype.addError = function(field, type) {
  this.errors.push({
    field: field,
    type: type
  }); 
}