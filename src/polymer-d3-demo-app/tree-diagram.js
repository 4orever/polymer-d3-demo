import * as d3hierarchy from "d3-hierarchy";
import {event, select} from "d3-selection";
import {zoom} from "d3-zoom";

const
    width = 500,
    bar = {
        height: 30,
        width: 140,
        color: '#aaa',
        opacity: '0.5'
    };

export default class TreeDiagram {
    constructor(data) {
        const svg = select('svg');
        const container = svg.append('g');

        this.g = container.append('g').attr("transform", 'translate(300,600)');
        this.g.append('g').attr('class', 'nodes');
        this.g.append('g').attr('class', 'links');

        this.newIndex = 0;
        this.nodes = d3hierarchy.stratify()
            .parentId(d => d.parent)(data);

        svg.call(zoom().on('zoom', () => {
            container.attr('transform', event.transform);
        }));

        this.update(this.nodes);
    }

    buildTree(nodes) {
        nodes.each(n => {
            let treeWidth = {}, max = 0;
            n.descendants().forEach(d => {
                if (treeWidth[d.depth] === undefined) treeWidth[d.depth] = 0;
                treeWidth[d.depth]++;
            });
            Object.keys(treeWidth).forEach(key => {
                if (treeWidth[key] > max) max = treeWidth[key];
            });
            n.width = max;
        });
        return d3hierarchy.tree().nodeSize([bar.height + 20, bar.width + 150]).separation((a, b) => {
            let childrenWidth = b.parent.children.map(d => d.width);
            return Math.max(...childrenWidth);
        })(nodes);
    }

    update(nodes, clicked) {
        if (!clicked) {
            clicked = {x: 0, y: 0}
        }
        const tree = this.buildTree(nodes);
        const node = this.g.select('g.nodes').selectAll('g.node').data(tree.descendants().reverse(), d => d.id);
        const link = this.g.select('g.links')
            .selectAll('line')
            .data(tree.links(), d => d.source.id + '_' + d.target.id)
            .attr('stroke', '#555');
        const nodeEnter = node.enter()
            .append('g')
            .attr('class', 'node')
            .attr('opacity', '0')
            .attr("transform", d => `translate(${clicked.y - bar.width / 2},${clicked.x - bar.height / 2})`);

        node.transition().duration(200)
            .attr("transform", d => `translate(${d.y - bar.width / 2},${d.x - bar.height / 2})`);

        nodeEnter.on('click', (d) => {
            this.onNodeClick(d)
        });

        nodeEnter.append('rect')
            .attr('height', bar.height)
            .attr('width', bar.width)
            .attr('fill', bar.color)
            .attr('opacity', bar.opacity);

        nodeEnter.append('text')
            .attr('y', 20)
            .attr('x', 10)
            .text(d => d.data.name);

        nodeEnter.transition().duration(500).delay(200)
            .attr('opacity', '1')
            .attr("transform", d => `translate(${d.y - bar.width / 2},${d.x - bar.height / 2})`);

        node.exit().remove();

        link.transition().duration(200)
            .attr('x1', d => d.source.y + bar.width / 2)
            .attr('x2', d => d.target.y - bar.width / 2)
            .attr('y1', d => d.source.x)
            .attr('y2', d => d.target.x);

        link.enter()
            .append('line')
            .attr('stroke', '#555')
            .attr('x1', clicked.y + bar.width / 2)
            .attr('x2', clicked.y + bar.width / 2)
            .attr('y1', clicked.x)
            .attr('y2', clicked.x)
            .transition().delay(200).duration(500)
            .attr('x1', d => d.source.y + bar.width / 2)
            .attr('x2', d => d.target.y - bar.width / 2)
            .attr('y1', d => d.source.x)
            .attr('y2', d => d.target.x);

        link.exit().remove();
    }

    onNodeClick(d) {
        const newNode = d3hierarchy.hierarchy({name: "new node", id: ++this.newIndex});
        d3hierarchy.tree()(newNode);
        newNode.parent = d;
        newNode.depth = d.depth + 1;
        newNode.height = d.height - 1;
        newNode.id = this.newIndex;

        if (!d.children) {
            d.children = [];
        }
        if (!d.data.children) {
            d.data.children = [];
        }
        d.children.push(newNode);
        d.data.children.push(newNode.data);

        this.update(this.nodes, d);
    }

}