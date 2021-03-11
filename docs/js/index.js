/**
* Discord Debate Timer
* @copyright 2020 Luke Zhang
* @author Luke Zhang luke-zhang-04.github.io/
* @version 1.6.0
* @license BSD-3-Clause
*/
!function(){"use strict";
/**
   * DeStagnate | https://luke-zhang-04.github.io/DeStagnate/
   * A simple, ReactJS inspired library to create dynamic components within static sites easier
   * @copyright Copyright (C) 2020 - 2021 Luke Zhang
   * @author Luke Zhang luke-zhang-04.github.io
   * @license MIT
   * @version 2.0.0
   */const t="https://luke-zhang-04.github.io/DeStagnate/error-codes",i=(t,i,e=!1)=>{if(i)for(const[s,n]of Object.entries(i))"string"==typeof n||"number"==typeof n?"innerHTML"===s?t.innerHTML=n.toString():e?t.setAttributeNS(null,s,n.toString()):t.setAttribute(s,n.toString()):"on"===s.slice(0,2)?"function"==typeof n&&t.addEventListener(s.slice(2).toLowerCase(),n):"ref"===s&&"object"==typeof n&&"current"in n?n.current=t:void 0!==n&&console.warn(typeof n+" is not a valid DeStagnate child")},e=(i,s)=>{if(null!=s)if(s instanceof Array)s.forEach((t=>e(i,t)));else if("string"==typeof s||"number"==typeof s)i.appendChild(document.createTextNode(s.toString()));else if(s instanceof f){if(!s.didMount&&i instanceof window.HTMLElement)return void s.mount(i);if(!(i instanceof window.HTMLElement))throw new Error(`ERROR: code 3. See ${t}`);s.parent!==i&&(s.parent=i),s.forceUpdate()}else i.appendChild(s)};function s(t,s,...n){if("string"==typeof t){const o=document.createElement(t);return i(o,s),e(o,n),o}return"function"==typeof t?t(s,n):Error("tagNameOrComponent is of invalid type.")}const n=(t,s,n,...o)=>{const r=document.createElementNS(t,s);return i(r,n,!0),e(r,o),r},o=()=>({current:null});class r{constructor(){this.createElement=s,this.createElementNS=n,this.createRef=o,this.componentDidCatch=t=>console.error(t),this.shouldComponentUpdate=()=>!0,this.render=()=>null}}r.createElement=s,r.createElementNS=n,r.createRef=o;const h=["onFocus","onBlur","onFocusIn","onFocusOut","onAnimationStart","onAnimationCancel","onAnimationEnd","onAnimationIteration","onTransitionStart","onTransitionCancel","onTransitionEnd","onTransitionRun","onAuxClick","onClick","onDblClick","onMouseDown","onMouseEnter","onMouseLeave","onMouseMove","onMouseOver","onMouseOut","onMouseUp","onWheel"],c=["onLoad","onOnline","onOffline","onResize","onScroll","onKeyDown","onKeyPress","onKeyUp"];class u extends r{constructor(){super(...arguments),this.bindEventListeners=t=>{this.t(t.addEventListener),this.t(window.addEventListener,c)},this.unbindEventListeners=t=>{this.t(t.removeEventListener),this.t(window.removeEventListener,c)},this.t=(t,i=h)=>{for(const e of i){const i=e.slice(2).toLowerCase(),s=this[e];void 0!==s&&s instanceof Function&&t(i,s)}}}}const l=(t,i,e=3,s=10)=>{if(0===e)return t===i;if(typeof t!=typeof i)return!1;if(t instanceof Array&&i instanceof Array){if(t.length!==i.length)return!1;if(t.length>s||i.length>s)return t===i;for(let n=0;n<t.length;n++)if(!l(t[n],i[n],e-1,s))return!1;return!0}if(t instanceof Object&&i instanceof Object){if(!l(Object.keys(t),Object.keys(i),e-1,s))return!1;for(const n of Object.keys(t))if(!l(t[n],i[n],e-1,s))return!1;return!0}return t===i};var a={isEqual:l};const d="Refusing to update unmounted component";class f extends u{constructor(i,e){if(super(),this.props=e,this.i={},this.o=!1,this.h=!1,this.forceUpdate=()=>{var i,e;try{if(!this.h)throw new Error(d);if(null===(i=this.componentDidUpdate)||void 0===i||i.call(this),void 0===this.u)throw new Error(`ERROR: code 2. See ${t}.`);null===(e=this.getSnapshotBeforeUpdate)||void 0===e||e.call(this,Object.assign({},this.props),Object.assign({},this.state)),this.l(this.v())}catch(t){return this.m(t)}},this.stateDidChange=(t,i=3,e=15)=>{var s;if(void 0===t)return!a.isEqual(this.i,this.p,i,e);const n={},o={};for(const i of t)n[i]=this.i[i],o[i]=null===(s=this.p)||void 0===s?void 0:s[i];return!a.isEqual(n,o,i,e)},this.setState=(i,e=!0)=>{var s,n;try{if(!this.h)throw new Error(d);if(null===(s=this.componentWillUpdate)||void 0===s||s.call(this),void 0===this.u)throw new Error(`ERROR: code 2. See ${t}.`);this.p=Object.assign({},this.i),null===(n=this.getSnapshotBeforeUpdate)||void 0===n||n.call(this,Object.assign({},this.props),Object.assign({},this.state)),Object.assign(this.i,i);const o=e&&this.shouldComponentUpdate()?this.v():void 0;this.l(o)}catch(t){return this.m(t)}},this.mountComponent=i=>{var e,s;try{if(void 0!==i&&(this.parent=i),void 0===this.u)throw new Error(`ERROR: code 2. See ${t}.`);const n=this.render();if(this.o=!0,null===(e=this.componentWillMount)||void 0===e||e.call(this),null===n)throw new Error(`ERROR: code 3. See ${t}.`);if(this.bindEventListeners(this.u),this.h=!0,null===(s=this.componentDidMount)||void 0===s||s.call(this),n instanceof Array){const t=document.createDocumentFragment();return n.forEach((i=>t.appendChild(i))),this.u.appendChild(t)}return this.u.appendChild(n)}catch(t){return this.m(t)}},this.mount=this.mountComponent,this.unmountComponent=()=>{var t;try{if(void 0===this.u)return;null===(t=this.componentWillUnmount)||void 0===t||t.call(this),this.unbindEventListeners(this.u),this.g(),this.h=!1}catch(t){this.m(t)}},this.unmount=this.unmountComponent,this.g=()=>{if(void 0===this.u)throw new Error(`ERROR: code 2. See ${t}.`);for(;this.u.firstChild;)this.u.lastChild&&this.u.removeChild(this.u.lastChild)},this.v=()=>(this.g(),this.render()),this.l=t=>{var i,e,s;if(t instanceof Array)for(const e of t)null===(i=this.u)||void 0===i||i.appendChild(e);else t&&(null===(e=this.u)||void 0===e||e.appendChild(t));t&&(null===(s=this.componentDidUpdate)||void 0===s||s.call(this))},this.m=t=>{if(t instanceof Error)return this.componentDidCatch(t),t;const i=new Error(String(t));return this.componentDidCatch(i),i},null===i)throw new Error("Parent is null, expected HTMLElement | undefined.");this.u=i}get getState(){return this.state}get state(){return this.i}set state(i){this.o?(this.componentDidCatch(new Error(`ERROR: code 1. See ${t}.`)),this.setState(i)):(this.i=i,this.o=!0)}get getProps(){return this.props}set parent(t){this.u=t}get parent(){return this.u}get didMount(){return this.h}get prevState(){return this.p}}const v=(t,...i)=>{const s=document.createDocumentFragment();return e(s,i),s};var m;!function(t){t.Component=f,t.createRef=o,t.createElement=s,t.createElementNS=n,t.Fragment=v}(m||(m={}));var p=m;
/**
   * Discord Debate Timer
   * @copyright 2020 Luke Zhang
   * @author Luke Zhang luke-zhang-04.github.io/
   * @version 1.5.0
   * @license BSD-3-Clause
   */const w=t=>{const i=Number(null!=t?t:void 0);return isNaN(i)?void 0:i};class b extends p.Component{constructor(t){super(t),this.O=p.createRef(),this.R=p.createRef(),this.S=0,this.spacebar=()=>{var t,i,e,s;if(this.state.paused){if(this.startTimer(),0===this.state.time){const n=w(null===(t=this.O.current)||void 0===t?void 0:t.value),o=w(null===(i=this.R.current)||void 0===i?void 0:i.value);n===this.state.totalTime&&o===this.state.protectedTime||(localStorage.setItem("time",null!==(e=null==n?void 0:n.toString())&&void 0!==e?e:"5"),localStorage.setItem("protectedTime",null!==(s=null==o?void 0:o.toString())&&void 0!==s?s:"30"),this.setState({protectedTime:o,totalTime:n}))}}else clearInterval(this.S);this.setState({paused:!this.state.paused})},this.startTimer=()=>{const t=setInterval((()=>{this.setState({time:this.state.time+1})}),1e3);this.S=Number(`${t}`)},this.speechStatus=()=>{const t=60*this.state.totalTime;return this.state.time<=this.state.protectedTime||this.state.time>=t-this.state.protectedTime&&this.state.time<t?p.createElement("p",{class:"status"},"Protected Time"):this.state.time>=t?p.createElement("p",{class:"status"},"Times up!"):void 0},this.reset=()=>{clearInterval(this.S),this.setState({paused:!0,time:0})},this.render=()=>{if(0===this.state.time&&this.state.paused)return p.createElement("div",{class:"container"},p.createElement("h1",{class:"header"},"Debate Timer"),p.createElement("p",{class:"subheader"},"Space to pause/start. r to restart."),p.createElement("form",{class:"form",onSubmit:()=>{console.log("SUBMIT")}},p.createElement("label",{for:"time"},"Time"),p.createElement("input",{type:"number",name:"time",value:this.state.totalTime,ref:this.O}),p.createElement("span",null,"How long the timer should last in minutes"),p.createElement("label",{for:"protected"},"Protected Time"),p.createElement("input",{type:"number",name:"protected",value:this.state.protectedTime,ref:this.R}),p.createElement("span",null,"Protected time at the beginning and end in seconds"),p.createElement("button",{type:"submit"},"Start")));const t=this.speechStatus();return p.createElement("div",{class:"container"},p.createElement("p",{class:"time"},(t=>{const i=t%60,e=(t-i)/60,s=i<10?`0${i}`:i.toString();return e>0?`${e}:${s}`:t.toString()})(this.state.time)),p.createElement("p",{class:"status"},this.state.paused?"Paused":""),t||null)};const i=w(localStorage.getItem("time")),e=w(localStorage.getItem("protectedTime"));this.state={time:0,paused:!0,protectedTime:null!=e?e:30,totalTime:null!=i?i:5}}}const y=document.getElementById("root");if(y){const t=new b(y);t.mount(),document.addEventListener("keydown",(i=>{" "===i.key?t.spacebar():"r"===i.key&&t.reset()}))}else alert("Could not load timer. Something went wrong: #root not found x_x.")}();
