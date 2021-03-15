/**
* Discord Debate Timer
* @copyright 2020 Luke Zhang
* @author Luke Zhang luke-zhang-04.github.io/
* @version 1.6.1
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
   */const t="https://luke-zhang-04.github.io/DeStagnate/error-codes",i=(t,i,s=!1)=>{if(i)for(const[e,n]of Object.entries(i))"string"==typeof n||"number"==typeof n?"innerHTML"===e?t.innerHTML=n.toString():s?t.setAttributeNS(null,e,n.toString()):t.setAttribute(e,n.toString()):"on"===e.slice(0,2)?"function"==typeof n&&t.addEventListener(e.slice(2).toLowerCase(),n):"ref"===e&&"object"==typeof n&&"current"in n?n.current=t:void 0!==n&&console.warn(typeof n+" is not a valid DeStagnate child")},s=(i,e)=>{if(null!=e)if(e instanceof Array)e.forEach((t=>s(i,t)));else if("string"==typeof e||"number"==typeof e)i.appendChild(document.createTextNode(e.toString()));else if(e instanceof f){if(!e.didMount&&i instanceof window.HTMLElement)return void e.mount(i);if(!(i instanceof window.HTMLElement))throw new Error(`ERROR: code 3. See ${t}`);e.parent!==i&&(e.parent=i),e.forceUpdate()}else i.appendChild(e)};function e(t,e,...n){if("string"==typeof t){const o=document.createElement(t);return i(o,e),s(o,n),o}return"function"==typeof t?t(e,n):Error("tagNameOrComponent is of invalid type.")}const n=(t,e,n,...o)=>{const r=document.createElementNS(t,e);return i(r,n,!0),s(r,o),r},o=()=>({current:null});class r{constructor(){this.createElement=e,this.createElementNS=n,this.createRef=o,this.componentDidCatch=t=>console.error(t),this.shouldComponentUpdate=()=>!0,this.render=()=>null}}r.createElement=e,r.createElementNS=n,r.createRef=o;const h=["onFocus","onBlur","onFocusIn","onFocusOut","onAnimationStart","onAnimationCancel","onAnimationEnd","onAnimationIteration","onTransitionStart","onTransitionCancel","onTransitionEnd","onTransitionRun","onAuxClick","onClick","onDblClick","onMouseDown","onMouseEnter","onMouseLeave","onMouseMove","onMouseOver","onMouseOut","onMouseUp","onWheel"],u=["onLoad","onOnline","onOffline","onResize","onScroll","onKeyDown","onKeyPress","onKeyUp"];class c extends r{constructor(){super(...arguments),this.bindEventListeners=t=>{this.t(t.addEventListener),this.t(window.addEventListener,u)},this.unbindEventListeners=t=>{this.t(t.removeEventListener),this.t(window.removeEventListener,u)},this.t=(t,i=h)=>{for(const s of i){const i=s.slice(2).toLowerCase(),e=this[s];void 0!==e&&e instanceof Function&&t(i,e)}}}}const a=(t,i,s=3,e=10)=>{if(0===s)return t===i;if(typeof t!=typeof i)return!1;if(t instanceof Array&&i instanceof Array){if(t.length!==i.length)return!1;if(t.length>e||i.length>e)return t===i;for(let n=0;n<t.length;n++)if(!a(t[n],i[n],s-1,e))return!1;return!0}if(t instanceof Object&&i instanceof Object){if(!a(Object.keys(t),Object.keys(i),s-1,e))return!1;for(const n of Object.keys(t))if(!a(t[n],i[n],s-1,e))return!1;return!0}return t===i};var l={isEqual:a};const d="Refusing to update unmounted component";class f extends c{constructor(i,s){if(super(),this.props=s,this.i={},this.o=!1,this.h=!1,this.forceUpdate=()=>{var i,s;try{if(!this.h)throw new Error(d);if(null===(i=this.componentDidUpdate)||void 0===i||i.call(this),void 0===this.u)throw new Error(`ERROR: code 2. See ${t}.`);null===(s=this.getSnapshotBeforeUpdate)||void 0===s||s.call(this,Object.assign({},this.props),Object.assign({},this.state)),this.l(this.v())}catch(t){return this.m(t)}},this.stateDidChange=(t,i=3,s=15)=>{var e;if(void 0===t)return!l.isEqual(this.i,this.p,i,s);const n={},o={};for(const i of t)n[i]=this.i[i],o[i]=null===(e=this.p)||void 0===e?void 0:e[i];return!l.isEqual(n,o,i,s)},this.setState=(i,s=!0)=>{var e,n;try{if(!this.h)throw new Error(d);if(null===(e=this.componentWillUpdate)||void 0===e||e.call(this),void 0===this.u)throw new Error(`ERROR: code 2. See ${t}.`);this.p=Object.assign({},this.i),null===(n=this.getSnapshotBeforeUpdate)||void 0===n||n.call(this,Object.assign({},this.props),Object.assign({},this.state)),Object.assign(this.i,i);const o=s&&this.shouldComponentUpdate()?this.v():void 0;this.l(o)}catch(t){return this.m(t)}},this.mountComponent=i=>{var s,e;try{if(void 0!==i&&(this.parent=i),void 0===this.u)throw new Error(`ERROR: code 2. See ${t}.`);const n=this.render();if(this.o=!0,null===(s=this.componentWillMount)||void 0===s||s.call(this),null===n)throw new Error(`ERROR: code 3. See ${t}.`);if(this.bindEventListeners(this.u),this.h=!0,null===(e=this.componentDidMount)||void 0===e||e.call(this),n instanceof Array){const t=document.createDocumentFragment();return n.forEach((i=>t.appendChild(i))),this.u.appendChild(t)}return this.u.appendChild(n)}catch(t){return this.m(t)}},this.mount=this.mountComponent,this.unmountComponent=()=>{var t;try{if(void 0===this.u)return;null===(t=this.componentWillUnmount)||void 0===t||t.call(this),this.unbindEventListeners(this.u),this.g(),this.h=!1}catch(t){this.m(t)}},this.unmount=this.unmountComponent,this.g=()=>{if(void 0===this.u)throw new Error(`ERROR: code 2. See ${t}.`);for(;this.u.firstChild;)this.u.lastChild&&this.u.removeChild(this.u.lastChild)},this.v=()=>(this.g(),this.render()),this.l=t=>{var i,s,e;if(t instanceof Array)for(const s of t)null===(i=this.u)||void 0===i||i.appendChild(s);else t&&(null===(s=this.u)||void 0===s||s.appendChild(t));t&&(null===(e=this.componentDidUpdate)||void 0===e||e.call(this))},this.m=t=>{if(t instanceof Error)return this.componentDidCatch(t),t;const i=new Error(String(t));return this.componentDidCatch(i),i},null===i)throw new Error("Parent is null, expected HTMLElement | undefined.");this.u=i}get getState(){return this.state}get state(){return this.i}set state(i){this.o?(this.componentDidCatch(new Error(`ERROR: code 1. See ${t}.`)),this.setState(i)):(this.i=i,this.o=!0)}get getProps(){return this.props}set parent(t){this.u=t}get parent(){return this.u}get didMount(){return this.h}get prevState(){return this.p}}const v=(t,...i)=>{const e=document.createDocumentFragment();return s(e,i),e};var m;!function(t){t.Component=f,t.createRef=o,t.createElement=e,t.createElementNS=n,t.Fragment=v}(m||(m={}));var p=m;
