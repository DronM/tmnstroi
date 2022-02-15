<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:import href="ViewBase.html.xsl"/>

<!--************* Main template ******************** -->		
<xsl:template match="/document">
<html>
	<head>
		<xsl:call-template name="initHead"/>
		
		<script>		
			function beforeUnload(e){
				if (window.m_childForms){
					for(var fid in window.m_childForms){
						if (window.m_childForms[fid]){
							window.m_childForms[fid].close();
						}
					}
				}
				//delete views
				if(window["page_views"]){
					for(var v_id in window["page_views"]){
						window["page_views"][v_id].delDOM();
						delete window["page_views"][v_id];
					}
					delete window["page_views"];
				}
				
				if (window.onClose){					
					window.onClose();
				}
				
				return;
				
			}
			<xsl:call-template name="modelFromTemplate"/>
			function pageLoad(){
				var application;
				if (window.getApp){
					application = window.getApp();
					<xsl:call-template name="initAppWin"/>
					
				}
				else{
					<xsl:call-template name="initApp"/>
				}
				window.isChild = true;
				<xsl:call-template name="checkForError"/>
				if (window.opener <xsl:text disable-output-escaping="yes">&amp;&amp;</xsl:text> !window["getParam"] <xsl:text disable-output-escaping="yes">&amp;&amp;</xsl:text> !window.opener["paramsSet"]){
					if(window.opener["getChildParam"]){
						showView();
					}
					else{
						//ie hack wait for params to appear
						var param_check = setInterval(function(){
							if (window["getParam"] || window.opener["paramsSet"]){
								clearInterval(param_check);
								showView();
							}
						},500);
					}
				}
				else{
					//ie hack
					if (window.opener <xsl:text disable-output-escaping="yes">&amp;&amp;</xsl:text> !window["getParam"] <xsl:text disable-output-escaping="yes">&amp;&amp;</xsl:text> window.opener["getChildParam"]){
						window["getParam"] = window.opener["getChildParam"];
					}
					showView();
				}
			}
		</script>
	</head>
	<!-- onload="pageLoad();" -->
	<body onload="pageLoad();" onbeforeunload="return beforeUnload();">
	
		<!-- Page container -->
		<div class="page-container">

			<!-- Page content -->
			<div class="page-content">

				<!-- Main content -->
				<div class="content-wrapper">

					<!-- Content area -->
					<div class="content">
						<div class="row">
							<xsl:choose>
							<xsl:when test="model[@htmlTemplate='TRUE']">
							<div id="windowData">
								<xsl:apply-templates select="model[@htmlTemplate='TRUE']"/>
							</div>
							</xsl:when>
							<xsl:otherwise>
							<div id="windowData"><xsl:comment></xsl:comment></div>
							</xsl:otherwise>
							</xsl:choose>

							<div class="windowMessage hidden"><xsl:comment></xsl:comment></div>
							<!--waiting  -->
							<div id="waiting">
								<div>Обработка...</div>
								<img src="img/loading.gif"/>
							</div>
							
						</div>
						
						<!-- Footer -->
						<div class="footer text-muted text-center">
							2019. <a href="#">Катрэн+</a>
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

</xsl:stylesheet>
