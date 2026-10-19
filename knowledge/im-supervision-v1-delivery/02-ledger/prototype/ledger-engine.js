
/* 龙小督台账 v0.15（D-31 界面话术去技术语言，PM 2026-09-14；D-29 审查修订）：三级层级 批次(文件来源) > 事项编号 > 事项详情；
   导出 Excel 按批导出入口在批次卡片（督办人，导出即归档该批；前置=批内全部跟进记录均为已填报，否则按钮置灰）；转办行内节点徽标+「已转办」角标并列；
   提交即审核（系统无审核按钮）；DDL 双轨：推进中事项 DDL=所属批次 DDL，无批次单事项场景保留单事项 DDL；
   批次=督办人发送 Excel + 口头 DDL（未提供默认 36h），含督办日期与批次 DDL，事项级不再带 DDL；
   节点状态（node，跟进记录表独立字段，D-38）：归档 / 经办人处理中 / 转办人处理中 / 次级转办人处理中 / 转办人审核中 / 经办人审核中 / 督办人审核中；记录创建于督办启动（初始=经办人处理中），督办人导出 Excel 后该批记录转归档（终态）；
   提交-审核链：仅通知相邻前置角色；督办人导出 Excel 后该批跟进记录转「归档」；
   修改/润色在本看板为暂存，点提交才以提交人 Token 调 API 写入 Teable 跟进记录表；
   事项列表=状态机节点展示名（归档/待经办人处理/待转办人处理/待次级转办人填报/待转办人提交/待经办人提交/待督办人提交）+节点归属人+逾期未填报角标；无催办；
   D-30：不展示事项状态机（风险/完结/逾期等，PM 2026-09-14）；D-31：界面只用业务话术（存档/留痕/通知），不出现 Token/API/落库等技术词；
   D-40：事项明细表单展示责任链路 督办人→经办人→[转办人]→[次级转办人]，无转办人/次级转办人的事项不显示对应环节（转办后以实际接手人显示）。
   D-42：跟进记录表维护提交状态三字段（经办人是否提交/转办人是否提交/次级转办人是否提交），对应角色提交（含越级代提）后置真；责任链路逐环节回显每人提交状态（该三角色=已提交/未提交；督办人=已终审/待终审，节点归档即已终审）。 */
var CFG=window.LEDGER_CFG||{};
var MODE=CFG.role||(new URLSearchParams(location.search).get("case")||"jb");
if(["jb","zb","czb","db","ro"].indexOf(MODE)<0)MODE="jb";
var BATCHES=[
 {bid:"SUP-20260910-01",date:"2026-09-10",ddl:"2026-09-12 10:00",note:"督办人上传 Excel 于 09-10 10:00，口头约定 36h"},
 {bid:"SUP-20260906-02",date:"2026-09-06",ddl:"2026-09-08 10:00",note:"口头约定 48h"},
 {bid:"SUP-20260903-03",date:"2026-09-03",ddl:"2026-09-05 10:00",note:"未提供 DDL，按默认 36h"}];
