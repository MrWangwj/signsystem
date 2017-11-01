webpackJsonp([7],{

/***/ 157:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(178)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(180),
  /* template */
  __webpack_require__(181),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-ad3ac2c8",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/resources/assets/js/components/nav1/AddUser.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] AddUser.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ad3ac2c8", Component.options)
  } else {
    hotAPI.reload("data-v-ad3ac2c8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 178:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(179);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("2b260eab", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ad3ac2c8\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./AddUser.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ad3ac2c8\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./AddUser.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 179:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n.nameWidth[data-v-ad3ac2c8]{\n    width: 22%;\n}\n", ""]);

// exports


/***/ }),

/***/ 180:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
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

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {

        var checkId = function checkId(rule, value, callback) {
            if (!/^\d{10,11}$/.test(value)) {
                return callback(new Error('请输入正确的学号'));
            } else {
                callback();
            }
        };

        var checkTel = function checkTel(rule, value, callback) {
            if (!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value)) {
                return callback(new Error('请输入正确的手机号'));
            } else {
                callback();
            }
        };

        return {
            infoData: {
                groups: [],
                positions: []
            },
            form: {
                id: '',
                name: '',
                sex: '0',
                grouping: '',
                email: '',
                tel: '',
                position: []
            },
            rules: {
                id: [{ required: true, message: '请输入学号' }, { validator: checkId, message: '请输入正确的学号' }],
                name: [{ required: true, message: '请输入姓名' }, { min: 2, max: 4, message: '请输入正确的姓名' }],
                sex: [{ required: true, message: '请输选择性别' }],
                grouping: [{ required: true, message: '请选择分组' }],
                position: [{ type: 'array', required: true, message: '请选择职务' }],
                tel: [{ required: true, message: '请输入手机号' }, { validator: checkTel, message: '请输入正确的手机号' }],
                email: [{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入正确的邮箱' }]
            }

        };
    },

    methods: {
        onSubmit: function onSubmit(formName) {
            var _this = this;

            this.$refs[formName].validate(function (valid) {
                if (valid) {
                    _this.$loading();
                    var form = _this.form;

                    axios.post('/admin/user/add', {
                        id: form.id,
                        name: form.name,
                        sex: form.sex,
                        grouping_id: form.grouping,
                        positions: form.position,
                        tel: form.tel,
                        email: form.email
                    }).then(function (response) {
                        console.log(response.data);
                        _this.$loading().close();

                        var data = response.data;
                        if (parseInt(data.code) === 1) {
                            _this.$confirm('人员添加成功，是否继续添加？', '提示', {
                                confirmButtonText: '继续',
                                cancelButtonText: '返回',
                                type: 'info'
                            }).then(function () {
                                _this.$refs[formName].resetFields();
                            }).catch(function () {
                                _this.$router.push('/user/list');
                            });
                        } else {
                            _this.$message({
                                message: data.msg,
                                type: 'warning'
                            });
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        info: function info() {
            var _this2 = this;

            axios.get('/admin/user/add/info', {}).then(function (response) {
                var data = response.data;

                _this2.infoData.groups = data.groups;
                _this2.infoData.positions = data.positions;

                console.log(_this2.infoData.groups);
            }).catch(function (err) {
                console.log(err);
            });
        }
    },
    mounted: function mounted() {
        this.info();
    }
});

/***/ }),

/***/ 181:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('el-form', {
    ref: "form",
    attrs: {
      "rules": _vm.rules,
      "model": _vm.form,
      "label-width": "80px"
    }
  }, [_c('el-form-item', {
    attrs: {
      "label": "学号",
      "prop": "id"
    }
  }, [_c('el-input', {
    staticClass: "nameWidth",
    model: {
      value: (_vm.form.id),
      callback: function($$v) {
        _vm.form.id = _vm._n($$v)
      },
      expression: "form.id"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "姓名",
      "prop": "name"
    }
  }, [_c('el-input', {
    staticClass: "nameWidth",
    model: {
      value: (_vm.form.name),
      callback: function($$v) {
        _vm.form.name = $$v
      },
      expression: "form.name"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "性别",
      "prop": "sex"
    }
  }, [_c('el-radio-group', {
    model: {
      value: (_vm.form.sex),
      callback: function($$v) {
        _vm.form.sex = $$v
      },
      expression: "form.sex"
    }
  }, [_c('el-radio', {
    attrs: {
      "label": "0"
    }
  }, [_vm._v("男")]), _vm._v(" "), _c('el-radio', {
    attrs: {
      "label": "1"
    }
  }, [_vm._v("女")])], 1)], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "分组",
      "prop": "grouping"
    }
  }, [_c('el-select', {
    attrs: {
      "placeholder": "请选择分组"
    },
    model: {
      value: (_vm.form.grouping),
      callback: function($$v) {
        _vm.form.grouping = $$v
      },
      expression: "form.grouping"
    }
  }, _vm._l((_vm.infoData.groups), function(group) {
    return _c('el-option', {
      key: group.id,
      attrs: {
        "label": group.name,
        "value": group.id
      }
    })
  }))], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "职务",
      "prop": "position"
    }
  }, [_c('el-checkbox-group', {
    model: {
      value: (_vm.form.position),
      callback: function($$v) {
        _vm.form.position = $$v
      },
      expression: "form.position"
    }
  }, _vm._l((_vm.infoData.positions), function(position) {
    return _c('el-checkbox', {
      key: position.id,
      attrs: {
        "label": position.id,
        "value": position.id,
        "name": "type"
      }
    }, [_vm._v(_vm._s(position.name))])
  }))], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "电话",
      "prop": "tel"
    }
  }, [_c('el-input', {
    staticClass: "nameWidth",
    model: {
      value: (_vm.form.tel),
      callback: function($$v) {
        _vm.form.tel = $$v
      },
      expression: "form.tel"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "邮箱",
      "prop": "email"
    }
  }, [_c('el-input', {
    staticClass: "nameWidth",
    model: {
      value: (_vm.form.email),
      callback: function($$v) {
        _vm.form.email = $$v
      },
      expression: "form.email"
    }
  })], 1), _vm._v(" "), _c('el-form-item', [_c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.onSubmit('form')
      }
    }
  }, [_vm._v("立即添加")]), _vm._v(" "), _c('el-button', [_vm._v("取消")])], 1)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ad3ac2c8", module.exports)
  }
}

/***/ })

});