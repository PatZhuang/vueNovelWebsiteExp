<template>
  <div>
        <el-breadcrumb separator="/" style="margin: 20px 80px">
            <el-breadcrumb-item :to="{ path: this.$route.path }">会员中心</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: this.$route.path }">开通会员</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row type="flex" justify="center">
            
        </el-row>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        form: {
          id: '',
          duration: 1,
          method: 'alipay',
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }

</script>
