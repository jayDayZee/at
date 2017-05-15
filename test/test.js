var assert = require("assert");

var app =  require("../app.js");

// var AtRoot = require("../atSrc/at.js");

var atRoot = app.atRoot;
var atStore = app.atStore;

atRoot.connectAtStore(atStore);


// console.log(AtRoot);
console.log(atRoot);


var testObject = {};

describe
( "test namespace functions",
  function()
  { var testObject = {};

    describe
    ( "create.nested.namespace.here",
      function()
      { it
        ( "should create a complex object structure using the namespace function",
          function()
          { atRoot.namespace(testObject, "create.nested.namespace.here", ["toReturn = {}", "toReturn = {}", "toReturn = {}", "toReturn = ''"]);
            
            var createdObjectString = JSON.stringify(testObject);
            console.log("command: \n", "  ", `atRoot.namespace(testObject, "create.nested.namespace.here", ["toReturn = {}", "toReturn = {}", "toReturn = {}", "toReturn = ''"]);`);
            console.log("output: \n" , "  ", createdObjectString);
            
            assert.equal(createdObjectString, `{"create":{"nested":{"namespace":{"here":""}}}}` );
          }
        );
      }
    );

    describe
    ( "extend existing namespace",
      function()
      { it
        ( "extend that namespace with something else",
          function()
          { atRoot.namespace(testObject, "create.nested.alternateNamespace.here", ["toReturn = {}", "toReturn = {}", "toReturn = {}", "toReturn = ''"]);
            
            var createdObjectString = JSON.stringify(testObject);
            console.log("command: \n", "  ", `atRoot.namespace(testObject, "create.nested.alternateNamespace.here", ["toReturn = {}", "toReturn = {}", "toReturn = {}", "toReturn = ''"]);`);
            console.log("output: \n" , "  ", createdObjectString);
            
            assert.equal(createdObjectString, `{"create":{"nested":{"namespace":{"here":""},"alternateNamespace":{"here":""}}}}` );
          }
        );
      }
    );

    describe
    ( "test namespaceExists",
      function()
      { it
        ( "",
          function()
          { var result = atRoot.namespaceExists(testObject, "create.nested.alternateNamespace.here");
            assert.equal(result, true);
          }
        );
      }
    );

    describe
    ( "test default defaultList",
      function()
      { it
        ( "",
          function()
          { atRoot.namespace(testObject, "create.just.objects");
            result = Object.keys(testObject.create.just.objects).length === 0 && testObject.create.just.objects.constructor === Object;
            assert.equal(result, true);
          }
        );
      }
    );
    describe
    ( "test nonLeafNodes",
      function()
      { it
        ( "",
          function()
          { atRoot.namespace(testObject, "create.using.nonLeafNodes.going.on.forever", ["nonLeafNodes: {'proof':'true'}", "'someFunnyComment'"]);
            console.log("testObject\n  ", JSON.stringify(testObject));
            console.log(testObject.create.using.nonLeafNodes.going.on.forever);
            console.log(testObject.create.using.nonLeafNodes.going.on.proof);
            console.log(testObject.create.using.nonLeafNodes.going.on.forever == "someFunnyComment" && testObject.create.using.nonLeafNodes.going.on.proof);
            var result = 
                (testObject.create.using.nonLeafNodes.going.on.forever == "someFunnyComment") && testObject.create.using.nonLeafNodes.going.on.proof;

            assert.equal(result, "true");
          }
        );
      }
    );
    describe
    ( "test leafNode",
      function()
      { it
        ( "",
          function()
          { atRoot.namespace(testObject, "create.using.leafNode.going.on.for.a.while", ["leafNode: 'someFunnyComment'"]);
            console.log("testObject\n  ", JSON.stringify(testObject));
            console.log(JSON.stringify(testObject.create.using.leafNode.going.on.for.a));
            var result = 
                (testObject.create.using.leafNode.going.on.for.a.while == "someFunnyComment") && JSON.stringify(testObject.create.using.leafNode.going.on.for.a) == `{"while":"someFunnyComment"}` ;

            assert.equal(result, true);
          }
        );
      }
    );
  }
);

