var should = require('should');
var selective = require('../index');

describe('selective', function(){

  describe('select()', function(){

    it('should return the params if all params are correct', function(done){
      var params = { name: 'Bradley', email: 'bradley@example.com', password: 'password', phone: '01234567891', location: 'london' };

      selective.select(params, ['#name', '#email', '#password', 'phone', '*location'], function(err, selected){
        should.not.exist(err);
        should.exist(selected);
        selected.should.have.property('name', 'Bradley');
        selected.should.have.property('email', 'bradley@example.com');
        selected.should.have.property('password', 'password');
        selected.should.have.property('phone', '01234567891');
        selected.should.have.property('location', 'london');
        done();
      });
    });

    it('should return an error if a required param is not supplied', function(){
      var params = { name: 'Bradley' };

      selective.select(params, ['name', 'email'], function(err, selected){
        should.not.exist(selected);
        should.exist(err);
        err[0].should.have.property('field', 'email');
        err[0].should.have.property('type', 'Missing Field');
      });
    });

    it('should not return an error if an optional param is not supplied', function(){
      var params = { name: 'Bradley' };

      selective.select(params, ['name', '*email'], function(err, selected){
        should.not.exist(err);
        should.exist(selected);
        selected.should.have.property('name', 'Bradley');
      });
    });

    it('should return an error if only one param of a group is supplied', function(){
      var params = { name: 'Bradley' };

      selective.select(params, ['#name', '#email'], function(err, selected){
        should.not.exist(selected);
        should.exist(err);
        err[0].should.have.property('field', 'email');
        err[0].should.have.property('type', 'Missing Field');
      });  
    });

    it('should return an error if an invalid param is supplied', function(){
      var params = { name: 'Bradley', random: 'random param' };

      selective.select(params, ['name'], function(err, selected){
        should.not.exist(selected);
        should.exist(err);
        err[0].should.have.property('field', 'random');
        err[0].should.have.property('type', 'Invalid Field');
      });  
    });

  });

});