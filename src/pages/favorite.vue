<template>
    <el-row justify="center">
        <el-col :span="22" :offset="1">
            <el-tabs v-model="activeTab">
                <el-tab-pane label="我的书架" name="wodeshujia">
                    <!--表格部分-->
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: 'favorite',
        data() {
            return {
                activeTab: 'wodeshujia'
            }
        }
    }
</script>