/**
   * Discord Debate Timer
   * @copyright 2020 - 2021 Luke Zhang
   * @author Luke Zhang luke-zhang-04.github.io/
   * @version 1.5.0
   * @license BSD-3-Clause
   */const w=t=>{const i=Number(null!=t?t:void 0);return isNaN(i)?void 0:i};class b extends p.Component{constructor(t){super(t),this.O=p.createRef(),this.R=p.createRef(),this.S=0,this.shouldComponentUpdate=()=>this.stateDidChange(["time","paused"]),this.spacebar=()=>{var t,i,s,e,n;if(this.state.paused){if(void 0!==this.T&&(console.log(this.j),this.j=(null!==(t=this.j)&&void 0!==t?t:this.j=Date.now())+(Date.now()-this.T),console.log(this.j)),this.startTimer(),0===this.state.time){const t=w(null===(i=this.O.current)||void 0===i?void 0:i.value),o=w(null===(s=this.R.current)||void 0===s?void 0:s.value);t===this.state.totalTime&&o===this.state.protectedTime||(localStorage.setItem("time",null!==(e=null==t?void 0:t.toString())&&void 0!==e?e:"5"),localStorage.setItem("protectedTime",null!==(n=null==o?void 0:o.toString())&&void 0!==n?n:"30"),this.setState({protectedTime:o,totalTime:t}))}this.T=void 0}else clearInterval(this.S),this.T=Date.now();this.setState({paused:!this.state.paused})},this.startTimer=()=>{var t;this.setState({time:Math.round((Date.now()-(null!==(t=this.j)&&void 0!==t?t:this.j=Date.now()))/1e3)});const i=setInterval((()=>{var t;this.setState({time:Math.round((Date.now()-(null!==(t=this.j)&&void 0!==t?t:this.j=Date.now()))/1e3)})}),1e3);this.S=Number(`${i}`)},this.speechStatus=()=>{const t=60*this.state.totalTime;return this.state.time<=this.state.protectedTime||this.state.time>=t-this.state.protectedTime&&this.state.time<t?p.createElement("p",{class:"status"},"Protected Time"):this.state.time>=t?p.createElement("p",{class:"status"},"Times up!"):void 0},this.reset=()=>{clearInterval(this.S),this.j=void 0,this.setState({paused:!0,time:0})},this.onKeyDown=t=>{" "===t.key||"Enter"==t.code?this.spacebar():"r"===t.key&&this.reset()},this.render=()=>{if(0===this.state.time&&this.state.paused)return p.createElement("div",{class:"container"},p.createElement("h1",{class:"header"},"Debate Timer"),p.createElement("p",{class:"subheader"},"Space to pause/start. r to restart."),p.createElement("form",{class:"form",onSubmit:t=>{t.preventDefault(),this.spacebar()}},p.createElement("label",{for:"time"},"Time"),p.createElement("input",{type:"number",name:"time",value:this.state.totalTime,ref:this.O}),p.createElement("span",null,"How long the timer should last in minutes"),p.createElement("label",{for:"protected"},"Protected Time"),p.createElement("input",{type:"number",name:"protected",value:this.state.protectedTime,ref:this.R}),p.createElement("span",null,"Protected time at the beginning and end in seconds"),p.createElement("button",{type:"submit"},"Start")));const t=this.speechStatus();return p.createElement("div",{class:"container"},p.createElement("p",{class:"time"},(t=>{const i=t%60,s=(t-i)/60,e=i<10?`0${i}`:i.toString();return s>0?`${s}:${e}`:t.toString()})(this.state.time)),p.createElement("p",{class:"status"},this.state.paused?"Paused":""),t||null)};const i=w(localStorage.getItem("time")),s=w(localStorage.getItem("protectedTime"));this.state={time:0,paused:!0,protectedTime:null!=s?s:30,totalTime:null!=i?i:5}}}const g=document.getElementById("root");if(g){new b(g).mount()}else alert("Could not load timer. Something went wrong: #root not found x_x.")}();
