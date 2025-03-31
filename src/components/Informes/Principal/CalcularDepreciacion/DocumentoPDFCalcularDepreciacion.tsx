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
        marginBottom: 20,
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
        marginBottom: 10,
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
    tableRow: {
        flexDirection: 'row',
    },
    tableCellHeader: {
        fontSize: 5,
        fontWeight: 'bold',
        padding: "0.5px",
        border: '1px solid #b3b3b3',
        backgroundColor: "rgb(0 68 133 / 80%)",
        color: "#fff",
        flex: 1,
        // textAlign: 'center',
    },
    tableCell: {
        fontSize: 5,
        border: '1px solid #b3b3b3',
        padding: "0.5px",
        flex: 1,
        // textAlign: 'center',
    },
});
const DocumentoPDF = ({ row, totalSum }: { row: ListaActivosFijos[]; totalSum: number }) => (
    <Document>
        <Page style={styles.page}>
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
            <View style={styles.headerContent}>
                <Text style={styles.header}>Total valor residual: $ {(totalSum ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                {/* <Text style={styles.header}>Fecha: {fechaHoy}</Text> */}
            </View>
            {/* Tabla */}
            <View style={styles.table}>
                {/* Cabecera de la tabla */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Código</Text>
                    {/* <Text style={styles.tableCellHeader}>Código Genérico</Text> */}
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
                    <Text style={styles.tableCellHeader}>Especie</Text>
                    <Text style={styles.tableCellHeader}>Meses Transcurridos</Text>
                    <Text style={styles.tableCellHeader}>Vida Útil</Text>
                    <Text style={styles.tableCellHeader}>Mes Vida Útil</Text>
                    <Text style={styles.tableCellHeader}>Meses Restantes</Text>
                    <Text style={styles.tableCellHeader}>Monto Inicial</Text>
                    <Text style={styles.tableCellHeader}>Depreciación por Año</Text>
                    <Text style={styles.tableCellHeader}>Depreciación por Mes</Text>
                    <Text style={styles.tableCellHeader}>Depreciación Acumulada Actualizada</Text>
                    <Text style={styles.tableCellHeader}>Valor Residual</Text>
                </View>
                {/* Fila de datos */}
                {row.map((lista) => (
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>{lista.aF_CLAVE}</Text>
                        {/* <Text style={styles.tableCell}>{lista.aF_CODIGO_GENERICO}</Text> */}
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
                        <Text style={styles.tableCell}>{lista.especie}</Text>
                        <Text style={styles.tableCell}>{lista.mesesTranscurridos}</Text>
                        <Text style={styles.tableCell}>{lista.vidaUtil}</Text>
                        <Text style={styles.tableCell}>{lista.mesVidaUtil}</Text>
                        <Text style={styles.tableCell}>{lista.mesesRestantes}</Text>
                        <Text style={styles.tableCell}>$ {(lista.montoInicial ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                        <Text style={styles.tableCell}>$ {(lista.depreciacionPorAno ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                        <Text style={styles.tableCell}>$ {(lista.depreciacionPorMes ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                        <Text style={styles.tableCell}>$ {(lista.depreciacionAcumuladaActualizada ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                        <Text style={styles.tableCell}>$ {(lista.valorResidual ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                    </View>
                ))}
            </View>
            {/* <Text style={styles.printLabel}>Impreso el {fechaDescarga}</Text> */}
        </Page >
    </Document >

);

export default DocumentoPDF;
