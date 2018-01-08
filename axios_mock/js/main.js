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

// 根据文本内容同步两个表的单元格宽度
function fitWidth(selector1, selector2) {
    var table1 = document.querySelector(selector1),
        table2 = document.querySelector(selector2),
        tableWidth = table1.offsetWidth, // 表格总宽度
        tBodyCells = table2.tBodies[0].rows[0].cells,
        tHeadCells = table1.tHead.rows[0].cells,
        tBodyCellsLen = tBodyCells.length,
        oWidth = [],
        total = 0;

    for (var i = 0; i < tBodyCellsLen; i++) {
        // 获取自适应(table-layout: auto;)下单元格的宽度
        var w1 = tHeadCells[i].offsetWidth;
        var w2 = tBodyCells[i].offsetWidth;
        var wMax = Math.max(w1, w2); 

        total += wMax*1; 
        oWidth.push(wMax);
    }
    
    for (var i = 0; i < oWidth.length; i++) {
        // 取两个表格每列的最大宽的总和作为基数，用最大宽占比来重新计算单元格宽度
        var tdWidth = (oWidth[i] / total) * tableWidth + 'px';  
        tBodyCells[i].style.width = tHeadCells[i].style.width = tdWidth;
        // table-layout: fixed;时css的宽度才能生效
        table1.style.tableLayout = 'fixed';
        table2.style.tableLayout = 'fixed';
    }

}
