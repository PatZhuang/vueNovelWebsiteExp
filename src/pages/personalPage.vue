<template>
    <el-row justify="center">
        <el-col :span="20" :offset="2">
            <el-tabs v-model="activeTab">
                <el-tab-pane label="我的书架" name="wodeshujia">
                    <!--表格部分-->
                    <favorite-table 
                        :tableRawData="favoriteTable" 
                        ref="favoriteTable"
                        @tableRefreshRequest="refreshFavoriteTableRawData()">
                    </favorite-table>
                </el-tab-pane>
                <el-tab-pane label="我的作品" name="wodezuopin">
                    <my-works-table
                        :tableRawData="myWorksTable"
                        ref="myWorksTable"
                        @tableRefreshRequest="refreshMyWorksTableRawData()"
                        >
                    </my-works-table>
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
                activeTab: '',
                ID: '',
                favoriteTable: [],
                myWorksTable: []
            }
        },
        methods: {
            updateFavoriteTableRawData() {
                var that = this;
                this.$http.post('/api/favorite-books', {
                    id: this.ID
                })
                .then(function (response) {
                    that.favoriteTable = response.data.rows.map(function (item) {
                        item.date = item.date.slice(0, 10);
                        return item;
                    });
                })  
                .catch(function (error) {
                    console.log(error);
                });
            },
            refreshFavoriteTableRawData() {
                this.updateFavoriteTableRawData();
            },
            updateMyWorksTableRawData() {
                var that = this;
                this.$http.post('/api/get-my-works', {
                    id: this.ID
                })
                .then(function (response) {
                    that.myWorksTable = response.data.rows.map(function (item) {
                        item.date = item.date.slice(0, 10);
                        return item;
                    });
                })  
                .catch(function (error) {
                    console.log(error);
                });
            },
            refreshMyWorksTableRawData() {
                this.updateMyWorksTableRawData();
            }
        },
        mounted: function () {
            this.ID = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/, "$1") || "";
            this.activeTab = 'wodeshujia'
        },
        watch: {
            activeTab: function (newActiveTab) {
                switch (newActiveTab) {
                    case 'wodeshujia':
                        this.updateFavoriteTableRawData();
                        break;
                    case 'wodezuopin':
                        this.updateMyWorksTableRawData();
                        break;
                    default:
                        break;
                }
            }
        }
    }
</script>
