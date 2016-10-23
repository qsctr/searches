// Some searches for graphs
'use strict';
var currentGraphNodes;
function setGraphNodes(dataFormat) {
    for (var data in dataFormat) {
        if (!Array.isArray(dataFormat[data])
            || dataFormat[data].some(function (child) {
                return typeof child !== 'string' || child.length === 0;
            }))
            throw new Error("Data " + data + " must have an array of edges (non-empty strings)");
    }
    currentGraphNodes = Object.keys(dataFormat).map(function (data) {
        return ({ data: data, visited: false, edges: [] });
    });
    var _loop_1 = function(node) {
        var _loop_2 = function(childData) {
            if (childData === node.data)
                throw new Error("Node " + node.data + " cannot have itself as a child");
            var childNode = currentGraphNodes.find(function (x) { return x.data === childData; });
            if (childNode === undefined)
                throw new Error("Node " + node.data + " has nonexistent child " + childData);
            if (!node.edges.includes(childNode))
                node.edges.push(childNode);
            if (!childNode.edges.includes(node))
                childNode.edges.push(node);
        };
        for (var _i = 0, _a = dataFormat[node.data]; _i < _a.length; _i++) {
            var childData = _a[_i];
            _loop_2(childData);
        }
        if (dataFormat[node.data].length === 0 &&
            Object.keys(dataFormat).map(function (data) { return dataFormat[data]; })
                .every(function (edges) { return !edges.includes(node.data); }))
            throw new Error("Node " + node.data + " isn't connected to any other nodes");
    };
    for (var _b = 0, currentGraphNodes_1 = currentGraphNodes; _b < currentGraphNodes_1.length; _b++) {
        var node = currentGraphNodes_1[_b];
        _loop_1(node);
    }
}
function clearVisited() {
    for (var _i = 0, currentGraphNodes_2 = currentGraphNodes; _i < currentGraphNodes_2.length; _i++) {
        var node = currentGraphNodes_2[_i];
        node.visited = false;
    }
}
// Breadth first search, non-recursive
function bfsNoRec(root, goal) {
    var fringe = [root];
    while (fringe.length !== 0) {
        var current = fringe.shift();
        if (current.visited)
            continue;
        println(current.data);
        if (current.data === goal)
            return true;
        current.visited = true;
        fringe = fringe.concat(current.edges.filter(function (child) { return !child.visited; }));
    }
    return false;
}
// Breadth first search, recursive
function bfsRec(fringe, goal) {
    if (!Array.isArray(fringe))
        fringe = [fringe];
    if (fringe.length === 0)
        return false;
    var current = fringe.shift();
    if (current.visited)
        return bfsRec(fringe, goal);
    println(current.data);
    if (current.data === goal)
        return true;
    current.visited = true;
    return bfsRec(fringe.concat(current.edges.filter(function (child) { return !child.visited; })), goal);
}
// Depth first search, non-recursive
// Note: the .reverse() doesn't really matter for a graph,
// the edges have no direction, it's just there for consistency
// with the order of the recursive version
function dfsNoRec(root, goal) {
    var fringe = [root];
    while (fringe.length !== 0) {
        var current = fringe.pop();
        if (current.visited)
            continue;
        println(current.data);
        if (current.data === goal)
            return true;
        current.visited = true;
        fringe = fringe.concat(current.edges.filter(function (child) { return !child.visited; }).reverse());
    }
    return false;
}
// Depth first search, recursive
function dfsRec(node, goal) {
    println(node.data);
    if (node.data === goal)
        return true;
    node.visited = true;
    return node.edges.some(function (child) { return !child.visited && dfsRec(child, goal); });
}
// TODO: Depth limited search, non-recursive
// Depth limited search, recursive
function dlsRec(node, limit, goal, depth) {
    if (depth === void 0) { depth = 0; }
    if (depth > limit)
        return null;
    println(node.data);
    if (node.data === goal)
        return true;
    node.visited = true;
    var anyNull = false;
    for (var _i = 0, _a = node.edges; _i < _a.length; _i++) {
        var child = _a[_i];
        if (!child.visited) {
            var res = dlsRec(child, limit, goal, depth + 1);
            if (res)
                return true;
            if (res === null)
                anyNull = true;
        }
    }
    if (anyNull)
        return null;
    return false;
}
// Iterative deepening search, non-recursive
// Uses recursive depth limited search
function idsNoRec(root, goal) {
    var depth = 0;
    while (true) {
        var dls = dlsRec(root, depth, goal);
        if (typeof dls === 'boolean')
            return dls;
        clearVisited();
        depth++;
    }
}
// Iterative deepening search, recursive
// Uses recursive depth limited search
function idsRec(root, goal, depth) {
    if (depth === void 0) { depth = 0; }
    var dls = dlsRec(root, depth, goal);
    if (typeof dls === 'boolean')
        return dls;
    clearVisited();
    return idsRec(root, goal, depth + 1);
}
