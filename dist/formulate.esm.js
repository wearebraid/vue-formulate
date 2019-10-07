import isPlainObject from 'is-plain-object';
import nanoid from 'nanoid';

var library = {
  // === SINGLE LINE TEXT STYLE INPUTS
  text: {
    classification: 'text',
    component: 'FormulateInputText'
  },
  email: {
    classification: 'text',
    component: 'FormulateInputText'
  },
  number: {
    classification: 'text',
    component: 'FormulateInputText'
  },
  color: {
    classification: 'text',
    component: 'FormulateInputText'
  },
  date: {
    classification: 'text',
    component: 'FormulateInputText'
  },
  hidden: {
    classification: 'text',
    component: 'FormulateInputText'
  },
  month: {
    classification: 'text',
    component: 'FormulateInputText'
  },
  password: {
    classification: 'text',
    component: 'FormulateInputText'
  },
  range: {
    classification: 'text',
    component: 'FormulateInputText'
  },
  search: {
    classification: 'text',
    component: 'FormulateInputText'
  },
  tel: {
    classification: 'text',
    component: 'FormulateInputText'
  },
  time: {
    classification: 'text',
    component: 'FormulateInputText'
  },
  url: {
    classification: 'text',
    component: 'FormulateInputText'
  },
  week: {
    classification: 'text',
    component: 'FormulateInputText'
  },
  'datetime-local': {
    classification: 'text',
    component: 'FormulateInputText'
  },

  // === MULTI LINE TEXT INPUTS
  textarea: {
    classification: 'textarea',
    component: 'FormulateInputTextArea'
  },

  // === BOX STYLE INPUTS
  checkbox: {
    classification: 'box',
    component: 'FormulateInputBox'
  },
  radio: {
    classification: 'box',
    component: 'FormulateInputBox'
  },

  // === BUTTON STYLE INPUTS
  submit: {
    classification: 'button',
    component: 'FormulateInputButton'
  },
  button: {
    classification: 'button',
    component: 'FormulateInputButton'
  },

  // === SELECT STYLE INPUTS
  select: {
    classification: 'select',
    component: 'FormulateInputSelect'
  }
};

/**
 * Function to map over an object.
 * @param {Object} obj An object to map over
 * @param {Function} callback
 */
function map (original, callback) {
  var obj = {};
  for (var key in original) {
    obj[key] = callback(key, original[key]);
  }
  return obj
}

/**
 * Function to reduce an object's properties
 * @param {Object} original
 * @param {Function} callback
 * @param {*} accumulator
 */
function reduce (original, callback, accumulator) {
  for (var key in original) {
    accumulator = callback(accumulator, key, original[key]);
  }
  return accumulator
}

/**
 * For a single instance of an input, export all of the context needed to fully
 * render that element.
 * @return {object}
 */
function context () {
  return defineModel.call(this, Object.assign({
    type: this.type,
    value: this.value,
    classification: this.classification,
    component: this.component,
    id: this.id,
    label: this.label,
    labelPosition: labelPosition.call(this),
    attributes: attributeReducer.call(this, this.$attrs)
  }, typeContext.call(this)))
}

/**
 * Given (this.type), return an object to merge with the context
 * @return {object}
 */
function typeContext () {
  switch (this.classification) {
    case 'select':
      return {
        options: createOptionList(this.options),
        optionGroups: this.optionGroups ? map(this.optionGroups, function (k, v) { return createOptionList(v); }) : false,
        placeholder: this.$attrs.placeholder || false
      }
    case 'group':
      if (this.options) {
        return {
          options: createOptionList(this.options),
          component: 'FormulateInputGroup'
        }
      }
      break
    default:
      return {}
  }
}

/**
 * Reducer for attributes that will be applied to each core input element.
 * @return {object}
 */
function attributeReducer (attributes) {
  if ( attributes === void 0 ) attributes = {};

  if (this.id) {
    attributes.id = this.id;
  }
  return attributes
}

/**
 * Determine the a best-guess location for the label (before or after).
 * @return {string} before|after
 */
function labelPosition () {
  if (this.labelPosition) {
    return this.labelPosition
  }
  switch (this.classification) {
    case 'box':
      return 'after'
    default:
      return 'before'
  }
}

