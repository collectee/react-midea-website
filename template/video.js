import '../static/css/temp1.scss'
import $ from 'jquery'
let xml = new XMLHttpRequest(),name ='paper2/paper2'
let obj = document.querySelector('#vd');
obj.poster = 'https://z-video.oss-cn-shenzhen.aliyuncs.com/'+name+'-1.jpeg';
console.log($('#vd'))
// xml.onreadystatechange = function(){
//     if(xml.readyState !== 4){
//         return true
//     }
//     if(xml.status !== 200){
//         return true
//     }
//     let response = JSON.parse(xml.response);
//     if(!response.url){
//         // alert(response.msg)
//         return true
//     }
//     let player = dashjs.MediaPlayer().create()
//     player.initialize(obj,response.url,false)
// }
// xml.open('GET','http://localhost:8081/video/getVideo?name='+name,true)
// xml.send()
$.ajax({
    method:'get',
    url:'http://localhost:8081/video/getVideo',
    data:{
        name:name
    },
    success:function (response) {
        let player = dashjs.MediaPlayer().create()
        player.initialize(obj,response.url,false)
    }
})