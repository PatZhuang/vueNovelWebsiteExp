// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const server = require('koa-static');
const path = require('path');
// 创建一个Koa对象表示web app本身:
const app = new Koa();

const pool = require('./module/sqlpool.js');

app.use(bodyParser());

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async(ctx, next) => {
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
        maxAge: 60 * 60 * 1000, // cookie有效时长
        httpOnly: false, // 是否只用于http请求中获取
        overwrite: false // 是否允许重写
      }
    )
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

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

router.get('/api/get-categories', async(ctx, next) => {
  var queryString = 'SELECT * FROM category';
  try {
    ctx.body = await querySQL(queryString);
  } catch (e) {
    console.log(e);
    ctx.body = e;
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
            console.log(err);
            reject({
              status: 'query error'
            })
          } else {
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