/**
 * Given an object or array of options, create an array of objects with label,
 * value, and id.
 * @param {array|object}
 * @return {array}
 */
function createOptionList (options) {
  if (!Array.isArray(options)) {
    return reduce(options, function (options, value, label) { return options.concat({ value: value, label: label, id: nanoid(15) }); }, [])
  } else if (Array.isArray(options) && !options.length) {
    return [{ value: this.name, label: (this.label || this.name), id: nanoid(15) }]
  }
  return options
}

/**
 * Create a getter/setter model factory
 * @return object
 */
function defineModel (context) {
  return Object.defineProperty(context, 'model', {
    get: modelGetter.bind(this),
    set: modelSetter.bind(this)
  })
}

/**
 * Get the value from a model.
 **/
function modelGetter () {
  if (this.type === 'checkbox' && !Array.isArray(this.formulateValue) && this.options) {
    return []
  }
  if (this.formulateValue === false) {
    return ''
  }
  return this.formulateValue
}

/**
 * Set the value from a model.
 **/
function modelSetter (value) {
  this.$emit('input', value);
}

//

var script = {
  name: 'FormulateInput',
  inheritAttrs: false,
  model: {
    prop: 'formulateValue',
    event: 'input'
  },
  props: {
    type: {
      type: String,
      default: 'text'
    },
    formulateValue: {
      type: [String, Number, Object, Boolean, Array],
      default: false
    },
    value: {
      type: [String, Number, Object, Boolean, Array],
      default: false
    },
    options: {
      type: [Object, Array, Boolean],
      default: false
    },
    optionGroups: {
      type: [Object, Boolean],
      default: false
    },
    id: {
      type: [String, Boolean, Number],
      default: function () { return nanoid(9); }
    },
    label: {
      type: [String, Boolean],
      default: false
    },
    labelPosition: {
      type: [String, Boolean],
      default: false
    },
    help: {
      type: [String, Boolean],
      default: false
    }
  },
  computed: {
    context: context,
    classification: function classification () {
      var classification = this.$formulate.classify(this.type);
      return (classification === 'box' && this.options) ? 'group' : classification
    },
    component: function component () {
      return this.$formulate.component(this.type)
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "formulate-input",
      attrs: {
        "data-classification": _vm.classification,
        "data-type": _vm.type
      }
    },
    [
      _c(
        "div",
        { staticClass: "formulate-input-wrapper" },
        [
          _vm.context.label && _vm.context.labelPosition === "before"
            ? _vm._t(
                "label",
                [
                  _c("label", {
                    staticClass:
                      "formulate-input-label formulate-input-label--before",
                    attrs: { for: _vm.id },
                    domProps: { textContent: _vm._s(_vm.context.label) }
                  })
                ],
                null,
                _vm.context
              )
            : _vm._e(),
          _vm._v(" "),
          _vm._t(
            "default",
            [
              _c(_vm.context.component, {
                tag: "component",
                attrs: { context: _vm.context }
              })
            ],
            null,
            _vm.context
          ),
          _vm._v(" "),
          _vm.context.label && _vm.context.labelPosition === "after"
            ? _vm._t(
                "label",
                [
                  _c("label", {
                    staticClass:
                      "formulate-input-label formulate-input-label--after",
                    attrs: { for: _vm.id },
                    domProps: { textContent: _vm._s(_vm.context.label) }
                  })
                ],
                null,
                _vm.context.label
              )
            : _vm._e()
        ],
        2
      ),
      _vm._v(" "),
      _vm.help
        ? _c("div", {
            staticClass: "formulate-input-help",
            domProps: { textContent: _vm._s(_vm.help) }
          })
        : _vm._e()
    ]
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var FormulateInput = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

/* script */

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("form", [_vm._t("default")], 2)
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  var __vue_inject_styles__$1 = undefined;
  /* scoped */
  var __vue_scope_id__$1 = undefined;
  /* module identifier */
  var __vue_module_identifier__$1 = undefined;
  /* functional template */
  var __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var FormulateForm = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    {},
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//
//

function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
var script$1 = {
  name: 'FormulateInputGroup',
  props: {
    context: {
      type: Object,
      required: true
    }
  },
  computed: {
    options: function options () {
      return this.context.options || []
    },
    optionsWithContext: function optionsWithContext () {
      var this$1 = this;

      var ref = this.context;
      var options = ref.options;
      var labelPosition = ref.labelPosition;
      var attributes = ref.attributes;
      var rest = objectWithoutProperties( ref, ["options", "labelPosition", "attributes"] );
      var context = rest;
      return this.options.map(function (option) { return this$1.groupItemContext(context, option); })
    }
  },
  methods: {
    groupItemContext: function groupItemContext () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return Object.assign.apply(Object, [ {} ].concat( args, [{
        component: 'FormulateInput'
      }] ))
    }
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "formulate-input-group" },
    _vm._l(_vm.optionsWithContext, function(optionContext) {
      return _c(
        optionContext.component,
        _vm._b(
          {
            key: optionContext.id,
            tag: "component",
            staticClass: "formulate-input-group-item",
            model: {
              value: _vm.context.model,
              callback: function($$v) {
                _vm.$set(_vm.context, "model", $$v);
              },
              expression: "context.model"
            }
          },
          "component",
          optionContext,
          false
        )
      )
    }),
    1
  )
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  var __vue_inject_styles__$2 = undefined;
  /* scoped */
  var __vue_scope_id__$2 = undefined;
  /* module identifier */
  var __vue_module_identifier__$2 = undefined;
  /* functional template */
  var __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var FormulateInputGroup = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$1,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

/**
 * Default base for input components.
 */
var FormulateInputMixin = {
  props: {
    context: {
      type: Object,
      required: true
    }
  },
  computed: {
    type: function type () {
      return this.context.type
    },
    id: function id () {
      return this.context.id
    },
    attributes: function attributes () {
      return this.context.attributes || {}
    },
    hasValue: function hasValue () {
      return !!this.context.model
    }
  }
};

//

var script$2 = {
  name: 'FormulateInputBox',
  mixins: [FormulateInputMixin]
};

/* script */
var __vue_script__$2 = script$2;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "formulate-input-element formulate-input-element--box",
      attrs: { "data-type": _vm.context.type }
    },
    [
      _vm.type === "checkbox"
        ? _c(
            "input",
            _vm._b(
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.context.model,
                    expression: "context.model"
                  }
                ],
                attrs: { type: "checkbox" },
                domProps: {
                  value: _vm.context.value,
                  checked: Array.isArray(_vm.context.model)
                    ? _vm._i(_vm.context.model, _vm.context.value) > -1
                    : _vm.context.model
                },
                on: {
                  change: function($event) {
                    var $$a = _vm.context.model,
                      $$el = $event.target,
                      $$c = $$el.checked ? true : false;
                    if (Array.isArray($$a)) {
                      var $$v = _vm.context.value,
                        $$i = _vm._i($$a, $$v);
                      if ($$el.checked) {
                        $$i < 0 &&
                          _vm.$set(_vm.context, "model", $$a.concat([$$v]));
                      } else {
                        $$i > -1 &&
                          _vm.$set(
                            _vm.context,
                            "model",
                            $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                          );
                      }
                    } else {
                      _vm.$set(_vm.context, "model", $$c);
                    }
                  }
                }
              },
              "input",
              _vm.attributes,
              false
            )
          )
        : _vm.type === "radio"
        ? _c(
            "input",
            _vm._b(
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.context.model,
                    expression: "context.model"
                  }
                ],
                attrs: { type: "radio" },
                domProps: {
                  value: _vm.context.value,
                  checked: _vm._q(_vm.context.model, _vm.context.value)
                },
                on: {
                  change: function($event) {
                    return _vm.$set(_vm.context, "model", _vm.context.value)
                  }
                }
              },
              "input",
              _vm.attributes,
              false
            )
          )
        : _c(
            "input",
            _vm._b(
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.context.model,
                    expression: "context.model"
                  }
                ],
                attrs: { type: _vm.type },
                domProps: {
                  value: _vm.context.value,
                  value: _vm.context.model
                },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.context, "model", $event.target.value);
                  }
                }
              },
              "input",
              _vm.attributes,
              false
            )
          ),
      _vm._v(" "),
      _c("label", {
        staticClass: "formulate-input-element-decorator",
        attrs: { for: _vm.id }
      })
    ]
  )
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  var __vue_inject_styles__$3 = undefined;
  /* scoped */
  var __vue_scope_id__$3 = undefined;
  /* module identifier */
  var __vue_module_identifier__$3 = undefined;
  /* functional template */
  var __vue_is_functional_template__$3 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var FormulateInputBox = normalizeComponent_1(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$2,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    undefined,
    undefined
  );

