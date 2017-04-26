<template>
  <div>
    <Row type="flex" align="top" justify="center">
      <Col :sm="1">
      <!--占位-->
      </Col>
      <Col :sm="4">
        <Card :bordered="false" :dis-hover="true" :padding="0">
          <p slot="title">新书速递</p>
          <p v-for="book in newBooks" class="book-bulletin-item">
            <span class="book-bulletin-title"><a href="">{{ book.title }}</a></span>
            <span class="book-bulletin-author">{{ book.author }}</span>
          </p>
        </Card>
      </Col>
      <Col :sm="14" style="padding: 0px 10px">
        <Row>
          <Carousel 
          v-model="bookCarousel" 
          :dots="bookCarouselSetting.dots" 
          :autoplay="bookCarouselSetting.autoplay"
          class="book-carousel">
              <Carousel-item>
                  <div class="book-carousel-item" style="background-color: #2ecc71"></div>
              </Carousel-item>
              <Carousel-item>
                  <div class="book-carousel-item" style="background-color: #27ae60"></div>
              </Carousel-item>
              <Carousel-item>
                  <div class="book-carousel-item" style="background-color: #1abc9c"></div>
              </Carousel-item>
              <Carousel-item>
                <div class="book-carousel-item" style="background-color: #16a085"></div>
              </Carousel-item>
          </Carousel>
        </Row>
        <Row>
          <Col :sm="8" v-for="book in bookStore1">
            <Card class="card-info" :padding="10" :dis-hover="true" :bordered="false">
              <div>
                <a href="">{{book.title}}</a>
                <p class='book-price'>￥{{book.price}}</p>
                <p class="book-description">{{book.description}}</p> 
              </div>
            </Card>
          </Col>
        </Row>
        <br>
        <hr style="margin: 0px 15px">
        <br>
        <Row>
          <Col :sm="8" v-for="book in bookStore2">
            <Card class="card-info" :padding="10" :dis-hover="true" :bordered="false">
              <div>
                <a href="">{{book.title}}</a>
                <p class='book-price'>￥{{book.price}}</p>
                <p class="book-description">{{book.description}}</p> 
              </div>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col :sm="4">
        <Card :bordered="false" :dis-hover="true" :padding="0">
          <p slot="title">最受关注图书</p>
          <p v-for="book in popBooks" class="book-bulletin-item">
            <span class="book-bulletin-title"><a href="">{{ book.title }}</a></span>
            <span class="book-bulletin-author">{{ book.author }}</span>
          </p>
        </Card>
      </Col>
      <Col :sm="1">
      <!--占位-->
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        newBooks: [{
            title: '星星上的人',
            author: '卡罗琳·帕克斯特'
          },
          {
            title: '午夜起来听寂静',
            author: '周云蓬'
          },
          {
            title: '文案觉醒',
            author: '朱家安'
          },
          {
            title: '晓松奇谈·世界卷',
            author: '高晓松'
          },
          {
            title: '彩色的中国',
            author: '翁乃强'
          },
          {
            title: '找麻烦是我的职业',
            author: '雷蒙德·钱德勒'
          },
          {
            title: '东风',
            author: '理查德·沃林'
          },
          {
            title: '坏一坏',
            author: '凉炘'
          },
          {
            title: '善变的色彩',
            author: '米歇尔·帕斯图鲁等2人'
          },
          {
            title: '处男葛不垒',
            author: '徐皓峰'
          }
        ],
        popBooks: [{
            title: '散步去',
            author: '谷口治郎'
          },
          {
            title: '好好学习',
            author: '成甲'
          },
          {
            title: '百鬼夜行 阳',
            author: '京极夏彦'
          },
          {
            title: '地理学与生活',
            author: '阿瑟·格蒂斯等3人'
          },
          {
            title: '地下铁道',
            author: '科尔森·怀特黑德'
          },
          {
            title: '如果没有今天',
            author: '伊夫·博萨尔特'
          },
          {
            title: '被占的宅子',
            author: '胡利奥·科塔萨尔'
          },
          {
            title: '北京的城墙与城门',
            author: '喜仁龙'
          },
          {
            title: '驻马店上新故事集',
            author: '郑在欢'
          },
          {
            title: '午夜起来听寂静',
            author: '周云蓬'
          }
        ],
        bookCarousel: 0,
        bookCarouselSetting: {
          dots: 'outside',
          autoplay: true,
        },
        bookStore1: [
          {title: '被遗忘与被仰望的', price: 45.50, description: '20世纪最伟大的非虚构书写，全世界特稿写作者的典范'},
          {title: '百鬼夜行 阳', price: 34.30, description: '\"世界上没有不可思议的事\"，京极夏彦的妖怪十夜谈'},
          {title: '造物', price: 47.60, description: '改变世界的玩物图点，3000幅图里的发明与冒险'},
        ],
        bookStore2: [
          {title: '山之四季', price: 22.40, description: '一个人在山里住七年，日本桂冠诗人山居笔记'},
          {title: '现世', price: 27.30, description: '时间和世界的秘密，普利策奖得主的万物之书'},
          {title: '我在天堂那五年', price: 33.60, description: '不可思议的友谊奇迹，人生路上柔软的智慧之光'},
        ],
      }
    }
  }
</script>


<style lang="">
  .book-bulletin-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 2px;
  }
  
  .book-bulletin-title {
    font-size: 16px;
  }

  .book-bulletin-title>a {
    color: black;
  }
  
  .book-bulletin-title>a:hover {
    color: #27ae60;
  }

  .book-bulletin-author {
    font-size: 12px;
    color: #ccc;
  }
  
  .book-description {
    font-size: 13px;
    color: #666;
  }
  .card-info {
    text-align: left;
    line-height: 1.62em;
  }

  .card-info a {
    color: black;
    font-size: 16px;
  }

  .card-info a:hover {
    color: #27ae60;
  }

  .card-info .book-price {
    color: red;
    font-size: 16px;
    font-weight: 500;
  }

  hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #ccc;
    margin: 1em 0px;
    padding: 0; 
  }

  .book-carousel-item {
    height: 120px;
    background-color: #27ae60;
  }

  .book-carousel {
    margin: 0 10px;
  }
</style>
