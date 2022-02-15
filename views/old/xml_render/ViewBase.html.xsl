<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!-- omit-xml-declaration="yes" -->
<xsl:output method="xml" indent="yes" omit-xml-declaration="yes"
			doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" 
			doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

<xsl:variable name="BASE_PATH" select="/document/model[@id='ServerVars']/row[1]/basePath"/>
<xsl:variable name="VERSION" select="/document/model[@id='ServerVars']/row[1]/scriptId"/>
<xsl:variable name="TITLE" select="/document/model[@id='ServerVars']/row[1]/title"/>
<xsl:variable name="COLOR_PALETTE" select="/document/model[@id='ServerVars']/row[1]/defColorPalette"/>
<xsl:variable name="LOGGED" select="not(/document/model[@id='ServerVars']/row[1]/role_id='' or /document/model[@id='ServerVars']/row[1]/role_id='guest')"/>
<xsl:variable name="TOKEN">
	<xsl:choose>
		<xsl:when test="/document/model[@id='ServerVars']/row[1]/token and not(/document/model[@id='ServerVars']/row[1]/token='')"><xsl:value-of select="concat('&amp;token=',/document/model[@id='ServerVars']/row[1]/token)"/></xsl:when>
		<xsl:otherwise></xsl:otherwise>
	</xsl:choose>
</xsl:variable>
	
	
<!--************* Main template ******************** -->		
<xsl:template match="/document">
<html>
	<head>
		<xsl:call-template name="initHead"/>
		
		<script>
			<xsl:call-template name="modelFromTemplate"/>
			function pageLoad(){				
				<xsl:call-template name="initApp"/>
				
				<xsl:call-template name="checkForError"/>
								
				showView();
			}
		</script>
	</head>
	<body onload="pageLoad();">
	
		<xsl:call-template name="page_header"/>
		
		<!-- Page container -->
		<div class="page-container">

			<!-- Page content -->
			<div class="page-content">

				<!-- Main content -->
				<div class="content-wrapper">

					<!-- Content area -->
					<div class="content">
						<xsl:choose>
						<xsl:when test="model[@htmlTemplate='TRUE']">
						<div id="windowData">
							<xsl:apply-templates select="model[@htmlTemplate='TRUE']"/>
						</div>
						</xsl:when>
						<xsl:otherwise>
						<div id="windowData"/>
						</xsl:otherwise>
						</xsl:choose>

						<div class="windowMessage hidden"/>
						<!--waiting  -->
						<div id="waiting">
							<div>Обработка...</div>
							<img src="img/loading.gif"/>
						</div>
						
						<!-- Footer -->
						<div class="footer text-muted text-center">
							YEAR. <a href="#">ORGANIZATION</a>
						</div>
						<!-- /footer -->

					</div>
					<!-- /content area -->

				</div>
				<!-- /main content -->

			</div>
			<!-- /page content -->

		</div>
		<!-- /page container -->

		<xsl:call-template name="initJS"/>
	</body>
</html>		
</xsl:template>

<!--************* Javascript files ******************** -->
<xsl:template name="initJS">
	<!-- bootstrap resolution-->
	<div id="users-device-size">
		<div id="sm" class="visible-sm"/>
		<div id="md" class="visible-md"/>
		<div id="lg" class="visible-lg"/>
	</div>

	<!--ALL js modules -->
	<xsl:apply-templates select="model[@id='Script']/row"/>
	<script>
		$("#waiting").hide();
	</script>
</xsl:template>


