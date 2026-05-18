import{c as Ne,r as M,j as n}from"./index-CaURo6Ma.js";import{T as Ze,C as ye,H as He}from"./TaskIcon-CW2UkcG4.js";import{M as We,i as se,u as Se,P as Ve,d as Ke,e as qe,f as Xe,m as te,h as Ye,S as le,j as Fe}from"./Index-C_zWWdSI.js";import{A as Je}from"./arrow-left-C_nurBPq.js";import"./use-auth-Dh524a9p.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=Ne("Bird",[["path",{d:"M16 7h.01",key:"1kdx03"}],["path",{d:"M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20",key:"oj1oa8"}],["path",{d:"m20 7 2 .5-2 .5",key:"12nv4d"}],["path",{d:"M10 18v3",key:"1yea0a"}],["path",{d:"M14 17.75V21",key:"1pymcb"}],["path",{d:"M7 18a6 6 0 0 0 3.84-10.61",key:"1npnn0"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=Ne("Star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);function be(r,a){if(typeof r=="function")return r(a);r!=null&&(r.current=a)}function Qe(...r){return a=>{let i=!1;const c=r.map(o=>{const x=be(o,a);return!i&&typeof x=="function"&&(i=!0),x});if(i)return()=>{for(let o=0;o<c.length;o++){const x=c[o];typeof x=="function"?x():be(r[o],null)}}}}function et(...r){return M.useCallback(Qe(...r),r)}class tt extends M.Component{getSnapshotBeforeUpdate(a){const i=this.props.childRef.current;if(se(i)&&a.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const c=i.offsetParent,o=se(c)&&c.offsetWidth||0,x=se(c)&&c.offsetHeight||0,y=getComputedStyle(i),u=this.props.sizeRef.current;u.height=parseFloat(y.height),u.width=parseFloat(y.width),u.top=i.offsetTop,u.left=i.offsetLeft,u.right=o-u.width-u.left,u.bottom=x-u.height-u.top}return null}componentDidUpdate(){}render(){return this.props.children}}function nt({children:r,isPresent:a,anchorX:i,anchorY:c,root:o,pop:x}){var m;const y=M.useId(),u=M.useRef(null),F=M.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0}),{nonce:I}=M.useContext(We),w=((m=r.props)==null?void 0:m.ref)??(r==null?void 0:r.ref),j=et(u,w);return M.useInsertionEffect(()=>{const{width:P,height:N,top:G,left:b,right:H,bottom:K}=F.current;if(a||x===!1||!u.current||!P||!N)return;const z=i==="left"?`left: ${b}`:`right: ${H}`,E=c==="bottom"?`bottom: ${K}`:`top: ${G}`;u.current.dataset.motionPopId=y;const T=document.createElement("style");I&&(T.nonce=I);const O=o??document.head;return O.appendChild(T),T.sheet&&T.sheet.insertRule(`
          [data-motion-pop-id="${y}"] {
            position: absolute !important;
            width: ${P}px !important;
            height: ${N}px !important;
            ${z}px !important;
            ${E}px !important;
          }
        `),()=>{var D;(D=u.current)==null||D.removeAttribute("data-motion-pop-id"),O.contains(T)&&O.removeChild(T)}},[a]),n.jsx(tt,{isPresent:a,childRef:u,sizeRef:F,pop:x,children:x===!1?r:M.cloneElement(r,{ref:j})})}const rt=({children:r,initial:a,isPresent:i,onExitComplete:c,custom:o,presenceAffectsLayout:x,mode:y,anchorX:u,anchorY:F,root:I})=>{const w=Se(at),j=M.useId();let m=!0,P=M.useMemo(()=>(m=!1,{id:j,initial:a,isPresent:i,custom:o,onExitComplete:N=>{w.set(N,!0);for(const G of w.values())if(!G)return;c&&c()},register:N=>(w.set(N,!1),()=>w.delete(N))}),[i,w,c]);return x&&m&&(P={...P}),M.useMemo(()=>{w.forEach((N,G)=>w.set(G,!1))},[i]),M.useEffect(()=>{!i&&!w.size&&c&&c()},[i]),r=n.jsx(nt,{pop:y==="popLayout",isPresent:i,anchorX:u,anchorY:F,root:I,children:r}),n.jsx(Ve.Provider,{value:P,children:r})};function at(){return new Map}const re=r=>r.key||"";function we(r){const a=[];return M.Children.forEach(r,i=>{M.isValidElement(i)&&a.push(i)}),a}const it=({children:r,custom:a,initial:i=!0,onExitComplete:c,presenceAffectsLayout:o=!0,mode:x="sync",propagate:y=!1,anchorX:u="left",anchorY:F="top",root:I})=>{const[w,j]=Ke(y),m=M.useMemo(()=>we(r),[r]),P=y&&!w?[]:m.map(re),N=M.useRef(!0),G=M.useRef(m),b=Se(()=>new Map),H=M.useRef(new Set),[K,z]=M.useState(m),[E,T]=M.useState(m);qe(()=>{N.current=!1,G.current=m;for(let L=0;L<E.length;L++){const S=re(E[L]);P.includes(S)?(b.delete(S),H.current.delete(S)):b.get(S)!==!0&&b.set(S,!1)}},[E,P.length,P.join("-")]);const O=[];if(m!==K){let L=[...m];for(let S=0;S<E.length;S++){const V=E[S],Q=re(V);P.includes(Q)||(L.splice(S,0,V),O.push(V))}return x==="wait"&&O.length&&(L=O),T(we(L)),z(m),null}const{forceRender:D}=M.useContext(Xe);return n.jsx(n.Fragment,{children:E.map(L=>{const S=re(L),V=y&&!w?!1:m===E||P.includes(S),Q=()=>{if(H.current.has(S))return;if(b.has(S))H.current.add(S),b.set(S,!0);else return;let ne=!0;b.forEach(ae=>{ae||(ne=!1)}),ne&&(D==null||D(),T(G.current),y&&(j==null||j()),c&&c())};return n.jsx(rt,{isPresent:V,initial:!N.current||i?void 0:!1,custom:a,presenceAffectsLayout:o,mode:x,root:I,onExitComplete:V?void 0:Q,anchorX:u,anchorY:F,children:L},S)})})},ot=({task:r,onToggle:a})=>n.jsxs(te.button,{layout:!0,whileTap:{scale:.96},onClick:()=>a(r),className:`relative w-full flex items-center p-5 md:p-6 rounded-[24px] transition-all duration-300 text-left ${r.completed?"bg-muted opacity-60 grayscale-[0.5]":"bg-card shadow-card"}`,children:[n.jsx("div",{className:"absolute right-4 top-4",children:r.completed?n.jsx("div",{className:"rounded-full bg-success px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-success-foreground",children:"Done"}):n.jsx("div",{className:"rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-primary",children:"Tap"})}),n.jsx("div",{className:`p-3 md:p-4 rounded-2xl mr-4 md:mr-6 shrink-0 transition-colors ${r.completed?"bg-muted":"bg-primary/10 text-primary"}`,children:n.jsx(Ze,{iconKey:r.icon,size:40,strokeWidth:2.5,className:"md:w-12 md:h-12"})}),n.jsxs("div",{className:"flex-1",children:[n.jsx("span",{className:"block text-xl md:text-2xl font-semibold text-foreground",children:r.title}),n.jsx("span",{className:"mt-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground",children:r.completed?n.jsxs(n.Fragment,{children:[n.jsx(ye,{size:16}),"Finished"]}):n.jsxs(n.Fragment,{children:[n.jsx(He,{size:16}),"Tap the picture"]})})]}),n.jsx("div",{className:`w-11 h-11 md:w-12 md:h-12 rounded-full border-4 flex items-center justify-center transition-colors shrink-0 ${r.completed?"bg-success border-success text-success-foreground":"border-border"}`,children:r.completed&&n.jsx(te.div,{initial:{scale:0},animate:{scale:[0,1.3,1]},transition:{duration:.3,ease:[.175,.885,.32,1.275]},children:n.jsx(ye,{size:26,strokeWidth:4})})})]});var fe={};(function r(a,i,c,o){var x=!!(a.Worker&&a.Blob&&a.Promise&&a.OffscreenCanvas&&a.OffscreenCanvasRenderingContext2D&&a.HTMLCanvasElement&&a.HTMLCanvasElement.prototype.transferControlToOffscreen&&a.URL&&a.URL.createObjectURL),y=typeof Path2D=="function"&&typeof DOMMatrix=="function",u=function(){if(!a.OffscreenCanvas)return!1;try{var t=new OffscreenCanvas(1,1),e=t.getContext("2d");e.fillRect(0,0,1,1);var s=t.transferToImageBitmap();e.createPattern(s,"no-repeat")}catch{return!1}return!0}();function F(){}function I(t){var e=i.exports.Promise,s=e!==void 0?e:a.Promise;return typeof s=="function"?new s(t):(t(F,F),null)}var w=function(t,e){return{transform:function(s){if(t)return s;if(e.has(s))return e.get(s);var d=new OffscreenCanvas(s.width,s.height),f=d.getContext("2d");return f.drawImage(s,0,0),e.set(s,d),d},clear:function(){e.clear()}}}(u,new Map),j=function(){var t=Math.floor(16.666666666666668),e,s,d={},f=0;return typeof requestAnimationFrame=="function"&&typeof cancelAnimationFrame=="function"?(e=function(h){var p=Math.random();return d[p]=requestAnimationFrame(function l(g){f===g||f+t-1<g?(f=g,delete d[p],h()):d[p]=requestAnimationFrame(l)}),p},s=function(h){d[h]&&cancelAnimationFrame(d[h])}):(e=function(h){return setTimeout(h,t)},s=function(h){return clearTimeout(h)}),{frame:e,cancel:s}}(),m=function(){var t,e,s={};function d(f){function h(p,l){f.postMessage({options:p||{},callback:l})}f.init=function(l){var g=l.transferControlToOffscreen();f.postMessage({canvas:g},[g])},f.fire=function(l,g,C){if(e)return h(l,null),e;var B=Math.random().toString(36).slice(2);return e=I(function(_){function k(R){R.data.callback===B&&(delete s[B],f.removeEventListener("message",k),e=null,w.clear(),C(),_())}f.addEventListener("message",k),h(l,B),s[B]=k.bind(null,{data:{callback:B}})}),e},f.reset=function(){f.postMessage({reset:!0});for(var l in s)s[l](),delete s[l]}}return function(){if(t)return t;if(!c&&x){var f=["var CONFETTI, SIZE = {}, module = {};","("+r.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI && CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join(`
`);try{t=new Worker(URL.createObjectURL(new Blob([f])))}catch(h){return typeof console<"u"&&typeof console.warn=="function"&&console.warn("🎊 Could not load worker",h),null}d(t)}return t}}(),P={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function N(t,e){return e?e(t):t}function G(t){return t!=null}function b(t,e,s){return N(t&&G(t[e])?t[e]:P[e],s)}function H(t){return t<0?0:Math.floor(t)}function K(t,e){return Math.floor(Math.random()*(e-t))+t}function z(t){return parseInt(t,16)}function E(t){return t.map(T)}function T(t){var e=String(t).replace(/[^0-9a-f]/gi,"");return e.length<6&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),{r:z(e.substring(0,2)),g:z(e.substring(2,4)),b:z(e.substring(4,6))}}function O(t){var e=b(t,"origin",Object);return e.x=b(e,"x",Number),e.y=b(e,"y",Number),e}function D(t){t.width=document.documentElement.clientWidth,t.height=document.documentElement.clientHeight}function L(t){var e=t.getBoundingClientRect();t.width=e.width,t.height=e.height}function S(t){var e=document.createElement("canvas");return e.style.position="fixed",e.style.top="0px",e.style.left="0px",e.style.pointerEvents="none",e.style.zIndex=t,e}function V(t,e,s,d,f,h,p,l,g){t.save(),t.translate(e,s),t.rotate(h),t.scale(d,f),t.arc(0,0,1,p,l,g),t.restore()}function Q(t){var e=t.angle*(Math.PI/180),s=t.spread*(Math.PI/180);return{x:t.x,y:t.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:t.startVelocity*.5+Math.random()*t.startVelocity,angle2D:-e+(.5*s-Math.random()*s),tiltAngle:(Math.random()*(.75-.25)+.25)*Math.PI,color:t.color,shape:t.shape,tick:0,totalTicks:t.ticks,decay:t.decay,drift:t.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:t.gravity*3,ovalScalar:.6,scalar:t.scalar,flat:t.flat}}function ne(t,e){e.x+=Math.cos(e.angle2D)*e.velocity+e.drift,e.y+=Math.sin(e.angle2D)*e.velocity+e.gravity,e.velocity*=e.decay,e.flat?(e.wobble=0,e.wobbleX=e.x+10*e.scalar,e.wobbleY=e.y+10*e.scalar,e.tiltSin=0,e.tiltCos=0,e.random=1):(e.wobble+=e.wobbleSpeed,e.wobbleX=e.x+10*e.scalar*Math.cos(e.wobble),e.wobbleY=e.y+10*e.scalar*Math.sin(e.wobble),e.tiltAngle+=.1,e.tiltSin=Math.sin(e.tiltAngle),e.tiltCos=Math.cos(e.tiltAngle),e.random=Math.random()+2);var s=e.tick++/e.totalTicks,d=e.x+e.random*e.tiltCos,f=e.y+e.random*e.tiltSin,h=e.wobbleX+e.random*e.tiltCos,p=e.wobbleY+e.random*e.tiltSin;if(t.fillStyle="rgba("+e.color.r+", "+e.color.g+", "+e.color.b+", "+(1-s)+")",t.beginPath(),y&&e.shape.type==="path"&&typeof e.shape.path=="string"&&Array.isArray(e.shape.matrix))t.fill(Ee(e.shape.path,e.shape.matrix,e.x,e.y,Math.abs(h-d)*.1,Math.abs(p-f)*.1,Math.PI/10*e.wobble));else if(e.shape.type==="bitmap"){var l=Math.PI/10*e.wobble,g=Math.abs(h-d)*.1,C=Math.abs(p-f)*.1,B=e.shape.bitmap.width*e.scalar,_=e.shape.bitmap.height*e.scalar,k=new DOMMatrix([Math.cos(l)*g,Math.sin(l)*g,-Math.sin(l)*C,Math.cos(l)*C,e.x,e.y]);k.multiplySelf(new DOMMatrix(e.shape.matrix));var R=t.createPattern(w.transform(e.shape.bitmap),"no-repeat");R.setTransform(k),t.globalAlpha=1-s,t.fillStyle=R,t.fillRect(e.x-B/2,e.y-_/2,B,_),t.globalAlpha=1}else if(e.shape==="circle")t.ellipse?t.ellipse(e.x,e.y,Math.abs(h-d)*e.ovalScalar,Math.abs(p-f)*e.ovalScalar,Math.PI/10*e.wobble,0,2*Math.PI):V(t,e.x,e.y,Math.abs(h-d)*e.ovalScalar,Math.abs(p-f)*e.ovalScalar,Math.PI/10*e.wobble,0,2*Math.PI);else if(e.shape==="star")for(var v=Math.PI/2*3,A=4*e.scalar,U=8*e.scalar,$=e.x,W=e.y,q=5,Z=Math.PI/q;q--;)$=e.x+Math.cos(v)*U,W=e.y+Math.sin(v)*U,t.lineTo($,W),v+=Z,$=e.x+Math.cos(v)*A,W=e.y+Math.sin(v)*A,t.lineTo($,W),v+=Z;else t.moveTo(Math.floor(e.x),Math.floor(e.y)),t.lineTo(Math.floor(e.wobbleX),Math.floor(f)),t.lineTo(Math.floor(h),Math.floor(p)),t.lineTo(Math.floor(d),Math.floor(e.wobbleY));return t.closePath(),t.fill(),e.tick<e.totalTicks}function ae(t,e,s,d,f){var h=e.slice(),p=t.getContext("2d"),l,g,C=I(function(B){function _(){l=g=null,p.clearRect(0,0,d.width,d.height),w.clear(),f(),B()}function k(){c&&!(d.width===o.width&&d.height===o.height)&&(d.width=t.width=o.width,d.height=t.height=o.height),!d.width&&!d.height&&(s(t),d.width=t.width,d.height=t.height),p.clearRect(0,0,d.width,d.height),h=h.filter(function(R){return ne(p,R)}),h.length?l=j.frame(k):_()}l=j.frame(k),g=_});return{addFettis:function(B){return h=h.concat(B),C},canvas:t,promise:C,reset:function(){l&&j.cancel(l),g&&g()}}}function he(t,e){var s=!t,d=!!b(e||{},"resize"),f=!1,h=b(e,"disableForReducedMotion",Boolean),p=x&&!!b(e||{},"useWorker"),l=p?m():null,g=s?D:L,C=t&&l?!!t.__confetti_initialized:!1,B=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion)").matches,_;function k(v,A,U){for(var $=b(v,"particleCount",H),W=b(v,"angle",Number),q=b(v,"spread",Number),Z=b(v,"startVelocity",Number),Te=b(v,"decay",Number),Oe=b(v,"gravity",Number),Ae=b(v,"drift",Number),pe=b(v,"colors",E),Ge=b(v,"ticks",Number),ge=b(v,"shapes"),Le=b(v,"scalar"),Ue=!!b(v,"flat"),xe=O(v),ve=$,oe=[],$e=t.width*xe.x,De=t.height*xe.y;ve--;)oe.push(Q({x:$e,y:De,angle:W,spread:q,startVelocity:Z,color:pe[ve%pe.length],shape:ge[K(0,ge.length)],ticks:Ge,decay:Te,gravity:Oe,drift:Ae,scalar:Le,flat:Ue}));return _?_.addFettis(oe):(_=ae(t,oe,g,A,U),_.promise)}function R(v){var A=h||b(v,"disableForReducedMotion",Boolean),U=b(v,"zIndex",Number);if(A&&B)return I(function(Z){Z()});s&&_?t=_.canvas:s&&!t&&(t=S(U),document.body.appendChild(t)),d&&!C&&g(t);var $={width:t.width,height:t.height};l&&!C&&l.init(t),C=!0,l&&(t.__confetti_initialized=!0);function W(){if(l){var Z={getBoundingClientRect:function(){if(!s)return t.getBoundingClientRect()}};g(Z),l.postMessage({resize:{width:Z.width,height:Z.height}});return}$.width=$.height=null}function q(){_=null,d&&(f=!1,a.removeEventListener("resize",W)),s&&t&&(document.body.contains(t)&&document.body.removeChild(t),t=null,C=!1)}return d&&!f&&(f=!0,a.addEventListener("resize",W,!1)),l?l.fire(v,$,q):k(v,$,q)}return R.reset=function(){l&&l.reset(),_&&_.reset()},R}var ie;function me(){return ie||(ie=he(null,{useWorker:!0,resize:!0})),ie}function Ee(t,e,s,d,f,h,p){var l=new Path2D(t),g=new Path2D;g.addPath(l,new DOMMatrix(e));var C=new Path2D;return C.addPath(g,new DOMMatrix([Math.cos(p)*f,Math.sin(p)*f,-Math.sin(p)*h,Math.cos(p)*h,s,d])),C}function ze(t){if(!y)throw new Error("path confetti are not supported in this browser");var e,s;typeof t=="string"?e=t:(e=t.path,s=t.matrix);var d=new Path2D(e),f=document.createElement("canvas"),h=f.getContext("2d");if(!s){for(var p=1e3,l=p,g=p,C=0,B=0,_,k,R=0;R<p;R+=2)for(var v=0;v<p;v+=2)h.isPointInPath(d,R,v,"nonzero")&&(l=Math.min(l,R),g=Math.min(g,v),C=Math.max(C,R),B=Math.max(B,v));_=C-l,k=B-g;var A=10,U=Math.min(A/_,A/k);s=[U,0,0,U,-Math.round(_/2+l)*U,-Math.round(k/2+g)*U]}return{type:"path",path:e,matrix:s}}function Re(t){var e,s=1,d="#000000",f='"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';typeof t=="string"?e=t:(e=t.text,s="scalar"in t?t.scalar:s,f="fontFamily"in t?t.fontFamily:f,d="color"in t?t.color:d);var h=10*s,p=""+h+"px "+f,l=new OffscreenCanvas(h,h),g=l.getContext("2d");g.font=p;var C=g.measureText(e),B=Math.ceil(C.actualBoundingBoxRight+C.actualBoundingBoxLeft),_=Math.ceil(C.actualBoundingBoxAscent+C.actualBoundingBoxDescent),k=2,R=C.actualBoundingBoxLeft+k,v=C.actualBoundingBoxAscent+k;B+=k+k,_+=k+k,l=new OffscreenCanvas(B,_),g=l.getContext("2d"),g.font=p,g.fillStyle=d,g.fillText(e,R,v);var A=1/s;return{type:"bitmap",bitmap:l.transferToImageBitmap(),matrix:[A,0,0,A,-B*A/2,-_*A/2]}}i.exports=function(){return me().apply(this,arguments)},i.exports.reset=function(){me().reset()},i.exports.create=he,i.exports.shapeFromPath=ze,i.exports.shapeFromText=Re})(function(){return typeof window<"u"?window:typeof self<"u"?self:this||{}}(),fe,!1);const st=fe.exports;fe.exports.create;var J=function(){return J=Object.assign||function(a){for(var i,c=1,o=arguments.length;c<o;c++){i=arguments[c];for(var x in i)Object.prototype.hasOwnProperty.call(i,x)&&(a[x]=i[x])}return a},J.apply(this,arguments)};var Ce="#84A332",Y="#C0F381",ue="--balloon-color",X="--light-color",Ie="--balloon-width",Pe="--balloon-height",_e={width:233,height:609},lt=function(r){var a=r.balloonColor,i=r.lightColor,c=r.width,o=document.createElement("balloon");return o.innerHTML=ct,Object.assign(o.style,{position:"absolute",overflow:"hidden",top:"0",left:"0",display:"inline-block",isolation:"isolate",transformStyle:"preserve-3d",backfaceVisibility:"hidden",opacity:"0.001",transform:"translate(calc(-100% + 1px), calc(-100% + 1px))",contain:"style, layout, paint",transformOrigin:"".concat(c/2,"px ").concat(c/2,"px"),willChange:"transform"}),o.style.setProperty(ue,a),o.style.setProperty(X,i),o.style.setProperty(Ie,c+"px"),o.style.setProperty(Pe,c*609/223+"px"),o},ct=`
<svg

style="width: var(`.concat(Ie,"); height: var(").concat(Pe,`);"
viewBox="0 0 223 609"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<g opacity="0.8" filter="url(#filter0_f_102_49)" >
  <path
    d="M117.5 253C136.167 294.5 134.7 395 125.5 453C116.3 511 133.833 578.167 125.5 606"
    stroke="url(#paint0_linear_102_49)"
    stroke-width="2"
  />
</g>
<g opacity="0.85" filter="url(#filter1_ii_102_49)">
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M176.876 204.032C181.934 198.064 209.694 160.262 210.899 127.619C213.023 70.1236 176.876 13 118.337 13C55.7949 13 18.5828 69.332 22.2724 127.619C24.0956 156.423 38.9766 178.5 51.7922 195.372C57.7811 203.257 90.0671 238.749 112.15 245.044C111.698 248.246 112.044 253.284 116.338 254H121.838V245.71C143.277 242.292 172.085 209.686 176.876 204.032Z"
    fill="var(`).concat(ue,", ").concat(Ce,`)"
  />
</g>
<g filter="url(#filter2_f_102_49)">
  <path
    d="M125 256.5C125 258.433 122.09 260 118.5 260C114.91 260 112 258.433 112 256.5C112 254.567 114.91 255 118.5 255C122.09 255 125 254.567 125 256.5Z"
    fill="var(`).concat(ue,", ").concat(Ce,`)"
  />
</g>
<g opacity="0.2" filter="url(#filter3_f_102_49)">
  <path
    d="M178.928 128.12C178.011 152.146 172.137 162.97 154.623 184.2C141.594 199.992 128.28 215 112.805 215C104.349 215 92.739 215 65.2673 177.844C56.1123 165.461 45.4818 149.259 44.1794 128.12C41.5436 85.3424 68.1267 44 112.805 44C154.623 44 180.55 85.6242 178.928 128.12Z"
    fill="url(#paint1_radial_102_49)"
  />
</g>
<g
  style="mix-blend-mode: lighten"
  opacity="0.7"
  filter="url(#filter4_df_102_49)"
>
  <path
    d="M72.7992 108.638L74.0985 87.5247C74.3145 84.0152 77.4883 81.4427 80.9664 81.958L94.8619 84.0166C98.4018 84.541 100.699 88.0277 99.7828 91.4871L94.0502 113.144C93.1964 116.369 89.8758 118.278 86.659 117.394L77.1969 114.792C74.4599 114.039 72.6249 111.471 72.7992 108.638Z"
    fill="var(`).concat(X,", ").concat(Y,`)"
  />
</g>
<g
  style="mix-blend-mode: lighten"
  opacity="0.5"
  filter="url(#filter5_f_102_49)"
>
  <path
    d="M147.76 88.7366L144.842 67.9855C144.378 64.687 141.316 62.3976 138.021 62.8858L123.638 65.0166C120.098 65.541 117.801 69.0277 118.717 72.4871L124.462 94.1891C125.311 97.3967 128.602 99.3061 131.808 98.4512L143.364 95.3695C146.296 94.5878 148.182 91.7409 147.76 88.7366Z"
    fill="var(`).concat(X,", ").concat(Y,`)"
  />
</g>
<g style="mix-blend-mode: lighten" filter="url(#filter6_f_102_49)">
  <path
    d="M46.4087 131.164C38.1642 111.726 43.2454 91.2599 47.4381 82.0988C47.7504 81.4164 48.5574 80.8601 48.8712 81.5418C48.9711 81.7589 48.9188 82.1169 48.8357 82.3409C41.2341 102.832 45.5154 122.958 47.3397 130.925C47.8434 133.124 47.2898 133.242 46.4087 131.164Z"
    fill="var(`).concat(X,", ").concat(Y,`)"
  />
</g>
<g style="mix-blend-mode: lighten" filter="url(#filter7_f_102_49)">
  <path
    d="M46.4087 131.164C38.1642 111.726 43.2454 91.2599 47.4381 82.0988C47.7504 81.4164 48.5574 80.8601 48.8712 81.5418C48.9711 81.7589 48.9188 82.1169 48.8357 82.3409C41.2341 102.832 45.5154 122.958 47.3397 130.925C47.8434 133.124 47.2898 133.242 46.4087 131.164Z"
    fill="var(`).concat(X,", ").concat(Y,`)"
  />
</g>
<g opacity="0.3">
  <g style="mix-blend-mode: lighten" filter="url(#filter8_f_102_49)">
    <path
      d="M190.817 150.078C196.906 136.754 196.503 119.258 195.396 111.05C195.318 110.475 194.888 109.925 194.734 110.403C194.704 110.495 194.689 110.697 194.699 110.807C196.396 129.344 191.942 144.593 190.447 149.824C190.122 150.959 190.349 151.104 190.817 150.078Z"
      fill="var(`).concat(X,", ").concat(Y,`)"
    />
  </g>
  <g style="mix-blend-mode: lighten" filter="url(#filter9_f_102_49)">
    <path
      d="M190.817 150.078C196.906 136.754 196.503 119.258 195.396 111.05C195.318 110.475 194.888 109.925 194.734 110.403C194.704 110.495 194.689 110.697 194.699 110.807C196.396 129.344 191.942 144.593 190.447 149.824C190.122 150.959 190.349 151.104 190.817 150.078Z"
      fill="var(`).concat(X,", ").concat(Y,`)"
    />
  </g>
</g>
</svg>
`),dt=`
<svg>
  <defs>
    <filter
      id="filter0_f_102_49"
      x="114.588"
      y="250.59"
      width="20.5082"
      height="357.697"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feGaussianBlur
        stdDeviation="1"
        result="effect1_foregroundBlur_102_49"
      />
    </filter>
    <filter
      id="filter1_ii_102_49"
      x="22.0213"
      y="13"
      width="188.967"
      height="241"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feColorMatrix
        in="SourceAlpha"
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        result="hardAlpha"
      />
      <feOffset />
      <feGaussianBlur stdDeviation="4.5" />
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0"
      />
      <feBlend
        mode="normal"
        in2="shape"
        result="effect1_innerShadow_102_49"
      />
      <feColorMatrix
        in="SourceAlpha"
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        result="hardAlpha"
      />
      <feOffset />
      <feGaussianBlur stdDeviation="18" />
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
      />
      <feBlend
        mode="overlay"
        in2="effect1_innerShadow_102_49"
        result="effect2_innerShadow_102_49"
      />
    </filter>
    <filter
      id="filter2_f_102_49"
      x="111"
      y="253.959"
      width="15"
      height="7.04138"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feGaussianBlur
        stdDeviation="0.5"
        result="effect1_foregroundBlur_102_49"
      />
    </filter>
    <filter
      id="filter3_f_102_49"
      x="0"
      y="0"
      width="223"
      height="259"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feGaussianBlur
        stdDeviation="22"
        result="effect1_foregroundBlur_102_49"
      />
    </filter>
    <filter
      id="filter4_df_102_49"
      x="46.7878"
      y="59.8922"
      width="79.1969"
      height="87.7179"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feColorMatrix
        in="SourceAlpha"
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        result="hardAlpha"
      />
      <feOffset dy="4" />
      <feGaussianBlur stdDeviation="13" />
      <feComposite in2="hardAlpha" operator="out" />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.8 0"
      />
      <feBlend
        mode="overlay"
        in2="BackgroundImageFix"
        result="effect1_dropShadow_102_49"
      />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="effect1_dropShadow_102_49"
        result="shape"
      />
      <feGaussianBlur
        stdDeviation="5.5"
        result="effect2_foregroundBlur_102_49"
      />
    </filter>
    <filter
      id="filter5_f_102_49"
      x="102.515"
      y="46.8202"
      width="61.3035"
      height="67.8351"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feGaussianBlur
        stdDeviation="8"
        result="effect1_foregroundBlur_102_49"
      />
    </filter>
    <filter
      id="filter6_f_102_49"
      x="34"
      y="73.2313"
      width="22.9258"
      height="67.4198"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feGaussianBlur
        stdDeviation="4"
        result="effect1_foregroundBlur_102_49"
      />
    </filter>
    <filter
      id="filter7_f_102_49"
      x="40"
      y="79.2313"
      width="10.9258"
      height="55.4198"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feGaussianBlur
        stdDeviation="1"
        result="effect1_foregroundBlur_102_49"
      />
    </filter>
    <filter
      id="filter8_f_102_49"
      x="186.419"
      y="106.345"
      width="13.5106"
      height="48.2987"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feGaussianBlur
        stdDeviation="1.93775"
        result="effect1_foregroundBlur_102_49"
      />
    </filter>
    <filter
      id="filter9_f_102_49"
      x="189.326"
      y="109.252"
      width="7.69731"
      height="42.4855"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feGaussianBlur
        stdDeviation="0.484439"
        result="effect1_foregroundBlur_102_49"
      />
    </filter>
    <linearGradient
      id="paint0_linear_102_49"
      x1="124.798"
      y1="253"
      x2="124.798"
      y2="606"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="white" />
      <stop offset="0.474934" stop-color="grey" stop-opacity="0.1" />
      <stop offset="0.722707" stop-color="white" stop-opacity="0.6" />
      <stop offset="0.93469" stop-color="grey" stop-opacity="0.7" />
      <stop offset="1" stop-color="white" stop-opacity="0" />
    </linearGradient>
    <radialGradient
      id="paint1_radial_102_49"
      cx="0"
      cy="0"
      r="1"
      gradientUnits="userSpaceOnUse"
      gradientTransform="translate(134 149.5) rotate(-123.69) scale(82.9277 65.4692)"
    >
      <stop />
      <stop offset="1" stop-opacity="0" />
    </radialGradient>
  </defs>
</svg>
`,Me=["cubic-bezier(0.22, 1, 0.36, 1)","cubic-bezier(0.33, 1, 0.68, 1)"],je=[["#ffec37ee","#f8b13dff"],["#f89640ee","#c03940ff"],["#3bc0f0ee","#0075bcff"],["#b0cb47ee","#3d954bff"],["#cf85b8ee","#a3509dff"]];function ut(r){var a=r.balloon,i=r.x,c=r.y,o=r.z,x=r.targetX,y=r.targetY,u=r.targetZ,F=r.zIndex;a.style.zIndex=F.toString(),a.style.filter="blur(".concat(F>7?8:0,"px)");var I=function(){var w=Math.random()*7+8,j=Math.random()<.5?1:-1;return a.animate([{transform:"translate(-50%, 0%) translate3d(".concat(i,"px, ").concat(c,"px, ").concat(o,"px) rotate3d(0, 0, 1, ").concat(j*-w,"deg)"),opacity:1},{transform:"translate(-50%, 0%) translate3d(".concat(i+(x-i)/2,"px, ").concat(c+(c+y*5-c)/2,"px, ").concat(o+(u-o)/2,"px) rotate3d(0, 0, 1, ").concat(j*w,"deg)"),opacity:1,offset:.5},{transform:"translate(-50%, 0%) translate3d(".concat(x,"px, ").concat(c+y*5,"px, ").concat(u,"px) rotate3d(0, 0, 1, ").concat(j*-w,"deg)"),opacity:1}],{duration:(Math.random()*1e3+5e3)*5,easing:Me[Math.floor(Math.random()*Me.length)],delay:F*200})};return{balloon:a,getAnimation:I}}function ft(){return new Promise(function(r){var a=document.createElement("balloons");Object.assign(a.style,{overflow:"hidden",position:"fixed",inset:"0",zIndex:"999",display:"inline-block",pointerEvents:"none",perspective:"1500px",perspectiveOrigin:"50vw 100vh",contain:"style, layout, paint"}),document.documentElement.appendChild(a);for(var i={width:window.innerWidth,height:window.innerHeight},c=Math.floor(Math.min(i.width,i.height)*1),o=_e.width/_e.height*c,x=Math.max(7,Math.round(window.innerWidth/(o/2))),y=Math.max(x*o/2,o/2*10),u=[],F=0;F<x;F++){var I=Math.round(i.width*Math.random()),w=window.innerHeight,j=Math.round(-1*(Math.random()*y)),m=Math.round(I+Math.random()*o*6*(Math.random()>.5?1:-1)),P=-window.innerHeight,N=j;u.push({x:I,y:w,z:j,targetX:m,targetY:P,targetZ:N})}u=u.sort(function(z,E){return z.z-E.z});var G=u[u.length-1];u[0],u=u.map(function(z){return J(J({},z),{z:z.z-G.z,targetZ:z.z-G.z})});var b=document.createElement("div");b.innerHTML=dt,a.appendChild(b);var H=1,K=u.map(function(z,E){var T=je[E%je.length],O=lt({balloonColor:T[1],lightColor:T[0],width:o});return a.appendChild(O),ut(J(J({balloon:O},z),{zIndex:H++}))});requestAnimationFrame(function(){var z=K.map(function(E){var T=E.balloon,O=E.getAnimation,D=O();return D.finished.then(function(){T.remove()})});Promise.all(z).then(function(){a.remove(),r()})})})}const Be=()=>{const a={origin:{y:.7},zIndex:1e3,disableForReducedMotion:!0},i=(c,o)=>{st({...a,...o,particleCount:Math.floor(200*c)})};i(.25,{spread:26,startVelocity:55}),i(.2,{spread:60}),i(.35,{spread:100,decay:.91,scalar:.8}),i(.1,{spread:120,startVelocity:25,decay:.92,scalar:1.2}),i(.1,{spread:120,startVelocity:45})},ke=({variant:r,childName:a,onFinish:i})=>(M.useEffect(()=>{if(r==="task"){Be();const o=window.setTimeout(i,1400);return()=>window.clearTimeout(o)}Be(),ft();const c=window.setTimeout(i,4500);return()=>window.clearTimeout(c)},[i,r]),r==="task"?null:n.jsx(te.div,{initial:{opacity:0,y:24},animate:{opacity:1,y:0},exit:{opacity:0,y:-12},className:"pointer-events-none fixed inset-x-0 top-10 z-[1001] flex justify-center px-6","aria-live":"polite",role:"status",children:n.jsx("div",{className:"rounded-full bg-white/92 px-6 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-md",children:n.jsxs("div",{className:"flex items-center gap-3 text-slate-800",children:[n.jsx("div",{className:"flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary",children:n.jsx(Ye,{size:24})}),n.jsxs("div",{children:[n.jsxs("div",{className:"flex items-center gap-2 text-primary",children:[n.jsx(ee,{size:16,fill:"currentColor"}),n.jsx(ee,{size:16,fill:"currentColor"}),n.jsx(ee,{size:16,fill:"currentColor"})]}),n.jsxs("p",{className:"mt-1 text-xl font-bold",children:["All done, ",a,"!"]})]})]})})})),de=new Set,ht=()=>n.jsxs(n.Fragment,{children:[n.jsx("div",{className:"absolute inset-0 bg-[linear-gradient(180deg,#fffdf0_0%,#fef3c7_18%,#e0f2fe_56%,#f0fdf4_100%)]"}),n.jsx("div",{className:"absolute right-4 top-6 h-20 w-20 rounded-full bg-yellow-300 shadow-[0_0_80px_rgba(253,224,71,0.8)] sm:right-8 sm:top-8 sm:h-28 sm:w-28 sm:shadow-[0_0_110px_rgba(253,224,71,0.85)]"}),n.jsx("div",{className:"absolute left-0 right-0 top-24 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(125,211,252,0.48),transparent_62%)]"}),n.jsx("div",{className:"absolute left-4 top-16 opacity-65 sm:left-8 sm:top-20 sm:opacity-75","aria-hidden":"true",children:n.jsx(ce,{size:22,className:"sm:h-[30px] sm:w-[30px]"})}),n.jsx("div",{className:"absolute left-20 top-24 opacity-60 sm:left-28 sm:top-28 sm:opacity-70","aria-hidden":"true",children:n.jsx(ce,{size:18,className:"sm:h-6 sm:w-6"})}),n.jsx("div",{className:"absolute right-20 top-24 opacity-55 sm:right-28 sm:top-32 sm:opacity-60","aria-hidden":"true",children:n.jsx(ce,{size:16,className:"sm:h-5 sm:w-5"})}),n.jsx("div",{className:"absolute right-20 top-10 text-xl opacity-60 sm:right-28 sm:top-5 sm:text-2xl","aria-hidden":"true",children:"☁️"}),n.jsx("div",{className:"absolute bottom-0 left-0 h-44 w-full bg-[linear-gradient(to_top,rgba(74,222,128,0.35),transparent)]"}),n.jsx("div",{className:"absolute bottom-4 left-2 text-[5rem] opacity-20 sm:bottom-6 sm:left-4 sm:text-[8rem] sm:opacity-25","aria-hidden":"true",children:"🌳"}),n.jsx("div",{className:"absolute bottom-6 right-0 text-[5.5rem] opacity-15 sm:bottom-8 sm:text-[9rem] sm:opacity-20","aria-hidden":"true",children:"🌳"}),n.jsx("div",{className:"absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:3.2rem_3.2rem] opacity-30"})]}),mt=()=>n.jsxs(n.Fragment,{children:[n.jsx("div",{className:"absolute inset-0 bg-[linear-gradient(180deg,#0f172a_0%,#172554_28%,#1e3a8a_55%,#312e81_100%)]"}),n.jsxs("div",{className:"absolute right-4 top-6 drop-shadow-[0_0_20px_rgba(253,230,138,0.45)] sm:right-12 sm:top-10 sm:drop-shadow-[0_0_24px_rgba(253,230,138,0.55)]",children:[n.jsx(Fe,{size:58,className:"text-amber-200 sm:h-[82px] sm:w-[82px]"}),n.jsx("div",{className:"absolute left-1/2 top-1 -translate-x-1/2 rotate-[-10deg] rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-black tracking-[0.2em] text-slate-600 shadow-sm sm:top-2 sm:px-3 sm:py-1 sm:text-[11px]",children:"zZz"})]}),n.jsx("div",{className:"absolute left-6 top-12 text-2xl text-yellow-200/90 sm:left-10 sm:top-16 sm:text-3xl","aria-hidden":"true",children:"✦"}),n.jsx("div",{className:"absolute left-24 top-20 text-2xl text-yellow-200/80 sm:left-32 sm:top-28 sm:text-3xl","aria-hidden":"true",children:"✧"}),n.jsx("div",{className:"absolute right-20 top-20 text-xl text-yellow-200/85 sm:right-36 sm:top-28 sm:text-2xl","aria-hidden":"true",children:"✦"}),n.jsx("div",{className:"absolute right-8 top-28 text-3xl text-yellow-100/80 sm:right-20 sm:top-40 sm:text-4xl","aria-hidden":"true",children:"⋆"}),n.jsx("div",{className:"absolute bottom-0 left-0 text-[6.5rem] opacity-25 sm:left-2 sm:text-[11rem] sm:opacity-35","aria-hidden":"true",children:"🌳"}),n.jsx("div",{className:"absolute bottom-20 left-16 text-3xl opacity-75 sm:left-24 sm:bottom-28 sm:text-4xl sm:opacity-85","aria-hidden":"true",children:"🦉"}),n.jsx("div",{className:"absolute bottom-20 left-24 text-xl text-slate-200/80 sm:left-32 sm:bottom-24 sm:text-2xl","aria-hidden":"true",children:"💤"}),n.jsx("div",{className:"absolute bottom-0 left-0 h-44 w-full bg-[linear-gradient(to_top,rgba(15,23,42,0.62),transparent)]"}),n.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]"}),n.jsx("div",{className:"absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:3.2rem_3.2rem] opacity-20"})]}),bt=({child:r,routine:a,onToggleTask:i,onBack:c})=>{const[o,x]=M.useState(null),y=r[a],u=y.length>0&&y.every(m=>m.completed),F=y.filter(m=>m.completed).length,I=`${r.id}:${a}:${y.map(m=>m.id).sort().join("|")}`,w=u?y.map(m=>m.id).sort().join("|"):null,j=w?`${r.id}:${a}:${w}`:null;return M.useEffect(()=>{x(null)},[r.id,a]),M.useEffect(()=>{if(!j){de.delete(I);return}de.has(j)||(de.add(j),x({variant:"routine",childName:r.name}))},[r.name,j,I]),n.jsxs("div",{className:"relative isolate min-h-svh overflow-hidden",children:[a==="morning"?n.jsx(ht,{}):n.jsx(mt,{}),n.jsxs("div",{className:"relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-5 md:px-6 md:pt-12",children:[n.jsx("nav",{className:"mb-8 flex items-center justify-start md:mb-10",children:n.jsx("button",{onClick:c,className:`rounded-2xl p-3 shadow-sm transition-transform active:scale-95 md:p-4 ${a==="morning"?"bg-white/90 text-muted-foreground":"bg-slate-900/65 text-slate-100"}`,children:n.jsx(Je,{size:26})})}),n.jsxs(te.header,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},className:"mb-8",children:[n.jsxs("div",{className:"mb-5 flex flex-wrap items-center gap-3",children:[n.jsxs("span",{className:`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.24em] ${a==="morning"?"bg-white/85 text-primary":"bg-slate-950/45 text-yellow-100"}`,children:[a==="morning"?n.jsx(le,{size:16}):n.jsx(Fe,{size:16}),a==="morning"?"Morning routine":"Evening routine"]}),y.length>0&&n.jsxs("span",{className:`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.24em] ${a==="morning"?"bg-primary/10 text-primary":"bg-white/10 text-yellow-100"}`,children:[n.jsx(ee,{size:16}),F,"/",y.length]})]}),n.jsxs("h2",{className:`text-2xl font-bold sm:text-3xl md:text-4xl ${a==="morning"?"text-foreground":"text-white"}`,children:["Good ",a==="morning"?"Morning":"Evening",", ",r.name,"!"]}),n.jsx("div",{className:"mt-4 flex flex-wrap gap-2",children:y.map(m=>n.jsx("span",{className:`flex h-10 w-10 items-center justify-center rounded-full border-2 ${m.completed?"border-success bg-success text-success-foreground":a==="morning"?"border-primary/25 bg-white/75 text-primary":"border-white/20 bg-white/10 text-yellow-100"}`,"aria-label":m.completed?"Task finished":"Task to do",children:m.completed?n.jsx(ee,{size:18,fill:"currentColor"}):n.jsx("span",{className:"text-xs font-black",children:y.indexOf(m)+1})},`progress-${m.id}`))}),n.jsxs("div",{className:`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${a==="morning"?"bg-white/80 text-slate-700":"bg-slate-950/45 text-slate-100"}`,children:[n.jsx(le,{size:16}),u?"All done!":"Tap the cards"]})]},`${r.id}-${a}`),n.jsxs("div",{className:"space-y-4",children:[y.map((m,P)=>n.jsx(te.div,{initial:{opacity:0,y:15},animate:{opacity:1,y:0},transition:{delay:P*.05},children:n.jsx(ot,{task:m,onToggle:N=>{i(N.id),N.completed||x({variant:"task",taskId:N.id,childName:r.name})}})},m.id)),y.length===0&&n.jsxs("div",{className:"rounded-[32px] border-4 border-dashed border-white/35 bg-white/35 py-20 text-center backdrop-blur-sm",children:[n.jsx("div",{className:"mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/70 text-primary",children:n.jsx(le,{size:28})}),n.jsx("p",{className:"mt-4 text-xl font-bold text-muted-foreground",children:"No cards yet"})]})]})]}),n.jsxs(it,{children:[(o==null?void 0:o.variant)==="task"&&n.jsx(ke,{variant:"task",childName:o.childName,onFinish:()=>x(null)},`task-${o.taskId}`),(o==null?void 0:o.variant)==="routine"&&u&&n.jsx(ke,{variant:"routine",childName:o.childName,onFinish:()=>{x(null),c()}},`routine-${w}`)]})]})};export{bt as RoutineView};
