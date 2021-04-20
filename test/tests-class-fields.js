if (typeof exports != "undefined") {
  var test = require("./driver.js").test
  var testFail = require("./driver.js").testFail
  var acorn = require("../acorn");
  var newNode = (start, props) => Object.assign(new acorn.Node({options: {}}, start), props)
}


test(`class P extends Q {
  x = await super.x
}`, {}, {ecmaVersion: 12, allowAwaitOutsideFunction: true})

test(`class Counter extends HTMLElement {
  x = 0;

  clicked() {
    this.x++;
  }

  render() {
    return this.x.toString();
  }
}`, {}, {ecmaVersion: 12})

test(`
  class AsyncIterPipe{
    static get [ Symbol.species](){
      return Promise
    }
    static get Closing(){
      return Closing
    }
    static get controllerSignals(){ return controllerSignals}
    static get listenerBinding(){ return listenerBinding}

    // state
    done= false
  }
`, {}, {ecmaVersion: 12})

test(`
  class Class {
    value = getValue();
  }
`, {}, {ecmaVersion: 12})

test(`class Counter extends HTMLElement {
  #x = 0;

  clicked() {
    this.#x++;
  }

  render() {
    return this.#x.toString();
  }
}`, {}, {ecmaVersion: 12})
test("class A { a = this.#a; #a = 4 }", {}, {ecmaVersion: 12})

test("class A { 5 = 5; #5 = 5 }", {}, {ecmaVersion: 12})
test("class A { delete = 5; #delete = 5 }", {}, {ecmaVersion: 12})

testFail("class A { #a; f() { delete this.#a } }", "Private elements may not be deleted (1:20)", {ecmaVersion: 12})
testFail("class A { #a; #a }", "Duplicate private element (1:14)", {ecmaVersion: 12})
testFail("class A { a = this.#a }", "Usage of undeclared private name (1:19)", {ecmaVersion: 12})
testFail("class A { a = this.#a; b = this.#b }", "Usage of undeclared private name (1:19)", {ecmaVersion: 12})
testFail("class A { constructor = 4 }", "Classes may not have a field called constructor (1:10)", {ecmaVersion: 12})
testFail("class A { #constructor = 4 }", "Classes may not have a private element named constructor (1:10)", {ecmaVersion: 12})
testFail("class A { a = () => arguments }", "A class field initializer may not contain arguments (1:20)", {ecmaVersion: 12})
testFail("class A { a = () => super() }", "super() call outside constructor of a subclass (1:20)", {ecmaVersion: 12})
testFail("class A { # a }", "Unexpected token (1:10)", {ecmaVersion: 12})
testFail("class A { #a; a() { this.# a } }", "Unexpected token (1:27)", {ecmaVersion: 12})

const classes = [
  { text: "class A { %s }", ast: getBody => {
    const body = getBody(10)
    return newNode(0, { type: "Program", end: body.end + 2, body: [
      newNode(0, {
        type: "ClassDeclaration",
        end: body.end + 2,
        id: newNode(6, {
          type: "Identifier",
          end: 7,
          name: "A"
        }),
        superClass: null,
        body: newNode(8, {
          type: "ClassBody",
          end: body.end + 2,
          body: [body]
        })
      })
    ]})
  } },
  { text: "class A { %s; }", ast: getBody => {
    const body = getBody(10)
    return newNode(0, { type: "Program", end: body.end + 3, body: [
      newNode(0, {
        type: "ClassDeclaration",
        end: body.end + 3,
        id: newNode(6, {
          type: "Identifier",
          end: 7,
          name: "A"
        }),
        superClass: null,
        body: newNode(8, {
          type: "ClassBody",
          end: body.end + 3,
          body: [body]
        })
      })
    ]})
  } },
  { text: "class A { %s; #y }", ast: getBody => {
    const body = getBody(10)
    return newNode(0, { type: "Program", end: body.end + 6, body: [
      newNode(0, {
        type: "ClassDeclaration",
        end: body.end + 6,
        id: newNode(6, {
          type: "Identifier",
          end: 7,
          name: "A"
        }),
        superClass: null,
        body: newNode(8, {
          type: "ClassBody",
          end: body.end + 6,
          body: [body, newNode(body.end + 2, {
            type: "PropertyDefinition",
            end: body.end + 4,
            key: newNode(body.end + 2, {
              type: "PrivateIdentifier",
              end: body.end + 4,
              name: "y"
            }),
            value: null,
            computed: false
          }) ]
        })
      })
    ]})
  } },
  { text: "class A { %s;a() {} }", ast: getBody => {
    const body = getBody(10)
    return newNode(0, { type: "Program", end: body.end + 9, body: [
      newNode(0, {
        type: "ClassDeclaration",
        end: body.end + 9,
        id: newNode(6, {
          type: "Identifier",
          end: 7,
          name: "A"
        }),
        superClass: null,
        body: newNode(8, {
          type: "ClassBody",
          end: body.end + 9,
          body: [ body, newNode(body.end + 1, {
            type: "MethodDefinition",
            end: body.end + 7,
            kind: "method",
            static: false,
            computed: false,
            key: newNode(body.end + 1, {
              type: "Identifier",
              end: body.end + 2,
              name: "a"
            }),
            value: newNode(body.end + 2, {
              type: "FunctionExpression",
              end: body.end + 7,
              id: null,
              generator: false,
              expression: false,
              async: false,
              params: [],
              body: newNode(body.end + 5, {
                type: "BlockStatement",
                end: body.end + 7,
                body: []
              })
            })
          }) ]
        })
      })
    ]})
  } },
  { text: "class A { %s\na() {} }", ast: getBody => {
    const body = getBody(10)
    return newNode(0, { type: "Program", end: body.end + 9, body: [
      newNode(0, {
        type: "ClassDeclaration",
        end: body.end + 9,
        id: newNode(6, {
          type: "Identifier",
          end: 7,
          name: "A"
        }),
        superClass: null,
        body: newNode(8, {
          type: "ClassBody",
          end: body.end + 9,
          body: [
            body,
            newNode(body.end + 1, {
              type: "MethodDefinition",
              end: body.end + 7,
              kind: "method",
              static: false,
              computed: false,
              key: newNode(body.end + 1, {
                type: "Identifier",
                end: body.end + 2,
                name: "a"
              }),
              value: newNode(body.end + 2, {
                type: "FunctionExpression",
                end: body.end + 7,
                id: null,
                generator: false,
                expression: false,
                async: false,
                params: [],
                body: newNode(body.end + 5, {
                  type: "BlockStatement",
                  end: body.end + 7,
                  body: []
                })
              })
            })
          ]
        })
      })
    ]})
  } },
];