<!--************* Application instance ******************** -->
<xsl:template name="initApp">
	var serv_vars = {
		<xsl:for-each select="model[@id='ServerVars']/row/*">
		<xsl:if test="position() &gt; 1">,</xsl:if>"<xsl:value-of select="local-name()"/>":'<xsl:value-of select="node()"/>'
		</xsl:for-each>
	};
	serv_vars.color_palette = (!serv_vars.color_palette||serv_vars.color_palette=='')? '<xsl:value-of select="$COLOR_PALETTE"/>':serv_vars.color_palette;
	var application = new App_tmnstroi({
		servVars:serv_vars
		<xsl:if test="model[@id='ConstantValueList_Model']">
		,"constantXMLString":CommonHelper.longString(function () {/*
				<xsl:copy-of select="model[@id='ConstantValueList_Model']"/>
		*/})
		</xsl:if>
		<!--	
		<xsl:if test="not(/document/model[@id='Response']/row/result='0')">
			,
			"error":"<xsl:value-of select="/document/model[@id='Response']/row/descr"/>"
		</xsl:if>	
		-->
	});
	
	<xsl:call-template name="initAppWin"/>	
		
	<xsl:if test="$LOGGED and /document/model[@id='ServerVars']/row[1]/app_srv">	
	//event server
	var ws_host = '<xsl:value-of select="/document/model[@id='ServerVars']/row[1]/app_srv"/>';
	var ws_sep = ws_host.indexOf(":");
	application.initAppSrv({		
		"host": ws_host.substring(0,ws_sep)
		,"port": ws_host.substring(ws_sep+1)
		,"appId":'<xsl:value-of select="/document/model[@id='ServerVars']/row[1]/app_id"/>'
		,"token":'<xsl:value-of select="/document/model[@id='ServerVars']/row[1]/token"/>'
		,"tokenExpires":'<xsl:value-of select="/document/model[@id='ServerVars']/row[1]/tokenExpires"/>'
	});	
	</xsl:if>
	<!-- [@default='FALSE']-->
	<xsl:variable name="def_menu_item" select="//menuitem[@default='true']"/>
	<xsl:if test="$def_menu_item">
	if(window.location.href.indexOf("?") <xsl:text disable-output-escaping="yes">&lt;</xsl:text> 0 || window.location.href.indexOf("token=") <xsl:text disable-output-escaping="yes">&gt;</xsl:text>=0 || window.location.href.indexOf("?sid") <xsl:text disable-output-escaping="yes">&gt;</xsl:text>=0) {
		var iRef = DOMHelper.getElementsByAttr("true", CommonHelper.nd("side-menu"), "defaultItem",true,"A")[0];
		application.showMenuItem(iRef,'<xsl:value-of select="$def_menu_item/@c"/>','<xsl:value-of select="$def_menu_item/@f"/>','<xsl:value-of select="$def_menu_item/@t"/>',null,'<xsl:value-of select="$def_menu_item/@viewdescr"/>');
	}
	</xsl:if>
	
</xsl:template>

<!--************* Window instance ******************** -->
<xsl:template name="initAppWin">	
	var applicationWin = new AppWin({
		"widthType":$("#users-device-size").find("div:visible").first().attr("id"),
		"app":application
		<!--
		<xsl:if test="not(/document/model[@id='Response']/row/result='0')">
			,"error":"<xsl:value-of select="/document/model[@id='Response']/row/descr"/>"
		</xsl:if>	
		-->
	});

</xsl:template>

<!--************* Page head ******************** -->
<xsl:template name="initHead">
	<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<!--<link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700,900" rel="stylesheet" type="text/css" />-->
	
	<xsl:apply-templates select="model[@id='ServerVars']"/>
	<xsl:apply-templates select="model[@id='Link']/row"/>
	<!--<link rel="icon" type="image/png" href="img/favicon.ico"/>-->
	
	<title>Тюменьстрой</title>
</xsl:template>


