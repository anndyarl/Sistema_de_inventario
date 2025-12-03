import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

import ssmso_logo from "../../../../assets/img/SSMSO-LOGO.png"
import { Container } from 'react-bootstrap';
import { ListaActivosFijos } from './CalcularDepreciacion';


// Formatear la fecha actual en español (Chile)
// const fechaHoy = new Date().toLocaleDateString('es-CL', {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric',
// });

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    logo: {
        width: 100, // Ajusta el tamaño del logo
        height: 'auto',
    },
    containerHeader: {
        marginTop: 15,
        marginBottom: 5,
    },
    textContainer: {
        marginLeft: 5
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    headerContent: {
        display: 'flex',
        flexDirection: 'row',
        // justifyContent: 'space-between'
    },

    header: {
        flex: 1,
        fontSize: 6,
        marginBottom: 5,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    p: {
        fontSize: 8,
        marginBottom: 2,
        fontWeight: 'semibold',
        textAlign: 'center',
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
    },
    tableHeader: {
        fontSize: 6,
        flexDirection: "row",
        alignContent: "center",
        fontWeight: 'bold',
        backgroundColor: 'rgb(0 68 133 / 80%)',
        color: '#fff',
        borderBottom: "1px solid #000",
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1px solid #ccc",
        alignItems: "center",
    },
    tableCell: {
        padding: 3,
        fontSize: 6,
        borderRight: "1px solid #ccc",
        // textAlign: "center",
        overflow: "hidden",
        flexGrow: 1,
    },
    colCodigo: { width: "13%" },
    colEspecie: { width: "10%", fontSize: 5 },
    colMarca: { width: "10%", fontSize: 5 },
    colModelo: { width: "10%", fontSize: 5 },
    colSerie: { width: "10%" },
    colPrecio: { width: "10%" },
    colDescripcion: { width: "10%", fontSize: 5 },
    colMesesTranscurridos: { width: "7%" },
    colVidaUtil: { width: "6%" },
    colMesVidaUtil: { width: "6%" },
    colMesesRestantes: { width: "7%" },
    colMontoInicial: { width: "10%" },
    colDepreciacionAnual: { width: "10%" },
    colDepreciacionMensual: { width: "8%" },
    colDepAcumulada: { width: "10%" },
    colValorResidual: { width: "10%" },
    // colDepSIGFE: { width: "12%" },
    // colDepAcumuladaSIGFE: { width: "12%" },

    fechaHoy: {
        padding: 2,
    },

    footer: {
        position: 'absolute',
        bottom: 20,          // distancia del borde inferior
        left: 40,
        right: 40,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',  // separa fecha y numeración
        alignItems: 'center',
        fontSize: 9,
        color: '#000',
        borderTopWidth: 1,                // línea separadora superior
        borderTopColor: '#ccc',
        paddingTop: 4,
    },
    footerLeft: {
        textAlign: 'left',
    },
    footerRight: {
        textAlign: 'right',
    },
});



// Formatear la fecha actual en español (Chile)
const fechaHoy = new Date()
    .toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
    .replace(/-/g, '/');


