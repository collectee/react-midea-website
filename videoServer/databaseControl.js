const mysql = require('mysql')
const pubIp = require('public-ip')
class Formating {
    formatFields (arr) {
        console.log(arr)
        arr = arr.map(function (node) {
            return '`' + node + '`'
        })
        return arr ? arr.join(',') : '*'
    }
    formatKey (obj, LIKE) {
        let str = Object.keys(obj)
        return str.map(function (node) {
            return LIKE ? ('' + node + ' LIKE ? ') : ('' + node + ' = ? ')/** 判断是否模糊查询的组合格式 **/
        }).join('AND ')
    }
    formatData (obj, LIKE) {
        var str = []
        for (let key in obj) {
            str.push(LIKE ? ('%' + obj[key] + '%') : obj[key])
        }
        return str
    }
}
let ipF = async function(){
    return await pubIp.v4()
}
ipF().then(ip => {
    QueryStr.ip = ip
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: ip ==='47.112.6.146'?'bestwishes':'',
        database: 'db_1'
    })
    console.log(ip)
    connection.connect();
})
class QueryStr {
    //  构造初始函数
    constructor(){
        this.ip = ''
    }
    //  基本请求函数
    query (str, data) {
        console.log(str,'-',data)
        var promise = new Promise(function (resolve, reject) {
            connection.query(str, data, function (err, result, fields) {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })
        return promise
    }
    //  简单插入函数
    insert (obj, callback, rejectCallBack) {
        let formater = new Formating()
        var insertStr = 'INSERT INTO `' + obj.tableName + '`( ' + formater.formatFields(obj.fields) + ') VALUES ( ? )'
        this.query(insertStr, obj.data).then(callback).catch(rejectCallBack)
    }
    //  简单选择函数
    select (obj, callback, rejectCallBack) {
        let formater = new Formating()
        let pageSize = Number(obj.pageSize)
        let currentPage = Number(obj.currentPage)
        let offset = pageSize * (currentPage - 1)
        var selectStr = 'SELECT ' + formater.formatFields(obj.fields) + ' FROM ' + obj.tableName + (obj.data ? (' WHERE ' + formater.formatKey(obj.data, obj.LIKE)) : '') + ' LIMIT ' + offset + ',' + pageSize
        this.query(selectStr, formater.formatData(obj.data, obj.LIKE)).then(callback).catch(rejectCallBack)
    }
    update(obj, callback, rejectCallBack){
        let formater = new Formating()
        let updateStr = 'UPDATE ' +obj.tableName +
            ' SET ' + formater.formatKey(obj.data, obj.LIKE) +
            ' WHERE '+ formater.formatKey(obj.condition, obj.LIKE)
        let datas = Object.values(obj.data).concat(Object.values(obj.condition))
        this.query(updateStr, formater.formatData(datas, obj.LIKE)).then(callback).catch(rejectCallBack)
    }
    count (tablename, data, LIKE, callback, rejectCallBack) {
        let formater = new Formating()
        var selectStr = 'SELECT COUNT(*) FROM ' + tablename + (data ? (' WHERE ' + formater.formatKey(data, LIKE)) : '')/** 有数据一般默认模糊查找 **/
        this.query(selectStr, data ? formater.formatData(data, LIKE) : null).then(callback).catch(rejectCallBack)
    }
    deleted (obj, callback, rejectCallBack) {
        var deletedStr = 'DELETE FROM ' + obj.tableName + ' WHERE ?'
        this.query(deletedStr, obj.data).then(callback).catch(rejectCallBack)
    }
}

module.exports = QueryStr