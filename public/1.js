webpackJsonp([1],{

/***/ 169:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(183)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(185),
  /* template */
  __webpack_require__(186),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-4fd45aee",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/resources/assets/js/components/Count.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Count.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4fd45aee", Component.options)
  } else {
    hotAPI.reload("data-v-4fd45aee", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(82)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ 183:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(184);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("8d7c7406", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4fd45aee\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vux-loader/src/style-loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Count.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4fd45aee\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vux-loader/src/style-loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Count.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 184:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)();
// imports


// module
exports.push([module.i, "\n.main[data-v-4fd45aee]{\n    width: 80%;\n    margin: 0 auto;\n    min-width: 1024px;\n}\n.title[data-v-4fd45aee]{\n}\n.content[data-v-4fd45aee]{\n}\n.el-checkbox[data-v-4fd45aee]{\n    margin-left: 0 !important;\n    margin-right: 15px;\n}\n.el-checkbox-group[data-v-4fd45aee]{\n    display: inline-block;\n}\n", ""]);

// exports


/***/ }),

/***/ 185:
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
//
//
//
//
//
//
//
//
//
//
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
    components: {},
    data: function data() {
        return {
            get: {
                nowWeek: 0,
                groups: [],
                positions: [],
                grades: [],
                students: []
            },
            set: {
                weeks: [],
                selGroups: [],
                selPositions: [],
                selSexs: [],
                selGrades: [],
                selStudent: []
            },
            courses: [],
            dialogVisible: false,
            haveNoCourse: true,
            sleWeek: '' //选中的周
        };
    },

    methods: {
        preWeek: function preWeek() {
            if (this.sleWeek > 1) {
                this.sleWeek--;
            } else {
                this.$message({
                    message: '已达到第一周',
                    type: 'warning'
                });
            }
        },
        nextWeek: function nextWeek() {
            //                console.log(this.sleWeek +"-"+ this.set.weeks.length-1);

            if (this.sleWeek < this.set.weeks.length - 1) {
                this.sleWeek++;
            } else {
                this.$message({
                    message: '已达到最后一周',
                    type: 'warning'
                });
            }
        },
        seleteWeek: function seleteWeek() {
            if (this.sleWeek === 0) {
                this.sleWeek = this.get.nowWeek;
            }

            this.getCourses();
        },
        getCourses: function getCourses() {

            this.courses = [];
            //设置课程表格
            for (var i = 0; i < 12; i++) {
                this.courses[i] = {
                    section: i + 1,
                    mon: '',
                    tue: '',
                    wed: '',
                    thu: '',
                    fri: '',
                    sat: '',
                    sun: ''
                };
            }

            var weekDay = ['', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

            var all = this.get.students,
                //所有的学生
            selStu = this.set.selStudent,
                //选中的学生
            selWeek = this.sleWeek,
                //选中的周
            hasCourse = this.haveNoCourse; //选中要查看的有课状态

            //获取用户的有课 信息
            for (var id in selStu) {
                for (var course in all[selStu[id].id].courses) {
                    var tmpCourse = all[selStu[id].id].courses[course];
                    if (tmpCourse.start_week <= selWeek && selWeek <= tmpCourse.end_week) {
                        if (tmpCourse.status === 0 || selWeek % 2 === tmpCourse.status % 2) {
                            for (var n = tmpCourse.start_section; n <= tmpCourse.end_section; n++) {
                                this.courses[n - 1][weekDay[tmpCourse.week_day]] += selStu[id].name + ",";
                            }
                        }
                    }
                }
            }
            //                console.log(selStu);
            if (!hasCourse) {
                for (var _i = 0; _i < 12; _i++) {
                    for (var j = 1; j <= 7; j++) {
                        var tempNames = this.courses[_i][weekDay[j]];
                        this.courses[_i][weekDay[j]] = "";
                        for (var _id in selStu) {
                            if (tempNames.indexOf(selStu[_id].name + ",") === -1) {
                                this.courses[_i][weekDay[j]] += selStu[_id].name + ",";
                            }
                        }
                    }
                }
            }
        },
        delStu: function delStu(index) {
            this.set.selStudent.splice(index, 1);
            this.getCourses();
        },


        //设置选中学生
        getStu: function getStu() {
            this.set.selStudent = []; //清空数组

            var all = this.get.students,
                groups = this.set.selGroups,
                positions = this.set.selPositions,
                sexs = this.set.selSexs,
                grades = this.set.selGrades;

            //                console.log(all);

            if (groups.length === 0 && //当用户没有选择是默认为所有人员
            positions.length === 0 && sexs.length === 0 && grades.length === 0) {
                for (var student in all) {
                    this.set.selStudent.push({
                        id: student,
                        name: all[student].name
                    });
                }
            } else {
                for (var _student in all) {
                    if (groups.indexOf(all[_student].grouping_id) !== -1 || sexs.indexOf(all[_student].sex) !== -1 || grades.indexOf(parseInt(_student.substring(2, 4))) !== -1) {
                        //判断用户是否在条件中
                        this.set.selStudent.push({
                            id: _student,
                            name: all[_student].name
                        });
                    } else {
                        var userPositions = all[_student].positions;
                        for (var position in userPositions) {
                            if (positions.indexOf(userPositions[position].id) !== -1) {
                                this.set.selStudent.push({
                                    id: _student,
                                    name: all[_student].name
                                });
                            }
                        }
                    }
                }
            }
            this.getCourses();
        },


        //初始化
        info: function info() {
            var _this = this;

            var maxWeek = 20; //最大周数
            axios.get('/count', {}).then(function (response) {
                //                    console.log(response.data);
                //设置数据
                var data = response.data;
                _this.get.nowWeek = data.nowWeek; //当前周
                _this.get.groups = data.groups; //分组情况
                _this.get.positions = data.positions; //职位情况
                _this.get.grades = data.grades; //年级情况
                _this.get.students = data.students; //学生

                if (_this.get.nowWeek > 20) maxWeek = _this.get.nowWeek; // 判断若用户大于20周，则以当前周为最大

                //设置周下拉列表框
                for (var i = 0; i <= maxWeek; i++) {
                    _this.set.weeks[i] = {
                        value: i,
                        label: i + '周'
                    };
                }
                _this.set.weeks[0].label = '本周';

                //设置选中当前周
                _this.sleWeek = _this.get.nowWeek;

                _this.getStu(); //设置选中人员
                _this.getCourses(); //获取表格
                //关闭加载
                _this.$loading().close();
            }).catch(function (err) {
                console.log(err);
            });
        }
    },
    mounted: function mounted() {
        this.$loading();
        this.info();
    }
});

