import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/test',
            component: resolve => void(require(['../components/Test.vue'], resolve)),
        }
    ],
});