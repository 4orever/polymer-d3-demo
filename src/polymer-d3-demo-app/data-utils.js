export function fetch(uri) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', uri, false);
    xhr.send();

    return JSON.parse(xhr.response);
}

export function normalize(data) {
    let nodes = {},
        result = [{
            id: "root",
            name: "root",
            parent: ""
        }];

    data.operators.map(({id, name}) => {
        nodes[id] = {id: id, name: name, parent: "root"};
    });

    data.edges.map(({startOperator, endOperator}) => {
        nodes[endOperator].parent = startOperator;
    });

    Object.keys(nodes).forEach(key => {
        result.push(nodes[key]);
    });

    return result;
}