import{_ as e,b as t,g as n,h as r,i,m as a,n as o,r as s,t as c,v as l,x as u,y as d}from"./proxy-D7v2Cm17.js";import{t as f}from"./arrow-left-CuXSKcvU.js";import{t as p}from"./sparkles-Cu2USZnb.js";import{M as m,N as h,P as g,R as _}from"./index-Bv1edLj7.js";import{t as v}from"./confetti.module-C2617tjR.js";var y=m(`Bird`,[[`path`,{d:`M16 7h.01`,key:`1kdx03`}],[`path`,{d:`M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20`,key:`oj1oa8`}],[`path`,{d:`m20 7 2 .5-2 .5`,key:`12nv4d`}],[`path`,{d:`M10 18v3`,key:`1yea0a`}],[`path`,{d:`M14 17.75V21`,key:`1pymcb`}],[`path`,{d:`M7 18a6 6 0 0 0 3.84-10.61`,key:`1npnn0`}]]),b=m(`PartyPopper`,[[`path`,{d:`M5.8 11.3 2 22l10.7-3.79`,key:`gwxi1d`}],[`path`,{d:`M4 3h.01`,key:`1vcuye`}],[`path`,{d:`M22 8h.01`,key:`1mrtc2`}],[`path`,{d:`M15 2h.01`,key:`1cjtqr`}],[`path`,{d:`M22 20h.01`,key:`1mrys2`}],[`path`,{d:`m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10`,key:`hbicv8`}],[`path`,{d:`m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17`,key:`1i94pl`}],[`path`,{d:`m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7`,key:`1cofks`}],[`path`,{d:`M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z`,key:`4kbmks`}]]),x=m(`Star`,[[`path`,{d:`M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z`,key:`r04s7s`}]]),S=_(g(),1);function C(e,t){if(typeof e==`function`)return e(t);e!=null&&(e.current=t)}function w(...e){return t=>{let n=!1,r=e.map(e=>{let r=C(e,t);return!n&&typeof r==`function`&&(n=!0),r});if(n)return()=>{for(let t=0;t<r.length;t++){let n=r[t];typeof n==`function`?n():C(e[t],null)}}}}function T(...e){return S.useCallback(w(...e),e)}var E=h(),D=class extends S.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(i(t)&&e.isPresent&&!this.props.isPresent&&this.props.pop!==!1){let e=t.offsetParent,n=i(e)&&e.offsetWidth||0,r=i(e)&&e.offsetHeight||0,a=getComputedStyle(t),o=this.props.sizeRef.current;o.height=parseFloat(a.height),o.width=parseFloat(a.width),o.top=t.offsetTop,o.left=t.offsetLeft,o.right=n-o.width-o.left,o.bottom=r-o.height-o.top}return null}componentDidUpdate(){}render(){return this.props.children}};function O({children:e,isPresent:t,anchorX:n,anchorY:r,root:i,pop:a}){let o=(0,S.useId)(),c=(0,S.useRef)(null),l=(0,S.useRef)({width:0,height:0,top:0,left:0,right:0,bottom:0}),{nonce:u}=(0,S.useContext)(s),d=T(c,e.props?.ref??e?.ref);return(0,S.useInsertionEffect)(()=>{let{width:e,height:s,top:d,left:f,right:p,bottom:m}=l.current;if(t||a===!1||!c.current||!e||!s)return;let h=n===`left`?`left: ${f}`:`right: ${p}`,g=r===`bottom`?`bottom: ${m}`:`top: ${d}`;c.current.dataset.motionPopId=o;let _=document.createElement(`style`);u&&(_.nonce=u);let v=i??document.head;return v.appendChild(_),_.sheet&&_.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${s}px !important;
            ${h}px !important;
            ${g}px !important;
          }
        `),()=>{c.current?.removeAttribute(`data-motion-pop-id`),v.contains(_)&&v.removeChild(_)}},[t]),(0,E.jsx)(D,{isPresent:t,childRef:c,sizeRef:l,pop:a,children:a===!1?e:S.cloneElement(e,{ref:d})})}var k=({children:e,initial:t,isPresent:r,onExitComplete:i,custom:o,presenceAffectsLayout:s,mode:c,anchorX:l,anchorY:u,root:d})=>{let f=n(A),p=(0,S.useId)(),m=!0,h=(0,S.useMemo)(()=>(m=!1,{id:p,initial:t,isPresent:r,custom:o,onExitComplete:e=>{f.set(e,!0);for(let e of f.values())if(!e)return;i&&i()},register:e=>(f.set(e,!1),()=>f.delete(e))}),[r,f,i]);return s&&m&&(h={...h}),(0,S.useMemo)(()=>{f.forEach((e,t)=>f.set(t,!1))},[r]),S.useEffect(()=>{!r&&!f.size&&i&&i()},[r]),e=(0,E.jsx)(O,{pop:c===`popLayout`,isPresent:r,anchorX:l,anchorY:u,root:d,children:e}),(0,E.jsx)(a.Provider,{value:h,children:e})};function A(){return new Map}var j=e=>e.key||``;function M(e){let t=[];return S.Children.forEach(e,e=>{(0,S.isValidElement)(e)&&t.push(e)}),t}var N=({children:t,custom:i,initial:a=!0,onExitComplete:s,presenceAffectsLayout:c=!0,mode:l=`sync`,propagate:u=!1,anchorX:d=`left`,anchorY:f=`top`,root:p})=>{let[m,h]=o(u),g=(0,S.useMemo)(()=>M(t),[t]),_=u&&!m?[]:g.map(j),v=(0,S.useRef)(!0),y=(0,S.useRef)(g),b=n(()=>new Map),x=(0,S.useRef)(new Set),[C,w]=(0,S.useState)(g),[T,D]=(0,S.useState)(g);r(()=>{v.current=!1,y.current=g;for(let e=0;e<T.length;e++){let t=j(T[e]);_.includes(t)?(b.delete(t),x.current.delete(t)):b.get(t)!==!0&&b.set(t,!1)}},[T,_.length,_.join(`-`)]);let O=[];if(g!==C){let e=[...g];for(let t=0;t<T.length;t++){let n=T[t],r=j(n);_.includes(r)||(e.splice(t,0,n),O.push(n))}return l===`wait`&&O.length&&(e=O),D(M(e)),w(g),null}let{forceRender:A}=(0,S.useContext)(e);return(0,E.jsx)(E.Fragment,{children:T.map(e=>{let t=j(e),n=u&&!m?!1:g===T||_.includes(t);return(0,E.jsx)(k,{isPresent:n,initial:!v.current||a?void 0:!1,custom:i,presenceAffectsLayout:c,mode:l,root:p,onExitComplete:n?void 0:()=>{if(x.current.has(t))return;if(b.has(t))x.current.add(t),b.set(t,!0);else return;let e=!0;b.forEach(t=>{t||(e=!1)}),e&&(A?.(),D(y.current),u&&h?.(),s&&s())},anchorX:d,anchorY:f,children:e},t)})})},P=({task:e,onToggle:n})=>(0,E.jsxs)(c.button,{layout:!0,whileTap:{scale:.96},onClick:()=>n(e),className:`relative w-full flex items-center p-5 md:p-6 rounded-[24px] transition-all duration-300 text-left ${e.completed?`bg-muted opacity-60 grayscale-[0.5]`:`bg-card shadow-card`}`,children:[(0,E.jsx)(`div`,{className:`absolute right-4 top-4`,children:e.completed?(0,E.jsx)(`div`,{className:`rounded-full bg-success px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-success-foreground`,children:`Done`}):(0,E.jsx)(`div`,{className:`rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-primary`,children:`Tap`})}),(0,E.jsx)(`div`,{className:`p-3 md:p-4 rounded-2xl mr-4 md:mr-6 shrink-0 transition-colors ${e.completed?`bg-muted`:`bg-primary/10 text-primary`}`,children:(0,E.jsx)(l,{iconKey:e.icon,size:40,strokeWidth:2.5,className:`md:w-12 md:h-12`})}),(0,E.jsxs)(`div`,{className:`flex-1`,children:[(0,E.jsx)(`span`,{className:`block text-xl md:text-2xl font-semibold text-foreground`,children:e.title}),(0,E.jsx)(`span`,{className:`mt-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground`,children:e.completed?(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(u,{size:16}),`Finished`]}):(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(t,{size:16}),`Tap the picture`]})})]}),(0,E.jsx)(`div`,{className:`w-11 h-11 md:w-12 md:h-12 rounded-full border-4 flex items-center justify-center transition-colors shrink-0 ${e.completed?`bg-success border-success text-success-foreground`:`border-border`}`,children:e.completed&&(0,E.jsx)(c.div,{initial:{scale:0},animate:{scale:[0,1.3,1]},transition:{duration:.3,ease:[.175,.885,.32,1.275]},children:(0,E.jsx)(u,{size:26,strokeWidth:4})})})]}),F=function(){return F=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n],t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},F.apply(this,arguments)},I=`#84A332`,L=`#C0F381`,R=`--balloon-color`,z=`--light-color`,B=`--balloon-width`,V=`--balloon-height`,H={width:233,height:609},U=function(e){var t=e.balloonColor,n=e.lightColor,r=e.width,i=document.createElement(`balloon`);return i.innerHTML=W,Object.assign(i.style,{position:`absolute`,overflow:`hidden`,top:`0`,left:`0`,display:`inline-block`,isolation:`isolate`,transformStyle:`preserve-3d`,backfaceVisibility:`hidden`,opacity:`0.001`,transform:`translate(calc(-100% + 1px), calc(-100% + 1px))`,contain:`style, layout, paint`,transformOrigin:`${r/2}px ${r/2}px`,willChange:`transform`}),i.style.setProperty(R,t),i.style.setProperty(z,n),i.style.setProperty(B,r+`px`),i.style.setProperty(V,r*609/223+`px`),i},W=`
<svg

style="width: var(${B}); height: var(${V});"
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
    fill="var(${R}, ${I})"
  />
</g>
<g filter="url(#filter2_f_102_49)">
  <path
    d="M125 256.5C125 258.433 122.09 260 118.5 260C114.91 260 112 258.433 112 256.5C112 254.567 114.91 255 118.5 255C122.09 255 125 254.567 125 256.5Z"
    fill="var(${R}, ${I})"
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
    fill="var(${z}, ${L})"
  />
</g>
<g
  style="mix-blend-mode: lighten"
  opacity="0.5"
  filter="url(#filter5_f_102_49)"
>
  <path
    d="M147.76 88.7366L144.842 67.9855C144.378 64.687 141.316 62.3976 138.021 62.8858L123.638 65.0166C120.098 65.541 117.801 69.0277 118.717 72.4871L124.462 94.1891C125.311 97.3967 128.602 99.3061 131.808 98.4512L143.364 95.3695C146.296 94.5878 148.182 91.7409 147.76 88.7366Z"
    fill="var(${z}, ${L})"
  />
</g>
<g style="mix-blend-mode: lighten" filter="url(#filter6_f_102_49)">
  <path
    d="M46.4087 131.164C38.1642 111.726 43.2454 91.2599 47.4381 82.0988C47.7504 81.4164 48.5574 80.8601 48.8712 81.5418C48.9711 81.7589 48.9188 82.1169 48.8357 82.3409C41.2341 102.832 45.5154 122.958 47.3397 130.925C47.8434 133.124 47.2898 133.242 46.4087 131.164Z"
    fill="var(${z}, ${L})"
  />
</g>
<g style="mix-blend-mode: lighten" filter="url(#filter7_f_102_49)">
  <path
    d="M46.4087 131.164C38.1642 111.726 43.2454 91.2599 47.4381 82.0988C47.7504 81.4164 48.5574 80.8601 48.8712 81.5418C48.9711 81.7589 48.9188 82.1169 48.8357 82.3409C41.2341 102.832 45.5154 122.958 47.3397 130.925C47.8434 133.124 47.2898 133.242 46.4087 131.164Z"
    fill="var(${z}, ${L})"
  />
</g>
<g opacity="0.3">
  <g style="mix-blend-mode: lighten" filter="url(#filter8_f_102_49)">
    <path
      d="M190.817 150.078C196.906 136.754 196.503 119.258 195.396 111.05C195.318 110.475 194.888 109.925 194.734 110.403C194.704 110.495 194.689 110.697 194.699 110.807C196.396 129.344 191.942 144.593 190.447 149.824C190.122 150.959 190.349 151.104 190.817 150.078Z"
      fill="var(${z}, ${L})"
    />
  </g>
  <g style="mix-blend-mode: lighten" filter="url(#filter9_f_102_49)">
    <path
      d="M190.817 150.078C196.906 136.754 196.503 119.258 195.396 111.05C195.318 110.475 194.888 109.925 194.734 110.403C194.704 110.495 194.689 110.697 194.699 110.807C196.396 129.344 191.942 144.593 190.447 149.824C190.122 150.959 190.349 151.104 190.817 150.078Z"
      fill="var(${z}, ${L})"
    />
  </g>
</g>
</svg>
`,G=`
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
`,K=[`cubic-bezier(0.22, 1, 0.36, 1)`,`cubic-bezier(0.33, 1, 0.68, 1)`],q=[[`#ffec37ee`,`#f8b13dff`],[`#f89640ee`,`#c03940ff`],[`#3bc0f0ee`,`#0075bcff`],[`#b0cb47ee`,`#3d954bff`],[`#cf85b8ee`,`#a3509dff`]];function J(e){var t=e.balloon,n=e.x,r=e.y,i=e.z,a=e.targetX,o=e.targetY,s=e.targetZ,c=e.zIndex;return t.style.zIndex=c.toString(),t.style.filter=`blur(${c>7?8:0}px)`,{balloon:t,getAnimation:function(){var e=Math.random()*7+8,l=Math.random()<.5?1:-1;return t.animate([{transform:`translate(-50%, 0%) translate3d(${n}px, ${r}px, ${i}px) rotate3d(0, 0, 1, ${l*-e}deg)`,opacity:1},{transform:`translate(-50%, 0%) translate3d(${n+(a-n)/2}px, ${r+(r+o*5-r)/2}px, ${i+(s-i)/2}px) rotate3d(0, 0, 1, ${l*e}deg)`,opacity:1,offset:.5},{transform:`translate(-50%, 0%) translate3d(${a}px, ${r+o*5}px, ${s}px) rotate3d(0, 0, 1, ${l*-e}deg)`,opacity:1}],{duration:(Math.random()*1e3+5e3)*5,easing:K[Math.floor(Math.random()*K.length)],delay:c*200})}}}function Y(){return new Promise(function(e){var t=document.createElement(`balloons`);Object.assign(t.style,{overflow:`hidden`,position:`fixed`,inset:`0`,zIndex:`999`,display:`inline-block`,pointerEvents:`none`,perspective:`1500px`,perspectiveOrigin:`50vw 100vh`,contain:`style, layout, paint`}),document.documentElement.appendChild(t);for(var n={width:window.innerWidth,height:window.innerHeight},r=Math.floor(Math.min(n.width,n.height)*1),i=H.width/H.height*r,a=Math.max(7,Math.round(window.innerWidth/(i/2))),o=Math.max(a*i/2,i/2*10),s=[],c=0;c<a;c++){var l=Math.round(n.width*Math.random()),u=window.innerHeight,d=Math.round(Math.random()*o*-1),f=Math.round(l+Math.random()*i*6*(Math.random()>.5?1:-1)),p=-window.innerHeight,m=d;s.push({x:l,y:u,z:d,targetX:f,targetY:p,targetZ:m})}s=s.sort(function(e,t){return e.z-t.z});var h=s[s.length-1];s[0],s=s.map(function(e){return F(F({},e),{z:e.z-h.z,targetZ:e.z-h.z})});var g=document.createElement(`div`);g.innerHTML=G,t.appendChild(g);var _=1,v=s.map(function(e,n){var r=q[n%q.length],a=U({balloonColor:r[1],lightColor:r[0],width:i});return t.appendChild(a),J(F(F({balloon:a},e),{zIndex:_++}))});requestAnimationFrame(function(){var n=v.map(function(e){var t=e.balloon,n=e.getAnimation;return n().finished.then(function(){t.remove()})});Promise.all(n).then(function(){t.remove(),e()})})})}var X=()=>{let e={origin:{y:.7},zIndex:1e3,disableForReducedMotion:!0},t=(t,n)=>{v({...e,...n,particleCount:Math.floor(200*t)})};t(.25,{spread:26,startVelocity:55}),t(.2,{spread:60}),t(.35,{spread:100,decay:.91,scalar:.8}),t(.1,{spread:120,startVelocity:25,decay:.92,scalar:1.2}),t(.1,{spread:120,startVelocity:45})},Z=({variant:e,childName:t,onFinish:n})=>((0,S.useEffect)(()=>{if(e===`task`){X();let e=window.setTimeout(n,1400);return()=>window.clearTimeout(e)}X(),Y();let t=window.setTimeout(n,4500);return()=>window.clearTimeout(t)},[n,e]),e===`task`?null:(0,E.jsx)(c.div,{initial:{opacity:0,y:24},animate:{opacity:1,y:0},exit:{opacity:0,y:-12},className:`pointer-events-none fixed inset-x-0 top-10 z-[1001] flex justify-center px-6`,"aria-live":`polite`,role:`status`,children:(0,E.jsx)(`div`,{className:`rounded-full bg-white/92 px-6 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-md`,children:(0,E.jsxs)(`div`,{className:`flex items-center gap-3 text-slate-800`,children:[(0,E.jsx)(`div`,{className:`flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary`,children:(0,E.jsx)(b,{size:24})}),(0,E.jsxs)(`div`,{children:[(0,E.jsxs)(`div`,{className:`flex items-center gap-2 text-primary`,children:[(0,E.jsx)(x,{size:16,fill:`currentColor`}),(0,E.jsx)(x,{size:16,fill:`currentColor`}),(0,E.jsx)(x,{size:16,fill:`currentColor`})]}),(0,E.jsxs)(`p`,{className:`mt-1 text-xl font-bold`,children:[`All done, `,t,`!`]})]})]})})})),Q=new Set,$=()=>(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(`div`,{className:`absolute inset-0 bg-[linear-gradient(180deg,#fffdf0_0%,#fef3c7_18%,#e0f2fe_56%,#f0fdf4_100%)]`}),(0,E.jsx)(`div`,{className:`absolute right-4 top-6 h-20 w-20 rounded-full bg-yellow-300 shadow-[0_0_80px_rgba(253,224,71,0.8)] sm:right-8 sm:top-8 sm:h-28 sm:w-28 sm:shadow-[0_0_110px_rgba(253,224,71,0.85)]`}),(0,E.jsx)(`div`,{className:`absolute left-0 right-0 top-24 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(125,211,252,0.48),transparent_62%)]`}),(0,E.jsx)(`div`,{className:`absolute left-4 top-16 opacity-65 sm:left-8 sm:top-20 sm:opacity-75`,"aria-hidden":`true`,children:(0,E.jsx)(y,{size:22,className:`sm:h-[30px] sm:w-[30px]`})}),(0,E.jsx)(`div`,{className:`absolute left-20 top-24 opacity-60 sm:left-28 sm:top-28 sm:opacity-70`,"aria-hidden":`true`,children:(0,E.jsx)(y,{size:18,className:`sm:h-6 sm:w-6`})}),(0,E.jsx)(`div`,{className:`absolute right-20 top-24 opacity-55 sm:right-28 sm:top-32 sm:opacity-60`,"aria-hidden":`true`,children:(0,E.jsx)(y,{size:16,className:`sm:h-5 sm:w-5`})}),(0,E.jsx)(`div`,{className:`absolute right-20 top-10 text-xl opacity-60 sm:right-28 sm:top-5 sm:text-2xl`,"aria-hidden":`true`,children:`☁️`}),(0,E.jsx)(`div`,{className:`absolute bottom-0 left-0 h-44 w-full bg-[linear-gradient(to_top,rgba(74,222,128,0.35),transparent)]`}),(0,E.jsx)(`div`,{className:`absolute bottom-4 left-2 text-[5rem] opacity-20 sm:bottom-6 sm:left-4 sm:text-[8rem] sm:opacity-25`,"aria-hidden":`true`,children:`🌳`}),(0,E.jsx)(`div`,{className:`absolute bottom-6 right-0 text-[5.5rem] opacity-15 sm:bottom-8 sm:text-[9rem] sm:opacity-20`,"aria-hidden":`true`,children:`🌳`}),(0,E.jsx)(`div`,{className:`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:3.2rem_3.2rem] opacity-30`})]}),ee=()=>(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(`div`,{className:`absolute inset-0 bg-[linear-gradient(180deg,#0f172a_0%,#172554_28%,#1e3a8a_55%,#312e81_100%)]`}),(0,E.jsxs)(`div`,{className:`absolute right-4 top-6 drop-shadow-[0_0_20px_rgba(253,230,138,0.45)] sm:right-12 sm:top-10 sm:drop-shadow-[0_0_24px_rgba(253,230,138,0.55)]`,children:[(0,E.jsx)(d,{size:58,className:`text-amber-200 sm:h-[82px] sm:w-[82px]`}),(0,E.jsx)(`div`,{className:`absolute left-1/2 top-1 -translate-x-1/2 rotate-[-10deg] rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-black tracking-[0.2em] text-slate-600 shadow-sm sm:top-2 sm:px-3 sm:py-1 sm:text-[11px]`,children:`zZz`})]}),(0,E.jsx)(`div`,{className:`absolute left-6 top-12 text-2xl text-yellow-200/90 sm:left-10 sm:top-16 sm:text-3xl`,"aria-hidden":`true`,children:`✦`}),(0,E.jsx)(`div`,{className:`absolute left-24 top-20 text-2xl text-yellow-200/80 sm:left-32 sm:top-28 sm:text-3xl`,"aria-hidden":`true`,children:`✧`}),(0,E.jsx)(`div`,{className:`absolute right-20 top-20 text-xl text-yellow-200/85 sm:right-36 sm:top-28 sm:text-2xl`,"aria-hidden":`true`,children:`✦`}),(0,E.jsx)(`div`,{className:`absolute right-8 top-28 text-3xl text-yellow-100/80 sm:right-20 sm:top-40 sm:text-4xl`,"aria-hidden":`true`,children:`⋆`}),(0,E.jsx)(`div`,{className:`absolute bottom-0 left-0 text-[6.5rem] opacity-25 sm:left-2 sm:text-[11rem] sm:opacity-35`,"aria-hidden":`true`,children:`🌳`}),(0,E.jsx)(`div`,{className:`absolute bottom-20 left-16 text-3xl opacity-75 sm:left-24 sm:bottom-28 sm:text-4xl sm:opacity-85`,"aria-hidden":`true`,children:`🦉`}),(0,E.jsx)(`div`,{className:`absolute bottom-20 left-24 text-xl text-slate-200/80 sm:left-32 sm:bottom-24 sm:text-2xl`,"aria-hidden":`true`,children:`💤`}),(0,E.jsx)(`div`,{className:`absolute bottom-0 left-0 h-44 w-full bg-[linear-gradient(to_top,rgba(15,23,42,0.62),transparent)]`}),(0,E.jsx)(`div`,{className:`absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]`}),(0,E.jsx)(`div`,{className:`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:3.2rem_3.2rem] opacity-20`})]}),te=({child:e,routine:t,onToggleTask:n,onBack:r})=>{let[i,a]=(0,S.useState)(null),o=e[t],s=o.length>0&&o.every(e=>e.completed),l=o.filter(e=>e.completed).length,u=`${e.id}:${t}:${o.map(e=>e.id).sort().join(`|`)}`,m=s?o.map(e=>e.id).sort().join(`|`):null,h=m?`${e.id}:${t}:${m}`:null;return(0,S.useEffect)(()=>{a(null)},[e.id,t]),(0,S.useEffect)(()=>{if(!h){Q.delete(u);return}Q.has(h)||(Q.add(h),a({variant:`routine`,childName:e.name}))},[e.name,h,u]),(0,E.jsxs)(`div`,{className:`relative isolate min-h-svh overflow-hidden`,children:[t===`morning`?(0,E.jsx)($,{}):(0,E.jsx)(ee,{}),(0,E.jsxs)(`div`,{className:`relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-5 md:px-6 md:pt-12`,children:[(0,E.jsx)(`nav`,{className:`mb-8 flex items-center justify-start md:mb-10`,children:(0,E.jsx)(`button`,{onClick:r,className:`rounded-2xl p-3 shadow-sm transition-transform active:scale-95 md:p-4 ${t===`morning`?`bg-white/90 text-muted-foreground`:`bg-slate-900/65 text-slate-100`}`,children:(0,E.jsx)(f,{size:26})})}),(0,E.jsxs)(c.header,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},className:`mb-8`,children:[(0,E.jsxs)(`div`,{className:`mb-5 flex flex-wrap items-center gap-3`,children:[(0,E.jsxs)(`span`,{className:`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.24em] ${t===`morning`?`bg-white/85 text-primary`:`bg-slate-950/45 text-yellow-100`}`,children:[t===`morning`?(0,E.jsx)(p,{size:16}):(0,E.jsx)(d,{size:16}),t===`morning`?`Morning routine`:`Evening routine`]}),o.length>0&&(0,E.jsxs)(`span`,{className:`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.24em] ${t===`morning`?`bg-primary/10 text-primary`:`bg-white/10 text-yellow-100`}`,children:[(0,E.jsx)(x,{size:16}),l,`/`,o.length]})]}),(0,E.jsxs)(`h2`,{className:`text-2xl font-bold sm:text-3xl md:text-4xl ${t===`morning`?`text-foreground`:`text-white`}`,children:[`Good `,t===`morning`?`Morning`:`Evening`,`, `,e.name,`!`]}),(0,E.jsx)(`div`,{className:`mt-4 flex flex-wrap gap-2`,children:o.map(e=>(0,E.jsx)(`span`,{className:`flex h-10 w-10 items-center justify-center rounded-full border-2 ${e.completed?`border-success bg-success text-success-foreground`:t===`morning`?`border-primary/25 bg-white/75 text-primary`:`border-white/20 bg-white/10 text-yellow-100`}`,"aria-label":e.completed?`Task finished`:`Task to do`,children:e.completed?(0,E.jsx)(x,{size:18,fill:`currentColor`}):(0,E.jsx)(`span`,{className:`text-xs font-black`,children:o.indexOf(e)+1})},`progress-${e.id}`))}),(0,E.jsxs)(`div`,{className:`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${t===`morning`?`bg-white/80 text-slate-700`:`bg-slate-950/45 text-slate-100`}`,children:[(0,E.jsx)(p,{size:16}),s?`All done!`:`Tap the cards`]})]},`${e.id}-${t}`),(0,E.jsxs)(`div`,{className:`space-y-4`,children:[o.map((t,r)=>(0,E.jsx)(c.div,{initial:{opacity:0,y:15},animate:{opacity:1,y:0},transition:{delay:r*.05},children:(0,E.jsx)(P,{task:t,onToggle:t=>{n(t.id),t.completed||a({variant:`task`,taskId:t.id,childName:e.name})}})},t.id)),o.length===0&&(0,E.jsxs)(`div`,{className:`rounded-[32px] border-4 border-dashed border-white/35 bg-white/35 py-20 text-center backdrop-blur-sm`,children:[(0,E.jsx)(`div`,{className:`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/70 text-primary`,children:(0,E.jsx)(p,{size:28})}),(0,E.jsx)(`p`,{className:`mt-4 text-xl font-bold text-muted-foreground`,children:`No cards yet`})]})]})]}),(0,E.jsxs)(N,{children:[i?.variant===`task`&&(0,E.jsx)(Z,{variant:`task`,childName:i.childName,onFinish:()=>a(null)},`task-${i.taskId}`),i?.variant===`routine`&&s&&(0,E.jsx)(Z,{variant:`routine`,childName:i.childName,onFinish:()=>{a(null),r()}},`routine-${m}`)]})]})};export{te as RoutineView};