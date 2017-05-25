<template>
  <div>
    <el-table 
      :data="tableData" 
      stripe border fit 
      :default-sort="{prop: 'date', order: 'descending'}" 
      :height="tableHeight" 
      :max-height="tableHeight" 
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="category" label="类别" min-width="20" align="center" :filters="catFilter" :filter-method="cat_filter" filter-placement="bottom-end" ref="catColumn">
      </el-table-column>
      <el-table-column label="书名" min-width="30" align="center">
          <template scope="scope">
                <a :href='"#/book/" + scope.row.title'>《{{scope.row.title}}》</a>
          </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" min-width="20" align="center">
      </el-table-column>
      <el-table-column prop="date" label="更新日期" min-width="30" align="center" sortable>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="space-between" style="margin-top: 10px">
      <el-col :span="4" style="text-align: left">
        <el-button type="danger" size="large" @click="handleDelFavorite">删除</el-button>
      </el-col>
  
      <el-col :span="12">
        <el-input v-model="searchInput" icon="search" style="margin-top: 3px;">
          <el-select slot="prepend" v-model="searchSelect">
            <el-option key="书名" value="书名">书名</el-option>
            <el-option key="作者" value="作者">作者</el-option>
          </el-select>
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: {
      tableRawData: Array,
    },
    data() {
      return {
        searchInput: '',
        searchSelect: '书名',
        selectedBook: [],
        tableHeight: window.screen.availHeight - 390,
        ID: ''
      }
    },
    computed: {
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
      tableData: function() {
        var keyword = this.searchInput.trim();
        var titleFilter = this.searchSelect === '书名';
        if (titleFilter) {
          return this.tableRawData.filter(function(item) {
            return item.title.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
          });
        } else {
          return this.tableRawData.filter(function(item) {
            return item.author.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
          });
        }
      }
    },
    methods: {
      cat_filter: function(value, row) {
        return row.category == value;
      },
      handleSelectionChange: function(selectedItems) {
        this.selectedBook = selectedItems.map(function(item) {
          return item.bid;
        });
      },
      handleDelFavorite: function() {
        this.$confirm('确认删除收藏吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var that = this;
          this.$http.post('/api/delete-favorite-books', {
              id: that.ID,
              bids: that.selectedBook
            })
            .then(function(response) {
              that.$message({
                message: '删除成功',
                type: 'success'
              });
              that.$emit('tableRefreshRequest');
            })
            .catch(function(error) {
              that.$message.error('删除失败\n' + error, )
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    },
    mounted: function() {
      this.ID = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/, "$1") || "";
    }
  }
</script>

<style scoped>
  .el-select {
    width: 100px;
  }
</style>