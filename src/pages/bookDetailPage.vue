<template>
  <div>
      <el-breadcrumb separator="/" style="margin: 20px 80px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.$route.params.title}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row type="flex" justify="center" align="bottom">
          <el-col :span="20">
            <el-row justify="start" align="bottom" style="text-align: left">
                <el-col :span="4" :offset="2">
                    <img :src=bookInfo.coverURL alt="" style="width: 200px">
                </el-col>
                <el-col :span="8" :offset="2">
                    <el-row>
                        <h2>《{{this.$route.params.title}}》</h2>
                    </el-row>
                    <el-row>
                        <span>作者：{{this.bookInfo.author}}</span><br /><br />
                        <span>类别：{{this.bookInfo.category}}</span><br /><br />
                        <span>价格：{{this.bookInfo.price == 0? '免费' : this.bookInfo.price+' 起点币/章'}}</span><br /><br />
                        <span>标签：{{this.bookInfo.tag || '无'}}</span><br /><br />
                        <span>简介：{{this.bookInfo.description || '无'}}</span><br /><br />
                    </el-row>
                </el-col>
            </el-row>

            <br>
            <hr>
            <br>
            <!--章节列表-->
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
                    <span v-if="chapters[(i-1)*3+j-1]">
                        <a :href='"#/book/"+$route.params.title+"/"+((i-1)*3+j)' class="chapter-link">
                            第 {{(i-1)*3+j}} 章 {{ chapters[(i-1)*3+j-1] }}
                        </a>
                        <span v-if="bookInfo.price != 0">
                            <el-tag type="success" v-if="i == 1">试读</el-tag>
                        </span>
                    </span>
                    <p v-else></p>
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
                bookInfo: {}
            }
        },
        computed: {
            chapters() {
                return this.chaptersRawData.map(x => x.chapterTitle);
            }
        },
        methods: {
            getBookInfoByTitle() {
                var that = this;
                return new Promise(function (resolve, reject) {
                    that.$http.post('/api/get-book-info-by-title', {
                        bookTitle: that.$route.params.title
                    })
                    .then(function (response) {
                        that.bookInfo = response.data.rows[0];
                        that.bookInfo.coverURL = 'http://localhost:3000/covers/' + that.bookInfo.coverURL;
                        resolve('ok');
                    })
                    .catch(function (e) {
                        console.log(e);
                        reject(e);
                    })  
                })
            },
            getBookChapters() {
                var that = this;
                return new Promise(function (resolve, reject) {
                    that.$http.post('/api/get-book-chapters', {
                        bid: that.bookInfo.bid
                    })
                    .then(function (response) {
                        that.chaptersRawData = response.data.rows;
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                })
            },
        },
        mounted() {
            // 获取书本信息，获取章节信息
            (async(that) => {
                try {
                    await that.getBookInfoByTitle();
                    await that.getBookChapters();   
                } catch (e) {
                    console.log(e);
                }
            })(this);
        }
    }
</script>

<style scoped>
    .chapter-link {
        display: inline-block;
        line-height: 2.5em;
    }

    hr {
        border: none;
        height: 1px;
        background-color: #e3e3e3;
        margin: 0 5%;
        width: auto;
    }
</style>
