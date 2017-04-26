<template>
    <Row type="flex" justify="space-around" align="top" style="margin: 0 32px">
        <Col :sm="{span: 11}">
            <trending-col :colTitle="colTitleFirst" :item="colItemFirst"></trending-col>
        </Col>
        <Col :sm="{span: 11}">
            <trending-col :colTitle="colTitleSecond" :item="colItemSecond"></trending-col>
        </Col>
    </Row>
</template>

<script>
    import trendingCol from '../components/trendingCol.vue'
    export default {
        name: 'trendingPage',
        components: {
            'trending-col': trendingCol,
        },  
        data() {
            return {
                name: 'trendingPage',
                colTitleFirst: '京东畅销图书榜',
                colItemFirst: [
                    {bookTitle: '摆渡人', rate: 6.8},
                    {bookTitle: '人民的名义', rate: 7.4},
                    {bookTitle: '浮生六记', rate: 8.2},
                    {bookTitle: '人类简史', rate: 8.9},
                    {bookTitle: '挪威的森林', rate: 8.4},
                    {bookTitle: '自在独行', rate: 7.6},
                    {bookTitle: '岛上书店', rate: 7.6},
                    {bookTitle: '好好说话', rate: 7.5},
                    {bookTitle: '给孩子读诗', rate: 8.4},
                    {bookTitle: '手绘中国地理地图', rate: 0},
                ],
                colTitleSecond: '当当畅销图书榜',
                colItemSecond: [
                    {bookTitle: '地图（人文版）', rate: 9.2},
                    {bookTitle: '解忧杂货店', rate: 8.6},
                    {bookTitle: '我们仨', rate: 9.0},
                    {bookTitle: '人间失格', rate: 8.2},
                    {bookTitle: '这就是二十四节气', rate: 8.6},
                    {bookTitle: '白夜行', rate: 9.2},
                    {bookTitle: '偷影子的人', rate: 7.9},
                    {bookTitle: '嫌疑人 X 的献身', rate: 9.0},
                    {bookTitle: '小熊和最好的爸爸（全7册）', rate: 8.1},
                    {bookTitle: '天才在左 疯子在右（完整版）', rate: 7.4},
                ],
            }
        }
    }
</script>

<style>
    
</style>