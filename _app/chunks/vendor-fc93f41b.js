function t(){}function n(t,n){for(const e in n)t[e]=n[e];return t}function e(t){return t()}function o(){return Object.create(null)}function r(t){t.forEach(e)}function i(t){return"function"==typeof t}function c(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function s(n,e,o){n.$$.on_destroy.push(function(n,...e){if(null==n)return t;const o=n.subscribe(...e);return o.unsubscribe?()=>o.unsubscribe():o}(e,o))}function u(t,n,e,o){if(t){const r=l(t,n,e,o);return t[0](r)}}function l(t,e,o,r){return t[1]&&r?n(o.ctx.slice(),t[1](r(e))):o.ctx}function a(t,n,e,o,r,i,c){const s=function(t,n,e,o){if(t[2]&&o){const r=t[2](o(e));if(void 0===n.dirty)return r;if("object"==typeof r){const t=[],e=Math.max(n.dirty.length,r.length);for(let o=0;o<e;o+=1)t[o]=n.dirty[o]|r[o];return t}return n.dirty|r}return n.dirty}(n,o,r,i);if(s){const r=l(n,e,o,c);t.p(r,s)}}function f(t){return null==t?"":t}let d,h=!1;function p(t,n,e,o){for(;t<n;){const r=t+(n-t>>1);e(r)<=o?t=r+1:n=r}return t}function m(t,n){h?(!function(t){if(t.hydrate_init)return;t.hydrate_init=!0;const n=t.childNodes,e=new Int32Array(n.length+1),o=new Int32Array(n.length);e[0]=-1;let r=0;for(let u=0;u<n.length;u++){const t=p(1,r+1,(t=>n[e[t]].claim_order),n[u].claim_order)-1;o[u]=e[t]+1;const i=t+1;e[i]=u,r=Math.max(i,r)}const i=[],c=[];let s=n.length-1;for(let u=e[r]+1;0!=u;u=o[u-1]){for(i.push(n[u-1]);s>=u;s--)c.push(n[s]);s--}for(;s>=0;s--)c.push(n[s]);i.reverse(),c.sort(((t,n)=>t.claim_order-n.claim_order));for(let u=0,l=0;u<c.length;u++){for(;l<i.length&&c[u].claim_order>=i[l].claim_order;)l++;const n=l<i.length?i[l]:null;t.insertBefore(c[u],n)}}(t),(void 0===t.actual_end_child||null!==t.actual_end_child&&t.actual_end_child.parentElement!==t)&&(t.actual_end_child=t.firstChild),n!==t.actual_end_child?t.insertBefore(n,t.actual_end_child):t.actual_end_child=n.nextSibling):n.parentNode!==t&&t.appendChild(n)}function _(t,n,e){h&&!e?m(t,n):(n.parentNode!==t||e&&n.nextSibling!==e)&&t.insertBefore(n,e||null)}function g(t){t.parentNode.removeChild(t)}function $(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function y(t){return document.createElement(t)}function b(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function x(t){return document.createTextNode(t)}function w(){return x(" ")}function v(){return x("")}function A(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function E(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function N(t,n,e){t.setAttributeNS("http://www.w3.org/1999/xlink",n,e)}function T(t){return Array.from(t.childNodes)}function k(t,n,e,o,r=!1){void 0===t.claim_info&&(t.claim_info={last_index:0,total_claimed:0});const i=(()=>{for(let o=t.claim_info.last_index;o<t.length;o++){const i=t[o];if(n(i))return e(i),t.splice(o,1),r||(t.claim_info.last_index=o),i}for(let o=t.claim_info.last_index-1;o>=0;o--){const i=t[o];if(n(i))return e(i),t.splice(o,1),r?t.claim_info.last_index--:t.claim_info.last_index=o,i}return o()})();return i.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,i}function S(t,n,e,o){return k(t,(t=>t.nodeName===n),(t=>{const n=[];for(let o=0;o<t.attributes.length;o++){const r=t.attributes[o];e[r.name]||n.push(r.name)}n.forEach((n=>t.removeAttribute(n)))}),(()=>o?b(n):y(n)))}function L(t,n){return k(t,(t=>3===t.nodeType),(t=>{t.data=""+n}),(()=>x(n)),!0)}function M(t){return L(t," ")}function j(t,n,e){for(let o=e;o<t.length;o+=1){const e=t[o];if(8===e.nodeType&&e.textContent.trim()===n)return o}return t.length}function C(t){const n=j(t,"HTML_TAG_START",0),e=j(t,"HTML_TAG_END",n);if(n===e)return new G;const o=t.splice(n,e+1);return g(o[0]),g(o[o.length-1]),new G(o.slice(1,o.length-1))}function O(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function B(t,n,e,o){t.style.setProperty(n,e,o?"important":"")}function H(t,n,e){t.classList[e?"add":"remove"](n)}function q(t,n=document.body){return Array.from(n.querySelectorAll(t))}class G{constructor(t){this.e=this.n=null,this.l=t}m(t,n,e=null){this.e||(this.e=y(n.nodeName),this.t=n,this.l?this.n=this.l:this.h(t)),this.i(e)}h(t){this.e.innerHTML=t,this.n=Array.from(this.e.childNodes)}i(t){for(let n=0;n<this.n.length;n+=1)_(this.t,this.n[n],t)}p(t){this.d(),this.h(t),this.i(this.a)}d(){this.n.forEach(g)}}function I(t){d=t}function P(){if(!d)throw new Error("Function called outside component initialization");return d}function z(t){P().$$.on_mount.push(t)}function D(t){P().$$.after_update.push(t)}function F(t,n){P().$$.context.set(t,n)}function R(t){return P().$$.context.get(t)}const J=[],K=[],Q=[],U=[],V=Promise.resolve();let W=!1;function X(t){Q.push(t)}let Y=!1;const Z=new Set;function tt(){if(!Y){Y=!0;do{for(let t=0;t<J.length;t+=1){const n=J[t];I(n),nt(n.$$)}for(I(null),J.length=0;K.length;)K.pop()();for(let t=0;t<Q.length;t+=1){const n=Q[t];Z.has(n)||(Z.add(n),n())}Q.length=0}while(J.length);for(;U.length;)U.pop()();W=!1,Y=!1,Z.clear()}}function nt(t){if(null!==t.fragment){t.update(),r(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(X)}}const et=new Set;let ot;function rt(){ot={r:0,c:[],p:ot}}function it(){ot.r||r(ot.c),ot=ot.p}function ct(t,n){t&&t.i&&(et.delete(t),t.i(n))}function st(t,n,e,o){if(t&&t.o){if(et.has(t))return;et.add(t),ot.c.push((()=>{et.delete(t),o&&(e&&t.d(1),o())})),t.o(n)}}function ut(t,n){const e={},o={},r={$$scope:1};let i=t.length;for(;i--;){const c=t[i],s=n[i];if(s){for(const t in c)t in s||(o[t]=1);for(const t in s)r[t]||(e[t]=s[t],r[t]=1);t[i]=s}else for(const t in c)r[t]=1}for(const c in o)c in e||(e[c]=void 0);return e}function lt(t){return"object"==typeof t&&null!==t?t:{}}function at(t){t&&t.c()}function ft(t,n){t&&t.l(n)}function dt(t,n,o,c){const{fragment:s,on_mount:u,on_destroy:l,after_update:a}=t.$$;s&&s.m(n,o),c||X((()=>{const n=u.map(e).filter(i);l?l.push(...n):r(n),t.$$.on_mount=[]})),a.forEach(X)}function ht(t,n){const e=t.$$;null!==e.fragment&&(r(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function pt(t,n){-1===t.$$.dirty[0]&&(J.push(t),W||(W=!0,V.then(tt)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function mt(n,e,i,c,s,u,l=[-1]){const a=d;I(n);const f=n.$$={fragment:null,ctx:null,props:u,update:t,not_equal:s,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:e.context||[]),callbacks:o(),dirty:l,skip_bound:!1};let p=!1;if(f.ctx=i?i(n,e.props||{},((t,e,...o)=>{const r=o.length?o[0]:e;return f.ctx&&s(f.ctx[t],f.ctx[t]=r)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](r),p&&pt(n,t)),e})):[],f.update(),p=!0,r(f.before_update),f.fragment=!!c&&c(f.ctx),e.target){if(e.hydrate){h=!0;const t=T(e.target);f.fragment&&f.fragment.l(t),t.forEach(g)}else f.fragment&&f.fragment.c();e.intro&&ct(n.$$.fragment),dt(n,e.target,e.anchor,e.customElement),h=!1,tt()}I(a)}class _t{$destroy(){ht(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const gt=[];function $t(n,e=t){let o;const r=[];function i(t){if(c(n,t)&&(n=t,o)){const t=!gt.length;for(let e=0;e<r.length;e+=1){const t=r[e];t[1](),gt.push(t,n)}if(t){for(let t=0;t<gt.length;t+=2)gt[t][0](gt[t+1]);gt.length=0}}}return{set:i,update:function(t){i(t(n))},subscribe:function(c,s=t){const u=[c,s];return r.push(u),1===r.length&&(o=e(i)||t),c(n),()=>{const t=r.indexOf(u);-1!==t&&r.splice(t,1),0===r.length&&(o(),o=null)}}}}export{z as A,n as B,$t as C,R as D,u as E,A as F,a as G,H,B as I,m as J,s as K,t as L,q as M,f as N,$ as O,G as P,C as Q,b as R,_t as S,N as T,T as a,E as b,S as c,g as d,y as e,_ as f,L as g,O as h,mt as i,at as j,w as k,v as l,ft as m,M as n,dt as o,ut as p,lt as q,rt as r,c as s,x as t,st as u,ht as v,it as w,ct as x,F as y,D as z};