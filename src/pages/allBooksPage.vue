<template>
    <el-row justify="center">
        <el-col :span="20" :offset="2">
            <el-tabs v-model="activeTab">
                <el-tab-pane label="全部书籍" name="allBooks">
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
                            :min-width="5"
                            >
                            <template scope="scope">
                                <el-button 
                                    :plain="true" 
                                    icon="star-on"
                                    v-if="favoriteBooks.indexOf(scope.row.bid) != -1"
                                    @click="handleDelFavorite(scope.row.bid)"
                                ></el-button>
                                <el-button
                                    :plain="true" 
                                    icon="star-off"
                                    v-else
                                    @click="handleAddFavorite(scope.row.bid)"
                                >
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="category"
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
                            label="书名"
                            min-width="30"
                            align="center"
                            >
                            <template scope="scope">
                                <a :href='"#/book/" + scope.row.title'>《{{scope.row.title}}》</a>
                            </template>
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

                        <el-col :span="12" :offset="12">
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
                activeTab: 'allBooks',
                searchInput: '',
                searchSelect: '书名',
                selectedBook: [],
                tableHeight: window.screen.availHeight - 418,
                tableRawData: [],
                favoriteBooks: [],
                newBookDialogVisible: false,
                ID: '',
            }
        },
        computed: {
          catFilter: function () {
            var filter = [];
            for (var data of this.tableData) {
                var cat = data.category;
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
            cat_filter: function (value, row) {
                return row.category == value;
            },
            handleFavoriteSearch: function (tableRawData, searchInput) {
            },
            handleSelectionChange: function (selectedItems) {
                this.selectedBook = selectedItems;
            },
            updateTableRawData() {
                var that = this;
                this.$http.get('/api/get-all-books')
                .then(function (response) {
                    that.tableRawData = response.data.rows.map(function (item) {
                        item.date = item.date.slice(0, 10);
                        return item;
                    });
                })  
                .catch(function (error) {
                    console.log(error);
                });
                var that = this;
                this.$http.post('/api/favorite-books', {
                    id: that.ID
                })
                .then(function (response) {
                    that.favoriteBooks = response.data.rows.map(function (item) {
                        return item.bid;
                    });
                })  
                .catch(function (error) {
                    console.log(error);
                });
            },
            handleAddFavorite(bid) {
                this.$confirm('确认添加收藏吗？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    var that = this;
                    this.$http.post('/api/add-favorite-books', {
                        id: that.ID,
                        bid: bid
                    })
                    .then(function (response) {
                        that.$message({
                            message: '添加收藏成功',
                            type: 'success'
                        });
                        that.updateTableRawData();
                    })
                    .catch(function (error) {
                        that.$message.error('添加收藏失败\n' + error,)
                    });
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消添加收藏'
                  });
                });      
            },
            handleDelFavorite(bid) {
                this.$confirm('确认删除收藏吗？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    var that = this;
                    this.$http.post('/api/delete-favorite-books', {
                        id: that.ID,
                        booksToDel: [bid]
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
            }
        },
        mounted: function () {
            this.ID = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/, "$1") || "";
            this.updateTableRawData();
        }
    }
</script>

<style scoped>
    .el-select {
        width: 100px;
    }

    .el-button {
        background: none;
        border: none;
        color: #F7BA2A;
        width: 15px;
        height: 15px;
        padding: 0;
    }

    .el-button:hover {
        background: none;
        color: #F7BA2A;
    }
</style>
