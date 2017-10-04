import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '../components/404.vue'
import Home from '../components/Home.vue'
import Main from '../components/Main.vue'
import Table from '../components/nav1/Table.vue'
import Form from '../components/nav1/Form.vue'
import user from '../components/nav1/user.vue'

import Test from '../components/nav1/AddUser.vue'


Vue.use(Router)

export default new Router({
    routes: [
//    {
//         path: '/login',
//         component: Login,
//         name: '',
//         hidden: true
//     },
        {
            path: '/404',
            component: NotFound,
            name: '',
            hidden: true
        },
        {
            path: '/',
            component: Home,
            name: '用户管理',
            iconCls: 'el-icon-message',//图标样式class
            children: [
                {
                    path: '/user/list',
                    component: Table,
                    name: '用户信息',
                },

                {
                    path: '/main',
                    component: Main,
                    name: '我的信息'
                },

                {
                    name: '添加用户',
                    path: '/user/add',
                    component: resolve => void(require(['../components/nav1/AddUser.vue'], resolve)),
                    hidden: true,
                },
                {
                    name: '编辑用户',
                    path: '/user/edit/:id',
                    component: resolve => void(require(['../components/nav1/EditUser.vue'], resolve)),
                    hidden: true,
                },
            ]
        },
        {
            path: '/',
            component: Home,
            name: '课表管理',
            iconCls: 'el-icon-menu',
            children: [
                {
                    path: '/course/my',
                    component: resolve => void(require(['../components/nav2/MyCourses.vue'], resolve)),
                    name: '我的课表'
                },
                {
                    path: '/course/count',
                    component: resolve => void(require(['../components/nav2/CourseCount.vue'], resolve)),
                    name: '课表统计'
                }
            ]
        },
        {
            path: '/',
            component: Home,
            name: '考勤管理',
            iconCls: 'el-icon-setting',
            // leaf: true, //只有一个节点
            children: [
                {
                    path: '/set/course',
                    component: resolve => void(require(['../components/nav3/Course.vue'], resolve)),
                    name: '课表管理'
                }
            ]
        },
        {
            path: '*',
            hidden: true,
            redirect: { path: '/404' }
        }
    ]
})
