const express = require('express')
const app = express()
const expSession = require('express-session')
const formIdAble = require('formidable')
// var marked = require('marked')
var fs = require('fs')
var path = require('path')
const bodyParser = require('body-parser')
const moment = require('moment')
const os = require('os')
const pubIp = require('public-ip')
const ossControl = require('./ossControl.js')
const videoRoute = require('./ossTemplate.js')
const QueryStr = require('./databaseControl.js')

app.use(function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', '*')
  // res.header('Access-Control-Allow-Origin', 'http://zyukyun.cn')
  let allowedOrigins = ['http://47.112.6.146', 'http://zyukyun.cn'];
  let origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  console.log('** origin:',origin)
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', 'true')
  // res.header('X-Powered-By', ' 3.2.1')
  // res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})
// app.use(express.static('public', {maxAge: 12 * 60 * 60 * 24 * 30}))

const identityKey = 'skey'
/** express-session里的export function ({name:null}){}不设置name参数的话，将为connect.id**/

app.use(expSession({
  name: identityKey,
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 10/** 1000ms×60s×10mins **/
  }
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// marked.setOptions({
//   renderer: new marked.Renderer(),
//   gfm: true,
//   tables: true,
//   breaks: true,
//   pedantic: false,
//   sanitize: true,
//   smartLists: true,
//   smartypants: false
// })

function getIPAddress(){
    var interfaces = os.networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}

class SessionUser extends QueryStr {
  signUp (username, password) {
    var struct = {
      tableName: 'userSession',
      fields: ['username', 'password'],
      currentPage: '1',
      pageSize: '1',
      data: {
        username: username
      }
    }
    var insertObj = {
      tableName: 'userSession',
      fields: ['username', 'password'],
      data: [
        [username, password]
      ]
    }
    var signUpPro = function (resolve, reject) {
      var that = new QueryStr()
      that.insert(insertObj, function () {
        resolve({success: true, msg: '注册成功'})
      })
    }
    return new Promise(function (resolve, reject) {
      var that = new QueryStr()
      that.select(struct, function (res) {
        if (!Object.keys(res).length) {
          new Promise(signUpPro).then(function (recieve) {
            resolve(recieve)
          })
        } else {
          reject({success: false, msg: '用户已存在'})
        }
      })
    })
  }
  signIn (username, password) {
    var struct = {
      tableName: 'userSession',
      fields: ['username', 'password'],
      currentPage: '1',
      pageSize: '1',
      data: {
        username: username,
        password: password
      }
    }
    return new Promise(function (resolve, reject) {
      var that = new QueryStr()
      that.select(struct, function (res) {
        if (!Object.keys(res).length) {
          reject({success: false, msg: '用户名或密码错误'})
        } else {
          resolve({success: true, msg: '登陆成功', username: struct.data.username})
        }
      })
    })
  }
}

class MarkdownSql extends QueryStr {
  static timeOutSend (params, callback) {
    this.timeSnap = 1
    this.insertObj = {
      tableName: 'blogfiles',
      fields: ['articleID', 'title', 'author', 'content', 'fontImg'],
      data: [
        [params.articleID, params.title, params.author, params.content, params.fontImg]
      ]
    }
    this.timeOut = setTimeout(function () {
      var mydb = new QueryStr()
      mydb.insert(MarkdownSql.insertObj, callback)
      MarkdownSql.timeSnap = 0
    }, 1000)
  }
  testName (name) {
    var set = {
      tableName: 'blogfiles',
      fields: ['title'],
      data: {title: name},
      currentPage: Number('1'),
      pageSize: Number('1')
    }
    var promise = new Promise(function (resolve, reject) {
      var that = new QueryStr()
      that.select(set, resolve)
    })
    return promise
  }
  deletedMarkdown (params) {
    var set = {
      tableName: 'blogfiles',
      data: {
        articleID: params.articleID
      }
    }
    var promise = new Promise(function (resolve, reject) {
      var that = new QueryStr()
      that.deleted(set, resolve)
    })
    return promise
  }
}

class CommentSql extends QueryStr {
  //  多次评论缓存发送 输入接口实例+回掉函数
  static timeOutSend (params, callback) {
    // if (!this.insertObj) {
    //   this.timeSnap = 1
    this.insertObj = {
      tableName: 'blogcomments',
      fields: ['articleID', 'userName', 'comment'],
      data: [
        [params.articleID, params.userName, params.comment]
      ]
    }
    // } else {
    //   this.insertObj.data.push([params.articleID, params.userName, params.comment])
    // }
    this.timeOut = setTimeout(function () {
      var mydb = new QueryStr()
      mydb.insert(CommentSql.insertObj, callback)
      CommentSql.timeSnap = 0
    }, 1000)
  }
  //  查询该表某些字段的某些数据（接口实例+回掉函数）
  getThisComment (params, callback) {
    var set = {
      tableName: 'blogcomments',
      fields: params.fields || [
        'id',
        'articleID',
        'userName',
        'comment',
        'time'
      ],
      data: Object.keys(params.data) ? params.data : '',
      currentPage: Number(params.currentPage),
      pageSize: Number(params.pageSize)
    }
    this.select(set, callback)
  }
}

//  格式化日期
// let formate = require('./dateformate.js')
//  请求文件夹路径
// const url = path.join(__dirname, '/public/blog')
/** ******************登陆与注销*******************************/
app.post('/login', function (req, res) {
  var params = req.body
  var sessionObj = new SessionUser()
  let pm = sessionObj.signIn(params.username, params.password)
  pm.then(function (recieve) {
    console.log(recieve)
    req.session['uid'] = recieve.username
    res.send(recieve)
  }).catch(function (err) {
    console.log(err)
    res.send(err)
  })
})

app.post('/signUp', function (req, res) {
  var params = req.body
  var sessionObj = new SessionUser()
  let pm = sessionObj.signUp(params.username, params.password)
  pm.then(function (recieve) {
    res.json(recieve)
  }).catch(function (rec) {
    res.json(rec)
  })
})

app.post('/uploadProfile',function(req, res){
  let params = req.body
  let form = new formIdAble.IncomingForm();
  form.uploadDir = "profiles";
  form.keepExtensions = true;
  // if(!req.session['uid']){
  //   res.send({msg:'请登陆后再上传头像',success:false})
  // }
  form.parse(req,function (err,fields,files) {
      if(err){
          console.log(err)
          return false
      }
      let afterfix = files.file.name.match(/\.[\w\W]+$/)
      ossControl.uploadProfile((req.session.uid||'guest')+afterfix,files.file.path,function(result){
          console.log(result)
          let query = new QueryStr()
          query.update({
              tableName: 'userSession',
              fields: ['username','profile'],
              condition:{
                username:req.session['uid']||'guest'
              },
              data:  {
                profile:result.url
              }
          },function (result) {
              console.log(result)
              res.send({msg:'上传完成',success:true,url:result.url})
          })
      })
  })
})

app.get('/getProfile',function(req,res){
    let params = req.query;
    let query = new QueryStr()
    let selectStr = {
        tableName: 'userSession',
        fields: ['profile'],
        data: {username:params.username},
        currentPage: 1,
        pageSize: 1
    }
    query.select(selectStr,function (result) {
        res.send({msg:'查询成功',success:true,data:result})
    },function () {
        res.send({msg:'查询失败',success:false})
    })
})

app.get('/logout', function (req, res) {
  req.session.uid = ''
  res.redirect('https://www.baidu.com/')/** 注销重定向页面 **/
})

/** ******************获取文章列表********************************/
class ListFiles {
  static set (i, arr) {
    this.list[i] = arr
    this.list['length']++
  }
  static compareTime () {
    let now = new Date().getTime()
    if (now - this.time > 5000) {
      this.time = now
      return now
    } else {
      this.time = now
      return false
    }
  }
  static clear () {
    this.list = {}
    this.list['length'] = 0
  }
  static select (params, callback) {
    var set = {
      tableName: 'blogfiles',
      fields: params.fields || ['articleID', 'title', 'author', 'time', 'content', 'fontImg'],
      data: params.data || null,
      LIKE: params.LIKE || false,
      currentPage: Number(params.currentPage) || 1,
      pageSize: Number(params.pageSize) || 1
    }
    console.log(set)
    var query = new QueryStr()
    query.select(set, callback)
  }
  selectPack (params) {
    if (!ListFiles.list) {
      ListFiles.list = {}
    }
    if (params.currentPage in ListFiles.list && !params.LIKE) {
      if (!ListFiles.compareTime()) {
        console.log('短时间啦')
        return ListFiles.list[params.currentPage]
      }
    }
    return new Promise(function (resolve, reject) {
      ListFiles.select(params, function (result) {
        result.forEach(function (node) {
          let timer = new Date(node.time)
          node.time = timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString()
        })
        if (!params.LIKE) {
          ListFiles.set(params.currentPage, result)
        }
        resolve(JSON.parse(JSON.stringify(result)))
      })
    })
  }
}
app.post('/api/blog/getPosts', function (req, res) {
  var listpost = new ListFiles()
  console.log(req.body)
  var func = listpost.selectPack(req.body)
  if (func instanceof Promise) {
    func.then(function (recieve) {
      var query = new QueryStr()
      query.count('blogfiles', req.body.data, req.body.LIKE, function (rec) {
        var send = {recieve: recieve, row: rec[0]['COUNT(*)']}
        res.send(send)
      })
    })
  } else {
    var query = new QueryStr()
    query.count('blogfiles', req.body.data, req.body.LIKE, function (rec) {
      var send = {recieve: func, row: rec[0]['COUNT(*)']}
      res.send(send)
    })
  }
})
/** ******************删除文章********************************/
app.post('/api/blog/delete', function (req, res) {
  if (!req.session.uid === 'admin') {
    res.json({success: false, msg: '请注册登陆'})
    return
  }
  let promise = new MarkdownSql().deletedMarkdown(req.body)
  promise.then(function (result) {
    res.send({
      success: true,
      result: result
    })
  })
})

/** ******************上传文章********************************/
var uploadMarkdown = function (params, callback) {
  MarkdownSql.timeOutSend(params, function (result) {
    callback(result)
  })
}
/** ******************上传文章评论********************************/
app.post('/api/blog/uploadComment', function (req, res) {
  if (!req.session.uid) {
    res.json({success: false, msg: '请注册登陆'})
    return
  }
  let params = req.body
  CommentSql.timeOutSend(params, function (result) {
    res.send({
      success: true,
      obj: result
    })
  })
})

/** ******************获取文章评论********************************/
app.post('/api/blog/selectComment', function (req, res) {
  var params = req.body
  console.log(params)
  var commentsql = new CommentSql()
  commentsql.getThisComment(params, function (result) {
    result = result.map(function (node) {
      node.time = moment(node.time).format('YYYY-MM-DD HH:mm:ss')
      return node
    })
    var query = new QueryStr()
    query.count('blogcomments', params.data, params.LIKE, function (rec) {
      var send = {success: true, obj: result, row: rec[0]['COUNT(*)']}
      res.send(send)
    })
  })
})
/** ******************上传文章详情********************************/
app.post('/api/blog/uploadFile', function (req, res) {
  if (!req.session.uid === 'admin') {
    res.json({success: false, msg: '请注册登陆'})
    return
  }
  var params = req.body
  let timeSnap = new Date().getTime()
  let fileName = params.title
  params['articleID'] = timeSnap
  var mark = new MarkdownSql()
  mark.testName(params.title).then(function (result) {
    // console.log(result, !!result.length)
    if (result.length) {
      res.send({
        success: false
      })
    } else {
      var promiseMD = new Promise(function (resolve, reject) {
        uploadMarkdown(params, resolve)
      })
      promiseMD.then(function (result) {
        let message = {
          articleID: timeSnap.toString(),
          title: fileName,
          author: params.author,
          time: '刚刚'
        }
        res.send(message)
      })
      // })
    }
  })
})
/** ******************获取文章详情********************************/
app.get('/api/blog/getContent', function (req, res) {
  // var params = req.body
  let params = req.query
  ListFiles.select({data: {articleID: params.articleID}}, function (result) {
    result = result.map(function (node) {
      node.time = moment(node.time).format('YYYY-MM-DD HH:mm:ss')
      return node
    })
    // res.redirect(302, 'http://47.112.6.146/#/article')
    res.send({
      success: true,
      obj: result
    })
  })
})
/** ******************获取********************************/
// app.get('*', function (request, response){
//     console.log(request)
//     response.sendFile(path.resolve(__dirname,'../', 'index.html'))
// })
app.use('/video',videoRoute)
app.listen(8081,function (err){
    if(err){
        console.log(err)
    }
    // console.log(getIPAddress())
    // console.log(pubIp.v4().then(ip => console.log(ip + '---公网')))
    console.log('8081端口')
})
