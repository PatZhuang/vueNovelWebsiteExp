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

.layout-copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
  font-size: 12px;
}

.layout-ceiling {
  background: rgb(247, 247, 247);
  padding: 8px 0;
  overflow: hidden;
}

.layout-ceiling-right {
  float: right;
  margin-right: 15px;
}

.layout-ceiling-right .separator {
  color: #ccc;
}

.layout-ceiling-btns {
  color: rgb(38, 38, 38);
  margin-right: 5px;
  margin-left: 5px;
  background: none;
  padding: 0;
  border: none;
  font-size: 12px;
}

.layout-ceiling-btns:hover {
  color: #27ae60;
}

</style>

<template>
  <div id="app">
    <!--顶栏-->
    <div class="layout-ceiling">
      <div class="layout-ceiling-right">
        <div v-show="!signed">
          <el-button type="text" class="layout-ceiling-btns" @click="loginDialog = true">登录</el-button>
          <span class="separator">|</span>
          <el-button type="text" class="layout-ceiling-btns" style="color: #aaa">注册</el-button>
        </div>
        <div v-show="signed">
          <span style="font-size: 14px;">Hello, </span>
          <el-button class="layout-ceiling-btns">{{ ID }}</el-button>
          <el-button type="text" class="layout-ceiling-btns" @click="logout" style="color: #aaa">退出登录</el-button>
        </div>
      </div>
    </div>
  
    <!--登录框-->
    <el-dialog 
      :visible.sync="loginDialog" 
      size="tiny"
    >
      <div slot="title" style="color: #27ae60; font-size: 16px; display: inline-block">账号登录</div>
          <el-form ref="form" :model="form" style="margin-top: -20px">
            <el-input placehoder="请输入用户名" class="modal-login" v-model="form.id" :autofocus="true">
              <template slot="prepend">用户名：</template>
            </el-input>
            <el-input placehoder="请输入密码" type="password" class="modal-login" v-model="form.password">
              <template slot="prepend">密码： &nbsp;&nbsp;&nbsp;</template>
            </el-input>
          </el-form>
            <el-button type="success" size="large" style="width: 95%; margin-top: 10px;" @click="login">登录</el-button>
    </el-dialog>

    <!--Logo、搜索框一行-->
    <el-row type="flex" justify="space-between" align="middle" class="row" style="height: 53px">
      <el-col :xs="2" :sm="{span: 1, offset: 1}" class="el-col-logo">
        <img src="../src/assets/logo.png" alt="logo" id='logo' class="layout-logo">
        <h1 style="font-size: 24px; margin-left: 10px;">VueTest</h1>
      </el-col>
      <el-col :xs="{span: 14, offset: 2}" :sm="{span: 12, offset: 2}">
        <el-input
          v-model="searchInput"
          icon="search"
        >
        </el-input>
      </el-col>
      <el-col :xs="{span: 2, offset: 2}" :sm="4">
        <el-button icon="share" @click="show_nothing">
          一个按钮
        </el-button>
      </el-col>
    </el-row>

    <!--导航栏-->
    <el-menu mode="horizontal" :default-active="this.$route.path" id="mainNav" router>
      <el-menu-item
        :index="item.path"
        :class="['mainNav-item', {'mainNav-item-actived': active_menu_item(item.path)}]"
        v-for="(item, index) in nav"
        :route="{path: item.path}"
        v-show="show_menu_item(index)"
        :key="item.path"
      >
      <i :class="item.icon"></i>
      {{item.name}}
      </el-menu-item>
    </el-menu>
    <router-view></router-view>
    <hr>
    <!--页脚-->
    <div class="layout-copy">
      2017-2018 &copy; Patrick
    </div>    
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: 'app',
      theme: 'dark',  //el-menu 主题
      search: '',     //搜索框值
      notXsDevice: window.innerWidth > 768, //判断当前页面宽度
      activedMenuItem: [true, false, false, false], //el-menu item 样式设置需要
      nav: [
        {
          name: '首页',
          path: '/',
          icon: 'el-icon-star-on',
        },
        {
          name: '分类浏览',
          path: '/category',
          icon: 'el-icon-menu',
        },
        {
          name: '我的收藏',
          path: '/favorite',
          icon: 'el-icon-star-off',
        }
      ],
      searchInput: '',
      loginDialog: false,
      signed: false,
      ID: "",
      form: {
        id: '',
        password: '',
      },
      id: "",
    }
  },
  methods: {
    show_nothing: function () {
      this.$message({
        message: 'Nothing',
        type: 'success'
      });
    },
    active_menu_item: function (path) {
      return path === this.$route.path;
    },
    show_menu_item: function (index) {
      switch (index) {
        case 0:
        case 1:
          return true;
        case 2:
          return this.signed? true : false;
        default:
          return false;
      }
    },
    login: function () {
      var that = this;
      this.$http.post('/api/login', {
        id: this.form.id,
        password: this.form.password
      })
      .then(function (response) {
        if (response.data.id) {
          that.ID = response.data.id;
          that.signed = true;
          that.form = {
            id: '',
            password: ''
          };
          that.$message({
            message: '登录成功！',
            type: 'success'
          }); 
        } else {
          that.form.password = '';
          that.$message({
            message: '登录失败！',
            type: 'warning'
          });
        }
        
      })
      .catch(function (error) {
        console.log(error);
      });
      this.loginDialog = false;
    },
    logout: function () {
      var that = this;
      this.$http.get('/api/logout')
      .then(function (response) {
        that.ID = "";
        that.signed = false;
        that.$message({
          message: '已退出登录。',
          type: 'success'
        });
        that.$router.push('/');
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  },
  mounted: function () {
    var that = this;
    window.onresize = function () {
      that.notXsDevice = window.innerWidth > 768;
    };
    this.ID = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/, "$1") || "";
    if (this.ID !== "" && this.ID !== null && this.ID) {
      this.signed = true;
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

.el-col-logo {
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
  border: none;
  border-top: 2px solid rgba(0, 0, 0, 0);
  height: 100%;
  color: lightgray;
  background: none;
}

.mainNav-item-actived, .mainNav-item:hover{
  color: white;
  background-color: rgb(49, 48, 53);
  border: none;
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

.modal-login {
  margin: 10px; 
  width: auto;
}
</style>

<style>
  a {
    text-decoration: none;
  }

  a:hover {
    color: #27ae60;
  }

  body {
    margin: 0;
  }
</style>
