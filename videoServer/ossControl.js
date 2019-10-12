const oss = require('ali-oss');
const fs = require('fs')

const client = new oss({
    region: 'oss-cn-shenzhen',
    accessKeyId: 'LTAIWZ4nQSVCvior',
    accessKeySecret: 'lJvtPRVUXONalIEtOO5F7o7jXzaEUX',
    bucket: 'z-video'
})

class Cl {
    constructor(){
    }
    filterProp(list,rmObject = false,...rmProp){
        if(!(list instanceof Array)){
            return
        }
        if(!rmProp.length){
            return list
        }
        return rmObject?
            list.filter((node) => {
            let keys = Object.keys(node),k_length = keys.length,r_length = rmProp.length
            return (k_length+r_length)===new Set(keys.concat(rmProp)).size
        }):
            list.map(node => {
                let multi = rmProp.filter(str => str in node)
                return multi.map(str => {
                    delete node[str]
                })
            })
    }
    getList(callback){
        client.list({
            prefix:'videos/'
        }).then((result) => {
            let list = result.objects;
            callback(list)
        })
    }
    /**
     *
     * @param ossName
     */
    getObject(ossName,callback){
        this.getList(function (list) {
            let node = list.find((node) => {
                return node.name.toLowerCase() === ossName.toLowerCase()
            })||null
            callback(node)
        })
    }
    getObjectUrl(ossName){
        return client.generateObjectUrl(ossName)
    }
    uploadProfile(ossName,path,next){
        fs.readFile(path,function (err,fd) {
            client.put('profiles/'+ossName,fd).then(function(result){
                fs.unlink(path,function (err) {
                    if(err){
                        console.log(err)
                    }
                })
                next(result)
            })
        })
    }
    uploadObject(ossName,next,dir = false){
        let files = ['ossName']
        if(dir){
            files = fs.readdirSync(dir)
        }
        for(let i = 0; i<files.length;i++){
            fs.readFile(dir?dir+'/'+files[i]:ossName,function (err,fd) {
                if(err){
                    console.log(err)
                    return false
                }
                client.put(dir?ossName+'/'+files[i]:ossName,fd).then(function (result) {
                    fs.unlink(dir?dir+'/'+files[i]:ossName,function (err) {
                        if(err){
                            console.log(err)
                        }
                    })
                    if(next && typeof next === 'function' && i == 0)next(result)
                })
            })
        }
    }
}

module.exports = new Cl()