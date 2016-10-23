// Some searches for graphs

'use strict';

interface GraphNode {
    data: string;
    visited: boolean;
    edges: GraphNode[];
}

interface DataFormat {
    [data: string]: string[];
}

let currentGraphNodes: GraphNode[];

function setGraphNodes(dataFormat: DataFormat) {
    for (const data in dataFormat) {
        if (!Array.isArray(dataFormat[data])
            || dataFormat[data].some(child =>
                typeof child !== 'string' || child.length === 0))
            throw new Error(`Data ${data} must have an array of edges (non-empty strings)`);
    }
    currentGraphNodes = Object.keys(dataFormat).map(data =>
        ({ data: data, visited: false, edges: [] as GraphNode[] }));
    for (const node of currentGraphNodes) {
        for (const childData of dataFormat[node.data]) {
            if (childData === node.data)
                throw new Error(`Node ${node.data} cannot have itself as a child`);
            const childNode = currentGraphNodes.find(x => x.data === childData);
            if (childNode === undefined)
                throw new Error(`Node ${node.data} has nonexistent child ${childData}`);
            if (!node.edges.includes(childNode))
                node.edges.push(childNode);
            if (!childNode.edges.includes(node))
                childNode.edges.push(node);
        }
        if (dataFormat[node.data].length === 0 &&
            Object.keys(dataFormat).map(data => dataFormat[data])
            .every(edges => !edges.includes(node.data)))
            throw new Error(`Node ${node.data} isn't connected to any other nodes`);
    }
}

function clearVisited() {
    for (const node of currentGraphNodes) {
        node.visited = false;
    }
}

// Breadth first search, non-recursive
function bfsNoRec(root: GraphNode, goal?: string): boolean {
    let fringe = [root];
    while (fringe.length !== 0) {
        const current = fringe.shift() as GraphNode;
        if (current.visited) continue;
        println(current.data);
        if (current.data === goal) return true;
        current.visited = true;
        fringe = fringe.concat(current.edges.filter(child => !child.visited));
    }
    return false;
}

// Breadth first search, recursive
function bfsRec(fringe: GraphNode[] | GraphNode, goal?: string): boolean {
    if (!Array.isArray(fringe)) fringe = [fringe];
    if (fringe.length === 0) return false;
    const current = fringe.shift() as GraphNode;
    if (current.visited) return bfsRec(fringe, goal);
    println(current.data);
    if (current.data === goal) return true;
    current.visited = true;
    return bfsRec(fringe.concat(current.edges.filter(child => !child.visited)), goal);
}

// Depth first search, non-recursive
// Note: the .reverse() doesn't really matter for a graph,
// the edges have no direction, it's just there for consistency
// with the order of the recursive version
function dfsNoRec(root: GraphNode, goal?: string): boolean {
    let fringe = [root];
    while (fringe.length !== 0) {
        const current = fringe.pop() as GraphNode;
        if (current.visited) continue;
        println(current.data);
        if (current.data === goal) return true;
        current.visited = true;
        fringe = fringe.concat(current.edges.filter(child => !child.visited).reverse());
    }
    return false;
}

// Depth first search, recursive
function dfsRec(node: GraphNode, goal?: string): boolean {
    println(node.data);
    if (node.data === goal) return true;
    node.visited = true;
    return node.edges.some(child => !child.visited && dfsRec(child, goal));
}

// TODO: Depth limited search, non-recursive

// Depth limited search, recursive
function dlsRec(node: GraphNode, limit: number, goal?: string, depth = 0): boolean | null {
    if (depth > limit) return null;
    println(node.data);
    if (node.data === goal) return true;
    node.visited = true;
    let anyNull = false;
    for (const child of node.edges) {
        if (!child.visited) {
            const res = dlsRec(child, limit, goal, depth + 1);
            if (res) return true;
            if (res === null) anyNull = true;
        }
    }
    if (anyNull) return null;
    return false;
}

// Iterative deepening search, non-recursive
// Uses recursive depth limited search
function idsNoRec(root: GraphNode, goal?: string): boolean {
    let depth = 0;
    while (true) {
        let dls = dlsRec(root, depth, goal);
        if (typeof dls === 'boolean') return dls;
        clearVisited();
        depth++;
    }
}

// Iterative deepening search, recursive
// Uses recursive depth limited search
function idsRec(root: GraphNode, goal?: string, depth = 0): boolean {
    const dls = dlsRec(root, depth, goal);
    if (typeof dls === 'boolean') return dls;
    clearVisited();
    return idsRec(root, goal, depth + 1);
}