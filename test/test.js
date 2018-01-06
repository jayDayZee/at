// ############### initialise @pplication

// Developers: required config fields must have either a default xor an exit value
var requiredConfigFields = 
    { "port"        : { "default"   : 5510 },
    }
var atApplication = require("../app.js")("test", requiredConfigFields);

// ############### @pplication specifics
// imports for mocha
var assert = require("assert");

//  @ programatical tools
var atRoot    = atApplication.atRoot;

var atStore   = atApplication.atStore;
var ls        = atRoot.ls;
var namespace = atRoot.namespace;

// atStore.find({}).then( docs => { ls(errConsole, "documents:", docs); } );

var traveller       = {};
var addTestCallback = {};

var atStore = atApplication.registers.atStore;

var testObject = {};
ls(atRoot);

describe
( "\n\n\n\ntest namespace functions",
  function()
  { var testObject = {};

    describe
    ( "\n\n\n\ncreate.nested.namespace.here",
      function()
      { it
        ( "should create a complex object structure using the namespace function",
          function()
          { atRoot.namespace(testObject, "create.nested.namespace.here", ["toReturn = {}", "toReturn = {}", "toReturn = {}", "toReturn = ''"]);
            
            var createdObjectString = JSON.stringify(testObject);
            ls("command: \n", "  ", `atRoot.namespace(testObject, "create.nested.namespace.here", ["toReturn = {}", "toReturn = {}", "toReturn = {}", "toReturn = ''"]);`);
            ls("output: \n" , "  ", createdObjectString);
            
            assert.equal(createdObjectString, `{"create":{"nested":{"namespace":{"here":""}}}}` );
          }
        );
      }
    );

    describe
    ( "\n\n\n\nextend existing namespace",
      function()
      { it
        ( "extend that namespace with something else",
          function()
          { atRoot.namespace(testObject, "create.nested.alternateNamespace.here", ["toReturn = {}", "toReturn = {}", "toReturn = {}", "toReturn = ''"]);
            
            var createdObjectString = JSON.stringify(testObject);
            ls("command: \n", "  ", `atRoot.namespace(testObject, "create.nested.alternateNamespace.here", ["toReturn = {}", "toReturn = {}", "toReturn = {}", "toReturn = ''"]);`);
            ls("output: \n" , "  ", createdObjectString);
            
            assert.equal(createdObjectString, `{"create":{"nested":{"namespace":{"here":""},"alternateNamespace":{"here":""}}}}` );
          }
        );
      }
    );

    describe
    ( "\n\n\n\ntest namespaceExists true",
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
    ( "\n\n\n\ntest namespaceExists false",
      function()
      { it
        ( "",
          function()
          { var result = atRoot.namespaceExists(testObject, "create.nested.alternateNamespace.here.should.be.false");
            assert.equal(result, false);
          }
        );
      }
    );

    describe
    ( "\n\n\n\ntest namespace exists using namespace checkExists parameter",
      function()
      { it
        ( "",
          function()
          { var result = atRoot.namespace(testObject, "create.nested.alternateNamespace.here.should.be.false", null, true);
            assert.equal(result, false);
          }
        );
      }
    );

    describe
    ( "\n\n\n\ntest default defaultList",
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
    ( "\n\n\n\ntest nonLeafNodes",
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
    ( "\n\n\n\ntest leafNode",
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
    describe
    ( "\n\n\n\ntest namespace.rm editing",
      function()
      { it
        ( "",
          function()
          { atRoot.namespace(testObject, "create.using.leafNode.going.on.for.a.while", ["leafNode: 'someFunnyComment'"]);
            console.log("testObject\n  ", JSON.stringify(testObject));
            console.log(JSON.stringify(testObject.create.using.leafNode.going.on.for.a));
            var removed = atRoot.namespace.rm(testObject, "create.using.leafNode.going.on.for.a.while");
            console.log(removed);
            // assert
            // (     removed == "someFunnyComment"
            //   &&
            //       ! testObject.create.using.leafNode.going.on.for.a.hasOwnProperty("while")
            // );

          }
        );
      }
    );
    //First implement them properly. Then make the tests
    // describe
    // ( "test namespace.mv",
    //   function()
    //   { it
    //     ( "",
    //       function()
    //       { atRoot.namespace(testObject, "create.using.leafNode.going.on.for.a.while", ["leafNode: 'someFunnyComment'"]);
    //         console.log("testObject\n  ", JSON.stringify(testObject));
    //         console.log(JSON.stringify(testObject.create.using.leafNode.going.on.for.a));
    //         var removed = atRoot.namespace.rm(testObject, "create.using.leafNode.going.on.for.a.while");
    //         assert
    //         (     removed =="someFunnyComment"
    //           &&
    //               ! testObject.create.using.leafNode.going.on.for.a.hasOwnProperty("while")
    //         );
    //       }
    //     );
    //   }
    // );
    // describe
    // ( "test namespace.rm",
    //   function()
    //   { it
    //     ( "",
    //       function()
    //       { atRoot.namespace(testObject, "create.using.leafNode.going.on.for.a.while", ["leafNode: 'someFunnyComment'"]);
    //         console.log("testObject\n  ", JSON.stringify(testObject));
    //         console.log(JSON.stringify(testObject.create.using.leafNode.going.on.for.a));
    //         var removed = atRoot.namespace.rm(testObject, "create.using.leafNode.going.on.for.a.while");
    //         assert
    //         (     removed =="someFunnyComment"
    //           &&
    //               ! testObject.create.using.leafNode.going.on.for.a.hasOwnProperty("while")
    //         );
    //       }
    //     );
    //   }
    // );

    //TODO: add test for namespace.contains
    describe
    ( "\n\n\n\ntest namespace.contains",
      function()
      { it
        ( "",
          function()
          { var testContains = { "one": {}, "two": {}, "three": {} };
            assert
            (     atRoot.namespace.contains(testContains, "", ["one", "two", "three"])
              &&
                  ! atRoot.namespace.contains(testContains, "", ["four"])
            );
          }
        );
      }
    );
  }
);

describe
( "\n\n\n\ncreate a simple node, and move onto persistance",
  function()
  { var context   = new atRoot.AtNode();
    var traveller = new atRoot.AtNode();

    namespace = atRoot.namespace;

    describe
    ( "\n\n\n\ncreate value 'x' = 0",
      function()
      { it
        ( "should result in the traveller having traveller.test.x = 0",
          function(done)
          { namespace( context, "traveller.codeBlock")
            context.traveller.codeBlock = 
            ` namespace(traveller, "test.x", ["leafNode: 0"]);
              ls("traveller:\\n  ", traveller)\;
            `;
            
            namespace(traveller, "traveller.callback");
            traveller.traveller.callback = 
              function(traveller)
              { ls("\n\n\n\n", "testResults");
                ls("traveller:\n  ", traveller);
                ls("context:\n  ", context);
                assert.equal(traveller.test.x, 0);
                done();
              };

            atRoot.traverse(traveller, context);
          }
        );
      }
    );

    describe
    ( "\n\n\n\npersist the traveller and the node, check if they are there",
      function()
      { it
        ( "should put the thing in the database",
          function(done)
          { atStore.insert([ context, traveller ]);
            
            atStore
              .find(context)
              .then
              ( function(docs)
                { ls ("length of contextDocs:", docs.length);

                  atStore.find(traveller)
                  .then
                  ( function(docs2)
                    { ls ("length of traveller docs:", docs2.length);

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
    ( "\n\n\n\nelete the traveller and the context,  check they are not there",
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
                { ls ("length of contextDocs:", docs.length);

                  atStore.find(traveller)
                  .then
                  ( function(docs2)
                    { ls ("length of traveller docs:", docs2.length);

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
    ( "\n\n\n\nre add the context to the database",
      function()
      { it
        ( "should put the context in the database",
          function(done)
          { atStore.insert([ context ]);
            
            atStore
              .find(context)
              .then
              ( function(docs)
                { ls ("length of contextDocs:", docs.length);

                  done( assert(docs.length == 1) );                      
                }
              );
          }
        );
      }
    );

    describe
    ( "\n\n\n\nheck there is only on doc in the DB altogether, by looking for ALL documents. Must be the same as the document above. I.e. only the context we just added",
      function()
      { it
        ( "should result in docs.length == 1",
          function(done)
          { atStore
              .find({})
              .then
              ( function(docs)
                { ls ("length of All Docs:", docs.length);
                  ls ("contents of Docs:", docs);

                  done( assert(docs.length == 1) );                      
                }
              );
          }
        );
      }
    );
    
    describe
    ( "\n\n\n\nconnect an unintialised atStore. Should fail",
      function()
      { it
        ( "should result in some atStore sanity check error",
          function(done)
          { atRoot.connectAtStore(atStore)
              .then
              ( () => { done(assert( false, "this should never run" )); }
              )
              .catch 
              ( error =>
                { ls("ERROR: ", error.toString());
                  assert ( error.toString() == "atStore sanity check. docs.length !=1. https://github.com/christopherreay/at/wiki/Errors#atstoreconnect1" );
                  assert ( ! atRoot.connectedAtStore );
                  ls("atRoot.connectedAtStore is still empty");
                  done();
                }
              )
          }
        );
      }
    );

    describe
    ( "\n\n\n\ninitialise the non-empty DB. Should fail",
      function()
      { it
        ( "should result in some atStore initialise sanity check error",
          function(done)
          { atRoot.initialiseAtStore(atStore)
              .then
              ( () => { done(assert( false, "this should never run" )); }
              )
              .catch 
              ( error =>
                { ls("ERROR: ", error.toString());
                  assert ( error.toString() == "atStore sanity check. store not empty. https://github.com/christopherreay/at/wiki/Errors#atstoreinitialise1" )
                  done();
                }
              )
          }
        );
      }
    );

    describe
    ( "\n\n\n\ndelete the context document (to make DB empty for initialisation)",
      function()
      { it
        ( "should leave DB enpty",
          function(done)
          { atStore
              .remove(context)
              .then
              ( () =>
                { atStore
                    .find({})
                    .then
                    ( docs =>
                      { ls("DOCS\n", docs);
                        done(assert(docs.length==0) );                      
                      }
                    ) 
                }
              );
            
          }
        );
      }
    );

    describe
    ( "\n\n\n\ninitialise the NOW empty DB. Should pass, and allow atRoot.connectAtStore",
      function()
      { it
        ( "should result in having a storeID document",
          function(done)
          { atRoot.initialiseAtStore(atStore)
              .then
              ( () => 
                { ls("running connectAtStore");
                  return atRoot.connectAtStore(atStore)
                }
              )
              .then
              ( () => 
                { ls("checking if connected: ", atRoot.connectedAtStore == atStore);
                  done( assert(atRoot.connectedAtStore == atStore) ); 
                }
              )
              .catch 
              ( error =>
                { ls("ERROR: ", error.toString());
                  done( assert(false, "atRoot.connectedAtStore was no initialised") );
                }
              )
          }
        );
      }
    );

    //TODO: replace this with real security testing
    
    describe
    ( "\n\n\n\ncreate a node in the database that wraps the monk functionality, and give it a special name. This should FAIL since the atStore is not accessible except through direct access managed by the traverse function",
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
                        ls("traveller:\\n  ", traveller);
                      }
                    )
              }
              catch (error)
              { //ls(error);
                ls("ERROR STRING\\n", JSON.stringify(error.toString()) );
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
              { ls("\n\n\n\n", "testResults");
                ls("traveller:\n  ", completedTraveller);
                ls("context:\n  ",   monkContext);
                
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
    ( "\n\n\n\ntest the built in db access, now in the traverse function. This also has the wonderfulness of allowing a db access call and an eval block in one single pass",
      function()
      { it
        ( "find all, return one single @ root with storeID",
          function(done)
          { var monkTraveller = {"atStore": { "myFirstDBAccess": { "find": [ {} ] } } };

            namespace(monkTraveller, "traveller.callback");
            monkTraveller.traveller.callback = 
              function(completedTraveller)
              { ls("\n\n\n\n", "testResults");
                ls("traveller:\n  ", completedTraveller);
                
                assert
                (   completedTraveller.results.atStore.myFirstDBAccess.length == 1
                  &&
                    completedTraveller.results.atStore.myFirstDBAccess[0].hasOwnProperty("storeID")
                );

                done();
              };

            atRoot.traverse(monkTraveller, {});
          }
        );
      }
    );

    describe
    ( "\n\n\n\ncheck if there is only ONE at root id=@ in the db. (there were two when this test was created. This should be a prerequisite sanity check anyway",
      function()
      { it
        ( "deliberately find just that one record, using the id",
          function(done)
          { var monkTraveller = {"atStore": { "thereIsOnlyOne": { "find": [ {"id":"@"} ] } } };

            namespace(monkTraveller, "traveller.callback");
            monkTraveller.traveller.callback = 
              function(completedTraveller)
              { ls("\n\n\n\n", "testResults");
                ls("traveller.results.atStore:\n  ", completedTraveller.results.atStore);
                
                assert
                (   completedTraveller.results.atStore.thereIsOnlyOne.length == 1
                );

                done();
              };

            atRoot.traverse(monkTraveller, {});
          }
        );
      }
    );
  }

);


var context   = new atRoot.AtNode();
var traveller = new atRoot.AtNode();

describe
( "\n\n\n\ntravelling around a graph",
  function()
  { 

    namespace = atRoot.namespace;

    describe
    ( "\n\n\n\ncreate a single node for the traveller",
      function()
      { it
        ( "should result in the traveller having traveller.test.x = 0",
          function(done)
          { namespace( context, "traveller.codeBlock")
            context.traveller.codeBlock = 
            ` namespace(traveller, "test.x", ["leafNode: 0"]);
              ls("traveller:\\n  ", traveller)\;
            `;
            
            namespace(traveller, "traveller.callback");
            traveller.traveller.callback = 
              function(traveller)
              { ls("\n\n\n\n", "testResults");
                ls("traveller:\n  ", traveller);
                ls("context:\n  ", context);
                assert.equal(traveller.test.x, 0);
                done();
              };

            atRoot.traverse(traveller, context);
          }
        );
      }
    );

    var adder     = new atRoot.AtNode();
    describe
    ( "\n\n\n\ntravel along one branch on a graph",
      function()
      { it
        ( "make traveller.test.x = 1",
          function(done)
          { //create a simple adder context that adds 1 to test.x
            namespace (adder, "traveller.codeBlock");
            adder.traveller.codeBlock = 
            ` traveller.test.x = traveller.test.x + 1;
              ls("traveller:\\n  ", traveller);
            `;
            
            //The idea is that the traveller should automatically follow the id along the graph.
            //  this definately wont work, since its not implemented :)
            // Works now :)
            context.traveller.exit = adder.id;

            namespace(traveller, "traveller.callback");
            traveller.traveller.callback = 
              function(traveller)
              { ls("\n\n\n\ntestResults");
                ls("traveller:\n  ", traveller);
                ls("context:\n  ", context);
                assert.equal(traveller.test.x, 1);
                done();
              };

            atStore
              .insert( adder )
              .then
              ( ()  =>
                { atRoot.traverse(traveller, context);
                }
              );
          }
        );
      }
    );

    var adder2     = new atRoot.AtNode();
    describe
    ( "\n\n\n\nuse the traveller atStore command to add the new adder2 object to the atStore",
      function()
      { it
        ( "make traveller.test.x = 2",
          function(done)
          { //create a simple adder context that adds 1 to test.x
            namespace (adder2, "traveller.codeBlock");
            adder2.traveller.codeBlock = 
            ` traveller.test.x = traveller.test.x + 1;
              ls("traveller:\\n  ", traveller);
            `;
            
            //add adder2 to the atStore using the traveller DB phase
            traveller.atStore = {"add adder2": {"insert":[adder2]} };
            context.traveller.exit = adder2.id;

            namespace(traveller, "traveller.callback");
            traveller.traveller.callback = 
              function(traveller)
              { ls("\n\n\n\ntestResults");
                ls("traveller:\n  ", traveller);
                ls("context:\n  ", context);
                assert.equal(traveller.test.x, 2);
                done();
              };

            atRoot.traverse(traveller, context);
          }
        );
      }
    );

    var addTestCallback = new atRoot.AtNode();
    describe
    ( "\n\n\n\nmake traveller.traveller.callback do stuff and call done",
      function()
      { it
        ( "returns a traveller with its callback set to the passed done function",
          function(done)
          { //create a simple adder context that adds 1 to test.x
            namespace (addTestCallback, "traveller");
            addTestCallback.traveller.codeBlock = 
            () =>
            { traveller.traveller.callback = 
                (traveller) => 
                { ls("\n\n\n", "testResults");
                  ls("\n  ", "traveller:\n  ", traveller);

                  //set final test success value
                  var success = true;

                  //get the test asset conditions in the traveller
                  var conditions = namespace(traveller, "traveller.mocha.assertConditions", null, true);
                  //run through conditions, set success to false if any fail
                  ls("\n  ","\n  ","traveller.mocha: conditions:");
                  for (var key in conditions)
                  { var pass      = true;
                    var message   = "";
                    // var operator  = "==";
                    // if (conditions[key].hasOwnProperty("not")) operator = "!=";
                    // var left  = [traveller].concat(conditions[key].left)
                    // var right = [traveller].concat(conditions[key].right);
                    // eval( "pass = namespace.apply(null, left) "+operator+" namespace.apply(null, right)" );
                    try
                    { eval(conditions[key]);
                    }
                    catch (e)
                    { pass = false;
                      message = ": "+ e.toString();
                    }
                    if (pass) { pass = "passed"; } else { pass = "failed"; success = false; }
                    ls("  " + pass + "  " + key + "  " + message);
                    var resultLog = namespace(traveller, "traveller.mocha.results.assertConditions."+key);
                    resultLog.pass = pass
                    resultLog.message = message;
                  }

                  //call the customCallback, which can set success too
                  // customCallback = namespace(traveller, "traveller.mocha.customCallback", null, true);
                  // if (customCallback)
                  // { customCallback(traveller, success);
                  // }
                  // namespace.rm(traveller, "traveller.mocha.customCallback");

                  //complete mocha test
                  namespace.rm(traveller, "traveller.mocha.assertConditions");
                  namespace.rm(traveller, "traveller.mocha.done")(require("assert")(success));
                };
            }
            addTestCallback.traveller.codeBlock = addTestCallback.traveller.codeBlock.toString().slice(6);

            // should just pass since there are no conditions given.
            namespace(traveller, "traveller.mocha");

            traveller.traveller.mocha.done = done;
            traveller.traveller.mocha.assertConditions = 
                { "x==2": "pass = traveller.test.x == 2",
                  "x!=3": "pass = traveller.test.x != 3",
                };

            atRoot.traverse(traveller, addTestCallback);
          }
        );
      }
    );

    describe
    ( "\n\n\n\ntest the atRoot access",
      function()
      { it
        ( "Just creates an empty node, and checks that it has an id property",
          function(done)
          { traveller.atRoot = 
            { "newNode": { "newAtNode": [] },
            }

            namespace(traveller, "traveller.mocha");
            traveller.traveller.mocha.done = done;
            traveller.traveller.mocha.assertConditions = 
            { "containsNewNode": "pass = traveller.results.atRoot.newNode.id.length > 1"
            };

            atRoot.traverse(traveller, addTestCallback);

          }
        );
      }
    );
    describe
    ( "\n\n\n\ncreate a generic commitChanges for graphs to use to commit changed",
      function()
      { it
        ( "Just creates an empty node, and checks that it has an id property",
          function(done)
          { atStore.insert( { "id": "commitChanges"} );

            traveller.atStore = {"checkForCommitChanges": { "findOne": [ {"id": "commitChanges" } ] } };

            namespace(traveller, "traveller.mocha");
            traveller.traveller.mocha.done = done;
            traveller.traveller.mocha.assertConditions = 
            { "containsCommitChanges": "pass = traveller.results.atStore.checkForCommitChanges.id == 'commitChanges'",
            };

            atRoot.traverse(traveller, addTestCallback);

          }
        );
      }
    );


    var printerNodeID = null;
    describe
    ( "\n\n\n\nmake a graph, using a traveller config",
      function()
      { it
        ( "should accept sensible config, and build graphs too. Graphs are dependency dependent like",
          function(done)
          { //going to have to persist some things in the database so we can use a graph to make a graph NICE

            // does this:
            // defines four nodes which make up the "createGraph" graph
            // 1.
            // var createGraph
            // var addNodesToSaveQueue
            // var buildGraph
            // var runInits


            // 2.
            // these lines:
            // createGraph.traveller.exit          = "createGraph.addNodesToSaveQueue";
            // addNodesToSaveQueue.traveller.exit  = "createGraph.buildGraph";
            // buildGraph.traveller.exit           = "createGraph.runInits";

            // set up the branches between the nodes using the hardcoded (since createGraph doesnt exist yet when it is written to the store)


            // 3.
            // then uses the namespace defined by the createGraph graph to nodeDefinitions a graph with three nodes, called: start, printer and end (which dont need hard coded id's because createGraph graph knows what their global unique id's are and can tell them, so that they can use their localNamespace names to refer to each other)


            // 4.
            // this line:
            // adds the createGraph nodes to the atStore namespace, so that the first time the traveller encounters a node, it writes those
            //   objects into the atStore with the hardCoded id's

            // 5. 
            // configures the traveller.mocha namespace to add this test's async "done" function, and the required assertions

            // 6.
            // sets the traveller's suggestedExit to "createGraph" (the hardcoded start point of the not yet existing createGraph graph
            // 7.
            // sends the traveller into the addTestCallback node (which uses the mocha namespace to configure the callback function
            //   whilst the createGraph graph data stored in the atStore namespace is written to the atStore before the addTestCallback
            //   traveler.codeBlock is run, so that when the traveller completes the addTestCallback node, it travells to the
            //   newly written "createGraph" node.
            //    That createGraph node then uses the traveller.createGraph.nodeDefinitions namespace to create a graph
            //    which has the three nodes, start, print, end in it.
            //   then finally the assert conditions placed into the mocha namespace check the traveller.createGraph.results namespace
            //   to see if the createGraph graph has indeed caused the creation of the three nodes.


            // 1.
            var createGraph       = new atRoot.AtNode();
            createGraph.id        = "createGraph"; //awesome :)
            namespace(createGraph, "traveller");
                var codeBlock = 
                  () =>
                  { var nodeDefinitions = namespace(traveller, "traveller.createGraph.nodeDefinitions", null, true) || [];

                    // this needs to be thought about carefully. Basically the traveller should have to copy the results of the createGraph behaviour pretty quick sharp
                    //   perhaps that is what traveller.results is for? It is writable, by nodes, but acts like a tmp directory.
                    if (nodeDefinitions.length != 0)
                    { namespace(traveller, "traveller.createGraph");
                      traveller.traveller.createGraph.results = {};
                    }

                    nodeDefinitions.forEach
                    ( (nodeDefinition) =>
                      { namespace(traveller, "atRoot");
                        traveller.atRoot[nodeDefinition.name] = { "newAtNode": [] };
                      }
                    );
                  };
            createGraph.traveller.codeBlock = codeBlock.toString().slice(6);

            // we can factor this out to work ina single loop, by changing the atStore code to run a promise.All
            var addNodesToSaveQueue = new atRoot.AtNode();
            addNodesToSaveQueue.id        = "createGraph.addNodesToSaveQueue"; //awesome :)
            namespace(addNodesToSaveQueue, "traveller");
                var codeBlock = 
                  () =>
                  { var nodeDefinitions = namespace(traveller, "traveller.createGraph.nodeDefinitions", null, true) || [];
                    var insertList = [];

                    nodeDefinitions.forEach
                    ( (nodeDefinition) =>
                      { //there must be things in here since because :) namespaces are awesome :)
                        insertList.push(traveller.results.atRoot[nodeDefinition.name])
                      }
                    );
                    if (insertList != [])
                    { namespace(traveller, "atStore");
                      traveller.atStore["createGraph.savedNodes"] = {"insert": [ insertList ]};
                    }
                  };
            addNodesToSaveQueue.traveller.codeBlock = codeBlock.toString().slice(6);

            var buildGraph = new atRoot.AtNode();
            buildGraph.id        = "createGraph.buildGraph"; //awesome :)
            namespace(buildGraph, "traveller");
                var codeBlock = 
                  () =>
                  { var nodeDefinitions = namespace(traveller, "traveller.createGraph.nodeDefinitions", null, true) || [];
                    var graph;
                    var updateList = [];

                    nodeDefinitions.forEach
                    ( (nodeDefinition) =>
                      { graph = namespace(traveller, "traveller.createGraph.results.graph");
                        //there must be things in here since because :) namespaces are awesome :)
                        var name = nodeDefinition.name;
                        var node = graph[name] = traveller.results.atRoot[name];
                        for (var key in nodeDefinition)
                        { namespace(node, key, ["leafNode:"], nodeDefinition[key]);
                        }                        
                      }
                    );
                    for (var name in graph)
                    { node = graph[name];
                      //loop through nodes and set their "exit" to the id's of the newly saved nodes.
                      if (namespace(node, "traveller.exit", null, true) )
                      { node.traveller.exit = graph[node.traveller.exit].id;
                      }
                      traveller.atStore["createGraph.savedNodes."+name] = {"update": [ {"id":node.id}, node ]};

                      //store all the node addresses in this graph in every node, so that they can access each other.
                      // TODO this needs to change so that there is one "graph" node in the store, which has
                      //      has this data in it, and each node on the graph references that "graph" node
                      //      from which they can all look up each other's addresses
                      var addressGraph = namespace(node, "graph");
                      for (var name2 in graph)
                      { addressGraph[name2] = graph[name2].id;
                      }
                    }

                    ls("\n\n\n", "createGraph.buildGraph: results:", graph);
                  };
            buildGraph.traveller.codeBlock = codeBlock.toString().slice(6);

            var runInits = new atRoot.AtNode();
            runInits.id  = "createGraph.runInits";
            namespace(runInits, "traveller");
                var codeBlock =
                  () =>
                  { var graph = traveller.traveller.createGraph.results.graph;

                    for (var name in graph)
                    { var node = context = graph[name];
                      if (node.hasOwnProperty("init") )
                      { eval(node.init);
                      }
                      traveller.atStore["createGraph.initNodes."+name] = {"update": [ {"id":node.id}, node ]};
                    }

                    traveller.traveller.suggestedExit = "commitChanges";
                  };
            runInits.traveller.codeBlock = codeBlock.toString().slice(6);

            // 2.
            //link the two nodes into a graph, using namedNodes
            createGraph.traveller.exit          = "createGraph.addNodesToSaveQueue";
            addNodesToSaveQueue.traveller.exit  = "createGraph.buildGraph";
            buildGraph.traveller.exit           = "createGraph.runInits";


            //Once the nodes are saved, we can use the nodeDefinitions to build the graph, by attaching branches using the node id's
            //  We hard code the ID's (i.e. namedNodes) of THESE nodes, because they are the ones we need to build graphs, which we can then namespace automaticeasily

            // 3.
            // Make some Nodes with this stuff
            namespace(traveller, "traveller.createGraph");
            traveller.traveller.createGraph.nodeDefinitions =
            [ { "name"                : "start",
                "traveller.exit"      : "printer",
              },
              { "name"                : "printer",
                "traveller.codeBlock" : "ls('createGraph: printer: ', traveller.test.x); traveller.test.createGraphPrinterRan = true;",
                "traveller.exit"      : "end",
              },
              { "name": "end",
              },
            ];
            
            // 4.
            // at the same time as we install the callback, also save the two nodes we have just made above, into the atStore, so we can traverse to them
            //  using suggestedExit, as below :) #namedNodes #12
            traveller.atStore.bootstrapGraphBuilder = { "insert": [ [ createGraph, addNodesToSaveQueue, buildGraph, runInits ] ]};

            // 5.
            //configre the mocha callback
            namespace(traveller, "traveller.mocha");
            traveller.traveller.mocha.done = done;
            traveller.traveller.mocha.assertConditions = 
            { "createGraph.threeNodesCreated" :
                ` message   = Object.keys(traveller.traveller.createGraph.results.graph);
                  pass      = namespace.contains(traveller, "traveller.createGraph.results.graph", ["start", "printer", "end"]);
                `,
            }
            
            //6.
            //exit onto "createGraph" our new node, when the callback is installed (this is gaffy, but will do for now)
            traveller.traveller.suggestedExit = "createGraph";
            //7.
            atRoot.traverse(traveller, addTestCallback);
          }
        );
      }
    );

    describe
    ( "\n\n\n\nrun traveller over createGraph's graph :) :)",
      function()
      { it
        ( "should print createGraph: printer: 2",
          function(done)
          { traveller.traveller.suggestedExit = traveller.traveller.createGraph.results.graph.start.id;
            
            namespace(traveller, "traveller.mocha");
            traveller.traveller.mocha.assertConditions = 
            { "ranOverTestGraph": "pass = traveller.test.createGraphPrinterRan == true"
            };

            traveller.traveller.mocha.done = done;
            atRoot.traverse(traveller, addTestCallback);            
          }
        );
      }
    );
  
    describe
    ( "\n\n\n\ncreate one to ten counter",
      function()
      { it
        ( "should log counting to 0 to 9 ten then complete",
          function(done)
          { namespace(traveller, "traveller.createGraph");

            traveller.traveller.createGraph.nodeDefinitions =
            [ { "name"                : "start",
                "traveller.codeBlock" : "namespace(traveller, 'traveller.countToTen.counter', ['leafNode:'] , 0);",
                "traveller.exit"      : "printer",
              },
              { "name"                : "printer",
                "traveller.codeBlock" : "ls('countToTen: printer: ', traveller.traveller.countToTen.counter);",
                "traveller.exit"      : "condition",
              },
              { "name"                : "condition",
                "init"                : "namespace(context, 'traveller.exitBranches', ['leafNode:'], {'__default': graph.adder.id, 'ifTrue': graph.exit.id} );",
                "traveller.codeBlock" : "if (traveller.traveller.countToTen.counter == 9) traveller.traveller.suggestedExit = context.traveller.exitBranches.ifTrue;",
                "traveller.exit"      : "adder",
              },
              { "name"                : "adder",
                "traveller.codeBlock" : "traveller.traveller.countToTen.counter ++;",
                "traveller.exit"      : "printer",
              },
              { "name"                : "exit",
              },
            ];

            traveller.traveller.callback = 
                (traveller) =>
                { traveller.traveller.suggestedExit = traveller.traveller.createGraph.results.graph.start.id;

                  namespace(traveller, "traveller.mocha");
                  traveller.traveller.mocha.assertConditions = 
                      { "ranOverOneToTenGraph": "pass = traveller.traveller.countToTen.counter == 9",
                      };

                  traveller.traveller.mocha.done = done;
                  atRoot.traverse(traveller, addTestCallback);

                };
            
            traveller.traveller.suggestedExit = "createGraph";
            atRoot.traverse(traveller, {});
          }
        );
      }
    );
  }
);

describe
( "\n\n\ngit compatible datastore",
  () =>
  {
    describe
    ( "\n\n\n\n make suggestedExit a queue",
      function()
      { it
        ( "should recursively add from one to ten",
          function(done)
          { namespace(traveller, "traveller.createGraph");

            traveller.traveller.createGraph.nodeDefinitions =
            [ { "name"                : "start",
                "traveller.codeBlock" : 
                    ( () =>
                      { namespace(traveller, "test.suggestedExitRecursive").counter = 0;
                      }
                    ).toString().slice(6),
                "traveller.exit"      : "printer",
              },
              { "name"                : "printer",
                "traveller.codeBlock" :
                    ( () =>
                      { ls('suggestedExitRecursive: printer: ', traveller.test.suggestedExitRecursive.counter);
                      } 
                    ).toString().slice(6),
                "traveller.exit"      : "condition",
              },
              { "name"                : "condition",
                "init"                :
                    ( () =>
                      { namespace(context, 'traveller.exitBranches', ['leafNode:'], {'__default': graph.recursiveAdder.id, 'ifTrue': graph.exit.id} );
                      } 
                    ).toString().slice(6),
                "traveller.codeBlock" :
                    ( () =>
                      { if (traveller.traveller.countToTen.counter == 9) traveller.traveller.suggestedExit = context.traveller.exitBranches.ifTrue;
                      } 
                    ).toString().slice(6),
                "traveller.exit"      : "adder",
              },
              { "name"                : "recursiveAdder",
                "init"                : 
                    ( () =>
                      { namespace(context, "traveller.exitBranches");
                      	context.traveller.exitBranches = {'__default': graph.printer.id, 'printer': graph.printer.id};
                      } 
                    ).toString().slice(6),
                "traveller.codeBlock" : 
                    ( () =>
                      { if (traveller.test.suggestedExitRecursive.counter == 0) 
                          for (var i=1; i<10; i++) 
                            namespace(traveller, 'traveller.suggestedExitQueue', ['leafNode:'], []).unshift(traveller.exitBranches.printer),
                        traveller.test.suggestedExitRecursive.counter ++;
                      } 
                    ).toString().slice(6),
                "traveller.exit"      : "",
              },
              { "name"                : "error",
                "traveller.codeBlock" : "namespace(traveller, 'traveller.test.suggestedExitRecursive.error') = { 'message': 'should never reach this node, since condition should route us away before we get here' };",
                "traveller.exit"      : "exit",
              },
              { "name"                : "exit",
              },
            ];

            traveller.traveller.callback = 
                (traveller) =>
                { traveller.traveller.suggestedExit = traveller.traveller.createGraph.results.graph.start.id;

                  namespace(traveller, "traveller.mocha");
                  traveller.traveller.mocha.assertConditions = 
                      { "recursiveAdderNoError": 
                          ` message   = namespace(traveller, "test.suggestedExitRecursive.error.message", null, true) || "No Error";
                            pass      = namespace.contains(traveller, "test.suggestedExitRecursive", ["error"] );
                          `,
                        "recursiveAdderCountsTo9": 
                          ` message   = namespace(traveller, "test.suggestedExitRecursive.counter", null, true );
                            pass      = namespace(traveller, "test.suggestedExitRecursive.counter", null, true ) == 9;
                          `,
                      };

                  traveller.traveller.mocha.done = done;
                  atRoot.traverse(traveller, addTestCallback);

                };
            
            traveller.traveller.suggestedExit = "createGraph";
            atRoot.traverse(traveller, {});
          }
        );
      }
    );
  }
);

describe
  ( "\n\n\n\nDESTROY THE AT COLLECTION DO NOT DO THIS",
    function()
    { it
      ( "DETROY",
        function(done)
        { atStore.drop().then( () => done() );


        }
      );
    }
  );

describe
  ( "\n\n\n\nCheck the DB is empty",
    function()
    { it
      ( "should find a length of 0 documents in the database",
        function(done)
        { var monkTraveller = {"atStore": { "checkEmptyDB": {"find":[{}]} } };

          namespace(monkTraveller, "traveller.callback");
          monkTraveller.traveller.callback = 
            function(completedTraveller)
            { ls("\n\n\n\ntestResults");
              ls("traveller:\n  ", completedTraveller);
              
              ls("completedTraveller.results.atStore.checkEmptyDB.length", completedTraveller.results.atStore.checkEmptyDB.length);
              assert
              (   completedTraveller.results.atStore.checkEmptyDB.length == 0
              );

              done();
            };

          atRoot.traverse(monkTraveller, {});
        }
      );
    }
  );
