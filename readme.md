Select parameters from an object (such as express's ```req.query```) and return any errors based on a specification defined.  

```npm install selective```

Append one of the following to each option to specify a requirement for that parameter:  
  
```*``` Represents an optional parameter.  
```#``` Represents a group (if one field from a group is in ```req.query``` then require the entire group).  


```javascript
var selective = require('selective');

var params = {
  name: 'bradley',
  email: 'bradley@example.com',
  random: 'random param'
}

selective.select(params, ['#name', '#email', '#password', '*location', 'phone'], function(err, selected){
  if(err) {
    console.log(err)
  }
  else {
    console.log(selected);  
  }  
});
```
Will output:

```json
[ { field: 'password', type: 'Missing Field' },  // 'password' is part of a group with a param sent (name).
  { field: 'phone', type: 'Missing Field' },     // 'phone' is a required field.
  { field: 'random', type: 'Invalid Field' } ]   // 'random' is an undefined option.  
  
  // An error was not thrown for location as it is an optional field.
```
  
Run the tests ```make test```  
  
[![Build Status](https://secure.travis-ci.org/bradleyg/selective.png)](http://travis-ci.org/bradleyg/selective)