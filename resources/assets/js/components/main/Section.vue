<template>
  <el-row id="section-row">
      <el-row>
        <strong class="title">{{$route.name}}</strong>
        <el-breadcrumb separator="/" id="breadcrumb">
            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
			    {{ item.name }}
			</el-breadcrumb-item>
		</el-breadcrumb>
      </el-row>
      <el-row>
          <transition name="fade" mode="out-in">
              <router-view></router-view>
          </transition>
      </el-row>
  </el-row>
</template>

<style>
#section-row{
    margin: 20px;
    width: 100%;
}
#breadcrumb{
    display: inline-block;
    float: right;
}
</style>

<script>
export default {
  
}
</script>
