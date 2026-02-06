/**
 * PEI 2025-2030 Data
 * Auto-generated from Indicadores_PEI2026.xlsx
 * Generated: 2026-02-05 05:43:55
 */

const PEI_DATA = {
  "metadata": {
    "version": "1.0",
    "fecha_actualizacion": "2026-02-05T05:43:55.224264",
    "periodo": "2025-2030",
    "año_actual": 2026
  },
  "oei": [
    {
      "nro": 1,
      "codigo": "OEI.01",
      "descripcion": "Optimizar la afiliación al Seguro Integral de Salud de la población sin seguro de salud",
      "indicador": {
        "codigo": "",
        "nombre": "Índice de contribución de servicios en canales de atención a la afiliación ",
        "unidad_medida": "",
        "formula": "Total de población objetivo / Total de población objetivo ",
        "uo_responsable": "",
        "especificaciones_tecnicas": "NUM: Total de afiliados al SIS (Informe anual de evaluación de cobertura en afiliaciones)\nDENOM: Total de población objetivo al 31/12 del año evaluado",
        "fuente": "Gerencia del Asegurado",
        "base_datos": "Información estadística del Sistema Integrado de Aseguramiento del SIS (SIASIS)"
      },
      "metas": {
        "2025": 0.9771,
        "2026": 0.982,
        "2027": 0.9859,
        "2028": 0.9898,
        "2029": 0.9938,
        "2030": 0.9978
      },
      "linea_base": 0.9722,
      "avance_actual": 0.975,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 99.2
    },
    {
      "nro": 2,
      "codigo": "OEI 02",
      "descripcion": "Contribuir con la cobertura prestacional en la población afiliada al SIS",
      "indicador": {
        "codigo": "",
        "nombre": "Porcentaje de Población afiliada al SIS, con\ncobertura prestacional",
        "unidad_medida": "",
        "formula": "N° de atendidos x 100 / Total de afiliados al Seguro Integral de salud",
        "uo_responsable": "",
        "especificaciones_tecnicas": "Num: Número de afiliados al SIS que han sido atendidos al 31/12 del periodo de evaluación\nDenom: Total de afiliados al SIS con corte al 31/12 del periodo de evaluación",
        "fuente": "Gerencia de Riesgos y Evaluación de las Prestaciones",
        "base_datos": "Información estadística del Sistema Integrado de Aseguramiento del SIS (SIASIS)"
      },
      "metas": {
        "2025": 0.4556,
        "2026": 0.4741,
        "2027": 0.4889,
        "2028": 0.5037,
        "2029": 0.5185,
        "2030": 0.5333
      },
      "linea_base": 0.4448,
      "avance_actual": 0.46,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 97.0
    },
    {
      "nro": 3,
      "codigo": "OEI 03",
      "descripcion": "Incrementar la cobertura financiera de la población asegurada al SIS",
      "indicador": {
        "codigo": "",
        "nombre": "Porcentaje de presupuesto asignado, para el\nfinanciamiento de intervenciones de salud de los\nasegurados al SIS",
        "unidad_medida": "",
        "formula": "Presupuesto asignado x 100 / Demanda Global",
        "uo_responsable": "",
        "especificaciones_tecnicas": "Num: Monto asignado para la cobertura financiera del total de asegurados (GG.  2.3.2.6.4.1 / 2.4 / 2.5.3.11.99; Fuente: Recursos Ordinarios y Recursos Directamente Recaudados) \nDenom: Demanda total requeridos en un año para el financiamiento del total de necesidades de los afiliados al SIS",
        "fuente": "Gerencia de Negocios y Financiamiento",
        "base_datos": "Sistema Integrado de Administración Financiera SIAF del SIS; Informe de\nDemanda Global; Informe actuarial"
      },
      "metas": {
        "2025": 0.379,
        "2026": 0.3977,
        "2027": 0.4174,
        "2028": 0.438,
        "2029": 0.4596,
        "2030": 0.4822
      },
      "linea_base": 0.3477,
      "avance_actual": 0.30,
      "estado": "En Riesgo",
      "porcentaje_cumplimiento": 75.4
    },
    {
      "nro": 4,
      "codigo": "OEI 04",
      "descripcion": "Modernizar la gestión institucional",
      "indicador": {
        "codigo": "",
        "nombre": "Porcentaje de elementos de gestión interna con\nbuen desempeño",
        "unidad_medida": "",
        "formula": "N° de indicadores de servicios intermedios con buen desempeño / Número total de indicadores de\nservicios intermedios ",
        "uo_responsable": "",
        "especificaciones_tecnicas": "Servicios intermedios: Total de servicios o regulaciones que el SIS brinda, identificados en acciones estratégicas articulada a objetivos tipo II\nIndicador con buen desempeño: Resultado alcanzado en cada indicador igual o superior al 80% de cumplimiento respecto a la meta",
        "fuente": "Órganos de Apoyo y Asesoramiento responsable de los indicadores de Acciones\nEstratégicas Institucionales de Objetivos Tipo II",
        "base_datos": "Reporte de indicadores de servicios intermedios"
      },
      "metas": {
        "2025": 0.3333,
        "2026": 0.4167,
        "2027": 0.5,
        "2028": 0.6667,
        "2029": 0.8333,
        "2030": 1.0
      },
      "linea_base": 0.0,
      "avance_actual": 0.35,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 84.0
    }
  ],
  "aei": [
    {
      "nro": 1,
      "codigo": "AEI 01.01",
      "oei_padre": "OEI.01",
      "descripcion": "Servicio de atención en canales del SIS resueltos a la ciudadanía",
      "indicador": {
        "codigo": "Ind. AEI01.01.1",
        "nombre": "Índice de contribución de servicios en canales de atención a la afiliación ",
        "unidad_medida": "",
        "formula": "indice de contribución = ∑(Sa*p+Ac*p2+St*p3)/ N",
        "uo_responsable": "Gerencia del Asegurado (GA)",
        "especificaciones_tecnicas": "Donde:\nSa: Necesidades de afiliación atendidas\nSc: Necesidades de consultas atendidas\nSt: Necesidades de trámites derivados atendidas\nN: Total de afiliaciones en el periodo de evaluación p1, p2, p3: Ponderaciones (p1=0.25; p2=0.35;p3=0.40)",
        "fuente": "Gerencia del Asegurado",
        "base_datos": "Registro de Atenciones ciudadanas RAC\nInformación estadística del Sistema Integrado de Aseguramiento del SIS (SIAS)"
      },
      "metas": {
        "2025": 0.49,
        "2026": 0.51,
        "2027": 0.53,
        "2028": 0.55,
        "2029": 0.58,
        "2030": 0.6
      },
      "linea_base": 0.0,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 1,
      "codigo": "AEI 01.02",
      "oei_padre": "OEI.01",
      "descripcion": "Afiliación al SIS accesible para la población no afiliada",
      "indicador": {
        "codigo": "Ind. AEI01.02.1",
        "nombre": "Cantidad de Canales de Atención implementados a nivel nacional ",
        "unidad_medida": "",
        "formula": "Número de canales de atención implementados a nivel nacional",
        "uo_responsable": "Gerencia del Asegurado (GA)",
        "especificaciones_tecnicas": "Se considera canales de atención a los medios (presencial, telefónico y digital) a través de los cuales, el ciudadano busca acceder a un determinado servicio.\nLos canales de atención son: 1 Presencial (Centro de Atención al Asegurado - CAA; Oficina de Atención al Asegurado - OAA; Módulos en Centros MAC; Itinerantes), 2 Digital (Plataforma Web del SIS; WhatsApp; Aplicativo Móvil) y 3 Telefónico (línea 113 opción 4)",
        "fuente": "Gerencia del Asegurado",
        "base_datos": "Registro de Atenciones al Ciudadano (RAC) del SIS "
      },
      "metas": {
        "2025": 113.0,
        "2026": 118.0,
        "2027": 124.0,
        "2028": 130.0,
        "2029": 136.0,
        "2030": 142.0
      },
      "linea_base": 108.0,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 2,
      "codigo": "AEI 02.01",
      "oei_padre": "OEI 02",
      "descripcion": "Promoción de derechos en salud oportuna a los\nafiliados",
      "indicador": {
        "codigo": "Ind. AEI02.01.1 ",
        "nombre": "Número de afiliados informados de sus derechos en salud a través de acciones oportunas de promoción ",
        "unidad_medida": "",
        "formula": "Número de afiliado informados sobre sus derechos en salud a través de acciones oportunas de promoción",
        "uo_responsable": "Gerencia del Asegurado (GA)",
        "especificaciones_tecnicas": "Se considera afiliado SIS a aquellos que tienen la afiliación activa en cualquiera de las modalidades de aseguramiento del SIS\nSe considera afiliados informados de sus derechos en salud cuando reciben un kit de informaciones según un protocolo establecido por la Gerencia del Asegurado",
        "fuente": "Gerencia del Asegurado",
        "base_datos": "Información estadística del Sistema Integrado de Aseguramiento del SIS (SIASIS)"
      },
      "metas": {
        "2025": 194211.0,
        "2026": 199066.0,
        "2027": 204042.0,
        "2028": 209143.0,
        "2029": 214371.0,
        "2030": 219730.0
      },
      "linea_base": 189475.0,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 2,
      "codigo": "AEI 02.02",
      "oei_padre": "OEI 02",
      "descripcion": "Gestión de riesgos de salud, integral, para los afiliados al SIS",
      "indicador": {
        "codigo": "Ind. AEI02.02.1",
        "nombre": "Número de estudios de riesgos humanos en salud realizados en la población afiliada ",
        "unidad_medida": "",
        "formula": "N° de estudios de riesgos humanos en salud realizados ",
        "uo_responsable": "GREP",
        "especificaciones_tecnicas": "Número de estudios de riesgos humanos en salud realizado de la población afiliada \nComprende:\n1. Identificación de riesgos\n2. Análisis y evaluación de riesgos\n3. Respuesta al riesgo (tratamiento/estrategias de abordaje)\n4. Control y monitoreo",
        "fuente": "Gerencia de Riesgos y Evaluación de las Prestaciones (GREP)",
        "base_datos": "Información estadística del Sistema Integrado de Aseguramiento del SIS (SIASIS) "
      },
      "metas": {
        "2025": 1.0,
        "2026": 1.0,
        "2027": 2.0,
        "2028": 3.0,
        "2029": 4.0,
        "2030": 5.0
      },
      "linea_base": 0.0,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 2,
      "codigo": "AEI 02.02",
      "oei_padre": "OEI 02",
      "descripcion": "Gestión de riesgos de salud, integral, para los afiliados al SIS",
      "indicador": {
        "codigo": "Ind. AEI02.02.2",
        "nombre": "Porcentaje de riesgos en salud priorizados, con estrategia de abordaje ",
        "unidad_medida": "",
        "formula": "N° de riesgos en salud priorizados, con estrategias de abordaje x 100 / N° de riesgos en salud priorizados",
        "uo_responsable": "GREP",
        "especificaciones_tecnicas": "Num: Cantidad de riesgos en salud que cuenta con una estrategia de abordaje al 30 de junio o 31 de diciembre del periodo de evaluación. El abordaje consiste en el tratamiento de los riesgos de acuerdo a su nivel de valoración. El tratamiento del riesgo puede comprender estrategias para reducir la frecuencia o vulnerabilidad, transferir, mitigar o vigilancia del riesgo, de acuerdo a la directiva del SIS.\nDenom: Total de riesgos en salud, identificados al 30 de junio o 31 de diciembre del periodo de evaluación, que de acuerdo a la normativa interna o de referencia han sido valorado y categorizado como prioridad para su tratamiento",
        "fuente": "Gerencia de Riesgos y Evaluación de las Prestaciones.",
        "base_datos": "Informe semestral / anual de implementación de riesgos en salud. "
      },
      "metas": {
        "2025": 1.0,
        "2026": 1.0,
        "2027": 1.0,
        "2028": 1.0,
        "2029": 1.0,
        "2030": 1.0
      },
      "linea_base": 0.0,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 2,
      "codigo": "AEI 02.03",
      "oei_padre": "OEI 02",
      "descripcion": "Control prestacional de salud incrementada en las prestaciones de salud brindada a los asegurados del\nSIS",
      "indicador": {
        "codigo": "Ind. AEI02.03.1",
        "nombre": "Porcentaje de prestaciones de salud con control prestacional ",
        "unidad_medida": "",
        "formula": "Total de FUAS con proceso de auditoría médica presencial x 100 / Total de FUAS financiados por mecanismo de pago por prestación ",
        "uo_responsable": "GREP",
        "especificaciones_tecnicas": "Núm.: Total de FUAS con proceso de auditoría médica presencial\nDenom: Total de FUAS financiados por mecanismo de pago por prestación ",
        "fuente": "Gerencia de Riesgos y Evaluación de las Prestaciones.",
        "base_datos": "Información estadística del Sistema Integrado de Aseguramiento del SIS (SIASIS) "
      },
      "metas": {
        "2025": 0.0021,
        "2026": 0.0022,
        "2027": 0.0022,
        "2028": 0.0022,
        "2029": 0.0023,
        "2030": 0.0023
      },
      "linea_base": 0.0017,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 2,
      "codigo": "AEI 02.03",
      "oei_padre": "OEI 02",
      "descripcion": "Control prestacional de salud incrementada en las prestaciones de salud brindada a los asegurados del\nSIS",
      "indicador": {
        "codigo": "Ind. AEI02.03.2",
        "nombre": "Porcentaje de solicitudes de cobertura de Procedimientos de Alto Costo de Atención (PAC), atendidas oportunamente",
        "unidad_medida": "",
        "formula": "N° de solicitudes de cobertura de PAC atendidos en el plazo 3 días hábiles / Total de solicitudes de cobertura de PAC",
        "uo_responsable": "GREP",
        "especificaciones_tecnicas": "Num: Total de solicitudes PAC atendidos en el plazo de 3 días hábiles a través del aplicativo SAPAC.\nDenom: Total de solicitudes PAC registrados a través del aplicativo",
        "fuente": "Fondo Intangible Solidario FISSAL",
        "base_datos": "Información estadística del Sistema Integrado de Aseguramiento del SIS (SIASIS)"
      },
      "metas": {
        "2025": 0.8666,
        "2026": 0.878,
        "2027": 0.8913,
        "2028": 0.9019,
        "2029": 0.9107,
        "2030": 0.918
      },
      "linea_base": 1.0,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 3,
      "codigo": "AEI 03.01",
      "oei_padre": "OEI 03",
      "descripcion": "Financiamiento para las intervenciones de salud sostenible en beneficio de los asegurados del SIS",
      "indicador": {
        "codigo": "Ind. AEI03.01.1",
        "nombre": "Porcentaje de presupuesto transferido en el mecanismo de pago \"per cápita\" ",
        "unidad_medida": "",
        "formula": "Monto transferido en el mecanismo de pago \"per cápita\" / Monto total asignado",
        "uo_responsable": "GNF",
        "especificaciones_tecnicas": "Num: Monto transferido en el marco de los convenios y adendas a UE por el mecanismo de pago \"Per cápita\" para el financiamiento de intervenciones de salud Denom: Presupuesto asignado en la genérica de gasto 2.4; Fuente de Financiamiento: Recursos Ordinarios y Recursos Directamente recaudados",
        "fuente": "Gerencia de Negocios y Financiamiento",
        "base_datos": "Sistema Integrado de Administración Financiera (SIAF); reporte de transferencias "
      },
      "metas": {
        "2025": 0.3226,
        "2026": 0.3478,
        "2027": 0.375,
        "2028": 0.4044,
        "2029": 0.436,
        "2030": 0.4701
      },
      "linea_base": 0.3475,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 3,
      "codigo": "AEI 03.02",
      "oei_padre": "OEI 03",
      "descripcion": "Asignación de recursos para intervenciones de salud,\neficiente en el SIS",
      "indicador": {
        "codigo": "Ind. AEI03.02.1",
        "nombre": "Porcentaje de prestaciones de salud, financiadas ",
        "unidad_medida": "",
        "formula": "Monto transferido a UE x 100 / Producción valorizada",
        "uo_responsable": "GNF",
        "especificaciones_tecnicas": "Num: Monto transferido en el marco de los convenios y adendas a UE por el mecanismo de pago \"Prestaciones de Salud\" para el financiamiento de intervenciones de salud\nDenom: Monto total de la producción neta valorizada",
        "fuente": "Gerencia de Negocios y Financiamiento",
        "base_datos": "Sistema Integrado de Administración Financiera (SIAF); reporte de transferencias "
      },
      "metas": {
        "2025": 0.2736,
        "2026": 0.3151,
        "2027": 0.3624,
        "2028": 0.4168,
        "2029": 0.4792,
        "2030": 0.5511
      },
      "linea_base": 0.6521,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 4,
      "codigo": "AEI 04.01",
      "oei_padre": "OEI 04",
      "descripcion": "Provisión de recursos operativos oportuna para la gestión de la entidad",
      "indicador": {
        "codigo": "Ind. AEI04.01.1",
        "nombre": "Porcentaje de plazas de servidores del SIS convocadas oportunamente",
        "unidad_medida": "",
        "formula": "Número de plazas convocadas oportunamente / N° de total de plazas vacantes autorizadas",
        "uo_responsable": "OGAR",
        "especificaciones_tecnicas": "Num: cantidad de plazas que han sido convocadas con corte al 30/06 o 31/12 del periodo de evaluación. Se considera oportuna cuando la plaza vacante es convocada dentro de los 60 días siguientes de\nautorizada por Secretaría General\nDenom: Total de plazas que han sido calificadas como vacantes durante el periodo de evaluación",
        "fuente": "Unidad Funcional de Gestión de Recursos Humanos",
        "base_datos": "Reporte de plazas vacantes autorizadas y convocadas (todo régimen laboral) Portal del SIS"
      },
      "metas": {
        "2025": 0.9286,
        "2026": 0.9333,
        "2027": 0.94,
        "2028": 0.96,
        "2029": 0.98,
        "2030": 1.0
      },
      "linea_base": 0.9014,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 4,
      "codigo": "AEI 04.01",
      "oei_padre": "OEI 04",
      "descripcion": "Provisión de recursos operativos oportuna para la gestión de la entidad",
      "indicador": {
        "codigo": "Ind. AEI04.01.2",
        "nombre": "Porcentaje de bienes entregados oportunamente",
        "unidad_medida": "",
        "formula": "Número de requerimientos de bienes atendidos oportunamente / N° Total de requerimientos de bienes recibidos",
        "uo_responsable": "OGAR",
        "especificaciones_tecnicas": "Num: cantidad de requerimientos de bienes atendidos dentro de los 15 días de recibido, con corte al 30/06 o 31/12 del periodo de evaluación.\nDenom: cantidad de requerimientos de bienes recibidos al 30/06 o 31/12 del periodo de evaluación. Se considera oportuno la atención de un requerimiento, cuando la respuesta al usuario es dentro de los 15 días hábiles (luego de los actos preliminares y/o la certificación de disponibilidad presupuestal)",
        "fuente": "Unidad Funcional de Abastecimiento",
        "base_datos": "Sistema Integrado de Gestión Administrativa SIGA o similar; Reporte de órdenes de compra con corte al 30-06 o 31-12 del año de evaluación "
      },
      "metas": {
        "2025": 0.592,
        "2026": 0.6594,
        "2027": 0.7303,
        "2028": 0.8084,
        "2029": 0.8967,
        "2030": 0.995
      },
      "linea_base": 0.5351,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 4,
      "codigo": "AEI 04.01",
      "oei_padre": "OEI 04",
      "descripcion": "Provisión de recursos operativos oportuna para la gestión de la entidad",
      "indicador": {
        "codigo": "Ind. AEI04.01.3",
        "nombre": "Porcentaje de servicios atendidos oportunamente ",
        "unidad_medida": "",
        "formula": "Número de requerimientos de servicios atendidos oportunamente / N° Total de requerimientos de servicios recibidos",
        "uo_responsable": "OGAR",
        "especificaciones_tecnicas": "Num: Cantidad de requerimientos de servicios  atendidos dentro de los 15 días de recibido, con corte al 30/06 o 31/12 del periodo de evaluación. (la atención comprende la respuesta al usuario cuando no cuenta con certificación o la emisión de una orden de servicio) \nDenom: Cantidad de requerimientos de servicios recibidos en el periodo de evaluación, con corte al 30/06 o 31/12 del periodo de evaluación. Se considera oportuno la atención de un requerimiento, cuando tiene respuesta al usuario dentro de los 15 días hábiles",
        "fuente": "Unidad Funcional de Abastecimiento",
        "base_datos": "Sistema Integrado de Gestión Administrativa SIGA o similar; Reporte de órdenes de servicio con corte al 30-06 o 31-12 del año de evaluación"
      },
      "metas": {
        "2025": 0.8606,
        "2026": 0.8756,
        "2027": 0.8914,
        "2028": 0.9074,
        "2029": 0.9235,
        "2030": 0.94
      },
      "linea_base": 0.8453,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 4,
      "codigo": "AEI 04.02",
      "oei_padre": "OEI 04",
      "descripcion": "Servicios informáticos para la transformación digital, automatizados, en beneficio de la gestión interna del\nSIS",
      "indicador": {
        "codigo": "Ind. AEI04.02.1",
        "nombre": "Porcentaje de entidades que hacen uso de servicios de interoperabilidad con el SIS ",
        "unidad_medida": "",
        "formula": "Entidades que hacen uso de servicios de interoperabilidad / Total de entidades",
        "uo_responsable": "OGTI",
        "especificaciones_tecnicas": "• Del total de entidades que pueden hacer uso de los servicios de interoperabilidad que brinda el SIS, cuantos logran implementarlo y hacen uso de dicha interoperabilidad.\n• El total de entidades, se consideran todas las IPRESS de nivel 2 y 3 a nivel nacional o aquellas entidades (IPRESS, UGIPRESS, MINSA) que cuenten con un sistema de gestión hospitalaria independientemente de su nivel de atención y que requieran los servicios de interoperabilidad que brinda el SIS.",
        "fuente": "Oficina General de Tecnologías de la Información",
        "base_datos": "Informe de evaluación de la Oficia General de Tecnologías de la Información, con corte al 30/06 o 31/12 del año de evaluación"
      },
      "metas": {
        "2025": 0.1639,
        "2026": 0.3279,
        "2027": 0.4918,
        "2028": 0.6011,
        "2029": 0.7104,
        "2030": 0.8197
      },
      "linea_base": 0.082,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 4,
      "codigo": "AEI 04.02",
      "oei_padre": "OEI 04",
      "descripcion": "Servicios informáticos para la transformación digital, automatizados, en beneficio de la gestión interna del\nSIS",
      "indicador": {
        "codigo": "Ind. AEI04.02.2 ",
        "nombre": "Cantidad de actividades automatizadas relacionadas al proceso de valorización de prestaciones de salud.",
        "unidad_medida": "",
        "formula": "Cantidad de actividades automatizados",
        "uo_responsable": "OGTI",
        "especificaciones_tecnicas": "• Actividades automatizadas: son actividades que ya dejan de ser atendidas de forma manual, vale decir, con poca o nula intervención de un colaborador.\n• Total de actividades: para este caso, se consideran todas las actividades relacionadas al proceso de valorización desde la publicación de Formatos Únicos de Atención (FUAs) que superaron las reglas de consistencia hasta la generación de información para el proceso de liquidación de prestaciones de salud",
        "fuente": "Oficina General de Tecnologías de la Información",
        "base_datos": "Informe de evaluación de la Oficia General de Tecnologías de la Información, con corte al 30/06 o 31/12 del año de evaluación"
      },
      "metas": {
        "2025": 3.0,
        "2026": 4.0,
        "2027": 5.0,
        "2028": 6.0,
        "2029": 7.0,
        "2030": 8.0
      },
      "linea_base": 2.0,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 4,
      "codigo": "AEI 04.02",
      "oei_padre": "OEI 04",
      "descripcion": "Servicios informáticos para la transformación digital, automatizados, en beneficio de la gestión interna del\nSIS",
      "indicador": {
        "codigo": "Ind. AEI04.02.3",
        "nombre": "Cantidad de canales virtuales inteligentes implementados",
        "unidad_medida": "",
        "formula": "Cantidad de canales virtuales inteligentes implementados",
        "uo_responsable": "OGTI",
        "especificaciones_tecnicas": "Canal virtual inteligente: medio de comunicación virtual entre los usuarios (afiliados y no afiados e IPRESS) mediante el cual resuelven sus consultas y obtienen ayuda con poca o ninguna intervención humana.",
        "fuente": "Oficina General de Tecnologías de la Información",
        "base_datos": "Informe de evaluación de la Oficina General de Tecnologías de la Información, con corte al 30/06 o 31/12 del año de evaluación. Registro de canales virtuales implementados"
      },
      "metas": {
        "2025": 2.0,
        "2026": 2.0,
        "2027": 3.0,
        "2028": 3.0,
        "2029": 4.0,
        "2030": 5.0
      },
      "linea_base": 1.0,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 4,
      "codigo": "AEI 04.02",
      "oei_padre": "OEI 04",
      "descripcion": "Servicios informáticos para la transformación digital, automatizados, en beneficio de la gestión interna del\nSIS",
      "indicador": {
        "codigo": "Ind. AEI04.02.4",
        "nombre": "Porcentaje de solicitudes de mesa de ayuda atendidos oportunamente",
        "unidad_medida": "",
        "formula": "Número de pedidos por mesa de ayuda, atendidos oportunamente / Número de pedidos por mesa de ayuda recibidos",
        "uo_responsable": "OGTI",
        "especificaciones_tecnicas": "Num: total de solicitudes atendidos por mesa de ayuda con corte al 30/06 o 31/12 del periodo de evaluación.\nSe considera oportuno la atención, cuando la respuesta al usuario se ha dado dentro de las 24 horas de generado el ticket.\nDenom: total de solicitudes de mesa de ayuda recibidos al 30/06 o 31/12 del periodo de evaluación",
        "fuente": "Oficina General de Tecnologías de la Información",
        "base_datos": "Informe de evaluación de la Oficina General de Tecnologías de la Información, con corte al 30/06 o 31/12 del año de evaluación. Registro de reportes de mesa de ayuda"
      },
      "metas": {
        "2025": 0.9877,
        "2026": 0.9877,
        "2027": 0.9877,
        "2028": 0.9877,
        "2029": 0.9877,
        "2030": 0.9877
      },
      "linea_base": 0.9877,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 4,
      "codigo": "AEI 04.02",
      "oei_padre": "OEI 04",
      "descripcion": "Servicios informáticos para la transformación digital, automatizados, en beneficio de la gestión interna del\nSIS",
      "indicador": {
        "codigo": "Ind. AEI04.02.5",
        "nombre": "Cantidad de Plataforma de Inteligencia de Negocios y BIG Data implementada ",
        "unidad_medida": "",
        "formula": "Cantidad de plataforma de inteligencia de negocios y BIG Data implementada",
        "uo_responsable": "OGTI",
        "especificaciones_tecnicas": "Una plataforma BI se implementará con los siguientes pasos:\n1. Definición de objetivos y requerimientos\n2. Selección de plataforma (Power BI, Google data studio, etc)\n3. Interacción de datos\n4. Creación de modelos de datos y dashboards\n5. Automatización (criterio para calificar implementado)\n6. Implementación\n7. Mejora continua",
        "fuente": "Oficina General de Tecnologías de la Información",
        "base_datos": "Informe de evaluación de la Oficina General de Tecnologías de la Información, con corte al 30/06 o 31/12 del año de evaluación. Registro de plataformas inteligentes"
      },
      "metas": {
        "2025": 1.0,
        "2026": 2.0,
        "2027": 4.0,
        "2028": 6.0,
        "2029": 8.0,
        "2030": 10.0
      },
      "linea_base": 0.0,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 4,
      "codigo": "AEI.04.03",
      "oei_padre": "OEI 04",
      "descripcion": "Gestión de riesgos operacionales, eficaz en los\nprocesos internos del SIS",
      "indicador": {
        "codigo": "Ind. AEI04.03.1",
        "nombre": "Porcentaje de medidas de remediación y medidas de control implementados",
        "unidad_medida": "",
        "formula": "Número de medidas de remediación y control implementados / N° total de medidas de remediación y control",
        "uo_responsable": "SG/UFGR",
        "especificaciones_tecnicas": "Se consideran las medidas de remediación y control implementadas, aquellas con calificación \"Si Cumple\" reportadas en el Sistema de Control Interno remitidas a la Contraloría General de la República.",
        "fuente": "Unidad Funcional de Gestión de Riesgo",
        "base_datos": "Sistema de Control Interno remitidas a la Contraloría General de la República"
      },
      "metas": {
        "2025": 0.48,
        "2026": 0.53,
        "2027": 0.57,
        "2028": 0.65,
        "2029": 0.75,
        "2030": 0.82
      },
      "linea_base": 0.5,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 4,
      "codigo": "AEI.04.03",
      "oei_padre": "OEI 04",
      "descripcion": "Gestión de riesgos operacionales, eficaz en los\nprocesos internos del SIS",
      "indicador": {
        "codigo": "Ind. AEI04.03.2",
        "nombre": "Índice de grado de madurez del Sistema de Control Interno (SCI)",
        "unidad_medida": "",
        "formula": "Grado de madurez = ∑(VxP/Vm) * 100 * C",
        "uo_responsable": "SG/UFGR",
        "especificaciones_tecnicas": "Se consideran cada una de las preguntas que se muestran en el aplicativo informático del SCI\nDonde:\nV (Valor): Valor obtenido en la calificación\nVm (valor máximo): Calificación más alta que se puede lograr\nP (Peso o ponderación de cada pregunta): la nsima parte del total de las preguntas\nC (Cobertura de productos priorizados): relación del presupuesto priorizado y presupuesto mínimo exigido por contraloría",
        "fuente": "Unidad Funcional de Integridad Institucional",
        "base_datos": " Reporte de medidas control"
      },
      "metas": {
        "2025": 0.48,
        "2026": 0.53,
        "2027": 0.57,
        "2028": 0.65,
        "2029": 0.75,
        "2030": 0.82
      },
      "linea_base": 0.0,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 4,
      "codigo": "AEI 04.04",
      "oei_padre": "OEI 04",
      "descripcion": "Gestión de riesgos que afectan la integridad pública,\ninstitucionalizados para los servidores del SIS",
      "indicador": {
        "codigo": "Ind. AEI04.04.1",
        "nombre": "Índice de capacidad preventiva frente a la corrupción en el SIS (SCI)",
        "unidad_medida": "",
        "formula": "CP = ∑N Imp (E1 + … + E5)",
        "uo_responsable": "SG/UFGR",
        "especificaciones_tecnicas": "CP= Capacidad Preventiva\nSe consideran cada una de las preguntas que se muestran en el aplicativo informático del SCI\nN Imp = Nivel de implementación. \nE1, ..., E5: resultado de la implementación de las cinco etapas del modelo de integridad (inicial, institucionalización, estandarización, eficacia e impacto). \nSe suma los resultados parciales de la implementación de las 5 etapas",
        "fuente": "Unidad Funcional de Integridad Institucional",
        "base_datos": "Informe de cumplimiento de programa de integridad"
      },
      "metas": {
        "2025": 1.75,
        "2026": 2.15,
        "2027": 2.35,
        "2028": 2.65,
        "2029": 2.8,
        "2030": 2.95
      },
      "linea_base": 0.0,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    },
    {
      "nro": 4,
      "codigo": "AEI 04.05",
      "oei_padre": "OEI 04",
      "descripcion": "Gestión de riesgo de desastres eficaz en las sedes del SIS.",
      "indicador": {
        "codigo": "Ind. AEI04.05.1",
        "nombre": "Porcentaje de instalaciones del SIS con riesgo bajo y muy bajo",
        "unidad_medida": "",
        "formula": "Número de instalaciones del SIS con riesgo bajo / N° total de instalaciones del SIS",
        "uo_responsable": "SG/UFGR",
        "especificaciones_tecnicas": "Num: Instalaciones que, de acuerdo a la evaluación de riesgos de desastres resultaron con nivel de riesgo bajo o muy bajo\nDenom: Total de instalaciones del SIS, comprende los órganos desconcentrados a nivel nacional",
        "fuente": "Unidad Funcional de Gestión de Riesgo",
        "base_datos": "Reporte de Matriz de riesgos"
      },
      "metas": {
        "2025": 0.5556,
        "2026": 0.6667,
        "2027": 0.7778,
        "2028": 0.8889,
        "2029": 1.0,
        "2030": 1.0
      },
      "linea_base": 0.4444,
      "avance_actual": 0,
      "estado": "En progreso",
      "porcentaje_cumplimiento": 0.0
    }
  ],
  "resumen": {
    "total_oei": 4,
    "total_aei": 21,
    "cumplimiento_promedio_oei": 0.0,
    "cumplimiento_promedio_aei": 0.0
  }
};

// Export for use in dashboard
window.PEI_DATA = PEI_DATA;
