<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :sm="1"></el-col>
      <el-col :sm="{span: 4}">
        <a href="#/" class="navItem navItem-odd">文学</a>
        <a href="#/" class="navItem navItem-odd">流行</a>
        <div></div>
        <a href="#/" class="navItem navItem-even">文化</a>
        <a href="#/" class="navItem navItem-even">生活</a>
        <div></div>
        <a href="#/" class="navItem navItem-odd">经管</a>
        <a href="#/" class="navItem navItem-odd">科技</a>
        <div></div>
        <a href="#/" class="navItem navItem-even">哲学</a>
        <a href="#/" class="navItem navItem-even">法学</a>
        <div></div>
        <a href="#/" class="navItem navItem-odd">教育学</a>
        <a href="#/" class="navItem navItem-odd">历史学</a>
        <div></div>
        <a href="#/" class="navItem navItem-even">理学</a>
        <a href="#/" class="navItem navItem-even">工学</a>
        <div></div>
        <a href="#/" class="navItem navItem-odd">农学</a>
        <a href="#/" class="navItem navItem-odd">医学</a>
      </el-col>
      <el-col :sm="19">
        <el-col :sm="17" id="row-1-col-2">
          <el-carousel 
            :initial-index="CarouselSetting.initialIndex" 
            :indicator-position="CarouselSetting.indicatorPosition"
            :autoplay="CarouselSetting.autoplay" 
            :interval="CarouselSetting.interval"
            :trigger="CarouselSetting.trigger" 
            :arrow="CarouselSetting.arrow" 
            height="260px"
            >
            <el-carousel-item v-for="item in 4" :key="item">
              <img :src="require(`../assets/img${item}.jpeg`)" :alt=item class="carousel-img">
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :sm="{span: 6}">
          <el-card id="notice-card" header="一段文字" 
          :body-style="{padding: '0 15px', lineHeight: '1.3em'}">
            <p style="font-size: 14px;">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ipsum amet atque quasi perspiciatis, vel, nihil, adipisci
              quaerat modi veritatis similique sunt iure, praesentium aut ad ipsa deserunt distinctio harum! </p>
          </el-card>
        <el-col :sm="1"></el-col>
        </el-col>
        <div>
            <el-card 
              class="adcards ad-img" 
              v-for="n in 3" :key="null"
              >
            <div>
              <img src="../assets/logo.png">
              <p style="margin: 0; font-size: 16px; font-weight: 600">广告位</p>
            </div>
            </el-card>
        </div>
      </el-col>
    </el-row>
    <br>
    <!--推荐栏-->
    <recommend></recommend>
    <!--广告行1-->
    <ad-row :ads="ad1"></ad-row>
    <br>

    <!--榜单栏-->
    <trending></trending>
    <br>
    <!--广告行2-->
    <ad-row :ads="ad2"></ad-row>
    <!--电子书栏-->
    <ebook></ebook>
  </div>
</template>

<script>
  import recommendPage from '../pages/recommendPage.vue'
  import trendingPage from '../pages/trendingPage.vue'
  import ebookPage from '../pages/ebookPage.vue'
  import adrow from '../components/adrow.vue'
  export default {
    name: 'index',
    components: {
      'recommend': recommendPage,
      'trending': trendingPage,
      'ebook': ebookPage,
      'ad-row': adrow,
    },
    data() {
      return {
        name: 'index',
        theme: 'light',
        CarouselSetting: {
          initialIndex: 0,
          autoplay: true,
          interval: 2000,
          trigger: 'click',
          arrow: 'hover',
        },
        ad1: [{
            href: '#/',
            img: require('../assets/ads/1.jpeg')
          },
          {
            href: '#/',
            img: require('../assets/ads/2.jpeg')
          },
          {
            href: '#/',
            img: require('../assets/ads/3.jpeg')
          },
          {
            href: '#/',
            img: require('../assets/ads/4.jpeg')
          },
        ],
        ad2: [{
            href: '#/',
            img: require('../assets/ads/5.jpeg')
          },
          {
            href: '#/',
            img: require('../assets/ads/6.jpeg')
          },
          {
            href: '#/',
            img: require('../assets/ads/7.jpeg')
          },
          {
            href: '#/',
            img: require('../assets/ads/8.jpeg')
          },
        ],
      }
    },
    methods: {
      show: function (name) {
        console.log(name);
      },
    }
  }

</script>

<style scoped>
  .navItem {
    display: table-cell;
    vertical-align: middle;
    width: 108px;
    height: 60px;
    margin: auto;
    padding: 0px;
    font-size: 16px;
    color: black;
  }

  .navItem:hover {
    color: #27ae60;
  }

  .navItem-odd {
    background-color: rgb(247, 246, 242);
  }

  .navItem-even {
    background-color: rgb(252, 252, 250);
  }

  #row-1-col-2>* {
    margin-left: 20px;
  }

  .carousel-img {
    width: auto;
    height: 260px;
  }

  #notice-card {
    margin-top: 10px;
    margin-left: 20px;
    height: 250px;
  }

  .adcards {
    float: left;
    height: 150px;
    width: 30%;
    margin: 10px 0px 0px 20px;
    background-color: #ecf0f1;
    border: none;
    box-shadow: none;
    border-radius: 5px !important;
  }

  .adcards img {
    height: 80px;
  }
</style>
