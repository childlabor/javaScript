window.onload = function() {
    // 使用 Mock拦截ajax请求
    var data = Mock.mock('http://localhost/8080', 'post', {
        "students|1-10": [{
            "id|+1": 001,
            "name": "@last", // 占位符，引用的是 Mock.Random 中的方法，随机生成数据
            "age|18-22": 18,
            "sex|1": ['男', '女'],
            "score|1-5": "A",
            "email": "@email"
        }]
    });

    // 使用axios发起ajax请求   IE9+(ie9 需引入babel的polyfill.js)
    axios({
        method: 'post',
        url: 'http://localhost/8080'
    })
        .then(function (response) {
            var students = response.data.students;
            var tBd = document.createElement('tbody');

            for(var i = 0, len = students.length; i < len; i++) {
                var obj = students[i];
                var tr = document.createElement('tr');
                
                for (var key in obj) {  
                    var td = document.createElement('td');
                    var txt = document.createTextNode(obj[key]);
                    td.appendChild(txt)
                    tr.appendChild(td);
                }
               
                tBd.appendChild(tr);
            }

            // table.innerHTML不兼容iE9及以下
            //弃用 document.getElementById('tb').innerHTML = tr; 字符串拼接tr

            document.getElementById('tb').appendChild(tBd);

            fitWidth('#th', '#tb');
        })
        .catch(function (error) {
            console.log(error);
        });
   
}