var ITEMS=[
 {bid:0,no:"SJ2609041005",name:"城区道路维修",unit:"市政中心",jb:"詹少鹏",zb:"李良龙",czb:"王强",ddl:"2026-09-16",node:"督办人审核中",st:"done",a:"完成路面修补约80%，剩余人行道砖待铺设。",b:"无。",c:"本周内完成人行道砖铺设。",ddl2:"2026-09-16",ev:"推进中"},
 {bid:0,no:"SJ2608311922",name:"污水管网排查",unit:"水务集团",jb:"苏尚",zb:"—",czb:"—",ddl:"2026-09-16",node:"经办人处理中",st:"draft",a:"已完成主干道管网摸排。",b:"部分路段需封路作业，审批中。",c:"获批后 3 日内完成排查。",ddl2:"2026-09-18",ev:"推进中"},
 {bid:0,no:"SJ2608261503",name:"背街小巷照明",unit:"城管委",jb:"詹少鹏",zb:"李良龙",czb:"—",ddl:"2026-09-05",node:"经办人审核中",st:"done",a:"完成两条巷道灯具采购招标。",b:"部分巷道管线老化需同步改造，协调中。",c:"先易后难分批安装。",ddl2:"2026-09-22",ev:"已滞后"},
 {bid:0,no:"SJHRM20260812T001",name:"绿地养护招标",unit:"园林局",jb:"张秋缘",zb:"—",czb:"—",ddl:"2026-09-20",node:"经办人处理中",st:"todo",a:"",b:"",c:"",ddl2:"",ev:""},
 {bid:1,no:"SJ2608311909",name:"老旧小区管线改造",unit:"住建局",jb:"詹少鹏",zb:"—",czb:"—",ddl:"2026-09-17",node:"归档",st:"done",a:"已完成小区入户调查与工程量统计。",b:"设计图纸尚未出具，施工暂无法启动。",c:"待图纸出具后立即进场，同步准备施工队伍。",ddl2:"2026-09-17",ev:"已滞后"},
 {bid:1,no:"SJ2609051107",name:"主干道窨井更换",unit:"市政中心",jb:"詹少鹏",zb:"李良龙",czb:"王强",ddl:"2026-09-14",node:"次级转办人处理中",st:"todo",a:"",b:"",c:"",ddl2:"",ev:""},
 {bid:2,no:"SJ2609031518",name:"人行天桥护栏加固",unit:"市政中心",jb:"詹少鹏",zb:"李良龙",czb:"王强",ddl:"2026-09-16",node:"次级转办人处理中",st:"todo",a:"",b:"",c:"",ddl2:"",ev:""},
 {bid:2,no:"SJ2609070612",name:"行道树补植",unit:"园林局",jb:"张秋缘",zb:"李良龙",czb:"王强",ddl:"2026-09-08",node:"转办人审核中",st:"todo",wst:"逾期未填报",a:"",b:"",c:"",ddl2:"",ev:""}];
/* D-42 提交状态三字段初始化：存量数据按节点推导；之后仅提交动作（doSubmit，含代提）置真自己角色字段，批次导出转归档不回填未提交角色字段 */
(function(){ITEMS.forEach(function(x){
 x.jbSub=x.jbSub===true||x.node==="督办人审核中"||x.node==="归档";
 x.zbSub=x.zbSub===true||x.node==="经办人审核中"||x.node==="督办人审核中"||x.node==="归档";
 x.czbSub=x.czbSub===true||x.node==="转办人审核中"||x.node==="经办人审核中"||x.node==="督办人审核中"||x.node==="归档";});})();
var CURB=0,CUR=0;
if(CFG.set){CFG.set.forEach(function(u){for(var i=0;i<ITEMS.length;i++){if(ITEMS[i].no===u.no){for(var k in u){ITEMS[i][k]=u[k];}}}});}
if(typeof CFG.curB==="number")CURB=CFG.curB;
function roleVisible(x){
 if(MODE==="db")return true;
 if(MODE==="jb")return x.jb==="詹少鹏";
 if(MODE==="zb")return x.zb==="李良龙";
 if(MODE==="czb")return x.czb==="王强";
 return true;}
function visItems(bid){return ITEMS.map(function(x,i){return [x,i]}).filter(function(r){return r[0].bid===bid&&roleVisible(r[0])})}
function nowStr(){var d=new Date(),p=function(n){return (n<10?"0":"")+n};return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes())}
function visBatches(){return BATCHES.map(function(b,i){return [b,i]}).filter(function(bi){return visItems(bi[1]).length>0})}
function curItem(){var v=visItems(CURB);return v.length?v[CUR][0]:null}
function toast(m,s){var t=document.getElementById("toast");t.innerHTML=m+(s?("<small>"+s+"</small>"):"");t.style.display="block";clearTimeout(t._h);t._h=setTimeout(function(){document.getElementById("toast").style.display="none"},3000)}
function stTag(x){
 if(x.st==="draft")return '<span class="st st-draft">草稿</span>';
 if(x.st==="tr")return '<span class="st st-tr">↷ 已转办'+(x.trTo?' · '+x.trTo:'')+'</span>';
 return '';}