//

var script$3 = {
  name: 'FormulateInputText',
  mixins: [FormulateInputMixin]
};

/* script */
var __vue_script__$3 = script$3;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "formulate-input-element formulate-input-element--textarea"
    },
    [
      _vm.type === "checkbox"
        ? _c(
            "input",
            _vm._b(
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.context.model,
                    expression: "context.model"
                  }
                ],
                attrs: { type: "checkbox" },
                domProps: {
                  checked: Array.isArray(_vm.context.model)
                    ? _vm._i(_vm.context.model, null) > -1
                    : _vm.context.model
                },
                on: {
                  change: function($event) {
                    var $$a = _vm.context.model,
                      $$el = $event.target,
                      $$c = $$el.checked ? true : false;
                    if (Array.isArray($$a)) {
                      var $$v = null,
                        $$i = _vm._i($$a, $$v);
                      if ($$el.checked) {
                        $$i < 0 &&
                          _vm.$set(_vm.context, "model", $$a.concat([$$v]));
                      } else {
                        $$i > -1 &&
                          _vm.$set(
                            _vm.context,
                            "model",
                            $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                          );
                      }
                    } else {
                      _vm.$set(_vm.context, "model", $$c);
                    }
                  }
                }
              },
              "input",
              _vm.attributes,
              false
            )
          )
        : _vm.type === "radio"
        ? _c(
            "input",
            _vm._b(
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.context.model,
                    expression: "context.model"
                  }
                ],
                attrs: { type: "radio" },
                domProps: { checked: _vm._q(_vm.context.model, null) },
                on: {
                  change: function($event) {
                    return _vm.$set(_vm.context, "model", null)
                  }
                }
              },
              "input",
              _vm.attributes,
              false
            )
          )
        : _c(
            "input",
            _vm._b(
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.context.model,
                    expression: "context.model"
                  }
                ],
                attrs: { type: _vm.type },
                domProps: { value: _vm.context.model },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.context, "model", $event.target.value);
                  }
                }
              },
              "input",
              _vm.attributes,
              false
            )
          )
    ]
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  var __vue_inject_styles__$4 = undefined;
  /* scoped */
  var __vue_scope_id__$4 = undefined;
  /* module identifier */
  var __vue_module_identifier__$4 = undefined;
  /* functional template */
  var __vue_is_functional_template__$4 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var FormulateInputText = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$3,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    undefined,
    undefined
  );