/***/ }),

/***/ 186:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "main"
  }, [_c('div', {
    staticClass: "title"
  }, [_c('el-row', {
    attrs: {
      "gutter": 0
    }
  }, [_c('el-col', {
    attrs: {
      "span": 2
    }
  }, [_c('el-button', {
    on: {
      "click": function($event) {
        _vm.preWeek()
      }
    }
  }, [_vm._v("上一周")])], 1), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 2
    }
  }, [_c('el-select', {
    attrs: {
      "placeholder": "请选择"
    },
    on: {
      "change": function($event) {
        _vm.seleteWeek()
      }
    },
    model: {
      value: (_vm.sleWeek),
      callback: function($$v) {
        _vm.sleWeek = $$v
      },
      expression: "sleWeek"
    }
  }, _vm._l((_vm.set.weeks), function(item) {
    return _c('el-option', {
      key: item.value,
      attrs: {
        "label": item.label,
        "value": item.value
      }
    })
  }))], 1), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 2
    }
  }, [_c('el-button', {
    on: {
      "click": function($event) {
        _vm.nextWeek()
      }
    }
  }, [_vm._v("下一周")])], 1), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 2,
      "offset": 16
    }
  }, [_c('el-switch', {
    attrs: {
      "on-color": "#13ce66",
      "off-color": "#ff4949",
      "on-text": "有课",
      "off-text": "无课"
    },
    on: {
      "change": function($event) {
        _vm.getCourses()
      }
    },
    model: {
      value: (_vm.haveNoCourse),
      callback: function($$v) {
        _vm.haveNoCourse = $$v
      },
      expression: "haveNoCourse"
    }
  })], 1)], 1), _vm._v(" "), _c('el-row', [_c('el-col', {
    attrs: {
      "span": 2
    }
  }, [_vm._v("\n                选择组别：\n            ")]), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 22
    }
  }, [_c('el-checkbox-group', {
    on: {
      "change": function($event) {
        _vm.getStu()
      }
    },
    model: {
      value: (_vm.set.selGroups),
      callback: function($$v) {
        _vm.set.selGroups = $$v
      },
      expression: "set.selGroups"
    }
  }, _vm._l((_vm.get.groups), function(group) {
    return _c('el-checkbox', {
      key: group.id,
      attrs: {
        "label": group.id
      }
    }, [_vm._v(_vm._s(group.name))])
  }))], 1)], 1), _vm._v(" "), _c('el-row', [_c('el-col', {
    attrs: {
      "span": 2
    }
  }, [_vm._v("\n                条件筛选：\n            ")]), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 22
    }
  }, [_c('el-checkbox-group', {
    on: {
      "change": function($event) {
        _vm.getStu()
      }
    },
    model: {
      value: (_vm.set.selPositions),
      callback: function($$v) {
        _vm.set.selPositions = $$v
      },
      expression: "set.selPositions"
    }
  }, _vm._l((_vm.get.positions), function(position) {
    return _c('el-checkbox', {
      key: position.id,
      attrs: {
        "label": position.id
      }
    }, [_vm._v(_vm._s(position.name))])
  })), _vm._v(" "), _c('el-checkbox-group', {
    on: {
      "change": function($event) {
        _vm.getStu()
      }
    },
    model: {
      value: (_vm.set.selSexs),
      callback: function($$v) {
        _vm.set.selSexs = $$v
      },
      expression: "set.selSexs"
    }
  }, [_c('el-checkbox', {
    key: 0,
    attrs: {
      "label": 0
    }
  }, [_vm._v("男")]), _vm._v(" "), _c('el-checkbox', {
    key: 1,
    attrs: {
      "label": 1
    }
  }, [_vm._v("女")])], 1), _vm._v(" "), _c('el-checkbox-group', {
    on: {
      "change": function($event) {
        _vm.getStu()
      }
    },
    model: {
      value: (_vm.set.selGrades),
      callback: function($$v) {
        _vm.set.selGrades = $$v
      },
      expression: "set.selGrades"
    }
  }, _vm._l((_vm.get.grades), function(grade) {
    return _c('el-checkbox', {
      key: grade,
      attrs: {
        "label": grade
      }
    }, [_vm._v(_vm._s(grade) + "级")])
  }))], 1)], 1), _vm._v(" "), _c('el-row', [_c('el-col', {
    attrs: {
      "span": 2
    }
  }, [_vm._v("\n                人员选择：\n            ")]), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 22
    }
  }, [_c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.dialogVisible = true
      }
    }
  }, [_vm._v("选择人员")])], 1)], 1), _vm._v(" "), _c('el-dialog', {
    attrs: {
      "title": "选择人员",
      "visible": _vm.dialogVisible
    },
    on: {
      "update:visible": function($event) {
        _vm.dialogVisible = $event
      }
    }
  }, [_c('div', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    on: {
      "click": function($event) {
        _vm.dialogVisible = false
      }
    }
  }, [_vm._v("取 消")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.dialogVisible = false
      }
    }
  }, [_vm._v("选 择")])], 1)]), _vm._v(" "), _c('el-row', [_c('el-col', {
    attrs: {
      "span": 2
    }
  }, [_vm._v("\n                已选人员：\n            ")]), _vm._v(" "), _c('el-col', {
    attrs: {
      "span": 22
    }
  }, _vm._l((_vm.set.selStudent), function(student, index) {
    return _c('el-tag', {
      key: index,
      attrs: {
        "closable": true,
        "type": "primary"
      },
      on: {
        "close": function($event) {
          _vm.delStu(index)
        }
      }
    }, [_vm._v("\n                    " + _vm._s(student.name) + "\n                ")])
  }))], 1), _vm._v(" "), _c('el-table', {
    staticStyle: {
      "width": "100%"
    },
    attrs: {
      "data": _vm.courses,
      "border": ""
    }
  }, [_c('el-table-column', {
    attrs: {
      "prop": "section",
      "label": "节数"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "prop": "mon",
      "label": "周一"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "prop": "tue",
      "label": "周二"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "prop": "wed",
      "label": "周三"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "prop": "thu",
      "label": "周四"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "prop": "fri",
      "label": "周五"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "prop": "sat",
      "label": "周六"
    }
  }), _vm._v(" "), _c('el-table-column', {
    attrs: {
      "prop": "sun",
      "label": "周日"
    }
  })], 1)], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4fd45aee", module.exports)
  }
}

/***/ }),

/***/ 82:
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ })

});