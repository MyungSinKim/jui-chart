import jui from "../main.js";

export default {
    name: "chart.widget.zoom",
    extend: "chart.widget.core",
    component: function() {
        var _ = jui.include("util.base");

        var ZoomWidget = function() {
            var self = this,
                top = 0,
                left = 0;

            function setDragEvent(axisIndex, thumb, bg) {
                var axis = self.chart.axis(axisIndex),
                    xtype = axis.get("x").type,
                    startDate = null, // only date
                    isMove = false,
                    mouseStart = 0,
                    thumbWidth = 0;

                self.on("axis.mousedown", function(e) {
                    if(isMove) return;

                    isMove = true;
                    mouseStart = e.bgX;

                    if(xtype == "date") { // x축이 date일 때
                        startDate = axis.x.invert(e.chartX);
                    }

                    self.chart.emit("zoom.start");
                }, axisIndex);

                self.on("axis.mousemove", function(e) {
                    if(!isMove) return;

                    thumbWidth = e.bgX - mouseStart;

                    if(thumbWidth > 0) {
                        thumb.attr({
                            width: thumbWidth
                        });

                        thumb.translate(mouseStart, top + axis.area("y"));
                    } else {
                        thumb.attr({
                            width: Math.abs(thumbWidth)
                        });

                        thumb.translate(mouseStart + thumbWidth, top + axis.area("y"));
                    }
                }, axisIndex);

                self.on("axis.mouseup", endZoomAction, axisIndex);
                self.on("chart.mouseup", endZoomAction);
                self.on("bg.mouseup", endZoomAction);
                self.on("bg.mouseout", endZoomAction);

                function endZoomAction(e) {
                    var args = [];

                    isMove = false;
                    if(thumbWidth == 0) return;

                    if(xtype == "block") {
                        args = updateBlockGrid();
                    } else if(xtype == "date") {
                        if(startDate != null) {
                            args = updateDateGrid(axis.x.invert(e.chartX));
                        }
                    }

                    resetDragStatus();
                    self.chart.emit("zoom.end", args);
                }

                function updateBlockGrid() {
                    var range = axis.end - axis.start,
                        tick = axis.area("width") / (range > 0 ? range : axis.data.length),
                        x = ((thumbWidth > 0) ? mouseStart : mouseStart + thumbWidth) - left,
                        start = Math.floor(x / tick) + axis.start,
                        end = Math.ceil((x + Math.abs(thumbWidth)) / tick) + axis.start;

                    // 차트 줌
                    if(start < end) {
                        axis.zoom(start, end);
                        bg.attr({ "visibility": "visible" });

                        // 차트 렌더링이 활성화되지 않았을 경우
                        if(!self.chart.isRender()) {
                            self.chart.render();
                        }

                        return [ start, end ];
                    }
                }

                function updateDateGrid(endDate) {
                    var stime = startDate.getTime(),
                        etime = endDate.getTime();

                    if(stime >= etime) return;

                    var interval = self.widget.interval,
                        format = self.widget.format;

                    // interval 콜백 옵션 설정
                    if(_.typeCheck("function", interval)) {
                        interval = interval.apply(self.chart, [ stime, etime ]);
                    }
                    // format 콜백 옵션 설정
                    if(_.typeCheck("function", format)) {
                        format = format.apply(self.chart, [ stime, etime ]);
                    }

                    axis.updateGrid("x", {
                        domain: [ stime, etime ],
                        interval: (interval != null) ? interval : axis.get("x").interval,
                        format: (format != null) ? format : axis.get("x").format
                    });
                    bg.attr({ "visibility": "visible" });

                    // 차트 렌더링이 활성화되지 않았을 경우
                    if(!self.chart.isRender()) {
                        self.chart.render();
                    }

                    return [ stime, etime ];
                }

                function resetDragStatus() { // 엘리먼트 및 데이터 초기화
                    isMove = false;
                    mouseStart = 0;
                    thumbWidth = 0;
                    startDate = null;

                    thumb.attr({
                        width: 0
                    });
                }
            }

            this.drawSection = function(axisIndex) {
                var axis = this.chart.axis(axisIndex),
                    xtype = axis.get("x").type,
                    domain = axis.get("x").domain,
                    interval = axis.get("x").interval,
                    format = axis.get("x").format,
                    cw = axis.area("width"),
                    ch = axis.area("height"),
                    r = 12;

                return this.chart.svg.group({}, function() {
                    var thumb = self.chart.svg.rect({
                        height: ch,
                        fill: self.chart.theme("zoomBackgroundColor"),
                        opacity: 0.3
                    });

                    var bg = self.chart.svg.group({
                        visibility: "hidden"
                    }, function() {
                        self.chart.svg.rect({
                            width: cw,
                            height: ch,
                            fill: self.chart.theme("zoomFocusColor"),
                            opacity: 0.2
                        });

                        self.chart.svg.group({
                            cursor: "pointer"
                        }, function() {
                            self.chart.svg.circle({
                                r: r,
                                cx: cw,
                                cy: 0,
                                opacity: 0
                            });

                            self.chart.svg.path({
                                d: "M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10s10-4.5,10-10C22,6.5,17.5,2,12,2z M16.9,15.5l-1.4,1.4L12,13.4l-3.5,3.5 l-1.4-1.4l3.5-3.5L7.1,8.5l1.4-1.4l3.5,3.5l3.5-3.5l1.4,1.4L13.4,12L16.9,15.5z",
                                fill: self.chart.theme("zoomFocusColor")
                            }).translate(cw - r, -r);
                        }).on("click", function(e) {
                            bg.attr({ visibility: "hidden" });

                            if(xtype == "block") {
                                axis.screen(1);
                            } else if(xtype == "date") {
                                axis.updateGrid("x", {
                                    domain: domain,
                                    interval: interval,
                                    format: format
                                });
                            }

                            // 차트 렌더링이 활성화되지 않았을 경우
                            if(!self.chart.isRender()) {
                                self.chart.render();
                            }

                            // 줌 종료
                            self.chart.emit("zoom.close");
                        });

                    }).translate(left + axis.area("x"), top + axis.area("y"));

                    setDragEvent(axisIndex, thumb, bg);
                });
            }

            this.drawBefore = function() {
                top = this.chart.padding("top");
                left = this.chart.padding("left");
            }

            this.draw = function() {
                var g = this.chart.svg.group(),
                    list = (_.typeCheck("array", this.widget.axis)) ? this.widget.axis : [ this.widget.axis ];

                for (var i = 0; i < list.length; i++) {
                    g.append(this.drawSection(list[i]));
                }

                return g;
            }
        }

        ZoomWidget.setup = function() {
            return {
                axis: 0,

                /** @cfg {Number} [interval=1000] Sets the interval of the scale displayed on a grid.*/
                interval: null,
                /** @cfg {Function} [format=null]  Determines whether to format the value on an axis. */
                format: null
            }
        }

        return ZoomWidget;
    }
}