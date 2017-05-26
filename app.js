// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const router = require('koa-router')();
const multer = require('koa-multer');
const bodyParser = require('koa-bodyparser');
const server = require('koa-static');
const path = require('path');
const url = require('url');
const fs = require('fs');
 
// 创建一个Koa对象表示web app本身:
const app = new Koa();
// SQL 连接池
const pool = require('./module/sqlpool.js');

app.use(bodyParser());
app.use(server(path.resolve('./staticPages')));

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async(ctx, next) => {
  console.log(`process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});

// 根目录请求交给 vue-router 处理
router.get('/', async(ctx, next) => {
  // ctx.response.redirect('#');
});

// 登出
router.get('/api/logout', async(ctx, next) => {
  var now = new Date();
  var time = now.getTime();
  ctx.cookies.set(
    'uid',
    undefined, {
      domain: 'localhost', // 写cookie所在的域名
      path: '/', // 写cookie所在的路径
      expires: now,
    }
  )
  ctx.response.body = {
    status: 200
  }
});

// 登录
router.post('/api/login', async(ctx, next) => {
  var
    uid = ctx.request.body.id || '',
    pwd = ctx.request.body.password || '';
  var query = function (uid, pwd) {
    var id = uid,
      password = pwd;
    return new Promise(function (resolve, reject) {
      pool.getConnection(function (err, connection) {
        if (err) {
          // 连接数据库出错
          reject({
            status: 'connection failed'
          });
        } else {
          // 进入查询
          connection.query({
            sql: `SELECT * from user where uid = '${id}' and password = '${password}'`
          }, function (err, rows, fields) {
            connection.release();
            if (err) {
              // 查询错误
              reject({
                status: 'query error'
              })
            } else {
              if (rows.length == 1) {
                // 登录成功
                resolve({
                  status: 'success',
                  id: id
                })
              } else {
                // 登录失败
                reject({
                  status: 'failed'
                })
              }
            }
          });
        }
      });
    });
  }
  try {
    ctx.body = await query(uid, pwd);
    // 登录成功，写 cookie
    ctx.cookies.set(
      'uid',
      uid, {
        domain: 'localhost', // 写cookie所在的域名
        path: '/', // 写cookie所在的路径
        maxAge: 24 * 60 * 60 * 1000, // cookie有效时长
        httpOnly: false, // 是否只用于http请求中获取
        overwrite: false // 是否允许重写
      }
    )
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

// 收藏书籍
router.post('/api/favorite-books', async(ctx, next) => {
  var uid = ctx.request.body.id || '';
  if (uid == '') {
    ctx.status = 200;
    ctx.body = null;
  } else {
    var queryString = `SELECT * FROM book, favorite WHERE uid = '${uid}' and book.bid = favorite.bid`;

    try {
      ctx.body = await querySQL(queryString);
    } catch (e) {
      console.log(e);
      ctx.body = e;
    }
  }
});

// 删除收藏
router.post('/api/delete-favorite-books', async(ctx, next) => {
  var uid = ctx.request.body.id || '',
    booksToDel = ctx.request.body.bids || [];
  var queryString = `DELETE FROM favorite WHERE uid = '${uid}' and (`;

  for (var i = 0; i < booksToDel.length; i++) {
    queryString = queryString + `bid = ${booksToDel[i]}`
    if (i != booksToDel.length - 1) {
      queryString = queryString + ' or ';
    } else {
      queryString = queryString + ')';
    }
  }

  try {
    ctx.body = await querySQL(queryString);
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

// 获取所有书籍
router.get('/api/get-all-books', async(ctx, next) => {
  var queryString = 'SELECT * FROM book';

  try {
    ctx.status = 200;
    ctx.body = await querySQL(queryString);
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
})

// 添加收藏
router.post('/api/add-favorite-books', async(ctx, next) => {
  var uid = ctx.request.body.id || '',
    bid = ctx.request.body.bid || '';

  var queryString = `INSERT INTO favorite (uid, bid) VALUES ('${uid}', ${bid})`;

  try {
    ctx.body = await querySQL(queryString);
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

// 获取我的作品
router.post('/api/get-my-works', async(ctx, next) => {
  var uid = ctx.request.body.id || '';

  var queryString = `SELECT * FROM book JOIN bookDetail ON book.bid = bookDetail.bid WHERE book.author = '${uid}'`;

  try {
    ctx.body = await querySQL(queryString);
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

// 发布新作品
router.post('/api/post-new-work', async(ctx, next) => {
  var newPost = ctx.request.body;
  console.log(newPost);
  var d = new Date();
  var coverURL = newPost.coverURL || 'default';
  d = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  var queryString = 
    'INSERT INTO book (bid, title, author, coverURL, date, description, subtitle, category, tag, status, price) '+
    `VALUES (NULL, '${newPost.title}', '${newPost.author}', '${coverURL}','${d}', '${newPost.description}', '${newPost.subtitle}', '${newPost.category}', '${newPost.tag}', '连载中', ${newPost.price});`;
    
  try {
    ctx.body = await querySQL(queryString);
  } catch (e) {
    console.log(e);
    ctx.body = e;
  } 
});

// 删除我的作品
router.post('/api/delete-my-work', async(ctx, next) => {
  var bid = ctx.request.body.bid;
  var queryString = `DELETE FROM book WHERE book.bid = ${bid}`;

  try {
    ctx.body = await querySQL(queryString);
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

// 获取书籍类别
router.get('/api/get-categories', async(ctx, next) => {
  var queryString = 'SELECT * FROM category';
  try {
    ctx.body = await querySQL(queryString);
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

// 上传新章节
router.post('/api/upload-new-chapter', async(ctx, next) => {
  var bid = ctx.request.body.bid || 0,
      chapterIndex = ctx.request.body.chapterIndex || 0,
      title = ctx.request.body.title || '',
      content = ctx.request.body.content || '';
  var queryString = 
    'INSERT INTO bookChapters (bid, chapterIndex, chapterTitle, content) VALUES'+
    `(${bid}, ${chapterIndex}, '${title}', '${content}')`;
  try {
    ctx.body = await querySQL(queryString);
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

router.post('/api/get-book-info-by-title', async(ctx, next) => {
  var bookTitle = ctx.request.body.bookTitle || '';
  var queryString = `SELECT * FROM book WHERE book.title = '${bookTitle}'`;

  try {
    var response = await querySQL(queryString);
    ctx.body = response;
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

// 获取书本的所有章节
router.post('/api/get-book-chapters', async(ctx, next) => {
  var bid = ctx.request.body.bid || '';
  var queryString = `SELECT chapterTitle FROM bookChapters WHERE bid = '${bid}' ORDER BY chapterIndex`;

  try {
    var response = await querySQL(queryString);
    ctx.body = response;
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

// 获取章节详情
router.post('/api/get-chapter', async(ctx, next) => {
  var bid = ctx.request.body.bid || '',
      chapterIndex = ctx.request.body.chapterIndex || 0;
  var queryString = 'SELECT chapterTitle, content FROM bookChapters WHERE bid = '+
                    `'${bid}' and chapterIndex = ${chapterIndex}`;
  try {
    var response = await querySQL(queryString);
    ctx.body = response;
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

// 购买起点币
router.post('/api/purchase', async(ctx, next) => {
  var id = ctx.request.body.id || '',
      money = ctx.request.body.money || 0,
      generateTime = (new Date());
      generateTime = generateTime.toLocaleDateString().replace(/\//g, '-') 
                + ' ' 
                + generateTime.toTimeString().split(' ')[0];
  console.log(generateTime);
  var queryString = 'INSERT INTO vipOrder (uid, mid, generateTime, completed, money) VALUES('+
                    `'${id}', 'qidian', '${generateTime}', 0, ${money})`;
  try {
    await querySQL(queryString);
    ctx.body = {
      id: id,
      mid: 'qidian',
      generateTime: generateTime
    };
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

// 获取账户余额
router.post('/api/get-balance', async(ctx, next) => {
  var id = ctx.request.body.id || '';
  var queryString = `SELECT balance FROM qidianbi WHERE uid = '${id}'`;
  try {
    var response = await querySQL(queryString);
    ctx.body = response;
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

// 付款
router.post('/api/pay', async(ctx, next) => {
  var href = ctx.request.body.url || '',
      query = url.parse(href, true).query,
      amount = ctx.request.body.amount || 0;
  var queryString = 'UPDATE vipOrder set completed = 1 WHERE '+
                    `uid = '${query.id}' and mid = '${query.mid}' and generateTime = '${query.generateTime}'`;
  try {
    var response = await querySQL(queryString);
    // 付款成功
    queryString = `SELECT * FROM qidianbi WHERE uid = '${query.id}'`;
    try {
      response = await querySQL(queryString);
      var balance = 0;
      if (response.rows.length == 1) {
        // 已经充值过的处理
        balance = response.rows[0].balance;
      }
      balance += amount;
      if (response.rows.length == 0) {
        queryString = 'INSERT INTO qidianbi (uid, balance) VALUES'
                              + `('${query.id}', ${balance})`;
      } else {
        queryString = `UPDATE qidianbi SET balance = ${balance} WHERE uid = '${query.id}'`;
      }
      try {
          response = await querySQL(queryString);
          ctx.body = {
            status: 'success'
          }
      } catch (e) {
        console.log(e);
        ctx.body = {
          status: 'failed',
          message: '充值失败'
        }
      }
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 'failed',
        message: '查询余额失败'
      }
    }
  } catch (e) {
    console.log(e);
    ctx.body = {
      status: 'failed',
      message: '付款失败'
    }
  }
});

// 获取付款状态
router.post('/api/purchase-status', async(ctx, next) => {
  var query = ctx.request.body.query || {};
  var queryString = 'SELECT completed FROM vipOrder WHERE '+
                    `uid = '${query.id}' and mid = '${query.mid}' and generateTime = '${query.generateTime}'`;
  try {
    var response = await querySQL(queryString);
    if (response.rows.length != 0) {
      var completed = response.rows[0].completed;
      if (completed != 0) {
        ctx.body = { status: 'success' };
      } else {
        ctx.body = { status: 'failed' };
      }
    } else {
      ctx.body = { status: 'failed' };
    }
  } catch (e) {
    console.log(e);
    ctx.body = e;

  }
});

// 获取订单详情
router.post('/api/get-order-info', async(ctx, next) => {
  var href = ctx.request.body.url || '',
      query = url.parse(href, true).query;
  var queryString = 'SELECT * FROM vipOrder WHERE '
                   +`uid = '${query.id}' and mid = '${query.mid}' and generateTime = '${query.generateTime}'`;
  try {
    var response = await querySQL(queryString);
    ctx.body = response;
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

// 登录银行账户
router.post('/api/bank-account-login', async(ctx, next) => {
  var
    uid = ctx.request.body.bankID || ' ',
    pwd = ctx.request.body.bankPW || ' ';
  console.log("uid: " + uid + ' pwd: ' + pwd);
  var queryString = `SELECT * from bankAccount where uid = '${uid}' and password = '${pwd}'`;
  
  try {
    var response = await querySQL(queryString);
    if (response.rows.length == 0) {
      ctx.body = {
        status: 'failed',
        message: 'login failed'
      }
    } else {
      ctx.body = {
        status : 'success'
      }
    }
  } catch (e) {
    console.log(e);
    ctx.body = {
      error: e,
      status: 'failed'
    }
  }
});

// koa-multer 用于图片上传
const upload = multer({ dest: './staticPages/covers/' });
// 处理封面上传
router.post('/api/upload-cover', upload.single('cover'), async(ctx) => {
  console.log(ctx.req.file);
  ctx.body = {
    name: ctx.req.file.filename,
    url: ctx.req.file.path.split('/').slice(-1)
  };
}); 

// 删除已上传的封面
router.post('/api/delete-cover', async(ctx, next) => {
  var url = ctx.request.body.url[0];
  console.log(url);
  fs.unlinkSync('./staticPages/covers/'+url);
  ctx.body = {
    status: 'success'
  }
});

// 购买章节
router.post('/api/order-chapter', async(ctx, next) => {
  var uid = ctx.request.body.id || '',
      bid = ctx.request.body.bid || 0,
      chapterIndex = ctx.request.body.chapterIndex || 0,
      isAuthor = ctx.request.body.isAuthor || false;
  var orderQueryString = 'INSERT INTO orderChapter (uid, bid, chapterIndex) VALUES('+
                    `'${uid}', ${bid}, ${chapterIndex})`;
  var chapterPriceQueryString = `SELECT price FROM book WHERE bid = ${bid}`,
      payQueryString = `UPDATE qidianbi SET balance = ${balance} WHERE uid = '${query.id}'`;
});

function querySQL(queryString) {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject({
          status: 'connection failed'
        })
      } else {
        console.log(queryString);
        connection.query({
          sql: queryString
        }, function (err, rows, fields) {
          connection.release();
          if (err) {
            // 查询错误
            console.log('查询错误: ' + err);
            reject({
              status: 'query error'
            })
          } else {
            // console.log('查询结果: ' + rows);
            resolve({
              status: 'success',
              rows: rows
            })
          }
        });
      }
    })
  })
}



app.use(router.routes());
// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');