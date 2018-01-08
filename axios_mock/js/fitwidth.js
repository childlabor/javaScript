// 根据文本内容同步两个表的单元格宽度
function fitWidth(selectorHead, selectorBody) {
    var table1 = document.querySelector(selectorHead),
        table2 = document.querySelector(selectorBody),
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

        total += wMax * 1;
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
