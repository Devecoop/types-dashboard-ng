"use strict";angular.module("lelylan.dashboards.type",["lelylan.dashboards.dimension","lelylan.dashboards.column","lelylan.dashboards.menu","lelylan.directives.type","config","ngRoute"]),angular.module("lelylan.dashboards.type").config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/types.html",controller:"TypesCtrl"}).when("/types/:id/",{templateUrl:"views/type.html",controller:["$scope","$rootScope","$routeParams",function(a,b,c){a.id=c.id,a.url=window.location.href,b.page="type",b.loading=!1}]}).when("/types/:id/embed",{templateUrl:"views/type.html",controller:["$scope","$rootScope","$routeParams",function(a,b,c){a.id=c.id,b.embed="embed",b.loading=!1}]}).when("/create",{templateUrl:"views/create.html",controller:"CreateCtrl"}).when("/login",{templateUrl:"views/login.html",controller:["$rootScope","$timeout","AccessToken",function(a,b,c){a.loading=!1,b(function(){c.get()&&($location.path("/"),$location.replace())},0)}]}).when("/expired",{templateUrl:"views/expired.html",controller:["$rootScope",function(a){a.loading=!1}]}).when("/no-types",{templateUrl:"views/no-types.html",controller:["$rootScope",function(a){a.loading=!1}]}).when("/access_token=:accessToken",{template:"-",controller:["$location","$route","$routeParams","$timeout","AccessToken",function(a,b,c,d,e){var f=a.path().substr(1);e.setTokenFromString(f),a.path("/"),a.replace()}]}).otherwise({redirectTo:"/"})}]),angular.module("lelylan.dashboards.type").config(["$httpProvider",function(a){a.responseInterceptors.push("myHttpInterceptor");var b=function(a){return $("#spinner").show(),a};a.defaults.transformRequest.push(b)}]),angular.module("lelylan.dashboards.type").factory("myHttpInterceptor",["$q","$window",function(a){return function(b){return b.then(function(a){return $("#spinner").hide(),a},function(b){return $("#spinner").hide(),a.reject(b)})}}]),angular.module("lelylan.dashboards.type").directive("dynFbCommentBox",function(){function a(a,b,c,d,e){return'<div class="fb-comments" data-href="'+a+'" data-numposts="'+b+'" data-width="'+c+'" data-mobile="'+d+'" data-colorsheme="'+e+'"></div>'}return{restrict:"A",scope:{},link:function(b,c,d){d.$observe("pageHref",function(b){var e=b,f=d.numposts||5,g=d.width||"100px",h=d.mobile||!1,i=d.colorscheme||"light";c.html(a(e,f,g,h,i)),FB.XFBML.parse(c[0])})}}}),angular.module("config",[]).constant("ENV",{name:"production",endpoint:"http://api.lelylan.com",credentials:{site:"http://people.lelylan.com",clientId:"0f132c8b234ce0018ae0a77d8e9f06126e140885ba86d83f41a168a2aacda7da",redirectUri:"http://lelylan.github.io/types-dashboard-ng",profileUri:"http://api.lelylan.com/me"}}),angular.module("lelylan.dashboards.type").controller("MainCtrl",["$scope","$rootScope","$timeout","$q","$location","$route","$cacheFactory","ENV","Device","Type","Category","AccessToken","Dimension","Column","Menu",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){a.logged=function(){return!!l.get()},a.dimensions=m.get(),a.columns=n.get(),a.menu=o.get(),a.credentials=h.credentials,a.typology="populars",b.load=function(){var c,f=k.all({},{cache:!0}).success(function(a){b.categories=a,b.categories.unshift({tag:"all",name:"All"}),b.currentCategory=b.categories[0]}),g=function(a){0==a.length&&e.path("/no-types"),b.all=a,b.types=a};"populars"==a.typology&&(c=j.popular({per:100},{cache:!0}).success(g)),"recents"==a.typology&&(c=j.public({per:50},{cache:!0}).success(g)),"yours"==a.typology&&(c=j.all({per:100},{cache:!0}).success(g)),d.all([f,c]).then(function(){_.map(b.categories,function(a){a.types=_.countBy(b.all,function(b){return b.category==a.tag?"count":"missed"}).count}),b.categories[0].types=b.all.length,h()});var h=function(){b.loading=!1,b.setCategory(b.categories[0]),a.currentType=b.types[0]}},b.setTypology=function(c){e.path("/"),a.typology=c,b.load()},a.$on("oauth:expired",function(){e.path("expired")})}]),angular.module("lelylan.dashboards.type").controller("TypesCtrl",["$scope","$rootScope","$timeout","$q","$location","$route","$cacheFactory","ENV","Device","Type","Category","AccessToken","Dimension","Column","Menu",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){b.load(),b.page="types",b.setCategory=function(c){c.types&&(b.currentCategory=c,b.types="all"==c.tag?b.all:_.where(b.all,{category:c.tag}),a.currentType=b.types[0],"one"==a.columns.count&&(n.setVisible({one:!1,two:!0,three:!1}),n.set(a.dimensions)))},a.selectType=function(b){a.currentType=b,"two"==a.columns.count&&(n.setVisible({one:!1,two:!0,three:!0}),o.set("categories")),"one"==a.columns.count&&(n.setVisible({one:!1,two:!1,three:!0}),o.set("list"))},b.$on("lelylan:type:delete",function(b,c){var d=g.get("$http").get(h.endpoint+"/types/popular"),e=JSON.parse(d[1]),i=_.find(e,function(a){return a.id==c.id});if(i){var j=e.indexOf(i);e.splice(j,1),d[1]=JSON.stringify(e)}"one"==a.columns.count&&(n.setVisible({one:!1,two:!0,three:!1}),o.set("categories")),f.reload()}),b.moveToCategories=function(){"two"==a.columns.count&&(n.setVisible({one:!0,two:!0,three:!1}),o.set("none")),"one"==a.columns.count&&(n.setVisible({one:!0,two:!1,three:!1}),o.set("none"))},b.moveToTypes=function(){"one"==a.columns.count&&(n.setVisible({one:!1,two:!0,three:!1}),o.set("categories"))},"one"==a.columns.count&&(n.setVisible({one:!1,two:!0,three:!1}),o.set("categories"))}]),angular.module("lelylan.dashboards.type").controller("CreateCtrl",["$scope","$rootScope","$location","$cacheFactory","$timeout","ENV","Device","Type","AccessToken","Menu",function(a,b,c,d,e,f,g,h,i,j){b.loading=!1,j.set("lelylan"),b.page="create",a.createType=function(){h.create({name:a.type.name,category:"others"}).success(function(b){a.type.id=b.id})},a.complete=function(){d.get("$http").remove(f.endpoint+"/types?per=100"),d.get("$http").remove(f.endpoint+"/types/"+a.type.id),c.path("/"),b.setTypology("yours")}}]);var service=angular.module("lelylan.dashboards.dimension",[]);service.factory("Dimension",["$window","$rootScope","Column",function(a,b,c){var d=angular.element(a),e={},f={menu:4.3,spacing:.5,typology:1.8},g={};g.get=function(){return e};var h=function(){e.width=i(d.width()),e.height=i(d.height())-f.menu-f.typology,c.set(e),"one"==c.get().count&&(e.height+=f.spacing)},i=function(a){var b=parseFloat($("body").css("font-size"));return a/b};return d.bind("resize",function(){b.$apply(function(){h()})}),h(),g}]);var service=angular.module("lelylan.dashboards.column",[]);service.factory("Column",["$location","Menu",function(a,b){var c={},d={three:69,two:46},e={visible:{one:!1,two:!1,three:!1},count:void 0};c.get=function(){return e},c.set=function(c){f(c),g(c),h(c),"/"!=a.path()&&b.set("lelylan")};var f=function(a){a.width>d.three&&("three"!=e.count&&(e.visible={one:!0,two:!0,three:!0}),b.set("lelylan"),e.count="three")},g=function(a){a.width<d.three&&a.width>d.two&&("two"!=e.count&&(e.visible={one:!1,two:!0,three:!0}),e.visible.one&&b.set("none"),e.visible.two&&b.set("categories"),e.count="two")},h=function(a){a.width<d.two&&("one"!=e.count&&(e.visible={one:!1,two:!0,three:!1}),e.visible.one&&b.set("none"),e.visible.two&&b.set("categories"),e.visible.three&&b.set("list"),e.count="one")};return c.setVisible=function(a){e.visible=a},c}]);var service=angular.module("lelylan.dashboards.menu",[]);service.factory("Menu",function(){var a={},b={visible:{lelylan:!1,categories:!1,list:!1}};return a.get=function(){return b},a.set=function(a){_.each(b.visible,function(c,d){b.visible[d]=d==a?!0:!1})},a});