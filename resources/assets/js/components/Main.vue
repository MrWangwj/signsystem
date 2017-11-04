<template>
	<div class="main">
		<ul>
			<li>
				<div><label>学号:</label></div>
				<div><p>{{ user.id }}</p></div>
			</li>
			<li>
				<div><label>姓名:</label></div>
				<div><p>{{ user.name }}</p></div>
			</li>
			<li>
				<div><label>性别:</label></div>
				<div>
					<p>{{ (parseInt(user.sex) === 0)?'男':'女' }}</p>
				</div>
			</li>
			<li>
				<div><label>职务:</label></div>
				<div>
					<p >
						<span v-for="position in user.positions">
							{{ position }},
						</span>
					</p>
				</div>
			</li>
			<li>
				<div><label>分组:</label></div>
				<div><p>{{ user.group }}</p></div>
			</li>
			<li>
				<div><label>电话:</label></div>
				<div><p>{{ user.tel }}</p></div>
			</li>

			<li>
				<div><label>邮箱:</label></div>
				<div><p>{{ user.email }}</p></div>
			</li>
		</ul>
	</div>
</template>

<script>
    export default {
        data() {
            return {
                user: {
                    id: '',
					name: '',
					sex: '',
                    positions: [],
					group: '',
					tel: '',
					email: '',
				},
            }
        },
        methods:{
			info(){
                axios.get('/admin/user',{
                    params:{

                    }
                }).then(response => {
					let user = response.data.user;
					this.user = user;
                }).catch(function(err){
                    console.log(err);
                });
			}
		},
        mounted() {
            this.info();
		},
    }
</script>

<style scoped>

	*{
		margin: 0;
		padding: 0;
	}
	.main{

	}
	.main li{
		list-style: none;
		height: 3.2em;
	}

	.main li{
		list-style: none;
	}

	.main li div{
		float: left;
		font-family: "微软雅黑";
		font-size: 1.2em;
	}
	.main li div:first-child{
		width: 80px;
	}

	.main li div:last-child:after{
		content: '';
		clear: both;
	}
</style>