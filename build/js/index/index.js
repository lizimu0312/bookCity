"use strict";define(["jquery","handle","swiper","text!template/index.html","text!template/bestseller.html","text!template/recommend.html","text!template/faves.html","text!template/handpick.html","text!template/shelf.html"],function(o,s,t,a,e,c,l,i,n){var d=0;function r(t,a){var e=5*t,i=5*t+5,n=a.slice(e,i);return n.map(function(t,a){t.count=a+1}),n}o(".header span").on("click",function(){d=o(this).index(),o(".header span").eq(d).addClass("active").siblings().removeClass("active"),o(".content").css({transform:"translate(-"+100*d+"%,0)"})}),o.ajax({url:"/api/index",dataType:"json",success:function(n){s(a,n.items[0].data,".bookmall-cont"),new t(".banner",{loop:!0,autoplay:{delay:1e3}}),s(e,n.items[1],".bestseller-cont"),n.items[5].data.data.map(function(t){t.title=t.data.title,t.cover=t.data.cover,t.fiction_id=t.data.fiction_id}),s(e,n.items[5],".timelimit-cont");s(c,r(0,n.items[2].data.data),".recommend-cont"),s(l,r(0,n.items[3].data.data),".girls-cont"),s(l,r(0,n.items[4].data.data),".boy-cont"),o(".change-btn").on("click",function(){var t=1*o(this).data("id"),a=o(this).attr("data"),e=n.items[a];t++,t%=e.data.count/5,o(this).data("id",t);var i=2==a?c:l;s(i,r(t,e.data.data),"."+o(this).prev().attr("class"))}),s(i,r(0,n.items[6].data.data),".handpick-cont"),h(".bookmall")}}),o.ajax({url:"/api/bookrack",dataType:"json",success:function(t){s(n,t.items,".bookrack-cont>div"),o(".bookrack-change-btn").on("click",function(){o(this).toggleClass("active"),o(this).hasClass("active")?s(n,t.items,".bookrack-cont>div"):s(l,t.items,".bookrack-cont>div")})}});var m=0;function h(t){if(3<=m)return o(".loading").html("暂无更多数据"),!1;var e=o(t).height();o(t).on("scroll",function(){var t,a=o(this).children().height()-e;o(this).scrollTop()+20>=a&&(o(this).off("scroll"),t=++m,o.ajax({url:"/api/loadmore",data:{pagenum:t,limit:20},dataType:"json",success:function(t){s(l,t.items,".load-cont",!0),h(".bookmall")}}))})}});