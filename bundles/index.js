import jui from '../src/main.js'
import ClassicTheme from '../src/theme/classic.js'
import HeatmapScatterBrush from '../src/brush/heatmapscatter.js'
import TitleWidget from '../src/widget/title.js'
import DragselectWidget from '../src/widget/dragselect.js'
import TooltipWidget from '../src/widget/tooltip.js'

jui.use([ ClassicTheme, HeatmapScatterBrush, TitleWidget, DragselectWidget, TooltipWidget ]);

var chart = jui.include("chart.builder"),
    time = jui.include("util.time"),
    txData = [];

var c = chart("#chart", {
    height : 400,
    axis : {
        x : {
            type : "date",
            domain : getDomain(),
            interval : 1,
            realtime : "minutes",
            format : "HH:mm",
            key : "time",
            line : true
        },
        y : {
            type : "range",
            domain : [ 0, 10000 ],
            step : 5,
            line : true,
            orient : "left"
        },
        buffer : 100000
    },
    brush : {
        type : "heatmapscatter",
        target : [ "delay" ],
        yInterval : 250,
        xInterval : 5000,
        colors : function(d) {
            if(d.level == 0) {
                return "#ff0000"
            } else if(d.level == 1) {
                return "#f2ab14";
            }

            return "#4692ca";
        }
    },
    event : {
        "dragselect.end": function(data) {
            console.log(data.length);
        }
    },
    widget : [{
        type : "title",
        text : "Heat-Map Transaction View (0)"
    }, {
        type : "dragselect",
        dataType : "list"
    }, {
        type: "tooltip"
    }],
    style : {
        tooltipBorderColor: "#000"
    }
});

setInterval(function() {
    var domain = getDomain();

    appendTxData(txData, domain);
}, 5000);

setInterval(function() {
    var domain = getDomain();

    c.axis(0).update(txData);
    c.axis(0).set("x", { domain: domain });

    c.updateWidget(0, { text: "Heat-Map Transaction View (+" + txData.length + ")" });
    c.render(true);
}, 7000);

function appendTxData(list, domain) {
    var count = Math.floor(Math.random() * 100);

    for(var i = 0; i < list.length; i++) {
        if(list[i].time < domain[0]){
            list.shift();
        } else {
            break;
        }
    }

    for(var i = 0; i < count; i++) {
        var type = Math.floor(Math.random() * 6),
            data = {
                delay: Math.floor(Math.random() * 10000),
                level: 2,
                time: domain[1]
            };

        if(type > 2 && type < 5) {
            data.level = 1;
        } else if(type > 4) {
            data.level = 0;
        }

        list.push(data);
    }
}

function getDomain() {
    return [ new Date() - time.MINUTE * 5, new Date().getTime() ];
}