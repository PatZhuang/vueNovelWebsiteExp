<template>
    <el-row justify="center">
        <el-col :span="20" :offset="2">
            <el-tabs v-model="activeTab">
                <el-tab-pane label="我的书架" name="wodeshujia">
                    <!--表格部分-->
                    <favorite-table 
                        :tableRawData="favoriteTable" 
                        ref="favoriteTable"
                        @tableRefreshRequest="refreshTableRawData()">
                    </favorite-table>
                </el-tab-pane>
                <el-tab-pane label="我的作品" name="wodezuopin">
                    <my-works-table></my-works-table>
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </el-row>
</template>

<script>
    import favoriteTable from '../components/favoriteTable.vue'
    import myWorksTable from '../components/myWorksTable.vue'
    export default {
        name: 'personalPage',
        components: {
            'favorite-table': favoriteTable,
            'my-works-table': myWorksTable,
        },
        data() {
            return {
                activeTab: 'wodeshujia',
                ID: '',
                favoriteTable: []
            }
        },
        methods: {
            updateTableRawData() {
                var that = this;
                this.$http.post('/api/favorite-books', {
                    id: that.ID
                })
                .then(function (response) {
                    that.favoriteTable = response.data.books.map(function (item) {
                        item.date = item.date.slice(0, 10);
                        return item;
                    });
                })  
                .catch(function (error) {
                    console.log(error);
                });
            },
            refreshTableRawData() {
                this.updateTableRawData();
                this.$refs.favoriteTable.tableRawData = this.favoriteTable;
                console.log(this.favoriteTable);
            }
        },
        mounted: function () {
            this.ID = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/, "$1") || "";
            this.updateTableRawData();
        }
    }
</script>