<!-- ************** Main Menu ******************** -->
<xsl:template name="initMenu">
	<xsl:if test="model[@id='MainMenu_Model'] or /document/model[@id='ServerVars']/row/role_id='admin'">
	<!-- Main navigation -->
	<ul class="nav navbar-nav">

		<!-- Main  -->				
		<xsl:apply-templates select="/document/model[@id='MainMenu_Model']/menu/*"/>
		
		<xsl:if test="/document/model[@id='ServerVars']/row/role_id='admin'">
		<!-- service -->
		<li class="dropdown">
			<a href="#" class="dropdown-toggle" data-toggle="dropdown">
				<i class="icon-stack2"></i> Сервис
				<i class="caret"></i>
			</a>
			<ul class="dropdown-menu">
				<li>
					<a href="index.php?c=View_Controller&amp;f=get_list&amp;t=ViewList"
					onclick="window.getApp().showMenuItem(this,'View_Controller','get_list','ViewList',null,'Все формы');return false;">
					Все формы
					</a>
				</li>		        				
		
				<li>
					<a href="index.php?c=Constant_Controller&amp;f=get_list&amp;t=ConstantList"
					onclick="window.getApp().showMenuItem(this,'Constant_Controller','get_list','ConstantList',null,'Константы');return false;">
					Константы
					</a>
				</li>		        				
		
				<li>
					<a href="index.php?c=MainMenuConstructor_Controller&amp;f=get_list&amp;t=MainMenuConstructorList"
					onclick="window.getApp().showMenuItem(this,'MainMenuConstructor_Controller','get_list','MainMenuConstructorList',null,'Конструктор меню');return false;">
					Конструктор меню
					</a>
				</li>		        				
				<li>
					<a href="#" onclick="window.getApp().showAbout();return false;">
					О программе
					</a>
				</li>
			</ul>
		</li>
		
		</xsl:if>
	</ul>
	</xsl:if>
</xsl:template>


<!--************* Menu item ******************-->
<xsl:template match="menuitem">
	<xsl:choose>
		<xsl:when test="menuitem">
			<!-- multylevel @isgroup='1'-->			
			<li class="dropdown">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown">
					<xsl:choose>
					<xsl:when test="@glyphclass and string-length(@glyphclass) &gt; 0 and not(@glyphclass='null')">
						<i class="{@glyphclass}"></i> <xsl:value-of select="concat(' ',@descr)"/>						
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="@descr"/>
					</xsl:otherwise>
					</xsl:choose>
					<i class="caret"></i>
				</a>
				<ul class="dropdown-menu">
					<xsl:apply-templates/>
				</ul>						
			</li>
		</xsl:when>
		<xsl:otherwise>
			<!-- one level-->
			<li>
			    <a href="index.php?c={@c}&amp;f={@f}&amp;t={@t}{$TOKEN}"
			    onclick="window.getApp().showMenuItem(this,'{@c}','{@f}','{@t}',null,'{@viewdescr}');return false;"
			    defaultItem="{@default='true'}">
				<xsl:choose>
				<xsl:when test="@glyphclass and string-length(@glyphclass) &gt; 0 and not(@glyphclass='null')">
					<i class="{@glyphclass}"></i> <xsl:value-of select="@descr"/>						
				</xsl:when>
				<xsl:otherwise>
					<i class="{@glyphclass}"></i> <xsl:value-of select="@descr"/>
				</xsl:otherwise>
				</xsl:choose>
			    </a>
			</li>			
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<!--*************** templates ********************* -->
<xsl:template match="model[@templateId]">
<xsl:copy-of select="*"/>
</xsl:template>