var NODE_DISP={"归档":"归档","经办人处理中":"待经办人处理","转办人处理中":"待转办人处理","次级转办人处理中":"待次级转办人填报","转办人审核中":"待转办人提交","经办人审核中":"待经办人提交","督办人审核中":"待督办人提交"};
function nodeTag(x){
 var cls=x.node==="归档"?"st-todo":(x.node.indexOf("审核中")>-1?"st-warn":"st-blue");
 var who=nodeActor(x);who=(who&&who!=="—")?" · "+who:"";
 return '<span class="st '+cls+'">'+NODE_DISP[x.node]+who+'</span>';}
function warnTag(x){
 if(x.wst==="逾期未填报")return '<span class="st st-hot">逾期未填报</span>';
 return '';}
function nodeActor(x){
 if(x.node==="经办人处理中"||x.node==="经办人审核中")return x.jb;
 if(x.node.indexOf("转办人")===0&&x.zb&&x.zb!=="—")return x.zb;
 if(x.node.indexOf("次级")===0&&x.czb&&x.czb!=="—")return x.czb;
 if(x.node==="督办人审核中")return "督办人（王督办）";
 return "—";}
function headHTML(){
 var all=ITEMS.filter(roleVisible),done=all.filter(function(x){return x.st==="done"}).length;
 var pct=Math.round(done/(all.length||1)*100);
 if(MODE==="db")return '<div class="form-head"><h1>督办事项 · 查收</h1><span class="kn">按批次逐批查收 · 共 '+all.length+' 项 · '+done+' 项已填报</span><div class="pbar"><i style="width:'+pct+'%"></i></div></div>';
 if(MODE==="ro")return '<div class="form-head"><h1>填报记录 · 只读回顾</h1><span class="kn">共 1 条填报记录（提交存档消息）</span><div class="pbar"><i style="width:100%"></i></div></div>';
 return '<div class="form-head"><h1>龙小督台账</h1><span class="kn">批次 <b>'+(CURB+1)+'</b> / 共 '+visBatches().length+' 批 · 本批第 <b>'+(CUR+1)+'</b> / 共 '+(visItems(CURB).length||1)+' 项</span><div class="pbar"><i style="width:'+pct+'%"></i></div><span class="count">已填报 '+done+' · 待办 '+(all.length-done)+'</span></div>';}
function blistHTML(){
 if(MODE==="ro")return "";
 return '<div class="blist"><div class="b-head">督办批次（文件来源）· 由近到远</div>'+visBatches().map(function(bi,idx){
  var b=bi[0],items=visItems(bi[1]),done=items.filter(function(r){return r[0].st==="done"}).length;
  var overdue=b.ddl<nowStr()&&done<items.length;
 var allDone=items.every(function(r){return r[0].st==="done"});
 var allArchived=items.every(function(r){return r[0].node==="归档"});
 return '<div class="b-item '+(bi[1]===CURB?'on':'')+'" onclick="goBatch('+bi[1]+')"><div class="b-no">'+b.bid+'</div><div class="b-meta">督办日期 '+b.date+'<br>批次 DDL <span class="'+(overdue?'b-urgent':'')+'">'+b.ddl+'</span>'+'<br>'+items.length+' 项 · 已提交 '+done+(MODE==='db'?'<br><button class="b-exp"'+(allArchived||!allDone?' disabled':'')+(allArchived?' title="本批已归档"':(!allDone?' title="批内全部跟进记录已填报后方可导出"':''))+' onclick="event.stopPropagation();exportBatch('+bi[1]+')">导出 Excel（归档本批）</button>':'')+'</div></div>'}).join("")+'</div>';}
function listHTML(){
 if(MODE==="ro")return "";
 var rows=visItems(CURB);
 return '<div class="side">'
 +rows.map(function(r,idx){var x=r[0];return '<div class="item '+(idx===CUR?'on':'')+'" onclick="goItem('+idx+')"><div><div class="no">'+x.no+'</div><div class="meta">'+x.name+'</div></div>'+nodeTag(x)+warnTag(x)+(x.st==='tr'?stTag(x):(x.st==='draft'?'<span class="st st-draft">草稿</span>':''))+'</div>'}).join("")+'</div>';}
