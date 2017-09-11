import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

export default new VueRouter({
    saveScrollPosition: true,
    routes: [
        {
            name:"count",
            path:'/',
            component: resolve =>void(require(['./components/Count.vue'], resolve))
        },
    ]
})