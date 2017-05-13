// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const server = require('koa-static');
const path = require('path');
// 创建一个Koa对象表示web app本身:
const app = new Koa();

app.use(bodyParser());

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    console.log(`process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

router.get('/hello/:name', async(ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = `<h1>hello ${name}</h1>`;
});

router.get('/', async(ctx, next) => {
    // ctx.response.redirect('#');
});


router.get('/api/logout', async (ctx, next) => {
    var now = new Date();
    var time = now.getTime();
    time -= 60 * 1000;
    now.setTime(time);
    ctx.cookies.set(
      'cid', 
      undefined,
      {
        domain: 'localhost',  // 写cookie所在的域名
        path: '/',       // 写cookie所在的路径
        expires: now,
      }
    )
    ctx.response.body = {
        status: 200
    }
});

router.post('/api/login', async (ctx, next) => {
    var
        id = ctx.request.body.id || '',
        password = ctx.request.body.password || '';
    ctx.response.body = {
        id: id,
        status: 'success'
    }
    ctx.cookies.set(
      'cid', 
      id,
      {
        domain: 'localhost',  // 写cookie所在的域名
        path: '/',       // 写cookie所在的路径
        maxAge: 10 * 60 * 1000, // cookie有效时长
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: false  // 是否允许重写
      }
    )
});

app.use(router.routes());
// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');