//

var script$4 = {
  name: 'FormulateInputSelect',
  mixins: [FormulateInputMixin],
  computed: {
    options: function options () {
      return this.context.options || {}
    },
    optionGroups: function optionGroups () {
      return this.context.optionGroups || false
    },
    placeholderSelected: function placeholderSelected () {
      return !!(!this.hasValue && this.context.attributes.placeholder)
    }
  }
};

/* script */
var __vue_script__$4 = script$4;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "formulate-input-element formulate-input-element--select" },
    [
      _c(
        "select",
        _vm._b(
          {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.context.model,
                expression: "context.model"
              }
            ],
            attrs: { "data-placeholder-selected": _vm.placeholderSelected },
            on: {
              change: function($event) {
                var $$selectedVal = Array.prototype.filter
                  .call($event.target.options, function(o) {
                    return o.selected
                  })
                  .map(function(o) {
                    var val = "_value" in o ? o._value : o.value;
                    return val
                  });
                _vm.$set(
                  _vm.context,
                  "model",
                  $event.target.multiple ? $$selectedVal : $$selectedVal[0]
                );
              }
            }
          },
          "select",
          _vm.attributes,
          false
        ),
        [
          _vm.context.placeholder
            ? _c(
                "option",
                {
                  attrs: { value: "", disabled: "" },
                  domProps: { selected: !_vm.hasValue }
                },
                [
                  _vm._v(
                    "\n      " + _vm._s(_vm.context.placeholder) + "\n    "
                  )
                ]
              )
            : _vm._e(),
          _vm._v(" "),
          !_vm.optionGroups
            ? _vm._l(_vm.options, function(option) {
                return _c(
                  "option",
                  _vm._b(
                    {
                      key: option.id,
                      domProps: {
                        value: option.value,
                        textContent: _vm._s(option.label)
                      }
                    },
                    "option",
                    option.attributes || {},
                    false
                  )
                )
              })
            : _vm._l(_vm.optionGroups, function(subOptions, label) {
                return _c(
                  "optgroup",
                  { key: label, attrs: { label: label } },
                  _vm._l(subOptions, function(option) {
                    return _c(
                      "option",
                      _vm._b(
                        {
                          key: option.id,
                          domProps: {
                            value: option.value,
                            textContent: _vm._s(option.label)
                          }
                        },
                        "option",
                        option.attributes || {},
                        false
                      )
                    )
                  }),
                  0
                )
              })
        ],
        2
      )
    ]
  )
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  var __vue_inject_styles__$5 = undefined;
  /* scoped */
  var __vue_scope_id__$5 = undefined;
  /* module identifier */
  var __vue_module_identifier__$5 = undefined;
  /* functional template */
  var __vue_is_functional_template__$5 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var FormulateInputSelect = normalizeComponent_1(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$4,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    undefined,
    undefined
  );