<xsl:template name="modelFromTemplate">
	function showView(){
		<!-- All data models to object -->
		var models;
		var editViewOptions = window.getParam? (window.getParam("editViewOptions")||{}) : {};
		if (window.getParam){
			editViewOptions.cmd = window.getParam("cmd");
		}
		else{
			var s_str = window.location.toString();
			var par_start = s_str.indexOf("?");
			if (par_start <xsl:text disable-output-escaping="yes">&gt;</xsl:text>= 0){
				var par_list = s_str.substr(par_start).split(<xsl:text disable-output-escaping="yes">"&amp;"</xsl:text>);
				for (var i=0;i <xsl:text disable-output-escaping="yes">&lt;</xsl:text> par_list.length;i++){
					var v_sep = par_list[i].indexOf("=");
					if (v_sep <xsl:text disable-output-escaping="yes">&gt;</xsl:text>= 0){
						var n = par_list[i].substr(0,v_sep);
						var v = par_list[i].substr(v_sep+1);
						if (n=="mode"){
							editViewOptions.cmd = v;
							break;
						}
					}
				}
			}
		}
		editViewOptions.cmd = editViewOptions.cmd || "edit";
		editViewOptions.models = editViewOptions.models || {};
		
		<xsl:for-each select="model[not(@sysModel='1')]">
		<xsl:variable name="m_id" select="@id"/>
		var m_data = CommonHelper.longString(function () {/*
				<xsl:copy-of select="/document/model[@id=$m_id]"/>
			*/});		
		if(window["<xsl:value-of select="$m_id"/>"]){
			editViewOptions.models.<xsl:value-of select="$m_id"/> = editViewOptions.models.<xsl:value-of select="$m_id"/>
				|| new <xsl:value-of select="$m_id"/>({"data":m_data});
		}
		else{
			editViewOptions.models.<xsl:value-of select="$m_id"/> = editViewOptions.models.<xsl:value-of select="$m_id"/>
				|| new ModelXML("<xsl:value-of select="$m_id"/>",{"data":m_data});			
		}
		</xsl:for-each>
	
		<xsl:for-each select="model[@templateId]">
			var v_opts = CommonHelper.clone(editViewOptions);
			v_opts.template = CommonHelper.longString(function () {/*
			<xsl:copy-of select="./*"/>
			*/});
			//encoded curly braces
			v_opts.template = v_opts.template.replace("%7B%7B","");
			v_opts.variantStorage = {
				"name":"<xsl:value-of select="@templateId"/>"
				<xsl:if test="/document/model[@id='VariantStorage_Model']">
				,"model":editViewOptions.models.VariantStorage_Model
				</xsl:if>			
			};	
			if(v_opts.variantStorage.model)
				v_opts.variantStorage.model.getRow(0);	
				
			window["page_views"] = window["page_views"] || {};
			if(window["page_views"]["<xsl:value-of select="@templateId"/>"]){
				window["page_views"]["<xsl:value-of select="@templateId"/>"].delDOM();
				delete window["page_views"]["<xsl:value-of select="@templateId"/>"];
			}
			window["page_views"]["<xsl:value-of select="@templateId"/>"] = new <xsl:value-of select="@templateId"/>_View("<xsl:value-of select="@templateId"/>",v_opts);
			window["page_views"]["<xsl:value-of select="@templateId"/>"].toDOM(document.getElementById("windowData"));
		</xsl:for-each>
	}
</xsl:template>

<!--System variables -->
<xsl:template match="model[@id='ServerVars']/row">
	<xsl:if test="author">
		<meta name="Author" content="{author}"></meta>
	</xsl:if>
	<xsl:if test="keywords">
		<meta name="Keywords" content="{keywords}"></meta>
	</xsl:if>
	<xsl:if test="description">
		<meta name="Description" content="{description}"></meta>
	</xsl:if>
	
</xsl:template>

<!-- CSS -->
<xsl:template match="model[@id='Link']/row">	
	<link rel="stylesheet" href="{concat(href,'?',$VERSION)}" type="text/css"/>
</xsl:template>

<!-- Javascript -->
<xsl:template match="model[@id='Script']/row">
	<!-- type="{type}" -->
	<script src="{concat(src,'?',$VERSION)}"><xsl:comment></xsl:comment></script>
</xsl:template>

<!-- Error
<xsl:template match="model[@id='Response']/row">
	<xsl:if test="result/node()='1'">
	<div class="error"><xsl:value-of select="descr"/></div>
	</xsl:if>
</xsl:template>
 -->

