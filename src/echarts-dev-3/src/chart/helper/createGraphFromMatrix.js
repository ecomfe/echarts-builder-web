define(function (require) {

    var Graph = require('../../data/Graph');

    /**
     * 从邻接矩阵生成
     * ```
     *        TARGET
     *    -1--2--3--4--5-
     *  1| x  x  x  x  x
     *  2| x  x  x  x  x
     *  3| x  x  x  x  x  SOURCE
     *  4| x  x  x  x  x
     *  5| x  x  x  x  x
     * ```
     * 节点的行列总和会被写到`node.option.value`
     * 对于有向图会计算每一行的和写到`node.option.outValue`,
     * 计算每一列的和写到`node.option.inValue`。
     * 边的权重会被然后写到`edge.option.weight`。
     *
     * @method module:echarts/data/Graph.fromMatrix
     * @param {Array.<Object>} nodesData 节点信息，必须有`name`属性, 会保存到`node.data`中
     * @param {Array} matrix 邻接矩阵
     * @param {boolean} directed 是否是有向图
     * @return {module:echarts/data/Graph}
     */
    return function (nodesData, matrix, directed) {
        if (
            !matrix || !matrix.length
            || (matrix[0].length !== matrix.length)
            || (nodesData.length !== matrix.length)
        ) {
            // Not a valname data
            return;
        }

        var size = matrix.length;
        var graph = new Graph(directed);

        var nodes = graph.nodes;

        for (var i = 0; i < size; i++) {
            var node = graph.addNode(
                nodesData[i].name, i
            );
            // TODO
            // node.data已经有value的情况
            // node.option.value = 0;
            // if (directed) {
            //     node.option.outValue = node.option.inValue = 0;
            // }
        }
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var item = matrix[i][j];
                // if (directed) {
                //     nodes[i].option.outValue += item;
                //     nodes[j].option.inValue += item;
                // }
                // nodes[i].option.value += item;
                // nodes[j].option.value += item;
            }
        }

        for (var i = 0; i < size; i++) {
            for (var j = i; j < size; j++) {
                var item = matrix[i][j];
                if (item === 0) {
                    continue;
                }
                var n1 = nodes[i];
                var n2 = nodes[j];
                var edge = graph.addEdge(n1, n2, -1);
                // edge.option.weight = item;
                // if (i !== j) {
                //     if (directed && matrix[j][i]) {
                //         var inEdge = graph.addEdge(n2, n1, -1);
                //         inEdge.option.weight = matrix[j][i];
                //     }
                // }
            }
        }

        return graph;
    }
});