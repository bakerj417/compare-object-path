import { should } from 'should';
import shouldUpdate from '../src';

describe('shouldUpdate', function() {
  before(function (){
    this.currProps = { test: { test1: 3, test2: { test3: 5, test4: 6 } } };
    this.nextPropsSame = { test: { test1: 3, test2: { test3: 5, test4: 6 } } };
    this.nextPropsDiff = { test: { test1: 2, test2: { test3: 5, test4: 6 } } };
  });

  it('should return defaultValue(true), when no paths are given and a config defaultValue is not passed', function (){
    const returnValue = shouldUpdate(null, this.currProps, this.nextPropsSame);
    
    returnValue.should.be.true();
  });

  it('should return specified value, when no paths are given and a config defaultValue is passed', function (){
    const specifiedVal = false;
    const returnValue = shouldUpdate(null, this.currProps, this.nextPropsSame, { defaultValue: specifiedVal });
    
    returnValue.should.be.eql(specifiedVal);
  });

  it('should return false, when omitPathsOnly is set to true, paths are passed and props checked are the same', function (){
    const returnValue = shouldUpdate(['test.test2.test3'], this.currProps, this.nextPropsSame, { omitPathsOnly: true });
    
    returnValue.should.be.false();
  });

  it('should return true, when omitPathsOnly is set to true, paths are passed but props checked are different', function (){
    const returnValue = shouldUpdate(['test.test2.test3'], this.currProps, this.nextPropsDiff, { omitPathsOnly: true });
    
    returnValue.should.be.true();
  });

  it('should return false, when multiple paths are passed and props checked are the same', function (){
    const returnValue = shouldUpdate([['test','test1'], 'test.test2.test3'], this.currProps, this.nextPropsSame);
    
    returnValue.should.be.false();
  });

  it('should return true, when multiple paths are passed and props checked are different', function (){
    const returnValue = shouldUpdate(['test.test1', { path: 'test.test2.test3' }], this.currProps, this.nextPropsDiff);
    
    returnValue.should.be.true();
  });

  it('should return true, when a path object is passed and props checked are the different and we don\'t omit the path that is different', function (){
    const returnValue = shouldUpdate([{ path: 'test', omit: 'test2.test3' }], this.currProps, this.nextPropsDiff);
    
    returnValue.should.be.true();
  });

  it('should return false, when a path object is passed and props checked are the different but we omit the path that is different', function (){
    const nextPropsDiffMulit = { test: { test1: 2, test2: { test3: 5, test4: 3 } } }
    const returnValue = shouldUpdate([{ path: 'test', omit: ['test1', ['test2', 'test4']] }], this.currProps, nextPropsDiffMulit);
    
    returnValue.should.be.false();
  });
});
