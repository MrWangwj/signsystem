<template>
    <div>
        <div style="margin-top: 20px;">
            <label >用户：</label>
            <span>{{ userId }}</span>
            <a style="color: blue;" @click="inputId">修改</a>
        </div>
        <div>
            <el-form>
                <el-form-item label="周数">
                    <el-select v-model="week" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai">1</el-option>
                        <el-option label="区域二" value="beijing">1</el-option>
                    </el-select>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                userId: 0,
                week: 0,
                weeks: [],
            }
        },
        methods: {
            inputId(){
                this.$prompt('请输入修改的学号', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\d{10,11}/,
                    inputErrorMessage: '请输入正确的学号'
                }).then(({ value }) => {
                    this.$message({
                        type: 'success',
                        message: '你输入的学号是: ' + value
                    });
                }).catch(() => {

                });
            }
        },
        mounted(){
            this.inputId();
        }
    }
</script>