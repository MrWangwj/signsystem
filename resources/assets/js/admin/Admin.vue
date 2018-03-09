<template>
    <div>
        <el-container class="main">
            <el-aside :width="tabWidth+'px'">
                <div>
                    <div class="isClossTab" @click="isClossTabFun">
                        <i :class="isCollapse?'el-icon-d-arrow-right':'el-icon-d-arrow-left'" ></i>
                    </div>
                    <el-menu :class="'menu'"
                             :collapse="isCollapse"
                             background-color="#545c64"
                             text-color="#fff"
                             active-text-color="#ffd04b"
                             :unique-opened="true"
                             :router="true"
                    >
                        <el-submenu v-for="(v,index) in nodes" :index="index+''" :key="index" :router="true">
                            <template slot="title">
                                <i :class="v.icon"></i>
                                <span slot="title">{{ v.name }}</span>
                            </template>
                            <el-menu-item v-for="(vv,index2) in v.nodes" :index="vv.path" :key="index+'-'+index2" >
                                <i :class="vv.icon"></i>
                                {{ vv.name }}
                            </el-menu-item>
                        </el-submenu>

                    </el-menu>
                </div>
            </el-aside>
            <el-container>
                <el-header class="main-header">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <img src="" alt="">
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-header>
                <el-main>
                    <el-breadcrumb separator="/" class="crumbs">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div>
                        <router-view></router-view>
                    </div>
                </el-main>
                <el-footer class="main-footer" height="50px">
                    <p>页脚</p>
                </el-footer>
            </el-container>
        </el-container>
    </div>
</template>
<style>
    *{
        padding: 0;
        margin: 0;
    }

</style>
<style scoped lang="scss">
    $header-height:60px;
    $background-color: #545c64;
    $color: #FFF;

    .main{
        height: 100vh;
        min-width: 800px;
        min-height: 600px;
        overflow: hidden;

        aside{
            overflow: visible;
            height: 100%;
            background-color: $background-color;
            color: $color;

            .isClossTab{
                width: 100%;
                height: $header-height;
                cursor: pointer;
                font-size: 25px;
                text-align: center;
                line-height: $header-height;
                font-weight: bold;
                border-right: 1px solid #807c7c;
                box-sizing: border-box;
            }
            .menu {
                width: 100%;
                border-right:0;


            }

        }

        .main-header {
            background-color: $background-color;
            color: $color;

            .el-dropdown{
                cursor: pointer;
                float: right;
            }
            .el-dropdown-link{

                img{
                    $imgMargin: (($header-height - 50)/2);
                    display:inline-block;
                    width:50px;
                    height: 50px;
                    border-radius: 25px;
                    background-color: #FFF;
                    margin-top: $imgMargin;
                }
            }
        }

        .crumbs {
            margin-bottom: 20px;
        }

        .main-footer{
            text-align: center;
            background-color: $background-color;
            color: $color;
            line-height: 50px;
        }

    }

</style>

<script>
    export default {
        data() {
            return {
                isCollapse: false,
                tabWidth: 200,
                test1: 1,
                intelval: null,
                nodes: [],
            };
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },

            isClossTabFun(){
                clearInterval(this.intelval);
                if(!this.isCollapse){
                    this.intelval = setInterval(()=>{
                        if(this.tabWidth<= 64)
                            clearInterval(this.intelval);
                        this.tabWidth -= 1;
                    }, 1);
                }else{
                    this.tabWidth = 200;
                }
                this.isCollapse = !this.isCollapse;
            },
            logout(){
                window.location = '/admin/logout';

            },
            getNodes(){
                axios.get('/admin/nodes').then(res => {
                    let data = res.data;
                    for (let i = 0; i < data.length; i++){
                        if(data[i].pid === 0){
                            this.nodes.push({
                                id: data[i].id,
                                name: data[i].name,
                                icon: data[i].icon,
                                nodes: []
                            });
                        }
                    }
                    for (let i = 0; i < data.length; i++){
                        if(data[i].pid !== 0){
                            for (let j = 0; j < data.length; j++){
                                if(this.nodes[j].id === data[i].pid){
                                    this.nodes[j].nodes.push({
                                        id: data[i].id,
                                        name: data[i].name,
                                        icon: data[i].icon,
                                        path: data[i].path,
                                    });
                                    break;
                                }
                            }
                        }
                    }

                    // console.log(this.nodes);
                });
            }
        },

        created(){
            this.getNodes();
        }
    }
</script>