const arreglo = (array: any[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};


const DocumentoPDF = ({ row, totalRes, totalDep }: { row: ListaActivosFijos[]; totalRes: number, totalDep: number }) => {

    const filasPorPagina = 12;
    const paginas = arreglo(row, filasPorPagina);
    return (
        <Document>
            {paginas.map((rows, indicePagina) => (
                <Page key={indicePagina} style={styles.page}>
                    {/* Logo */}
                    <Container style={styles.containerHeader}>
                        <View style={styles.headerContainer}>
                            {/* Logo a la izquierda */}
                            <Image src={ssmso_logo} style={styles.logo} />
                            {/* Textos a la derecha */}
                            <View style={styles.textContainer}>
                                <Text style={styles.p}>Servicio de Salud Metropolitano Sur Oriente</Text>
                                <Text style={styles.p}>Subdirección Administrativa</Text>
                                <Text style={styles.p}>Departamento de Finanzas</Text>
                                <Text style={styles.p}>Unidad de Inventarios</Text>
                            </View>
                        </View>
                    </Container>
                    {/* Encabezado */}
                    <Container style={styles.containerHeader}>
                        <View style={styles.headerContent}>

                            {totalDep > 0 && (
                                <p className="fw-semibold text-center">
                                    <Text style={styles.p}>Total Depreciación Acumulada: $ {(totalDep ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                                </p>
                            )}

                        </View>
                        <View style={styles.headerContent}>
                            {totalRes > 0 && (
                                <p className="fw-semibold text-center">
                                    <Text style={styles.p}>Total Valor Residual: $ {(totalRes ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                                </p>
                            )}
                        </View>
                        <View style={styles.headerContent}>
                            <Text style={styles.p}>Cantidad: {row.length}</Text>
                        </View>
                    </Container>
                    {/* Tabla */}
                    <View style={styles.table}>
                        {/* Cabecera de la tabla */}
                        <View style={styles.tableHeader}>
                            {/* <Text style={styles.tableCellHeader}>Código</Text> */}
                            <Text style={[styles.tableCell, styles.colCodigo]}>Nº Inventario</Text>
                            <Text style={[styles.tableCell, styles.colEspecie]}>Especie</Text>
                            <Text style={[styles.tableCell, styles.colMarca]}>Marca</Text>
                            <Text style={[styles.tableCell, styles.colModelo]}>Modelo</Text>
                            <Text style={[styles.tableCell, styles.colSerie]}>Serie</Text>
                            <Text style={[styles.tableCell, styles.colPrecio]}>Precio</Text>
                            {/* <Text style={styles.tableCellHeader}>Código Largo</Text>
                    <Text style={styles.tableCellHeader}>Departamento Corr</Text>
                    <Text style={styles.tableCellHeader}>Código Específico</Text>
                    <Text style={styles.tableCellHeader}>Secuencia</Text>
                    <Text style={styles.tableCellHeader}>Clave Ítem</Text>
                    <Text style={styles.tableCellHeader}>Descripción</Text>
                    <Text style={styles.tableCellHeader}>Fecha Ingreso</Text>
                    <Text style={styles.tableCellHeader}>Estado</Text>
                    <Text style={styles.tableCellHeader}>Código</Text>
                    <Text style={styles.tableCellHeader}>Tipo</Text>
                    <Text style={styles.tableCellHeader}>Alta</Text>
                    <Text style={styles.tableCellHeader}>Precio Referencial</Text>
                    <Text style={styles.tableCellHeader}>Cantidad</Text>
                    <Text style={styles.tableCellHeader}>Origen</Text>
                    <Text style={styles.tableCellHeader}>Resolución</Text>
                    <Text style={styles.tableCellHeader}>Fecha Solicitud</Text>
                    <Text style={styles.tableCellHeader}>OCO Número Ref</Text>
                    <Text style={styles.tableCellHeader}>Usuario Creador</Text>
                    <Text style={styles.tableCellHeader}>Fecha Creación</Text>
                    <Text style={styles.tableCellHeader}>IP Creación</Text>
                    <Text style={styles.tableCellHeader}>Usuario Modificador</Text>
                    <Text style={styles.tableCellHeader}>Fecha Modificación</Text>
                    <Text style={styles.tableCellHeader}>IP Modificación</Text>
                    <Text style={styles.tableCellHeader}>Tipo Documento</Text>
                    <Text style={styles.tableCellHeader}>RUN Proveedor</Text>
                    <Text style={styles.tableCellHeader}>Reg EQM</Text>
                    <Text style={styles.tableCellHeader}>Número Factura</Text>
                    <Text style={styles.tableCellHeader}>Fecha Factura</Text>
                    <Text style={styles.tableCellHeader}>Valor 3 UTM</Text>
                    <Text style={styles.tableCellHeader}>ID Grupo</Text>
                    <Text style={styles.tableCellHeader}>Código Cuenta</Text>
                    <Text style={styles.tableCellHeader}>Transitoria</Text>
                    <Text style={styles.tableCellHeader}>Monto Factura</Text>
                    <Text style={styles.tableCellHeader}>Descompone</Text>
                    <Text style={styles.tableCellHeader}>Etiqueta</Text>
                    <Text style={styles.tableCellHeader}>Vida Útil</Text>
                    <Text style={styles.tableCellHeader}>Vigente</Text>
                    <Text style={styles.tableCellHeader}>ID Programa</Text>
                    <Text style={styles.tableCellHeader}>ID Modalidad Compra</Text>
                    <Text style={styles.tableCellHeader}>ID Propiedad</Text>*/}
                            <Text style={[styles.tableCell, styles.colDescripcion]}>Descripción</Text>
                            <Text style={[styles.tableCell, styles.colMesesTranscurridos]}>Meses Transcurridos</Text>
                            <Text style={[styles.tableCell, styles.colVidaUtil]}>Vida Útil</Text>
                            <Text style={[styles.tableCell, styles.colMesVidaUtil]}>Mes Vida Útil</Text>
                            <Text style={[styles.tableCell, styles.colMesesRestantes]}>Meses Restantes</Text>
                            <Text style={[styles.tableCell, styles.colMontoInicial]}>Monto Inicial</Text>
                            <Text style={[styles.tableCell, styles.colDepreciacionAnual]}>Depreciación por Año</Text>
                            <Text style={[styles.tableCell, styles.colDepreciacionMensual]}>Depreciación por Mes</Text>
                            <Text style={[styles.tableCell, styles.colDepAcumulada]}>Depreciación Acumulada Actualizada</Text>
                            <Text style={[styles.tableCell, styles.colValorResidual]}>Valor Residual</Text>
                            {/* <Text style={[styles.tableCell, styles.colDepSIGFE]}>Depreciación SIGFE</Text> */}
                            {/* <Text style={[styles.tableCell, styles.colDepAcumuladaSIGFE]}>Depreciacion Acumulada SIGFE</Text> */}

                        </View>
                        {/* Fila de datos */}
                        {rows.map((lista, idx) => (
                            <View style={styles.tableRow} key={idx}>
                                {/* <Text style={styles.tableCell}>{lista.aF_CLAVE}</Text> */}
                                <Text style={[styles.tableCell, styles.colCodigo]}>{lista.aF_CODIGO_GENERICO}</Text>
                                <Text style={[styles.tableCell, styles.colEspecie]}>{lista.especie}</Text>
                                <Text style={[styles.tableCell, styles.colEspecie]}>{lista.marca}</Text>
                                <Text style={[styles.tableCell, styles.colMarca]}>{lista.modelo}</Text>
                                <Text style={[styles.tableCell, styles.colSerie]}>{lista.serie}</Text>
                                <Text style={[styles.tableCell, styles.colPrecio]}>{(lista.precio ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                                {/* <Text style={styles.tableCell}>{lista.aF_CODIGO_LARGO}</Text>
                        <Text style={styles.tableCell}>{lista.deP_CORR}</Text>
                        <Text style={styles.tableCell}>{lista.esP_CODIGO}</Text>
                        <Text style={styles.tableCell}>{lista.aF_SECUENCIA}</Text>
                        <Text style={styles.tableCell}>{lista.itE_CLAVE}</Text>
                        <Text style={styles.tableCell}>{lista.aF_DESCRIPCION}</Text>
                        <Text style={styles.tableCell}>{lista.aF_FINGRESO}</Text>
                        <Text style={styles.tableCell}>{lista.aF_ESTADO}</Text>
                        <Text style={styles.tableCell}>{lista.aF_CODIGO}</Text>
                        <Text style={styles.tableCell}>{lista.aF_TIPO}</Text>
                        <Text style={styles.tableCell}>{lista.aF_ALTA}</Text>
                        <Text style={styles.tableCell}>{lista.aF_PRECIO_REF}</Text>
                        <Text style={styles.tableCell}>{lista.aF_CANTIDAD}</Text>
                        <Text style={styles.tableCell}>{lista.aF_ORIGEN}</Text>
                        <Text style={styles.tableCell}>{lista.aF_RESOLUCION}</Text>
                        <Text style={styles.tableCell}>{lista.aF_FECHA_SOLICITUD}</Text>
                        <Text style={styles.tableCell}>{lista.aF_OCO_NUMERO_REF}</Text>
                        <Text style={styles.tableCell}>{lista.usuariO_CREA}</Text>
                        <Text style={styles.tableCell}>{lista.f_CREA}</Text>
                        <Text style={styles.tableCell}>{lista.iP_CREA}</Text>
                        <Text style={styles.tableCell}>{lista.usuariO_MOD}</Text>
                        <Text style={styles.tableCell}>{lista.f_MOD}</Text>
                        <Text style={styles.tableCell}>{lista.iP_MODt}</Text>
                        <Text style={styles.tableCell}>{lista.aF_TIPO_DOC}</Text>
                        <Text style={styles.tableCell}>{lista.proV_RUN}</Text>
                        <Text style={styles.tableCell}>{lista.reG_EQM}</Text>
                        <Text style={styles.tableCell}>{lista.aF_NUM_FAC}</Text>
                        <Text style={styles.tableCell}>{lista.aF_FECHAFAC}</Text>
                        <Text style={styles.tableCell}>{lista.aF_3UTM}</Text>
                        <Text style={styles.tableCell}>{lista.iD_GRUPO}</Text>
                        <Text style={styles.tableCell}>{lista.ctA_COD}</Text>
                        <Text style={styles.tableCell}>{lista.transitoria}</Text>
                        <Text style={styles.tableCell}>{lista.aF_MONTOFACTURA}</Text>
                        <Text style={styles.tableCell}>{lista.esP_DESCOMPONE}</Text>
                        <Text style={styles.tableCell}>{lista.aF_ETIQUETA}</Text>
                        <Text style={styles.tableCell}>{lista.aF_VIDAUTIL}</Text>
                        <Text style={styles.tableCell}>{lista.aF_VIGENTE}</Text>
                        <Text style={styles.tableCell}>{lista.idprograma}</Text>
                        <Text style={styles.tableCell}>{lista.idmodalidadcompra}</Text>
                        <Text style={styles.tableCell}>{lista.idpropiedad}</Text>*/}
                                < Text style={[styles.tableCell, styles.colDescripcion]} > {lista.aF_DESCRIPCION == "0" ? "Sin Descripción" : lista.aF_DESCRIPCION}</Text>
                                <Text style={[styles.tableCell, styles.colMesesTranscurridos]}>{lista.mesesTranscurridos}</Text>
                                <Text style={[styles.tableCell, styles.colVidaUtil]}>{lista.vidaUtil}</Text>
                                <Text style={[styles.tableCell, styles.colMesVidaUtil]}>{lista.mesVidaUtil}</Text>
                                <Text style={[styles.tableCell, styles.colMesesRestantes]}>{lista.mesesRestantes}</Text>
                                <Text style={[styles.tableCell, styles.colMontoInicial]}>{(lista.montoInicial ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                                <Text style={[styles.tableCell, styles.colDepreciacionAnual]}>{(lista.depreciacionPorAno ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                                <Text style={[styles.tableCell, styles.colDepreciacionMensual]}>{(lista.depreciacionPorMes ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                                <Text style={[styles.tableCell, styles.colDepAcumulada]}>{(lista.depreciacionAcumuladaActualizada ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                                <Text style={[styles.tableCell, styles.colValorResidual]}>{(lista.valorResidual ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                                {/* <Text style={[styles.tableCell, styles.colDepSIGFE]}>{(lista.depreciacioN_ACUMULADA_SIGFE ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text> */}
                                {/* <Text style={[styles.tableCell, styles.colDepAcumuladaSIGFE]}>{(lista.depreciacioN_ACUMULADA_SIGFE ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text> */}
                            </View>
                        ))}
                    </View>

                    {/* <Text style={styles.printLabel}>Impreso el {fechaDescarga}</Text> */}

                    <View style={styles.footer} fixed>
                        <Text style={styles.footerLeft}>{fechaHoy}</Text>

                        <Text
                            style={styles.footerRight}
                            render={({ pageNumber, totalPages }) =>
                                `Página ${pageNumber} de ${totalPages}`
                            }
                        />
                    </View>

                </Page >
            ))}
        </Document >
    );
};

export default DocumentoPDF;
