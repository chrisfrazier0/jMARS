const e=["AB","BA","A","B","F","X","I"],a=["DAT","MOV","ADD","SUB","MUL","DIV","MOD","JMP","JMZ","JMN","DJN","CMP","SEQ","SNE","SLT","SPL","NOP"];let t,s,r,c,n;const b={},o=function(){return this},i=function(e,a=0){let t=b[e];return t?a>t.lbp&&(t.lbp=a):((t=Object.create(u)).type=t.value=e,t.lbp=a,b[e]=t),t},u={nud(){const e=this.type===this.value?this.type:this.type+":"+this.value;throw new SyntaxError(`Expected expression but found "${e}" at ${this.line}:${this.col}`)},led(){throw new Error("Missing operator led() definition")}},l=function(e,a){const t=Object.create(i(e));return void 0!==a&&(t.value=a),t},d=function(e){if(void 0!==e&&s.type!==e){const a="\n"===e?"instruction or EOL":'"'+e+'"',t=s.type===s.value?s.type:s.type+":"+s.value;throw new SyntaxError(`Expected ${a} but found "${t}" at ${s.line}:${s.col}`)}const a=s,r=t();return(s=l("punc"===r.type?r.value:r.type,r.value)).col=r.col,s.line=r.line,a},f=function(){const e=[];for(;"eof"!==s.type;){const a=k();if(!1===a)break;void 0!==a&&e.push(a),"eof"!==s.type&&d("\n")}return e},k=function(){let e;switch(s.type){case"org":d(),r=p();break;case"end":return d(),"\n"!==s.type&&"eof"!==s.type&&(r=p(),"eof"!==s.type&&d("\n")),!1;case"label":case"modifier":if(c.set(d().value,n),":"===s.type&&d(),"opcode"!==s.type)break;case"opcode":return n+=1,e=l("instruction",d().value),"."===s.type&&(d(),e.modifier=d("modifier").value),e.a=h(),","===s.type?(d(),e.b=h()):"DAT"!==e.value.toUpperCase()?(e.b=l("operand",l("number",0)),e.b.mode="$"):(e.b=e.a,e.a=l("operand",l("number",0)),e.a.mode="$"),e}},h=function(){const e=l("operand");return"mode"===s.type||"*"===s.type?e.mode=d().value:e.mode="$",e.value=p(),e},p=function(e=0){let a=d(),t=a.nud();for(;e<s.lbp;)t=(a=d()).led(t);return t},A=function(e,a){const t=i(e,a);return t.led=function(e){return this.first=e,this.second=p(a),this},t};function M(s){const b=function(e){const a=new RegExp(String.raw`[\x20\t\r\f\v]*([a-z_]\w*)[\x20\t\r\f\v]*:?[\x20\t\r\f\v]*EQU\x20([^\n]*)`,"ig");let t,s=0,r="";const c=new Map;for(;t=a.exec(e);)c.set(t[1],t[2]),r+=e.slice(s,t.index),s=t.index+t[0].length;return[r+=e.slice(s),c]}(s);t=function(t,s=new Map){const r=new RegExp(String.raw`([\x20\t\r\f\v]+)|(;[^\n]*)|([a-zA-Z_]\w*)|([#$@{}<>])|(\d+)|([\n.,:()+\-*/%])`,"y");let c=1,n=1;const b=function(e,a){const t={type:e,value:a,line:c,col:n};return n+=a.length,t},o=function(){if(r.lastIndex>=t.length)return{type:"eof",value:"eof",line:c,col:n};const o=r.lastIndex,i=r.exec(t);if(null===i)throw new SyntaxError(`Unexpected character "${t[o]}" at ${c}:${n}`);if(void 0!==i[1]||void 0!==i[2])n+=i[0].length;else if(void 0!==i[3]){const c=i[3].toUpperCase();if("ORG"===c)return b("org",i[3]);if("END"===c)return b("end",i[3]);if(-1!==a.indexOf(c))return b("opcode",i[3]);if(-1!==e.indexOf(c))return b("modifier",i[3]);if(!s.has(i[3]))return b("label",i[3]);t=s.get(i[3])+t.slice(r.lastIndex),r.lastIndex=0}else{if(void 0!==i[4])return b("mode",i[4]);if(void 0!==i[5])return b("number",i[5]);if(void 0!==i[6]){const e=b("punc",i[6]);return"\n"===e.value&&(c+=1,n=1),e}}};return function(){let e;for(;void 0===e;)e=o();return e}}(...b),r=l("number",0),c=new Map,n=0,d();const o=f();return[r,c,o]}i("number").nud=o,i("label").nud=o,i("modifier").nud=o,i("(").nud=function(){const e=p();return d(")"),e},A("+",10),A("-",10),A("*",20),A("/",20),A("%",20),function(e,a){const t=i(e);t.nud=function(){return this.first=p(a),this}}("-",30);const S=["DAT","NOP"],B=["JMP","JMZ","JMN","DJN","SPL"],D=["MOV","CMP","SEQ","SNE"],m=["ADD","SUB","MUL","DIV","MOD"];const w=1,y=2;function v(e,a){return(e%a+a)%a}function E(e,a){if(0===e.queue.length)return;const t=e.core,s=e.queue[e.index],r=s.tasks.shift(),c={...t[r]};let n,b,o,i,u;const l=e=>v(e,t.length),d=function(a,r,c){t[a][r]=l(c),t[a].id=s.id,t[a].status=w,e.dirty.add(a)};switch(c.ma){case"#":o={...t[n=r]};break;case"$":n=l(r+c.a),o={...t[n]};break;case"*":n=l(r+c.a),n=l(t[n].a+n),o={...t[n]};break;case"{":d(n=l(r+c.a),"a",t[n].a-1),n=l(t[n].a+n),o={...t[n]};break;case"}":u=l(r+c.a),n=l(t[u].a+u),o={...t[n]},d(u,"a",t[u].a+1);break;case"@":n=l(r+c.a),n=l(t[n].b+n),o={...t[n]};break;case"<":d(n=l(r+c.a),"b",t[n].b-1),n=l(t[n].b+n),o={...t[n]};break;case">":u=l(r+c.a),n=l(t[u].b+u),o={...t[n]},d(u,"b",t[u].b+1)}switch(c.mb){case"#":i={...t[b=r]};break;case"$":b=l(r+c.b),i={...t[b]};break;case"*":b=l(r+c.b),b=l(t[b].a+b),i={...t[b]};break;case"{":d(b=l(r+c.b),"a",t[b].a-1),b=l(t[b].a+b),i={...t[b]};break;case"}":u=l(r+c.b),b=l(t[u].a+u),i={...t[b]},d(u,"a",t[u].a+1);break;case"@":b=l(r+c.b),b=l(t[b].b+b),i={...t[b]};break;case"<":d(b=l(r+c.b),"b",t[b].b-1),b=l(t[b].b+b),i={...t[b]};break;case">":u=l(r+c.b),b=l(t[u].b+u),i={...t[b]},d(u,"b",t[u].b+1)}let f=[l(r+1)];const k=b;switch(c.op){case"DAT.AB":case"DAT.BA":case"DAT.A":case"DAT.B":case"DAT.F":case"DAT.X":case"DAT.I":f=[];break;case"MOV.AB":d(k,"b",o.a);break;case"MOV.BA":d(k,"a",o.b);break;case"MOV.A":d(k,"a",o.a);break;case"MOV.B":d(k,"b",o.b);break;case"MOV.F":d(k,"a",o.a),d(k,"b",o.b);break;case"MOV.X":d(k,"a",o.b),d(k,"b",o.a);break;case"MOV.I":!function(a,r){t[r].op=a.op,t[r].ma=a.ma,t[r].mb=a.mb,t[r].a=a.a,t[r].b=a.b,t[r].id=s.id,t[r].status=w,e.dirty.add(r)}(o,k);break;case"ADD.AB":d(k,"b",i.b+o.a);break;case"ADD.BA":d(k,"a",i.a+o.b);break;case"ADD.A":d(k,"a",i.a+o.a);break;case"ADD.B":d(k,"b",i.b+o.b);break;case"ADD.F":case"ADD.I":d(k,"a",i.a+o.a),d(k,"b",i.b+o.b);break;case"ADD.X":d(k,"a",i.a+o.b),d(k,"b",i.b+o.a);break;case"SUB.AB":d(k,"b",i.b-o.a);break;case"SUB.BA":d(k,"a",i.a-o.b);break;case"SUB.A":d(k,"a",i.a-o.a);break;case"SUB.B":d(k,"b",i.b-o.b);break;case"SUB.F":case"SUB.I":d(k,"a",i.a-o.a),d(k,"b",i.b-o.b);break;case"SUB.X":d(k,"a",i.a-o.b),d(k,"b",i.b-o.a);break;case"MUL.AB":d(k,"b",i.b*o.a);break;case"MUL.BA":d(k,"a",i.a*o.b);break;case"MUL.A":d(k,"a",i.a*o.a);break;case"MUL.B":d(k,"b",i.b*o.b);break;case"MUL.F":case"MUL.I":d(k,"a",i.a*o.a),d(k,"b",i.b*o.b);break;case"MUL.X":d(k,"a",i.a*o.b),d(k,"b",i.b*o.a);break;case"DIV.AB":0!==o.a?d(k,"b",i.b/o.a|0):f=[];break;case"DIV.BA":0!==o.b?d(k,"a",i.a/o.b|0):f=[];break;case"DIV.A":0!==o.a?d(k,"a",i.a/o.a|0):f=[];break;case"DIV.B":0!==o.b?d(k,"b",i.b/o.b|0):f=[];break;case"DIV.F":case"DIV.I":0!==o.a&&0!==o.b?(d(k,"a",i.a/o.a|0),d(k,"b",i.b/o.b|0)):f=[];break;case"DIV.X":0!==o.a&&0!==o.b?(d(k,"a",i.a/o.b|0),d(k,"b",i.b/o.a|0)):f=[];break;case"MOD.AB":0!==o.a?d(k,"b",i.b%o.a):f=[];break;case"MOD.BA":0!==o.b?d(k,"a",i.a%o.b):f=[];break;case"MOD.A":0!==o.a?d(k,"a",i.a%o.a):f=[];break;case"MOD.B":0!==o.b?d(k,"b",i.b%o.b):f=[];break;case"MOD.F":case"MOD.I":0!==o.a&&0!==o.b?(d(k,"a",i.a%o.a),d(k,"b",i.b%o.b)):f=[];break;case"MOD.X":0!==o.a&&0!==o.b?(d(k,"a",i.a%o.b),d(k,"b",i.b%o.a)):f=[];break;case"JMP.AB":case"JMP.BA":case"JMP.A":case"JMP.B":case"JMP.F":case"JMP.X":case"JMP.I":f=[n];break;case"JMZ.A":case"JMZ.BA":0===i.a&&(f=[n]);break;case"JMZ.B":case"JMZ.AB":0===i.b&&(f=[n]);break;case"JMZ.F":case"JMZ.X":case"JMZ.I":0===i.a&&0===i.b&&(f=[n]);break;case"JMN.A":case"JMN.BA":0!==i.a&&(f=[n]);break;case"JMN.B":case"JMN.AB":0!==i.b&&(f=[n]);break;case"JMN.F":case"JMN.X":case"JMN.I":0!==i.a&&0!==i.b&&(f=[n]);break;case"DJN.A":case"DJN.BA":d(k,"a",t[k].a-1),i.a-=1,0!==i.a&&(f=[n]);break;case"DJN.B":case"DJN.AB":d(k,"b",t[k].b-1),i.b-=1,0!==i.b&&(f=[n]);break;case"DJN.F":case"DJN.X":case"DJN.I":d(k,"a",t[k].a-1),d(k,"b",t[k].b-1),i.a-=1,i.b-=1,0!==i.a&&0!==i.b&&(f=[n]);break;case"SEQ.A":o.a===i.a&&(f=[l(r+2)]);break;case"SEQ.B":o.b===i.b&&(f=[l(r+2)]);break;case"SEQ.AB":o.a===i.b&&(f=[l(r+2)]);break;case"SEQ.BA":o.b===i.a&&(f=[l(r+2)]);break;case"SEQ.F":o.a===i.a&&o.b===i.b&&(f=[l(r+2)]);break;case"SEQ.X":o.a===i.b&&o.b===i.a&&(f=[l(r+2)]);break;case"SEQ.I":o.op===i.op&&o.ma===i.ma&&o.mb===i.mb&&o.a===i.a&&o.b===i.b&&(f=[l(r+2)]);break;case"SNE.A":o.a!==i.a&&(f=[l(r+2)]);break;case"SNE.B":o.b!==i.b&&(f=[l(r+2)]);break;case"SNE.AB":o.a!==i.b&&(f=[l(r+2)]);break;case"SNE.BA":o.b!==i.a&&(f=[l(r+2)]);break;case"SNE.F":o.a===i.a&&o.b===i.b||(f=[l(r+2)]);break;case"SNE.X":o.a===i.b&&o.b===i.a||(f=[l(r+2)]);break;case"SNE.I":o.op===i.op&&o.ma===i.ma&&o.mb===i.mb&&o.a===i.a&&o.b===i.b||(f=[l(r+2)]);break;case"SLT.A":o.a<i.a&&(f=[l(r+2)]);break;case"SLT.B":o.b<i.b&&(f=[l(r+2)]);break;case"SLT.AB":o.a<i.b&&(f=[l(r+2)]);break;case"SLT.BA":o.b<i.a&&(f=[l(r+2)]);break;case"SLT.F":case"SLT.I":o.a<i.a&&o.b<i.b&&(f=[l(r+2)]);break;case"SLT.X":o.a<i.b&&o.b<i.a&&(f=[l(r+2)]);break;case"SPL.AB":case"SPL.BA":case"SPL.A":case"SPL.B":case"SPL.F":case"SPL.X":case"SPL.I":f=[l(r+1),n]}if(0!==f.length&&(t[r].id=s.id,t[r].status=y,e.dirty.add(r),s.tasks=s.tasks.concat(f)),0===s.tasks.length)e.queue.splice(e.index,1);else{for(;s.tasks.length>a;)s.tasks.pop();e.index+=1}e.index>=e.queue.length&&(e.index=0,e.cycles+=1)}const x={id:0,status:0,op:"DAT.F",ma:"$",mb:"$",a:0,b:0},g=function(e){const a=Object.create(J);a.core=new Array(e);for(let t=0;t<e;t++)a.core[t]={...x};return a.dirty=new Set,a.queue=[],a.index=0,a.cycles=0,a},J={clear(){this.core=new Array(this.core.length);for(let e=0;e<this.core.length;e++)this.core[e]={...x};this.dirty=new Set,this.queue=[],this.index=0,this.cycles=0},shuffle(){let e,a=this.queue,t=a.length;for(;0!==t;)e=Math.random()*t|0,t-=1,[a[e],a[t]]=[a[t],a[e]]}};function L(e={}){const a=Object.create(O);return a.opts={coreSize:8e3,minDistance:100,instructionLimit:100,threadLimit:8e3,...e},a.state=g(a.opts.coreSize),a.warriors=[],a.warriors.lookup={},a}const O={clear(){this.state.clear(),this.warriors=[],this.warriors.lookup={}},load(e,a){let t=e,s=2;for(;void 0!==this.warriors.lookup[e];)e=t+s,s+=1;const[r,c]=function(e){let a,[t,s,r]=M(e),c=0;const n=function(e){switch(e.type){case"number":return Number(e.value);case"label":case"modifier":if(void 0===(a=s.get(e.value)))throw new SyntaxError(`Unknow label "${e.value}" at ${e.line}:${e.col}`);return a-c;case"+":return n(e.first)+n(e.second);case"-":return void 0===e.second?-n(e.first):n(e.first)-n(e.second);case"*":return n(e.first)*n(e.second);case"/":return n(e.first)/n(e.second);case"%":return n(e.first)%n(e.second);default:throw new SyntaxError(`Unexpected symbol "${e.type}:${e.value}" at ${e.line}:${e.col}`)}};t=n(t);const b=[];for(;c<r.length;c++){const e=r[c];let a=e.value.toUpperCase(),t=e.modifier&&e.modifier.toUpperCase()||"?";"?"===t&&(t=-1!==S.indexOf(a)?"F":-1!==B.indexOf(a)?"B":"#"===e.a.mode?"AB":"#"===e.b.mode?"B":-1!==D.indexOf(a)?"I":-1!==m.indexOf(a)?"F":"B"),"CMP"===a&&(a="SEQ"),b.push({op:a+"."+t,ma:e.a.mode,mb:e.b.mode,a:n(e.a.value),b:n(e.b.value)})}return[t,b]}(a);if(c.length>this.opts.instructionLimit)throw new Error("Total instructions cannot exceed "+this.opts.instructionLimit);const n={name:e,org:r,code:c},b=this.warriors.push(n);return n.id=b-1,n.stage=this.stage.bind(this,n.id),this.warriors.lookup[e]=n,n},stage(e){if(void 0===(e="string"==typeof e?this.warriors.lookup[e]:this.warriors[e]))throw new Error("Failed to stage unknown warrior");let a,t=0,s=0;for(;s<this.opts.minDistance;){if((t+=1)>100)throw new Error(`Unable to load warrior "${e.name}"`);a=Math.random()*this.opts.coreSize|0,s=1/0,this.state.queue.forEach(e=>{const t=v(e.start-a,this.opts.coreSize),r=v(a-e.start,this.opts.coreSize);t<s&&(s=t),r<s&&(s=r)})}return e.code.forEach((t,s)=>{const r={id:e.id,status:w,...t};r.a=v(r.a,this.opts.coreSize),r.b=v(r.b,this.opts.coreSize);const c=v(a+s,this.opts.coreSize);this.state.core[c]=r,this.state.dirty.add(c)}),this.state.queue.push({id:e.id,start:a,tasks:[v(a+e.org,this.opts.coreSize)]}),a},stageAll(){this.warriors.forEach(e=>e.stage())},step(){E(this.state,this.opts.threadLimit)},cycle(){const e=this.state,a=this.opts.threadLimit;if(e.queue.length<2)E(e,a);else{const t=e.cycles;for(;e.queue.length>1&&t===e.cycles;)E(e,a)}return e.cycles}};L.WRITE=w,L.EXEC=y;export default L;