function goBatch(b){CURB=b;CUR=0;render()}
function goItem(i){CUR=i;render()}
var POLISH='<div class="tools"><button class="polish" onclick="markDraft();toast(\'龙小督润色\',\'弹窗展示规范文本，你确认后替换进台账（仍为暂存，点提交才正式生效）；负面事实原样保留\')">龙小督润色</button></div>';
function pickEv(el){el.parentNode.querySelectorAll(".opt").forEach(function(o){o.classList.remove("on")});el.classList.add("on");markDraft()}
function markDraft(){var x=curItem();if(x&&x.st==="todo"&&MODE!=="ro"&&MODE!=="db"){x.st="draft";render()}}
function actionsFor(x){
 var n=x.node;
 if(MODE==="ro"||n==="归档")return{editable:false,canSubmit:false,canTransfer:false};
 if(MODE==="db")return{editable:true,canSubmit:true,canTransfer:false};
 if(MODE==="jb"){
  if(n==="经办人处理中")return{editable:true,canSubmit:true,canTransfer:true};
  if(n==="转办人处理中"||n==="次级转办人处理中"||n==="转办人审核中"||n==="经办人审核中")return{editable:true,canSubmit:true,canTransfer:false};
 }
 if(MODE==="zb"){
  if(n==="转办人处理中")return{editable:true,canSubmit:true,canTransfer:true};
  if(n==="次级转办人处理中"||n==="转办人审核中")return{editable:true,canSubmit:true,canTransfer:false};
 }
 if(MODE==="czb"&&n==="次级转办人处理中")return{editable:true,canSubmit:true,canTransfer:false};
 return{editable:false,canSubmit:false,canTransfer:false};}
function renderMain(){
 var x=curItem();
 if(!x)return '<div class="main"><div class="task-info">该批次下没有你可处理的事项。</div></div>';
 var act=actionsFor(x);
 var ro=!act.editable;
 var title='<div class="frm-title"><b>'+x.no+'</b>　'+x.name+'<span>'+x.unit+'</span></div>';
 var chain=chainHTML(x);
 var flds='<div class="fld"><label>部门反馈工作落实情况 <span class="req">*</span></label><textarea id="fA" '+(ro?'readonly':'')+'>'+x.a+'</textarea>'+(ro?'':POLISH)+'</div>'
 +'<div class="fld"><label>部门反馈存在困难问题</label><textarea id="fB" '+(ro?'readonly':'')+'>'+x.b+'</textarea>'+(ro?'':POLISH)+'</div>'
 +'<div class="fld"><label>部门反馈下一步工作计划</label><textarea id="fC" '+(ro?'readonly':'')+'>'+x.c+'</textarea>'+(ro?'':POLISH)+'</div>'
 +'<div class="row2"><div class="fld"><label>预计完成时间 <span class="req">*</span></label><input type="date" id="fD" value="'+x.ddl2+'" '+(ro?'disabled':'')+'></div>'
 +'<div class="fld ev"><label>进度评价 <span class="req">*</span></label><div class="opts">'+["推进中","已落实","已滞后"].map(function(e){return '<span class="opt '+(x.ev===e?'on':'')+'" onclick="pickEv(this)">'+e+'</span>'}).join("")+'</div></div></div>';
 var nav='<div class="nav"><button class="btn" onclick="navItem(-1)" '+(CUR<=0?'disabled':'')+'>← 上一项</button>'
 +(MODE!=="db"&&MODE!=="ro"&&act.editable?'<button class="btn" onclick="doDraft()">暂存</button>'+(act.canTransfer?'<button class="btn" onclick="openTransfer(\'item\')">转办</button>':''):'')
 +(MODE==="db"?(act.editable?'<button class="btn" onclick="doSave()">提交</button>':''):(act.canSubmit?'<button class="btn primary" onclick="doSubmit()">提交</button>':''))
 +'<button class="btn" onclick="navItem(1)" '+(CUR>=visItems(CURB).length-1?'disabled':'')+'>下一项 →</button></div>';
 return '<div class="main">'+title+chain+(CFG.errbox||'')+flds+nav+'</div>';}
