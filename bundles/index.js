import jui from '../src/main.js'
import ClassicTheme from '../src/theme/classic.js'
import DarkTheme from '../src/theme/dark.js'
import LineBrush from '../src/brush/line.js'
import ScatterBrush from '../src/brush/scatter.js'
import TitleWidget from '../src/widget/title.js'
import GuideLineWidget from '../src/widget/guideline.js'

jui.use([ ClassicTheme, DarkTheme, LineBrush, ScatterBrush, TitleWidget, GuideLineWidget ]);

const time = jui.include('util.time');
const builder = jui.include('chart.builder');
const countMap = [ 300, 150, 60 ];
const dataMap = countMap.map(count => createRealtimeData(count));

const names = {
    memory: 'Memory (MB)',
    cpu: 'CPU Usage (%)',
    disk: 'Disk Size (MB)'
}

window.chart = builder('#chart', {
    width: 1000,
    height : 300,
    theme : 'classic',
    axis : [{
        x : {
            type : 'dateblock',
            realtime : 'minutes',
            interval : 1, // But number for the real-time basis
            format : 'HH:mm',
            domain : [ new Date() - time.MINUTE * 5, new Date() ]
        },
        y : {
            type : 'range',
            domain : [ 0, 100 ],
            step : 4,
            line : 'solid',
            format : function(d) {
                return d + '%';
            }
        },
        data : dataMap[0]
    }],
    brush : [{
        type : 'line',
        target : [ 'memory', 'cpu', 'disk' ]
    }],
    widget : [{
        type : 'guideline',
        xFormat : function(d) {
            return time.format(d, 'HH:mm');
        },
        tooltipFormat : function(data, key) {
            return {
                key: names[key],
                value: data[key]
            }
        }
    }],
    event: {
        'guideline.active': function(time) {
            if(time) {
                window.chart2.emit('guideline.show', time);
                window.chart3.emit('guideline.show', time);
            } else {
                window.chart2.emit('guideline.hide');
                window.chart3.emit('guideline.hide');
            }
        }
    },
    style: {
        guidelineTooltipFontColor : "#dcdcdc",
        guidelineTooltipFontSize : 14,
        guidelineTooltipBackgroundColor : "#000",
        guidelineTooltipBackgroundOpacity : 0.3
    }
});

window.chart2 = builder('#chart2', {
    width: 500,
    height : 200,
    theme : 'classic',
    axis : [{
        x : {
            type : 'dateblock',
            realtime : 'minutes',
            interval : 1, // But number for the real-time basis
            format : 'HH:mm',
            domain : [ new Date() - time.MINUTE * 5, new Date() ]
        },
        y : {
            type : 'range',
            domain : [ 0, 100 ],
            step : 4,
            line : 'solid',
            format : function(d) {
                return d + '%';
            }
        },
        data : dataMap[1]
    }],
    brush : [{
        type : 'line',
        target : [ 'memory', 'cpu', 'disk' ]
    }],
    widget : [{
        type : 'guideline',
        xFormat : function(d) {
            return time.format(d, 'HH:mm');
        },
        tooltipFormat : function(data, key) {
            return {
                key: names[key],
                value: data[key]
            }
        }
    }],
    event: {
        'guideline.active': function(time) {
            if(time) {
                window.chart.emit('guideline.show', time);
                window.chart3.emit('guideline.show', time);
            } else {
                window.chart.emit('guideline.hide');
                window.chart3.emit('guideline.hide');
            }
        }
    }
});

window.chart3 = builder('#chart3', {
    width: 700,
    height : 250,
    theme : 'dark',
    axis : [{
        x : {
            type : 'dateblock',
            realtime : 'minutes',
            interval : 1, // But number for the real-time basis
            format : 'HH:mm',
            domain : [ new Date() - time.MINUTE * 5, new Date() ]
        },
        y : {
            type : 'range',
            domain : [ 0, 100 ],
            step : 4,
            line : 'solid',
            format : function(d) {
                return d + '%';
            }
        },
        data : dataMap[2]
    }],
    brush : [{
        type : 'line',
        target : [ 'memory', 'cpu', 'disk' ]
    }],
    widget : [{
        type : 'guideline',
        xFormat : function(d) {
            return time.format(d, 'HH:mm');
        },
        tooltipFormat : function(data, key) {
            return {
                key: names[key],
                value: data[key]
            }
        }
    }],
    event: {
        'guideline.active': function(time) {
            if(time) {
                window.chart2.emit('guideline.show', time);
                window.chart3.emit('guideline.show', time);
            } else {
                window.chart2.emit('guideline.hide');
                window.chart3.emit('guideline.hide');
            }
        }
    }
});

function createRealtimeData(count) {
    const data = [];

    for(let i = 0; i < count; i++) {
        data.push({
            memory: (Math.floor(Math.random() * 30) == 1) ? 85 : 35,
            cpu: (Math.floor(Math.random() * 30) == 1) ? 55 : 25,
            disk: (Math.floor(Math.random() * 30) == 1) ? 30 : 10,
        });
    }

    return data;
}

function updateRealtimeData() {
    const axisMap = [ chart.axis(0), chart2.axis(0), chart3.axis(0) ];
    const domain = [ new Date() - time.MINUTE * 5, new Date() ];

    axisMap.forEach((axis, index) => {
        if (dataMap[index].length == countMap[index]) {
            dataMap[index].shift();
            dataMap[index].push(createRealtimeData(1)[0]);

            axis.set('x', { domain: domain });
            axis.update(dataMap[index]);
        }
    });
}

setInterval(function() {
    updateRealtimeData();

    chart.render();
    chart2.render();
    chart3.render();
}, 2000);