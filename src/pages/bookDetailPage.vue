<template>
  <div>
      <el-breadcrumb separator="/" style="margin: 20px 80px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.$route.params.title}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row type="flex" justify="center">
          <el-col :span="20">
            <el-row justify="center" style="text-align: center">
                <h2>{{this.$route.params.title}}</h2>
            </el-row>
            <el-row 
                type="flex" 
                justify="space-between" 
                v-for="i in Math.ceil(chapters.length/3)"
                :key="i"
                >
                <el-col 
                    :span="7" 
                    v-for="j in 3"
                    :key="j"
                    >
                    <a :href='"#/book/"+$route.params.title+"/"+(i-1)*3+j' v-if="chapters[(i-1)*3+j-1]" class="chapter-link">
                        第 {{(i-1)*3+j}} 章 {{ chapters[(i-1)*3+j-1] }}
                    </a>
                    <p v-else> </p>
                </el-col>
            </el-row>
          </el-col>
      </el-row>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                chaptersRawData: [],
            }
        },
        computed: {
            chapters() {
                return this.chaptersRawData.map(x => x.chapterTitle);
            }
        },
        mounted() {
            var that = this;
            this.$http.post('/api/get-book-chapters', {
                bookTitle: this.$route.params.title
            })
            .then(function (response) {
                that.chaptersRawData = response.data.rows;
                console.log(that.chaptersRawData);
            })
            .catch(function (error) {
                console.log(error);
            })
        }
    }
</script>

<style scoped>
    .chapter-link {
        display: inline-block;
        line-height: 2.5em;
    }
</style>
