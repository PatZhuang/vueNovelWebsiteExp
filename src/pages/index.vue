<template>
  <div>
    <Row type="flex" justify="center" align="top">
      <Col :sm="1"></Col>
      <Col :sm="{span: 4}">
        <a href="" class="navItem navItem-odd">文学</a>
        <a href="" class="navItem navItem-odd">流行</a>
        <div></div>
        <a href="" class="navItem navItem-even">文化</a>
        <a href="" class="navItem navItem-even">生活</a>
        <div></div>
        <a href="" class="navItem navItem-odd">经管</a>
        <a href="" class="navItem navItem-odd">科技</a>
        <div></div>
        <a href="" class="navItem navItem-even">哲学</a>
        <a href="" class="navItem navItem-even">法学</a>
        <div></div>
        <a href="" class="navItem navItem-odd">教育学</a>
        <a href="" class="navItem navItem-odd">历史学</a>
        <div></div>
        <a href="" class="navItem navItem-even">理学</a>
        <a href="" class="navItem navItem-even">工学</a>
        <div></div>
        <a href="" class="navItem navItem-odd">农学</a>
        <a href="" class="navItem navItem-odd">医学</a>
      </Col>
      <Col :sm="19">
        <Col :sm="17" id="row-1-col-2">
          <Carousel v-model="carouselIndex" :autoplay="CarouselSetting.autoplay" :autoplay-speed="CarouselSetting.autoplaySpeed" :dots="CarouselSetting.dots"
            :trigger="CarouselSetting.trigger" :arrow="CarouselSetting.arrow" class="main-carousel">
            <Carousel-item>
              <img src="../assets/img1.jpeg" alt="img1" class="carousel-img">
            </Carousel-item>
            <Carousel-item>
              <img src="../assets/img2.jpeg" alt="img2" class="carousel-img">
            </Carousel-item>
            <Carousel-item>
              <img src="../assets/img3.jpeg" alt="img3" class="carousel-img">
            </Carousel-item>
            <Carousel-item>
              <img src="../assets/img4.jpeg" alt="img4" class="carousel-img">
            </Carousel-item>
          </Carousel>
        </Col>
        <Col :sm="{span: 6}">
          <Card id="notice-card">
            <p slot="title">一段文字</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ipsum amet atque quasi perspiciatis, vel, nihil, adipisci
              quaerat modi veritatis similique sunt iure, praesentium aut ad ipsa deserunt distinctio harum! </p>
          </Card>
        <Col :sm="1"></Col>
        </Col>
        <div>
            <Card class="adcards">
            <div>
              <img src="../assets/logo.png">
              <h3>广告位</h3>
            </div>
            </Card>
            <Card class="adcards">
              <div>
                <img src="../assets/logo.png">
                <h3>又一个广告位</h3>
              </div>
            </Card>
            <Card class="adcards">
              <div>
                <img src="../assets/logo.png">
                <h3>还是广告位</h3>
              </div>
            </Card>
        </div>
      </Col>
    </Row>
    <br>
    <recommend></recommend>
  </div>
</template>

<script>
  import recommendPage from '../pages/recommendPage.vue'
  export default {
    name: 'index',
    components: {
      'recommend': recommendPage,
    },
    data() {
      return {
        name: 'index',
        theme: 'light',
        carouselIndex: 0,
        CarouselSetting: {
          autoplay: true,
          autoplaySpeed: 2000,
          dots: 'inside',
          trigger: 'click',
          arrow: 'hover',
        },
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
    width: 304px;
    margin: 5px 0px 0px 20px;
    background-color: #ecf0f1;
  }

  .adcards img {
    height: 80px;
  }

</style>
