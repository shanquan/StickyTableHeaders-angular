#StickyTableHeaders-angular
##冻结行、列，数据延迟加载的angular表格插件
- 根据[StickyTableHeaders](http://tympanus.net/Tutorials/StickyTableHeaders/)（点击查看在线demo及教程）上的jquery插件，增加了一个angular版的插件和demo
- angular插件支持数据延迟加载，表格延迟加载和动态刷新
- angular插件仅支持容器内滚动条，不支持随窗口一起滚动

##使用
- 数据随页面一起加载时的用法：`<table stickyheader fill='false'>`
- 数据动态加载时的用法：`<table stickyheader datafill='list'>`，其中$scope.list为侦听的数据值，一旦检测$scope.list发生变化则动态渲染表格

##说明
如果表格的列内容一直不会发生变化，scope.$watch可不带true参数：(见angular.stickyheaders.js最后注释初代码，也可修改增加插件的参数进行设置)
```
var watch = scope.$watch('datafill', function(newV, oldV) {
                        if (newV) {//data fetched
                                $timeout(function() {//run after compile
                                   init(); 
                                })
                        }
                        });
```
