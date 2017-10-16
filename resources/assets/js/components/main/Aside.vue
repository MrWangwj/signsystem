<template>
	<div>
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" router >
					 <el-menu-item index="/table"><i class="el-icon-star-on"></i>table</el-menu-item>
					<el-menu-item index="/form"><i class="el-icon-star-on"></i>form</el-menu-item> 
					 <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template> 
				</el-menu>
				<router-view></router-view>
	</div>
</template>
<style>
  .el-menu-vertical-demo{
    width: 300px;
  }
</style>
<script>
export default {

}
</script>
