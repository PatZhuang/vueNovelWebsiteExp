// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const server = require('koa-static');
const path = require('path');
const url = require('url');
// 创建一个Koa对象表示web app本身:
const app = new Koa();

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
  var d = new Date();
  d = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  var queryString = 
    'INSERT INTO `book` (`bid`, `title`, `author`, `date`, `description`, `subtitle`, `category`, `tag`, `status`) '+
    `VALUES (NULL, '${newPost.title}', '${newPost.author}', '${d}', '${newPost.description}', '${newPost.subtitle}', '${newPost.category}', '${newPost.tag}', '连载中');`;
    
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

// 获取书籍的所有章节
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

// 获取书本的所有章节
router.post('/api/get-book-chapters', async(ctx, next) => {
  var bookTitle = ctx.request.body.bookTitle || '';
  var queryString = `SELECT chapterTitle FROM bookChapters JOIN book on book.bid = bookChapters.bid WHERE book.title = '${bookTitle}' ORDER BY chapterIndex`;

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
  var bookTitle = ctx.request.body.bookTitle || '',
      chapterIndex = ctx.request.body.chapterIndex || 0;
  var queryString = 'SELECT chapterTitle, content FROM bookChapters JOIN book ON book.bid = bookChapters.bid WHERE book.title = '+
                    `'${bookTitle}' and chapterIndex = ${chapterIndex}`;
  try {
    var response = await querySQL(queryString);
    ctx.body = response;
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

// 购买 vip
router.post('/api/purchase-vip', async(ctx, next) => {
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

router.post('/api/get-vip-expiration', async(ctx, next) => {
  var id = ctx.request.body.id || '';
  var queryString = `SELECT expiration FROM vip WHERE uid = '${id}'`;

  try {
    var response = await querySQL(queryString);
    ctx.body = response;
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

router.post('/api/pay-vip', async(ctx, next) => {
  var href = ctx.request.body.url || '',
      query = url.parse(href, true).query,
      duration = ctx.request.body.duration || 0;
  var queryString = 'UPDATE vipOrder set completed = 1 WHERE '+
                    `uid = '${query.id}' and mid = '${query.mid}' and generateTime = '${query.generateTime}'`;
  try {
    var response = await querySQL(queryString);
    // 付款成功
    queryString = `SELECT * FROM vip WHERE uid = '${query.id}'`;
    try {
      response = await querySQL(queryString);
      var expireDate = new Date();
      if (response.rows.length == 1) {
        // 已经开通过 vip 的处理
        expireDate.setTime(response.rows[0].expiration);
      }
      // 开通月份处理
      var month = expireDate.getMonth();
      if (month + duration > 11) {
        expireDate.setFullYear(expireDate.getFullYear() + 1);
        expireDate.setMonth(expireDate.getMonth() + duration - 12);
      } else {
        expireDate.setMonth(expireDate.getMonth() + duration);
      }
      var formattedDate = expireDate.toLocaleDateString().replace(/\//g, '-') 
                        + ' ' 
                        + expireDate.toTimeString().split(' ')[0];
      
      if (response.rows.length == 0) {
        queryString = 'INSERT INTO vip (uid, expiration) VALUES'
                              + `('${query.id}', '${formattedDate}')`;
      } else {
        queryString = `UPDATE vip SET expiration = '${formattedDate}' WHERE uid = '${query.id}'`;
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
          message: '开通 vip 失败'
        }
      }
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 'failed',
        message: '查询 vip 状态失败'
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

router.post('/api/vip-purchase-status', async(ctx, next) => {
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