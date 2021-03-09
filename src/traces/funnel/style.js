'use strict';

var d3 = require('@plotly/d3');

var Drawing = require('../../components/drawing');
var Color = require('../../components/color');
var barStyle = require('../bar/style');
var resizeText = require('../bar/uniform_text').resizeText;
var styleTextPoints = barStyle.styleTextPoints;

function style(gd) {
    var s = d3.select(gd).selectAll('g.funnellayer').selectAll('g.trace');
    resizeText(gd, s, 'bar');

    var barcount = s.size();
    var fullLayout = gd._fullLayout;

    // trace styling
    s.style('opacity', function(d) { return d[0].trace.opacity; })

    // for gapless (either stacked or neighboring grouped) bars use
    // crispEdges to turn off antialiasing so an artificial gap
    // isn't introduced.
    .each(function(d) {
        if((fullLayout.barmode === 'stack' && barcount > 1) ||
                (fullLayout.bargap === 0 &&
                 fullLayout.bargroupgap === 0 &&
                 !d[0].trace.marker.line.width)) {
            d3.select(this).attr('shape-rendering', 'crispEdges');
        }
    });

    s.selectAll('g.points').each(function(d) {
        var sel = d3.select(this);
        var trace = d[0].trace;
        stylePoints(sel, trace, gd);
    });

    /*
    s.each(function(d) {
        var gTrace = d3.select(this);
        var trace = d[0].trace;

        gTrace.selectAll('.regions').each(function() {
            d3.select(this).selectAll('path').style('stroke-width', 0).call(Color.fill, trace.connector.fillcolor);
        });

        gTrace.selectAll('.lines').each(function() {
            var cont = trace.connector.line;

            Drawing.lineGroupStyle(
                d3.select(this).selectAll('path'),
                cont.width,
                cont.color,
                cont.dash
            );
        });
    });
    */
}

function stylePoints(sel, trace, gd) {
    Drawing.pointStyle(sel.selectAll('path'), trace, gd);
    styleTextPoints(sel, trace, gd);
}

module.exports = {
    style: style
};