//

var script$5 = {
  name: 'FormulateInputTextArea',
  mixins: [FormulateInputMixin]
};

/* script */
var __vue_script__$5 = script$5;

/* template */
var __vue_render__$6 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "formulate-input-element formulate-input-element--textarea"
    },
    [
      _c(
        "textarea",
        _vm._b(
          {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.context.model,
                expression: "context.model"
              }
            ],
            domProps: { value: _vm.context.model },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.context, "model", $event.target.value);
              }
            }
          },
          "textarea",
          _vm.attributes,
          false
        )
      )
    ]
  )
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

  /* style */
  var __vue_inject_styles__$6 = undefined;
  /* scoped */
  var __vue_scope_id__$6 = undefined;
  /* module identifier */
  var __vue_module_identifier__$6 = undefined;
  /* functional template */
  var __vue_is_functional_template__$6 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var FormulateInputTextArea = normalizeComponent_1(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$5,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    undefined,
    undefined
  );

/**
 * The base formulate library.
 */
var Formulate = function Formulate () {
  this.defaults = {
    components: {
      FormulateForm: FormulateForm,
      FormulateInput: FormulateInput,
      FormulateInputBox: FormulateInputBox,
      FormulateInputText: FormulateInputText,
      FormulateInputGroup: FormulateInputGroup,
      FormulateInputSelect: FormulateInputSelect,
      FormulateInputTextArea: FormulateInputTextArea
    },
    library: library
  };
};

/**
 * Install vue formulate, and register it’s components.
 */
Formulate.prototype.install = function install (Vue, options) {
  Vue.prototype.$formulate = this;
  this.options = this.extend(this.defaults, options || {});
  for (var componentName in this.options.components) {
    Vue.component(componentName, this.options.components[componentName]);
  }
};

/**
 * Create a new object by copying properties of base and extendWith.
 * @param {Object} base
 * @param {Object} extendWith
 */
Formulate.prototype.extend = function extend (base, extendWith) {
  var merged = {};
  for (var key in base) {
    if (extendWith.hasOwnProperty(key)) {
      merged[key] = isPlainObject(extendWith[key]) && isPlainObject(base[key])
        ? this.extend(base[key], extendWith[key])
        : extendWith[key];
    } else {
      merged[key] = base[key];
    }
  }
  for (var prop in extendWith) {
    if (!merged.hasOwnProperty(prop)) {
      merged[prop] = extendWith[prop];
    }
  }
  return merged
};

/**
 * Determine what "class" of input this element is given the "type".
 * @param {string} type
 */
Formulate.prototype.classify = function classify (type) {
  if (this.options.library.hasOwnProperty(type)) {
    return this.options.library[type].classification
  }
  return 'unknown'
};

/**
 * Determine what type of component to render given the "type".
 * @param {string} type
 */
Formulate.prototype.component = function component (type) {
  if (this.options.library.hasOwnProperty(type)) {
    return this.options.library[type].component
  }
  return false
};

var Formulate$1 = new Formulate();

export default Formulate$1;
