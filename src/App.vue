<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.layout-logo {
  width: 100%;
  position: relative;
  margin: auto;
}

.layout-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  display: flex;
}

.layout-copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}

.layout-ceiling {
  background: rgb(247, 247, 247);
  padding: 10px 0;
  overflow: hidden;
}

.layout-ceiling-right {
  float: right;
  margin-right: 15px;
}

.layout-ceiling-right a {
  color: rgb(38, 38, 38);
  margin-right: 5px;
  margin-left: 5px;
}

#ceiling-register {
  color: #aaa;
}

.layout-ceiling-right a:hover, #ceiling-register:hover{
  /*登录、注册按钮 hover 状态颜色*/
  color: #27ae60;
}

.layout-ceiling-right span {
  color: #ccc;
}
</style>

<template>
  <div id="app">
    <!--顶栏-->
    <div class="layout-ceiling">
      <div class="layout-ceiling-right">
        <a href="#/">登录</a> 
        <span>|</span>
        <a href="#/" id="ceiling-register">注册</a>
      </div>
    </div>
  
    <!--Logo、搜索框一行-->
    <Row type="flex" justify="center" align="middle" class="row">
      <Col :xs="2" :sm="{span: 1, offset: 1}" class="Col-logo">
        <img src="../src/assets/logo.png" alt="logo" id='logo' class="layout-logo">
      </Col>
      <Col :xs="0" :sm="2">
        <h1>VueTest</h1>
      </Col>
      <Col :xs="{span: 14, offset: 2}" :sm="12">
        <el-input
          v-model="searchInput"
          icon="search"
        >

        </el-input>
      </Col>
      <Col :xs="{span: 2, offset: 2}" :sm="4">
        <el-button icon="share" @click="showNothing">
          一个按钮
        </el-button>
      </Col>
    </Row>

    <Menu mode="horizontal" :theme="theme" active-name="1" id="mainNav" @on-select="activeMenuItem($event)">
      <Menu-item name="1" :class="['mainNav-item', {'mainNav-item-actived': activedMenuItem['1']}]">
        <!--<Icon type="ios-home"></Icon>-->
        <i class="el-icon-star-on"></i>
        首页
      </Menu-item>
      <Menu-item name="2" :class="['mainNav-item', {'mainNav-item-actived': activedMenuItem['2']}]">
        <!--<Icon type="ios-nutrition"></Icon>-->
        <i class="el-icon-menu"></i>
        分类浏览
      </Menu-item>
      <Menu-item name="3" :class="['mainNav-item', {'mainNav-item-actived': activedMenuItem['3']}]">
        <!--<Icon type="ios-paper"></Icon>-->
        <i class="el-icon-upload"></i>
       电子图书
      </Menu-item>
    </Menu>
    <router-view></router-view>
    <hr>
    <div class="layout-copy">
      2017-2018 &copy; Patrick
    </div>    
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: 'app',
      theme: 'dark',  //Menu 主题
      search: '',     //搜索框值
      notXsDevice: window.innerWidth > 768, //判断当前页面宽度
      activedMenuItem: {"1": true, "2": false}, //Menu item 样式设置需要
      searchInput: '',
    }
  },
  methods: {
    showNothing: function () {
      this.$message({
        message: '啥都没有',
        type: 'success'
      });
    },
    activeMenuItem: function (itemIndex) {
      for (var item in this.activedMenuItem) {
        if (itemIndex === item) {
          this.activedMenuItem[item] = true;
        } else {
          this.activedMenuItem[item] = false;
        }
      }
    }
  },
  mounted: function () {
    var that = this;
    window.onresize = function () {
      that.notXsDevice = window.innerWidth > 768;
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}

.Col-logo {
  display: flex; 
  align-items: center;
}

#mainNav {
  height: 40px;
  background-color: rgb(62, 61, 67);
}

.mainNav-item {
  left: 53px;
  line-height: 38px;
  border-top: 2px solid rgba(0, 0, 0, 0);
}

.mainNav-item-actived, .mainNav-item:hover{
  background-color: rgb(49, 48, 53);
  border-top: 2px solid #27ae60;
}

hr {
    border: none;
    height: 1px;
    background-color: lightgray;
    margin: 0 5%;
    margin-top: 15px;
    width: auto;
  }

.row {
   margin: 15px 0px;
}
</style>

<style>

</style>