describe
( "basic node and traverse, moving on to persistance",
  function()
  { var context   = new atRoot.AtNode();
    var traveller = new atRoot.AtNode();

    namespace = atRoot.namespace;

    describe
    ( "create value 'x' = 0",
      function()
      { it
        ( "should result in the traveller having traveller.test.x = 0",
          function(done)
          { namespace( context, "traveller.codeBlock")
            context.traveller.codeBlock = 
            ` namespace(traveller, "test.x", ["leafNode: 0"]);
              console.log("traveller:\\n  ", traveller)\;
            `;
            
            namespace(traveller, "traveller.callback");
            traveller.traveller.callback = 
              function(traveller)
              { console.log("testResults\n\n\n\n");
                console.log("traveller:\n  ", traveller);
                console.log("context:\n  ", context);
                assert.equal(traveller.test.x, 0);
                done();
              };

            atRoot.traverse(traveller, context);
          }
        );
      }
    );

    describe
    ( "persist the traveller and the node, check if they are there",
      function()
      { it
        ( "should put the thing in the database",
          function(done)
          { atStore.insert([ context, traveller ]);
            
            atStore
              .find(context)
              .then
              ( function(docs)
                { console.log ("length of contextDocs:", docs.length);

                  atStore.find(traveller)
                  .then
                  ( function(docs2)
                    { console.log ("length of traveller docs:", docs2.length);

                      done(assert(docs.length==1 && docs2.length ==1) );                      
                    }
                  )

                }
              );
          }
        );
      }
    );

    describe
    ( "delete the traveller and the context,  check they are not there",
      function()
      { it
        ( "should delete the things from database",
          function(done)
          { atStore.remove(context);
            atStore.remove(traveller);
            
            atStore
              .find(context)
              .then
              ( function(docs)
                { console.log ("length of contextDocs:", docs.length);

                  atStore.find(traveller)
                  .then
                  ( function(docs2)
                    { console.log ("length of traveller docs:", docs2.length);

                      done(assert(docs.length==0 && docs2.length ==0) );                      
                    }
                  )

                }
              );
          }
        );
      }
    );

    describe
    ( "re add the context to the database",
      function()
      { it
        ( "should put the context in the database",
          function(done)
          { atStore.insert([ context ]);
            
            atStore
              .find(context)
              .then
              ( function(docs)
                { console.log ("length of contextDocs:", docs.length);

                  done( assert(docs.length == 1) );                      
                }
              );
          }
        );
      }
    );

    describe
    ( "create a node in the database that wraps the monk functionality, and give it a special name",
      function()
      { it
        ( "should find all the documents in the database",
          function(done)
          { var monkContext = {};
            
            namespace( monkContext, "traveller.codeBlock")
            monkContext.traveller.codeBlock = 
            ` var atStoreFunction = namespace(traveller, "traveller.atStore.functionName",    ["leafNode:'find'"]);
              var findParameters  = namespace(traveller, "traveller.atStore.findParameters");
              // var findOptions     = namespace(traveller, "traveller.atStore.findOptions",   ["leafNode:null"]);
              // var findCallback    = namespace(traveller, "traveller.atStore.findCallback",  ["leafNode:null"]);

              try
              { atStore[atStoreFunction].apply(null, findParameters)
                    .then
                    ( function(docs)
                      { traveller.traveller.atStore.result = docs;
                        console.log("traveller:\\n  ", traveller)\;
                      }
                    )
              }
              catch (error)
              { //console.log(error);
                console.log("ERROR STRING\\n", JSON.stringify(error.toString()) );
                traveller.traveller.atStore.result  = error.toString();
                traveller.traveller.atStore.error   = atStore == null;
              }
              
            `;
            
            
            var monkTraveller = {};
            namespace(monkTraveller, "traveller.atStore");
            monkTraveller.traveller.atStore.findParameters = [ {}, "id" ];

            namespace(monkTraveller, "traveller.callback");
            monkTraveller.traveller.callback = 
              function(completedTraveller)
              { console.log("testResults\n\n\n\n");
                console.log("traveller:\n  ", JSON.stringify(completedTraveller));
                console.log("context:\n  ",   monkContext);
                
                assert
                (   completedTraveller.traveller.atStore.result == "TypeError: Cannot read property 'find' of null"
                  &&
                    completedTraveller.traveller.atStore.error  == true
                );

                done();
              };

            atRoot.traverse(monkTraveller, monkContext);
          }
        );
      }
    );




    describe
    ( "create one to ten counter",
      function()
      { it
        ( "should log counting to 0 to 9 ten then complete",
          function(done)
          { 
          }
        );
      }
    );
  }

);


describe
  ( "DESTROY THE AT COLLECTION DO NOT DO THIS",
    function()
    { it
      ( "DETROY",
        function(done)
        { atStore.drop().then( () => done() );


        }
      );
    }
  );
