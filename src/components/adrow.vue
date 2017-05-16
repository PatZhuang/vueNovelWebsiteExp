<template>
    <el-row type="flex" justify="space-between">
        <el-col :span="1"></el-col>
        <el-col :span="5" v-for="ad in ads" :key="1">
            <a :href="ad.href" style="display: block;">
                <img :src=ad.img alt="" class="ad-img">
            </a>
        </el-col>
        <el-col :span="1"></el-col>
    </el-row>
</template>

<script>
    export default {
        props: {
            ads: {
                default: [
                {href: '#/', img: require('../assets/ads/1.jpeg')},
                {href: '#/', img: require('../assets/ads/2.jpeg')},
                {href: '#/', img: require('../assets/ads/3.jpeg')},
                {href: '#/', img: require('../assets/ads/4.jpeg')},
            ]}
        }
    }
</script>

<style>
    .ad-img {
        width: 100%; 
        height: 100%;  
        border-width: 1px; 
        border-radius: 10px;
    }

    .ad-img:hover {
        box-shadow: 3px 3px 3px lightgray;
    }

    .ad-img {
        -webkit-transition: box-shadow .3s;
        -moz-transition: box-shadow .3s;
        transition: box-shadow .3s;
    }
</style>