/* D-40 责任链路：督办人→经办人→[转办人]→[次级转办人]；无转办人/次级转办人则不显示该环节；转办后以实际接手人显示。
   D-42 提交状态回显：每环节附提交状态徽章——经办人/转办人/次级转办人读跟进记录表三字段（已提交/未提交）；督办人=已终审（节点归档）/待终审 */
function chSt(on,ok,ng){return '<span class="ch-st'+(on?' on':'')+'">'+(on?ok:ng)+'</span>'}
function chainHTML(x){
 var zbName=(x.trLvl==="jb"&&x.trTo)?x.trTo:x.zb;
 var czbName=(x.trLvl==="zb"&&x.trTo)?x.trTo:x.czb;
 var segs=['<div class="ch-seg"><span class="ch-role">督办人</span><span class="ch-name">王督办</span>'+chSt(x.node==="归档","已终审","待终审")+'</div>',
  '<div class="ch-seg"><span class="ch-role">经办人</span><span class="ch-name">'+x.jb+'</span>'+chSt(x.jbSub===true,"已提交","未提交")+'</div>'];
 if(zbName&&zbName!=="—")segs.push('<div class="ch-seg"><span class="ch-role">转办人</span><span class="ch-name">'+zbName+'</span>'+chSt(x.zbSub===true,"已提交","未提交")+'</div>');
 if(czbName&&czbName!=="—")segs.push('<div class="ch-seg"><span class="ch-role">次级转办人</span><span class="ch-name">'+czbName+'</span>'+chSt(x.czbSub===true,"已提交","未提交")+'</div>');
 return '<div class="chain"><span class="ch-title">责任链路</span>'+segs.join('<span class="ch-arrow">→</span>')+'</div>';}
function navItem(d){var n=CUR+d;if(n>=0&&n<visItems(CURB).length){CUR=n;render()}}
function collect(){var x=curItem();x.a=document.getElementById("fA").value;x.b=document.getElementById("fB").value;x.c=document.getElementById("fC").value;x.ddl2=document.getElementById("fD").value;var on=document.querySelector(".main .opt.on");x.ev=on?on.textContent:""}
function doDraft(){collect();var x=curItem();if(x.st==="todo")x.st="draft";render();toast("已暂存","草稿保留、可断点续填；修改与润色在你看板中均为暂存，点提交才正式生效")}
function upstreamNode(){if(MODE==="czb")return "转办人审核中";if(MODE==="zb")return "经办人审核中";return "督办人审核中"}
function upstreamName(x){var n=upstreamNode();if(n==="转办人审核中")return x.zb;if(n==="经办人审核中")return x.jb;return "督办人（王督办）"}
function doSubmit(){
 var x=curItem();if(!x)return;
 if(MODE==="db"){doSave();return}
 collect();var errs=[];
 if(!x.a.trim())errs.push(x.no+" 部门反馈工作落实情况不能为空");
 if(!x.ddl2)errs.push(x.no+" 预计完成时间不能为空");
 if(!x.ev)errs.push(x.no+" 进度评价不能为空");
 if(errs.length){toast(errs.join("；"),"请先填写必填项再提交");return;}
 x.st="done";x.node=upstreamNode();x.st="done";
 if(MODE==="jb")x.jbSub=true;if(MODE==="zb")x.zbSub=true;if(MODE==="czb")x.czbSub=true;
 render();
 toast("已提交 "+x.no,"跟进记录已存档（填报人=你），会话里留了一条填报记录；已通知 "+upstreamName(x)+" 查看并提交上报（只通知上一级，不越级）");
 var items=visItems(CURB).map(function(r){return r[0]});
 var dn=items.filter(function(i){return i.st==="done"}).length;
 if(dn===items.length)toast("本批 "+items.length+" 项全部提交","龙小督将发送批次回执；逐级审核完成后由经办人统一上报督办人");
 else if(CUR<items.length-1)CUR++;}
function exportBatch(bid){
 var items=ITEMS.filter(function(x){return x.bid===bid});
 if(!items.every(function(x){return x.st==="done"})){toast("暂不能导出（"+BATCHES[bid].bid+"）","导出前置条件：批内全部跟进记录均为已填报；请先对未填报项直接修改/代录补正后再导出");return;}
 items.forEach(function(x){x.node="归档"});
 items.forEach(function(x){delete x.wst});
 render();
 toast("已导出 Excel 并归档（"+BATCHES[bid].bid+"）","每次导出一个批次：本批 "+items.length+" 条跟进记录已转为「归档」，填报人将收到「本轮跟进已关闭」通知");}
