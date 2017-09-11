import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '../components/404.vue'
import Home from '../components/Home.vue'
import Main from '../components/Main.vue'
import Table from '../components/nav1/Table.vue'
import Form from '../components/nav1/Form.vue'
import user from '../components/nav1/user.vue'
import Page4 from '../components/nav2/Page4.vue'
import Page5 from '../components/nav2/Page5.vue'
import Page6 from '../components/nav3/Page6.vue'


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
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '用户信息' },
            { path: '/table', component: Table, name: 'Table' },
            { path: '/form', component: Form, name: 'Form' },
            { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '导航二',
        iconCls: 'el-icon-menu',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-setting',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }  
  ]
})
