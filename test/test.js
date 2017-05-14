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
    ( "remove old traveller from database",
      function()
      { it
        ( "should results in zero travellers found",
          function(done)
          { var findObject = {};
            namespace(findObject, "traveller.test.x", ["leafNode:0"]);
            atStore
              .find( findObject )
              .then
              ( function(docs)
                { console.log ("length of traveller history docs:", docs.length);

                  var removePromise = atStore.remove(findObject)
                    .then
                    ( function()
                      { atStore.find(findObject)
                          .then
                          ( function(docs2)
                            { console.log("length of traveller history docs, after removed:", docs2.length);

                              done( assert(docs2.length == 0) );
                            }
                          )
                      }
                    )
                }
              );
            }
          );
      }
    );

    describe
    ( "remove old context from database",
      function()
      { it
        ( "should result in zero contexts found",
          function(done)
          { var findObject = {};
            namespace( findObject, "traveller.codeBlock");
            findObject.traveller.codeBlock = 
                ` namespace(traveller, "test.x", ["leafNode: 0"]);
                console.log("traveller:\\n  ", traveller)\;
                `;

            atStore
                .find( findObject )
                .then
                ( function(docs)
                  { console.log ("length of context history docs:", docs.length);

                    atStore.remove(findObject)
                      .then
                      ( function()
                        { atStore.find(findObject)
                            .then
                            ( function(docs2)
                              { console.log("length of context history docs, after removed:", docs2.length);

                                done( assert(docs2.length == 0) );
                              }
                            )
                        }
                      );
                  }
                );
          }
        );
      }
    );

    describe
    ( "check there's not old travellers in the database",
      function()
      { it
        ( "should results in zero travellers found",
          function(done)
          { var findObject = {};
            namespace(findObject, "traveller.test.x", ["leafNode:0"]);
            atStore
              .find( findObject )
              .then
              ( function(docs)
                { console.log ("length of traveller history docs:", docs.length);

                  done( assert(docs.length == 0) );
                }
              );
            }
          );
      }
    );

    describe
    ( "check there are no old contexts in the database",
      function()
      { it
        ( "should results in zero contexts found",
          function(done)
          { var findObject = {}
            namespace( findObject, "traveller.codeBlock");
            findObject.traveller.codeBlock = 
                ` namespace(traveller, "test.x", ["leafNode: 0"]);
                console.log("traveller:\\n  ", traveller)\;
                `;

            atStore
                .find( findObject )
                .then
                ( function(docs)
                  { console.log ("length of context history docs:", docs.length);

                    done( assert(docs.length == 0) );
                  }
                );
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
