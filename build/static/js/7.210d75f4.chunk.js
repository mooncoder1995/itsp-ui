(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{1325:function(e,n,t){"use strict";t.r(n);var o=t(41),r=t(52),a=t.n(r),c=(t(749),t(750)),i=t.n(c),s=t(19),u=t(158),l=t(10),f=t.n(l);function p(e){return d.apply(this,arguments)}function d(){return(d=Object(u.a)(a.a.mark(function e(n){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",f.a.post("http://59.67.107.169:8010/api/user/login",n));case 1:case"end":return e.stop()}},e,this)}))).apply(this,arguments)}var g=t(309).a;n.default={namespace:"login",state:{loggedIn:!1,message:"",user:{}},subscriptions:{setup:function(e){var n=e.history;e.dispatch;return n.listen(function(e){-1!==e.pathname.indexOf("/sign/login")&&f.a.removeStore("user")})}},effects:{login:a.a.mark(function e(n,t){var o,r,c,u,l,d,v,m;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return o=n.payload,r=t.call,c=t.put,e.next=4,r(p,o);case 4:if(u=e.sent,l=u.success,d=u.message,v=u.data,!l){e.next=20;break}return f.a.setStore("user",v),i.a.success(d),e.next=13,c(s.routerRedux.replace("/"));case 13:"ws://192.168.1.3:8010",(m=new WebSocket("".concat("ws://192.168.1.3:8010","/ws/").concat(f.a.getStore("user").userId))).onopen=function(e){console.log("connected")},m.onmessage=function(e){console.log("Received message ".concat(e.data)),g.success(e.data)},m.onclose=function(e){},e.next=23;break;case 20:return i.a.error(d),e.next=23,c({type:"loginError",payload:{message:d}});case 23:case"end":return e.stop()}},e,this)}),logout:a.a.mark(function e(n,t){var o;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return o=t.put,e.next=3,o(s.routerRedux.replace("/sign/login"));case 3:f.a.removeStore("user");case 4:case"end":return e.stop()}},e,this)})},reducers:{loginSuccess:function(e,n){var t=n.payload;return Object(o.a)({},e,{loggedIn:!0,message:"",user:t})},loginError:function(e,n){var t=n.payload;return Object(o.a)({},e,{loggedIn:!1,message:t.message})}}}},749:function(e,n,t){"use strict";t(33),t(758)},750:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var o=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,t):{};o.get||o.set?Object.defineProperty(n,t,o):n[t]=e[t]}return n.default=e,n}(t(0)),r=c(t(340)),a=c(t(38));function c(e){return e&&e.__esModule?e:{default:e}}var i,s,u,l,f=3,p=1,d="ant-message",g="move-up";var v={open:function(e){var n=void 0!==e.duration?e.duration:f,t={info:"info-circle",success:"check-circle",error:"close-circle",warning:"exclamation-circle",loading:"loading"}[e.type],c=p++,v=new Promise(function(f){var p=function(){return"function"===typeof e.onClose&&e.onClose(),f(!0)};!function(e){s?e(s):r.default.newInstance({prefixCls:d,transitionName:g,style:{top:i},getContainer:u,maxCount:l},function(n){s?e(s):(s=n,e(n))})}(function(r){var i=o.createElement(a.default,{type:t,theme:"loading"===t?"outlined":"filled"});r.notice({key:c,duration:n,style:{},content:o.createElement("div",{className:"".concat(d,"-custom-content").concat(e.type?" ".concat(d,"-").concat(e.type):"")},e.icon?e.icon:t?i:"",o.createElement("span",null,e.content)),onClose:p})})}),m=function(){s&&s.removeNotice(c)};return m.then=function(e,n){return v.then(e,n)},m.promise=v,m},config:function(e){void 0!==e.top&&(i=e.top,s=null),void 0!==e.duration&&(f=e.duration),void 0!==e.prefixCls&&(d=e.prefixCls),void 0!==e.getContainer&&(u=e.getContainer),void 0!==e.transitionName&&(g=e.transitionName,s=null),void 0!==e.maxCount&&(l=e.maxCount,s=null)},destroy:function(){s&&(s.destroy(),s=null)}};["success","info","warning","error","loading"].forEach(function(e){v[e]=function(n,t,o){return"function"===typeof t&&(o=t,t=void 0),v.open({content:n,duration:t,type:e,onClose:o})}}),v.warn=v.warning;var m=v;n.default=m},758:function(e,n,t){}}]);
//# sourceMappingURL=7.210d75f4.chunk.js.map