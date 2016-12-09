(function() {
    'use strict';

    angular.module('stickyheader', [])
        .directive('stickyheader', function($timeout) {
            return {
                scope: {
                    'datafill':'=',
                    'fill':'@'
                },
                link: function(scope, elem) {
                var init = function(){//sticky heads$columns main process
                    if (elem.find('thead').length > 0 && elem.find('th').length > 0) {
                                    elem
                                        .addClass('sticky-enabled')
                                        .css({
                                            margin: 0,
                                            width: '100%'
                                        }).wrap('<div class="sticky-wrap" />');

                                    elem.parent().addClass('overflow-y');

                                    elem.after('<table class="sticky-thead" />');
                                    scope.thead = elem.find('thead').clone();
                                    scope.col = elem.find('tbody').clone();
                                    // If <tbody> contains <th>, then we create sticky column and intersect (advanced)
                                    if (elem.find('tbody').find('th').length > 0) {
                                        elem.after('<table class="sticky-col" /><table class="sticky-intersect" />');
                                        // Create shorthand for things
                                        scope.stickyCol = elem.next();
                                        scope.stickyInsct = scope.stickyCol.next();
                                        scope.stickyHead = scope.stickyInsct.next();
                                        scope.stickyInsct.html('<thead><tr>' + elem.find('thead').find('th')[0].outerHTML + '</tr></thead>');
                                        // scope.stickyInsct.html('<thead><tr><th>'+elem.find('thead').find('th').eq(0).html()+'</th></tr></thead>');
                                        var rowspan = elem.find('thead').find('th').eq(0).attr('rowspan');
                                        var thHeight = scope.stickyInsct.find('th')[0].offsetHeight;
                                        if (rowspan > 1) {
                                            scope.stickyInsct.find('th').css('height', rowspan * thHeight + 'px');
                                        }
                                        scope.stickyCol.append(scope.stickyInsct.find('thead').clone());
                                        scope.stickyCol
                                            .append(scope.col)
                                            .find('td').remove();
                                    } else {
                                        scope.stickyHead = elem.next();
                                    }
                                    scope.stickyWrap = elem.parent();
                                    scope.stickyHead.append(scope.thead);

                                    // Set widths
                                    scope.setWidths = function() {
                                        // Set width of sticky table head
                                        scope.stickyHead.css('width', elem[0].offsetWidth + 'px');
                                        // Set width of sticky table col
                                        if (scope.stickyInsct) {
                                            scope.stickyHead.find('th').eq(0).css('width', elem.find('th')[0].offsetWidth + 'px');
                                            scope.stickyInsct.find('th').css('width', elem.find('th')[0].offsetWidth + 'px');
                                            scope.stickyCol.find('thead').find('th').css('width', elem.find('th')[0].offsetWidth + 'px');
                                        }
                                    };
                                    scope.repositionStickyHead = function() {
                                        if (scope.stickyWrap[0].scrollTop > 0) {
                                            // When top of wrapping parent is out of view
                                            scope.stickyHead.css({
                                                opacity: 1,
                                                top: scope.stickyWrap[0].scrollTop + 'px'
                                            });
                                            if (scope.stickyInsct) {
                                                scope.stickyInsct.css({
                                                    opacity: 1,
                                                    top: scope.stickyWrap[0].scrollTop + 'px'
                                                });
                                            }

                                        } else {
                                            // When top of wrapping parent is in view
                                            scope.stickyHead.css({
                                                opacity: 0,
                                                top: 0
                                            });
                                            if (scope.stickyInsct) {
                                                scope.stickyInsct.css({
                                                    opacity: 0,
                                                    top: 0
                                                });
                                            }
                                        }
                                    };
                                    scope.repositionStickyCol = function() {
                                        if (scope.stickyWrap[0].scrollLeft > 0) {
                                            // When left of wrapping parent is out of view
                                            scope.stickyCol.css({
                                                opacity: 1,
                                                left: scope.stickyWrap[0].scrollLeft + 'px'
                                            });
                                            scope.stickyInsct.css({
                                                opacity: 1,
                                                left: scope.stickyWrap[0].scrollLeft + 'px'
                                            });
                                        } else {
                                            // When left of wrapping parent is in view
                                            scope.stickyCol.css({ opacity: 0 });
                                            scope.stickyInsct.css({ left: 0 });
                                        }
                                    };
                                    scope.setWidths();
                                    scope.stickyWrap.on('scroll', function(e) {
                                        if (scope.Timer) {
                                            $timeout.cancel(scope.Timer);
                                        }
                                        //throttle
                                        scope.Timer = $timeout(function() {
                                            if (scope.stickyWrap.children().length > 2) {
                                                scope.repositionStickyHead();
                                                scope.repositionStickyCol();
                                            } else {
                                                scope.repositionStickyHead();
                                            }
                                        }, 200)
                                        e.stopPropagation();
                                    });
                                    window.onresize = function(e){
                                        if (scope.wTimer) {
                                            $timeout.cancel(scope.wTimer);
                                        }
                                        //throttle
                                        scope.wTimer = $timeout(function() {
                                            scope.setWidths();
                                        }, 250)
                                        e.stopPropagation();
                                    }
                                }
                }
                    if(scope.fill=='false'){//if no http request or other timeout things
                        init();
                    }else{
                        // data refresh and th could be changed
                        var watch = scope.$watch('datafill', function(newV, oldV) {
                        if (newV) {//
                            if(elem.parent().hasClass('sticky-wrap')){//if change again
                                $timeout(function() {//run after compile
                                    if (elem.find('thead').length > 0 && elem.find('th').length > 0) {
                                        scope.thead = elem.find('thead').clone();
                                        scope.col = elem.find('tbody').clone();
                                        if(scope.stickyInsct){
                                            scope.stickyCol.html('');
                                            scope.stickyInsct.html('');
                                            scope.stickyHead.html('');
                                            scope.stickyInsct.html('<thead><tr>' + elem.find('thead').find('th')[0].outerHTML + '</tr></thead>');
                                            // scope.stickyInsct.html('<thead><tr><th>'+elem.find('thead').find('th').eq(0).html()+'</th></tr></thead>');
                                            var rowspan = elem.find('thead').find('th').eq(0).attr('rowspan');
                                            var thHeight = scope.stickyInsct.find('th')[0].offsetHeight;
                                            if (rowspan > 1) {
                                                scope.stickyInsct.find('th').css('height', rowspan * thHeight + 'px');
                                            }
                                            scope.stickyCol.append(scope.stickyInsct.find('thead').clone());
                                            scope.stickyCol
                                                .append(scope.col)
                                                .find('td').remove();
                                        }else{
                                            scope.stickyHead.html('');
                                            scope.stickyHead = elem.next();
                                        }
                                        scope.stickyHead.append(scope.thead);
                                        scope.setWidths();
                                        }
                                })
                            }else{//first time change
                                $timeout(function() {//run after compile
                                   init(); 
                                })
                            }
                        }
                        },true);
                        //data refresh and th can't be changed
                        // var watch = scope.$watch('datafill', function(newV, oldV) {
                        // if (newV) {//data fetched
                        //         $timeout(function() {//run after compile
                        //            init(); 
                        //         })
                        // }
                        // });
                    }
                }
            }
        });
})();
