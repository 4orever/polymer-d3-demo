
// const data = {
//     nodes: [
//         {id: 'A', value: 100},
//         {id: 'B', value: 100},
//         {id: 'C', value: 100},
//         {id: 'D', value: 100}
//     ],
//     links: []
// };

// const nodes = data.nodes.map(d => Object.create(d));
// const links = data.links.map(d => Object.create(d));
import {forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceY} from "d3-force";
import {select} from "d3-selection";

const width = 800, height = 800;

// const svg = select('svg').attr("viewBox", [-width / 2, -height / 2, width, height]);
// node = svg.append('g')
//     .selectAll('circle')
//     .data(data.nodes)
//     .enter().append('circle')
//     .attr('r', 10)
//     .attr('fill', 'red');

let nodes = [
    {id: 1, radius: 30, row: 0, fx: 0},
    {id: 2, radius: 30, row: 1},
    {id: 3, radius: 30, row: 1},
    {id: 4, radius: 30, row: 1},
    {id: 5, radius: 30, row: 1},
    {id: 6, radius: 30, row: 0, fx: 800},
    {id: 7, radius: 30, row: 2},
    {id: 8, radius: 30, row: 2},
    {id: 9, radius: 30, row: 2},
    {id: 10, radius: 30, row: 2},
];
let links = [
    {source: 1, target: 2},
    {source: 2, target: 3},
    {source: 3, target: 4},
    {source: 4, target: 5},
    {source: 5, target: 6},
    {source: 1, target: 7},
    {source: 7, target: 8},
    {source: 8, target: 9},
    {source: 9, target: 10},
    {source: 10, target: 6},
];

forceSimulation(nodes)
// .alpha(0)
// .alphaDecay(0.1)
// .alphaMin(0.6)
    .force('links', forceLink(links).id(d => d.id).distance(30).strength(1))
    .force('collision', forceCollide().radius(30))
    .force('charge', forceManyBody().strength(10))
    .force('center', forceCenter(width / 2, height / 2))
    // .force('x', forceX().strength(5).x(d => {
    //     switch (d.id) {
    //         case 1:
    //             return 0;
    //         case 6:
    //             return 600;
    //         default:
    //             return 300;
    //     }
    // } ))
    .force('y', forceY().strength(5).y(d => {
        switch (d.row) {
            case 1:
                return 200;
            case 2:
                return 400;
            default:
                return 300;
        }
    } ))
    .on('tick', ticked);

var circles = select('.nodes')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', 10);

var lines = select('.links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line');

function ticked() {
    circles
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

    lines
        .attr('stroke', '#999')
        .attr('x1', d => d.source.x)
        .attr('x2', d => d.target.x)
        .attr('y1', d => d.source.y)
        .attr('y2', d => d.target.y);
}
