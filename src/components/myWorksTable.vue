<template>
    <div>
        <el-table
            :data="tableData"
            stripe
            :default-sort="{prop: 'date', order: 'descending'}" 
            :height="tableHeight" 
            :max-height="tableHeight"
            style="width: 100%"
            >
            <el-table-column type="expand">
                <template scope="props">
                    <el-form label-position="left" inline class="table-expand">
                    <el-form-item label="作品编号" label-width="80px">
                        <span>{{ props.row.bid }}</span>
                    </el-form-item>
                    <el-form-item label="作品名称" label-width="80px">
                        <span>《{{ props.row.title }}》</span>
                    </el-form-item>
                    <el-form-item label="类别" label-width="80px">
                        <span>{{ props.row.category }}</span>
                    </el-form-item>
                    <el-form-item label="标签" label-width="80px">
                        <span>{{ props.row.tag || '无' }}</span>
                    </el-form-item>
                    <el-form-item label="章节数" label-width="80px">
                        <span>{{ props.row.chapters || 0 }}</span>
                    </el-form-item>
                    <el-form-item label="点击量" label-width="80px">
                        <span>{{ props.row.clicks || 0 }}</span>
                    </el-form-item>
                    <el-form-item label="简介" label-width="80px">
                        <span>{{ props.row.description || '无' }}</span>
                    </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                label="作品名称"
                min-width="32"
                align="left">
                <template scope="scope">
                    <a :href='"#/book/" + scope.row.title'>《{{scope.row.title}}》</a>
                </template>
            </el-table-column>
            <el-table-column
                label="作品类别"
                prop="category"
                min-width="8"
                align="left"
                :filters="catFilter" 
                :filter-method="cat_filter"
                ref="catColumn">
            </el-table-column>
            <el-table-column
                label="更新日期"
                prop="date"
                min-width="12"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column
                label="状态"
                prop="status"
                min-width="8"
                align="center"
                :filters="[{text: '连载中', value: '连载中'}, {text: '已完结', value: '已完结'}]"
                :filter-method="status_filter"
                >
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="12"
                align="center">
                <!--操作列-->
                <template scope="scope">
                    <el-button 
                        type="text" 
                        size="small"
                        @click="newChapterDialogVisible=true">
                        上传章节
                    </el-button>
                    <el-button 
                        type="text" 
                        size="small" 
                        style="color: #e74c3c"
                        @click="deleteMyWork(scope.row)">
                        删除作品
                    </el-button>
                        <el-dialog title="上传章节" :visible.sync="newChapterDialogVisible">
                        <el-form :model="newChapterForm" :label-position="newWorkFormStyle.labelPosition">
                            <el-form-item label="章节号" :label-width="newWorkFormStyle.labelWidth">
                                <el-input v-model="newChapterForm.chapterIndex" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="标题" :label-width="newWorkFormStyle.labelWidth">
                                <el-input v-model="newChapterForm.title" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="内容" :label-width="newWorkFormStyle.labelWidth">
                                <el-input v-model="newChapterForm.content" type="textarea"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="newChapterDialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="uploadNewChapter(scope.row)">提 交</el-button>
                        </div>
                        </el-dialog>

                </template>
            </el-table-column>
        </el-table>
        <!--控制栏-->
        <el-row type="flex" justify="space-between" style="margin-top: 10px">
            <el-col :span="4" style="text-align: left">
                <el-button type="success" size="large" @click="newWorkDialogVisible=true">新作品</el-button>
            </el-col>
            <el-dialog 
                title="新作品" 
                :visible.sync="newWorkDialogVisible"
                >
                <el-form :model="newWorkForm" :label-position="newWorkFormStyle.labelPosition">
                    <el-form-item 
                        label="作品名称 *" 
                        :label-width="newWorkFormStyle.labelWidth">
                        <el-input v-model="newWorkForm.title" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item 
                        label="副标题" 
                        :label-width="newWorkFormStyle.labelWidth">
                        <el-input v-model="newWorkForm.subtitle" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item 
                        label="类别 *" 
                        :label-width="newWorkFormStyle.labelWidth">
                        <el-select v-model="newWorkForm.category" placeholder="请选择">
                            <el-option
                            v-for="item in bookCategory"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item 
                        label="标签" 
                        :label-width="newWorkFormStyle.labelWidth">
                        <el-input v-model="newWorkForm.tag" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item 
                        label="简介" 
                        :label-width="newWorkFormStyle.labelWidth">
                        <el-input 
                            v-model="newWorkForm.description" 
                            auto-complete="off"
                            type="textarea"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="newWorkDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="createNewWork()">提 交</el-button>
                </div>
            </el-dialog>
            <el-col :span="12">
                <el-input v-model="searchInput" icon="search" style="margin-top: 3px;">
                </el-input>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        props: {
            tableRawData: null
        },
        data() {
            return {
                tableHeight: window.screen.availHeight - 390,
                ID: '',
                searchInput: '',
                newWorkDialogVisible: false,
                newChapterDialogVisible: false,
                newWorkForm: {
                    title: '',
                    subtitle: '',
                    tag: '',
                    category: '',
                    description: '',
                },
                newChapterForm: {},
                newWorkFormStyle: {
                    labelWidth: '90px',
                    labelPosition: 'left'
                },
                bookCategory: []
            }
        },
        computed: {
            tableData() {
                var keyword = this.searchInput.trim();
                if (keyword) {
                    return this.tableRawData.filter(function(item) {
                        return item.title.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
                    });   
                } else {
                    return this.tableRawData;
                }
            },
            catFilter: function() {
                var filter = [];
                for (var data of this.tableData) {
                var cat = data.category;
                if (filter.indexOf(cat) === -1) {
                    filter.push(cat);
                }
                }
                return filter.map(item => {
                return {
                    text: item,
                    value: item
                }
                });
            },
        },
        methods: {
            titleFormatter(row, column) {
                return `《${row.title}》`;
            },
            cat_filter: function(value, row) {
                return row.category == value;
            },
            status_filter: function(value, row) {
                return row.status == value;
            },
            createNewWork() {
              if (this.newWorkForm.title.trim() && this.newWorkForm.category.trim()) {
                this.$confirm('确认提交新作品吗？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'info'
                }).then(() => {
                  var that = this;
                  this.$http.post('/api/post-new-work', {
                      author: that.ID,
                      ...this.newWorkForm
                    })
                    .then(function (response) {
                      that.$message({
                        message: '添加作品成功',
                        type: 'success'
                      });
                      that.$emit('tableRefreshRequest');
                      that.newWorkDialogVisible = false;
                      for (var key in that.newWorkForm) {
                          that.newWorkForm[key] = '';
                      }
                    })
                    .catch(function (error) {
                      that.$message.error('添加作品失败\n' + error, )
                    });
                })
              } else {
                this.$message.error('请检查输入')
              }
            },
            deleteMyWork(row) {
                this.$confirm('确认删除作品吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var that = this;
                    this.$http.post('/api/delete-my-work', {
                        bid: row.bid
                    })
                    .then(function (response) {
                        that.$message({
                            message: '删除作品成功',
                            type: 'success'
                        })
                        that.$emit('tableRefreshRequest');
                    })
                    .catch(function (error) {
                        that.$message.error('删除作品失败');
                    });
                })
            },
            uploadNewChapter(row) {
                var that = this;
                if (Number.parseInt(this.newChapterForm.chapterIndex) && this.newChapterForm.title && this.newChapterForm.content) {
                    this.$http.post('/api/upload-new-chapter', {
                        bid: row.bid,
                        ...this.newChapterForm
                      })
                      .then(function (response) {
                        that.$message({
                          message: '上传新章节成功',
                          type: 'success'
                        });
                        that.newChapterDialogVisible = false;
                        for (var key in that.newChapterForm) {
                            that.newChapterForm[key] = '';
                        }
                      })
                      .catch(function (e) {
                        console.log(e);
                      })
                } else {
                    this.$message.error('请检查输入');
                }
                
            },
        },

        mounted: function() {
            var that = this;
            this.ID = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/, "$1") || "";
            // 获取图书类别
            this.$http.get('/api/get-categories')
            .then(function (response) {
                that.bookCategory = response.data.rows.map(x => x.category);
            })
            .catch(function (e) {
                console.log(e);
            })
        }
    }
</script>

<style scoped>
    .table-expand {
        font-size: 0;
        text-align: left;
    }

    .table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }

    .el-dialog .el-input {
        width: 70%;
    }

    .el-dialog .el-form-item {
        text-align: left;
        margin-left: 20px;
        margin-right: 30px;
    }
</style>
