'use strict';

describe('ObjectContext', function() {
    var context;
    
    beforeEach(function() {
        context = new ObjectContext();
    });
    
    afterEach(function() {
        context.clear();
        context = null;
    });
    
    describe('add', function() {
        it('should add object correctly', function() {
            var obj = {testProperty: 'testValue'};
            var objects = context.add(obj).getObjects(true);

            expect(context.hasChanges()).toEqual(false);
            expect(objects.length).toBe(1);
            expect(objects[0].hasOwnProperty('current')).toEqual(true);
            expect(objects[0].hasOwnProperty('original')).toEqual(true);
            expect(objects[0].hasOwnProperty('hasChanges')).toBe(true);
            expect(objects[0].current).toBe(obj);
            expect(objects[0].hasChanges()).toEqual(false);
            expect(objects[0].current).not.toBe(objects[0].original);
            expect(objects[0].current.hasOwnProperty('testProperty')).toEqual(true);
            expect(objects[0].current.testProperty).toEqual(obj.testProperty);
            expect(objects[0].current._objectMeta.status).toEqual(ObjectContext.ObjectStatus.Unmodified);
        });
        
        it('should have changes after modifying an added object', function() {
            var obj = {testProperty: 'testValue'};
            context.add(obj);
            obj.testProperty = 'changed';
            context.evaluate();
            
            expect(context.hasChanges()).toBe(true);
        });
        
        it('should throw if invalid object is added', function() {
            expect(context.add).toThrow();
        });
        
        it('should throw if same object added twice', function() {
            var addSameObjectTwice = function() {
                var obj = {testProperty: 'testValue'};
                context.add(obj);
                context.add(obj);
            };
            
            expect(addSameObjectTwice).toThrow();
        });
        
        it('should throw if object is added with invalid status', function() {
            var addWithInvalidStatus = function() {
                var obj = {testProperty: 'testValue', _objectMeta: {status: 'invalid'}};
                context.add(obj);
            };

            expect(addWithInvalidStatus).toThrow();
        });
    });
});