function doSave(){collect();toast("已保存修改","修改已存档并留痕（记录人=督办人）")}
var MEMBERS=[{n:"李良龙",d:"市政中心 · 道路养护科"},{n:"王强",d:"市政中心 · 桥梁设施科"},{n:"苏尚",d:"水务集团 · 工程部"},{n:"张秋缘",d:"园林局 · 绿化科"},{n:"陈刚",d:"教育局 · 安全科"}];
var TR={kind:"item",sel:null};
function mItemHTML(m,i){return '<div class="m-item" data-i="'+i+'" onclick="pickM(this)"><div class="ava">'+m.n.slice(0,1)+'</div><div><div class="nm">'+m.n+'</div><div class="dp">'+m.d+'</div></div><div class="rd"></div></div>'}
function openTransfer(kind,force){
 if(!force&&(MODE==="czb"||MODE==="ro"||MODE==="db"||!actionsFor(curItem()).canTransfer)){toast("当前角色或节点状态不可转办","转办仅在自己处理中的事项可操作");return}
 TR={kind:kind,sel:null};
 var title="转办本事项";
 document.getElementById("mask").innerHTML='<div class="modal"><div class="m-head">'+title+'</div><div class="m-search"><input id="mKw" placeholder="搜索组织成员（姓名 / 部门）" oninput="filterM(this.value)"></div><div class="m-list">'+MEMBERS.map(mItemHTML).join("")+'</div><div class="m-tip">单选唯一一位；确认后<b>新执行人将收到待办通知</b>，节点转为「'+(MODE==="jb"?"转办人":"次级转办人")+'处理中」。</div><div class="m-foot"><button class="btn" onclick="closeTransfer()">取消</button><button class="btn primary" id="mOk" disabled onclick="confirmTransfer()">确认转办</button></div></div>';
 document.getElementById("mask").classList.add("show")}
function filterM(k){k=k.trim();document.querySelectorAll(".m-item").forEach(function(el){var m=MEMBERS[+el.dataset.i];el.style.display=(!k||m.n.indexOf(k)>-1||m.d.indexOf(k)>-1)?"flex":"none"})}
function pickM(el){document.querySelectorAll(".m-item").forEach(function(e){e.classList.remove("on");e.querySelector(".rd").textContent=""});el.classList.add("on");el.querySelector(".rd").textContent="✓";TR.sel=MEMBERS[+el.dataset.i];document.getElementById("mOk").disabled=false}
function closeTransfer(){document.getElementById("mask").classList.remove("show")}
function confirmTransfer(){
 var node=MODE==="jb"?"转办人处理中":"次级转办人处理中";
 var x=curItem();x.st="tr";x.trTo=TR.sel.n;x.trLvl=MODE;x.node=node;toast("已转办给 "+TR.sel.n,"已发送待办事项通知；节点转为「"+node+"」")
 closeTransfer();render()}
var RO_FIXED=false;
function render(){
 if(MODE==="ro"&&!RO_FIXED){
  RO_FIXED=true;
  var no=new URLSearchParams(location.search).get("no")||"SJ2609041005";
  var idx=ITEMS.findIndex(function(x){return x.no===no});
  if(idx>-1){CURB=ITEMS[idx].bid;var p=visItems(CURB).findIndex(function(r){return r[1]===idx});if(p>-1)CUR=p;}
 }
 var app=document.getElementById("app");
 app.innerHTML=headHTML()+'<div class="layout">'+blistHTML()+listHTML()+renderMain()+'</div>';
}
if(CFG.focus){for(var i=0;i<ITEMS.length;i++){if(ITEMS[i].no===CFG.focus){CURB=ITEMS[i].bid;var vv=visItems(CURB);for(var j=0;j<vv.length;j++){if(vv[j][0]===ITEMS[i])CUR=j;}}}}
render();
if(CFG.modal==="transfer")openTransfer(CFG.modalKind||"item",true);
