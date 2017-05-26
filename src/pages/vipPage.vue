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
                    <el-form-item label="账户余额" label-width="100px">
                        <span style="text-algin:left; 
                                    font-size: 20px;
                                    font-weight: 500;
                                    color: #e74c3c;
                                    margin-left: 40px">
                            {{form.balance || 0}} 起点币
                        </span>
                    </el-form-item>
                </el-form>  
            </el-col>
            <el-col :span="12" :offset="3">
                <el-form ref="form" :model="form" label-width="80px" style="text-align: left;">
                <el-form-item label="充值对象">
                <el-input v-model="form.id" style="width: 300px;" disabled></el-input>
                </el-form-item>
                <el-form-item label="充值数量">
                    <el-input-number v-model="form.amount" :step="10" :min="10"></el-input-number>
                </el-form-item>
                <el-form-item label="支付方式">
                <el-select v-model="form.method" placeholder="请选择支付方式">
                    <el-option label="支付宝" value="alipay"></el-option>
                    <el-option label="微信支付" value="weChatPay"></el-option>
                    <el-option label="银联" value="UnionPay"></el-option>
                    <el-option label="paypal" value="paypal"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="应付金额">
                    &nbsp;
                    <span style="color: #e74c3c; font-size: 20px; font-weight: 600;">{{form.amount / 10}}</span>
                    <span>元</span>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit(this)">付款</el-button>
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
          amount: 10,
          balance: null,
          method: 'alipay'
        },
        labelPos: 'top',
        query: {
            id: '',
            mid: '',
            generateTime: ''
        }
      }
    },
    methods: {
      order() {
        var that = this;
        return new Promise(function (resolve, reject) {
          that.$http.post('/api/purchase', {
              id: that.form.id,
              money: that.form.amount / 10
            })
            .then(function (response) {
              console.log(response.data);
              that.query.id = response.data.id || '';
              that.query.mid = response.data.mid || '';
              that.query.generateTime = response.data.generateTime || '';
              resolve('ok');
            })
            .catch(function (error) {
              console.log(error);
              reject('failed');
            })
        })
      },
      payVip: async(that) => {
        try {
            await that.order();
            var queryString = `?id=${that.query.id}&`
                             +`mid=${that.query.mid}&`
                             +`generateTime=${that.query.generateTime}`;
            location.href = 'http://localhost:3000/index.html' + queryString; 
        } catch (e) {
            console.log(e);
        }
      },
      onSubmit() {
          this.payVip(this);            
      },
      getBalance() {
          var that = this;
          this.$http.post('/api/get-balance', {
              id: this.form.id
          })
          .then(function (response) {
              if (response.data.rows.length == 0) {
                  that.form.balance = 0;
              } else {
                  that.form.balance = response.data.rows[0].balance;
              }
          })
          .catch(function (error) {
              console.log(error);
          })
      }
    },
    mounted: function () {
        this.form.id = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/, "$1") || "";
        this.getBalance();
    }
  }
  

</script>
