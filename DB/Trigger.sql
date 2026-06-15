/*** Persona ***/
Insert Into Persona (nombre,apellido,dni,telefono,estado) 
Select Distinct T.nombre,T.apellido,TRIM(T.dni) as 'dni',T.telefono,1 as 'estado' 
From tempPoliza T 
Where TRIM(T.dni) not in (Select TRIM(P.dni) From Persona P) 

/*** Cobertura ***/
Insert Into Cobertura (descripcion)
Select Distinct TRIM(T.descripcionCobertura) From tempPoliza T 
Where TRIM(T.descripcionCobertura) not in (Select TRIM(C.descripcion) From Cobertura C) 

/*** Actualizar Temp ***/
UPDATE T
SET T.cobertura_id = C.id_Cobertura
FROM tempPoliza T
INNER JOIN Cobertura C
    ON T.descripcionCobertura = C.descripcion;

/*** Poliza ***/
INSERT INTO [dbo].[Poliza]
([codigo],[descripcion],[fechaRegistro],[fechaInicio],[fechaFin],[estado],[personaRegistra],[compañia_id],[origen_id],[cobertura_id])
Select DISTINCT 
T.codigo,T.descripcion,Getdate() as 'fechaRegistro',T.fechaInicio,T.fechaFin,1 as 'estado',1 as 'personaRegistra',T.compañia_id,T.origen_id,T.cobertura_id
From [tempPoliza] T

/*** primer cambio de fecha registro ***/
Update tempPoliza set fechaRegistro=(Select MAX(fechaRegistro) From Poliza), personaRegistra=1, origen_id=1



select top 1 * from Poliza Where codigo='10002618' Order by fechaInicio desc
select  * from tempPoliza Where codigo='10002618' Order by fechaInicio desc


/*** Actualizar Temp poliza_id ***/
UPDATE T
SET T.poliza_id = P.id_Poliza
FROM tempPoliza T
INNER JOIN Poliza P
    ON T.codigo            =   P.codigo          
   and T.descripcion       =   P.descripcion     
   and T.fechaRegistro     =   P.fechaRegistro   
   and T.fechaInicio       =   P.fechaInicio     
   and ISNULL(T.fechaFin, '1900-01-01') = ISNULL(P.fechaFin, '1900-01-01')
   and T.estado            =   P.estado
   and T.personaRegistra   =   P.personaRegistra 
   and T.compañia_id       =   P.compañia_id     
   and T.origen_id         =   P.origen_id
   and T.cobertura_id      =   P.cobertura_id
                              
/*** Asegurado ***/ 
INSERT INTO Asegurado ([asegurado_id],[poliza_id])
Select DISTINCT  P.id_Persona,T.poliza_id
From tempPoliza T Inner Join Persona P on TRIM(T.dni)=TRIM(P.dni)

/*** ObjetoAsegurado ***/
INSERT INTO ObjetoAsegurado ([descripcion],[poliza_id])
Select DISTINCT TRIM(descripcion_Objeto),poliza_id From tempPoliza

--6001
--13 788
