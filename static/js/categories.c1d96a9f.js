(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["categories"],{4886:function(e,t,c){"use strict";c.r(t);c("b0c0");var r=c("7a23"),n={class:"flex flex-col"},a={class:"post-header"},s={class:"post-title text-white uppercase"},o={class:"bg-ob-deep-800 px-14 py-16 rounded-2xl shadow-xl block"},b={key:2,class:"flex flex-row justify-center items-center"};function u(e,t,c,u,i,j){var l=Object(r["I"])("Breadcrumbs"),g=Object(r["I"])("CategoryItem"),O=Object(r["I"])("ob-skeleton"),d=Object(r["I"])("svg-icon"),f=Object(r["I"])("CategoryList");return Object(r["A"])(),Object(r["g"])("div",n,[Object(r["j"])("div",a,[Object(r["j"])(l,{current:e.t("menu.categories")},null,8,["current"]),Object(r["j"])("h1",s,Object(r["M"])(e.t("menu.categories")),1)]),Object(r["j"])("div",o,[Object(r["j"])(f,null,{default:Object(r["S"])((function(){return[e.categories&&e.categories.length>0?(Object(r["A"])(!0),Object(r["g"])(r["a"],{key:0},Object(r["G"])(e.categories,(function(e){return Object(r["A"])(),Object(r["g"])(g,{key:e.slug,name:e.name,slug:e.slug,count:e.count,size:"xl"},null,8,["name","slug","count"])})),128)):e.categories?(Object(r["A"])(),Object(r["g"])(O,{key:1,tag:"li",count:10,height:"20px",width:"3rem"})):(Object(r["A"])(),Object(r["g"])("div",b,[Object(r["j"])(d,{class:"stroke-ob-bright mr-2","icon-class":"warning"}),Object(r["i"])(" "+Object(r["M"])(e.t("settings.empty-category")),1)]))]})),_:1})])])}var i=c("1da1"),j=(c("96cf"),c("2a1d")),l=c("b6c6"),g=c("47e2"),O=c("5701"),d=c("5b78"),f=c("7d05"),p=Object(r["k"])({name:"Category",components:{Sidebar:j["d"],Breadcrumbs:l["a"],CategoryList:f["b"],CategoryItem:f["a"]},setup:function(){var e=Object(O["a"])(),t=Object(g["b"])(),n=t.t,a=Object(d["a"])(),s=function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:a.fetchCategories(),e.setHeaderImage("".concat(c("87d4")));case 2:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return Object(r["u"])(s),Object(r["y"])((function(){e.resetHeaderImage()})),{categories:Object(r["e"])((function(){return console.log("categoryStore.categories",a.categories),a.isLoaded&&0===a.categories.length?null:a.categories})),t:n}}});p.render=u;t["default"]=p},"76f0":function(e,t,c){"use strict";c("b1d6")},b1d6:function(e,t,c){},b6c6:function(e,t,c){"use strict";var r=c("7a23"),n=Object(r["W"])("data-v-4170130a");Object(r["D"])("data-v-4170130a");var a={class:"breadcrumbs flex flex-row gap-6 text-white"};Object(r["B"])();var s=n((function(e,t,c,n,s,o){return Object(r["A"])(),Object(r["g"])("ul",a,[Object(r["j"])("li",null,Object(r["M"])(e.t("menu.home")),1),Object(r["j"])("li",null,Object(r["M"])(e.current),1)])})),o=c("47e2"),b=Object(r["k"])({name:"Breadcrumb",props:{current:String},setup:function(){var e=Object(o["b"])(),t=e.t;return{t:t}}});c("76f0");b.render=s,b.__scopeId="data-v-4170130a";t["a"]=b}}]);