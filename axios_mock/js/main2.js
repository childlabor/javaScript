window.onload = function() {
    // 使用 Mock拦截ajax请求
    var data = Mock.mock('http://localhost/8080', 'post', {
        "cost|4": [{
            "id|+1": 001,
            "productLine|+1": ['基础系统（研发中心维护）', '交易系统', '资源产品线', '知识产权产品线'], 
            "product|+1": [['科易通行证、行为系统', '短信发送系统'], ['科易宝交易系统', '独立交易系统（慧企宝）'], ['技术转让', '科易大学城', '科易网-技术专家列表页', '评审专家库'], ['专利交易系统', '商标超市', '知产评估']],
            "totalCost|+1": [['1500', '1000'], [ '1500', '1000'], ['1500', '1000', '1500', '1000'], [ '1500', '1500', '1000']]
        }]
    });

    // 使用axios发起ajax请求   IE9+(ie9 需引入babel的polyfill.js)
    axios({
        method: 'post',
        url: 'http://localhost/8080'
    })
        .then(function (response) {
           console.log(JSON.stringify(response.data));
            var json = response.data.cost;
            var tr = '';

            for (var i = 0; i < json.length; i++) {
                var id = json[i].id;
                var productLine =json[i].productLine;
                var aProduct = json[i].product;
                var aTotalCost = json[i].totalCost;
                var rowSpan = aProduct.length;

                tr +=
                    "<tr><td rowspan='" + rowSpan + "'>" + id + 
                    "</td><td rowspan='" + rowSpan + "'>" + productLine +
                    "</td><td>" + aProduct[0] +
                    "</td><td>" + aTotalCost[0] +
                    "</td><td><a href='#'>查看</a></td></tr>";
                 
                for (var j = 1; j < rowSpan; j++) {
                    tr += "<tr><td>" + aProduct[j] + "</td><td>" + aTotalCost[j] + "</td><td><a href='#'>查看</a></td></tr>";
                }
    
            }

            document.getElementById("tb").innerHTML = tr;
            fitWidth("#th", "#tb");
           
        })
        .catch(function (error) {
            console.log(error);
        });
   
}