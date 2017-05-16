<template>
    <el-card :body-style="cardBodyStyle">
        <p slot="header" class="el-card-header" style="display:inline;">{{colTitle}}</p>
        <p class="book-item" v-for="(bookItem, index) in item" :key="bookItem.bookTitle">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="3">
                    <el-tag 
                    :class="['book-item-tag', 
                    {'first-book-item-tag': index===0},
                    {'second-book-item-tag': index===1},
                    {'third-book-item-tag': index===2},
                    ]"
                    >
                        {{index + 1}}
                    </el-tag>
                </el-col>    
                <el-col :span="12" style="text-align: left">
                    <a href="#/" class="">{{bookItem.bookTitle}}</a></el-col>
                <el-col :span="6" style="text-align: left">
                <el-rate
                    :value="bookItem.rate/2"
                    disabled
                    :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                    text-color="#ff9900"
                    style="position: relative; bottom: 1px"
                    >
                </el-rate>
                </el-col>
                <el-col :span="2">
                    <p class="book-item-rate-text">{{bookItem.rate}}</p>
                </el-col>
            </el-row>
        </p>
    </el-card>
</template>

<script>
    export default {
        data() {
            return {
                cardBodyStyle: {
                    padding: '10px'
                }
            }
        },
        props: {
            colTitle: {
                default: '榜单'
            },
            item: {
                default: [
                    {bookTitle: '一本书', rate: 8.1},
                    {bookTitle: '第二本书', rate: 7.4},
                    {bookTitle: '一本书', rate: 9.0},
                    {bookTitle: '一本书', rate: 9.2},
                    {bookTitle: '一本书', rate: 6.4},
                    {bookTitle: '一本书', rate: 8.8},
                    {bookTitle: '一本书', rate: 5.0},
                    {bookTitle: '一本书', rate: 7.0},
                    {bookTitle: '一本书', rate: 8.0},
                    {bookTitle: '一本书', rate: 5.5},
                ]
            },
            tagColor: true,
        }
    }
</script>

<style scoped>
    .book-item {
      margin: 15px 0;
    }

    .book-item a {
        display: block;
        color: black;
    }

    .book-item a:hover {
        color: #27ae60;
    }

    .book-item .book-item-tag {
        position: relative;
        bottom: 2px;
        background-color: white;
        padding-left: 7px;
        padding-right: 7px;
        border: 1px solid #E8E8E8;
        color: black;
    }

    .book-item-rate-text {
        color: #ff9900;
        font-weight: 500;
        font-size: 14px;
    }

    .book-item .first-book-item-tag {
        color: white;
        background-color: #e74c3c;
        font-weight: bold;
    }

    .book-item .second-book-item-tag {
        color: white;
        background-color: #FF9900;
        font-weight: bold;
    }

    .book-item .third-book-item-tag {
        color: white;
        background-color: #F7BA2A;
        font-weight: bold;
    }

    .el-card-header {
        font-weight: 600;
        font-size: 14px;
    }

    a {
        font-size: 14px;
    }

    .el-row {
        height: 25px;
    }

    .el-card {
        border: 1px solid #E8E8E8;
        box-shadow: none;
        -webkit-transition: box-shadow .3s;
        -moz-transition: box-shadow .3s;
        transition: box-shadow .3s;
    }

    .el-card:hover {
        box-shadow: 0px 0px 8px lightgray;
    }
</style>