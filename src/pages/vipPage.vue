<template>
  <div style="margin-top: 30px">
        <el-row>
            <el-col :span="4" :offset="5">
                <el-form :model="form" style="text-align: left;" :label-position="labelPos">
                    <el-form-item label="ID" label-width="100px">
                        <span style="text-algin:left; font-size: 20px; margin-left: 40px">
                            {{form.id}}
                        </span>
                    </el-form-item>
                    <el-form-item label="到期时间" label-width="100px">
                        <span style="text-algin:left; 
                                    font-size: 20px;
                                    font-weight: 500;
                                    color: #e74c3c;
                                    margin-left: 40px">
                            {{form.vipExpiration}} 
                        </span>
                        <!--<span style="font-size: 14px;">天</span>-->
                    </el-form-item>
                </el-form>  
            </el-col>
            <el-col :span="12" :offset="3">
                <el-form ref="form" :model="form" label-width="80px" style="text-align: left;">
                <el-form-item label="开通对象">
                <el-input v-model="form.id" style="width: 300px;" disabled></el-input>
                </el-form-item>
                <el-form-item label="开通时长">
                <el-select v-model="form.duration" placeholder="请选择开通时长">
                    <el-option label="1个月" value="1"></el-option>
                    <el-option label="3个月" value="3"></el-option>
                    <el-option label="6个月" value="6"></el-option>
                    <el-option label="12个月" value="12"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="开通方式">
                <el-select v-model="form.method" placeholder="请选择开通方式">
                    <el-option label="支付宝" value="alipay"></el-option>
                    <el-option label="微信支付" value="weChatPay"></el-option>
                    <el-option label="银联" value="UnionPay"></el-option>
                    <el-option label="paypal" value="paypal"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="应付金额">
                    &nbsp;
                    <span style="color: #e74c3c; font-size: 20px; font-weight: 600;">{{form.duration * 10}}</span>
                    <span>元</span>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">付款</el-button>
                    <el-button type="plain" @click="onCancel">取消</el-button>
                </el-form-item>
                </el-form>
            </el-col>
        </el-row>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        form: {
          id: '',
          vipExpiration: '',
          duration: '1',
          method: 'alipay'
        },
        labelPos: 'top'
      }
    },
    methods: {
      onSubmit() {
          var payWindow = window.open('http://localhost:3000/index.html', '_blank');
          var that = this;
          this.$http.post('/api/purchase-vip', {
              id: this.form.id,
              money: this.form.duration * 10
          })
          .then(function (response) {
              console.log(response.data);
              payWindow.location.href = payWindow.location.href
                                        +`?id=${response.data.id}&`
                                        +`mid=${response.data.mid}&`
                                        +`generateTime=${response.data.generateTime}`;
              that.$alert('请前往付款页面付款', '等待付款', {
                confirmButtonText: '确定',
                cancelButtonClass: '取消',
                callback: action => {
                    that.$message({
                        type: 'info',
                        message: `action: ${ action }`
                    });
                }
              });
              console.log(response);
          })
          .catch(function (error) {
              console.log(error);
          })
      },
      onCancel() {
        
      },
      getVipExpiration() {
          var that = this;
          this.$http.post('/api/get-vip-expiration', {
              id: this.form.id
          })
          .then(function (response) {
              if (response.data.rows.length == 0) {
                  that.form.vipExpiration = '已过期';
              } else {
                var expireDate = new Date(response.data.rows[0].expiration); 
                that.form.vipExpiration = expireDate.toLocaleDateString();
              }
          })
          .catch(function (error) {
              console.log(error);
          })
      }
    },
    mounted: function () {
        this.form.id = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/, "$1") || "";
        this.getVipExpiration();
    }
  }
  

</script>
