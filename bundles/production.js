import jui from '../src/main.js'
import ClassicIcon from '../src/icon/classic.js'
import ClassicPattern from '../src/pattern/classic.js'
import GradientTheme from '../src/theme/gradient.js'
import PatternTheme from '../src/theme/pattern.js'
import TopologyTableWidget from '../src/grid/topologytable.js'
import BarBrush from '../src/brush/bar.js'
import StackBarBrush from '../src/brush/stackbar.js'
import FullStackBarBrush from '../src/brush/fullstackbar.js'
import RangeBarBrush from '../src/brush/rangebar.js'
import ColumnBrush from '../src/brush/column.js'
import StackColumnBrush from '../src/brush/stackcolumn.js'
import FullStackColumnBrush from '../src/brush/fullstackcolumn.js'
import RangeColumnBrush from '../src/brush/rangecolumn.js'
import LineBrush from '../src/brush/line.js'
import AreaBrush from '../src/brush/area.js'
import StackAreaBrush from '../src/brush/stackarea.js'
import RangeAreaBrush from '../src/brush/rangearea.js'
import ScatterBrush from '../src/brush/scatter.js'
import BubbleBrush from '../src/brush/bubble.js'
import PieBrush from '../src/brush/pie.js'
import DonutBrush from '../src/brush/donut.js'
import TreeMapBrush from '../src/brush/treemap.js'
import HeatMapBrush from '../src/brush/heatmap.js'
import TimeLineBrush from '../src/brush/timeline.js'
import TopologyNodeBrush from '../src/brush/topologynode.js'
import FocusBrush from '../src/brush/focus.js'
import PinBrush from '../src/brush/pin.js'
import SelectBoxBrush from '../src/brush/selectbox.js'
import Equalizer from '../src/brush/equalizer.js'
import EqualizerBar from '../src/brush/equalizerbar.js'
import EqualizerColumn from '../src/brush/equalizercolumn.js'
import Column3dBrush from '../src/brush/polygon/column3d.js'
import Line3dBrush from '../src/brush/polygon/line3d.js'
import CanvasDot3dBrush from '../src/brush/canvas/dot3d.js'
import CanvasEqualizerColumnBrush from '../src/brush/canvas/equalizercolumn.js'
import CrossWidget from '../src/widget/cross.js'
import LegendWidget from '../src/widget/legend.js'
import TitleWidget from '../src/widget/title.js'
import TooltipWidget from '../src/widget/tooltip.js'
import TopologyCtrlWidget from '../src/widget/topologyctrl.js'
import Rotate3dWidget from '../src/widget/polygon/rotate3d.js'

jui.use([
    ClassicIcon,
    ClassicPattern,
    GradientTheme,
    PatternTheme,
    TopologyTableWidget,
    BarBrush,
    StackBarBrush,
    FullStackBarBrush,
    RangeBarBrush,
    ColumnBrush,
    StackColumnBrush,
    FullStackColumnBrush,
    RangeColumnBrush,
    LineBrush,
    AreaBrush,
    StackAreaBrush,
    RangeAreaBrush,
    ScatterBrush,
    BubbleBrush,
    PieBrush,
    DonutBrush,
    TreeMapBrush,
    HeatMapBrush,
    TimeLineBrush,
    TopologyNodeBrush,
    FocusBrush,
    PinBrush,
    SelectBoxBrush,
    Equalizer,
    EqualizerBar,
    EqualizerColumn,
    Column3dBrush,
    Line3dBrush,
    CanvasDot3dBrush,
    CanvasEqualizerColumnBrush,
    CrossWidget,
    LegendWidget,
    TitleWidget,
    TooltipWidget,
    TopologyCtrlWidget,
    Rotate3dWidget
]);

window.jui = window.JUI = jui;