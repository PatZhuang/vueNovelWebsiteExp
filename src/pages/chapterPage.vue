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
      <el-row type="flex" justify="center" id="chapter-nav-link">
          <el-col :span="20">
            <el-row type="flex" justify="space-between">
                <el-col :span="10" style="text-align: left">
                    <a :href=prevChapter>
                        <i class="el-icon-arrow-left"></i>
                        上一章
                    </a>
                </el-col>
                <el-col :span="10" style="text-align: right">
                    <a :href=nextChapter>
                        下一章
                        <i class="el-icon-arrow-right"></i>
                    </a>
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
                rawContent: '',
                chapterTitle: '',
                chapterCount: 0,
                bookInfo: {}
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
            getCurrentChapter() {
                var that = this;
                return new Promise(function (resolve, reject) {
                    that.$http.post('/api/get-chapter', {
                        chapterIndex: Number.parseInt(that.$route.params.chapter),
                        bid: that.bookInfo.bid
                    })
                    .then(function (response) {
                        that.rawContent = response.data.rows[0].content;
                        that.chapterTitle = response.data.rows[0].chapterTitle;
                        resolve('ok');
                    })
                    .catch(function (e) {
                        console.log(e);
                        reject(e);
                    });
                });
            },
            getChapters() {
                var that = this;
                return new Promise(function (resolve, reject) {
                    that.$http.post('/api/get-book-chapters', {
                        bid: that.bookInfo.bid
                    })
                    .then(function (response) {
                        that.chapterCount = response.data.rows.length;
                        resolve('ok');
                    })
                    .catch(function (e) {
                        console.log(e);
                        reject(e);
                    });
                })
            }
        },
        computed: {
            content() {
                var tempContent = this.rawContent;
                tempContent = tempContent.replace(/\t/g, '&nbsp;');
                tempContent = tempContent.replace(/[\n\r]/g, '<br />');
                return tempContent;
            },
            prevChapter() {
                var index = this.$route.path.lastIndexOf('/');
                var prevChapter = Number.parseInt(this.curChapter)-1;
                if (prevChapter == 0) {
                    return '/#' + this.$route.path;
                } else {
                    var url = this.$route.path.slice(0, index);
                    url = '/#' + url + '/' + prevChapter;
                    return url;
                }
            },
            curChapter() {
                return this.$route.params.chapter;
            },
            nextChapter() {
                var index = this.$route.path.lastIndexOf('/');
                var prevChapter = Number.parseInt(this.curChapter)+1;
                if (prevChapter > this.chapterCount) {
                    return '/#' + this.$route.path;
                } else {
                    var url = this.$route.path.slice(0, index);
                    url = '/#' + url + '/' + prevChapter;
                    return url;
                }
            },
        },
        mounted() {
            var that = this;
            (async(that) => {
                try {
                    await that.getBookInfoByTitle();
                    await that.getChapters();
                    await that.getCurrentChapter();
                } catch (e) {
                    console.log(e);
                }
            })(this);
        },
        watch: {
            curChapter: function (newChapter) {
                this.getCurrentChapter();
            }
        }
    }
</script>

<style>
    #chapter-nav-link a{
        color: #27ae60;
    }

    #chapter-nav-link a:hover {
        color: #2ecc71;
    }
</style>
