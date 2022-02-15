<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
 xmlns:html="http://www.w3.org/TR/REC-html40"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:fo="http://www.w3.org/1999/XSL/Format">
 
<xsl:import href="ModelsToHTML.html.xsl"/>
<xsl:import href="functions.xsl"/>

<xsl:template match="/">
	<xsl:apply-templates select="document/model[@id='ModelServResponse']"/>
	<xsl:apply-templates select="document/model[@id='Head_Model']"/>
	<xsl:apply-templates select="document/model[@id='MaterialActionList_Model']"/>				
</xsl:template>

<!-- Head -->
<xsl:template match="model[@id='Head_Model']">
	<h3>Отчет по материалам за период <xsl:value-of select="row/period_descr"/></h3>
	<h4>Место хранения: <xsl:value-of select="row/store_descr"/></h4>
</xsl:template>

<xsl:template match="model[@id='MaterialActionList_Model']">
	<xsl:variable name="model_id" select="@id"/>
	
	<table id="{$model_id}" class="table table-bordered table-responsive table-striped" style="width:60%;">
		<thead>
			<tr align="center">
				<td rowspan="2">№</td>
				<td rowspan="2">Материал</td>
				<td colspan="2">Начальный остаток</td>
				<td colspan="2">Приход</td>
				<td colspan="2">Расход</td>
				<td colspan="2">Конечный остаток</td>
			</tr>
			<tr align="center">
				<td>Кол-во</td>
				<td>Сумма</td>
				<td>Кол-во</td>
				<td>Сумма</td>
				<td>Кол-во</td>
				<td>Сумма</td>
				<td>Кол-во</td>
				<td>Сумма</td>
			</tr>
			
		</thead>
	
		<tbody>
			<xsl:apply-templates/>
		</tbody>
		
		<tfoot>
			<tr>
				<td colspan="2">Итого</td>
				<td align="right">
					<xsl:call-template name="format_quant">
						<xsl:with-param name="val" select="sum(row/beg_quant/node())"/>
					</xsl:call-template>																									
				</td>				
				<td align="right">
					<xsl:call-template name="format_money">
						<xsl:with-param name="val" select="sum(row/beg_total/node())"/>
					</xsl:call-template>																									
				</td>				
				<td align="right">
					<xsl:call-template name="format_quant">
						<xsl:with-param name="val" select="sum(row/deb_quant/node())"/>
					</xsl:call-template>																									
				</td>				
				<td align="right">
					<xsl:call-template name="format_money">
						<xsl:with-param name="val" select="sum(row/deb_total/node())"/>
					</xsl:call-template>																									
				</td>				
				<td align="right">
					<xsl:call-template name="format_quant">
						<xsl:with-param name="val" select="sum(row/kred_quant/node())"/>
					</xsl:call-template>																									
				</td>				
				<td align="right">
					<xsl:call-template name="format_money">
						<xsl:with-param name="val" select="sum(row/kred_total/node())"/>
					</xsl:call-template>																									
				</td>				
				
				<td align="right">
					<xsl:call-template name="format_quant">
						<xsl:with-param name="val" select="sum(row/end_quant/node())"/>
					</xsl:call-template>																									
				</td>				
				<td align="right">
					<xsl:call-template name="format_money">
						<xsl:with-param name="val" select="sum(row/end_total/node())"/>
					</xsl:call-template>																									
				</td>				
				
			</tr>	
		</tfoot>
	</table>
</xsl:template>

<xsl:template match="row">
	<tr>
		<td><xsl:value-of select="position()"/></td>		
		<td><xsl:value-of select="material_descr"/></td>		
		<td align="right">
			<xsl:call-template name="format_quant">
				<xsl:with-param name="val" select="beg_quant"/>
			</xsl:call-template>																									
		</td>				
		<td align="right">
			<xsl:call-template name="format_money">
				<xsl:with-param name="val" select="beg_total"/>
			</xsl:call-template>																									
		</td>				
		
		<td align="right">
			<xsl:call-template name="format_quant">
				<xsl:with-param name="val" select="deb_quant"/>
			</xsl:call-template>																									
		</td>				
		<td align="right">
			<xsl:call-template name="format_money">
				<xsl:with-param name="val" select="deb_total"/>
			</xsl:call-template>																									
		</td>				
		<td align="right">
			<xsl:call-template name="format_quant">
				<xsl:with-param name="val" select="kred_quant"/>
			</xsl:call-template>																									
		</td>				
		<td align="right">
			<xsl:call-template name="format_money">
				<xsl:with-param name="val" select="kred_total"/>
			</xsl:call-template>																									
		</td>				

		<td align="right">
			<xsl:call-template name="format_quant">
				<xsl:with-param name="val" select="end_quant"/>
			</xsl:call-template>																									
		</td>				
		<td align="right">
			<xsl:call-template name="format_money">
				<xsl:with-param name="val" select="end_total"/>
			</xsl:call-template>																									
		</td>				
		
	</tr>
</xsl:template>

</xsl:stylesheet>
