```javascript
var selective = require('selective');

var params = {
  name: 'bradley',
  email: 'bradley.griffiths@gmail.com',
  location: 'london',
  random: 'random param'
}

selective.select(params, ['#name', '#email', '#password', '*location', 'phone'], function(err, selected){
  console.log(err);  
  console.log(selected);
});
```