[
  { body: "x", passes: true, ast: start => newNode(start, {
    type: "PropertyDefinition",
    end: start + 1,
    key: newNode(start, {
      type: "Identifier",
      end: start + 1,
      name: "x"
    }),
    value: null,
    computed: false
  }) },
  { body: "x = 0", passes: true, ast: start => newNode(start, {
    type: "PropertyDefinition",
    end: start + 5,
    key: newNode(start, {
      type: "Identifier",
      end: start + 1,
      name: "x"
    }),
    value: newNode(start + 4, {
      type: "Literal",
      end: start + 5,
      value: 0,
      raw: "0"
    }),
    computed: false
  }) },
  { body: "[x]", passes: true, ast: start => newNode(start, {
    type: "PropertyDefinition",
    end: start + 3,
    computed: true,
    key: newNode(start + 1, {
      type: "Identifier",
      end: start + 2,
      name: "x"
    }),
    value: null
  }) },
  { body: "[x] = 0", passes: true, ast: start => newNode(start, {
    type: "PropertyDefinition",
    end: start + 7,
    computed: true,
    key: newNode(start + 1, {
      type: "Identifier",
      end: start + 2,
      name: "x"
    }),
    value: newNode(start + 6, {
      type: "Literal",
      end: start + 7,
      value: 0,
      raw: "0"
    })
  }) },
  { body: "#x", passes: true, ast: start => newNode(start, {
    type: "PropertyDefinition",
    end: start + 2,
    computed: false,
    key: newNode(start, {
      type: "PrivateIdentifier",
      end: start + 2,
      name: "x"
    }),
    value: null,
  }) },
  { body: "#x = 0", passes: true, ast: start => newNode(start, {
    type: "PropertyDefinition",
    end: start + 6,
    computed: false,
    key: newNode(start, {
      type: "PrivateIdentifier",
      end: start + 2,
      name: "x"
    }),
    value: newNode(start + 5, {
      type: "Literal",
      end: start + 6,
      value: 0,
      raw: "0"
    })
  }) },

  { body: "async", passes: true, ast: start => newNode(start, {
    type: "PropertyDefinition",
    end: start + 5,
    key: newNode(start, {
      type: "Identifier",
      end: start + 5,
      name: "async"
    }),
    value: null,
    computed: false
  }) },

  { body: "async = 5", passes: true, ast: start => newNode(start, {
    type: "PropertyDefinition",
    end: start + 9,
    key: newNode(start, {
      type: "Identifier",
      end: start + 5,
      name: "async"
    }),
    value: newNode(start + 8, {
      type: "Literal",
      end: start + 9,
      raw: "5",
      value: 5
    }),
    computed: false
  }) },
].forEach(bodyInput => {
  const body = bodyInput.body, passes = bodyInput.passes, bodyAst = bodyInput.ast
  classes.forEach(input => {
    const text = input.text, ast = input.ast;
    (passes ? test : testFail)(text.replace("%s", body), ast(bodyAst), {ecmaVersion: 12})
  })
})

testFail("class C { \\u0061sync m(){} };", "Unexpected token (1:21)", {ecmaVersion: 12})
test("class A extends B { constructor() { super() } }", {}, {ecmaVersion: 12})
test("var C = class { bre\\u0061k() { return 42; }}", {}, {ecmaVersion: 12})
test(`class X {
    x
    () {}
}`, {}, {ecmaVersion: 12})
test(`class X {
    static x
    () {}
}`, {}, {ecmaVersion: 12})
test(`class X {
    get
    y() {}
}`, {}, {ecmaVersion: 12})
test(`class X {
    static;
    async;
    y() {}
}`, {}, {ecmaVersion: 12})
