import jui from '../src/main.js'
import TopologyNodeBrush from '../src/brush/topologynode.js'
import TopologyCtrlWidget from '../src/widget/topologyctrl.js'
import ClassicIcon from '../src/icon/classic.js'

jui.use([ TopologyNodeBrush, TopologyCtrlWidget, ClassicIcon ]);

function rnd(count) {
    return Math.floor(Math.random() * count);
}

function getRandomData(count, outer, inner) { // 노드 개수, 바깥 연결 개수, 안쪽 연결 개수
    var w = 800, h = 600;
    var data = [];
    for(var i = 0; i < count; i++) {
        var x = rnd(w),
            y = rnd(h);
        data.push({ name: "W" + (i + 1), x: x, y: y, outgoing: [], incoming: [] });
    }
    for(var i = 0; i < outer; i++) {
        var index = rnd(count),
            outerIndex = rnd(count);
        data[index].outgoing.push(outerIndex);
    }
    for(var i = 0; i < inner; i++) {
        var index = rnd(count),
            innerIndex = rnd(count);
        data[index].incoming.push(innerIndex);
    }
    return data;
}

var data = [
    { key: "1000_1", name: "W1", type: "was", outgoing: [ "1000_1" ] },
    { key: "1000_2", name: "W2", type: "was", outgoing: [ "1000_3", "1000_4" ] },
    { key: "1000_3", name: "W3", type: "was", outgoing: [ "1_2_3_4", "1000_2" ] },
    { key: "1000_4", name: "W4", type: "server", outgoing: [ "1_2_3_4" ] },
    { key: "1_2_3_4", name: "Oracle", type: "db", outgoing: [] }
];

var data2 = [
    { key: "1000_1", name: "W1", type: 1, x: 100, y: 100, outgoing: [] },
    { key: "1000_2", name: "W2", type: 1, x: 100, y: 200, outgoing: [ "1000_1" ] }
];

var edgeData = [
    { key: "1000_1:1000_2", count: 3, time: 1000 },
    { key: "1000_2:1000_3", count: 3, time: 1000 },
    { key: "1000_2:1000_4", count: 3, time: 1000 },
    { key: "1000_3:1_2_3_4", count: 3, time: 2000 },
    { key: "1000_3:1000_2", count: 3, time: 2000 },
    { key: "1000_4:1_2_3_4", count: 3, time: 2000 }
];

jui.ready([ "chart.builder", "util.base" ], function(builder, _) {
    var c = builder("#chart", {
        icon: {
            type: "classic",
            path: [
                "../images/icon/icomoon.eot",
                "../images/icon/icomoon.svg",
                "../images/icon/icomoon.ttf",
                "../images/icon/icomoon.woff"
            ]
        },
        theme: "classic",
        padding: 5,
        axis: [{
            c: {
                type: "topologytable"
            },
            data: data
        }],
        brush: {
            type: "topologynode",
            colors: [ "#729ff1" ],
            edgeData: edgeData,
            edgeText: function(data, align) {
                var text = data.time + "/" + data.count;
                if(align == "end") {
                    text = text + " →";
                } else {
                    text = "← " + text;
                }
                return text;
            },
            edgeOpacity: function(data) {
                if(data.time > 1000) return 1;
                return 0.3;
            },
            tooltipTitle: function(data, align) {
                if(align == "start") {
                    return data.reverse().join(" ← ");
                }
                return data.join(" → ");
            },
            tooltipText: function(data) {
                return "총 응답시간/개수 : " + data.time + "/" + data.count;
            },
            /*/
            nodeImage: function(data) {
                return "resource/" + data.type + ".png";
            },
            /**/
            nodeText: function(data) {
                if(data.type == "server") {
                    return "{server}";
                } else if(data.type == "was") {
                    return "{was}";
                } else {
                    return "{db}";
                }
            },
            nodeTitle: function(data) {
                return data.name;
            },
            nodeScale: function(data) {
                var len = data.outgoing.length;
                if(len > 1) {
                    return 2;
                }
                return 1;
            },
            activeEdge: "1000_2:1000_3",
            //activeNode: "1000_2",
            activeEvent: "dblclick"
        },
        widget: {
            type: "topologyctrl",
            zoom: true,
            move: true
        },
        event: {
            "topology.edgeclick": function(data, e) {
                console.log("edgeclick ---------------------");
                console.log(data);
            },
            "topology.nodeclick": function(data, e) {
                console.log("nodeclick ---------------------");
                console.log(data);
            },
            "click": function(obj, e) {
                console.log("click ----------------");
                console.log(obj);
            }
        },
        style: {
            axisBackgroundColor: "#fff",
            axisBackgroundOpacity: 1,
            topologyEdgeWidth : 1
        }
    });
});