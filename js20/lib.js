
function getPasteEvent(){var el=document.createElement('input'),name='onpaste';el.setAttribute(name,'');return(typeof el[name]==='function')?'paste':'input';}
var pasteEventName=getPasteEvent()+".mask",ua=navigator.userAgent,iPhone=/iphone/i.test(ua),android=/android/i.test(ua),caretTimeoutId;$.mask={definitions:{'9':"[0-9]",'a':"[A-Za-z]",'*':"[A-Za-z0-9]"},dataName:"rawMaskFn",placeholder:'_',};$.fn.extend({caret:function(begin,end){var range;if(this.length===0||this.is(":hidden")){return;}
if(typeof begin=='number'){end=(typeof end==='number')?end:begin;return this.each(function(){if(this.setSelectionRange){this.setSelectionRange(begin,end);}else if(this.createTextRange){range=this.createTextRange();range.collapse(true);range.moveEnd('character',end);range.moveStart('character',begin);range.select();}});}else{if(this[0].setSelectionRange){begin=this[0].selectionStart;end=this[0].selectionEnd;}else if(document.selection&&document.selection.createRange){range=document.selection.createRange();begin=0-range.duplicate().moveStart('character',-100000);end=begin+range.text.length;}
return{begin:begin,end:end};}},unmask:function(){return this.trigger("unmask");},mask:function(mask,settings){var input,defs,tests,partialPosition,firstNonMaskPos,len;if(!mask&&this.length>0){input=$(this[0]);var f=input.data($.mask.dataName);return f?f():null;}
settings=$.extend({placeholder:$.mask.placeholder,completed:null},settings);defs=$.mask.definitions;tests=[];partialPosition=len=mask.length;firstNonMaskPos=null;$.each(mask.split(""),function(i,c){if(c=='?'){len--;partialPosition=i;}else if(defs[c]){tests.push(new RegExp(defs[c]));if(firstNonMaskPos===null){firstNonMaskPos=tests.length-1;}}else{tests.push(null);}});return this.trigger("unmask").each(function(){var input=$(this),buffer=$.map(mask.split(""),function(c,i){if(c!='?'){return defs[c]?settings.placeholder:c;}}),focusText=input.val();function seekNext(pos){while(++pos<len&&!tests[pos]);return pos;}
function seekPrev(pos){while(--pos>=0&&!tests[pos]);return pos;}
function shiftL(begin,end){var i,j;if(begin<0){return;}
for(i=begin,j=seekNext(end);i<len;i++){if(tests[i]){if(j<len&&tests[i].test(buffer[j])){buffer[i]=buffer[j];buffer[j]=settings.placeholder;}else{break;}
j=seekNext(j);}}
writeBuffer();input.caret(Math.max(firstNonMaskPos,begin));}
function shiftR(pos){var i,c,j,t;for(i=pos,c=settings.placeholder;i<len;i++){if(tests[i]){j=seekNext(i);t=buffer[i];buffer[i]=c;if(j<len&&tests[j].test(t)){c=t;}else{break;}}}}
function keydownEvent(e){var k=e.which,pos,begin,end;if(k===8||k===46||(iPhone&&k===127)){pos=input.caret();begin=pos.begin;end=pos.end;if(end-begin===0){begin=k!==46?seekPrev(begin):(end=seekNext(begin-1));end=k===46?seekNext(end):end;}
clearBuffer(begin,end);shiftL(begin,end-1);e.preventDefault();}else if(k==27){input.val(focusText);input.caret(0,checkVal());e.preventDefault();}}
function keypressEvent(e){var k=e.which,pos=input.caret(),p,c,next;if(e.ctrlKey||e.altKey||e.metaKey||k<32){return;}else if(k){if(pos.end-pos.begin!==0){clearBuffer(pos.begin,pos.end);shiftL(pos.begin,pos.end-1);}
p=seekNext(pos.begin-1);if(p<len){c=String.fromCharCode(k);if(tests[p].test(c)){shiftR(p);buffer[p]=c;writeBuffer();next=seekNext(p);if(android){setTimeout($.proxy($.fn.caret,input,next),0);}else{input.caret(next);}
if(settings.completed&&next>=len){settings.completed.call(input);}}}
e.preventDefault();}}
function clearBuffer(start,end){var i;for(i=start;i<end&&i<len;i++){if(tests[i]){buffer[i]=settings.placeholder;}}}
function writeBuffer(){input.val(buffer.join(''));}
function checkVal(allow){var test=input.val(),lastMatch=-1,i,c;for(i=0,pos=0;i<len;i++){if(tests[i]){buffer[i]=settings.placeholder;while(pos++<test.length){c=test.charAt(pos-1);if(tests[i].test(c)){buffer[i]=c;lastMatch=i;break;}}
if(pos>test.length){break;}}else if(buffer[i]===test.charAt(pos)&&i!==partialPosition){pos++;lastMatch=i;}}
if(allow){writeBuffer();}else if(lastMatch+1<partialPosition){input.val("");clearBuffer(0,len);}else{writeBuffer();input.val(input.val().substring(0,lastMatch+1));}
return(partialPosition?i:firstNonMaskPos);}
input.data($.mask.dataName,function(){return $.map(buffer,function(c,i){return tests[i]&&c!=settings.placeholder?c:null;}).join('');});if(!input.attr("readonly"))
input.one("unmask",function(){input.unbind(".mask").removeData($.mask.dataName);}).bind("focus.mask",function(){clearTimeout(caretTimeoutId);var pos,moveCaret;focusText=input.val();pos=checkVal();caretTimeoutId=setTimeout(function(){writeBuffer();if(pos==mask.length){input.caret(0,pos);}else{input.caret(pos);}},10);}).bind("blur.mask",function(){checkVal();if(input.val()!=focusText)
input.change();}).bind("keydown.mask",keydownEvent).bind("keypress.mask",keypressEvent).bind(pasteEventName,function(){setTimeout(function(){var pos=checkVal(true);input.caret(pos);if(settings.completed&&pos==input.val().length)
settings.completed.call(input);},0);});checkVal();});}});     
var DragMaster=(function(){var dragObject;var mouseDownAt;var currentDropTarget;function mouseDown(e){e=EventHelper.fixMouseEvent(e);if(e.which!=1)return;mouseDownAt={x:e.pageX,y:e.pageY,element:this}
addDocumentEventHandlers();return false;}
function mouseMove(e){e=EventHelper.fixMouseEvent(e);if(mouseDownAt){if(Math.abs(mouseDownAt.x-e.pageX)<5&&Math.abs(mouseDownAt.y-e.pageY)<5){return false;}
var elem=mouseDownAt.element;dragObject=elem.dragObject;var mouseOffset=getMouseOffset(elem,mouseDownAt.x,mouseDownAt.y);mouseDownAt=null;dragObject.onDragStart(mouseOffset);}
dragObject.onDragMove(e.pageX,e.pageY);var newTarget=getCurrentTarget(e);if(currentDropTarget!=newTarget){if(currentDropTarget){currentDropTarget.onLeave()}
if(newTarget){newTarget.onEnter();}
currentDropTarget=newTarget;}
return false;}
function mouseUp(){if(!dragObject){mouseDownAt=null;}else{if(currentDropTarget&&currentDropTarget.accept(dragObject)){dragObject.onDragSuccess(currentDropTarget);}else{dragObject.onDragFail(currentDropTarget);}
dragObject=null;}
removeDocumentEventHandlers();}
function getMouseOffset(target,x,y){var docPos=DOMHelper.getOffset(target)
return{x:x-docPos.left,y:y-docPos.top}}
function getCurrentTarget(e){if(navigator.userAgent.match('MSIE')||navigator.userAgent.match('Gecko')){var x=e.clientX,y=e.clientY;}
else{var x=e.pageX,y=e.pageY;}
dragObject.hide()
var elem=document.elementFromPoint(x,y)
dragObject.show()
while(elem){if(elem.dropTarget&&elem.dropTarget.canAccept(dragObject)){return elem.dropTarget}
elem=elem.parentNode}
return null;}
function addDocumentEventHandlers(){document.onmousemove=mouseMove;document.onmouseup=mouseUp;document.ondragstart=document.body.onselectstart=function(){return false};}
function removeDocumentEventHandlers(){document.onmousemove=document.onmouseup=document.ondragstart=document.body.onselectstart=null;}
return{makeDraggable:function(element){EventHelper.add(element,"mousedown",mouseDown,true);}}}()) 
function DragObject(element,options){element.dragObject=this;this.element=element;this.m_offsetX=(options&&options.offsetX!=undefined)?options.offsetX:0;this.m_offsetY=(options&&options.offsetY!=undefined)?options.offsetY:0;DragMaster.makeDraggable(element);}
DragObject.prototype.DRAG_CLASS="dragging";DragObject.prototype.rememberPosition;DragObject.prototype.mouseOffset;DragObject.prototype.onDragStart=function(offset){var s=this.element.style;this.rememberPosition={top:s.top,left:s.left,position:s.position};s.position="absolute";this.mouseOffset=offset;DOMHelper.addClass(this.element,this.DRAG_CLASS);}
DragObject.prototype.hide=function(){this.element.style.display="none";}
DragObject.prototype.show=function(){this.element.style.display="";}
DragObject.prototype.onDragMove=function(x,y){this.element.style.top=(y-this.mouseOffset.y-this.m_offsetY)+"px";this.element.style.left=(x-this.mouseOffset.x-this.m_offsetX)+"px";}
DragObject.prototype.onDragSuccess=function(dropTarget){DOMHelper.delClass(this.element,this.DRAG_CLASS);}
DragObject.prototype.onDragFail=function(dropObject){var s=this.element.style;s.top=this.rememberPosition.top;s.left=this.rememberPosition.left;s.position=this.rememberPosition.position;DOMHelper.delClass(this.element,this.DRAG_CLASS);if(dropObject){dropObject.onLeave();}}
DragObject.prototype.toString=function(){return element.id;} 
function DropTarget(element){this.element=element;element.dropTarget=this;}
DropTarget.prototype.CLASS_NAME='uponMe';DropTarget.prototype.canAccept=function(dragObject){return true;}
DropTarget.prototype.accept=function(dragObject){this.onLeave();dragObject.hide();return true;}
DropTarget.prototype.onLeave=function(){DOMHelper.delClass(this.element,this.CLASS_NAME);}
DropTarget.prototype.onEnter=function(){DOMHelper.addClass(this.element,this.CLASS_NAME);}
DropTarget.prototype.toString=function(){return this.element.id;} 
function extend(Child,Parent){var F=function(){};F.prototype=Parent.prototype;Child.prototype=new F();Child.prototype.constructor=Child;Child.superclass=Parent.prototype;} 
function App(id,options){this.setId(id);options=options||{};options.servVars=options.servVars||{};var host=options.servVars.basePath||window.location.hostname||"";this.setHost(host);this.setScript(options.script);this.m_servVars=options.servVars;var con_opts={"host":host,"token":this.m_servVars.token,"tokenr":this.m_servVars.tokenr,"tokenExpires":DateHelper.strtotime(this.m_servVars.tokenExpires)};this.setServConnector(new ServConnector(con_opts));this.m_constantManager=new ConstantManager({"XMLString":options.constantXMLString});if(window["SessionVarManager"]){this.m_sessionVarManager=new SessionVarManager();}
this.m_cashData={};this.m_openedForms={};this.m_templateParams={};this.setPaginationClass(options.paginationClass||GridPagination);}
App.prototype.DEF_dateEditMask="99/99/9999";App.prototype.DEF_dateFormat="d/m/Y";App.prototype.DEF_dateTimeEditMask="99/99/9999 99:99:99";App.prototype.DEF_dateTimeFormat="d/m/Y H:i:s";App.prototype.DEF_phoneEditMask="+7-(999)-999-99-99";App.prototype.DEF_timeEditMask="99:99";App.prototype.DEF_timeFormat="H:i:s";App.prototype.DEF_LOCALE="ru";App.prototype.VERSION="2.1.011";App.prototype.HISTORY_KEEP_LEN=20;App.prototype.WIN_MES_WIDTH_DEF=18;App.prototype.WIN_MES_POS_DEF="overlap";App.prototype.UPDATE_INST_POSTPONE_DELAY=5*60*1000;App.prototype.SERV_RESPONSE_MODEL_ID="ModelServResponse";App.prototype.EVENT_MODEL_ID="Event_Model";App.prototype.CON_ER_SHOW_FREQ=60*5*1000;App.prototype.m_id;App.prototype.m_host;App.prototype.m_script;App.prototype.m_bsCol;App.prototype.m_winClass;App.prototype.m_servVars;App.prototype.m_constantManager;App.prototype.m_sessionVarManager;App.prototype.m_servConnector;App.prototype.m_dateEditMask;App.prototype.m_dateFormat;App.prototype.m_dateTimeEditMask;App.prototype.m_dateTimeFormat;App.prototype.m_timeFormat;App.prototype.m_phoneEditMask;App.prototype.m_timeEditMask;App.prototype.m_locale;App.prototype.m_cashData;App.prototype.m_openedForms;App.prototype.m_templates;App.prototype.m_templateParams;App.prototype.m_paginationClass;App.prototype.m_enums;App.prototype.m_predefinedItems;App.prototype.m_tabManager;App.prototype.m_updateInstPostponed;App.prototype.m_appSrv;App.prototype.m_openedWindows={};App.prototype.setHost=function(host){this.m_host=host;}
App.prototype.getHost=function(){return this.m_host;}
App.prototype.setScript=function(v){this.m_script=v;}
App.prototype.getScript=function(){return this.m_script;}
App.prototype.getBsCol=function(v){return window.getBsCol(v);}
App.prototype.setWinClass=function(winClass){this.m_winClass=winClass;}
App.prototype.getWinClass=function(winClass){return this.m_winClass;}
App.prototype.getServVars=function(){return this.m_servVars;}
App.prototype.getServVar=function(id){return this.m_servVars[id];}
App.prototype.setServVar=function(id,val){this.m_servVars[id]=val;}
App.prototype.getConstantManager=function(){return this.m_constantManager;}
App.prototype.getSessionVarManager=function(){return this.m_sessionVarManager;}
App.prototype.getServConnector=function(){return this.m_servConnector;}
App.prototype.setServConnector=function(v){this.m_servConnector=v;}
App.prototype.getId=function(){return this.m_id;}
App.prototype.setId=function(id){this.m_id=id;}
App.prototype.setDateEditMask=function(v){this.m_dateEditMask=v;}
App.prototype.getDateEditMask=function(){return(this.m_dateEditMask)?this.m_dateEditMask:this.DEF_dateEditMask;}
App.prototype.setDateTimeEditMask=function(v){this.m_dateTimeEditMask=v;}
App.prototype.getDateTimeEditMask=function(){return(this.m_dateTimeEditMask)?this.m_dateTimeEditMask:this.DEF_dateTimeEditMask;}
App.prototype.setDateFormat=function(v){this.m_dateFormat=v;}
App.prototype.getDateFormat=function(){return(this.m_dateFormat)?this.m_dateFormat:this.DEF_dateFormat;}
App.prototype.setDateTimeFormat=function(v){this.m_dateTimeFormat=v;}
App.prototype.getDateTimeFormat=function(){return(this.m_dateTimeFormat)?this.m_dateTimeFormat:this.DEF_dateTimeFormat;}
App.prototype.setTimeFormat=function(v){this.m_timeFormat=v;}
App.prototype.getTimeFormat=function(){return(this.m_timeFormat)?this.m_timeFormat:this.DEF_timeFormat;}
App.prototype.setPhoneEditMask=function(v){this.m_phoneEditMask=v;}
App.prototype.getPhoneEditMask=function(){return(this.m_phoneEditMask)?this.m_phoneEditMask:this.DEF_phoneEditMask;}
App.prototype.setTimeEditMask=function(v){this.m_timeEditMask=v;}
App.prototype.getTimeEditMask=function(){return(this.m_timeEditMask)?this.m_timeEditMask:this.DEF_timeEditMask;}
App.prototype.getLocale=function(){return this.m_servVars["locale_id"]||this.DEF_LOCALE;}
App.prototype.formatError=function(erCode,erStr){return(erStr);}
App.prototype.getCashData=function(id){return this.m_cashData[id];}
App.prototype.setCashData=function(id,val){this.m_cashData[id]=val;}
App.prototype.getOpenedForms=function(){return this.m_openedForms;}
App.prototype.addOpenedForm=function(id,form){this.m_openedForms[id]=form;}
App.prototype.delOpenedForm=function(id){delete this.m_openedForms[id];}
App.prototype.numberFormat=function(val,prec){return CommonHelper.numberFormat(val,prec,CommonHelper.getDecimalSeparator()," ");}
App.prototype.addTemplate=function(id,tmpl){this.m_templates[id]=tmpl;}
App.prototype.downloadServerTemplate=function(serverTemplateId,classId,callBack){var self=this;this.getServConnector().sendGet({"t":serverTemplateId,"v":"ViewXML"},(callBack!=undefined),(function(serverTemplateId,classId){return function(eN,eS,resp){var m_list=resp.getModels();if(m_list&&m_list[serverTemplateId+"-template"]){self.m_templates[classId]=m_list[serverTemplateId+"-template"].innerHTML;if(callBack){callBack(self.m_templates[classId]);}}}})(serverTemplateId,classId),"xml");}
App.prototype.getTemplate=function(id,callBack){var tmpl=this.m_templates?this.m_templates[id]:null;return tmpl;}
App.prototype.setTemplate=function(id,v){this.m_templates[id]=v;}
App.prototype.getPaginationClass=function(id){return this.m_paginationClass;}
App.prototype.setPaginationClass=function(v){this.m_paginationClass=v;}
App.prototype.getDataTypes=function(){return this.m_dataTypes;}
App.prototype.setDataTypes=function(v){this.m_dataTypes=v;}
App.prototype.getDataType=function(id){return this.m_dataTypes[id];}
App.prototype.setEnums=function(v){this.m_enums=v;}
App.prototype.getEnums=function(){return this.m_enums;}
App.prototype.getEnum=function(enumId,valId){if(!this.m_enums[enumId])throw Error("Enum not found "+enumId)
return this.m_enums[enumId][this.getLocale()+"_"+valId];}
App.prototype.setPredefinedItems=function(v){this.m_predefinedItems=v;}
App.prototype.getPredefinedItems=function(){return this.m_predefinedItems;}
App.prototype.getPredefinedItem=function(dataType,item){return this.m_predefinedItems[dataType][item];}
App.prototype.storageSet=function(id,val){if(localStorage)localStorage.setItem(id,val);}
App.prototype.storageGet=function(id){if(localStorage)return localStorage.getItem(id);}
App.prototype.getTimeZoneOffsetStr=function(){return DateHelper.getTimeZoneOffsetStr();}
App.prototype.historyPush=function(stateObj){if(window.history){stateObj.urlHash=CommonHelper.hash(stateObj.url);if(!window.history.length||!window.history.state||(window.history.state&&window.history.state.urlHash!=stateObj.urlHash)){window.history.pushState(stateObj,stateObj.title,"");}}}
App.prototype.showMenuItem=function(itemNode,c,f,t,extra,title){window.setGlobalWait(true);var self=this;var url_str="?c="+c;var par_v="ViewXML";var par={"v":"ViewXML"};if(c)par.c=c;if(f){par.f=f;url_str+="&f="+f;}
if(extra){var par_ar=extra.split("&");for(var i=0;i<par_ar.length;i++){var par_pair=par_ar[i].split("=");if(par_pair.length==2&&par_pair[1]){par[par_pair[0]]=par_pair[1];url_str+="&"+par_pair[0]+"="+par_pair[1];if(par_pair[0]=="v"){par_v=par_pair[1];}}}}
this.m_storedTemplate=this.getTemplate(t)||{"id":t,"template":null,"dataModelId":null,"variantStorage":null};par.t=t;url_str+="&t="+t;url_str+="&v="+par_v;this.historyPush({"c":c,"f":f,"t":t,"extra":extra,"title":title,"url":url_str});this.getServConnector().sendGet(par,false,function(eN,eS,resp){if(eN!=0){window.setGlobalWait(false);window.showError(eS);}
else{self.renderContentXML(resp);window.setGlobalWait(false);}},"xml");return false;}
App.prototype.renderContentXML=function(resp){try{var data_n=CommonHelper.nd("windowData");if(!data_n)return;if(this.m_view){this.m_view.delDOM();delete this.m_view;}
if(window["page_views"]){for(var v_id in window["page_views"]){window["page_views"][v_id].delDOM();delete window["page_views"][v_id];}
delete window["page_views"];}
while(data_n.firstChild){data_n.removeChild(data_n.firstChild);}
var v_opts={"models":{}};var resp_models=resp.getModels();for(var m_id in resp_models){var sys_model=resp_models[m_id].getAttribute("sysModel");if(sys_model=="1"&&resp_models[m_id].getAttribute("templateId")){v_opts.template=resp_models[m_id].innerHTML;}
else if(sys_model=="1"){}
else{if(window[m_id]){var model_constr=eval(m_id);v_opts.models[m_id]=new model_constr({"data":resp.getModelData(m_id)});}
else{v_opts.models[m_id]=new ModelXML(m_id,{"data":resp.getModelData(m_id)});}}}
this.m_storedTemplate.variantStorage={"name":this.m_storedTemplate.id,"model":null};if(v_opts.models.VariantStorage_Model){this.m_storedTemplate.variantStorage.model=v_opts.models.VariantStorage_Model;this.m_storedTemplate.variantStorage.model.getRow(0);}
v_opts.variantStorage=this.m_storedTemplate.variantStorage;var view=eval(this.m_storedTemplate.id+"_View");this.m_view=new view(this.m_storedTemplate.id,v_opts);this.m_view.toDOM(data_n);}
catch(e){window.onerror(e.message,"App.js",369,1);}
return false;}
App.prototype.showAbout=function(){window.setGlobalWait(true);var contr=new About_Controller(this);contr.run("get_object",{"t":"About","ok":function(resp){var v=new About_View("About_View",{"template":resp.getModelData("About-template").innerHTML,"models":{"About_Model":new About_Model({"data":resp.getModelData("About_Model")})}});window.setGlobalWait(false);WindowAbout.show(v);},"fail":function(){window.setGlobalWait(false);}})}
App.prototype.initPage=function(){if(this.m_appSrv){this.m_appSrv.disconnect();}
this.getServConnector().quit();if(this.m_openedWindows){for(var id in this.m_openedWindows){if(this.m_openedWindows[id]){this.m_openedWindows[id].close();}}}
window.location.href=this.getServVar("basePath");}
App.prototype.quit=function(){var self=this;(new User_Controller()).run("logout",{"all":function(){self.initPage();}});window.setGlobalWait(true);return false;}
App.prototype.getCurrentView=function(){return this.m_view;}
App.prototype.setWinMessageStyle=function(v){this.m_winMessageStyle=v}
App.prototype.getWinMessageStyle=function(){if(!this.m_winMessageStyle){var s_var=this.getServVar("win_message_style");this.m_winMessageStyle=CommonHelper.unserialize(s_var);if(CommonHelper.isEmpty(this.m_winMessageStyle)){this.m_winMessageStyle={"win_width":18,"win_position":"overlap"}}}
return this.m_winMessageStyle;}
App.prototype.setUpdateInstPostponed=function(v,delay){this.m_updateInstPostponed=v;if(v){var self=this;setTimeout(function(){self.setUpdateInstPostponed(false);},delay);}}
App.prototype.getUpdateInstPostponed=function(v){return this.m_updateInstPostponed;}
App.prototype.getUpdateInstPostponeDelay=function(){if(!this.m_updateInstPostponeDelay){this.m_updateInstPostponeDelay=this.UPDATE_INST_POSTPONE_DELAY;}
return this.m_updateInstPostponeDelay;}
App.prototype.getAppSrv=function(){return this.m_appSrv;}
App.prototype.initAppSrv=function(appSrvOptions){if(window["AppSrv"]&&appSrvOptions){console.log("App.prototype.initAppSrv")
var self=this;try{this.m_appSrv=new AppSrv(appSrvOptions);this.m_appSrv.connect();this.subscribeToEventSrv();}
catch(e){if(window.showTempError){window.showTempError(this.ER_WS_NOT_SUPPERTED);}
else{throw new Error(this.ER_WS_NOT_SUPPERTED);}}}}
App.prototype.subscribeToEventSrv=function(clientId){console.log("App.prototype.subscribeToEventSrv")
var self=this;this.m_appSrv.subscribe({"events":[{"id":"Constant.update"},{"id":CommonHelper.md5("SessionVar.update."+this.getServConnector().getAccessToken())},{"id":"User.logout"}],"onEvent":function(json){console.log("App.prototype.subscribeToEventSrv onEvent")
console.log(json)
if(json.eventId=="User.logout"){self.initPage();}
else if(json.eventId=="Constant.update"&&self.m_constantManager){self.m_constantManager.onEventSrvMessage(json);}
else if(json.eventId==CommonHelper.md5("SessionVar.update."+self.getServConnector().getAccessToken())&&self.m_sessionVarManager){self.m_sessionVarManager.onEventSrvMessage(json);}},"onOpen":function(){console.log("App.onSrvOpen")
var tm=(new Date()).getTime();if(!self.m_lastConnOpenTime||(tm-self.m_lastConnOpenTime)>self.CON_ER_SHOW_FREQ){window.showTempNote(self.NT_WS_CONNECTED);}
self.m_lastConnOpenTime=tm;},"onClose":function(message){if(message.code!=undefined&&message.code>1000){var tm=(new Date()).getTime();if(!self.m_lastConnErrTime||(tm-self.m_lastConnErrTime)>self.CON_ER_SHOW_FREQ){window.showTempError(self.ER_WS_NOT_CONNECTED);}
self.m_lastConnErrTime=tm;}}});} 
function AppWin(options){options=options||{};this.m_msg=new WindowMessage();this.m_tempMsg=new WindowTempMessage();var self=this;window.onerror=function(msg,url,line,col,error){self.onError(msg,url,line,col,error);};if(window.history){window.onpopstate=function(e){if(e.state){window.getApp().showMenuItem(null,e.state.c,e.state.f,e.state.t,e.state.extra,e.state.title);}}}
window.getApp=function(){return options.app;}
window.getWidthType=function(){return options.widthType?options.widthType:"sm";}
window.getBsCol=function(v){return(options.bsCol?(options.bsCol+((v!=undefined)?v.toString():"")):("col-"+this.getWidthType()+"-"+((v!=undefined)?v.toString():"")));};window.showMsg=function(opts){opts.bsCol=window.getBsCol();self.m_msg.show(opts);};window.showError=function(msg,callBack,timeout){window.showMsg({"type":self.m_msg.TP_ER,"text":msg,"callBack":callBack,"timeout":timeout});};window.showWarn=function(msg,callBack,timeout){window.showMsg({"type":self.m_msg.TP_WARN,"text":msg,"callBack":callBack,"timeout":timeout});};window.showNote=function(msg,callBack,timeout){window.showMsg({"type":self.m_msg.TP_NOTE,"text":msg,"callBack":callBack,"timeout":timeout});};window.showOk=function(msg,callBack,timeout){window.showMsg({"type":self.m_msg.TP_OK,"text":msg,"callBack":callBack,"timeout":timeout});};window.showTempMsg=function(opts){self.m_tempMsg.show(opts);};window.showTempNote=function(msg,callBack,timeout){window.showTempMsg({"type":self.m_tempMsg.TP_NOTE,"content":msg,"callBack":callBack,"timeout":timeout});};window.showTempError=function(msg,callBack,timeout){window.showTempMsg({"type":self.m_tempMsg.TP_ER,"content":msg,"callBack":callBack,"timeout":timeout});};window.showTempWarn=function(msg,callBack,timeout){window.showTempMsg({"type":self.m_tempMsg.TP_WARN,"content":msg,"callBack":callBack,"timeout":timeout})};window.resetError=function(){};window.setGlobalWait=function(isWait){var n=document.getElementById("waiting");if(n)n.style=isWait?"display:block;":"display:none;"}}
AppWin.prototype.onError=function(msg,url,line,col,error){if(error instanceof FatalException){error.show();}
else{var d=window.getApp().getServVar("debug");var m_debug=(d=="1"||d===true||d===undefined);var str=msg;if(m_debug){str=str+"\nurl: "+url+"\nline: "+line;if(console){console.log(str);if(error&&error.stack)console.log(error.stack);if(console.trace)console.trace();}}
else{var er_pref="Error: ";if(str.substr(0,er_pref.length)==er_pref){str=str.substr(er_pref.length);}
er_pref="Uncaught Error";if(str.substr(0,er_pref.length)==er_pref){str=str.substr(er_pref.length);}}
window.showError(str);}
return false;} 
var CommonHelper={format:function(str,params){if(!str)return"";var r=str;if(typeof(params)=="string"){params=[params];}
for(var i=0;i<params.length;i++){r=r.replace("%",params[i]);}
return r;},numberFormat:function(number,decimals,dec_point,thousands_sep){var i,j,kw,kd,km;if(isNaN(decimals=Math.abs(decimals))){decimals=2;}
if(dec_point==undefined){dec_point=",";}
if(thousands_sep==undefined){thousands_sep=".";}
i=parseInt(number=(+number||0).toFixed(decimals))+"";if((j=i.length)>3){j=j%3;}else{j=0;}
km=(j?i.substr(0,j)+thousands_sep:"");kw=i.substr(j).replace(/(\d{3})(?=\d)/g,"$1"+thousands_sep);kd=(decimals?dec_point+Math.abs(number-i).toFixed(decimals).replace(/-/,0).slice(2):"");if(number<0&&km==""&&kw=="0"&&kd.length){km="-"+km;}
return km+kw+kd;},byteForamt:function(size,precision){return this.byteFormat(size,precision);},byteFormat:function(size,precision,rightPad){precision=(precision==undefined)?2:precision;var i=Math.floor(Math.log(size)/Math.log(1024));return(size/Math.pow(1024,i)).toFixed(precision)*1+(rightPad?" ":"")+['B','kB','MB','GB','TB'][i];},maskFormat:function(val,mask){var input=new Control(null,"INPUT",{"attrs":{"value":val},"visible":false});$(input.getNode()).mask(mask);return input.m_node.value;},nd:function(x,docum){if(docum==undefined){docum=window.document;}
return(x)?docum.getElementById(x):null;},isIE:function(){var browserSpecs=this.getBrowser();return(browserSpecs.name=='IE'||browserSpecs.name=='MSIE');},getIEVersion:function(){var browserSpecs=this.getBrowser();return browserSpecs.version;},getBrowser:function(){var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|yabrowser|trident(?=\/))\/?\s*(\d+)/i)||[];if(/trident/i.test(M[1])){tem=/\brv[ :]+(\d+)/g.exec(ua)||[];return{name:'IE',version:(tem[1]||'')};}
if(M[1]==='Chrome'){tem=ua.match(/\b(OPR|Edge)\/(\d+)/);if(tem!=null)return{name:tem[1].replace('OPR','Opera'),version:tem[2]};}
M=M[2]?[M[1],M[2]]:[navigator.appName,navigator.appVersion,'-?'];if((tem=ua.match(/version\/(\d+)/i))!=null)M.splice(1,1,tem[1]);return{name:M[0],version:M[1]};},createXHR:function(){var xhr;if(window.XMLHttpRequest){xhr=new XMLHttpRequest();}
else{xhr=new ActiveXObject("Microsoft.XMLHTTP");}
return xhr;},createCORS:function(){var xhr=new XMLHttpRequest();if("withCredentials"in xhr){}
else if(typeof XDomainRequest!="undefined"){xhr=new XDomainRequest();}
else{xhr=null;throw new Error("CORS is not supported by the browser");}
return xhr;},isEmpty:function(x,p){for(p in x)return!1;return!0;},isArray:function(o){if(Array.isArray){return Array.isArray(o);}
else{return(Object.prototype.toString.call(o)==='[object Array]');}},clone:function(obj){var F=function(){};F.prototype=obj;return new F();},uniqid:function(){var chars='0123456789abcdef'.split('');var uuid=[],rnd=Math.random,r;uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';uuid[14]='4';for(var i=0;i<36;i++){if(!uuid[i]){r=0|rnd()*16;uuid[i]=chars[(i==19)?(r&0x3)|0x8:r&0xf];}}
return uuid.join('');},array2json:function(arr){return JSON.stringify(arr);},json2obj:function(json_string){return(json_string)?JSON.parse(json_string):json_string;},serialize:function(o){if(typeof(o)==="string"){return o;}
else if(typeof(o)==="number"||typeof(o)==="boolean"){return o.toString();}
else if(typeof(o)==="object"&&DateHelper.isValidDate(o)){if(window["FieldDateTimeTZ"]){return(FieldDateTimeTZ({"value":o})).getValueXHR();}
else{return o;}}
else{return JSON.stringify(o);}},unserialize:function(json_string){return(json_string&&typeof(json_string)=="string"&&json_string.length&&(json_string.substring(0,1)=="{"||json_string.substring(0,1)=="["))?JSON.parse(json_string,function(key,val){if(val&&typeof val=="object"&&"descr"in val&&"keys"in val){if("dataType"in val&&window[val.dataType]){val=new window[val.dataType](val);}
else{val=new RefType(val);}}
return val;}):json_string;},findPosX:function(obj){var curleft=0;if(obj.offsetParent){while(1){curleft+=obj.offsetLeft;if(!obj.offsetParent){break;}
obj=obj.offsetParent;}}else if(obj.x){curleft+=obj.x;}
return curleft;},findPosY:function(obj){var curtop=0;if(obj.offsetParent){while(1){curtop+=obj.offsetTop;if(!obj.offsetParent){break;}
obj=obj.offsetParent;}}else if(obj.y){curtop+=obj.y;}
return curtop;},getDecimalSeparator:function(){var n=1.1;n=n.toLocaleString().substring(1,2);return n;},escapeDoubleQuotes:function(str){return str.replace(/\\([\s\S])|(")/g,"\\$1$2");},longString:function(funcWrapper){var funcString=funcWrapper.toString();var funcDefinitionRe=/^function\s*[a-zA-Z0-9_$]*\s*\(\s*\)\s*{\s*\/\*([\s\S]*)\*\/\s*}\s*$/g;var wantedString=funcString.replace(funcDefinitionRe,"$1").trim();return wantedString;},merge:function(o1,o2){for(var id in o2){o1[id]=o2[id];}},getClassName:function(o){return Object.prototype.toString.call(o).match(/^\[object\s(.*)\]$/)[1];},md5:function(s){return hex_md5(s);},dateInArray:function(needle,haystack){for(var i=0;i<haystack.length;i++){if(needle.getTime()===haystack[i].getTime()){return i;}}
return-1;},inArray:function(v,ar){var res;if(typeof(v)=="object"&&DateHelper.isValidDate(v)){res=this.dateInArray(v,ar);}
else{res=$.inArray(v,ar);}
return res;},var_export:function(o){var output="";if(typeof(o)=="object"){for(var property in o){output+=property+": "+o[property]+"; ";}}
else{output=(o)?o.toString():"<undefined>";}
return output;},log:function(msg){if(console&&console.log){console.log(CommonHelper.var_export(msg));}},include_js:function(fl){var h=document.getElementsByTagName("head")[0];if(DOMHelper.getElementsByAttr(fl,h,"src",true,"script").length)
return;var fileref=document.createElement("script");fileref.setAttribute("type","text/javascript");fileref.setAttribute("src",fl);alert("appending "+fl)
h.appendChild(fileref);console.dir(fileref)},functionName:function(func){var result=/^function\s+([\w\$]+)\s*\(/.exec(func.toString());return result?result[1]:undefined;},hash:function(str){var hash=0,i,chr;if(str.length===0)return hash;for(i=0;i<str.length;i++){chr=str.charCodeAt(i);hash=((hash<<5)-hash)+chr;hash|=0;}
return hash;},ID:function(){return'_'+Math.random().toString(36).substr(2,9);}} 
var DOMHelper={INVIS_CLASS:"hidden",elem:function(tagName,opts){var e=document.createElement(tagName);opts=opts||{};for(var i in opts){e.setAttribute(i,opts[i]);}
return(e);},setAttr:function(node,attrName,attrValue){if(node){node.setAttribute(attrName,attrValue);}},getAttr:function(node,name){if(node&&node.attributes){return node.getAttribute(name);}},delAttr:function(node,name){if(node){return node.removeAttribute(name);}},addAttr:function(node,name,val){this.setAttr(node,name,val);},delNode:function(node){if(node&&node.parentNode)
node.parentNode.removeChild(node);},delNodesOnClass:function(classVal){this.delNodesOnAttr("class",classVal)},delNodesOnAttr:function(attrName,attrVal){var body=document.getElementsByTagName("body")[0];var list=this.getElementsByAttr(attrVal,body,attrName);for(var i=0;i<list.length;i++){this.delNode(list[i]);}},delAllChildren:function(node){while(node&&node.firstChild){node.removeChild(node.firstChild);}},getElementsByAttr:function(classStr,node,attrName,uniq,tag){tag=tag||"*";var node=node||document;var list=node.getElementsByTagName(tag);var length=list.length;var classArray=classStr.split(/\s+/);var classes=classArray.length;var result=new Array();for(var i=0;i<length;i++){if(uniq&&result.length>0)break;for(var j=0;j<classes;j++){if(((attrName=='class')&&(list[i].className!=undefined&&typeof list[i].className=='string')&&(list[i].className.search('\\b'+classArray[j]+'\\b')!=-1))||((list[i].attributes!=undefined)&&(list[i].getAttribute(attrName)!=undefined)&&(list[i].getAttribute(attrName).search('\\b'+classArray[j]+'\\b')!=-1))){result.push(list[i]);break;}}}
return result;},swapClasses:function(node,new_class,old_class){if(node)node.className=node.className.replace(old_class,new_class);},addClass:function(node,classToAdd){var re=new RegExp("(^|\\s)"+classToAdd+"(\\s|$)","g");if(!node||re.test(node.className))return;node.className=(node.className+" "+classToAdd).replace(/\s+/g," ").replace(/(^ | $)/g,"");},delClass:function(node,classToRemove){if(!node||!node.className)return;var re=new RegExp("(^|\\s)"+classToRemove+"(\\s|$)","g");node.className=node.className.replace(re,"$1").replace(/\s+/g," ").replace(/(^ | $)/g,"");},hasClass:function(node,classToCheck){return(node)?(node.className&&new RegExp("(^|\\s)"+classToCheck+"(\\s|$)").test(node.className)):null;},getParentByTagName:function(node,tagName){var p=node.parentNode;if(p){var tn=tagName.toLowerCase();while(p&&p.nodeName.toLowerCase()!=tn){p=p.parentNode;}
return((p&&p.nodeName.toLowerCase()==tn)?p:null);}},getElementIndex:function(node){var i=0;while(node=node.previousSibling){if(node.nodeType===1){i++;}}
return i;},xmlDocFromString:function(txt){return $.parseXML(txt);},htmlDocFromString:function(txt){return $.parseHTML(txt);},setTagName:function(node,tag){var oHTML=node.outerHTML;var tempTag=document.createElement(tag);var tName={original:node.tagName.toUpperCase(),change:tag.toUpperCase()};if(tName.original==tName.change)return;oHTML=oHTML.replace(RegExp("(^\<"+tName.original+")|("+tName.original+"\>$)","gi"),function(x){return(x.toUpperCase().replace(tName.original,tName.change));});tempTag.innerHTML=oHTML;if(tempTag.firstChild)node.parentElement.replaceChild(tempTag.firstChild,node);},swapNodes:function(a,b){var aParent=a.parentNode;var bParent=b.parentNode;var aHolder=document.createElement("div");var bHolder=document.createElement("div");aParent.replaceChild(aHolder,a);bParent.replaceChild(bHolder,b);aParent.replaceChild(b,aHolder);bParent.replaceChild(a,bHolder);},setParent:function(el,newParent){newParent.appendChild(el);},inViewport:function(el,fullyInView){var pageTop=$(window).scrollTop();var pageBottom=pageTop+$(window).height();var elementTop=$(el).offset().top;var elementBottom=elementTop+$(el).height();if(fullyInView===true){return((pageTop<elementTop)&&(pageBottom>elementBottom));}else{return((elementTop<=pageBottom)&&(elementBottom>=pageTop));}},getViewportHeight:function(){if(window.innerHeight!=window.undefined)return window.innerHeight;if(document.compatMode=='CSS1Compat')return document.documentElement.clientHeight;if(document.body)return document.body.clientHeight;return window.undefined;},getViewportWidth:function(){var offset=17;var width=null;if(window.innerWidth!=window.undefined)return window.innerWidth;if(document.compatMode=='CSS1Compat')return document.documentElement.clientWidth;if(document.body)return document.body.clientWidth;},getOffset:function(elem){if(elem.getBoundingClientRect){return this.getOffsetRect(elem);}
else{return this.getOffsetSum(elem);}},getOffsetRect:function(elem){var box=elem.getBoundingClientRect();var body=document.body;var docElem=document.documentElement;var scrollTop=window.pageYOffset||docElem.scrollTop||body.scrollTop;var scrollLeft=window.pageXOffset||docElem.scrollLeft||body.scrollLeft;var clientTop=docElem.clientTop||body.clientTop||0;var clientLeft=docElem.clientLeft||body.clientLeft||0;var top=box.top+scrollTop-clientTop;var left=box.left+scrollLeft-clientLeft;return{top:Math.round(top),left:Math.round(left)};},getOffsetSum:function(elem){var top=0,left=0;while(elem){top=top+parseInt(elem.offsetTop);left=left+parseInt(elem.offsetLeft);elem=elem.offsetParent;}
return{top:top,left:left};},parseTemplate:function(t,nId){var res=t.replace(/{{id}}/g,nId);var matches=res.match(/{{.*}}/g);if(matches){for(var i=0;i<matches.length;i++){res=res.split(matches[i]).join(eval(matches[i].substring(2,matches[i].length-2)));}}
return res;},firstChildElement:function(n,nodeType){if(typeof(n)=="string"){n=document.getElementById(n);}
if(n&&n.childNodes){nodeType=(nodeType==undefined)?1:nodeType;for(var i=0;i<n.childNodes.length;i++){if(n.childNodes[i].nodeType==nodeType){return n.childNodes[i];}}}},lastChildElement:function(n){if(typeof(n)=="string"){n=document.getElementById(n);}
if(n&&n.childNodes){for(var i=n.childNodes.length-1;i>=0;i--){if(n.childNodes[i].nodeType==1){return n.childNodes[i];}}}},lastText:function(n){return this.getText(n);},getText:function(n){if(typeof(n)=="string"){n=document.getElementById(n);}
if(n&&n.childNodes){for(var i=n.childNodes.length-1;i>=0;i--){if(n.childNodes[i].nodeType==3){return n.childNodes[i].nodeValue;}}}},setText:function(n,t){var v_set=false;var t_n;if(n&&n.childNodes){for(var i=n.childNodes.length-1;i>=0;i--){if(n.childNodes[i].nodeType==3){n.childNodes[i].nodeValue=t;v_set=true;t_n=n.childNodes[i];break;}}}
if(n&&!v_set){t_n=document.createTextNode(t);n.appendChild(t_n);}
return t_n;},insertAfter:function(elem,refElem){if(!refElem)return;var parent=refElem.parentNode;var next=refElem.nextSibling;if(next){return parent.insertBefore(elem,next);}else{return parent.appendChild(elem);}},show:function(n){if(typeof(n)=="string"){n=document.getElementById(n);}
this.delClass(n,this.INVIS_CLASS);},hide:function(n){if(typeof(n)=="string"){n=document.getElementById(n);}
this.addClass(n,this.INVIS_CLASS);},visible:function(n){if(typeof(n)=="string"){n=document.getElementById(n);}
return!this.hasClass(n,this.INVIS_CLASS);},toggle:function(n){if(typeof(n)=="string"){n=document.getElementById(n);}
if(this.visible(n)){this.hide(n);}
else{this.show(n);}},init:function(){Node=Node||{ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12};},previewImage:function(fileInput,imgNode){if(fileInput.files&&fileInput.files[0]){var reader=new FileReader();reader.onload=function(e){DOMHelper.addAttr(imgNode,"src",e.target.result);}
reader.readAsDataURL(fileInput.files[0]);}},tableToExcel:function(table,name,fileName){var uri='data:application/vnd.ms-excel;base64,',template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',base64=function(s){return window.btoa(unescape(encodeURIComponent(s)))},format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})},downloadURI=function(uri,name){var link=document.createElement("a");link.download=name;link.href=uri;link.click();}
if(!table.nodeType)table=document.getElementById(table);var ctx={worksheet:name||'Worksheet',table:table.innerHTML};var resuri=uri+base64(format(template,ctx));downloadURI(resuri,fileName);}} 
var DateHelper={DEF_FORMAT:"Y-m-dTH:i:s",time:function(){return new Date();},strtotime:function(dateStr){if(typeof(dateStr)==="object"&&this.isValidDate(dateStr)){return dateStr;}
else if(!dateStr||!dateStr.length){return;}
var parsed=Date.parse(dateStr);if(isNaN(parsed)){var parts=dateStr.match(/^(\d{4})[\.|\\/|-](\d{2})[\.|\\/|-](\d{2})[T|\s](\d{2})\:(\d{2})\:?(\d{0,2})\.?(\d{0,6})([+-])(\d{2})\:?(\d{2})?$/);if(parts){if(parts[5]==undefined||parts[5]=="")parts[5]="00";if(parts[6]==undefined||parts[6]=="")parts[6]="00";if(parts[7]==undefined||parts[7]=="")parts[7]="0";if(parts[10]==undefined)parts[10]="00";parsed=Date.parse(parts[1]+"-"+parts[2]+"-"+parts[3]+"T"+parts[4]+":"+parts[5]+":"+parts[6]+"."+parts[7]+parts[8]+parts[9]+":"+parts[10]);}
else{var parts=dateStr.split(/\D+/);for(i=0;i<parts.length;i++){if(parts[i]==undefined)parts[i]="00";}
if(parts.length<7)parts[6]="0000";parsed=Date.parse(parts[0]+"-"+parts[1]+"-"+parts[2]+"T"+parts[3]+":"+parts[4]+":"+parts[5]+"."+parts[6]);}}
return new Date(parsed);},getTimeZoneOffsetStr:function(){if(!this.m_timeZoneOffsetStr){var h_offset=-(new Date()).getTimezoneOffset()/60;var h_offset_h=Math.floor(h_offset);function to_str(a){return((a.toString().length==1)?"0":"")+a.toString();}
this.m_timeZoneOffsetStr=((h_offset_h<0)?"-":"+")+to_str(Math.abs(h_offset_h))+":"+to_str(Math.abs((h_offset-h_offset_h)*60));}
return this.m_timeZoneOffsetStr;},userStrToDate:function(dateStr){var SHORT_YEAR_LEN=8;var FULL_YEAR_LEN=10;var time=new Array(0,0,0);var date=new Array(0,0,0);var time_part='',date_part='';var TIME_DELIM=':';var DATE_DELIM='.';var PARTS_DELIM=' ';var NEXT_MIL_BOUND=40;var str_replace_delim=function(str,delim_ar,new_delim){if(str&&str.length){for(var i=0;i<delim_ar.length;i++){while(str.search(delim_ar[i])>=00){str=str.replace(delim_ar[i],new_delim);}}}
return str;};var date_str_copy=str_replace_delim(dateStr,new Array(/T/),PARTS_DELIM);var separ=date_str_copy.indexOf(PARTS_DELIM);if(separ>=0){date_part=date_str_copy.slice(0,separ);time_part=date_str_copy.substr(separ+1);}
else{if(date_str_copy.indexOf(TIME_DELIM)==-1){date_part=date_str_copy;}
else{time_part=date_str_copy;}}
date_part=str_replace_delim(date_part,new Array(/\//,/-/,/:/),DATE_DELIM);time_part=str_replace_delim(time_part,new Array(/ /,/-/,/\//),TIME_DELIM);if(date_part.length>0){date=date_part.split(DATE_DELIM);}
if(time_part.length>0){time=time_part.split(TIME_DELIM);}
if(date.length&&date[0].length==4){var y=date[0];date[0]=date[2];date[2]=y;}
else if(date.length>=3&&date[2].length==2){date[2]=parseInt(date[2],10);date[2]+=(date[2]<=NEXT_MIL_BOUND)?2000:1900;}
if(time[2]==undefined){time[2]=0;}
date[1]=(date[1]==0)?0:date[1]-1;return(new Date(date[2],date[1],date[0],time[0],time[1],time[2]));},format:function(dt,fs,localeId){var add_zero=function(arg){var s=arg.toString();return((s.length<2)?"0":"")+s;};if(!dt||!dt.getDate){return"";}
if(!fs){fs=this.DEF_FORMAT;}
var s;s=fs.replace(/d/,add_zero(dt.getDate()));s=s.replace(/j/,dt.getDate());s=s.replace(/FF/,DateHelper.MON_LIST[dt.getMonth()]);s=s.replace(/F/,DateHelper.MON_DATE_LIST[dt.getMonth()]);s=s.replace(/l/,DateHelper.WEEK_LIST[dt.getDay()]);s=s.replace(/m/,add_zero(dt.getMonth()+1));s=s.replace(/n/,dt.getMonth()+1);s=s.replace(/Y/,dt.getFullYear());s=s.replace(/y/,dt.getFullYear()-2000);s=s.replace(/H/,add_zero(dt.getHours()));s=s.replace(/i/,add_zero(dt.getMinutes()));s=s.replace(/s/,add_zero(dt.getSeconds()));s=s.replace(/u/,add_zero(dt.getMilliseconds()));return s;},timeToMS:function(timeStr){if(timeStr==undefined||!timeStr.split){return 0;}
var h,m;var time_ar=timeStr.split(":");var h=0;var m=0;var s=0;var ms=0;if(time_ar.length>=1){h=parseInt(time_ar[0][0],10)*10+
parseInt(time_ar[0][1],10);h=(isNaN(h)?0:h);}
if(time_ar.length>=2){m=parseInt(time_ar[1][0],10)*10+
parseInt(time_ar[1][1],10);m=(isNaN(m)?0:m);}
if(time_ar.length>=3){s=parseInt(time_ar[2][0],10)*10+
parseInt(time_ar[2][1],10);s=(isNaN(s)?0:s);}
return(h*60*60*1000+m*60*1000+s*1000+ms);},dateEnd:function(dt){if(!dt)dt=this.time();return new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),23,59,59,999);},dateStart:function(dt){if(!dt)dt=this.time();return new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),0,0,0,0);},weekStart:function(dt){if(!dt)dt=this.time();var dow=dt.getDay();var dif=dow-1;if(dif<0)dif=6;return(new Date(dt.getTime()-dif*24*60*60*1000));},weekEnd:function(dt){return new Date(this.weekStart(dt).getTime()+6*24*60*60*1000);},monthStart:function(dt){if(!dt)dt=this.time();return(new Date(dt.getFullYear(),dt.getMonth(),1));},monthEnd:function(dt){if(!dt)dt=this.time();return(new Date(dt.getFullYear(),dt.getMonth()+1,0));},daysInMonth:function(dt){return new Date(dt.getFullYear(),dt.getMonth()+1,0).getDate();},quarterStart:function(dt){if(!dt)dt=this.time();var m=dt.getMonth();if(m==1||m==2){m=0;}
else if(m==4||m==5){m=3;}
else if(m==7||m==8){m=6;}
else if(m==10||m==11){m=9;};return(new Date(dt.getFullYear(),m,1));},quarterEnd:function(dt){if(!dt)dt=this.time();var m=dt.getMonth();if(m==0||m==1){m=2;}
else if(m==3||m==4){m=5;}
else if(m==6||m==7){m=8;}
else if(m==9||m==10){m=11;};return this.monthEnd(new Date(dt.getFullYear(),m,1));},yearStart:function(dt){if(!dt)dt=this.time();return new Date(dt.getFullYear(),0,1);},yearEnd:function(dt){if(!dt)dt=this.time();return(new Date(dt.getFullYear(),12,0));},addBusinessDays:function(d,n){d=new Date(d.getTime());var day=d.getDay();d.setDate(d.getDate()+n+((day===6)?2:(+!day))+(Math.floor((n-1+(day%6||1))/5)*2));return d;},isValidDate:function(d){return d instanceof Date&&!isNaN(d);},isLeapYear:function(d){var year=(typeof(d)=="object")?d.getFullYear():d;return year%400===0||(year%100!==0&&year%4===0);},daysOfAYear:function(d){return this.isLeapYear(d)?366:365;},formatInterval(v){}} 
var EventHelper={add:function(obj,evType,fn,capture){if(!fn)return;if(typeof obj=='string'){obj=$(obj);}
if(CommonHelper.isIE()){$(obj).on(evType,fn);}
else{if(obj&&obj.addEventListener){obj.addEventListener(evType,fn,capture);return true;}else if(obj&&obj.attachEvent){var r=obj.attachEvent("on"+evType,fn);return r;}else{return false;}}},del:function(obj,evType,fn,useCapture){if(CommonHelper.isIE()){$(obj).off(evType,fn);}
else{if(obj&&obj.removeEventListener){obj.removeEventListener(evType,fn,useCapture);return true;}else if(obj&&obj.detachEvent){var r=obj.detachEvent("on"+evType,fn);return r;}else{throw new Error(this.DEL_ERR);}}},fixMouseEvent:function(e){e=e||window.event;if(e.target===undefined){e.target=e.srcElement;}
if(e.pageX==null&&e.clientX!=null){var html=document.documentElement;var body=document.body;e.pageX=e.clientX+(html&&html.scrollLeft||body&&body.scrollLeft||0)-(html.clientLeft||0);e.pageY=e.clientY+(html&&html.scrollTop||body&&body.scrollTop||0)-(html.clientTop||0);}
if(!e.which&&e.button){e.which=e.button&1?1:(e.button&2?3:(e.button&4?2:0));}
return(e);},fixKeyEvent:function(e){e=e||window.event;if(e.target===undefined){e.target=e.srcElement;}
if(e.which==null&&e.keyCode>=32){e.char=String.fromCharCode(event.keyCode);}
else if(e.which!=0&&e.charCode!=0&&e.which>=32){e.char=String.fromCharCode(e.which);}
return(e);},fixWheelEvent:function(e){e.delta=e.deltaY||e.detail||e.wheelDelta;return(e);},getWheelEventName:function(){var res;if("onwheel"in document){res="wheel";}else if("onmousewheel"in document){res="mousewheel";}else{res="MozMousePixelScroll";}
return(res);},addWheelEvent:function(obj,fn,capture){this.add(obj,this.getWheelEventName(),fn,capture);},delWheelEvent:function(obj,fn,capture){this.del(obj,this.getWheelEventName(),fn,capture);},stopPropagation:function(e){if(e.preventDefault){e.preventDefault();}
else if(e.stopPropagation){e.stopPropagation();}
else{e.cancelBubble=true;}
return false;},fireEvent:function(element,eventStr){if("createEvent"in document){var evt=document.createEvent("HTMLEvents");evt.initEvent(eventStr,false,true);element.dispatchEvent(evt);}
else{element.fireEvent("on"+eventStr);}}}; 
function FatalException(options){this.m_code=options.code;this.m_message=options["message"];this.m_cmdOk=options.cmdOk;this.m_templateOptions=options.templateOptions;this.m_viewAddElement=options.viewAddElement;}
FatalException.prototype.TEMPLATE_ID="FatalException";FatalException.prototype.show=function(){if(CommonHelper.nd("ex_"+this.m_code+":form"))return;var p=window.location.href.indexOf("?");var redir;if(p>=0){redir=CommonHelper.serialize({"ref":window.location.href.substr(p+1)});}
var opts=this.m_templateOptions||{};if(this.m_code){opts.code=this.m_code;}
if(this.m_message){opts["message"]=this.m_message;}
opts.url=window.getApp().getServVar("basePath")+(redir?"?redir="+redir:"");var view_opts={"template":window.getApp().getTemplate(this.TEMPLATE_ID),"templateOptions":opts};var self=this;if(this.m_viewAddElement){view_opts.addElement=function(){self.m_viewAddElement.call(this);}}
this.m_view=new ControlContainer("ex_"+this.m_code+":view:body:view","TEMPLATE",view_opts);var self=this;this.m_form=new WindowFormModalBS("ex_"+this.m_code+":form",{"cmdCancel":false,"cmdOk":this.m_cmdOk,"content":this.m_view,"contentHead":this.HEADER,"onClickOk":!this.m_cmdOk?null:function(){self.m_form.close();}});this.m_form.open();} 
function DbException(options){options.cmdOk=true;DbException.superclass.constructor.call(this,options);}
extend(DbException,FatalException);DbException.prototype.TEMPLATE_ID="DbException"; 
function VersException(){options={};options.cmdOk=false;options.cmdCancel=false;var self=this;options.viewAddElement=function(){var delay=window.getApp().getUpdateInstPostponeDelay();this.addElement(new ButtonCmd("versException:postpone",{"caption":CommonHelper.format(self.CAP_POSTPONE,[delay/1000/60])+" ","onClick":function(){window.getApp().setUpdateInstPostponed(true,delay);self.m_form.close();window.showTempNote(self.NOTE,null,self.NOTE_DISAPPEAR);},"glyph":"glyphicon-time","title":CommonHelper.format(self.TITLE_POSTPONE,[delay/1000/60])}));this.addElement(new ButtonCmd("versException:reload",{"caption":self.CAP_RELOAD+" ","onClick":function(){document.location.reload(true);},"glyph":"glyphicon-ok","title":self.TITLE_RELOAD}))}
VersException.superclass.constructor.call(this,options);}
extend(VersException,FatalException);VersException.prototype.TEMPLATE_ID="VersException";VersException.prototype.NOTE_DISAPPEAR=4000; 
function ConstantManager(options){options=options||{};this.m_values=options.values||{};if(options.XMLString){this.fillFromXML(options.XMLString);}}
ConstantManager.prototype.m_values;ConstantManager.prototype.fillFromXML=function(xml){var m=new ModelXML("ConstantValueList_Model",{"data":xml,"fields":{"id":new FieldString(),"val":new FieldString(),"val_type":new FieldString()}});while(m.getNextRow()){var v_t=m.getFieldValue("val_type");var v=m.getFieldValue("val");var v_class;var v_id=m.getFieldValue("id");if(v_t=="Int"){v_class=FieldInt;}
else if(v_t=="Float"){v_class=FieldFloat;}
else if(v_t=="DateTime"){v_class=FieldDateTime;}
else if(v_t=="Date"){v_class=FieldDate;}
else if(v_t=="Bool"){v_class=FieldBool;}
else if(v_t=="JSON"||v_t=="JSONB"){v_class=FieldJSON;}
else{v_class=FieldString;}
this.m_values[v_id]=new v_class(v_id,{"value":v});}}
ConstantManager.prototype.get=function(constants){var not_found="";var not_found_ar=[];var QUERY_SEP=",";for(var id in constants){if(this.m_values[id]){constants[id]=this.m_values[id];}
else{not_found+=(not_found=="")?"":QUERY_SEP;not_found+=id;not_found_ar.push(id);}}
if(not_found!=""){var self=this;var pm=(new Constant_Controller()).getPublicMethod("get_values");pm.setFieldValue("id_list",not_found);pm.run({"async":false,"ok":function(resp){self.fillFromXML(resp.getModelData("ConstantValueList_Model"));for(var i=0;i<not_found_ar.length;i++){constants[not_found_ar[i]]=self.m_values[not_found_ar[i]];}},"fail":function(resp,errCode,errStr){throw Error(errStr);}});}}
ConstantManager.prototype.set=function(id,val,callBack){var self=this;var pm=(new Constant_Controller()).getPublicMethod("set_value");pm.setFieldValue("id",id);pm.setFieldValue("val",CommonHelper.serialize(val));pm.run({"ok":function(resp){if(self.m_values[id]){self.m_values[id]=val;}
if(callBack){callBack();}}});}
ConstantManager.prototype.onEventSrvMessage=function(json){if(json.params&&json.params.id&&json.params.val){this.m_values[json.params.id]=CommonHelper.unserialize(json.params.val);}} 
var CookieManager={get:function(name){var matches=document.cookie.match(new RegExp("(?:^|; )"+name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,'\\$1')+"=([^;]*)"));return matches?decodeURIComponent(matches[1]):undefined;},set:function(name,value,options){CommonHelper.merge(options,{"path":"/"});if(options.expires&&options.expires.toUTCString){options.expires=options.expires.toUTCString();}
var updated_cookie=encodeURIComponent(name)+"="+encodeURIComponent(value);for(var option_key in options){updated_cookie+="; "+option_key;var option_value=options[option_key];if(option_value!==true){updated_cookie+="="+option_value;}}
document.cookie=updated_cookie;},del:function(name){this.set(name,"",{"max-age":-1});}} 
function ServConnector(options){options=options||{};this.setHost(options.host||"");this.setScript(options.script||this.DEF_SCRIPT);this.setCORS((options.CORS!==undefined)?options.CORS:false);if(options.token){this.m_accessToken=options.token;if(navigator.cookieEnabled&&CookieManager.get("token")!=this.m_accessToken){CookieManager.set("token",this.m_accessToken,{"expires":options.tokenExpires});}
if(options.tokenr){this.m_refreshToken=options.tokenr;}}
this.m_xhrStates={UNSENT:0,OPENED:1,HEADERS_RECEIVED:2,LOADING:3,DONE:4};}
ServConnector.prototype.DEF_SCRIPT="";ServConnector.prototype.ERR_AUTH=100;ServConnector.prototype.ERR_AUTH_NOT_LOGGED=102;ServConnector.prototype.ERR_AUTH_EXP=101;ServConnector.prototype.ERR_SQL_SERVER=105;ServConnector.prototype.ERR_VERSION=107;ServConnector.prototype.ENCTYPES={ENCODED:"application/x-www-form-urlencoded",MULTIPART:"multipart/form-data",TEXT:"text-plain"};ServConnector.prototype.m_xhrStates;ServConnector.prototype.m_CORS;ServConnector.prototype.m_host;ServConnector.prototype.m_script;ServConnector.prototype.m_port;ServConnector.prototype.m_quit;ServConnector.prototype.m_accessToken;ServConnector.prototype.m_refreshToken;ServConnector.prototype.getCORS=function(){return this.m_CORS;}
ServConnector.prototype.setCORS=function(v){this.m_CORS=v;}
ServConnector.prototype.getHost=function(){return this.m_host;}
ServConnector.prototype.setHost=function(host){this.m_host=host;}
ServConnector.prototype.getScript=function(){return this.m_script;}
ServConnector.prototype.setScript=function(script){this.m_script=script;}
ServConnector.prototype.queryParamsAsStr=function(params,encode){var param_str="";for(var par_id in params){param_str+=(param_str=="")?"":"&";param_str+=par_id+"=";param_str+=(encode)?encodeURIComponent(params[par_id]):params[par_id];}
return param_str;}
ServConnector.prototype.refreshToken=function(){var self=this;this.execRequest(true,{"c":"User_Controller","f":"login_refresh","token":this.m_accessToken,"refresh_token":this.m_refreshToken,"v":"ViewXML"},false,function(ref_e_n,ref_e_s,ref_resp){if(!ref_e_n){var m=ref_resp.getModel("Auth");if(m.getNextRow()){self.m_accessToken=m.getFieldValue("access_token");self.m_refreshToken=m.getFieldValue("refresh_token");if(navigator.cookieEnabled){CookieManager.set("token",self.m_accessToken,{"expires":DateHelper.strtotime(m.getFieldValue("tokenExpires"))});}}}});}
ServConnector.prototype.sendRequest=function(isGet,params,async,onReturn,retContentType,enctype){this.m_requestId=CommonHelper.uniqid();async=(async==undefined)?true:async;if(this.m_accessToken&&!navigator.cookieEnabled){params["token"]=this.m_accessToken;}
if(this.m_accessToken&&this.m_refreshToken&&navigator.cookieEnabled&&CookieManager.get("token")==undefined){this.refreshToken();}
return this.execRequest(isGet,params,async,onReturn,retContentType,enctype);}
ServConnector.prototype.execRequest=function(isGet,params,async,onReturn,retContentType,enctype,URLResource){var url=this.getHost()+(URLResource?URLResource:this.getScript());var send_param;var xhr=(this.m_CORS===true)?CommonHelper.createCORS():CommonHelper.createXHR();var self=this;var stat0_tries=10;var stat0_delay=100;xhr.onreadystatechange=function(){if(xhr.readyState==self.m_xhrStates.HEADERS_RECEIVED){}
else if(xhr.readyState==self.m_xhrStates.DONE){var error_n;var error_s;var resp;if(xhr.status==0){stat0_tries--;if(stat0_tries){setTimeout(function(){xhr.open(isGet?"GET":"POST",url,(self.getCORS())?true:async);xhr.send(send_param);},stat0_delay);stat0_delay=stat0_delay*2;return;}
error_s=self.ER_STATUS0;error_n=-1;}
else{error_n=(xhr.status>=200&&xhr.status<300)?0:xhr.status;if(error_n!=0){error_s=xhr.statusText;}
var vers_error=false;try{var tr=xhr.getResponseHeader("content-type");if(retContentType=="arraybuffer"||retContentType=="blob"){resp=xhr.response;}
else if(tr&&tr.indexOf("xml")>=0){var resp_model_id;resp=new ResponseXML(xhr.responseXML);if(resp.modelExists("ModelServResponse")){resp_model_id="ModelServResponse";}else if(resp.modelExists("Response")){resp_model_id="Response";}
if(resp_model_id){var m=new ModelServRespXML(resp.getModelData(resp_model_id));error_n=error_n?error_n:m.result;error_s=m.descr;vers_error=(!error_n&&m.app_version&&m.app_version!=window.getApp().getServVar("version")&&!window.getApp().getUpdateInstPostponed());}else{resp=xhr.responseXML;}}
else if(tr&&tr.indexOf("json")>=0){resp_o=CommonHelper.unserialize(xhr.responseText);if(resp_o.models){resp=new ResponseJSON(resp_o);var resp_model_id=window.getApp().SERV_RESPONSE_MODEL_ID;if(resp.modelExists("ModelServResponse")){var m=new ModelServRespJSON(resp.getModelData(resp_model_id));error_n=error_n?error_n:m.result;error_s=m.descr;vers_error=(!error_n&&m.app_version&&m.app_version!=window.getApp().getServVar("version")&&!window.getApp().getUpdateInstPostponed());}}
else{resp=resp_o;}}
else{if(retContentType!=undefined&&tr&&tr.indexOf(retContentType)<0){error_n=error_n?error_n:-1;error_s=xhr.responseText;}
else{resp=xhr.responseText;}}}
catch(e){error_n=error_n?error_n:-1;error_s=e.message;}}
if(onReturn){onReturn.call(self,error_n,error_s,resp,self.m_requestId,vers_error);}
if(error_n==self.ERR_AUTH_NOT_LOGGED||(error_n==self.ERR_AUTH_EXP&&!self.m_refreshToken)){throw new FatalException({"code":error_n,"message":error_s});}
else if(error_n==self.ERR_AUTH_EXP){self.refreshToken();self.execRequest(isGet,params,async,onReturn,retContentType,enctype);}
else if(error_n==self.ERR_SQL_SERVER){throw new DbException({"code":error_n,"message":error_s});}
else if(vers_error){throw new VersException();}}}
if(isGet){if(params&&!CommonHelper.isEmpty(params)){url=url+"?"+this.queryParamsAsStr(params,true);}
send_param=null;}
xhr.open(isGet?"GET":"POST",url,(this.getCORS())?true:async);if(!isGet){enctype=enctype||this.ENCTYPES.ENCODED;if(enctype==this.ENCTYPES.ENCODED){xhr.setRequestHeader("Content-Type",enctype);send_param=this.queryParamsAsStr(params,true);}
if(enctype==this.ENCTYPES.MULTIPART){if(typeof FormData!=='undefined'){send_param=new FormData();for(var par_id in params){if(params[par_id]&&typeof params[par_id]=="object"){for(var fi=0;fi<params[par_id].length;fi++){send_param.append(par_id+"[]",params[par_id][fi]);}}
else{send_param.append(par_id,params[par_id]);}}}
else{var boundary=String(Math.random()).slice(2);var boundaryMiddle='--'+boundary+'\r\n';var boundaryLast='--'+boundary+'--\r\n';send_param=['\r\n'];for(var key in params){send_param.push('Content-Disposition: form-data; name="'+key+'"\r\n\r\n'+params[key]+'\r\n');}
send_param=send_param.join(boundaryMiddle)+boundaryLast;xhr.setRequestHeader('Content-Type','multipart/form-data; boundary='+boundary);}}}
if(!this.getCORS&&xhr.setRequestHeader){xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");}
if(async&&(retContentType=="arraybuffer"||retContentType=="blob")){xhr.responseType=retContentType;}
xhr.send(send_param);return this.m_requestId;}
ServConnector.prototype.sendPost=function(params,async,onReturn,retContentType,enctype){if(this.m_quit)return;return this.sendRequest(false,params,async,onReturn,retContentType,enctype);}
ServConnector.prototype.sendGet=function(params,async,onReturn,retContentType){if(this.m_quit)return;return this.sendRequest(true,params,async,onReturn,retContentType);}
ServConnector.prototype.openHref=function(params,winParams){if(this.m_quit)return;window.open(this.getHost()+this.getScript()+"?"+this.queryParamsAsStr(params,true),"_blank",winParams?winParams:"location=0,menubar=0,status=0,titlebar=0");}
ServConnector.prototype.quit=function(){this.m_quit=true;if(this.m_accessToken&&navigator.cookieEnabled){CookieManager.del("token");}}
ServConnector.prototype.getAccessToken=function(){return this.m_accessToken;}
ServConnector.prototype.getPublicKey=function(){var p=this.m_accessToken.indexOf(":");if(p>=0){return this.m_accessToken.substring(0,p);}} 
function AppSrv(options){options=options||{};window.WebSocket=window.WebSocket||window.MozWebSocket;if(!window.WebSocket){throw Error(this.NOT_SUPPOERTED);}
this.m_host=options.host||this.DEF_HOST;this.m_port=options.port||this.DEF_PORT;this.m_appId=options.appId;this.m_token=options.token;this.m_tokenExpires=options.tokenExpires;if(Worker in window){var self=this;var myWorker=new Worker("DetectWakeup.js");myWorker.onmessage=function(ev){if(ev&&ev.data==='wakeup'){self.notifyOnConnEvent("onWakeup");}}}}
AppSrv.prototype.DEF_HOST="127.0.0.1";AppSrv.prototype.DEF_PORT="1337";AppSrv.prototype.METH_STATUS={"end":0,"progress":1}
AppSrv.prototype.m_connection;AppSrv.prototype.m_host;AppSrv.prototype.m_port;AppSrv.prototype.m_subscribeEvents;AppSrv.prototype.m_subscriptions;AppSrv.prototype.getState=function(){return this.m_connection.readyState;}
AppSrv.prototype.connActive=function(){return(this.m_connection&&this.m_connection.readyState==WebSocket.OPEN);}
AppSrv.prototype.connect=function(){this.m_lastConnErrTime=undefined;this.m_doNotReconnect=false;this.do_connect();}
AppSrv.prototype.disconnect=function(doNotReconnect){if(this.connActive()){this.m_doNotReconnect=doNotReconnect;this.m_connection.close();}}
AppSrv.prototype.notifyOnConnEvent=function(conEvnt,par){console.log("AppSrv.prototype.notifyOnConnEvent evnt="+conEvnt)
var called={};for(var ev_id in this.m_subscriptions){var groups=this.m_subscriptions[ev_id].groups;for(gr_id in groups){if(!called[gr_id]&&groups[gr_id][conEvnt]&&typeof(groups[gr_id][conEvnt])==="function"){console.log("Calling m_subscriptions event ")
groups[gr_id][conEvnt].call(this,par);called[gr_id]=true;}}}
if(this.m_subscribeEvents&&conEvnt=="onClose"){for(var ev_id in this.m_subscribeEvents){if(this.m_subscribeEvents[ev_id]&&this.m_subscribeEvents[ev_id][conEvnt]&&typeof(this.m_subscribeEvents[ev_id][conEvnt])==="function"){console.log("Calling m_subscribeEvents event ")
this.m_subscribeEvents[ev_id][conEvnt].call(this,par);}}}}
AppSrv.prototype.do_connect=function(){console.log("AppSrv.prototype.do_connect")
if(this.m_connection&&(this.m_connection.readyState===WebSocket.OPEN||this.m_connection.readyState===WebSocket.CONNECTING)){return;}
var protocol=(location.protocol!=="https:")?"ws":"wss";var self=this;this.m_connection=new WebSocket(protocol+"://"+this.m_host+":"+this.m_port+"/"+this.m_appId+(this.m_token?"/"+this.m_token:""));this.m_connection.onopen=function(){console.log("this.m_connection.onopen")
self.onOpen();self.notifyOnConnEvent("onOpen");};this.m_connection.onerror=function(error){console.log("WSConn.onerror error=")
self.notifyOnConnEvent("onError",error);};this.m_connection.onmessage=function(message){self.onMessage(message);};this.m_connection.onclose=function(message){console.log("onclose message=")
self.notifyOnConnEvent("onClose",message);if(message.code!=undefined&&message.code>1000&&!self.m_doNotReconnect){self.do_connect();}};}
AppSrv.prototype.subscribe=function(srvEvents,id){if(!id){id=CommonHelper.ID();}
if(this.m_connection.readyState!==WebSocket.OPEN){this.m_subscribeEvents=this.m_subscribeEvents||{};this.m_subscribeEvents[id]=srvEvents;console.log("subscribe postponed")
return id;}
console.log("AppSrv.prototype.subscribe")
var events_srv=[];this.m_subscriptions=this.m_subscriptions||{};for(var i=0;i<srvEvents.events.length;i++){if(!srvEvents.events[i]){continue;}
if(!this.m_subscriptions[srvEvents.events[i].id]){events_srv.push({"id":srvEvents.events[i].id});this.m_subscriptions[srvEvents.events[i].id]={"groups":{},"cnt":0};}
this.m_subscriptions[srvEvents.events[i].id].groups[id]=srvEvents;this.m_subscriptions[srvEvents.events[i].id].cnt++;}
if(events_srv.length){console.log("Events:")
console.log(events_srv)
this.send("Event.subscribe",{"events":events_srv});if(srvEvents.onSubscribed&&typeof(srvEvents.onSubscribed)==="function"){console.log("Calling onSubscribed function")
srvEvents.onSubscribed.call(this);}}
return id;}
AppSrv.prototype.unsubscribe=function(id){console.log("AppSrv.prototype.unsubscribe")
if(this.m_subscribeEvents&&this.m_subscribeEvents[id]){this.m_subscribeEvents[id]=undefined;delete this.m_subscribeEvents[id];console.log("AppSrv.prototype.unsubscribe cleared postponed subscription")}else if(this.m_connection.readyState!==WebSocket.OPEN){this.m_unsubscribeEvents=this.m_unsubscribeEvents||[];this.m_unsubscribeEvents.push(id);console.log("unsubscribe postponed")
return;}
if(this.m_subscriptions){var events_srv=[];for(var ev_id in this.m_subscriptions){if(this.m_subscriptions[ev_id].groups[id]){this.m_subscriptions[ev_id].groups[id]=undefined;delete this.m_subscriptions[ev_id].groups[id];this.m_subscriptions[ev_id].cnt--;if(!this.m_subscriptions[ev_id].cnt){events_srv.push({"id":ev_id});this.m_subscriptions[ev_id]=undefined;delete this.m_subscriptions[ev_id];}}}
if(events_srv.length){this.send("Event.unsubscribe",{"events":events_srv});}}}
AppSrv.prototype.onOpen=function(){console.log("AppSrv.prototype.onOpen")
this.m_lastConnErrTime=undefined;if(this.m_subscriptions){console.log("Reregestering events!")
var groups={};var cnt=0;for(var ev_id in this.m_subscriptions){for(gr_id in this.m_subscriptions[ev_id].groups){groups[gr_id]=groups[gr_id]||{"events":[],"onEvent":this.m_subscriptions[ev_id].groups[gr_id].onEvent,"onOpen":this.m_subscriptions[ev_id].groups[gr_id].onOpen,"onClose":this.m_subscriptions[ev_id].groups[gr_id].onClose,"onError":this.m_subscriptions[ev_id].groups[gr_id].onError,"onSubscribed":this.m_subscriptions[ev_id].groups[gr_id].onSubscribed};groups[gr_id].events.push({"id":ev_id});}
cnt++;}
if(cnt){this.m_subscriptions={};for(var gr_id in groups){this.subscribe(groups[gr_id],gr_id);}}}
if(this.m_subscribeEvents){for(var ev_id in this.m_subscribeEvents){if(this.m_subscribeEvents[ev_id]){this.subscribe(this.m_subscribeEvents[ev_id],ev_id);this.m_subscribeEvents[ev_id]=undefined;}}
delete this.m_subscribeEvents;}
if(this.m_unsubscribeEvents){if(this.m_unsubscribeEvents[i]){for(var i=0;i<this.m_unsubscribeEvents.length;i++){this.unsubscribe(this.m_unsubscribeEvents[i]);this.m_unsubscribeEvents[i]=undefined;}}
delete this.m_unsubscribeEvents;}}
AppSrv.prototype.send=function(func,argv){var struct={"func":func}
if(argv){struct.argv=argv;}
this.m_connection.send(JSON.stringify(struct));}
AppSrv.prototype.onMessage=function(message){console.log("AppSrv.prototype.onMessage RawJson="+message.data)
var error_n,resp,vers_error;resp_o=CommonHelper.unserialize(message.data);if(resp_o.models){if(window["ResponseJSON"]){resp=new ResponseJSON(resp_o);var m=new ModelServRespJSON(resp.getModelData(window.getApp().SERV_RESPONSE_MODEL_ID));error_n=error_n?error_n:m.result;error_s=m.descr;var br_vers=window.getApp().getServVar("version");vers_error=(!error_n&&m.app_version&&m.app_version!=br_vers&&parseInt(m.app_version.replaceAll(".",""),10)>parseInt(br_vers.replaceAll(".",""),10));if(error_n==ServConnector.prototype.ERR_AUTH_NOT_LOGGED||error_n==ServConnector.prototype.ERR_AUTH||(error_n==ServConnector.prototype.ERR_AUTH_EXP&&!ServConnector.prototype.m_refreshToken)){window.getApp().initPage();throw new FatalException({"code":error_n,"message":error_s});}
else if(error_n==ServConnector.prototype.ERR_AUTH_EXP){}
else if(error_n==ServConnector.prototype.ERR_SQL_SERVER){throw new DbException({"code":error_n,"message":error_s});}
else if(vers_error){throw new VersException();}}
var ev_model_id=window.getApp().EVENT_MODEL_ID;if(resp_o.models[ev_model_id]&&resp_o.models[ev_model_id].rows&&resp_o.models[ev_model_id].rows.length&&resp_o.models[ev_model_id].rows[0].id){var ev_id=resp_o.models[ev_model_id].rows[0].id;var json={"eventId":ev_id,"params":resp_o.models[ev_model_id].rows[0].params};var sep=ev_id.indexOf(".");if(sep){json.controllerId=json.eventId.substr(0,sep);json.methodId=json.eventId.substr(sep+1);}
if(this.m_subscriptions[json.eventId]&&this.m_subscriptions[json.eventId].groups){for(gr_id in this.m_subscriptions[json.eventId].groups){if(this.m_subscriptions[json.eventId].groups[gr_id].onEvent&&typeof(this.m_subscriptions[json.eventId].groups[gr_id].onEvent)==="function"){this.m_subscriptions[json.eventId].groups[gr_id].onEvent(json);}}}}}}
AppSrv.prototype.runPublicMethod=function(func,argv,progressCallBack,callBack){var d=new Date();var q_id=func+"_"+d.getHours().String()+d.getMinutes().String()+d.getMilliseconds().String();this.m_subscriptions[q_id].groups["group"]=(function(self,queryId,progressCallBack,callBack){return function(json){if(!json.status||json.status==self.METH_STATUS.end){self.m_subscriptions[queryId]=undefined;if(callBack){callBack(errCode,errStr,resp,queryId)}}else if(json.status&&json.status==self.METH_STATUS.progress&&progressCallBack){progressCallBack(json);}}})(this,q_id,progressCallBack,callBack);argv["queryId"]=q_id;this.send(func,argv);} 
AppSrv.prototype.NOT_SUPPOERTED="Браузер не поддерживает работу WebSocket";AppSrv.prototype.MES_CONNECTING="Попытка соединения с сервером...";AppSrv.prototype.MES_CONNECTED="Соединение с сервером установлено";AppSrv.prototype.ER_NOT_CONNECTED="Ошибка соединения с сервером";AppSrv.prototype.ER_CON_FAIL="Невозможно установить соединение с сервером"; 
function Response(resp){this.m_models={};this.m_modelInstances={};this.setResponse(resp);}
Response.prototype.m_resp;Response.prototype.m_models;Response.prototype.m_modelInstances;Response.prototype.getInitResponse=function(){}
Response.prototype.setResponse=function(resp){this.m_resp=resp?resp:this.getInitResponse();}
Response.prototype.modelExists=function(id){return(this.m_models[id])?true:false;}
Response.prototype.setModelData=function(id,data){this.m_models[id]=data;}
Response.prototype.getModelData=function(id){if(!this.m_models[id]){throw new Error(CommonHelper.format(this.ERR_NO_MODEL,[id]));}
return this.m_modelInstances[id]?this.m_modelInstances[id].getData():this.m_models[id];}
Response.prototype.getModels=function(){return this.m_models;}
Response.prototype.getModel=function(id,modelOptions){if(this.modelExists(id)&&window[id]&&!this.m_modelInstances[id]){modelOptions=modelOptions||{};modelOptions.data=this.m_models[id];this.m_modelInstances[id]=new window[id](modelOptions);}
return this.m_modelInstances[id];} 
function ResponseXML(resp){ResponseXML.superclass.constructor.call(this,resp);}
extend(ResponseXML,Response);ResponseXML.prototype.TAG_ROOT="document";ResponseXML.prototype.TAG_MODEL="model";ResponseXML.prototype.getInitResponse=function(){return DOMHelper.xmlDocFromString("<"+this.TAG_ROOT+"></"+this.TAG_ROOT+">");}
ResponseXML.prototype.setModelData=function(id,node){this.m_resp.firstChild.appendChild(node);ResponseXML.superclass.setModelData.call(this,id,node);}
ResponseXML.prototype.setResponse=function(resp){ResponseXML.superclass.setResponse.call(this,resp);var models=this.m_resp.documentElement.getElementsByTagName(this.TAG_MODEL);for(var i=0;i<models.length;i++){if(models[i].parentNode==this.m_resp.documentElement){this.m_models[models[i].getAttribute("id")]=models[i];}}}
ResponseXML.prototype.getModel=function(id,modelOptions){if(this.modelExists(id)&&!this.m_modelInstances[id]){modelOptions=modelOptions||{};modelOptions.data=this.m_models[id];this.m_modelInstances[id]=(window[id]?new window[id](modelOptions):new ModelXML(id,modelOptions));}
return this.m_modelInstances[id];} 
function ResponseJSON(resp){ResponseJSON.superclass.constructor.call(this,resp);}
extend(ResponseJSON,Response);ResponseJSON.prototype.getInitResponse=function(){return{"models":[]};}
ResponseJSON.prototype.setResponse=function(resp){var o;if(typeof(resp)=="string"){o=CommonHelper.unserialize(resp);}
else{o=resp;}
ResponseJSON.superclass.setResponse.call(this,o);if(o)this.m_models=o.models;}
ResponseJSON.prototype.getModel=function(id,modelOptions){if(this.modelExists(id)&&!this.m_modelInstances[id]){modelOptions=modelOptions||{};modelOptions.data=this.m_models[id];this.m_modelInstances[id]=(window[id]?new window[id](modelOptions):new ModelJSON(id,modelOptions));}
return this.m_modelInstances[id];} 
function PublicMethod(id,options){this.setId(id);options=options||{};this.m_fields=options.fields||{};this.setController(options.controller);}
PublicMethod.prototype.m_id;PublicMethod.prototype.m_fields;PublicMethod.prototype.m_controller;PublicMethod.prototype.fieldExists=function(id){return(this.m_fields[id]!=undefined);}
PublicMethod.prototype.getId=function(){return this.m_id;}
PublicMethod.prototype.setId=function(id){this.m_id=id;}
PublicMethod.prototype.addField=function(field){this.m_fields[field.getId()]=field;}
PublicMethod.prototype.checkField=function(id){if(!this.fieldExists(id)){throw Error(CommonHelper.format(this.ER_NO_FIELD,Array(this.m_controller.getId(),this.getId(),id)));}
return true;}
PublicMethod.prototype.getField=function(id){this.checkField(id);return this.m_fields[id];}
PublicMethod.prototype.getFields=function(){return this.m_fields;}
PublicMethod.prototype.setFields=function(v){this.m_fields=v;}
PublicMethod.prototype.setFieldValue=function(id,value){this.checkField(id);this.m_fields[id].setValue(value);}
PublicMethod.prototype.getFieldValue=function(id){return this.getField(id).getValue();}
PublicMethod.prototype.resetFieldValue=function(id){this.checkField(id);this.m_fields[id].resetValue();}
PublicMethod.prototype.unsetFieldValue=function(id){this.checkField(id);this.m_fields[id].unsetValue();}
PublicMethod.prototype.getController=function(){return this.m_controller;}
PublicMethod.prototype.setController=function(c){this.m_controller=c;}
PublicMethod.prototype.run=function(options){} 
function PublicMethodServer(id,options){options=options||{};if(!options.controller){throw Error(CommonHelper.format(this.ER_NO_CONTROLLER,Array(id)));}
this.setRequestType(options.requestType);this.setAsync(options.async);this.setEncType(options.encType);PublicMethodServer.superclass.constructor.call(this,id,options);}
extend(PublicMethodServer,PublicMethod);PublicMethodServer.prototype.m_requestType;PublicMethodServer.prototype.m_sync;PublicMethodServer.prototype.m_encType;PublicMethodServer.prototype.getRequestType=function(){return this.m_requestType;}
PublicMethodServer.prototype.setRequestType=function(v){this.m_requestType=v;}
PublicMethodServer.prototype.getAsync=function(){return this.m_async;}
PublicMethodServer.prototype.setAsync=function(v){this.m_async=v;}
PublicMethodServer.prototype.getEncType=function(){return this.m_encType;}
PublicMethodServer.prototype.setEncType=function(v){this.m_encType=v;}
PublicMethodServer.prototype.download=function(viewId,ind,callBack){this.getController().download(this.getId(),viewId,ind,callBack);}
PublicMethodServer.prototype.openHref=function(viewId,winParams){this.getController().openHref(this.getId(),viewId,winParams);}
PublicMethodServer.prototype.run=function(options){return this.getController().run(this.getId(),options);} 
function Controller(options){this.m_publicMethods=options.publicMethods||{};this.setPublicMethodClass(options.publicMethodClass||PublicMethod);}
Controller.prototype.m_publicMethods;Controller.prototype.getId=function(){return this.constructor.toString().match(/function (\w*)/)[1];}
Controller.prototype.publicMethodExists=function(id){return(this.m_publicMethods[id]!=undefined);}
Controller.prototype.addPublicMethod=function(pm){this.m_publicMethods[pm.getId()]=pm;}
Controller.prototype.checkPublicMethod=function(id){if(!this.publicMethodExists(id)){throw new Error(CommonHelper.format(this.ER_NO_METHOD,[id,this.getId()]));}
return true;}
Controller.prototype.getPublicMethod=function(id){this.checkPublicMethod(id);return this.m_publicMethods[id];}
Controller.prototype.getPublicMethods=function(){return this.m_publicMethods;}
Controller.prototype.run=function(meth,options){this.getPublicMethod(meth).run(options);}
Controller.prototype.getPublicMethodClass=function(){return this.m_publicMethodClass;}
Controller.prototype.setPublicMethodClass=function(v){this.m_publicMethodClass=v;} 
function ControllerObj(options){options=options||{};this.setListModelClass(options.listModelClass);this.setObjModelClass(options.objModelClass);this.setWS(options.ws);ControllerObj.superclass.constructor.call(this,options);}
extend(ControllerObj,Controller);ControllerObj.prototype.METH_INSERT="insert";ControllerObj.prototype.METH_UPDATE="update";ControllerObj.prototype.METH_GET_OBJ="get_object";ControllerObj.prototype.METH_GET_LIST="get_list";ControllerObj.prototype.METH_DELETE="delete";ControllerObj.prototype.METH_COMPLETE="complete";ControllerObj.prototype.PARAM_COUNT="count";ControllerObj.prototype.PARAM_FROM="from";ControllerObj.prototype.PARAM_IC="ic";ControllerObj.prototype.PARAM_MID="mid";ControllerObj.prototype.PARAM_ORD_FIELDS="ord_fields";ControllerObj.prototype.PARAM_ORD_DIRECTS="ord_directs";ControllerObj.prototype.PARAM_FIELD_SEP_VAL="@";ControllerObj.prototype.PARAM_COND_FIELDS="cond_fields";ControllerObj.prototype.PARAM_COND_SGNS="cond_sgns";ControllerObj.prototype.PARAM_COND_VALS="cond_vals";ControllerObj.prototype.PARAM_COND_ICASE="cond_ic";ControllerObj.prototype.PARAM_SGN_EQUAL="e";ControllerObj.prototype.PARAM_SGN_LESS="l";ControllerObj.prototype.PARAM_SGN_GREATER="g";ControllerObj.prototype.PARAM_SGN_LESS_EQUAL="le";ControllerObj.prototype.PARAM_SGN_GREATER_EQUAL="ge";ControllerObj.prototype.PARAM_SGN_LIKE="lk";ControllerObj.prototype.PARAM_SGN_NOT_EQUAL="ne";ControllerObj.prototype.PARAM_ORD_ASC="a";ControllerObj.prototype.PARAM_ORD_DESC="d";ControllerObj.prototype.PARAM_GRP_FIELDS="grp_fields";ControllerObj.prototype.PARAM_AGG_FIELDS="agg_fields";ControllerObj.prototype.PARAM_AGG_TYPES="agg_types";ControllerObj.prototype.PARAM_RET_ID="ret_id";ControllerObj.prototype.PARAM_FIELD_SEP="field_sep";ControllerObj.prototype.m_listModelClass;ControllerObj.prototype.m_objModelClass;ControllerObj.prototype.m_ws;ControllerObj.prototype.addDefParams=function(){}
ControllerObj.prototype.addInsert=function(){return this.addMethod(this.METH_INSERT,"post");}
ControllerObj.prototype.getInsert=function(){return this.getPublicMethod(this.METH_INSERT);}
ControllerObj.prototype.addUpdate=function(){return this.addMethod(this.METH_UPDATE,"post");}
ControllerObj.prototype.getUpdate=function(){return this.getPublicMethod(this.METH_UPDATE);}
ControllerObj.prototype.addDelete=function(){return this.addMethod(this.METH_DELETE);}
ControllerObj.prototype.getDelete=function(){return this.getPublicMethod(this.METH_DELETE);}
ControllerObj.prototype.addGetObject=function(){return this.addMethod(this.METH_GET_OBJ);}
ControllerObj.prototype.getGetObject=function(){return this.getPublicMethod(this.METH_GET_OBJ);}
ControllerObj.prototype.addGetList=function(){var pm=this.addMethod(this.METH_GET_LIST);pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_FIELD_SEP));return pm;}
ControllerObj.prototype.getGetList=function(){return this.getPublicMethod(this.METH_GET_LIST,{controller:this});}
ControllerObj.prototype.setObjModelClass=function(v){this.m_objModelClass=v;}
ControllerObj.prototype.getObjModelClass=function(){return this.m_objModelClass;}
ControllerObj.prototype.setListModelClass=function(v){this.m_listModelClass=v;}
ControllerObj.prototype.getListModelClass=function(){return this.m_listModelClass;}
ControllerObj.prototype.addComplete=function(){var pm=this.addMethod(this.METH_COMPLETE);pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_IC));pm.addField(new FieldInt(this.PARAM_MID));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));return pm;}
ControllerObj.prototype.getComplete=function(){return this.getPublicMethod(this.METH_COMPLETE);}
ControllerObj.prototype.addMethod=function(methId,requestType){var pm_class=this.getPublicMethodClass();var pm=new pm_class(methId,{"controller":this,"requestType":requestType});this.addDefParams(pm);this.addPublicMethod(pm);return pm;}
ControllerObj.prototype.getPrintList=function(){return null;}
ControllerObj.prototype.getWS=function(){return this.m_ws;}
ControllerObj.prototype.setWS=function(v){this.m_ws=v;} 
function ControllerObjServer(options){options=options||{};options.publicMethodClass=options.publicMethodClass||PublicMethodServer;this.setServConnector(options.servConnector);ControllerObjServer.superclass.constructor.call(this,options);}
extend(ControllerObjServer,ControllerObj);ControllerObjServer.prototype.PARAM_DEF_VIEW="ViewXML";ControllerObjServer.prototype.PARAM_CONTROLLER="c";ControllerObjServer.prototype.PARAM_METH="f";ControllerObjServer.prototype.PARAM_VIEW="v";ControllerObjServer.prototype.m_servConnector;ControllerObjServer.prototype.m_resp;ControllerObjServer.prototype.addDefParams=function(pm){pm.addField(new FieldString(this.PARAM_CONTROLLER,{"value":this.getId()}));pm.addField(new FieldString(this.PARAM_METH,{"value":pm.getId()}));pm.addField(new FieldString(this.PARAM_VIEW,{"value":this.PARAM_VIEW_VALUE}));}
ControllerObjServer.prototype.checkMethodParams=function(methId,viewId,params){var pm=this.getPublicMethod(methId);for(var id in pm.getFields()){var f=pm.getField(id);var is_null=f.isNull();if(is_null&&f.getValidator().getRequired()){throw Error(CommonHelper.format(this.ER_EMPTY,Array(this.getId(),methId,f.getId())));}
if(f.isSet()){params[id]=f.getValueXHR();}}}
ControllerObjServer.prototype.getParams=function(methId,viewId){var params={};params[this.PARAM_CONTROLLER]=this.getId();params[this.PARAM_METH]=methId;params[this.PARAM_VIEW]=viewId||this.PARAM_DEF_VIEW;this.checkMethodParams(methId,viewId,params);return params;}
ControllerObjServer.prototype.getServConnector=function(){return(this.m_servConnector)?this.m_servConnector:window.getApp().getServConnector();}
ControllerObjServer.prototype.setServConnector=function(v){this.m_servConnector=v;}
ControllerObjServer.prototype.run=function(methId,options){options=options||{};var meth=this.getPublicMethod(methId);if(options.requestType==undefined){options.requestType=(meth.getRequestType()!=undefined)?meth.getRequestType():"get";}
if(options.async==undefined){options.async=(meth.getAsync()!=undefined)?meth.getAsync():true;}
if(options.encType==undefined){options.encType=(meth.getEncType()!=undefined)?meth.getEncType():null;}
options.retContentType=(options.retContentType==undefined||options.retContentType=="xml")?"document":options.retContentType;var self=this;options.fail=options.fail||function(resp,errCode,errStr){window.showError(errCode+" "+errStr);};var ret_func=function(errCode,errStr,resp,requestId){if(!options.async){window.setGlobalWait(false);}
if(errCode!=0){options.fail.call(self,resp,errCode,errStr,requestId);}
else if(options.ok){self.m_resp=requestId;options.ok.call(self,resp,requestId);}
else{self.m_resp=resp;}
if(options.all){options.all.call(self,resp,errCode,errStr,requestId);}}
if(window["AppSrv"]&&AppSrv.connActiv&&AppSrv.connActive()&&(options.ws===true||this.getWS()===true)){var argv={};this.checkMethodParams(methId,viewId,argv);AppSrv.runPublicMethod(this.getId()+"."+methId,argv,options.progress,ret_func)}else{if(!options["async"]){window.setGlobalWait(true);}
var params=this.getParams(methId,options.viewId);if(options.t){params.t=options.t;}
var conn=this.getServConnector();var con_func=(options.requestType=="post")?conn.sendPost:conn.sendGet;this.m_resp=null;return con_func.call(conn,params,options["async"],ret_func,options.retContentType,options.encType);}}
ControllerObjServer.prototype.download=function(methId,viewId,ind,callBack){ind=(ind!=undefined)?ind:"";var n_id="file_downloader"+ind;var n=document.getElementById(n_id);if(!n){n=document.createElement("iframe");n.id=n_id;n.style="display:none;";n.onerror=window.onerror;n.onload=function(){if(this.contentDocument&&this.contentDocument.body&&this.contentDocument.body.innerHTML&&this.contentDocument.body.innerHTML.length){if(callBack){callBack(1,this.contentDocument.body.innerHTML);}
else{throw new Error(this.contentDocument.body.innerHTML);}}
else if(this.contentDocument){var resp=new ResponseXML(this.contentDocument);var m=resp.modelExists("ModelServResponse")?new ModelServRespXML(resp.getModelData("ModelServResponse")):null;if(m&&m.result){if(callBack){callBack(m.result,m.descr);}
else{throw new Error(m.descr);}}
else if(callBack){callBack(0);}}
else if(callBack){callBack(0);}};document.body.appendChild(n);}
var params=this.getParams(methId,viewId);var par_str="";for(var id in params){par_str+=(par_str=="")?"":"&";par_str+=id+"="+params[id];}
n.src=window.getApp().getServConnector().getScript()+"?"+par_str;}
ControllerObjServer.prototype.openHref=function(methId,viewId,winParams){var meth=this.getPublicMethod(methId);window.getApp().getServConnector().openHref(this.getParams(methId,viewId),winParams);}
ControllerObjServer.prototype.getResponse=function(){return this.m_resp;} 
function ControllerObjClient(options){options=options||{};this.setClientModel(options.clientModel);ControllerObjClient.superclass.constructor.call(this,options);}
extend(ControllerObjClient,ControllerObj);ControllerObjClient.prototype.UPD_PARAM_PREF="old_";ControllerObjClient.prototype.m_clientModel;ControllerObjClient.prototype.addInsert=function(){var pm=this.addMethod(this.METH_INSERT);var self=this;pm.run=function(options){if(self.m_clientModel){self.m_clientModel.reset();self.publicMethodFieldsToModel(this.getFields(),self.m_clientModel.getFields());self.m_clientModel.recInsert();if(options.ok){var key_model_fields={};var fields=self.m_clientModel.getFields();for(var fid in fields){if(fields[fid].getPrimaryKey()){var ft=fields[fid].getDataType();var fcl;if(ft==fields[fid].DT_INT){fcl=FieldInt;}
else{fcl=FieldString;}
key_model_fields[fid]=new fcl(fid,{"value":fields[fid].getValue()});}}
var resp,model;if(self.m_clientModel instanceof ModelXML){resp=new ResponseXML();model=new ModelXML("InsertedId_Model",{"fields":key_model_fields});}
else if(self.m_clientModel instanceof ModelJSON){resp=new ResponseJSON();model=new ModelJSON("InsertedId_Model",{"fields":key_model_fields});}
else{throw new Error(this.ER_UNSUPPORTED_CLIENT_MODEL);}
model.recInsert();resp.setModelData("InsertedId_Model",model.getData());options.ok(resp);}}}
return pm;}
ControllerObjClient.prototype.addUpdate=function(){var pm=this.addMethod(this.METH_UPDATE);var self=this;pm.run=function(options){if(self.m_clientModel){self.m_clientModel.reset();var keyFields={};self.publicMethodFieldsToModel(this.getFields(),null,keyFields);self.m_clientModel.recLocate(keyFields);self.publicMethodFieldsToModel(this.getFields(),self.m_clientModel.getFields());self.m_clientModel.recUpdate();if(options.ok){options.ok();}}}
return pm;}
ControllerObjClient.prototype.addDelete=function(){var pm=this.addMethod(this.METH_DELETE);var self=this;pm.run=function(options){if(self.m_clientModel){self.m_clientModel.recDelete(this.m_fields);if(options.ok){options.ok();}}}
return pm;}
ControllerObjClient.prototype.addGetList=function(){var pm=this.addMethod(this.METH_GET_LIST);var self=this;pm.run=function(options){if(self.m_clientModel){var rows=[];self.m_clientModel.reset();if(options[self.PARAM_COND_FIELDS]){var keys=options[self.PARAM_COND_FIELDS].split(options[self.PARAM_FIELD_SEP]);var vals=options[self.PARAM_COND_VALS].split(options[self.PARAM_FIELD_SEP]);var sgns=options[self.PARAM_COND_SGNS].split(options[self.PARAM_FIELD_SEP]);var opts={};for(var key in options[self.PARAM_COND_FIELDS]){opts[key]=options[self.PARAM_COND_VALS]}}
else{while(self.m_clientModel.getNextRow()){rows.push(self.m_clientModel.m_currentRow);}}
if(options.ok){options.ok(self.makeResponse(rows));}}}
return pm;}
ControllerObjClient.prototype.addGetObject=function(){var pm=this.addMethod(this.METH_GET_OBJ);var self=this;pm.run=function(options){if(self.m_clientModel){if(options.ok){options.ok(self.makeResponse(self.m_clientModel.getFields()));}}}
return pm;}
ControllerObjClient.prototype.setClientModel=function(v){this.m_clientModel=v;}
ControllerObjClient.prototype.getClientModel=function(){return this.m_clientModel;}
ControllerObjClient.prototype.publicMethodFieldsToModel=function(sFields,tFields,keyFields){for(var id in sFields){if(keyFields&&id.substr(0,this.UPD_PARAM_PREF.length)==this.UPD_PARAM_PREF){keyFields[id.substr(this.UPD_PARAM_PREF.length)]=sFields[id];}
else if(tFields&&tFields[id]&&sFields[id].isSet()){tFields[id].setValue(sFields[id].getValue());}}}
ControllerObjClient.prototype.makeResponse=function(rows){var resp_class;if(this.m_clientModel instanceof ModelXML){resp_class=ResponseXML;}
else if(this.m_clientModel instanceof ModelJSON){resp_class=ResponseJSON;}
else{throw new Error(this.ER_UNSUPPORTED_CLIENT_MODEL);}
var resp=new resp_class();resp.setModelData(this.m_clientModel.getId(),this.m_clientModel.getData());return resp;} 
function Model(id,options){options=options||{};this.setId(id);this.setFields(options.fields);this.m_sequences=options.sequences||{};this.setMarkOnDelete((options.markOnDelete!=undefined)?options.markOnDelete:false);this.setData(options.data);this.setCalcHash(options.calcHash);}
Model.prototype.m_fields;Model.prototype.m_id;Model.prototype.m_locked;Model.prototype.m_sequences;Model.prototype.m_currentRow;Model.prototype.m_rowIndex;Model.prototype.m_markOnDelete;Model.prototype.deleteRow=function(row,mark){}
Model.prototype.addRow=function(row){}
Model.prototype.setRowValues=function(row){}
Model.prototype.updateRow=function(row){this.setRowValues(row);}
Model.prototype.resetFields=function(){if(this.m_fields){for(var id in this.m_fields){this.m_fields[id].unsetValue();}}}
Model.prototype.copyRow=function(row){}
Model.prototype.setData=function(data){this.reset();}
Model.prototype.getData=function(){}
Model.prototype.getNextRow=function(){if(this.m_rowIndex+1==this.getRowCount()){return null;}
this.m_rowIndex++;return this.recFetch();}
Model.prototype.getPreviousRow=function(){if(this.m_rowIndex==0){return null;}
this.m_rowIndex--;return this.recFetch();}
Model.prototype.getRows=function(includeDeleted){}
Model.prototype.getRow=function(ind){if(isNaN(ind)||ind<0||ind>=this.getRowCount()){this.reset();return null;}
this.m_rowIndex=ind;return this.recFetch();}
Model.prototype.recFetch=function(){var rows=this.getRows();if(!rows||!rows.length){return;}
this.m_currentRow=rows[this.m_rowIndex];return this.fetchRow(this.m_currentRow);}
Model.prototype.getRowCount=function(includeDeleted){}
Model.prototype.getTotCount=function(){}
Model.prototype.getPageFrom=function(){}
Model.prototype.getPageCount=function(){}
Model.prototype.getFields=function(){return this.m_fields;}
Model.prototype.getRowIndex=function(){return this.m_rowIndex;}
Model.prototype.setRowIndex=function(ind){return this.getRow(ind);}
Model.prototype.fieldExists=function(id){return(this.m_fields&&this.m_fields[id]!=undefined);}
Model.prototype.getField=function(id){if(!this.m_fields){throw new Error(CommonHelper.format(this.ER_NO_FIELDS,[this.getId()]));}
if(!this.m_fields[id]){throw new Error(CommonHelper.format(this.ER_NO_FIELD,[id,this.getId()]));}
return this.m_fields[id];}
Model.prototype.setFields=function(v){if(CommonHelper.isArray(v)){this.m_fields={};for(var i=0;i<v.length;i++){if(typeof(v[i])=="object"){this.addField(v[i]);}
else{var f=new FieldString(v[i]);this.addField(f);}}}
else if(typeof(v)=="object"){this.m_fields=v;}}
Model.prototype.addField=function(f){if(!this.m_fields){throw new Error(CommonHelper.format(this.ER_NO_FIELDS,[this.getId()]));}
this.m_fields[f.getId()]=f;}
Model.prototype.getFieldValue=function(id){return this.getField(id).getValue();}
Model.prototype.setFieldValue=function(id,v){this.getField(id).setValue(v);}
Model.prototype.reset=function(){this.resetFields();this.m_rowIndex=-1;this.m_currentRow=undefined;}
Model.prototype.recDelete=function(keyFields,mark){mark=(mark!=undefined)?mark:this.getMarkOnDelete();var row=this.recLocate(keyFields,true);this.deleteRow(this.m_currentRow,mark);}
Model.prototype.recUndelete=function(keyFields){var row=this.recLocate(keyFields,true);this.undeleteRow(this.m_currentRow);}
Model.prototype.recInsert=function(){for(var sid in this.m_sequences){if(this.m_fields[sid]&&!this.m_fields[sid].isSet()){this.m_sequences[sid]++;this.m_fields[sid].setValue(this.m_sequences[sid]);}}
this.m_currentRow=this.makeRow();this.addRow(this.m_currentRow);this.m_rowIndex=this.getRowCount()-1;}
Model.prototype.recUpdate=function(){this.updateRow(this.m_currentRow);}
Model.prototype.locate=function(keyFields,unique){var res;this.setLocked(true);var cur_ind=this.getRowIndex();try{this.reset();var row_i=0;while(this.getNextRow()){var key_found=true;for(var fid in keyFields){if(this.fieldExists(fid)){var dt=keyFields[fid].getDataType?keyFields[fid].getDataType():Field.prototype.DT_STRING;var is_date=(dt==keyFields[fid].DT_DATETIME||dt==keyFields[fid].DT_DATE||dt==keyFields[fid].DT_DATETIMETZ);var m_v=this.getFieldValue(fid);var k_v=keyFields[fid].getValue?keyFields[fid].getValue():keyFields[fid];if((!is_date&&m_v!=k_v)||(is_date&&m_v.getTime()!=k_v.getTime())){key_found=false;break;}}}
if(key_found){if(!res){res=[];}
res.push(row_i);if(unique){break;}}
row_i++;}}
finally{this.setLocked(false);}
this.setRowIndex(cur_ind);return res;}
Model.prototype.recLocate=function(keyFields,unique){var res=this.locate(keyFields,unique);if(!res&&unique){throw Error(this.ER_REС_NOT_FOUND);}
else if(res){this.getRow(res[0]);}
return res;}
Model.prototype.setLocked=function(v){this.m_locked=v;}
Model.prototype.getLocked=function(){return this.m_locked;}
Model.prototype.setId=function(id){this.m_id=id;}
Model.prototype.getMarkOnDelete=function(){return this.m_markOnDelete;}
Model.prototype.setMarkOnDelete=function(v){this.m_markOnDelete=v;}
Model.prototype.getId=function(){return this.m_id;}
Model.prototype.clear=function(){this.reset();}
Model.prototype.recMove=function(ind,cnt){}
Model.prototype.recMoveUp=function(ind){this.recMove(ind,-1);}
Model.prototype.recMoveDown=function(ind){this.recMove(ind,1);}
Model.prototype.getCalcHash=function(){return this.m_calcHash;}
Model.prototype.setCalcHash=function(v){this.m_calcHash=v;}
Model.prototype.appendModelData=function(targetModel){}
Model.prototype.insertModelData=function(targetModel){} 
function ModelXML(id,options){options=options||{};this.setTagModel(options.tagModel||this.DEF_TAG_MODEL);this.setTagRow(options.tagRow||this.DEF_TAG_ROW);this.m_namespace=options.namespace||this.DEF_NAMESPACE;ModelXML.superclass.constructor.call(this,id,options);}
extend(ModelXML,Model);ModelXML.prototype.ATTR_TOT_COUNT="totalCount";ModelXML.prototype.ATTR_PG_COUNT="rowsPerPage";ModelXML.prototype.ATTR_PG_FROM="listFrom";ModelXML.prototype.ATTR_DELETED="deleted";ModelXML.prototype.ATTR_INSERTED="inserted";ModelXML.prototype.ATTR_UPDATED="updated";ModelXML.prototype.ATTR_HASH="hash";ModelXML.prototype.DEF_TAG_MODEL="model";ModelXML.prototype.DEF_TAG_ROW="row";ModelXML.prototype.TAG_AT_ID="id";ModelXML.prototype.DEF_NAMESPACE="http://www.w3.org/1999/xhtml";ModelXML.prototype.m_node;ModelXML.prototype.m_tagModel;ModelXML.prototype.m_tagRow;ModelXML.prototype.m_namespace;ModelXML.prototype.fetchRow=function(row){this.resetFields();var f=row.childNodes;for(var i=0;i<f.length;i++){if(f[i].nodeType==1){var fid=f[i].nodeName;if(this.m_fields[fid]){var t_val=null;if(this.m_fields[fid].getDataType()==this.m_fields[fid].DT_ARRAY){if(f[i].childNodes.length){for(var t_ind=0;t_ind<f[i].childNodes.length;t_ind++){if(f[i].childNodes[t_ind].nodeType==3){if(!t_val){t_val="";}
t_val+=f[i].childNodes[t_ind].nodeValue;}
else if(f[i].childNodes[t_ind].nodeType==1){var ar_node=f[i].childNodes[t_ind];for(var j=0;j<ar_node.childNodes.length;j++){if(ar_node.childNodes[j].nodeType==3){if(!t_val){t_val=[];}
t_val.push(ar_node.childNodes[j].nodeValue);}}}}}}
else if(f[i].nodeType==1&&f[i].childNodes.length){if(f[i].childNodes[0].nodeType==3){t_val=f[i].childNodes[0].nodeValue;}
else{t_val=f[i].innerHTML;}}
if(t_val==undefined&&this.m_fields[fid].getValidator()&&this.m_fields[fid].getValidator().getRequired()){}
else if(t_val!==null){this.m_fields[fid].setValue(t_val);}}}}
return true;}
ModelXML.prototype.getRows=function(includeDeleted){includeDeleted=(includeDeleted!=undefined)?includeDeleted:true;var rows=[];for(var i=0;i<this.m_node.childNodes.length;i++){if(this.m_node.childNodes[i].nodeType==1){if(!includeDeleted&&this.m_node.childNodes[i].getAttribute(this.ATTR_DELETED)=="1"){continue;}
rows.push(this.m_node.childNodes[i]);}}
return rows;}
ModelXML.prototype.getRowsJSON=function(includeDeleted){includeDeleted=(includeDeleted!=undefined)?includeDeleted:false;var rows=[];for(var i=0;i<this.m_node.childNodes.length;i++){if(this.m_node.childNodes[i].nodeType==1){if(!includeDeleted&&this.m_node.childNodes[i].getAttribute(this.ATTR_DELETED)=="1"){continue;}
var fields={};for(var j=0;j<this.m_node.childNodes[i].childNodes.length;j++){fields[this.m_node.childNodes[i].childNodes[j].nodeName]=this.m_node.childNodes[i].childNodes[j].nodeValue;}
rows.push(fields);}}
return rows;}
ModelXML.prototype.deleteRow=function(row,mark){ModelXML.superclass.deleteRow.call(this,row,mark);if(mark){row.setAttribute(this.ATTR_DELETED,"1");}
else if(row.parentNode){row.parentNode.removeChild(row);}}
ModelXML.prototype.undeleteRow=function(row){row.removeAttribute(this.ATTR_DELETED);}
ModelXML.prototype.addRow=function(row){row.setAttribute(this.ATTR_INSERTED,"1");this.m_node.appendChild(row);}
ModelXML.prototype.copyRow=function(row){this.addRow(row.cloneNode(true));}
ModelXML.prototype.updateRow=function(row){ModelXML.superclass.updateRow.call(this,row);row.setAttribute(this.ATTR_UPDATED,"1");}
ModelXML.prototype.appendFieldToRow=function(field,row){var cell=document.createElement(field.getId());var v="";if(field.isSet()){v=field.getValueXHR();}
var cell_t=document.createTextNode(v);cell.appendChild(cell_t);row.appendChild(cell);}
ModelXML.prototype.makeRow=function(){var row=document.createElement(this.getTagRow());for(var fid in this.m_fields){this.appendFieldToRow(this.m_fields[fid],row);}
return row;}
ModelXML.prototype.setRowValues=function(row){for(var id in this.m_fields){var found=false;for(var rcells=0;rcells<row.childNodes.length;rcells++){if(row.childNodes[rcells].nodeName==id&&row.childNodes[rcells].nodeType==1){if(this.m_fields[id].isSet()){if(row.childNodes[rcells].firstChild){row.childNodes[rcells].firstChild.nodeValue=this.m_fields[id].getValueXHR();}
else{row.childNodes[rcells].appendChild(document.createTextNode(this.m_fields[id].getValueXHR()));}}
found=true;break;}}
if(!found){this.appendFieldToRow(this.m_fields[id],row);}}}
ModelXML.prototype.initSequences=function(){for(sid in this.m_sequences){this.m_sequences[sid]=(this.m_sequences[sid]==undefined)?0:this.m_sequences[sid];var fields=this.m_node.getElementsByTagName(sid);for(var f=0;f<fields.length;f++){if(fields[f].firstChild){var dv=parseInt(fields[f].firstChild.nodeValue,10);if(this.m_sequences[sid]<dv){this.m_sequences[sid]=dv;}}}}}
ModelXML.prototype.setData=function(data){var no_data=false;if(!data){data='<'+this.getTagModel()+' '+this.TAG_AT_ID+'="'+this.getId()+'" xmlns="'+this.m_namespace+'"/>';no_data=true;}
if(typeof(data)=="string"){var xml=DOMHelper.xmlDocFromString(data);if(xml&&xml.getElementById){this.m_node=xml.getElementById(this.getId());}
if(xml&&!this.m_node){var models=xml.getElementsByTagName(this.getTagModel());var id=this.getId();for(var i=0;i<models.length;i++){if(models[i].getAttribute(this.TAG_AT_ID)==id){this.m_node=models[i];break;}}}}
else{this.m_node=data;}
if(!this.m_node){throw new Error(CommonHelper.format(this.ER_NO_MODEL,[this.getId()]));}
if(!this.m_fields&&this.m_node.childNodes&&this.m_node.childNodes.length&&this.m_node.childNodes[0].nodeName==this.getTagRow()&&this.m_node.childNodes[0].childNodes){this.m_fields={};for(var i=0;i<this.m_node.childNodes[0].childNodes.length;i++){var fid=this.m_node.childNodes[0].childNodes[i].nodeName;this.m_fields[fid]=new FieldString(fid);}}
if(this.m_node["toString"]){this.m_node["toString"]=function(){return this.outerHTML;}}
if(!no_data){this.initSequences();}
ModelXML.superclass.setData.call(this,data);}
ModelXML.prototype.getData=function(){return this.m_node;}
ModelXML.prototype.getRowCount=function(includeDeleted){includeDeleted=(includeDeleted!=undefined)?includeDeleted:true;if(includeDeleted){return(this.m_node&&this.m_node.children)?this.m_node.children.length:0;}
else{var rows=this.getRows(includeDeleted);return rows?rows.length:0;}}
ModelXML.prototype.getTotCount=function(){return this.getAttr(this.ATTR_TOT_COUNT);}
ModelXML.prototype.getPageCount=function(){return this.getAttr(this.ATTR_PG_COUNT);}
ModelXML.prototype.getPageFrom=function(){return this.getAttr(this.ATTR_PG_FROM);}
ModelXML.prototype.getAttr=function(attr){if(this.m_node){return this.m_node.getAttribute(attr);}}
ModelXML.prototype.clear=function(){while(this.m_node.children.length){this.m_node.removeChild(this.m_node.children[0]);}}
ModelXML.prototype.getTagModel=function(){return this.m_tagModel;}
ModelXML.prototype.setTagModel=function(v){this.m_tagModel=v;}
ModelXML.prototype.getTagRow=function(){return this.m_tagRow;}
ModelXML.prototype.setTagRow=function(v){this.m_tagRow=v;}
ModelXML.prototype.getHash=function(){return this.getAttr(this.ATTR_HASH);}
ModelXML.prototype.appendModelData=function(targetModel){for(var i=0;i<targetModel.m_node.children.length;i++){this.m_node.appendChild(targetModel.m_node.children[i].cloneNode(true));}}
ModelXML.prototype.insertModelData=function(targetModel){var before_n=this.m_node.children[0];for(var i=0;i<targetModel.m_node.children.length;i++){this.m_node.insertBefore(targetModel.m_node.children[i].cloneNode(true),before_n);}}
ModelXML.prototype.deleteRowByIndex=function(ind,mark){if(this.m_node.children&&this.m_node.children[ind]){this.deleteRow(this.m_node.children[ind],mark);}} 
function ModelObjectXML(id,options){ModelObjectXML.superclass.constructor.call(this,id,options);}
extend(ModelObjectXML,ModelXML);ModelObjectXML.prototype.setData=function(data){ModelObjectXML.superclass.setData.call(this,data);this.getNextRow();} 
function ModelServRespXML(data){ModelServRespXML.superclass.constructor.call(this,window.getApp().SERV_RESPONSE_MODEL_ID,{"data":data,"fields":{"result":new FieldInt("result"),"descr":new FieldString("descr"),"app_version":new FieldString("app_version")}});}
extend(ModelServRespXML,ModelObjectXML);ModelServRespXML.prototype.result;ModelServRespXML.prototype.descr;ModelServRespXML.prototype.setData=function(data){ModelServRespXML.superclass.setData.call(this,data);this.result=this.getFieldValue("result");this.descr=this.getFieldValue("descr");this.app_version=this.fieldExists("app_version")?this.getFieldValue("app_version"):null;} 
function ModelJSON(id,options){if(id&&!options&&typeof(id)=="object"&&id.data&&id.data.id){options=CommonHelper.clone(id);id=id.data.id;}
this.setTagRow(options.tagRow||this.DEF_TAG_ROW);this.setTagRows(options.tagRows||this.DEF_TAG_ROWS);options.markOnDelete=(options.markOnDelete!=undefined)?options.markOnDelete:false;ModelJSON.superclass.constructor.call(this,id,options);}
extend(ModelJSON,Model);ModelJSON.prototype.ATTR_TOT_COUNT="totalCount";ModelJSON.prototype.ATTR_PG_COUNT="rowsPerPage";ModelJSON.prototype.ATTR_PG_FROM="listFrom";ModelJSON.prototype.ATTR_DELETED="deleted";ModelJSON.prototype.ATTR_INSERTED="inserted";ModelJSON.prototype.ATTR_UPDATED="updated";ModelJSON.prototype.DEF_TAG_ROW="row";ModelJSON.prototype.DEF_TAG_ROWS="rows";ModelJSON.prototype.TAG_AT_ID="id";ModelJSON.prototype.m_model;ModelJSON.prototype.m_tagModel;ModelJSON.prototype.m_tagRow;ModelJSON.prototype.m_tagRows;ModelJSON.prototype.fetchRow=function(row){this.resetFields();var fields=row.fields?row.fields:row;for(fid in fields){if(this.m_fields[fid]){var t_val=null;if(fields[fid]!=undefined){t_val=fields[fid];}
if(t_val==""&&this.m_fields[fid].getValidator()&&this.m_fields[fid].getValidator().getRequired()){}
else if(t_val!==null){this.m_fields[fid].setValue(t_val);}}}
return true;}
ModelJSON.prototype.getRows=function(includeDeleted){return this.m_model[this.getTagRows()];}
ModelJSON.prototype.getRowsJSON=function(includeDeleted){return this.getRows[includeDeleted];}
ModelJSON.prototype.copyRow=function(row){this.m_model[this.getTagRows()].push(JSON.parse(JSON.stringify(row)));}
ModelJSON.prototype.deleteRow=function(row,mark){ModelJSON.superclass.deleteRow.call(this,row,mark);if(mark){row[this.ATTR_DELETED]="1";}
else{var ind=CommonHelper.inArray(row,this.m_model[this.getTagRows()]);if(ind>=0){this.m_model[this.getTagRows()].splice(ind,1);}}}
ModelJSON.prototype.undeleteRow=function(row){row[this.ATTR_DELETED]="0";}
ModelJSON.prototype.addRow=function(row){this.m_model[this.getTagRows()].push(row);}
ModelJSON.prototype.updateRow=function(row){ModelJSON.superclass.updateRow.call(this,row);}
ModelJSON.prototype.makeRow=function(){var row={"fields":{}};for(var fid in this.m_fields){if(row.fields){row.fields[fid]=this.m_fields[fid].getValue();}else{row[fid]=this.m_fields[fid].getValue();}}
return row;}
ModelJSON.prototype.setRowValues=function(row){var fields=row.fields?row.fields:row;for(var id in this.m_fields){if(this.m_fields[id].isSet()){fields[id]=this.m_fields[id].getValue();}}}
ModelJSON.prototype.initSequences=function(){for(sid in this.m_sequences){this.m_sequences[sid]=(this.m_sequences[sid]==undefined)?0:this.m_sequences[sid];if(!this.m_model[this.getTagRows()]){return;}
for(var r=0;r<this.m_model[this.getTagRows()].length;r++){var row=this.m_model[this.getTagRows()][r];var fields=row.fields?row.fields:row;for(var c in fields){if(c==sid){var dv=parseInt(fields[c],10);if(this.m_sequences[sid]<dv){this.m_sequences[sid]=dv;}
break;}}}}}
ModelJSON.prototype.setData=function(data){var no_data=false;if(!data){data={"id":this.getId()};data[this.getTagRows()]=[];no_data=true;}
if(typeof(data)=="string"){this.m_model=CommonHelper.unserialize(data);}
else{this.m_model=data;}
if(!this.m_model.id){this.m_model.id=this.getId();}
if(!this.m_fields&&this.m_model.rows&&this.m_model.rows.length){var fields=this.m_model.rows[0].fields?this.m_model.rows[0].fields:this.m_model.rows[0];if(fields){this.m_fields={};for(fid in fields){this.m_fields[fid]=new FieldString(fid,{"value":fields[fid]});}}}
if(this.m_model["toString"]){var self=this;this.m_model["toString"]=function(){return CommonHelper.serialize(self.m_model);}}
if(!no_data){this.initSequences();}
ModelJSON.superclass.setData.call(this,data);}
ModelJSON.prototype.getData=function(){return this.m_model;}
ModelJSON.prototype.getRowCount=function(includeDeleted){var rows=this.getRows(includeDeleted);return rows?rows.length:0;}
ModelJSON.prototype.getTotCount=function(){return this.getAttr(this.ATTR_TOT_COUNT);}
ModelJSON.prototype.getPageCount=function(){return this.getAttr(this.ATTR_PG_COUNT);}
ModelJSON.prototype.getPageFrom=function(){return this.getAttr(this.ATTR_PG_FROM);}
ModelJSON.prototype.getAttr=function(attr){if(this.m_model){return this.m_model[attr];}}
ModelJSON.prototype.clear=function(){this.m_model[this.getTagRows()]=[];}
ModelJSON.prototype.getTagRow=function(){return this.m_tagRow;}
ModelJSON.prototype.setTagRow=function(v){this.m_tagRow=v;}
ModelJSON.prototype.getTagRows=function(){return this.m_tagRows;}
ModelJSON.prototype.setTagRows=function(v){this.m_tagRows=v;}
ModelJSON.prototype.recMove=function(ind,cnt){var mv_ind=this.getRowIndex()+cnt;if(mv_ind>=0&&mv_ind<this.getRowCount()){var tag=this.getTagRows();var elem=JSON.parse(JSON.stringify(this.m_model[tag][ind]));this.m_model[tag].splice(ind,1);this.m_model[tag].splice(mv_ind,0,elem);}} 
function ModelObjectJSON(id,options){ModelObjectJSON.superclass.constructor.call(this,id,options);}
extend(ModelObjectJSON,ModelJSON);ModelObjectJSON.prototype.setData=function(data){ModelObjectJSON.superclass.setData.call(this,data);this.getNextRow();} 
function ModelServRespJSON(data){ModelServRespJSON.superclass.constructor.call(this,window.getApp().SERV_RESPONSE_MODEL_ID,{"data":data,"fields":{"result":new FieldInt("result"),"descr":new FieldString("descr"),"app_version":new FieldString("app_version")}});}
extend(ModelServRespJSON,ModelObjectJSON);ModelServRespJSON.prototype.result;ModelServRespJSON.prototype.descr;ModelServRespJSON.prototype.setData=function(data){ModelServRespJSON.superclass.setData.call(this,data);this.result=this.getFieldValue("result");this.descr=this.getFieldValue("descr");this.app_version=this.fieldExists("app_version")?this.getFieldValue("app_version"):null;} 
function ModelXMLTree(id,options){ModelXMLTree.superclass.constructor.call(this,id,options);}
extend(ModelXMLTree,ModelXML);ModelXMLTree.prototype.DEF_TAG_MODEL="root";ModelXMLTree.prototype.DEF_TAG_ROW="item";ModelXMLTree.prototype.m_parentNode;ModelXMLTree.prototype.m_keyField;ModelXMLTree.prototype.getKeyField=function(){if(!this.m_keyField){for(var fid in this.m_fields){if(this.m_fields[fid].getPrimaryKey()){this.m_keyField=this.m_fields[fid];break;}}}
return this.m_keyField;}
ModelXMLTree.prototype.getRow=function(ind){ModelXMLTree.superclass.getRow.call(this,ind);this.m_parentNode=(this.m_currentRow)?this.m_currentRow:this.m_node;}
ModelXMLTree.prototype.addRow=function(row){if(!this.m_parentNode)this.m_parentNode=this.m_node;this.m_parentNode.appendChild(row);}
ModelXMLTree.prototype.getParentId=function(){var par_id;if(this.m_currentRow&&this.m_currentRow.parentNode&&this.m_currentRow.parentNode!=this.m_node){var key_id=this.getKeyField().getId();var na=this.m_currentRow.parentNode.getElementsByTagName(key_id);if(na&&na.length){var tn=DOMHelper.firstChildElement(na[0],3);if(tn)par_id=tn.nodeValue;}}
return par_id;}
ModelXMLTree.prototype.getRows=function(includeDeleted){return this.m_node.getElementsByTagName(this.getTagRow());}
ModelXMLTree.prototype.makeRow=function(){var row=document.createElement(this.getTagRow());var key_field=this.getKeyField();var key_id=key_field.getId();for(var fid in this.m_fields){var cell=document.createElement(fid);var v="";var f_set=this.m_fields[fid].isSet();if(!f_set&&fid==key_id&&!this.m_sequences[fid]){v=CommonHelper.uniqid();}
else if(f_set){v=this.m_fields[fid].getValue();}
cell.appendChild(document.createTextNode(v));row.appendChild(cell);}
return row;}
ModelXMLTree.prototype.getRowCount=function(includeDeleted){includeDeleted=(includeDeleted!=undefined)?includeDeleted:true;var rows=this.getRows(includeDeleted);return rows?rows.length:0;} 
function Validator(options){options=options||{};this.setRequired(options.required);this.setMinLength(options.minLength);this.setFixLength(options.fixLength);this.setMaxLength(options.maxLength);}
Validator.prototype.m_required;Validator.prototype.m_minLength;Validator.prototype.m_maxLength;Validator.prototype.m_fixLength;Validator.prototype.setRequired=function(v){this.m_required=v;}
Validator.prototype.getRequired=function(){return this.m_required;}
Validator.prototype.setMinLength=function(v){this.m_minLength=v;}
Validator.prototype.getMinLength=function(){return this.m_minLength;}
Validator.prototype.setMaxLength=function(v){this.m_maxLength=v;}
Validator.prototype.getMaxLength=function(){return this.m_maxLength;}
Validator.prototype.setFixLength=function(v){this.m_fixLength=v;}
Validator.prototype.getFixLength=function(){return this.m_fixLength;}
Validator.prototype.isTooLong=function(val){return(val&&this.m_maxLength&&val.length&&val.length>this.m_maxLength);}
Validator.prototype.isTooShort=function(val){return(val&&this.m_minLength&&val.length&&val.length<this.m_minLength);}
Validator.prototype.isNotFixed=function(val){return(val&&this.m_fixLength&&val.length&&val.length!=this.m_maxLength);}
Validator.prototype.validate=function(val){if(this.getRequired()&&val===null){throw new Error(this.ER_EMPTY);}
if(this.isTooLong(val)){throw new Error(this.ER_TOO_LONG);}
if(this.isTooShort(val)){throw new Error(this.ER_TOO_SHORT);}
if(this.isNotFixed(val)){throw new Error(this.ER_INVALID);}}
Validator.prototype.correctValue=function(v){return v;} 
function ValidatorString(options){ValidatorString.superclass.constructor.call(this,options);}
extend(ValidatorString,Validator);ValidatorString.prototype.validate=function(val){ValidatorString.superclass.validate.call(this,val);if(this.getRequired()&&val==""){throw new Error(this.ER_EMPTY);}} 
function ValidatorBool(options){this.TRUE_VALS=[];ValidatorBool.superclass.constructor.call(this,options);this.TRUE_VALS.push("1");this.TRUE_VALS.push("true");this.TRUE_VALS.push("t");this.TRUE_VALS.push("yes");this.TRUE_VALS.push("y");}
extend(ValidatorBool,Validator);ValidatorBool.prototype.correctValue=function(v){return(v===null||v===undefined||v===true||v===false)?v:((!isNaN(v)&&v>0)?true:(jQuery.inArray(v.toString().toLowerCase(),this.TRUE_VALS)>=0));} 
function ValidatorDate(options){ValidatorDate.superclass.constructor.call(this,options);}
extend(ValidatorDate,Validator);ValidatorDate.prototype.correctValue=function(v){var ret=null;if(v&&typeof v=="object"){ret=v;}
else if(v){ret=DateHelper.strtotime(v);}
return ret;} 
function ValidatorDateTime(options){ValidatorDateTime.superclass.constructor.call(this,options);}
extend(ValidatorDateTime,ValidatorDate); 
function ValidatorTime(options){ValidatorTime.superclass.constructor.call(this,options);}
extend(ValidatorTime,ValidatorDate);ValidatorTime.prototype.correctValue=function(v){if(v instanceof Date)return v;return DateHelper.strtotime("1970-01-01T"+v);} 
function ValidatorInt(options){ValidatorInt.superclass.constructor.call(this,options);if(options.maxValue){this.setMaxValue(options.maxValue);}
if(options.minValue){this.setMinValue(options.minValue);}
if(options.notZero!=undefined){this.setNotZero(options.notZero);}
if(options.unsigned!=undefined){this.setUnsigned(options.unsigned);}}
extend(ValidatorInt,Validator);ValidatorInt.prototype.m_maxValue;ValidatorInt.prototype.m_minValue;ValidatorInt.prototype.m_notZero;ValidatorInt.prototype.m_unsigned;ValidatorInt.prototype.correctValue=function(v){v=this.toNumber(v);if(isNaN(v))v=null;return v;}
ValidatorInt.prototype.toNumber=function(v){return parseInt(v);}
ValidatorInt.prototype.validate=function(v){var n=this.toNumber(v);if(this.getRequired()&&isNaN(n)){throw new Error(this.ER_INVALID);}
if(this.m_maxValue&&n>this.m_maxValue){throw new Error(CommonHelper.format(this.ER_VIOL_MAX,[n]));}
if(this.m_minValue&&n<this.m_minValue){throw new Error(CommonHelper.format(this.ER_VIOL_MIN,[n]));}
if(this.m_notZero&&n==0){throw new Error(this.ER_VIOL_NOT_ZERO);}
if(this.m_unsigned&&n<0){throw new Error(this.ER_VIOL_UNSIGNED);}
return n;}
ValidatorInt.prototype.getMaxValue=function(){return this.m_maxValue;}
ValidatorInt.prototype.setMaxValue=function(v){this.m_maxValue=v;}
ValidatorInt.prototype.getMinValue=function(){return this.m_minValue;}
ValidatorInt.prototype.setMinValue=function(v){this.m_minValue=v;}
ValidatorInt.prototype.getUnsigned=function(){return this.m_unsigned;}
ValidatorInt.prototype.setUnsigned=function(v){this.m_unsigned=v;}
ValidatorInt.prototype.getNotZero=function(){return this.m_notZero;}
ValidatorInt.prototype.setNotZero=function(v){this.m_notZero=v;} 
function ValidatorFloat(options){ValidatorFloat.superclass.constructor.call(this,options);}
extend(ValidatorFloat,ValidatorInt);ValidatorFloat.prototype.toNumber=function(v){return parseFloat(v);}
ValidatorFloat.prototype.correctValue=function(v){var this_dig_sep;var v_str=String(v);if(v_str.indexOf(".")>=0){this_dig_sep=".";}
else if(v_str.indexOf(",")>=0){this_dig_sep=",";}
if(this_dig_sep){var js_sep=".";if(js_sep!=this_dig_sep){v=v_str.replace(this_dig_sep,js_sep);}}
return this.toNumber(v);} 
function ValidatorEnum(options){options=options||{};this.setEnumValues(options.enumValues);ValidatorEnum.superclass.constructor.call(this,options);}
extend(ValidatorEnum,Validator);ValidatorEnum.prototype.m_enumValues;ValidatorEnum.prototype.setEnumValues=function(v){this.m_enumValues=v;}
ValidatorEnum.prototype.getEnumValues=function(){return this.m_enumValues;}
ValidatorEnum.prototype.validate=function(val){ValidatorEnum.superclass.validate.call(this,val);var vals=this.getEnumValues();if(vals!==undefined&&val!=undefined&&vals.indexOf(val)<0){throw new Error(this.ER_INVALID);}} 
function ValidatorJSON(options){ValidatorJSON.superclass.constructor.call(this,options);}
extend(ValidatorJSON,Validator);ValidatorJSON.prototype.correctValue=function(v){return CommonHelper.unserialize(v);} 
function ValidatorArray(options){ValidatorArray.superclass.constructor.call(this,options);}
extend(ValidatorArray,Validator);ValidatorArray.prototype.correctValue=function(v){return eval(v);} 
function ValidatorEmail(options){options.maxLength=this.MAX_LENGTH;ValidatorEmail.superclass.constructor.call(this,options);}
extend(ValidatorEmail,ValidatorString);ValidatorEmail.prototype.MAX_LENGTH=50;ValidatorEmail.prototype.validate=function(val){ValidatorEmail.superclass.validate.call(this,val);var re=/\S+@\S+\.\S+/;if(val&&val.length&&!re.test(val)){throw new Error(this.ER_INVALID);}} 
function Field(id,options){options=options||{};if(!options.validator){throw new Error(CommonHelper.format(this.ER_NO_VALIDATOR,[id]));}
this.setId(id);this.setValidator(options.validator);this.setDataType(options.dataType);this.setAlias(options.alias);if(options.defValue!=undefined){this.setDefValue(options.defValue);}
else{this.m_defValue=undefined;}
if(options.value!=undefined){this.setValue(options.value);}
else{this.m_value=undefined;}
this.setPrimaryKey((options.primaryKey!=undefined)?options.primaryKey:false);this.setAutoInc((options.autoInc!=undefined)?options.autoInc:false);}
Field.prototype.DT_INT=0;Field.prototype.DT_INT_UNSIGNED=1;Field.prototype.DT_STRING=2;Field.prototype.DT_FLOAT_UNSIGNED=3;Field.prototype.DT_FLOAT=4;Field.prototype.DT_CUR_RUR=5;Field.prototype.DT_CUR_USD=6;Field.prototype.DT_BOOL=7;Field.prototype.DT_TEXT=8;Field.prototype.DT_DATETIME=9;Field.prototype.DT_DATE=10;Field.prototype.DT_TIME=11;Field.prototype.DT_OBJECT=12;Field.prototype.DT_FILE=13;Field.prototype.DT_PWD=14;Field.prototype.DT_EMAIL=15;Field.prototype.DT_ENUM=16;Field.prototype.DT_GEOM_POLYGON=17;Field.prototype.DT_GEOM_POINT=18;Field.prototype.DT_INTERVAL=19;Field.prototype.DT_DATETIMETZ=20;Field.prototype.DT_JSON=21;Field.prototype.DT_JSONB=22;Field.prototype.DT_ARRAY=23;Field.prototype.DT_XML=24;Field.prototype.DT_INT_BIG=25;Field.prototype.DT_INT_SMALL=26;Field.prototype.DT_BYTEA=27;Field.prototype.OLD_PREF="old_";Field.prototype.m_id;Field.prototype.m_alias;Field.prototype.m_value;Field.prototype.m_primaryKey;Field.prototype.m_defValue;Field.prototype.m_validator;Field.prototype.m_dataType;Field.prototype.setId=function(id){this.m_id=id;}
Field.prototype.getId=function(){return this.m_id;}
Field.prototype.getOldId=function(){return this.OLD_PREF+this.m_id;}
Field.prototype.setPrimaryKey=function(v){this.m_primaryKey=v;}
Field.prototype.getPrimaryKey=function(){return this.m_primaryKey;}
Field.prototype.setDefValue=function(v){v=this.m_validator.correctValue(v);this.m_validator.validate(v);this.m_defValue=v;}
Field.prototype.getDefValue=function(){return this.m_defValue;}
Field.prototype.setAlias=function(v){this.m_alias=v;}
Field.prototype.getAlias=function(){return this.m_alias||this.m_id;}
Field.prototype.setValidator=function(v){this.m_validator=v;}
Field.prototype.getValidator=function(){return this.m_validator;}
Field.prototype.setDataType=function(v){this.m_dataType=v;}
Field.prototype.getDataType=function(){return this.m_dataType;}
Field.prototype.setValue=function(v){try{v=this.m_validator.correctValue(v);this.m_validator.validate(v);}
catch(e){throw new Error(CommonHelper.format(this.ER_SET_VAL,[this.getAlias(),e.message]));}
this.m_value=v;}
Field.prototype.resetValue=function(){var req=this.m_validator.getRequired();if(req)this.m_validator.setRequired(false);this.setValue(null);this.m_validator.setRequired(req);}
Field.prototype.validate=function(value){this.getValidator().validate(value);}
Field.prototype.getValue=function(arInd){if(arInd&&this.m_value&&this.m_value.length>arInd){return this.m_value[arInd];}
else{return this.m_value;}}
Field.prototype.getValueXHR=function(){return this.getValue();}
Field.prototype.isNull=function(){return((this.getValue()===null)&&(this.getDefValue()===null));}
Field.prototype.isSet=function(){return(this.getValue()!==undefined||this.getDefValue()!==undefined);}
Field.prototype.setAutoInc=function(v){this.m_autoInc=v;}
Field.prototype.getAutoInc=function(){return this.m_autoInc;}
Field.prototype.unsetValue=function(){this.m_value=undefined;} 
function FieldString(id,options){options=options||{};options.validator=options.validator||new ValidatorString(options);options.dataType=this.DT_STRING;FieldString.superclass.constructor.call(this,id,options);}
extend(FieldString,Field); 
function FieldEnum(id,options){options.dataType=this.DT_ENUM;options.validator=options.validator||new ValidatorEnum(options);options.dataType=this.DT_ENUM;FieldEnum.superclass.constructor.call(this,id,options);}
extend(FieldEnum,FieldString); 
function FieldBool(id,options){options=options||{};options.validator=options.validator||new ValidatorBool(options);options.dataType=this.DT_BOOL;FieldBool.superclass.constructor.call(this,id,options);}
extend(FieldBool,Field);FieldBool.prototype.getValueXHR=function(){return((this.getValue())?"1":"0");} 
function FieldDate(id,options){options=options||{};options.validator=options.validator||new ValidatorDate(options);options.dataType=options.dataType||this.DT_DATE;FieldDate.superclass.constructor.call(this,id,options);}
extend(FieldDate,Field);FieldDate.prototype.XHR_FORMAT="Y-m-d";FieldDate.prototype.getValueXHR=function(){var v=this.getValue();return v?DateHelper.format(v,this.XHR_FORMAT):null;} 
function FieldDateTime(id,options){options=options||{};options.dataType=options.dataType||this.DT_DATETIME;FieldDateTime.superclass.constructor.call(this,id,options);}
extend(FieldDateTime,FieldDate);FieldDateTime.prototype.XHR_FORMAT="Y-m-dTH:i:s"; 
function FieldDateTimeTZ(id,options){options=options||{};options.dataType=this.DT_DATETIMETZ;this.XHR_FORMAT="Y-m-dTH:i:s"+window.getApp().getTimeZoneOffsetStr();FieldDateTimeTZ.superclass.constructor.call(this,id,options);}
extend(FieldDateTimeTZ,FieldDateTime); 
function FieldTime(id,options){options=options||{};options.dataType=this.DT_TIME;options.validator=options.validator||new ValidatorTime(options);FieldTime.superclass.constructor.call(this,id,options);}
extend(FieldTime,FieldDate);FieldTime.prototype.XHR_FORMAT="H:i:s"; 
function FieldInt(id,options){options=options||{};options.validator=options.validator||new ValidatorInt(options);options.dataType=this.DT_INT;FieldInt.superclass.constructor.call(this,id,options);}
extend(FieldInt,Field); 
function FieldBigInt(id,options){options=options||{};options.validator=options.validator||new ValidatorInt(options);options.dataType=this.DT_INT_BIG;FieldBigInt.superclass.constructor.call(this,id,options);}
extend(FieldBigInt,Field); 
function FieldSmallInt(id,options){options=options||{};options.validator=options.validator||new ValidatorInt(options);options.dataType=this.DT_INT_SMALL;FieldSmallInt.superclass.constructor.call(this,id,options);}
extend(FieldSmallInt,Field); 
function FieldFloat(id,options){options=options||{};options.validator=options.validator||new ValidatorFloat(options);options.dataType=this.DT_FLOAT;FieldFloat.superclass.constructor.call(this,id,options);}
extend(FieldFloat,Field); 
function FieldPassword(id,options){options=options||{};options.dataType=this.DT_PWD;FieldPassword.superclass.constructor.call(this,id,options);}
extend(FieldPassword,FieldString); 
function FieldText(id,options){options=options||{};options.dataType=this.DT_TEXT;FieldText.superclass.constructor.call(this,id,options);}
extend(FieldText,FieldString); 
function FieldInterval(id,options){options=options||{};options.dataType=this.DT_INTERVAL;FieldInterval.superclass.constructor.call(this,id,options);}
extend(FieldInterval,FieldString); 
function FieldJSON(id,options){options=options||{};options.validator=options.validator||new ValidatorJSON(options);options.dataType=this.DT_JSON;FieldJSON.superclass.constructor.call(this,id,options);}
extend(FieldJSON,Field);FieldJSON.prototype.getValueXHR=function(){return(CommonHelper.serialize(this.getValue()));}
FieldJSON.prototype.setValue=function(id,v){if(!v&&typeof(id)=="object"){this.m_value=id;}
else if(!v&&typeof(id)=="string"&&id.length){this.m_value=CommonHelper.unserialize(id);}
else if(v){this.m_value=this.m_value||{};this.m_value[id]=v;}}
FieldJSON.prototype.isEmpty=function(val,checkNull){val=(val&&val.getKeys)?val.getKeys():val;var r=(val==undefined);if(!r){r=true;for(v in val){if(checkNull&&val[v]!==null||!checkNull&&val[v]!==undefined){r=false;break;}}}
return r;}
FieldJSON.prototype.isNull=function(){var r=this.isEmpty(this.getValue(),true);if(r){r=this.isEmpty(this.getDefValue(),true);}
return r;}
FieldJSON.prototype.isSet=function(){var r=this.isEmpty(this.getValue(),false);if(r){r=this.isEmpty(this.getDefValue(),false);}
return!r;} 
function FieldJSONB(id,options){options=options||{};options.dataType=this.DT_JSONB;FieldJSONB.superclass.constructor.call(this,id,options);}
extend(FieldJSONB,FieldJSON); 
function FieldArray(id,options){options=options||{};options.validator=options.validator||new ValidatorArray(options);options.dataType=this.DT_ARRAY;FieldArray.superclass.constructor.call(this,id,options);}
extend(FieldArray,Field);FieldArray.prototype.getValueXHR=function(){return(CommonHelper.serialize(this.getValue()));} 
function ModelFilter(options){options=options||{};this.setFilters(options.filters);}
ModelFilter.prototype.m_filters;ModelFilter.prototype.getFilterVal=function(filter){var ctrl=filter.binding.getControl();if(!ctrl){throw Error(CommonHelper.format(this.ER_NO_CTRL,[id]));}
var f=filter.binding.getField();var res={"field":f.getId(),"sign":filter.sign,"val":undefined,"icase":undefined,"incorrect_val":false};if(!ctrl.isNull()){ctrl.setValid();try{var fv;if(!ctrl.getIsRef()){fv=ctrl.getValue();}
else{var keys=ctrl.getKeys();for(var kid in keys){fv=keys[kid];break;}}
if(ctrl.getValidator()instanceof ValidatorDate&&(f instanceof FieldDateTime||f instanceof FieldDateTimeTZ)&&ctrl.getTimeValueStr&&ctrl.getTimeValueStr()){fv.setHours(0);fv.setMinutes(0);fv.setSeconds(0);fv=new Date(fv.getTime()+DateHelper.timeToMS(ctrl.getTimeValueStr()));}
f.setValue(fv);}
catch(e){ctrl.setNotValid(e.message);res.incorrect_val=true;}
res.val=f.getValueXHR();if(filter.sign=="lk"){res.val=(filter.lwcards?"%":"")+res.val+(filter.rwcards?"%":"")}
res.icase=filter.icase?"1":"0";}
else if(ctrl.getRequired()||f.getValidator().getRequired()){ctrl.setNotValid(f.getValidator().ER_EMPTY);res.incorrect_val=true;}
return res;}
ModelFilter.prototype.setFilter=function(id,filter){this.m_filters[id]=filter;}
ModelFilter.prototype.getFilter=function(id){return this.m_filters[id];}
ModelFilter.prototype.getFilters=function(){return this.m_filters;}
ModelFilter.prototype.setFilters=function(v){this.m_filters=v;}
ModelFilter.prototype.applyFilters=function(grid){var set_cnt=0;for(var id in this.m_filters){if(this.m_filters[id]&&this.m_filters[id].bindings){for(var i=0;i<this.m_filters[id].bindings.length;i++){var struc=this.getFilterVal(this.m_filters[id].bindings[i]);if(!struc.incorrect_val&&struc.val!==undefined){grid.setFilter(struc);set_cnt++;}
else{grid.unsetFilter(struc);}}}
else if(this.m_filters[id]){var struc=this.getFilterVal(this.m_filters[id]);if(!struc.incorrect_val&&struc.val!==undefined){grid.setFilter(struc);set_cnt++;}
else{grid.unsetFilter(struc);}}}
return set_cnt;}
ModelFilter.prototype.applyFiltersToPublicMethod=function(pm){var set_cnt=0;var contr=pm.getController();var s_fields,s_signs,s_vals,s_icases;var sep=contr.PARAM_FIELD_SEP_VAL;var incorrect_val=false;for(var id in this.m_filters){if(this.m_filters[id].bindings){for(var i=0;i<this.m_filters[id].bindings.length;i++){var struc=this.getFilterVal(this.m_filters[id].bindings[i]);if(struc.incorrect_val){incorrect_val=true;}
else{s_fields=((!s_fields)?"":s_fields+sep)+struc.field;s_signs=((!s_signs)?"":s_signs+sep)+struc.sign;s_vals=((!s_vals)?"":s_vals+sep)+struc.val;s_icases=((!s_icases)?"":s_icases+sep)+(struc.icase||"0");set_cnt++;}}}
else{var struc=this.getFilterVal(this.m_filters[id]);if(struc.incorrect_val){incorrect_val=true;}
else if(struc.val||(!struc.val&&this.m_filters[id].binding.getSendNull())){s_fields=((!s_fields)?"":s_fields+sep)+struc.field;s_signs=((!s_signs)?"":s_signs+sep)+struc.sign;s_vals=((!s_vals)?"":s_vals+sep)+struc.val;s_icases=((!s_icases)?"":s_icases+sep)+(struc.icase||"0");set_cnt++;}}}
if(incorrect_val){throw Error(this.ER_INVALID_CTRL);}
pm.setFieldValue(contr.PARAM_COND_FIELDS,s_fields);pm.setFieldValue(contr.PARAM_COND_SGNS,s_signs);pm.setFieldValue(contr.PARAM_COND_VALS,s_vals);pm.setFieldValue(contr.PARAM_COND_ICASE,s_icases);pm.setFieldValue(contr.PARAM_FIELD_SEP,sep);return set_cnt;}
ModelFilter.prototype.resetFilter=function(id,grid){var bind=this.m_filters[id].binding;var ctrl=bind.getControl();if(!ctrl){throw Error(CommonHelper.format(this.ER_NO_CTRL,[id]));}
ctrl.reset();if(this.m_filters[id].bindings){for(var i=0;i<this.m_filters[id].bindings.length;i++){var filter=this.m_filters[id].bindings[i];grid.unsetFilter({"field":filter.binding.getField().getId(),"sign":filter.sign});}}
else{var filter=this.m_filters[id];grid.unsetFilter({"field":filter.binding.getField().getId(),"sign":filter.sign});}}
ModelFilter.prototype.resetFilters=function(grid){for(var id in this.m_filters){this.resetFilter(id,grid);}}
ModelFilter.prototype.serialize=function(){return CommonHelper.serialize(this.getValue());}
ModelFilter.prototype.getValue=function(){var o={};for(var id in this.m_filters){var ctrl=this.m_filters[id].binding.getControl();if(ctrl&&!ctrl.isNull()){if(this.m_filters[id].bindings){o[id]={"value":ctrl.getValue()};o[id].bindings=[];for(var i=0;i<this.m_filters[id].bindings.length;i++){var ctrl=this.m_filters[id].bindings[i].binding.getControl();if(ctrl&&!ctrl.isNull()){var v=ctrl.getValue();if(v instanceof Date){v=DateHelper.format(v,FieldDateTime.XHR_FORMAT);}
o[id].bindings[i]={"field":this.m_filters[id].bindings[i].binding.getField().getId(),"sign":this.m_filters[id].bindings[i].sign,"value":v};}}}
else{var v=ctrl.getValue();if(v instanceof Date){v=DateHelper.format(v,FieldDateTime.XHR_FORMAT);}
o[id]={"field":this.m_filters[id].binding.getField().getId(),"sign":this.m_filters[id].sign,"value":v};}}}
return o;}
ModelFilter.prototype.unserialize=function(str){return this.setValue(CommonHelper.unserialize(str));}
ModelFilter.prototype.setValue=function(o){var set_cnt=0;if(!o)return;for(var id in this.m_filters){var ctrl=this.m_filters[id].binding.getControl();if(ctrl){if(o[id]){if(this.m_filters[id].bindings){if(o[id].value.period)ctrl.setValue(o[id].value.period);for(var i=0;i<this.m_filters[id].bindings.length;i++){ctrl=this.m_filters[id].bindings[i].binding.getControl();if(ctrl){if(o[id].bindings[i]){ctrl.setInitValue(o[id].bindings[i].value);set_cnt++;}
else{ctrl.reset();}}}}
else{ctrl.setInitValue(o[id].value);set_cnt++;}}
else{ctrl.reset();}}}
return set_cnt;} 
function RefType(options){options=options||{};this.setKeys(options.keys);this.setDescr(options.descr);this.setDataType(options.dataType);}
RefType.prototype.m_keys;RefType.prototype.m_descr;RefType.prototype.m_dataType;RefType.prototype.setKeys=function(v){this.m_keys=v;}
RefType.prototype.getKeys=function(){return this.m_keys;}
RefType.prototype.setDescr=function(v){this.m_descr=v;}
RefType.prototype.getDescr=function(){return this.m_descr;}
RefType.prototype.setDataType=function(v){this.m_dataType=v;}
RefType.prototype.getDataType=function(){return this.m_dataType;}
RefType.prototype.getKey=function(v){var val;if(this.m_keys&&v){val=this.m_keys[v];}
else if(this.m_keys&&!v){for(var k in this.m_keys){val=this.m_keys[k];break;}}
return val;}
RefType.prototype.isNull=function(){var k=this.getKeys();var r=(k==undefined||CommonHelper.isEmpty(k));if(!r){for(v in k){r=(k[v]===null||k[v]==="null");if(r){break;}}}
return r;}
RefType.prototype.toJSON=function(){return{"keys":this.getKeys(),"descr":this.getDescr(),"dataType":this.getDataType()};}
RefType.prototype.getFormattedValue=function(){return this.getDescr();} 
App.prototype.ER_WS_NOT_SUPPERTED="Браузер не поддерживает работу с вэб сокетами. Функциональность приложения ограничена.";App.prototype.NT_WS_CONNECTED="Соединение с сервером установлено.";App.prototype.ER_WS_NOT_CONNECTED="Ошибка соединения с сервером.";FatalException.prototype.HEADER="Критическая ошибка";ServConnector.prototype.ER_STATUS0="Ошибка установки оединения с сервером";ServConnector.prototype.ER_NO_RESP_MODEL="Неверный ответ сервера";Model.prototype.ER_NO_MODEL="Модель % не найдена.";Model.prototype.ER_NO_FIELD="Поле % модели % не найдено.";Model.prototype.ER_NO_FIELDS="Поля модели % не определены.";Model.prototype.ER_LOCKED="Модель заблокирована.";Model.prototype.ER_REС_NOT_FOUND="Запись не найдена.";Validator.prototype.ER_EMPTY="пустое значение";Validator.prototype.ER_TOO_LONG="значение слишком длинное";Validator.prototype.ER_TOO_SHORT="значение слишком короткое";Validator.prototype.ER_INVALID="неверное значение.";ValidatorBool.prototype.TRUE_VALS=["да","д","истина"];ValidatorInt.prototype.ER_VIOL_NOT_ZERO="значение равно нулю";ValidatorInt.prototype.ER_VIOL_MAX="значение больше %";ValidatorInt.prototype.ER_VIOL_MIN="значение меньше %";ValidatorInt.prototype.ER_VIOL_UNSIGNED="значение меньше нуля";Field.prototype.ER_NO_VALIDATOR="Поле:%, не задан валидатор.";Field.prototype.ER_SET_VAL="Ошибка установки значения, поле:%, %";DateHelper.MON_DATE_LIST=Array("Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября","Декабря");DateHelper.MON_LIST=Array("Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь");DateHelper.WEEK_LIST=Array("Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота");DateHelper.FORMAT_STR="d/m/Y H:i:s";EventHelper.DEL_ERR="Невозможно удалить событие.";Response.prototype.ERR_NO_MODEL="Модель % не найдена.";PublicMethod.prototype.ER_NO_FIELD="Контроллер %, метод %, поле % не найдено.";PublicMethod.prototype.ER_NO_CONTROLLER="Метод %, не задан контроллер.";Controller.prototype.ER_NO_METHOD="Метод % контроллера % не найден.";Controller.prototype.ER_EMPTY="Контроллер %, метод %, поле %, не задано обязательное значение.";ControllerObjClient.prototype.ER_UNSUPPORTED_CLIENT_MODEL="Не поддерживоемый тип клиентской модели.";ModelFilter.prototype.ER_NO_CTRL="Фильтр %, не указан контрол.";ModelFilter.prototype.ER_INVALID_CTRL="Есть неправильные значения в фильтре.";VersException.prototype.HEADER="Обновление программы";VersException.prototype.NOTE="Сохраните все данные и обновите страницу!";VersException.prototype.CAP_POSTPONE="Отложить на % мин.";VersException.prototype.TITLE_POSTPONE="Дать возможность сохранить данные, задать вопрос через % мин.";VersException.prototype.CAP_RELOAD="Обновить сейчас";VersException.prototype.TITLE_RELOAD="Перезагрузить страницу сейчас"; 
function DataBinding(options){options=options||{};this.m_control=options.control;this.m_field=options.field;this.m_fieldId=options.fieldId;this.m_model=options.model;this.m_keyIds=options.keyIds;this.m_assocIndex=options.assocIndex;}
DataBinding.prototype.m_control;DataBinding.prototype.m_field;DataBinding.prototype.m_fieldId;DataBinding.prototype.m_model;DataBinding.prototype.m_keyIds;DataBinding.prototype.getControl=function(){return this.m_control;}
DataBinding.prototype.setControl=function(v){this.m_control=v;}
DataBinding.prototype.getField=function(){return this.m_field;}
DataBinding.prototype.setField=function(v){this.m_field=v;}
DataBinding.prototype.getFieldId=function(){return this.m_fieldId;}
DataBinding.prototype.setFieldId=function(v){this.m_fieldId=v;}
DataBinding.prototype.getModel=function(){return this.m_model;}
DataBinding.prototype.setModel=function(v){this.m_model=v;}
DataBinding.prototype.getKeyIds=function(){return(this.m_keyIds)?this.m_keyIds:((this.m_control&&this.m_control.getKeyIds)?this.m_control.getKeyIds():null);}
DataBinding.prototype.setKeyIds=function(v){this.m_keyIds=v;}
DataBinding.prototype.getAssocIndex=function(){return this.m_assocIndex;}
DataBinding.prototype.setAssocIndex=function(v){this.m_assocIndex=v;} 
function Command(id,options){if(typeof(id)=="object"){options=id;if(!options.id){options.id=options.publicMethod.getId();}}
else{options=options||{};options.id=id;}
this.setId(options.id);this.setControl(options.control);this.setPublicMethod(options.publicMethod);this.setBindings(options.bindings||[]);this.setAsync(options.async);}
Command.prototype.m_id;Command.prototype.m_control;Command.prototype.m_publicMethod;Command.prototype.m_bindings;Command.prototype.m_async;Command.prototype.getPublicMethod=function(){return this.m_publicMethod;}
Command.prototype.setPublicMethod=function(v){this.m_publicMethod=v;}
Command.prototype.getBindings=function(){return this.m_bindings;}
Command.prototype.setBindings=function(v){this.m_bindings=v;}
Command.prototype.addBinding=function(binding){this.m_bindings.push(binding);}
Command.prototype.getAsync=function(){return this.m_async;}
Command.prototype.setAsync=function(v){this.m_async=v;}
Command.prototype.getControl=function(){return this.m_control;}
Command.prototype.setControl=function(v){this.m_control=v;}
Command.prototype.getId=function(){return this.m_id;}
Command.prototype.setId=function(v){this.m_id=v;}
Command.prototype.run=function(opts){this.m_publicMethod.run(opts);} 
function CommandBinding(options){options=options||{};this.m_control=options.control;this.m_field=options.field;this.m_fieldId=options.fieldId;this.m_func=options.func;if(!this.m_fieldId&&!this.m_field&&this.m_control){if(this.m_control.getKeyIds&&this.m_control.getKeyIds().length){this.m_fieldId=this.m_control.getKeyIds()[0];}
else{this.m_fieldId=this.m_control.getName();}}
this.m_assocIndex=options.assocIndex;this.m_sendNull=(options.sendNull!=undefined)?options.sendNull:true;}
CommandBinding.prototype.m_control;CommandBinding.prototype.m_field;CommandBinding.prototype.m_fieldId;CommandBinding.prototype.m_func;CommandBinding.prototype.m_sendNull;CommandBinding.prototype.getControl=function(){return this.m_control;}
CommandBinding.prototype.setControl=function(v){this.m_control=v;}
CommandBinding.prototype.getField=function(){return this.m_field;}
CommandBinding.prototype.setField=function(v){this.m_field=v;}
CommandBinding.prototype.getFieldId=function(){return this.m_fieldId;}
CommandBinding.prototype.setFieldId=function(v){this.m_fieldId=v;}
CommandBinding.prototype.getAssocIndex=function(){return this.m_assocIndex;}
CommandBinding.prototype.setAssocIndex=function(v){this.m_assocIndex=v;}
CommandBinding.prototype.getFunc=function(){return this.m_func;}
CommandBinding.prototype.setFunc=function(v){this.m_func=v;}
CommandBinding.prototype.getSendNull=function(){return this.m_sendNull;}
CommandBinding.prototype.setSendNull=function(v){this.m_sendNull=v;} 
function Control(id,tagName,options){options=options||{};tagName=tagName||this.DEF_TAG_NAME;this.m_template=options.template||window.getApp().getTemplate(this.constructor.name||CommonHelper.functionName(this.constructor));this.setTemplateOptions(options.templateOptions);options.attrs=options.attrs||{};this.m_node=id?CommonHelper.nd(id,this.getWinObjDocument()):null;if(this.m_node){for(var i=0;i<this.m_node.attributes.length;i++){if(this.m_node.attributes[i].name.toLowerCase()=="options"){var html_opts=JSON.parse(this.m_node.attributes[i].value.replace(new RegExp("'",'g'),'"'));for(var html_opt_id in html_opts){options[html_opt_id]=html_opts[html_opt_id];}}
else{options.attrs[this.m_node.attributes[i].name]=this.m_node.attributes[i].value;}}
if(this.m_template||options.html){var _html=(options.html!=undefined)?options.html:this.getTemplateHTML(this.m_template,id);var tempDiv=document.createElement("TEMPLATE");tempDiv.className=this.CLASS_INVISIBLE;if(!tempDiv.insertAdjacentHTML){tempDiv.innerHTML=(options.html!=undefined)?options.html:this.getTemplateHTML(this.m_template,id);}
else{tempDiv.insertAdjacentHTML("afterbegin",(options.html!=undefined)?options.html:this.getTemplateHTML(this.m_template,id));}
var new_node=DOMHelper.firstChildElement(tempDiv);if(!new_node){throw new Error("Control "+id+" template head node not found!");}
var par=this.m_node.parentNode;var sib=this.m_node.nextSibling;this.m_node.parentNode.removeChild(this.m_node);if(sib){par.insertBefore(new_node,sib);}
else{par.appendChild(new_node);}
this.m_node=new_node;}}
else if(this.m_template==undefined&&options.html==undefined){try{this.m_node=document.createElement(tagName);}
catch(e){this.m_node=document.createElement("DIV");}
this.setId(id);}
else{this.m_tempDiv=document.createElement("DIV");this.m_tempDiv.className=this.CLASS_INVISIBLE;this.m_tempDiv.innerHTML=(options.html!=undefined)?options.html:this.getTemplateHTML(this.m_template,id);this.m_node=DOMHelper.lastChildElement(this.m_tempDiv);document.body.appendChild(this.m_tempDiv);}
this.setClassName(options.className);if(options.value!=undefined){this.setValue(options.value);}
if(options.name){options.attrs.name=options.name;}
if(!options.attrs.name&&id){if(typeof(id)!="string"){console.log(id)
alert("!")}
var id_ar=id.split(this.NAMESPACE_SEP);if(id_ar.length){options.attrs.name=id_ar[id_ar.length-1];}
else{options.attrs.name=id;}}
options.attrs.maxlength=options.attrs.maxlength||options.maxLength||options.maxlength;options.attrs.placeholder=options.attrs.placeholder||options.placeholder;options.attrs.title=options.attrs.title||options.title;options.attrs.autofocus=options.attrs.autofocus||((options.focus||options.autofocus||options.focused)?"autofocus":undefined);options.attrs.tabIndex=options.attrs.tabIndex||options.tabIndex;if(options.attrs.disabled&&options.attrs.disabled==this.ATTR_DISABLED){options.enabled=false;}
this.setEnabled((options.enabled!=undefined)?options.enabled:true);this.setVisible((options.visible!=undefined)?options.visible:true);if(options.hidden===true){this.hide();}
if(options.required!=undefined){this.setRequired(options.required);}
for(var attr in options.attrs){if(attr!="disabled"){var av;if(attr=="class"){av=DOMHelper.getAttr("class")||"";av=av+((av=="")?"":" ")+options.attrs[attr];if(options.visible===false){av+=" "+this.CLASS_INVISIBLE;}}
else if(attr=="style"){av=DOMHelper.getAttr("style")||"";av=av+options.attrs[attr];}
else{av=options.attrs[attr];}
this.setAttr(attr,av);}}
this.setOnValueChange(options.onValueChange);this.setEvents(options.events);this.setSrvEvents(options.srvEvents);}
Control.prototype.DEF_TAG_NAME="DIV";Control.prototype.ATTR_DISABLED="disabled";Control.prototype.ATTR_REQ="required";Control.prototype.CLASS_INVISIBLE="hidden";Control.prototype.NAMESPACE_SEP=":";Control.prototype.m_node;Control.prototype.m_events;Control.prototype.m_eventFuncs;Control.prototype.m_onValueChange;Control.prototype.m_locked;Control.prototype.m_beforeLockEnabled;Control.prototype.m_html;Control.prototype.m_srvEvents;Control.prototype.m_srvEventsId;Control.prototype.m_enableLock;Control.prototype.correctEvId=function(ev){var id=ev.toLowerCase();if(id.substring(0,2)=="on"){id=id.substring(2);}
return id;}
Control.prototype.eventsToDOM=function(){for(var ev in this.m_events){var id=this.correctEvId(ev);var self=this;if(this.m_eventFuncs[id]){EventHelper.del(this.m_node,id,this.m_eventFuncs[id],false);}
this.m_eventFuncs[id]=function(e){self.m_events[ev].call(self,e);};EventHelper.add(this.m_node,id,this.m_eventFuncs[id],false);}}
Control.prototype.eventsFromDOM=function(){for(var ev in this.m_events){var id=this.correctEvId(ev);if(this.m_eventFuncs[id]){EventHelper.del(this.m_node,id,this.m_eventFuncs[id],false);}}}
Control.prototype.nodeToDOM=function(parent,beforeNode){if(this.m_tempDiv){DOMHelper.setParent(this.m_node,parent);DOMHelper.delNode(this.m_tempDiv);}
else{var n=CommonHelper.nd(this.getId(),this.getWinObjDocument());if(!n&&!parent){throw new Error("Neither node nor parent found! ID="+this.getId());}
else if(!n){if(beforeNode){parent.insertBefore(this.m_node,beforeNode);}
else{parent.appendChild(this.m_node);}}}
if(this.getAttr("autofocus")){this.focus();}}
Control.prototype.setText=function(val){if(this.m_node.childNodes!=undefined&&this.m_node.childNodes.length){this.m_node.childNodes[0].nodeValue=val;}
else{var tn=document.createTextNode(val);if(this.m_node.nodeName=="IMG"){}
else{this.m_node.appendChild(tn);}}}
Control.prototype.getText=function(){if(this.m_node.childNodes&&this.m_node.childNodes.length){return this.m_node.childNodes[0].nodeValue;}}
Control.prototype.valueChanged=function(){if(this.m_onValueChange){this.m_onValueChange.call(this);}}
Control.prototype.setId=function(id){if(id)this.m_node.id=id;}
Control.prototype.getId=function(){return DOMHelper.getAttr(this.getNode(),"id");}
Control.prototype.setTagName=function(v){if(this.m_node.nodeName!=v){this.m_node.nodeName=v;}}
Control.prototype.setName=function(v){DOMHelper.setAttr(this.getNode(),"name",v);}
Control.prototype.getName=function(){return DOMHelper.getAttr(this.getNode(),"name");}
Control.prototype.setTabIndex=function(v){DOMHelper.setAttr(this.getNode(),"tabindex",v);}
Control.prototype.getTabIndex=function(){return DOMHelper.getAttr(this.getNode(),"tabindex");}
Control.prototype.setEnabled=function(v){if(!this.getEnableLock()){if(v){DOMHelper.delAttr(this.getNode(),this.ATTR_DISABLED);}
else{DOMHelper.setAttr(this.getNode(),this.ATTR_DISABLED,this.ATTR_DISABLED);}
return true;}else{return false;}}
Control.prototype.setEnableLock=function(v){this.m_enableLock=v;}
Control.prototype.getEnableLock=function(){return this.m_enableLock;}
Control.prototype.getEnabled=function(){return!(DOMHelper.getAttr(this.getNode(),this.ATTR_DISABLED));}
Control.prototype.setVisible=function(v){if(v){DOMHelper.delClass(this.m_node,this.CLASS_INVISIBLE);}
else{DOMHelper.addClass(this.m_node,this.CLASS_INVISIBLE);}}
Control.prototype.setRequired=function(v){if(!v){DOMHelper.delAttr(this.m_node,this.ATTR_REQ);}
else{DOMHelper.addAttr(this.m_node,this.ATTR_REQ,this.ATTR_REQ);}}
Control.prototype.getRequired=function(){return(DOMHelper.getAttr(this.m_node,this.ATTR_REQ)!=undefined);}
Control.prototype.getVisible=function(){return!DOMHelper.hasClass(this.m_node,this.CLASS_INVISIBLE);}
Control.prototype.getNode=function(){return this.m_node;}
Control.prototype.appendToNode=function(parent){parent.appendChild(this.m_node);}
Control.prototype.setValue=function(val){this.setText(val);this.valueChanged();}
Control.prototype.getValue=function(){return this.getText();}
Control.prototype.toDOMBefore=function(node){this.nodeToDOM(node.parentNode,node);this.eventsToDOM();}
Control.prototype.toDOMAfter=function(node){this.nodeToDOM(node.parentNode,node.nextSibling);this.eventsToDOM();}
Control.prototype.toDOMInstead=function(node){node.parentNode.replaceChild(this.m_node,node);this.eventsToDOM();}
Control.prototype.toDOM=function(parent){this.nodeToDOM(parent);this.eventsToDOM();this.subscribeToSrvEvents(this.m_srvEvents);}
Control.prototype.setAttr=function(name,value){if(value!=undefined){DOMHelper.setAttr(this.m_node,name,value);}}
Control.prototype.getAttr=function(name){return DOMHelper.getAttr(this.m_node,name);}
Control.prototype.delAttr=function(name){DOMHelper.delAttr(this.m_node,name);}
Control.prototype.setClassName=function(className){if(className&&className.length>0){DOMHelper.addClass(this.m_node,className);}}
Control.prototype.getClassName=function(){return this.m_node.className;}
Control.prototype.delDOM=function(){DOMHelper.delNode(this.m_node);this.unsubscribeFromSrvEvents();}
Control.prototype.setWinObj=function(winObj){this.m_winObj=winObj;}
Control.prototype.getWinObj=function(winObj){return this.m_winObj;}
Control.prototype.getWinObjDocument=function(){if(this.m_winObj&&this.m_winObj.getWindowForm){return this.m_winObj.getWindowForm().document;}
else{return window.document;}}
Control.prototype.setEvents=function(e){this.m_events=e;this.m_eventFuncs={};}
Control.prototype.getEvents=function(){return this.m_events;}
Control.prototype.getEvent=function(id){return this.m_events?this.m_events[id]:null;}
Control.prototype.fireEvent=function(id,e){if(this.m_events[id]){this.m_events[id](e);}}
Control.prototype.focus=function(){if(this.m_node.focus&&this.getEnabled()){this.m_node.focus();}}
Control.prototype.serialize=function(o){var o=o||{};o.value=this.getValue();for(var a in this.m_node.attributes){if(typeof this.m_node.attributes[a]!="object"&&typeof this.m_node.attributes[a]!="function"){o[a]=this.m_node.attributes[a];}}
return CommonHelper.serialize(o);}
Control.prototype.unserialize=function(str){var o=CommonHelper.unserialize(str);for(var a in o){if(a=="value")continue;this.m_node.attributes[a]=o[a];}
if(o.value){this.setValue(o.value);}
return o;}
Control.prototype.getHtml=function(){return this.m_node.innerHTML;}
Control.prototype.setHtml=function(v){if(v){this.m_node.innerHTML=v;this.m_html=v;}}
Control.prototype.getTemplateHTML=function(t,nId){var v_opts={};CommonHelper.merge(v_opts,this.m_templateOptions);v_opts.id=((nId)?nId:this.getId());v_opts.bsCol=window.getBsCol();v_opts.widthType=window.getWidthType();Mustache.parse(t);return Mustache.render(t,v_opts);}
Control.prototype.setTemplate=function(v){if(v){this.m_template=v;this.setHtml(this.getTemplateHTML(v));}}
Control.prototype.updateHTML=function(){this.setTemplate(this.m_template);}
Control.prototype.getTemplateOptions=function(){return this.m_templateOptions;}
Control.prototype.setTemplateOptions=function(v){this.m_templateOptions=v;}
Control.prototype.getOnValueChange=function(){return this.m_onValueChange;}
Control.prototype.setOnValueChange=function(v){this.m_onValueChange=v;}
Control.prototype.setLocked=function(v){if(v){this.m_beforeLockEnabled=this.getEnabled();}
if((v&&this.m_beforeLockEnabled)||(!v&&this.m_beforeLockEnabled)){if(!v){DOMHelper.delAttr(this.getNode(),this.ATTR_DISABLED);}
else{DOMHelper.setAttr(this.getNode(),this.ATTR_DISABLED,this.ATTR_DISABLED);}}
this.m_locked=v;}
Control.prototype.getLocked=function(){return this.m_locked;}
Control.prototype.setHidden=function(v){if(v){this.hide();}
else{this.show();}}
Control.prototype.hide=function(){this.m_oldStyleDisplay=this.m_node.style.display;this.m_node.style.display="none";}
Control.prototype.show=function(display){if(display){this.m_node.style.display=display;}
else if(this.m_oldStyleDisplay){this.m_node.style.display=this.m_oldStyleDisplay;}
else{this.m_node.style.display="";}}
Control.prototype.setSrvEvents=function(v){this.m_srvEvents=v;}
Control.prototype.getSrvEvents=function(){return this.m_srvEvents;}
Control.prototype.getSrvEventsId=function(){return this.m_srvEventsId;}
Control.prototype.unsubscribeFromSrvEvents=function(){if(this.m_srvEventsId&&window.getApp().getAppSrv()){console.log("Control.prototype.unsubscribeFromSrvEvents")
window.getApp().getAppSrv().unsubscribe(this.m_srvEventsId);this.m_srvEventsId=undefined;}}
Control.prototype.subscribeToSrvEvents=function(srvEvents){if(srvEvents&&srvEvents.events&&srvEvents.events.length&&srvEvents.onEvent&&window.getApp().getAppSrv()){this.m_srvEventsId=window.getApp().getAppSrv().subscribe(srvEvents);}} 
Control.prototype.ER_NO_PARENT="Контрол %, родитель не определен.";Control.prototype.ER_NO_AP="Контрол %, параметр app не задан."; 
function ControlContainer(id,tagName,options){if(!id){id=CommonHelper.uniqid();}
options=options||{};ControlContainer.superclass.constructor.call(this,id,tagName,options);this.m_elements={};if(options.elements&&CommonHelper.isArray(options.elements)&&options.elements.length){this.addElements(options.elements);}
if(options.addElement){options.addElement.call(this);}}
extend(ControlContainer,Control);ControlContainer.prototype.m_elements;ControlContainer.prototype.elementExists=function(id){return(this.m_elements[id]!=undefined);}
ControlContainer.prototype.checkElement=function(id){if(!this.elementExists(id)){throw new Error(CommonHelper.format(this.ER_NO_ELEMENT,Array(id,this.getId())));}
return true;}
ControlContainer.prototype.isEmpty=function(){return CommonHelper.isEmpty(this.m_elements);}
ControlContainer.prototype.getElement=function(id){return this.m_elements[id];}
ControlContainer.prototype.getElements=function(){return this.m_elements;}
ControlContainer.prototype.getElementByIndex=function(ind){var i=0;for(var k in this.m_elements){if(i==ind){return this.m_elements[k];}
i++;}}
ControlContainer.prototype.setElement=function(id,elem){this.m_elements[id||CommonHelper.uniqid()]=elem;}
ControlContainer.prototype.delElement=function(elName){var res=false;for(var elem_id in this.m_elements){if(this.m_elements[elem_id]){if(this.m_elements[elem_id].getName()==elName){this.m_elements[elem_id].delDOM();delete this.m_elements[elem_id];this.m_elements[elem_id]=undefined;res=true;break;}}}
return res;}
ControlContainer.prototype.addElement=function(ctrl){if(ctrl&&ctrl.getName)this.setElement(ctrl.getName(),ctrl);}
ControlContainer.prototype.addElements=function(a){for(var i=0;i<a.length;i++){this.addElement(a[i]);}}
ControlContainer.prototype.appendToNode=function(parent){for(var elem_id in this.m_elements){this.m_elements[elem_id].appendToNode(this.m_node);}
parent.appendChild(this.m_node);}
ControlContainer.prototype.elementsToDOM=function(){var elem;var focus_elem;for(var elem_id in this.m_elements){elem=this.m_elements[elem_id];if(elem){elem.toDOM(this.m_node);if(!focus_elem&&elem.getAttr("autofocus")){focus_elem=elem;}}}
return focus_elem;}
ControlContainer.prototype.toDOMAfter=function(node){ControlContainer.superclass.toDOMAfter.call(this,node);this.elementsToDOM();}
ControlContainer.prototype.toDOMBefore=function(node){ControlContainer.superclass.toDOMBefore.call(this,node);this.elementsToDOM();}
ControlContainer.prototype.toDOM=function(parent){var focus_elem=this.elementsToDOM();this.nodeToDOM(parent);if(focus_elem)focus_elem.focus();this.eventsToDOM();this.subscribeToSrvEvents(this.m_srvEvents);}
ControlContainer.prototype.clear=function(){for(var elem_id in this.m_elements){if(this.m_elements[elem_id])this.m_elements[elem_id].delDOM();}
this.m_elements={};}
ControlContainer.prototype.getCount=function(){var len=0;for(var k in this.m_elements)if(this.m_elements[k])len++;return len;}
ControlContainer.prototype.delDOM=function(){for(var elem_id in this.m_elements){if(this.m_elements[elem_id])this.m_elements[elem_id].delDOM();}
ControlContainer.superclass.delDOM.call(this);}
ControlContainer.prototype.setEnabled=function(v){for(var elem_id in this.m_elements){if(this.m_elements[elem_id])
this.m_elements[elem_id].setEnabled(v);}
ControlContainer.superclass.setEnabled.call(this,v);}
ControlContainer.prototype.setTempDisabled=function(){this.m_tempDisabledList=[];for(var elem_id in this.m_elements){if(this.m_elements[elem_id]&&this.m_elements[elem_id].getEnabled()){this.m_tempDisabledList.push(elem_id);this.m_elements[elem_id].setEnabled(false);}}}
ControlContainer.prototype.setTempEnabled=function(){for(i=0;i<this.m_tempDisabledList.length;i++){this.m_elements[this.m_tempDisabledList[i]].setEnabled(true);}}
ControlContainer.prototype.setLocked=function(v){for(var elem_id in this.m_elements){if(this.m_elements[elem_id])this.m_elements[elem_id].setLocked(v);}
ControlContainer.superclass.setLocked.call(this,v);}
ControlContainer.prototype.serialize=function(){var o={};o.elements={};for(var elem_id in this.m_elements){if(this.m_elements[elem_id]){o.elements[elem_id]=this.m_elements[elem_id].serialize();}}
return ControlContainer.superclass.serialize.call(this,o);}
ControlContainer.prototype.unserialize=function(str){var o=ControlContainer.superclass.unserialize.call(this,str);for(var id in o.elements){if(this.m_elements[id]){this.m_elements[id].unserialize(o.elements[id]);}}} 
ControlContainer.prototype.ER_NO_ELEMENT="Элемент % контейнера % не найден."; 
function View(id,options){options=options||{};var title=this.HEAD_TITLE||options.HEAD_TITLE;if(title){options.templateOptions=options.templateOptions||{};options.templateOptions.HEAD_TITLE=title;}
this.setDataBindings(options.dataBindings||[]);this.m_editResult={"newKeys":null,"updated":false};View.superclass.constructor.call(this,id,(options.tagName||this.DEF_TAG_NAME),options);}
extend(View,ControlContainer);View.prototype.DEF_TAG_NAME="DIV";View.prototype.m_controlStates;View.prototype.m_dataBindings;View.prototype.m_editResult;View.prototype.onGetData=function(resp){}
View.prototype.setFocus=function(){var set=false,cnt=0;for(var id in this.m_elements){cnt++;if(this.m_elements[id].getAttr("autofocus")){this.m_elements[id].focus();set=true;break;}}
if(!set&&cnt){this.getElementByIndex(0).focus();}}
View.prototype.setReadTempDisabled=function(){this.m_controlStates=[];if(this.m_dataBindings){for(var i=0;i<this.m_dataBindings.length;i++){var ctrl=this.m_dataBindings[i].getControl();if(ctrl){this.m_controlStates.push({"ctrl":ctrl,"enabled":ctrl.getEnabled(),"inputEnabled":ctrl.getInputEnabled?ctrl.getInputEnabled():true});ctrl.setEnabled(false);}}}}
View.prototype.setReadTempEnabled=function(){if(this.m_controlStates){for(var i=0;i<this.m_controlStates.length;i++){if(this.m_controlStates[i].enabled){this.m_controlStates[i].ctrl.setEnabled(true);}
if(this.m_controlStates[i].ctrl.setInputEnabled)this.m_controlStates[i].ctrl.setInputEnabled(this.m_controlStates[i].inputEnabled);}}}
View.prototype.setError=function(s,delay){window.showError(s,null,delay);}
View.prototype.resetError=function(){window.resetError();}
View.prototype.toDOM=function(parent){View.superclass.toDOM.call(this,parent);this.setFocus();}
View.prototype.getDataBindings=function(){return this.m_dataBindings;}
View.prototype.setDataBindings=function(v){this.m_dataBindings=v;}
View.prototype.addDataBinding=function(binding){this.m_dataBindings.push(binding);}
View.prototype.clearDataBinding=function(){this.setDataBindings([]);} 
function ViewAjx(id,options){options=options||{};this.setCommands(options.commands||{});this.setOnBeforeExecCommand(options.onBeforeExecCommand);ViewAjx.superclass.constructor.call(this,id,options);}
extend(ViewAjx,View);ViewAjx.prototype.m_commands;ViewAjx.prototype.m_cmdCtrlState;ViewAjx.prototype.m_onBeforeExecCommand;ViewAjx.prototype.defineField=function(i){var f=this.m_dataBindings[i].getField();var m=this.m_dataBindings[i].getModel();if(!f&&this.m_dataBindings[i].getFieldId()&&m.fieldExists(this.m_dataBindings[i].getFieldId())){this.m_dataBindings[i].setField(m.getField(this.m_dataBindings[i].getFieldId()));}
else if(!f&&this.m_dataBindings[i].getControl()&&m.fieldExists(this.m_dataBindings[i].getControl().getName())){this.m_dataBindings[i].setField(m.getField(this.m_dataBindings[i].getControl().getName()));}}
ViewAjx.prototype.onGetData=function(resp,cmd){cmd=(cmd===true)?"copy":cmd;var cmdCopy=(cmd=="copy");var cmdInsert=(cmd=="insert");var models={};for(var i=0;i<this.m_dataBindings.length;i++){var m=this.m_dataBindings[i].getModel();if(!m){throw new Error(CommonHelper.format(this.ER_NO_BINDING_MODEL,[i]));}
var m_id=m.getId();if(models[m_id]==undefined&&resp&&resp.modelExists(m_id)){m.setData(resp.getModelData(m_id));models[m_id]=m.getRowCount();m.getNextRow();}
else if(models[m_id]==undefined&&!resp){models[m_id]=m.getRowCount();if(models[m_id]){m.getNextRow();}}
if(models[m_id]>0){var ctrl=this.m_dataBindings[i].getControl();if(ctrl){var init_val=null;var ctrl_format_f=(ctrl.getFormatFunction)?ctrl.getFormatFunction():null;if(ctrl_format_f){init_val=ctrl_format_f.call(ctrl,this.m_dataBindings[i].getModel().getFields());}
else if(this.m_dataBindings[i].getValue){init_val=this.m_dataBindings[i].getValue.call(this.m_dataBindings[i]);}
else{this.defineField(i);if(this.m_dataBindings[i].getField()&&!(cmdCopy&&this.m_dataBindings[i].getField().getPrimaryKey())){init_val=this.m_dataBindings[i].getField().getValue();if(init_val!=undefined&&this.m_dataBindings[i].getAssocIndex()!==undefined){init_val=init_val[this.m_dataBindings[i].getAssocIndex()];}}}
if(init_val!=undefined&&(!ctrl.getIsRef||!ctrl.getIsRef())){if(ctrl.setInitValue&&!cmdCopy&&!cmdInsert){ctrl.setInitValue(init_val);}
else{ctrl.setValue(init_val);}}
else if(ctrl.getIsRef&&ctrl.getIsRef()&&this.m_dataBindings[i].getKeyIds()){var init_val_o;if(typeof init_val=="string"&&init_val.substring(0,1)=="{"&&init_val.substring(init_val.length-1)=="}"){init_val=CommonHelper.unserialize(init_val);}
if(init_val!=undefined&&typeof init_val=="object"){init_val_o=init_val;if(ctrl.getModelKeyFields){var model_keys=ctrl.getModelKeyFields();var o_keys={};var init_val_k_ind=0;for(var init_val_k_id in init_val.m_keys){if(model_keys.length<init_val_k_ind){break;}
o_keys[model_keys[init_val_k_ind].getId()]=init_val.m_keys[init_val_k_id];init_val_k_ind++;}
init_val_o.m_keys=o_keys;}}else{var key_ids=this.m_dataBindings[i].getKeyIds();if(!key_ids){throw Error(CommonHelper.format(this.ER_CTRL_KEYS_NOT_BOUND,[ctrl.getName()]));}
var m_keys;if(ctrl.getModelKeyFields){m_keys=ctrl.getModelKeyFields();}
var keys={};for(var n=0;n<key_ids.length;n++){var k_id;if(m_keys){k_id=m_keys[n].getId();}
else{k_id=key_ids[n];}
keys[k_id]=m.getFieldValue(key_ids[n]);}
init_val_o=new RefType({"keys":keys,"descr":init_val,"dataType":undefined});}
if(ctrl.setInitValue&&!cmdCopy&&!cmdInsert){ctrl.setInitValue(init_val_o);}
else{ctrl.setValue(init_val_o);}}}}}
this.setReadTempEnabled();}
ViewAjx.prototype.setTempDisabled=function(cmd){if(this.m_commands[cmd]){var cmd_ctrl=this.m_commands[cmd].getControl();if(cmd_ctrl){this.m_cmdCtrlState=cmd_ctrl.getEnabled();cmd_ctrl.setEnabled(false);}}
this.m_controlStates={};this.m_controlStates[cmd]=[];if(this.m_commands[cmd].getBindings()){var b=this.m_commands[cmd].getBindings();for(var i=0;i<b.length;i++){var ctrl=b[i].getControl();if(!ctrl||ctrl.getEnableLock()){continue;}
this.m_controlStates[cmd].push({"ctrl":ctrl,"enabled":ctrl.getEnabled(),"inputEnabled":(ctrl.getInputEnabled)?ctrl.getInputEnabled():true});ctrl.setEnabled(false);ctrl.setEnableLock(true)}}}
ViewAjx.prototype.setTempEnabled=function(cmd){if(this.m_commands[cmd]){var cmd_ctrl=this.m_commands[cmd].getControl();if(cmd_ctrl&&this.m_cmdCtrlState){cmd_ctrl.setEnabled(true);}}
if(this.m_controlStates&&this.m_controlStates[cmd]){for(var i=0;i<this.m_controlStates[cmd].length;i++){if(this.m_controlStates[cmd][i].enabled){this.m_controlStates[cmd][i].ctrl.setEnableLock(false);this.m_controlStates[cmd][i].ctrl.setEnabled(true);}
if(this.m_controlStates[cmd][i].ctrl.setInputEnabled){this.m_controlStates[cmd][i].ctrl.setInputEnabled(this.m_controlStates[cmd][i].inputEnabled);}}}}
ViewAjx.prototype.getModified=function(cmd){if(this.m_commands[cmd].getBindings()){var b=this.m_commands[cmd].getBindings();for(var i=0;i<b.length;i++){if(b[i].getControl()&&b[i].getControl().getModified&&b[i].getControl().getModified()){return true;}}}}
ViewAjx.prototype.validate=function(cmd,validate_res){validate_res=validate_res||{};validate_res.incorrect_vals=false;var pm=this.m_commands[cmd].getPublicMethod();if(!pm){throw Error(this.ER_NO_PM);}
var bindings=this.m_commands[cmd].getBindings();if(bindings&&bindings.length){this.resetError();for(var i=0;i<bindings.length;i++){var bind=bindings[i];var ctrl=bind.getControl();if(bind.getFunc&&bind.getFunc()){bind.getFunc().call(this,pm,ctrl);}
else if(!ctrl){throw Error(CommonHelper.format(this.ER_NO_CTRL,[cmd,i]));}
else{var f=bind.getField();if(!f&&bind.getFieldId()){f=pm.getField(bind.getFieldId());}
else if(!f&&pm.fieldExists(ctrl.getName())){f=pm.getField(ctrl.getName());}
else if(!f){throw Error(CommonHelper.format(this.ER_CTRL_NOT_BOUND,[ctrl.getName()]));}
if(ctrl.getModified&&ctrl.getModified()){try{if(ctrl.getIsRef&&ctrl.getIsRef()&&!(f.getDataType()==Field.prototype.DT_JSON||f.getDataType()==Field.prototype.DT_JSONB)){var keyIds=ctrl.getKeyIds();if(keyIds.length>=1){var ctrl_keys=ctrl.getKeys();var key_val=(ctrl_keys&&ctrl_keys!="{}")?ctrl_keys[keyIds[0]]:null;key_val=(key_val=="null")?null:key_val;if(ctrl.getRequired&&ctrl.getRequired()&&key_val===null){throw new Error(f.getValidator().ER_EMPTY);}
f.setValue(key_val);}}
else{if(ctrl.setValid)ctrl.setValid();var val=ctrl.getValue();if(ctrl.validate){if(!ctrl.validate()){validate_res.incorrect_vals=true;continue;}}
else if(ctrl.getValidator&&ctrl.getValidator()){ctrl.getValidator().validate(val);}
if(ctrl.getRequired&&ctrl.getRequired()&&val===null){throw new Error(f.getValidator().ER_EMPTY);}
if(bind.getAssocIndex()){f.setValue(bind.getAssocIndex(),val);}
else{f.setValue(val);}}}
catch(e){if(ctrl.setNotValid)ctrl.setNotValid(e.message);validate_res.incorrect_vals=true;}}
else if(ctrl.isNull&&ctrl.isNull()&&(ctrl.getRequired()||f.getValidator().getRequired())&&ctrl.setNotValid){ctrl.setNotValid(f.getValidator().ER_EMPTY);validate_res.incorrect_vals=true;}
else if(f.isSet()){f.m_value=undefined;}
if(validate_res.old_keys&&!validate_res.incorrect_vals&&f.getPrimaryKey()&&pm.fieldExists(f.getOldId())){var init_val=ctrl.getInitValue();if(typeof init_val=="object"){if(init_val instanceof RefType){init_val=init_val.getKey();}
else{for(var init_val_id in init_val){init_val=init_val[init_val_id];break;}}}
validate_res.old_keys[f.getOldId()]=init_val;}}}}
return!validate_res.incorrect_vals;}
ViewAjx.prototype.execCommand=function(cmd,sucFunc,failFunc,allFunc){if(!this.m_commands[cmd]){throw Error(this.ER_CMD_NOT_FOUND);}
var pm=this.m_commands[cmd].getPublicMethod();if(!pm){throw Error(this.ER_NO_PM);}
var validate_res={"incorrect_vals":false,"modified":this.getModified(cmd),"old_keys":{}};if(!validate_res.modified){var pm_fields=pm.getFields();for(var fid in pm_fields){if(fid=="c"||fid=="f"||fid=="v")continue;if(pm_fields[fid].isSet()){validate_res.modified=true;break;}}}
if(validate_res.modified){this.validate(cmd,validate_res);}
if(validate_res.incorrect_vals){if(failFunc){failFunc.call(this,null,null,this.ER_ERRORS);}
if(allFunc){allFunc.call(this);}}
else if(validate_res.modified){if(!this.m_commands[cmd].getAsync()){this.setTempDisabled(cmd);}
for(oldid in validate_res.old_keys){pm.setFieldValue(oldid,validate_res.old_keys[oldid]);}
var self=this;try{this.beforeExecCommand(cmd,pm);var pm_opts={"async":this.m_commands[cmd].getAsync(),"fail":function(resp,errCode,errStr){self.onRequestFail(failFunc,cmd,resp,errCode,errStr);}};if(!this.m_commands[cmd].getAsync()&&allFunc){pm_opts.all=function(){self.setTempEnabled(cmd);allFunc.call(this);}}
else if(!this.m_commands[cmd].getAsync()&&!allFunc){pm_opts.all=function(){self.setTempEnabled(cmd);}}
else if(this.m_commands[cmd].getAsync()&&allFunc){pm_opts.all=function(){allFunc.call(this);}}
if(sucFunc){pm_opts.ok=function(resp){sucFunc.call(this,resp);}}
pm.run(pm_opts);}
catch(e){this.onRequestFail(failFunc,cmd,null,null,e.message);if(allFunc){allFunc.call(this);}}}
else{if(sucFunc){sucFunc.call(this,null);}
if(allFunc){allFunc.call(this);}}}
ViewAjx.prototype.onRequestFail=function(failFunc,cmd,resp,errCode,errStr){if(failFunc){failFunc.call(this,resp,errCode,errStr);}
else{this.setError(window.getApp().formatError(errCode,errStr));}}
ViewAjx.prototype.getCommands=function(){return this.m_commands;}
ViewAjx.prototype.setCommands=function(v){this.m_commands=v;}
ViewAjx.prototype.addCommand=function(cmd){this.m_commands[cmd.getId()]=cmd;}
ViewAjx.prototype.getCommand=function(id){return this.m_commands[id];}
ViewAjx.prototype.toDOM=function(parent,cmd){cmd=(cmd===true)?"copy":cmd;ViewAjx.superclass.toDOM.call(this,parent);this.onGetData(null,cmd);}
ViewAjx.prototype.beforeExecCommand=function(cmd,pm){if(this.getOnBeforeExecCommand()){this.getOnBeforeExecCommand().call(this,cmd,pm);}}
ViewAjx.prototype.setOnBeforeExecCommand=function(v){this.m_onBeforeExecCommand=v;}
ViewAjx.prototype.getOnBeforeExecCommand=function(v){return this.m_onBeforeExecCommand;} 
ViewAjx.prototype.ER_KEY_NOT_FOUND="Ключ % не найден у контрола %";ViewAjx.prototype.ER_ERRORS="Обнаружены ошибки.";ViewAjx.prototype.ER_NO_PM="Серверный метод не задан.";ViewAjx.prototype.ER_CTRL_NOT_BOUND="Элемент управления % не привязан к полю модели контроллера.";ViewAjx.prototype.ER_NO_CTRL="Команда % с индексом % не имеет связи с элементом формы.";ViewAjx.prototype.ER_CTRL_KEYS_NOT_BOUND="Не заданы ключи ссылочного элемента формы %.";ViewAjx.prototype.ER_NO_BINDING_MODEL="Для связывания с индексом % модель не определена."; 
function ViewAjxList(id,options){options=options||{};var self=this;if(window.onSelect||options.modalSelect){options.cmdSelect=(options.cmdSelect!=undefined)?options.cmdSelect:true;if(options.controlSelect||options.cmdSelect){this.setControlSelect(options.controlSelect||new ButtonMakeSelection(id+":cmdSelect",{"onClick":function(){var list=self.getElements();var res=false;for(var id in list){if(list[id].onSelect){list[id].onSelect();res=true;break;}}
window.closeResult=res;window.close();}}));}
options.cmdCancel=(options.cmdCancel!=undefined)?options.cmdCancel:true;if(options.controlCancel||options.cmdCancel){this.setControlCancel(options.controlCancel||new ButtonCancel(id+":cmdCancel",{"onClick":function(){window.closeResult=false;window.close();}}));}
if(options.commandContainer||options.commandElements||options.cmdSelect||options.cmdCancel){this.m_commandContainer=options.commandContainer||new ControlContainer(id+":cmd-cont","DIV",{"elements":options.commandElements});}}
ViewAjxList.superclass.constructor.call(this,id,options);this.addControls();}
extend(ViewAjxList,ViewAjx);ViewAjxList.prototype.m_controlCancel;ViewAjxList.prototype.m_controlSelect;ViewAjxList.prototype.m_onClose;ViewAjxList.prototype.m_commandContainer;ViewAjxList.prototype.addControls=function(){if(this.m_commandContainer){if(this.m_controlSelect)this.m_commandContainer.addElement(this.m_controlSelect);if(this.m_controlCancel)this.m_commandContainer.addElement(this.m_controlCancel);}}
ViewAjxList.prototype.toDOM=function(parent){ViewAjxList.superclass.toDOM.call(this,parent);if(this.m_commandContainer)this.m_commandContainer.toDOM(parent);}
ViewAjxList.prototype.delDOM=function(){if(this.m_commandContainer)this.m_commandContainer.delDOM();ViewAjxList.superclass.delDOM.call(this);}
ViewAjxList.prototype.setControlSelect=function(v){this.m_controlSelect=v;}
ViewAjxList.prototype.getControlSelect=function(){return this.m_controlSelect;}
ViewAjxList.prototype.setControlCancel=function(v){this.m_controlCancel=v;}
ViewAjxList.prototype.getControlCancel=function(){return this.m_controlCancel;} 
function ErrorControl(id,options){options=options||{};ErrorControl.superclass.constructor.call(this,id,options.tagName||this.DEF_TAG,options);this.m_errorclassName=options.errorClassName||this.DEF_ERROR_CLASS;}
extend(ErrorControl,Control);ErrorControl.prototype.DEF_ERROR_CLASS="label label-danger";ErrorControl.prototype.DEF_TAG="DIV";ErrorControl.prototype.setValue=function(val){if(!val||val.trim()==""){DOMHelper.delClass(this.getNode(),this.m_errorclassName);}
else{DOMHelper.addClass(this.getNode(),this.m_errorclassName);}
ControlContainer.superclass.setValue.call(this,val);}
ErrorControl.prototype.clear=function(){this.setValue("");} 
function Calculator(options){options=options||{};if(!options.editControl){throw Error(this.ER_NO_EDIT_CONTROL);}
this.m_winObj=options.winObj;this.m_editControl=options.editControl;this.resetVars();}
Calculator.prototype.CALC_CLASS="calc";Calculator.prototype.m_editControl;Calculator.prototype.getVal=function(){return CommonHelper.nd("ekran",this.getWinObjDocument()).value;}
Calculator.prototype.setVal=function(val){CommonHelper.nd("ekran",this.getWinObjDocument()).value=val;}
Calculator.prototype.close=function(cancel){if(!cancel){this.m_editControl.setValue(this.getVal());this.m_editControl.focus();}
if(this.calcNode){this.calcNode.parentNode.removeChild(this.calcNode);}}
Calculator.prototype.wynik=0;Calculator.prototype.op;Calculator.prototype.nowe=0;Calculator.prototype.nowe2=0;Calculator.prototype.done=1;Calculator.prototype.oset=0;Calculator.prototype.kropka;Calculator.prototype.temp;Calculator.prototype.resetVars=function(){this.wynik=0,this.op=0,this.nowe=0,this.nowe2=0,this.done=1,this.oset=0;}
Calculator.prototype.reset=function(value){this.setVal(value);this.resetVars();}
Calculator.prototype.wspolna=function(new_temp){this.kropka=1;if(this.nowe||this.done){this.nowe=0;this.done=0;this.temp=new_temp;}
for(var i=0;i<this.temp.length;i++)if(this.temp[i]=='.')this.kropka=0;}
Calculator.prototype.calcButton=function(ktory,ktory2){this.temp=this.getVal();if(ktory2=='.'){this.wspolna('0');if(this.kropka){this.temp+=ktory2;this.setVal(this.temp);this.oset=0;}}
if(ktory>=0&&ktory<=9){this.wspolna('');if(this.temp==0&&this.kropka==1)this.temp='';this.temp+=ktory;this.setVal(this.temp);this.oset=1;}
if(ktory2=='-'||ktory2=='+'||ktory2=='/'||ktory2=='*'){if(this.nowe)this.op=ktory2
else{if(!this.nowe2){this.op=ktory2;this.wynik=this.temp;this.nowe2=1;}
else{this.wynik=eval(this.wynik+this.op+this.temp);this.op=ktory2;this.setVal(wynik);}
this.oset=0;this.nowe=1;}}
if(ktory2=='1/x'){this.wynik=eval(1/this.temp);this.reset(this.wynik);}
if(ktory2=='sqrt'){this.wynik=Math.sqrt(this.temp);this.reset(this.wynik);}
if(ktory2=='exp'){this.wynik=Math.exp(this.temp);this.reset(this.wynik);}
if(ktory2=='+/-')this.setVal(eval(-this.temp));if(ktory2=='='&&this.oset&&this.op!='0')this.reset(eval(this.wynik+this.op+this.temp));if(ktory2=='C')this.reset(0);if(this.getVal()[0]=='.')
this.setVal('0')+this.getVal();}
Calculator.prototype.getHTML=function(){var input_id=this.m_editControl.getId();var calc_html='<table cellPadding="0" cellSpacing="5">'+'<tbody>'+'<tr align="left">'+'<td colSpan="5" align="right"><div id="'+input_id+':calc_cancel"><img src="img/modal/close.gif"></div></td></tr>'+'<td colSpan="5"><input style="width:100%;" id="ekran" value="0" size="20"/></td></tr>'+'<tr align="middle">'+'<td colSpan="3">'+this.TITLE+'</td>'+'<td><input id="'+input_id+':calc_btn_C" type="button" value="C"/></td>'+'<td><input id="'+input_id+':calc_btn_OK" type="button" value="OK"/></td></tr>'+'<tr align="middle">'+'<td><input id="calc_btn_7" class="calc_ctrl" type="button" value="  7  "/></td>'+'<td><input id="calc_btn_8" class="calc_ctrl" type="button" value="  8  "/></td>'+'<td><input id="calc_btn_9" class="calc_ctrl" type="button" value="  9  "/></td>'+'<td><input id="calc_btn_/" class="calc_ctrl" type="button" value="  /  "/></td>'+'<td><input id="calc_btn_sqrt" class="calc_ctrl" type="button" value="sqrt"/></td></tr>'+'<tr align="middle">'+'<td><input id="calc_btn_4" class="calc_ctrl" type="button" value="  4  "/></td>'+'<td><input id="calc_btn_5" class="calc_ctrl" type="button" value="  5  "/></td>'+'<td><input id="calc_btn_6" class="calc_ctrl" type="button" value="  6  "/></td>'+'<td><input id="calc_btn_*" class="calc_ctrl" type="button" value=" *  "/></td>'+'<td><input id="calc_btn_exp" class="calc_ctrl" type="button" value="exp"/></td></tr>'+'<tr align="middle">'+'<td><input id="calc_btn_1" class="calc_ctrl" type="button" value="  1  "/></td>'+'<td><input id="calc_btn_2" class="calc_ctrl" type="button" value="  2  "/></td>'+'<td><input id="calc_btn_3" class="calc_ctrl" type="button" value="  3  "/></td>'+'<td><input id="calc_btn_-" class="calc_ctrl" type="button" value="  -  "/></td>'+'<td><input id="calc_btn_1/x" class="calc_ctrl" type="button" value="1/x "/></td></tr>'+'<tr align="middle">'+'<td><input id="calc_btn_0" class="calc_ctrl" type="button" value="  0  "/></td>'+'<td><input id="calc_btn_+/-" class="calc_ctrl" class="calc_ctrl" type="button" value=" +/- "/></td>'+'<td><input id="calc_btn_." class="calc_ctrl" type="button" value="  ,  "/></td>'+'<td><input id="calc_btn_+" class="calc_ctrl" type="button" value="  +  "/></td>'+'<td><input id="calc_btn_=" class="calc_ctrl" type="button" value="  =  "/></td>'+'</tr>'+'</tbody>'+'</table>';return calc_html;}
Calculator.prototype.assignControls=function(){var input_id=this.m_editControl.getId();var self=this;CommonHelper.nd(input_id+":calc_cancel",this.getWinObjDocument()).onclick=function(){self.close(true);};CommonHelper.nd(input_id+":calc_btn_OK",this.getWinObjDocument()).onclick=function(){self.close(false);};CommonHelper.nd(input_id+":calc_btn_C",this.getWinObjDocument()).onclick=function(){self.calcButton(11,"C");};var list=DOMHelper.getElementsByAttr('calc_ctrl',this.calcNode,'class');var id;for(var i=0;i<list.length;i++){list[i].onclick=function(event){event=EventHelper.fixMouseEvent(event);id=event.target.id.replace(/calc_btn_/,'');self.calcButton(id,id);};}}
Calculator.prototype.show=function(){var input_id=this.m_editControl.getId();var node=this.m_editControl.getNode();if(node!=undefined&&CommonHelper.nd(input_id+":calc",this.getWinObjDocument())==undefined){this.calcNode=document.createElement('div');this.calcNode.id=input_id+":calc";this.calcNode.className=this.CALC_CLASS;this.calcNode.style.border="1px solid gray";this.calcNode.style.background='#FFFFFF';this.calcNode.style.color='#000000';this.calcNode.style.position='absolute';this.calcNode.style.display='block';this.calcNode.style.padding='2px';this.calcNode.style.cursor='default';this.calcNode.innerHTML=this.getHTML();this.calcNode.style.top=(CommonHelper.findPosY(node)+node.offsetHeight+2)+"px";this.calcNode.style.left=(CommonHelper.findPosX(node)+node.offsetWidth+2)+"px";this.getWinObjDocument().body.appendChild(this.calcNode);this.assignControls();this.setVal(node.value);}}
Calculator.prototype.refresh=function(){if(this.calcNode!=undefined){this.calcNode.innerHTML=this.getHTML();this.assignControls();}}
Calculator.prototype.getWinObjDocument=function(){if(this.m_winObj){return this.m_winObj.getWindowForm().document;}
else{return window.document;}} 
Calculator.prototype.TITLE="Калькулятор";Calculator.prototype.ER_NO_EDIT_CONTROL="Не задан контрол."; 
function Button(id,options){options=options||{};this.m_colorClass=options.colorClass||this.DEF_COLOR_CLASS;options.className=options.className||this.DEF_CLASS;options.attrs=options.attrs||{};options.title=options.title||options.attrs.title||options.hint||this.DEF_TITLE;this.m_imageTag=options.imageTag||this.IMAGE_TAG;this.m_imagePosition=options.imagePosition||this.IMAGE_POS;Button.superclass.constructor.call(this,id,(options.tagName||this.DEF_TAG_NAME),options);this.setCaption(options.caption);this.setImageFontName(options.imageFontName||this.DEF_IMG_FONT_NAME);this.setImageClass(options.imageClass||options.glyph||options.attrs.glyph);this.setGlyphPopUp(options.glyphPopUp);var self=this;this.m_clickFunc=function(e){if(self.getEnabled()&&self.m_onClick){e=EventHelper.fixMouseEvent(e);self.m_onClick.call(self,e);}}
if(options.onClick!=undefined){this.setOnClick(options.onClick);}}
extend(Button,Control);Button.prototype.DEF_TAG_NAME="DIV";Button.prototype.DEF_CLASS="btn btn-default";Button.prototype.DEF_COLOR_CLASS="btn-default";Button.prototype.DEF_TITLE;Button.prototype.DEF_IMG_FONT_NAME="glyphicon";Button.prototype.IMAGE_TAG="I";Button.prototype.IMAGE_POS="before";Button.prototype.m_imageClass;Button.prototype.m_glyphPopUp;Button.prototype.m_colorClass;Button.prototype.m_imageFontName;Button.prototype.setCaption=function(caption){if(caption){if(this.m_node.childNodes.length==0){this.m_node.appendChild(document.createTextNode(caption));}
else{DOMHelper.setText(this.m_node,caption);}}}
Button.prototype.getCaption=function(){return DOMHelper.getText(this.m_node);}
Button.prototype.getGlyph=function(){return this.m_imageClass;}
Button.prototype.setGlyph=function(v){this.setImageClass(v);}
Button.prototype.getImageFontName=function(){return this.m_imageFontName;}
Button.prototype.setImageFontName=function(v){this.m_imageFontName=v;}
Button.prototype.getImageClass=function(){return this.m_imageClass;}
Button.prototype.setImageClass=function(v){this.m_imageClass=v;if(v){var fn=this.getImageFontName();var n;if(this.m_node){var ar=DOMHelper.getElementsByAttr(fn,this.m_node,"class",true,this.m_imageTag);if(ar&&ar.length){n=ar[0];n.className=fn+" "+v;}}
if(!n){n=document.createElement(this.m_imageTag);n.className=(v.indexOf(fn+"-")>=0)?(fn+" "+v):v;if(this.m_imagePosition=="after"){this.m_node.appendChild(n);}
else{var tn=DOMHelper.firstChildElement(this.m_node,3);if(tn){tn.parentNode.insertBefore(n,tn);}
else{this.m_node.appendChild(n);}}}}}
Button.prototype.getGlyphPopUp=function(){return this.m_glyphPopUp;}
Button.prototype.setGlyphPopUp=function(v){this.m_glyphPopUp=v;}
Button.prototype.setOnClick=function(onClick){var self=this;this.m_onClick=function(e){onClick.call(self,e);}
this.addClick();}
Button.prototype.getOnClick=function(){return this.m_onClick;}
Button.prototype.addClick=function(){var self=this;EventHelper.add(this.m_node,"click",this.m_clickFunc,false);}
Button.prototype.removeClick=function(){var self=this;EventHelper.del(this.m_node,"click",this.m_clickFunc,false);}
Button.prototype.click=function(){this.m_clickFunc.call(this,null);}
Button.prototype.getColorClass=function(){return this.m_colorClass;} 
function ButtonCtrl(id,options){options=options||{};options.className=options.className||"btn btn-default";this.setEditControl(options.editControl);ButtonCtrl.superclass.constructor.call(this,id,options);}
extend(ButtonCtrl,Button);ButtonCtrl.prototype.m_editControl;ButtonCtrl.prototype.setEditControl=function(v){this.m_editControl=v;}
ButtonCtrl.prototype.getEditControl=function(){return this.m_editControl;} 
function ButtonEditCtrl(id,options){options=options||{};options.glyph=options.glyph||"glyphicon-menu-hamburger";options.editControl=options.editControl||options.control;var self=this;options.onClick=options.onClick||function(e){self.onClickEvent(EventHelper.fixKeyEvent(e));}
this.setWinClass(options.winClass||WindowForm);this.setWinParams(options.winParams);this.setWinEditViewOptions(options.winEditViewOptions);ButtonEditCtrl.superclass.constructor.call(this,id,options);}
extend(ButtonEditCtrl,ButtonCtrl);ButtonEditCtrl.prototype.m_winObj;ButtonEditCtrl.prototype.m_winClass;ButtonEditCtrl.prototype.m_winParams;ButtonEditCtrl.prototype.closeWinObj=function(){this.m_winObj.close();delete this.m_winObj;}
ButtonEditCtrl.prototype.setWinClass=function(v){this.m_winClass=v;}
ButtonEditCtrl.prototype.getWinClass=function(v){return this.m_winClass;}
ButtonEditCtrl.prototype.setWinParams=function(v){this.m_winParams=v;}
ButtonEditCtrl.prototype.getWinParams=function(){return this.m_winParams;}
ButtonEditCtrl.prototype.setWinEditViewOptions=function(v){this.m_winEditViewOptions=v;}
ButtonEditCtrl.prototype.getWinEditViewOptions=function(){return this.m_winEditViewOptions;}
ButtonEditCtrl.prototype.onClickEvent=function(e){var win_opts={};win_opts.app=window.getApp();var self=this;win_opts.onClose=function(){self.closeWinObj();};win_opts.URLParams=this.getWinParams();temp_o=new this.m_winClass(win_opts);var ctrl=this.getEditControl();if(ctrl){if(ctrl.getIsRef()){win_opts.keys={};var ctrl_keys=ctrl.getKeys()||{};var ctrl_key_ids=ctrl.getKeyIds();var form_keys={};var form_key_ids=temp_o.getKeyIds();var o_set=false;for(var n=0;n<ctrl_key_ids.length;n++){if(ctrl_keys[ctrl_key_ids[n]]){form_keys[form_key_ids[n]]=ctrl_keys[ctrl_key_ids[n]];o_set=true;}}
if(!o_set){return;}
temp_o.setKeys(form_keys);}}
this.m_winObj=temp_o;this.m_winObj.open();} 
ButtonEditCtrl.prototype.DEF_TITLE="выбрать"; 
function ButtonCalc(id,options){options=options||{};options.glyph=options.glyph||this.DEF_GLYPH;var self=this;options.onClick=options.onClick||function(event){(new Calculator({"editControl":self.getEditControl()}).show());};ButtonCalc.superclass.constructor.call(this,id,options);}
extend(ButtonCalc,ButtonCtrl);ButtonCalc.prototype.DEF_GLYPH="glyphicon-th"; 
ButtonCalc.prototype.DEF_TITLE="открыть калькулятор"; 
function ButtonCalendar(id,options){options=options||{};options.glyph=options.glyph||this.DEF_GLYPH;this.setTimeValueStr(options.timeValueStr||"00:00:00");this.setDateFormat(options.dateFormat||window.getApp().getDateFormat());var self=this;options.onClick=options.onClick||function(event){var p=$(self.getEditControl().getNode());p.datepicker({format:{toDisplay:function(date,format,language){var tm;if(!self.m_editControl.isNull()){var ctrl_val=self.getEditControl().getValue();tm=ctrl_val.getSeconds()*1000+ctrl_val.getMinutes()*60*1000+ctrl_val.getHours()*60*60*1000;}
else{tm=self.m_time;}
var d=new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,tm);var fv=DateHelper.format(d,self.m_dateFormat);return fv;},toValue:function(date,format,language){var v=DateHelper.userStrToDate(date);return v;}},language:"ru",daysOfWeekHighlighted:"0,6",autoclose:true,todayHighlight:true,orientation:"bottom right",showOnFocus:false,clearBtn:true});p.on("hide",function(ev){self.getEditControl().applyMask();});p.on("changeDate",function(ev){if(self.m_prevDate!=ev.date)
self.getEditControl().onSelectValue();self.m_prevDate=ev.date;});p.datepicker("show");};ButtonCalendar.superclass.constructor.call(this,id,options);}
extend(ButtonCalendar,ButtonCtrl);ButtonCalendar.prototype.DEF_GLYPH="glyphicon-calendar";ButtonCalendar.prototype.m_time;ButtonCalendar.prototype.m_dateFormat;ButtonCalendar.prototype.m_prevDate;ButtonCalendar.prototype.setDateFormat=function(v){this.m_dateFormat=v;}
ButtonCalendar.prototype.getDateFormat=function(){return this.m_dateFormat;}
ButtonCalendar.prototype.setTimeValueStr=function(v){this.m_time=DateHelper.timeToMS(v);}
ButtonCalendar.prototype.getDateFormat=function(){return this.m_dateFormat;} 
ButtonCalendar.prototype.DEF_TITLE="открыть календарь";ButtonCalendar.prototype.DEF_ALT="кал."; 
function ButtonClear(id,options){options=options||{};options.glyph="glyphicon-remove";this.m_onClear=options.onClear;var self=this;options.onClick=options.onClick||function(event){self.getEditControl().reset();if(this.m_onClear)this.m_onClear();};ButtonClear.superclass.constructor.call(this,id,options);}
extend(ButtonClear,ButtonCtrl); 
ButtonClear.prototype.DEF_TITLE="очистить значение"; 
function ButtonCmd(id,options){options=options||{};options.colorClass="btn-primary";options.className="btn "+options.colorClass+" btn-cmd";options.caption=options.caption||this.DEF_CAPTION;ButtonCmd.superclass.constructor.call(this,id,options);}
extend(ButtonCmd,Button);ButtonCmd.prototype.DEF_CAPTION=""; 
function ButtonExpToExcel(id,options){options=options||{};ButtonExpToExcel.superclass.constructor.call(this,id,options);}
extend(ButtonExpToExcel,ButtonCmd); 
ButtonExpToExcel.prototype.DEF_TITLE="экспорт в Excel";ButtonExpToExcel.prototype.DEF_CAPTION="Excel"; 
function ButtonExpToPDF(id,options){options=options||{};ButtonExpToPDF.superclass.constructor.call(this,id,options);}
extend(ButtonExpToPDF,ButtonCmd); 
ButtonExpToPDF.prototype.DEF_TITLE="экспорт в PDF";ButtonExpToPDF.prototype.DEF_CAPTION="PDF"; 
function ButtonOpen(id,options){options=options||{};options.glyph="glyphicon-pencil";ButtonOpen.superclass.constructor.call(this,id,options);}
extend(ButtonOpen,ButtonEditCtrl); 
ButtonOpen.prototype.DEF_TITLE="открыть"; 
function ButtonInsert(id,options){options=options||{};options.glyph="glyphicon-plus";var self=this;options.onClick=options.onClick||function(event){self.doInsert(EventHelper.fixMouseEvent(event));};ButtonInsert.superclass.constructor.call(this,id,options);}
extend(ButtonInsert,ButtonCtrl);ButtonInsert.prototype.doInsert=function(e){console.log("ButtonInsert.prototype.openInsert");} 
ButtonInsert.prototype.DEF_TITLE="добавить"; 
function ButtonPrint(id,options){options=options||{};var self=this;options.onClick=options.onClick||function(){self.onClick();};this.m_fieldId=options.fieldId;this.m_DOMId=options.DOMId;this.m_controller=options.controller;this.m_methodId=options.methodId||this.DEF_METH;ButtonPrint.superclass.constructor.call(this,id,options);}
extend(ButtonPrint,ButtonCmd);ButtonPrint.prototype.onClick=function(){if(this.m_DOMId){var pm=this.m_controller.getPublicMethod();pm.setFieldValue(this.m_paramId,CommonHelper.nd(this.m_DOMId).getAttribute("old_id"));}
this.m_controller.run(this.m_methodId,{xml:false,ok:function(resp){WindowPrint.show({content:resp});}});}
ButtonPrint.prototype.DEF_METH="get_print"; 
ButtonPrint.prototype.DEF_TITLE="напечатать";ButtonPrint.prototype.DEF_CAPTION="Печать"; 
function ButtonPrintList(id,options){options=options||{};options.className=options.className||this.DEF_CLASS;var btn_class=(options.buttonClassName||this.DEF_BTN_CLASS)+" dropdown-toggle";this.m_button=new ControlContainer(CommonHelper.uniqid(),"button",{"className":btn_class,"value":this.DEF_CAPTION,"title":this.DEF_TITLE,"attrs":{"type":"button","data-toggle":"dropdown"},"elements":[new Control(CommonHelper.uniqid(),"i",{"className":"glyphicon "+this.DEF_GLYPH})]});this.m_keyIds=options.keyIds;var print_ctrls=[];this.m_objList=[];this.m_buttons=new ControlContainer(CommonHelper.uniqid(),"ul",{"className":"dropdown-menu"});this.setPrintList(options.printList);options.elements=[this.m_button,this.m_buttons];ButtonPrintList.superclass.constructor.call(this,id,(options.tagName||this.DEF_TAG_NAME),options);}
extend(ButtonPrintList,ControlContainer);ButtonPrintList.prototype.DEF_TAG_NAME="div";ButtonPrintList.prototype.DEF_CLASS="btn dropdown";ButtonPrintList.prototype.DEF_BTN_CLASS="btn btn-primary";ButtonPrintList.prototype.DEF_GLYPH="glyphicon-triangle-bottom";ButtonPrintList.prototype.m_buttons;ButtonPrintList.prototype.m_button;ButtonPrintList.prototype.m_objList;ButtonPrintList.prototype.m_keyIds;ButtonPrintList.prototype.getObjList=function(){return this.m_objList;}
ButtonPrintList.prototype.addToList=function(obj){this.m_buttons.addElement(obj.getControl());this.m_objList.push(obj);}
ButtonPrintList.prototype.setGrid=function(v){for(var i=0;i<this.m_objList.length;i++){this.m_objList[i].setGrid(v);this.m_objList[i].setKeyIds(this.m_keyIds);}}
ButtonPrintList.prototype.getKeyIds=function(v){return this.m_keyIds;}
ButtonPrintList.prototype.setPrintList=function(printList){this.m_buttons.clear();if(printList&&printList.length){for(var i=0;i<printList.length;i++){this.m_buttons.addElement(printList[i].getControl());this.m_objList.push(printList[i]);}}} 
ButtonPrintList.prototype.DEF_CAPTION="Печать";ButtonPrintList.prototype.DEF_TITLE="Показать список печатных форм"; 
function ButtonSelectRef(id,options){options=options||{};this.setMultySelect((options.multySelect==undefined)?false:options.multySelect);this.m_descrIds=options.descrIds;this.m_keyIds=options.keyIds;this.setOnSelect(options.onSelect);this.setFormatFunction(options.formatFunction);ButtonSelectRef.superclass.constructor.call(this,id,options);}
extend(ButtonSelectRef,ButtonEditCtrl);ButtonSelectRef.prototype.m_multySelect;ButtonSelectRef.prototype.m_descrIds;ButtonSelectRef.prototype.m_keyIds;ButtonSelectRef.prototype.m_onSelect;ButtonSelectRef.prototype.getMultySelect=function(){return this.m_multySelect;}
ButtonSelectRef.prototype.setMultySelect=function(v){this.m_multySelect=v;}
ButtonSelectRef.prototype.onClickEvent=function(e){var win_opts={};var self=this;win_opts.app=window.getApp();win_opts.onClose=function(){self.closeWinObj();};win_opts.URLParams=this.getWinParams();var ed_opts=this.getWinEditViewOptions();console.log("ed_opts".ed_opts)
if(ed_opts){win_opts.params={"editViewOptions":ed_opts}}
this.m_winObj=new this.m_winClass(win_opts);var win=this.m_winObj.open();win.onSelect=function(fields){self.onSelect(fields);}}
ButtonSelectRef.prototype.onSelect=function(fields){var ctrl=this.getEditControl();if(ctrl&&ctrl.getKeyIds){var ctrl_keys={};var ctrl_key_ids=ctrl.getKeyIds();var model_key_ids;if(this.m_keyIds){model_key_ids=this.m_keyIds;}
else{model_key_ids=this.m_winObj.getKeyIds();}
for(var n=0;n<ctrl_key_ids.length;n++){if(fields[model_key_ids[n]]){ctrl_keys[ctrl_key_ids[n]]=fields[model_key_ids[n]].getValue();}}
var ctrl_descr="";var format_f=this.getFormatFunction();if(format_f){ctrl_descr=format_f.call(ctrl,fields);}
else if(this.m_descrIds){for(var n=0;n<this.m_descrIds.length;n++){if(fields[this.m_descrIds[n]]){var f_val=fields[this.m_descrIds[n]].getValue();ctrl_descr+=(ctrl_descr=="")?"":" ";if(typeof f_val=="object"&&f_val.getDescr){ctrl_descr+=f_val.getDescr();}
else{ctrl_descr+=f_val;}}}}
else{for(var fid in fields){if(!fields[fid].getPrimaryKey()){ctrl_descr+=(ctrl_descr=="")?"":" ";ctrl_descr+=fields[fid].getValue();}}}
ctrl.setValue(new RefType({"keys":ctrl_keys,"descr":ctrl_descr}));ctrl.focus();ctrl.onSelectValue(fields);}else if(ctrl){ctrl.onSelectValue(fields);}
if(!this.getMultySelect()){this.m_winObj.close();}
else if(ctrl&&ctrl.onSelectValue){ctrl.onSelectValue(fields);}}
ButtonSelectRef.prototype.setOnSelect=function(v){this.m_onSelect=v;}
ButtonSelectRef.prototype.getOnSelect=function(){return this.m_onSelect;}
ButtonSelectRef.prototype.setFormatFunction=function(v){this.m_formatFunction=v;}
ButtonSelectRef.prototype.getFormatFunction=function(){return this.m_formatFunction;} 
ButtonSelectRef.prototype.DEF_TITLE="выбрать из списка";ButtonSelectRef.prototype.DEF_SEL_FORM_TITLE="Выбор"; 
function ButtonSelectDataType(id,options){options=options||{};this.m_compoundControl=options.compoundControl;options.glyph=options.glyph||"glyphicon-random";var self=this;options.onClick=options.onClick||function(event){self.doSelect(EventHelper.fixMouseEvent(event));}
ButtonSelectDataType.superclass.constructor.call(this,id,options);}
extend(ButtonSelectDataType,ButtonCtrl);ButtonSelectDataType.prototype.m_form;ButtonSelectDataType.prototype.m_compoundControl;ButtonSelectDataType.prototype.doSelect=function(e){var data_types=this.m_compoundControl.getPossibleDataTypes();var rows=[];for(var t in data_types){rows.push({"fields":{"dataTypeDescrLoc":data_types[t].dataTypeDescrLoc,"dataType":t}});}
var model=new ModelJSON("dataTypeList",{"fields":["dataType","dataTypeDescrLoc"],"data":{"rows":rows}});var self=this;var ctrl_id=this.getId()+":selectDataType:form:body:view:grid";this.m_view=new View(this.getId()+":selectDataType:form:body:view",{"elements":[new Grid(ctrl_id,{"keyIds":["dataType"],"showHead":false,"model":model,"head":new GridHead(ctrl_id+":head",{"elements":[new GridRow(ctrl_id+":head:row0",{"elements":[new GridCellHead(ctrl_id+":head:dataTypeDescrLoc",{"columns":[new GridColumn({"field":model.getField("dataTypeDescrLoc")})]})]})]}),"onSelect":function(fields){self.onSelect(fields);}})]});this.m_form=new WindowFormModalBS(this.getId()+":selectDataType:form",{"cmdCancel":true,"cmdOk":true,"onClickCancel":function(){self.m_form.close();},"onClickOk":function(){self.onSelect(self.m_view.getElement("grid").getModelRow());},"content":this.m_view,"contentHead":this.HEAD_TITLE});this.m_form.open();}
ButtonSelectDataType.prototype.onSelect=function(fields){this.m_compoundControl.setDataType(fields.dataType.getValue());this.m_form.close();} 
ButtonSelectDataType.prototype.HEAD_TITLE="Выберите тип данных";ButtonSelectDataType.prototype.DEF_TITLE="Выбрать тип данных";ButtonSelectDataType.prototype.TXT_UNASSIGNED_TYPE="<тип не задан>"; 
function ButtonMakeSelection(id,options){options=options||{};options.glyph=options.glyph||"glyphicon-save-file";ButtonMakeSelection.superclass.constructor.call(this,id,options);}
extend(ButtonMakeSelection,ButtonCmd); 
ButtonMakeSelection.prototype.DEF_CAPTION="Выбрать ";ButtonMakeSelection.prototype.DEF_TITLE="выбрать и закрыть форму"; 
function ButtonToggle(id,options){options=options||{};options.className="btn btn-link";options.glyph="glyphicon-triangle-bottom";options.attrs=options.attrs||{};options.attrs["data-toggle"]="collapse";options.attrs["data-target"]=("#"+options.dataTarget);ButtonToggle.superclass.constructor.call(this,id,options);}
extend(ButtonToggle,Button); 
function Label(id,options){options=options||{};options.className=(options.className!==undefined)?options.className:(this.DEF_CLASS+" "+window.getBsCol(this.DEF_COL_WD));options.value=options.value||options.caption;Label.superclass.constructor.call(this,id,(options.tagName||this.DEF_TAG_NAME),options);}
extend(Label,Control);Label.prototype.DEF_TAG_NAME="label";Label.prototype.DEF_CLASS="control-label";Label.prototype.DEF_COL_WD="4"; 
function Edit(id,options){options=options||{};options.attrs=options.attrs||{};if(id&&(options.html==undefined&&options.template==undefined)){var n=CommonHelper.nd(id,this.getWinObjDocument());if(n){n.id=n.id+":cont";}}
else if(!id){id=CommonHelper.uniqid();}
if(options.inline===true){options.contClassName="";options.editContClassName="";options.className="";options.btnContClassName="";options.contTagName="SPAN";options.editContTagName="SPAN";}
options.className=(options.className!==undefined)?options.className:this.DEF_CLASS;if(options.addClassName!=undefined){options.className+=" "+options.addClassName;}
options.attrs.type=options.attrs.type||options.type||this.DEF_INPUT_TYPE;options.attrs.maxlength=options.attrs.maxlength||options.maxlength||((options.editMask)?options.editMask.length:undefined);this.setValidator(options.validator);if(options.cmdAutoComplete!=undefined&&!options.cmdAutoComplete){options.inputEnabled=false;}
this.m_formatterOptions=options.formatterOptions;this.m_formatterGetRawValue=options.formatterGetRawValue;Edit.superclass.constructor.call(this,id,options.tagName||this.DEF_TAG_NAME,options);if(options.editMask){this.setEditMask(options.editMask);}
this.setRegExpression(options.regExpression);this.setRegExpressionInvalidMessage(options.regExpressionInvalidMessage);if(options.label){this.setLabel(options.label);}
else if(options.labelCaption||options.labelOptions){options.labelOptions=options.labelOptions||{"attrs":{"for":id}};options.labelOptions.value=options.labelOptions.value||options.labelCaption;options.labelOptions.className=options.labelOptions.className||options.labelClassName;options.labelOptions.visible=this.getVisible();this.setLabel(new Label(id+":label",options.labelOptions));}
this.setErrorControl((options.errorControl!==undefined)?options.errorControl:((this.m_html)?null:new ErrorControl(id+":error")));this.setButtonOpen(options.buttonOpen);this.setButtonSelect(options.buttonSelect);this.setButtonClear(options.buttonClear);this.setBtnContClassName((options.btnContClassName!=undefined)?options.btnContClassName:this.BTNS_CONTAINER_CLASS);var btn_opt="button";for(opt in options){if(opt.substring(0,btn_opt.length)==btn_opt&&opt.length>btn_opt.length){this.addButtonContainer();break;}}
this.setFormatFunction(options.formatFunction);this.setLabelAlign(options.labelAlign||this.DEF_LABEl_ALIGN);this.setContClassName((options.contClassName!==undefined)?options.contClassName:this.DEF_CONT_CLASS);this.setContTagName(options.contTagName||this.DEF_CONT_TAG);this.setEditContClassName((options.editContClassName!==undefined)?options.editContClassName:(this.DEF_EDIT_CONT_CLASS+" "+window.getBsCol(8)));this.setEditContTagName(options.editContTagName||this.DEF_EDIT_CONT_TAG);if(options.inputEnabled!=undefined&&!options.inputEnabled&&this.getEnabled()){this.setInputEnabled(false);}
if(options.cmdAutoComplete||options.autoComplete){if(!options.acPublicMethod&&options.acController){options.acPublicMethod=options.acController.getPublicMethod("complete");}
var self=this;options.autoComplete=options.autoComplete||(new actbAJX({"minLengthForQuery":options.acMinLengthForQuery,"onSelect":function(fields){self.onSelectValue(fields);},"model":options.acModel,"publicMethod":options.acPublicMethod,"patternFieldId":options.acPatternFieldId,"control":this,"keyFields":options.acKeyFields,"descrFields":options.acDescrFields,"descrFunction":options.acDescrFunction,"icase":options.acICase,"mid":options.acMid,"enabled":options.acEnabled,"resultFieldIdsToAttr":options.acResultFieldIdsToAttr,"onCompleteTextOut":options.acOnCompleteTextOut}));actb(this.m_node,options.winObj,options.autoComplete);}
this.setAutoComplete(options.autoComplete);this.setOnReset(options.onReset);this.setOnSelect(options.onSelect);}
extend(Edit,Control);Edit.prototype.DEF_TAG_NAME="INPUT";Edit.prototype.DEF_INPUT_TYPE="text";Edit.prototype.DEF_CLASS="form-control";Edit.prototype.BTNS_CONTAINER_CLASS="input-group-btn";Edit.prototype.INCORRECT_VAL_CLASS="error";Edit.prototype.DEF_CONT_CLASS="form-group";Edit.prototype.DEF_EDIT_CONT_CLASS="input-group";Edit.prototype.DEF_CONT_TAG="DIV";Edit.prototype.DEF_EDIT_CONT_TAG="DIV";Edit.prototype.VAL_INIT_ATTR="initValue";Edit.prototype.DEF_LABEl_ALIGN="left";Edit.prototype.m_editMask;Edit.prototype.m_regExpression;Edit.prototype.m_buttons;Edit.prototype.m_value;Edit.prototype.m_label;Edit.prototype.m_container;Edit.prototype.m_editContainer;Edit.prototype.m_errorControl;Edit.prototype.m_contTagName;Edit.prototype.m_contClassName;Edit.prototype.m_buttonOpen;Edit.prototype.m_buttonSelect;Edit.prototype.m_buttonClear;Edit.prototype.m_formatFunction;Edit.prototype.m_editContTagName;Edit.prototype.m_enabled;Edit.prototype.m_labelAlign;Edit.prototype.m_btnContClassName;Edit.prototype.m_autoComplete;Edit.prototype.addButtonContainer=function(){this.m_buttons=new ControlContainer(this.getId()+":btn-cont","SPAN",{"className":this.m_btnContClassName,"enabled":this.getEnabled()});this.addButtonControls();}
Edit.prototype.addButtonControls=function(){if(this.m_buttonOpen)this.m_buttons.addElement(this.m_buttonOpen);if(this.m_buttonSelect)this.m_buttons.addElement(this.m_buttonSelect);if(this.m_buttonClear)this.m_buttons.addElement(this.m_buttonClear);}
Edit.prototype.setRegExpression=function(v){this.m_regExpression=v}
Edit.prototype.getRegExpression=function(mask){return this.m_regExpression;}
Edit.prototype.setRegExpressionInvalidMessage=function(v){this.m_regExpressionInvalidMessage=v}
Edit.prototype.getRegExpressionInvalidMessage=function(mask){return this.m_regExpressionInvalidMessage;}
Edit.prototype.setEditMask=function(mask){this.m_editMask=mask}
Edit.prototype.getEditMask=function(mask){return this.m_editMask;}
Edit.prototype.applyMask=function(){if(window["Cleave"]&&this.m_formatterOptions){this.m_cleave=new Cleave(this.m_node,this.m_formatterOptions);}
else if(this.getEditMask()){$(this.getNode()).mask(this.getEditMask());}}
Edit.prototype.getFormattedValue=function(){var res;if(this.getEditMask()){res=this.m_node.value;}
else{res=this.formatOutputValue(this.getValue());}
return res;}
Edit.prototype.formatOutputValue=function(val){return val;}
Edit.prototype.setValue=function(val){if(this.m_validator){val=this.m_validator.correctValue(val);}
if(this.m_cleave){this.m_cleave.setRawValue((this.m_formatterOptions.prefix?this.m_formatterOptions.prefix:"")+val);}else{this.getNode().value=this.formatOutputValue(val);this.applyMask();}
if(this.m_eventFuncs&&this.m_eventFuncs.change){this.m_eventFuncs.change();}}
Edit.prototype.getValue=function(){if(this.m_node){if(this.m_cleave){var v=this.m_formatterGetRawValue?(!this.m_formatterOptions.prefix?this.m_cleave.getRawValue():this.m_cleave.getRawValue().substring(this.m_formatterOptions.prefix.length)):this.m_node.value;if(!v||v.length==0){return null;}
else if(this.m_validator){return this.m_validator.correctValue(v);}
else{return v;}}else{var v=this.getEditMask()?$(this.m_node).mask():this.m_node.value;if(!v||v.length==0){return null;}
else if(this.m_validator){return this.m_validator.correctValue(v);}
else{return v;}}}}
Edit.prototype.setInitValue=function(val){this.setValue(val);this.setAttr(this.VAL_INIT_ATTR,this.getValue());}
Edit.prototype.getInitValue=function(){return this.getAttr(this.VAL_INIT_ATTR);}
Edit.prototype.setLabel=function(label){if(typeof label=="string"){throw Error(this.ER_LABEL_OBJECT);}
this.m_label=label;}
Edit.prototype.getLabel=function(){return this.m_label;}
Edit.prototype.setValidator=function(v){this.m_validator=v;}
Edit.prototype.getValidator=function(){return this.m_validator;}
Edit.prototype.validate=function(){var res=true;if(this.m_validator){try{this.setValid();var v=this.getValue();this.m_validator.validate(v);if(v&&v.length&&this.m_regExpression&&this.m_regExpression.test&&!this.m_regExpression.test(v)){throw new Error(this.getRegExpressionInvalidMessage()||this.ER_REGEXP_INVALID);}}
catch(e){this.setNotValid(e.message);res=false;}}
return res;}
Edit.prototype.setButtonOpen=function(v){this.m_buttonOpen=v;if(this.m_buttonOpen&&this.m_buttonOpen.setEditControl){this.m_buttonOpen.setEditControl(this);}}
Edit.prototype.getButtonOpen=function(){return this.m_buttonOpen;}
Edit.prototype.setButtonClear=function(v){this.m_buttonClear=v;if(this.m_buttonClear&&this.m_buttonClear.setEditControl){this.m_buttonClear.setEditControl(this);}}
Edit.prototype.getButtonClear=function(){return this.m_buttonClear;}
Edit.prototype.setButtonSelect=function(v){this.m_buttonSelect=v;if(this.m_buttonSelect&&this.m_buttonSelect.setEditControl){this.m_buttonSelect.setEditControl(this);}}
Edit.prototype.getButtonSelect=function(){return this.m_buttonSelect;}
Edit.prototype.getButtons=function(){return this.m_buttons;}
Edit.prototype.setNotValid=function(erStr){DOMHelper.addClass(this.m_node,this.INCORRECT_VAL_CLASS);if(this.getErrorControl()){this.getErrorControl().setValue(erStr);}
else{throw new Error(erStr);}}
Edit.prototype.setValid=function(){DOMHelper.delClass(this.m_node,this.INCORRECT_VAL_CLASS);if(this.getErrorControl())this.getErrorControl().clear();}
Edit.prototype.toDOM=function(parent){var node_parent;if(!this.m_html){var id=this.getId();this.m_container=new ControlContainer((id?id+":cont":null),this.m_contTagName,{"className":this.m_contClassName,"visible":this.getVisible()});if(this.m_label&&this.m_labelAlign=="left"){this.m_container.addElement(this.m_label);}
this.m_editContainer=new Control((id?id+":edit-cont":null),this.m_editContTagName,{"className":this.m_editContClassName});this.m_container.addElement(this.m_editContainer);this.m_container.toDOM(parent);node_parent=this.m_editContainer.getNode();}
Edit.superclass.toDOM.call(this,node_parent);this.applyMask();if(this.m_buttons&&!this.m_buttons.isEmpty()){this.m_buttons.toDOMAfter(this.getNode());}
if(this.m_label&&this.m_labelAlign=="right"){this.m_label.toDOMAfter(this.getNode());}
if(this.m_errorControl){this.m_errorControl.toDOM(this.m_container.getNode());}}
Edit.prototype.toDOMBefore=function(node){var node_parent;if(!this.m_html){var id=this.getId();this.m_container=new ControlContainer(((id)?id+":cont":null),this.m_contTagName,{"className":this.m_contClassName,"visible":this.getVisible()});if(this.m_label&&this.m_labelAlign=="left"){this.m_container.addElement(this.m_label);}
this.m_editContainer=new Control(((id)?id+":edit-cont":null),this.m_editContTagName,{"className":this.m_editContClassName});this.m_container.addElement(this.m_editContainer);this.m_container.toDOMBefore(node);node_parent=this.m_editContainer.getNode();}
Edit.superclass.toDOM.call(this,node_parent);if(this.m_errorControl){this.m_errorControl.toDOM(node_parent);}
this.applyMask();if(this.m_buttons&&!this.m_buttons.isEmpty()){this.m_buttons.toDOMAfter(this.getNode());}
if(this.m_label&&this.m_labelAlign=="right"){this.m_label.toDOMAfter(this.getNode());}}
Edit.prototype.delDOM=function(){if(this.m_autoComplete){this.m_autoComplete.delDOM();}
Edit.superclass.delDOM.call(this);if(this.m_buttons){this.m_buttons.delDOM();}
if(this.m_errorControl){this.m_errorControl.delDOM();}
if(this.m_editContainer){this.m_editContainer.delDOM();}
if(this.m_container){this.m_container.delDOM();}}
Edit.prototype.setVisible=function(v){Edit.superclass.setVisible.call(this,v);if(this.m_container){this.m_container.setVisible(v);}
if(this.m_label){this.m_label.setVisible(v);}
if(this.m_buttons){this.m_buttons.setVisible(v);}}
Edit.prototype.setEnabled=function(enabled){if(this.m_buttons){this.m_buttons.setEnabled(enabled);if(this.getButtonOpen()&&!enabled){this.getButtonOpen().setEnabled(true);}}
this.setInputEnabled(enabled);this.m_enabled=enabled;}
Edit.prototype.getEnabled=function(){return this.m_enabled;}
Edit.prototype.reset=function(){this.setValue("");this.focus();this.valueChanged();if(this.m_onReset)this.m_onReset();}
Edit.prototype.isNull=function(){var v=this.getValue();return(!v||v.length==0);}
Edit.prototype.getModified=function(){return(this.getValue()!=this.getInitValue());}
Edit.prototype.getIsRef=function(){return false;}
Edit.prototype.getFormatFunction=function(){return this.m_formatFunction;}
Edit.prototype.setFormatFunction=function(v){this.m_formatFunction=v;}
Edit.prototype.getContTagName=function(){return this.m_contTagName;}
Edit.prototype.setContTagName=function(v){this.m_contTagName=v;}
Edit.prototype.getContClassName=function(){return this.m_contClassName;}
Edit.prototype.setContClassName=function(v){this.m_contClassName=v;}
Edit.prototype.getEditContClassName=function(){return this.m_editContClassName;}
Edit.prototype.setEditContClassName=function(v){this.m_editContClassName=v;}
Edit.prototype.setBtnContClassName=function(v){this.m_btnContClassName=v;}
Edit.prototype.getEditContTagName=function(){return this.m_editContTagName;}
Edit.prototype.setEditContTagName=function(v){this.m_editContTagName=v;}
Edit.prototype.setInputEnabled=function(enabled){Edit.superclass.setEnabled.call(this,enabled);}
Edit.prototype.getInputEnabled=function(){return Edit.superclass.getEnabled.call(this);}
Edit.prototype.setErrorControl=function(v){this.m_errorControl=v;}
Edit.prototype.getErrorControl=function(){return this.m_errorControl;}
Edit.prototype.setLabelAlign=function(v){this.m_labelAlign=v;}
Edit.prototype.getLabelAlign=function(){return this.m_labelAlign;}
Edit.prototype.setAutoComplete=function(v){this.m_autoComplete=v;}
Edit.prototype.getAutoComplete=function(){return this.m_autoComplete;}
Edit.prototype.setOnReset=function(v){this.m_onReset=v;}
Edit.prototype.getOnReset=function(){return this.m_onReset;}
Edit.prototype.setOnValueChange=function(v){Edit.superclass.setOnValueChange.call(this,v);var self=this;this.m_onInputChange=function(){self.valueChanged();}
if(v){EventHelper.add(this.getNode(),"keyup",this.m_onInputChange);}
else{EventHelper.del(this.getNode(),"keyup",this.m_onInputChange);}}
Edit.prototype.focus=function(){if(this.getNode().focus)this.getNode().focus();}
Edit.prototype.setMaxLength=function(v){this.setAttr("maxlength",v);if(this.m_validator)this.m_validator.setMaxLength(v);}
Edit.prototype.setOnSelect=function(v){this.m_onSelect=v;}
Edit.prototype.getOnSelect=function(v){return this.m_onSelect;}
Edit.prototype.onSelectValue=function(v){this.valueChanged();if(this.m_onSelect)this.m_onSelect(v);} 
Edit.prototype.ER_LABEL_OBJECT="Неверный параметр label";Edit.prototype.ER_REGEXP_INVALID="Неверное значение"; 
function EditRef(id,options){options=options||{};if(options.keys){this.setKeys(options.keys);}
if(options.keyIds){this.setKeyIds(options.keyIds);}
var w=window.getWidthType();options.cmdInsert=(options.cmdInsert!=undefined)?options.cmdInsert:true;options.cmdSelect=(options.cmdSelect!=undefined)?options.cmdSelect:true;options.cmdOpen=(options.cmdOpen!=undefined)?options.cmdOpen:true;options.cmdClear=(options.cmdClear!=undefined)?options.cmdClear:true;options.cmdAutoComplete=(options.cmdAutoComplete!=undefined)?options.cmdAutoComplete:true;if((w=="sm"&&options.cmdSmInsert)||(w!="sm"&&options.cmdInsert)){options.buttonInsert=options.buttonInsert||new ButtonInsert(id+":btn_insert",{"editControl":this});}
if(!options.buttonSelect&&options.selectWinClass&&((w=="sm"&&options.cmdSmSelect)||(w!="sm"&&options.cmdSelect))){var self=this;options.buttonSelect=new ButtonSelectRef(id+":btn_select",{"winClass":options.selectWinClass,"winParams":options.selectWinParams,"winEditViewOptions":options.selectWinEditViewOptions,"descrIds":options.selectDescrIds,"keyIds":options.selectKeyIds,"control":this,"onSelect":function(fields){self.onSelectValue(fields);},"formatFunction":options.selectFormatFunction,"multySelect":options.selectMultySelect,"enabled":options.enabled});}
if(!options.buttonOpen&&options.editWinClass&&((w=="sm"&&options.cmdSmOpen)||(w!="sm"&&options.cmdOpen))){options.buttonOpen=new ButtonOpen(id+':btn_open',{"winClass":options.editWinClass,"winParams":options.editWinParams,"keyIds":options.openKeyIds,"control":this});}
if((w=="sm"&&options.cmdSmClear)||(w!="sm"&&options.cmdClear)){this.m_onClear=options.onClear;options.buttonClear=options.buttonClear||new ButtonClear(id+":btn_clear",{"editControl":this,"enabled":options.enabled,"onClear":options.onClear});}
this.setButtonInsert(options.buttonInsert);EditRef.superclass.constructor.call(this,id,options);if(!this.getKeyIds().length){throw Error(CommonHelper.format(this.ER_NO_KEY,Array[this.getName()]));}}
extend(EditRef,Edit);EditRef.prototype.KEY_ATTR="keys";EditRef.prototype.KEY_INIT_ATTR="initKeys";EditRef.prototype.ATTR_DISABLED="readOnly";EditRef.prototype.m_buttonInsert;EditRef.prototype.m_keyIds;EditRef.prototype.addButtonControls=function(){if(this.m_buttonInsert)this.m_buttons.addElement(this.m_buttonInsert);if(this.m_buttonOpen)this.m_buttons.addElement(this.m_buttonOpen);if(this.m_buttonSelect)this.m_buttons.addElement(this.m_buttonSelect);if(this.m_buttonClear)this.m_buttons.addElement(this.m_buttonClear);}
EditRef.prototype.keys2Str=function(keys){return CommonHelper.array2json(keys);}
EditRef.prototype.str2Keys=function(str){return CommonHelper.json2obj(str);}
EditRef.prototype.setButtonInsert=function(v){this.m_buttonInsert=v;}
EditRef.prototype.getButtonInsert=function(){return this.m_buttonInsert;}
EditRef.prototype.setKeys=function(keys){if(!CommonHelper.isEmpty(keys)){this.m_keyIds=[];for(var keyid in keys){this.m_keyIds.push(keyid);}}
else if(!this.m_keyIds){this.m_keyIds=[];}
this.setAttr(this.KEY_ATTR,this.keys2Str(keys));if(this.m_onValueChange){this.m_onValueChange.call(this);}}
EditRef.prototype.setKeyIds=function(v){this.m_keyIds=v;}
EditRef.prototype.getKeyIds=function(){return this.m_keyIds;}
EditRef.prototype.getKeys=function(){return this.str2Keys(this.getAttr(this.KEY_ATTR));}
EditRef.prototype.setInitKeys=function(keys){this.setAttr(this.KEY_INIT_ATTR,this.keys2Str(keys));}
EditRef.prototype.getInitKeys=function(){return this.str2Keys(this.getAttr(this.KEY_INIT_ATTR));}
EditRef.prototype.getIsRef=function(){return true;}
EditRef.prototype.getModified=function(){var key=this.getAttr(this.KEY_ATTR);return(key&&key!="{}"&&(key!=this.getAttr(this.KEY_INIT_ATTR)));}
EditRef.prototype.isNull=function(){var res=true;var keys=this.getKeys();if(keys){for(id in keys){if(keys[id]==undefined||keys[id]=="null"){res=true;break;}
res=false;}}
return res;}
EditRef.prototype.resetKeys=function(){var do_reset=false;var keys=this.getKeys();if(keys){for(var k in keys){if(keys[k]!="null"){keys[k]="null";do_reset=true;}}}
if(do_reset)
this.setKeys(keys);}
EditRef.prototype.reset=function(){this.setValue("");this.focus();this.resetKeys();if(this.m_onReset)this.m_onReset();}
EditRef.prototype.setValue=function(val){var descr;if(val&&typeof val=="object"&&val.getKeys&&val.getDescr){this.setKeys(val.getKeys());descr=val.getDescr();}
else if(val&&typeof val=="object"&&val.keys&&val.descr){this.setKeys(val.keys);descr=val.descr;}
else if(val&&typeof val=="object"&&val.m_keys&&val.m_descr){this.setKeys(val.m_keys);descr=val.m_descr;}
else if(val&&typeof val!="object"){descr=val;}
else{descr="";}
if(!descr){descr="";}
EditRef.superclass.setValue.call(this,descr);}
EditRef.prototype.getValue=function(){var descr=EditRef.superclass.getValue.call(this);var res=(new RefType({"keys":this.getKeys(),"descr":descr,"dataType":undefined}));return res;}
EditRef.prototype.getKeyValue=function(key){return this.getValue().getKey(key);}
EditRef.prototype.setInitValue=function(val){this.setValue(val);if(typeof val=="object"&&val.getKeys){this.setInitKeys(val.getKeys());}
else if(typeof val=="object"&&val.keys){this.setInitKeys(val.keys);}}
EditRef.prototype.setOnValueChange=function(v){this.m_onValueChange=v;}
EditRef.prototype.onSelectValue=function(v){if(this.m_onSelect)this.m_onSelect(v);} 
function EditString(id,options){options=options||{};options.validator=options.validator||new ValidatorString(options);var w=window.getWidthType();if((w=="sm"&&options.cmdSmClear===true)||(w!="sm"&&options.cmdClear!==false)){options.buttonClear=options.buttonClear||new ButtonClear(id+":btn_clear",{"editControl":this,"enabled":options.enabled,"onClear":options.onClear});}
EditString.superclass.constructor.call(this,id,options);}
extend(EditString,Edit);EditString.prototype.ATTR_DISABLED="readOnly";EditString.prototype.setValue=function(val){if(val==undefined)return;EditString.superclass.setValue.call(this,val);} 
function EditText(id,options){options=options||{};options.cmdClear=(options.cmdClear!=undefined)?options.cmdClear:false;EditText.superclass.constructor.call(this,id,options);this.setRows(options.rows||this.DEF_ROWS);}
extend(EditText,EditString);EditText.prototype.DEF_TAG_NAME="TEXTAREA";EditText.prototype.DEF_ROWS="5";EditText.prototype.setRows=function(rows){if(rows)this.setAttr("rows",rows);}
EditText.prototype.getRows=function(){return this.getAttr("rows");} 
function EditNum(id,options){options=options||{};options.type=options.type||"text";EditNum.superclass.constructor.call(this,id,options);this.m_allowedChars=[8,0];}
extend(EditNum,EditString);EditNum.prototype.m_allowedChars;EditNum.prototype.handleKeyPress=function(e){if(CommonHelper.inArray(e.which,this.m_allowedChars)==-1&&(e.which<48||e.which>57)){return false;}}
EditNum.prototype.toDOM=function(parent){EditNum.superclass.toDOM.call(this,parent);var self=this;$(this.getNode()).keypress(function(e){return self.handleKeyPress(e);});} 
function EditInt(id,options){options=options||{};options.validator=options.validator||new ValidatorInt(options);options.attrs=options.attrs||{};if(options.minValue){options.attrs.min=options.minValue;}
if(options.maxValue){options.attrs.max=options.maxValue;}
options.cmdClear=(options.cmdClear!=undefined)?options.cmdClear:false;options.cmdSelect=(options.cmdSelect!=undefined)?options.cmdSelect:options.cmdCalc;if(options.cmdSelect==undefined||options.cmdSelect===true){options.buttonSelect=options.buttonSelect||new ButtonCalc(id+":btn_open",{"winObj":options.winObj,"enabled":options.enabled,"editControl":this});}
EditInt.superclass.constructor.call(this,id,options);if(this.m_validator&&!this.m_validator.getUnsigned()){this.m_allowedChars.push(45);}}
extend(EditInt,EditNum); 
function EditFloat(id,options){options=options||{};options.validator=options.validator||new ValidatorFloat(options);if(options.cmdSelect==undefined){options.cmdSelect=false;}
this.m_precision=options.precision||this.DEF_PRECISION;options.attrs=options.attrs||{};options.attrs.step=(options.attrs.step!=undefined)?options.attrs.step:("1,"+("0000000000").substr(0,this.m_precision));EditFloat.superclass.constructor.call(this,id,options);this.m_allowedChars.push(44);this.m_allowedChars.push(46);}
extend(EditFloat,EditInt);EditFloat.prototype.DEF_PRECISION=2;EditFloat.prototype.handleKeyPress=function(e){var res=EditFloat.superclass.handleKeyPress.call(this,e);if(res!==false&&e.which==46){}
return res;}
EditFloat.prototype.setValue=function(val){if(val==undefined){this.getNode().value="";}
else{if(this.m_validator){val=this.m_validator.correctValue(val);}
this.getNode().value=CommonHelper.numberFormat(val,this.m_precision,".","");}} 
function EditMoney(id,options){options=options||{};options.attrs=options.attrs||{};options.attrs.maxlength="15";options.precision="2";EditMoney.superclass.constructor.call(this,id,options);}
extend(EditMoney,EditFloat); 
function EditPhone(id,options){options=options||{};options.editMask=options.editMask||window.getApp().getPhoneEditMask();options.events=options.events||{};options.formatterGetRawValue=true;options.formatterOptions={"prefix":"+7","delimiter":"-","phone":true,"phoneRegionCode":"ru"};options.events.paste=function(e){this.correctPastedData(e);}
EditPhone.superclass.constructor.call(this,id,options);}
extend(EditPhone,EditString);EditPhone.prototype.correctPastedData=function(e){e.stopPropagation();e.preventDefault();var pasted_data;var clipboard_data=e.clipboardData||window.clipboardData;if(!clipboard_data){pasted_data=this.getValue();}
else{pasted_data=clipboard_data.getData("Text").match(/\d+/g).map(Number).join("");if(pasted_data.length>10&&(pasted_data[0]=="8"||pasted_data[0]=="7")){pasted_data=pasted_data.substring(1);}
if(pasted_data.length>10){pasted_data=pasted_data.substring(0,10);}
if(pasted_data.length<10){pasted_data=this.getValue()+pasted_data;}}
this.setValue(pasted_data);} 
function EditEmail(id,options){options=options||{};options.validator=options.validator||new ValidatorEmail(options);EditEmail.superclass.constructor.call(this,id,options);}
extend(EditEmail,EditString); 
function EditPercent(id,options){options=options||{};options.editMask=options.editMask||this.DEF_MASK;EditPercent.superclass.constructor.call(this,id,options);}
extend(EditPercent,EditString);EditPercent.prototype.DEF_MASK="99%"; 
function EditDate(id,options){options=options||{};options.validator=options.validator||new ValidatorDate(options);options.editMask=options.editMask||window.getApp().getDateEditMask();this.setDateFormat(options.dateFormat||window.getApp().getDateFormat());options.attrs=options.attrs||{};options.cmdSelect=(options.cmdSelect!=undefined)?options.cmdSelect:true;this.setTimeValueStr(options.timeValueStr);if(options.cmdSelect){var self=this;options.buttonSelect=options.buttonSelect||new ButtonCalendar(id+':btn_calend',{"dateFormat":this.getDateFormat(),"editControl":this,"timeValueStr":this.getTimeValueStr(),"enabled":options.enabled});}
EditDate.superclass.constructor.call(this,id,options);}
extend(EditDate,EditString);EditDate.prototype.TIME_SEP="T";EditDate.prototype.m_timeValueStr;EditDate.prototype.m_prevValid;EditDate.prototype.setDateFormat=function(v){this.m_dateFormat=v;}
EditDate.prototype.getDateFormat=function(){return this.m_dateFormat;}
EditDate.prototype.toISODate=function(str){if(str=="")return"";var t=str.substr(4,4)+"-"+str.substr(2,2)+"-"+str.substr(0,2);if(str.length>8){t+=this.TIME_SEP+str.substr(8,2);}
if(str.length>10){t+=":"+str.substr(10,2);}
if(str.length>12){t+=":"+str.substr(12,2);}
return t;}
EditDate.prototype.getValue=function(){if(this.m_node&&this.m_node.value){var v=""
if(this.m_cleave){this.m_cleave.getRawValue();}else{var c;for(var i=0;i<this.m_node.value.length;i++){c=this.m_node.value.charAt(i);v+=(c==" "||isNaN(c))?"":c;}}
v=this.toISODate(v);if(v.length==0){v=null;}
else if(this.m_validator){v=this.m_validator.correctValue(v);}
return v;}}
EditDate.prototype.formatOutputValue=function(val){return DateHelper.format(val,this.getDateFormat());}
EditDate.prototype.setInitValue=function(val){this.setValue(val);this.setAttr(this.VAL_INIT_ATTR,this.getValue());}
EditDate.prototype.setTimeValueStr=function(v){this.m_timeValueStr=v;}
EditDate.prototype.getTimeValueStr=function(){return this.m_timeValueStr;}
EditDate.prototype.setOnValueChange=function(v){Edit.superclass.setOnValueChange.call(this,v);var self=this;this.m_onInputChange=function(){var v=self.getValue();var val_valid=(v&&!isNaN(v.getTime()));if(val_valid&&!self.m_prevValid||!val_valid&&self.m_prevValid)
self.onSelectValue();self.m_prevValid=val_valid;}
if(v){EventHelper.add(this.getNode(),"keyup",this.m_onInputChange);}
else{EventHelper.del(this.getNode(),"keyup",this.m_onInputChange);}} 
function EditDateTime(id,options){options=options||{};options.validator=options.validator||new ValidatorDateTime(options);options.editMask=options.editMask||window.getApp().getDateTimeEditMask();options.dateFormat=options.dateFormat||window.getApp().getDateTimeFormat();EditDateTime.superclass.constructor.call(this,id,options);}
extend(EditDateTime,EditDate); 
function EditTime(id,options){options=options||{};options.validator=options.validator||new ValidatorTime(options);options.cmdSelect=(options.cmdSelect!=undefined)?options.cmdSelect:false;options.editMask=options.editMask||this.DEF_MASK;options.dateFormat=options.dateFormat||window.getApp().getTimeFormat();EditTime.superclass.constructor.call(this,id,options);}
extend(EditTime,EditDateTime);EditTime.prototype.DEF_MASK="99:99";EditTime.prototype.PART_SEP=":";EditTime.prototype.MSEC_PART_SEP=".";EditTime.prototype.toISODate=function(str){if(str=="")return"";var t=str.substr(0,2);if(str.length>2){t+=this.PART_SEP+str.substr(2,2);}
if(str.length>4){t+=this.PART_SEP+str.substr(4,2);}
if(str.length>6){t+=this.MSEC_PART_SEP+str.substr(6);}
return t;} 
function EditPassword(id,options){options=options||{};options.cmdClear=(options.cmdClear==undefined)?false:options.cmdClear;EditPassword.superclass.constructor.call(this,id,options);}
extend(EditPassword,EditString);EditPassword.prototype.DEF_INPUT_TYPE="password";EditPassword.prototype.getModified=function(){var v=this.getValue();return(v&&v.length);} 
function EditCheckBox(id,options){options=options||{};options.validator=options.validator||new ValidatorBool(options);options.cmdClear=false;if(options.checked!=undefined){options.value=options.checked;}
var bs_col=window.getBsCol();options.labelClassName=(options.labelClassName!==undefined)?options.labelClassName:(this.DEF_LABEL_CLASS+" "+bs_col+this.DEF_LABEL_COL_WD);options.editContClassName=(options.editContClassName!==undefined)?options.editContClassName:(this.DEF_EDIT_CONT_CLASS+" "+bs_col+this.DEF_EDIT_CONT_COL_WD);EditCheckBox.superclass.constructor.call(this,id,options);}
extend(EditCheckBox,Edit);EditCheckBox.prototype.DEF_INPUT_TYPE="checkbox";EditCheckBox.prototype.DEF_LABEL_CLASS="control-label";EditCheckBox.prototype.DEF_LABEL_COL_WD="11";EditCheckBox.prototype.DEF_EDIT_CONT_COL_WD="1";EditCheckBox.prototype.setChecked=function(checked){this.m_node.checked=checked;if(this.m_eventFuncs&&this.m_eventFuncs.change){this.m_eventFuncs.change();}}
EditCheckBox.prototype.getChecked=function(){return this.m_node.checked;}
EditCheckBox.prototype.getValue=function(){return this.getChecked();}
EditCheckBox.prototype.setValue=function(val){this.setChecked(this.getValidator().correctValue(val));}
EditCheckBox.prototype.switchValue=function(){this.setValue(!this.getValue());}
EditCheckBox.prototype.getInitValue=function(val){return(this.getAttr(this.VAL_INIT_ATTR)=="true");} 
function EditContainer(id,options){options=options||{};if(!options.optionClass){throw Error(this.ER_NO_OPT_CLASS);}
if(!options.tagName){throw Error(this.ER_NO_TAG);}
var n=CommonHelper.nd(id,this.getWinObjDocument());if(n){n.id=n.id+":cont";}
if(options.inline===true){options.contClassName="";options.editContClassName="";options.className="";options.btnContClassName="";options.contTagName="SPAN";options.editContTagName="SPAN";}
options.className=(options.className!==undefined)?options.className:this.DEF_CLASS;this.setValidator(options.validator||new ValidatorString(options));this.setButtonOpen(options.buttonOpen);this.setButtonSelect(options.buttonSelect);this.setButtonClear(options.buttonClear);this.setBtnContClassName((options.btnContClassName!=undefined)?options.btnContClassName:this.BTNS_CONTAINER_CLASS);var btn_opt="button";for(opt in options){if(opt.substring(0,btn_opt.length)==btn_opt&&opt.length>btn_opt.length){this.addButtonContainer();break;}}
options.elements=options.elements||[];this.setAddNotSelected((options.addNotSelected!=undefined)?options.addNotSelected:true);this.setNotSelectedLast((options.notSelectedLast!=undefined)?options.notSelectedLast:false);this.setOptionClass(options.optionClass);this.setOnSelect(options.onSelect);this.m_initValue=options.value;if(this.m_initValue&&this.m_initValue.getKeys&&!this.m_initValue.isNull()){options.attrs=options.attrs||{};options.attrs.keys=CommonHelper.serialize(this.m_initValue.getKeys());}
options.value=undefined;var opt_selected=false;if(this.m_addNotSelected){var def_opt_opts={"value":this.NOT_SELECTED_VAL,"descr":this.NOT_SELECTED_DESCR};}
if(options.options){for(var i=0;i<options.options.length;i++){if(options.options[i]!=undefined&&options.options[i].checked==true){opt_selected=true;break;}}}
var opt_ind=0;if(this.m_addNotSelected&&!this.m_notSelectedLast){if(!opt_selected){opt_selected.checked=true;}
options.elements.push(new options.optionClass(id+":"+opt_ind,def_opt_opts));opt_ind++;}
if(options.options){for(var i=0;i<options.options.length;i++){options.elements.push(new options.optionClass(id+":"+opt_ind,options.options[i]))
opt_ind++;}}
if(this.m_addNotSelected&&this.m_notSelectedLast){if(!opt_selected){opt_selected.checked=true;}
options.elements.push(new options.optionClass(id+":"+opt_ind,def_opt_opts));}
EditContainer.superclass.constructor.call(this,id,options.tagName,options);if(options.label){this.setLabel(options.label);}
else if(options.labelCaption){this.setLabel(new Label(id+":label",{"value":options.labelCaption,"className":options.labelClassName,"visible":this.getVisible()}));}
this.setContClassName((options.contClassName!==undefined)?options.contClassName:this.DEF_CONT_CLASS);this.setContTagName(options.contTagName||this.DEF_CONT_TAG);this.setEditContClassName((options.editContClassName!==undefined)?options.editContClassName:(this.DEF_EDIT_CONT_CLASS+" "+window.getBsCol(8)));this.setEditContTagName(options.editContTagName||this.DEF_EDIT_CONT_TAG);this.setErrorControl(options.errorControl||new ErrorControl(id+":error"));this.setOnReset(options.onReset);}
extend(EditContainer,ControlContainer);EditContainer.prototype.m_label;EditContainer.prototype.m_buttons;EditContainer.prototype.m_errorControl;EditContainer.prototype.m_editContainer;EditContainer.prototype.m_container;EditContainer.prototype.m_addNotSelected;EditContainer.prototype.m_notSelectedLast;EditContainer.prototype.m_optionClass;EditContainer.prototype.m_formatFunction;EditContainer.prototype.m_initValue;EditContainer.prototype.m_buttonOpen;EditContainer.prototype.m_buttonSelect;EditContainer.prototype.m_buttonClear;EditContainer.prototype.m_btnContClassName;EditContainer.prototype.DEF_CONT_TAG="DIV";EditContainer.prototype.DEF_EDIT_CONT_TAG="DIV";EditContainer.prototype.DEF_CLASS="form-control";EditContainer.prototype.DEF_CONT_CLASS="form-group";EditContainer.prototype.BTNS_CONTAINER_CLASS="input-group-btn";EditContainer.prototype.INCORRECT_VAL_CLASS="error";EditContainer.prototype.DEF_EDIT_CONT_CLASS="input-group";EditContainer.prototype.VAL_INIT_ATTR="initValue";EditContainer.prototype.NOT_SELECTED_VAL="null";EditContainer.prototype.BTNS_CONTAINER_CLASS="input-group-btn";EditContainer.prototype.addButtonContainer=function(){this.m_buttons=new ControlContainer(this.getId()+":btn-cont","SPAN",{"className":this.m_btnContClassName,"enabled":this.getEnabled()});this.addButtonControls();}
EditContainer.prototype.addButtonControls=function(){if(this.m_buttonOpen)this.m_buttons.addElement(this.m_buttonOpen);if(this.m_buttonSelect)this.m_buttons.addElement(this.m_buttonSelect);if(this.m_buttonClear)this.m_buttons.addElement(this.m_buttonClear);}
EditContainer.prototype.addOption=function(opt){this.addElement(opt);}
EditContainer.prototype.getIndex=function(){if(this.m_node.options&&this.m_node.options.length){return this.m_node.selectedIndex;}}
EditContainer.prototype.setIndex=function(ind){if(this.m_node.options&&this.m_node.options.length>ind){this.m_node.selectedIndex=ind;this.valueChanged();}}
EditContainer.prototype.getOption=function(){var i=this.getIndex();if(i>=0){return this.getElementByIndex(i);}}
EditContainer.prototype.setValue=function(val){this.setAttr("value",val);}
EditContainer.prototype.getValue=function(){var v=EditContainer.superclass.getValue.call(this);if(v==this.NOT_SELECTED_VAL){v=null;}
return v;}
EditContainer.prototype.setInitValue=function(val){this.setAttr(this.VAL_INIT_ATTR,val);this.setValue(val);}
EditContainer.prototype.getInitValue=function(){var v=this.getAttr(this.VAL_INIT_ATTR);if(v==this.NOT_SELECTED_VAL){v=null;}
return v;}
EditContainer.prototype.setLabel=function(label){this.m_label=label;}
EditContainer.prototype.getLabel=function(){return this.m_label;}
EditContainer.prototype.setValidator=function(v){this.m_validator=v;}
EditContainer.prototype.getValidator=function(){return this.m_validator;}
EditContainer.prototype.getButtons=function(){return this.m_buttons;}
EditContainer.prototype.setNotValid=function(erStr){DOMHelper.addClass(this.m_node,this.INCORRECT_VAL_CLASS);this.getErrorControl().setValue(erStr);}
EditContainer.prototype.setValid=function(){DOMHelper.delClass(this.m_node,this.INCORRECT_VAL_CLASS);if(this.getErrorControl())this.getErrorControl().clear();}
EditContainer.prototype.toDOM=function(parent){var id=this.getId();this.m_container=new ControlContainer((id?id+":cont":null),this.m_contTagName,{"className":this.m_contClassName,"visible":this.getVisible()});if(this.m_label){this.m_container.addElement(this.m_label);}
this.m_editContainer=new Control((id?id+":edit-cont":null),this.m_editContTagName,{"className":this.m_editContClassName});this.m_container.addElement(this.m_editContainer);this.m_container.toDOM(parent);EditContainer.superclass.toDOM.call(this,this.m_editContainer.getNode());this.m_errorControl=new ErrorControl(id?id+":error":null);this.m_errorControl.toDOM(this.m_editContainer.getNode());if(this.m_buttons&&!this.m_buttons.isEmpty()){this.m_buttons.toDOMAfter(this.getNode());}}
EditContainer.prototype.delDOM=function(){EditContainer.superclass.delDOM.call(this);if(this.m_buttons){this.m_buttons.delDOM();}
if(this.m_errorControl){this.m_errorControl.delDOM();}
if(this.m_editContainer){this.m_editContainer.delDOM();}
if(this.m_container){this.m_container.delDOM();}}
EditContainer.prototype.setVisible=function(visible){if(this.m_container){this.m_container.setVisible(visible);}
if(this.m_edit_container){this.m_edit_container.setVisible(visible);}
if(this.m_label){this.m_label.setVisible(visible);}
if(this.m_buttons){this.m_buttons.setVisible(visible);}
EditContainer.superclass.setVisible.call(this,visible);}
EditContainer.prototype.setEnabled=function(enabled){if(this.m_buttons){this.m_buttons.setEnabled(enabled);}
EditContainer.superclass.setEnabled.call(this,enabled);}
EditContainer.prototype.reset=function(){var i=0;if(this.getNotSelectedLast()){i=this.getCount()-1;}
this.setIndex(i);if(this.m_onReset)this.m_onReset();}
EditContainer.prototype.isNull=function(){var v=this.getValue();return(!v||v==this.NOT_SELECTED_VAL);}
EditContainer.prototype.getModified=function(){return(this.getValue()!=this.getInitValue());}
EditContainer.prototype.clear=function(){for(var id in this.m_elements){DOMHelper.delNode(this.m_elements[id].m_node);}
this.m_elements={};}
EditContainer.prototype.getAddNotSelected=function(){return this.m_addNotSelected;}
EditContainer.prototype.setAddNotSelected=function(v){this.m_addNotSelected=v;}
EditContainer.prototype.getNotSelectedLast=function(){return this.m_notSelectedLast;}
EditContainer.prototype.setNotSelectedLast=function(v){this.m_notSelectedLast=v;}
EditContainer.prototype.getOptionClass=function(){return this.m_optionClass;}
EditContainer.prototype.setOptionClass=function(v){this.m_optionClass=v;}
EditContainer.prototype.getIsRef=function(){return false;}
EditContainer.prototype.getFormatFunction=function(){return this.m_formatFunction;}
EditContainer.prototype.setFormatFunction=function(v){this.m_formatFunction=v;}
EditContainer.prototype.getContTagName=function(){return this.m_contTagName;}
EditContainer.prototype.setContTagName=function(v){this.m_contTagName=v;}
EditContainer.prototype.getContClassName=function(){return this.m_contClassName;}
EditContainer.prototype.setContClassName=function(v){this.m_contClassName=v;}
EditContainer.prototype.getEditContClassName=function(){return this.m_editContClassName;}
EditContainer.prototype.setEditContClassName=function(v){this.m_editContClassName=v;}
EditContainer.prototype.getEditContTagName=function(){return this.m_editContTagName;}
EditContainer.prototype.setEditContTagName=function(v){this.m_editContTagName=v;}
EditContainer.prototype.getOnSelect=function(){return this.m_onSelect;}
EditContainer.prototype.setOnSelect=function(v){this.m_onSelect=v;}
EditContainer.prototype.getInputEnabled=function(){return this.getEnabled();}
EditContainer.prototype.setInputEnabled=function(v){this.setEnabled(v);}
EditContainer.prototype.valueChanged=function(){}
EditContainer.prototype.setButtonOpen=function(v){this.m_buttonOpen=v;if(this.m_buttonOpen&&this.m_buttonOpen.setEditControl){this.m_buttonOpen.setEditControl(this);}}
EditContainer.prototype.getButtonOpen=function(){return this.m_buttonOpen;}
EditContainer.prototype.setButtonClear=function(v){this.m_buttonClear=v;if(this.m_buttonClear&&this.m_buttonClear.setEditControl){this.m_buttonClear.setEditControl(this);}}
EditContainer.prototype.getButtonClear=function(){return this.m_buttonClear;}
EditContainer.prototype.setButtonSelect=function(v){this.m_buttonSelect=v;if(this.m_buttonSelect&&this.m_buttonSelect.setEditControl){this.m_buttonSelect.setEditControl(this);}}
EditContainer.prototype.getButtonSelect=function(){return this.m_buttonSelect;}
EditContainer.prototype.getButtons=function(){return this.m_buttons;}
EditContainer.prototype.getErrorControl=function(){return this.m_errorControl;}
EditContainer.prototype.setErrorControl=function(v){this.m_errorControl=v;}
EditContainer.prototype.setBtnContClassName=function(v){this.m_btnContClassName=v;}
EditContainer.prototype.getBtnContClassName=function(){return this.m_btnContClassName;}
EditContainer.prototype.setOnReset=function(v){this.m_onReset=v;}
EditContainer.prototype.getOnReset=function(){return this.m_onReset;}
EditContainer.prototype.validate=function(){var res=true;if(this.m_validator){try{this.setValid();var v=this.getValue();this.m_validator.validate(v);}
catch(e){this.setNotValid(e.message);res=false;}}
return res;} 
EditContainer.prototype.ER_NO_OPT_CLASS="Класс опций не задан.";EditContainer.prototype.ER_NO_TAG="Имя узла не задано";EditContainer.prototype.NOT_SELECTED_DESCR="<не выбрано>"; 
function EditRadioGroup(id,options){options=options||{};options.tagName=options.tagName||this.DEF_TAG_NAME;options.optionClass=options.optionClass||EditRadio;options.addNotSelected=(options.addNotSelected!=undefined)?options.addNotSelected:false;options.className=options.className||"row";EditRadioGroup.superclass.constructor.call(this,id,options);}
extend(EditRadioGroup,EditContainer);EditRadioGroup.prototype.m_label;EditRadioGroup.prototype.DEF_TAG_NAME="div";EditRadioGroup.prototype.addElement=function(ctrl){this.setElement(ctrl.getId(),ctrl);}
EditRadioGroup.prototype.getIndex=function(){var i=0;for(var elem_id in this.m_elements){if(this.m_elements[elem_id].m_node.nodeName.toLowerCase()=="input"&&this.m_elements[elem_id].m_node.checked){return i;}}}
EditRadioGroup.prototype.setValue=function(id){for(var elem_id in this.m_elements){this.m_elements[elem_id].getNode().checked=(this.m_elements[elem_id].getNode().value==id);}}
EditRadioGroup.prototype.setValueByIndex=function(ind){var i=0;for(var elem_id in this.m_elements){if(this.m_elements[elem_id].m_node.nodeName.toLowerCase()=="input"){this.m_elements[elem_id].m_node.checked=(i==ind);i++;}}}
EditRadioGroup.prototype.getValue=function(){var res=null;for(var elem_id in this.m_elements){if(this.m_elements[elem_id].m_node.nodeName.toLowerCase()=="input"&&this.m_elements[elem_id].m_node.checked){res=this.m_elements[elem_id].m_node.value;break;}}
return res;}
EditRadioGroup.prototype.getValueDescr=function(){for(var elem_id in this.m_elements){if(this.m_elements[elem_id].m_node.nodeName.toLowerCase()=="input"&&this.m_elements[elem_id].m_node.checked){return this.m_elements[elem_id].m_node.nodeValue;}}} 
function EditRadio(id,options){options=options||{};options.type=options.type||"radio";options.cmdClear=false;var bs_col=window.getApp().getBsCol();options.labelClassName=(options.labelClassName!=undefined)?options.labelClassName:("control-label "+(bs_col+"11"));options.editContClassName=(options.editContClassName!=undefined)?options.editContClassName:("input-group "+bs_col+"1");EditRadio.superclass.constructor.call(this,id,options);if(options.value&&CommonHelper.isIE()){this.m_node.value=options.value;}
if(options.checked){this.setChecked(options.checked);}}
extend(EditRadio,EditString);EditRadio.prototype.ATTR_DISABLED="disabled";EditRadio.prototype.setChecked=function(checked){this.m_node.checked=checked;}
EditRadio.prototype.getChecked=function(){return this.m_node.checked;} 
function EditSelect(id,options){options=options||{};options.tagName=options.tagName||this.DEF_TAG_NAME;options.optionClass=options.optionClass||EditSelectOption;options.events=options.events||{};this.m_origOnChange=options.events.change;var self=this;options.events.change=function(){self.callOnSelect();if(self.m_origOnChange)self.m_origOnChange();}
EditSelect.superclass.constructor.call(this,id,options);}
extend(EditSelect,EditContainer);EditSelect.prototype.DEF_TAG_NAME="select";EditSelect.prototype.selectOptionById=function(optId){this.m_elements[optId].getNode().selected=true;}
EditSelect.prototype.getIndex=function(){if(this.m_node.options&&this.m_node.options.length){return this.m_node.selectedIndex;}}
EditSelect.prototype.setValue=function(val){if(val==null)val=this.NOT_SELECTED_VAL;EditSelect.superclass.setValue.call(this,val);for(var id in this.m_elements){if(this.m_elements[id].getValue()==val){this.selectOptionById(id);break;}}}
EditSelect.prototype.setIndex=function(ind){EditSelect.superclass.setIndex.call(this,ind);var i=0;for(var id in this.m_elements){if(i==ind){this.selectOptionById(id);break;}
i++;}}
EditSelect.prototype.getValue=function(){var v;if(this.getIndex()>=0){var el=this.getElement(this.getIndex());if(el){v=el.getValue();}
else{v=this.getNode().options[this.m_node.selectedIndex].value;}}
else{v=this.getAttr("value");}
return(!v||v==this.NOT_SELECTED_VAL)?null:v;}
EditSelect.prototype.callOnSelect=function(){if(this.getOnSelect()){this.getOnSelect().call(this);}}
EditSelect.prototype.setEnabled=function(v){if(v){DOMHelper.delAttr(this.getNode(),this.ATTR_DISABLED);}
else{DOMHelper.setAttr(this.getNode(),this.ATTR_DISABLED,this.ATTR_DISABLED);}} 
function EditSelectRef(id,options){options=options||{};options.optionClass=options.optionClass||EditSelectOptionRef;this.setCashable((options.cashable!=undefined)?options.cashable:true);this.setModel(options.model);this.setReadPublicMethod(options.readPublicMethod);this.setKeyIds(options.keyIds);this.setModelKeyFields(options.modelKeyFields);this.setModelKeyIds(options.modelKeyIds);this.setModelDescrFields(options.modelDescrFields);this.setModelDescrIds(options.modelDescrIds);this.setModelDescrFormatFunction(options.modelDescrFormatFunction);this.setDependBaseControl(options.dependBaseControl);this.setDependBaseFieldIds(options.dependBaseFieldIds);this.setDependFieldIds(options.dependFieldIds);this.setAutoRefresh((options.autoRefresh!=undefined)?options.autoRefresh:true);this.m_cashId=options.cashId;this.m_asyncRefresh=(options.asyncRefresh!=undefined)?options.asyncRefresh:true;if(options.value&&typeof(options.value)!="object"&&options.keyIds&&options.keyIds.length){var k_vals={};for(i=0;i<options.keyIds.length;i++){k_vals[options.keyIds[i]]=(i==0)?options.value:null;}
options.value=new RefType({"keys":k_vals});}
if(options.value&&typeof options.value=="object"&&options.value.getKeys){this.m_setKeys=options.value.getKeys();}else if(options.value&&typeof options.value=="object"&&options.value.m_keys){this.m_setKeys=options.value.m_keys;}
EditSelectRef.superclass.constructor.call(this,id,options);if(options.modelDataStr&&this.m_model){if(this.getCashable()){window.getApp().setCashData(this.m_model.getId(),options.modelDataStr);}
this.m_model.setData(options.modelDataStr);}}
extend(EditSelectRef,EditSelect);EditSelectRef.prototype.m_oldEnabled;EditSelectRef.prototype.m_cashable;EditSelectRef.prototype.m_readPublicMethod;EditSelectRef.prototype.m_model;EditSelectRef.prototype.m_keyIds;EditSelectRef.prototype.m_modelKeyFields;EditSelectRef.prototype.m_modelKeyIds;EditSelectRef.prototype.m_modelDescrFields;EditSelectRef.prototype.m_modelDescrIds;EditSelectRef.prototype.m_modelDescrFormatFunction;EditSelectRef.prototype.m_dependBaseControl;EditSelectRef.prototype.m_dependBaseFieldIds;EditSelectRef.prototype.m_dependFieldIds;EditSelectRef.prototype.m_dependControl;EditSelectRef.prototype.m_setKeys;EditSelectRef.prototype.KEY_ATTR="keys";EditSelectRef.prototype.KEY_INIT_ATTR="initKeys";EditSelectRef.prototype.keys2Str=function(keys){return CommonHelper.serialize(keys);}
EditSelectRef.prototype.str2Keys=function(str){return CommonHelper.unserialize(str);}
EditSelectRef.prototype.setKeys=function(keys){if(!CommonHelper.isEmpty(keys)){this.m_keyIds=[];for(var keyid in keys){this.m_keyIds.push(keyid);}}
else if(!this.m_keyIds){this.m_keyIds=[];}
this.setAttr(this.KEY_ATTR,this.keys2Str(keys));if(this.getDependControl()){this.getDependControl().dependOnSelectBase(this.getModelRow());}
if(this.m_onValueChange){this.m_onValueChange.call(this);}}
EditSelectRef.prototype.getKeyIds=function(){return this.m_keyIds;}
EditSelectRef.prototype.setKeyIds=function(v){this.m_keyIds=v;}
EditSelectRef.prototype.getKeys=function(){return this.str2Keys(this.getAttr(this.KEY_ATTR));}
EditSelectRef.prototype.setInitKeys=function(keys){this.setAttr(this.KEY_INIT_ATTR,this.keys2Str(keys));}
EditSelectRef.prototype.getInitKeys=function(){return this.str2Keys(this.getAttr(this.KEY_INIT_ATTR));}
EditSelectRef.prototype.getModified=function(){return(this.getAttr(this.KEY_ATTR)!=this.getAttr(this.KEY_INIT_ATTR));}
EditSelectRef.prototype.getIsRef=function(){return true;}
EditSelectRef.prototype.resetKeys=function(){this.setKeys({});}
EditSelectRef.prototype.reset=function(){EditSelectRef.superclass.reset.call(this);this.resetKeys();}
EditSelectRef.prototype.setValue=function(val){if(typeof val=="string"&&val.substring(0,1)=="{"&&val.substring(val.length-1)=="}"){val=CommonHelper.unserialize(val);}
if(val!=null&&typeof val=="object"&&((val.getKeys&&val.getDescr)||(val.keys&&val.descr)||(val.m_keys&&val.m_descr))){val=val.getKeys?val.getKeys():(val.keys?val.keys:val.m_keys);if(!this.m_keyIds){this.m_keyIds=[];for(var keyid in val){this.m_keyIds.push(keyid);}}}
else{if(!this.getModelKeyFields()){this.defineModelKeyFieds();}
val_str=(val!=null)?val.toString():null;val={};val[this.getModelKeyFields()[0].getId()]=val_str;}
if(!val){return;}
var rec_found;for(var id in this.m_elements){var v=this.m_elements[id].getValue();rec_found=false;for(var vk in v){rec_found=(v[vk]==val[vk]);if(!rec_found){break;}}
if(rec_found){this.selectOptionById(id);break;}}
this.m_setKeys=val;}
EditSelectRef.prototype.selectOptionById=function(optId){EditSelectRef.superclass.selectOptionById.call(this,optId);this.callOnSelect();}
EditSelectRef.prototype.getValue=function(){var ind=this.getIndex();var res=null;if((this.getAddNotSelected()&&!this.getNotSelectedLast()&&ind)||(this.getAddNotSelected()&&this.getNotSelectedLast()&&ind!=(this.getCount()-1))||!this.getAddNotSelected()){var elem=this.getElement(ind);res=!elem?null:new RefType({"keys":this.getKeys(),"descr":elem.getDescr()});}
return res;}
EditSelectRef.prototype.getFormattedValue=function(){var v=this.getValue();if(v&&typeof(v)=="object"&&v.getFormattedValue){v=v.getFormattedValue();}
return v;}
EditSelectRef.prototype.setInitValue=function(val){this.setValue(val);if(typeof val=="object"){this.m_initValue=this.getValue();this.setInitKeys(this.getKeys());}}
EditSelectRef.prototype.getInitValue=function(){return this.getInitKeys();}
EditSelectRef.prototype.setCashable=function(v){this.m_cashable=v;}
EditSelectRef.prototype.getCashable=function(){return this.m_cashable;}
EditSelectRef.prototype.setReadPublicMethod=function(v){this.m_readPublicMethod=v;}
EditSelectRef.prototype.getReadPublicMethod=function(){return this.m_readPublicMethod;}
EditSelectRef.prototype.defineModelKeyFieds=function(){if(this.getModelKeyIds()){var key_fields=[];var ids=this.getModelKeyIds();for(var i=0;i<ids.length;i++){if(this.m_model.fieldExists(ids[i])){key_fields.push(this.m_model.getField(ids[i]));}}
this.setModelKeyFields(key_fields);}
else{var key_fields=[];var fields=this.m_model.getFields();for(var id in fields){if(fields[id].getPrimaryKey()){key_fields.push(fields[id]);}}
this.setModelKeyFields(key_fields);}}
EditSelectRef.prototype.defineModelDescrFieds=function(){if(this.getModelDescrIds()){var key_fields=[];var ids=this.getModelDescrIds();for(var i=0;i<ids.length;i++){if(this.m_model.fieldExists(ids[i])){key_fields.push(this.m_model.getField(ids[i]));}}
this.setModelDescrFields(key_fields);}}
EditSelectRef.prototype.setModel=function(v){this.m_model=v;this.setModelKeyFields(undefined);this.setModelDescrFields(undefined);this.defineModelKeyFieds();this.defineModelDescrFieds();}
EditSelectRef.prototype.getModel=function(){return this.m_model;}
EditSelectRef.prototype.getModelKeyIds=function(){return this.m_modelKeyIds;}
EditSelectRef.prototype.setModelKeyIds=function(v){this.m_modelKeyIds=v;}
EditSelectRef.prototype.getModelKeyFields=function(){return this.m_modelKeyFields;}
EditSelectRef.prototype.setModelKeyFields=function(v){this.m_modelKeyFields=v;}
EditSelectRef.prototype.getModelDescrIds=function(){return this.m_modelDescrIds;}
EditSelectRef.prototype.setModelDescrIds=function(v){this.m_modelDescrIds=v;}
EditSelectRef.prototype.getModelDescrFields=function(){return this.m_modelDescrFields;}
EditSelectRef.prototype.setModelDescrFields=function(v){this.m_modelDescrFields=v;}
EditSelectRef.prototype.getModelDescrFormatFunction=function(){return this.m_modelDescrFormatFunction;}
EditSelectRef.prototype.setModelDescrFormatFunction=function(v){this.m_modelDescrFormatFunction=v;}
EditSelectRef.prototype.toDOM=function(parent){EditSelectRef.superclass.toDOM.call(this,parent);this.onRefresh();}
EditSelectRef.prototype.onGetData=function(resp){var nm=this.getName();if(!this.m_model){return;}
if(resp){var m_data=resp.getModelData(this.m_model.getId());this.m_model.setData(m_data);if(this.getCashable()){window.getApp().setCashData(this.getCashId(),m_data);}}
var old_keys;if(this.m_setKeys){old_keys=this.m_setKeys;this.m_setKeys=undefined;}
else{old_keys=this.getKeys();}
if(!this.getModelKeyFields()){this.defineModelKeyFieds();if(!this.getModelKeyFields()){throw Error(CommonHelper.format(this.ER_NO_LOOKUP,Array(this.getName())));}}
if(!this.getModelDescrFormatFunction()&&!this.getModelDescrFields()){this.defineModelDescrFieds();if(!this.getModelDescrFields()){this.m_modelDescrFields=[];var fields=this.m_model.getFields();var fields=this.m_model.getFields();for(var id in fields){if(!fields[id].getPrimaryKey()){this.m_modelDescrFields.push(fields[id]);}}}
if(!this.getModelKeyFields()){this.setModelDescrFields(this.getModelKeyFields());}}
this.clear();var opt_class=this.getOptionClass();if(this.getAddNotSelected()){var val={};for(var i=0;i<this.m_modelKeyFields.length;i++){val[this.m_modelKeyFields[i].getId()]=this.NOT_SELECTED_VAL;}
var def_opt_opts={"value":val,"descr":this.NOT_SELECTED_DESCR};}
var opt_ind=0;if(this.getAddNotSelected()&&!this.getNotSelectedLast()){this.addElement(new opt_class(this.getId()+":"+opt_ind,def_opt_opts));opt_ind++;}
var opt_checked=false;var ind=0;while(this.m_model.getNextRow()){var opt_key_val={};var key_v,key_id;var cur_opt_checked=false;for(var i=0;i<this.m_modelKeyFields.length;i++){key_v=this.m_modelKeyFields[i].getValue();key_id=this.m_modelKeyFields[i].getId();opt_key_val[key_id]=key_v;if(this.m_modelKeyFields.length==1&&!opt_checked&&old_keys&&old_keys[key_id]&&old_keys[key_id]==key_v){opt_checked=true;cur_opt_checked=true;}}
if(old_keys&&this.m_modelKeyFields.length>1&&!opt_checked){var all_keys_matched=true;for(var key_id in opt_key_val){if(!old_keys[key_id]||old_keys[key_id]!=opt_key_val[key_id]){all_keys_matched=false;break;}}
if(all_keys_matched){opt_checked=true;cur_opt_checked=true;}}
if(cur_opt_checked){this.setAttr(this.KEY_ATTR,this.keys2Str(opt_key_val));}
var descr_val="";var form_f=this.getModelDescrFormatFunction();if(form_f){descr_val=form_f.call(this,this.m_model.getFields());}
else{for(var i=0;i<this.m_modelDescrFields.length;i++){var descr_v=this.m_modelDescrFields[i].getValue();if(descr_v&&descr_v.length){descr_val+=(descr_val=="")?"":" ";descr_val+=this.m_modelDescrFields[i].getValue();}}}
this.addElement(new opt_class(this.getId()+":"+opt_ind,{"checked":cur_opt_checked,"value":opt_key_val,"descr":descr_val,"attrs":{"modelIndex":ind}}));ind++;opt_ind++;}
if(this.getAddNotSelected()&&this.getNotSelectedLast()){if(!opt_checked){def_opt_opts.checked=true;opt_checked=true;}
this.addElement(new opt_class(this.getId()+":"+opt_ind,def_opt_opts));}
for(var elem_id in this.m_elements){this.m_elements[elem_id].toDOM(this.m_node);}
if(!opt_checked&&this.getCount()){this.setIndex(0);}}
EditSelectRef.prototype.getCashId=function(){return this.m_model.getId()+((this.m_cashId!=undefined)?"_"+this.m_cashId:"");}
EditSelectRef.prototype.onRefresh=function(){if(this.getCashable()&&this.m_model){var cash=window.getApp().getCashData(this.getCashId());if(cash){this.m_model.setData(cash);this.onGetData();return;}}
var self=this;this.getReadPublicMethod().run({"async":this.m_asyncRefresh,"ok":function(resp){self.onGetData(resp);},"fail":function(resp,erCode,erStr){self.getErrorControl().setValue(window.getApp().formatError(erCode,erStr));}});}
EditSelectRef.prototype.callOnSelect=function(){var i=this.getIndex();if(i==undefined)return;var model_keys=this.getElement(i).getValue();var key_ids=this.getKeyIds();var keys={};var i=0;for(id in model_keys){keys[key_ids[i]]=model_keys[id];i++;}
this.setKeys(keys);if(this.getOnSelect()){this.m_onSelect.call(this,this.getModelRow());}}
EditSelectRef.prototype.getModelRow=function(){var ind;if(this.getIndex()>=0){ind=this.getNode().options[this.m_node.selectedIndex].getAttribute("modelIndex");}
if(ind!=undefined&&ind>=0){this.m_model.getRow(ind);}
else{this.m_model.reset();}
return this.m_model.getFields();}
EditSelectRef.prototype.setAutoRefresh=function(autoRefresh){this.m_autoRefresh=autoRefresh;}
EditSelectRef.prototype.getAutoRefresh=function(){return this.m_autoRefresh;}
EditSelectRef.prototype.setDependBaseControl=function(v){this.m_dependBaseControl=v;if(this.m_dependBaseControl&&this.m_dependBaseControl.setDependentControl){this.setDependentControl(this);}}
EditSelectRef.prototype.getDependBaseControl=function(){return this.m_dependBaseControl;}
EditSelectRef.prototype.setDependBaseFieldIds=function(v){this.m_dependBaseFieldIds=v;}
EditSelectRef.prototype.getDependBaseFieldIds=function(){return this.m_dependBaseFieldIds;}
EditSelectRef.prototype.setDependFieldIds=function(v){this.m_dependFieldIds=v;}
EditSelectRef.prototype.getDependFieldIds=function(){return this.m_dependFieldIds;}
EditSelectRef.prototype.setDependControl=function(v){this.m_dependControl=v;}
EditSelectRef.prototype.getDependControl=function(){return this.m_dependControl;}
EditSelectRef.prototype.dependOnSelectBase=function(baseModelRow){var pm=this.getReadPublicMethod();if(!pm)return;var contr=pm.getController();var cond_fields,cond_sgns,cond_vals;var cond_keys=this.getDependFieldIds();var base_keys=this.getDependBaseFieldIds();var ind=-1;for(var fid in baseModelRow){var cond_key=undefined;if(!base_keys&&baseModelRow[fid].getPrimaryKey()){ind++;cond_key=cond_keys[ind];}
else if(base_keys){for(ind=0;ind<base_keys.length;ind++){if(base_keys[ind]==fid){cond_key=cond_keys[ind];break;}}}
if(cond_key){cond_fields=((cond_fields==undefined)?"":(cond_fields+contr.PARAM_FIELD_SEP_VAL))+cond_key;cond_sgns=((cond_sgns==undefined)?"":(cond_sgns+contr.PARAM_FIELD_SEP_VAL))+contr.PARAM_SGN_EQUAL;cond_vals=((cond_vals==undefined)?"":(cond_vals+contr.PARAM_FIELD_SEP_VAL))+baseModelRow[fid].getValue();}}
pm.setFieldValue(contr.PARAM_COND_FIELDS,cond_fields);pm.setFieldValue(contr.PARAM_COND_SGNS,cond_sgns);pm.setFieldValue(contr.PARAM_COND_VALS,cond_vals);pm.setFieldValue(contr.PARAM_FIELD_SEP,contr.PARAM_FIELD_SEP_VAL);this.onRefresh();} 
EditSelectRef.prototype.ER_TYPE_NOT_FOUND="Котрол %, не задано ключевое поле.";EditSelectRef.prototype.ER_NO_RESULT="Котрол %, не задано ключевое поле представления.";EditSelectRef.prototype.ER_NO_KEYS="Котрол %, не заданы идентификаторы ключей!"; 
function EditSelectOption(id,options){options=options||{};if(options.checked!=undefined&&options.checked==true){options.attrs=options.attrs||{};options.attrs.selected="selected";}
EditSelectOption.superclass.constructor.call(this,id,(options.tagName||this.DEF_TAG_NAME),options);if(options.descr){this.setDescr(options.descr);}}
extend(EditSelectOption,Control);EditSelectOption.prototype.DEF_TAG_NAME="option";EditSelectOption.prototype.getValue=function(){return this.getAttr("value");}
EditSelectOption.prototype.setValue=function(id){this.setAttr("value",id);}
EditSelectOption.prototype.getDescr=function(){return this.getText();}
EditSelectOption.prototype.setDescr=function(descr){this.setText(descr);} 
function EditSelectOptionRef(id,options){options=options||{};EditSelectOptionRef.superclass.constructor.call(this,id,options);}
extend(EditSelectOptionRef,EditSelectOption);EditSelectOptionRef.prototype.getValue=function(){var str=EditSelectOptionRef.superclass.getValue.call(this);return CommonHelper.unserialize(str);}
EditSelectOptionRef.prototype.setValue=function(keys){var str=CommonHelper.serialize(keys);EditSelectOptionRef.superclass.setValue.call(this,str);} 
function EditRadioGroupRef(id,options){options=options||{};this.setCashable((options.cashable!=undefined)?options.cashable:true);this.setModel(options.model);this.setReadPublicMethod(options.readPublicMethod);this.setKeyField(options.keyField);this.setKeyFieldId(options.keyFieldId);this.setDescrField(options.descrField);this.setDescrFieldId(options.descrFieldId);this.setNotSelectedValue(options.notSelectedValue||this.DEF_NOT_SELECTED_VAL);this.setNotSelectedCaption(options.notSelectedCaption||this.DEF_NOT_SELECTED_CAP);this.setColCount(options.colCount||1);EditRadioGroupRef.superclass.constructor.call(this,id,options);if(options.modelDataStr&&this.m_model){if(this.getCashable()){window.getApp().setCashData(this.m_model.getId(),options.modelDataStr);}
else{this.m_model.setDate(options.modelDataStr);}}}
extend(EditRadioGroupRef,EditRadioGroup);EditRadioGroupRef.prototype.DEF_NOT_SELECTED_VAL="null";EditRadioGroupRef.prototype.m_oldEnabled;EditRadioGroupRef.prototype.m_cashable;EditRadioGroupRef.prototype.m_readPublicMethod;EditRadioGroupRef.prototype.m_model;EditRadioGroupRef.prototype.m_keyFieldId;EditRadioGroupRef.prototype.m_keyField;EditRadioGroupRef.prototype.m_notSelectedCaption;EditRadioGroupRef.prototype.m_notSelectedValue;EditRadioGroupRef.prototype.getCashable=function(){return this.m_cashable;}
EditRadioGroupRef.prototype.setCashable=function(v){this.m_cashable=v;}
EditRadioGroupRef.prototype.setReadPublicMethod=function(v){this.m_readPublicMethod=v;}
EditRadioGroupRef.prototype.getReadPublicMethod=function(){return this.m_readPublicMethod;}
EditRadioGroupRef.prototype.setModel=function(v){this.m_model=v;}
EditRadioGroupRef.prototype.getModel=function(){return this.m_model;}
EditRadioGroupRef.prototype.getKeyFieldId=function(){return this.m_keyFieldId;}
EditRadioGroupRef.prototype.setKeyFieldId=function(v){this.m_keyFieldId=v;}
EditRadioGroupRef.prototype.getKeyField=function(){return this.m_keyField;}
EditRadioGroupRef.prototype.setKeyField=function(v){this.m_keyField=v;}
EditRadioGroupRef.prototype.getDescrFieldId=function(){return this.m_descrFieldId;}
EditRadioGroupRef.prototype.setDescrFieldId=function(v){this.m_descrFieldId=v;}
EditRadioGroupRef.prototype.getDescrField=function(){return this.m_descrField;}
EditRadioGroupRef.prototype.setDescrField=function(v){this.m_descrField=v;}
EditRadioGroupRef.prototype.getNotSelectedValue=function(){return this.m_notSelectedValue;}
EditRadioGroupRef.prototype.setNotSelectedValue=function(v){this.m_notSelectedValue=v;}
EditRadioGroupRef.prototype.getNotSelectedCaption=function(){return this.m_notSelectedCaption;}
EditRadioGroupRef.prototype.setNotSelectedCaption=function(v){this.m_notSelectedCaption=v;}
EditRadioGroupRef.prototype.getColCount=function(){return this.m_colCount;}
EditRadioGroupRef.prototype.setColCount=function(v){this.m_colCount=v;}
EditRadioGroupRef.prototype.onRefresh=function(){if(this.getCashable()&&this.m_model){var cash=window.getApp().getCashData(this.getName());if(cash){this.m_model.setDate(cash);this.onGetData();return;}}
this.m_oldEnabled=this.getEnabled();this.setEnabled(false);var self=this;this.getReadPublicMethod().run({"async":false,"ok":function(resp){self.onGetData(resp);},"fail":function(resp,erCode,erStr){self.setEnabled(self.m_oldEnabled);self.getErrorControl().setValue(window.getApp().formatError(erCode,erStr));}});}
EditRadioGroupRef.prototype.toDOM=function(parent){EditRadioGroupRef.superclass.toDOM.call(this,parent);this.onRefresh();}
EditRadioGroupRef.prototype.onGetData=function(resp){if(!this.m_model)return;if(resp&&this.m_model){this.m_model.setData(resp.getModelData(this.m_model.getId()));if(this.getCashable()){window.getApp().setCashData(this.m_model.getId(),resp.getModelData(this.m_model.getId()));}}
var old_key_val=this.getValue()||this.m_defaultValue;var f=this.getKeyField();if(!f&&this.getKeyFieldId()&&this.m_model.fieldExists(this.getKeyFieldId())){this.setKeyField(this.m_model.getField(this.getKeyFieldId()));}
else if(!f){var fields=this.m_model.getFields();for(var id in fields){if(fields[id].getPrimaryKey()){this.setKeyField(fields[id]);break;}}}
if(!this.getKeyField()){throw Error(CommonHelper.format(this.ER_NO_LOOKUP,Array(this.getName())));}
var f=this.getDescrField();if(!f&&this.getDescrFieldId()&&this.m_model.fieldExists(this.getDescrFieldId())){this.setDescrField(this.m_model.getField(this.getDescrFieldId()));}
else if(!f){var fields=this.m_model.getFields();for(var id in fields){if(!fields[id].getPrimaryKey()){this.setDescrField(fields[id]);break;}}
if(!this.getDescrField()){for(var id in fields){if(fields[id].getPrimaryKey()){this.setDescrField(fields[id]);break;}}}}
if(!this.getDescrField()){throw Error(CommonHelper.format(this.ER_NO_RESULT,Array(this.getName())));}
var self=this;this.clear();var opt_class=this.getOptionClass();if(this.getAddNotSelected()){var def_opt_opts={"className":"a","value":this.getNotSelectedValue(),"labelCaption":this.getNotSelectedCaption(),"name":this.getId(),"events":{"onclick":function(){if(self.m_onSelect){self.m_onSelect();}}}};}
if(this.getAddNotSelected()&&!this.getNotSelectedLast()){this.addElement(new opt_class(this.getId()+":not_selected",def_opt_opts));}
var opt_checked=false;while(this.m_model.getNextRow()){var key_val=this.getKeyField().getValue();opt_checked=opt_checked||(key_val==old_key_val);this.addElement(new opt_class(this.getId()+":id_"+key_val,{"className":"a","checked":(key_val==old_key_val),"value":key_val,"labelCaption":this.getDescrField().getValue(),"name":this.getId(),"events":{"click":function(){if(self.m_onSelect){self.m_onSelect();}}}}));}
if(this.getAddNotSelected()&&this.getNotSelectedLast()){if(!opt_checked){def_opt_opts.checked=true;opt_checked=true;}
this.addElement(new opt_class(this.getId()+":not_selected",def_opt_opts));}
if(!opt_checked&&this.getCount()){this.setIndex(0);}
var columns=[];var col_w=12/this.m_colCount;var bs=window.getApp().getBsCol()+col_w;for(var n=0;n<this.m_colCount;n++){columns.push(new Control(CommonHelper.uniqid(),"div",{"className":bs}));}
var elem;var n=0;for(var elem_id in this.m_elements){elem=this.m_elements[elem_id];if(n==this.m_colCount)n=0;elem.toDOM(columns[n].getNode());n++;}
for(var n=0;n<this.m_colCount;n++){columns[n].toDOM(this.m_node);}
this.setEnabled(this.m_oldEnabled);} 
EditRadioGroupRef.prototype.ER_NO_LOOKUP="Котрол %, не задано ключевое поле.";EditRadioGroupRef.prototype.DEF_NOT_SELECTED_CAP="Все элементы"; 
function PrintObj(options){options=options||{};this.setTempl(options.templ);this.setKeys(options.keys);this.setKeyIds(options.keyIds);this.setPublicMethodKeyIds(options.publicMethodKeyIds);this.setPublicMethod(options.publicMethod);this.setEnabled((options.enabled==undefined)?options.enabled:true);this.setDivider((options.divider==undefined)?options.divider:false);this.setWinParams(options.winParams);var self=this;var id=CommonHelper.uniqid();this.m_control=new ControlContainer(id,"li",{"className":(this.getEnabled()==false)?"disabled":((this.getDivider())?"divider":""),"elements":[new Control(id+":a","a",{"value":options.caption,"events":{"click":function(){self.onClick();}},"attrs":{"href":"#","role":"menuitem"}})]});}
PrintObj.prototype.m_caption;PrintObj.prototype.m_templ;PrintObj.prototype.m_publicMethod;PrintObj.prototype.m_keys;PrintObj.prototype.m_publicMethodKeyIds;PrintObj.prototype.m_enabled;PrintObj.prototype.m_divider;PrintObj.prototype.m_winParams;PrintObj.prototype.m_control;PrintObj.prototype.m_grid;PrintObj.prototype.getCaption=function(){return this.m_control.getElement("a").getValue();}
PrintObj.prototype.setCaption=function(v){this.m_control.getElement("a").setCaption(v)}
PrintObj.prototype.getTempl=function(){return this.m_templ;}
PrintObj.prototype.setTempl=function(v){this.m_templ=v;}
PrintObj.prototype.getPublicMethod=function(){return this.m_publicMethod;}
PrintObj.prototype.setPublicMethod=function(v){this.m_publicMethod=v;}
PrintObj.prototype.getKeys=function(){if(!this.m_keys&&this.m_grid){if(!this.m_keyIds){return this.m_grid.getSelectedNodeKeys();}
else{var m=this.m_grid.getModel();if(m){var keys={};this.m_grid.setModelToCurrentRow();var fields=m.getFields();for(var i=0;i<this.m_keyIds.length;i++){if(fields[this.m_keyIds[i]]){keys[this.m_keyIds[i]]=fields[this.m_keyIds[i]].getValue();}}
return keys;}}}
else if(this.m_keys){return this.m_keys;}}
PrintObj.prototype.setKeys=function(v){this.m_keys=v;}
PrintObj.prototype.getKeyIds=function(){return this.m_keyIds;}
PrintObj.prototype.setKeyIds=function(v){this.m_keyIds=v;}
PrintObj.prototype.getPublicMethodKeyIds=function(){return this.m_publicMethodKeyIds;}
PrintObj.prototype.setPublicMethodKeyIds=function(v){this.m_publicMethodKeyIds=v;}
PrintObj.prototype.getEnabled=function(){return this.m_enabled;}
PrintObj.prototype.setEnabled=function(v){this.m_enabled=v;}
PrintObj.prototype.getDivider=function(){return this.m_divider;}
PrintObj.prototype.setDivider=function(v){this.m_divider=v;}
PrintObj.prototype.getWinParams=function(){return this.m_winParams;}
PrintObj.prototype.setWinParams=function(v){this.m_winParams=v;}
PrintObj.prototype.getControl=function(){return this.m_control;}
PrintObj.prototype.setGrid=function(v){this.m_grid=v;}
PrintObj.prototype.onClick=function(){var keys=this.getKeys();if(keys&&!CommonHelper.isEmpty(keys)){var pm=this.getPublicMethod();var pm_keys=this.getPublicMethodKeyIds();var ind=0;for(var id in keys){pm.setFieldValue(pm_keys[ind],keys[id]);ind++;}
pm.setFieldValue("templ",this.getTempl());var self=this;pm.run({"viewId":"ViewHTMLXSLT","retContentType":"text","ok":function(resp){WindowPrint.show({"content":resp,"print":false,"title":self.getCaption()});}});}} 
function ControlForm(id,tagName,options){options=options||{};ControlForm.superclass.constructor.call(this,id,tagName,options);}
extend(ControlForm,Control);ControlForm.prototype.VAL_INIT_ATTR="initValue";ControlForm.prototype.m_formatFunction;ControlForm.prototype.setValidator=function(v){this.m_validator=v;}
ControlForm.prototype.getValidator=function(){return this.m_validator;}
ControlForm.prototype.setInitValue=function(val){this.setValue(val);this.setAttr(this.VAL_INIT_ATTR,this.getValue());}
ControlForm.prototype.getInitValue=function(val){return this.getAttr(this.VAL_INIT_ATTR);}
ControlForm.prototype.isNull=function(){var v=this.getValue();return(!v||v.length==0);}
ControlForm.prototype.getModified=function(){var v=this.getValue();return(this.getValue()!=this.getInitValue());}
ControlForm.prototype.getIsRef=function(){return false;}
ControlForm.prototype.setValid=function(v){return false;}
ControlForm.prototype.setValue=function(val){if(this.m_validator){val=this.m_validator.correctValue(val);}
ControlForm.superclass.setValue.call(this,val);}
ControlForm.prototype.getFormatFunction=function(){return this.m_formatFunction;}
ControlForm.prototype.setFormatFunction=function(v){this.m_formatFunction=v;}
ControlForm.prototype.getInputEnabled=function(){return this.getEnabled();}
ControlForm.prototype.setInputEnabled=function(v){this.setEnabled(v);} 
function HiddenKey(id,options){options=options||{};options.visible=false;this.setValidator(options.validator);HiddenKey.superclass.constructor.call(this,id,"DIV",options);}
extend(HiddenKey,ControlForm); 
function EditJSON(id,options){options=options||{};EditJSON.superclass.constructor.call(this,id,options.tagName,options);if(options.valueJSON){this.setValue(options.valueJSON);}}
extend(EditJSON,ControlContainer);EditJSON.prototype.getValueJSON=function(){var o={};for(var elem_id in this.m_elements){if(this.m_elements[elem_id]&&!this.m_elements[elem_id].getAttr("notForValue")&&this.m_elements[elem_id].getModified){if(this.m_elements[elem_id]instanceof EditJSON){o[elem_id]=this.m_elements[elem_id].getValueJSON();}
else{o[elem_id]=this.m_elements[elem_id].getValue();}}}
return o;}
EditJSON.prototype.getValue=function(){return CommonHelper.serialize(this.getValueJSON());}
EditJSON.prototype.setValueOrInit=function(v,isInit){var o;if(typeof(v)=="string"){o=CommonHelper.unserialize(v);}
else{o=v;}
for(var id in o){if(this.m_elements[id]&&(!this.m_elements[id].getAttr||!this.m_elements[id].getAttr("notForValue"))){if(isInit&&this.m_elements[id].setInitValue){this.m_elements[id].setInitValue(o[id]);}
else{this.m_elements[id].setValue(o[id]);}}}}
EditJSON.prototype.setValue=function(v){this.setValueOrInit(v,false);}
EditJSON.prototype.setInitValue=function(v){this.setValueOrInit(v,true);}
EditJSON.prototype.setValid=function(){var list=this.getElements();for(var id in list){if(list[id]&&list[id].setValid){list[id].setValid();}}}
EditJSON.prototype.setNotValid=function(str){}
EditJSON.prototype.getModified=function(){var res=false;var list=this.getElements();for(var id in list){if(list[id]&&list[id].getModified&&list[id].getModified()){res=true;break;}}
return res;}
EditJSON.prototype.isNull=function(){var res=true;var list=this.getElements();for(var id in list){if(list[id]&&list[id].isNull&&!list[id].isNull()){res=false;break;}}
return res;}
EditJSON.prototype.reset=function(){for(var elem_id in this.m_elements){if(this.m_elements[elem_id]&&!this.m_elements[elem_id].getAttr("notForValue")&&this.m_elements[elem_id].reset){this.m_elements[elem_id].reset();}}}
EditJSON.prototype.validate=function(){var res=true;for(var elem_id in this.m_elements){if(this.m_elements[elem_id]&&!this.m_elements[elem_id].getAttr("notForValue")&&this.m_elements[elem_id].reset){res=((!this.m_elements[elem_id].validate||this.m_elements[elem_id].validate())&&res);}}
return res;} 
function EditModalDialog(id,options){options=options||{};this.m_cmdOk=(options.cmdOk!=undefined)?options.cmdOk:true;this.m_cmdCancel=(options.cmdCancel!=undefined)?options.cmdCancel:true;this.m_dialogWidth=options.dialogWidth;this.m_viewClass=options.viewClass;this.m_viewOptions=options.viewOptions;this.m_viewTemplate=options.viewTemplate;this.m_headTitle=options.headTitle;this.m_strictValidation=options.strictValidation;this.m_afterOpen=options.afterOpen;var self=this;this.setFormatValue(options.formatValue||function(val){return self.formatValue(val);});options.tagName="A";options.attrs=options.attrs||{};options.attrs.style=((options.attrs.style)?options.attrs.style:"")+"cursor:pointer;";options.events=options.events||{};options.events.click=this.m_onClick;EditModalDialog.superclass.constructor.call(this,id,options);}
extend(EditModalDialog,Edit);EditModalDialog.prototype.toDOM=function(parent){var id=this.getId();this.m_container=new ControlContainer(((id)?id+":cont":null),this.m_contTagName,{"className":this.m_contClassName});if(this.m_label&&this.m_labelAlign=="left"){this.m_container.addElement(this.m_label);}
this.m_container.toDOM(parent);EditModalDialog.superclass.toDOM.call(this,this.m_container.getNode());if(this.m_buttons&&!this.m_buttons.isEmpty()){this.m_buttons.toDOMAfter(this.getNode());}}
EditModalDialog.prototype.m_valueJSON;EditModalDialog.prototype.m_viewClass;EditModalDialog.prototype.m_viewOptions;EditModalDialog.prototype.m_viewTemplate;EditModalDialog.prototype.m_headTitle;EditModalDialog.prototype.m_formatValue;EditModalDialog.prototype.setValue=function(v){if(typeof v=="object"){this.m_valueJSON=v;}
else{this.m_valueJSON=CommonHelper.unserialize(v);}
var v=this.m_formatValue(this.m_valueJSON);this.getNode().textContent=v;}
EditModalDialog.prototype.getValue=function(){return CommonHelper.serialize(this.m_valueJSON);}
EditModalDialog.prototype.getValueJSON=function(){return this.m_valueJSON;}
EditModalDialog.prototype.isNull=function(){var res=true;if(this.m_valueJSON||typeof(this.m_valueJSON)=="object"||!CommonHelper.isEmpty(this.m_valueJSON)){for(var id in this.m_valueJSON){if(this.m_valueJSON[id]!=undefined){res=false;break;}}}
return res;}
EditModalDialog.prototype.getDefViewOptions=function(){return{"valueJSON":this.m_valueJSON,"template":window.getApp().getTemplate(this.m_viewTemplate)};}
EditModalDialog.prototype.m_onClick=function(){if(!this.getEnabled()){return;}
var v_opts=this.getDefViewOptions();if(this.m_viewOptions){CommonHelper.merge(v_opts,this.m_viewOptions);}
v_opts["name"]=v_opts["name"]||"modView";this.m_view=new this.m_viewClass(this.getId()+":form:body:"+v_opts["name"],v_opts);var self=this;this.m_form=new WindowFormModalBS(this.getId()+":form",{"cmdCancel":this.m_cmdCancel,"controlCancelCaption":this.BTN_CANCEL_CAP,"controlCancelTitle":this.BTN_CANCEL_TITLE,"cmdOk":this.m_cmdOk,"controlOkCaption":this.BTN_OK_CAP,"controlOkTitle":this.BTN_OK_TITLE,"onClickCancel":function(){self.closeSelect(false);},"onClickOk":function(){var set_val=true;debugger
if(self.m_strictValidation&&self.m_view.validate){if(self.m_view.setValid){self.m_view.setValid();}
if(!self.m_view.validate()){self.m_view.setNotValid(self.MSG_NOT_VALID);set_val=false;}}
if(set_val){self.setValue(self.m_view.getValue());self.closeSelect();}},"content":this.m_view,"contentHead":this.m_headTitle,"dialogWidth":this.m_dialogWidth});this.m_form.open();if(this.m_afterOpen){this.m_afterOpen();}}
EditModalDialog.prototype.closeSelect=function(){if(this.m_view){this.m_view.delDOM();delete this.m_view;}
if(this.m_form){this.m_form.close();delete this.m_form;}}
EditModalDialog.prototype.setFormatValue=function(v){this.m_formatValue=v;}
EditModalDialog.prototype.getFormatValue=function(){return this.m_formatValue;}
EditModalDialog.prototype.formatValue=function(val){var res="";for(var id in val){if(val[id]&&typeof(val[id])=="object"&&!val[id].isNull()){res+=((res=="")?"":", ")+val[id].getDescr();}
else if(val[id]&&val[id]!=""){res+=((res=="")?"":", ")+val[id];}}
return res;}
EditModalDialog.prototype.reset=function(){this.setValue({});} 
EditModalDialog.prototype.BTN_CANCEL_CAP="Отмена";EditModalDialog.prototype.BTN_CANCEL_TITLE="закрыть форму без сохранения изменений";EditModalDialog.prototype.BTN_OK_CAP="Ок";EditModalDialog.prototype.BTN_OK_TITLE="завершить редактирование и закрыть форму";EditModalDialog.prototype.MSG_NOT_VALID="Есть ошибки заполнения"; 
function GridColumn(options){options=options||{};if(typeof(options)!="object"){throw new Error("Constructor type not supported (id,option)");}
var id;if(options.id){id=options.id;}
else if(options.field){id=options.field.getId();}
else{id=CommonHelper.uniqid();}
this.m_id=id;options.ctrlId=id;this.m_headCell=options.headCell;this.m_cellClass=options.cellClass||GridCell;this.m_cellOptions=options.cellOptions;this.m_cellElements=options.cellElements;if(!options.field&&options.model&&options.model.fieldExists(id)){options.field=options.model.getField(id);}
this.m_field=options.field;this.m_fieldId=options.fieldId;this.m_format=options.format;this.m_formatFunction=options.formatFunction;this.m_mask=options.mask;this.m_assocImageList=options.assocImageList;this.m_assocValueList=options.assocValueList;this.m_assocClassList=options.assocClassList;this.m_assocIndex=options.assocIndex;this.m_ctrlEdit=(options.ctrlEdit!=undefined)?options.ctrlEdit:true;this.m_ctrlId=options.ctrlId;this.m_ctrlClass=options.ctrlClass;this.m_ctrlClassResolve=options.ctrlClassResolve;this.m_ctrlOptions=options.ctrlOptions;this.m_ctrlBindFieldId=options.ctrlBindFieldId;this.m_ctrlBindField=options.ctrlBindField;this.m_grid=options.grid;this.setSearchOptions(options.searchOptions);this.setSearchable((options.searchable!=undefined)?options.searchable:true);this.setMaster(options.master);this.setDetailViewClass(options.detailViewClass);this.setDetailViewOptions(options.detailViewOptions);this.setFieldAlias(options.fieldAlias);}
GridColumn.prototype.m_id;GridColumn.prototype.m_headCell;GridColumn.prototype.m_cellClass;GridColumn.prototype.m_cellOptions;GridColumn.prototype.m_cellElements;GridColumn.prototype.m_field;GridColumn.prototype.m_fieldId;GridColumn.prototype.m_format;GridColumn.prototype.m_formatFunction;GridColumn.prototype.m_mask;GridColumn.prototype.m_assocImageList;GridColumn.prototype.m_assocValueList;GridColumn.prototype.m_assocClassList;GridColumn.prototype.m_assocIndex;GridColumn.prototype.m_ctrlEdit;GridColumn.prototype.m_ctrlId;GridColumn.prototype.m_ctrlClass;GridColumn.prototype.m_ctrlClassResolve;GridColumn.prototype.m_ctrlOptions;GridColumn.prototype.m_ctrlBindFieldId;GridColumn.prototype.m_grid;GridColumn.prototype.m_gridCell;GridColumn.prototype.getCellClass=function(){return this.m_cellClass;}
GridColumn.prototype.setCellClass=function(v){this.m_cellClass=v;}
GridColumn.prototype.getCellOptions=function(){return this.m_cellOptions;}
GridColumn.prototype.setCellOptions=function(v){this.m_cellOptions=v;}
GridColumn.prototype.getField=function(){if(!this.m_field&&this.m_model){if(this.m_fieldId&&this.m_model.fieldExists(this.m_fieldId)){this.m_field=this.m_model.getField(this.m_fieldId);}
else if(this.m_model.fieldExists(this.m_id)){this.m_field=this.m_model.getField(this.m_id);}}
return this.m_field;}
GridColumn.prototype.setField=function(v){this.m_field=v;}
GridColumn.prototype.getFormat=function(){return this.m_format;}
GridColumn.prototype.setFormat=function(v){this.m_format=v;}
GridColumn.prototype.getHeadCell=function(){return this.m_headCell;}
GridColumn.prototype.setHeadCell=function(v){this.m_headCell=v;}
GridColumn.prototype.getCellClass=function(){return this.m_cellClass;}
GridColumn.prototype.setCellClass=function(v){this.m_cellClass=v;}
GridColumn.prototype.getMask=function(){return this.m_mask;}
GridColumn.prototype.setMask=function(v){this.m_mask=v;}
GridColumn.prototype.getCtrlClass=function(){return(this.m_ctrlClassResolve&&typeof this.m_ctrlClassResolve=="function")?this.m_ctrlClassResolve.call(this):this.m_ctrlClass;}
GridColumn.prototype.setCtrlClass=function(v){this.m_ctrlClass=v;}
GridColumn.prototype.getCtrlOptions=function(){return((typeof this.m_ctrlOptions=="function")?this.m_ctrlOptions.call(this):this.m_ctrlOptions);}
GridColumn.prototype.setCtrlOptions=function(v){this.m_ctrlOptions=v;}
GridColumn.prototype.getCtrlBindFieldId=function(){return this.m_ctrlBindFieldId;}
GridColumn.prototype.setCtrlBindFieldId=function(v){this.m_ctrlBindFieldId=v;}
GridColumn.prototype.getCtrlBindField=function(){return this.m_ctrlBindField;}
GridColumn.prototype.setCtrlBindField=function(v){this.m_ctrlBindField=v;}
GridColumn.prototype.getCtrlId=function(){return this.m_ctrlId;}
GridColumn.prototype.setCtrlId=function(v){this.m_ctrlId=v;}
GridColumn.prototype.getAssocValueList=function(){return this.m_assocValueList;}
GridColumn.prototype.setAssocValueList=function(v){this.m_assocValueList=v;}
GridColumn.prototype.getAssocIndex=function(){return this.m_assocIndex;}
GridColumn.prototype.setAssocIndex=function(v){this.m_assocIndex=v;}
GridColumn.prototype.getAssocImageList=function(){return this.m_assocImageList;}
GridColumn.prototype.setAssocImageList=function(v){this.m_assocImageList=v;}
GridColumn.prototype.getAssocClassList=function(){return this.m_assocClassList;}
GridColumn.prototype.setAssocClassList=function(v){this.m_assocClassList=v;}
GridColumn.prototype.getGrid=function(){return this.m_grid;}
GridColumn.prototype.setGrid=function(v){this.m_grid=v;}
GridColumn.prototype.getFormatFunction=function(){return this.m_formatFunction;}
GridColumn.prototype.setFormatFunction=function(v){this.m_formatFunction=v;}
GridColumn.prototype.getId=function(){return this.m_id;}
GridColumn.prototype.setId=function(v){this.m_id=v;}
GridColumn.prototype.formatVal=function(v){return v;}
GridColumn.prototype.getCellElements=function(){return this.m_cellElements;}
GridColumn.prototype.setModel=function(v){this.m_model=v;}
GridColumn.prototype.getCtrlEdit=function(){return this.m_ctrlEdit;}
GridColumn.prototype.setCtrlEdit=function(v){this.m_ctrlEdit=v;}
GridColumn.prototype.setVisible=function(v){this.getHeadCell().setVisible(v);this.m_cellOptions=this.m_cellOptions||{};this.m_cellOptions.visible=v;}
GridColumn.prototype.getSearchOptions=function(){return this.m_searchOptions;}
GridColumn.prototype.setSearchOptions=function(v){this.m_searchOptions=v;}
GridColumn.prototype.getSearchable=function(){return this.m_searchable;}
GridColumn.prototype.setSearchable=function(v){this.m_searchable=v;}
GridColumn.prototype.getMaster=function(){return this.m_master;}
GridColumn.prototype.setMaster=function(v){this.m_master=v;}
GridColumn.prototype.getDetailViewClass=function(){return this.m_detailViewClass;}
GridColumn.prototype.setDetailViewClass=function(v){this.m_detailViewClass=v;}
GridColumn.prototype.getDetailViewOptions=function(){return this.m_detailViewOptions;}
GridColumn.prototype.setDetailViewOptions=function(v){this.m_detailViewOptions=v;}
GridColumn.prototype.getGridCell=function(){return this.m_gridCell;}
GridColumn.prototype.setGridCell=function(v){this.m_gridCell=v;}
GridColumn.prototype.getFieldAlias=function(){return this.m_fieldAlias;}
GridColumn.prototype.setFieldAlias=function(v){this.m_fieldAlias=v;} 
function GridColumnBool(options){options=options||{};options.assocClassList=options.assocClassList||{"true":"glyphicon glyphicon-ok","false":((options.showFalse==undefined||options.showFalse===true)?"glyphicon glyphicon-remove":null)};GridColumnBool.superclass.constructor.call(this,options);}
extend(GridColumnBool,GridColumn); 
function GridColumnPhone(options){options=options||{};options.mask=options.mask||window.getApp().getPhoneEditMask();options.ctrlClass=options.ctrlClass||EditPhone;if(window.Caller_Controller){options.cellClass=options.cellClass||GridCellPhone;options.cellOptions=options.cellOptions||{};options.cellOptions.telExt=options.cellOptions.telExt||options.telExt;options.cellOptions.onConnected=options.cellOptions.onConnected||options.onConnected;}
else{options.cellClass=options.cellClass||GridCell;}
GridColumnPhone.superclass.constructor.call(this,options);}
extend(GridColumnPhone,GridColumn); 
function GridColumnFloat(options){options=options||{};this.m_precision=options.precision||this.DEF_PRECISION;this.setDecimalSeparator((options.decimalSeparator!=undefined)?options.decimalSeparator:CommonHelper.getDecimalSeparator());this.setThousandSeparator((options.thousandSeparator!=undefined)?options.thousandSeparator:this.DEF_THOUSAND_SEPAR);GridColumnFloat.superclass.constructor.call(this,options);}
extend(GridColumnFloat,GridColumn);GridColumnFloat.prototype.DEF_PRECISION=2;GridColumnFloat.prototype.DEF_THOUSAND_SEPAR=" ";GridColumnFloat.prototype.m_decimalSeparator;GridColumnFloat.prototype.m_thousandSeparator;GridColumnFloat.prototype.formatVal=function(v){if(isNaN(v)){return"";}
else{return CommonHelper.numberFormat(v,this.m_precision,this.getDecimalSeparator(),this.getThousandSeparator());}}
GridColumnFloat.prototype.getDecimalSeparator=function(){return this.m_decimalSeparator;}
GridColumnFloat.prototype.setDecimalSeparator=function(v){this.m_decimalSeparator=v;}
GridColumnFloat.prototype.getThousandSeparator=function(){return this.m_thousandSeparator;}
GridColumnFloat.prototype.setThousandSeparator=function(v){this.m_thousandSeparator=v;} 
function GridColumnByte(options){options=options||{};this.m_precision=options.precision||this.DEF_PRECISION;GridColumnByte.superclass.constructor.call(this,options);}
extend(GridColumnByte,GridColumn);GridColumnByte.prototype.DEF_PRECISION=2;GridColumnByte.prototype.formatVal=function(v){if(isNaN(v)){return"";}
else{return CommonHelper.byteForamt(v,this.m_precision);}} 
function GridColumnDate(options){options=options||{};options.ctrlClass=options.ctrlClass||EditDate;options.ctrlOptions=options.ctrlOptions||{};this.m_dateFormat=options.dateFormat||options.ctrlOptions.dateFormat||window.getApp().getDateFormat()||this.DEF_FORMAT;options.ctrlOptions.dateFormat=options.ctrlOptions.dateFormat||this.m_dateFormat;options.ctrlOptions.editMask=options.ctrlOptions.editMask||options.editMask||window.getApp().getDateEditMask()||this.DEF_EDIT_MASK;GridColumnDate.superclass.constructor.call(this,options);}
extend(GridColumnDate,GridColumn);GridColumnDate.prototype.DEF_FORMAT="d/m/Y";GridColumnDate.prototype.DEF_EDIT_MASK="99/99/9999";GridColumnDate.prototype.formatVal=function(v){var r="";if(v&&typeof(v)=="string"){v=DateHelper.strtotime(v);}
if(v&&typeof(v)=="object"){r=DateHelper.format(v,this.m_dateFormat);}
return r;} 
function GridColumnDateTime(options){options=options||{};options.ctrlClass=options.ctrlClass||EditDateTime;options.ctrlOptions=options.ctrlOptions||{};options.ctrlOptions.editMask=options.ctrlOptions.editMask||options.editMask||window.getApp().getDateTimeEditMask()||this.DEF_EDIT_MASK;options.dateFormat=options.dateFormat||window.getApp().getDateTimeFormat()||this.DEF_FORMAT;GridColumnDateTime.superclass.constructor.call(this,options);}
extend(GridColumnDateTime,GridColumnDate);GridColumnDateTime.prototype.DEF_FORMAT="d/m/Y H:i:s";GridColumnDateTime.prototype.DEF_EDIT_MASK="99/99/9999 99:99:99"; 
function GridColumnEnum(options){options.assocValueList=options.multyLangValues[window.getApp().getLocale()];GridColumnEnum.superclass.constructor.call(this,options);}
extend(GridColumnEnum,GridColumn); 
function GridColumnRef(options){options=options||{};var self=this;this.m_origFormatFunction=options.formatFunction;options.formatFunction=function(fields,gridCell){var res;if(self.m_origFormatFunction){res=self.m_origFormatFunction(fields,gridCell);}
else{res=self.getCellValue(fields,gridCell);}
return res;}
this.m_onClickRef=options.onClickRef;this.setForm(options.form);this.setViewOptions(options.viewOptions);options.cellElements=options.cellElements||((options.form||this.m_onClickRef)?[{"elementClass":Control,"elementOptions":{"tagName":"A","href":"#","events":{"click":function(e){self.onClickRef(e);}}}}]:null);GridColumnRef.superclass.constructor.call(this,options);}
extend(GridColumnRef,GridColumn);GridColumnRef.prototype.m_keys;GridColumnRef.prototype.m_form;GridColumnRef.prototype.onClickRef=function(e){e=EventHelper.fixKeyEvent(e);if(e.preventDefault){e.preventDefault();}
e.stopPropagation();var keys=this.getKeysFromClickEvent(e);if(this.m_onClickRef){this.m_onClickRef(keys,e);}
else{this.openRef(keys);}}
GridColumnRef.prototype.openRef=function(keys){if(keys&&this.m_form){var view_opts={};CommonHelper.merge(view_opts,this.getViewOptions());(new this.m_form({"name":this.m_form.toString()+CommonHelper.serialize(keys),"keys":keys,"params":{"cmd":"edit","editViewOptions":view_opts}})).open();}}
GridColumnRef.prototype.getKeysFromClickEvent=function(e){var keys,f_id;var td=DOMHelper.getParentByTagName(e.target,"TD");if(td){f_id=td.getAttribute("fieldid");var tr=DOMHelper.getParentByTagName(td,"TR");if(tr&&f_id){this.getGrid().setModelToCurrentRow(tr);v=this.getGrid().getModel().getFieldValue(f_id);if(CommonHelper.isArray(v)&&v.length){keys=this.getObjectKeys(v[0]);}
else{keys=this.getObjectKeys(v);}}}
return keys;}
GridColumnRef.prototype.getObjectKeys=function(v){return((!v||typeof v!="object")?null:((v.getKeys)?v.getKeys():(v.keys?v.keys:(v.m_keys?v.m_keys:null))));}
GridColumnRef.prototype.getObjectDescr=function(v,fields){var keys=this.getObjectKeys(v);var no_keys=false;for(key in keys){if(keys[key]==null){no_keys=true;break;}}
return!no_keys?(v.getDescr?v.getDescr():(v.descr?v.descr:(v.m_descr?v.m_descr:keys))):"";}
GridColumnRef.prototype.getCellValue=function(fields){var f=fields[this.getField().getId()];var res="";if(!f.isNull()){var v=f.getValue();if(typeof v=="string"){v=CommonHelper.unserialize(v);}
if(CommonHelper.isArray(v)){for(var i=0;i<v.length;i++){if(v[i]){res+=(res=="")?"":", ";res+=this.getObjectDescr(v[i],fields);}}}
else if(v){res=this.getObjectDescr(v,fields);}}
return res;}
GridColumn.prototype.getForm=function(){return this.m_form;}
GridColumn.prototype.setForm=function(v){this.m_form=v;}
GridColumn.prototype.getViewOptions=function(){return this.m_viewOptions;}
GridColumn.prototype.setViewOptions=function(v){this.m_viewOptions=v;} 
function GridCell(id,options){options=options||{};if(options.gridColumn){options.attrs=options.attrs||{};if(options.gridColumn.getHeadCell()){var col_attrs=options.gridColumn.getHeadCell().getColAttrs()||{};for(col_attr_id in col_attrs){if(typeof col_attrs[col_attr_id]=="function"){options.attrs[col_attr_id]=col_attrs[col_attr_id].call(this,options.fields);}
else{options.attrs[col_attr_id]=col_attrs[col_attr_id];}}}
if(options.gridColumn.getField()){options.attrs.fieldId=options.gridColumn.getField().getId();var f_alias=options.gridColumn.getFieldAlias();if(f_alias){options.attrs["data-label"]=f_alias;}
options.value=(options.value!=undefined)?options.value:options.gridColumn.getField().getValue();}}
this.setGridColumn(options.gridColumn);var val=options.value;options.value=undefined;GridCell.superclass.constructor.call(this,id,(options.tagName||this.DEF_TAG_NAME),options);this.setColSpan(options.colSpan);this.setRowSpan(options.rowSpan);this.m_modelIndex=options.modelIndex;this.m_row=options.row;if(val!=undefined||(this.m_gridColumn&&this.m_gridColumn.getFormatFunction())){this.setValue(val);}}
extend(GridCell,ControlContainer);GridCell.prototype.DEF_TAG_NAME="TD";GridCell.prototype.m_gridColumn;GridCell.prototype.m_value;GridCell.prototype.detailToggles;GridCell.prototype.setColSpan=function(v){if(v)this.setAttr("colspan",v);}
GridCell.prototype.getColSpan=function(){return this.getAttr("colspan");}
GridCell.prototype.setRowSpan=function(v){if(v)this.setAttr("rowspan",v);}
GridCell.prototype.getRowSpan=function(){return this.getAttr("rowspan");}
GridCell.prototype.setGridColumn=function(v){this.m_gridColumn=v;}
GridCell.prototype.getGridColumn=function(){return this.m_gridColumn;}
GridCell.prototype.formatValue=function(val){if(this.m_gridColumn){var elem_cnt=0;if(this.m_elements){elem_cnt=this.getCount();}
var f_func=this.m_gridColumn.getFormatFunction();if(f_func){val=f_func.call(this.m_gridColumn,this.m_gridColumn.getGrid().getModel().getFields(),this);}
if(elem_cnt==1){for(var k in this.m_elements){this.m_elements[k].setValue(val);val="";break;}}
else if(elem_cnt){}
else if(!f_func){val=this.m_gridColumn.formatVal(val);if(this.m_gridColumn.getFormat()){val=CommonHelper.format(this.m_gridColumn.getFormat(),val);}
else if(this.m_gridColumn.getMask()){var input=new Control(this.getId()+":mask","input",{"attrs":{"value":val},"visible":false});$(input.getNode()).mask(this.m_gridColumn.getMask());val=input.m_node.value;}
else if(this.m_gridColumn.getAssocClassList()){var assoc_class=this.m_gridColumn.getAssocClassList()[val.toString()];if(assoc_class){this.addElement(new Control(this.getId()+":assoc-img","i",{"className":assoc_class}));}
val="";}
else if(this.m_gridColumn.getAssocImageList()){var img=this.m_gridColumn.getAssocImageList()[val];if(img){this.addElement(new Control(this.getId()+":assoc-img","img",{"attrs":{"src":img}}));}
val="";}
else if(this.m_gridColumn.getAssocValueList()){val=(val===null||val=="")?"null":val;val=this.m_gridColumn.getAssocValueList()[val];}
else if(val&&this.m_gridColumn.getAssocIndex()){var v=this.m_gridColumn.getAssocIndex();val=val[v];}}}
return val;}
GridCell.prototype.setValue=function(val){this.m_value=val;val=this.formatValue(val);GridCell.superclass.setValue.call(this,val);}
GridCell.prototype.getValue=function(){return this.m_value;}
GridCell.prototype.getFormattedValue=function(){return this.formatValue(this.m_value);}
GridCell.prototype.toDOM=function(parent){GridCell.superclass.toDOM.call(this,parent);if(this.m_gridColumn&&this.m_gridColumn.getMaster()){this.m_detailToggle=new GridCellDetailToggle(this.getId()+":det_toggle",{"gridCell":this,"detailViewClass":this.m_gridColumn.getDetailViewClass(),"detailViewOptions":this.m_gridColumn.getDetailViewOptions()});if(this.getNode()&&this.getNode().firstChild)
this.m_detailToggle.toDOMBefore(this.getNode().firstChild);}}
GridCell.prototype.delDOM=function(){if(this.m_detailToggl){this.m_detailToggle.delDOM();delete this.m_detailToggle;}
GridCell.superclass.delDOM.call(this);}
GridCell.prototype.getDetailToggle=function(){return this.m_detailToggle;} 
function GridCellHead(id,options){options=options||{};options.attrs=options.attrs||{};options.value=options.value||options.labelCaption||options.alias;if(options.value==undefined&&options.columns&&options.columns.length){options.value="";for(var i=0;i<options.columns.length;i++){if(options.columns[i].getField()){options.value+=((options.value=="")?"":" ")+options.columns[i].getField().getAlias();}}}
if(options.visible!=undefined&&!options.visible){options.colAttrs=options.colAttrs||{};options.attrs["class"]=this.CLASS_INVISIBLE;options.colAttrs["class"]=this.CLASS_INVISIBLE;}
if(options.colAlign){options.colAttrs=options.colAttrs||{};options.colAttrs.align=options.colAlign;}
if((!options.colAttrs||!options.colAttrs.align)&&options.columns&&options.columns.length){options.colAttrs=options.colAttrs||{};if((window.GridColumnDate&&options.columns[0]instanceof GridColumnDate)||(window.GridColumnPhone&&options.columns[0]instanceof GridColumnPhone)||(window.GridColumnEmail&&options.columns[0]instanceof GridColumnEmail)){options.colAttrs.align="center";}
else if(options.columns[0]instanceof GridColumnFloat){options.colAttrs.align="right";}}
options.attrs.align=options.attrs.align||this.DEF_ALIGN;if(options.sortable){options.attrs.title=options.attrs.title||this.TITLE;}
GridCellHead.superclass.constructor.call(this,id,options);if(options.sortable){if(options.sort){this.setSort(options.sort);}
if(options.sortFieldId){this.setSortFieldId(options.sortFieldId);}
this.setSortable(true);options.attrs.title=options.attrs.title||this.TITLE;}
this.setColumns(options.columns);this.setColAttrs(options.colAttrs);if(options.colControlContainer){this.m_colControlContainer=options.colControlContainer;}
var self=this;this.m_sorting=function(event){self.sorting(event);}}
extend(GridCellHead,GridCell);GridCellHead.prototype.SORT_UP_CLASS="grid-sort glyphicon glyphicon-sort-by-attributes";GridCellHead.prototype.SORT_DOWN_CLASS="grid-sort glyphicon glyphicon-sort-by-attributes-alt";GridCellHead.prototype.SORT_UP="asc";GridCellHead.prototype.SORT_DOWN="desc";GridCellHead.prototype.SORT_CLASS="sortable";GridCellHead.prototype.DEF_ALIGN="center";GridCellHead.prototype.DEF_TAG_NAME="TH";GridCellHead.prototype.GLYPH_TAG="SPAN";GridCellHead.prototype.m_colAttrs;GridCellHead.prototype.m_columns;GridCellHead.prototype.m_onRefresh;GridCellHead.prototype.initSort=function(sort){var el=document.createElement(this.GLYPH_TAG);el.className=(sort==this.SORT_UP)?this.SORT_UP_CLASS:this.SORT_DOWN_CLASS;el.name="sorter";var divs=this.m_node.getElementsByTagName("div");var parent=this.m_node;if(divs&&divs.length){parent=divs[0];}
var els=DOMHelper.getElementsByAttr(el.name,parent,"name",true,this.GLYPH_TAG)
if(els&&els.length){DOMHelper.delNode(els[0]);}
parent.appendChild(el);}
GridCellHead.prototype.updateColManager=function(){if(this.m_colManager&&this.m_colManager.getColOrder()){var col_order=this.m_colManager.getColOrder();var name=this.getName();for(var i=0;i<col_order.length;i++){var this_col=(col_order.colId=name);if(this_col){col_order.directs=this.getAttr("sort");}
col_order.checked=this_col;}}}
GridCellHead.prototype.sorting=function(event){event=EventHelper.fixMouseEvent(event);var th;if(event.target.nodeName.toLowerCase()=="th"){th=event.target;}
else{th=DOMHelper.getParentByTagName(event.target,"th");}
if(th){var sort=th.getAttribute("sort");if(sort==this.SORT_UP){this.setSort(this.SORT_DOWN);this.updateColManager();if(this.m_onRefresh){this.m_onRefresh();}}
else if(sort==this.SORT_DOWN){this.setSort(this.SORT_UP);this.updateColManager();if(this.m_onRefresh){this.m_onRefresh();}}
else{var trs=th.parentNode.childNodes;for(var i=0;i<trs.length;i++){if(trs[i].getAttribute("sort")){DOMHelper.delAttr(trs[i],"sort");var imgs=trs[i].getElementsByTagName(this.GLYPH_TAG);if(imgs&&imgs.length){DOMHelper.delNode(imgs[0]);}
break;}}
this.makeSortable();this.setAttr("sort",this.SORT_UP);this.initSort();this.updateColManager();if(this.m_onRefresh){this.m_onRefresh();}}}}
GridCellHead.prototype.makeSortable=function(){EventHelper.add(this.m_node,"click",this.m_sorting,true);}
GridCellHead.prototype.makeUnSortable=function(){EventHelper.del(this.m_node,"click",this.m_sorting,true);}
GridCellHead.prototype.getColAttrs=function(){return this.m_colAttrs;}
GridCellHead.prototype.setColAttrs=function(v){this.m_colAttrs=v;}
GridCellHead.prototype.getColControlContainer=function(){return this.m_colControlContainer;}
GridCellHead.prototype.getAlign=function(){return this.m_node.align;}
GridCellHead.prototype.setAlign=function(v){this.m_node.align=v;}
GridCellHead.prototype.getSortable=function(){return(DOMHelper.hasClass(this.m_node,this.SORT_CLASS));}
GridCellHead.prototype.setSortable=function(v){if(v){DOMHelper.addClass(this.m_node,this.SORT_CLASS);}
else{DOMHelper.delClass(this.m_node,this.SORT_CLASS);}}
GridCellHead.prototype.setColumns=function(v){this.m_columns=v;if(this.m_columns){var alias=this.getText();for(var i=0;i<this.m_columns.length;i++){if(this.m_columns[i].getField()){this.m_columns[i].setFieldAlias(alias);}}}}
GridCellHead.prototype.getColumns=function(){return this.m_columns;}
GridCellHead.prototype.setSortFieldId=function(v){this.setAttr("sortFieldId",v);}
GridCellHead.prototype.getSortFieldId=function(){return this.getAttr("sortFieldId");}
GridCellHead.prototype.getSort=function(){return this.getAttr("sort");}
GridCellHead.prototype.setSort=function(v){this.setAttr("sort",v);var imgs=this.m_node.getElementsByTagName(this.GLYPH_TAG);if(imgs&&imgs.length){imgs[0].className=(v==this.SORT_DOWN)?this.SORT_DOWN_CLASS:this.SORT_UP_CLASS;}}
GridCellHead.prototype.toDOM=function(parent){GridCellHead.superclass.toDOM.call(this,parent);if(this.getSortable()){var sort=this.getSort();if(sort){this.initSort(sort);}
this.makeSortable();}}
GridCellHead.prototype.delDOM=function(){if(this.getSortable()){this.makeUnSortable();}
GridCellHead.superclass.delDOM.call(this);}
GridCellHead.prototype.setEnabled=function(v){if(v){this.makeSortable();var els=this.m_node.getElementsByTagName(this.GLYPH_TAG);if(els&&els.length){DOMHelper.delClass(els[0],this.ATTR_DISABLED);}}
else{this.makeUnSortable();var els=this.m_node.getElementsByTagName(this.GLYPH_TAG);if(els&&els.length){DOMHelper.addClass(els[0],this.ATTR_DISABLED);}}
GridCellHead.superclass.setEnabled.call(this,v);}
GridCellHead.prototype.setColManager=function(v){this.m_colManager=v;} 
function GridCellFoot(id,options){options=options||{};GridCellFoot.superclass.constructor.call(this,id,options);this.setCalc(options.calc);this.setCalcBegin(options.calcBegin);if(!options.calcEnd&&options.totalFieldId){options.calcEnd=(function(totalFieldId){return function(m){this.setValue(m.getAttr(totalFieldId));}})(options.totalFieldId);}
this.setCalcEnd(options.calcEnd);this.setCalcOper(options.calcOper);this.setCalcFieldId(options.calcFieldId);}
extend(GridCellFoot,GridCell);GridCellFoot.prototype.CALC_OPER_SUM="sum";GridCellFoot.prototype.CALC_OPER_AVG="avg";GridCellFoot.prototype.m_calc;GridCellFoot.prototype.m_calcBegin;GridCellFoot.prototype.m_calcEnd;GridCellFoot.prototype.m_calcOper;GridCellFoot.prototype.m_total;GridCellFoot.prototype.m_calcFieldId;GridCellFoot.prototype.m_count;GridCellFoot.prototype.getCalcFieldId=function(v){return this.m_calcFieldId;}
GridCellFoot.prototype.setCalcFieldId=function(v){this.m_calcFieldId=v;}
GridCellFoot.prototype.getTotal=function(v){return this.m_total;}
GridCellFoot.prototype.setTotal=function(v){this.m_total=v;}
GridCellFoot.prototype.getCalcTotal=function(v){return this.m_calcTotal;}
GridCellFoot.prototype.setCalcOper=function(v){this.m_calcOper=v;if(this.m_calcOper){this.m_calc=this.m_calc||function(model){var f_val=model.getFieldValue(this.m_calcFieldId);if(isNaN(f_val))f_val=0;this.setTotal(this.getTotal()+f_val);if(this.m_calcOper==this.CALC_OPER_AVG){this.m_count+=1;}}
this.m_calcBegin=this.m_calcBegin||function(){this.setTotal(0);this.m_count=0;}
this.m_calcEnd=this.m_calcEnd||function(){var res;if(this.m_calcOper==this.CALC_OPER_AVG){res=(this.m_count>0)?(this.getTotal()/this.m_count):0;}
else{res=this.getTotal();}
this.setValue(res);}}}
GridCellFoot.prototype.setCalc=function(f){this.m_calc=f;}
GridCellFoot.prototype.getCalc=function(){return this.m_calc;}
GridCellFoot.prototype.setCalcBegin=function(f){this.m_calcBegin=f;}
GridCellFoot.prototype.getCalcBegin=function(f){return this.m_calcBegin;}
GridCellFoot.prototype.setCalcEnd=function(f){this.m_calcEnd=f;}
GridCellFoot.prototype.getCalcEnd=function(){return this.m_calcEnd;} 
function GridCellPhone(id,options){options=options||{};this.m_telExt=options.telExt;this.m_onConnected=options.onConnected;GridCellPhone.superclass.constructor.call(this,id,options);}
extend(GridCellPhone,GridCell);GridCellPhone.prototype.toDOM=function(parent){var self=this;this.m_cont=new Control(null,"A",{"value":this.getFormattedValue(),"attrs":{"tel":this.getValue()},"title":this.TITLE,"events":{"click":function(){window.getApp().makeCall(self.m_cont.getAttr("tel"));}}});this.setValue("");GridCellPhone.superclass.toDOM.call(this,parent);this.m_cont.toDOM(this.m_node);} 
GridCellPhone.prototype.TITLE="Набрать номер";GridCellPhone.prototype.CONTROLLER_NOT_DEFIND="Контроллер звонков Caller_Controller не найден!"; 
function GridCellDetailToggle(id,options){options=options||{};options.attrs=options.attrs||{};var tag_name=options.tagName||this.DEF_TAG_NAME;options.className=options.className||this.DEF_CLASS;options.attrs.title=this.TITLE;options.events=options.events||{};var self=this;options.events.click=function(e){self.onDetailToggle.call(self,e.target);}
this.setToggleSpeed(options.toggleSpeed||this.DEF_TOGGLE_SPEED);this.m_gridCell=options.gridCell;this.m_detailViewClass=options.detailViewClass;this.m_detailViewOptions=options.detailViewOptions;GridCellDetailToggle.superclass.constructor.call(this,id,tag_name,options);}
extend(GridCellDetailToggle,Control);GridCellDetailToggle.prototype.m_detailVisible;GridCellDetailToggle.prototype.m_gridCell;GridCellDetailToggle.prototype.m_detailViewClass;GridCellDetailToggle.prototype.m_detailViewOptions;GridCellDetailToggle.prototype.m_toggleSpeed;GridCellDetailToggle.prototype.m_detailRow;GridCellDetailToggle.prototype.DEF_TOGGLE_SPEED=300;GridCellDetailToggle.prototype.DEF_TAG_NAME="SPAN";GridCellDetailToggle.prototype.DEF_CLASS="glyphicon glyphicon-triangle-right pull-left detailToggle";GridCellDetailToggle.prototype.onDetailToggle=function(pic){if(!this.m_detailVisible){var detail_view_id=CommonHelper.uniqid();var tr=this.m_gridCell.getNode().parentNode;this.m_detailRow=document.createElement(tr.tagName);this.m_detailRow.className="grid_details";this.m_detailRow.setAttribute("for_keys",tr.getAttribute("keys"));this.m_detailRow.setAttribute("detail_view_id",detail_view_id);var v_opts=this.m_detailViewOptions||{};v_opts.attrs=v_opts.attrs||{};v_opts.attrs.style="display: none;";v_opts.attrs.colspan=tr.cells.length;v_opts.tagName="TD";var grid=this.m_gridCell.getGridColumn().getGrid();this.m_gridRefreshInterval=grid.getRefreshInterval();grid.setRefreshInterval(0);grid.setModelToCurrentRow(tr);var fields=grid.getModel().getFields();for(var m_id in v_opts.detailFilters){for(i=0;i<v_opts.detailFilters[m_id].length;i++){if(fields[v_opts.detailFilters[m_id][i].masterFieldId]){v_opts.detailFilters[m_id][i].val=fields[v_opts.detailFilters[m_id][i].masterFieldId].getValueXHR();}}}
var app=window.getApp();if(!app.m_detailViews)app.m_detailViews={};app.m_detailViews[detail_view_id]=new this.m_detailViewClass(detail_view_id,v_opts);if(tr.nextSibling){tr.parentNode.insertBefore(this.m_detailRow,tr.nextSibling);}
else{tr.parentNode.appendChild(this.m_detailRow);}
app.m_detailViews[detail_view_id].toDOM(this.m_detailRow);$(app.m_detailViews[detail_view_id].getNode()).slideToggle(this.m_toggleSpeed);}
else{var tr=DOMHelper.getParentByTagName(pic,"tr");var detail_view_id=tr.nextSibling.getAttribute("detail_view_id");if(detail_view_id){window.getApp().m_detailViews[detail_view_id].delDOM();}
this.m_gridCell.getGridColumn().getGrid().setRefreshInterval(this.m_gridRefreshInterval);DOMHelper.delNode(this.m_detailRow);}
this.setDetailVisible(!this.m_detailVisible);}
GridCellDetailToggle.prototype.setToggleSpeed=function(v){this.m_toggleSpeed=v;}
GridCellDetailToggle.prototype.getToggleSpeed=function(){return this.m_toggleSpeed;}
GridCellDetailToggle.prototype.getDetailVisible=function(){return this.m_detailVisible;}
GridCellDetailToggle.prototype.setDetailVisible=function(v){this.m_detailVisible=v;$(this.m_node).toggleClass("rotate-90");}
GridCellDetailToggle.prototype.setDetailRow=function(v){this.m_detailRow=v;} 
GridCellDetailToggle.prototype.TITLE="Показать/скрыть расшифровку"; 
function GridHead(id,options){options=options||{};GridHead.superclass.constructor.call(this,id,(options.tagName||this.DEF_TAG_NAME),options);this.setRowClass(options.rowClass);this.setRowOptions(options.rowOptions);}
extend(GridHead,ControlContainer);GridHead.prototype.DEF_TAG_NAME="THEAD";GridHead.prototype.m_rowClass;GridHead.prototype.m_rowClassOptions;GridHead.prototype.getColumns=function(){var col_list=[];for(var row_id in this.m_elements){var row_cols=this.m_elements[row_id].m_elements;for(var col_id in row_cols){var columns=row_cols[col_id].getColumns();if(!columns)continue;for(var i=0;i<columns.length;i++){columns[i].setHeadCell(row_cols[col_id]);col_list.push(columns[i]);}}}
return col_list;}
GridHead.prototype.setRowClass=function(v){v=v?v:GridRow;if(CommonHelper.isArray(v)){this.m_rowClass=v;}
else{this.m_rowClass=[v];}}
GridHead.prototype.getRowClass=function(ind){return this.m_rowClass[(ind!=undefined)?ind:0];}
GridHead.prototype.setRowOptions=function(v){if(CommonHelper.isArray(v)){this.m_rowOptions=v;}
else{this.m_rowOptions=[v];}}
GridHead.prototype.getRowOptions=function(ind){return(this.m_rowOptions)?this.m_rowOptions[(ind!=undefined)?ind:0]:{};} 
function GridRow(id,options){options=options||{};GridRow.superclass.constructor.call(this,id,(options.tagName||this.DEF_TAG_NAME),options);}
extend(GridRow,ControlContainer);GridRow.prototype.DEF_TAG_NAME="tr";GridRow.prototype.m_initColumns;GridRow.prototype.setInitColumnOrder=function(){this.m_initColumns={};for(var id in this.m_elements){this.m_initColumns[id]=CommonHelper.clone(this.m_elements[id]);}}
GridRow.prototype.setColumnOrder=function(orderArray){this.m_elements={};for(var i=0;i<orderArray.length;i++){if(!orderArray[i].checked)continue;if(this.m_initColumns[orderArray[i].colId]){this.m_elements[orderArray[i].colId]=this.m_initColumns[orderArray[i].colId];}}}
GridRow.prototype.getInitColumns=function(){return this.m_initColumns;} 
function GridFoot(id,options){options=options||{};this.setAutoCalc(options.autoCalc);GridFoot.superclass.constructor.call(this,id,(options.tagName||this.DEF_TAG_NAME),options);}
extend(GridFoot,ControlContainer);GridFoot.prototype.DEF_TAG_NAME="tfoot";GridFoot.prototype.m_autoCalc;GridFoot.prototype.calc=function(model){if(this.getAutoCalc()){for(var r in this.m_elements){for(var c in this.m_elements[r].m_elements){var cell=this.m_elements[r].m_elements[c];var f=(cell.getCalc)?cell.getCalc():null;if(f){f.call(cell,model);}}}}}
GridFoot.prototype.calcBegin=function(model){if(this.getAutoCalc()){for(var r in this.m_elements){for(var c in this.m_elements[r].m_elements){var cell=this.m_elements[r].m_elements[c];var f=(cell.getCalcBegin)?cell.getCalcBegin():null;if(f){f.call(cell,model);}}}}}
GridFoot.prototype.calcEnd=function(model){if(this.getAutoCalc()){for(var r in this.m_elements){for(var c in this.m_elements[r].m_elements){var cell=this.m_elements[r].m_elements[c];var f=(cell.getCalcEnd)?cell.getCalcEnd():null;if(f){f.call(cell,model);}}}}}
GridFoot.prototype.getAutoCalc=function(){return this.m_autoCalc;}
GridFoot.prototype.setAutoCalc=function(v){this.m_autoCalc=v;} 
function GridBody(id,options){options=options||{};options.tagName=options.tagName||this.DEF_TAG_NAME;GridBody.superclass.constructor.call(this,id,options.tagName,options);}
extend(GridBody,ControlContainer);GridBody.prototype.DEF_TAG_NAME="tbody"; 
function Grid(id,options){options=options||{};options.className=(options.className!=undefined)?options.className:this.DEF_CLASS;var n=CommonHelper.nd(id,this.getWinObjDocument());if(n){n.id=n.id+":cont";}
this.setOnSelect(options.onSelect||window.onSelect);this.setOnSearch(options.onSearch);this.setCmdInsert((options.cmdInsert!=undefined)?options.cmdInsert:((options.commands&&options.commands.cmdInsert!=undefined)?options.commands.cmdInsert:true));this.setCmdEdit((options.cmdEdit!=undefined)?options.cmdEdit:((options.commands&&options.commands.cmdEdit!=undefined)?options.commands.cmdEdit:this.getCmdInsert()));this.setCmdCopy((options.cmdCopy!=undefined)?options.cmdCopy:((options.commands&&options.commands.cmdCopy!=undefined)?options.commands.cmdCopy:this.getCmdInsert()));this.setCmdDelete((options.cmdDelete!=undefined)?options.cmdDelete:((options.commands&&options.commands.cmdDelete!=undefined)?options.commands.cmdDelete:this.getCmdInsert()));this.setCmdPrint((options.cmdPrint!=undefined)?options.cmdPrint:((options.commands&&options.commands.cmdPrint!=undefined)?options.commands.cmdPrint:true));Grid.superclass.constructor.call(this,id,(options.tagName||this.DEF_TAG_NAME),options);this.setModel(options.model);this.setEditWinClass(options.editWinClass);this.setEditViewClass(options.editViewClass);this.setEditViewOptions(options.editViewOptions);this.setInsertViewOptions(options.insertViewOptions||options.editViewOptions);this.setEditInline(options.editInline);this.setRefreshInterval(options.refreshInterval||this.DEF_REFRESH_INTERVAL);this.setRowCommandClass(options.rowCommandClass);this.setAutoRefresh((options.autoRefresh!=undefined)?options.autoRefresh:false);if(options.enabled!=undefined){if(options.head)options.head.enabled=options.enabled;if(options.body)options.body.enabled=options.enabled;if(options.foot)options.foot.enabled=options.enabled;if(options.commands)options.commands.enabled=options.enabled;}
this.setHead(options.head);this.setShowHead((options.showHead!=undefined)?options.showHead:true);this.setBody(options.body||new GridBody(id+":body",{"tagName":options.bodyTagName||this.DEF_BODY_TAG_NAME,"className":options.bodyClassName}));this.setFoot(options.foot);this.setErrorControl((options.errorControl!==undefined)?options.errorControl:(this.m_html?null:new ErrorControl(id+":error")));this.setSearchInfControl((options.searchInfControl!==undefined)?options.searchInfControl:(this.m_html?null:new GridSearchInf(id+":serchInf",{"grid":this})));this.m_selectedRowClass=options.selectedRowClass||this.SELECTED_ROW_CLASS;this.m_selectedCellClass=options.selectedCellClass||this.SELECTED_CELL_CLASS;if(options.commands){options.commands.setGrid(this);this.setCommands(options.commands);this.setCmdInsert(options.commands.getCmdInsert());this.setCmdEdit(options.commands.getCmdEdit());this.setCmdCopy(options.commands.getCmdCopy());this.setCmdDelete(options.commands.getCmdDelete());this.setCmdPrint(options.commands.getCmdPrint());}
var self=this;if(options.pagination){this.setPagination(options.pagination);if(options.model){options.pagination.setFrom(options.model.getPageFrom());}
options.pagination.setGrid(this)}
this.setPopUpMenu(options.popUpMenu);this.setRowSelect((options.rowSelect!=undefined)?options.rowSelect:true);this.setLastRowSelectOnInit((options.lastRowSelectOnInit!=undefined)?options.lastRowSelectOnInit:false);this.setContClassName(options.contClassName);this.setContTagName(options.contTagName||"DIV");this.setLastRowFooter(options.lastRowFooter);this.m_onEventSetRowClass=options.onEventSetRowClass;this.m_onEventAddRow=options.onEventAddRow;this.m_onEventSetRowOptions=options.onEventSetRowOptions;this.m_onEventAddCell=options.onEventAddCell;this.m_onEventSetCellOptions=options.onEventSetCellOptions;this.m_onEventGetData=options.onEventGetData;this.setResize((options.resize!=undefined)?options.resize:true);var nav=(options.navigate!=undefined)?options.navigate:true;this.setNavigate(nav);this.setNavigateClick((options.navigateClick!=undefined)?options.navigate:nav);this.setNavigateMouse((options.navigateMouse!=undefined)?options.navigateMouse:nav);this.setInlineInsertPlace((options.inlineInsertPlace!=undefined)?options.inlineInsertPlace:"first");this.m_onRefresh=options.onRefresh;this.m_keyIds=options.keyIds||["id"];this.m_keyDown=function(e){self.onKeyDown(e);};this.m_keyPress=function(e){self.onKeyPress(e);};this.m_wheelEvent=function(e){self.onWheel(e);};this.m_focusEvent=function(){self.setFocused(true);}
this.m_blurEvent=function(){self.setFocused(false);}
this.m_clickEvent=function(ev){self.onClick(ev);};this.m_dblClickEvent=function(ev){self.onDblClick(ev);};var head=this.getHead();if(head){var col_man,col_order,col_visib,col_filter;var cmd=this.getCommands();if(cmd&&options.popUpMenu&&cmd.setPopUpMenu){cmd.setPopUpMenu(options.popUpMenu);}
if(cmd&&cmd.getCmdColManager){col_man=cmd.getCmdColManager();if(col_man){col_order=col_man.getColOrder();col_visib=col_man.getColVisibility();}}
var col_names={};for(var row in head.m_elements){var head_row=head.m_elements[row];head_row.setInitColumnOrder();for(var col in head_row.m_elements){if(head_row.m_elements[col].getSortable()){var f_name=head_row.m_elements[col].getName();if(f_name){col_names[f_name]=head_row.m_elements[col];}
head_row.m_elements[col].m_onRefresh=function(){self.onRefresh();}
head_row.m_elements[col].setColManager(col_man);if(col_order&&col_order.length){head_row.m_elements[col].setSortable(false);}}}
if(col_visib&&col_visib.length){head_row.setColumnOrder(col_visib);}}
if(col_man){col_man.init();}
if(col_order){for(var i=0;i<col_order.length;i++){var f_name=col_order[i].colId;if(col_names[f_name]){if(col_order[i].checked&&col_order[i].direct!="undefined"&&col_names[f_name]){col_names[f_name].setSortable(true);col_names[f_name].setSort(col_order[i].direct);}}}}}
if(options.fixedHeader){this.m_fixedHeader=true;this.m_fixedOffset=options.fixedOffset||0;}
this.m_editWinObjList={};}
extend(Grid,Control);Grid.prototype.DEF_TAG_NAME="TABLE";Grid.prototype.DEF_ROW_TAG_NAME="TR";Grid.prototype.DEF_CELL_TAG_NAME="TD";Grid.prototype.DEF_BODY_TAG_NAME="TBODY";Grid.prototype.SELECTED_ROW_CLASS="success";Grid.prototype.SELECTED_CELL_CLASS="info";Grid.prototype.FOCUSED_CLASS="focused";Grid.prototype.DEF_CLASS="table table-bordered table-responsive table-striped smallWidthCardFormat";Grid.prototype.DEF_TAB_INDEX="100";Grid.prototype.DEF_REFRESH_INTERVAL="0";Grid.prototype.CONSTR_FADE_CLASS="viewFadeOnConstruct";Grid.prototype.INCORRECT_VAL_CLASS="error";Grid.prototype.VAL_INIT_ATTR="initValue";Grid.prototype.m_commands;Grid.prototype.m_pagination;Grid.prototype.m_head;Grid.prototype.m_body;Grid.prototype.m_foot;Grid.prototype.m_editInline;Grid.prototype.m_editWinClass;Grid.prototype.m_editWinObj;Grid.prototype.m_editWinObjList;Grid.prototype.m_editViewClass;Grid.prototype.m_editViewOptions;Grid.prototype.m_insertViewOptions;Grid.prototype.m_editViewObj;Grid.prototype.m_rowCommandPanelClass;Grid.prototype.m_refInterval;Grid.prototype.m_refIntervalObj;Grid.prototype.m_onSelect;Grid.prototype.m_onEventSetRowClass;Grid.prototype.m_onEventDelete;Grid.prototype.m_onEventInsert;Grid.prototype.m_contClassName;Grid.prototype.m_contTagName;Grid.prototype.m_popUpMenu;Grid.prototype.m_rowSelect;Grid.prototype.m_lastRowSelectOnInit;Grid.prototype.m_resize;Grid.prototype.m_navigate;Grid.prototype.m_navigateClick;Grid.prototype.m_navigateMouse;Grid.prototype.m_cmdInsert;Grid.prototype.m_cmdEdit;Grid.prototype.m_cmdCopy;Grid.prototype.m_cmdDelete;Grid.prototype.m_cmdPrint;Grid.prototype.m_model;Grid.prototype.m_selectedRowKeys;Grid.prototype.m_selectedRowId;Grid.prototype.m_rowClass;Grid.prototype.m_container;Grid.prototype.m_containerScroll;Grid.prototype.m_lastRowFooter;Grid.prototype.m_keyDown;Grid.prototype.m_keyPress;Grid.prototype.m_wheelEvent;Grid.prototype.m_interval;Grid.prototype.m_oldParent;Grid.prototype.m_showHead;Grid.prototype.m_selectedRowClass;Grid.prototype.m_errorControl;Grid.prototype.getRowHeight=function(){var row_n=this.getSelectedRow();if(row_n){return $(row_n).height();}}
Grid.prototype.initNavigation=function(){this.setFocused(true);EventHelper.add(this.m_node,"focus",this.m_focusEvent,false);EventHelper.add(this.m_node,"blur",this.m_blurEvent,false);}
Grid.prototype.addEvents=function(){if(this.m_navigate){EventHelper.add(this.m_node,'keydown',this.m_keyDown,false);EventHelper.add(this.m_node,'keypress',this.m_keyPress,false);}
if(this.m_navigateClick){EventHelper.add(this.m_node,"click",this.m_clickEvent,false);EventHelper.add(this.m_node,"contextmenu",this.m_clickEvent,false);if(this.m_navigateMouse){EventHelper.addWheelEvent(this.m_node,this.m_wheelEvent,false);}}
if(this.m_cmdEdit||this.m_onSelect){EventHelper.add(this.m_node,"dblclick",this.m_dblClickEvent,false);}}
Grid.prototype.delEvents=function(){EventHelper.del(this.m_node,'keydown',this.m_keyDown,false);EventHelper.del(this.m_node,'keypress',this.m_keyPress,false);EventHelper.del(this.m_node,"click",this.m_clickEvent,false);EventHelper.del(this.m_node,"contextevent",this.m_clickEvent,false);EventHelper.delWheelEvent(this.m_node,this.m_wheelEvent,false);if(this.m_cmdEdit||this.m_onSelect){EventHelper.del(this.m_node,"dblclick",this.m_dblClickEvent,false);}}
Grid.prototype.selectFirstSelectableCell=function(row){var cells=row.getElementsByTagName(this.DEF_CELL_TAG_NAME);for(var i=0;i<cells.length;i++){if(this.getCellSelectable(cells[i])){this.selectCell(cells[i]);return cells[i];}}}
Grid.prototype.setSelection=function(){var selected=false;if(this.m_selectedRowKeys){var rows=this.m_body.getNode().getElementsByTagName(this.DEF_ROW_TAG_NAME);for(var i=0;i<rows.length;i++){if(rows[i].getAttribute("keys")==this.m_selectedRowKeys){if(this.m_rowSelect){this.selectRow(rows[i]);selected=true;}
else{if(rows[i].childNodes.length>this.m_selectedCellInd){this.selectCell(rows[i].childNodes[this.m_selectedCellInd]);}
else{this.selectFirstSelectableCell(rows[i]);}
selected=true;}
break;}}}
if(!selected){var rows=this.getBody().getNode().getElementsByTagName(this.DEF_ROW_TAG_NAME);if(rows&&rows.length>0){var sel_node;if(this.m_rowSelect){if(this.m_lastRowSelectOnInit){for(var i=rows.length-1;i>0;i--){if(this.getRowSelectable(rows[i])){sel_node=rows[i];this.selectRow(sel_node);break;}}}
else{for(var i=0;i<rows.length;i++){if(this.getRowSelectable(rows[i])){this.selectRow(rows[i]);break;}}}}
else{var sel_node=this.selectFirstSelectableCell((this.m_lastRowSelectOnInit)?rows[rows.length-1]:rows[0]);}
if(this.m_lastRowSelectOnInit){$(sel_node).get(0).scrollIntoView();}}}}
Grid.prototype.keyPressEvent=function(keyCode,event){var res=false;if(keyCode==13){res=this.onEditSelect(event);}
else if(keyCode==33){}
else if(keyCode==34){}
else if(keyCode==35){}
else if(keyCode==36){}
else if(keyCode==37){res=this.onPreviousColumn();}
else if(keyCode==38){res=this.onPreviousRow();}
else if(keyCode==39){res=this.onNextColumn();}
else if(keyCode==40){res=this.onNextRow();}
else if(keyCode==45){res=this.onInsert();}
else if(keyCode==46){var cmd=this.getCommands?this.getCommands():null;if(cmd&&cmd.getCmdDelete){var cmd_ctrl=cmd.getCmdDelete();if(cmd_ctrl){cmd_ctrl.onCommand();}}}
else if(keyCode==120){res=this.onCopy();}
else if(keyCode==80&&event.ctrlKey){res=this.onPrint();}
else if(keyCode==70&&event.ctrlKey&&this.m_onSearchDialog){this.m_onSearchDialog();res=true;}
else if(keyCode==71&&event.ctrlKey&&this.m_onSearchReset){this.m_onSearchReset();res=true;}
return res;}
Grid.prototype.onPreviousColumn=function(){res=false;if(!this.m_rowSelect){var selected_node=this.getSelectedNode();if(selected_node&&selected_node.previousSibling&&this.getCellSelectable(selected_node.previousSibling)){this.selectCell(selected_node.previousSibling,selected_node);}
res=true;}
return res;}
Grid.prototype.onNextColumn=function(){var res=false;if(!this.m_rowSelect){var selected_node=this.getSelectedNode();if(selected_node&&selected_node.nextSibling&&this.getCellSelectable(selected_node.nextSibling)){this.selectCell(selected_node.nextSibling,selected_node);}
res=true;}
return res;}
Grid.prototype.onPreviousRow=function(){var res=false;var selected_node=this.getSelectedNode();var new_node;if(selected_node&&this.m_rowSelect&&selected_node.previousSibling&&(selected_node.previousSibling.nodeName==selected_node.nodeName)&&this.getRowSelectable(selected_node.previousSibling)){new_node=selected_node.previousSibling;this.selectRow(new_node,selected_node);res=true;}
else if(selected_node&&!this.m_rowSelect&&selected_node.parentNode.previousSibling&&(selected_node.parentNode.previousSibling.nodeName==selected_node.parentNode.nodeName)&&this.getCellSelectable(selected_node.parentNode.previousSibling)){new_node=selected_node.parentNode.previousSibling.childNodes[DOMHelper.getElementIndex(selected_node)];this.selectCell(new_node,selected_node);res=true;}
if(res&&new_node&&!DOMHelper.inViewport(new_node,true)){$(new_node).get(0).scrollIntoView();}
return res;}
Grid.prototype.onNextRow=function(){var res=false;var selected_node=this.getSelectedNode();var new_node;if(selected_node&&this.m_rowSelect&&selected_node.nextSibling&&(selected_node.nextSibling.nodeName==selected_node.nodeName)&&this.getRowSelectable(selected_node.nextSibling)){new_node=selected_node.nextSibling;this.selectRow(new_node,selected_node);res=true;}
else if(selected_node&&!this.m_rowSelect&&selected_node.parentNode.nextSibling&&(selected_node.parentNode.nextSibling.nodeName==selected_node.parentNode.nodeName)&&this.getCellSelectable(selected_node.parentNode.nextSibling)){var ind=DOMHelper.getElementIndex(selected_node);new_node=selected_node.parentNode.nextSibling.childNodes[ind];this.selectCell(new_node,selected_node);res=true;}
if(res&&new_node&&!DOMHelper.inViewport(new_node,true)){$(new_node).get(0).scrollIntoView();}
return res;}
Grid.prototype.delRow=function(rowNode){this.deleteRowNode(rowNode);}
Grid.prototype.deleteRowNode=function(rowNode){if(!rowNode){rowNode=this.getSelectedRow();}
if(rowNode){var new_node=rowNode.nextSibling;if(!new_node){new_node=rowNode.previousSibling;}
DOMHelper.delNode(rowNode);if(new_node){if(this.m_rowSelect){this.selectRow(new_node);}
else{var tds=new_node.getElementsByTagName(this.DEF_CELL_TAG_NAME);for(var i=0;i<tds.length;i++){if(!DOMHelper.hasClass(tds[i],this.CLASS_INVISIBLE)){this.selectCell(tds[i]);break;}}}}}}
Grid.prototype.onDelete=function(callBack){var res=false;if(this.m_cmdDelete){var selected_node=this.getSelectedRow();if(selected_node){var self=this;this.setFocused(false);WindowQuestion.show({"cancel":false,"text":this.Q_DELETE,"callBack":function(r){if(r==WindowQuestion.RES_YES){self.delRow(selected_node);}
else{self.focus();}
if(callBack){callBack(r);}}});res=true;}}
return res;}
Grid.prototype.onSelect=function(){this.m_onSelect(this.getModelRow());}
Grid.prototype.onEditSelect=function(event){var res=false;if(this.m_cmdEdit&&(!this.m_onSelect||(this.m_onSelect&&event.ctrlKey))){this.edit("edit");res=true;}
else if(this.m_onSelect&&!event.ctrlKey){this.onSelect();res=true;}
return res;}
Grid.prototype.onDblClick=function(ev){ev=EventHelper.fixMouseEvent(ev);this.onEditSelect(ev);}
Grid.prototype.nodeClickable=function(node){return(this.getEnabled()&&node.nodeName==this.DEF_CELL_TAG_NAME&&DOMHelper.getParentByTagName(node,this.DEF_BODY_TAG_NAME));}
Grid.prototype.onClick=function(ev){ev=EventHelper.fixMouseEvent(ev);if(this.nodeClickable(ev.target)){if(!this.getFocused()){this.setFocused(true);}
if(this.m_rowSelect){var row=(ev.target.nodeName==this.DEF_ROW_TAG_NAME)?ev.target:DOMHelper.getParentByTagName(ev.target,this.DEF_ROW_TAG_NAME);if(row&&this.getRowSelectable(row)){this.selectRow(row,this.getSelectedNode());}}
else if(this.getCellSelectable(ev.target)){this.selectCell(ev.target,this.getSelectedNode());}}}
Grid.prototype.onKeyDown=function(e){if(this.getEnabled()&&this.getFocused()){e=EventHelper.fixKeyEvent(e);this.m_curKeyDown=e;if(this.keyPressEvent(e.keyCode,e)){if(e.preventDefault){e.preventDefault();}
e.stopPropagation();return false;}}}
Grid.prototype.onKeyPress=function(e){if(this.getEnabled()&&this.getFocused()&&!this.m_rowSelect&&this.m_onSearch&&!this.m_curKeyDown.ctrlKey){e=EventHelper.fixKeyEvent(e);if(this.m_onSearch.call(this,e)){if(e.preventDefault){e.preventDefault();}
e.stopPropagation();return false;}}}
Grid.prototype.onWheel=function(e){if(this.getEnabled()&&this.getFocused()){e=EventHelper.fixWheelEvent(e);var moved;if(e.delta>0){moved=this.onNextRow();}
else{moved=this.onPreviousRow();}
if(moved){if(e.preventDefault){e.preventDefault();}
e.stopPropagation();}
return false;}}
Grid.prototype.initEditWinObj=function(cmd){var keys={};if(cmd!="insert"){var fields=this.m_model.getFields();var key_fields=this.getKeyIds();if(key_fields&&key_fields.length){for(var i=0;i<key_fields.length;i++){if(fields[key_fields[i]]){keys[key_fields[i]]=fields[key_fields[i]].getValueXHR();}}}
else{for(var id in fields){if(fields[id].getPrimaryKey()){keys[id]=fields[id].getValueXHR();}}}}
var self=this;var view_opts;var opts=(cmd=="edit")?this.getEditViewOptions():this.getInsertViewOptions();if(typeof(opts)=="function"){view_opts=opts.call(this);}
else{view_opts={};CommonHelper.merge(view_opts,opts);}
var win_id=CommonHelper.uniqid();var win_params={"id":win_id,"app":window.getApp(),"onClose":function(res){res=res||{"updated":false};self.closeEditWinObj(res,this.getId());},"name":((this.m_editWinClass.name=="editWinClass")?this.m_editWinClass.call(this,{}):this.m_editWinClass).toString()+CommonHelper.serialize((cmd=="edit")?keys:win_id),"keys":keys,"params":{"cmd":cmd,"editViewOptions":view_opts}};var edit_cl=(this.m_editWinClass.name=="editWinClass")?this.m_editWinClass.call(this,win_params):this.m_editWinClass;this.m_editWinObjList[win_id]=new edit_cl(win_params);this.m_editWinObjList[win_id].open();}
Grid.prototype.closeEditWinObj=function(res,winId){if(this.m_editWinObjList[winId]){this.m_editWinObjList[winId].close();delete this.m_editWinObjList[winId];}
this.refreshAfterEdit(res);}
Grid.prototype.initEditView=function(parent,replacedNode,cmd,editOptions){this.setLocked(true);this.unbindPopUpMenu();var view_opts={};var opts=editOptions?editOptions:((cmd=="edit")?this.getEditViewOptions():this.getInsertViewOptions());if(typeof(opts)=="function"){view_opts=opts.call(this);}
else{view_opts={};CommonHelper.merge(view_opts,opts);}
view_opts.className=((view_opts.className!=undefined)?(view_opts.className+" "):"")+this.CONSTR_FADE_CLASS;view_opts.grid=this;var view_opts_close=view_opts.onClose;view_opts.onClose=function(res){if(view_opts_close){view_opts_close(res);}
self.closeEditView(res);};view_opts.keys=this.getSelectedNodeKeys();view_opts.cmd=cmd;view_opts.winObj=(this.m_editWinClass)?this.m_editWinObj:this.getWinObj();view_opts.row=this.getRow();var self=this;this.m_editViewObj=new this.m_editViewClass(this.getId()+":edit-view",view_opts);}
Grid.prototype.editViewToDOM=function(parent,replacedNode,cmd){if(cmd=="insert"){if(this.m_inlineInsertPlace=="current"){this.m_editViewObj.toDOMAfter(replacedNode);}
else if(this.m_inlineInsertPlace=="last"){this.m_editViewObj.toDOM(parent);}
else{this.m_editViewObj.toDOM(parent);}}
else{this.m_editViewObj.setReplacedNode(replacedNode);this.m_editViewObj.toDOM(parent);}}
Grid.prototype.fillEditView=function(cmd){if(cmd!="insert"){this.m_editViewObj.read(cmd);}
else if(this.m_model){}}
Grid.prototype.closeEditView=function(res){if(this.m_editViewObj.getReplacedNode()){var nd=this.m_editViewObj.getReplacedNode();DOMHelper.addClass(nd,this.CONSTR_FADE_CLASS);this.m_editViewObj.getNode().parentNode.replaceChild(nd,this.m_editViewObj.getNode());}
this.m_editViewObj.delDOM();delete this.m_editViewObj;if(CommonHelper.nd(this.getId())){this.bindPopUpMenu();}
this.refreshAfterEdit(res);}
Grid.prototype.refreshAfterEditCont=function(res){if(res&&res.updated){if(res.newKeys&&!CommonHelper.isEmpty(res.newKeys)){this.m_selectedRowKeys=CommonHelper.serialize(res.newKeys);}
this.onRefresh();}}
Grid.prototype.refreshAfterEdit=function(res){if(CommonHelper.nd(this.getId())){if(this.m_oldParent){this.delDOM();this.toDOM(this.m_oldParent);}
if(this.getLocked()){this.setLocked(false);}
this.focus();}
else if(this.m_oldParent){this.toDOM(this.m_oldParent);if(this.getLocked()){this.setLocked(false);}
this.addEvents();this.bindPopUpMenu();}
this.refreshAfterEditCont(res);}
Grid.prototype.read=function(isCopy){}
Grid.prototype.edit=function(cmd,editOptions){if(this.m_model&&this.m_model.getLocked()){return 0;}
var sel_n=this.getSelectedRow();if(!sel_n&&cmd=="edit")return;if(cmd!="insert"){this.setModelToCurrentRow(sel_n);}
this.m_oldParent=null;if(this.getEditInline()){var parent=this.getBody().m_node;this.initEditView(parent,sel_n,cmd,editOptions);this.editViewToDOM(parent,sel_n,cmd);this.fillEditView(cmd);}
else if(this.m_editWinClass&&!this.m_editViewClass){this.initEditWinObj(cmd);}
else if(!this.m_editWinClass&&this.m_editViewClass){var parent=this.getNode().parentNode.parentNode;this.m_oldParent=this.getNode().parentNode.parentNode;this.initEditView(parent,null,cmd,editOptions);this.delDOM();this.editViewToDOM(parent,null,cmd);this.fillEditView(cmd);}
else if(this.m_editWinClass&&this.m_editViewClass){}
else{}}
Grid.prototype.getRowSelectable=function(row){return(!DOMHelper.hasClass(row,"grid_foot")&&!DOMHelper.hasClass(row,"grid_details")&&!DOMHelper.hasClass(row,"grid_sys_row"));}
Grid.prototype.getCellSelectable=function(cell){return(!DOMHelper.hasClass(cell,"grid_sys_col")&&!DOMHelper.hasClass(cell.parentNode,"grid_foot"));}
Grid.prototype.selectNode=function(newNode,oldNode){if(oldNode){if(!this.m_rowSelect){DOMHelper.delClass(oldNode,this.m_selectedCellClass);DOMHelper.delClass(oldNode.parentNode,this.m_selectedRowClass);}
else{DOMHelper.delClass(oldNode,this.m_selectedRowClass);}}
if(newNode){if(!this.m_rowSelect){DOMHelper.addClass(newNode,this.m_selectedCellClass);DOMHelper.addClass(newNode.parentNode,this.m_selectedRowClass);}
else{DOMHelper.addClass(newNode,this.m_selectedRowClass);}}}
Grid.prototype.selectRow=function(newRow,oldRow){if(newRow){this.m_selectedRowKeys=newRow.getAttribute("keys");this.m_selectedRowId=newRow.getAttribute("id");this.selectNode(newRow,oldRow);}}
Grid.prototype.selectCell=function(newCell,oldCell){if(newCell){var tr=DOMHelper.getParentByTagName(newCell,this.DEF_ROW_TAG_NAME);if(tr){this.m_selectedRowKeys=tr.getAttribute("keys");this.m_selectedRowId=tr.getAttribute("id");this.m_selectedCellInd=DOMHelper.getElementIndex(newCell);this.selectNode(newCell,oldCell);}}}
Grid.prototype.getSelectedRow=function(){if(!this.getRowSelect()){var sel=this.getSelectedCell();if(sel){return sel.parentNode;}}
else{var sel=DOMHelper.getElementsByAttr(this.m_selectedRowClass,this.m_body.getNode(),"class",true,this.DEF_ROW_TAG_NAME);return(sel.length)?sel[0]:null;}}
Grid.prototype.getSelectedCell=function(){var sel=DOMHelper.getElementsByAttr(this.m_selectedCellClass,this.m_body.getNode(),"class",true,this.DEF_CELL_TAG_NAME);return(sel.length)?sel[0]:null;}
Grid.prototype.getSelectedNode=function(){return(this.m_rowSelect)?this.getSelectedRow():this.getSelectedCell();}
Grid.prototype.getSelectedNodeKeys=function(selectedNode){if(!selectedNode)
selectedNode=this.getSelectedRow();if(selectedNode){var k_v=selectedNode.getAttribute("keys");return k_v?CommonHelper.unserialize(k_v):null;}}
Grid.prototype.fixHeader=function(){}
Grid.prototype.createNewRow=function(rowCnt,hRowInd,modelRowCnt){var r_class=this.getHead().getRowClass(hRowInd);var row_opts;var opts=this.getHead().getRowOptions();if(typeof(opts)=="function"){row_opts=opts.call(this);}
else{row_opts=CommonHelper.clone(opts);}
row_opts.attrs=row_opts.attrs||{};row_opts.attrs.modelIndex=(modelRowCnt!=undefined)?modelRowCnt:rowCnt;if(this.m_onSelect){row_opts.className+=(row_opts.className?" ":"")+"for_select";}
if(this.m_onEventSetRowOptions){this.m_onEventSetRowOptions(row_opts);}
if(this.m_onEventSetRowClass){this.m_onEventSetRowClass(this.m_model,row_opts.className);}
var row;if(r_class.name=="Control"||r_class.name=="ControlContainer"){row=new r_class(null,row_opts.tagName||"DIV",row_opts);}
else{row=new r_class(null,row_opts);}
return row;}
Grid.prototype.createNewCell=function(column,row){var cell_class=column.getCellClass();var opts=column.getCellOptions();var cell_opts;if(typeof(opts)=="function"){cell_opts=opts.call(this,column,row);cell_opts=cell_opts||{};}
else{cell_opts=opts?CommonHelper.clone(opts):{};}
cell_opts.modelIndex=row.getAttr("modelIndex");cell_opts.fields=this.m_model.getFields();cell_opts.row=row;cell_opts.gridColumn=column;var cell;var cell_elements=column.getCellElements();if(cell_elements){cell_opts.elements=[];for(var cel_el_i=0;cel_el_i<cell_elements.length;cel_el_i++){var cel_el_opts;if(typeof cell_elements[cel_el_i].elementOptions=="function"){cel_el_opts=cell_elements[cel_el_i].elementOptions.call(this);}
else{cel_el_opts=CommonHelper.clone(cell_elements[cel_el_i].elementOptions);}
var elem_obj;var elem_class;if(typeof cell_elements[cel_el_i].elementClass=="string"){elem_class=eval(cell_elements[cel_el_i].elementClass);}
else{elem_class=cell_elements[cel_el_i].elementClass;}
if(elem_class.name=="Control"||elem_class.name=="ControlContainer"){elem_obj=new elem_class(null,cel_el_opts.tagName,cel_el_opts);}
else{elem_obj=new elem_class(null,cel_el_opts);}
elem_obj.gridColumn=column;cell_opts.elements.push(elem_obj);}}
if(this.m_onEventSetCellOptions){this.m_onEventSetCellOptions(cell_opts);}
if(cell_class.name=="Control"||cell_class.name=="ControlContainer"){cell=new cell_class(row.getId()+":"+column.getId(),cell_opts.tagName,cell_opts);}
else{cell=new cell_class(row.getId()+":"+column.getId(),cell_opts);}
column.gridCell=cell;column.setGridCell(cell);return cell;}
Grid.prototype.onGetData=function(){if(this.m_onEventGetData)this.m_onEventGetData.call(this);if(this.m_model){var redraw=!this.m_model.getCalcHash();if(!redraw){var new_hash=this.m_model.getHash();redraw=(!this.m_dataHash||this.m_dataHash!=new_hash);this.m_dataHash=new_hash;}
if(redraw){var self=this;var body=this.getBody();var foot=this.getFoot();body.delDOM();body.clear();var detail_keys={};var rows=body.getNode().getElementsByTagName(this.DEF_ROW_TAG_NAME);for(var i=0;i<rows.length;i++){if(rows[i].getAttribute("for_keys")!=null){detail_keys[hex_md5(rows[i].getAttribute("for_keys"))]={"for_keys":rows[i].getAttribute("for_keys"),"node":rows[i]};}}
var details_expanded=(detail_keys&&!CommonHelper.isEmpty(detail_keys));var master_cell=null;if(foot&&foot.calcBegin){this.m_foot.calcBegin(this.m_model);}
if(!this.getHead())return;var columns=this.getHead().getColumns();var row_cnt=0,m_row_cnt=0,field_cnt;var row,row_keys;this.m_model.reset();var pag=this.getPagination();if(pag){pag.m_from=parseInt(this.m_model.getPageFrom());pag.setCountTotal(this.m_model.getTotCount());}
var h_row_ind=0;var key_id_ar=this.getKeyIds();while(this.m_model.getNextRow()){row=this.createNewRow(row_cnt,h_row_ind,m_row_cnt);row_keys={};for(var k=0;k<key_id_ar.length;k++){row_keys[key_id_ar[k]]=this.m_model.getFieldValue(key_id_ar[k]);}
field_cnt=0;for(var col_id=0;col_id<columns.length;col_id++){columns[col_id].setGrid(this);if(columns[col_id].getField()&&columns[col_id].getField().getPrimaryKey()){row_keys[columns[col_id].getField().getId()]=columns[col_id].getField().getValue();}
var cell=this.createNewCell(columns[col_id],row);if(columns[col_id].getMaster()&&details_expanded){master_cell=cell;}
if(this.m_onEventAddCell){this.m_onEventAddCell.call(this,cell);}
row.addElement(cell);field_cnt++;}
row.setAttr("keys",CommonHelper.serialize(row_keys));if(details_expanded){var row_key_h=hex_md5(row.getAttr("keys"));if(detail_keys[row_key_h]){detail_keys[row_key_h].masterNode=row.getNode();detail_keys[row_key_h].masterCell=master_cell;}}
var row_cmd_class=this.getRowCommandClass();if(row_cmd_class){var row_class_options={"grid":this};row.addElement(new row_cmd_class(this.getId()+":"+body.getName()+":"+row.getId()+":cell-sys",row_class_options));}
if(this.m_onEventAddRow){this.m_onEventAddRow.call(this,row);}
body.addElement(row);row_cnt++;m_row_cnt++;if(foot&&foot.calc){foot.calc(this.m_model);}}
if(this.getLastRowFooter()&&row){DOMHelper.addClass(row.m_node,"grid_foot");}
if(foot&&foot.calcEnd){foot.calcEnd(this.m_model);}
body.toDOM(this.m_node);if(details_expanded){for(var det_h in detail_keys){if(!detail_keys[det_h].masterNode){DOMHelper.delNode(detail_keys[det_h].node);}
else{var p=detail_keys[det_h].masterNode.parentNode;var n_r=detail_keys[det_h].masterNode.nextSibling;var det_row;if(n_r){det_row=p.insertBefore(detail_keys[det_h].node,n_r);}
else{det_row=p.appendChild(detail_keys[det_h].node);}
if(detail_keys[det_h].masterCell){var tg=detail_keys[det_h].masterCell.getDetailToggle();if(tg){tg.setDetailRow(det_row);tg.setDetailVisible(true);}}}}}}}
if(this.m_navigate||this.m_navigateClick){this.setSelection();}}
Grid.prototype.setCommands=function(commands){this.m_commands=commands;}
Grid.prototype.getCommands=function(){return this.m_commands;}
Grid.prototype.setPagination=function(pagination){this.m_pagination=pagination;}
Grid.prototype.getPagination=function(){return this.m_pagination;}
Grid.prototype.setFoot=function(foot){this.m_foot=foot;}
Grid.prototype.getFoot=function(){return this.m_foot;}
Grid.prototype.setHead=function(head){this.m_head=head;}
Grid.prototype.getHead=function(){return this.m_head;}
Grid.prototype.setBody=function(body){this.m_body=body;}
Grid.prototype.getBody=function(){return this.m_body;}
Grid.prototype.getRowCommandClass=function(){return this.m_rowCommandClass;}
Grid.prototype.setRowCommandClass=function(v){this.m_rowCommandClass=v;}
Grid.prototype.getEditInline=function(){return this.m_editInline;}
Grid.prototype.setEditInline=function(v){this.m_editInline=v;}
Grid.prototype.getEditViewObj=function(){return this.m_editViewObj;}
Grid.prototype.getOnSelect=function(){return this.m_onSelect;}
Grid.prototype.setOnSelect=function(v){this.m_onSelect=v;}
Grid.prototype.setAutoRefresh=function(autoRefresh){this.m_autoRefresh=autoRefresh;}
Grid.prototype.getAutoRefresh=function(){return this.m_autoRefresh;}
Grid.prototype.setPopUpMenu=function(menu){this.m_popUpMenu=menu;}
Grid.prototype.getPopUpMenu=function(){return this.m_popUpMenu;}
Grid.prototype.setRowSelect=function(v){this.m_rowSelect=v;}
Grid.prototype.getRowSelect=function(){return this.m_rowSelect;}
Grid.prototype.setLastRowSelectOnInit=function(v){this.m_lastRowSelectOnInit=v;}
Grid.prototype.getLastRowSelectOnInit=function(){return this.m_lastRowSelectOnInit;}
Grid.prototype.setContClassName=function(v){this.m_contClassName=v;}
Grid.prototype.getContClassName=function(){return this.m_contClassName;}
Grid.prototype.setContTagName=function(v){this.m_contTagName=v;}
Grid.prototype.getContTagName=function(){return this.m_contTagName;}
Grid.prototype.setLastRowFooter=function(v){this.m_lastRowFooter=v;}
Grid.prototype.getLastRowFooter=function(){return this.m_lastRowFooter;}
Grid.prototype.setResize=function(v){this.m_resize=v;}
Grid.prototype.getResize=function(){return this.m_resize;}
Grid.prototype.setCmdInsert=function(v){this.m_cmdInsert=v;}
Grid.prototype.getCmdInsert=function(){return this.m_cmdInsert;}
Grid.prototype.setCmdEdit=function(v){this.m_cmdEdit=v;}
Grid.prototype.getCmdEdit=function(){return this.m_cmdEdit;}
Grid.prototype.setCmdCopy=function(v){this.m_cmdCopy=v;}
Grid.prototype.getCmdCopy=function(){return this.m_cmdCopy;}
Grid.prototype.setCmdDelete=function(v){this.m_cmdDelete=v;}
Grid.prototype.getCmdDelete=function(){return this.m_cmdDelete;}
Grid.prototype.setCmdPrint=function(v){this.m_cmdPrint=v;}
Grid.prototype.getCmdPrint=function(){return this.m_cmdPrint;}
Grid.prototype.setNavigate=function(v){this.m_navigate=v;if(this.m_navigate){this.setTabIndex(this.getTabIndex()||this.DEF_TAB_INDEX);}}
Grid.prototype.getNavigate=function(){return this.m_navigate;}
Grid.prototype.setNavigateClick=function(v){this.m_navigateClick=v;}
Grid.prototype.getNavigateClick=function(){return this.m_navigateClick;}
Grid.prototype.setNavigateMouse=function(v){this.m_navigateMouse=v;}
Grid.prototype.getNavigateClick=function(){return this.m_navigateMouse;}
Grid.prototype.setInlineInsertPlace=function(v){this.m_inlineInsertPlace=v;}
Grid.prototype.getInlineInsertPlace=function(){return this.m_inlineInsertPlace;}
Grid.prototype.setRefreshInterval=function(v){if(this.m_refreshInterval==v){return;}
this.m_refInterval=v;if(this.m_refIntervalObj!=undefined){window.clearInterval(this.m_refIntervalObj);}
if(v>0){var self=this;this.m_refIntervalObj=setInterval(function(){self.onRefresh();},v);}}
Grid.prototype.getRefreshInterval=function(){return this.m_refInterval;}
Grid.prototype.setEditViewClass=function(v){this.m_editViewClass=v;}
Grid.prototype.getEditViewClass=function(){return this.m_editViewClass;}
Grid.prototype.setEditViewOptions=function(v){this.m_editViewOptions=v;}
Grid.prototype.getEditViewOptions=function(){return this.m_editViewOptions;}
Grid.prototype.setInsertViewOptions=function(v){this.m_insertViewOptions=v;}
Grid.prototype.getInsertViewOptions=function(){return this.m_insertViewOptions;}
Grid.prototype.setEditWinClass=function(v){this.m_editWinClass=v;}
Grid.prototype.getEditWinClass=function(){return this.m_editWinClass;}
Grid.prototype.lockRefresh=function(v){if(v){this.m_interval=this.getRefreshInterval();this.setRefreshInterval(0);if(this.m_model)this.m_model.setLocked(true);}
else{if(this.m_model)this.m_model.setLocked(false);this.setRefreshInterval(this.m_interval);}}
Grid.prototype.setEnabled=function(v){if(this.m_head)this.m_head.setEnabled(v);if(this.m_body)this.m_body.setEnabled(v);if(this.m_foot)this.m_foot.setEnabled(v);if(this.m_commands)this.m_commands.setEnabled(v);this.lockRefresh(!v);Grid.superclass.setEnabled.call(this,v);}
Grid.prototype.setLocked=function(v){if(this.m_head)this.m_head.setLocked(v);if(this.m_body)this.m_body.setLocked(v);if(this.m_foot)this.m_foot.setLocked(v);if(this.m_commands)this.m_commands.setLocked(v);this.lockRefresh(v);Grid.superclass.setLocked.call(this,v);}
Grid.prototype.toDOM=function(parent){this.m_container=new ControlContainer(this.getId()+":cont",this.m_contTagName,{"className":this.m_contClassName});if(this.m_commands){this.m_container.addElement(this.m_commands);}
if(this.m_head&&this.getShowHead())this.m_head.toDOM(this.m_node);if(this.m_body)this.m_body.toDOM(this.m_node);if(this.m_foot)this.m_foot.toDOM(this.m_node);if(this.m_searchInfControl)this.m_container.addElement(this.m_searchInfControl);if(this.m_errorControl)this.m_container.addElement(this.m_errorControl);this.m_container.toDOM(parent);Grid.superclass.toDOM.call(this,this.m_container.getNode());if(this.m_pagination){try{this.m_pagination.toDOM(this.m_container.getNode());}
catch(e){}}
if(this.m_autoRefresh){this.onRefresh();}
if(this.m_resize){}
if(this.m_navigate){this.initNavigation();this.setSelection();}
this.bindPopUpMenu();this.fixHeader();this.m_rendered=true;if(!this.m_autoRefresh){this.onGetData();}}
Grid.prototype.delDOM=function(){if(this.m_refIntervalObj!=undefined){window.clearInterval(this.m_refIntervalObj);}
this.delEvents();if(this.m_commands)this.m_commands.delDOM();if(this.m_errorControl)this.m_errorControl.delDOM();if(this.m_pagination)this.m_pagination.delDOM();if(this.m_head)this.m_head.delDOM();if(this.m_body)this.m_body.delDOM();if(this.m_foot)this.m_foot.delDOM();EventHelper.del(this.m_node,'focus',this.m_focusEvent,false);EventHelper.del(this.m_node,'blur',this.m_blurEvent,false);Grid.superclass.delDOM.call(this);if(this.m_container)this.m_container.delDOM();this.m_rendered=false;}
Grid.prototype.getFocused=function(){return DOMHelper.hasClass(this.m_node,this.FOCUSED_CLASS);}
Grid.prototype.setFocused=function(focused){if(this.m_node&&focused&&!this.getFocused()){var tables=this.getWinObjDocument().getElementsByTagName("table");for(var i=0;i<tables.length;i++){DOMHelper.delClass(tables[i],this.FOCUSED_CLASS);}
DOMHelper.addClass(this.m_node,this.FOCUSED_CLASS);this.addEvents();}
else if(this.m_node&&!focused){DOMHelper.delClass(this.m_node,this.FOCUSED_CLASS);if(!CommonHelper.isIE()){this.delEvents();}}}
Grid.prototype.focus=function(){this.setFocused(true);try{this.getNode().focus();}
catch(e){}}
Grid.prototype.getModel=function(){return this.m_model;}
Grid.prototype.setModel=function(m){this.m_model=m;}
Grid.prototype.onError=function(erStr){var self=this;window.showError(erStr,function(){self.setFocused(true);});}
Grid.prototype.onEdit=function(){if(this.m_cmdEdit){this.edit("edit");}}
Grid.prototype.onCopy=function(){if(this.m_cmdCopy){this.edit("copy");}}
Grid.prototype.onInsert=function(){if(this.m_cmdInsert){this.edit("insert");}}
Grid.prototype.onPrint=function(){if(this.m_cmdPrint){WindowPrint.show({content:this.getNode().outerHTML});}}
Grid.prototype.onRefresh=function(callBack){this.onGetData();if(this.callBack){this.callBack.call(this);}}
Grid.prototype.onRowUp=function(){var selected_node=this.getSelectedNode();if(selected_node){if(this.m_model){this.setModelToCurrentRow();this.m_model.recMoveUp(this.m_model.getRowIndex());this.onRefresh();}
else if(selected_node.previousSibling){selected_node.parentNode.insertBefore(selected_node,selected_node.previousSibling);}}}
Grid.prototype.onRowDown=function(){var selected_node=this.getSelectedNode();if(selected_node){if(this.m_model){this.setModelToCurrentRow();this.m_model.recMoveDown(this.m_model.getRowIndex());this.onRefresh();}
else if(selected_node.nextSibling){selected_node.nextSibling.parentNode.insertBefore(selected_node.nextSibling,selected_node.nextSibling.previousSibling);}}}
Grid.prototype.setModelToCurrentRow=function(rowNode){if(!this.m_model.getRowCount()){return;}
var keys=this.getSelectedNodeKeys(rowNode);if(!keys||typeof(keys)!="object"){return;}
if(CommonHelper.isEmpty(keys)){throw new Error(this.m_model.ER_REС_NOT_FOUND);}
var key_fields={};for(var k in keys){key_fields[k]=CommonHelper.clone(this.m_model.getField(k));key_fields[k].setValue(keys[k]);}
this.m_model.recLocate(key_fields,true);}
Grid.prototype.getModelRow=function(){this.setModelToCurrentRow();return this.m_model.getFields();}
Grid.prototype.getRow=function(){var row_n=this.getSelectedRow();if(row_n){return this.getBody().getElement(row_n.getAttribute("modelIndex"));}}
Grid.prototype.setKeyIds=function(v){this.m_keyIds=v;}
Grid.prototype.getKeyIds=function(){if((!this.m_keyIds||!this.m_keyIds.length)&&(this.m_model&&this.m_model.getFields())){this.m_keyIds=[];var fields=this.m_model.getFields();for(fid in fields){if(fields[fid].getPrimaryKey()){this.m_keyIds.push(fid);}}}
return this.m_keyIds;}
Grid.prototype.setOnSearch=function(v){this.m_onSearch=v;}
Grid.prototype.getOnSearch=function(){return this.m_onSearch;}
Grid.prototype.setOnSearchDialog=function(v){this.m_onSearchDialog=v;}
Grid.prototype.getOnSearchDialog=function(){return this.m_onSearchDialog;}
Grid.prototype.setOnSearchReset=function(v){this.m_onSearchReset=v;}
Grid.prototype.getOnSearchReset=function(){return this.m_onSearchReset;}
Grid.prototype.setShowHead=function(v){this.m_showHead=v;}
Grid.prototype.getShowHead=function(){return this.m_showHead;}
Grid.prototype.isNull=function(){return(!this.m_model||this.m_model.getRowCount()==0);}
Grid.prototype.reset=function(){if(this.m_model){this.m_model.clear();this.onRefresh();}}
Grid.prototype.setValue=function(v){if(this.m_model){this.m_model.setData(v);this.onRefresh();}}
Grid.prototype.setInitValue=function(v){this.setValue(v);this.setAttr(this.VAL_INIT_ATTR,CommonHelper.md5(this.m_model.getData().toString()));}
Grid.prototype.getInitValue=function(){return this.getAttr(this.VAL_INIT_ATTR);}
Grid.prototype.getValue=function(){if(this.m_model){return this.m_model.getData().toString();}}
Grid.prototype.getModified=function(){return(CommonHelper.md5(this.getValue())!=this.getAttr(this.VAL_INIT_ATTR));}
Grid.prototype.getIsRef=function(){return false;}
Grid.prototype.setNotValid=function(erStr){DOMHelper.addClass(this.m_container.getNode(),this.INCORRECT_VAL_CLASS);if(this.getErrorControl()){this.getErrorControl().setValue(erStr);}
else{throw new Error(erStr);}}
Grid.prototype.setValid=function(){DOMHelper.delClass(this.m_container.getNode(),this.INCORRECT_VAL_CLASS);if(this.getErrorControl())this.getErrorControl().clear();}
Grid.prototype.getInputEnabled=function(){return this.getEnabled();}
Grid.prototype.setInputEnabled=function(v){this.setEnabled(v);}
Grid.prototype.setErrorControl=function(v){this.m_errorControl=v;}
Grid.prototype.getErrorControl=function(){return this.m_errorControl;}
Grid.prototype.setSearchInfControl=function(v){this.m_searchInfControl=v;}
Grid.prototype.getSearchInfControl=function(){return this.m_searchInfControl;}
Grid.prototype.setColumnVisible=function(colId,v){var columns=this.getHead().getColumns();var is_list=CommonHelper.isArray(colId);var col_indexes=[];for(var ind=0;ind<columns.length;ind++){if(is_list&&CommonHelper.inArray(columns[ind].getId(),colId)>=0){columns[ind].setVisible(v);col_indexes.push(ind);}
else if(!is_list&&columns[ind].getId()==colId){columns[ind].setVisible(v);col_indexes.push(ind);break;}}
var b=this.getBody().getNode();for(i=0;i<b.rows.length;i++){for(var j=0;j<col_indexes.length;j++){if(!v){DOMHelper.addClass(b.rows[i].cells[col_indexes[j]],"hidden");}
else{DOMHelper.delClass(b.rows[i].cells[col_indexes[j]],"hidden");}}}}
Grid.prototype.setVisible=function(v){if(this.m_container)this.m_container.setVisible(v);}
Grid.prototype.bindPopUpMenu=function(){if(this.getPopUpMenu()!=undefined){this.getPopUpMenu().bind(this.m_body.getNode());}}
Grid.prototype.unbindPopUpMenu=function(){if(this.getPopUpMenu()!=undefined){this.getPopUpMenu().unbind();}} 
Grid.prototype.Q_DELETE="Удалить запись?";Grid.prototype.NT_REC_DELETED="Запись удалена.";Grid.prototype.ER_COL_NOT_BOUND="Колонка % грида % не привязана к полю модели."; 
function GridSearchInf(id,options){options=options||{};options.hidden=true;this.m_grid=options.grid;GridSearchInf.superclass.constructor.call(this,id,"DIV",options);}
extend(GridSearchInf,ControlContainer);GridSearchInf.prototype.addSearch=function(filterId,label,val,fieldId){var ctrl_id=this.getId()+":"+filterId;if(this.elementExists(filterId)){this.delElement(filterId);}
var self=this;var tl=CommonHelper.format(this.ITEM_TITLE_PATTERN,[label,val]);this.addElement(new ControlContainer(ctrl_id,"SPAN",{"attrs":{"fieldid":fieldId},"name":filterId,"elements":[new Control(null,"SPAN",{"value":label+":","title":tl}),new Control(null,"SPAN",{"value":val+" ","title":tl}),new Control(null,"SPAN",{"className":"glyphicon glyphicon-remove-circle","attrs":{"style":"cursor:pointer;"},"title":this.ITEM_REMOVE,"events":{"click":(function(contName){return function(){window.setGlobalWait(true);self.m_grid.unsetFilter(contName);self.m_grid.onRefresh((function(searchCtrl,contName){return function(){searchCtrl.delElement(contName);searchCtrl.toDOM();var el=searchCtrl.getElements();var el_empty=true;for(var id in el){if(el[id]!=undefined){el_empty=false;break;}}
if(el_empty){searchCtrl.hide();if(searchCtrl.m_onFilterClear)searchCtrl.m_onFilterClear();}
window.setGlobalWait(false);self.m_grid.focus();}})(self,contName));}})(filterId)}})]}));this.toDOM();this.show();}
GridSearchInf.prototype.setOnFilterClear=function(v){this.m_onFilterClear=v;}
GridSearchInf.prototype.clearSearch=function(){this.clear();this.hide();this.toDOM();} 
GridSearchInf.prototype.ITEM_REMOVE="Удалить фильтр";GridSearchInf.prototype.ITEM_TITLE_PATTERN="Фильтровать по колонке '%', по значению %"; 
function VariantStorage(options){options=options||{};this.m_afterFormClose=options.afterFormClose;this.m_variantStorageName=options.variantStorageName;}
VariantStorage.prototype.openStorage=function(dataCol){var self=this;this.m_dataCol=dataCol;this.m_view=new VariantStorageOpenView("VariantStorageOpenView",{"variantStorageName":this.m_variantStorageName,"onClose":function(){self.closeOpenForm();},"onSelect":function(fields){self.loadVariant(fields.variant_name.getValue(),self.m_dataCol);}});this.m_form=new WindowFormModalBS(CommonHelper.uniqid(),{"cmdCancel":true,"controlCancelCaption":this.m_view.CMD_CANCEL_CAP,"controlCancelTitle":this.m_view.CMD_CANCEL_TITLE,"cmdOk":true,"controlOkCaption":this.m_view.CMD_OK_CAP,"controlOkTitle":this.m_view.CMD_OK_TITLE,"onClickOk":function(){self.loadVariant(self.m_view.getElement("variants").getFieldValue("variant_name"),self.m_dataCol);},"onClickCancel":function(){self.formClose();},"content":this.m_view,"contentHead":this.m_view.HEAD_TITLE});this.m_form.open();}
VariantStorage.prototype.loadVariant=function(variantName,dataCol){var pm_id=dataCol?"get_"+dataCol:"get_all_data";var pm=(new VariantStorage_Controller()).getPublicMethod(pm_id);pm.setFieldValue("storage_name",this.m_variantStorageName);pm.setFieldValue("variant_name",variantName);var self=this;pm.run({"ok":function(resp){var m=new VariantStorage_Model({"data":resp.getModelData("VariantStorage_Model")});if(m.getNextRow()){self.formClose(dataCol?m.getFieldValue(dataCol):m);}}});}
VariantStorage.prototype.saveStorage=function(dataCol,dataColVal){var self=this;this.m_dataCol=dataCol;this.m_dataColVal=dataColVal;this.m_view=new VariantStorageSaveView("VariantStorageSaveView",{"variantStorageName":this.m_variantStorageName,"onClose":function(){self.form();}});this.m_form=new WindowFormModalBS(CommonHelper.uniqid(),{"cmdCancel":true,"controlCancelCaption":this.m_view.CMD_CANCEL_CAP,"controlCancelTitle":this.m_view.CMD_CANCEL_TITLE,"cmdOk":true,"controlOkCaption":this.m_view.CMD_OK_CAP,"controlOkTitle":this.m_view.CMD_OK_TITLE,"onClickOk":function(){self.saveVariant(self.m_dataCol,self.m_dataColVal,self.m_view.getElement("name").getValue());},"onClickCancel":function(){self.formClose();},"content":this.m_view,"contentHead":this.m_view.HEAD_TITLE});this.m_form.open();}
VariantStorage.prototype.saveVariant=function(dataCol,dataColVal,variantName){var pm=(new VariantStorage_Controller()).getPublicMethod("upsert_"+dataCol);pm.setFieldValue("storage_name",this.m_variantStorageName);pm.setFieldValue("variant_name",variantName);pm.setFieldValue("default_variant",this.m_view.getElement("default_variant").getValue());dataColVal=(typeof(dataColVal)=="string")?dataColVal:CommonHelper.serialize(dataColVal);pm.setFieldValue(dataCol,dataColVal);var self=this;pm.run({"ok":function(resp){self.formClose();}});}
VariantStorage.prototype.formClose=function(val){this.m_form.close();delete this.m_form;if(this.m_afterFormClose)this.m_afterFormClose.call(this,val);} 
function GridCommands(id,options){options=options||{};options.attrs=options.attrs||{};options.className=options.className||options.attrs["class"]||this.DEF_CLASS_NAME;GridCommands.superclass.constructor.call(this,id,(options.tagName||this.DEF_TAG_NAME),options);options.cmdInsert=(options.cmdInsert!=undefined)?options.cmdInsert:true;options.cmdEdit=(options.cmdEdit!=undefined)?options.cmdEdit:options.cmdInsert;options.cmdCopy=(options.cmdCopy!=undefined)?options.cmdCopy:options.cmdInsert;options.cmdDelete=(options.cmdDelete!=undefined)?options.cmdDelete:options.cmdInsert;options.cmdRefresh=(options.cmdRefresh!=undefined)?options.cmdRefresh:true;options.cmdPrint=(options.cmdPrint!=undefined)?options.cmdPrint:true;options.cmdFilter=(options.cmdFilter!=undefined)?options.cmdFilter:false;options.cmdPrintObj=(options.cmdPrintObj!=undefined)?options.cmdPrintObj:false;options.cmdPrintObj=(options.printObjList!=undefined)?true:options.cmdPrintObj;options.cmdSearch=(options.cmdSearch!=undefined)?true:options.cmdSearch;var self=this;if(options.cmdInsert||options.controlInsert){this.setControlInsert(options.controlInsert||new ButtonCtrl(id+":cmdInsert",{"glyph":"glyphicon-plus","onClick":function(){self.m_grid.onInsert();},"attrs":{"title":this.BTN_INSERT_TITLE}}));}
if(options.cmdEdit||options.controlEdit){this.setControlEdit(options.controlEdit||new ButtonCtrl(id+":cmdEdit",{"glyph":"glyphicon-pencil","onClick":function(){self.m_grid.onEdit();},"attrs":{"title":this.BTN_EDIT_TITLE}}));}
if(options.cmdCopy||options.controlCopy){this.setControlCopy(options.controlCopy||new ButtonCtrl(id+":cmdCopy",{"glyph":"glyphicon-copy","onClick":function(event){self.m_grid.onCopy();},"attrs":{"title":this.BTN_COPY_TITLE}}));}
if(options.cmdDelete||options.controlDelete){this.setControlDelete(options.controlDelete||new ButtonCtrl(id+":cmdDelete",{"glyph":"glyphicon-remove","onClick":function(){self.m_grid.onDelete();},"attrs":{"title":this.BTN_DELETE_TITLE}}));}
if(options.cmdColumnManager||options.controlColumnManager){this.setControlDelete(options.controlColumnManager||new ButtonCtrl(id+":cmdColumnManager",{"glyph":"glyphicon-th-list","onClick":function(){self.onColumnManager();},"attrs":{"title":this.BTN_COL_MANAGER_TITLE}}));}
if(options.cmdPrint||options.controlPrint){this.setControlPrint(options.controlPrint||new ButtonCtrl(id+":cmdPrint",{"glyph":"glyphicon-print","onClick":function(e){self.m_grid.onPrint();},"attrs":{"title":this.BTN_PRINT_TITLE}}));}
if(options.cmdRefresh||options.controlRefresh){this.setControlRefresh(options.controlRefresh||new ButtonCtrl(id+":cmdRefresh",{"glyph":"glyphicon-refresh","onClick":function(){self.m_grid.onRefresh();},"attrs":{"title":this.BTN_REFRESH_TITLE}}));}
if(options.cmdPrintObj){this.setControlPrintObj(options.controlPrintObj||new ButtonPrintList(id+":cmdPrintObj",{"printList":options.printObjList,"keyIds":options.printObjListKeyIds,"app":options.app}));}
if(options.cmdSearch||options.controlSearch){this.setControlSearch(options.controlSearch||new ButtonCtrl(id+":cmdSearch",{"glyph":"glyphicon-search","onClick":function(){self.onSearch();},"attrs":{"title":this.BTN_SEARCH_TITLE}}));}
if(options.cmdFilter){this.setControlFilter(options.controlFilter||new GridFilter(CommonHelper.uniqid(),{"filters":options.filters,"app":options.app}));this.setControlFilterToggle(options.controlFilterToggle||new ButtonCtrl(id+":cmdToggle",{"attrs":{"title":this.m_controlFilter.DEF_TOGGLE_CTRL_TITLE},"onClick":function(){var filter=self.getControlFilter();$(filter.getNode()).collapse("toggle");if(!DOMHelper.hasClass(filter.getNode(),"in")){var filters=filter.getFilter().getFilters();for(var id in filters){filters[id].binding.getControl().focus();break;}}},"caption":this.m_controlFilter.DEF_TOGGLE_CTRL_CAP,"glyph":"glyphicon-triangle-bottom","app":options.app}));}
this.m_popUpMenu=options.popUpMenu;this.addControls();}
extend(GridCommands,ControlContainer);GridCommands.prototype.DEF_TAG_NAME="div";GridCommands.prototype.DEF_CLASS_NAME="btn-group";GridCommands.prototype.m_grid;GridCommands.prototype.m_controlInsert;GridCommands.prototype.m_controlEdit;GridCommands.prototype.m_controlCopy;GridCommands.prototype.m_controlDelete;GridCommands.prototype.m_controlPrint;GridCommands.prototype.m_controlRefresh;GridCommands.prototype.m_controlFilterToggle;GridCommands.prototype.m_controlFilter;GridCommands.prototype.m_controlColumnManager;GridCommands.prototype.m_controlPrintObj;GridCommands.prototype.m_controlSearch;GridCommands.prototype.popUpMenu;GridCommands.prototype.addControls=function(){if(this.m_controlInsert)this.addElement(this.m_controlInsert);if(this.m_controlEdit)this.addElement(this.m_controlEdit);if(this.m_controlCopy)this.addElement(this.m_controlCopy);if(this.m_controlDelete)this.addElement(this.m_controlDelete);if(this.m_controlPrint)this.addElement(this.m_controlPrint);if(this.m_controlColumnManager)this.addElement(this.m_controlColumnManager);if(this.m_controlRefresh)this.addElement(this.m_controlRefresh);if(this.m_controlPrintObj)this.addElement(this.m_controlPrintObj);if(this.m_controlSearch)this.addElement(this.m_controlSearch);if(this.m_controlFilter){this.addElement(this.m_controlFilterToggle);this.addElement(this.m_controlFilter);}
if(this.m_popUpMenu){this.toPopUp(this.m_popUpMenu);}}
GridCommands.prototype.setGrid=function(v){this.m_grid=v;if(this.m_controlFilter){var self=this;this.m_controlFilter.setOnRefresh(function(){self.m_grid.onRefresh();});}
if(this.m_controlPrintObj){this.m_controlPrintObj.setGrid(this.m_grid);}
if(this.m_popUpMenu){this.selectToPopUp();}}
GridCommands.prototype.getGrid=function(){return this.m_grid;}
GridCommands.prototype.setEnabled=function(en){if(this.m_controlInsert)this.m_controlInsert.setEnabled(en);if(this.m_controlEdit)this.m_controlEdit.setEnabled(en);if(this.m_controlCopy)this.m_controlCopy.setEnabled(en);if(this.m_controlDelete)this.m_controlDelete.setEnabled(en);if(this.m_controlPrint)this.m_controlPrint.setEnabled(en);if(this.m_controlColumnManager)this.m_controlColumnManager.setEnabled(en);if(this.m_controlRefresh)this.m_controlRefresh.setEnabled(en);if(this.m_controlSearch)this.m_controlSearch.setEnabled(en);if(this.m_controlFilterToggle)this.m_controlFilterToggle.setEnabled(en);if(this.m_controlFilter)this.m_controlFilter.setEnabled(en);GridCommands.superclass.setEnabled.call(this,en);}
GridCommands.prototype.printObjToPopUp=function(){if(this.m_controlPrintObj&&this.m_popUpMenu){this.m_popUpMenu.addSeparator();var id=this.getId();this.m_printObjList=this.m_controlPrintObj.getObjList();var self=this;for(var i=0;i<this.m_printObjList.length;i++){this.m_popUpMenu.addButton(new ButtonCtrl(null,{"caption":this.m_printObjList[i].getCaption(),"attrs":{"objInd":i},"onClick":function(){self.m_printObjList[this.getAttr("objInd")].onClick();}}));}}}
GridCommands.prototype.selectToPopUp=function(){if(this.m_grid&&this.m_grid.getOnSelect()){if(this.m_controlInsert||this.m_controlEdit||this.m_controlCopy||this.m_controlDelete||this.m_controlPrint||this.m_controlColumnManager||this.m_controlRefresh||this.m_controlSearch){this.m_popUpMenu.addSeparator();}
var self=this;this.m_popUpMenu.addButton(new ButtonCtrl(null,{"caption":"Выбрать","onClick":function(){self.m_grid.onSelect();}}));}}
GridCommands.prototype.toPopUp=function(){if(this.m_controlInsert)this.m_popUpMenu.addButton(this.m_controlInsert);if(this.m_controlEdit)this.m_popUpMenu.addButton(this.m_controlEdit);if(this.m_controlCopy)this.m_popUpMenu.addButton(this.m_controlCopy);if(this.m_controlDelete)this.m_popUpMenu.addButton(this.m_controlDelete);if(this.m_controlPrint)this.m_popUpMenu.addButton(this.m_controlPrint);if(this.m_controlColumnManager)this.m_popUpMenu.addButton(this.m_controlColumnManager);if(this.m_controlSearch)this.m_popUpMenu.addButton(this.m_controlSearch);if(this.m_controlRefresh)this.m_popUpMenu.addButton(this.m_controlRefresh);this.printObjToPopUp();}
GridCommands.prototype.getControlInsert=function(){return this.m_controlInsert;}
GridCommands.prototype.getCmdInsert=function(){return this.m_controlInsert;}
GridCommands.prototype.setControlInsert=function(v){this.m_controlInsert=v;}
GridCommands.prototype.getControlEdit=function(){return this.m_controlEdit;}
GridCommands.prototype.getCmdEdit=function(){return this.m_controlEdit;}
GridCommands.prototype.setControlEdit=function(v){this.m_controlEdit=v;}
GridCommands.prototype.getControlCopy=function(){return this.m_controlCopy;}
GridCommands.prototype.getCmdCopy=function(){return this.m_controlCopy;}
GridCommands.prototype.setControlCopy=function(v){this.m_controlCopy=v;}
GridCommands.prototype.getControlDelete=function(){return this.m_controlDelete;}
GridCommands.prototype.getCmdDelete=function(){return this.m_controlDelete;}
GridCommands.prototype.setControlDelete=function(v){this.m_controlDelete=v;}
GridCommands.prototype.getControlPrint=function(){return this.m_controlPrint;}
GridCommands.prototype.getCmdPrint=function(){return this.m_controlPrint;}
GridCommands.prototype.setControlPrint=function(v){this.m_controlPrint=v;}
GridCommands.prototype.getControlRefresh=function(){return this.m_controlRefresh;}
GridCommands.prototype.getCmdRefresh=function(){return this.m_controlRefresh;}
GridCommands.prototype.setControlRefresh=function(v){this.m_controlRefresh=v;}
GridCommands.prototype.getControlFilter=function(){return this.m_controlFilter;}
GridCommands.prototype.setControlFilter=function(v){this.m_controlFilter=v;}
GridCommands.prototype.getControlFilterToggle=function(){return this.m_controlFilterToggle;}
GridCommands.prototype.setControlFilterToggle=function(v){this.m_controlFilterToggle=v;}
GridCommands.prototype.getControlColumnManager=function(){return this.m_controlColumnManager;}
GridCommands.prototype.setControlColumnManager=function(v){this.m_controlColumnManager=v;}
GridCommands.prototype.getControlPrintObj=function(){return this.m_controlPrintObj;}
GridCommands.prototype.setControlPrintObj=function(v){this.m_controlPrintObj=v;}
GridCommands.prototype.getControlSearch=function(){return this.m_controlSearch;}
GridCommands.prototype.setControlSearch=function(v){this.m_controlSearch=v;}
GridCommands.prototype.onColumnManager=function(){var btnCont=this;var self=this;this.m_colManform=new WindowFormModalBS(uuid(),{"content":new ViewGridColumnManager(uuid(),{"grid":this.m_grid,"onClose":function(){btnCont.m_colManform.close();self.m_grid.onRefresh.call(self.m_grid);},"app":this.getApp()})});this.m_colManform.open();} 
function GridCmd(id,options){options=options||{};this.m_id=id;this.m_grid=options.grid;this.setShowCmdControl((options.showCmdControl!=undefined)?options.showCmdControl:true);this.setShowCmdControlInPopup((options.showCmdControlInPopup!=undefined)?options.showCmdControlInPopup:true);var btn_class=options.buttonClass||ButtonCmd;var self=this;this.m_onCommand=options.onCommand||this.onCommand;this.m_controls=options.controls||[new btn_class(id,{"glyph":options.glyph,"glyphPopUp":options.glyphPopUp,"caption":options.caption,"onClick":function(e){self.m_onCommand.call(self,e);},"attrs":{"title":options.title||this.TITLE}})];}
GridCmd.prototype.m_id;GridCmd.prototype.m_controls;GridCmd.prototype.m_grid;GridCmd.prototype.m_showCmdControl;GridCmd.prototype.m_showCmdControlInPopup;GridCmd.prototype.getShowCmdControl=function(){return this.m_showCmdControl;}
GridCmd.prototype.setShowCmdControl=function(v){this.m_showCmdControl=v;}
GridCmd.prototype.getShowCmdControlInPopup=function(){return this.m_showCmdControlInPopup;}
GridCmd.prototype.setShowCmdControlInPopup=function(v){this.m_showCmdControlInPopup=v;}
GridCmd.prototype.setGrid=function(v){this.m_grid=v;}
GridCmd.prototype.getGrid=function(){return this.m_grid;}
GridCmd.prototype.setId=function(v){this.m_id=v;}
GridCmd.prototype.getId=function(){return this.m_id;}
GridCmd.prototype.addControl=function(control){this.m_controls.push(control);}
GridCmd.prototype.getControl=function(ind){ind=(ind!=undefined)?ind:0;return(ind>=0&&ind<this.m_controls.length)?this.m_controls[ind]:undefined;}
GridCmd.prototype.controlsToContainer=function(container){this.m_container=container;for(var i=0;i<this.m_controls.length;i++){var n=this.m_controls[i].getName();container.addElement(this.m_controls[i]);}}
GridCmd.prototype.controlsToPopUp=function(popUp){for(var i=0;i<this.m_controls.length;i++){popUp.addButton(this.m_controls[i]);}}
GridCmd.prototype.onCommand=function(e){}
GridCmd.prototype.onDelDOM=function(){} 
function GridCmdContainer(id,options){options=options||{};options.attrs=options.attrs||{};options.className=options.className||options.attrs["class"]||this.DEF_CLASS_NAME;options.cmdInsert=(options.cmdInsert!=undefined)?options.cmdInsert:true;options.cmdEdit=(options.cmdEdit!=undefined)?options.cmdEdit:options.cmdInsert;options.cmdCopy=(options.cmdCopy!=undefined)?options.cmdCopy:options.cmdInsert;options.cmdDelete=(options.cmdDelete!=undefined)?options.cmdDelete:options.cmdInsert;options.cmdRefresh=(options.cmdRefresh!=undefined)?options.cmdRefresh:true;options.cmdPrint=(options.cmdPrint!=undefined)?options.cmdPrint:true;options.cmdPrintObj=(options.printObjList!=undefined)?true:((options.cmdPrintObj!=undefined)?options.cmdPrintObj:false);options.cmdSearch=(options.cmdSearch!=undefined)?options.cmdSearch:true;options.cmdColManager=(options.cmdColManager!=undefined)?options.cmdColManager:false;options.cmdFilter=(options.cmdFilter!=undefined)?options.cmdFilter:(options.filters!=undefined);options.cmdFilterSave=(options.cmdFilterSave!=undefined)?options.cmdFilterSave:(options.variantStorage!=undefined);options.cmdFilterOpen=(options.cmdFilterOpen!=undefined)?options.cmdFilterOpen:(options.variantStorage!=undefined);options.cmdAllCommands=(options.cmdAllCommands!=undefined)?options.cmdAllCommands:true;options.templateOptions=options.templateOptions||{};options.templateOptions.cmdInsert=options.cmdInsert,options.templateOptions.cmdEdit=options.cmdEdit,options.templateOptions.cmdCopy=options.cmdCopy,options.templateOptions.cmdDelete=options.cmdDelete,options.templateOptions.cmdRefresh=options.cmdRefresh,options.templateOptions.cmdPrint=options.cmdPrint,options.templateOptions.cmdPrintObj=options.cmdPrintObj,options.templateOptions.cmdSearch=options.cmdSearch,options.templateOptions.cmdColManager=options.cmdColManager,options.templateOptions.cmdFilter=options.cmdFilter,options.templateOptions.cmdFilterSave=options.cmdFilterSave,options.templateOptions.cmdFilterOpen=options.cmdFilterOpen,options.templateOptions.cmdAllCommands=options.cmdAllCommands
GridCmdContainer.superclass.constructor.call(this,id,(options.tagName||this.DEF_TAG_NAME),options);options.variantStorage=options.variantStorage||{};if(options.cmdInsert){this.setCmdInsert((typeof(options.cmdInsert)=="object")?options.cmdInsert:new GridCmdInsert(id+":insert"));}
if(options.cmdEdit){this.setCmdEdit((typeof(options.cmdEdit)=="object")?options.cmdEdit:new GridCmdEdit(id+":edit"));}
if(options.cmdCopy){this.setCmdCopy((typeof(options.cmdCopy)=="object")?options.cmdCopy:new GridCmdCopy(id+":copy"));}
if(options.cmdDelete){this.setCmdDelete((typeof(options.cmdDelete)=="object")?options.cmdDelete:new GridCmdDelete(id+":delete"));}
if(options.cmdColManager){var filters_copy=CommonHelper.clone(options.filters);this.setCmdColManager((typeof(options.cmdColManager)=="object")?options.cmdColManager:new GridCmdColManager(id+":colManager",{"filters":options.filters,"variantStorageName":options.variantStorage["name"],"variantStorageModel":options.variantStorage.model}));}
if(options.cmdPrint){this.setCmdPrint((typeof(options.cmdPrint)=="object")?options.cmdPrint:new GridCmdPrint(id+":print"));}
if(options.cmdRefresh){this.setCmdRefresh((typeof(options.cmdRefresh)=="object")?options.cmdRefresh:new GridCmdRefresh(id+":print"));}
if(options.cmdPrintObj){this.setCmdPrintObj((typeof(options.cmdPrintObj)=="object")?options.printObj:new GridCmdPrintObj(id+":printObj",{"printList":options.printObjList,"keyIds":options.printObjListKeyIds}));}
if(options.cmdSearch){this.setCmdSearch((typeof(options.cmdSearch)=="object")?options.cmdSearch:new GridCmdSearch(id+":search"));}
if(options.cmdFilter){if(options.cmdFilterSave){this.setCmdFilterSave((typeof(options.cmdFilterSave)=="object")?options.cmdFilterSave:new GridCmdFilterSave(id+":filterSave",{"variantStorageName":options.variantStorage.name,"dataCol":"filter_data"}));}
if(options.cmdFilterOpen){this.setCmdFilterOpen((typeof(options.cmdFilterOpen)=="object")?options.cmdFilterOpen:new GridCmdFilterOpen(id+":filterOpen",{"variantStorageName":options.variantStorage.name,"dataCol":"filter_data"}));}
this.setCmdFilter((typeof(options.cmdFilter)=="object")?options.cmdFilter:new GridCmdFilter(id+":filter",{"filters":options.filters,"controlSave":this.getCmdFilterSave(),"controlOpen":this.getCmdFilterOpen(),"variantStorage":options.variantStorage}));}
if(options.cmdAllCommands){this.setCmdAllCommands((typeof(options.cmdAllCommands)=="object")?options.cmdAllCommands:new GridCmdAllCommands(id+":allCommands"));}
this.m_popUpMenu=options.popUpMenu;this.m_commands=[];if(options.addCustomCommands){options.addCustomCommands.call(this,this.m_commands);}
else if(options.addCustomCommandsBefore){options.addCustomCommandsBefore.call(this,this.m_commands);}
this.addControls();if(options.addCustomCommandsAfter){var l=this.m_commands.length;options.addCustomCommandsAfter.call(this,this.m_commands);for(var i=l;i<this.m_commands.length;i++){if(this.m_commands[i].getShowCmdControl()){this.m_commands[i].controlsToContainer(this);}}}
if(this.m_cmdAllCommands){this.m_commands.push(this.m_cmdAllCommands);if(this.m_cmdAllCommands.getShowCmdControl()){this.m_cmdAllCommands.controlsToContainer(this);}}}
extend(GridCmdContainer,ControlContainer);GridCmdContainer.prototype.DEF_TAG_NAME="DIV";GridCmdContainer.prototype.DEF_CLASS_NAME="cmdButtons";GridCmdContainer.prototype.m_grid;GridCmdContainer.prototype.m_cmdInsert;GridCmdContainer.prototype.m_cmdEdit;GridCmdContainer.prototype.m_cmdCopy;GridCmdContainer.prototype.m_cmdDelete;GridCmdContainer.prototype.m_cmdPrint;GridCmdContainer.prototype.m_cmdRefresh;GridCmdContainer.prototype.m_cmdColManager;GridCmdContainer.prototype.m_cmdPrintObj;GridCmdContainer.prototype.m_cmdSearch;GridCmdContainer.prototype.m_cmdFilter;GridCmdContainer.prototype.m_cmdFilterSave;GridCmdContainer.prototype.m_cmdFilterOpen;GridCmdContainer.prototype.m_cmdAllCommands;GridCmdContainer.prototype.m_popUpMenu;GridCmdContainer.prototype.addCommands=function(){if(this.m_cmdInsert){this.m_commands.push(this.m_cmdInsert);}
if(this.m_cmdEdit){this.m_commands.push(this.m_cmdEdit);}
if(this.m_cmdCopy){this.m_commands.push(this.m_cmdCopy);}
if(this.m_cmdDelete){this.m_commands.push(this.m_cmdDelete);}
if(this.m_cmdPrint){this.m_commands.push(this.m_cmdPrint);}
if(this.m_cmdColManager){this.m_commands.push(this.m_cmdColManager);}
if(this.m_cmdRefresh){this.m_commands.push(this.m_cmdRefresh);}
if(this.m_cmdPrintObj){this.m_commands.push(this.m_cmdPrintObj);}
if(this.m_cmdSearch){this.m_commands.push(this.m_cmdSearch);}
if(this.m_cmdFilter){this.m_commands.push(this.m_cmdFilter);}
if(this.m_cmdFilterSave){this.m_commands.push(this.m_cmdFilterSave);}
if(this.m_cmdFilterOpen){this.m_commands.push(this.m_cmdFilterOpen);}}
GridCmdContainer.prototype.addControls=function(){this.addCommands();for(var i=0;i<this.m_commands.length;i++){if(this.m_commands[i].getShowCmdControl()){this.m_commands[i].controlsToContainer(this);}}}
GridCmdContainer.prototype.setGrid=function(v){this.m_grid=v;for(var i=0;i<this.m_commands.length;i++){this.m_commands[i].setGrid(v);}
if(this.m_popUpMenu){this.selectToPopUp();}}
GridCmdContainer.prototype.getGrid=function(){return this.m_grid;}
GridCmdContainer.prototype.selectToPopUp=function(){if(this.m_grid&&this.m_grid.getOnSelect()){if(this.m_cmdInsert||this.m_cmdEdit||this.m_cmdCopy||this.m_cmdDelete||this.m_cmdPrint||this.m_cmdColManager||this.m_cmdRefresh||this.m_cmdSearch){this.m_popUpMenu.addSeparator();}
var self=this;this.m_popUpMenu.addButton(new ButtonCtrl(null,{"caption":this.GRID_SELECT_POPUP_CAPTION,"onClick":function(){self.m_grid.onSelect();}}));}}
GridCmdContainer.prototype.toPopUp=function(){for(var i=0;i<this.m_commands.length;i++){if(this.m_commands[i].getShowCmdControlInPopup()){this.m_commands[i].controlsToPopUp(this.m_popUpMenu);}}}
GridCmdContainer.prototype.getCmdInsert=function(){return this.m_cmdInsert;}
GridCmdContainer.prototype.setCmdInsert=function(v){this.m_cmdInsert=v;}
GridCmdContainer.prototype.getCmdEdit=function(){return this.m_cmdEdit;}
GridCmdContainer.prototype.setCmdEdit=function(v){this.m_cmdEdit=v;}
GridCmdContainer.prototype.getCmdCopy=function(){return this.m_cmdCopy;}
GridCmdContainer.prototype.setCmdCopy=function(v){this.m_cmdCopy=v;}
GridCmdContainer.prototype.getCmdDelete=function(){return this.m_cmdDelete;}
GridCmdContainer.prototype.setCmdDelete=function(v){this.m_cmdDelete=v;}
GridCmdContainer.prototype.getCmdPrint=function(){return this.m_cmdPrint;}
GridCmdContainer.prototype.setCmdPrint=function(v){this.m_cmdPrint=v;}
GridCmdContainer.prototype.getCmdRefresh=function(){return this.m_cmdRefresh;}
GridCmdContainer.prototype.setCmdRefresh=function(v){this.m_cmdRefresh=v;}
GridCmdContainer.prototype.getCmdColManager=function(){return this.m_cmdColManager;}
GridCmdContainer.prototype.setCmdColManager=function(v){this.m_cmdColManager=v;}
GridCmdContainer.prototype.getCmdPrintObj=function(){return this.m_cmdPrintObj;}
GridCmdContainer.prototype.setCmdPrintObj=function(v){this.m_cmdPrintObj=v;}
GridCmdContainer.prototype.getCmdSearch=function(){return this.m_cmdSearch;}
GridCmdContainer.prototype.setCmdSearch=function(v){this.m_cmdSearch=v;}
GridCmdContainer.prototype.getCmdFilter=function(){return this.m_cmdFilter;}
GridCmdContainer.prototype.setCmdFilter=function(v){this.m_cmdFilter=v;}
GridCmdContainer.prototype.getCmdFilterSave=function(){return this.m_cmdFilterSave;}
GridCmdContainer.prototype.setCmdFilterSave=function(v){this.m_cmdFilterSave=v;}
GridCmdContainer.prototype.getCmdFilterOpen=function(){return this.m_cmdFilterOpen;}
GridCmdContainer.prototype.setCmdFilterOpen=function(v){this.m_cmdFilterOpen=v;}
GridCmdContainer.prototype.getCmdAllCommands=function(){return this.m_cmdAllCommands;}
GridCmdContainer.prototype.setCmdAllCommands=function(v){this.m_cmdAllCommands=v;}
GridCmdContainer.prototype.getPopUpMenu=function(){return this.m_popUpMenu;}
GridCmdContainer.prototype.setPopUpMenu=function(v){this.m_popUpMenu=v;if(this.m_popUpMenu){this.toPopUp(this.m_popUpMenu);}}
GridCmdContainer.prototype.delDOM=function(){for(var i=0;i<this.m_commands.length;i++){this.m_commands[i].onDelDOM();}
GridCmdContainer.superclass.delDOM.call(this);} 
GridCmdContainer.prototype.GRID_SELECT_POPUP_CAPTION="Выбрать"; 
function GridCmdContainerAjx(id,options){options=options||{};options.cmdExport=(options.cmdExport!=undefined)?options.cmdExport:true;if(options.cmdExport){this.setCmdExport((typeof(options.cmdExport)=="object")?options.cmdExport:new GridCmdExport(id+":export"));}
options.templateOptions=options.templateOptions||{};options.templateOptions.cmdExport=options.cmdExport,GridCmdContainerAjx.superclass.constructor.call(this,id,options);}
extend(GridCmdContainerAjx,GridCmdContainer);GridCmdContainerAjx.prototype.m_cmdExport;GridCmdContainerAjx.prototype.addCommands=function(){GridCmdContainerAjx.superclass.addCommands.call(this);if(this.m_cmdExport){this.m_commands.push(this.m_cmdExport);}}
GridCmdContainerAjx.prototype.getCmdExport=function(){return this.m_cmdExport;}
GridCmdContainerAjx.prototype.setCmdExport=function(v){this.m_cmdExport=v;} 
function GridCmdContainerDOC(id,options){options=options||{};options.cmdDOCUnprocess=(options.cmdDOCUnprocess!=undefined)?options.cmdDOCUnprocess:true;options.cmdDOCShowActs=(options.cmdDOCShowActs!=undefined)?options.cmdDOCShowActs:options.cmdDOCUnprocess;if(options.cmdDOCUnprocess){this.setCmdDOCUnprocess((typeof(options.cmdDOCUnprocess)=="object")?options.cmdDOCUnprocess:new GridCmdDOCUnprocess(id+":unprocess"));}
if(options.cmdDOCShowActs){this.setCmdDOCShowActs((typeof(options.cmdDOCShowActs)=="object")?options.cmdDOCShowActs:new GridCmdDOCShowActs(id+":showActs"));}
GridCmdContainerDOC.superclass.constructor.call(this,id,options);}
extend(GridCmdContainerDOC,GridCmdContainerAjx);GridCmdContainerDOC.prototype.m_cmdDOCUnprocess;GridCmdContainerDOC.prototype.m_cmdDOCShowActs;GridCmdContainerDOC.prototype.addCommands=function(){GridCmdContainerDOC.superclass.addCommands.call(this);if(this.m_cmdDOCUnprocess){this.m_commands.push(this.m_cmdDOCUnprocess);}
if(this.m_cmdDOCShowActs){this.m_commands.push(this.m_cmdDOCShowActs);}}
GridCmdContainerDOC.prototype.getCmdDOCUnprocess=function(){return this.m_cmdDOCUnprocess;}
GridCmdContainerDOC.prototype.setCmdDOCUnprocess=function(v){this.m_cmdDOCUnprocess=v;}
GridCmdContainerDOC.prototype.getCmdDOCShowActs=function(){return this.m_cmdDOCShowActs;}
GridCmdContainerDOC.prototype.setCmdDOCShowActs=function(v){this.m_cmdDOCShowActs=v;} 
function GridCmdInsert(id,options){options=options||{};options.glyphPopUp="glyphicon-plus";options.caption=this.CAPTION;options.showCmdControl=(options.showCmdControl!=undefined)?options.showCmdControl:true;GridCmdInsert.superclass.constructor.call(this,id,options);}
extend(GridCmdInsert,GridCmd);GridCmdInsert.prototype.onCommand=function(){this.m_grid.onInsert();} 
GridCmdInsert.prototype.TITLE="Создать новую запись";GridCmdInsert.prototype.CAPTION="Добавить"; 
function GridCmdEdit(id,options){options=options||{};options.glyph="glyphicon-pencil";options.showCmdControl=false;GridCmdEdit.superclass.constructor.call(this,id,options);}
extend(GridCmdEdit,GridCmd);GridCmdEdit.prototype.onCommand=function(){this.m_grid.onEdit();} 
GridCmdEdit.prototype.TITLE="Редактировать текущую запись"; 
function GridCmdCopy(id,options){options=options||{};options.glyph="glyphicon-copy";options.showCmdControl=(options.showCmdControl!=undefined)?options.showCmdControl:false;GridCmdCopy.superclass.constructor.call(this,id,options);}
extend(GridCmdCopy,GridCmd);GridCmdCopy.prototype.onCommand=function(){this.m_grid.onCopy();} 
GridCmdCopy.prototype.TITLE="Скопировать текущую запись"; 
function GridCmdDelete(id,options){options=options||{};options.glyph="glyphicon-remove";options.showCmdControl=(options.showCmdControl!=undefined)?options.showCmdControl:false;GridCmdDelete.superclass.constructor.call(this,id,options);}
extend(GridCmdDelete,GridCmd);GridCmdDelete.prototype.onCommand=function(){this.m_grid.onDelete();} 
GridCmdDelete.prototype.TITLE="Удалить текущую запись"; 
function GridCmdColManager(id,options){options=options||{};options.glyph="glyphicon-th-list";options.showCmdControl=false;this.m_variantStorageName=options.variantStorageName;this.m_variantStorageModel=options.variantStorageModel;if(this.m_variantStorageModel)this.m_variantStorageModel.getRow(0);GridCmdColManager.superclass.constructor.call(this,id,options);}
extend(GridCmdColManager,GridCmd);GridCmdColManager.prototype.m_colManForm;GridCmdColManager.prototype.m_variantStorageName;GridCmdColManager.prototype.m_variantStorageModel;GridCmdColManager.prototype.VISIB_ID="col_visib_data";GridCmdColManager.prototype.ORDER_ID="col_order_data";GridCmdColManager.prototype.FILTER_ID="filter_data";GridCmdColManager.prototype.onCommand=function(){var self=this;this.m_view=new ViewGridColManager("ViewGridColManager",{"grid":this.m_grid,"variantStorageName":this.m_variantStorageName,"filter":this.m_filter,"onApplyFilters":function(){self.onApplyFilters();},"onResetFilters":function(){self.onResetFilters();},"onVariantSave":function(){self.onVariantSave();},"onVariantOpen":function(){self.onVariantOpen();},"colOrder":this.m_colOrder,"colVisibility":this.m_colVisibility});this.m_colManForm=new WindowFormModalBS(CommonHelper.uniqid(),{"content":this.m_view,"cmdCancel":true,"controlCancelCaption":this.m_view.CMD_CANCEL_CAP,"controlCancelTitle":this.m_view.CMD_CANCEL_TITLE,"cmdOk":false,"onClickCancel":function(){self.m_colManForm.close();self.refreshGrid();},"contentHead":this.m_view.HEAD_TITLE});this.m_colManForm.open();}
GridCmdColManager.prototype.m_filter;GridCmdColManager.prototype.BTN_FILTER_CLASS_SET="btn-danger";GridCmdColManager.prototype.BTN_FILTER_CLASS_UNSET="btn-primary";GridCmdColManager.prototype.getCol=function(id){return(this.m_variantStorageModel?this.m_variantStorageModel.getFieldValue(id):null);}
GridCmdColManager.prototype.getColOrder=function(){return this.getCol(this.ORDER_ID);}
GridCmdColManager.prototype.getColVisibility=function(){return this.getCol(this.VISIB_ID);}
GridCmdColManager.prototype.init=function(){var head=this.m_grid.getHead();for(var row in head.m_elements){var head_row=head.m_elements[row];var columns=head_row.getInitColumns();var col_visib_data=this.getColVisibility()||[];var vis_cols={};for(var ind=0;ind<col_visib_data.length;ind++){var col=col_visib_data[ind].colId;col_visib_data[ind].colRef=columns[col];vis_cols[col]=col;}
var col_order_data=this.getColOrder()||[];var ord_cols={};for(var ind=0;ind<col_order_data.length;ind++){var col=col_order_data[ind].colId;col_order_data[ind][ind].colRef=columns[col];ord_cols[col]=col;}
for(var col in columns){if(!vis_cols[col]){col_visib_data.push({"colId":col,"checked":true,"colRef":columns[col]});}
if(!ord_cols[col]&&columns[col].getSortable()){var sort_cols=columns[col].getSortFieldId();var sort_dir=columns[col].getSort();if(!sort_cols){sort_dir="";sort_cols="";var cols=columns[col].getColumns();for(var i=0;i<cols.length;i++){sort_cols+=(sort_cols=="")?"":",";sort_cols+=cols[i].getField().getId();sort_dir+=(sort_dir=="")?"":",";sort_dir+="asc";}}
col_order_data.push({"colId":col,"fields":sort_cols,"directs":sort_dir,"checked":(sort_dir.length>0),"colRef":columns[col]});}}}}
GridCmdColManager.prototype.getFilter=function(){return this.m_filter;}
GridCmdColManager.prototype.setFilter=function(v){this.m_filter=v;}
GridCmdColManager.prototype.afterFilterSet=function(setCnt){var cl_old,cl_new;if(setCnt){cl_new=this.BTN_FILTER_CLASS_SET;cl_old=this.BTN_FILTER_CLASS_UNSET;}
else{cl_new=this.BTN_FILTER_CLASS_UNSET;cl_old=this.BTN_FILTER_CLASS_SET;}}
GridCmdColManager.prototype.refreshGrid=function(){var pag=this.m_grid.getPagination();if(pag){pag.reset();}
var self=this;this.m_grid.onRefresh();}
GridCmdColManager.prototype.onApplyFilters=function(){var cnt=this.m_filter.applyFilters(this.m_grid);this.afterFilterSet(cnt);this.refreshGrid();}
GridCmdColManager.prototype.onResetFilters=function(){this.m_filter.resetFilters(this.m_grid);this.afterFilterSet(0);this.refreshGrid();}
GridCmdColManager.prototype.onVariantOpen=function(){var self=this;(new VariantStorage({"variantStorageName":this.m_variantStorageName,"afterFormClose":function(model){delete self.m_variantStorageModel;self.m_variantStorageModel=model;self.m_view.refresh();}})).openStorage();}
GridCmdColManager.prototype.onVariantSave=function(){var vals={};vals[this.VISIB_ID]=this.getColVisibility();vals[this.ORDER_ID]=this.getColOrder();(new VariantStorage({"variantStorageName":this.m_variantStorageName})).saveStorage("all_data",vals);} 
GridCmdColManager.prototype.TITLE="Открыть форму настройки колонок";GridCmdColManager.prototype.NOTE_SAVED="Сохранение выполнено"; 
function GridCmdPrint(id,options){options=options||{};options.glyph="glyphicon-print";options.showCmdControl=(options.showCmdControl!=undefined)?options.showCmdControl:false;GridCmdPrint.superclass.constructor.call(this,id,options);}
extend(GridCmdPrint,GridCmd);GridCmdPrint.prototype.onCommand=function(){this.m_grid.onPrint();} 
GridCmdPrint.prototype.TITLE="Распечатать список"; 
function GridCmdRefresh(id,options){options=options||{};options.glyph="glyphicon-refresh";options.showCmdControl=(options.showCmdControl!=undefined)?options.showCmdControl:false;GridCmdRefresh.superclass.constructor.call(this,id,options);}
extend(GridCmdRefresh,GridCmd);GridCmdRefresh.prototype.onCommand=function(){this.m_grid.onRefresh();} 
GridCmdRefresh.prototype.TITLE="Обновить содержимое списка"; 
function GridCmdPrintObj(id,options){options=options||{};options.showCmdControlInPopup=(options.showCmdControlInPopup!=undefined)?options.showCmdControlInPopup:false;var self=this;options.controls=[new ButtonPrintList(id,{"printList":options.printList,"keyIds":options.keyIds,"app":options.app})];GridCmdPrintObj.superclass.constructor.call(this,id,options);}
extend(GridCmdPrintObj,GridCmd);GridCmdPrintObj.prototype.controlsToPopUp=function(popUp){if(this.m_controls.length){var self=this;popUp.addButton(new ButtonCtrl(null,{"caption":"Печатные формы","attrs":{"objInd":0},"onClick":function(){}}));}}
GridCmdPrintObj.prototype.setGrid=function(v){GridCmdPrintObj.superclass.setGrid.call(this,v);if(this.m_controls.length){this.m_controls[0].setGrid(v);}}
GridCmdPrintObj.prototype.setPrintList=function(v){this.m_controls[0].setPrintList(v);} 
function GridCmdSearch(id,options){options=options||{};options.showCmdControl=(options.showCmdControl!=undefined)?options.showCmdControl:true;var btn_class=options.buttonClass||ButtonCmd;var self=this;this.m_setCtrl=new btn_class(id+":set",{"glyph":"glyphicon-zoom-in","onClick":function(){self.onCommand();},"attrs":{"title":this.TITLE}});options.controls=[this.m_setCtrl];GridCmdSearch.superclass.constructor.call(this,id,options);}
extend(GridCmdSearch,GridCmd);GridCmdSearch.prototype.showDialog=function(str){var selected_node=this.m_grid.getSelectedNode();var cur_field_id;if(selected_node){cur_field_id=selected_node.getAttribute("fieldId");}
else{var inf_ctrl=this.m_grid.getSearchInfControl();if(inf_ctrl){var l=inf_ctrl.getElements();for(var id in l){cur_field_id=l[id].getAttr("fieldid");break;}}}
var columns=[];var grid_columns=this.m_grid.getHead().getColumns();var grid_model=this.m_grid.getModel();var col_ind=0;for(var i in grid_columns){var f=grid_columns[i].getField();if(f&&grid_columns[i].getSearchable()){var fid=f.getId();var col_sopts=grid_columns[i].getSearchOptions()||{};if(!col_sopts.field&&grid_columns[i].getCtrlBindFieldId()&&grid_model.fieldExists(grid_columns[i].getCtrlBindFieldId())){grid_columns[i].setCtrlBindField(grid_model.getField(grid_columns[i].getCtrlBindFieldId()));}
if(!col_sopts.field&&grid_columns[i].getCtrlBindField()){col_sopts.field=grid_columns[i].getCtrlBindField();}
var ctrl_cl=(col_sopts&&col_sopts.ctrlClass)?col_sopts.ctrlClass:grid_columns[i].getCtrlClass();if(!col_sopts.field&&(f.getDataType()==Field.prototype.DT_JSON||f.getDataType()==Field.prototype.DT_JSONB)&&fid.substr(fid.length-5)=="s_ref"){var guessed_fid=fid.substr(0,fid.length-5)+"_id";if(ctrl_cl&&grid_model.fieldExists(guessed_fid)){col_sopts.field=new FieldInt(guessed_fid);col_sopts.typeChange=false;col_sopts.searchType="on_match";}
else if(ctrl_cl){var ctrl_key_ids=(new ctrl_cl()).getKeyIds();if(ctrl_key_ids&&ctrl_key_ids.length){col_sopts.field=new FieldString(fid+"->keys->"+ctrl_key_ids[0]);col_sopts.typeChange=false;col_sopts.searchType="on_match";}}
else{col_sopts.field=new FieldString(fid+"->descr");}}
var sStruc={"id":fid,"descr":grid_columns[i].getHeadCell().getValue(),"current":((!cur_field_id&&col_ind==0)||cur_field_id==fid),"ctrlClass":ctrl_cl,"ctrlOptions":grid_columns[i].getCtrlOptions()||{},"searchType":col_sopts.searchType||"on_part","typeChange":col_sopts.typeChange,"field":col_sopts.field||f};if(sStruc.searchType!="on_match"&&sStruc.searchType!="on_beg"&&sStruc.searchType!="on_part"){sStruc.searchType="on_match";}
if(sStruc.typeChange==undefined)sStruc.typeChange=true;var data_t=sStruc.field.getDataType();if(data_t==f.DT_DATE){if(!sStruc.ctrlClass)sStruc.ctrlClass=EditDate;if(!sStruc.searchType)sStruc.searchType="on_match";sStruc.typeChange=false;}
else if(data_t==f.DT_DATETIME||data_t==f.DT_DATETIMETZ){if(!sStruc.ctrlClass)sStruc.ctrlClass=EditDateTime;if(!sStruc.searchType)sStruc.searchType="on_match";sStruc.typeChange=false;}
else if(data_t==f.DT_TIME){if(!sStruc.ctrlClass)sStruc.ctrlClass=EditTime;if(!sStruc.searchType)sStruc.searchType="on_match";sStruc.typeChange=false;}
else if(data_t==f.DT_INT||data_t==f.DT_INT_UNSIGNED){if(!sStruc.ctrlClass)sStruc.ctrlClass=EditInt;}
else if(data_t==f.DT_FLOAT_UNSIGNED||data_t==f.DT_FLOAT){if(!sStruc.ctrlClass)sStruc.ctrlClass=EditFloat;}
else if(data_t==f.DT_BOOL){if(!sStruc.ctrlClass)sStruc.ctrlClass=EditCheckBox;sStruc.searchType="on_match";sStruc.typeChange=false;}
else if(data_t==f.DT_EMAIL){if(!sStruc.ctrlClass)sStruc.ctrlClass=EditEmail;}
else if(!sStruc.ctrlClass){sStruc.ctrlClass=EditString;}
if(sStruc.searchType==undefined)sStruc.searchType="on_part";columns.push(sStruc);}
col_ind++;}
var self=this;WindowSearch.show({"text":str,"columns":columns,"callBack":function(res,params){self.m_grid.focus();if(res==WindowSearch.RES_OK){self.doSearch(params);}}});}
GridCmdSearch.prototype.onCommand=function(){this.showDialog("");}
GridCmdSearch.prototype.onUnset=function(){var pag=this.m_grid.getPagination();if(pag)pag.reset();var inf_ctrl=this.m_grid.getSearchInfControl();if(inf_ctrl){inf_ctrl.clearSearch();}
this.setFiltered(false);var self=this;this.m_grid.onRefresh(function(){self.m_grid.focus();});}
GridCmdSearch.prototype.doSearch=function(params){if(params.search_str){var pm=this.m_grid.getReadPublicMethod();var contr=pm.getController();var s_pref=(params.how=="on_part")?"%":"";var s_pref_descr=(params.how=="on_part")?"*":"";var s_posf=(params.how=="on_part"||params.how=="on_beg")?"%":"";var s_posf_descr=(params.how=="on_part"||params.how=="on_beg")?"*":"";var pm=this.m_grid.getReadPublicMethod();var contr=pm.getController();var filter={"field":params.where,"sign":(params.how!="on_match")?contr.PARAM_SGN_LIKE:contr.PARAM_SGN_EQUAL,"val":s_pref+params.search_str+s_posf,"icase":(params.how!="on_match")?"1":"0"};this.m_grid.setFilter(filter);var pag=this.m_grid.getPagination();if(pag)pag.reset();var self=this;var inf_ctrl=this.m_grid.getSearchInfControl();if(inf_ctrl){inf_ctrl.addSearch(this.m_grid.getFilterKey(filter),params.descr,s_pref_descr+params.search_descr+s_posf_descr,params.where);inf_ctrl.setOnFilterClear(function(){self.setFiltered(false);});}
window.setGlobalWait(true);this.m_grid.onRefresh(function(){self.setFiltered(true);window.setGlobalWait(false);});}}
GridCmdSearch.prototype.setGrid=function(v){GridCmdSearch.superclass.setGrid.call(this,v);var self=this;v.setOnSearch(function(e){var ch=(e&&e.char)?e.char:null;if(ch){self.m_grid.setFocused(false);self.showDialog(ch);return true;}});v.setOnSearchDialog(function(){self.onCommand();});v.setOnSearchReset(function(){self.onUnset();});}
GridCmdSearch.prototype.setFiltered=function(v){if(v){DOMHelper.swapClasses(this.m_setCtrl.getNode(),"btn-danger","bg-blue-400");}
else{DOMHelper.swapClasses(this.m_setCtrl.getNode(),"bg-blue-400","btn-danger");}} 
GridCmdSearch.prototype.TITLE="Открыть форму поиска (ctrl+F)";GridCmdSearch.prototype.TITLE_UNSET="Отменить поиск (ctrl+G)"; 
function GridCmdExport(id,options){options=options||{};options.showCmdControl=(options.showCmdControl!=undefined)?options.showCmdControl:false;options.glyph="glyphicon-save-file";GridCmdExport.superclass.constructor.call(this,id,options);}
extend(GridCmdExport,GridCmd);GridCmdExport.prototype.onCommand=function(){var flt=this.m_grid.getCommands().getCmdFilter();if(flt){flt.getFilter().applyFilters(this.m_grid);}
var pm=this.m_grid.getReadPublicMethod();if(this.m_grid.condFilterToMethod){this.m_grid.condFilterToMethod(pm);}
pm.setFieldValue("from",0);pm.unsetFieldValue("count");pm.download("ViewExcel");} 
GridCmdExport.prototype.TITLE="Экспорт списка в файл Excel"; 
function GridCmdAllCommands(id,options){options=options||{};options.glyph="glyphicon-collapse-down";options.caption=this.CAPTION;options.showCmdControl=true;options.showCmdControlInPopup=false;GridCmdAllCommands.superclass.constructor.call(this,id,options);}
extend(GridCmdAllCommands,GridCmd);GridCmdAllCommands.prototype.onCommand=function(e){var m=this.m_grid.getPopUpMenu();if(m){if(m.getVisible()){m.hide();}
else{m.show(e,this.m_controls[0].getNode());}}} 
GridCmdAllCommands.prototype.TITLE="Показать все команды";GridCmdAllCommands.prototype.CAPTION="Все команды  "; 
function GridCmdDOCUnprocess(id,options){options=options||{};options.showCmdControl=(options.showCmdControl!=undefined)?options.showCmdControl:false;options.glyph="glyphicon-unchecked";GridCmdDOCUnprocess.superclass.constructor.call(this,id,options);}
extend(GridCmdDOCUnprocess,GridCmd);GridCmdDOCUnprocess.prototype.onCommand=function(){var self=this;WindowQuestion.show({"cancel":false,"text":this.CONFIRM,"callBack":function(r){if(r==WindowQuestion.RES_YES){self.doDelete();}}});}
GridCmdDOCUnprocess.prototype.doDelete=function(){var contr=this.m_grid.getReadPublicMethod().getController();if(contr.publicMethodExists("set_unprocessed")){var self=this;var keys=this.m_grid.getSelectedNodeKeys();var pm=contr.getPublicMethod("set_unprocessed");pm.setFieldValue("doc_id",keys["id"]);pm.run({"async":true,"ok":function(){self.m_grid.onRefresh();window.showNote(self.NOTE_DELETED);}})}} 
GridCmdDOCUnprocess.prototype.TITLE="Отменить проведение документа";GridCmdDOCUnprocess.prototype.CONFIRM="Отменить проведение документа?";GridCmdDOCUnprocess.prototype.NOTE_DELETED="Отменено проведение документа."; 
function GridCmdDOCShowActs(id,options){options=options||{};options.showCmdControl=(options.showCmdControl!=undefined)?options.showCmdControl:false;options.glyph="glyphicon-log-in";GridCmdDOCShowActs.superclass.constructor.call(this,id,options);}
extend(GridCmdDOCShowActs,GridCmd);GridCmdDOCShowActs.prototype.onCommand=function(){alert("GridCmdDOCShowActs.prototype.onCommand");} 
GridCmdDOCShowActs.prototype.TITLE="Показать движения документа"; 
function GridCmdRowUp(id,options){options=options||{};options.glyph="glyphicon-arrow-up";options.buttonClass=options.buttonClass||ButtonCmd;options.showCmdControl=(options.showCmdControl!=undefined)?options.showCmdControl:false;GridCmdRowUp.superclass.constructor.call(this,id,options);}
extend(GridCmdRowUp,GridCmd);GridCmdRowUp.prototype.onCommand=function(){this.m_grid.onRowUp();} 
GridCmdRowUp.prototype.TITLE="На одну строку вверх"; 
function GridCmdRowDown(id,options){options=options||{};options.glyph="glyphicon-arrow-down";options.buttonClass=ButtonCtrl;options.showCmdControl=(options.showCmdControl!=undefined)?options.showCmdControl:false;GridCmdRowDown.superclass.constructor.call(this,id,options);}
extend(GridCmdRowDown,GridCmd);GridCmdRowDown.prototype.onCommand=function(){this.m_grid.onRowDown();} 
GridCmdRowDown.prototype.TITLE="На одну строку вниз"; 
function GridCmdFilter(id,options){options=options||{};options.glyph="glyphicon-filter";GridCmdFilter.superclass.constructor.call(this,id,options);this.m_filter=new ModelFilter({"filters":options.filters});this.setControlSave(options.controlSave);this.setControlOpen(options.controlOpen);this.m_controls[0].setVisible(true);this.m_variantStorage=options.variantStorage;}
extend(GridCmdFilter,GridCmd);GridCmdFilter.prototype.BTN_CLASS_SET="btn-danger";GridCmdFilter.prototype.BTN_CLASS_UNSET="btn-primary";GridCmdFilter.prototype.m_filter;GridCmdFilter.prototype.m_controlSave;GridCmdFilter.prototype.m_controlOpen;GridCmdFilter.prototype.m_gridRefresh;GridCmdFilter.prototype.m_pop;GridCmdFilter.prototype.m_variantStorage;GridCmdFilter.prototype.setFilterVisibile=function(v){if(this.m_grid)this.m_grid.setRefreshInterval((v)?0:this.m_gridRefresh);if(this.m_pop)this.m_pop.setVisible(v);if(!v&&this.m_grid){this.m_grid.focus();}}
GridCmdFilter.prototype.afterFilterSet=function(setCnt){var btn=this.getControl();var cl_old,cl_new;if(setCnt){cl_new=this.BTN_CLASS_SET;cl_old=btn.getColorClass();}
else{cl_new=btn.getColorClass();cl_old=this.BTN_CLASS_SET;}
DOMHelper.swapClasses(btn.getNode(),cl_new,cl_old);}
GridCmdFilter.prototype.refreshGrid=function(){var pag=this.m_grid.getPagination();if(pag){pag.reset();}
var self=this;window.setGlobalWait(true);this.m_grid.onRefresh(function(){self.setFilterVisibile(false);},null,function(){window.setGlobalWait(false);});}
GridCmdFilter.prototype.onCommand=function(e){if(!this.m_pop){var self=this;this.m_pop=new PopOver(this.m_id+":popover",{"caption":this.TITLE,"zIndex":"2000","className":window.getBsCol(8),"contentElements":[new GridCmdFilterView(this.m_id+":popover:cont",{"filter":this.m_filter,"cmdSet":(this.m_grid!=undefined),"cmdUnset":(this.m_grid!=undefined),"onApplyFilters":(this.m_grid==undefined)?null:function(){var cnt=self.m_filter.applyFilters(self.m_grid);self.afterFilterSet(cnt);self.refreshGrid();},"onResetFilters":(this.m_grid==undefined)?null:function(){self.m_filter.resetFilters(self.m_grid);self.afterFilterSet(0);self.refreshGrid();},"controlSave":this.getControlSave(),"controlOpen":this.getControlOpen()})]});if(this.m_grid){this.m_gridRefresh=this.m_grid.getRefreshInterval();this.m_grid.setRefreshInterval(0);}
this.m_pop.toDOM(e,this.getControl().getNode());}
else{this.setFilterVisibile(!this.m_pop.getVisible());}}
GridCmdFilter.prototype.getFilter=function(){return this.m_filter;}
GridCmdFilter.prototype.setFilter=function(v){this.m_filter=v;}
GridCmdFilter.prototype.applyFilters=function(){if(this.m_pop){this.m_filter.applyFilters(this.m_grid);}}
GridCmdFilter.prototype.getControlSave=function(v){return this.m_controlSave;}
GridCmdFilter.prototype.setControlSave=function(v){this.m_controlSave=v;if(v)this.m_controlSave.setCmdFilter(this);}
GridCmdFilter.prototype.getControlOpen=function(v){return this.m_controlOpen;}
GridCmdFilter.prototype.setControlOpen=function(v){this.m_controlOpen=v;if(v)this.m_controlOpen.setCmdFilter(this);}
GridCmdFilter.prototype.unserializeFilters=function(){if(this.m_variantStorage&&this.m_variantStorage.model){var cnt=this.m_filter.setValue(this.m_variantStorage.model.getFieldValue("filter_data"));this.afterFilterSet(cnt);if(cnt&&this.m_grid){this.m_filter.applyFilters(this.m_grid);}}}
GridCmdFilter.prototype.setGrid=function(v){GridCmdFilter.superclass.setGrid.call(this,v);this.unserializeFilters();}
GridCmdFilter.prototype.onDelDOM=function(){if(this.m_pop){this.m_pop.delDOM();delete this.m_pop;}}
GridCmdFilter.prototype.setFilterInfo=function(v){this.m_filterInfo=v;} 
GridCmdFilter.prototype.TITLE="Настройка отбора"; 
function GridCmdFilterView(id,options){options=options||{};options.templateOptions={"bsCol":window.getBsCol()};options.template=window.getApp().getTemplate("GridCmdFilterView");GridCmdFilterView.superclass.constructor.call(this,id,"TEMPLATE",options);options.cmdSet=(options.cmdSet!=undefined)?options.cmdSet:true;options.cmdUnset=(options.cmdUnset!=undefined)?options.cmdUnset:options.cmdSet;var self=this;if(options.cmdSet||options.controlSet){this.setControlSet(options.controlSet||new ButtonCmd(id+":set",{"caption":this.SET_CAP,"onClick":function(){self.applyFilters();},"attrs":{"title":this.SET_TITLE}}));}
if(options.cmdUnset||options.controlUnset){this.setControlUnset(options.controlUnset||new ButtonCmd(id+":unset",{"caption":this.UNSET_CAP,"onClick":function(){self.resetFilters();},"attrs":{"title":this.UNSET_TITLE}}));}
if(options.controlSave){this.m_origSave=options.controlSave.getControl(0);this.setControlSave(new ButtonCmd(id+":save",{"glyph":this.m_origSave.getGlyph(),"onClick":function(){options.controlSave.onCommand();},"attrs":{"title":this.m_origSave.getAttr("title")}}));}
if(options.controlOpen){this.m_origOpen=options.controlOpen.getControl(0);this.setControlSave(new ButtonCmd(id+":open",{"glyph":this.m_origOpen.getGlyph(),"onClick":function(){options.controlOpen.onCommand();},"attrs":{"title":this.m_origOpen.getAttr("title")}}));}
this.setFilter(options.filter);this.setOnApplyFilters(options.onApplyFilters);this.setOnResetFilters(options.onResetFilters);}
extend(GridCmdFilterView,ControlContainer);GridCmdFilterView.prototype.m_controlSet;GridCmdFilterView.prototype.m_controlUnset;GridCmdFilterView.prototype.m_controlSave;GridCmdFilterView.prototype.m_controlOpen;GridCmdFilterView.prototype.addControls=function(v){this.clear();if(this.m_filter){var filters=this.m_filter.getFilters();for(var id in filters){if(!filters[id]||!filters[id].binding)continue;var ctrl=filters[id].binding.getControl();ctrl.setVisible(true);this.addElement(ctrl);}}
if(this.m_controlSet)this.addElement(this.m_controlSet);if(this.m_controlUnset)this.addElement(this.m_controlUnset);if(this.m_controlSave)this.addElement(this.m_controlSave);if(this.m_controlOpen)this.addElement(this.m_controlOpen);}
GridCmdFilterView.prototype.setControlSet=function(v){this.m_controlSet=v;}
GridCmdFilterView.prototype.getControlSet=function(){return this.m_controlSet;}
GridCmdFilterView.prototype.setControlUnset=function(v){this.m_controlUnset=v;}
GridCmdFilterView.prototype.getControlUnset=function(){return this.m_controlUnset;}
GridCmdFilterView.prototype.setFilter=function(v){this.m_filter=v;this.addControls();}
GridCmdFilterView.prototype.getFilter=function(){return this.m_filter;}
GridCmdFilterView.prototype.setOnApplyFilters=function(v){this.m_onApplyFilters=v;}
GridCmdFilterView.prototype.getOnApplyFilters=function(){return this.m_onApplyFilters;}
GridCmdFilterView.prototype.setOnResetFilters=function(v){this.m_onResetFilters=v;}
GridCmdFilterView.prototype.getOnResetFilters=function(){return this.m_onResetFilters;}
GridCmdFilterView.prototype.applyFilters=function(){if(this.m_filter){if(this.m_onApplyFilters){this.m_onApplyFilters();}}}
GridCmdFilterView.prototype.resetFilters=function(){if(this.m_filter){if(this.m_onResetFilters){this.m_onResetFilters();}}}
GridCmdFilterView.prototype.setControlSave=function(v){this.m_controlSave=v;}
GridCmdFilterView.prototype.getControlSave=function(v){return this.m_controlSave;}
GridCmdFilterView.prototype.setControlOpen=function(v){this.m_controlOpen=v;}
GridCmdFilterView.prototype.getControlOpen=function(v){return this.m_controlOpen;} 
GridCmdFilterView.prototype.SET_CAP="Отобрать";GridCmdFilterView.prototype.SET_TITLE="Применить выбранные параметры отбора";GridCmdFilterView.prototype.UNSET_CAP="Отменить";GridCmdFilterView.prototype.UNSET_TITLE="Сбросить настройки отбора"; 
function GridCmdFilterSave(id,options){options=options||{};options.glyph="glyphicon-save";options.showCmdControl=false;options.showCmdControlInPopup=false;this.m_variantStorageName=options.variantStorageName;this.m_dataCol=options.dataCol;GridCmdFilterSave.superclass.constructor.call(this,id,options);}
extend(GridCmdFilterSave,GridCmd);GridCmdFilterSave.prototype.m_form;GridCmdFilterSave.prototype.m_view;GridCmdFilterSave.prototype.m_cmdFilter;GridCmdFilterSave.prototype.m_variantStorageName;GridCmdFilterSave.prototype.m_dataCol;GridCmdFilterSave.prototype.onCommand=function(e){var self=this;this.m_cmdFilter.setFilterVisibile(false);(new VariantStorage({"afterFormClose":function(){self.m_cmdFilter.setFilterVisibile(true);},"variantStorageName":this.m_variantStorageName})).saveStorage(this.m_dataCol,this.m_cmdFilter.getFilter().getValue());}
GridCmdFilterSave.prototype.setCmdFilter=function(v){this.m_cmdFilter=v;} 
GridCmdFilterSave.prototype.TITLE="Сохранить настройку"; 
function GridCmdFilterOpen(id,options){options=options||{};options.glyph="glyphicon-open";options.showCmdControl=false;options.showCmdControlInPopup=false;this.m_variantStorageName=options.variantStorageName;this.m_dataCol=options.dataCol;GridCmdFilterOpen.superclass.constructor.call(this,id,options);}
extend(GridCmdFilterOpen,GridCmd);GridCmdFilterOpen.prototype.m_cmdFilter;GridCmdFilterOpen.prototype.m_variantStorageName;GridCmdFilterOpen.prototype.m_form;GridCmdFilterOpen.prototype.m_dataCol;GridCmdFilterOpen.prototype.onCommand=function(e){var self=this;this.m_cmdFilter.setFilterVisibile(false);(new VariantStorage({"afterFormClose":function(val){if(val)self.m_cmdFilter.getFilter().setValue(val);self.m_cmdFilter.setFilterVisibile(true);},"variantStorageName":this.m_variantStorageName})).openStorage(this.m_dataCol);}
GridCmdFilterOpen.prototype.setCmdFilter=function(v){this.m_cmdFilter=v;} 
GridCmdFilterOpen.prototype.TITLE="Выбрать настройку"; 
function ViewGridColManager(id,options){options=options||{};var self=this;this.m_onClose=options.onClose;this.m_filter=options.filter;this.m_onApplyFilters=options.onApplyFilters;this.m_onResetFilters=options.onResetFilters;this.m_onVariantSave=options.onVariantSave;this.m_onVariantOpen=options.onVariantOpen;options.templateOptions={"colorClass":window.getApp().getColorClass(),"bsCol":window.getBsCol(),"TAB_COLUMNS":this.TAB_COLUMNS,"TAB_SORT":this.TAB_SORT};options.addElement=function(){this.addElement(new ViewGridColVisibility(id+":view-visibility",{"colStruc":options.colVisibility,"variantStorageName":options.variantStorageName,"grid":options.grid}));this.addElement(new ViewGridColOrder(id+":view-order",{"colStruc":options.colOrder,"variantStorageName":options.variantStorageName,"grid":options.grid}));this.addElement(new ButtonCmd(id+":save",{"glyph":"glyphicon-save","onClick":function(){self.m_onVariantSave.call(this);},"attrs":{"title":this.TITLE_SAVE}}));this.addElement(new ButtonCmd(id+":open",{"glyph":"glyphicon-open","onClick":function(){self.m_onVariantOpen.call(this);},"attrs":{"title":this.TITLE_OPEN}}));}
ViewGridColManager.superclass.constructor.call(this,id,"TEMPLATE",options);}
extend(ViewGridColManager,ControlContainer);ViewGridColManager.refresh=function(){this.getElement("view-visibility").refresh();this.getElement("view-order").refresh();} 
ViewGridColManager.prototype.VISIB_MENU_CAP="Видимость";ViewGridColManager.prototype.SORT_MENU_CAP="Сортировка";ViewGridColManager.prototype.CLOSE_CAP="Закрыть";ViewGridColManager.prototype.CLOSE_TITLE="Закрыть форму";ViewGridColManager.prototype.TAB_COLUMNS="Колонки";ViewGridColManager.prototype.TAB_SORT="Сортировка";ViewGridColManager.prototype.TAB_FILTER="Отбор";ViewGridColManager.prototype.HEAD_TITLE="Настройка списка";ViewGridColManager.prototype.TITLE_SAVE="Сохранить настройку";ViewGridColManager.prototype.TITLE_OPEN="Восстановить настройку"; 
function ViewGridColParam(id,options){options=options||{};ViewGridColParam.superclass.constructor.call(this,id,"DIV",options);this.m_paramId=options.paramId;this.m_variantStorageName=options.variantStorageName;this.m_dataGrid=options.grid;var head=new GridHead();var row=new GridRow(id+":row1");this.addHeadCells(row);head.addElement(row);var body=new GridBody();this.m_onAfterSave=options.onAfterSave;this.m_initVal=options.colStruc;for(var col_ind=0;col_ind<this.m_initVal.length;col_ind++){var row=new GridRow(this.getId()+":grid:row-"+this.m_initVal[col_ind].colId,{"attrs":{"colId":this.m_initVal[col_ind].colId}});this.addCells(row,this.m_initVal[col_ind]);body.addElement(row);}
var popup_menu=new PopUpMenu();this.m_grid=new Grid(id+":grid",{"head":head,"body":body,"commands":new GridCmdContainer(id+":grid:cmd",{"cmdInsert":false,"cmdRefresh":false,"cmdPrint":false,"cmdSearch":false,"cmdColManager":false,"cmdAllCommands":false,"addCustomCommands":function(commands){commands.push(new GridCmdRowUp(id+":grid:cmd:rowUp",{"showCmdControl":true}));commands.push(new GridCmdRowDown(id+":grid:cmd:rowDown",{"showCmdControl":true}));},"popUpMenu":popup_menu}),"popUpMenu":popup_menu,"rowCommandPanelClass":null,"filter":null,"refreshInterval":0});this.addElement(this.m_grid);}
extend(ViewGridColParam,ControlContainer);ViewGridColParam.prototype.COL_CHECK_ID="check";ViewGridColParam.prototype.COL_NAME_ID="name";ViewGridColParam.prototype.refresh=function(){this.getElement("grid").onRefresh();}
ViewGridColParam.prototype.save=function(){}
ViewGridColParam.prototype.onAfterSave=function(){window.getApp().setTemplateParam(this.m_variantStorageName,this.m_paramId,this.m_initVal);} 
ViewGridColParam.prototype.COLUMNS_COL_CAP="Колонки";ViewGridColParam.prototype.SAVE_CAPTION="Применить";ViewGridColParam.prototype.SAVE_TITLE="Применить изменения";ViewGridColParam.prototype.NOTE_SAVED="Изменения записаны."; 
function ViewGridColVisibility(id,options){options=options||{};ViewGridColVisibility.superclass.constructor.call(this,id,options);}
extend(ViewGridColVisibility,ViewGridColParam);ViewGridColVisibility.prototype.addHeadCells=function(row){var pref=this.getId()+":grid:row1";row.addElement(new GridCellHead(pref+":"+this.COL_NAME_ID,{"value":this.COLUMNS_COL_CAP}));row.addElement(new GridCellHead(pref+":"+this.COL_CHECK_ID,{"value":this.COLUMNS_CHECK_CAP}));}
ViewGridColVisibility.prototype.addCells=function(row,fStruc){var pref=this.getId()+":grid:row-"+fStruc.fieldId;row.addElement(new GridCell(pref+":"+this.COL_NAME_ID,{"value":fStruc.colRef.getValue()}));row.addElement(new GridCell(pref+":"+this.COL_CHECK_ID,{"elements":[new EditCheckBox(pref+":"+this.COL_CHECK_ID+":toggle",{"className":"field_toggle","checked":fStruc.checked,"attrs":{"align":"center"}})]}));}
ViewGridColVisibility.prototype.getRowData=function(rowElem,struc){struc[rowElem.getNode().rowIndex-1]={"colId":rowElem.getAttr("colId"),"checked":rowElem.getElement(this.COL_CHECK_ID).getElement("toggle").getChecked()};}
ViewGridColVisibility.prototype.onAfterSave=function(){ViewGridColVisibility.superclass.onAfterSave.call(this);var head=this.m_dataGrid.getHead();for(var row in head.m_elements){var head_row=head.m_elements[row];head_row.delDOM();head_row.setColumnOrder(this.m_initVal);}
head.toDOM(this.m_dataGrid.m_node);this.m_dataGrid.onRefresh();} 
ViewGridColVisibility.prototype.COLUMNS_CHECK_CAP="Видимость"; 
function ViewGridColOrder(id,options){options=options||{};ViewGridColOrder.superclass.constructor.call(this,id,options);}
extend(ViewGridColOrder,ViewGridColParam);ViewGridColOrder.prototype.COL_DIR_ID="dir";ViewGridColOrder.prototype.addHeadCells=function(row){var pref=this.getId()+":grid:row1";row.addElement(new GridCellHead(pref+":"+this.COL_NAME_ID,{"value":this.COLUMNS_COL_CAP}));row.addElement(new GridCellHead(pref+":"+this.COL_CHECK_ID,{"value":this.COLUMNS_CHECK_CAP}));row.addElement(new GridCellHead(pref+":"+this.COL_DIR_ID,{"value":this.COLUMNS_DIR_CAP}));}
ViewGridColOrder.prototype.addCells=function(row,fStruc){var pref=this.getId()+":grid:row-"+fStruc.fieldId;row.setAttr("fields",fStruc.fields);row.addElement(new GridCell(pref+":"+this.COL_NAME_ID,{"value":fStruc.colRef.getValue()}));row.addElement(new GridCell(pref+":"+this.COL_CHECK_ID,{"elements":[new EditCheckBox(pref+":"+this.COL_CHECK_ID+":toggle",{"className":"field_toggle","checked":fStruc.checked,"attrs":{"align":"center"}})]}));var at_asc={};var at_desc={};if(fStruc.checked&&fStruc.directs=="asc"){at_asc.checked="checked";}
if(fStruc.checked&&fStruc.directs=="desc"){at_desc.checked="checked";}
row.addElement(new GridCell(pref+":"+this.COL_DIR_ID,{"elements":[new EditRadioGroup(pref+":"+this.COL_DIR_ID+":radiogroup",{"elements":[new EditRadio(pref+":"+this.COL_DIR_ID+":radiogroup:radio-asc",{"value":"asc","labelCaption":this.ASC_CAP,"name":fStruc.id+"_direct","editContClassName":"input-group "+window.getBsCol(1),"attrs":at_asc}),new EditRadio(pref+":"+this.COL_DIR_ID+":radiogroup:radio-desc",{"value":"desc","labelCaption":this.DESC_CAP,"name":fStruc.id+"_direct","editContClassName":"input-group "+window.getBsCol(1),"attrs":at_desc})]})]}));}
ViewGridColOrder.prototype.getRowData=function(rowElem,struc){var checked=rowElem.getElement(this.COL_CHECK_ID).getElement("toggle").getChecked();var directs="undefined";if(checked){directs=rowElem.getElement(this.COL_DIR_ID).getElement("radiogroup").getValue();}
struc[rowElem.getNode().rowIndex-1]={"colId":rowElem.getAttr("colId"),"fields":rowElem.getAttr("fields"),"directs":directs,"checked":checked};}
ViewGridColOrder.prototype.onAfterSave=function(){ViewGridColVisibility.superclass.onAfterSave.call(this);var cols={};for(var i=0;i<this.m_initVal.length;i++){cols[this.m_initVal[i].colId]=this.m_initVal[i];}
var head=this.m_dataGrid.getHead();for(var row in head.m_elements){var head_row=head.m_elements[row];var columns=head_row.m_elements;for(var col_id in columns){if(cols[col_id]&&cols[col_id].checked){cols[col_id].colRef.setSortFieldId(cols[col_id].fields);cols[col_id].colRef.setSort(cols[col_id].directs);}
else{columns[col_id].setSort("");}}}
this.m_dataGrid.onRefresh();} 
ViewGridColOrder.prototype.COLUMNS_DIR_CAP="Порядок";ViewGridColOrder.prototype.COLUMNS_CHECK_CAP="Сортировать";ViewGridColOrder.prototype.COLUMNS_DIR_CAP="Направление возр./убыв.";ViewGridColOrder.prototype.ASC_CAP="По возр.";ViewGridColOrder.prototype.DESC_CAP="По убыв."; 
function VariantStorageSaveView(id,options){options=options||{};var self=this;this.m_onClose=options.onClose;var model=new VariantStorageList_Model();var contr=new VariantStorage_Controller();var pm=contr.getPublicMethod("get_list");pm.setFieldValue("storage_name",options.variantStorageName);options.addElement=function(){this.addElement(new GridAjx(id+":variants",{"model":model,"controller":contr,"editInline":null,"editWinClass":null,"popUpMenu":null,"showHead":false,"commands":new GridCommandsAjx(id+":variants:cmd",{"cmdInsert":false,"cmdEdit":false,"cmdDelete":true,"cmdCopy":false,"cmdPrint":false,"cmdRefresh":false,"cmdExport":false}),"head":new GridHead(id+":variants:head",{"elements":[new GridRow(id+":variants:head:row0",{"elements":[new GridCellHead(id+":variants:head:row0:default_variant",{"colAttrs":{"colspan":2},"columns":[new GridColumn({"field":model.getField("default_variant"),"assocClassList":{"true":"glyphicon glyphicon-ok"}})]}),new GridCellHead(id+":variants:head:row0:variant_name",{"columns":[new GridColumn({"field":model.getField("variant_name")})]})]})]}),"pagination":null,"autoRefresh":true,"refreshInterval":0,"rowSelect":true,"focus":true}));this.addElement(new EditString(id+":name",{"focus":true,"labelCaption":this.VARIANT_NAME_CAP,"className":window.getApp().getBsCol(12)}));this.addElement(new EditCheckBox(id+":default_variant",{"labelCaption":this.DEF_VARIANT_CAP,"className":window.getApp().getBsCol(12)}));}
VariantStorageSaveView.superclass.constructor.call(this,id,"TEMPLATE",options);var grid=this.getElement("variants");this.m_gridOnClick=grid.onClick;var self=this;grid.onClick=function(ev){var grid=self.getElement("variants");self.m_gridOnClick.call(grid,ev);var row=grid.getModelRow();self.getElement("default_variant").setValue(row.default_variant.getValue());var ctrl=self.getElement("name");ctrl.setValue(row.variant_name.getValue());ctrl.focus();}}
extend(VariantStorageSaveView,ControlContainer); 
VariantStorageSaveView.prototype.VARIANT_NAME_CAP="Наименование:";VariantStorageSaveView.prototype.DEF_VARIANT_CAP="Использовать при открытии:";VariantStorageSaveView.prototype.CMD_CANCEL_CAP="Отмена";VariantStorageSaveView.prototype.CMD_CANCEL_TITLE="Отменить запись";VariantStorageSaveView.prototype.CMD_OK_CAP="Записать";VariantStorageSaveView.prototype.CMD_OK_TITLE="Записать настройку";VariantStorageSaveView.prototype.HEAD_TITLE="Сохранение настройки"; 
function VariantStorageOpenView(id,options){options=options||{};var self=this;this.m_onClose=options.onClose;var model=new VariantStorageList_Model();var contr=new VariantStorage_Controller();var pm=contr.getPublicMethod("get_list");pm.setFieldValue("storage_name",options.variantStorageName);VariantStorageOpenView.superclass.constructor.call(this,id,"TEMPLATE",options);this.addElement(new GridAjx(id+":variants",{"model":model,"controller":contr,"editInline":null,"editWinClass":null,"popUpMenu":null,"showHead":false,"commands":new GridCommandsAjx(id+":variants:cmd",{"cmdInsert":false,"cmdEdit":false,"cmdDelete":true,"cmdCopy":false,"cmdPrint":false,"cmdRefresh":false,"cmdExport":false}),"head":new GridHead(id+":variants:head",{"elements":[new GridRow(id+":variants:head:row0",{"elements":[new GridCellHead(id+":variants:head:row0:variant_name",{"columns":[new GridColumn({"field":model.getField("variant_name")})],"sortable":true}),new GridCellHead(id+":variants:head:row0:default_variant",{"columns":[new GridColumnBool({"field":model.getField("default_variant"),"showFalse":false})]})]})]}),"pagination":null,"autoRefresh":true,"refreshInterval":0,"rowSelect":true,"focus":true,"onSelect":options.onSelect}));}
extend(VariantStorageOpenView,ControlContainer); 
VariantStorageOpenView.prototype.CMD_CANCEL_CAP="Отмена";VariantStorageOpenView.prototype.CMD_CANCEL_TITLE="Отменить выбор";VariantStorageOpenView.prototype.CMD_OK_CAP="Выбрать";VariantStorageOpenView.prototype.CMD_OK_TITLE="Выбрать настройку и закрыть форму";VariantStorageOpenView.prototype.HEAD_TITLE="Выбор сохраненной настройки"; 
function GridAjx(id,options){options=options||{};if(options.editInline){options.editViewClass=options.editViewClass||ViewGridEditInlineAjx;}
this.m_filters={};if(options.controller){options.readPublicMethod=options.readPublicMethod||((options.controller.publicMethodExists(options.controller.METH_GET_LIST))?options.controller.getPublicMethod(options.controller.METH_GET_LIST):null);options.insertPublicMethod=options.insertPublicMethod||((options.controller.publicMethodExists(options.controller.METH_INSERT))?options.controller.getPublicMethod(options.controller.METH_INSERT):null);options.updatePublicMethod=options.updatePublicMethod||((options.controller.publicMethodExists(options.controller.METH_UPDATE))?options.controller.getPublicMethod(options.controller.METH_UPDATE):null);options.deletePublicMethod=options.deletePublicMethod||((options.controller.publicMethodExists(options.controller.METH_DELETE))?options.controller.getPublicMethod(options.controller.METH_DELETE):null);options.editPublicMethod=options.editPublicMethod||((options.controller.publicMethodExists(options.controller.METH_GET_OBJ))?options.controller.getPublicMethod(options.controller.METH_GET_OBJ):null);}
if(options.readPublicMethod&&!options.model&&options.readPublicMethod.getListModelClass()){var m_class=options.readPublicMethod.getListModelClass();options.model=new m_class();}
this.setReadPublicMethod(options.readPublicMethod);this.setInsertPublicMethod(options.insertPublicMethod);this.setUpdatePublicMethod(options.updatePublicMethod);this.setDeletePublicMethod(options.deletePublicMethod);this.setExportPublicMethod(options.exportPublicMethod);this.setEditPublicMethod(options.editPublicMethod);this.setRefreshAfterDelRow(options.refreshAfterDelRow);this.setRefreshAfterUpdateRow((options.refreshAfterUpdateRow!=undefined)?options.refreshAfterUpdateRow:true);if(options.filters&&options.filters.length){for(var i=0;i<options.filters.length;i++){this.setFilter(options.filters[i]);}}
this.setOnDelOkMesTimeout(options.onDelOkMesTimeout||this.DEF_ONDELOK_MES_TIMEOUT);if(window.getApp().getAppSrv()){options.srvEvents=options.srvEvents||{};var srv_ev_exist=(options.srvEvents.events&&options.srvEvents.events.length);this.m_defSrvEvents=(options.defSrvEvents!=undefined)?options.defSrvEvents:(srv_ev_exist||options.refreshInterval);this.m_httpRrefreshInterval=options.refreshInterval;options.refreshInterval=(this.m_defSrvEvents||srv_ev_exist)?undefined:options.refreshInterval;if(this.m_defSrvEvents){var self=this;if(!options.srvEvents.events){this.getDefSrvEvents()}
options.srvEvents.onEvent=options.srvEvents.onEvent||function(params){self.srvEventsCallBack(params);}
options.srvEvents.onSubscribed=options.srvEvents.onSubscribed||function(){self.srvEventsOnSubscribed();}
options.srvEvents.onClose=options.srvEvents.onClose||function(error){self.srvEventsOnClose(error);}
options.srvEvents.onWakeup=options.srvEvents.onWakeup||function(error){self.srvEventsOnWakeup(error);}}}
GridAjx.superclass.constructor.call(this,id,options);}
extend(GridAjx,Grid);GridAjx.prototype.DEF_ONDELOK_MES_TIMEOUT=2000;GridAjx.prototype.m_readPublicMethod;GridAjx.prototype.m_insertPublicMethod;GridAjx.prototype.m_updatePublicMethod;GridAjx.prototype.m_deletePublicMethod;GridAjx.prototype.m_exportPublicMethod;GridAjx.prototype.m_editPublicMethod;GridAjx.prototype.m_refreshAfterDelRow;GridAjx.prototype.m_refreshAfterUpdateRow;GridAjx.prototype.m_filters;GridAjx.prototype.onGetData=function(resp){if(resp){this.m_model.setData(resp.getModelData(this.m_model.getId()));}
GridAjx.superclass.onGetData.call(this);}
GridAjx.prototype.initEditView=function(parent,replacedNode,cmd){GridAjx.superclass.initEditView.call(this,parent,replacedNode,cmd);var pm;if(cmd=="insert"){pm=this.getInsertPublicMethod();}
else{pm=this.getUpdatePublicMethod();}
this.m_editViewObj.setWritePublicMethod(pm);this.m_editViewObj.setReadPublicMethod(this.getEditPublicMethod());}
GridAjx.prototype.fillEditView=function(cmd){if(cmd!="insert"){this.keysToPublicMethod(this.m_editViewObj.getReadPublicMethod());}
GridAjx.superclass.fillEditView.call(this,cmd);}
GridAjx.prototype.keysToPublicMethod=function(pm){var pm_fields=pm.getFields();var fields=this.m_model.getFields();for(id in pm_fields){if(fields[id]&&fields[id].getPrimaryKey()){var v=fields[id].getValue();pm_fields[id].setValue(v);}
else if(pm_fields[id].getPrimaryKey()){pm_fields[id].resetValue();}}}
GridAjx.prototype.read=function(cmd){if(this.m_editViewObj){this.m_editViewObj.read(cmd,function(resp,erCode,erStr){self.onError(resp,erCode,erStr)});}}
GridAjx.prototype.delRow=function(rowNode){var pm=this.getDeletePublicMethod();if(!pm){throw Error(this.ER_NO_DEL_PM);}
this.setEnabled(false);this.setModelToCurrentRow();this.keysToPublicMethod(pm);var self=this;pm.run({"async":false,"ok":function(){self.afterServerDelRow();},"fail":function(resp,erCode,erStr){self.setEnabled(true);self.onError(resp,erCode,erStr);}});}
GridAjx.prototype.afterServerDelRow=function(){this.deleteRowNode();this.setEnabled(true);window.showTempNote(this.NT_REC_DELETED,null,this.m_onDelOkMesTimeout);this.focus();if(this.getRefreshAfterDelRow()){this.onRefresh();}}
GridAjx.prototype.filtersToMethod=function(sep){var pm=this.getReadPublicMethod();var contr=pm.getController();sep=(sep==undefined)?contr.PARAM_FIELD_SEP_VAL:sep;var s_fields,s_signs,s_vals,s_icases;for(var fid in this.m_filters){if(this.m_filters[fid]&&this.m_filters[fid].field&&this.m_filters[fid].sign){s_fields=((!s_fields)?"":s_fields+sep)+this.m_filters[fid].field;s_signs=((!s_signs)?"":s_signs+sep)+this.m_filters[fid].sign;s_vals=((!s_vals)?"":s_vals+sep)+this.m_filters[fid].val;s_icases=((!s_icases)?"":s_icases+sep)+(this.m_filters[fid].icase||"0");}}
pm.setFieldValue(contr.PARAM_COND_FIELDS,s_fields);pm.setFieldValue(contr.PARAM_COND_SGNS,s_signs);pm.setFieldValue(contr.PARAM_COND_VALS,s_vals);pm.setFieldValue(contr.PARAM_COND_ICASE,s_icases);}
GridAjx.prototype.condFilterToMethod=function(publicMethod){var contr=publicMethod.getController();if(publicMethod.fieldExists(contr.PARAM_COND_FIELDS)){this.filtersToMethod(contr.PARAM_FIELD_SEP_VAL);publicMethod.setFieldValue(contr.PARAM_FIELD_SEP,contr.PARAM_FIELD_SEP_VAL);}}
GridAjx.prototype.onRefresh=function(callBack,onError,onAll){var self=this;var pm=this.getReadPublicMethod();if(!pm){throw Error(this.ER_NO_READ_PM);}
var contr=pm.getController();var pag=this.getPagination();if(pag){var pag_f=pag.getFrom();var pag_cnt=pag.getCountPerPage();if(!isNaN(pag_f)){pm.setFieldValue(contr.PARAM_FROM,pag_f);}
else{pm.getField(contr.PARAM_FROM).unsetValue();}
if(!isNaN(pag_cnt)){pm.setFieldValue(contr.PARAM_COUNT,pag_cnt);}
else{pm.getField(contr.PARAM_COUNT).unsetValue();}}
this.condFilterToMethod(pm);var sort_cols,sort_dirs;var head=this.getHead();if(head&&pm.fieldExists(contr.PARAM_ORD_FIELDS)){for(var row in head.m_elements){var head_row=head.m_elements[row];for(var col in head_row.m_elements){if(head_row.m_elements[col].getSortable()){var sort_dir=head_row.m_elements[col].getSort();if(sort_dir=="asc"||sort_dir=="desc"){var sort_col=head_row.m_elements[col].getSortFieldId();if(!sort_col){var cols=head_row.m_elements[col].getColumns();for(var i=0;i<cols.length;i++){sort_cols=(sort_cols==undefined)?"":sort_cols;sort_cols+=(sort_cols=="")?"":contr.PARAM_FIELD_SEP_VAL;sort_cols+=(cols[i].getField()?cols[i].getField().getId():cols[i].getId());sort_dirs=(sort_dirs==undefined)?"":sort_dirs;sort_dirs+=(sort_dirs=="")?"":contr.PARAM_FIELD_SEP_VAL;sort_dirs+=sort_dir;}}
else{sort_cols=(sort_cols==undefined)?"":sort_cols;sort_cols+=(sort_cols=="")?"":contr.PARAM_FIELD_SEP_VAL;sort_cols+=sort_col;sort_dirs=(sort_dirs==undefined)?"":sort_dirs;sort_dirs+=(sort_dirs=="")?"":contr.PARAM_FIELD_SEP_VAL;sort_dirs+=sort_dir;}}}}}
pm.setFieldValue(contr.PARAM_ORD_FIELDS,sort_cols);pm.setFieldValue(contr.PARAM_ORD_DIRECTS,sort_dirs);}
pm.run({"ok":function(resp){self.onGetData(resp);if(callBack){callBack.call(self);}},"fail":function(resp,erCode,erStr){self.onError(resp,erCode,erStr);if(onError){onError.call(self);}},"all":(onAll?function(){onAll.call(self);}:null)});}
GridAjx.prototype.onError=function(resp,erCode,erStr){GridAjx.superclass.onError.call(this,window.getApp().formatError(erCode,erStr));}
GridAjx.prototype.setReadPublicMethod=function(v){this.m_readPublicMethod=v;}
GridAjx.prototype.getReadPublicMethod=function(){return this.m_readPublicMethod;}
GridAjx.prototype.setInsertPublicMethod=function(v){this.m_insertPublicMethod=v;}
GridAjx.prototype.getInsertPublicMethod=function(){return this.m_insertPublicMethod;}
GridAjx.prototype.setUpdatePublicMethod=function(v){this.m_updatePublicMethod=v;}
GridAjx.prototype.getUpdatePublicMethod=function(){return this.m_updatePublicMethod;}
GridAjx.prototype.setDeletePublicMethod=function(v){this.m_deletePublicMethod=v;}
GridAjx.prototype.getDeletePublicMethod=function(){return this.m_deletePublicMethod;}
GridAjx.prototype.setExportPublicMethod=function(v){this.m_exportPublicMethod=v;}
GridAjx.prototype.getExportPublicMethod=function(){return this.m_exportPublicMethod;}
GridAjx.prototype.setEditPublicMethod=function(v){this.m_editPublicMethod=v;}
GridAjx.prototype.getEditPublicMethod=function(){return this.m_editPublicMethod;}
GridAjx.prototype.setRefreshAfterDelRow=function(v){this.m_refreshAfterDelRow=v;}
GridAjx.prototype.getRefreshAfterDelRow=function(){return this.m_refreshAfterDelRow;}
GridAjx.prototype.setRefreshAfterUpdateRow=function(v){this.m_refreshAfterUpdateRow=v;}
GridAjx.prototype.getRefreshAfterUpdateRow=function(){return this.m_refreshAfterUpdateRow;}
GridAjx.prototype.getFilters=function(){return this.m_filters;}
GridAjx.prototype.getFilterKey=function(filterOrField,sign){var key;if(typeof(filterOrField)=="object"){key=filterOrField.field+filterOrField.sign;}
else{key=filterOrField+(sign?sign:"");}
return key;}
GridAjx.prototype.setFilter=function(filter){var pm_ins=this.getInsertPublicMethod();if(pm_ins&&pm_ins.fieldExists(filter.field))pm_ins.setFieldValue(filter.field,filter.val);var pm_upd=this.getUpdatePublicMethod();if(pm_upd&&pm_upd.fieldExists(filter.field))pm_upd.setFieldValue(filter.field,filter.val);this.m_filters[this.getFilterKey(filter)]=filter;}
GridAjx.prototype.getFilter=function(filterOrField,sign){return this.m_filters[this.getFilterKey(filterOrField,sign)];}
GridAjx.prototype.unsetFilter=function(filterOrField,sign){this.m_filters[this.getFilterKey(filterOrField,sign)]=undefined;}
GridAjx.prototype.setOnDelOkMesTimeout=function(v){this.m_onDelOkMesTimeout=v;}
GridAjx.prototype.getOnDelOkMesTimeout=function(){return this.m_onDelOkMesTimeout;}
GridAjx.prototype.refreshAfterEditCont=function(res){if(this.getRefreshAfterUpdateRow()&&res&&res.updated){if(res.newKeys&&!CommonHelper.isEmpty(res.newKeys)){this.m_selectedRowKeys=CommonHelper.serialize(res.newKeys);}
this.onRefresh();}}
GridAjx.prototype.srvEventsOnWakeup=function(json){console.log("Calling refresh after wakeup")
this.onRefresh();}
GridAjx.prototype.srvEventsCallBack=function(json){console.log("GridAjx.prototype.srvEventsCallBack ")
console.log(json)
var do_refresh=true;if(json.eventId&&json.params&&((this.getUpdatePublicMethod()&&json.eventId==this.getEventIdOnPublicMethod(this.getUpdatePublicMethod()))||(this.getDeletePublicMethod()&&json.eventId==this.getEventIdOnPublicMethod(this.getDeletePublicMethod())))){console.log("Update/delete method, checking keys")
var keys=this.getKeyIds();var key_fields={};for(var i=0;i<keys.length;i++){if(json.params[keys[i]]){key_fields[keys[i]]=json.params[keys[i]];}}
try{this.m_model.recLocate(key_fields,true);}
catch(e){do_refresh=false;}}
if(do_refresh){console.log("Calling refresh")
this.onRefresh();}}
GridAjx.prototype.getEventIdOnPublicMethod=function(pm){var contr=pm.getController();var contr_name=contr?contr.constructor.name||CommonHelper.functionName(contr.constructor):null;contr_name=contr_name?contr_name.substr(0,contr_name.indexOf("_")):null;return(contr_name?contr_name+"."+pm.getId():null);}
GridAjx.prototype.getDefSrvEvents=function(){var events=[];if(this.getInsertPublicMethod()){events.push({"id":this.getEventIdOnPublicMethod(this.getInsertPublicMethod())});}
if(this.getUpdatePublicMethod()){events.push({"id":this.getEventIdOnPublicMethod(this.getUpdatePublicMethod())});}
if(this.getDeletePublicMethod()){events.push({"id":this.getEventIdOnPublicMethod(this.getDeletePublicMethod())});}
return events;}
GridAjx.prototype.srvEventsOnSubscribed=function(){this.setRefreshInterval(0);}
GridAjx.prototype.srvEventsOnClose=function(message){if(message&&message.code>1000){this.setRefreshInterval(this.m_httpRrefreshInterval);}}
GridAjx.prototype.toDOM=function(p){if(this.m_defSrvEvents&&!this.m_srvEvents.events){this.m_srvEvents.events=this.getDefSrvEvents();}
GridAjx.superclass.toDOM.call(this,p);} 
GridAjx.prototype.ER_NO_DEL_PM="Метод для команды удаления не определен";GridAjx.prototype.ER_NO_UPDATE_PM="Метод для команды обновления не определен";GridAjx.prototype.ER_NO_EDIT_PM="Метод для команды изменения не определен";GridAjx.prototype.ER_NO_READ_PM="Метод для команды чтения не определен"; 
function TreeAjx(id,options){options=options||{};options.rowSelect=true;options.resize=false;options.showHead=false;options.autoRefresh=false;options.editInline=(options.editInline!=undefined)?options.editInline:true;options.inlineInsertPlace=(options.inlineInsertPlace!=undefined)?options.inlineInsertPlace:"current";options.editViewOptions=options.editViewOptions||{"tagName":"LI","columnTagName":"DIV"};options.selectedRowClass="active";options.commands=options.commands||new GridCmdContainerAjx(id+":cmd",{"cmdColManager":false,"cmdExport":false,"cmdSearch":false,"cmdRefresh":false});this.setRootCaption(options.rootCaption||this.DEF_ROOT_CAPTION);TreeAjx.superclass.constructor.call(this,id,options);}
extend(TreeAjx,GridAjx);TreeAjx.prototype.DEF_TAG_NAME="DIV";TreeAjx.prototype.DEF_ROW_TAG_NAME="LI";TreeAjx.prototype.DEF_CELL_TAG_NAME="DIV";TreeAjx.prototype.DEF_BODY_TAG_NAME="UL";TreeAjx.prototype.m_rootCaption;TreeAjx.prototype.nodeClickable=function(node){return(this.getEnabled());}
TreeAjx.prototype.onNextRow=function(){var res=false;var selected_node=this.getSelectedNode();var new_node;var new_node;if(selected_node){var chld_same_tag=selected_node.getElementsByTagName(selected_node.nodeName);if(chld_same_tag&&chld_same_tag.length){new_node=chld_same_tag[0];}
else if(selected_node.nextSibling&&selected_node.nextSibling.nodeName==selected_node.nodeName){new_node=selected_node.nextSibling;}
else{new_node=DOMHelper.getParentByTagName(selected_node,selected_node.nodeName);if(new_node){new_node=new_node.nextSibling;}}
if(new_node&&this.getRowSelectable(new_node)){this.selectRow(new_node,selected_node);$(new_node).get(0).scrollIntoView();res=true;}}
return res;}
TreeAjx.prototype.onPreviousRow=function(){var res=false;var selected_node=this.getSelectedNode();var new_node;if(selected_node){if(selected_node.previousSibling&&selected_node.previousSibling.nodeName==selected_node.nodeName){new_node=selected_node.previousSibling;}
else{new_node=DOMHelper.getParentByTagName(selected_node,selected_node.nodeName);}
if(new_node&&this.getRowSelectable(new_node)){this.selectRow(new_node,selected_node);$(new_node).get(0).scrollIntoView();res=true;}}
return res;}
TreeAjx.prototype.setRootCaption=function(v){this.m_rootCaption=v;}
TreeAjx.prototype.getRootCaption=function(){return this.m_rootCaption;}
TreeAjx.prototype.edit=function(cmd){if(cmd=="edit"&&DOMHelper.getAttr(this.getSelectedRow(),"modelIndex")==-1){return 0;}
if(cmd=="insert"){this.setModelToCurrentRow();}
TreeAjx.superclass.edit.call(this,cmd);}
TreeAjx.prototype.onGetData=function(){if(this.m_model){var self=this;var body=this.getBody();var foot=this.getFoot();body.delDOM();body.clear();if(foot&&foot.calcBegin){this.m_foot.calcBegin(this.m_model);}
if(!this.getHead())return;var columns=this.getHead().getColumns();var row_cnt,field_cnt;var row,row_keys;this.m_model.reset();var pag=this.getPagination();if(pag){pag.m_from=parseInt(this.m_model.getPageFrom());pag.setCountTotal(this.m_model.getTotCount());}
var h_row_ind=0;this.m_itemIds={};var key_field_id=this.m_model.getKeyField().getId();row_cnt=-1;var r_class=this.getHead().getRowClass(h_row_ind);row=this.createNewRow(row_cnt,h_row_ind,row_cnt+1);var root_node=new ControlContainer(null,"UL");row.addElement(new GridCell(row.getId()+":descr",{"value":this.getRootCaption(),"tagName":"SPAN"}));row.addElement(root_node);body.addElement(row);row_cnt++;this.m_model.reset();while(this.m_model.getNextRow()){row=this.createNewRow(row_cnt,h_row_ind,row_cnt+1);row_keys={};for(var k=0;k<this.m_keyIds.length;k++){if(this.m_model.fieldExists(this.m_keyIds[k])){row_keys[this.m_keyIds[k]]=this.m_model.getFieldValue(this.m_keyIds[k]);}}
field_cnt=0;for(var col_id=0;col_id<columns.length;col_id++){columns[col_id].setGrid(this);if(columns[col_id].getField()&&columns[col_id].getField().getPrimaryKey()){row_keys[columns[col_id].getField().getId()]=columns[col_id].getField().getValue();}
var cell=this.createNewCell(columns[col_id],row);if(this.m_onEventAddCell){this.m_onEventAddCell.call(this,cell);}
row.addElement(cell);field_cnt++;}
row.setAttr("keys",CommonHelper.serialize(row_keys));var row_cmd_class=this.getRowCommandClass();if(row_cmd_class){var row_class_options={"grid":this};row.addElement(new row_cmd_class(this.getId()+":"+body.getName()+":"+row.getId()+":cell-sys",row_class_options));}
if(this.m_onEventAddRow){this.m_onEventAddRow.call(this,row);}
var item_id=this.m_model.getFieldValue(key_field_id);var parent_item_id=this.m_model.getParentId();this.m_itemIds[item_id]=new ControlContainer(row.getId()+":gr","UL",{});row.addElement(this.m_itemIds[item_id]);if(parent_item_id){this.m_itemIds[parent_item_id].addElement(row);}
else{root_node.addElement(row);}
row.m_drag=new DragObject(row.getNode(),{"offsetY":60,"offsetX":-100});row.m_drop=new DropTarget(row.getNode());row.m_drop.accept=function(dragObject){var drop_id=CommonHelper.unserialize(this.element.getAttribute("keys")).id;var drag_id=CommonHelper.unserialize(dragObject.element.getAttribute("keys")).id;var key_fields={"id":new FieldInt("id")}
key_fields.id.setValue(drag_id);var drag_row;var drag_row_a=self.m_model.recLocate(key_fields,true);if(drag_row_a&&drag_row_a.length){drag_row=self.m_model.m_currentRow;}
key_fields.id.setValue(drop_id);var drop_row;var drop_row_a=self.m_model.recLocate(key_fields,true);if(drop_row_a&&drop_row_a.length){drop_row=self.m_model.m_currentRow;}
if(drag_row&&drop_row){drop_row.parentNode.insertBefore(drag_row,drop_row);self.onRefresh();}}
row_cnt++;if(foot&&foot.calc){foot.calc(this.m_model);}}
if(this.getLastRowFooter()&&row){DOMHelper.addClass(row.m_node,"grid_foot");}
if(foot&&foot.calcEnd){foot.calcEnd(this.m_model);}
body.toDOM(this.m_node);}
if(this.m_navigate||this.m_navigateClick){this.setSelection();}}
TreeAjx.prototype.onDelete=function(callBack){var res=false;if(this.m_cmdDelete){var selected_node=this.getSelectedRow();if(selected_node.parentNode==this.getBody().getNode()){return;}
if(selected_node){var self=this;this.setFocused(false);WindowQuestion.show({"cancel":false,"text":this.Q_DELETE,"callBack":function(r){if(r==WindowQuestion.RES_YES){self.delRow(selected_node);}
else{self.focus();}
if(callBack){callBack(r);}}});res=true;}}
return res;} 
function GridAjxDOCT(id,options){options=options||{};options.refreshAfterDelRow=true;options.refreshInterval=0;GridAjxDOCT.superclass.constructor.call(this,id,options);}
extend(GridAjxDOCT,GridAjx);GridAjxDOCT.prototype.m_modified;GridAjxDOCT.prototype.afterServerDelRow=function(){this.setModified(true);GridAjxDOCT.superclass.afterServerDelRow.call(this);}
GridAjxDOCT.prototype.refreshAfterEdit=function(res){GridAjxDOCT.superclass.refreshAfterEdit.call(this,res);if(res&&res.updated){this.setModified(true);}}
GridAjxDOCT.prototype.getModified=function(){return this.m_modified;}
GridAjxDOCT.prototype.setModified=function(v){this.m_modified=v;} 
function GridAjxMaster(id,options){options=options||{};this.setDetailControl(options.detailControl);this.setDetailKeyIds(options.detailkeyIds);GridAjxMaster.superclass.constructor.call(this,id,options);}
extend(GridAjxMaster,GridAjx);GridAjxMaster.prototype.m_detailControl;GridAjxMaster.prototype.m_detailKeyIds;GridAjxMaster.prototype.selectNode=function(newNode,oldNode){GridAjxMaster.superclass.selectNode.call(this,newNode,oldNode);if(this.m_detailControl){var keys=this.getSelectedNodeKeys();var pm=this.m_detailControl.getReadPublicMethod();if(pm){var pm_upd,pm_ins;if(this.m_detailControl.getUpdatePublicMethod){pm_upd=this.m_detailControl.getUpdatePublicMethod();}
if(this.m_detailControl.getInsertPublicMethod){pm_ins=this.m_detailControl.getInsertPublicMethod();}
var det_ids=this.getDetailKeyIds();var ind=0;var contr=pm.getController();for(var kid in keys){this.m_detailControl.setFilter({"field":det_ids[ind],"sign":contr.PARAM_SGN_EQUAL,"val":keys[kid],"icase":"0"});if(pm_upd){pm_upd.setFieldValue(det_ids[ind],keys[kid]);}
if(pm_ins){pm_ins.setFieldValue(det_ids[ind],keys[kid]);}
ind++;}
this.m_detailControl.onRefresh();}}}
GridAjxMaster.prototype.getDetailControl=function(){return this.m_detailControl;}
GridAjxMaster.prototype.setDetailControl=function(v){this.m_detailControl=v;}
GridAjxMaster.prototype.getDetailKeyIds=function(){return this.m_detailKeyIds;}
GridAjxMaster.prototype.setDetailKeyIds=function(v){this.m_detailKeyIds=v;} 
function GridCommandsAjx(id,options){options=options||{};options.cmdExport=(options.cmdExport!=undefined)?options.cmdExport:true;var self=this;if(options.cmdExport){this.setControlExport(options.controlExport||new ButtonCtrl(id+":cmdExport",{"glyph":"glyphicon-file","onClick":function(){self.m_grid.getReadPublicMethod().download("ViewExcel");},"attrs":{"title":this.BTN_EXPORT_TITLE}}));}
GridCommandsAjx.superclass.constructor.call(this,id,options);}
extend(GridCommandsAjx,GridCommands);GridCommandsAjx.prototype.m_controlExport;GridCommandsAjx.prototype.addControls=function(){if(this.m_controlInsert)this.addElement(this.m_controlInsert);if(this.m_controlEdit)this.addElement(this.m_controlEdit);if(this.m_controlCopy)this.addElement(this.m_controlCopy);if(this.m_controlDelete)this.addElement(this.m_controlDelete);if(this.m_controlPrint)this.addElement(this.m_controlPrint);if(this.m_controlExport)this.addElement(this.m_controlExport);if(this.m_controlRefresh)this.addElement(this.m_controlRefresh);if(this.m_controlPrintObj)this.addElement(this.m_controlPrintObj);if(this.m_controlFilter){this.addElement(this.m_controlFilterToggle);this.addElement(this.m_controlFilter);}
if(this.m_popUpMenu){this.toPopUp();}}
GridCommandsAjx.prototype.toPopUp=function(){if(this.m_controlInsert)this.m_popUpMenu.addButton(this.m_controlInsert);if(this.m_controlEdit)this.m_popUpMenu.addButton(this.m_controlEdit);if(this.m_controlCopy)this.m_popUpMenu.addButton(this.m_controlCopy);if(this.m_controlDelete)this.m_popUpMenu.addButton(this.m_controlDelete);if(this.m_controlPrint)this.m_popUpMenu.addButton(this.m_controlPrint);if(this.m_controlExport)this.m_popUpMenu.addButton(this.m_controlExport);if(this.m_controlColumnManager)this.m_popUpMenu.addButton(this.m_controlColumnManager);if(this.m_controlRefresh)this.m_popUpMenu.addButton(this.m_controlRefresh);if(this.m_controlPrintObj)this.addElement(this.m_controlPrintObj);this.printObjToPopUp();}
GridCommandsAjx.prototype.getControlExport=function(){return this.m_controlExport;}
GridCommandsAjx.prototype.setControlExport=function(v){this.m_controlExport=v;}
GridCommandsAjx.prototype.setEnabled=function(en){if(this.m_controlRefresh)this.m_controlRefresh.setEnabled(en);GridCommandsAjx.superclass.setEnabled.call(this,en);} 
GridCommandsAjx.prototype.BTN_EXPORT_TITLE="Экспорт в Excel"; 
function GridCommandsDOC(id,options){options=options||{};options.cmdUnprocess=(options.cmdUnprocess!=undefined)?options.cmdUnprocess:true;options.cmdPrintDoc=(options.cmdPrintDoc!=undefined)?options.cmdPrintDoc:true;options.cmdShowActs=(options.cmdShowActs!=undefined)?options.cmdShowActs:true;var self=this;if(options.cmdUnprocess||options.controlUnprocess){this.setControlUnprocess(options.controlUnprocess||new ButtonCtrl(id+":cmdUnprocess",{"glyph":"glyphicon-unchecked","onClick":function(){WindowQuestion.show({"cancel":false,"text":self.ACTS_DEL_CONF,"callBack":function(r){if(r==WindowQuestion.RES_YES){self.delActs();}}});},"attrs":{"title":this.BTN_UNPROCESS_TITLE}}));}
if(options.cmdShowActs||options.controlShowActs){this.setControlShowActs(options.controlShowActs||new ButtonCtrl(id+":cmdShowActs",{"glyph":"glyphicon-log-in","onClick":function(){},"attrs":{"title":this.BTN_SHOWACT_TITLE}}));}
GridCommandsDOC.superclass.constructor.call(this,id,options);}
extend(GridCommandsDOC,GridCommandsAjx);GridCommandsDOC.prototype.m_controlUnprocess;GridCommandsDOC.prototype.m_controlShowActs;GridCommandsDOC.prototype.addControls=function(){if(this.m_controlInsert)this.addElement(this.m_controlInsert);if(this.m_controlEdit)this.addElement(this.m_controlEdit);if(this.m_controlCopy)this.addElement(this.m_controlCopy);if(this.m_controlDelete)this.addElement(this.m_controlDelete);if(this.m_controlPrint)this.addElement(this.m_controlPrint);if(this.m_controlExport)this.addElement(this.m_controlExport);if(this.m_controlRefresh)this.addElement(this.m_controlRefresh);if(this.m_controlPrintObj)this.addElement(this.m_controlPrintObj);if(this.m_controlUnprocess)this.addElement(this.m_controlUnprocess);if(this.m_controlShowActs)this.addElement(this.m_controlShowActs);if(this.m_controlFilter){this.addElement(this.m_controlFilterToggle);this.addElement(this.m_controlFilter);}
if(this.m_popUpMenu){this.toPopUp();}}
GridCommandsDOC.prototype.toPopUp=function(){GridCommandsDOC.superclass.toPopUp.call(this);if(this.m_controlUnprocess||this.m_controlShowActs){this.m_popUpMenu.addSeparator();if(this.m_controlUnprocess)this.m_popUpMenu.addButton(this.m_controlUnprocess);if(this.m_controlShowActs)this.m_popUpMenu.addButton(this.m_controlShowActs);}}
GridCommandsDOC.prototype.setControlUnprocess=function(v){this.m_controlUnprocess=v;}
GridCommandsDOC.prototype.getControlUnprocess=function(){return this.m_controlUnprocess;}
GridCommandsDOC.prototype.setControlShowActs=function(v){this.m_controlShowActs=v;}
GridCommandsDOC.prototype.getControlShowActs=function(){return this.m_controlShowActs;}
GridCommandsDOC.prototype.delActs=function(){var contr=this.m_grid.getReadPublicMethod().getController();if(contr.publicMethodExists("set_unprocessed")){var self=this;var keys=this.m_grid.getSelectedNodeKeys();var pm=contr.getPublicMethod("set_unprocessed");pm.setFieldValue("doc_id",keys["id"]);pm.run({"async":true,"ok":function(){self.m_grid.onRefresh();window.showNote(self.ACTS_DELETED);}})}} 
GridCommandsDOC.prototype.BTN_UNPROCESS_TITLE="Отменить проведение документа";GridCommandsDOC.prototype.BTN_SHOWACT_TITLE="Показать движения документа";GridCommandsDOC.prototype.ACTS_DEL_CONF="Отменить проведение документа?";GridCommandsDOC.prototype.ACTS_DELETED="Отменено проведение документа."; 
function GridPagination(id,options){options=options||{};GridPagination.superclass.constructor.call(this,id,(options.tagName||this.DEF_TAG_NAME),options);var self=this;this.m_inf=new Control(id+":inf","span");this.m_showPageCount=(options.showPageCount)?parseInt(options.showPageCount):this.DEF_PAGES;if(this.m_showPageCount){this.m_pages=new ControlContainer(id+":pages",options.pagesTagName||this.DEF_PAGES_TAG_NAME,{"className":options.pagesClassName||this.DEF_PAGES_CLASS_NAME});}
this.setPageClassName(options.pageClassName||this.DEF_PAGE_CLASS_NAME);this.setPageCurClassName(options.pageCurClassName||this.DEF_PAGE_CUR_CLASS_NAME);this.setPageTagName(options.pageTagName||this.DEF_PAGE_TAG_NAME);this.m_btnsCont=new ControlContainer(id+":bns_cont","SPAN",{"className":"pagination-pages"});var ctrl_class=options.ctrlClassName||this.DEF_CTRL_CLASS_NAME;if(options.ctrlGoFirst||options.cmdGoFirst==undefined||options.cmdGoFirst==true){this.m_ctrlGoFirst=options.ctrlGoFirst||new Button(id+":go_first",{"glyph":(options.ctrlGoFirstCaption!=undefined)?null:options.ctrlGoFirstGlyph||this.DEF_CTRL_GO_FIRST_GLYPH,"caption":options.ctrlGoFirstCaption||"","className":ctrl_class,"onClick":function(){self.goFirst();},"attrs":{"title":this.CONTR_GO_FIRST_TITLE}});this.m_btnsCont.addElement(this.m_ctrlGoFirst);}
if(options.ctrlGoPrev||options.cmdGoPrev==undefined||options.cmdGoPrev==true){this.m_ctrlGoPrev=new Button(id+":go_prev",{"glyph":(options.ctrlGoPrevCaption!=undefined)?null:options.ctrlGoPrevGlyph||this.DEF_CTRL_GO_PREV_GLYPH,"caption":options.ctrlGoPrevCaption||"","className":ctrl_class,"onClick":function(){self.goPrev();},"attrs":{"title":this.CONTR_GO_PREV_TITLE}});this.m_btnsCont.addElement(this.m_ctrlGoPrev);}
if(options.ctrlGoNext||options.cmdGoNext==undefined||options.cmdGoNext==true){this.m_ctrlGoNext=new Button(id+":go_next",{"glyph":(options.ctrlGoNextCaption!=undefined)?null:options.ctrlGoNextGlyph||this.DEF_CTRL_GO_NEXT_GLYPH,"caption":options.ctrlGoNextCaption||"","className":ctrl_class,"onClick":function(){self.goNext();},"attrs":{"title":this.CONTR_GO_NEXT_TITLE}});this.m_btnsCont.addElement(this.m_ctrlGoNext);}
if(options.ctrlGoLast||options.cmdGoLast==undefined||options.cmdGoLast==true){this.m_ctrlGoLast=new Button(id+":go_last",{"glyph":(options.ctrlGoLastCaption!=undefined)?null:options.ctrlGoLastGlyph||this.DEF_CTRL_GO_LAST_GLYPH,"caption":options.ctrlGoLastCaption||"","className":ctrl_class,"onClick":function(){self.goLast();},"attrs":{"title":this.CONTR_GO_LAST_TITLE}});this.m_btnsCont.addElement(this.m_ctrlGoLast);}
options.from=options.from||0;this.setFrom(options.from);if(options.countPerPage){this.setCountPerPage(options.countPerPage);}}
extend(GridPagination,Control);GridPagination.prototype.DEF_PAGES=10;GridPagination.prototype.DEF_TAG_NAME="DIV";GridPagination.prototype.DEF_CTRL_CLASS_NAME="btn btn-xs";GridPagination.prototype.DEF_CTRL_GO_FIRST_GLYPH="glyphicon-fast-backward";GridPagination.prototype.DEF_CTRL_GO_PREV_GLYPH="glyphicon-step-backward";GridPagination.prototype.DEF_CTRL_GO_NEXT_GLYPH="glyphicon-step-forward";GridPagination.prototype.DEF_CTRL_GO_LAST_GLYPH="glyphicon-fast-forward";GridPagination.prototype.DEF_PAGE_CLASS_NAME="pagination-page";GridPagination.prototype.DEF_PAGE_CUR_CLASS_NAME="pagination-page badge pagination-page-cur";GridPagination.prototype.DEF_PAGE_TAG_NAME="SPAN";GridPagination.prototype.DEF_PAGES_TAG_NAME="SPAN";GridPagination.prototype.DEF_PAGES_CLASS_NAME="pagination-pages";GridPagination.prototype.m_countTotal;GridPagination.prototype.m_countPerPage;GridPagination.prototype.m_from;GridPagination.prototype.m_inf;GridPagination.prototype.m_grid;GridPagination.prototype.m_pageClassName;GridPagination.prototype.m_pageCurClassName;GridPagination.prototype.m_pageTagName;GridPagination.prototype.getFrom=function(){return this.m_from;}
GridPagination.prototype.getCountPerPage=function(){return this.m_countPerPage;}
GridPagination.prototype.setCountTotal=function(countTotal){this.m_countTotal=parseInt(countTotal);this.setInf();}
GridPagination.prototype.setCountPerPage=function(countPerPage){this.m_countPerPage=parseInt(countPerPage);}
GridPagination.prototype.setFrom=function(from){this.m_from=parseInt(from);this.setInf();}
GridPagination.prototype.reset=function(){this.m_from=undefined;}
GridPagination.prototype.setGrid=function(v){this.m_grid=v;}
GridPagination.prototype.setFirstEnabled=function(enabled){}
GridPagination.prototype.goFirst=function(){this.setFrom(0);this.m_grid.onRefresh();this.m_grid.focus();}
GridPagination.prototype.goPrev=function(){this.setFrom(Math.max(0,this.m_from-this.m_countPerPage));this.m_grid.onRefresh();this.m_grid.focus();}
GridPagination.prototype.goNext=function(){var from=this.m_from+this.m_countPerPage;from=(from>=this.m_countTotal)?this.m_from:from;this.setFrom(from);this.m_grid.onRefresh();this.m_grid.focus();}
GridPagination.prototype.goLast=function(){var pages=Math.floor(this.m_countTotal/this.m_countPerPage);if((this.m_countTotal%this.m_countPerPage)==0){pages--;}
this.setFrom(pages*this.m_countPerPage);this.m_grid.onRefresh();this.m_grid.focus();}
GridPagination.prototype.setInf=function(){var pages=Math.ceil(this.m_countTotal/this.m_countPerPage);var page=Math.ceil(this.m_from/this.m_countPerPage)+1;if(isNaN(pages))pages=1;if(isNaN(page))page=1;this.m_inf.setValue(this.CONTR_INF_PAGE+pages);if(this.m_ctrlGoFirst)this.m_ctrlGoFirst.setEnabled((page>1));if(this.m_ctrlGoPrev)this.m_ctrlGoPrev.setEnabled((page>1));if(page==pages){if(this.m_ctrlGoLast)this.m_ctrlGoLast.setEnabled(false);if(this.m_ctrlGoNext)this.m_ctrlGoNext.setEnabled(false);}
else{if(this.m_ctrlGoLast)this.m_ctrlGoLast.setEnabled(true);if(this.m_ctrlGoNext)this.m_ctrlGoNext.setEnabled(true);}
if(this.m_showPageCount&&this.m_inf.getNode().parentNode){this.m_pages.delDOM();this.m_pages.clear();var self=this;var prev_from=page-this.m_showPageCount;if(prev_from<1)prev_from=1;for(var pg=prev_from;pg<page;pg++){this.m_pages.addElement(this.createPageElement({"className":this.getPageClassName(),"attrs":{"title":this.GO_TO_PAGE+pg,"to_page":pg},"value":pg,"events":{"click":function(e){self.goToPageFromEvent(e);}}}));}
if(pages>1){this.m_pages.addElement(this.createPageElement({"className":this.getPageCurClassName(),"attrs":{"title":this.CONTR_PG_CNT},"value":page}));}
var nxt_to=page+this.m_showPageCount;if(nxt_to>pages)nxt_to=pages;for(var pg=page+1;pg<=nxt_to;pg++){this.m_pages.addElement(this.createPageElement({"className":this.getPageClassName(),"attrs":{"title":this.CONTR_INF_PAGE+pg,"to_page":pg},"value":pg,"events":{"click":function(e){self.goToPageFromEvent(e);}}}));}
this.m_pages.toDOMAfter(this.m_btnsCont.getNode());}}
GridPagination.prototype.goToPageFromEvent=function(e){e=EventHelper.fixMouseEvent(e);var pg=DOMHelper.getAttr(e.target,"to_page");this.setFrom((pg-1)*this.m_countPerPage);var self=this;this.m_grid.onRefresh(function(){$([document.documentElement,document.body]).animate({scrollTop:$(self.m_grid.getNode().parentNode).offset().top},200);});}
GridPagination.prototype.toDOM=function(parent){GridPagination.superclass.toDOM.call(this,parent);this.m_inf.toDOM(this.m_node);this.m_btnsCont.toDOM(this.m_node);this.setInf();}
GridPagination.prototype.delDOM=function(){if(this.m_showPageCount){this.m_pages.delDOM();}
this.m_inf.delDOM();this.m_btnsCont.delDOM();GridPagination.superclass.delDOM.call(this);}
GridPagination.prototype.setPageClassName=function(v){this.m_pageClassName=v;}
GridPagination.prototype.getPageClassName=function(){return this.m_pageClassName;}
GridPagination.prototype.setPageCurClassName=function(v){this.m_pageCurClassName=v;}
GridPagination.prototype.getPageCurClassName=function(){return this.m_pageCurClassName;}
GridPagination.prototype.setPageTagName=function(v){this.m_pageTagName=v;}
GridPagination.prototype.getPageTagName=function(){return this.m_pageTagName;}
GridPagination.prototype.createPageElement=function(options){return(new Control(null,this.getPageTagName(),options));} 
GridPagination.prototype.CONTR_GO_FIRST_TITLE="в начало";GridPagination.prototype.CONTR_GO_PREV_TITLE="предыдущая";GridPagination.prototype.CONTR_GO_NEXT_TITLE="следующая";GridPagination.prototype.CONTR_GO_LAST_TITLE="в конец";GridPagination.prototype.CONTR_INF_PAGE="Страниц:";GridPagination.prototype.CONTR_INF_FROM="из";GridPagination.prototype.GO_TO_PAGE="Перейти на страницу ";GridPagination.prototype.CONTR_PG_CNT="Страниц:"; 
function GridFilter(id,options){options=options||{};options.className=options.className||this.DEF_CLASS_NAME;GridFilter.superclass.constructor.call(this,id,options.tagName||this.DEF_TAG_NAME,options);options.cmdSet=(options.cmdSet!=undefined)?options.cmdSet:true;options.cmdUnset=(options.cmdUnset!=undefined)?options.cmdUnset:options.cmdSet;var self=this;if(options.cmdSet){this.setControlSet(options.controlSet||new ButtonCmd(id+":cmdSet",{"caption":this.DEF_SET_CTRL_CAP,"onClick":function(){self.setFilter();},"attrs":{"title":this.DEF_SET_CTRL_TITLE}}));}
if(options.cmdUnset){this.setControlUnset(options.controlUnset||new ButtonCmd(id+":cmdUnset",{"caption":this.DEF_UNSET_CTRL_CAP,"onClick":function(){self.unsetFilter();},"attrs":{"title":this.DEF_UNSET_CTRL_TITLE}}));}
this.m_filter=new ModelFilter({"filters":options.filters});this.addControls();}
extend(GridFilter,ControlContainer);GridFilter.prototype.DEF_TAG_NAME="form";GridFilter.prototype.DEF_CLASS_NAME="form-horizontal collapse";GridFilter.prototype.m_controlSet;GridFilter.prototype.m_controlUnset;GridFilter.prototype.m_filter;GridFilter.prototype.m_onRefresh;GridFilter.prototype.addControls=function(){var filters=this.m_filter.getFilters();for(var id in filters){this.addElement(filters[id].binding.getControl());}
this.m_contCommands=new ControlContainer(this.getId()+":cont-cmd","DIV",{"className":window.getBsCol()+"12"});if(this.m_controlSet)this.m_contCommands.addElement(this.m_controlSet);if(this.m_controlUnset)this.m_contCommands.addElement(this.m_controlUnset);this.addElement(this.m_contCommands);}
GridFilter.prototype.setControlSet=function(v){this.m_controlSet=v;}
GridFilter.prototype.getControlSet=function(){return this.m_controlSet;}
GridFilter.prototype.setControlUnset=function(v){this.m_controlUnset=v;}
GridFilter.prototype.getControlUnset=function(){return this.m_controlUnset;}
GridFilter.prototype.setFilter=function(v){this.m_filter=v;}
GridFilter.prototype.getFilter=function(){return this.m_filter;}
GridFilter.prototype.setOnRefresh=function(v){this.m_onRefresh=v;}
GridFilter.prototype.getOnRefresh=function(){return this.m_onRefresh;}
GridFilter.prototype.setFilter=function(){if(this.m_onRefresh){this.m_onRefresh();}}
GridFilter.prototype.unsetFilter=function(){this.m_filter.resetFilters();if(this.m_onRefresh){this.m_onRefresh();}} 
GridFilter.prototype.DEF_SET_CTRL_CAP="Применить";GridFilter.prototype.DEF_SET_CTRL_TITLE="Применить отбор";GridFilter.prototype.DEF_UNSET_CTRL_CAP="Сбросить";GridFilter.prototype.DEF_UNSET_CTRL_TITLE="Отменить отбор";GridFilter.prototype.DEF_TOGGLE_CTRL_CAP="Отбор";GridFilter.prototype.DEF_TOGGLE_CTRL_TITLE="показать отбор"; 
function EditPeriodDate(id,options){options=options||{};options.template=options.template||window.getApp().getTemplate("EditPeriodDate");options.templateOptions=options.templateOptions||{"CONTR_DOWN_FAST_TITLE":options.downFastTitle||this.CONTR_DOWN_FAST_TITLE,"CONTR_DOWN_TITLE":options.downTitle||this.CONTR_DOWN_TITLE,"CONTR_UP_FAST_TITLE":options.upFastTitle||this.CONTR_UP_FAST_TITLE,"CONTR_UP_TITLE":options.upTitle||this.CONTR_UP_TITLE};EditPeriodDate.superclass.constructor.call(this,id,"template",options);var edit_class=options.editClass||EditDate;options.cmdDownFast=(options.cmdDownFast!==undefined)?options.cmdDownFast:true;options.cmdDown=(options.cmdDown!==undefined)?options.cmdDown:true;options.cmdUpFast=(options.cmdUpFast!==undefined)?options.cmdUpFast:true;options.cmdUp=(options.cmdUp!==undefined)?options.cmdUp:true;options.cmdPeriodSelect=(options.cmdPeriodSelect!==undefined)?options.cmdPeriodSelect:true;var self=this;if(options.cmdDownFast){this.setControlDownFast(options.controlDownFast||new Button(id+":downFast",{"glyph":"glyphicon-triangle-left","onClick":function(){self.goFast(-1);}}));}
if(options.cmdDown){this.setControlDown(options.controlDown||new Button(id+":down",{"glyph":"glyphicon-menu-left","onClick":function(){self.go(-1);}}));}
if(options.cmdUp){this.setControlUp(options.controlUp||new Button(id+":up",{"glyph":"glyphicon-menu-right","onClick":function(){self.go(1);}}));}
if(options.cmdUpFast){this.setControlUpFast(options.controlUpFast||new Button(id+":upFast",{"glyph":"glyphicon-triangle-right","onClick":function(){self.goFast(1);}}));}
if(options.controlFrom||options.cmdControlFrom==undefined||options.cmdControlFrom===true){this.setControlFrom(options.controlFrom||new edit_class(id+":from",{"value":options.valueFrom,"timeValueStr":(options.valueFrom)?DateHelper.format(options.valueFrom,"H:i:s"):this.DEF_FROM_TIME,"contClassName":window.getBsCol(6),"editContClassName":"input-group "+window.getBsCol(12)}));}
if(options.controlTo||options.cmdControlTo==undefined||options.cmdControlTo===true){this.setControlTo(options.controlTo||new edit_class(id+":to",{"value":options.valueTo,"timeValueStr":(options.valueTo)?DateHelper.format(options.valueTo,"H:i:s"):this.DEF_TO_TIME,"contClassName":window.getBsCol(6),"editContClassName":"input-group "+window.getBsCol(12)}));}
this.setField(options.field);if(options.cmdPeriodSelect){var sel_ctrl;if(options.controlPeriodSelect){sel_ctrl=options.controlPeriodSelect;}
else{var sel_class=options.periodSelectClass||PeriodSelect;var sel_opts=options.periodSelectOptions||{};sel_opts.onValueChange=sel_opts.onValueChange||function(){self.setPredefinedPeriod(this.getValue());};sel_ctrl=new sel_class(this.getId()+":periodSelect",sel_opts);}
this.setControlPeriodSelect(sel_ctrl);}
this.addControls();}
extend(EditPeriodDate,ControlContainer);EditPeriodDate.prototype.DEF_FROM_TIME="00:00:00";EditPeriodDate.prototype.DEF_TO_TIME="23:59:59";EditPeriodDate.prototype.m_controlFrom;EditPeriodDate.prototype.m_controlTo;EditPeriodDate.prototype.m_controlUp;EditPeriodDate.prototype.m_controlUpFast;EditPeriodDate.prototype.m_controlDown;EditPeriodDate.prototype.m_controlDownFast;EditPeriodDate.prototype.m_controlPeriodSelect;EditPeriodDate.prototype.m_field;EditPeriodDate.prototype.addControls=function(){if(this.m_controlDownFast)this.addElement(this.m_controlDownFast);if(this.m_controlDown)this.addElement(this.m_controlDown);if(this.m_controlPeriodSelect)this.addElement(this.m_controlPeriodSelect);this.addElement(this.m_controlFrom);this.addElement(this.m_controlTo);if(this.m_controlUp)this.addElement(this.m_controlUp);if(this.m_controlUpFast)this.addElement(this.m_controlUpFast);}
EditPeriodDate.prototype.getControlFrom=function(){return this.m_controlFrom;}
EditPeriodDate.prototype.setControlFrom=function(v){this.m_controlFrom=v;}
EditPeriodDate.prototype.getControlTo=function(){return this.m_controlTo;}
EditPeriodDate.prototype.setControlTo=function(v){this.m_controlTo=v;}
EditPeriodDate.prototype.getControlUp=function(){return this.m_controlUp;}
EditPeriodDate.prototype.setControlUp=function(v){this.m_controlUp=v;}
EditPeriodDate.prototype.getControlUpFast=function(){return this.m_controlUpFast;}
EditPeriodDate.prototype.setControlUpFast=function(v){this.m_controlUpFast=v;}
EditPeriodDate.prototype.getControlDownFast=function(){return this.m_controlDownFast;}
EditPeriodDate.prototype.setControlDownFast=function(v){this.m_controlDownFast=v;}
EditPeriodDate.prototype.getControlDown=function(){return this.m_controlDown;}
EditPeriodDate.prototype.setControlDown=function(v){this.m_controlDown=v;}
EditPeriodDate.prototype.getControlPeriodSelect=function(){return this.m_controlPeriodSelect;}
EditPeriodDate.prototype.setControlPeriodSelect=function(v){this.m_controlPeriodSelect=v;}
EditPeriodDate.prototype.getField=function(){return this.m_field;}
EditPeriodDate.prototype.setField=function(v){this.m_field=v;}
EditPeriodDate.prototype.reset=function(){this.m_controlFrom.reset();this.m_controlTo.reset();}
EditPeriodDate.prototype.focus=function(){if(this.m_controlFrom)this.m_controlFrom.focus();}
EditPeriodDate.prototype.getValue=function(){return{"period":this.getControlPeriodSelect().getValue()};}
EditPeriodDate.prototype.isNull=function(){return(this.m_controlFrom&&this.m_controlTo.isNull());}
EditPeriodDate.prototype.setValue=function(v){if(v){this.getControlPeriodSelect().setValue(v);this.setControlsEnabled(v);}}
EditPeriodDate.prototype.setInitValue=function(v){this.setValue(v);}
EditPeriodDate.prototype.reset=function(){if(this.getControlPeriodSelect())this.getControlPeriodSelect().setValue("all");}
EditPeriodDate.prototype.setCtrlDateTime=function(ctrl,dt){dt.setHours(0);dt.setMinutes(0);dt.setSeconds(0);dt.setTime(dt.getTime()+DateHelper.timeToMS(ctrl.getTimeValueStr()));ctrl.setValue(dt);}
EditPeriodDate.prototype.setControlsEnabled=function(per){var ctrl_en=(per=="all");this.getControlFrom().setEnabled(ctrl_en);this.getControlTo().setEnabled(ctrl_en);}
EditPeriodDate.prototype.setPredefinedPeriod=function(per){this.setControlsEnabled(per);if(per=="all"){this.getControlFrom().reset();this.getControlTo().reset();this.getControlFrom().focus();}
else if(per=="day"){this.setCtrlDateTime(this.getControlFrom(),DateHelper.time());this.setCtrlDateTime(this.getControlTo(),DateHelper.time());}
else if(per=="week"){this.setCtrlDateTime(this.getControlFrom(),DateHelper.weekStart());this.setCtrlDateTime(this.getControlTo(),DateHelper.weekEnd());}
else if(per=="month"){this.setCtrlDateTime(this.getControlFrom(),DateHelper.monthStart());this.setCtrlDateTime(this.getControlTo(),DateHelper.monthEnd());}
else if(per=="quarter"){this.setCtrlDateTime(this.getControlFrom(),DateHelper.quarterStart());this.setCtrlDateTime(this.getControlTo(),DateHelper.quarterEnd());}
else if(per=="year"){this.setCtrlDateTime(this.getControlFrom(),DateHelper.yearStart());this.setCtrlDateTime(this.getControlTo(),DateHelper.yearEnd());}}
EditPeriodDate.prototype.addYearsToControl=function(control,years){var v=control.getValue();if(v){v.setFullYear(v.getFullYear()+years);control.setValue(v);}}
EditPeriodDate.prototype.addMonthsToControl=function(control,months){var v=control.getValue();if(v){v.setMonth(v.getMonth()+months);control.setValue(v);}}
EditPeriodDate.prototype.addDaysToControl=function(control,days){var v=control.getValue();if(v){v.setDate(v.getDate()+days);control.setValue(v);}}
EditPeriodDate.prototype.goFast=function(sign){var per=this.getControlPeriodSelect().getValue();if(per=="all"){this.addMonthsToControl(this.getControlFrom(),1*sign);}
else if(per=="year"){this.addYearsToControl(this.getControlFrom(),2*sign);this.addYearsToControl(this.getControlTo(),2*sign);}
else if(per=="quarter"){this.addYearsToControl(this.getControlFrom(),1*sign);this.addYearsToControl(this.getControlTo(),1*sign);}
else if(per=="month"){this.addYearsToControl(this.getControlFrom(),1*sign);this.getControlTo().setValue(DateHelper.monthEnd(this.getControlFrom().getValue()));}
else if(per=="week"){this.addMonthsToControl(this.getControlFrom(),1*sign);this.getControlFrom().setValue(DateHelper.weekStart(this.getControlFrom().getValue()));this.getControlTo().setValue(DateHelper.weekEnd(this.getControlFrom().getValue()));}
else if(per=="day"){this.addMonthsToControl(this.getControlFrom(),1*sign);this.addMonthsToControl(this.getControlTo(),1*sign);}}
EditPeriodDate.prototype.go=function(sign){var per=this.getControlPeriodSelect().getValue();if(per=="all"){this.addDaysToControl(this.getControlFrom(),1*sign);}
else if(per=="year"){this.addYearsToControl(this.getControlFrom(),1*sign);this.addYearsToControl(this.getControlTo(),1*sign);}
else if(per=="quarter"){this.addMonthsToControl(this.getControlFrom(),3*sign);this.addMonthsToControl(this.getControlTo(),3*sign);}
else if(per=="month"){this.addMonthsToControl(this.getControlFrom(),1*sign);this.setCtrlDateTime(this.getControlTo(),DateHelper.monthEnd(this.getControlFrom().getValue()));}
else if(per=="week"){this.addDaysToControl(this.getControlFrom(),7*sign);this.setCtrlDateTime(this.getControlTo(),DateHelper.weekEnd(this.getControlFrom().getValue()));}
else if(per=="day"){this.addDaysToControl(this.getControlFrom(),1*sign);this.addDaysToControl(this.getControlTo(),1*sign);}} 
EditPeriodDate.prototype.DEF_CAP_FROM="Период с:";EditPeriodDate.prototype.DEF_CAP_TO="-";EditPeriodDate.prototype.CONTR_DOWN_FAST_TITLE="несколько периодов назад";EditPeriodDate.prototype.CONTR_DOWN_TITLE="период назад";EditPeriodDate.prototype.CONTR_UP_FAST_TITLE="несколько периодов вперед";EditPeriodDate.prototype.CONTR_UP_TITLE="период вперед"; 
function EditPeriodDateTime(id,options){options=options||{};options.editClass=EditDateTime;EditPeriodDateTime.superclass.constructor.call(this,id,options);}
extend(EditPeriodDateTime,EditPeriodDate); 
function EditCompound(id,options){options=options||{};this.m_options={};CommonHelper.merge(this.m_options,options);this.setPossibleDataTypes(options.possibleDataTypes||{});this.m_onSelect=options.onSelect;var tag=options.tagName||this.DEF_TAG_NAME;EditCompound.superclass.constructor.call(this,id,tag,options);}
extend(EditCompound,ControlContainer);EditCompound.prototype.DEF_TAG_NAME="DIV";EditCompound.prototype.VAL_INIT_ATTR="initValue";EditCompound.prototype.m_possibleDataTypes;EditCompound.prototype.m_dataType;EditCompound.prototype.m_control;EditCompound.prototype.m_options;EditCompound.prototype.m_onSelect;EditCompound.prototype.createControl=function(){if(this.m_control){this.m_control.delDOM();delete this.m_control;}
var tp=this.getDataType();var ctrl_id=this.getId()+":ctrl";var btn_sel=new ButtonSelectDataType(ctrl_id+":btn-select-data-type",{"compoundControl":this});var ctrl_opts={};CommonHelper.merge(ctrl_opts,this.m_options);if(tp){CommonHelper.merge(ctrl_opts,this.m_possibleDataTypes[tp].ctrlOptions);ctrl_opts.onSelect=ctrl_opts.onSelect||this.m_onSelect;if(!this.m_possibleDataTypes[tp]){throw new Error(CommonHelper.format(this.ER_TYPE_NOT_FOUND,tp));}
this.m_control=new this.m_possibleDataTypes[tp].ctrlClass(ctrl_id,ctrl_opts);if(this.m_control.getButtons){var btn_cont=this.m_control.getButtons();if(!btn_cont){this.m_control.addButtonContainer();btn_cont=this.m_control.getButtons();}
btn_cont.addElement(btn_sel);}else{this.m_control.m_buttons=new ControlContainer(this.m_control.getId()+":btn-cont","SPAN",{"className":"input-group-btn","enabled":this.m_control.getEnabled()});}this.m_control.m_buttons.addElement(btn_sel);}
else{ctrl_opts.buttonSelect=btn_sel;ctrl_opts.events={"click":function(){if(this.getEnabled())this.getButtonSelect().doSelect();}}
this.m_control=new Edit(ctrl_id,ctrl_opts);}}
EditCompound.prototype.toDOM=function(parent){if(!this.m_control){this.createControl();}
this.clear();this.addElement(this.m_control);EditCompound.superclass.toDOM.call(this,parent);}
EditCompound.prototype.getDataTypeDescr=function(tp){return"";}
EditCompound.prototype.setPossibleDataTypes=function(t){if(CommonHelper.isArray(t)){this.clearPossibleDataTypes();for(var i=0;i<t.length;i++){if(t[i].dataType&&t[i].ctrlClass){this.m_possibleDataTypes[t[i].dataType]={"ctrlClass":t[i].ctrlClass,"ctrlOptions":t[i].ctrlOptions,"dataTypeDescrLoc":t[i].dataTypeDescrLoc||this.getDataTypeDescr(t[i].dataType)};}}}
else{this.m_possibleDataTypes=t;for(var i in this.m_possibleDataTypes){if(this.m_possibleDataTypes[i].ctrlClass&&!this.m_possibleDataTypes[i].dataTypeDescrLoc){this.m_possibleDataTypes[i].dataTypeDescrLoc=this.getDataTypeDescr(i);}}}}
EditCompound.prototype.getPossibleDataTypes=function(){return this.m_possibleDataTypes;}
EditCompound.prototype.clearPossibleDataTypes=function(){this.m_possibleDataTypes={};}
EditCompound.prototype.getValue=function(){var o=this.getRef();return(o?CommonHelper.serialize(o):null);}
EditCompound.prototype.getRef=function(){var o;if(this.m_control.getKeys){o=this.m_control.getValue();if(o){o.setDataType(this.getDataType());}}
return o;}
EditCompound.prototype.setValue=function(v){if(typeof v=="string"){v=CommonHelper.unserialize(v);}
this.setDataType(((typeof v=="object"&&v.getDataType)?v.getDataType():null),v);this.m_control.setValue(v);}
EditCompound.prototype.setInitValue=function(v){if(typeof v=="string"){v=CommonHelper.unserialize(v);}
this.setDataType(((typeof v=="object"&&v.getDataType)?v.getDataType():null),v);this.m_control.setInitValue(v);this.setAttr(this.VAL_INIT_ATTR,v);}
EditCompound.prototype.setDataType=function(dataType,ctrlVal){this.m_dataType=dataType;this.createControl();this.m_control.toDOM(this.getNode());}
EditCompound.prototype.unsetDataType=function(){this.setDataType(null);}
EditCompound.prototype.getDataType=function(){return this.m_dataType;}
EditCompound.prototype.getModified=function(){return this.m_control.getModified();}
EditCompound.prototype.isNull=function(){return(!this.m_dataType||this.m_control.isNull());}
EditCompound.prototype.setValid=function(){this.m_control.setValid();}
EditCompound.prototype.setNotValid=function(er){this.m_control.setNotValid(er);}
EditCompound.prototype.setEnabled=function(v){EditCompound.superclass.setEnabled.call(this,v);this.m_options.enabled=v;if(this.m_control){this.m_control.setEnabled(v);}}
EditCompound.prototype.setVisible=function(v){EditCompound.superclass.setVisible.call(this,v);this.m_options.visible=v;if(this.m_control){this.m_control.setVisible(v);}}
EditCompound.prototype.getContTagName=function(){return this.m_node.nodeName;}
EditCompound.prototype.setContTagName=function(v){this.m_node.nodeName=v;}
EditCompound.prototype.setInputEnabled=function(enabled){EditCompound.superclass.setEnabled.call(this,enabled);}
EditCompound.prototype.getInputEnabled=function(){return EditCompound.superclass.getEnabled.call(this);}
EditCompound.prototype.reset=function(){this.m_dataType=null;this.m_control.delDOM();delete this.m_control;} 
EditCompound.prototype.LB_TYPE="Тип:";EditCompound.prototype.LB_VAL="Значение:";EditCompound.prototype.ER_TYPE_NOT_FOUND="Тип %s не определен!"; 
function ConstantGrid(id,options){options=options||{};var self=this;var contr=new Constant_Controller();var opts={"model":options.model,"controller":contr,"editInline":true,"editWinClass":null,"popUpMenu":new PopUpMenu(),"commands":new GridCmdContainerAjx(id+":cmd",{"cmdInsert":false,"cmdCopy":false,"cmdDelete":false,"cmdEdit":true}),"updatePublicMethod":contr.getPublicMethod("set_value"),"head":new GridHead(id+":head",{"elements":[new GridRow(id+":head:0",{"elements":[new GridCellHead(id+":head:0:name",{"value":this.LIST_COL_NAME,"columns":[new GridColumn({"field":options.model.getField("name"),"ctrlEdit":false,"ctrlOptions":{"enabled":false,"cmdClear":false}})],"sortable":true,"sort":"asc"}),new GridCellHead(id+":head:0:descr",{"value":this.LIST_COL_DESCR,"columns":[new GridColumn({"field":options.model.getField("descr"),"ctrlEdit":false,"ctrlOptions":{"enabled":false,"cmdClear":false}})]}),new GridCellHead(id+":head:0:val",{"value":this.LIST_COL_VAL,"columns":[new GridColumn({"field":options.model.getField("val"),"ctrlClassResolve":function(){return self.getConstantClass();},"ctrlOptions":function(){return self.getConstantClassOptions();},"cellOptions":function(column,row){return this.getCellOptions(column,row);}})]})]})]}),"rowSelect":false,"autoRefresh":false,"focus":true,"defSrvEvents":false};ConstantGrid.superclass.constructor.call(this,id,opts);this.m_defClasses={"Bool":{"columnClass":GridColumnBool,"ctrlClass":EditCheckBox},"Date":{"columnClass":GridColumnDate,"ctrlClass":EditDate},"DateTime":{"columnClass":GridColumnDateTime,"ctrlClass":EditDateTime},"Time":{"columnClass":window["GridColumnTime"]?window["GridColumnTime"]:GridColumn,"ctrlClass":window["EditTime"]?window["EditTime"]:EditString},"Interval":{"columnClass":window["GridColumnInterval"]?window["GridColumnInterval"]:GridColumn,"ctrlClass":window["EditInterval"]?window["EditInterval"]:EditString},"Float":{"columnClass":GridColumnFloat,"ctrlClass":EditFloat},"Int":{"columnClass":GridColumn,"ctrlClass":EditInt},"Ref":{"columnClass":GridColumnRef,"ctrlClass":EditString},"DEF":{"columnClass":GridColumn,"ctrlClass":EditString}};}
extend(ConstantGrid,GridAjx);ConstantGrid.prototype.getConstantClassOptions=function(){return{"labelCaption":"","autoRefresh":false};}
ConstantGrid.prototype.getConstantClass=function(column,row){var val=this.m_model.getFieldValue("val");var val_type=this.m_model.getFieldValue("val_type");var ctrl_class_f=this.m_model.getField("ctrl_class");var ctrl_class;if(!ctrl_class_f.isSet()){ctrl_class=(this.m_defClasses[val_type])?this.m_defClasses[val_type].ctrlClass:this.m_defClasses.DEF.ctrlClass;}
else{ctrl_class=eval(ctrl_class_f.getValue());}
return ctrl_class;}
ConstantGrid.prototype.getCellOptions=function(column,row){var opts={"value":this.m_model.getFieldValue("val")};var val_type=this.m_model.getFieldValue("val_type");if(val_type&&val_type.toUpperCase&&val_type.toUpperCase()=="JSON"){var val_o=CommonHelper.unserialize(opts.value);if(val_o&&val_o.m_descr){opts.value=val_o.m_descr;}else if(val_o&&val_o.descr){opts.value=val_o.descr;}else if(val_o&&val_o.getDescr){opts.value=val_o.getDescr();}else if(val_o){var ctrl_class=eval(this.m_model.getFieldValue("ctrl_class"));if(ctrl_class){var self=this;var ed_o=new ctrl_class(null,{"labelCaption":"","events":{"click":function(e){self.onClick(e);}}});ed_o.setValue(val_o);opts.elements=[ed_o];}}}
return opts;}
ConstantGrid.prototype.initEditView=function(parent,replacedNode,cmd){ConstantGrid.superclass.initEditView.call(this,parent,replacedNode,cmd);var pm=this.getUpdatePublicMethod();pm.setFieldValue("id",this.m_model.getFieldValue("id"));} 
ConstantGrid.prototype.LIST_COL_NAME="Наименование";ConstantGrid.prototype.LIST_COL_DESCR="Описание";ConstantGrid.prototype.LIST_COL_VAL="Значение"; 
function ButtonOK(id,options){options=options||{};ButtonOK.superclass.constructor.call(this,id,options);}
extend(ButtonOK,ButtonCmd); 
ButtonOK.prototype.DEF_CAPTION="ОК";ButtonOK.prototype.DEF_TITLE="Записать изменения и закрыть форму."; 
function ButtonSave(id,options){ButtonSave.superclass.constructor.call(this,id,options);}
extend(ButtonSave,ButtonOK); 
ButtonSave.prototype.DEF_CAPTION="Записать";ButtonSave.prototype.DEF_TITLE="записать изменения"; 
function ButtonCancel(id,options){options=options||{};ButtonCancel.superclass.constructor.call(this,id,options);}
extend(ButtonCancel,ButtonCmd); 
ButtonCancel.prototype.DEF_CAPTION="Закрыть";ButtonCancel.prototype.DEF_TITLE="Отказаться от записи и закрыть форму"; 
function ViewObjectAjx(id,options){options=options||{};this.setKeys(options.keys);if(options.model&&options.model.getRowIndex()<0){options.model.getNextRow();}
ViewObjectAjx.superclass.constructor.call(this,id,options);this.addCommand(new Command(this.CMD_OK,{"publicMethod":options.writePublicMethod,"control":this.getControlOK(),"async":(options.cmdOkAsync!=undefined)?options.cmdOkAsync:true}));this.setCmd(options.cmd);this.m_detailDataSets={};this.setOnClose(options.onClose);if(!options.readPublicMethod&&options.controller){options.readPublicMethod=options.controller.getGetObject();}
this.setReadPublicMethod(options.readPublicMethod);this.setController(options.controller);this.setModel(options.model);this.m_dataType=options.dataType;this.setOnSaveOkMesTimeout(options.onSaveOkMesTimeout||this.DEF_ONSAVEOK_MES_TIMEOUT);var self=this;options.cmdOk=(options.cmdOk!=undefined)?options.cmdOk:true;if(options.controlOk||options.cmdOk){this.setControlOK(options.controlOk||new ButtonOK(id+":cmdOk",{"onClick":function(){self.getControlOK().setEnabled(false);self.m_oldSaveEn=false;if(self.getControlSave()){self.m_oldSaveEn=self.getControlSave().getEnabled();if(self.m_oldSaveEn)self.getControlSave().setEnabled(false);}
self.onOK(function(resp,errCode,errStr){self.getControlOK().setEnabled(true);if(self.m_oldSaveEn)self.getControlSave().setEnabled(true);self.setError(window.getApp().formatError(errCode,errStr));});}}));}
options.cmdSave=(options.cmdSave!=undefined)?options.cmdSave:true;if(options.controlSave||options.cmdSave){this.setControlSave(options.controlSave||new ButtonSave(id+":cmdSave",{"onClick":function(){self.saveObject();}}));}
options.cmdCancel=(options.cmdCancel!=undefined)?options.cmdCancel:true;if(options.controlCancel||options.cmdCancel){this.setControlCancel(options.controlCancel||new ButtonCancel(id+":cmdCancel",{"onClick":function(){self.onCancel();}}));}
options.cmdPrint=(options.printList!=undefined)?true:((options.cmdPrint!=undefined)?options.cmdPrint:false);if(options.controlPrint||options.cmdPrint){this.setControlPrint(options.controlPrint||new ButtonPrintList(id+":cmdPrint",{"printList":options.printList,"keyIds":options.printListKeyIds}));}
if(options.commandContainer||options.commandElements||options.cmdOk||options.cmdSave||options.cmdCancel||options.cmdPrint){this.m_commandContainer=options.commandContainer||new ControlContainer(id+":cmd-cont","DIV",{"elements":options.commandElements});}
this.setWritePublicMethod(options.writePublicMethod);this.addControls();this.m_keyEvent=function(e){e=EventHelper.fixKeyEvent(e);if(self.keyPressEvent(e.keyCode,e)){e.preventDefault();e.stopPropagation();return false;}};}
extend(ViewObjectAjx,ViewAjx);ViewObjectAjx.prototype.DEF_ONSAVEOK_MES_TIMEOUT=2000;ViewObjectAjx.prototype.CMD_OK="ok";ViewObjectAjx.prototype.m_controlCancel;ViewObjectAjx.prototype.m_controlOK;ViewObjectAjx.prototype.m_controlSave;ViewObjectAjx.prototype.m_controlPrint;ViewObjectAjx.prototype.m_onClose;ViewObjectAjx.prototype.m_readPublicMethod;ViewObjectAjx.prototype.m_commandContainer;ViewObjectAjx.prototype.m_replacedNode;ViewObjectAjx.prototype.m_cmd;ViewObjectAjx.prototype.m_controller;ViewObjectAjx.prototype.m_model;ViewObjectAjx.prototype.m_refType;ViewObjectAjx.prototype.m_dataType;ViewObjectAjx.prototype.m_keys;ViewObjectAjx.prototype.m_editResult;ViewObjectAjx.prototype.m_detailDataSets;ViewObjectAjx.prototype.addKeyEvents=function(){for(var elem_id in this.m_elements){if(this.m_elements[elem_id]&&this.m_elements[elem_id].setInitValue){EventHelper.add(this.m_elements[elem_id].getNode(),"keydown",this.m_keyEvent,false);}}}
ViewObjectAjx.prototype.delKeyEvents=function(){for(var elem_id in this.m_elements){if(this.m_elements[elem_id]&&this.m_elements[elem_id].setInitValue){EventHelper.del(this.m_elements[elem_id].getNode(),"keydown",this.m_keyEvent,false);}}}
ViewObjectAjx.prototype.keyPressEvent=function(keyCode,event){var res=false;switch(keyCode){case 27:res=true;this.onCancel();break;case 13:if(event.ctrlKey){res=true;this.onOK();}
break;}
return res;}
ViewObjectAjx.prototype.addControls=function(){if(this.m_commandContainer){if(this.m_controlOK)this.m_commandContainer.addElement(this.m_controlOK);if(this.m_controlSave)this.m_commandContainer.addElement(this.m_controlSave);if(this.m_controlPrint)this.m_commandContainer.addElement(this.m_controlPrint);if(this.m_controlCancel)this.m_commandContainer.addElement(this.m_controlCancel);}}
ViewObjectAjx.prototype.close=function(res){if(this.m_onClose){this.m_onClose.call(this,res);}
else{window.closeResult=res;window.close();}}
ViewObjectAjx.prototype.onAfterUpsert=function(resp,initControls){this.m_editResult.updated=true;if(resp&&typeof(resp)=="object"&&resp.modelExists("InsertedId_Model")&&this.m_dataBindings&&this.m_dataBindings.length){this.m_editResult.newKeys={};var model_obj_class=this.getWritePublicMethod().getController().getObjModelClass();var ret_model=new model_obj_class({"data":resp.getModelData("InsertedId_Model")});var base_model_class;if(ret_model instanceof ModelXML){base_model_class=ModelXML;}
else if(ret_model instanceof ModelJSON){base_model_class=ModelJSON;}
else{throw Error(this.ER_UNSUPPORTED_BASE_MODEL);}
var ret_model_serv_fields;var ret_model_serv=new base_model_class("InsertedId_Model",{"data":resp.getModelData("InsertedId_Model")});if(ret_model_serv.getNextRow()){ret_model_serv_fields=ret_model_serv.getFields();}
var ret_fields;if(ret_model.getNextRow()){ret_fields=ret_model.getFields();}
if(ret_model_serv_fields&&ret_fields){for(ret_id in ret_model_serv_fields){if(ret_model_serv_fields[ret_id].isSet()&&ret_fields[ret_id]){this.m_editResult.newKeys[ret_id]=ret_fields[ret_id].getValue();}}}
if(initControls){for(var i=0;i<this.m_dataBindings.length;i++){this.defineField(i);var f=this.m_dataBindings[i].getField();if(f){var val;if(ret_model_serv_fields[f.getId()]&&ret_fields[f.getId()]&&ret_fields[f.getId()].isSet()){val=ret_fields[f.getId()].getValue();}
else{if(!this.m_dataBindings[i].getControl()){console.dir(this.m_dataBindings[i])}
val=this.m_dataBindings[i].getControl().getValue();}
if(this.m_dataBindings[i].getControl().setInitValue){this.m_dataBindings[i].getControl().setInitValue(val);}
f.setValue(val);}}}}
else{for(var i=0;i<this.m_dataBindings.length;i++){this.defineField(i);var f=this.m_dataBindings[i].getField();if(f){var ctrl=this.m_dataBindings[i].getControl();if(ctrl){var val;val=ctrl.getValue();if(initControls&&ctrl.setInitValue){ctrl.setInitValue(val);}
if(val!=null&&typeof val=="object"&&val.getKeys){var keys=val.getKeys();for(key in keys){val=keys[key];break;}}
try{f.setValue(val);}
catch(e){}}}}}}
ViewObjectAjx.prototype.onOK=function(failFunc){var self=this;this.execCommand(this.CMD_OK,function(resp){self.onAfterUpsert(resp,false);self.close(self.m_editResult);},failFunc);}
ViewObjectAjx.prototype.onSave=function(okFunc,failFunc,allFunc){var self=this;this.execCommand(this.CMD_OK,function(resp){self.onSaveOk.call(self,resp);if(okFunc){okFunc.call(self);}},failFunc,allFunc);}
ViewObjectAjx.prototype.getModified=function(cmd){return ViewObjectAjx.superclass.getModified.call(this,(cmd)?cmd:this.CMD_OK);}
ViewObjectAjx.prototype.onCancel=function(){if(this.getModified(this.CMD_OK)){var self=this;WindowQuestion.show({"text":this.Q_SAVE_CHANGES,"timeout":this.SAVE_CH_TIMEOUT,"winObj":this.m_winObj,"callBack":function(res){if(res==WindowQuestion.RES_YES){self.onOK();}
else if(res==WindowQuestion.RES_NO){self.close(this.m_editResult);}}});}
else{this.close(this.m_editResult);}}
ViewObjectAjx.prototype.setWriteTempEnabled=function(cmd){ViewObjectAjx.superclass.setWriteTempEnabled.call(this,cmd);if(this.m_controlSave)this.m_controlSave.setEnabled(true);}
ViewObjectAjx.prototype.setWriteTempDisabled=function(cmd){ViewObjectAjx.superclass.setWriteTempDisabled.call(this,cmd);if(this.m_controlSave)this.m_controlSave.setEnabled(false);}
ViewObjectAjx.prototype.toDOM=function(parent){ViewObjectAjx.superclass.toDOM.call(this,parent,this.getCmd());if(this.m_commandContainer)this.m_commandContainer.toDOM(parent);this.addKeyEvents();this.setDefRefVals();}
ViewObjectAjx.prototype.delDOM=function(){this.delKeyEvents();if(this.m_commandContainer)this.m_commandContainer.delDOM();ViewObjectAjx.superclass.delDOM.call(this);}
ViewObjectAjx.prototype.setControlOK=function(v){this.m_controlOK=v;}
ViewObjectAjx.prototype.getControlOK=function(){return this.m_controlOK;}
ViewObjectAjx.prototype.setControlSave=function(v){this.m_controlSave=v;}
ViewObjectAjx.prototype.getControlSave=function(){return this.m_controlSave;}
ViewObjectAjx.prototype.setControlCancel=function(v){this.m_controlCancel=v;}
ViewObjectAjx.prototype.getControlCancel=function(){return this.m_controlCancel;}
ViewObjectAjx.prototype.setControlPrint=function(v){this.m_controlPrint=v;}
ViewObjectAjx.prototype.getControlPrint=function(){return this.m_controlPrint;}
ViewObjectAjx.prototype.setWritePublicMethod=function(v){if(v&&window.getParam){var opts=window.getParam("editViewOptions");if(opts&&opts.keys){for(var key in opts.keys){v.setFieldValue(key,opts.keys[key]);}}}
this.getCommands()[this.CMD_OK].setPublicMethod(v);}
ViewObjectAjx.prototype.getWritePublicMethod=function(){return this.getCommands()[this.CMD_OK].getPublicMethod();}
ViewObjectAjx.prototype.setReadPublicMethod=function(v){this.m_readPublicMethod=v;}
ViewObjectAjx.prototype.getReadPublicMethod=function(){return this.m_readPublicMethod;}
ViewObjectAjx.prototype.setOnClose=function(v){this.m_onClose=v;}
ViewObjectAjx.prototype.getOnClose=function(){return this.m_onClose;}
ViewObjectAjx.prototype.setReplacedNode=function(v){this.m_replacedNode=v;}
ViewObjectAjx.prototype.getReplacedNode=function(){return this.m_replacedNode;}
ViewObjectAjx.prototype.setCmd=function(v){this.m_cmd=v;}
ViewObjectAjx.prototype.getCmd=function(){if(!this.m_cmd&&window.getParam){this.m_cmd=window.getParam("cmd");}
else if(!this.m_cmd){this.m_cmd="edit";}
return this.m_cmd;}
ViewObjectAjx.prototype.setWritePublicMethodOnController=function(){if(this.m_controller){var frm_cmd=this.getCmd();if(frm_cmd){var pm_id=(frm_cmd=="insert"||frm_cmd=="copy")?this.m_controller.METH_INSERT:this.m_controller.METH_UPDATE;if(this.m_controller.publicMethodExists(pm_id)){this.setWritePublicMethod(this.m_controller.getPublicMethod(pm_id));}}}}
ViewObjectAjx.prototype.setController=function(v){this.m_controller=v;this.setWritePublicMethodOnController();}
ViewObjectAjx.prototype.getController=function(){return this.m_controller;}
ViewObjectAjx.prototype.updateControlsFromResponse=function(resp){this.onAfterUpsert(resp,true);this.setCmd("update");this.setWritePublicMethod(null);for(var id in this.m_detailDataSets){if(this.m_detailDataSets[id].control&&!this.m_detailDataSets[id].control.getEnabled()){this.m_detailDataSets[id].control.setEnabled(true);}}
this.setDetailKey();}
ViewObjectAjx.prototype.onSaveOk=function(resp){this.updateControlsFromResponse(resp);window.showTempNote(this.NOTE_SAVED,null,this.m_onSaveOkMesTimeout);}
ViewObjectAjx.prototype.execCommand=function(cmd,sucFunc,failFunc,allFunc){if(cmd==this.CMD_OK&&!this.getWritePublicMethod()&&this.getController()){this.setWritePublicMethodOnController();}
ViewObjectAjx.superclass.execCommand.call(this,cmd,sucFunc,failFunc,allFunc);}
ViewObjectAjx.prototype.read=function(cmd,failFunc){var self=this;this.setReadTempDisabled();this.getReadPublicMethod().run({"all":function(){self.setTempEnabled();},"ok":function(resp){self.onGetData(resp,cmd);},"fail":function(resp,erCode,erStr){if(failFunc){failFunc.call(self,resp,erCode,erStr);}
else{throw new Error(erStr);}}});}
ViewObjectAjx.prototype.setDetailKey=function(){for(var id in this.m_detailDataSets){var key;if(this.m_detailDataSets[id].field){key=this.m_detailDataSets[id].field.getValue();}
else if(this.m_detailDataSets[id].fieldId){this.m_detailDataSets[id].field=this.m_model.getField(this.m_detailDataSets[id].fieldId);key=this.m_detailDataSets[id].field.getValue();}
else if(this.m_detailDataSets[id].value){if(typeof(this.m_detailDataSets[id].value)=="function"){key=this.m_detailDataSets[id].value.call(this);}
else{key=this.m_detailDataSets[id].value;}}
if(key){var ds=this.m_detailDataSets[id].control;var pm=ds.getInsertPublicMethod();if(pm)pm.setFieldValue(this.m_detailDataSets[id].controlFieldId,key);var pm=ds.getUpdatePublicMethod();if(pm)pm.setFieldValue(this.m_detailDataSets[id].controlFieldId,key);var pm=ds.getReadPublicMethod();var contr=pm.getController();ds.setFilter({"field":this.m_detailDataSets[id].controlFieldId,"sign":contr.PARAM_SGN_EQUAL,"val":key});if(ds.getPagination){var pg=ds.getPagination();if(pg){var pm=ds.getReadPublicMethod();pm.setFieldValue(pm.getController().PARAM_COUNT,pg.getCountPerPage());}}
ds.onRefresh(function(){ds.setEnabled(true);});}}}
ViewObjectAjx.prototype.onGetData=function(resp,cmd){cmd=(cmd===undefined)?this.getCmd():((cmd===true)?"copy":cmd);ViewObjectAjx.superclass.onGetData.call(this,resp,cmd);if(!CommonHelper.isEmpty(this.m_detailDataSets)&&cmd!="insert"&&cmd!="copy"){this.setDetailKey();}
if(this.m_controlPrint&&this.m_model){var list=this.m_controlPrint.getObjList();var keys={};var keyIds=this.m_controlPrint.getKeyIds();var fields=this.m_model.getFields();if(!keyIds){for(var fid in fields){if(fields[fid].getPrimaryKey()){keys[fid]=fields[fid].getValue();}}}
else{for(var i=0;i<keyIds.length;i++){if(fields[keyIds[i]]){keys[keyIds[i]]=fields[keyIds[i]].getValue();}}}
for(var i=0;i<list.length;i++){list[i].setKeys(keys);}}}
ViewObjectAjx.prototype.addDetailDataSet=function(dsParams){this.m_detailDataSets[dsParams.control.getId()]=dsParams;var self=this;dsParams.control.initEditWinObjOrig=dsParams.control.initEditWinObj;dsParams.control.initEditWinObj=function(cmd){var ds_id=this.getId();if(self.m_detailDataSets[ds_id].fieldId){self.m_detailDataSets[ds_id].field=self.m_model.getField(self.m_detailDataSets[ds_id].fieldId);}
var key;if(self.m_detailDataSets[ds_id].field){key=self.m_detailDataSets[ds_id].field.getValue();}
else if(self.m_detailDataSets[ds_id].value){if(typeof(self.m_detailDataSets[ds_id].value)=="function"){key=self.m_detailDataSets[ds_id].value();}
else{key=self.m_detailDataSets[ds_id].value;}}
var o=this.getEditViewOptions()||{};o.keys={};o.keys[self.m_detailDataSets[ds_id].controlFieldId]=key;this.setEditViewOptions(o);this.initEditWinObjOrig(cmd);}
if(dsParams.control&&dsParams.control.getInsertPublicMethod()&&dsParams.value){var key;if(typeof(dsParams.value)=="function"){key=dsParams.value();}
else{key=dsParams.value;}
if(key){dsParams.control.setFilter({"field":dsParams.controlFieldId,"sign":dsParams.control.getInsertPublicMethod().getController().PARAM_SGN_EQUAL,"val":key});}}}
ViewObjectAjx.prototype.copyControl=function(fromName,toName){var name=this.getElement(fromName).getValue();if(name&&!this.getElement(toName).getValue()){this.getElement(toName).setValue(name);}}
ViewObjectAjx.prototype.setDefRefVals=function(){}
ViewObjectAjx.prototype.setModel=function(v){this.m_model=v;}
ViewObjectAjx.prototype.getModel=function(){return this.m_model;}
ViewObjectAjx.prototype.setDataBindings=function(bindings){if(this.m_model){var bd_ids=[];for(var b_ind=0;b_ind<bindings.length;b_ind++){if(bindings[b_ind]){if(!bindings[b_ind].getModel()){bindings[b_ind].setModel(this.m_model);}
if(bindings[b_ind].getControl()){bd_ids.push(bindings[b_ind].getControl().getName());}}}
var fields=this.m_model.getFields();for(var f in fields){if(fields[f].getPrimaryKey()){var ctrl=this.getElement(f);if(!ctrl){ctrl=new HiddenKey(this.getId()+":"+f);this.addElement(ctrl);}
if(CommonHelper.inArray(f,bd_ids)<0){bindings.push(new DataBinding({"model":this.m_model,"control":ctrl,"field":fields[f]}));}}}}
ViewObjectAjx.superclass.setDataBindings.call(this,bindings);}
ViewObjectAjx.prototype.addDataBinding=function(bind){if(this.m_model&&!bind.getModel()){bind.setModel(this.m_model);}
ViewObjectAjx.superclass.addDataBinding.call(this,bind);}
ViewObjectAjx.prototype.setWriteBindings=function(bindings,cmd){if(this.m_model){var bd_ids=[];for(var b_ind=0;b_ind<bindings.length;b_ind++){var f_id;if(!bindings[b_ind]){throw new Error("ViewObjectAjx::setWriteBindings field index="+b_ind+". Field not defined!")}
if(bindings[b_ind].getField()){f_id=bindings[b_ind].getField().getId();}
else if(bindings[b_ind].getFieldId()){f_id=bindings[b_ind].getFieldId();}
else if(bindings[b_ind].getControl()){f_id=bindings[b_ind].getControl().getName();}
if(f_id){bd_ids.push(f_id);}}
var fields=this.m_model.getFields();for(var f in fields){if(fields[f].getPrimaryKey()){if(CommonHelper.inArray(f,bd_ids)<0){bindings.push(new CommandBinding({"control":this.getElement(f),"fieldId":f}));}}}}
this.getCommands()[(cmd?cmd:this.CMD_OK)].setBindings(bindings);}
ViewObjectAjx.prototype.getCommandContainer=function(){return this.m_commandContainer;}
ViewObjectAjx.prototype.getRefType=function(){if(!this.m_refType&&this.m_model&&this.m_dataType){var keys={};var f=this.m_model.getFields();for(var id in f){if(f[id].getPrimaryKey()&&this.elementExists(id)){keys[id]=this.getElement(id).getValue();}}
this.m_refType=new RefType({"keys":keys,"descr":"","dataType":this.m_dataType});}
return this.m_refType;}
ViewObjectAjx.prototype.saveObject=function(callBack){this.m_oldSaveEn=false;this.m_oldOkEn=false;if(this.getControlSave()&&this.getControlSave().getEnabled){this.m_oldSaveEn=this.getControlSave().getEnabled();if(this.m_oldSaveEn)this.getControlSave().setEnabled(false);}
if(this.getControlOK()&&this.getControlOK().getEnabled){this.m_oldOkEn=this.getControlOK().getEnabled();if(this.m_oldOkEn)this.getControlOK().setEnabled(false);}
var self=this;this.onSave(null,null,function(){if(self.m_oldSaveEn)self.getControlSave().setEnabled(true);if(self.m_oldOkEn)self.getControlOK().setEnabled(true);if(callBack)callBack();});}
ViewObjectAjx.prototype.setKeys=function(v){this.m_keys=v;}
ViewObjectAjx.prototype.getKeys=function(){return this.m_keys;}
ViewObjectAjx.prototype.setOnSaveOkMesTimeout=function(v){this.m_onSaveOkMesTimeout=v;}
ViewObjectAjx.prototype.getOnSaveOkMesTimeout=function(){return this.m_onSaveOkMesTimeout;} 
ViewObjectAjx.prototype.Q_SAVE_CHANGES="Сохранить изменения?";ViewObjectAjx.prototype.NOTE_SAVED="Объект записан";ViewObjectAjx.prototype.ER_UNSUPPORTED_BASE_MODEL="Данная базовая модель не поддерживается."; 
function ViewGridEditInlineAjx(id,options){options=options||{};options.tagName=options.tagName||this.DEF_TAG_NAME;options.cmdSave=false;this.m_columnTagName=options.columnTagName||this.DEF_COL_TAG_NAME;options.commandContainer=new ControlContainer(id+":cmd-cont",this.m_columnTagName,{"className":options.cmdContClassName||this.DEF_CMD_CLASS});this.setGrid(options.grid);this.m_row=options.row;ViewGridEditInlineAjx.superclass.constructor.call(this,id,options);}
extend(ViewGridEditInlineAjx,ViewObjectAjx);ViewGridEditInlineAjx.prototype.DEF_TAG_NAME="TR";ViewGridEditInlineAjx.prototype.DEF_COL_TAG_NAME="TD";ViewGridEditInlineAjx.prototype.DEF_CMD_CLASS="cmdButtons";ViewGridEditInlineAjx.prototype.m_grid;ViewGridEditInlineAjx.prototype.m_row;ViewGridEditInlineAjx.prototype.m_columnTagName;ViewGridEditInlineAjx.prototype.addEditControls=function(){var view_id=this.getId();var columns=this.getGrid().getHead().getColumns();var focus_set_elem;var autofocused=false;for(var col_id=0;col_id<columns.length;col_id++){var column=undefined;if(this.m_row){cell_obj=this.m_row.getElement(columns[col_id].getId());if(cell_obj){column=cell_obj.getGridColumn();}}
if(!column){column=columns[col_id];}
var ctrl_opts=(column.getCtrlOptions()!=undefined)?CommonHelper.clone(column.getCtrlOptions()):{};ctrl_opts.visible=columns[col_id].getHeadCell().getVisible();var f=column.getField();if(!f){continue;}
var ctrl;if(column.getCtrlEdit()){var ctrl_class=column.getCtrlClass();if(!ctrl_class){var tp=f.getDataType();if(tp==f.DT_BOOL){ctrl_class=EditCheckBox;}
else if(tp==f.DT_DATE){ctrl_class=EditDate;}
else if(tp==f.DT_DATETIME){ctrl_class=EditDateTime;}
else if(tp==f.DT_ENUM){ctrl_class=EditSelect;}
else if(tp==f.DT_FLOAT){ctrl_class=EditFloat;}
else if(tp==f.DT_INT){ctrl_class=EditInt;}
else if(tp==f.DT_STRING){ctrl_class=EditString;}
else if(tp==f.DT_PWD){ctrl_class=EditPassword;}
else if(tp==f.DT_TEXT){ctrl_class=EditText;}
else{ctrl_class=EditString;}}
if(f.getValidator().getMaxLength()){ctrl_opts.maxLength=f.getValidator().getMaxLength();}
if(f.getValidator().getRequired()){ctrl_opts.required=true;}
var focus_skeep=false;if(f.getPrimaryKey()){ctrl_opts.noSelect=true;ctrl_opts.noClear=true;focus_skeep=f.getAutoInc();}
ctrl=new ctrl_class(view_id+":"+column.getId(),ctrl_opts);if(ctrl_opts.focus||ctrl_opts.focussed||ctrl_opts.focused||ctrl_opts.autofocus){autofocused=true;}
else if(!autofocused&&!focus_skeep&&!focus_set_elem&&(ctrl_opts.enabled==undefined||ctrl_opts.enabled)){focus_set_elem=ctrl;}}
else{ctrl=new Control(null,this.m_columnTagName,{"value":f.getValue()});}
this.addElement(ctrl);}
if(!autofocused&&focus_set_elem){focus_set_elem.setAttr("autofocus","autofocus");}}
ViewGridEditInlineAjx.prototype.addControls=function(){this.addEditControls();ViewGridEditInlineAjx.superclass.addControls.call(this);}
ViewGridEditInlineAjx.prototype.setWritePublicMethod=function(pm){ViewGridEditInlineAjx.superclass.setWritePublicMethod.call(this,pm);if(pm){var columns=this.getGrid().getHead().getColumns();var com_b=this.getCommands()[this.CMD_OK].getBindings();for(var col_id=0;col_id<columns.length;col_id++){var column=undefined;if(this.m_row){cell_obj=this.m_row.getElement(columns[col_id].getId());if(cell_obj){column=cell_obj.getGridColumn();}}
if(!column){column=columns[col_id];}
if(column.getField()){var f_id=(column.getCtrlBindField())?column.getCtrlBindField().getId():((column.getCtrlBindFieldId())?column.getCtrlBindFieldId():column.getField().getId());if(pm.fieldExists(f_id)){com_b.push(new CommandBinding({"field":pm.getField(f_id),"control":this.getElement(column.getId())}));}}}
this.setKeysPublicMethod(pm);}}
ViewGridEditInlineAjx.prototype.setReadBinds=function(pm){if(pm){var model_obj=pm.getController().getObjModelClass();var model;var model=new model_obj();var columns=this.getGrid().getHead().getColumns();var bindings=[];for(var col_id=0;col_id<columns.length;col_id++){var column=undefined;if(this.m_row){cell_obj=this.m_row.getElement(columns[col_id].getId());if(cell_obj){column=cell_obj.getGridColumn();}}
if(!column){column=columns[col_id];}
if(column.getField()){var new_f=CommonHelper.clone(column.getField());if(column.getCtrlBindField()){model.addField(CommonHelper.clone(column.getCtrlBindField()));}
bindings.push(new DataBinding({"field":new_f,"model":model,"control":this.getElement(column.getId())}));}}
this.setDataBindings(bindings);}}
ViewGridEditInlineAjx.prototype.setReadPublicMethod=function(pm){ViewGridEditInlineAjx.superclass.setReadPublicMethod.call(this,pm);this.setReadBinds(pm);}
ViewGridEditInlineAjx.prototype.viewToDOM=function(parent,prevNode){var elem;for(var elem_id in this.m_elements){elem=this.m_elements[elem_id];elem.toDOM(this.m_node);}
this.m_commandContainer.toDOM(this.m_node);if(this.m_replacedNode){this.m_replacedNode.parentNode.replaceChild(this.m_node,this.m_replacedNode);}
else{if(prevNode){parent.insertBefore(this.m_node,prevNode.nextSibling);}
else{var rows=parent.getElementsByTagName(this.m_node.nodeName);if(rows.length==0){parent.appendChild(this.m_node);}
else{parent.insertBefore(this.m_node,rows[0]);}}}
this.scrollToNode();this.setFocus();this.addKeyEvents();}
ViewGridEditInlineAjx.prototype.toDOMAfter=function(prevNode){this.viewToDOM(prevNode.parentNode,prevNode);}
ViewGridEditInlineAjx.prototype.toDOM=function(parent){this.viewToDOM(parent);}
ViewGridEditInlineAjx.prototype.scrollToNode=function(){var scroll_to_node=(this.getCmd()=="insert"&&this.m_grid.getInlineInsertPlace()=="first")?this.m_grid.m_container.getNode():this.m_node;if(!DOMHelper.inViewport(scroll_to_node,true)){$(scroll_to_node).get(0).scrollIntoView({"behavior":"smooth","block":"start"});}}
ViewGridEditInlineAjx.prototype.setGrid=function(v){this.m_grid=v;}
ViewGridEditInlineAjx.prototype.getGrid=function(){return this.m_grid;}
ViewGridEditInlineAjx.prototype.getReplacedNode=function(){return this.m_replacedNode;}
ViewGridEditInlineAjx.prototype.addElement=function(ctrl,defOptions){if((!defOptions||!defOptions.contTagName)&&ctrl.setContTagName){ctrl.setContTagName(this.m_columnTagName);}
if((!defOptions||!defOptions.editContClassName)&&ctrl.setEditContClassName){ctrl.setEditContClassName(ctrl.DEF_EDIT_CONT_CLASS+" "+window.getBsCol(12));}
ViewGridEditInlineAjx.superclass.addElement.call(this,ctrl);}
ViewGridEditInlineAjx.prototype.setKeysPublicMethod=function(pm){for(var k in this.m_keys){var fid="old_"+k;if(pm.fieldExists(fid)){pm.setFieldValue(fid,this.m_keys[k]);}}}  
function ViewDOC(id,options){options=options||{};this.setProcessable(options.processable||true);var self=this;options.controlOk=options.controlOk||new ButtonCmd(id+":cmdOk",{"caption":this.BTN_OK_CAP,"title":this.BTN_OK_TITLE,"onClick":function(){if(self.getProcessable()){self.getElement("processed").setValue(true);}
self.onOK();},"app":options.app});options.controlSave=options.controlSave||new ButtonCmd(id+":cmdSave",{"caption":this.BTN_SAVE_CAP,"title":this.BTN_SAVE_TITLE,"onClick":function(){if(self.getProcessable()&&!self.getElement("processed").getValue()){self.getElement("processed").setValue(false);}
self.onSave();},"app":options.app});options.controlCancel=options.controlCancel||new ButtonCmd(id+":cmdCancel",{"caption":this.BTN_CLOSE_CAP,"title":this.BTN_CLOSE_TITLE,"onClick":function(){self.onCancel();},"app":options.app});this.m_detailDataSetsExist=(options.detailDataSetsExist!=undefined)?options.detailDataSetsExist:true;ViewDOC.superclass.constructor.call(this,id,options);this.addElement(new HiddenKey(id+":id"));if(this.getProcessable()){this.addElement(new HiddenKey(id+":processed",{}));}
if(this.m_detailDataSetsExist){this.addElement(new HiddenKey(id+":view_id",{"value":CommonHelper.md5(CommonHelper.uniqid())}));}}
extend(ViewDOC,ViewObjectAjx);ViewDOC.prototype.m_model;ViewDOC.prototype.m_detailDataSetsExist;ViewDOC.prototype.m_processable;ViewDOC.prototype.addDetailDataSet=function(grid){ViewDOC.superclass.addDetailDataSet.call(this,{"control":grid,"controlFieldId":"view_id","value":this.getElement("view_id").getValue()});}
ViewDOC.prototype.getViewId=function(){return(this.m_detailDataSetsExist)?this.getElement("view_id").getValue():null;}
ViewDOC.prototype.setDetailKey=function(){var contr=this.getReadPublicMethod().getController();var doc_id=0;if(this.getCmd()!="insert"){doc_id=this.getElement("id").getValue();}
var pm=contr.getPublicMethod("before_open");pm.setFieldValue("doc_id",doc_id);pm.setFieldValue("view_id",this.getElement("view_id").getValue());pm.run({"async":false});ViewDOC.superclass.setDetailKey.call(this);}
ViewDOC.prototype.getModified=function(cmd){var modified=ViewDOC.superclass.getModified.call(this,cmd);if(!modified){if(this.m_detailDataSetsExist){for(var id in this.m_detailDataSets){if(this.m_detailDataSets[id].control.getModified()){modified=true;break;}}}}
return modified;}
ViewDOC.prototype.addDefDataBindings=function(){this.addDataBinding(new DataBinding({"control":this.getElement("id"),"model":this.m_model}));if(this.getProcessable()){this.addDataBinding(new DataBinding({"control":this.getElement("processed"),"model":this.m_model}));}
var cmd_ok=this.getCommand(this.CMD_OK);cmd_ok.addBinding(new CommandBinding({"control":this.getElement("id")}));if(this.getProcessable()){cmd_ok.addBinding(new CommandBinding({"control":this.getElement("processed")}));}}
ViewDOC.prototype.execCommand=function(cmd,sucFunc,failFunc){if(this.getCmd()=="insert"){var dt_ctrl=this.getElement("date_time");if(dt_ctrl){var dt_ctrl_val=dt_ctrl.getValue();if(dt_ctrl_val.getHours()==0&&dt_ctrl_val.getMinutes()==0&&dt_ctrl_val.getSeconds()==0){tm=DateHelper.time();dt_ctrl_val.setHours(tm.getHours(),tm.getMinutes(),tm.getSeconds());dt_ctrl.setValue(dt_ctrl_val);}}}
ViewDOC.superclass.execCommand.call(this,cmd,sucFunc,failFunc);}
ViewDOC.prototype.beforeExecCommand=function(cmd,pm){ViewDOC.superclass.beforeExecCommand.call(this,cmd,pm);if(this.m_detailDataSetsExist&&pm.fieldExists("view_id")){pm.setFieldValue("view_id",this.getViewId());}}
ViewDOC.prototype.getProcessable=function(){return this.m_processable;}
ViewDOC.prototype.setProcessable=function(v){this.m_processable=v;}
ViewDOC.prototype.onSaveOk=function(resp){ViewDOC.superclass.onSaveOk.call(this,resp);if(this.m_detailDataSetsExist){for(var id in this.m_detailDataSets){this.m_detailDataSets[id].control.setModified(false);}}} 
ViewDOC.prototype.BTN_OK_CAP="Провести";ViewDOC.prototype.BTN_OK_TITLE="Провести документ и закрыть форму";ViewDOC.prototype.BTN_SAVE_CAP="Записать";ViewDOC.prototype.BTN_SAVE_TITLE="Записать документ";ViewDOC.prototype.BTN_CLOSE_CAP="Закрыть";ViewDOC.prototype.BTN_CLOSE_TITLE="Закрыть форму";ViewDOC.prototype.CTRL_NUM_LABEL="№";ViewDOC.prototype.CTRL_DATE_LABEL="от";ViewDOC.prototype.NOTE_SAVED="Документ записан"; 
var WindowPrint={show:function(options){options=options||{};var win_opts={"name":"Print?"+CommonHelper.uniqid()};var print_and_close=(options.print!=undefined)?options.print:true;win_opts.title=this.TITLE+((options.title!=undefined)?": "+options.title:"");var template=options.template||window.getApp().getTemplate("WindowPrint");win_opts.content=Mustache.render(template.replace("{{content}}",options.content),{"title":win_opts.title,"scriptId":window.getApp().getServVar("scriptId")});var winObj=new WindowForm(win_opts);var newWin=winObj.open();newWin.document.close();var win_del=setInterval(check_state,10);function check_state(){if(newWin.document.readyState=="complete"){clearInterval(win_del);newWin.focus();if(print_and_close){newWin.print();newWin.close();}}}}} 
WindowPrint.TITLE="Печать";WindowPrint.CHROME_NOTE="используйте кнопку 'Отмена' для закрытия окна предварительного просмотра.\n"; 
var WindowQuestion={RES_YES:0,RES_NO:1,RES_CANCEL:2,show:function(options){options=options||{};var self=this;var yes=(options.yes!=undefined)?options.yes:true;var no=(options.no!=undefined)?options.no:true;var cancel=(options.cancel!=undefined)?options.cancel:true;var timeout=options.timeout||0;this.m_callBack=options.callBack;this.m_modalId="quest-modal";this.m_modal=new WindowFormModalBS(this.m_modalId,{content:new Control(this.m_modalId+":cont","div",{value:options.text})});this.m_modalOpenFunc=this.m_modal.open;this.m_modalCloseFunc=this.m_modal.close;this.m_modal.open=function(){self.addEvents();self.m_modalOpenFunc.call(self.m_modal);self.m_modal.m_footer.getElement("btn-yes").getNode().focus();}
this.m_modal.close=function(res){self.delEvents();self.m_modalCloseFunc.call(self.m_modal);self.m_callBack(res);}
var btn_class=options.buttonClass||ButtonCmd;this.m_keyEvent=function(e){e=EventHelper.fixKeyEvent(e);if(self.keyPressEvent(e.keyCode,e)){e.preventDefault();return false;}};if(yes){this.m_modal.m_footer.addElement(new btn_class(this.m_modalId+":btn-yes",{"caption":this.BTN_YES_CAP,"focus":true,"attrs":{"title":this.YES_TITLE,"tabindex":0},"onClick":function(){self.m_modal.close(self.RES_YES);}}));}
if(no){this.m_modal.m_footer.addElement(new btn_class(this.m_modalId+":btn-no",{"caption":this.BTN_NO_CAP,"attrs":{"title":this.NO_TITLE,"tabindex":1},"onClick":function(){self.m_modal.close(self.RES_NO);}}));}
if(cancel){this.m_modal.m_footer.addElement(new btn_class(this.m_modalId+":btn-cancel",{"caption":this.BTN_CANCEL_CAP,"attrs":{"data-dismiss":"modal","title":this.CANCEL_TITLE,"tabindex":2},"onClick":function(){self.m_modal.close(self.RES_CANCEL);}}));}
this.m_modal.open();return this.RES_NO;},addEvents:function(){EventHelper.add(window,'keydown',this.m_keyEvent,false);},delEvents:function(){EventHelper.del(window,'keydown',this.m_keyEvent,false);},keyPressEvent:function(keyCode,event){var res=false;switch(keyCode){case 39:break;case 37:break;case 13:this.m_modal.close(this.RES_YES);res=true;break;case 27:this.m_modal.close(this.RES_CANCEL);res=true;break;}
return res;}} 
WindowQuestion.YES_TITLE="ответить утвердительно";WindowQuestion.NO_TITLE="ответить отрицательно";WindowQuestion.CANCEL_TITLE="отменить действие";WindowQuestion.BTN_YES_CAP="Да";WindowQuestion.BTN_NO_CAP="Нет";WindowQuestion.BTN_CANCEL_CAP="Отмена"; 
var WindowSearch={RES_OK:0,RES_CANCEL:2,show:function(options){options=options||{};var self=this;this.m_callBack=options.callBack;this.m_modalId="search-modal";var cur_opts;var select_opts=[];for(var i=0;i<options.columns.length;i++){var opt=new EditSelectOption(this.m_modalId+":where:"+i,{"value":options.columns[i].id,"checked":options.columns[i].current,"descr":options.columns[i].descr});opt.getSearchOptions=(function(opts){return function(){return opts;}})(options.columns[i]);select_opts.push(opt);if(options.columns[i].current){cur_opts=opt.getSearchOptions();}}
this.setSearchCtrl(cur_opts,options.text);this.m_modal=new WindowFormModalBS(this.m_modalId,{"contentHead":this.HEAD_TITLE,"content":new ControlContainer(this.m_modalId+":cont","DIV",{"elements":[this.m_searchCtrl,new EditSelect(this.m_modalId+":where",{"labelCaption":this.PAR_WHERE_CAP,"elements":select_opts,"addNotSelected":false,"events":{"change":function(){var opts=this.getOption().getSearchOptions();var how_ctrl=self.m_modal.m_body.getElement("cont").getElement("how");how_ctrl.setVisible(opts.typeChange);how_ctrl.setValue(opts.searchType);self.setSearchCtrl(opts);self.m_searchCtrl.toDOMBefore(self.m_modal.m_body.getElement("cont").getElement("where").m_container.getNode());}}}),new EditRadioGroup(this.m_modalId+":how",{"labelCaption":this.PAR_HOW_CAP,"visible":cur_opts.typeChange,"elements":[new EditRadio(this.m_modalId+":cont:on_beg",{"labelCaption":this.PAR_HOW_ON_BEG,"name":"how_opt","value":"on_beg","checked":(cur_opts.searchType=="on_beg")}),new EditRadio(this.m_modalId+":cont:on_part",{"labelCaption":this.PAR_HOW_ON_PART,"name":"how_opt","value":"on_part","checked":(cur_opts.searchType=="on_part")}),new EditRadio(this.m_modalId+":cont:on_match",{"labelCaption":this.PAR_HOW_ON_MATCH,"name":"how_opt","value":"on_match","checked":(cur_opts.searchType=="on_match")})]})]}),"controlOk":new ButtonCmd(this.m_modalId+":btn-ok",{"caption":this.BTN_FIND_CAP,"title":this.BTN_FIND_TITLE,"onClick":function(){self.m_modal.close(self.RES_OK);}}),"cmdCancel":true});this.m_modalOpenFunc=this.m_modal.open;this.m_modalCloseFunc=this.m_modal.close;this.m_modal.open=function(){self.addEvents();self.m_modalOpenFunc.call(self.m_modal);self.m_modal.m_footer.getElement("btn-ok").getNode().focus();}
this.m_modal.close=function(res){var res_struc;if(res==self.RES_OK){var cont=self.m_modal.m_body.getElement("cont");var ctrl=self.m_searchCtrl;var search_descr;if(ctrl.getIsRef&&ctrl.getIsRef()&&!(ctrl.searchField.getDataType()==Field.prototype.DT_JSON||ctrl.searchField.getDataType()==Field.prototype.DT_JSONB)){var keyIds=ctrl.getKeyIds();var ctrl_keys=ctrl.getKeys();if(keyIds.length>=1&&ctrl_keys&&ctrl_keys[keyIds[0]]){ctrl.searchField.setValue(ctrl_keys[keyIds[0]]);}
search_descr=ctrl.getValue().getDescr();}
else{var val=ctrl.getValue();search_descr=val;if(ctrl.setValid)ctrl.setValid();try{if(ctrl.getValidator&&ctrl.getValidator())ctrl.getValidator().validate(val);ctrl.searchField.setValue(val);}
catch(e){if(ctrl.setNotValid)ctrl.setNotValid(e.message);return;}}
res_struc={"search_str":ctrl.searchField.getValueXHR(),"where":ctrl.searchField.getId(),"how":cont.elementExists("how")?cont.getElement("how").getValue():"match","descr":cont.getElement("where").getOption().getDescr(),"search_descr":search_descr}}
self.delEvents();self.m_callBack(res,res_struc);self.m_modalCloseFunc.call(self.m_modal);}
var btn_class=options.buttonClass||ButtonCmd;this.m_keyEvent=function(e){e=EventHelper.fixKeyEvent(e);if(self.keyPressEvent(e.keyCode,e)){e.preventDefault();return false;}};this.m_modal.open();return this.RES_NO;},addEvents:function(){EventHelper.add(window,'keydown',this.m_keyEvent,false);},delEvents:function(){EventHelper.del(window,'keydown',this.m_keyEvent,false);},keyPressEvent:function(keyCode,event){var res=false;switch(keyCode){case 13:this.m_modal.close(this.RES_OK);res=true;break;case 27:this.m_modal.close(this.RES_CANCEL);res=true;break;}
return res;},setSearchCtrl:function(opts,ctrlValue){if(this.m_searchCtrl){this.m_searchCtrl.delDOM();delete this.m_searchCtrl;}
var ctrl_opts={"labelCaption":this.STR_CAP,"placeholder":this.STR_PLACEHOLDER,"title":this.STR_TITLE,"maxlength":"500","value":ctrlValue,"focus":true};this.m_searchCtrl=new opts.ctrlClass(this.m_modalId+":cont:search_ctrl",ctrl_opts);this.m_searchCtrl.searchField=opts.field;}} 
WindowSearch.HEAD_TITLE="Поиск по колонке";WindowSearch.STR_CAP="Что искать:";WindowSearch.STR_PLACEHOLDER="Строка поиска";WindowSearch.STR_TITLE="Поиск будет выполнен по данной строке в соответствии с выбранными параметрами";WindowSearch.PAR_WHERE_CAP="Где искать:";WindowSearch.PAR_HOW_CAP="Как искать:";WindowSearch.PAR_HOW_ON_BEG="По началу строки";WindowSearch.PAR_HOW_ON_PART="По части строки";WindowSearch.PAR_HOW_ON_MATCH="По точному совпадению";WindowSearch.BTN_FIND_CAP="Найти";WindowSearch.BTN_FIND_TITLE="Выполнить поиск"; 
function WindowForm(options){options=options||{};this.m_id=options.id||CommonHelper.uniqid();options.height=options.height||this.DEF_HEIGHT;options.width=options.width||this.DEF_WIDTH;options.fullScreen=options.fullScreen||this.DEF_FULL_SCREEN;if(options.fullScreen){options.width=DOMHelper.getViewportWidth();options.height=DOMHelper.getViewportHeight();}
this.setFullScreen(options.fullScreen);this.setDirectories(options.directories||this.DEF_DIRECTORIES);this.setChannelMode(options.channelMode||this.DEF_CHANNEL_MODE);this.setHeight(options.height);if(options.center){this.m_center=true;this.setCenter(options.height||this.DEF_HEIGHT,options.width||this.DEF_WIDTH);}
else{if(options.centerLeft){this.setLeftCenter(options.width||this.DEF_WIDTH);}
else{this.setLeft(options.left||this.DEF_LEFT);}
if(options.centerTop){this.setTopCenter(options.height||this.DEF_HEIGHT);}
else{this.setTop(options.top||this.DEF_TOP);}}
this.setLocation((options.location!=undefined)?options.location:this.DEF_LOCATION);this.setMenuBar((options.menuBar!=undefined)?options.menuBar:this.DEF_MENU_BAR);this.setResizable((options.resizable!=undefined)?options.resizable:this.DEF_RESIZABLE);this.setScrollBars((options.scrollBars!=undefined)?options.scrollBars:this.DEF_SCROLL_BARS);this.setStatus((options.status!=undefined)?options.status:this.DEF_STATUS);this.setTitleBar((options.titleBar!=undefined)?options.titleBar:this.DEF_TITLE_BAR);this.setWidth(options.width);this.setName(options.name||this.DEF_WIN_NAME);this.setHost(options.host||"");this.setScript(options.script||(options.content==undefined)?this.DEF_SCRIPT:undefined);this.setURLParams(options.URLParams||"");this.setCaption(options.caption||options.title||"");this.m_content=options.content;this.setOnClose(options.onClose);this.setParams(options.params);}
WindowForm.prototype.DEF_DIRECTORIES="0";WindowForm.prototype.DEF_CHANNEL_MODE="0";WindowForm.prototype.DEF_FULL_SCREEN=0;WindowForm.prototype.DEF_HEIGHT="500";WindowForm.prototype.DEF_LEFT="0";WindowForm.prototype.DEF_LOCATION="0";WindowForm.prototype.DEF_MENU_BAR=0;WindowForm.prototype.DEF_RESIZABLE="1";WindowForm.prototype.DEF_SCROLL_BARS="1";WindowForm.prototype.DEF_STATUS="0";WindowForm.prototype.DEF_TITLE_BAR="0";WindowForm.prototype.DEF_TOP="0";WindowForm.prototype.DEF_WIDTH="600";WindowForm.prototype.DEF_WIN_NAME="_blank";WindowForm.prototype.DEF_SCRIPT="";WindowForm.prototype.DEF_CENTER_TOP_OFFSET="20";WindowForm.prototype.LEFT_STEP=50;WindowForm.prototype.LEFT_MAX=500;WindowForm.prototype.TOP_STEP=50;WindowForm.prototype.TOP_MAX=500;WindowForm.prototype.m_directories;WindowForm.prototype.m_channelMode;WindowForm.prototype.m_fullScreen;WindowForm.prototype.m_height;WindowForm.prototype.m_left;WindowForm.prototype.m_location;WindowForm.prototype.m_menuBar;WindowForm.prototype.m_resizable;WindowForm.prototype.m_scrollBars;WindowForm.prototype.m_status;WindowForm.prototype.m_titleBar;WindowForm.prototype.m_top;WindowForm.prototype.m_width;WindowForm.prototype.m_name;WindowForm.prototype.m_host;WindowForm.prototype.m_script;WindowForm.prototype.m_URLParams;WindowForm.prototype.m_WindowForm;WindowForm.prototype.m_onClose;WindowForm.prototype.m_params;WindowForm.prototype.open=function(){var win_opts="directories="+this.m_directories+","+"channelMode="+this.m_channelMode+","+"fullScreen="+this.m_fullScreen+","+"height="+this.m_height+","+"left="+this.m_left+","+"location="+this.m_location+","+"menubar="+this.m_menuBar+","+"resizable="+this.m_resizable+","+"scrollbars="+this.m_scrollBars+","+"status="+this.m_status+","+"titlebar="+this.m_titleBar+","+"top="+this.m_top+","+"width="+this.m_width;var url=this.getURL();if(CommonHelper.isIE()&&CommonHelper.getIEVersion()<=9){this.m_WindowForm=window.open("","",(this.m_name=="_blank")?"":win_opts);if(this.m_WindowForm)this.m_WindowForm.location=url;}
else{this.m_WindowForm=window.open(url,this.m_name,(this.m_name=="_blank")?"":win_opts);}
window.getApp().m_openedWindows[this.m_name]=this.m_WindowForm;if(!this.m_WindowForm){throw new Error(this.ER_OPEN);}
if(url==""&&this.m_content){if(typeof this.m_content=="object"){this.m_content.toDOM(this.m_WindowForm.document);}
else{this.m_WindowForm.document.write(this.m_content);}}
this.initForm();return this.m_WindowForm;}
WindowForm.prototype.initForm=function(){var self=this;this.m_WindowForm["onClose"]=function(res){if(self.m_onClose){self.m_onClose.call(self,self.m_WindowForm.closeResult);self.m_WindowForm.onClose=undefined;}}
this.m_WindowForm["getParam"]=function(id){return self.getParam(id);}
this.m_WindowForm["getApp"]=function(){return window.getApp();}
window["paramsSet"]=true;window["getChildParam"]=this.m_WindowForm["getParam"];}
WindowForm.prototype.close=function(){window.getApp().m_openedWindows[this.m_name]=undefined;if(this.m_WindowForm){this.m_WindowForm.close();}}
WindowForm.prototype.setDirectories=function(directories){this.m_directories=directories;}
WindowForm.prototype.setChannelMode=function(channelMode){this.m_channelMode=channelMode;}
WindowForm.prototype.setFullScreen=function(fullScreen){this.m_fullScreen=fullScreen;}
WindowForm.prototype.setHeight=function(height){if(height){this.m_height=height;}}
WindowForm.prototype.setLeft=function(left){this.m_left=left;}
WindowForm.prototype.setLocation=function(location){this.m_location=location;}
WindowForm.prototype.setMenuBar=function(menuBar){this.m_menuBar=menuBar;}
WindowForm.prototype.setResizable=function(resizable){this.m_resizable=resizable;}
WindowForm.prototype.setScrollBars=function(scrollBars){this.m_scrollBars=scrollBars;}
WindowForm.prototype.setStatus=function(status){this.m_status=status;}
WindowForm.prototype.setTitleBar=function(titleBar){this.m_titleBar=titleBar;}
WindowForm.prototype.setTop=function(top){if(top){this.m_top=top;}}
WindowForm.prototype.setWidth=function(width){if(width){this.m_width=width;}}
WindowForm.prototype.setSize=function(w,h){this.m_w=width;this.m_h=h;}
WindowForm.prototype.setName=function(name){this.m_name=name;}
WindowForm.prototype.getScript=function(){return this.m_script;}
WindowForm.prototype.setScript=function(script){this.m_script=script;}
WindowForm.prototype.getHost=function(){var host=this.m_host||"";if(host&&host.length&&host.substring(host.length-1,host.length)!="/"){host+="/";}
return host;}
WindowForm.prototype.setHost=function(host){this.m_host=host;}
WindowForm.prototype.getURL=function(){var s=this.getScript();var p=this.getURLParams();if(!s&&!p){return"";}
var h=this.getHost();if(p){p="?"+p;}
else{p="";}
return(h+s+p);}
WindowForm.prototype.setURLParams=function(URLParams){this.m_URLParams=URLParams;}
WindowForm.prototype.getURLParams=function(){return this.m_URLParams;}
WindowForm.prototype.setLeftCenter=function(width){var l=Math.floor(DOMHelper.getViewportWidth()/2)-Math.floor(width/2);this.setLeft(l);}
WindowForm.prototype.setTopCenter=function(height){var t=Math.floor(DOMHelper.getViewportHeight()/2)-Math.floor(height/2);this.setTop(t+this.DEF_CENTER_TOP_OFFSET);}
WindowForm.prototype.setCenter=function(height,width){this.setLeftCenter(width);this.setTopCenter(height);}
WindowForm.prototype.getWindowForm=function(){return this.m_WindowForm;}
WindowForm.prototype.getContentParent=function(){return this.m_WindowForm.document.body;}
WindowForm.prototype.setFocus=function(){return this.m_WindowForm.focus();}
WindowForm.prototype.setTitle=function(title){this.m_title=title;}
WindowForm.prototype.setCaption=function(caption){this.setTitle(caption);}
WindowForm.prototype.setOnClose=function(f){this.m_onClose=f;}
WindowForm.prototype.setParams=function(params){this.m_params=params||{};}
WindowForm.prototype.setParam=function(id,val){this.m_params[id]=val;}
WindowForm.prototype.getParam=function(id){return this.m_params[id];}
WindowForm.prototype.getId=function(){return this.m_id;} 
WindowForm.prototype.ER_OPEN="Ошибка открытия окна"; 
function WindowFormObject(options){options=options||{};options.host=options.host||window.getApp().getHost();options.script=options.script||window.getApp().getScript();options.URLParams=options.URLParams||"";if(options.formName){options.template=options.template||options.formName;}
options.view=options.view||"Child";options.keys=options.keys||{"id":null};if(options.fullScreen==undefined&&options.width==undefined&&options.height==undefined){options.fullScreen=true;}
options.name=options.name||options.formName;this.setController(options.controller);this.setMethod(options.method);this.setTemplate(options.template);this.setView(options.view);this.setKeys(options.keys);this.setMode((options.params&&options.params.cmd)?options.params.cmd:null);WindowFormObject.superclass.constructor.call(this,options);}
extend(WindowFormObject,WindowForm);WindowFormObject.prototype.m_controller;WindowFormObject.prototype.m_method;WindowFormObject.prototype.m_template;WindowFormObject.prototype.m_view;WindowFormObject.prototype.m_keys;WindowFormObject.prototype.m_keyIds;WindowFormObject.prototype.m_mode;WindowFormObject.prototype.getURLParams=function(){var str=this.m_controller?("c="+this.m_controller):"";if(this.m_method)str+="&f="+this.m_method;if(this.m_template)str+="&t="+this.m_template;if(this.m_mode)str+="&mode="+this.m_mode;str+=((str=="")?"":"&")+"v="+this.m_view;for(var fid in this.m_keys){if(this.m_keys[fid]!=undefined){str+="&"+fid+"="+this.m_keys[fid];}}
if(this.m_URLParams){str+="&"+this.m_URLParams;}
var conn=window.getApp().getServConnector();if(conn.getAccessTokenParam){str+="&"+conn.getAccessTokenParam()+"="+conn.getAccessToken();}
return str;}
WindowFormObject.prototype.setKeys=function(v){this.m_keyIds=[];for(var keyid in v){this.m_keyIds.push(keyid);}
this.m_keys=v}
WindowFormObject.prototype.getKeys=function(){return this.m_keys;}
WindowFormObject.prototype.getKeyIds=function(){return this.m_keyIds;}
WindowFormObject.prototype.setController=function(v){this.m_controller=v}
WindowFormObject.prototype.getController=function(){return this.m_controller;}
WindowFormObject.prototype.setMethod=function(v){this.m_method=v}
WindowFormObject.prototype.getMethod=function(){return this.m_method;}
WindowFormObject.prototype.setView=function(v){this.m_view=v}
WindowFormObject.prototype.getView=function(){return this.m_view;}
WindowFormObject.prototype.setTemplate=function(v){this.m_template=v}
WindowFormObject.prototype.getTemplate=function(){return this.m_template;}
WindowFormObject.prototype.setMode=function(v){this.m_mode=v}
WindowFormObject.prototype.getMode=function(){return this.m_mode;} 
WindowFormObject.prototype.ER_NO_CONTROLLER="Не задан котроллер.";WindowFormObject.prototype.ER_NO_METHOD="Не задан метод."; 
function WindowFormModalBS(id,options){if(typeof(id)=="object"){options=CommonHelper.clone(id);id=options.id?options.id:CommonHelper.uniqid();}
options=options||{};var self=this;options.className=options.className||"modal";options.attrs=options.attrs||{};options.attrs.role="dialog";WindowFormModalBS.superclass.constructor.call(this,id,"DIV",options);var dialog_options=options.dialogOptions||{};CommonHelper.merge(dialog_options,{"className":"modal-dialog"});dialog_options.attrs=dialog_options.attrs||{};if(options.dialogWidth&&!dialog_options.attrs.style){dialog_options.attrs.style="";dialog_options.attrs.style="width:"+options.dialogWidth+";";}
this.m_dialog=new ControlContainer(id+"_dial","DIV",dialog_options);this.m_content=new ControlContainer(id+"_cont","DIV",{"className":"modal-content"});this.m_header=new ControlContainer(id+"_head","DIV",{className:(options.headerClassName||"modal-header")});if(options.cmdCancel||options.controlCancel||options.onClickCancel||options.cmdClose){this.m_header.addElement(new Control(null,"button",{"attrs":{"type":"button","class":"close","aria-hidden":"true"},"value":"×","events":{"click":options.onClickCancel||function(){self.close();}}}));}
if(options.contentHead){if(typeof(options.contentHead)=="object"){this.m_header.addElement(options.contentHead);}
else{this.m_header.addElement(new Control(id+":head:label","h4",{"className":"modal-title","value":options.contentHead}));}}
this.m_body=new ControlContainer(id+":body","DIV",{className:"modal-body"});if(options.content){this.m_body.addElement(options.content);}
this.m_footer=new ControlContainer(id+":footer","DIV",{className:"modal-footer"});if(options.contentFoot){this.m_footer.addElement(options.contentFoot);}
if(options.cmdOk||options.controlOk||options.onClickOk){this.m_footer.addElement(options.controlOk||new ButtonCmd(id+":btn-ok",{"caption":options.controlOkCaption||this.BTN_OK_CAP,"title":options.controlOkTitle||this.BTN_OK_TITLE,"onClick":options.onClickOk}));}
if(options.cmdCancel||options.controlCancel||options.onClickCancel){this.m_footer.addElement(options.controlCancel||new ButtonCmd(id+":btn-cancel",{"caption":options.controlCancelCaption||this.BTN_CANCEL_CAP,"title":options.controlCancelTitle||this.BTN_CANCEL_TITLE,"onClick":options.onClickCancel||function(){self.close();}}));}
this.m_content.addElement(this.m_header);this.m_content.addElement(this.m_body);this.m_content.addElement(this.m_footer);this.m_dialog.addElement(this.m_content);this.m_closeOnMouseClick=(options.closeOnMouseClick!=undefined)?options.closeOnMouseClick:false;}
extend(WindowFormModalBS,ControlContainer);WindowFormModalBS.prototype.m_header;WindowFormModalBS.prototype.m_body;WindowFormModalBS.prototype.m_foot;WindowFormModalBS.prototype.toDOM=function(parent){WindowFormModalBS.superclass.toDOM.call(this,parent);var self=this;this.m_dialog.toDOM(this.getNode());$(this.getNode()).on('shown.bs.modal',function(){$('[autofocus]',this).focus();});$(this.getNode()).on('hidden.bs.modal',function(){if(self.m_dialog)self.m_dialog.delDOM();});var m_opts={show:true,keyboard:true}
if(!this.m_closeOnMouseClick){m_opts.backdrop="static";}
$(this.getNode()).modal(m_opts);}
WindowFormModalBS.prototype.delDOM=function(){$(this.getNode()).modal("hide");if(this.m_dialog)this.m_dialog.delDOM();WindowFormModalBS.superclass.delDOM.call(this);}
WindowFormModalBS.prototype.open=function(){this.toDOM(document.body);}
WindowFormModalBS.prototype.close=function(){this.delDOM();}
WindowFormModalBS.prototype.getContentParent=function(){return this.m_body.getNode();}
WindowFormModalBS.prototype.setCaption=function(caption){}
WindowFormModalBS.prototype.setFocus=function(){} 
WindowFormModalBS.prototype.BTN_OK_CAP="OK";WindowFormModalBS.prototype.BTN_OK_TITLE="Записать и закрыть форму";WindowFormModalBS.prototype.BTN_CANCEL_CAP="Закрыть";WindowFormModalBS.prototype.BTN_CANCEL_TITLE="Закрыть форму"; 
function WindowMessage(options){options=options||{};this.m_messages=[];this.m_window=null;this.m_model=null;this.m_flashTime=options.flashTime||this.FLASH_TIME;}
WindowMessage.prototype.ID="windowMessage";WindowMessage.prototype.FLASH_TIME=1000;WindowMessage.prototype.BS_COL=2;WindowMessage.prototype.TP_ER="danger";WindowMessage.prototype.TP_WARN="warning";WindowMessage.prototype.TP_INFO="info";WindowMessage.prototype.TP_OK="success";WindowMessage.prototype.m_messages;WindowMessage.prototype.m_window;WindowMessage.prototype.m_model;WindowMessage.prototype.show=function(options){options=options||{};var mes_id=CommonHelper.uniqid();options.type=options.type||this.TP_INFO;if(!this.m_messages.length||(!this.m_messages[this.m_messages.length-1]||!this.m_messages[this.m_messages.length-1].content||!this.m_messages[this.m_messages.length-1].content.trim||!options.text||!options.text.trim||this.m_messages[this.m_messages.length-1].content.trim()!=options.text.trim()||this.m_messages[this.m_messages.length-1].message_type!=options.message_type)){this.m_messages.push({id:mes_id,date_time:DateHelper.time(),subject:null,content:options.text,user_descr:null,message_type:options.type,importance_level:null,require_view:null});}
this.toDOM();if(options.callBack){options.callBack();}
return mes_id;};WindowMessage.prototype.toDOM=function(){var self=this;var mw_st=window.getApp().getWinMessageStyle();var mw_overlap=(mw_st.win_position=="overlap");var mw_class="",win_style="";if(window.getWidthType()!="sm"){mw_class=(mw_overlap?"windowMessageOverlap":"windowMessageStick");win_style="left:"+(100-mw_st.win_width)+"%;width:"+mw_st.win_width+"%;";}
else{mw_class="windowMessageMobile";}
var mw_col;if(!mw_overlap){mw_col=this.getMessageWindowCol(mw_st);mw_class+=(mw_class=="")?"":" ";mw_class+=window.getBsCol(mw_col);}
if(!this.m_window){var n=DOMHelper.getElementsByAttr("windowMessage",window.body,"class",true);if(!n.length){throw Error("Message window not found!");}
if(!n[0].id){n[0].id=CommonHelper.uniqid();}
this.m_window=new ControlContainer(n[0].id,"DIV",{"className":"panel panel-default windowMessage"+((mw_class!="")?" "+mw_class:""),"attrs":mw_overlap?{"style":win_style}:null});var head=new ControlContainer(this.ID+":head","DIV",{});var head_cont=new ControlContainer(this.ID+":head-cont","DIV");head_cont.addElement(new ButtonCtrl(this.ID+":close",{"title":"закрыть","glyph":"glyphicon-remove","onClick":function(){self.m_messages=[];self.delDOM();}}));head.addElement(head_cont);this.m_content=new ControlContainer(this.ID+":content","DIV");var body=new ControlContainer(this.ID+":body","DIV",{});body.addElement(this.m_content);this.m_window.addElement(head);this.m_window.addElement(body);}
else if(mw_overlap){this.m_window.getNode().style=win_style;}
this.m_window.setVisible(true);if(!mw_overlap){this.setWinDataClass(mw_col);}
this.m_content.delDOM();this.m_content.clear();var t=0;for(var i=this.m_messages.length-1;i>=0;i--){var item_class="message-item alert alert-"+this.m_messages[i].message_type;item_class+=(i==this.m_messages.length-1)?" flashit":"";var cont=new ControlContainer(this.m_messages[i].id,"P",{"className":item_class});if(i==this.m_messages.length-1){this.m_flashCont=cont;try{setTimeout(function(){DOMHelper.delClass(self.m_flashCont.getNode(),"flashit");},this.m_flashTime);}
catch(e){}}
cont.addElement(new Control(this.m_messages[i].id+":head","DIV",{"value":DateHelper.format(this.m_messages[i].date_time,"H:i:s")}));cont.addElement(new ControlContainer(this.m_messages[i].id+":title","DIV",(typeof(this.m_messages[i].content)=="string")?{"value":this.m_messages[i].content}:this.m_messages[i].content));this.m_content.addElement(cont);t++;}
this.m_window.setClassName("panel panel-default windowMessage "+mw_class);this.m_window.toDOM();};WindowMessage.prototype.getMessageWindowCol=function(mesWindStyle){var col=parseInt(mesWindStyle.win_width,10);if(!col){col=1;}
return Math.ceil(col*12/100);}
WindowMessage.prototype.setWinDataClass=function(mwCol){var dwin=document.getElementById("windowData");if(dwin){DOMHelper.setAttr(dwin,"class",window.getBsCol(12-mwCol));}}
WindowMessage.prototype.delDOM=function(){if(this.m_window){this.m_window.setVisible(false);var mw_st=window.getApp().getWinMessageStyle();if(mw_st.win_position=="stick"){this.setWinDataClass(0);}}} 
function WindowTempMessage(options){options=options||{}
this.m_messages=[];this.m_flashTime=options.flashTime||this.FLASH_TIME;this.m_timeout=options.timeout||this.TIMEOUT;this.m_margin=options.margin||this.MARGIN;this.m_width=options.width||this.WIDTH;this.m_interval=options.interval||this.INTERVAL;}
WindowTempMessage.prototype.TP_ER="danger";WindowTempMessage.prototype.TP_WARN="warning";WindowTempMessage.prototype.TP_INFO="info";WindowTempMessage.prototype.TP_OK="success";WindowTempMessage.prototype.FLASH_TIME=1000;WindowTempMessage.prototype.TIMEOUT=1000*10;WindowTempMessage.prototype.MARGIN="50";WindowTempMessage.prototype.WIDTH="300px";WindowTempMessage.prototype.INTERVAL="10";WindowTempMessage.prototype.show=function(options){options=options||{};options.type=options.type||this.TP_INFO;var item_class="hidden message-item alert flashit alert-"+options.type;var mes_id;var self=this;var last_top,last_left,deleted_top,deleted_left,last_height,last_width;for(id in this.m_messages){if(this.m_messages[id]){last_top=this.m_messages[id].top;last_left=this.m_messages[id].left;last_height=this.m_messages[id].height;last_width=this.m_messages[id].width;}
else if(!mes_id){mes_id=this.m_messages[id].control.getId();deleted_top=this.m_messages[id].top;deleted_left=this.m_messages[id].left;}}
mes_id=mes_id?mes_id:CommonHelper.uniqid();this.m_messages[mes_id]={"callBack":options.callBack};this.m_messages[mes_id].control=new ControlContainer(mes_id,"DIV",{"className":item_class,"attrs":{"style":"position:fixed;display:block;z-index:9999;width:"+(options.width||this.m_width)},"elements":[new Control(mes_id+":head","DIV",{"attrs":{"type":"button","class":"close","aria-hidden":"true","messageid":mes_id},"value":"×","events":{"click":options.onClickCancel||function(e){self.close(e.target.getAttribute("messageid"));}}}),new ControlContainer(mes_id+":title","DIV",(typeof(options.content)=="string")?{"value":options.content}:options.content)]});this.m_messages[mes_id].control.toDOM(document.body);var n=this.m_messages[mes_id].control.getNode();var top,left;if(!last_top){left=document.documentElement.clientWidth-n.offsetWidth-(options.margin||this.m_margin);top=document.documentElement.clientHeight-n.offsetHeight-(options.margin||this.m_margin);}
else{var top=last_top-this.m_interval-last_height;var left=last_left;if(top<document.documentElement.clientHeight/2){top=document.documentElement.clientHeight-n.offsetHeight-(options.margin||this.m_margin);left=last_left-this.m_interval-last_width;if(!left){top=deleted_top;left=deleted_left;}}}
n.style.top=top+"px";n.style.left=left+"px";this.m_messages[mes_id].top=top;this.m_messages[mes_id].height=n.offsetHeight;this.m_messages[mes_id].left=left;this.m_messages[mes_id].width=n.offsetWidth;try{this.m_messages[mes_id].flashTmerId=setTimeout(function(mesId){self.stopFlash(mesId);},(options.flashTime||this.m_flashTime),mes_id);this.m_messages[mes_id].timerId=setTimeout(function(mesId){self.close(mesId);},(options.timeout||this.m_timeout),mes_id);}
catch(e){}
DOMHelper.show(n);}
WindowTempMessage.prototype.stopFlash=function(mesId){if(this.m_messages[mesId]){DOMHelper.delClass(this.m_messages[mesId].control.getNode(),"flashit");}}
WindowTempMessage.prototype.close=function(mesId){if(this.m_messages[mesId]){if(this.m_messages[mesId].flashTmerId)clearTimeout(this.m_messages[mesId].flashTmerId);if(this.m_messages[mesId].timerId)clearTimeout(this.m_messages[mesId].timerId);if(this.m_messages[mesId].control){var self=this;$(this.m_messages[mesId].control.getNode()).fadeOut("slow",function(){self.deleteObj(mesId);});}}}
WindowTempMessage.prototype.deleteObj=function(mesId){if(this.m_messages&&this.m_messages[mesId]){if(this.m_messages[mesId].control){this.m_messages[mesId].control.delDOM();delete this.m_messages[mesId].control;}
if(this.m_messages[mesId].callBack)this.m_messages[mesId].callBack();delete this.m_messages[mesId];}} 
function GridCellHeadDOCProcessed(id,options){options=options||{};options.value=" ",options.className=window.getBsCol(1),options.columns=[new GridColumn("processed",{"field":options.model.getField("processed"),"assocClassList":{"true":"glyphicon glyphicon-check","false":"glyphicon glyphicon-unchecked"}})];GridCellHeadDOCProcessed.superclass.constructor.call(this,id,options);}
extend(GridCellHeadDOCProcessed,GridCellHead); 
function GridCellHeadDOCDate(id,options){options=options||{};options.value="Дата",options.sortable=true;options.sort="asc";options.columns=[new GridColumnDate({"field":options.model.getField("date_time"),"dateFormat":window.getApp().getJournalDateFormat(),"searchOptions":{"field":new FieldDate("date_time"),"searchType":"on_beg"}})];GridCellHeadDOCDate.superclass.constructor.call(this,id,options);}
extend(GridCellHeadDOCDate,GridCellHead); 
function GridCellHeadDOCNumber(id,options){options=options||{};options.value="Номер",options.sortable=true;options.columns=[new GridColumn({"field":options.model.getField("number")})];GridCellHeadDOCNumber.superclass.constructor.call(this,id,options);}
extend(GridCellHeadDOCNumber,GridCellHead); 
function stopEvent(evt){evt||window.event;if(evt.stopPropagation){evt.stopPropagation();evt.preventDefault();}else if(typeof evt.cancelBubble!="undefined"){evt.cancelBubble=true;evt.returnValue=false;}
return false;}
function getElement(evt){if(window.event){return window.event.srcElement;}else{return evt.currentTarget;}}
function stopSelect(obj){if(typeof obj.onselectstart!='undefined'){EventHelper.add(obj,"selectstart",function(){return false;});}}
function getCaretEnd(obj,winDocum){if(typeof obj.selectionEnd!="undefined"){return obj.selectionEnd;}else if(winDocum.selection&&winDocum.selection.createRange){var M=winDocum.selection.createRange();try{var Lp=M.duplicate();Lp.moveToElementText(obj);}catch(e){var Lp=obj.createTextRange();}
Lp.setEndPoint("EndToEnd",M);var rb=Lp.text.length;if(rb>obj.value.length){return-1;}
return rb;}}
function getCaretStart(obj,winDocum){if(typeof obj.selectionStart!="undefined"){return obj.selectionStart;}else if(winDocum.selection&&winDocum.selection.createRange){var M=winDocum.selection.createRange();try{var Lp=M.duplicate();Lp.moveToElementText(obj);}catch(e){var Lp=obj.createTextRange();}
Lp.setEndPoint("EndToStart",M);var rb=Lp.text.length;if(rb>obj.value.length){return-1;}
return rb;}}
function setCaret(obj,l){obj.focus();if(obj.setSelectionRange){obj.setSelectionRange(l,l);}else if(obj.createTextRange){m=obj.createTextRange();m.moveStart('character',l);m.collapse();m.select();}}
function setSelection(obj,s,e){obj.focus();if(obj.setSelectionRange){obj.setSelectionRange(s,e);}else if(obj.createTextRange){m=obj.createTextRange();m.moveStart('character',s);m.moveEnd('character',e);m.select();}}
String.prototype.addslashes=function(){return this.replace(/(["\\\.\|\[\]\^\*\+\?\$\(\)])/g,'\\$1');}
String.prototype.trim=function(){return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/,"$1");};function replaceHTML(obj,text,winDocum){while(el=obj.childNodes[0]){obj.removeChild(el);};obj.appendChild(winDocum.createTextNode(text));}
function actbAJX(options){options=options||{};this.setMinLengthForQuery((options.minLengthForQuery!=undefined)?options.minLengthForQuery:this.MIN_LEN_FOR_QUERY);this.setOnSelect(options.onSelect);this.setPatternFieldId(options.patternFieldId||this.DEF_PATTERN_FIELD);this.setPublicMethod(options.publicMethod);this.setModel(options.model);this.setControl(options.control);this.setKeyFields(options.keyFields);this.setDescrFields(options.descrFields);this.setDescrFunction(options.descrFunction);this.setIc(options.icase||this.DEF_IC);this.setMid(options.mid||this.DEF_MID);this.m_resultFieldIdsToAttr=options.resultFieldIdsToAttr;this.m_onCompleteTextOut=options.onCompleteTextOut;this.m_servQueryTimeout=options.servQueryTimeout||this.DEF_SERV_QUERY_TIMEOUT;this.setEnabled((options.enabled!=undefined)?options.enabled:true);}
actbAJX.prototype.DEF_PATTERN_FIELD="pattern";actbAJX.prototype.MIN_LEN_FOR_QUERY=4;actbAJX.prototype.DEF_SERV_QUERY_TIMEOUT=2000;actbAJX.prototype.DEF_IC="1";actbAJX.prototype.DEF_MID="0";actbAJX.prototype.m_minLengthForQuery;actbAJX.prototype.m_ic;actbAJX.prototype.m_mid;actbAJX.prototype.m_patternFieldId;actbAJX.prototype.m_publicMethod;actbAJX.prototype.m_model;actbAJX.prototype.m_control;actbAJX.prototype.m_queryActive;actbAJX.prototype.m_servQueryTimeout;actbAJX.prototype.m_keyFields;actbAJX.prototype.m_descrFields;actbAJX.prototype.m_descrFunction;actbAJX.prototype.fillArrayOnPattern=function(inputNode){if(!this.getEnabled()||(this.m_queryActive&&((new Date).getTime()-this.m_queryActiveTime)<this.m_servQueryTimeout)){return;}
var currValue=inputNode.value;if(this.m_control.resetKeys){this.m_control.resetKeys();}
this.m_keywords=[];this.m_keywordKeys=[];if(this.m_resultFieldIdsToAttr){this.m_resultFieldsToAttr=[];}
if(currValue.length<this.getMinLengthForQuery()){this.onFillArrayEnd();return;}
var pm=this.getPublicMethod();var contr=pm.getController();pm.setFieldValue(this.getPatternFieldId(),inputNode.value);pm.setFieldValue(contr.PARAM_IC,this.getIc());pm.setFieldValue(contr.PARAM_MID,this.getMid());this.m_queryActive=true;this.m_queryActiveTime=(new Date).getTime();var self=this;pm.run({"async":"true","ok":function(resp){self.onGetData(resp);},"fail":function(resp,errCode,errStr){window.showError(window.getApp().formatError(errCode,errStr));},"all":function(){self.m_queryActive=false;}});}
actbAJX.prototype.onGetData=function(resp){if(resp.modelExists(this.m_model.getId())){this.m_model.setData(resp.getModelData(this.m_model.getId()));}
else{this.m_control.getErrorControl(CommonHelper.format(this.ER_NO_MODEL,Array(this.m_model.getId())));return;}
var ctrl_key_ids;if(this.m_control.getKeyIds){ctrl_key_ids=this.m_control.getKeyIds();}
while(this.m_model.getNextRow()){var res_val="";var key_attrs;if(this.m_resultFieldIdsToAttr){key_attrs=[];}
if(this.m_descrFunction){res_val=this.m_descrFunction.call(this,this.m_model.getFields());}
else{for(var fid in this.m_descrFields){res_val+=(res_val)?" ":"";var f_val=this.m_descrFields[fid].getValue();if(typeof f_val=="object"&&f_val.getDescr){res_val+=f_val.getDescr();}
else if(!this.m_descrFields[fid].isNull()&&this.m_descrFields[fid].isSet()){res_val+=f_val;}}}
var keys={};for(var fn=0;fn<this.m_keyFields.length;fn++){if(ctrl_key_ids)
keys[ctrl_key_ids[fn]]=this.m_keyFields[fn].getValue();}
if(this.m_resultFieldIdsToAttr){for(var rfi=0;rfi<this.m_resultFieldIdsToAttr.length;rfi++){key_attrs.push({"attr":this.m_resultFieldIdsToAttr[rfi],"val":this.m_model.getFieldValue(this.m_resultFieldIdsToAttr[rfi])});}}
this.m_keywordKeys.push(keys);this.m_keywords.push(res_val);if(this.m_resultFieldIdsToAttr){this.m_resultFieldsToAttr.push(key_attrs);}}
this.onFillArrayEnd();}
actbAJX.prototype.onSelected=function(wordPos){if(this.m_control&&this.m_control.getIsRef())
this.m_control.setKeys(this.m_keywordKeys[wordPos]);if(this.m_onSelect){this.m_model.getRow(wordPos);this.m_control.onSelectValue(this.m_model.getFields());}}
actbAJX.prototype.getMinLengthForQuery=function(){return this.m_minLengthForQuery;}
actbAJX.prototype.setMinLengthForQuery=function(v){this.m_minLengthForQuery=v;}
actbAJX.prototype.getIc=function(){return this.m_ic;}
actbAJX.prototype.setIc=function(v){this.m_ic=v;}
actbAJX.prototype.getMid=function(){return this.m_mid;}
actbAJX.prototype.setMid=function(v){this.m_mid=v;}
actbAJX.prototype.getEnabled=function(){return this.m_enabled;}
actbAJX.prototype.setEnabled=function(v){this.m_enabled=v;}
actbAJX.prototype.setOnSelect=function(v){this.m_onSelect=v;}
actbAJX.prototype.getOnSelect=function(){return this.m_onSelect;}
actbAJX.prototype.setPublicMethod=function(v){this.m_publicMethod=v;}
actbAJX.prototype.getPublicMethod=function(){return this.m_publicMethod;}
actbAJX.prototype.setPatternFieldId=function(v){this.m_patternFieldId=v;}
actbAJX.prototype.getPatternFieldId=function(){return this.m_patternFieldId;}
actbAJX.prototype.setModel=function(v){this.m_model=v;}
actbAJX.prototype.getModel=function(){return this.m_model;}
actbAJX.prototype.setControl=function(v){this.m_control=v;}
actbAJX.prototype.getControl=function(){return this.m_control;}
actbAJX.prototype.setDescrFields=function(v){this.m_descrFields=v;}
actbAJX.prototype.getDescrFields=function(){return this.m_descrFields;}
actbAJX.prototype.setDescrFunction=function(v){this.m_descrFunction=v;}
actbAJX.prototype.getDescrFunction=function(){return this.m_descrFunction;}
actbAJX.prototype.setKeyFields=function(v){this.m_keyFields=v;}
actbAJX.prototype.getKeyFields=function(){return this.m_keyFields;}
function actb(obj,winObj,servConnect){var winDocum=(winObj==undefined)?window.document:(winObj.getWindowForm==undefined)?window.document:winObj.getWindowForm().document;var obj=typeof(obj)=="string"?CommonHelper.nd(obj,winDocum):obj;if(obj==null){alert("Error:ctrl {"+obj+"} does not exist!");return false;}
if(servConnect){var ajxCon=servConnect;var slef=this;ajxCon.onFillArrayEnd=function(){_actb_tocomplete();if(!actb_display){actb_generate();actb_display=true;}}
ajxCon.delDOM=function(){if(winDocum.getElementById('tat_table')){winDocum.body.removeChild(winDocum.getElementById('tat_table'));}
if(actb_toid)clearTimeout(actb_toid);}}
this.actb_timeOut=-1;this.actb_lim=4;this.actb_firstText=false;this.actb_mouse=true;this.actb_delimiter=new Array(';',',',' ');this.actb_startcheck=1;this.actb_bgColor='#888888';this.actb_textColor='#FFFFFF';this.actb_hColor='#000000';this.actb_fFamily='Verdana';this.actb_fSize='11px';this.actb_hStyle='text-decoration:underline;font-weight="bold"';var actb_delimwords=new Array();var actb_cdelimword=0;var actb_delimchar=new Array();var actb_display=false;var actb_pos=0;var actb_total=0;var actb_curr=null;var actb_rangeu=0;var actb_ranged=0;var actb_bool=new Array();var actb_pre=0;var actb_toid;var actb_tomake=false;var actb_getpre="";var actb_mouse_on_list=1;var actb_kwcount=0;var actb_caretmove=false;this.actb_keywords=[];var actb_self=this;actb_curr=obj;actb_curr.setAttribute("autocomplete","off");EventHelper.add(actb_curr,"focus",function(){EventHelper.add(winDocum,"keydown",actb_checkkey,false);EventHelper.add(winDocum,"keypress",actb_keypress,false);if(DOMHelper.hasClass(actb_curr,"null-ref")||(ajxCon&&ajxCon.getControl().getIsRef()&&ajxCon.getControl().isNull())){DOMHelper.delClass(actb_curr,"null-ref");actb_generate();}
if(ajxCon&&!ajxCon.getMinLengthForQuery()&&!actb_curr.value.length){actb_display=true;ajxCon.fillArrayOnPattern(actb_curr);}},false);EventHelper.add(actb_curr,"blur",function(){EventHelper.del(winDocum,"keydown",actb_checkkey,false);EventHelper.del(winDocum,"keypress",actb_keypress,false);if(actb_curr.value.length&&servConnect&&servConnect.getControl().getIsRef()&&servConnect.getControl().isNull()){DOMHelper.addClass(actb_curr,"null-ref");}
actb_removedisp();},false);function actb_clear(evt){if(!evt)evt=event;EventHelper.del(winDocum,"keydown",actb_checkkey,false);EventHelper.del(actb_curr,"blur",actb_clear,false);EventHelper.del(winDocum,"keypress",actb_keypress,false);actb_removedisp();}
function actb_parse(n){if(actb_self.actb_delimiter.length>0){var t=actb_delimwords[actb_cdelimword].trim().addslashes();var plen=actb_delimwords[actb_cdelimword].trim().length;}else{var t=actb_curr.value.addslashes();var plen=actb_curr.value.length;}
var tobuild='';var i;if(actb_self.actb_firstText){var re=new RegExp("^"+t,"i");}else{var re=new RegExp(t,"i");}
var p=n.search(re);for(i=0;i<p;i++){tobuild+=n.substr(i,1);}
tobuild+="<font style='"+(actb_self.actb_hStyle)+"'>"
for(i=p;i<plen+p;i++){tobuild+=n.substr(i,1);}
tobuild+="</font>";for(i=plen+p;i<n.length;i++){tobuild+=n.substr(i,1);}
return tobuild;}
function unfocus_cur_table(){var tables=winDocum.getElementsByTagName("table");if(tables&&tables.length){for(var i=0;i<tables.length;i++){if(DOMHelper.hasClass(tables[i],"focused")){DOMHelper.delClass(tables[i],"focused");break;}}}}
function actb_generate(){var node=CommonHelper.nd('tat_table',winDocum);if(node){actb_display=false;node.parentNode.removeChild(node);}
if(actb_kwcount==0){actb_display=false;return;}
unfocus_cur_table();var a_cont=winDocum.createElement("UL");a_cont.id="tat_table";a_cont.className="dropdown-menu";a_cont.style.position="absolute";a_cont.style.zIndex="99999";a_cont.style.top=($(actb_curr).offset().top+$(actb_curr).outerHeight())+"px";a_cont.style.left=$(actb_curr).offset().left+"px";a_cont.style.display="block";a=winDocum.createElement("LI");var i;var first=true;var j=1;if(actb_self.actb_mouse){a.onmouseout=actb_table_unfocus;a.onmouseover=actb_table_focus;}
var counter=0;for(i=0;i<actb_self.actb_keywords.length;i++){var c;if(actb_bool[i]){counter++;var ref_cl="autoComplete";if(first&&!actb_tomake){first=false;actb_pos=counter;ref_cl=ref_cl+" acCurrent";}else if(actb_pre==i){first=false;actb_pos=counter;}
c=winDocum.createElement("A");c.setAttribute("href","#");if(ref_cl){c.setAttribute("class",ref_cl);}
var ac_html=actb_parse(actb_self.actb_keywords[i]);if(ajxCon){if(ajxCon.m_resultFieldIdsToAttr&&ajxCon.m_resultFieldsToAttr&&ajxCon.m_resultFieldsToAttr[i]){for(attr_i=0;attr_i<ajxCon.m_resultFieldsToAttr[i].length;attr_i++){c.setAttribute(ajxCon.m_resultFieldsToAttr[i][attr_i].attr,ajxCon.m_resultFieldsToAttr[i][attr_i].val);}}
if(ajxCon.m_onCompleteTextOut){var r;if(ajxCon.getModel().getRow(i)){r=ajxCon.getModel().getFields();}
ac_html=ajxCon.m_onCompleteTextOut(ac_html,r);}}
c.innerHTML=ac_html;c.id='tat_td'+(j);c.setAttribute('pos',j);if(actb_self.actb_mouse){c.style.cursor='pointer';c.onclick=actb_mouseclick;}
j++;a.appendChild(c);}}
a_cont.appendChild(a);winDocum.body.appendChild(a_cont);actb_rangeu=1;actb_ranged=j-1;actb_display=true;if(actb_pos<=0)actb_pos=1;}
function actb_remake(){actb_generate();return;}
function actb_goup(){if(!actb_display)return;if(actb_pos==1)return;DOMHelper.delClass(winDocum.getElementById("tat_td"+actb_pos),"acCurrent");actb_pos--;if(actb_pos<actb_rangeu)actb_moveup();DOMHelper.addClass(winDocum.getElementById("tat_td"+actb_pos),"acCurrent");if(actb_toid)clearTimeout(actb_toid);if(actb_self.actb_timeOut>0)actb_toid=setTimeout(function(){actb_mouse_on_list=0;actb_removedisp();},actb_self.actb_timeOut);}
function actb_godown(){if(!actb_display)return;if(actb_pos==actb_total)return;var nd=winDocum.getElementById("tat_td"+actb_pos);DOMHelper.delClass(nd,"acCurrent");actb_pos++;if(actb_pos>actb_ranged)actb_movedown();DOMHelper.addClass(winDocum.getElementById("tat_td"+actb_pos),"acCurrent");if(actb_toid)clearTimeout(actb_toid);if(actb_self.actb_timeOut>0)actb_toid=setTimeout(function(){actb_mouse_on_list=0;actb_removedisp();},actb_self.actb_timeOut);}
function actb_movedown(){actb_rangeu++;actb_ranged++;actb_remake();}
function actb_moveup(){actb_rangeu--;actb_ranged--;actb_remake();}
function actb_mouse_down(evt){evt=EventHelper.fixKeyEvent(evt);if(evt.preventDefault){evt.preventDefault();}
evt.stopPropagation();actb_pos++;actb_movedown();actb_curr.focus();actb_mouse_on_list=0;if(actb_toid)clearTimeout(actb_toid);if(actb_self.actb_timeOut>0)actb_toid=setTimeout(function(){actb_mouse_on_list=0;actb_removedisp();},actb_self.actb_timeOut);}
function actb_mouse_up(evt){evt=EventHelper.fixKeyEvent(evt);if(evt.preventDefault){evt.preventDefault();}
evt.stopPropagation();actb_pos--;actb_moveup();actb_curr.focus();actb_mouse_on_list=0;if(actb_toid)clearTimeout(actb_toid);if(actb_self.actb_timeOut>0)actb_toid=setTimeout(function(){actb_mouse_on_list=0;actb_removedisp();},actb_self.actb_timeOut);}
function actb_mouseclick(evt){evt=EventHelper.fixKeyEvent(evt);if(evt.preventDefault){evt.preventDefault();}
evt.stopPropagation();if(!actb_display)return;actb_mouse_on_list=0;actb_pos=this.getAttribute('pos');actb_penter();}
function actb_table_focus(){actb_mouse_on_list=1;}
function actb_table_unfocus(){actb_mouse_on_list=0;if(actb_toid)clearTimeout(actb_toid);if(actb_self.actb_timeOut>0)actb_toid=setTimeout(function(){actb_mouse_on_list=0;actb_removedisp();},actb_self.actb_timeOut);}
function actb_table_highlight(){actb_mouse_on_list=1;actb_pos=this.getAttribute('pos');while(actb_pos<actb_rangeu)actb_moveup();while(actb_pos>actb_ranged)actb_movedown();if(actb_toid)clearTimeout(actb_toid);if(actb_self.actb_timeOut>0)actb_toid=setTimeout(function(){actb_mouse_on_list=0;actb_removedisp();},actb_self.actb_timeOut);}
function actb_insertword(a,wPos){actb_curr.value=a;actb_curr.focus();if(ajxCon){ajxCon.onSelected(wPos);}
actb_mouse_on_list=0;actb_removedisp();}
function actb_penter(evt){if(!actb_display)return;actb_display=false;var word='';var c=0;var w_pos;for(w_pos=0;w_pos<=actb_self.actb_keywords.length;w_pos++){if(actb_bool[w_pos])c++;if(c==actb_pos){word=actb_self.actb_keywords[w_pos];break;}}
actb_insertword(word,w_pos);l=getCaretStart(actb_curr,winDocum);}
function actb_removedisp(){if(actb_mouse_on_list==0){actb_display=0;if(winDocum.getElementById('tat_table')){winDocum.body.removeChild(winDocum.getElementById('tat_table'));}
if(actb_toid)clearTimeout(actb_toid);}}
function actb_keypress(e){if(actb_caretmove)stopEvent(e);return!actb_caretmove;}
function actb_checkkey(evt){if(!evt)evt=event;a=evt.keyCode;caret_pos_start=getCaretStart(actb_curr,winDocum);actb_caretmove=0;switch(a){case 38:actb_goup();actb_caretmove=1;return false;break;case 40:actb_godown();actb_caretmove=1;return false;break;case 13:case 9:if(actb_display){actb_caretmove=1;actb_penter(evt);return false;}else{return true;}
break;case 8:case 46:if(ajxCon!=undefined&&actb_curr.value!=""){ajxCon.fillArrayOnPattern(actb_curr);}
return true;default:setTimeout(function(){actb_tocomplete(a)},50);break;}}
function actb_tocomplete(kc){if(kc<46)return;if(ajxCon!=undefined&&actb_curr.value!=""){ajxCon.fillArrayOnPattern(actb_curr);}
_actb_tocomplete();}
function _actb_tocomplete(){if(ajxCon&&!ajxCon.getEnabled())return;if(ajxCon!=undefined&&(!ajxCon.getMinLengthForQuery()||(actb_curr.value!=""&&ajxCon.getMinLengthForQuery()))){actb_keywords=ajxCon.m_keywords;}
var i;if(actb_display){var word=0;var c=0;for(var i=0;i<=actb_self.actb_keywords.length;i++){if(actb_bool[i])c++;if(c==actb_pos){word=i;break;}}
actb_pre=word;}
else{actb_pre=-1};if(actb_curr.value==""&&(!ajxCon||ajxCon.getMinLengthForQuery())){actb_mouse_on_list=0;actb_removedisp();return;}
if(actb_self.actb_delimiter.length>0){caret_pos_start=getCaretStart(actb_curr,winDocum);caret_pos_end=getCaretEnd(actb_curr,winDocum);delim_split='';for(i=0;i<actb_self.actb_delimiter.length;i++){delim_split+=actb_self.actb_delimiter[i];}
delim_split=delim_split.addslashes();delim_split_rx=new RegExp("(["+delim_split+"])");c=0;actb_delimwords=new Array();actb_delimwords[0]='';for(i=0,j=actb_curr.value.length;i<actb_curr.value.length;i++,j--){if(actb_curr.value.substr(i,j).search(delim_split_rx)==0){ma=actb_curr.value.substr(i,j).match(delim_split_rx);actb_delimchar[c]=ma[1];c++;actb_delimwords[c]='';}else{actb_delimwords[c]+=actb_curr.value.charAt(i);}}
var l=0;actb_cdelimword=-1;for(i=0;i<actb_delimwords.length;i++){if(caret_pos_end>=l&&caret_pos_end<=l+actb_delimwords[i].length){actb_cdelimword=i;}
l+=actb_delimwords[i].length+1;}
var ot=actb_delimwords[actb_cdelimword].trim();var t=actb_delimwords[actb_cdelimword].addslashes().trim();}else{var ot=actb_curr.value;var t=actb_curr.value.addslashes();}
if(ot.length==0&&(!ajxCon||ajxCon.getMinLengthForQuery())){actb_mouse_on_list=0;actb_removedisp();}
if(ot.length<((ajxCon!=undefined)?ajxCon.getMinLengthForQuery():actb_self.actb_startcheck))return this;if(actb_self.actb_firstText){var re=new RegExp("^"+t,"i");}else{var re=new RegExp(t,"i");}
actb_total=0;actb_tomake=false;actb_kwcount=0;if(actb_self.actb_keywords){for(i=0;i<actb_self.actb_keywords.length;i++){actb_bool[i]=false;if(re.test(actb_self.actb_keywords[i])){actb_total++;actb_bool[i]=true;actb_kwcount++;if(actb_pre==i)actb_tomake=true;}}
if(actb_toid)clearTimeout(actb_toid);if(actb_self.actb_timeOut>0)actb_toid=setTimeout(function(){actb_mouse_on_list=0;actb_removedisp();},actb_self.actb_timeOut);actb_generate();}}
return this;} 
actbAJX.prototype.ER_NO_MODEL="Модель % не найдена в ответе сервера.";actbAJX.prototype.ER_NOT_SELECTED="Значение не выбрано."; 
function RepCommands(id,options){options=options||{};options.attrs=options.attrs||{};options.className=options.className||options.attrs["class"]||this.DEF_CLASS_NAME;RepCommands.superclass.constructor.call(this,id,(options.tagName||this.DEF_TAG_NAME),options);options.cmdMake=(options.cmdMake!=undefined)?options.cmdMake:true;options.cmdPrint=(options.cmdPrint!=undefined)?options.cmdPrint:true;options.cmdFilter=(options.cmdFilter!=undefined)?options.cmdFilter:true;options.cmdFilterSave=(options.cmdFilterSave!=undefined)?options.cmdFilterSave:(options.variantStorage!=undefined);options.cmdFilterOpen=(options.cmdFilterOpen!=undefined)?options.cmdFilterOpen:(options.variantStorage!=undefined);options.cmdExcel=(options.cmdExcel!=undefined)?options.cmdExcel:false;options.cmdPdf=(options.cmdPdf!=undefined)?options.cmdPdf:false;options.variantStorage=options.variantStorage||{};var self=this;if(options.cmdMake){this.setCmdMake((typeof(options.cmdMake)=="object")?options.cmdMake:new GridCmd(id+":make",{"onCommand":options.onReport,"caption":this.BTN_MAKE_CAP,"title":this.BTN_MAKE_TITLE}));}
if(options.cmdFilter){if(options.cmdFilterSave){this.setCmdFilterSave((typeof(options.cmdFilterSave)=="object")?options.cmdFilterSave:new GridCmdFilterSave(id+":filterSave",{"variantStorageName":options.variantStorage.name,"dataCol":"filter_data"}));}
if(options.cmdFilterOpen){this.setCmdFilterOpen((typeof(options.cmdFilterOpen)=="object")?options.cmdFilterOpen:new GridCmdFilterOpen(id+":filterOpen",{"variantStorageName":options.variantStorage.name,"dataCol":"filter_data"}));}
this.setCmdFilter((typeof(options.cmdFilter)=="object")?options.cmdFilter:new GridCmdFilter(id+":filter",{"filters":options.filters,"controlSave":this.getCmdFilterSave(),"controlOpen":this.getCmdFilterOpen(),"variantStorageModel":options.variantStorage.model}));this.getCmdFilter().unserializeFilters();}
if(options.cmdPrint){this.setCmdPrint((typeof(options.cmdPrint)=="object")?options.cmdPrint:new GridCmd(id+":print",{"glyph":"glyphicon-print","onCommand":options.onPrint,"title":this.BTN_PRINT_TITLE}));this.getCmdPrint().getControl().setEnabled(false);}
if(options.cmdExcel){this.setCmdExcel((typeof(options.cmdExcel)=="object")?options.cmdExcel:new GridCmd(id+":excel",{"glyph":"glyphicon-save-file","onCommand":options.onExcel,"title":this.BTN_EXCEL_TITLE}));this.getCmdExcel().getControl().setEnabled(false);}
if(options.cmdPdf){this.setCmdPdf((typeof(options.cmdPdf)=="object")?options.cmdPdf:new GridCmd(id+":pdf",{"glyph":"glyphicon-save-file","onCommand":options.onPdf,"title":this.BTN_PDF_TITLE}));this.getCmdPdf().getControl().setEnabled(false);}
this.m_commands=options.commands||[];this.addControls();}
extend(RepCommands,ControlContainer);RepCommands.prototype.DEF_TAG_NAME="div";RepCommands.prototype.DEF_CLASS_NAME="cmdButtons";RepCommands.prototype.m_cmdMake;RepCommands.prototype.m_cmdPrint;RepCommands.prototype.m_cmdExcel;RepCommands.prototype.m_cmdPdf;RepCommands.prototype.m_cmdFilter;RepCommands.prototype.m_cmdFilterOpen;RepCommands.prototype.m_cmdFilterSave;RepCommands.prototype.m_commands;RepCommands.prototype.addCommands=function(){if(this.m_cmdMake){this.m_commands.push(this.m_cmdMake);}
if(this.m_cmdPrint){this.m_commands.push(this.m_cmdPrint);}
if(this.m_cmdExcel){this.m_commands.push(this.m_cmdExcel);}
if(this.m_cmdPdf){this.m_commands.push(this.m_cmdPdf);}
if(this.m_cmdFilter){this.m_commands.push(this.m_cmdFilter);}
if(this.m_cmdFilterSave){this.m_commands.push(this.m_cmdFilterSave);}
if(this.m_cmdFilterOpen){this.m_commands.push(this.m_cmdFilterOpen);}}
RepCommands.prototype.addControls=function(){this.addCommands();for(var i=0;i<this.m_commands.length;i++){if(this.m_commands[i].getShowCmdControl()){this.m_commands[i].controlsToContainer(this);}}}
RepCommands.prototype.getCmdMake=function(){return this.m_cmdMake;}
RepCommands.prototype.setCmdMake=function(v){this.m_cmdMake=v;}
RepCommands.prototype.getCmdExcel=function(){return this.m_cmdExcel;}
RepCommands.prototype.setCmdExcel=function(v){this.m_cmdExcel=v;}
RepCommands.prototype.getCmdPdf=function(){return this.m_cmdPdf;}
RepCommands.prototype.setCmdPdf=function(v){this.m_cmdPdf=v;}
RepCommands.prototype.getCmdPrint=function(){return this.m_cmdPrint;}
RepCommands.prototype.setCmdPrint=function(v){this.m_cmdPrint=v;}
RepCommands.prototype.getCmdFilter=function(){return this.m_cmdFilter;}
RepCommands.prototype.setCmdFilter=function(v){this.m_cmdFilter=v;}
RepCommands.prototype.getCmdFilterSave=function(){return this.m_cmdFilterSave;}
RepCommands.prototype.setCmdFilterSave=function(v){this.m_cmdFilterSave=v;}
RepCommands.prototype.getCmdFilterOpen=function(){return this.m_cmdFilterOpen;}
RepCommands.prototype.setCmdFilterOpen=function(v){this.m_cmdFilterOpen=v;}
RepCommands.prototype.delDOM=function(){for(var i=0;i<this.m_commands.length;i++){this.m_commands[i].onDelDOM();}
RepCommands.superclass.delDOM.call(this);} 
RepCommands.prototype.BTN_MAKE_CAP="Сформировать";RepCommands.prototype.BTN_MAKE_TITLE="Сформировать отчет";RepCommands.prototype.BTN_PRINT_CAP="Печать";RepCommands.prototype.BTN_PRINT_TITLE="Напечатать отчет";RepCommands.prototype.BTN_EXCEL_CAP="Excel";RepCommands.prototype.BTN_EXCEL_TITLE="Экспорт отчета в excel";RepCommands.prototype.BTN_PDF_CAP="PDF";RepCommands.prototype.BTN_PDF_TITLE="Экспорт отчета в pdf";RepCommands.prototype.BTN_FILTER_CAP="Параметры";RepCommands.prototype.BTN_FILTER_TITLE="Показать/скрыть параметры отчета"; 
function ViewReport(id,options){options=options||{};options.templateOptions=options.templateOptions||{};options.templateOptions.HEAD_TITLE=this.HEAD_TITLE;ViewReport.superclass.constructor.call(this,id,"DIV",options);this.setPublicMethod(options.publicMethod);this.setReportViewId(options.reportViewId);this.setExcelViewId(options.excelViewId||this.DEF_EXCEL_VIEW);this.setPdfViewId(options.pdfViewId||this.DEF_PDF_VIEW);this.setTemplateId(options.templateId);this.setReportControl(options.reportControl||new Control(id+":report","DIV",{}));this.m_retContentType=options.retContentType||"text";var self=this;var def_cmd_opts={"cmdMake":options.cmdMake,"cmdPrint":options.cmdPrint,"cmdFilter":options.cmdFilter,"cmdExcel":options.cmdExcel,"cmdPdf":options.cmdPdf,"filters":options.filters};if(def_cmd_opts.cmdMake)def_cmd_opts.onReport=function(){self.onReport();};if(def_cmd_opts.cmdPrint)def_cmd_opts.onPrint=function(){self.onPrint();};if(def_cmd_opts.cmdExcel)def_cmd_opts.onExcel=function(){self.onExcel();};if(def_cmd_opts.cmdPdf)def_cmd_opts.onPdf=function(){self.onPdf();};def_cmd_opts.variantStorage=options.variantStorage;this.m_commands=options.commands||new RepCommands(id+":repCommands",def_cmd_opts);this.m_openFilterOnInit=(options.openFilterOnInit!=undefined)?options.openFilterOnInit:true;}
extend(ViewReport,ControlContainer);ViewReport.prototype.DEF_EXCEL_VIEW="ViewExcel";ViewReport.prototype.DEF_PDF_VIEW="ViewPDF";ViewReport.prototype.m_publicMethod;ViewReport.prototype.m_templateId;ViewReport.prototype.m_reportViewId;ViewReport.prototype.m_excelViewId;ViewReport.prototype.m_pdfViewId;ViewReport.prototype.m_commands;ViewReport.prototype.m_groupper;ViewReport.prototype.m_reportControl;ViewReport.prototype.getFilter=function(){return this.m_filter;}
ViewReport.prototype.setFilter=function(filter){this.m_filter=filter;}
ViewReport.prototype.setGroupper=function(v){this.m_groupper=v;}
ViewReport.prototype.getGroupper=function(v){return this.m_groupper;}
ViewReport.prototype.setPublicMethod=function(v){this.m_publicMethod=v;}
ViewReport.prototype.getPublicMethod=function(){return this.m_publicMethod;}
ViewReport.prototype.setReportViewId=function(v){this.m_reportViewId=v;}
ViewReport.prototype.getReportViewId=function(){return this.m_reportViewId;}
ViewReport.prototype.setExcelViewId=function(v){this.m_excelViewId=v;}
ViewReport.prototype.getExcelViewId=function(){return this.m_excelViewId;}
ViewReport.prototype.setPdfViewId=function(v){this.m_pdfViewId=v;}
ViewReport.prototype.getPdfViewId=function(){return this.m_pdfViewId;}
ViewReport.prototype.setReportControl=function(reportControl){this.m_reportControl=reportControl;}
ViewReport.prototype.getReportControl=function(){return this.m_reportControl;}
ViewReport.prototype.setCommands=function(v){this.m_commands=v;}
ViewReport.prototype.getCommands=function(){return this.m_commands;}
ViewReport.prototype.setTemplateId=function(v){this.m_templateId=v;}
ViewReport.prototype.getTemplateId=function(){return this.m_templateId;}
ViewReport.prototype.toDOM=function(parent){ViewReport.superclass.toDOM.call(this,parent);this.m_commands.toDOM(this.m_node);if(this.m_openFilterOnInit){var f=this.m_commands.getCmdFilter();if(f)f.onCommand();}
this.m_reportControl.toDOM(this.m_node);}
ViewReport.prototype.delDOM=function(){this.m_commands.delDOM();this.m_reportControl.delDOM();ViewReport.superclass.delDOM.call(this);}
ViewReport.prototype.fillParams=function(){var pm=this.getPublicMethod();var contr=pm.getController();if(this.m_commands.getCmdFilter()){try{this.m_commands.getCmdFilter().getFilter().applyFiltersToPublicMethod(pm);}
catch(e){this.m_commands.getCmdFilter().onCommand(null);throw Error(e.message);}}
if(this.m_groupper){this.m_groupper.getParams(filter_struc);if(!filter_struc.grp_fields){throw Error(this.NO_GRP_SELECTED);}
pm.setFieldValue(contr.PARAM_GRP_FIELDS,filter_struc.grp_fields);}}
ViewReport.prototype.downloadReport=function(view){this.getPublicMethod().download(view);}
ViewReport.prototype.setControlsEnabled=function(en){this.m_commands.getCmdMake().getControl().setEnabled(en);if(this.m_commands.getCmdExcel())this.m_commands.getCmdExcel().getControl().setEnabled(en);if(this.m_commands.getCmdPdf())this.m_commands.getCmdPdf().getControl().setEnabled(en);if(this.m_commands.getCmdPrint())this.m_commands.getCmdPrint().getControl().setEnabled(en);}
ViewReport.prototype.onGetReportData=function(respText){this.m_reportControl.m_node.innerHTML=respText;}
ViewReport.prototype.onReport=function(){this.fillParams();var self=this;this.setControlsEnabled(false);window.setGlobalWait(true);var pm=this.getPublicMethod();if(pm.fieldExists("templ")&&this.getTemplateId()){pm.setFieldValue("templ",this.getTemplateId());}
pm.run({"viewId":this.getReportViewId(),"get":true,"retContentType":this.m_retContentType,"ok":function(resp){self.onGetReportData(resp);},"all":function(){window.setGlobalWait(false);self.setControlsEnabled(true);}});}
ViewReport.prototype.onPrint=function(){var ctrl=this.getReportControl();if(ctrl){WindowPrint.show({"content":ctrl.getNode().outerHTML});}}
ViewReport.prototype.onExcel=function(){var ctrl_n=this.getReportControl().getNode();var tb=ctrl_n.getElementsByTagName("TABLE");if(tb&&tb.length){var title_l=DOMHelper.getElementsByAttr("reportTitle",ctrl_n,"class",true);var sheet_t;if(title_l&&title_l.length){sheet_t=DOMHelper.getText(title_l[0]);}
else{sheet_t=this.getName();}
DOMHelper.tableToExcel(tb[0],sheet_t,sheet_t+".xls");}}
ViewReport.prototype.onPdf=function(){this.downloadReport(this.getPdfViewId());} 
ViewReport.prototype.VARIANT_SAVED="Сохранение настроек выполнено.";ViewReport.prototype.NO_GRP_SELECTED="Не выбрано ни одного поля!"; 
function PopUpMenu(options){options=options||{};this.items=[];this.width=0;this.height=0;this.m_caption=options.caption;var self=this;this.m_evShow=function(e){e=EventHelper.fixMouseEvent(e);self.show.call(self,e);if(e.preventDefault){e.preventDefault();}
return false;};if(options.elements&&Array.isArray(options.elements)){for(var i=0;i<options.elements.length;i++){if(typeof(options.elements[i])=="string"){this.addSeparator();}
else if(options.elements[i]instanceof Button){this.addButton(options.elements[i]);}
else if(options.elements[i]){this.add(options.elements[i]);}}}}
PopUpMenu.prototype.SEPARATOR='PopUpMenu.SEPARATOR';PopUpMenu.prototype.current=null;PopUpMenu.prototype.unbind=function(){EventHelper.del(this.target,"contextmenu",this.m_evShow,true);if(this.element){this.element.delDOM();}}
PopUpMenu.prototype.bind=function(element){if(!this.items.length){return;}
var self=this;if(!element){element=document;}else if(typeof element=='string'){element=document.getElementById(element);}
this.target=element;EventHelper.add(this.target,"contextmenu",this.m_evShow,true);}
PopUpMenu.prototype.add=function(action){this.items.push(action);}
PopUpMenu.prototype.addButton=function(btn){this.items.push({caption:btn.getCaption()||btn.getAttr("title"),glyph:(btn.getGlyphPopUp())?btn.getGlyphPopUp():btn.getGlyph(),onClick:btn.getOnClick()});}
PopUpMenu.prototype.addSeparator=function(){this.items.push(PopUpMenu.SEPARATOR);}
PopUpMenu.prototype.show=function(e,fixToElement){if(this.current&&this.current!=this)return;this.current=this;if(this.element&&document.getElementById(this.element.getId())){this.element.setPosition(e,fixToElement);this.element.setVisible(true);}else{this.element=this.createMenu(this.items);this.element.toDOM(e,fixToElement);}}
PopUpMenu.prototype.hide=function(){this.current=null;if(this.element)this.element.setVisible(false);}
PopUpMenu.prototype.getVisible=function(){if(this.element)return this.element.getVisible();}
PopUpMenu.prototype.createMenu=function(items){var self=this;var menu_cont=[];for(var i=0;i<items.length;i++){var item;if(items[i]==PopUpMenu.SEPARATOR){item=this.createSeparator();}else{item=this.createItem(items[i]);}
menu_cont.push(item);}
var menu=new PopOver(CommonHelper.uniqid(),{"fixToElement":this.fixToElement,"zIndex":"2005","attrs":{"style":((self.width)?("width:"+self.width+"px;"):"")
+
((self.height)?("height:"+self.height+"px;"):"")},"caption":this.m_caption,"contentElements":[new ControlContainer(CommonHelper.uniqid(),"ul",{"elements":menu_cont,"className":"nav"})]});return menu;}
PopUpMenu.prototype.createItem=function(item){var self=this;var callback=item.onClick;var elem=new Control(null,"a",{"attrs":{"href":"#","item_id":item.id},"enabled":!item.disabled,"className":"nav-link","events":{"click":function(_callback){return function(e){self.hide();e=EventHelper.fixMouseEvent(e);if(!e.target.getAttribute("disabled")||e.target.getAttribute("disabled")!="disabled"){var id=e.target.getAttribute("item_id");_callback(self.target,id?id:e);}};}(callback)}});if(item.glyph){var i=document.createElement("span");i.className="glyphicon "+item.glyph;elem.m_node.appendChild(i);}
elem.m_node.appendChild(document.createTextNode(" "+item.caption));return new ControlContainer(null,"li",{"enabled":!item.disabled,"className":"nav-item","elements":[elem]});}
PopUpMenu.prototype.createSeparator=function(){return new Control(null,"div",{"attrs":{"style":"borderTop='1px dotted #CCCCCC';fontSize='0px';height='0px';"}})} 
function PopOver(id,options){options=options||{};options.template=window.getApp().getTemplate("PopOver");options.addElement=function(){this.addElement(new Control(id+":title","DIV",{"value":options.caption}));this.addElement(new ControlContainer(id+":content","DIV",{"elements":options.contentElements}));}
this.m_onHide=options.onHide;this.m_zIndex=options.zIndex||"2";PopOver.superclass.constructor.call(this,id,"TEMPLATE",options);var self=this;this.m_evHide=function(event){if(self.m_ieHack){self.m_ieHack--;return;}
event=EventHelper.fixMouseEvent(event);if(event.pageX<self.m_posMinX||event.pageX>self.m_posMaxX||event.pageY<self.m_posMinY||event.pageY>self.m_posMaxY){var el=event.target;var other_popover=false;el=el.parentNode;while(el){if(DOMHelper.hasClass(el,"popover")||DOMHelper.hasClass(el,"datepicker")){other_popover=true;break;}
el=el.parentNode;}
if(!other_popover&&self.getVisible()){self.setVisible(false);event.stopPropagation();}}}}
extend(PopOver,ControlContainer);PopOver.prototype.setPosition=function(e,fixToElement){var x,y;if(fixToElement){var rect=fixToElement.getBoundingClientRect();y=rect.top+$(fixToElement).outerHeight();x=rect.left;}
else{x=e.pageX;y=e.pageY;}
var vp_w=DOMHelper.getViewportWidth();var n=this.getNode();if(n.clientWidth+x>vp_w){x=vp_w-n.clientWidth-10;}
n.style.position="absolute";n.style.top=y+"px";n.style.left=x+"px";n.style.zIndex=this.m_zIndex;n.style.display="block";}
PopOver.prototype.setVisible=function(v){PopOver.superclass.setVisible.call(this,v);if(v){this.addClick();}
else{this.delClick();if(this.m_onHide){this.m_onHide();}}}
PopOver.prototype.addClick=function(){this.m_ieHack=(CommonHelper.isIE())?1:0;EventHelper.add(document,"click",this.m_evHide,true);}
PopOver.prototype.delClick=function(){EventHelper.del(document,"click",this.m_evHide,true);}
PopOver.prototype.toDOM=function(e,fixToElement){PopOver.superclass.toDOM.call(this,document.body);this.setPosition(e,fixToElement);var rect=this.m_node.getBoundingClientRect();this.m_posMinY=rect.top;this.m_posMaxY=rect.top+$(this.m_node).outerHeight();this.m_posMinX=rect.left;this.m_posMaxX=rect.left+$(this.m_node).outerWidth();this.m_zIndex=parseInt($(this.m_node).css("z-index"),10);this.addClick();}
PopOver.prototype.delDOM=function(){PopOver.superclass.delDOM.call(this);this.delClick();} 
function PeriodSelect(id,options){options=options||{};var self=this;options.events={"click":function(e){self.onClick(e);}};options.attrs=options.attrs||{};options.attrs.style="cursor:pointer;";options.value=options.value||options.period||this.PERIOD_ALIASES[0];PeriodSelect.superclass.constructor.call(this,id,"A",options);}
extend(PeriodSelect,Control);PeriodSelect.prototype.PERIOD_ALIASES=["all","day","week","month","quarter","year"];PeriodSelect.prototype.CLASS_SELECTED="alert-success";PeriodSelect.prototype.m_pop;PeriodSelect.prototype.onClick=function(e){if(!this.m_pop){var self=this;var cont_el=[];var cur=this.getValue();for(var i=0;i<this.PERIOD_ALIASES.length;i++){cont_el.push(new Control(CommonHelper.uniqid(),"P",{"className":"forSelect"+((cur==this.PERIOD_ALIASES[i])?" "+this.CLASS_SELECTED:""),"value":this.PERIODS[i],"attrs":{"period":this.PERIOD_ALIASES[i],"style":"cursor:pointer;"},"events":{"click":function(e){self.m_pop.setVisible(false);var par=e.target.parentNode;for(var j=0;j<par.childNodes.length;j++){if(par.childNodes[j]==e.target){DOMHelper.addClass(e.target,self.CLASS_SELECTED);}
else if(DOMHelper.hasClass(par.childNodes[j],self.CLASS_SELECTED)){DOMHelper.delClass(par.childNodes[j],self.CLASS_SELECTED);}}
self.setValue(e.target.getAttribute("period"));}}}));}
var cont=new ControlContainer(null,"DIV",{"elements":cont_el});this.m_pop=new PopOver(this.getId()+":popover",{"contentElements":[cont],"zIndex":"2001"});this.m_pop.toDOM(e,this.getNode());}
else{this.m_pop.setVisible(!this.m_pop.getVisible());}}
PeriodSelect.prototype.setValue=function(v){var p=CommonHelper.inArray(v,this.PERIOD_ALIASES);if(p==-1){throw Error(this.ER_PERIOD_NOT_FOUND);}
this.setAttr("period",v);PeriodSelect.superclass.setValue.call(this,this.PERIODS[p]);}
PeriodSelect.prototype.getValue=function(v){return this.getAttr("period");} 
PeriodSelect.prototype.PERIODS=["Произвольный период","Текущий день","Текущая неделя","Текущий месяц","Текущий квартал","Текущий год"];PeriodSelect.prototype.ER_PERIOD_NOT_FOUND="Период не определен!"; 
var WindowAbout={show:function(view){var self=this;this.m_form=new WindowFormModalBS(CommonHelper.uniqid(),{"cmdCancel":true,"controlCancelCaption":this.CMD_CLOSE_CAP,"controlCancelTitle":this.CMD_CLOSE_TITLE,"cmdOk":false,"onClickCancel":function(){self.m_form.close();},"content":view,"contentHead":this.HEAD_TITLE});this.m_form.open();}} 
WindowAbout.HEAD_TITLE="О программе";WindowAbout.CMD_CLOSE_CAP="ОК";WindowAbout.CMD_CLOSE_TITLE="Закрыть окно"; 
function MainMenuTree(id,options){options=options||{};var self=this;options.editViewOptions={"tagName":"LI","columnTagName":"DIV","onBeforeExecCommand":function(cmd,pm){pm.setFieldValue("viewdescr",self.m_editViewDescr);}};options.rootCaption=this.ROOT_CAP;options.model=new MainMenuContent_Model();options.className="menuConstructor";options.controller=new MainMenuContent_Controller({"clientModel":options.model});options.popUpMenu=(options.popUpMenu!=undefined)?options.popUpMenu:new PopUpMenu();options.navigateMouse=false;options.commands=new GridCmdContainerAjx(id+":cmd",{"cmdColManager":false,"cmdExport":false,"cmdSearch":false,"cmdCopy":false,"cmdRefresh":false});options.head=new GridHead(id+":head",{"rowOptions":[{"tagName":"li"}],"elements":[new GridRow(id+":content-tree:head:row0",{"elements":[new GridCellHead(id+":content-tree:head",{"className":window.getBsCol(6),"columns":[new GridColumn({"model":options.model,"field":options.model.getField("descr"),"cellOptions":{"tagName":"SPAN"},"ctrlOptions":{"labelCaption":this.LB_CAP_DESCR,"contTagName":"DIV","labelClassName":"control-label "+window.getBsCol(2),"editContClassName":"input-group "+window.getBsCol(10)}}),new GridColumn({"field":options.model.getField("viewdescr"),"model":options.model,"cellOptions":{"tagName":"SPAN"},"ctrlClass":ViewEditRef,"ctrlBindField":options.model.getField("viewid"),"ctrlOptions":{"labelCaption":this.LB_CAP_VIEW,"contTagName":"DIV","labelClassName":"control-label "+window.getBsCol(2),"editContClassName":"input-group "+window.getBsCol(10),"keyIds":["viewid"],"menuTree":this,"onSelect":function(fields){self.onViewSelected(fields);}}}),new GridColumn({"field":options.model.getField("glyphclass"),"model":options.model,"cellOptions":{"tagName":"SPAN"},"ctrlOptions":{"labelCaption":this.LB_CAP_GLYPHCLASS,"contTagName":"DIV","labelClassName":"control-label "+window.getBsCol(2),"editContClassName":"input-group "+window.getBsCol(10),"buttonSelect":new ButtonCtrl(id+":content-tree:head:glyphclass-sel",{"glyph":"glyphicon-menu-hamburger","onClick":function(e){self.selectPict(this.getEditControl());}})}}),new GridColumn({"field":options.model.getField("default"),"assocClassList":{"true":"glyphicon glyphicon-ok"},"model":options.model,"cellOptions":{"tagName":"SPAN"},"ctrlOptions":{"labelCaption":this.LB_CAP_DEFAULT,"contTagName":"DIV","labelClassName":"control-label "+window.getBsCol(2),"editContClassName":"input-group "+window.getBsCol(1)}})]})]})]});MainMenuTree.superclass.constructor.call(this,id,options);}
extend(MainMenuTree,TreeAjx);MainMenuTree.prototype.selectPict=function(editCtrl){var self=this;this.m_view=new View(this.getId()+":view:body:view",{"template":window.getApp().getTemplate("IcomoonList"),"events":{"click":function(e){if(e.target.tagName.toUpperCase()=="DIV"){editCtrl.setValue(e.target.firstChild.className);self.closeSelect();}}}});this.m_form=new WindowFormModalBS(this.getId()+":form",{"cmdCancel":true,"controlCancelCaption":this.BTN_CANCEL_CAP,"controlCancelTitle":this.BTN_CANCEL_TITLE,"cmdOk":false,"controlOkCaption":null,"controlOkTitle":null,"onClickCancel":function(){self.closeSelect();},"onClickOk":function(){self.closeSelect();},"content":this.m_view,"contentHead":this.SEL_PIC_HEAD});this.m_form.open();}
MainMenuTree.prototype.closeSelect=function(){if(this.m_view){this.m_view.delDOM();delete this.m_view;}
if(this.m_form){this.m_form.close();delete this.m_form;}}
MainMenuTree.prototype.onViewSelected=function(fields){var descr=fields.user_descr.getValue();var sec=fields.section.getValue();if(descr.substring(0,sec.length)==sec){descr=descr.substring(sec.length);}
this.getEditViewObj().getElement("descr").setValue(descr);} 
MainMenuTree.prototype.ROOT_CAP="МЕНЮ";MainMenuTree.prototype.LB_CAP_DESCR="Наименование:";MainMenuTree.prototype.LB_CAP_VIEW="Объект:";MainMenuTree.prototype.LB_CAP_DEFAULT="По умолчанию:";MainMenuTree.prototype.LB_CAP_GLYPHCLASS="Класс картинки:";MainMenuTree.prototype.SEL_PIC_HEAD="Выберите картинку"; 
function BigFileUploader(id,options){options=options||{};BigFileUploader.superclass.constructor.call(this,id,"template",options);var self=this;options.cmdAdd=(options.cmdAdd!=undefined)?options.cmdAdd:true;options.cmdPause=(options.cmdPause!=undefined)?options.cmdPause:true;options.cmdUpload=(options.cmdUpload!=undefined)?options.cmdUpload:true;options.cmdCancel=(options.cmdCancel!=undefined)?options.cmdCancel:true;this.addElement(new ControlContainer(id+":file-list","div",{"elements":[new Control(id+":file-list:header","h1",{"value":this.DRAG_AREA_TITLE}),new ControlContainer(id+":file-list:list","ul",{})]}));if(options.cmdAdd){this.addElement(options.fileAddControl||new((options.fileAddButton)?options.fileAddButton:ButtonCmd)(id+":file-add",{"glyph":this.GLYPH_ADD,"title":this.FILE_ADD_TITLE}));}
if(options.cmdUpload){this.addElement(options.fileUploadControl||new((options.fileUploadButton)?options.fileUploadButton:ButtonCmd)(id+":file-upload",{"glyph":this.GLYPH_UPLOAD,"title":this.FILE_ULOAD_TITLE,"onClick":function(){self.fileUpload();}}));}
if(options.cmdPause){this.addElement(options.filePauseControl||new((options.filePauseButton)?options.filePauseButton:ButtonCmd)(id+":file-pause",{"glyph":this.GLYPH_PAUSE,"title":this.FILE_PAUSE_PAUSE_TITLE,"enabled":false,"onClick":function(){self.filePause();}}));}
if(options.cmdCancel){this.addElement(options.fileCancelControl||new((options.fileCancelButton)?options.fileCancelButton:ButtonCmd)(id+":file-cancel",{"glyph":this.GLYPH_CANCEL,"title":this.FILE_CANCEL_TITLE,"onClick":function(){self.fileCancel();}}));}
this.m_resumable=new Resumable({"target":options.target||"functions/upload.php","testChunks":true,"fileType":[],"maxFilesErrorCallback":function(files,errorCount){var maxFiles=$.getOpt('maxFiles');window.showError(CommonHelper.format(this.ER_MAX_FILES,Array(maxFiles)));},"minFileSizeErrorCallback":function(file,errorCount){var f_name=file.fileName||file.name;var sz=$h.formatSize($.getOpt('minFileSize'));window.showError(CommonHelper.format(this.ER_MIN_FILE_SIZE,Array(f_name,sz)));},"maxFileSizeErrorCallback":function(file,errorCount){var f_name=file.fileName||file.name;var sz=$h.formatSize($.getOpt('maxFileSize'));window.showError(CommonHelper.format(this.ER_MAX_FILE_SIZE,Array(f_name,sz)));},"fileTypeErrorCallback":function(file,errorCount){var f_name=file.fileName||file.name;CommonHelper.format(this.ER_FILE_TYPE,Array(f_name,$.getOpt('fileType')));},"query":function(file,chunk){return self.m_queryParams;}});if(options.cmdAdd){this.m_resumable.assignBrowse(this.getElement("file-add").getNode());}
this.m_resumable.assignDrop(this.getElement("file-list").getNode());if(!this.m_resumable.support){window.showWarn("Big file upload not supported!");}
this.m_progressBarNode=$("#upload-progress");this.m_resumable.on("fileAdded",function(file,event){var l=self.getElement("file-list").getElement("list");var f_elem=new ControlContainer(self.getId()+":file-list:list:"+file.file.name,"li",{elements:[new Control(CommonHelper.uniqid(),"img",{"className":"hide file-upload-mark","src":"img/wait-sm.gif"}),new Control(CommonHelper.uniqid(),"i",{"className":"glyphicon glyphicon-remove","events":{"click":function(e){if(!self.m_resumable.isUploading()){var list=self.getElement("file-list").getElement("list");list.delElement(file.file.name);if(!list.getCount()){self.progressFinish();}
self.m_resumable.removeFile(file);}}}}),new Control(CommonHelper.uniqid(),"span",{"value":file.file.name+" ("+CommonHelper.byteForamt(file.file.size)+")"})]});l.addElement(f_elem);l.toDOM();self.progressFileAdded();});this.m_resumable.on("fileSuccess",function(file,message){var imgs=DOMHelper.getElementsByAttr("file-upload-mark",self.m_node,"class",false,"img");for(var i in imgs){imgs[i].src="img/ok.png";DOMHelper.delClass(imgs[i],"hide");}
self.progressFinish();self.m_onFinish();});this.m_resumable.on("cancel",function(){self.progressFinish();});this.m_resumable.on("uploadStart",function(){var b=self.getElement("file-pause");if(b){b.setEnabled(true);}
var imgs=DOMHelper.getElementsByAttr("file-upload-mark",self.m_node,"class",false,"img");for(var i in imgs){imgs[i].src="img/wait-sm.gif";DOMHelper.delClass(imgs[i],"hide");}
self.m_paused=false;});this.m_resumable.on("error",function(message,file){self.progressFinish();window.showError("Error:onerror "+message);});this.m_resumable.on("progress",function(){if(self.m_paused){var btn=self.getElement("file-pause");if(btn){btn.setGlyph(self.GLYPH_PAUSE);btn.setAttr("title",self.FILE_PAUSE_PAUSE_TITLE);}
self.m_paused=false;}
self.progressUploading(self.m_resumable.progress()*100);});this.m_resumable.on("pause",function(){self.m_paused=true;var btn=self.getElement("file-pause");if(btn){btn.setGlyph(self.GLYPH_PLAY);btn.setAttr("title",self.FILE_PAUSE_PLAY_TITLE);}});this.m_queryParams=options.queryParams||{};this.m_onFinish=options.onFinish;}
extend(BigFileUploader,ControlContainer);BigFileUploader.prototype.GLYPH_UPLOAD="glyphicon-upload";BigFileUploader.prototype.GLYPH_PLAY="glyphicon-play";BigFileUploader.prototype.GLYPH_PAUSE="glyphicon-pause";BigFileUploader.prototype.GLYPH_ADD="glyphicon-plus";BigFileUploader.prototype.GLYPH_CANCEL="glyphicon-remove";BigFileUploader.prototype.m_resumable;BigFileUploader.prototype.m_progressBarNode;BigFileUploader.prototype.m_queryParams;BigFileUploader.prototype.fileUpload=function(){this.m_resumable.upload();}
BigFileUploader.prototype.fileCancel=function(){this.m_resumable.cancel();var l=this.getElement("file-list").getElement("list");l.clear();}
BigFileUploader.prototype.filePause=function(){if(this.m_resumable.files.length>0){if(this.m_resumable.isUploading()){return this.m_resumable.pause();}
return this.m_resumable.upload();}}
BigFileUploader.prototype.progressFileAdded=function(){this.m_progressBarNode.removeClass("hide").find(".progress-bar").css("width","0%");}
BigFileUploader.prototype.progressUploading=function(progress){var el=this.m_progressBarNode.find(".progress-bar");el.attr("style","width:"+progress+"%");el.attr("aria-valuenow",progress);el.val(progress+"%");}
BigFileUploader.prototype.progressFinish=function(){this.m_progressBarNode.addClass("hide").find(".progress-bar").css("width","0%");var b=this.getElement("file-pause");if(b){b.setEnabled(false);}}
BigFileUploader.prototype.setQueryParam=function(id,v){this.m_queryParams[id]=v;} 
BigFileUploader.prototype.DRAG_AREA_TITLE="Перетащите файлы мышкой или воспользуйтесь кнопкой";BigFileUploader.prototype.FILE_ADD_TITLE="Добавить файл для загрузки";BigFileUploader.prototype.FILE_ULOAD_TITLE="Загрузить все файлы";BigFileUploader.prototype.FILE_PAUSE_PAUSE_TITLE="Приостановить загрузку";BigFileUploader.prototype.FILE_PAUSE_PLAY_TITLE="Продолжить загрузку";BigFileUploader.prototype.FILE_CANCEL_TITLE="Отменить загрузку";BigFileUploader.prototype.ER_MAX_FILES="Максимольно разрешенное количество файлов для загрузки: %";BigFileUploader.prototype.ER_MIN_FILE_SIZE="Файл % слишком маленький, минимальный размер для загрузки: %";BigFileUploader.prototype.ER_MAX_FILE_SIZE="Файл % слишком большой, максимальный размер для загрузки: %";BigFileUploader.prototype.ER_FILE_TYPE="Файл % имеет неверный тип, разрешенные типы файлов: %"; 
function ViewList_Form(options){options=options||{};options.formName="ViewList";options.controller="View_Controller";options.method="get_list";ViewList_Form.superclass.constructor.call(this,options);}
extend(ViewList_Form,WindowFormObject); 
function MainMenuConstructor_Form(options){options=options||{};options.formName="MainMenuConstructor";options.controller="MainMenuConstructor_Controller";options.method="get_object";MainMenuConstructor_Form.superclass.constructor.call(this,options);}
extend(MainMenuConstructor_Form,WindowFormObject); 
function User_Form(options){options=options||{};options.formName="UserDialog";options.controller="User_Controller";options.method="get_object";User_Form.superclass.constructor.call(this,options);}
extend(User_Form,WindowFormObject); 
function UserList_Form(options){options=options||{};options.formName="UserList";options.controller="User_Controller";options.method="get_list";UserList_Form.superclass.constructor.call(this,options);}
extend(UserList_Form,WindowFormObject); 
function ClientList_Form(options){options=options||{};options.formName="ClientList";options.controller="Client_Controller";options.method="get_list";ClientList_Form.superclass.constructor.call(this,options);}
extend(ClientList_Form,WindowFormObject); 
function OKEIList_Form(options){options=options||{};options.formName="OKEIList";options.controller="OKEI_Controller";options.method="get_list";OKEIList_Form.superclass.constructor.call(this,options);}
extend(OKEIList_Form,WindowFormObject); 
function MaterialList_Form(options){options=options||{};options.formName="MaterialList";options.controller="Material_Controller";options.method="get_list";MaterialList_Form.superclass.constructor.call(this,options);}
extend(MaterialList_Form,WindowFormObject); 
function OKTMO_Form(options){options=options||{};options.formName="OKTMODialog";options.controller="OKTMO_Controller";options.method="get_object";OKTMO_Form.superclass.constructor.call(this,options);}
extend(OKTMO_Form,WindowFormObject); 
function DocOrderList_Form(options){options=options||{};options.formName="DocOrderList";options.controller="DocOrder_Controller";options.method="get_list";DocOrderList_Form.superclass.constructor.call(this,options);}
extend(DocOrderList_Form,WindowFormObject); 
function DocOrderDialog_Form(options){options=options||{};options.formName="DocOrderDialog";options.controller="DocOrder_Controller";options.method="get_object";DocOrderDialog_Form.superclass.constructor.call(this,options);}
extend(DocOrderDialog_Form,WindowFormObject); 
function DocProcurementList_Form(options){options=options||{};options.formName="DocProcurementList";options.controller="DocProcurement_Controller";options.method="get_list";DocProcurementList_Form.superclass.constructor.call(this,options);}
extend(DocProcurementList_Form,WindowFormObject); 
function DocProcurementDialog_Form(options){options=options||{};options.formName="DocProcurementDialog";options.controller="DocProcurement_Controller";options.method="get_object";DocProcurementDialog_Form.superclass.constructor.call(this,options);}
extend(DocProcurementDialog_Form,WindowFormObject); 
function DocShipmentList_Form(options){options=options||{};options.formName="DocShipmentList";options.controller="DocShipment_Controller";options.method="get_list";DocShipmentList_Form.superclass.constructor.call(this,options);}
extend(DocShipmentList_Form,WindowFormObject); 
function DocShipmentDialog_Form(options){options=options||{};options.formName="DocShipmentDialog";options.controller="DocShipment_Controller";options.method="get_object";DocShipmentDialog_Form.superclass.constructor.call(this,options);}
extend(DocShipmentDialog_Form,WindowFormObject); 
function DocPassToProductionList_Form(options){options=options||{};options.formName="DocPassToProductionList";options.controller="DocPassToProduction_Controller";options.method="get_list";DocPassToProductionList_Form.superclass.constructor.call(this,options);}
extend(DocPassToProductionList_Form,WindowFormObject); 
function DocPassToProductionDialog_Form(options){options=options||{};options.formName="DocPassToProductionDialog";options.controller="DocPassToProduction_Controller";options.method="get_object";DocPassToProductionDialog_Form.superclass.constructor.call(this,options);}
extend(DocPassToProductionDialog_Form,WindowFormObject); 
function DocMovementList_Form(options){options=options||{};options.formName="DocMovementList";options.controller="DocMovement_Controller";options.method="get_list";DocMovementList_Form.superclass.constructor.call(this,options);}
extend(DocMovementList_Form,WindowFormObject); 
function DocMovementDialog_Form(options){options=options||{};options.formName="DocMovementDialog";options.controller="DocMovement_Controller";options.method="get_object";DocMovementDialog_Form.superclass.constructor.call(this,options);}
extend(DocMovementDialog_Form,WindowFormObject); 
function User_Controller(options){options=options||{};options.listModelClass=UserList_Model;options.objModelClass=UserDialog_Model;User_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();this.addComplete();this.add_get_profile();this.add_reset_pwd();this.add_login();this.add_login_refresh();this.add_login_token();this.add_logout();this.add_logout_html();}
extend(User_Controller,ControllerObjServer);User_Controller.prototype.addInsert=function(){User_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};options.required=true;var field=new FieldString("name",options);pm.addField(field);var options={};var field=new FieldString("name_full",options);pm.addField(field);var options={};options.required=true;options.enumValues='admin,employee';var field=new FieldEnum("role_id",options);pm.addField(field);var options={};var field=new FieldString("email",options);pm.addField(field);var options={};var field=new FieldPassword("pwd",options);pm.addField(field);var options={};var field=new FieldDateTimeTZ("create_dt",options);pm.addField(field);var options={};var field=new FieldBool("banned",options);pm.addField(field);var options={};var field=new FieldInt("time_zone_locale_id",options);pm.addField(field);var options={};var field=new FieldString("phone_cel",options);pm.addField(field);var options={};var field=new FieldString("tel_ext",options);pm.addField(field);var options={};options.enumValues='ru';var field=new FieldEnum("locale_id",options);pm.addField(field);var options={};options.alias="Адрес электр.почты подтвержден";var field=new FieldBool("email_confirmed",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
User_Controller.prototype.addUpdate=function(){User_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldString("name",options);pm.addField(field);var options={};var field=new FieldString("name_full",options);pm.addField(field);var options={};options.enumValues='admin,employee';options.enumValues+=(options.enumValues=='')?'':',';options.enumValues+='null';var field=new FieldEnum("role_id",options);pm.addField(field);var options={};var field=new FieldString("email",options);pm.addField(field);var options={};var field=new FieldPassword("pwd",options);pm.addField(field);var options={};var field=new FieldDateTimeTZ("create_dt",options);pm.addField(field);var options={};var field=new FieldBool("banned",options);pm.addField(field);var options={};var field=new FieldInt("time_zone_locale_id",options);pm.addField(field);var options={};var field=new FieldString("phone_cel",options);pm.addField(field);var options={};var field=new FieldString("tel_ext",options);pm.addField(field);var options={};options.enumValues='ru';var field=new FieldEnum("locale_id",options);pm.addField(field);var options={};options.alias="Адрес электр.почты подтвержден";var field=new FieldBool("email_confirmed",options);pm.addField(field);}
User_Controller.prototype.addDelete=function(){User_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};pm.addField(new FieldInt("id",options));}
User_Controller.prototype.addGetList=function(){User_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldString("name",f_opts));var f_opts={};pm.addField(new FieldString("name_full",f_opts));var f_opts={};pm.addField(new FieldEnum("role_id",f_opts));var f_opts={};pm.addField(new FieldString("phone_cel",f_opts));var f_opts={};pm.addField(new FieldString("tel_ext",f_opts));var f_opts={};pm.addField(new FieldString("email",f_opts));}
User_Controller.prototype.addGetObject=function(){User_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};f_opts.alias="Код";pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));}
User_Controller.prototype.addComplete=function(){User_Controller.superclass.addComplete.call(this);var f_opts={};var pm=this.getComplete();pm.addField(new FieldString("name",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("name");}
User_Controller.prototype.add_get_profile=function(){var opts={"controller":this};var pm=new PublicMethodServer('get_profile',opts);this.addPublicMethod(pm);}
User_Controller.prototype.add_reset_pwd=function(){var opts={"controller":this};var pm=new PublicMethodServer('reset_pwd',opts);var options={};options.required=true;pm.addField(new FieldInt("user_id",options));this.addPublicMethod(pm);}
User_Controller.prototype.add_login=function(){var opts={"controller":this};var pm=new PublicMethodServer('login',opts);var options={};options.alias="Имя пользователя";options.required=true;options.maxlength="50";pm.addField(new FieldString("name",options));var options={};options.alias="Пароль";options.required=true;options.maxlength="20";pm.addField(new FieldPassword("pwd",options));var options={};options.maxlength="2";pm.addField(new FieldString("width_type",options));this.addPublicMethod(pm);}
User_Controller.prototype.add_login_refresh=function(){var opts={"controller":this};var pm=new PublicMethodServer('login_refresh',opts);var options={};options.required=true;options.maxlength="50";pm.addField(new FieldString("refresh_token",options));this.addPublicMethod(pm);}
User_Controller.prototype.add_login_token=function(){var opts={"controller":this};var pm=new PublicMethodServer('login_token',opts);var options={};options.required=true;options.maxlength="50";pm.addField(new FieldString("token",options));this.addPublicMethod(pm);}
User_Controller.prototype.add_logout=function(){var opts={"controller":this};var pm=new PublicMethodServer('logout',opts);this.addPublicMethod(pm);}
User_Controller.prototype.add_logout_html=function(){var opts={"controller":this};var pm=new PublicMethodServer('logout_html',opts);this.addPublicMethod(pm);} 
function Login_View(id,options){Login_View.superclass.constructor.call(this,id,options);var self=this;var err_ctrl=new ErrorControl(id+":error");this.addElement(err_ctrl);var check_for_enter=function(e){e=EventHelper.fixKeyEvent(e);if(e.keyCode==13){self.login();}};this.addElement(new EditString(id+":user",{"html":"<input/>","focus":true,"maxlength":"100","cmdClear":false,"required":true,"errorControl":err_ctrl,"events":{"keydown":check_for_enter}}));this.addElement(new EditPassword(id+":pwd",{"html":"<input/>","maxlength":"50","required":true,"errorControl":err_ctrl,"events":{"keydown":check_for_enter}}));this.addElement(new Button(id+":submit_login",{"onClick":function(){self.login();}}));var contr=new User_Controller();var pm=contr.getPublicMethod("login");pm.setFieldValue("width_type",window.getWidthType());this.addCommand(new Command("login",{"publicMethod":pm,"control":this.getElement("submit_login"),"async":false,"bindings":[new DataBinding({"field":pm.getField("name"),"control":this.getElement("user")}),new DataBinding({"field":pm.getField("pwd"),"control":this.getElement("pwd")})]}));}
extend(Login_View,ViewAjx);Login_View.prototype.setError=function(s){this.getElement("error").setValue(s);}
Login_View.prototype.login=function(){var self=this;this.execCommand("login",function(){var REDIR_PAR="?redir=";var p=window.location.href.indexOf(REDIR_PAR);var redir;if(p>=0){redir="?"+CommonHelper.unserialize(decodeURI(window.location.href.substr(p+REDIR_PAR.length))).ref;}
else{redir=window.location.href;}
document.location.href=redir;},function(resp,errCode,errStr){if(errCode==1000){self.setError(self.ER_LOGIN);}
else{self.setError((errCode!=undefined)?(errCode+" "+errStr):errStr);}});} 
function MainMenuConstructorList_View(id,options){options=options||{};MainMenuConstructorList_View.superclass.constructor.call(this,id,options);var model=options.models.MainMenuConstructorList_Model;var contr=new MainMenuConstructor_Controller();var constants={"doc_per_page_count":null,"grid_refresh_interval":null};window.getApp().getConstantManager().get(constants);var popup_menu=new PopUpMenu();this.addElement(new GridAjx(id+":grid",{"model":model,"keyIds":["id"],"controller":contr,"editInline":false,"editWinClass":MainMenuConstructor_Form,"popUpMenu":popup_menu,"commands":new GridCmdContainerAjx(id+":grid:cmd"),"head":new GridHead(id+"-grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[new GridCellHead(id+":grid:head:role_descr",{"value":this.GRID_ROLE_DESCR_COL_CAP,"columns":[new EnumGridColumn_role_types({"field":model.getField("role_id")})],"sortable":true}),new GridCellHead(id+":grid:head:user_descr",{"value":this.GRID_USER_DESCR_COL_CAP,"columns":[new GridColumn({"field":model.getField("user_descr")})],"sortable":true})]})]}),"pagination":new GridPagination(id+"_page",{"countPerPage":constants.doc_per_page_count.getValue()}),"refreshInterval":0,"autoRefresh":false,"rowSelect":false,"focus":true}));}
extend(MainMenuConstructorList_View,ViewAjx); 
function MainMenuConstructor_View(id,options){options=options||{};MainMenuConstructor_View.superclass.constructor.call(this,id,options);var self=this;this.addElement(new HiddenKey(id+":id"));this.addElement(new Enum_role_types(id+":role",{"labelCaption":"Роль:"}));this.addElement(new UserEditRef(id+":user",{"labelCaption":"Пользователь:"}));this.addElement(new MainMenuTree(id+":content"));var contr=new MainMenuConstructor_Controller();this.setReadPublicMethod(contr.getPublicMethod("get_object"));this.m_model=(options.models&&options.models.MainMenuConstructorDialog_Model)?options.models.MainMenuConstructorDialog_Model:new MainMenuConstructorDialog_Model();this.setDataBindings([new DataBinding({"control":this.getElement("id")}),new DataBinding({"control":this.getElement("content")}),new DataBinding({"control":this.getElement("role"),"fieldId":"role_id"}),new DataBinding({"control":this.getElement("user"),"keyIds":["user_id"],"fieldId":"user_descr"})]);this.setController(contr);this.getCommand(this.CMD_OK).setBindings([new CommandBinding({"control":this.getElement("id")}),new CommandBinding({"control":this.getElement("content"),"fieldId":"content"}),new CommandBinding({"control":this.getElement("role"),"fieldId":"role_id"}),new CommandBinding({"control":this.getElement("user"),"fieldId":"user_id"})]);}
extend(MainMenuConstructor_View,ViewObjectAjx); 
function ViewList_View(id,options){options=options||{};ViewList_View.superclass.constructor.call(this,id,options);var model=options.models.ViewList_Model;var contr=new View_Controller();var constants={"doc_per_page_count":null};window.getApp().getConstantManager().get(constants);var filters={"section":{"binding":new CommandBinding({"control":new ViewSectionSelect(id+":filter-section",{"labelCaption":undefined,"contClassName":"form-group "+window.getBsCol(12)}),"field":new FieldString("section")}),"sign":"e"}};var popup_menu=new PopUpMenu();var self=this;var grid=new GridAjx(id+":grid",{"model":model,"keyIds":["id"],"controller":contr,"editInline":null,"editWinClass":null,"popUpMenu":popup_menu,"commands":new GridCmdContainerAjx(id+":grid:cmd",{"filters":filters,"cmdInsert":false,"cmdCopy":new GridCmd(id+":grid:cmd:openNewWin",{"glyph":"glyphicon glyphicon-duplicate","title":this.OPEN_WIN_TITLE,"showCmdControl":false,"onCommand":function(){var fields=this.m_grid.getModelRow();if(fields){var href=self.getObjectHref(fields);var win=window.open(href,"_blank");win.focus();}}}),"cmdDelete":false,"cmdEdit":new GridCmd(id+":grid:cmd:open",{"glyph":"glyphicon-eye-open","title":this.OPEN_TITLE,"showCmdControl":false,"onCommand":function(){this.m_grid.onEdit();}})}),"head":new GridHead(id+"-grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[new GridCellHead(id+":grid:head:user_descr",{"value":this.GRID_COL_CAP,"columns":[new GridColumn({"field":model.getField("user_descr"),"formatFunction":function(fields,cell){var href=self.getObjectHref(fields);var cell_n=cell.getNode();var t_tag=document.createElement("A");t_tag.setAttribute("href",href);t_tag.setAttribute("target","_blank");t_tag.setAttribute("title",self.OPEN_WIN_TITLE);t_tag.textContent=fields.user_descr.getValue();cell_n.appendChild(t_tag);}})]})]})]}),"pagination":new GridPagination(id+"_page",{"countPerPage":constants.doc_per_page_count.getValue()}),"autoRefresh":false,"refreshInterval":0,"rowSelect":false,"focus":true});grid.edit=function(){var row=this.getModelRow();window.getApp().showMenuItem(null,row.c.getValue(),row.f.getValue(),row.t.getValue());}
this.addElement(grid);}
extend(ViewList_View,ViewAjxList);ViewList_View.prototype.getObjectHref=function(fields){var href="";var c=fields.c.getValue();var f=fields.f.getValue();var t=fields.t.getValue();if(c&&c.length)href+=(href==""?"":"&")+"c="+c;if(f&&f.length)href+=(href==""?"":"&")+"f="+f;if(t&&t.length)href+=(href==""?"":"&")+"t="+t;href+=(href==""?"":"&")+"v=Child";window.getChildParam=function(){}
return"?"+href;} 
function About_View(id,options){options=options||{};options.tagName="template";this.model=options.models.About_Model;this.model.getRow(0);options.templateOptions={"LB_APP_NAME":this.LB_APP_NAME,"LB_VERSION":this.LB_VERSION,"LB_AUTHOR":this.LB_AUTHOR,"LB_TECH_MAIL":this.LB_TECH_MAIL,"LB_DB_NAME":this.LB_DB_NAME,"LB_FW_SERVER_VERSION":this.LB_FW_SERVER_VERSION,"LB_FW_CLIENT_VERSION":this.LB_FW_CLIENT_VERSION,"VERSION":window.getApp().VERSION};var fields=this.model.getFields();for(var fid in fields){options.templateOptions[fid]=fields[fid].getValue();}
About_View.superclass.constructor.call(this,id,options);}
extend(About_View,ViewAjx); 
function ConstantList_View(id,options){ConstantList_View.superclass.constructor.call(this,id,options);this.addElement(new ConstantGrid(id+":grid",{"model":options.models.ConstantList_Model}));}
extend(ConstantList_View,ViewAjx); 
function ProjectManager_View(id,options){options=options||{};options.addElement=function(){this.addElement(new ButtonCmd(id+":apply_patch",{"caption":"Установить обновление","onClick":function(){(new ProjectManager_Controller()).getPublicMethod("apply_patch").run({"ok":function(resp){}})}}));this.addElement(new ButtonCmd(id+":apply_sql",{"caption":"Выполнить скрипты sql","onClick":function(){(new ProjectManager_Controller()).getPublicMethod("apply_sql").run({"ok":function(resp){}})}}));}
ProjectManager_View.superclass.constructor.call(this,id,options);}
extend(ProjectManager_View,View); 
function LoginList_View(id,options){LoginList_View.superclass.constructor.call(this,id,options);var model=(options.models&&options.models.LoginList)?options.models.LoginList_Model:new LoginList_Model();var contr=new Login_Controller();var constants={"doc_per_page_count":null,"grid_refresh_interval":null};window.getApp().getConstantManager().get(constants);var popup_menu=new PopUpMenu();var pagClass=window.getApp().getPaginationClass();this.addElement(new GridAjx(id+":grid",{"model":model,"controller":contr,"editInline":null,"editWinClass":null,"commands":new GridCmdContainerAjx(id+":grid:cmd",{"cmdInsert":false,"cmdEdit":false}),"popUpMenu":popup_menu,"head":new GridHead(id+"-grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[,new GridCellHead(id+":grid:head:users_ref",{"value":this.GRID_USER_COL_CAP,"columns":[new GridColumnRef({"field":model.getField("users_ref"),"form":User_Form,"ctrlClass":UserEditRef,"searchOptions":{"field":new FieldInt("user_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:date_time_in",{"value":this.GRID_DATE_TIME_IN_COL_CAP,"columns":[new GridColumnDate({"field":model.getField("date_time_in"),"dateFormat":"d/m/y H:i"})],"sortable":true,"sort":"asc"}),new GridCellHead(id+":grid:head:date_time_out",{"value":this.GRID_DATE_TIME_OUT_COL_CAP,"columns":[new GridColumnDate({"field":model.getField("date_time_out"),"dateFormat":"d/m/y H:i"})],"sortable":true}),new GridCellHead(id+":grid:head:session_set_time",{"value":this.GRID_SET_DATE_TIME_COL_CAP,"columns":[new GridColumnDate({"field":model.getField("session_set_time"),"dateFormat":"d/m/y H:i"})],"sortable":true}),new GridCellHead(id+":grid:head:ip",{"value":this.GRID_IP_COL_CAP,"columns":[new GridColumn({"field":model.getField("ip")})]}),new GridCellHead(id+":grid:head:headers",{"value":"Заголовки","columns":[new GridColumn({"field":model.getField("headers")})]})]})]}),"pagination":new pagClass(id+"_page",{"countPerPage":!options.detail?constants.doc_per_page_count.getValue():this.REC_COUNT_IN_DLG_MODE}),"autoRefresh":false,"refreshInterval":constants.grid_refresh_interval.getValue()*1000,"rowSelect":false,"focus":true}));}
extend(LoginList_View,ViewAjxList);LoginList_View.prototype.REC_COUNT_IN_DLG_MODE=10; 
function UserList_View(id,options){UserList_View.superclass.constructor.call(this,id,options);var model=options.models.UserList_Model;var contr=new User_Controller();var constants={"doc_per_page_count":null,"grid_refresh_interval":null};window.getApp().getConstantManager().get(constants);var popup_menu=new PopUpMenu();this.addElement(new GridAjx(id+":grid",{"model":model,"controller":contr,"editInline":false,"editWinClass":User_Form,"commands":new GridCmdContainerAjx(id+":grid:cmd"),"popUpMenu":popup_menu,"head":new GridHead(id+"-grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[new GridCellHead(id+":grid:head:id",{"value":this.COL_ID_CAP,"columns":[new GridColumn({"field":model.getField("id")})],"sortable":true}),new GridCellHead(id+":grid:head:name",{"value":this.COL_NAME,"columns":[new GridColumn({"field":model.getField("name")})],"sortable":true,"sort":"asc"}),new GridCellHead(id+":grid:head:name_full",{"value":this.COL_NAME_FULL,"columns":[new GridColumn({"field":model.getField("name_full")})],"sortable":true}),new GridCellHead(id+":grid:head:email",{"value":this.COL_EMAIL,"columns":[new GridColumn({"field":model.getField("email")})]}),new GridCellHead(id+":grid:head:oktmo_ref",{"value":"ОКТМО","columns":[new GridColumnRef({"field":model.getField("oktmo_ref"),"ctrlClass":OKTMOEdit})]})]})]}),"pagination":new GridPagination(id+"_page",{"countPerPage":constants.doc_per_page_count.getValue()}),"autoRefresh":false,"refreshInterval":constants.grid_refresh_interval.getValue()*1000,"rowSelect":false,"focus":true}));}
extend(UserList_View,ViewAjxList); 
UserList_View.prototype.HEAD_TITLE="Пользолватели";UserList_View.prototype.COL_ID_CAP="Код";UserList_View.prototype.COL_NAME="Логин";UserList_View.prototype.COL_NAME_FULL="ФИО";UserList_View.prototype.COL_EMAIL="Эл.почта"; 
function UserDialog_View(id,options){options=options||{};options.controller=new User_Controller();options.model=(options.models&&options.models.UserDialog_Model)?options.models.UserDialog_Model:new UserDialog_Model();options.addElement=function(){this.addElement(new UserNameEdit(id+":name"));this.addElement(new Enum_role_types(id+":role",{"labelCaption":"Роль:","required":true}));this.addElement(new EditEmail(id+":email",{"labelCaption":"Эл.почта:"}));this.addElement(new EditPhone(id+":phone_cel",{"labelCaption":"Моб.телефон:"}));this.addElement(new EditString(id+":name_full",{"maxLength":"200","labelCaption":"ФИО:"}));this.addElement(new OKTMOEdit(id+":oktmo_ref",{}));}
UserDialog_View.superclass.constructor.call(this,id,options);var r_bd=[new DataBinding({"control":this.getElement("name")}),new DataBinding({"control":this.getElement("name_full")}),new DataBinding({"control":this.getElement("role"),"field":this.m_model.getField("role_id")}),new DataBinding({"control":this.getElement("oktmo_id"),"field":this.m_model.getField("oktmo_ref")}),new DataBinding({"control":this.getElement("email")})];this.setDataBindings(r_bd);this.setWriteBindings([new CommandBinding({"control":this.getElement("name")}),new CommandBinding({"control":this.getElement("name_full")}),new CommandBinding({"control":this.getElement("role"),"fieldId":"role_id"}),new CommandBinding({"control":this.getElement("oktmo_id"),"fieldId":"oktmo_ref"}),new CommandBinding({"control":this.getElement("email")})]);}
extend(UserDialog_View,ViewObjectAjx); 
function UserProfile_View(id,options){options=options||{};options.cmdOkAsync=false;options.cmdOk=false;options.cmdCancel=false;var self=this;options.addElement=function(){this.addElement(new UserNameEdit(id+":name",{"events":{"keyup":function(){self.getControlSave().setEnabled(true);}}}));this.addElement(new EditPassword(id+":pwd",{"labelCaption":"Пароль:","events":{"keyup":function(){self.checkPass();}}}));this.addElement(new EditPassword(id+":pwd_confirm",{"labelCaption":"Подтверждение пароля:","events":{"keyup":function(){self.checkPass();}}}));this.addElement(new EditEmail(id+":email",{"labelCaption":"Эл.почта:","events":{"keyup":function(){self.getControlSave().setEnabled(true);}}}));this.addElement(new EditString(id+":tel_ext",{"maxLength":10,"labelCaption":"Внутр.номер:","events":{"keyup":function(){self.getControlSave().setEnabled(true);}}}));this.addElement(new EditPhone(id+":phone_cel",{"labelCaption":"Мобильный телефон:","events":{"keyup":function(){self.getControlSave().setEnabled(true);}}}));this.addElement(new Enum_locales(id+":locale_id",{"labelCaption":"Локаль:","required":true}));this.addElement(new TimeZoneLocaleEdit(id+":time_zone_locales_ref",{}));this.addElement(new EditString(id+":name_full",{"maxLength":200,"labelCaption":"ФИО:","events":{"keyup":function(){self.getControlSave().setEnabled(true);}}}));}
UserProfile_View.superclass.constructor.call(this,id,options);var contr=new User_Controller();this.setReadPublicMethod(contr.getPublicMethod("get_profile"));this.m_model=options.models.UserProfile_Model;this.setDataBindings([new DataBinding({"control":this.getElement("id"),"model":this.m_model}),new DataBinding({"control":this.getElement("name"),"model":this.m_model}),new DataBinding({"control":this.getElement("name_full"),"model":this.m_model}),new DataBinding({"control":this.getElement("email"),"model":this.m_model}),new DataBinding({"control":this.getElement("phone_cel"),"model":this.m_model}),new DataBinding({"control":this.getElement("tel_ext"),"model":this.m_model}),new DataBinding({"control":this.getElement("locale_id"),"model":this.m_model}),new DataBinding({"control":this.getElement("time_zone_locales_ref")})]);this.setController(contr);this.getCommand(this.CMD_OK).setBindings([new CommandBinding({"control":this.getElement("id")}),new CommandBinding({"control":this.getElement("name")}),new CommandBinding({"control":this.getElement("name_full")}),new CommandBinding({"control":this.getElement("email")}),new CommandBinding({"control":this.getElement("phone_cel")}),new CommandBinding({"control":this.getElement("tel_ext")}),new CommandBinding({"control":this.getElement("locale_id")}),new CommandBinding({"control":this.getElement("time_zone_locales_ref"),"fieldId":"time_zone_locale_id"})]);this.getControlSave().setEnabled(false);}
extend(UserProfile_View,ViewObjectAjx);UserProfile_View.prototype.TXT_PWD_ER="Пароли не совпадают";UserProfile_View.prototype.checkPass=function(){var pwd=this.getElement("pwd").getValue();if(pwd&&pwd.length){var pwd_conf=this.getElement("pwd_confirm").getValue();if(pwd_conf&&pwd_conf.length&&pwd!=pwd_conf){this.getElement("pwd_confirm").setNotValid(this.TXT_PWD_ER);this.getControlSave().setEnabled(false);}
else if(pwd_conf&&pwd_conf.length){this.getElement("pwd_confirm").setValid();if(!this.getControlSave().getEnabled()){this.getControlSave().setEnabled(true);}}
else if((!pwd_conf||!pwd_conf.length)&&this.getControlSave().getEnabled()){this.getControlSave().setEnabled(false);}}} 
function TimeZoneLocale_View(id,options){TimeZoneLocale_View.superclass.constructor.call(this,id,options);var model=options.models.TimeZoneLocale_Model;var contr=new TimeZoneLocale_Controller();var popup_menu=new PopUpMenu();this.addElement(new GridAjx(id+":grid",{"keyIds":["id"],"model":model,"controller":contr,"editInline":true,"editWinClass":null,"cmdInsert":false,"commands":new GridCmdContainerAjx(id+":grid:cmd",{"cmdInsert":false,"cmdSearch":false}),"popUpMenu":popup_menu,"head":new GridHead(id+"-grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[new GridCellHead(id+":grid:head:name",{"value":"Наименование","columns":[new GridColumn({"field":model.getField("name")})],"sortable":true,"sort":"asc"}),new GridCellHead(id+":grid:head:descr",{"value":"Описание","columns":[new GridColumn({"field":model.getField("descr")})],"sortable":true}),new GridCellHead(id+":grid:head:hour_dif",{"value":"Разница GMT в часах","colAttrs":{"align":"right"},"columns":[new GridColumn({"field":model.getField("hour_dif")})],"sortable":true})]})]}),"autoRefresh":false,"focus":true,"rowSelect":true}));}
extend(TimeZoneLocale_View,ViewAjx); 
function ClientList_View(id,options){options.HEAD_TITLE="Контрагенты";ClientList_View.superclass.constructor.call(this,id,options);var model=(options.models&&options.models.Client_Model)?options.models.Client_Model:new Client_Model();var contr=new Client_Controller();var constants={"doc_per_page_count":null,"grid_refresh_interval":null};window.getApp().getConstantManager().get(constants);var popup_menu=new PopUpMenu();this.addElement(new GridAjx(id+":grid",{"model":model,"controller":contr,"editInline":true,"editWinClass":null,"commands":new GridCmdContainerAjx(id+":grid:cmd"),"popUpMenu":popup_menu,"head":new GridHead(id+"-grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[new GridCellHead(id+":grid:head:name",{"value":"Наименование","columns":[new GridColumn({"field":model.getField("name")})],"className":window.getBsCol(8),"sortable":true,"sort":"asc"}),new GridCellHead(id+":grid:head:inn",{"value":"ИНН","columns":[new GridColumn({"field":model.getField("inn")})],"className":window.getBsCol(4)})]})]}),"pagination":new GridPagination(id+"_page",{"countPerPage":constants.doc_per_page_count.getValue()}),"autoRefresh":false,"refreshInterval":constants.grid_refresh_interval.getValue()*1000,"rowSelect":false,"focus":true}));}
extend(ClientList_View,ViewAjxList); 
function OKEIList_View(id,options){options=options||{};OKEIList_View.superclass.constructor.call(this,id,options);var model=options.models.OKEIList_Model;var contr=new OKEI_Controller();var constants={"doc_per_page_count":null};window.getApp().getConstantManager().get(constants);var pagClass=window.getApp().getPaginationClass();var popup_menu=new PopUpMenu();this.addElement(new GridAjx(id+":grid",{"model":model,"keyIds":["code"],"controller":contr,"editInline":null,"editWinClass":null,"popUpMenu":popup_menu,"commands":new GridCmdContainerAjx(id+":grid:cmd",{"cmdInsert":false,"cmdEdit":false,"cmdDelete":false}),"head":new GridHead(id+":grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[new GridCellHead(id+":grid:head:code",{"value":"Код","columns":[new GridColumn({"field":model.getField("code")})]}),new GridCellHead(id+":grid:head:okei_sections_ref",{"value":"Группа","columns":[new GridColumnRef({"field":model.getField("okei_sections_ref")})]}),new GridCellHead(id+":grid:head:name_full",{"value":"Наименование","columns":[new GridColumn({"field":model.getField("name_full")})]}),new GridCellHead(id+":grid:head:name_nat",{"value":"Нац.наименование","columns":[new GridColumn({"field":model.getField("name_nat")})]}),new GridCellHead(id+":grid:head:name_internat",{"value":"Межд.наименование","columns":[new GridColumn({"field":model.getField("name_internat")})]}),new GridCellHead(id+":grid:head:code_internat",{"value":"Нац.код","columns":[new GridColumn({"field":model.getField("code_internat")})]}),new GridCellHead(id+":grid:head:code_internat",{"value":"Межд.код","columns":[new GridColumn({"field":model.getField("code_internat")})]})]})]}),"pagination":new pagClass(id+"_page",{"countPerPage":constants.doc_per_page_count.getValue()}),"autoRefresh":false,"refreshInterval":0,"rowSelect":false,"focus":true}));}
extend(OKEIList_View,ViewAjxList); 
function MaterialList_View(id,options){options=options||{};MaterialList_View.superclass.constructor.call(this,id,options);var model=options.models.MaterialList_Model;var contr=new Material_Controller();var constants={"doc_per_page_count":null};window.getApp().getConstantManager().get(constants);var pagClass=window.getApp().getPaginationClass();var popup_menu=new PopUpMenu();this.addElement(new GridAjx(id+":grid",{"model":model,"keyIds":["id"],"controller":contr,"editInline":true,"editWinClass":null,"popUpMenu":popup_menu,"commands":new GridCmdContainerAjx(id+":grid:cmd"),"head":new GridHead(id+":grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[new GridCellHead(id+":grid:head:name",{"value":"Наименование","columns":[new GridColumn({"field":model.getField("name"),"ctrlClass":EditString,"ctrlOptions":{"labelCaption":""}})],"sortable":true,"sort":"asc"}),new GridCellHead(id+":grid:head:name_full",{"value":"Описание","columns":[new GridColumn({"field":model.getField("name_full"),"ctrlClass":EditString,"ctrlOptions":{"labelCaption":""}})]}),new GridCellHead(id+":grid:head:okei_ref",{"value":"Единица","columns":[new GridColumnRef({"field":model.getField("okei_ref"),"ctrlClass":OKEIEdit,"ctrlBindFieldId":"okei_code","ctrlOptions":{"labelCaption":""}})]})]})]}),"pagination":new pagClass(id+"_page",{"countPerPage":constants.doc_per_page_count.getValue()}),"autoRefresh":false,"refreshInterval":0,"rowSelect":false,"focus":true}));}
extend(MaterialList_View,ViewAjxList); 
function OKTMOList_View(id,options){OKTMOList_View.superclass.constructor.call(this,id,options);var model=options.models.OKTMO_Model;var contr=new OKTMO_Controller();var constants={"doc_per_page_count":null,"grid_refresh_interval":null};window.getApp().getConstantManager().get(constants);var popup_menu=new PopUpMenu();this.addElement(new GridAjx(id+":grid",{"model":model,"controller":contr,"editInline":false,"editWinClass":OKTMO_Form,"commands":new GridCmdContainerAjx(id+":grid:cmd"),"popUpMenu":popup_menu,"head":new GridHead(id+"-grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[new GridCellHead(id+":grid:head:name",{"value":"Наименование","columns":[new GridColumn({"field":model.getField("name")})],"sort":"asc","sortable":true})]})]}),"pagination":new GridPagination(id+"_page",{"countPerPage":constants.doc_per_page_count.getValue()}),"autoRefresh":false,"refreshInterval":constants.grid_refresh_interval.getValue()*1000,"rowSelect":false,"focus":true}));}
extend(OKTMOList_View,ViewAjxList); 
function OKTMOContractList_View(id,options){options=options||{};options.HEAD_TITLE="Контракты ОКТМО";OKTMOContractList_View.superclass.constructor.call(this,id,options);var model=(options.models&&options.models.OKTMOContractList_Model)?options.models.OKTMOContractList_Model:new OKTMOContractList_Model();var contr=new OKTMOContract_Controller();var constants={"doc_per_page_count":null,"grid_refresh_interval":null};window.getApp().getConstantManager().get(constants);var pagClass=window.getApp().getPaginationClass();var popup_menu=new PopUpMenu();var filters={"application_state":{"binding":new CommandBinding({"control":new OKTMOContractEdit(id+":filter-ctrl-oktmo_contract",{"contClassName":"form-group-filter"}),"field":new FieldInt("oktmo_contract")}),"sign":"e"}};this.addElement(new GridAjx(id+":grid",{"model":model,"keyIds":["id"],"controller":contr,"editInline":true,"editWinClass":null,"popUpMenu":popup_menu,"commands":new GridCmdContainerAjx(id+":grid:cmd",{"filters":filters,"variantStorage":options.variantStorage}),"head":new GridHead(id+":grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[!options.detail?new GridCellHead(id+":grid:head:oktmo_ref",{"value":"ОКТМО","columns":[new GridColumnRef({"field":model.getField("oktmo_ref"),"ctrlClass":OKTMOEdit})]}):null,new GridCellHead(id+":grid:head:name",{"value":"Наименование","columns":[new GridColumn({"field":model.getField("name")})]})]})]}),"pagination":null,"autoRefresh":false,"refreshInterval":constants.grid_refresh_interval.getValue()*1000,"rowSelect":false,"focus":true}));}
extend(OKTMOContractList_View,ViewAjxList); 
function OKTMODialog_View(id,options){options=options||{};options.controller=new OKTMO_Controller();options.model=(options.models&&options.models.OKTMO_Model)?options.models.OKTMO_Model:new OKTMO_Model();options.addElement=function(){this.addElement(new EditString(id+":name",{"maxLength":"500","labelCaption":"Наименование:"}));this.addElement(new OKTMOContractList_View(id+":oktmo_contracts_list",{"detail":true}));}
OKTMODialog_View.superclass.constructor.call(this,id,options);var r_bd=[new DataBinding({"control":this.getElement("name")}),];this.setDataBindings(r_bd);this.setWriteBindings([new CommandBinding({"control":this.getElement("name")}),]);this.addDetailDataSet({"control":this.getElement("oktmo_contracts_list").getElement("grid"),"controlFieldId":"oktmo_id","field":this.m_model.getField("id")});}
extend(OKTMODialog_View,ViewObjectAjx); 
function DocOrderList_View(id,options){options.HEAD_TITLE="Заказы материалов";DocOrderList_View.superclass.constructor.call(this,id,options);var model=options.models.DocOrderList_Model;var contr=new DocOrder_Controller();var constants={"doc_per_page_count":null,"grid_refresh_interval":null};window.getApp().getConstantManager().get(constants);var popup_menu=new PopUpMenu();var period_ctrl=new EditPeriodDate(id+":filter-ctrl-period",{"field":new FieldDateTime("date_time")});var filters=options.fromApp?null:{"period":{"binding":new CommandBinding({"control":period_ctrl,"field":period_ctrl.getField()}),"bindings":[{"binding":new CommandBinding({"control":period_ctrl.getControlFrom(),"field":period_ctrl.getField()}),"sign":"ge"},{"binding":new CommandBinding({"control":period_ctrl.getControlTo(),"field":period_ctrl.getField()}),"sign":"le"}]},"oktmo":{"binding":new CommandBinding({"control":new OKTMOEdit(id+":filter-ctrl-oktmo",{"contClassName":"form-group-filter","labelCaption":"ОКТМО:","dependBaseControl":"filter-ctrl-oktmo_contract","dependBaseFieldIds":["id"],"dependFieldIds":["oktmo_id"]}),"field":new FieldInt("oktmo_id")}),"sign":"e"},"oktmo_contract":{"binding":new CommandBinding({"control":new OKTMOContractEdit(id+":filter-ctrl-oktmo_contract",{"contClassName":"form-group-filter","labelCaption":"Контракт:"}),"field":new FieldInt("oktmo_contract_id")}),"sign":"e"},"user":{"binding":new CommandBinding({"control":new UserEditRef(id+":filter-ctrl-user",{"contClassName":"form-group-filter","labelCaption":"Пользователь:"}),"field":new FieldInt("oktmo_contract_id")}),"sign":"e"},"closed":{"binding":new CommandBinding({"control":new EditCheckBox(id+":filter-ctrl-closed",{"contClassName":"form-group-filter","labelCaption":"Закрыт:"}),"field":new FieldBool("closed")}),"sign":"e"}};this.addElement(new GridAjx(id+":grid",{"model":model,"controller":contr,"editInline":false,"editWinClass":DocOrderDialog_Form,"commands":new GridCmdContainerAjx(id+":grid:cmd",{"cmdFilter":options.fromApp?false:true,"filters":filters,"variantStorage":options.variantStorage}),"popUpMenu":popup_menu,"head":new GridHead(id+"-grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[new GridCellHead(id+":grid:head:id",{"value":"№","columns":[new GridColumn({"field":model.getField("id"),"searchOptions":{"field":new FieldInt("id"),"searchType":"on_match"}})],"sortable":true}),new GridCellHead(id+":grid:head:date_time",{"value":"Дата создания","columns":[new GridColumnDateTime({"field":model.getField("date_time"),"ctrlClass":EditDate,"searchOptions":{"field":new FieldDate("date_time"),"searchType":"on_beg"}})],"sortable":true,"sort":"desc"}),new GridCellHead(id+":grid:head:oktmo_ref",{"value":"ОКТМО","columns":[new GridColumnRef({"field":model.getField("oktmo_ref"),"ctrlClass":OKTMOEdit,"searchOptions":{"field":new FieldInt("oktmo_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:oktmo_contracts_ref",{"value":"Контракт","columns":[new GridColumnRef({"field":model.getField("oktmo_contracts_ref"),"ctrlClass":OKTMOContractEdit,"searchOptions":{"field":new FieldInt("oktmo_contract_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:users_ref",{"value":"Пользователь","columns":[new GridColumnRef({"field":model.getField("users_ref"),"ctrlClass":UserEditRef,"searchOptions":{"field":new FieldInt("user_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:closed_inf",{"value":"Закрыт","columns":[new GridColumn({"formatFunction":function(fields){console.log(fields)}})]})]})]}),"pagination":new GridPagination(id+"_page",{"countPerPage":constants.doc_per_page_count.getValue()}),"autoRefresh":false,"refreshInterval":constants.grid_refresh_interval.getValue()*1000,"rowSelect":false,"focus":true}));}
extend(DocOrderList_View,ViewAjxList); 
function DocOrderDialog_View(id,options){options=options||{};options.controller=new DocOrder_Controller();options.model=(options.models&&options.models.DocOrderDialog_Model)?options.models.DocOrderDialog_Model:new DocOrderDialog_Model();var is_employee=(window.getApp().getServVar("role_id")=="employee");options.addElement=function(){this.addElement(new EditInt(id+":id",{"inline":true,"enabled":!is_employee}));this.addElement(new EditDateTime(id+":date_time",{"inline":true,"dateFormat":"d/m/y H:i","editMask":"99/99/99 99:99"}));this.addElement(new OKTMOEdit(id+":oktmo_ref",{"required":true,"dependBaseControl":"oktmo_contracts_ref","dependBaseFieldIds":["id"],"dependFieldIds":["oktmo_id"]}));this.addElement(new OKTMOContractEdit(id+":oktmo_contracts_ref",{"required":true}));this.addElement(new EditCheckBox(id+":closed",{"labelCaption":"Закрыт:","title":"Закрыть/сделать доступным документ","enabled":!is_employee}));this.addElement(new Control(id+":closed_inf",{}));var app=window.getApp();this.addElement(new UserEditRef(id+":users_ref",{"labelCaption":"Автор:","value":new RefType({"keys":{"id":app.getServVar("user_id")},"descr":app.getServVar("user_name")}),"enabled":!is_employee}));this.addElement(new DocMaterialGrid(id+":materials",{}));}
DocOrderDialog_View.superclass.constructor.call(this,id,options);this.setDataBindings([new DataBinding({"control":this.getElement("date_time")}),new DataBinding({"control":this.getElement("oktmo_ref"),"fieldId":"oktmo_id"}),new DataBinding({"control":this.getElement("oktmo_contracts_ref"),"fieldId":"oktmo_contract_id"}),new DataBinding({"control":this.getElement("closed")}),new DataBinding({"control":this.getElement("users_ref"),"fieldId":"user_id"}),new DataBinding({"control":this.getElement("materials"),"fieldId":"materials"})]);this.setWriteBindings([new CommandBinding({"control":this.getElement("date_time")}),new CommandBinding({"control":this.getElement("oktmo_ref"),"fieldId":"oktmo_id"}),new CommandBinding({"control":this.getElement("oktmo_contracts_ref"),"fieldId":"oktmo_contract_id"}),new CommandBinding({"control":this.getElement("closed")}),new CommandBinding({"control":this.getElement("users_ref"),"fieldId":"user_id"}),new CommandBinding({"control":this.getElement("materials"),"fieldId":"materials"})]);}
extend(DocOrderDialog_View,ViewObjectAjx); 
function DocShipmentList_View(id,options){options.HEAD_TITLE="Отгрузки материалов";DocShipmentList_View.superclass.constructor.call(this,id,options);var model=options.models.DocShipmentList_Model;var contr=new DocShipment_Controller();var constants={"doc_per_page_count":null,"grid_refresh_interval":null};window.getApp().getConstantManager().get(constants);var popup_menu=new PopUpMenu();var period_ctrl=new EditPeriodDate(id+":filter-ctrl-period",{"field":new FieldDateTime("date_time")});var filters=options.fromApp?null:{"period":{"binding":new CommandBinding({"control":period_ctrl,"field":period_ctrl.getField()}),"bindings":[{"binding":new CommandBinding({"control":period_ctrl.getControlFrom(),"field":period_ctrl.getField()}),"sign":"ge"},{"binding":new CommandBinding({"control":period_ctrl.getControlTo(),"field":period_ctrl.getField()}),"sign":"le"}]},"oktmo":{"binding":new CommandBinding({"control":new OKTMOEdit(id+":filter-ctrl-oktmo",{"contClassName":"form-group-filter","labelCaption":"ОКТМО:","dependBaseControl":"filter-ctrl-oktmo_contract","dependBaseFieldIds":["id"],"dependFieldIds":["oktmo_id"]}),"field":new FieldInt("oktmo_id")}),"sign":"e"},"oktmo_contract":{"binding":new CommandBinding({"control":new OKTMOContractEdit(id+":filter-ctrl-oktmo_contract",{"contClassName":"form-group-filter","labelCaption":"Контракт:"}),"field":new FieldInt("oktmo_contract_id")}),"sign":"e"},"user":{"binding":new CommandBinding({"control":new UserEditRef(id+":filter-ctrl-user",{"contClassName":"form-group-filter","labelCaption":"Пользователь:"}),"field":new FieldInt("oktmo_contract_id")}),"sign":"e"}};this.addElement(new GridAjx(id+":grid",{"model":model,"controller":contr,"editInline":false,"editWinClass":DocShipmentDialog_Form,"commands":new GridCmdContainerAjx(id+":grid:cmd",{"cmdFilter":options.fromApp?false:true,"filters":filters,"variantStorage":options.variantStorage}),"popUpMenu":popup_menu,"head":new GridHead(id+"-grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[new GridCellHead(id+":grid:head:id",{"value":"№","columns":[new GridColumn({"field":model.getField("id"),"searchOptions":{"field":new FieldInt("id"),"searchType":"on_match"}})],"sortable":true}),new GridCellHead(id+":grid:head:date_time",{"value":"Дата создания","columns":[new GridColumnDateTime({"field":model.getField("date_time"),"ctrlClass":EditDate,"searchOptions":{"field":new FieldDate("date_time"),"searchType":"on_beg"}})],"sortable":true,"sort":"desc"}),new GridCellHead(id+":grid:head:oktmo_ref",{"value":"ОКТМО","columns":[new GridColumnRef({"field":model.getField("oktmo_ref"),"ctrlClass":OKTMOEdit,"searchOptions":{"field":new FieldInt("oktmo_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:oktmo_contracts_ref",{"value":"Контракт","columns":[new GridColumnRef({"field":model.getField("oktmo_contracts_ref"),"ctrlClass":OKTMOContractEdit,"searchOptions":{"field":new FieldInt("oktmo_contract_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:users_ref",{"value":"Пользователь","columns":[new GridColumnRef({"field":model.getField("users_ref"),"ctrlClass":UserEditRef,"searchOptions":{"field":new FieldInt("user_id"),"searchType":"on_match","typeChange":false}})],"sortable":true})]})]}),"pagination":new GridPagination(id+"_page",{"countPerPage":constants.doc_per_page_count.getValue()}),"autoRefresh":false,"refreshInterval":constants.grid_refresh_interval.getValue()*1000,"rowSelect":false,"focus":true}));}
extend(DocShipmentList_View,ViewAjxList); 
function DocShipmentDialog_View(id,options){options=options||{};options.controller=new DocShipment_Controller();options.model=(options.models&&options.models.DocShipmentDialog_Model)?options.models.DocShipmentDialog_Model:new DocShipmentDialog_Model();var is_employee=(window.getApp().getServVar("role_id")=="employee");options.addElement=function(){this.addElement(new EditInt(id+":id",{"inline":true,"enabled":!is_employee}));this.addElement(new EditDate(id+":ship_date",{"labelCaption":"Дата отгрузки:"}));this.addElement(new EditDateTime(id+":date_time",{"inline":true,"dateFormat":"d/m/y H:i","editMask":"99/99/99 99:99"}));this.addElement(new OKTMOEdit(id+":oktmo_ref",{"required":true,"dependBaseControl":"oktmo_contracts_ref","dependBaseFieldIds":["id"],"dependFieldIds":["oktmo_id"]}));this.addElement(new OKTMOContractEdit(id+":oktmo_contracts_ref",{"required":true}));this.addElement(new EditCheckBox(id+":closed",{"labelCaption":"Закрыт:","title":"Закрыть/сделать доступным документ","enabled":!is_employee}));this.addElement(new EditString(id+":barge_num",{"labelCaption":"№ баржи:","title":"Номер баржи","enabled":!is_employee}));var app=window.getApp();this.addElement(new UserEditRef(id+":users_ref",{"labelCaption":"Автор:","value":new RefType({"keys":{"id":app.getServVar("user_id")},"descr":app.getServVar("user_name")}),"enabled":!is_employee}));this.addElement(new DocMaterialGrid(id+":materials",{}));}
DocShipmentDialog_View.superclass.constructor.call(this,id,options);this.setDataBindings([new DataBinding({"control":this.getElement("date_time")}),new DataBinding({"control":this.getElement("ship_date")}),new DataBinding({"control":this.getElement("oktmo_ref"),"fieldId":"oktmo_id"}),new DataBinding({"control":this.getElement("oktmo_contracts_ref"),"fieldId":"oktmo_contract_id"}),new DataBinding({"control":this.getElement("barge_num")}),new DataBinding({"control":this.getElement("users_ref"),"fieldId":"user_id"}),new DataBinding({"control":this.getElement("materials"),"fieldId":"materials"})]);this.setWriteBindings([new CommandBinding({"control":this.getElement("date_time")}),new CommandBinding({"control":this.getElement("ship_date")}),new CommandBinding({"control":this.getElement("oktmo_ref"),"fieldId":"oktmo_id"}),new CommandBinding({"control":this.getElement("oktmo_contracts_ref"),"fieldId":"oktmo_contract_id"}),new CommandBinding({"control":this.getElement("barge_num")}),new CommandBinding({"control":this.getElement("users_ref"),"fieldId":"user_id"}),new CommandBinding({"control":this.getElement("materials"),"fieldId":"materials"})]);}
extend(DocShipmentDialog_View,ViewObjectAjx); 
function DocPassToProductionList_View(id,options){options.HEAD_TITLE="Передача материалов в производство";DocPassToProductionList_View.superclass.constructor.call(this,id,options);var model=options.models.DocPassToProductionList_Model;var contr=new DocPassToProduction_Controller();var constants={"doc_per_page_count":null,"grid_refresh_interval":null};window.getApp().getConstantManager().get(constants);var popup_menu=new PopUpMenu();var period_ctrl=new EditPeriodDate(id+":filter-ctrl-period",{"field":new FieldDateTime("date_time")});var filters=options.fromApp?null:{"period":{"binding":new CommandBinding({"control":period_ctrl,"field":period_ctrl.getField()}),"bindings":[{"binding":new CommandBinding({"control":period_ctrl.getControlFrom(),"field":period_ctrl.getField()}),"sign":"ge"},{"binding":new CommandBinding({"control":period_ctrl.getControlTo(),"field":period_ctrl.getField()}),"sign":"le"}]},"oktmo":{"binding":new CommandBinding({"control":new OKTMOEdit(id+":filter-ctrl-oktmo",{"contClassName":"form-group-filter","labelCaption":"ОКТМО:","dependBaseControl":"filter-ctrl-oktmo_contract","dependBaseFieldIds":["id"],"dependFieldIds":["oktmo_id"]}),"field":new FieldInt("oktmo_id")}),"sign":"e"},"oktmo_contract":{"binding":new CommandBinding({"control":new OKTMOContractEdit(id+":filter-ctrl-oktmo_contract",{"contClassName":"form-group-filter","labelCaption":"Контракт:"}),"field":new FieldInt("oktmo_contract_id")}),"sign":"e"},"user":{"binding":new CommandBinding({"control":new UserEditRef(id+":filter-ctrl-user",{"contClassName":"form-group-filter","labelCaption":"Пользователь:"}),"field":new FieldInt("oktmo_contract_id")}),"sign":"e"},"closed":{"binding":new CommandBinding({"control":new EditCheckBox(id+":filter-ctrl-closed",{"contClassName":"form-group-filter","labelCaption":"Закрыт:"}),"field":new FieldBool("closed")}),"sign":"e"}};this.addElement(new GridAjx(id+":grid",{"model":model,"controller":contr,"editInline":false,"editWinClass":DocPassToProductionDialog_Form,"commands":new GridCmdContainerAjx(id+":grid:cmd",{"cmdFilter":options.fromApp?false:true,"filters":filters,"variantStorage":options.variantStorage}),"popUpMenu":popup_menu,"head":new GridHead(id+"-grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[new GridCellHead(id+":grid:head:id",{"value":"№","columns":[new GridColumn({"field":model.getField("id"),"searchOptions":{"field":new FieldInt("id"),"searchType":"on_match"}})],"sortable":true}),new GridCellHead(id+":grid:head:date_time",{"value":"Дата создания","columns":[new GridColumnDateTime({"field":model.getField("date_time"),"ctrlClass":EditDate,"searchOptions":{"field":new FieldDate("date_time"),"searchType":"on_beg"}})],"sortable":true,"sort":"desc"}),new GridCellHead(id+":grid:head:oktmo_ref",{"value":"ОКТМО","columns":[new GridColumnRef({"field":model.getField("oktmo_ref"),"ctrlClass":OKTMOEdit,"searchOptions":{"field":new FieldInt("oktmo_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:oktmo_contracts_ref",{"value":"Контракт","columns":[new GridColumnRef({"field":model.getField("oktmo_contracts_ref"),"ctrlClass":OKTMOContractEdit,"searchOptions":{"field":new FieldInt("oktmo_contract_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:users_ref",{"value":"Пользователь","columns":[new GridColumnRef({"field":model.getField("users_ref"),"ctrlClass":UserEditRef,"searchOptions":{"field":new FieldInt("user_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:closed_inf",{"value":"Закрыт","columns":[new GridColumn({"formatFunction":function(fields){var res="";if(fields.closed.getValue()){var inf=fields.closed_inf.GetValue();if(inf&&inf.date_time){res=DateHelper.format(DateHelper.strtotime(inf.date_time),"d/m/y H:i");}
if(inf&&inf.users_ref&&inf.users_ref.descr){if(res!=""){res+=", ";}
res+=inf.users_ref.descr;}}
return res;}})]})]})]}),"pagination":new GridPagination(id+"_page",{"countPerPage":constants.doc_per_page_count.getValue()}),"autoRefresh":false,"refreshInterval":constants.grid_refresh_interval.getValue()*1000,"rowSelect":false,"focus":true}));}
extend(DocPassToProductionList_View,ViewAjxList);  
function DocMovementList_View(id,options){options.HEAD_TITLE="Перемещение материалов";DocMovementList_View.superclass.constructor.call(this,id,options);var model=options.models.DocMovementList_Model;var contr=new DocMovement_Controller();var constants={"doc_per_page_count":null,"grid_refresh_interval":null};window.getApp().getConstantManager().get(constants);var popup_menu=new PopUpMenu();var period_ctrl=new EditPeriodDate(id+":filter-ctrl-period",{"field":new FieldDateTime("date_time")});var filters=options.fromApp?null:{"period":{"binding":new CommandBinding({"control":period_ctrl,"field":period_ctrl.getField()}),"bindings":[{"binding":new CommandBinding({"control":period_ctrl.getControlFrom(),"field":period_ctrl.getField()}),"sign":"ge"},{"binding":new CommandBinding({"control":period_ctrl.getControlTo(),"field":period_ctrl.getField()}),"sign":"le"}]},"oktmo":{"binding":new CommandBinding({"control":new OKTMOEdit(id+":filter-ctrl-oktmo",{"contClassName":"form-group-filter","labelCaption":"ОКТМО отправитель:","dependBaseControl":"filter-ctrl-oktmo_contract","dependBaseFieldIds":["id"],"dependFieldIds":["oktmo_id"]}),"field":new FieldInt("oktmo_id")}),"sign":"e"},"oktmo_contract":{"binding":new CommandBinding({"control":new OKTMOContractEdit(id+":filter-ctrl-oktmo_contract",{"contClassName":"form-group-filter","labelCaption":"Контракт отправитель:"}),"field":new FieldInt("oktmo_contract_id")}),"sign":"e"},"to_oktmo":{"binding":new CommandBinding({"control":new OKTMOEdit(id+":filter-ctrl-to_oktmo",{"contClassName":"form-group-filter","labelCaption":"ОКТМО получатель:","dependBaseControl":"filter-ctrl-to_oktmo_contract","dependBaseFieldIds":["id"],"dependFieldIds":["to_oktmo_id"]}),"field":new FieldInt("to_oktmo_id")}),"sign":"e"},"to_oktmo_contract":{"binding":new CommandBinding({"control":new OKTMOContractEdit(id+":filter-ctrl-to_oktmo_contract",{"contClassName":"form-group-filter","labelCaption":"Контракт получатель:"}),"field":new FieldInt("to_oktmo_contract_id")}),"sign":"e"},"user":{"binding":new CommandBinding({"control":new UserEditRef(id+":filter-ctrl-user",{"contClassName":"form-group-filter","labelCaption":"Пользователь:"}),"field":new FieldInt("oktmo_contract_id")}),"sign":"e"},"closed":{"binding":new CommandBinding({"control":new EditCheckBox(id+":filter-ctrl-closed",{"contClassName":"form-group-filter","labelCaption":"Закрыт:"}),"field":new FieldBool("closed")}),"sign":"e"}};this.addElement(new GridAjx(id+":grid",{"model":model,"controller":contr,"editInline":false,"editWinClass":DocMovementDialog_Form,"commands":new GridCmdContainerAjx(id+":grid:cmd",{"cmdFilter":options.fromApp?false:true,"filters":filters,"variantStorage":options.variantStorage}),"popUpMenu":popup_menu,"head":new GridHead(id+"-grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[new GridCellHead(id+":grid:head:id",{"value":"№","columns":[new GridColumn({"field":model.getField("id"),"searchOptions":{"field":new FieldInt("id"),"searchType":"on_match"}})],"sortable":true}),new GridCellHead(id+":grid:head:date_time",{"value":"Дата создания","columns":[new GridColumnDateTime({"field":model.getField("date_time"),"ctrlClass":EditDate,"searchOptions":{"field":new FieldDate("date_time"),"searchType":"on_beg"}})],"sortable":true,"sort":"desc"}),new GridCellHead(id+":grid:head:oktmo_ref",{"value":"ОКТМО отправитель","columns":[new GridColumnRef({"field":model.getField("oktmo_ref"),"ctrlClass":OKTMOEdit,"searchOptions":{"field":new FieldInt("oktmo_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:oktmo_contracts_ref",{"value":"Контракт отправитель","columns":[new GridColumnRef({"field":model.getField("oktmo_contracts_ref"),"ctrlClass":OKTMOContractEdit,"searchOptions":{"field":new FieldInt("oktmo_contract_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:to_oktmo_ref",{"value":"ОКТМО получатель","columns":[new GridColumnRef({"field":model.getField("to_oktmo_ref"),"ctrlClass":OKTMOEdit,"searchOptions":{"field":new FieldInt("to_oktmo_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:to_oktmo_contracts_ref",{"value":"Контракт получатель","columns":[new GridColumnRef({"field":model.getField("to_oktmo_contracts_ref"),"ctrlClass":OKTMOContractEdit,"searchOptions":{"field":new FieldInt("to_oktmo_contract_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:users_ref",{"value":"Пользователь","columns":[new GridColumnRef({"field":model.getField("users_ref"),"ctrlClass":UserEditRef,"searchOptions":{"field":new FieldInt("user_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:closed_inf",{"value":"Закрыт","columns":[new GridColumn({"formatFunction":function(fields){var res="";if(fields.closed.getValue()){var inf=fields.closed_inf.GetValue();if(inf&&inf.date_time){res=DateHelper.format(DateHelper.strtotime(inf.date_time),"d/m/y H:i");}
if(inf&&inf.users_ref&&inf.users_ref.descr){if(res!=""){res+=", ";}
res+=inf.users_ref.descr;}}
return res;}})]})]})]}),"pagination":new GridPagination(id+"_page",{"countPerPage":constants.doc_per_page_count.getValue()}),"autoRefresh":false,"refreshInterval":constants.grid_refresh_interval.getValue()*1000,"rowSelect":false,"focus":true}));}
extend(DocMovementList_View,ViewAjxList);  
function DocProcurementList_View(id,options){options.HEAD_TITLE="Поступление материалов";DocProcurementList_View.superclass.constructor.call(this,id,options);var model=options.models.DocProcurementList_Model;var contr=new DocProcurement_Controller();var constants={"doc_per_page_count":null,"grid_refresh_interval":null};window.getApp().getConstantManager().get(constants);var popup_menu=new PopUpMenu();var period_ctrl=new EditPeriodDate(id+":filter-ctrl-period",{"field":new FieldDateTime("date_time")});var filters=options.fromApp?null:{"period":{"binding":new CommandBinding({"control":period_ctrl,"field":period_ctrl.getField()}),"bindings":[{"binding":new CommandBinding({"control":period_ctrl.getControlFrom(),"field":period_ctrl.getField()}),"sign":"ge"},{"binding":new CommandBinding({"control":period_ctrl.getControlTo(),"field":period_ctrl.getField()}),"sign":"le"}]},"user":{"binding":new CommandBinding({"control":new UserEditRef(id+":filter-ctrl-user",{"contClassName":"form-group-filter","labelCaption":"Пользователь:"}),"field":new FieldInt("oktmo_contract_id")}),"sign":"e"}};this.addElement(new GridAjx(id+":grid",{"model":model,"controller":contr,"editInline":false,"editWinClass":DocProcurementDialog_Form,"commands":new GridCmdContainerAjx(id+":grid:cmd",{"cmdFilter":options.fromApp?false:true,"filters":filters,"variantStorage":options.variantStorage}),"popUpMenu":popup_menu,"head":new GridHead(id+"-grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[new GridCellHead(id+":grid:head:id",{"value":"№","columns":[new GridColumn({"field":model.getField("id"),"searchOptions":{"field":new FieldInt("id"),"searchType":"on_match"}})],"sortable":true}),new GridCellHead(id+":grid:head:date_time",{"value":"Дата создания","columns":[new GridColumnDateTime({"field":model.getField("date_time"),"ctrlClass":EditDate,"searchOptions":{"field":new FieldDate("date_time"),"searchType":"on_beg"}})],"sortable":true,"sort":"desc"}),new GridCellHead(id+":grid:head:users_ref",{"value":"Пользователь","columns":[new GridColumnRef({"field":model.getField("users_ref"),"ctrlClass":UserEditRef,"searchOptions":{"field":new FieldInt("user_id"),"searchType":"on_match","typeChange":false}})],"sortable":true}),new GridCellHead(id+":grid:head:total",{"value":"Итого","columns":[new GridColumnFloat({"field":model.getField("total"),"ctrlClass":EditMoney})]})]})]}),"foot":new GridFoot(id+"grid:foot",{"autoCalc":true,"elements":[new GridRow(id+":grid:foot:row0",{"elements":[new GridCell(id+":grid:foot:total_sp1",{"colSpan":"3"}),new GridCellFoot(id+":grid:foot:tot_total",{"attrs":{"align":"right"},"totalFieldId":"total_total","gridColumn":new GridColumnFloat({"id":"tot_total"})})]})]}),"pagination":new GridPagination(id+"_page",{"countPerPage":constants.doc_per_page_count.getValue()}),"autoRefresh":false,"refreshInterval":constants.grid_refresh_interval.getValue()*1000,"rowSelect":false,"focus":true}));}
extend(DocProcurementList_View,ViewAjxList); 
function DocProcurementDialog_View(id,options){options=options||{};options.controller=new DocProcurement_Controller();options.model=(options.models&&options.models.DocProcurementDialog_Model)?options.models.DocProcurementDialog_Model:new DocProcurementDialog_Model();var is_employee=(window.getApp().getServVar("role_id")=="employee");options.addElement=function(){this.addElement(new EditInt(id+":id",{"inline":true,"enabled":!is_employee}));this.addElement(new EditDateTime(id+":date_time",{"inline":true,"dateFormat":"d/m/y H:i","editMask":"99/99/99 99:99"}));var app=window.getApp();this.addElement(new UserEditRef(id+":users_ref",{"labelCaption":"Автор:","value":new RefType({"keys":{"id":app.getServVar("user_id")},"descr":app.getServVar("user_name")}),"enabled":!is_employee}));this.addElement(new DocMaterialGrid(id+":materials",{}));}
DocProcurementDialog_View.superclass.constructor.call(this,id,options);this.setDataBindings([new DataBinding({"control":this.getElement("date_time")}),new DataBinding({"control":this.getElement("users_ref"),"fieldId":"user_id"}),new DataBinding({"control":this.getElement("materials"),"fieldId":"materials"})]);this.setWriteBindings([new CommandBinding({"control":this.getElement("date_time")}),new CommandBinding({"control":this.getElement("users_ref"),"fieldId":"user_id"}),new CommandBinding({"control":this.getElement("materials"),"fieldId":"materials"})]);}
extend(DocProcurementDialog_View,ViewObjectAjx); 
function StoreList_View(id,options){StoreList_View.superclass.constructor.call(this,id,options);var model=options.models.StoreList_Model;var contr=new Store_Controller();var constants={"grid_refresh_interval":null};window.getApp().getConstantManager().get(constants);var popup_menu=new PopUpMenu();this.addElement(new GridAjx(id+":grid",{"model":model,"controller":contr,"editInline":false,"editWinClass":User_Form,"commands":new GridCmdContainerAjx(id+":grid:cmd"),"popUpMenu":popup_menu,"head":new GridHead(id+"-grid:head",{"elements":[new GridRow(id+":grid:head:row0",{"elements":[new GridCellHead(id+":grid:head:row0:name",{"value":this.COL_NAME,"columns":[new GridColumn({"field":model.getField("name")})],"sortable":true,"sort":"asc"}),new GridCellHead(id+":grid:head:row0:oktmo_contracts_ref",{"value":"Контракт","columns":[new GridColumnRef({"field":model.getField("oktmo_contracts_ref"),"ctrlClass":OKTMOContractEdit})]})]})]}),"pagination":null,"autoRefresh":false,"refreshInterval":constants.grid_refresh_interval.getValue()*1000,"rowSelect":false,"focus":true}));}
extend(StoreList_View,ViewAjxList); 
function RepMaterialAction_View(id,options){options=options||{};var contr=new Material_Controller();options.publicMethod=contr.getPublicMethod("get_material_action");options.reportViewId="ViewHTMLXSLT";options.templateId="RepMaterialAction";options.cmdMake=true;options.cmdPrint=true;options.cmdFilter=true;options.cmdExcel=true;options.cmdPdf=false;var period_ctrl=new EditPeriodDateTime(id+":filter-ctrl-period",{"field":new FieldDateTime("date_time")});options.filters={"period":{"binding":new CommandBinding({"control":period_ctrl,"field":period_ctrl.getField()}),"bindings":[{"binding":new CommandBinding({"control":period_ctrl.getControlFrom(),"field":period_ctrl.getField()}),"sign":"ge"},{"binding":new CommandBinding({"control":period_ctrl.getControlTo(),"field":period_ctrl.getField()}),"sign":"le"}]},"store":{"binding":new CommandBinding({"control":new StoreEdit(id+":filter-ctrl-store",{"contClassName":"form-group-filter","labelCaption":"Место хранения:"}),"field":new FieldInt("store_id")}),"sign":"e"},"material":{"binding":new CommandBinding({"control":new MaterialEdit(id+":filter-ctrl-material",{"contClassName":"form-group-filter","labelCaption":"Материал:"}),"field":new FieldInt("material_id")}),"sign":"e"}};RepMaterialAction_View.superclass.constructor.call(this,id,options);}
extend(RepMaterialAction_View,ViewReport); 
App.prototype.m_serverTemplateIds=["About","ConstantList","MainMenuConstructorList","ViewList","UserList"];App.prototype.m_templates={"FatalException":"<div class=\"panel panel-flat\"> \n\t <!--      \n\t <div class=\"panel-heading\">\n\t  <h1>Ошибка <strong></strong></h1>\n\t </div>\n\t -->\n\t <div class=\"panel-body\">\n\t      <h3>\n\t      </h3>\n\t      <div>Необходима повторная <a href=\"\">авторизация</a>.</div>\n\t </div>\n\t</div>\n\t\n\t","DbException":"<div class=\"panel panel-flat\"> \n\t <div class=\"panel-body\">\n\t      <h3>\n\t      </h3>\n\t </div>\n\t</div>\n\t\n\t","VersException":"<div class=\"panel panel-flat\"> \n\t <div class=\"panel-body\">\n\t      <h3>Версия программы на сервере была обновлена!\n\t      </h3>\n\t      <h4>Необходимо обновить страницу (обычно F5) или перезапустить браузер!\n\t      </h4>\n\t </div>\n\t</div>\n\t\n\t","GridCmdContainerAjx":"<div id=\"{{id}}\">\n\t {{#this.getCmdInsert()}}\n\t <div id=\"{{id}}:insert\"></div> \n\t {{/this.getCmdInsert()}}\n\t \n\t {{#this.getCmdSearch()}}\n\t <div class=\"btn-group\">\n\t  <div id=\"{{id}}:search:set\"></div>\n\t  <div id=\"{{id}}:search:unset\"></div>\n\t </div>\n\t {{/this.getCmdSearch()}}\n\t \n\t {{#this.getCmdFilter()}}\n\t <div id=\"{{id}}:filter\"></div>\n\t {{/this.getCmdFilter()}}\n\t  \n\t {{#this.getCmdPrintObj()}}\n\t <div id=\"{{id}}:printObj\"></div>\n\t {{/this.getCmdPrintObj()}}\n\t  \n\t {{#this.getCmdAllCommands()}}\n\t <div id=\"{{id}}:allCommands\"></div>\n\t {{/this.getCmdAllCommands()}}\n\t \n\t {{#cmdFilterInfo}}\n\t <div id=\"{{id}}:inf\" class=\"hidden\"></div>\n\t {{/cmdFilterInfo}}\n\t \n\t</div>\n\t","ViewGridColManager":"<div id=\"{{id}}\">\n\t <div class=\"form-group {{bsCol}}12\">\n\t  <div id=\"{{id}}:save\"></div>\n\t  <div id=\"{{id}}:open\"></div>\n\t </div>\n\t\n\t <ul class=\"nav nav-tabs\" role=\"tablist\">\n\t     <li role=\"presentation\" class=\"active\"><a href=\"#columns\" aria-controls=\"columns\" role=\"tab\" data-toggle=\"tab\">{{TAB_COLUMNS}}</a></li>\n\t     <li role=\"presentation\"><a href=\"#sortings\" aria-controls=\"sortings\" role=\"tab\" data-toggle=\"tab\">{{TAB_SORT}}</a></li>\n\t     <!--<li role=\"presentation\"><a href=\"#filters\" aria-controls=\"filters\" role=\"tab\" data-toggle=\"tab\">{{TAB_FILTER}}</a></li>-->\n\t </ul>\n\t\n\t <!-- Tab panes -->\n\t <div class=\"tab-content\"> \n\t  <div role=\"tabpanel\" class=\"tab-pane active\" id=\"columns\">\n\t   <div class=\"panel panel-body\">\n\t    <div id=\"{{id}}:view-visibility\"></div>\n\t   </div>\n\t  </div>\n\t\n\t  <div role=\"tabpanel\" class=\"tab-pane\" id=\"sortings\">\n\t   <div class=\"panel panel-body\">\n\t    <div id=\"{{id}}:view-order\"></div>\n\t   </div>\n\t  </div>\n\t<!-- \n\t  <div role=\"tabpanel\" class=\"tab-pane\" id=\"filters\">\n\t   <div class=\"panel panel-body\">\n\t    <div id=\"{{id}}:view-filter\"></div>\n\t   </div>\n\t  </div>\n\t-->\n\t</div>\n\t\n\t","PopOver":"<div id=\"{{id}}\" class=\"popover\" role=\"tooltip\" style=\"position:absolute;display:block;max-width:100%;\">\n\t <div class=\"tooltip-arrow\"></div>\n\t <h3 id=\"{{id}}:title\" class=\"popover-title\"></h3>\n\t <div id=\"{{id}}:content\" class=\"popover-content\"></div>\n\t</div>\n\t","GridCmdFilterView":"<form id=\"{{id}}\" class=\"form-horizontal\">\n\t <div class=\"form-group {{bsCol}}12\">\n\t  <div id=\"{{id}}:set\"></div>\n\t  <div id=\"{{id}}:unset\"></div>\n\t  <div id=\"{{id}}:save\"></div>\n\t  <div id=\"{{id}}:open\"></div>\n\t </div>\n\t</form>\n\t","EditPeriodDate":"<div id=\"{{id}}\" class=\"form-group {{bsCol}}12\">\n\t <a class=\"{{bsCol}}2\" id=\"{{id}}:periodSelect\"></a> \n\t \n\t <div class=\"btn-group {{bsCol}}2\">\n\t  <div id=\"{{id}}:downFast\" title=\"{{CONTR_DOWN_FAST_TITLE}}\"></div>\n\t  <div id=\"{{id}}:down\" title=\"{{CONTR_DOWN_TITLE}}\"></div>\n\t </div>\n\t \n\t <div id=\"{{id}}:d-cont\" class=\"{{bsCol}}6\" style=\"padding-right:0px;padding-left:0px;\">\n\t  <div id=\"{{id}}:from\" class=\"{{bsCol}}6\" style=\"padding:0px 20px 0px 0px;\"></div>\n\t  <!--<span class=\"{{bsCol}}1\" style=\"padding-left:0px;padding-right:0px\">-</span>-->\n\t  <div id=\"{{id}}:to\" class=\"{{bsCol}}6\" style=\"padding:0px 0px;margin:0px 0px;\"></div> \n\t </div>\n\t \n\t <div class=\"btn-group {{bsCol}}2\">  \n\t  <div id=\"{{id}}:up\" title=\"{{CONTR_UP_TITLE}}\"></div>\n\t  <div id=\"{{id}}:upFast\" title=\"{{CONTR_UP_FAST_TITLE}}\"></div>\n\t </div>\n\t \n\t</div>\n\t","WindowPrint":"<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n\t<html>\n\t <head>\n\t  <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n\t  <link rel=\"stylesheet\" href=\"js20/custom-css/print.css?'+{{scriptId}}+'\" type=\"text/css\" media=\"all\">\n\t  <title>{{title}}</title>\n\t </head>\n\t <body>{{content}}</body>\n\t</html>\n\t\n\t","VariantStorageSaveView":"<div id=\"{{id}}\">\n\t <div id=\"{{id}}:variants\"></div>\n\t <div id=\"{{id}}:name\"></div>\n\t <div id=\"{{id}}:default_variant\"></div>\n\t <div id=\"{{id}}:cmdSave\"></div>\n\t <div id=\"{{id}}:cmdCancel\"></div>\n\t</div>\n\t","VariantStorageOpenView":"<div id=\"{{id}}\">\n\t <div id=\"{{id}}:variants\"></div>\n\t <div id=\"{{id}}:cmdOpen\"></div>\n\t <div id=\"{{id}}:cmdCancel\"></div>\n\t</div>\n\t"}; 
function App_tmnstroi(options){options=options||{};options.lang="ru";App_tmnstroi.superclass.constructor.call(this,"tmnstroi",options);}
extend(App_tmnstroi,App);App_tmnstroi.prototype.SERV_RESPONSE_MODEL_ID="Response";App_tmnstroi.prototype.EVENT_MODEL_ID="Event";App_tmnstroi.prototype.makeItemCurrent=function(elem){if(elem){var l=DOMHelper.getElementsByAttr("active",document.body,"class",true,"LI");for(var i=0;i<l.length;i++){DOMHelper.delClass(l[i],"active");}
DOMHelper.addClass((elem.tagName.toUpperCase()=="LI")?elem:elem.parentNode,"active");if(elem.nextSibling){elem.nextSibling.style="display: block;";}}}
App_tmnstroi.prototype.showMenuItem=function(item,c,f,t,extra,title){App_tmnstroi.superclass.showMenuItem.call(this,item,c,f,t,extra,title);this.makeItemCurrent(item);}
App_tmnstroi.prototype.formatError=function(erCode,erStr){return(erStr+((erCode)?(", код:"+erCode):""));} 
function ViewSectionSelect(id,options){options=options||{};options.model=new ViewSectionList_Model();options.required=true;if(options.labelCaption!=""){options.labelCaption=options.labelCaption||this.LABEL_CAPTION;}
options.keyIds=options.keyIds||["section"];options.modelKeyFields=[options.model.getField("section")];options.modelDescrFields=[options.model.getField("section")];var contr=new View_Controller();options.readPublicMethod=contr.getPublicMethod("get_section_list");ViewSectionSelect.superclass.constructor.call(this,id,options);}
extend(ViewSectionSelect,EditSelectRef); 
function ViewEditRef(id,options){options=options||{};if(options.labelCaption!=""){options.labelCaption=options.labelCaption||this.LABEL_CAPTION;}
options.cmdInsert=(options.cmdInsert!=undefined)?options.cmdInsert:false;options.keyIds=options.keyIds||["viewId"];options.selectWinClass=ViewList_Form;options.selectDescrIds=options.selectDescrIds||["user_descr"];options.editWinClass=null;options.acMinLengthForQuery=1;options.acController=new View_Controller();options.acModel=new ViewList_Model();options.acPatternFieldId=options.acPatternFieldId||"user_descr";options.acKeyFields=options.acKeyFields||[options.acModel.getField("id")];options.acDescrFields=options.acDescrFields||[options.acModel.getField("user_descr")];options.acICase=options.acICase||"1";options.acMid=options.acMid||"1";this.m_menuTree=options.menuTree;var self=this;this.m_origOnSelect=options.onSelect;options.onSelect=function(fields){if(self.m_menuTree)self.m_menuTree.m_editViewDescr=fields.user_descr.getValue();if(self.m_origOnSelect){self.m_origOnSelect.call(self,fields);}}
ViewEditRef.superclass.constructor.call(this,id,options);}
extend(ViewEditRef,EditRef); 
function UserNameEdit(id,options){options=options||{};options.labelCaption="Логин:",options.placeholder="Логин пользователя",options.required=true;options.maxlength=50;UserNameEdit.superclass.constructor.call(this,id,options);}
extend(UserNameEdit,EditString); 
function UserEditRef(id,options){options=options||{};if(options.labelCaption!=""){options.labelCaption=options.labelCaption||"Пользователь:";}
options.cmdInsert=(options.cmdInsert!=undefined)?options.cmdInsert:false;options.keyIds=options.keyIds||["id"];options.selectWinClass=UserList_Form;options.selectDescrIds=options.selectDescrIds||["name"];options.editWinClass=User_Form;options.acMinLengthForQuery=1;options.acController=new User_Controller(options.app);options.acModel=new UserList_Model();options.acPatternFieldId=options.acPatternFieldId||"name";options.acKeyFields=options.acKeyFields||[options.acModel.getField("id")];options.acDescrFields=options.acDescrFields||[options.acModel.getField("name")];options.acICase=options.acICase||"1";options.acMid=options.acMid||"1";UserEditRef.superclass.constructor.call(this,id,options);}
extend(UserEditRef,EditRef); 
ViewSectionSelect.prototype.LABEL_CAPTION="Открыть объект";ViewEditRef.prototype.LABEL_CAPTION="Форма:"  
function TimeZoneLocaleEdit(id,options){options=options||{};options.model=new TimeZoneLocale_Model();if(options.labelCaption!=""){options.labelCaption=options.labelCaption||"Часовой пояс:";}
options.keyIds=options.keyIds||["id"];options.modelKeyFields=[options.model.getField("id")];options.modelDescrFields=[options.model.getField("name")];var contr=new TimeZoneLocale_Controller();options.readPublicMethod=contr.getPublicMethod("get_list");TimeZoneLocaleEdit.superclass.constructor.call(this,id,options);}
extend(TimeZoneLocaleEdit,EditSelectRef); 
function EditINN(id,options){options=options||{};if(options.isEnterprise==undefined){throw new Error("Не определен параметр isEnterprise!");}
this.m_isEnterprise=options.isEnterprise;options.type="text";options.cmdSelect=false;options.maxLength=(this.m_isEnterprise)?this.ENT_LEN:this.PERS_LEN;options.fixLength=true;options.events=options.events||{};var self=this;EditINN.superclass.constructor.call(this,id,options);}
extend(EditINN,EditNum);EditINN.prototype.m_isEnterprise;EditINN.prototype.ENT_LEN=10;EditINN.prototype.PERS_LEN=12;EditINN.prototype.setIsEnterprise=function(v){var len=v?this.ENT_LEN:this.PERS_LEN;this.setMaxLength(len);}
EditINN.prototype.getIsEnterprise=function(){return this.m_isEnterprise;} 
function OKEIEdit(id,options){options=options||{};if(options.labelCaption!=""){options.labelCaption=options.labelCaption||"Единица:";}
options.cmdInsert=(options.cmdInsert!=undefined)?options.cmdInsert:false;options.keyIds=options.keyIds||["code"];options.selectWinClass=OKEIList_Form;options.selectDescrIds=options.selectDescrIds||["name_nat"];options.editWinClass=null;options.acMinLengthForQuery=1;options.acController=new OKEI_Controller(options.app);options.acModel=new OKEIList_Model();options.acPatternFieldId=options.acPatternFieldId||"name_search";options.acKeyFields=options.acKeyFields||[options.acModel.getField("code")];options.acDescrFields=options.acDescrFields||[options.acModel.getField("name_full")];options.acICase=options.acICase||"1";options.acMid=options.acMid||"1";OKEIEdit.superclass.constructor.call(this,id,options);}
extend(OKEIEdit,EditRef); 
function OKTMOContractEdit(id,options){options=options||{};options.model=new OKTMOContractList_Model();if(options.labelCaption!=""){options.labelCaption=options.labelCaption||"Контракт:";}
options.keyIds=options.keyIds||["id"];options.modelKeyFields=[options.model.getField("id")];options.modelDescrFields=[options.model.getField("name")];var contr=new OKTMOContract_Controller();options.readPublicMethod=contr.getPublicMethod("get_list");OKTMOContractEdit.superclass.constructor.call(this,id,options);}
extend(OKTMOContractEdit,EditSelectRef); 
function OKTMOEdit(id,options){options=options||{};options.model=new OKTMO_Model();if(options.labelCaption!=""){options.labelCaption=options.labelCaption||"ОКТМО:";options.title=options.title||"ОКТМО";}
options.keyIds=options.keyIds||["id"];options.modelKeyFields=[options.model.getField("id")];options.modelDescrFields=[options.model.getField("name")];var contr=new OKTMO_Controller();options.readPublicMethod=contr.getPublicMethod("get_list");OKTMOEdit.superclass.constructor.call(this,id,options);}
extend(OKTMOEdit,EditSelectRef); 
function MaterialEdit(id,options){options=options||{};if(options.labelCaption!=""){options.labelCaption=options.labelCaption||"Материал:";}
options.cmdInsert=(options.cmdInsert!=undefined)?options.cmdInsert:false;options.keyIds=options.keyIds||["id"];options.selectWinClass=MaterialList_Form;options.selectDescrIds=options.selectDescrIds||["name"];options.editWinClass=null;options.acMinLengthForQuery=1;options.acController=new Material_Controller(options.app);options.acModel=new MaterialList_Model();options.acPatternFieldId=options.acPatternFieldId||"name";options.acKeyFields=options.acKeyFields||[options.acModel.getField("id")];options.acDescrFields=options.acDescrFields||[options.acModel.getField("name")];options.acICase=options.acICase||"1";options.acMid=options.acMid||"1";MaterialEdit.superclass.constructor.call(this,id,options);}
extend(MaterialEdit,EditRef); 
function DocMaterialGrid(id,options){var model=new DocMaterialList_Model({"sequences":{"id":0}});var self=this;var cells=[new GridCellHead(id+":head:row0:materials_ref",{"value":"Материал","columns":[new GridColumnRef({"field":model.getField("materials_ref"),"ctrlClass":MaterialEdit,"ctrlOptions":{"labelCaption":""}})]}),new GridCellHead(id+":head:row0:quant",{"value":"Количество","columns":[new GridColumnFloat({"field":model.getField("quant"),"ctrlClass":EditFloat,"precision":"4","ctrlOptions":{"maxLength":19,"precision":4,"events":{"keyup":function(e){self.calcTotal();}}}})]}),new GridCellHead(id+":head:row0:price",{"value":"Цена","columns":[new GridColumnFloat({"field":model.getField("price"),"precision":"2","ctrlClass":EditMoney,"ctrlOptions":{"events":{"keyup":function(e){self.calcTotal();}}}})]}),new GridCellHead(id+":head:row0:total",{"value":"Итого","columns":[new GridColumnFloat({"field":model.getField("total"),"precision":"2","ctrlClass":EditMoney,"ctrlOptions":{"events":{"keyup":function(e){self.calcPrice();}}}})]})];options={"model":model,"keyIds":["id"],"controller":new DocMaterial_Controller({"clientModel":model}),"editInline":true,"editWinClass":null,"popUpMenu":new PopUpMenu(),"commands":new GridCmdContainerAjx(id+":cmd",{"cmdSearch":false,"cmdExport":false}),"head":new GridHead(id+":head",{"elements":[new GridRow(id+":head:row0",{"elements":cells})]}),"foot":new GridFoot(id+"grid:foot",{"autoCalc":true,"elements":[new GridRow(id+":grid:foot:row0",{"elements":[new GridCell(id+":grid:foot:total_sp1",{"colSpan":"3"}),new GridCellFoot(id+":grid:foot:tot_total",{"attrs":{"align":"right"},"calcOper":"sum","calcFieldId":"total","gridColumn":new GridColumnFloat({"id":"tot_total"})})]})]}),"pagination":null,"autoRefresh":false,"refreshInterval":0,"rowSelect":false};DocMaterialGrid.superclass.constructor.call(this,id,options);}
extend(DocMaterialGrid,GridAjx);DocMaterialGrid.prototype.calcTotal=function(){var f=this.getEditViewObj();var price=f.getElement("price").getValue();if(isNaN(price)){price=0;}
var quant=f.getElement("quant").getValue();if(isNaN(quant)){quant=0;}
f.getElement("total").setValue(price*quant);}
DocMaterialGrid.prototype.calcPrice=function(){var f=this.getEditViewObj();var total=f.getElement("total").getValue();if(isNaN(total)){total=0;}
var quant=f.getElement("quant").getValue();if(isNaN(quant)){quant=0;}
var price=0;if(quant){price=Math.round(total/quant*100)/100;}
f.getElement("price").setValue(price);} 
function DocProcurementEdit(id,options){options=options||{};if(options.labelCaption!=""){options.labelCaption=options.labelCaption||"Поступление материалов:";}
options.cmdInsert=(options.cmdInsert!=undefined)?options.cmdInsert:false;options.keyIds=options.keyIds||["id"];options.selectWinClass=DocProcurementList_Form;options.selectDescrIds=options.selectDescrIds||["self_descr"];options.editWinClass=null;options.acMinLengthForQuery=1;options.acController=new DocProcurement_Controller(options.app);options.acModel=new DocProcurementList_Model();options.acPatternFieldId=options.acPatternFieldId||"self_descr";options.acKeyFields=options.acKeyFields||[options.acModel.getField("id")];options.acDescrFields=options.acDescrFields||[options.acModel.getField("self_descr")];options.acICase=options.acICase||"1";options.acMid=options.acMid||"1";DocProcurementEdit.superclass.constructor.call(this,id,options);}
extend(DocProcurementEdit,EditRef); 
function DocShipmentEdit(id,options){options=options||{};if(options.labelCaption!=""){options.labelCaption=options.labelCaption||"Отгрузка материалов:";}
options.cmdInsert=(options.cmdInsert!=undefined)?options.cmdInsert:false;options.keyIds=options.keyIds||["id"];options.selectWinClass=DocShipmentList_Form;options.selectDescrIds=options.selectDescrIds||["self_descr"];options.editWinClass=null;options.acMinLengthForQuery=1;options.acController=new DocShipment_Controller(options.app);options.acModel=new DocShipmentList_Model();options.acPatternFieldId=options.acPatternFieldId||"self_descr";options.acKeyFields=options.acKeyFields||[options.acModel.getField("id")];options.acDescrFields=options.acDescrFields||[options.acModel.getField("self_descr")];options.acICase=options.acICase||"1";options.acMid=options.acMid||"1";DocShipmentEdit.superclass.constructor.call(this,id,options);}
extend(DocShipmentEdit,EditRef); 
function StoreEdit(id,options){options=options||{};options.model=new StoreList_Model();if(options.labelCaption!=""){options.labelCaption=options.labelCaption||"Место хранения:";}
options.keyIds=options.keyIds||["store_id"];options.modelKeyFields=[options.model.getField("id")];options.modelDescrFields=[options.model.getField("name")];var contr=new Store_Controller();options.readPublicMethod=contr.getPublicMethod("get_list");StoreEdit.superclass.constructor.call(this,id,options);}
extend(StoreEdit,EditSelectRef); 
function TimeZoneLocale_Model(options){var id='TimeZoneLocale_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.alias='Код';filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);options.fields.id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.descr=new FieldString("descr",filed_options);options.fields.descr.getValidator().setRequired(true);options.fields.descr.getValidator().setMaxLength('100');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name=new FieldString("name",filed_options);options.fields.name.getValidator().setRequired(true);options.fields.name.getValidator().setMaxLength('50');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.hour_dif=new FieldFloat("hour_dif",filed_options);options.fields.hour_dif.getValidator().setRequired(true);options.fields.hour_dif.getValidator().setMaxLength('5');TimeZoneLocale_Model.superclass.constructor.call(this,id,options);}
extend(TimeZoneLocale_Model,ModelXML); 
function User_Model(options){var id='User_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name=new FieldString("name",filed_options);options.fields.name.getValidator().setRequired(true);options.fields.name.getValidator().setMaxLength('50');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name_full=new FieldString("name_full",filed_options);options.fields.name_full.getValidator().setMaxLength('200');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.role_id=new FieldEnum("role_id",filed_options);filed_options.enumValues='admin,employee';options.fields.role_id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.email=new FieldString("email",filed_options);options.fields.email.getValidator().setMaxLength('50');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.pwd=new FieldPassword("pwd",filed_options);options.fields.pwd.getValidator().setMaxLength('32');var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.create_dt=new FieldDateTimeTZ("create_dt",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.banned=new FieldBool("banned",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.time_zone_locale_id=new FieldInt("time_zone_locale_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.phone_cel=new FieldString("phone_cel",filed_options);options.fields.phone_cel.getValidator().setMaxLength('15');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.tel_ext=new FieldString("tel_ext",filed_options);options.fields.tel_ext.getValidator().setMaxLength('5');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.locale_id=new FieldEnum("locale_id",filed_options);filed_options.enumValues='ru';var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.alias='Адрес электр.почты подтвержден';filed_options.autoInc=false;options.fields.email_confirmed=new FieldBool("email_confirmed",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_id=new FieldInt("oktmo_id",filed_options);User_Model.superclass.constructor.call(this,id,options);}
extend(User_Model,ModelXML); 
function UserList_Model(options){var id='UserList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=false;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name=new FieldString("name",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name_full=new FieldString("name_full",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.role_id=new FieldEnum("role_id",filed_options);filed_options.enumValues='admin,employee';var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.phone_cel=new FieldString("phone_cel",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.tel_ext=new FieldString("tel_ext",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.email=new FieldString("email",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_ref=new FieldJSON("oktmo_ref",filed_options);UserList_Model.superclass.constructor.call(this,id,options);}
extend(UserList_Model,ModelXML); 
function UserDialog_Model(options){var id='UserDialog_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.alias='Код';filed_options.autoInc=false;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Имя';filed_options.autoInc=false;options.fields.name=new FieldString("name",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name_full=new FieldString("name_full",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.role_id=new FieldString("role_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Эл.почта';filed_options.autoInc=false;options.fields.email=new FieldString("email",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.create_dt=new FieldDateTimeTZ("create_dt",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.banned=new FieldBool("banned",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.time_zone_locales_ref=new FieldJSON("time_zone_locales_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.phone_cel=new FieldString("phone_cel",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.tel_ext=new FieldString("tel_ext",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.locale_id=new FieldString("locale_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.email_confirmed=new FieldBool("email_confirmed",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_ref=new FieldJSON("oktmo_ref",filed_options);UserDialog_Model.superclass.constructor.call(this,id,options);}
extend(UserDialog_Model,ModelXML); 
function Session_Model(options){var id='Session_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=false;options.fields.id=new FieldString("id",filed_options);options.fields.id.getValidator().setMaxLength('128');var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.set_time=new FieldDateTimeTZ("set_time",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.data=new FieldText("data",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.session_key=new FieldString("session_key",filed_options);options.fields.session_key.getValidator().setMaxLength('128');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.pub_key=new FieldString("pub_key",filed_options);options.fields.pub_key.getValidator().setMaxLength('15');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.data_enc=new FieldBytea("data_enc",filed_options);Session_Model.superclass.constructor.call(this,id,options);}
extend(Session_Model,ModelXML); 
function Login_Model(options){var id='Login_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.date_time_in=new FieldDateTimeTZ("date_time_in",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.date_time_out=new FieldDateTimeTZ("date_time_out",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.ip=new FieldString("ip",filed_options);options.fields.ip.getValidator().setMaxLength('15');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.session_id=new FieldString("session_id",filed_options);options.fields.session_id.getValidator().setMaxLength('128');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.pub_key=new FieldString("pub_key",filed_options);options.fields.pub_key.getValidator().setMaxLength('15');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.set_date_time=new FieldDateTimeTZ("set_date_time",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.headers=new FieldText("headers",filed_options);Login_Model.superclass.constructor.call(this,id,options);}
extend(Login_Model,ModelXML); 
function LoginList_Model(options){var id='LoginList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Дата входа';filed_options.autoInc=false;options.fields.date_time_in=new FieldDateTimeTZ("date_time_in",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Дата выхода';filed_options.autoInc=false;options.fields.date_time_out=new FieldDateTimeTZ("date_time_out",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='IP адрес';filed_options.autoInc=false;options.fields.ip=new FieldString("ip",filed_options);options.fields.ip.getValidator().setMaxLength('15');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Пользователь';filed_options.autoInc=false;options.fields.users_ref=new FieldJSON("users_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.pub_key=new FieldString("pub_key",filed_options);options.fields.pub_key.getValidator().setMaxLength('15');var filed_options={};filed_options.primaryKey=false;filed_options.alias='Время последнего обращения';filed_options.autoInc=false;options.fields.set_date_time=new FieldDateTimeTZ("set_date_time",filed_options);LoginList_Model.superclass.constructor.call(this,id,options);}
extend(LoginList_Model,ModelXML); 
function ConstantList_Model(options){var id='ConstantList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=false;options.fields.id=new FieldString("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name=new FieldString("name",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.descr=new FieldText("descr",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.val=new FieldText("val",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.val_type=new FieldText("val_type",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.ctrl_class=new FieldText("ctrl_class",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.ctrl_options=new FieldJSON("ctrl_options",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.view_class=new FieldText("view_class",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.view_options=new FieldJSON("view_options",filed_options);ConstantList_Model.superclass.constructor.call(this,id,options);}
extend(ConstantList_Model,ModelXML); 
function View_Model(options){var id='View_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.alias='Код';filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.c=new FieldText("c",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.f=new FieldText("f",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.t=new FieldText("t",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.section=new FieldText("section",filed_options);options.fields.section.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.descr=new FieldText("descr",filed_options);options.fields.descr.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.limited=new FieldBool("limited",filed_options);View_Model.superclass.constructor.call(this,id,options);}
extend(View_Model,ModelXML); 
function ViewList_Model(options){var id='ViewList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.alias='Код';filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.c=new FieldText("c",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.f=new FieldText("f",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.t=new FieldText("t",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.href=new FieldText("href",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_descr=new FieldText("user_descr",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.section=new FieldText("section",filed_options);ViewList_Model.superclass.constructor.call(this,id,options);}
extend(ViewList_Model,ModelXML); 
function ViewSectionList_Model(options){var id='ViewSectionList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.section=new FieldText("section",filed_options);ViewSectionList_Model.superclass.constructor.call(this,id,options);}
extend(ViewSectionList_Model,ModelXML); 
function MainMenuConstructor_Model(options){var id='MainMenuConstructor_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.alias='Код';filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.role_id=new FieldEnum("role_id",filed_options);filed_options.enumValues='admin';options.fields.role_id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Содержание';filed_options.autoInc=false;options.fields.content=new FieldText("content",filed_options);options.fields.content.getValidator().setRequired(true);MainMenuConstructor_Model.superclass.constructor.call(this,id,options);}
extend(MainMenuConstructor_Model,ModelXML); 
function MainMenuConstructorList_Model(options){var id='MainMenuConstructorList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=false;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.role_id=new FieldString("role_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.role_descr=new FieldString("role_descr",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldString("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_descr=new FieldString("user_descr",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.content=new FieldText("content",filed_options);MainMenuConstructorList_Model.superclass.constructor.call(this,id,options);}
extend(MainMenuConstructorList_Model,ModelXML); 
function MainMenuConstructorDialog_Model(options){var id='MainMenuConstructorDialog_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=false;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.role_id=new FieldString("role_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.role_descr=new FieldString("role_descr",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldString("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_descr=new FieldString("user_descr",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.content=new FieldText("content",filed_options);MainMenuConstructorDialog_Model.superclass.constructor.call(this,id,options);}
extend(MainMenuConstructorDialog_Model,ModelXML); 
function MainMenuContent_Model(options){var id='MainMenuContent_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;options.fields.descr=new FieldString("descr",filed_options);var filed_options={};filed_options.primaryKey=false;options.fields.viewid=new FieldString("viewid",filed_options);var filed_options={};filed_options.primaryKey=false;options.fields.viewdescr=new FieldString("viewdescr",filed_options);var filed_options={};filed_options.primaryKey=false;options.fields["default"]=new FieldBool("default",filed_options);var filed_options={};filed_options.primaryKey=false;options.fields.glyphclass=new FieldString("glyphclass",filed_options);options.tagModel="menu";options.tagRow="menuitem";options.primaryKeyIndex=true;options.markOnDelete=false;options.sequences={"id":0};options.namespace="http://www.katren.org/crm/doc/mainmenu"
MainMenuContent_Model.superclass.constructor.call(this,id,options);}
extend(MainMenuContent_Model,ModelXMLTree);MainMenuContent_Model.prototype.getParentId=function(){var par_id;if(this.m_currentRow&&this.m_currentRow.parentNode&&this.m_currentRow.parentNode!=this.m_node){par_id=this.m_currentRow.parentNode.getAttribute("id");}
return par_id;}
MainMenuContent_Model.prototype.setRowValues=function(row){for(var id in this.m_fields){if(this.m_fields[id].isSet()){row.setAttribute(id,this.m_fields[id].getValue());}}}
MainMenuContent_Model.prototype.makeRow=function(){var row=document.createElement(this.getTagRow());for(var fid in this.m_fields){var cell=document.createElement(fid);var v="";if(this.m_fields[fid].isSet()){v=this.m_fields[fid].getValue();}
row.setAttribute(fid,v);}
return row;}
MainMenuContent_Model.prototype.fetchRow=function(row){var attrs=row.attributes;if(attrs){if(attrs.descr)this.m_fields.descr.setValue(attrs.descr.nodeValue);if(attrs.viewid)this.m_fields.viewid.setValue(attrs.viewid.nodeValue);this.m_fields.glyphclass.setValue((attrs.glyphclass)?attrs.glyphclass.nodeValue:undefined);if(attrs["default"])this.m_fields["default"].setValue(attrs["default"].nodeValue);this.m_fields.viewdescr.setValue(((attrs.viewdescr)?attrs.viewdescr.nodeValue:""));this.m_fields.id.setValue(attrs.id.nodeValue);}
return true;}
ModelXML.prototype.initSequences=function(){for(sid in this.m_sequences){this.m_sequences[sid]=(this.m_sequences[sid]==undefined)?0:this.m_sequences[sid];var rows=this.getRows();for(var r=0;r<rows.length;r++){if(rows[r].attributes&&rows[r].attributes.id){var dv=parseInt(rows[r].attributes.id.nodeValue,10);if(this.m_sequences[sid]<dv){this.m_sequences[sid]=dv;}}}}} 
function VariantStorage_Model(options){var id='VariantStorage_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);options.fields.id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.storage_name=new FieldText("storage_name",filed_options);options.fields.storage_name.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.variant_name=new FieldText("variant_name",filed_options);options.fields.variant_name.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.default_variant=new FieldBool("default_variant",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.filter_data=new FieldJSONB("filter_data",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.col_visib_data=new FieldText("col_visib_data",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.col_order_data=new FieldText("col_order_data",filed_options);VariantStorage_Model.superclass.constructor.call(this,id,options);}
extend(VariantStorage_Model,ModelXML); 
function VariantStorageList_Model(options){var id='VariantStorageList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=false;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.storage_name=new FieldText("storage_name",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.default_variant=new FieldBool("default_variant",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.variant_name=new FieldText("variant_name",filed_options);VariantStorageList_Model.superclass.constructor.call(this,id,options);}
extend(VariantStorageList_Model,ModelXML); 
function About_Model(options){var id='About_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.author=new FieldString("author",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.tech_mail=new FieldString("tech_mail",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.app_name=new FieldString("app_name",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.fw_version=new FieldString("fw_version",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.app_version=new FieldString("app_version",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.db_name=new FieldString("db_name",filed_options);About_Model.superclass.constructor.call(this,id,options);}
extend(About_Model,ModelXML); 
function Client_Model(options){var id='Client_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name=new FieldText("name",filed_options);options.fields.name.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.inn=new FieldString("inn",filed_options);options.fields.inn.getValidator().setRequired(true);options.fields.inn.getValidator().setMaxLength('12');Client_Model.superclass.constructor.call(this,id,options);}
extend(Client_Model,ModelXML); 
function OKEI_Model(options){var id='OKEI_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=false;options.fields.code=new FieldString("code",filed_options);options.fields.code.getValidator().setRequired(true);options.fields.code.getValidator().setMaxLength('5');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.okei_section_id=new FieldInt("okei_section_id",filed_options);options.fields.okei_section_id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name_full=new FieldText("name_full",filed_options);options.fields.name_full.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name_nat=new FieldString("name_nat",filed_options);options.fields.name_nat.getValidator().setRequired(true);options.fields.name_nat.getValidator().setMaxLength('150');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name_internat=new FieldString("name_internat",filed_options);options.fields.name_internat.getValidator().setMaxLength('150');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.code_nat=new FieldString("code_nat",filed_options);options.fields.code_nat.getValidator().setRequired(true);options.fields.code_nat.getValidator().setMaxLength('150');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.code_internat=new FieldString("code_internat",filed_options);options.fields.code_internat.getValidator().setRequired(true);options.fields.code_internat.getValidator().setMaxLength('150');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name_search=new FieldText("name_search",filed_options);OKEI_Model.superclass.constructor.call(this,id,options);}
extend(OKEI_Model,ModelXML); 
function OKEIList_Model(options){var id='OKEIList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=false;options.fields.code=new FieldString("code",filed_options);options.fields.code.getValidator().setRequired(true);options.fields.code.getValidator().setMaxLength('5');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.okei_sections_ref=new FieldJSON("okei_sections_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name_full=new FieldText("name_full",filed_options);options.fields.name_full.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name_nat=new FieldString("name_nat",filed_options);options.fields.name_nat.getValidator().setRequired(true);options.fields.name_nat.getValidator().setMaxLength('150');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name_internat=new FieldString("name_internat",filed_options);options.fields.name_internat.getValidator().setMaxLength('150');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.code_nat=new FieldString("code_nat",filed_options);options.fields.code_nat.getValidator().setRequired(true);options.fields.code_nat.getValidator().setMaxLength('150');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.code_internat=new FieldString("code_internat",filed_options);options.fields.code_internat.getValidator().setRequired(true);options.fields.code_internat.getValidator().setMaxLength('150');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name_search=new FieldText("name_search",filed_options);OKEIList_Model.superclass.constructor.call(this,id,options);}
extend(OKEIList_Model,ModelXML); 
function OKEISection_Model(options){var id='OKEISection_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name=new FieldString("name",filed_options);options.fields.name.getValidator().setRequired(true);options.fields.name.getValidator().setMaxLength('150');OKEISection_Model.superclass.constructor.call(this,id,options);}
extend(OKEISection_Model,ModelXML); 
Login_View.prototype.ER_LOGIN="Неправильный логин или пароль.";Login_View.prototype.CTRL_USER_LAB="Пользователь (email)";Login_View.prototype.CTRL_PWD_LAB="Пароль";UserProfile_View.prototype.HEAD_TITLE="Профиль пользователя";TimeZoneLocale_View.prototype.HEAD_TITLE="Временные зоны";MaterialList_View.prototype.HEAD_TITLE="Материалы";OKTMOList_View.prototype.HEAD_TITLE="ОКТМО"; 
if(window["LoginList_View"]){LoginList_View.prototype.GRID_USER_COL_CAP="Пользователь";LoginList_View.prototype.GRID_DATE_TIME_IN_COL_CAP="Дата входа";LoginList_View.prototype.GRID_DATE_TIME_OUT_COL_CAP="Дата выхода";LoginList_View.prototype.GRID_SET_DATE_TIME_COL_CAP="Последняя активность";LoginList_View.prototype.GRID_IP_COL_CAP="IP";LoginList_View.prototype.HEAD_TITLE="Сейнсы пользователей";}
ViewList_View.prototype.OPEN_TITLE="Открыть объект";ViewList_View.prototype.OPEN_WIN_TITLE="Открыть в новом окне";ViewList_View.prototype.GRID_COL_CAP="Объект";ViewList_View.prototype.HEAD_TITLE="Все формы";ConstantList_View.prototype.GRID_COL_CAP="Константы";ConstantList_View.prototype.HEAD_TITLE="Константы";ViewSectionSelect.prototype.LABEL_CAPTION="Вид объекта:";MainMenuConstructorList_View.prototype.HEAD_TITLE="Конструктор меню";MainMenuConstructorList_View.prototype.GRID_ROLE_ID_COL_CAP="Код роли";MainMenuConstructorList_View.prototype.GRID_ROLE_DESCR_COL_CAP="Роль";MainMenuConstructorList_View.prototype.GRID_USER_DESCR_COL_CAP="Пользователь";About_View.prototype.LB_APP_NAME="Приложение:";About_View.prototype.LB_VERSION="Версия:";About_View.prototype.LB_AUTHOR="Разработчик:";About_View.prototype.LB_DB_NAME="База данных:";About_View.prototype.LB_TECH_MAIL="Тех.поддержка:";About_View.prototype.LB_FW_SERVER_VERSION="Версия платформы (сервер):";About_View.prototype.LB_FW_CLIENT_VERSION="Версия платформы (клиент):";UserList_View.prototype.HEAD_TITLE="Пользователи"; 
function Constant_Controller(options){options=options||{};options.listModelClass=ConstantList_Model;options.objModelClass=ConstantList_Model;Constant_Controller.superclass.constructor.call(this,options);this.add_set_value();this.addGetList();this.addGetObject();this.add_get_values();}
extend(Constant_Controller,ControllerObjServer);Constant_Controller.prototype.add_set_value=function(){var opts={"controller":this};var pm=new PublicMethodServer('set_value',opts);var options={};options.required=true;pm.addField(new FieldString("id",options));var options={};pm.addField(new FieldString("val",options));this.addPublicMethod(pm);}
Constant_Controller.prototype.addGetList=function(){Constant_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldString("id",f_opts));var f_opts={};pm.addField(new FieldString("name",f_opts));var f_opts={};pm.addField(new FieldText("descr",f_opts));var f_opts={};pm.addField(new FieldText("val",f_opts));var f_opts={};pm.addField(new FieldText("val_type",f_opts));var f_opts={};pm.addField(new FieldText("ctrl_class",f_opts));var f_opts={};pm.addField(new FieldJSON("ctrl_options",f_opts));var f_opts={};pm.addField(new FieldText("view_class",f_opts));var f_opts={};pm.addField(new FieldJSON("view_options",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("name");}
Constant_Controller.prototype.addGetObject=function(){Constant_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldString("id",f_opts));pm.addField(new FieldString("mode"));}
Constant_Controller.prototype.add_get_values=function(){var opts={"controller":this};var pm=new PublicMethodServer('get_values',opts);var options={};pm.addField(new FieldString("id_list",options));var options={};options.maxlength="1";pm.addField(new FieldString("field_sep",options));this.addPublicMethod(pm);} 
function Enum_Controller(options){options=options||{};Enum_Controller.superclass.constructor.call(this,options);this.add_get_enum_list();}
extend(Enum_Controller,ControllerObjServer);Enum_Controller.prototype.add_get_enum_list=function(){var opts={"controller":this};var pm=new PublicMethodServer('get_enum_list',opts);var options={};pm.addField(new FieldString("id",options));this.addPublicMethod(pm);} 
function MainMenuConstructor_Controller(options){options=options||{};options.listModelClass=MainMenuConstructorList_Model;options.objModelClass=MainMenuConstructorDialog_Model;MainMenuConstructor_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();}
extend(MainMenuConstructor_Controller,ControllerObjServer);MainMenuConstructor_Controller.prototype.addInsert=function(){MainMenuConstructor_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.alias="Код";options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};options.required=true;options.enumValues='admin';var field=new FieldEnum("role_id",options);pm.addField(field);var options={};var field=new FieldInt("user_id",options);pm.addField(field);var options={};options.alias="Содержание";options.required=true;var field=new FieldText("content",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
MainMenuConstructor_Controller.prototype.addUpdate=function(){MainMenuConstructor_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.alias="Код";options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};options.enumValues='admin';options.enumValues+=(options.enumValues=='')?'':',';options.enumValues+='null';var field=new FieldEnum("role_id",options);pm.addField(field);var options={};var field=new FieldInt("user_id",options);pm.addField(field);var options={};options.alias="Содержание";var field=new FieldText("content",options);pm.addField(field);}
MainMenuConstructor_Controller.prototype.addDelete=function(){MainMenuConstructor_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};options.alias="Код";pm.addField(new FieldInt("id",options));}
MainMenuConstructor_Controller.prototype.addGetList=function(){MainMenuConstructor_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldString("role_id",f_opts));var f_opts={};pm.addField(new FieldString("role_descr",f_opts));var f_opts={};pm.addField(new FieldString("user_id",f_opts));var f_opts={};pm.addField(new FieldString("user_descr",f_opts));var f_opts={};pm.addField(new FieldText("content",f_opts));}
MainMenuConstructor_Controller.prototype.addGetObject=function(){MainMenuConstructor_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));} 
function MainMenuContent_Controller(options){options=options||{};options.listModelClass=MainMenuContent_Model;options.objModelClass=MainMenuContent_Model;MainMenuContent_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();}
extend(MainMenuContent_Controller,ControllerObjClient);MainMenuContent_Controller.prototype.addInsert=function(){MainMenuContent_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};var field=new FieldString("descr",options);pm.addField(field);var options={};var field=new FieldString("viewid",options);pm.addField(field);var options={};var field=new FieldString("viewdescr",options);pm.addField(field);var options={};var field=new FieldBool("default",options);pm.addField(field);var options={};var field=new FieldString("glyphclass",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
MainMenuContent_Controller.prototype.addUpdate=function(){MainMenuContent_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldString("descr",options);pm.addField(field);var options={};var field=new FieldString("viewid",options);pm.addField(field);var options={};var field=new FieldString("viewdescr",options);pm.addField(field);var options={};var field=new FieldBool("default",options);pm.addField(field);var options={};var field=new FieldString("glyphclass",options);pm.addField(field);}
MainMenuContent_Controller.prototype.addDelete=function(){MainMenuContent_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};pm.addField(new FieldInt("id",options));}
MainMenuContent_Controller.prototype.addGetList=function(){MainMenuContent_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldString("descr",f_opts));var f_opts={};pm.addField(new FieldString("viewid",f_opts));var f_opts={};pm.addField(new FieldString("viewdescr",f_opts));var f_opts={};pm.addField(new FieldBool("default",f_opts));var f_opts={};pm.addField(new FieldString("glyphclass",f_opts));}
MainMenuContent_Controller.prototype.addGetObject=function(){MainMenuContent_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));} 
function View_Controller(options){options=options||{};options.listModelClass=ViewList_Model;View_Controller.superclass.constructor.call(this,options);this.addGetList();this.addComplete();this.add_get_section_list();}
extend(View_Controller,ControllerObjServer);View_Controller.prototype.addGetList=function(){View_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};f_opts.alias="Код";pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldText("c",f_opts));var f_opts={};pm.addField(new FieldText("f",f_opts));var f_opts={};pm.addField(new FieldText("t",f_opts));var f_opts={};pm.addField(new FieldText("href",f_opts));var f_opts={};pm.addField(new FieldText("user_descr",f_opts));var f_opts={};pm.addField(new FieldText("section",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("user_descr");}
View_Controller.prototype.addComplete=function(){View_Controller.superclass.addComplete.call(this);var f_opts={};var pm=this.getComplete();pm.addField(new FieldText("user_descr",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("user_descr");}
View_Controller.prototype.add_get_section_list=function(){var opts={"controller":this};var pm=new PublicMethodServer('get_section_list',opts);this.addPublicMethod(pm);} 
function VariantStorage_Controller(options){options=options||{};options.objModelClass=VariantStorage_Model;VariantStorage_Controller.superclass.constructor.call(this,options);this.addInsert();this.add_upsert_filter_data();this.add_upsert_col_visib_data();this.add_upsert_col_order_data();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();this.add_get_filter_data();this.add_get_col_visib_data();this.add_get_col_order_data();}
extend(VariantStorage_Controller,ControllerObjServer);VariantStorage_Controller.prototype.addInsert=function(){VariantStorage_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};var field=new FieldInt("user_id",options);pm.addField(field);var options={};options.required=true;var field=new FieldText("storage_name",options);pm.addField(field);var options={};options.required=true;var field=new FieldText("variant_name",options);pm.addField(field);var options={};var field=new FieldBool("default_variant",options);pm.addField(field);var options={};var field=new FieldJSONB("filter_data",options);pm.addField(field);var options={};var field=new FieldText("col_visib_data",options);pm.addField(field);var options={};var field=new FieldText("col_order_data",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
VariantStorage_Controller.prototype.add_upsert_filter_data=function(){var opts={"controller":this};var pm=new PublicMethodServer('upsert_filter_data',opts);var options={};options.required=true;pm.addField(new FieldString("storage_name",options));var options={};options.required=true;pm.addField(new FieldString("variant_name",options));var options={};options.required=true;pm.addField(new FieldString("filter_data",options));var options={};options.required=true;pm.addField(new FieldBool("default_variant",options));this.addPublicMethod(pm);}
VariantStorage_Controller.prototype.add_upsert_col_visib_data=function(){var opts={"controller":this};var pm=new PublicMethodServer('upsert_col_visib_data',opts);var options={};options.required=true;pm.addField(new FieldString("storage_name",options));var options={};options.required=true;pm.addField(new FieldString("variant_name",options));var options={};options.required=true;pm.addField(new FieldString("col_visib",options));var options={};options.required=true;pm.addField(new FieldBool("default_variant",options));this.addPublicMethod(pm);}
VariantStorage_Controller.prototype.add_upsert_col_order_data=function(){var opts={"controller":this};var pm=new PublicMethodServer('upsert_col_order_data',opts);var options={};options.required=true;pm.addField(new FieldString("storage_name",options));var options={};options.required=true;pm.addField(new FieldString("variant_name",options));var options={};options.required=true;pm.addField(new FieldString("col_order",options));var options={};options.required=true;pm.addField(new FieldBool("default_variant",options));this.addPublicMethod(pm);}
VariantStorage_Controller.prototype.addUpdate=function(){VariantStorage_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldInt("user_id",options);pm.addField(field);var options={};var field=new FieldText("storage_name",options);pm.addField(field);var options={};var field=new FieldText("variant_name",options);pm.addField(field);var options={};var field=new FieldBool("default_variant",options);pm.addField(field);var options={};var field=new FieldJSONB("filter_data",options);pm.addField(field);var options={};var field=new FieldText("col_visib_data",options);pm.addField(field);var options={};var field=new FieldText("col_order_data",options);pm.addField(field);}
VariantStorage_Controller.prototype.addDelete=function(){VariantStorage_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};pm.addField(new FieldInt("id",options));}
VariantStorage_Controller.prototype.addGetList=function(){VariantStorage_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var options={};options.required=true;pm.addField(new FieldString("storage_name",options));var options={};pm.addField(new FieldString("variant_name",options));}
VariantStorage_Controller.prototype.addGetObject=function(){VariantStorage_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));}
VariantStorage_Controller.prototype.add_get_filter_data=function(){var opts={"controller":this};var pm=new PublicMethodServer('get_filter_data',opts);var options={};options.required=true;pm.addField(new FieldString("storage_name",options));var options={};pm.addField(new FieldString("variant_name",options));this.addPublicMethod(pm);}
VariantStorage_Controller.prototype.add_get_col_visib_data=function(){var opts={"controller":this};var pm=new PublicMethodServer('get_col_visib_data',opts);var options={};options.required=true;pm.addField(new FieldString("storage_name",options));var options={};pm.addField(new FieldString("variant_name",options));this.addPublicMethod(pm);}
VariantStorage_Controller.prototype.add_get_col_order_data=function(){var opts={"controller":this};var pm=new PublicMethodServer('get_col_order_data',opts);var options={};options.required=true;pm.addField(new FieldString("storage_name",options));var options={};pm.addField(new FieldString("variant_name",options));this.addPublicMethod(pm);} 
function About_Controller(options){options=options||{};options.objModelClass=About_Model;About_Controller.superclass.constructor.call(this,options);this.addGetObject();}
extend(About_Controller,ControllerObjServer);About_Controller.prototype.addGetObject=function(){About_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();pm.addField(new FieldString("mode"));} 
function Login_Controller(options){options=options||{};options.listModelClass=LoginList_Model;options.objModelClass=LoginList_Model;Login_Controller.superclass.constructor.call(this,options);this.addGetList();this.addGetObject();}
extend(Login_Controller,ControllerObjServer);Login_Controller.prototype.addGetList=function(){Login_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};f_opts.alias="Дата входа";pm.addField(new FieldDateTimeTZ("date_time_in",f_opts));var f_opts={};f_opts.alias="Дата выхода";pm.addField(new FieldDateTimeTZ("date_time_out",f_opts));var f_opts={};f_opts.alias="IP адрес";pm.addField(new FieldString("ip",f_opts));var f_opts={};pm.addField(new FieldInt("user_id",f_opts));var f_opts={};f_opts.alias="Пользователь";pm.addField(new FieldJSON("users_ref",f_opts));var f_opts={};pm.addField(new FieldString("pub_key",f_opts));var f_opts={};f_opts.alias="Время последнего обращения";pm.addField(new FieldDateTimeTZ("set_date_time",f_opts));}
Login_Controller.prototype.addGetObject=function(){Login_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));} 
App.prototype.m_predefinedItems={"stores":{"base":new RefType({"dataType":"stores","descr":"Тюмень","keys":{"id":1}}),"in_route":new RefType({"dataType":"stores","descr":"В пути","keys":{"id":2}})}}; 
function Enum_locales(id,options){options=options||{};options.addNotSelected=(options.addNotSelected!=undefined)?options.addNotSelected:true;options.options=[{"value":"ru","descr":this.multyLangValues[window.getApp().getLocale()+"_"+"ru"],checked:(options.defaultValue&&options.defaultValue=="ru")}];Enum_locales.superclass.constructor.call(this,id,options);}
extend(Enum_locales,EditSelect);Enum_locales.prototype.multyLangValues={"ru_ru":"Русский"}; 
function EnumGridColumn_locales(options){options=options||{};options.multyLangValues={};options.multyLangValues["ru"]={};options.multyLangValues["ru"]["ru"]="Русский";options.ctrlClass=options.ctrlClass||Enum_locales;options.searchOptions=options.searchOptions||{};options.searchOptions.searchType=options.searchOptions.searchType||"on_match";options.searchOptions.typeChange=(options.searchOptions.typeChange!=undefined)?options.searchOptions.typeChange:false;EnumGridColumn_locales.superclass.constructor.call(this,options);}
extend(EnumGridColumn_locales,GridColumnEnum); 
function Enum_role_types(id,options){options=options||{};options.addNotSelected=(options.addNotSelected!=undefined)?options.addNotSelected:true;options.options=[{"value":"admin","descr":this.multyLangValues[window.getApp().getLocale()+"_"+"admin"],checked:(options.defaultValue&&options.defaultValue=="admin")}];Enum_role_types.superclass.constructor.call(this,id,options);}
extend(Enum_role_types,EditSelect);Enum_role_types.prototype.multyLangValues={"ru_admin":"Администратор"}; 
function EnumGridColumn_role_types(options){options=options||{};options.multyLangValues={};options.multyLangValues["ru"]={};options.multyLangValues["ru"]["admin"]="Администратор";options.ctrlClass=options.ctrlClass||Enum_role_types;options.searchOptions=options.searchOptions||{};options.searchOptions.searchType=options.searchOptions.searchType||"on_match";options.searchOptions.typeChange=(options.searchOptions.typeChange!=undefined)?options.searchOptions.typeChange:false;EnumGridColumn_role_types.superclass.constructor.call(this,options);}
extend(EnumGridColumn_role_types,GridColumnEnum); 
function Enum_data_types(id,options){options=options||{};options.addNotSelected=(options.addNotSelected!=undefined)?options.addNotSelected:true;options.options=[{"value":"users","descr":this.multyLangValues[window.getApp().getLocale()+"_"+"users"],checked:(options.defaultValue&&options.defaultValue=="users")}];Enum_data_types.superclass.constructor.call(this,id,options);}
extend(Enum_data_types,EditSelect);Enum_data_types.prototype.multyLangValues={"ru_users":"Пользователи"}; 
function EnumGridColumn_data_types(options){options=options||{};options.multyLangValues={};options.multyLangValues["ru"]={};options.multyLangValues["ru"]["users"]="Пользователи";options.ctrlClass=options.ctrlClass||Enum_data_types;options.searchOptions=options.searchOptions||{};options.searchOptions.searchType=options.searchOptions.searchType||"on_match";options.searchOptions.typeChange=(options.searchOptions.typeChange!=undefined)?options.searchOptions.typeChange:false;EnumGridColumn_data_types.superclass.constructor.call(this,options);}
extend(EnumGridColumn_data_types,GridColumnEnum); 
function Enum_reg_types(id,options){options=options||{};options.addNotSelected=(options.addNotSelected!=undefined)?options.addNotSelected:true;options.options=[{"value":"material","descr":this.multyLangValues[window.getApp().getLocale()+"_"+"material"],checked:(options.defaultValue&&options.defaultValue=="material")},{"value":"order","descr":this.multyLangValues[window.getApp().getLocale()+"_"+"order"],checked:(options.defaultValue&&options.defaultValue=="order")}];Enum_reg_types.superclass.constructor.call(this,id,options);}
extend(Enum_reg_types,EditSelect);Enum_reg_types.prototype.multyLangValues={"ru_material":"Учет материалов"}; 
function EnumGridColumn_reg_types(options){options=options||{};options.multyLangValues={};options.multyLangValues["ru"]={};options.multyLangValues["ru"]["material"]="Учет материалов";options.multyLangValues["ru"]["order"]="Учет заказов";options.ctrlClass=options.ctrlClass||Enum_reg_types;options.searchOptions=options.searchOptions||{};options.searchOptions.searchType=options.searchOptions.searchType||"on_match";options.searchOptions.typeChange=(options.searchOptions.typeChange!=undefined)?options.searchOptions.typeChange:false;EnumGridColumn_reg_types.superclass.constructor.call(this,options);}
extend(EnumGridColumn_reg_types,GridColumnEnum); 
App.prototype.m_enums={"locales":{"ru_ru":"Русский"},"role_types":{"ru_admin":"Администратор"},"data_types":{"ru_users":"Пользователи"}}; 
function TimeZoneLocale_Controller(options){options=options||{};options.listModelClass=TimeZoneLocale_Model;options.objModelClass=TimeZoneLocale_Model;TimeZoneLocale_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();}
extend(TimeZoneLocale_Controller,ControllerObjServer);TimeZoneLocale_Controller.prototype.addInsert=function(){TimeZoneLocale_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.alias="Код";options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};options.required=true;var field=new FieldString("descr",options);pm.addField(field);var options={};options.required=true;var field=new FieldString("name",options);pm.addField(field);var options={};options.required=true;var field=new FieldFloat("hour_dif",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
TimeZoneLocale_Controller.prototype.addUpdate=function(){TimeZoneLocale_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.alias="Код";options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldString("descr",options);pm.addField(field);var options={};var field=new FieldString("name",options);pm.addField(field);var options={};var field=new FieldFloat("hour_dif",options);pm.addField(field);}
TimeZoneLocale_Controller.prototype.addDelete=function(){TimeZoneLocale_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};options.alias="Код";pm.addField(new FieldInt("id",options));}
TimeZoneLocale_Controller.prototype.addGetList=function(){TimeZoneLocale_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};f_opts.alias="Код";pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldString("descr",f_opts));var f_opts={};pm.addField(new FieldString("name",f_opts));var f_opts={};pm.addField(new FieldFloat("hour_dif",f_opts));}
TimeZoneLocale_Controller.prototype.addGetObject=function(){TimeZoneLocale_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};f_opts.alias="Код";pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));} 
function Client_Controller(options){options=options||{};options.listModelClass=Client_Model;options.objModelClass=Client_Model;Client_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();}
extend(Client_Controller,ControllerObjServer);Client_Controller.prototype.addInsert=function(){Client_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};options.required=true;var field=new FieldText("name",options);pm.addField(field);var options={};options.required=true;var field=new FieldString("inn",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
Client_Controller.prototype.addUpdate=function(){Client_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldText("name",options);pm.addField(field);var options={};var field=new FieldString("inn",options);pm.addField(field);}
Client_Controller.prototype.addDelete=function(){Client_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};pm.addField(new FieldInt("id",options));}
Client_Controller.prototype.addGetList=function(){Client_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldText("name",f_opts));var f_opts={};pm.addField(new FieldString("inn",f_opts));}
Client_Controller.prototype.addGetObject=function(){Client_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));} 
function OKEI_Controller(options){options=options||{};options.listModelClass=OKEIList_Model;options.objModelClass=OKEIList_Model;OKEI_Controller.superclass.constructor.call(this,options);this.addGetList();this.addGetObject();this.addComplete();}
extend(OKEI_Controller,ControllerObjServer);OKEI_Controller.prototype.addGetList=function(){OKEI_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldString("code",f_opts));var f_opts={};pm.addField(new FieldJSON("okei_sections_ref",f_opts));var f_opts={};pm.addField(new FieldText("name_full",f_opts));var f_opts={};pm.addField(new FieldString("name_nat",f_opts));var f_opts={};pm.addField(new FieldString("name_internat",f_opts));var f_opts={};pm.addField(new FieldString("code_nat",f_opts));var f_opts={};pm.addField(new FieldString("code_internat",f_opts));var f_opts={};pm.addField(new FieldText("name_search",f_opts));}
OKEI_Controller.prototype.addGetObject=function(){OKEI_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldString("code",f_opts));pm.addField(new FieldString("mode"));}
OKEI_Controller.prototype.addComplete=function(){OKEI_Controller.superclass.addComplete.call(this);var f_opts={};var pm=this.getComplete();pm.addField(new FieldText("name_search",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("name_search");} 
function OKEISection_Controller(options){options=options||{};options.listModelClass=OKEISection_Model;options.objModelClass=OKEISection_Model;OKEISection_Controller.superclass.constructor.call(this,options);this.addGetList();this.addGetObject();}
extend(OKEISection_Controller,ControllerObjServer);OKEISection_Controller.prototype.addGetList=function(){OKEISection_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldString("name",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("name");}
OKEISection_Controller.prototype.addGetObject=function(){OKEISection_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));} 
function Material_Controller(options){options=options||{};options.listModelClass=MaterialList_Model;options.objModelClass=MaterialList_Model;Material_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();this.addComplete();this.add_get_material_action();}
extend(Material_Controller,ControllerObjServer);Material_Controller.prototype.addInsert=function(){Material_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};options.required=true;var field=new FieldString("name",options);pm.addField(field);var options={};var field=new FieldText("name_full",options);pm.addField(field);var options={};options.required=true;var field=new FieldString("okei_code",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
Material_Controller.prototype.addUpdate=function(){Material_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldString("name",options);pm.addField(field);var options={};var field=new FieldText("name_full",options);pm.addField(field);var options={};var field=new FieldString("okei_code",options);pm.addField(field);}
Material_Controller.prototype.addDelete=function(){Material_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};pm.addField(new FieldInt("id",options));}
Material_Controller.prototype.addGetList=function(){Material_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldString("name",f_opts));var f_opts={};pm.addField(new FieldText("name_full",f_opts));var f_opts={};pm.addField(new FieldJSON("okei_ref",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("name");}
Material_Controller.prototype.addGetObject=function(){Material_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));}
Material_Controller.prototype.addComplete=function(){Material_Controller.superclass.addComplete.call(this);var f_opts={};var pm=this.getComplete();pm.addField(new FieldString("name",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("name");}
Material_Controller.prototype.add_get_material_action=function(){var opts={"controller":this};var pm=new PublicMethodServer('get_material_action',opts);var options={};pm.addField(new FieldString("cond_fields",options));var options={};pm.addField(new FieldString("cond_vals",options));var options={};pm.addField(new FieldString("cond_ic",options));var options={};pm.addField(new FieldString("cond_sgns",options));var options={};pm.addField(new FieldString("ord_fields",options));var options={};pm.addField(new FieldString("ord_directs",options));var options={};pm.addField(new FieldString("field_sep",options));var options={};pm.addField(new FieldString("templ",options));var options={};pm.addField(new FieldInt("inline",options));this.addPublicMethod(pm);} 
function MaterialList_Model(options){var id='MaterialList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name=new FieldString("name",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name_full=new FieldText("name_full",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.okei_ref=new FieldJSON("okei_ref",filed_options);MaterialList_Model.superclass.constructor.call(this,id,options);}
extend(MaterialList_Model,ModelXML); 
function Material_Model(options){var id='Material_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name=new FieldString("name",filed_options);options.fields.name.getValidator().setRequired(true);options.fields.name.getValidator().setMaxLength('150');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name_full=new FieldText("name_full",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.okei_code=new FieldString("okei_code",filed_options);options.fields.okei_code.getValidator().setRequired(true);options.fields.okei_code.getValidator().setMaxLength('5');Material_Model.superclass.constructor.call(this,id,options);}
extend(Material_Model,ModelXML); 
function OKTMO_Controller(options){options=options||{};options.listModelClass=OKTMO_Model;options.objModelClass=OKTMO_Model;OKTMO_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();}
extend(OKTMO_Controller,ControllerObjServer);OKTMO_Controller.prototype.addInsert=function(){OKTMO_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};options.required=true;var field=new FieldText("name",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
OKTMO_Controller.prototype.addUpdate=function(){OKTMO_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldText("name",options);pm.addField(field);}
OKTMO_Controller.prototype.addDelete=function(){OKTMO_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};pm.addField(new FieldInt("id",options));}
OKTMO_Controller.prototype.addGetList=function(){OKTMO_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldText("name",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("name");}
OKTMO_Controller.prototype.addGetObject=function(){OKTMO_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));} 
function OKTMO_Model(options){var id='OKTMO_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name=new FieldText("name",filed_options);options.fields.name.getValidator().setRequired(true);OKTMO_Model.superclass.constructor.call(this,id,options);}
extend(OKTMO_Model,ModelXML); 
function OKTMOContractList_Model(options){var id='OKTMOContractList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_id=new FieldInt("oktmo_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name=new FieldText("name",filed_options);options.fields.name.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_ref=new FieldJSON("oktmo_ref",filed_options);OKTMOContractList_Model.superclass.constructor.call(this,id,options);}
extend(OKTMOContractList_Model,ModelXML); 
function OKTMOContract_Controller(options){options=options||{};options.listModelClass=OKTMOContractList_Model;options.objModelClass=OKTMOContractList_Model;OKTMOContract_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();}
extend(OKTMOContract_Controller,ControllerObjServer);OKTMOContract_Controller.prototype.addInsert=function(){OKTMOContract_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};options.required=true;var field=new FieldText("name",options);pm.addField(field);var options={};options.required=true;var field=new FieldInt("oktmo_id",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
OKTMOContract_Controller.prototype.addUpdate=function(){OKTMOContract_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldText("name",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_id",options);pm.addField(field);}
OKTMOContract_Controller.prototype.addDelete=function(){OKTMOContract_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};pm.addField(new FieldInt("id",options));}
OKTMOContract_Controller.prototype.addGetList=function(){OKTMOContract_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldInt("oktmo_id",f_opts));var f_opts={};pm.addField(new FieldText("name",f_opts));var f_opts={};pm.addField(new FieldJSON("oktmo_ref",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("name");}
OKTMOContract_Controller.prototype.addGetObject=function(){OKTMOContract_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));} 
function OKTMOContract_Model(options){var id='OKTMOContract_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name=new FieldText("name",filed_options);options.fields.name.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_id=new FieldInt("oktmo_id",filed_options);options.fields.oktmo_id.getValidator().setRequired(true);OKTMOContract_Model.superclass.constructor.call(this,id,options);}
extend(OKTMOContract_Model,ModelXML); 
function UserProfile_Model(options){var id='UserProfile_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.alias='Код';filed_options.autoInc=false;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Имя';filed_options.autoInc=false;options.fields.name=new FieldString("name",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name_full=new FieldString("name_full",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Эл.почта';filed_options.autoInc=false;options.fields.email=new FieldString("email",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Телефон';filed_options.autoInc=false;options.fields.phone_cel=new FieldString("phone_cel",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.locale_id=new FieldString("locale_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.time_zone_locales_ref=new FieldJSON("time_zone_locales_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.tel_ext=new FieldString("tel_ext",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_id=new FieldInt("oktmo_id",filed_options);UserProfile_Model.superclass.constructor.call(this,id,options);}
extend(UserProfile_Model,ModelXML); 
function DocOrder_Model(options){var id='DocOrder_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_id=new FieldInt("oktmo_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contract_id=new FieldInt("oktmo_contract_id",filed_options);options.fields.oktmo_contract_id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.closed=new FieldBool("closed",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed_inf=new FieldJSONB("closed_inf",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials=new FieldJSONB("materials",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials_search=new FieldText("materials_search",filed_options);DocOrder_Model.superclass.constructor.call(this,id,options);}
extend(DocOrder_Model,ModelXML); 
function DocOrderList_Model(options){var id='DocOrderList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);options.fields.id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);options.fields.date_time.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.users_ref=new FieldJSON("users_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_id=new FieldInt("oktmo_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_ref=new FieldJSON("oktmo_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contracts_ref=new FieldJSON("oktmo_contracts_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contract_id=new FieldInt("oktmo_contract_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed=new FieldBool("closed",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed_inf=new FieldJSONB("closed_inf",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials_search=new FieldText("materials_search",filed_options);DocOrderList_Model.superclass.constructor.call(this,id,options);}
extend(DocOrderList_Model,ModelXML); 
function DocOrderDialog_Model(options){var id='DocOrderDialog_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);options.fields.id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);options.fields.date_time.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.users_ref=new FieldJSON("users_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_ref=new FieldJSON("oktmo_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contracts_ref=new FieldJSON("oktmo_contracts_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed=new FieldBool("closed",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed_inf=new FieldJSONB("closed_inf",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials=new FieldJSON("materials",filed_options);DocOrderDialog_Model.superclass.constructor.call(this,id,options);}
extend(DocOrderDialog_Model,ModelXML); 
function DocOrder_Controller(options){options=options||{};options.listModelClass=DocOrderList_Model;options.objModelClass=DocOrderDialog_Model;DocOrder_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();}
extend(DocOrder_Controller,ControllerObjServer);DocOrder_Controller.prototype.addInsert=function(){DocOrder_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};var field=new FieldDateTimeTZ("date_time",options);pm.addField(field);var options={};var field=new FieldInt("user_id",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_id",options);pm.addField(field);var options={};options.required=true;var field=new FieldInt("oktmo_contract_id",options);pm.addField(field);var options={};var field=new FieldBool("closed",options);pm.addField(field);var options={};var field=new FieldJSONB("closed_inf",options);pm.addField(field);var options={};var field=new FieldJSONB("materials",options);pm.addField(field);var options={};var field=new FieldText("materials_search",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
DocOrder_Controller.prototype.addUpdate=function(){DocOrder_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldDateTimeTZ("date_time",options);pm.addField(field);var options={};var field=new FieldInt("user_id",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_id",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_contract_id",options);pm.addField(field);var options={};var field=new FieldBool("closed",options);pm.addField(field);var options={};var field=new FieldJSONB("closed_inf",options);pm.addField(field);var options={};var field=new FieldJSONB("materials",options);pm.addField(field);var options={};var field=new FieldText("materials_search",options);pm.addField(field);}
DocOrder_Controller.prototype.addDelete=function(){DocOrder_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};pm.addField(new FieldInt("id",options));}
DocOrder_Controller.prototype.addGetList=function(){DocOrder_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldDateTimeTZ("date_time",f_opts));var f_opts={};pm.addField(new FieldInt("user_id",f_opts));var f_opts={};pm.addField(new FieldJSON("users_ref",f_opts));var f_opts={};pm.addField(new FieldInt("oktmo_id",f_opts));var f_opts={};pm.addField(new FieldJSON("oktmo_ref",f_opts));var f_opts={};pm.addField(new FieldJSON("oktmo_contracts_ref",f_opts));var f_opts={};pm.addField(new FieldInt("oktmo_contract_id",f_opts));var f_opts={};pm.addField(new FieldBool("closed",f_opts));var f_opts={};pm.addField(new FieldJSONB("closed_inf",f_opts));var f_opts={};pm.addField(new FieldText("materials_search",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("date_time");}
DocOrder_Controller.prototype.addGetObject=function(){DocOrder_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));} 
function DocShipment_Model(options){var id='DocShipment_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.ship_date=new FieldDate("ship_date",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_id=new FieldInt("oktmo_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contract_id=new FieldInt("oktmo_contract_id",filed_options);options.fields.oktmo_contract_id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.barge_num=new FieldText("barge_num",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials=new FieldJSONB("materials",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials_search=new FieldText("materials_search",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.pallets=new FieldJSONB("pallets",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.total=new FieldFloat("total",filed_options);options.fields.total.getValidator().setMaxLength('15');DocShipment_Model.superclass.constructor.call(this,id,options);}
extend(DocShipment_Model,ModelXML); 
function DocShipmentList_Model(options){var id='DocShipmentList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);options.fields.id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.ship_date=new FieldDate("ship_date",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.barge_num=new FieldText("barge_num",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.users_ref=new FieldJSON("users_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_id=new FieldInt("oktmo_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_ref=new FieldJSON("oktmo_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contracts_ref=new FieldJSON("oktmo_contracts_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contract_id=new FieldInt("oktmo_contract_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials_search=new FieldText("materials_search",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.total=new FieldFloat("total",filed_options);options.fields.total.getValidator().setMaxLength('15');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.self_descr=new FieldString("self_descr",filed_options);DocShipmentList_Model.superclass.constructor.call(this,id,options);}
extend(DocShipmentList_Model,ModelXML); 
function DocShipmentDialog_Model(options){var id='DocShipmentDialog_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);options.fields.id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.barge_num=new FieldText("barge_num",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.ship_date=new FieldDate("ship_date",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.users_ref=new FieldJSON("users_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_ref=new FieldJSON("oktmo_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contracts_ref=new FieldJSON("oktmo_contracts_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials=new FieldJSON("materials",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.pallets=new FieldJSON("pallets",filed_options);DocShipmentDialog_Model.superclass.constructor.call(this,id,options);}
extend(DocShipmentDialog_Model,ModelXML); 
function DocShipment_Controller(options){options=options||{};options.listModelClass=DocShipmentList_Model;options.objModelClass=DocShipmentDialog_Model;DocShipment_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();this.addComplete();}
extend(DocShipment_Controller,ControllerObjServer);DocShipment_Controller.prototype.addInsert=function(){DocShipment_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};var field=new FieldDateTimeTZ("date_time",options);pm.addField(field);var options={};var field=new FieldDate("ship_date",options);pm.addField(field);var options={};var field=new FieldInt("user_id",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_id",options);pm.addField(field);var options={};options.required=true;var field=new FieldInt("oktmo_contract_id",options);pm.addField(field);var options={};var field=new FieldText("barge_num",options);pm.addField(field);var options={};var field=new FieldJSONB("materials",options);pm.addField(field);var options={};var field=new FieldText("materials_search",options);pm.addField(field);var options={};var field=new FieldJSONB("pallets",options);pm.addField(field);var options={};var field=new FieldFloat("total",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
DocShipment_Controller.prototype.addUpdate=function(){DocShipment_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldDateTimeTZ("date_time",options);pm.addField(field);var options={};var field=new FieldDate("ship_date",options);pm.addField(field);var options={};var field=new FieldInt("user_id",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_id",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_contract_id",options);pm.addField(field);var options={};var field=new FieldText("barge_num",options);pm.addField(field);var options={};var field=new FieldJSONB("materials",options);pm.addField(field);var options={};var field=new FieldText("materials_search",options);pm.addField(field);var options={};var field=new FieldJSONB("pallets",options);pm.addField(field);var options={};var field=new FieldFloat("total",options);pm.addField(field);}
DocShipment_Controller.prototype.addDelete=function(){DocShipment_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};pm.addField(new FieldInt("id",options));}
DocShipment_Controller.prototype.addGetList=function(){DocShipment_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldDateTimeTZ("date_time",f_opts));var f_opts={};pm.addField(new FieldDate("ship_date",f_opts));var f_opts={};pm.addField(new FieldText("barge_num",f_opts));var f_opts={};pm.addField(new FieldInt("user_id",f_opts));var f_opts={};pm.addField(new FieldJSON("users_ref",f_opts));var f_opts={};pm.addField(new FieldInt("oktmo_id",f_opts));var f_opts={};pm.addField(new FieldJSON("oktmo_ref",f_opts));var f_opts={};pm.addField(new FieldJSON("oktmo_contracts_ref",f_opts));var f_opts={};pm.addField(new FieldInt("oktmo_contract_id",f_opts));var f_opts={};pm.addField(new FieldText("materials_search",f_opts));var f_opts={};pm.addField(new FieldFloat("total",f_opts));var f_opts={};pm.addField(new FieldString("self_descr",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("date_time");}
DocShipment_Controller.prototype.addGetObject=function(){DocShipment_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));}
DocShipment_Controller.prototype.addComplete=function(){DocShipment_Controller.superclass.addComplete.call(this);var f_opts={};var pm=this.getComplete();pm.addField(new FieldString("self_descr",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("self_descr");} 
function DocPassToProduction_Model(options){var id='DocPassToProduction_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_id=new FieldInt("oktmo_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contract_id=new FieldInt("oktmo_contract_id",filed_options);options.fields.oktmo_contract_id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.closed=new FieldBool("closed",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed_inf=new FieldJSONB("closed_inf",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials=new FieldJSONB("materials",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials_search=new FieldText("materials_search",filed_options);DocPassToProduction_Model.superclass.constructor.call(this,id,options);}
extend(DocPassToProduction_Model,ModelXML); 
function DocPassToProductionList_Model(options){var id='DocPassToProductionList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);options.fields.id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.users_ref=new FieldJSON("users_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_id=new FieldInt("oktmo_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_ref=new FieldJSON("oktmo_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contracts_ref=new FieldJSON("oktmo_contracts_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contract_id=new FieldInt("oktmo_contract_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed=new FieldBool("closed",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed_inf=new FieldJSONB("closed_inf",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials_search=new FieldText("materials_search",filed_options);DocPassToProductionList_Model.superclass.constructor.call(this,id,options);}
extend(DocPassToProductionList_Model,ModelXML); 
function DocPassToProductionDialog_Model(options){var id='DocPassToProductionDialog_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);options.fields.id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);options.fields.date_time.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.users_ref=new FieldJSON("users_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_ref=new FieldJSON("oktmo_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contracts_ref=new FieldJSON("oktmo_contracts_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed=new FieldBool("closed",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed_inf=new FieldJSONB("closed_inf",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials=new FieldJSON("materials",filed_options);DocPassToProductionDialog_Model.superclass.constructor.call(this,id,options);}
extend(DocPassToProductionDialog_Model,ModelXML); 
function DocPassToProduction_Controller(options){options=options||{};options.listModelClass=DocPassToProductionList_Model;options.objModelClass=DocPassToProductionDialog_Model;DocPassToProduction_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();}
extend(DocPassToProduction_Controller,ControllerObjServer);DocPassToProduction_Controller.prototype.addInsert=function(){DocPassToProduction_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};var field=new FieldDateTimeTZ("date_time",options);pm.addField(field);var options={};var field=new FieldInt("user_id",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_id",options);pm.addField(field);var options={};options.required=true;var field=new FieldInt("oktmo_contract_id",options);pm.addField(field);var options={};var field=new FieldBool("closed",options);pm.addField(field);var options={};var field=new FieldJSONB("closed_inf",options);pm.addField(field);var options={};var field=new FieldJSONB("materials",options);pm.addField(field);var options={};var field=new FieldText("materials_search",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
DocPassToProduction_Controller.prototype.addUpdate=function(){DocPassToProduction_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldDateTimeTZ("date_time",options);pm.addField(field);var options={};var field=new FieldInt("user_id",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_id",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_contract_id",options);pm.addField(field);var options={};var field=new FieldBool("closed",options);pm.addField(field);var options={};var field=new FieldJSONB("closed_inf",options);pm.addField(field);var options={};var field=new FieldJSONB("materials",options);pm.addField(field);var options={};var field=new FieldText("materials_search",options);pm.addField(field);}
DocPassToProduction_Controller.prototype.addDelete=function(){DocPassToProduction_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};pm.addField(new FieldInt("id",options));}
DocPassToProduction_Controller.prototype.addGetList=function(){DocPassToProduction_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldDateTimeTZ("date_time",f_opts));var f_opts={};pm.addField(new FieldInt("user_id",f_opts));var f_opts={};pm.addField(new FieldJSON("users_ref",f_opts));var f_opts={};pm.addField(new FieldInt("oktmo_id",f_opts));var f_opts={};pm.addField(new FieldJSON("oktmo_ref",f_opts));var f_opts={};pm.addField(new FieldJSON("oktmo_contracts_ref",f_opts));var f_opts={};pm.addField(new FieldInt("oktmo_contract_id",f_opts));var f_opts={};pm.addField(new FieldBool("closed",f_opts));var f_opts={};pm.addField(new FieldJSONB("closed_inf",f_opts));var f_opts={};pm.addField(new FieldText("materials_search",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("date_time");}
DocPassToProduction_Controller.prototype.addGetObject=function(){DocPassToProduction_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));} 
function DocMovement_Model(options){var id='DocMovement_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_id=new FieldInt("oktmo_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contract_id=new FieldInt("oktmo_contract_id",filed_options);options.fields.oktmo_contract_id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.to_oktmo_id=new FieldInt("to_oktmo_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.to_oktmo_contract_id=new FieldInt("to_oktmo_contract_id",filed_options);options.fields.to_oktmo_contract_id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.closed=new FieldBool("closed",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed_inf=new FieldJSONB("closed_inf",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials=new FieldJSONB("materials",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials_search=new FieldText("materials_search",filed_options);DocMovement_Model.superclass.constructor.call(this,id,options);}
extend(DocMovement_Model,ModelXML); 
function DocMovementList_Model(options){var id='DocMovementList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);options.fields.id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);options.fields.date_time.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.users_ref=new FieldJSON("users_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_id=new FieldInt("oktmo_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_ref=new FieldJSON("oktmo_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.to_oktmo_id=new FieldInt("to_oktmo_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.to_oktmo_ref=new FieldJSON("to_oktmo_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contracts_ref=new FieldJSON("oktmo_contracts_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contract_id=new FieldInt("oktmo_contract_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.to_oktmo_contracts_ref=new FieldJSON("to_oktmo_contracts_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.to_oktmo_contract_id=new FieldInt("to_oktmo_contract_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed=new FieldBool("closed",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed_inf=new FieldJSONB("closed_inf",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials_search=new FieldText("materials_search",filed_options);DocMovementList_Model.superclass.constructor.call(this,id,options);}
extend(DocMovementList_Model,ModelXML); 
function DocMovementDialog_Model(options){var id='DocMovementDialog_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);options.fields.id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);options.fields.date_time.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.users_ref=new FieldJSON("users_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_ref=new FieldJSON("oktmo_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.to_oktmo_ref=new FieldJSON("to_oktmo_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contracts_ref=new FieldJSON("oktmo_contracts_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.to_oktmo_contracts_ref=new FieldJSON("to_oktmo_contracts_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed=new FieldBool("closed",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.closed_inf=new FieldJSONB("closed_inf",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials=new FieldJSON("materials",filed_options);DocMovementDialog_Model.superclass.constructor.call(this,id,options);}
extend(DocMovementDialog_Model,ModelXML); 
function DocMovement_Controller(options){options=options||{};options.listModelClass=DocMovementList_Model;options.objModelClass=DocMovementDialog_Model;DocMovement_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();}
extend(DocMovement_Controller,ControllerObjServer);DocMovement_Controller.prototype.addInsert=function(){DocMovement_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};var field=new FieldDateTimeTZ("date_time",options);pm.addField(field);var options={};var field=new FieldInt("user_id",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_id",options);pm.addField(field);var options={};options.required=true;var field=new FieldInt("oktmo_contract_id",options);pm.addField(field);var options={};var field=new FieldInt("to_oktmo_id",options);pm.addField(field);var options={};options.required=true;var field=new FieldInt("to_oktmo_contract_id",options);pm.addField(field);var options={};var field=new FieldBool("closed",options);pm.addField(field);var options={};var field=new FieldJSONB("closed_inf",options);pm.addField(field);var options={};var field=new FieldJSONB("materials",options);pm.addField(field);var options={};var field=new FieldText("materials_search",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
DocMovement_Controller.prototype.addUpdate=function(){DocMovement_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldDateTimeTZ("date_time",options);pm.addField(field);var options={};var field=new FieldInt("user_id",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_id",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_contract_id",options);pm.addField(field);var options={};var field=new FieldInt("to_oktmo_id",options);pm.addField(field);var options={};var field=new FieldInt("to_oktmo_contract_id",options);pm.addField(field);var options={};var field=new FieldBool("closed",options);pm.addField(field);var options={};var field=new FieldJSONB("closed_inf",options);pm.addField(field);var options={};var field=new FieldJSONB("materials",options);pm.addField(field);var options={};var field=new FieldText("materials_search",options);pm.addField(field);}
DocMovement_Controller.prototype.addDelete=function(){DocMovement_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};pm.addField(new FieldInt("id",options));}
DocMovement_Controller.prototype.addGetList=function(){DocMovement_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldDateTimeTZ("date_time",f_opts));var f_opts={};pm.addField(new FieldInt("user_id",f_opts));var f_opts={};pm.addField(new FieldJSON("users_ref",f_opts));var f_opts={};pm.addField(new FieldInt("oktmo_id",f_opts));var f_opts={};pm.addField(new FieldJSON("oktmo_ref",f_opts));var f_opts={};pm.addField(new FieldInt("to_oktmo_id",f_opts));var f_opts={};pm.addField(new FieldJSON("to_oktmo_ref",f_opts));var f_opts={};pm.addField(new FieldJSON("oktmo_contracts_ref",f_opts));var f_opts={};pm.addField(new FieldInt("oktmo_contract_id",f_opts));var f_opts={};pm.addField(new FieldJSON("to_oktmo_contracts_ref",f_opts));var f_opts={};pm.addField(new FieldInt("to_oktmo_contract_id",f_opts));var f_opts={};pm.addField(new FieldBool("closed",f_opts));var f_opts={};pm.addField(new FieldJSONB("closed_inf",f_opts));var f_opts={};pm.addField(new FieldText("materials_search",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("date_time");}
DocMovement_Controller.prototype.addGetObject=function(){DocMovement_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));} 
function DocMaterialList_Model(options){var id='DocMaterialList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials_ref=new FieldJSON("materials_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.quant=new FieldFloat("quant",filed_options);options.fields.quant.getValidator().setMaxLength('19');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.price=new FieldFloat("price",filed_options);options.fields.price.getValidator().setMaxLength('15');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.total=new FieldFloat("total",filed_options);options.fields.total.getValidator().setMaxLength('15');DocMaterialList_Model.superclass.constructor.call(this,id,options);}
extend(DocMaterialList_Model,ModelJSON); 
function DocMaterial_Controller(options){options=options||{};options.listModelClass=DocMaterialList_Model;options.objModelClass=DocMaterialList_Model;DocMaterial_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();}
extend(DocMaterial_Controller,ControllerObjClient);DocMaterial_Controller.prototype.addInsert=function(){DocMaterial_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};var field=new FieldJSON("materials_ref",options);pm.addField(field);var options={};var field=new FieldFloat("quant",options);pm.addField(field);var options={};var field=new FieldFloat("price",options);pm.addField(field);var options={};var field=new FieldFloat("total",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
DocMaterial_Controller.prototype.addUpdate=function(){DocMaterial_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldJSON("materials_ref",options);pm.addField(field);var options={};var field=new FieldFloat("quant",options);pm.addField(field);var options={};var field=new FieldFloat("price",options);pm.addField(field);var options={};var field=new FieldFloat("total",options);pm.addField(field);}
DocMaterial_Controller.prototype.addDelete=function(){DocMaterial_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};pm.addField(new FieldInt("id",options));}
DocMaterial_Controller.prototype.addGetList=function(){DocMaterial_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldJSON("materials_ref",f_opts));var f_opts={};pm.addField(new FieldFloat("quant",f_opts));var f_opts={};pm.addField(new FieldFloat("price",f_opts));var f_opts={};pm.addField(new FieldFloat("total",f_opts));}
DocMaterial_Controller.prototype.addGetObject=function(){DocMaterial_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));} 
function Store_Model(options){var id='Store_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name=new FieldText("name",filed_options);options.fields.name.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contract_id=new FieldInt("oktmo_contract_id",filed_options);Store_Model.superclass.constructor.call(this,id,options);}
extend(Store_Model,ModelXML); 
function StoreList_Model(options){var id='StoreList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=false;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.name=new FieldText("name",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.oktmo_contracts_ref=new FieldJSON("oktmo_contracts_ref",filed_options);StoreList_Model.superclass.constructor.call(this,id,options);}
extend(StoreList_Model,ModelXML); 
function Store_Controller(options){options=options||{};options.listModelClass=StoreList_Model;options.objModelClass=StoreList_Model;Store_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();}
extend(Store_Controller,ControllerObjServer);Store_Controller.prototype.addInsert=function(){Store_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};options.required=true;var field=new FieldText("name",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_contract_id",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
Store_Controller.prototype.addUpdate=function(){Store_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldText("name",options);pm.addField(field);var options={};var field=new FieldInt("oktmo_contract_id",options);pm.addField(field);}
Store_Controller.prototype.addDelete=function(){Store_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};pm.addField(new FieldInt("id",options));}
Store_Controller.prototype.addGetList=function(){Store_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldText("name",f_opts));var f_opts={};pm.addField(new FieldJSON("oktmo_contracts_ref",f_opts));}
Store_Controller.prototype.addGetObject=function(){Store_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));} 
function RGMaterial_Model(options){var id='RGMaterial_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.alias='Код';filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Период';filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);options.fields.date_time.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Склад';filed_options.autoInc=false;options.fields.store_id=new FieldInt("store_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Материал';filed_options.autoInc=false;options.fields.material_id=new FieldInt("material_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Количество';filed_options.autoInc=false;options.fields.quant=new FieldFloat("quant",filed_options);options.fields.quant.getValidator().setMaxLength('19');var filed_options={};filed_options.primaryKey=false;filed_options.alias='Стоимость';filed_options.autoInc=false;options.fields.total=new FieldFloat("total",filed_options);options.fields.total.getValidator().setMaxLength('15');RGMaterial_Model.superclass.constructor.call(this,id,options);}
extend(RGMaterial_Model,ModelXML); 
function DocProcurement_Model(options){var id='DocProcurement_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials=new FieldJSONB("materials",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials_search=new FieldText("materials_search",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.total=new FieldFloat("total",filed_options);options.fields.total.getValidator().setMaxLength('15');DocProcurement_Model.superclass.constructor.call(this,id,options);}
extend(DocProcurement_Model,ModelXML); 
function DocProcurementList_Model(options){var id='DocProcurementList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);options.fields.id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);options.fields.date_time.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.user_id=new FieldInt("user_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.users_ref=new FieldJSON("users_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials_search=new FieldText("materials_search",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.total=new FieldFloat("total",filed_options);options.fields.total.getValidator().setMaxLength('15');var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.self_descr=new FieldString("self_descr",filed_options);DocProcurementList_Model.superclass.constructor.call(this,id,options);}
extend(DocProcurementList_Model,ModelXML); 
function DocProcurementDialog_Model(options){var id='DocProcurementDialog_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);options.fields.id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.defValue=true;filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);options.fields.date_time.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.users_ref=new FieldJSON("users_ref",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.materials=new FieldJSON("materials",filed_options);DocProcurementDialog_Model.superclass.constructor.call(this,id,options);}
extend(DocProcurementDialog_Model,ModelXML); 
function DocProcurement_Controller(options){options=options||{};options.listModelClass=DocProcurementList_Model;options.objModelClass=DocProcurementDialog_Model;DocProcurement_Controller.superclass.constructor.call(this,options);this.addInsert();this.addUpdate();this.addDelete();this.addGetList();this.addGetObject();this.addComplete();}
extend(DocProcurement_Controller,ControllerObjServer);DocProcurement_Controller.prototype.addInsert=function(){DocProcurement_Controller.superclass.addInsert.call(this);var pm=this.getInsert();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);var options={};var field=new FieldDateTimeTZ("date_time",options);pm.addField(field);var options={};var field=new FieldInt("user_id",options);pm.addField(field);var options={};var field=new FieldJSONB("materials",options);pm.addField(field);var options={};var field=new FieldText("materials_search",options);pm.addField(field);var options={};var field=new FieldFloat("total",options);pm.addField(field);pm.addField(new FieldInt("ret_id",{}));}
DocProcurement_Controller.prototype.addUpdate=function(){DocProcurement_Controller.superclass.addUpdate.call(this);var pm=this.getUpdate();var options={};options.primaryKey=true;options.autoInc=true;var field=new FieldInt("id",options);pm.addField(field);field=new FieldInt("old_id",{});pm.addField(field);var options={};var field=new FieldDateTimeTZ("date_time",options);pm.addField(field);var options={};var field=new FieldInt("user_id",options);pm.addField(field);var options={};var field=new FieldJSONB("materials",options);pm.addField(field);var options={};var field=new FieldText("materials_search",options);pm.addField(field);var options={};var field=new FieldFloat("total",options);pm.addField(field);}
DocProcurement_Controller.prototype.addDelete=function(){DocProcurement_Controller.superclass.addDelete.call(this);var pm=this.getDelete();var options={"required":true};pm.addField(new FieldInt("id",options));}
DocProcurement_Controller.prototype.addGetList=function(){DocProcurement_Controller.superclass.addGetList.call(this);var pm=this.getGetList();pm.addField(new FieldInt(this.PARAM_COUNT));pm.addField(new FieldInt(this.PARAM_FROM));pm.addField(new FieldString(this.PARAM_COND_FIELDS));pm.addField(new FieldString(this.PARAM_COND_SGNS));pm.addField(new FieldString(this.PARAM_COND_VALS));pm.addField(new FieldString(this.PARAM_COND_ICASE));pm.addField(new FieldString(this.PARAM_ORD_FIELDS));pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));pm.addField(new FieldString(this.PARAM_FIELD_SEP));var f_opts={};pm.addField(new FieldInt("id",f_opts));var f_opts={};pm.addField(new FieldDateTimeTZ("date_time",f_opts));var f_opts={};pm.addField(new FieldInt("user_id",f_opts));var f_opts={};pm.addField(new FieldJSON("users_ref",f_opts));var f_opts={};pm.addField(new FieldText("materials_search",f_opts));var f_opts={};pm.addField(new FieldFloat("total",f_opts));var f_opts={};pm.addField(new FieldString("self_descr",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("date_time");}
DocProcurement_Controller.prototype.addGetObject=function(){DocProcurement_Controller.superclass.addGetObject.call(this);var pm=this.getGetObject();var f_opts={};pm.addField(new FieldInt("id",f_opts));pm.addField(new FieldString("mode"));}
DocProcurement_Controller.prototype.addComplete=function(){DocProcurement_Controller.superclass.addComplete.call(this);var f_opts={};var pm=this.getComplete();pm.addField(new FieldString("self_descr",f_opts));pm.getField(this.PARAM_ORD_FIELDS).setValue("self_descr");} 
function RAMaterial_Model(options){var id='RAMaterial_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.alias='Код';filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Период';filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);options.fields.date_time.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Дебет';filed_options.autoInc=false;options.fields.deb=new FieldBool("deb",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Вид документа';filed_options.autoInc=false;options.fields.doc_type=new FieldEnum("doc_type",filed_options);filed_options.enumValues='order,shipment,movement,pass_to_production,procurement';options.fields.doc_type.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.doc_id=new FieldInt("doc_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Склад';filed_options.autoInc=false;options.fields.store_id=new FieldInt("store_id",filed_options);options.fields.store_id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Материал';filed_options.autoInc=false;options.fields.material_id=new FieldInt("material_id",filed_options);options.fields.material_id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Количество';filed_options.autoInc=false;options.fields.quant=new FieldFloat("quant",filed_options);options.fields.quant.getValidator().setMaxLength('19');var filed_options={};filed_options.primaryKey=false;filed_options.alias='Стоимость';filed_options.autoInc=false;options.fields.total=new FieldFloat("total",filed_options);options.fields.total.getValidator().setMaxLength('15');RAMaterial_Model.superclass.constructor.call(this,id,options);}
extend(RAMaterial_Model,ModelXML); 
function MaterialActionList_Model(options){var id='MaterialActionList_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.material_id=new FieldInt("material_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.material_descr=new FieldString("material_descr",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.beg_quant=new FieldFloat("beg_quant",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.beg_total=new FieldFloat("beg_total",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.deb_quant=new FieldFloat("deb_quant",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.deb_total=new FieldFloat("deb_total",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.kred_quant=new FieldFloat("kred_quant",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.kred_total=new FieldFloat("kred_total",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.end_quant=new FieldFloat("end_quant",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.end_total=new FieldFloat("end_total",filed_options);MaterialActionList_Model.superclass.constructor.call(this,id,options);}
extend(MaterialActionList_Model,ModelXML); 
function RAOrder_Model(options){var id='RAOrder_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.alias='Код';filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Период';filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);options.fields.date_time.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Дебет';filed_options.autoInc=false;options.fields.deb=new FieldBool("deb",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Вид документа';filed_options.autoInc=false;options.fields.doc_type=new FieldEnum("doc_type",filed_options);filed_options.enumValues='order,shipment,movement,pass_to_production,procurement';options.fields.doc_type.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.autoInc=false;options.fields.doc_id=new FieldInt("doc_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='ОКТМО';filed_options.autoInc=false;options.fields.oktmo_contract_id=new FieldInt("oktmo_contract_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Материал';filed_options.autoInc=false;options.fields.material_id=new FieldInt("material_id",filed_options);options.fields.material_id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Количество';filed_options.autoInc=false;options.fields.quant=new FieldFloat("quant",filed_options);options.fields.quant.getValidator().setMaxLength('19');RAOrder_Model.superclass.constructor.call(this,id,options);}
extend(RAOrder_Model,ModelXML); 
function RGOrder_Model(options){var id='RGOrder_Model';options=options||{};options.fields={};var filed_options={};filed_options.primaryKey=true;filed_options.alias='Код';filed_options.autoInc=true;options.fields.id=new FieldInt("id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Период';filed_options.autoInc=false;options.fields.date_time=new FieldDateTimeTZ("date_time",filed_options);options.fields.date_time.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.alias='ОКТМО';filed_options.autoInc=false;options.fields.oktmo_contract_id=new FieldInt("oktmo_contract_id",filed_options);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Материал';filed_options.autoInc=false;options.fields.material_id=new FieldInt("material_id",filed_options);options.fields.material_id.getValidator().setRequired(true);var filed_options={};filed_options.primaryKey=false;filed_options.alias='Количество';filed_options.autoInc=false;options.fields.quant=new FieldFloat("quant",filed_options);options.fields.quant.getValidator().setMaxLength('19');RGOrder_Model.superclass.constructor.call(this,id,options);}
extend(RGOrder_Model,ModelXML);