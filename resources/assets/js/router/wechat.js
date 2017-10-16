import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            name: '课表统计',
            path: '/course/count',
            component: resolve => void(require(['../components/wechat/course/Count.vue'], resolve)),
        },
    ]
});