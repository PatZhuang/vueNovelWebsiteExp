<template>
  <div>
      <el-breadcrumb separator="/" style="margin: 20px 80px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/book/${this.$route.params.title}` }">
            {{this.$route.params.title}}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{this.$route.params.chapter}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row type="flex" justify="center">
          <el-col :span="20">
            <el-row justify="center" style="text-align: center">
                <h2>
                    第 {{Number.parseInt(this.$route.params.chapter)}} 章 {{chapterTitle}}
                </h2>
                <p style="text-align: left" v-html="content">
                </p>
            </el-row>
          </el-col>
      </el-row>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                content: '',
                chapterTitle: ''
            }
        },
        mounted() {
            var that = this;
            this.$http.post('/api/get-chapter', {
                chapterIndex: Number.parseInt(this.$route.params.chapter),
                bookTitle: this.$route.params.title
            })
            .then(function (response) {
                that.content = response.data.rows[0].content.replace('\n', '<br />');
                that.chapterTitle = response.data.rows[0].chapterTitle;
                console.log(that.content);
            })
            .catch(function (e) {
                console.log(e);
            })
        }
    }
</script>