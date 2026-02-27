const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(s,t,i)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:n,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:c,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,f=m?m.emptyScript:"",g=u.reactiveElementPolyfillSupport,_=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!n(t,e),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);o?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...c(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const r=o.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const r=this.constructor;if(!1===s&&(o=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??v)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[_("elementProperties")]=new Map,$[_("finalized")]=new Map,g?.({ReactiveElement:$}),(u.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,w=t=>t,A=x.trustedTypes,C=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+S,M=`<${k}>`,T=document,P=()=>T.createComment(""),H=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,O="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,D=/>/g,N=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),F=/'/g,L=/"/g,j=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),B=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),W=new WeakMap,G=T.createTreeWalker(T,129);function V(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let o,r=2===e?"<svg>":3===e?"<math>":"",a=z;for(let e=0;e<i;e++){const i=t[e];let n,l,h=-1,c=0;for(;c<i.length&&(a.lastIndex=c,l=a.exec(i),null!==l);)c=a.lastIndex,a===z?"!--"===l[1]?a=U:void 0!==l[1]?a=D:void 0!==l[2]?(j.test(l[2])&&(o=RegExp("</"+l[2],"g")),a=N):void 0!==l[3]&&(a=N):a===N?">"===l[0]?(a=o??z,h=-1):void 0===l[1]?h=-2:(h=a.lastIndex-l[2].length,n=l[1],a=void 0===l[3]?N:'"'===l[3]?L:F):a===L||a===F?a=N:a===U||a===D?a=z:(a=N,o=void 0);const d=a===N&&t[e+1].startsWith("/>")?" ":"";r+=a===z?i+M:h>=0?(s.push(n),i.slice(0,h)+E+i.slice(h)+S+d):i+S+(-2===h?e:d)}return[V(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Y{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,r=0;const a=t.length-1,n=this.parts,[l,h]=J(t,e);if(this.el=Y.createElement(l,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=G.nextNode())&&n.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=h[r++],i=s.getAttribute(t).split(S),a=/([.?@])?(.*)/.exec(e);n.push({type:1,index:o,name:a[2],strings:i,ctor:"."===a[1]?tt:"?"===a[1]?et:"@"===a[1]?it:Q}),s.removeAttribute(t)}else t.startsWith(S)&&(n.push({type:6,index:o}),s.removeAttribute(t));if(j.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),G.nextNode(),n.push({type:2,index:++o});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===k)n.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)n.push({type:7,index:o}),t+=S.length-1}o++}}static createElement(t,e){const i=T.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,s){if(e===B)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const r=H(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Z(t,o._$AS(t,e.values),o,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??T).importNode(e,!0);G.currentNode=s;let o=G.nextNode(),r=0,a=0,n=i[0];for(;void 0!==n;){if(r===n.index){let e;2===n.type?e=new X(o,o.nextSibling,this,t):1===n.type?e=new n.ctor(o,n.name,n.strings,this,t):6===n.type&&(e=new st(o,this,t)),this._$AV.push(e),n=i[++a]}r!==n?.index&&(o=G.nextNode(),r++)}return G.currentNode=T,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),H(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(V(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new K(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new Y(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new X(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,s){const o=this.strings;let r=!1;if(void 0===o)t=Z(this,t,e,0),r=!H(t)||t!==this._$AH&&t!==B,r&&(this._$AH=t);else{const s=t;let a,n;for(t=o[0],a=0;a<o.length-1;a++)n=Z(this,s[i+a],e,a),n===B&&(n=this._$AH[a]),r||=!H(n)||n!==this._$AH[a],n===q?t=q:t!==q&&(t+=(n??"")+o[a+1]),this._$AH[a]=n}r&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class it extends Q{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??q)===B)return;const i=this._$AH,s=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const ot=x.litHtmlPolyfillSupport;ot?.(Y,X),(x.litHtmlVersions??=[]).push("3.3.2");const rt=globalThis;class at extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new X(e.insertBefore(P(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const nt=rt.litElementPolyfillSupport;function lt(t,e){if(!t||0===t.length)return 50;if(1===t.length)return t[0][1];if(e<=t[0][0])return t[0][1];if(e>=t[t.length-1][0])return t[t.length-1][1];for(let i=0;i<t.length-1;i++){const[s,o]=t[i],[r,a]=t[i+1];if(e>=s&&e<=r){return o+(e-s)/(r-s)*(a-o)}}return t[t.length-1][1]}function ht(t,e){const i={max:lt(e.max,t),target:lt(e.target,t),min:lt(e.min,t)};return e.trigger&&(i.trigger=lt(e.trigger,t)),i}nt?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");const ct="too_dry",dt="optimal",pt="humid",ut="critical",mt={[ct]:{emoji:"💧",color:"#60a5fa",en:"Too Dry",fr:"Trop Sec"},[dt]:{emoji:"✅",color:"#22c55e",en:"Optimal",fr:"Optimal"},[pt]:{emoji:"🟡",color:"#f59e0b",en:"Humid",fr:"Humide"},[ut]:{emoji:"🔴",color:"#ef4444",en:"Critical",fr:"Critique"}};function ft(t,e,i,s){const o=i=>{const s=ht(t,i);return e<s.min?[20,45,70]:e<=s.target?[20,55,35]:e<=s.max?[60,60,15]:[140,30,30]};if("all"===i||!i){const e=o(s.habitat),i=o(s.protection);if(t<=14)return i;if(t>=22)return e;const r=(t-14)/8;return[Math.round(i[0]+r*(e[0]-i[0])),Math.round(i[1]+r*(e[1]-i[1])),Math.round(i[2]+r*(e[2]-i[2]))]}return o("protection"===i?s.protection:s.habitat)}const gt={habitat:{label:{en:"Living Space",fr:"Espace de vie"},icon:"mdi:home-thermometer",badge:{en:"Comfort",fr:"Confort"},badgeColor:"#14b3b8ff",markerColor:"#14b3b8ff"},protection:{label:{en:"Building Protection",fr:"Protection bâti"},icon:"mdi:shield-home",badge:{en:"Prevention",fr:"Prévention"},badgeColor:"#8b5cf6",markerColor:"#8b5cf6"},custom:{label:{en:"Custom",fr:"Personnalisé"},icon:"mdi:tune-variant",badge:{en:"Custom",fr:"Custom"},badgeColor:"#a29fa9ff",markerColor:"#a29fa9ff"}},_t={ashrae55:{name:"ASHRAE 55",profile:"habitat",max:[[15,68],[18,65],[20,62],[22,60],[25,58],[30,56]],target:[[15,58],[18,55],[20,52],[22,50],[25,48],[30,46]],min:[[15,48],[18,45],[20,42],[22,40],[25,38],[30,36]]},bs5250:{name:"BS 5250",profile:"protection",trigger:[[10,75],[15,70],[20,65],[25,63],[30,60]],max:[[10,70],[15,65],[20,60],[25,58],[30,55]],target:[[10,63],[15,58],[20,53],[25,52],[30,50]],min:[[10,53],[15,48],[20,43],[25,42],[30,40]]}};const bt=["#3b82f6","#ef4444","#f59e0b","#22c55e","#8b5cf6","#ec4899","#14b8a6","#f97316","#6366f1","#06b6d4","#84cc16","#e11d48","#0ea5e9","#a855f7","#10b981"],vt={"mdi:sofa":"🛋","mdi:bed":"🛏","mdi:desk":"💻","mdi:shower":"🚿","mdi:washing-machine":"🧺","mdi:garage":"🚗","mdi:cellar":"🍷","mdi:home":"🏠","mdi:thermometer":"🌡","mdi:water":"💧","mdi:office-building":"🏢","mdi:baby-carriage":"👶","mdi:pool":"🏊","mdi:flower":"🌸","mdi:tree":"🌳"};class yt extends at{static properties={rooms:{type:Array},activeTab:{type:String},hass:{type:Object},config:{type:Object},localize:{type:Function}};static styles=r`
    :host {
      display: block;
      position: relative;
    }
    .heatmap-container {
      position: relative;
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
    }
    canvas {
      width: 100%;
      display: block;
    }
    .tooltip {
      position: absolute;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      line-height: 1.4;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.15s;
      z-index: 10;
    }
    .tooltip.visible {
      opacity: 1;
    }
    .color-scale {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      margin-top: 12px;
    }
    .cs-bar {
      height: 8px;
      flex: 1;
      max-width: 80px;
    }
    .cs-label {
      font-size: 0.65rem;
      color: #4b5563;
      padding: 0 6px;
      white-space: nowrap;
    }
    .cs-mid {
      color: #64748b;
    }
  `;constructor(){super(),this.rooms=[],this.activeTab="all",this._tooltip={visible:!1,x:0,y:0,content:""}}get _ranges(){const t={all:{tempMin:8,tempMax:32,humMin:25,humMax:80},habitat:{tempMin:14,tempMax:28,humMin:28,humMax:65},protection:{tempMin:8,tempMax:32,humMin:35,humMax:80}};return t[this.activeTab]||t.all}render(){const t=this.localize;return I`
      <div class="heatmap-container">
        <canvas></canvas>
        <div
          class="tooltip ${this._tooltip.visible?"visible":""}"
          style="left:${this._tooltip.x}px; top:${this._tooltip.y}px"
        >
          ${this._tooltip.content}
        </div>
      </div>
      <div class="color-scale">
        <span class="cs-label">${t?.("heatmap.dry")||"Trop sec"}</span>
        <div
          class="cs-bar"
          style="background:linear-gradient(90deg,#1e3a5f,#1a3354);border-radius:4px 0 0 4px"
        ></div>
        <div class="cs-bar" style="background:linear-gradient(90deg,#14352a,#163a2d)"></div>
        <span class="cs-label cs-mid">${t?.("heatmap.optimal")||"Optimal"}</span>
        <div class="cs-bar" style="background:linear-gradient(90deg,#3a3010,#4a3a10)"></div>
        <div
          class="cs-bar"
          style="background:linear-gradient(90deg,#3f1f1f,#4a2020);border-radius:0 4px 4px 0"
        ></div>
        <span class="cs-label">${t?.("heatmap.critical")||"Critique"}</span>
      </div>
    `}firstUpdated(){this._canvas=this.shadowRoot.querySelector("canvas"),this._ctx=this._canvas.getContext("2d"),this._canvas.addEventListener("mousemove",t=>this._onMouseMove(t)),this._canvas.addEventListener("mouseleave",()=>this._hideTooltip()),this._canvas.addEventListener("click",t=>this._onClick(t)),this._resizeObserver=new ResizeObserver(()=>this._draw()),this._resizeObserver.observe(this._canvas.parentElement),this._draw()}updated(t){(t.has("rooms")||t.has("activeTab"))&&this._draw()}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}_draw(){if(!this._canvas||!this._ctx)return;const t=this._canvas.parentElement.clientWidth,e=Math.round(.5*t),i=window.devicePixelRatio||1;this._canvas.width=t*i,this._canvas.height=e*i,this._canvas.style.height=`${e}px`,this._ctx.scale(i,i),this._w=t,this._h=e;const{tempMin:s,tempMax:o,humMin:r,humMax:a}=this._ranges,n={top:30,right:20,bottom:40,left:50},l=t-n.left-n.right,h=e-n.top-n.bottom;this._pad=n,this._plotW=l,this._plotH=h;const c=this._ctx;c.clearRect(0,0,t,e);const d={habitat:_t.ashrae55,protection:_t.bs5250},p=c.createImageData(Math.ceil(l/3),Math.ceil(h/3));for(let t=0;t<p.height;t++)for(let e=0;e<p.width;e++){const i=ft(s+e/p.width*(o-s),a-t/p.height*(a-r),this.activeTab,d),n=4*(t*p.width+e);p.data[n]=i[0],p.data[n+1]=i[1],p.data[n+2]=i[2],p.data[n+3]=200}const u=new OffscreenCanvas(p.width,p.height);u.getContext("2d").putImageData(p,0,0),c.save(),c.beginPath(),c.roundRect(n.left,n.top,l,h,4),c.clip(),c.imageSmoothingEnabled=!0,c.drawImage(u,n.left,n.top,l,h),c.restore(),this._drawGrid(c,n,l,h,s,o,r,a),this._drawRefLines(c,n,l,h,s,o,r,a,d),this._drawAxes(c,n,l,h,s,o,r,a),this._drawMarkers(c,n,l,h,s,o,r,a)}_drawGrid(t,e,i,s,o,r,a,n){t.strokeStyle="rgba(255,255,255,0.06)",t.lineWidth=.5;for(let a=Math.ceil(o);a<=r;a+=2){const n=e.left+(a-o)/(r-o)*i;t.beginPath(),t.moveTo(n,e.top),t.lineTo(n,e.top+s),t.stroke()}for(let o=5*Math.ceil(a/5);o<=n;o+=5){const r=e.top+(n-o)/(n-a)*s;t.beginPath(),t.moveTo(e.left,r),t.lineTo(e.left+i,r),t.stroke()}}_drawRefLines(t,e,i,s,o,r,a,n,l){t.save(),t.beginPath(),t.rect(e.left,e.top,i,s),t.clip();const h=(l,h,c=[])=>{if(l){t.beginPath(),t.strokeStyle=h,t.lineWidth=1.5,t.setLineDash(c);for(let h=o;h<=r;h+=.5){const c=e.left+(h-o)/(r-o)*i,d=lt(l,h),p=e.top+(n-d)/(n-a)*s;h===o?t.moveTo(c,p):t.lineTo(c,p)}t.stroke(),t.setLineDash([])}},c=this.activeTab;"all"!==c&&"protection"!==c||(h(l.protection.trigger,"rgba(255,255,255,0.25)",[4,3]),h(l.protection.target,"rgba(255,255,255,0.35)")),"all"!==c&&"habitat"!==c||(h(l.habitat.target,"rgba(255,255,255,0.35)"),h(l.habitat.max,"rgba(255,255,255,0.15)",[3,3])),t.restore(),this._drawCurveLabels(t,e,i,s,o,r,a,n,l)}_drawCurveLabels(t,e,i,s,o,r,a,n,l){t.font="500 9px -apple-system, BlinkMacSystemFont, sans-serif",t.textAlign="right",t.fillStyle="rgba(255,255,255,0.4)";const h=r-1,c=t=>e.top+(n-t)/(n-a)*s,d=this.activeTab;if("all"===d||"protection"===d){if(l.protection.trigger){const s=lt(l.protection.trigger,h);t.fillText("trigger ↑",e.left+i-6,c(s)-5)}const s=lt(l.protection.target,h);t.fillText("cible protection",e.left+i-6,c(s)+12)}if("all"===d||"habitat"===d){const s=lt(l.habitat.target,h);t.fillText("cible habitat",e.left+i-6,c(s)+12)}}_drawAxes(t,e,i,s,o,r,a,n){t.fillStyle="#374151",t.font="10px -apple-system, BlinkMacSystemFont, sans-serif",t.textAlign="center",t.textBaseline="alphabetic";for(let a=Math.ceil(o);a<=r;a+=2){const n=e.left+(a-o)/(r-o)*i;t.fillText(`${a}°`,n,e.top+s+16)}const l=this.localize;t.fillText(l?.("heatmap.x_axis")||"Température (°C)",e.left+i/2,e.top+s+34),t.textAlign="right",t.textBaseline="middle";for(let i=5*Math.ceil(a/5);i<=n;i+=5){const o=e.top+(n-i)/(n-a)*s;t.fillText(`${i}%`,e.left-6,o)}t.save(),t.translate(12,e.top+s/2),t.rotate(-Math.PI/2),t.textAlign="center",t.textBaseline="alphabetic",t.fillText(l?.("heatmap.y_axis")||"Humidité relative (%)",0,0),t.restore()}_drawMarkers(t,e,i,s,o,r,a,n){if(!this.rooms?.length)return;this._getFilteredRooms().forEach(l=>{const h=e.left+(l.temp-o)/(r-o)*i,c=e.top+(n-l.humidity)/(n-a)*s,d=Math.max(e.left+5,Math.min(h,e.left+i-5)),p=Math.max(e.top+5,Math.min(c,e.top+s-5));l._x=d,l._y=p;const u=t.createRadialGradient(d,p,0,d,p,24);u.addColorStop(0,"rgba(255,255,255,0.12)"),u.addColorStop(1,"transparent"),t.fillStyle=u,t.beginPath(),t.arc(d,p,24,0,2*Math.PI),t.fill(),t.beginPath(),t.arc(d,p,11,0,2*Math.PI),t.strokeStyle=l.statusColor,t.lineWidth=2,t.stroke(),t.beginPath(),t.arc(d,p,7.5,0,2*Math.PI),t.fillStyle="#0d0f15",t.fill(),t.beginPath(),t.arc(d,p,5.5,0,2*Math.PI),t.fillStyle=l.color,t.fill();const m=`${vt[l.icon]||l.icon||""} ${l.name}`;t.font="600 10px -apple-system, BlinkMacSystemFont, sans-serif";const f=t.measureText(m).width,g=d,_=p-24;t.fillStyle="#0d0f15cc",t.beginPath(),t.roundRect(g-f/2-8,_-9,f+16,18,6),t.fill(),t.strokeStyle=l.statusColor+"80",t.lineWidth=1,t.stroke(),t.fillStyle="#e2e8f0",t.textAlign="center",t.textBaseline="middle",t.fillText(m,g,_),t.strokeStyle="rgba(255,255,255,0.15)",t.lineWidth=.8,t.setLineDash([2,2]),t.beginPath(),t.moveTo(d,_+9),t.lineTo(d,p-12),t.stroke(),t.setLineDash([])})}_getFilteredRooms(){return"all"===this.activeTab?this.rooms:this.rooms.filter(t=>t.profile===this.activeTab)}_onMouseMove(t){const e=this._canvas.getBoundingClientRect(),i=t.clientX-e.left,s=t.clientY-e.top,o=this._getFilteredRooms().find(t=>t._x&&Math.hypot(i-t._x,s-t._y)<18);this._tooltip=o?{visible:!0,x:o._x+15,y:o._y-10,content:I`
          <strong>${o.name}</strong><br />
          🌡 ${o.temp?.toFixed(1)}°C &nbsp; 💧 ${o.humidity?.toFixed(1)}%<br />
          🎯 ${o.thresholds?.target?.toFixed(1)}% &nbsp; Δ
          ${o.deviation>0?"+":""}${o.deviation?.toFixed(1)}%
        `}:{...this._tooltip,visible:!1},this.requestUpdate()}_hideTooltip(){this._tooltip={...this._tooltip,visible:!1},this.requestUpdate()}_onClick(t){const e=this._canvas.getBoundingClientRect(),i=t.clientX-e.left,s=t.clientY-e.top,o=this._getFilteredRooms().find(t=>t._x&&Math.hypot(i-t._x,s-t._y)<18);if(o&&this.hass){const t=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:o.humidityEntity}});this.dispatchEvent(t)}}}customElements.define("heatmap-canvas",yt);class $t extends at{static properties={room:{type:Object},hass:{type:Object},lang:{type:String},localize:{type:Function}};static styles=r`
    :host {
      display: block;
    }
    .room-card {
      background: var(--card-background-color, #1e293b);
      border-radius: 12px;
      padding: 14px;
      cursor: pointer;
      transition:
        transform 0.15s,
        box-shadow 0.15s;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
    }
    .room-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }
    .room-icon {
      font-size: 20px;
    }
    ha-icon.room-icon-mdi {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color, #94a3b8);
    }
    .room-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--primary-text-color, #fff);
      flex: 1;
    }
    .badge {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
      color: #fff;
    }
    .metrics {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 6px;
      margin-bottom: 10px;
    }
    .metric {
      text-align: center;
      padding: 6px 8px;
      border-radius: 6px;
      background: var(--ha-card-background, rgba(255, 255, 255, 0.04));
    }
    .metric-label {
      font-size: 0.62rem;
      color: var(--secondary-text-color, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .metric-value {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--primary-text-color, #fff);
      margin-top: 2px;
    }
    .status-row {
      margin-top: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.72rem;
    }
    .status {
      font-weight: 600;
      white-space: nowrap;
    }
    .status-bar {
      flex: 1;
      height: 3px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      margin: 0 10px;
      overflow: hidden;
    }
    .status-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.5s ease;
    }
    .max-label {
      color: var(--secondary-text-color, #64748b);
      font-size: 0.72rem;
      white-space: nowrap;
    }
    .dehumidifier {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--secondary-text-color, #94a3b8);
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
    }
    .dehumidifier.on {
      color: #22c55e;
      background: rgba(34, 197, 94, 0.15);
    }
  `;render(){const t=this.room;if(!t)return I``;const e=this.lang||"en",i=mt[t.status]||mt.optimal,s=gt[t.profile]||gt.habitat,o=this.localize,r=t.thresholds?.max||70,a=Math.min(100,Math.max(5,t.humidity/r*100)),n=t.deviation>0?"#f59e0b":"#22c55e",l="protection"===t.profile?"🛡":"custom"===t.profile?"🔧":"🛋";return I`
      <div class="room-card" @click=${this._openMoreInfo}>
        <div class="header">
          <span class="room-icon">${this._renderIcon(t.icon)}</span>
          <span class="room-name">${t.name}</span>
          <span class="badge" style="background:${s.badgeColor}">
            ${l} ${s.badge[e]||s.badge.en}
          </span>
        </div>

        <div class="metrics">
          <div class="metric">
            <div class="metric-label">${o?.("card.temp")||"Temp"}</div>
            <div class="metric-value" style="color:#f59e0b">${t.temp?.toFixed(1)??"—"}°C</div>
          </div>
          <div class="metric">
            <div class="metric-label">${o?.("card.humidity")||"Humidity"}</div>
            <div class="metric-value" style="color:${i.color}">
              ${t.humidity?.toFixed(1)??"—"}%
            </div>
          </div>
          <div class="metric">
            <div class="metric-label">${o?.("card.target")||"Target"}</div>
            <div class="metric-value" style="color:#94a3b8">
              ${t.thresholds?.target?.toFixed(1)??"—"}%
            </div>
          </div>
          <div class="metric">
            <div class="metric-label">${o?.("card.deviation")||"Gap"}</div>
            <div class="metric-value" style="color:${n}">
              ${t.deviation>0?"+":""}${t.deviation?.toFixed(1)??"—"}%
            </div>
          </div>
        </div>

        <div class="status-row">
          <span class="status" style="color:${i.color}"> ${i.emoji} ${i[e]||i.en} </span>
          <div class="status-bar">
            <div class="status-fill" style="width:${a}%; background:${i.color}"></div>
          </div>
          <span class="max-label">Max: ${r.toFixed(1)}%</span>
        </div>

        ${t.dehumidifierEntity?this._renderDehumidifier(t):""}
      </div>
    `}_renderIcon(t){return t?t.startsWith("mdi:")?I`<ha-icon .icon=${t} class="room-icon-mdi"></ha-icon>`:t:"🏠"}_renderDehumidifier(t){const e="on"===this.hass?.states[t.dehumidifierEntity]?.state,i=this.localize;return I`
      <span class="dehumidifier ${e?"on":""}" @click=${e=>this._toggleDehumidifier(e,t)}>
        💨 ${e?i?.("card.on")||"ON":i?.("card.off")||"OFF"}
      </span>
    `}_openMoreInfo(){if(!this.room?.humidityEntity||!this.hass)return;const t=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:this.room.humidityEntity}});this.dispatchEvent(t)}_toggleDehumidifier(t,e){t.stopPropagation(),e.dehumidifierEntity&&this.hass&&this.hass.callService("homeassistant","toggle",{entity_id:e.dehumidifierEntity})}}customElements.define("room-card",$t);class xt extends at{static properties={hass:{type:Object},rooms:{type:Array},hours:{type:Number},localize:{type:Function}};static styles=r`
    :host {
      display: block;
    }
    .history-container {
      background: var(--card-background-color, #1e293b);
      border-radius: 12px;
      padding: 14px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
    }
    .history-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .history-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--primary-text-color, #fff);
    }
    .period-tabs {
      display: flex;
      gap: 4px;
    }
    .period-tab {
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.06);
      color: var(--secondary-text-color, #94a3b8);
      border: none;
      transition: all 0.15s;
    }
    .period-tab.active {
      background: var(--primary-color, #3b82f6);
      color: #fff;
    }
    canvas {
      width: 100%;
      height: 120px;
      display: block;
    }
    .loading {
      text-align: center;
      color: var(--secondary-text-color, #94a3b8);
      font-size: 12px;
      padding: 20px;
    }
  `;constructor(){super(),this.hours=24,this._selectedHours=24,this._historyData=null,this._loading=!1}get _periods(){return[{hours:1,label:"1h"},{hours:6,label:"6h"},{hours:12,label:"12h"},{hours:24,label:"24h"},{hours:48,label:"48h"},{hours:168,label:"7d"}]}render(){const t=this.localize;return I`
      <div class="history-container">
        <div class="history-header">
          <span class="history-title">${t?.("history.title")||"History"}</span>
          <div class="period-tabs">
            ${this._periods.map(t=>I`
                <button
                  class="period-tab ${this._selectedHours===t.hours?"active":""}"
                  @click=${()=>this._selectPeriod(t.hours)}
                >
                  ${t.label}
                </button>
              `)}
          </div>
        </div>
        ${this._loading?I`<div class="loading">Loading...</div>`:I`<canvas></canvas>`}
      </div>
    `}firstUpdated(){this._canvas=this.shadowRoot.querySelector("canvas"),this._ctx=this._canvas?.getContext("2d"),this._fetchHistory()}updated(t){(t.has("rooms")||t.has("hass"))&&this._fetchHistory()}_selectPeriod(t){this._selectedHours=t,this._fetchHistory(),this.requestUpdate()}async _fetchHistory(){if(!this.hass||!this.rooms?.length)return;const t=this.rooms.map(t=>t.humidityEntity).filter(Boolean);if(t.length){this._loading=!0,this.requestUpdate();try{const e=new Date,i=new Date(e.getTime()-36e5*this._selectedHours),s=t.join(","),o=`history/period/${i.toISOString()}?filter_entity_id=${s}&end_time=${e.toISOString()}&minimal_response&no_attributes`,r=await this.hass.callApi("GET",o);this._historyData=r,this._loading=!1,this.requestUpdate(),await this.updateComplete,this._drawGraph()}catch(t){console.warn("humidity-heatmap-card: history fetch failed",t),this._loading=!1,this.requestUpdate()}}}_drawGraph(){if(!this._canvas||!this._ctx||!this._historyData)return;const t=this._canvas,e=window.devicePixelRatio||1,i=t.clientWidth,s=t.clientHeight;t.width=i*e,t.height=s*e;const o=this._ctx;o.scale(e,e),o.clearRect(0,0,i,s);const r=10,a=35,n=i-a-10,l=s-r-20,h=Date.now(),c=h-36e5*this._selectedHours;let d=100,p=0;(this._historyData||[]).forEach(t=>{(t||[]).forEach(t=>{const e=parseFloat(t.s??t.state);isNaN(e)||(d=Math.min(d,e),p=Math.max(p,e))})}),d=Math.max(0,Math.floor(d-5)),p=Math.min(100,Math.ceil(p+5));const u=getComputedStyle(this).getPropertyValue("--secondary-text-color")||"#64748b";o.strokeStyle="rgba(255,255,255,0.06)",o.lineWidth=1;for(let t=10*Math.ceil(d/10);t<=p;t+=10){const e=r+(p-t)/(p-d)*l;o.beginPath(),o.moveTo(a,e),o.lineTo(a+n,e),o.stroke(),o.fillStyle=u,o.font="10px Arial",o.textAlign="right",o.fillText(`${t}%`,a-4,e+3)}this.rooms.forEach((t,e)=>{const i=(this._historyData||[]).find(e=>e?.[0]?.entity_id===t.humidityEntity);if(!i)return;o.beginPath(),o.strokeStyle=t.color||"#3b82f6",o.lineWidth=2,o.lineJoin="round";let s=!0;i.forEach(t=>{const e=parseFloat(t.s??t.state),i=new Date(t.lu??t.last_updated).getTime();if(isNaN(e)||i<c)return;const u=a+(i-c)/(h-c)*n,m=r+(p-e)/(p-d)*l;s?(o.moveTo(u,m),s=!1):o.lineTo(u,m)}),o.stroke()}),o.fillStyle=u,o.font="10px Arial",o.textAlign="center";const m=Math.min(6,this._selectedHours);for(let t=0;t<=m;t++){const e=a+t/m*n,i=new Date(c+t/m*(h-c)),s=`${i.getHours()}:${String(i.getMinutes()).padStart(2,"0")}`;o.fillText(s,e,r+l+14)}}}customElements.define("history-graph",xt);const wt=[{value:"full",label:"Full (Heatmap + Cards)"},{value:"map",label:"Map only"},{value:"cards",label:"Cards only"}],At=[{value:"habitat",label:"Living Space (Habitat)"},{value:"protection",label:"Building Protection"},{value:"custom",label:"Custom"}],Ct=[{value:"ashrae55",label:"ASHRAE 55 (Comfort)"},{value:"bs5250",label:"BS 5250 (Building)"},{value:"custom",label:"Custom thresholds"}];class Et extends at{static properties={hass:{type:Object},_config:{state:!0}};static styles=r`
    :host {
      display: block;
    }
    .editor {
      padding: 16px;
    }
    .section {
      margin-bottom: 16px;
    }
    .section-title {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--primary-text-color);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .row > * {
      flex: 1;
    }
    .room-block {
      background: var(--card-background-color, #f5f5f5);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
    }
    .room-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .room-number {
      font-weight: 600;
      font-size: 13px;
    }
    .remove-btn {
      cursor: pointer;
      color: var(--error-color, #ef4444);
      background: none;
      border: none;
      font-size: 18px;
    }
    .add-btn {
      cursor: pointer;
      background: var(--primary-color, #3b82f6);
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      width: 100%;
    }
    ha-entity-picker,
    ha-textfield,
    ha-select,
    ha-switch {
      width: 100%;
    }
  `;setConfig(t){this._config={...t}}render(){return this.hass&&this._config?I`
      <div class="editor">
        <!-- General settings -->
        <div class="section">
          <div class="section-title">General</div>
          <div class="row">
            <ha-textfield
              label="Title"
              .value=${this._config.title||""}
              @change=${t=>this._updateConfig("title",t.target.value)}
            ></ha-textfield>
          </div>
          <div class="row">
            <ha-select
              label="Display Mode"
              .value=${this._config.display||"full"}
              @selected=${t=>this._updateConfig("display",t.target.value)}
            >
              ${wt.map(t=>I` <mwc-list-item .value=${t.value}>${t.label}</mwc-list-item> `)}
            </ha-select>
          </div>
          <div class="row">
            <ha-switch
              .checked=${!1!==this._config.show_tabs}
              @change=${t=>this._updateConfig("show_tabs",t.target.checked)}
            ></ha-switch>
            <span>Show profile tabs</span>
          </div>
          <div class="row">
            <ha-switch
              .checked=${this._config.show_graph||!1}
              @change=${t=>this._updateConfig("show_graph",t.target.checked)}
            ></ha-switch>
            <span>Show history graph</span>
          </div>
          ${this._config.show_graph?I`
                <div class="row">
                  <ha-textfield
                    label="Graph hours"
                    type="number"
                    .value=${String(this._config.graph_hours||24)}
                    @change=${t=>this._updateConfig("graph_hours",parseInt(t.target.value))}
                  ></ha-textfield>
                </div>
              `:""}
        </div>

        <!-- Rooms -->
        <div class="section">
          <div class="section-title">Rooms</div>
          ${(this._config.rooms||[]).map((t,e)=>this._renderRoom(t,e))}
          <button class="add-btn" @click=${this._addRoom}>+ Add Room</button>
        </div>
      </div>
    `:I``}_renderRoom(t,e){return I`
      <div class="room-block">
        <div class="room-header">
          <span class="room-number">Room ${e+1}: ${t.name||"New"}</span>
          <button class="remove-btn" @click=${()=>this._removeRoom(e)}>✕</button>
        </div>
        <div class="row">
          <ha-textfield
            label="Name"
            .value=${t.name||""}
            @change=${t=>this._updateRoom(e,"name",t.target.value)}
          ></ha-textfield>
          <ha-textfield
            label="Icon (mdi:...)"
            .value=${t.icon||""}
            @change=${t=>this._updateRoom(e,"icon",t.target.value)}
          ></ha-textfield>
        </div>
        <div class="row">
          <ha-entity-picker
            .hass=${this.hass}
            label="Temperature sensor"
            .value=${t.temperature||""}
            .includeDomains=${["sensor"]}
            @value-changed=${t=>this._updateRoom(e,"temperature",t.detail.value)}
          ></ha-entity-picker>
        </div>
        <div class="row">
          <ha-entity-picker
            .hass=${this.hass}
            label="Humidity sensor"
            .value=${t.humidity||""}
            .includeDomains=${["sensor"]}
            @value-changed=${t=>this._updateRoom(e,"humidity",t.detail.value)}
          ></ha-entity-picker>
        </div>
        <div class="row">
          <ha-select
            label="Profile"
            .value=${t.profile||"habitat"}
            @selected=${t=>this._updateRoom(e,"profile",t.target.value)}
          >
            ${At.map(t=>I` <mwc-list-item .value=${t.value}>${t.label}</mwc-list-item> `)}
          </ha-select>
          <ha-select
            label="Preset"
            .value=${t.preset||"ashrae55"}
            @selected=${t=>this._updateRoom(e,"preset",t.target.value)}
          >
            ${Ct.map(t=>I` <mwc-list-item .value=${t.value}>${t.label}</mwc-list-item> `)}
          </ha-select>
        </div>
        <div class="row">
          <ha-entity-picker
            .hass=${this.hass}
            label="Dehumidifier (optional)"
            .value=${t.dehumidifier||""}
            .includeDomains=${["switch","fan","humidifier"]}
            @value-changed=${t=>this._updateRoom(e,"dehumidifier",t.detail.value)}
          ></ha-entity-picker>
        </div>
      </div>
    `}_updateConfig(t,e){this._config={...this._config,[t]:e},this._fireConfigChanged()}_updateRoom(t,e,i){const s=[...this._config.rooms||[]];s[t]={...s[t],[e]:i},this._config={...this._config,rooms:s},this._fireConfigChanged()}_addRoom(){const t=[...this._config.rooms||[]];t.push({name:"",profile:"habitat",preset:"ashrae55"}),this._config={...this._config,rooms:t},this._fireConfigChanged()}_removeRoom(t){const e=[...this._config.rooms||[]];e.splice(t,1),this._config={...this._config,rooms:e},this._fireConfigChanged()}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}}))}}customElements.define("humidity-heatmap-card-editor",Et);const St={en:{common:{version:"v1.0.0",all:"All",habitat:"Living Space",protection:"Building Protection",comfort:"Comfort",prevention:"Prevention"},card:{title:"Humidity Management",temp:"Temp",humidity:"Humidity",target:"Target",deviation:"Gap",dehumidifier:"Dehumidifier",on:"ON",off:"OFF"},status:{too_dry:"Too Dry",optimal:"Optimal",humid:"Humid",critical:"Critical"},heatmap:{x_axis:"Temperature (°C)",y_axis:"Relative Humidity (%)",target_habitat:"Target (living)",target_protection:"Target (building)",critical_zone:"Critical zone",dry:"Too dry",optimal:"Optimal",critical:"Critical"},history:{title:"History",hours_1:"1h",hours_6:"6h",hours_12:"12h",hours_24:"24h",hours_48:"48h",days_7:"7d"},editor:{title:"Humidity Heatmap Card",display_mode:"Display Mode",show_tabs:"Show profile tabs",show_graph:"Show history graph",graph_hours:"Graph window (hours)",language:"Language",rooms:"Rooms",add_room:"Add room",room_name:"Room name",room_icon:"Icon",room_profile:"Profile",room_preset:"Threshold preset",room_color:"Marker color",temperature_entity:"Temperature sensor",humidity_entity:"Humidity sensor",dehumidifier_entity:"Dehumidifier switch"}},fr:{common:{version:"v1.0.0",all:"Vue complète",habitat:"Espace de vie",protection:"Protection bâti",comfort:"Confort",prevention:"Prévention"},card:{title:"Gestion Humidité",temp:"Temp",humidity:"Humidité",target:"Cible",deviation:"Écart",dehumidifier:"Déshumidificateur",on:"ON",off:"OFF"},status:{too_dry:"Trop Sec",optimal:"Optimal",humid:"Humide",critical:"Critique"},heatmap:{x_axis:"Température (°C)",y_axis:"Humidité relative (%)",target_habitat:"Cible habitat",target_protection:"Cible protection",critical_zone:"Zone critique",dry:"Trop sec",optimal:"Optimal",critical:"Critique"},history:{title:"Historique",hours_1:"1h",hours_6:"6h",hours_12:"12h",hours_24:"24h",hours_48:"48h",days_7:"7j"},editor:{title:"Carte Heatmap Humidité",display_mode:"Mode d'affichage",show_tabs:"Afficher les onglets profil",show_graph:"Afficher le graphe historique",graph_hours:"Fenêtre du graphe (heures)",language:"Langue",rooms:"Pièces",add_room:"Ajouter une pièce",room_name:"Nom de la pièce",room_icon:"Icône",room_profile:"Profil",room_preset:"Preset de seuils",room_color:"Couleur du marker",temperature_entity:"Capteur température",humidity_entity:"Capteur humidité",dehumidifier_entity:"Switch déshumidificateur"}}};console.info("%c humidity-heatmap-card %c v1.0.1 ","color: #fff; background: #3b82f6; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: #3b82f6; background: #e0e7ff; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;");class kt extends at{static properties={hass:{type:Object},_config:{state:!0},_activeTab:{state:!0}};static styles=r`
    :host {
      display: block;
    }
    ha-card {
      padding: 16px;
      overflow: hidden;
    }
    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-text-color, #fff);
      margin-bottom: 12px;
    }
    .tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 12px;
    }
    .tab {
      flex: 1;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.06);
      color: var(--secondary-text-color, #94a3b8);
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .tab.active {
      background: var(--primary-color, #3b82f6);
      color: #fff;
      border-color: var(--primary-color, #3b82f6);
    }
    .tab:hover:not(.active) {
      background: rgba(255, 255, 255, 0.1);
    }
    .rooms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 10px;
      margin-top: 12px;
    }
    .section-gap {
      margin-top: 16px;
    }
  `;constructor(){super(),this._activeTab="all"}static getConfigElement(){return document.createElement("humidity-heatmap-card-editor")}static getStubConfig(){return{display:"full",show_tabs:!0,show_graph:!1,graph_hours:24,rooms:[{name:"Living Room",profile:"habitat",temperature:"",humidity:""}]}}setConfig(t){if(!t.rooms||!Array.isArray(t.rooms))throw new Error("Please define at least one room");this._config={display:"full",show_tabs:!0,show_graph:!1,graph_hours:24,language:"auto",...t}}getCardSize(){const t=this._config?.display||"full";return"map"===t?5:"cards"===t?3*Math.ceil((this._config?.rooms?.length||1)/3):8}get _lang(){const t=this._config?.language;if(t&&"auto"!==t)return t;const e=this.hass?.language||"en";return St[e]?e:"en"}_localize(t){const e=t.split(".");let i=St[this._lang]||St.en;for(const t of e)i=i?.[t];return i||t}get _roomsData(){return this.hass&&this._config?.rooms?this._config.rooms.map((t,e)=>{const i=this.hass.states[t.temperature],s=this.hass.states[t.humidity],o=parseFloat(i?.state),r=parseFloat(s?.state),a="custom"===(n=t).preset&&n.thresholds?{...n.thresholds,profile:"custom"}:n.preset&&_t[n.preset]?_t[n.preset]:"protection"===(n.profile||"habitat")?_t.bs5250:_t.ashrae55;var n;const l=t.profile||"habitat";if(isNaN(o)||isNaN(r))return{...t,temp:null,humidity:null,status:"unknown",thresholds:{},deviation:0,statusColor:"#64748b",color:t.color||gt[l]?.markerColor||bt[e%bt.length],profile:l,humidityEntity:t.humidity,dehumidifierEntity:t.dehumidifier};const{status:h,thresholds:c,deviation:d}=function(t,e,i){const s=ht(e,i),o=t-s.target;let r;return r=t<s.min?ct:t<=s.target?dt:t<=s.max?pt:ut,{status:r,thresholds:s,deviation:o}}(r,o,a),p=mt[h]?.color||"#64748b";return{...t,temp:o,humidity:r,status:h,thresholds:c,deviation:d,statusColor:p,color:t.color||gt[l]?.markerColor||bt[e%bt.length],profile:l,humidityEntity:t.humidity,dehumidifierEntity:t.dehumidifier}}):[]}render(){if(!this._config)return I``;const t=this._config.display||"full",e=this._roomsData,i=!1!==this._config.show_tabs,s=this._config.show_graph,o=t=>this._localize(t);return I`
      <ha-card>
        ${this._config.title?I`<div class="card-title">${this._config.title}</div>`:""}
        ${i?this._renderTabs(o):""}
        ${"full"===t||"map"===t?I` <heatmap-canvas
              .rooms=${e}
              .activeTab=${this._activeTab}
              .hass=${this.hass}
              .config=${this._config}
              .localize=${o}
            ></heatmap-canvas>`:""}
        ${"full"===t||"cards"===t?I` <div class="rooms-grid ${"full"===t?"section-gap":""}">
              ${this._getFilteredRooms(e).map(t=>I`
                  <room-card
                    .room=${t}
                    .hass=${this.hass}
                    .lang=${this._lang}
                    .localize=${o}
                  ></room-card>
                `)}
            </div>`:""}
        ${s?I` <div class="section-gap">
              <history-graph
                .hass=${this.hass}
                .rooms=${e}
                .hours=${this._config.graph_hours||24}
                .localize=${o}
              ></history-graph>
            </div>`:""}
      </ha-card>
    `}_renderTabs(t){const e=[{id:"all",label:t("common.all")},{id:"habitat",label:t("common.habitat")},{id:"protection",label:t("common.protection")}];return I`
      <div class="tabs">
        ${e.map(t=>I`
            <div
              class="tab ${this._activeTab===t.id?"active":""}"
              @click=${()=>{this._activeTab=t.id}}
            >
              ${t.label}
            </div>
          `)}
      </div>
    `}_getFilteredRooms(t){return"all"===this._activeTab?t:t.filter(t=>t.profile===this._activeTab)}}customElements.define("humidity-heatmap-card",kt),window.customCards=window.customCards||[],window.customCards.push({type:"humidity-heatmap-card",name:"Humidity Heatmap Card",description:"Multi-room humidity heatmap with adaptive thresholds",preview:!0,documentationURL:"https://github.com/wilsto/humidity-heatmap-card"});
