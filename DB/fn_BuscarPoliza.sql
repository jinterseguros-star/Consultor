
CREATE FUNCTION dbo.fn_BuscarPolizas (@texto NVARCHAR(100))
RETURNS TABLE
AS
RETURN
(

Select  
	 Og.descripcion		as	Origen
	,Co.descripcion		as	Compañia
	,Po.codigo			as	NroPoliza
	,Cb.descripcion		as	Cobertura 
	,Oa.descripcion		as	ObjetoAsegurado
	,Po.descripcion		as	descripcionPoliza
	,Pe.nombre
	,Pe.apellido
	,Pe.dni
From	   Poliza		Po
Inner Join Origen		Og	on Po.origen_id=Og.id_Origen
Inner Join Compañia		Co	on Po.compañia_id=Co.id_Comparñia
Inner Join Cobertura	Cb	on Po.cobertura_id=Cb.id_Cobertura
Inner Join ObjetoAsegurado Oa on Po.id_Poliza=Oa.poliza_id
Inner Join Asegurado	Ag	on Po.id_Poliza=Ag.poliza_id
Inner Join Persona		Pe	on Ag.asegurado_id=Pe.id_Persona
Where Po.codigo		 like '%' + @texto + '%'
   Or Po.descripcion like '%' + @texto + '%'
   Or Oa.descripcion like '%' + @texto + '%'
   Or Pe.dni		 like '%' + @texto + '%'
   Or CONCAT(Pe.nombre, ' ', Pe.apellido) like '%' + @texto + '%'
);