<xsl:template name="checkForError">
	<xsl:variable name="er_num" select="/document/model[@id='Response']/row/result"/>
	<xsl:choose>
	<!--$er_num='100' or -->
	<xsl:when test="$er_num='101' or $er_num='102'">
		if (CommonHelper.isIE()){
			throw new Error('<xsl:value-of select="/document/model[@id='Response']/row/descr"/>');
		}
		else{
			throw new FatalException({
				"code":<xsl:value-of select="$er_num"/>
				,"message":'<xsl:value-of select="/document/model[@id='Response']/row/descr"/>'
			});
		}
	</xsl:when>
	<xsl:when test="$er_num='105'">
		if (CommonHelper.isIE()){
			throw new Error('<xsl:value-of select="/document/model[@id='Response']/row/descr"/>');
		}
		else{
	
			throw new DbException({
				"code":<xsl:value-of select="$er_num"/>
				,"message":'<xsl:value-of select="/document/model[@id='Response']/row/descr"/>'
			});
		}
	</xsl:when>
	
	<xsl:when test="not($er_num='0') and $LOGGED">		
		throw new Error(CommonHelper.escapeDoubleQuotes(CommonHelper.longString(function () {/*
			<xsl:value-of select="/document/model[@id='Response']/row/descr"/>
			*/}))
		);
	</xsl:when>
	<xsl:when test="not($er_num='0')">
		throw new FatalException({
			"code":<xsl:value-of select="$er_num"/>
			,"message":CommonHelper.escapeDoubleQuotes(CommonHelper.longString(function () {/*
			<xsl:value-of select="/document/model[@id='Response']/row/descr"/>
			*/}))
		});
	</xsl:when>
	<xsl:otherwise/>
	</xsl:choose>	
</xsl:template>

<xsl:template name="page_header">
	<!-- Main navbar -inverse-->
	<div class="navbar navbar">
	<div class="container-fluid">
	
		<xsl:choose>
		<xsl:when test="not($LOGGED)">
		<div class="navbar-header">
			<a class="navbar-brand" href="index.php">
				<img class="logotype" src="js20/ext/Limitless v1.4/layout_1/LTR/default/assets/images/logo_demo.png"></img>
			</a>
		</div>
		</xsl:when>
		<xsl:otherwise>
		<div class="navbar-header">
			<a class="navbar-brand" href="index.php">
				<img class="logotype" src="js20/ext/Limitless v1.4/layout_1/LTR/default/assets/images/logo_demo.png"></img>
			</a>
		</div>
				
			
			<xsl:call-template name="initMenu"/>	
			<ul class="nav navbar-nav navbar-right">			
			
				<li class="dropdown">
					<a id="weather">
					</a>
				</li>			
			
				<!-- USER DATA -->
				<li class="dropdown dropdown-user">
					<a class="dropdown-toggle" data-toggle="dropdown">
						<img src="js20/ext/Limitless v1.4/layout_1/LTR/default/assets/images/placeholder.jpg" alt=""/>
						<span>
						<xsl:choose>
						<xsl:when test="/document/model[@id='ServerVars']/row/user_name_full!=''">
						<xsl:apply-templates select="/document/model[@id='ServerVars']/row/user_name_full"/>
						</xsl:when>
						<xsl:otherwise>
						<xsl:apply-templates select="/document/model[@id='ServerVars']/row/user_name"/>
						</xsl:otherwise>
						</xsl:choose>
						</span>
						<i class="caret"></i>
					</a>

					<ul class="dropdown-menu dropdown-menu-right">
						<li>
							<a href="index.php?c=User_Controller&amp;f=get_profile&amp;t=UserProfile{$TOKEN}"
							onclick="window.getApp().showMenuItem(this,'User_Controller','get_profile','UserProfile',null,'Профиль');return false;">
							<i class="icon-user-plus"></i> Профиль
							</a>
						</li>					        
						
						<li class="divider"></li>
						<li><a href="#" onclick="window.getApp().quit()"><i class="icon-switch2"></i> Выход</a></li>
					</ul>
				</li>				
			</ul>
		</xsl:otherwise>
		</xsl:choose>
	</div>
	</div>
	<!-- /main navbar -->
</xsl:template>

</xsl:stylesheet>
