webpackJsonp([3],{

/***/ 171:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(194),
  /* template */
  __webpack_require__(195),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/resources/assets/js/components/nav3/Course.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Course.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7a1706f9", Component.options)
  } else {
    hotAPI.reload("data-v-7a1706f9", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 194:
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

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            userId: 0,
            week: 0,
            weeks: []
        };
    },

    methods: {
        inputId: function inputId() {
            var _this = this;

            this.$prompt('请输入修改的学号', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\d{10,11}/,
                inputErrorMessage: '请输入正确的学号'
            }).then(function (_ref) {
                var value = _ref.value;

                _this.$message({
                    type: 'success',
                    message: '你输入的学号是: ' + value
                });
            }).catch(function () {});
        }
    },
    mounted: function mounted() {
        this.inputId();
    }
});

/***/ }),

/***/ 195:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticStyle: {
      "margin-top": "20px"
    }
  }, [_c('label', [_vm._v("用户：")]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.userId))]), _vm._v(" "), _c('a', {
    staticStyle: {
      "color": "blue"
    },
    on: {
      "click": _vm.inputId
    }
  }, [_vm._v("修改")])]), _vm._v(" "), _c('div', [_c('el-form', [_c('el-form-item', {
    attrs: {
      "label": "周数"
    }
  }, [_c('el-select', {
    attrs: {
      "placeholder": "请选择活动区域"
    },
    model: {
      value: (_vm.week),
      callback: function($$v) {
        _vm.week = $$v
      },
      expression: "week"
    }
  }, [_c('el-option', {
    attrs: {
      "label": "区域一",
      "value": "shanghai"
    }
  }, [_vm._v("1")]), _vm._v(" "), _c('el-option', {
    attrs: {
      "label": "区域二",
      "value": "beijing"
    }
  }, [_vm._v("1")])], 1)], 1)], 1)], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7a1706f9", module.exports)
  }
}

/***/ })

});