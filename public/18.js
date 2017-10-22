webpackJsonp([18],{

/***/ 171:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(198)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(200),
  /* template */
  __webpack_require__(201),
  /* styles */
  injectStyle,
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

/***/ 198:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(199);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("d70c48ba", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a1706f9\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Course.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a1706f9\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Course.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 199:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)();
// imports


// module
exports.push([module.i, "\n.dialog-width>div{\n    min-width: 520px;\n}\n", ""]);

// exports


/***/ }),

/***/ 200:
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
        return {
            userId: 0,
            inputUserId: '',

            addCourseVisible: false,

            inputCourseVisible: false,
            courseInfos: [],
            newCourse: {
                name: '',
                teacher: '',
                location: '',
                week_day: 1,
                start_week: 1,
                end_week: 1,
                status: 0,
                start_section: 1,
                end_section: ''
            },

            end_weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            end_sections: [2, 4, 5, 7, 9, 11, 12],

            rules: {
                name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }, { max: 50, message: '长度在50个字符内', trigger: 'blur' }],
                teacher: [{ required: true, message: '请输入上课教师', trigger: 'blur' }, { max: 15, message: '长度在15个字符内', trigger: 'blur' }],
                location: [{ required: true, message: '请输入上课地点', trigger: 'blur' }, { max: 50, message: '长度在50个字符内', trigger: 'blur' }],
                week_day: [{ required: true, message: '请选择星期' }],
                start_week: [{ required: true, message: '请选择开始周' }],
                end_week: [{ required: true, message: '请选择结束周' }],
                start_section: [{ required: true, message: '请选择开始节数' }],
                end_section: [{ required: true, message: '请选择结束节数' }],
                status: [{ required: true, message: '请选择周类型' }]
            }

        };
    },

    methods: {
        userInfo: function userInfo() {
            var _this = this;

            axios.get('/admin/user/course/get', {
                params: {
                    'user-id': this.userId
                }
            }).then(function (response) {
                console.log(response.data);
                var data = response.data;

                if (parseInt(data.code) === 0) {
                    _this.$message.error(data.msg);
                } else {
                    _this.courseInfos = data.courses;
                }

                console.log(_this.courseInfos);
            });
        },
        changeType: function changeType(url) {
            this.$router.push(url);
            this.userInfo();
        },
        setType: function setType(value) {
            this.typeVisible = value;
        },
        inputId: function inputId() {
            var _this2 = this;

            this.$prompt('请输入修改的学号', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\d{10,11}/,
                inputErrorMessage: '请输入正确的学号'
            }).then(function (_ref) {
                var value = _ref.value;

                _this2.userId = value;
                _this2.userInfo();
            }).catch(function () {
                _this2.$message({
                    type: 'error',
                    message: '操作取消'
                });
            });
        },
        startSectionChange: function startSectionChange(type) {

            if (type === 0) {
                if (this.newCourse.end_section < this.newCourse.start_section) this.newCourse.end_section = '';
            } else {
                if (this.editCourse.end_section < this.editCourse.start_section) this.editCourse.end_section = '';
            }
        },
        startWeekChange: function startWeekChange(type) {
            if (type === 0) {
                if (this.newCourse.end_week < this.newCourse.start_week) this.newCourse.end_week = '';
            } else {
                if (this.editCourse.end_week < this.editCourse.start_week) this.editCourse.end_week = '';
            }
        },
        resetForm: function resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        addSubmit: function addSubmit(formName) {
            var _this3 = this;

            this.$refs[formName].validate(function (valid) {
                if (valid) {

                    axios.post('/admin/user/course/add', {
                        'user-id': _this3.userId,
                        name: _this3.newCourse.name,
                        teacher: _this3.newCourse.teacher,
                        location: _this3.newCourse.location,
                        week_day: _this3.newCourse.week_day,
                        start_week: _this3.newCourse.start_week,
                        end_week: _this3.newCourse.end_week,
                        status: _this3.newCourse.status,
                        start_section: _this3.newCourse.start_section,
                        end_section: _this3.newCourse.end_section
                    }).then(function (response) {
                        //                            console.log(response.data);
                        var data = response.data;
                        if (parseInt(data.code) === 0) {
                            _this3.$message.error(data.msg);
                        } else {
                            _this3.$message({
                                message: '添加成功',
                                type: 'success'
                            });

                            _this3.userInfo();
                            _this3.addCourseVisible = false;
                            _this3.$refs[formName].resetFields();
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        inputCourseFun: function inputCourseFun() {
            var _this4 = this;

            if (!/^\d{10,11}$/.test(this.inputUserId)) {
                this.$message.error('请输入正确的学号');
            } else {
                this.$confirm('此操作将清除所有课程导入, 是否继续?', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    axios.post('/admin/user/course/input', {
                        'user-id': _this4.userId,
                        'input-user-id': _this4.inputUserId
                    }).then(function (response) {
                        //                            console.log(response.data);
                        var data = response.data;
                        if (parseInt(data.code) === 0) {
                            _this4.$message.error(data.msg);
                        } else {
                            _this4.$message({
                                message: data.msg,
                                type: 'success'
                            });
                            _this4.userInfo();
                            _this4.inputCourseVisible = false;
                        }
                    });
                });
            }
        },
        clearAllCourse: function clearAllCourse() {
            var _this5 = this;

            this.$confirm('此操作将清除所有课程, 是否继续?', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                axios.post('/admin/user/course/clear', {
                    'user-id': _this5.userId
                }).then(function (response) {
                    //                            console.log(response.data);
                    var data = response.data;
                    if (parseInt(data.code) === 0) {
                        _this5.$message.error(data.msg);
                    } else {
                        _this5.$message({
                            message: '清除成功',
                            type: 'success'
                        });
                        _this5.userInfo();
                    }
                });
            });
        }
    },

    mounted: function mounted() {
        if (this.$route.path === '/set/course') {
            this.$router.push('/set/course/type/one');
        }
        this.inputId();
        //            this.userInfo();
    }
});

/***/ }),

