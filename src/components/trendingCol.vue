<template>
    <Card :bordered="true">
        <p slot="title">{{colTitle}}</p>
        <p class="book-item" v-for="(bookItem, index) in item">
            <Row type="flex" justify="space-between" align="center">
                <Col span="4">
                    <Tag 
                    :class="['book-item-tag', 
                    {'first-book-item-tag': index===0},
                    {'second-book-item-tag': index===1},
                    {'third-book-item-tag': index===2},
                    ]"
                    >
                        {{index + 1}}
                    </Tag>
                </Col>    
                <Col span="12" style="text-align: left"><a href="#/" class="">{{bookItem.bookTitle}}</a></Col>
                <Col span="6" style="text-align: left">
                <el-rate
                    :value="bookItem.rate/2"
                    disabled
                    :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                    text-color="#ff9900"
                    style="position: relative; bottom: 1px"
                    >
                </el-rate>
                </Col>
                <Col span="2">
                    <p class="book-item-rate-text">{{bookItem.rate}}</p>
                </Col>
            </Row>
        </p>
    </Card>
</template>

<script>
    export default {
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

<style>
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
    }

    .book-item-rate-text {
        color: #ff9900;
        font-weight: 500;
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
</style>