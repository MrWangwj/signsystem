webpackJsonp([3],{

/***/ 161:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(194)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(196),
  /* template */
  __webpack_require__(197),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem/resources/assets/js/components/nav3/CourseTwo.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] CourseTwo.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1f453fdc", Component.options)
  } else {
    hotAPI.reload("data-v-1f453fdc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 194:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(195);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("15e58bc4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1f453fdc\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CourseTwo.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1f453fdc\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CourseTwo.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 195:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 196:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
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
//
//
//

exports.default = {
    props: {
        userId: {
            required: true
        },
        courseInfos: {
            type: Array,
            required: true
        }
    },
    data: function data() {

        return {
            courses: [],
            editCourseVisible: false,
            editCourse: {
                id: 0,
                name: '',
                teacher: '',
                location: '',
                week_day: 1,
                start_week: 1,
                status: 0,
                end_week: 1,
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
        editCourseFun: function editCourseFun(index, row) {
            //                console.log(this.courses[index]);
            this.editCourse = this.courseInfos[index];

            this.editCourseVisible = true;
        },
        deleteCourseFun: function deleteCourseFun(index, row) {
            var _this = this;

            this.$confirm('此操作将删除当前课程, 是否继续?', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                axios.post('/admin/user/course/delete', {
                    'user-id': _this.userId,
                    id: _this.courses[index].id
                }).then(function (response) {
                    //                            console.log(response.data);
                    var data = response.data;
                    if (parseInt(data.code) === 0) {
                        _this.$message.error(data.msg);
                    } else {
                        _this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        _this.$emit('courseInfo');
                    }
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
        editSubmit: function editSubmit(formName) {
            var _this2 = this;

            this.$refs[formName].validate(function (valid) {
                if (valid) {
                    console.log(_this2.editCourse);
                    axios.post('/admin/user/course/edit', {
                        'user-id': _this2.userId,
                        id: _this2.editCourse.id,
                        name: _this2.editCourse.name,
                        teacher: _this2.editCourse.teacher,
                        location: _this2.editCourse.location,
                        week_day: _this2.editCourse.week_day,
                        start_week: _this2.editCourse.start_week,
                        end_week: _this2.editCourse.end_week,
                        status: _this2.editCourse.status,
                        start_section: _this2.editCourse.start_section,
                        end_section: _this2.editCourse.end_section
                    }).then(function (response) {
                        //                            console.log(response.data);
                        var data = response.data;
                        if (parseInt(data.code) === 1) {
                            _this2.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            _this2.$emit('courseInfo');
                            _this2.editCourseVisible = false;
                            _this2.$refs[formName].resetFields();
                        } else {
                            _this2.$message.error(data.msg);
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },

    watch: {
        courseInfos: {
            handler: function handler(curVal, oldVal) {
                this.courses = [];
                var temText = ['', '单', '双'];
                var weekDays = ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
                for (var id in this.courseInfos) {
                    var d = this.courseInfos[id];

                    var weeks = d.start_week === d.end_week ? d.end_week : d.start_week + '-' + d.end_week;
                    var info = '[' + weeks + temText[d.status] + '周]' + weekDays[d.week_day] + '[' + d.start_section + '-' + d.end_section + '节]/' + d.location;

                    this.courses.push({
                        id: d.id,
                        name: d.name,
                        teacher: d.teacher,
                        info: info
                    });
                }
            },

            deep: true
        }
    },
    mounted: function mounted() {}
};

/***/ }),

/***/ 197:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', [_c('el-table', {
    staticStyle: {
      "width": "100%"
    },
    attrs: {
      "data": _vm.courses,
      "border": ""
    }
  }, [_c('el-table-column', {
    attrs: {
      "prop": "name",
      "label": "课程名称"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "prop": "teacher",
      "label": "教师名称"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "prop": "info",
      "label": "上课时间／地点"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "label": "操作"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(scope) {
        return [_c('el-button', {
          attrs: {
            "size": "small"
          },
          on: {
            "click": function($event) {
              _vm.editCourseFun(scope.$index, scope.row)
            }
          }
        }, [_vm._v("编辑")]), _vm._v(" "), _c('el-button', {
          attrs: {
            "size": "small",
            "type": "danger"
          },
          on: {
            "click": function($event) {
              _vm.deleteCourseFun(scope.$index, scope.row)
            }
          }
        }, [_vm._v("删除")])]
      }
    }])
  })], 1)], 1), _vm._v(" "), _c('el-dialog', {
    staticClass: "dialog-width",
    attrs: {
      "title": "编辑课程",
      "visible": _vm.editCourseVisible
    },
    on: {
      "update:visible": function($event) {
        _vm.editCourseVisible = $event
      }
    }
  }, [_c('el-form', {
    ref: "editCourse",
    staticStyle: {
      "width": "460px"
    },
    attrs: {
      "model": _vm.editCourse,
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
      value: (_vm.editCourse.name),
      callback: function($$v) {
        _vm.editCourse.name = $$v
      },
      expression: "editCourse.name"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "教师",
      "prop": "teacher"
    }
  }, [_c('el-input', {
    model: {
      value: (_vm.editCourse.teacher),
      callback: function($$v) {
        _vm.editCourse.teacher = $$v
      },
      expression: "editCourse.teacher"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "地点",
      "prop": "location"
    }
  }, [_c('el-input', {
    model: {
      value: (_vm.editCourse.location),
      callback: function($$v) {
        _vm.editCourse.location = $$v
      },
      expression: "editCourse.location"
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
      value: (_vm.editCourse.week_day),
      callback: function($$v) {
        _vm.editCourse.week_day = $$v
      },
      expression: "editCourse.week_day"
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
        _vm.startSectionChange(1)
      }
    },
    model: {
      value: (_vm.editCourse.start_section),
      callback: function($$v) {
        _vm.editCourse.start_section = $$v
      },
      expression: "editCourse.start_section"
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
      value: (_vm.editCourse.end_section),
      callback: function($$v) {
        _vm.editCourse.end_section = $$v
      },
      expression: "editCourse.end_section"
    }
  }, _vm._l((_vm.end_sections), function(section) {
    return (section >= _vm.editCourse.start_section) ? _c('el-option', {
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
        _vm.startWeekChange(1)
      }
    },
    model: {
      value: (_vm.editCourse.start_week),
      callback: function($$v) {
        _vm.editCourse.start_week = $$v
      },
      expression: "editCourse.start_week"
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
      value: (_vm.editCourse.end_week),
      callback: function($$v) {
        _vm.editCourse.end_week = $$v
      },
      expression: "editCourse.end_week"
    }
  }, _vm._l((_vm.end_weeks), function(week) {
    return (week >= _vm.editCourse.start_week) ? _c('el-option', {
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
      value: (_vm.editCourse.status),
      callback: function($$v) {
        _vm.editCourse.status = $$v
      },
      expression: "editCourse.status"
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
        _vm.editCourseVisible = false
      }
    }
  }, [_vm._v("取 消")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.editSubmit('editCourse')
      }
    }
  }, [_vm._v("修 改")])], 1)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-1f453fdc", module.exports)
  }
}

/***/ })

});