/***/ 201:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticStyle: {
      "margin-top": "20px"
    }
  }, [_c('label', [_vm._v("用户：")]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.userId))]), _vm._v(" "), _c('a', {
    staticStyle: {
      "color": "blue",
      "cursor": "pointer"
    },
    on: {
      "click": _vm.inputId
    }
  }, [_vm._v("修改")])]), _vm._v(" "), _c('div', [_c('div', [(_vm.$route.path == '/set/course/type/two') ? _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.changeType('/set/course/type/one')
      }
    }
  }, [_vm._v("格式一")]) : _vm._e(), _vm._v(" "), (_vm.$route.path == '/set/course/type/one' || _vm.$route.path == '/set/course') ? _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.changeType('/set/course/type/two')
      }
    }
  }, [_vm._v("格式二")]) : _vm._e(), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.addCourseVisible = true
      }
    }
  }, [_vm._v("添加课程")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.inputCourseVisible = true
      }
    }
  }, [_vm._v("导入他人课表")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.clearAllCourse
    }
  }, [_vm._v("清除所有课表")])], 1)]), _vm._v(" "), _c('router-view', {
    attrs: {
      "userId": _vm.userId,
      "courseInfos": _vm.courseInfos
    },
    on: {
      "setType": function($event) {
        _vm.setType(_vm.value)
      },
      "courseInfo": _vm.userInfo
    }
  }), _vm._v(" "), _c('el-dialog', {
    staticClass: "dialog-width",
    attrs: {
      "title": "添加课程",
      "visible": _vm.addCourseVisible
    },
    on: {
      "update:visible": function($event) {
        _vm.addCourseVisible = $event
      }
    }
  }, [_c('el-form', {
    ref: "newCourse",
    staticStyle: {
      "width": "460px"
    },
    attrs: {
      "model": _vm.newCourse,
      "label-width": "80px",
      "rules": _vm.rules
    }
  }, [_c('el-form-item', {
    attrs: {
      "label": "课程名称",
      "prop": "name"
    }
  }, [_c('el-input', {
    model: {
      value: (_vm.newCourse.name),
      callback: function($$v) {
        _vm.newCourse.name = $$v
      },
      expression: "newCourse.name"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "教师",
      "prop": "teacher"
    }
  }, [_c('el-input', {
    model: {
      value: (_vm.newCourse.teacher),
      callback: function($$v) {
        _vm.newCourse.teacher = $$v
      },
      expression: "newCourse.teacher"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "地点",
      "prop": "location"
    }
  }, [_c('el-input', {
    model: {
      value: (_vm.newCourse.location),
      callback: function($$v) {
        _vm.newCourse.location = $$v
      },
      expression: "newCourse.location"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "星期",
      "prop": "week_day"
    }
  }, [_c('el-select', {
    staticStyle: {
      "width": "100%"
    },
    attrs: {
      "placeholder": "请选择"
    },
    model: {
      value: (_vm.newCourse.week_day),
      callback: function($$v) {
        _vm.newCourse.week_day = $$v
      },
      expression: "newCourse.week_day"
    }
  }, [_c('el-option', {
    key: 1,
    attrs: {
      "label": "星期一",
      "value": 1
    }
  }), _vm._v(" "), _c('el-option', {
    key: 2,
    attrs: {
      "label": "星期二",
      "value": 2
    }
  }), _vm._v(" "), _c('el-option', {
    key: 3,
    attrs: {
      "label": "星期三",
      "value": 3
    }
  }), _vm._v(" "), _c('el-option', {
    key: 4,
    attrs: {
      "label": "星期四",
      "value": 4
    }
  }), _vm._v(" "), _c('el-option', {
    key: 5,
    attrs: {
      "label": "星期五",
      "value": 5
    }
  }), _vm._v(" "), _c('el-option', {
    key: 6,
    attrs: {
      "label": "星期六",
      "value": 6
    }
  }), _vm._v(" "), _c('el-option', {
    key: 7,
    attrs: {
      "label": "星期日",
      "value": 7
    }
  })], 1)], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "节数"
    }
  }, [_c('el-col', {
    attrs: {
      "span": 11
    }
  }, [_c('el-form-item', {
    attrs: {
      "prop": "start_section"
    }
  }, [_c('el-select', {
    attrs: {
      "placeholder": "开始"
    },
    on: {
      "change": function($event) {
        _vm.startSectionChange(0)
      }
    },
    model: {
      value: (_vm.newCourse.start_section),
      callback: function($$v) {
        _vm.newCourse.start_section = $$v
      },
      expression: "newCourse.start_section"
    }
  }, [_c('el-option', {
    key: 1,
    attrs: {
      "label": "第1节",
      "value": 1
    }
  }), _vm._v(" "), _c('el-option', {
    key: 3,
    attrs: {
      "label": "第3节",
      "value": 3
    }
  }), _vm._v(" "), _c('el-option', {
    key: 6,
    attrs: {
      "label": "第6节",
      "value": 6
    }
  }), _vm._v(" "), _c('el-option', {
    key: 8,
    attrs: {
      "label": "第8节",
      "value": 8
    }
  }), _vm._v(" "), _c('el-option', {
    key: 10,
    attrs: {
      "label": "第10节",
      "value": 10
    }
  })], 1)], 1)], 1), _vm._v(" "), _c('el-col', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "span": 2
    }
  }, [_vm._v("—")]), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 11
    }
  }, [_c('el-form-item', {
    attrs: {
      "prop": "end_section"
    }
  }, [_c('el-select', {
    attrs: {
      "placeholder": "结束"
    },
    model: {
      value: (_vm.newCourse.end_section),
      callback: function($$v) {
        _vm.newCourse.end_section = $$v
      },
      expression: "newCourse.end_section"
    }
  }, _vm._l((_vm.end_sections), function(section) {
    return (section >= _vm.newCourse.start_section) ? _c('el-option', {
      key: section,
      attrs: {
        "label": '第' + section + '节',
        "value": section
      }
    }) : _vm._e()
  }))], 1)], 1)], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "周数"
    }
  }, [_c('el-col', {
    attrs: {
      "span": 6
    }
  }, [_c('el-form-item', {
    attrs: {
      "prop": "start_week"
    }
  }, [_c('el-select', {
    attrs: {
      "placeholder": "开始"
    },
    on: {
      "change": function($event) {
        _vm.startWeekChange(0)
      }
    },
    model: {
      value: (_vm.newCourse.start_week),
      callback: function($$v) {
        _vm.newCourse.start_week = $$v
      },
      expression: "newCourse.start_week"
    }
  }, _vm._l((20), function(n) {
    return _c('el-option', {
      key: n,
      attrs: {
        "label": '第' + n + '周',
        "value": n
      }
    })
  }))], 1)], 1), _vm._v(" "), _c('el-col', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "span": 2
    }
  }, [_vm._v("—")]), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 6
    }
  }, [_c('el-form-item', {
    attrs: {
      "prop": "end_week"
    }
  }, [_c('el-select', {
    attrs: {
      "placeholder": "结束"
    },
    model: {
      value: (_vm.newCourse.end_week),
      callback: function($$v) {
        _vm.newCourse.end_week = $$v
      },
      expression: "newCourse.end_week"
    }
  }, _vm._l((_vm.end_weeks), function(week) {
    return (week >= _vm.newCourse.start_week) ? _c('el-option', {
      key: week,
      attrs: {
        "label": '第' + week + '周',
        "value": week
      }
    }) : _vm._e()
  }))], 1)], 1), _vm._v(" "), _c('el-col', {
    staticStyle: {
      "text-align": "right",
      "padding-right": "3px"
    },
    attrs: {
      "span": 4
    }
  }, [_vm._v("类型:")]), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 6
    }
  }, [_c('el-form-item', {
    attrs: {
      "prop": "status"
    }
  }, [_c('el-select', {
    attrs: {
      "placeholder": "类型"
    },
    model: {
      value: (_vm.newCourse.status),
      callback: function($$v) {
        _vm.newCourse.status = $$v
      },
      expression: "newCourse.status"
    }
  }, [_c('el-option', {
    key: "0",
    attrs: {
      "label": "全部",
      "value": 0
    }
  }), _vm._v(" "), _c('el-option', {
    key: "1",
    attrs: {
      "label": "单周",
      "value": 1
    }
  }), _vm._v(" "), _c('el-option', {
    key: "2",
    attrs: {
      "label": "双周",
      "value": 2
    }
  })], 1)], 1)], 1)], 1)], 1), _vm._v(" "), _c('div', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    on: {
      "click": function($event) {
        _vm.addCourseVisible = false
      }
    }
  }, [_vm._v("取 消")]), _vm._v(" "), _c('el-button', {
    on: {
      "click": function($event) {
        _vm.resetForm('newCourse')
      }
    }
  }, [_vm._v("重 置")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.addSubmit('newCourse')
      }
    }
  }, [_vm._v("添 加")])], 1)], 1), _vm._v(" "), _c('el-dialog', {
    staticClass: "dialog-width",
    attrs: {
      "title": "导入课表",
      "visible": _vm.inputCourseVisible
    },
    on: {
      "update:visible": function($event) {
        _vm.inputCourseVisible = $event
      }
    }
  }, [_c('el-form', [_c('el-form-item', {
    attrs: {
      "label": "学号"
    }
  }, [_c('el-input', {
    attrs: {
      "type": "number"
    },
    model: {
      value: (_vm.inputUserId),
      callback: function($$v) {
        _vm.inputUserId = _vm._n($$v)
      },
      expression: "inputUserId"
    }
  })], 1)], 1), _vm._v(" "), _c('div', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    on: {
      "click": function($event) {
        _vm.inputCourseVisible = false
      }
    }
  }, [_vm._v("取 消")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.inputCourseFun
    }
  }, [_vm._v("导入")])], 1)], 1)], 1)
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