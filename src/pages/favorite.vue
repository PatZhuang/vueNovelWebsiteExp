<template>
    <el-row justify="center">
        <el-col :span="20" :offset="2">
            <el-tabs v-model="activeTab">
                <el-tab-pane label="我的书架" name="wodeshujia">
                    <!--表格部分-->
                    <el-table
                        :data="tableData"
                         stripe border fit
                         align="center"
                         :default-sort="{prop: 'date', order: 'descending'}"
                         :height="tableHeight"
                         :max-height="tableHeight"
                         @selection-change="handleSelectionChange"
                        >
                        <el-table-column
                            type="selection"
                            width="10"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="tag"
                            label="类别"
                            min-width="20"
                            align="center"
                            :filters="catFilter"
                            :filter-method="cat_filter"
                            filter-placement="bottom-end"
                            ref="catColumn"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="title"
                            label="书名"
                            min-width="30"
                            align="center"
                            :formatter="titleFormatter"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="author"
                            label="作者"
                            min-width="20"
                            align="center"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="date"
                            label="更新日期"
                            min-width="30"
                            align="center"
                            sortable
                            >
                        </el-table-column>
                    </el-table>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="4" style="text-align: left">
                            <el-button type="danger" size="large" @click="handleDeleteBook">删除</el-button>
                            <el-button type="success" size="large" @click="newBookDialogVisible = true">新增</el-button>
                        </el-col>

                        <el-dialog
                            title="提示"
                            :visible.sync="newBookDialogVisible"
                            size="tiny"
                            >
                            <span>这是一段信息</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="newBookDialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                            </span>
                        </el-dialog>

                        <el-col :span="12">
                            <el-input 
                            v-model="searchInput" 
                            icon="search"
                            :on-icon-click="handleFavoriteSearch"
                            style="margin-top: 3px;">
                                <el-select slot="prepend" v-model="searchSelect">
                                    <el-option key="书名" value="书名">书名</el-option>
                                    <el-option key="作者" value="作者">作者</el-option>
                                </el-select>
                            </el-input>
                        </el-col>
                    </el-row>
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
                activeTab: 'wodeshujia',
                searchInput: '',
                searchSelect: '书名',
                selectedBook: [],
                tableHeight: window.screen.availHeight - 418,
                tableRawData: [],
                newBookDialogVisible: false,
                ID: ''
            }
        },
        computed: {
          catFilter: function () {
            var filter = [];
            for (var data of this.tableData) {
                var cat = data.tag;
                if (filter.indexOf(cat) === -1) {
                    filter.push(cat);
                }
            }
            return filter.map(item => {return {text: item, value: item}});
          },
          tableData: function () {
              var keyword = this.searchInput.trim();
              var titleFilter = this.searchSelect === '书名';
              if (titleFilter) {
                return this.tableRawData.filter(function (item) {
                  return item.title.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
                });   
              } else {
                return this.tableRawData.filter(function (item) {
                  return item.author.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
                });
              }
          }
        },
        methods: {
            titleFormatter: function (row, column) {
                return `<<${row.title}>>`;
            },
            cat_filter: function (value, row) {
                return row.tag == value;
            },
            handleFavoriteSearch: function (tableRawData, searchInput) {
            },
            handleSelectionChange: function (selectedItems) {
                this.selectedBook = selectedItems;
            },
            handleDeleteBook: function () {
                this.$confirm('确认删除收藏吗？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    var that = this;
                    this.$http.post('/api/delete-favorite-books', {
                        id: that.ID,
                        booksToDel: that.selectedBook.map(function (item) {
                            return item.bid;
                        })
                    })
                    .then(function (response) {
                        that.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        that.updateTableRawData();
                    })
                    .catch(function (error) {
                        that.$message.error('删除失败\n' + error,)
                    });
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });                
            },
            updateTableRawData() {
                var that = this;
                this.$http.post('/api/favorite-books', {
                    id: that.ID
                })
                .then(function (response) {
                    that.tableRawData = response.data.books.map(function (item) {
                        item.date = item.date.slice(0, 10);
                        return item;
                    });
                })  
                .catch(function (error) {
                    console.log(error);
                });
            }
        },
        mounted: function () {
            this.ID = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/, "$1") || "";
            this.updateTableRawData();
        }
    }
</script>

<style>
    .el-select {
        width: 100px;
    }
</style>
