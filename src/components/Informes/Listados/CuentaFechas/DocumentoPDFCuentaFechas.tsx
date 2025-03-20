import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

import ssmso_logo from "../../../../assets/img/SSMSO-LOGO.png"
import { Container } from 'react-bootstrap';
import { listaCuentaFechas } from './CuentaFechas';


// Formatear la fecha actual en español (Chile)
const fechaHoy = new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
});

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
        justifyContent: 'space-around'
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
    firmaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 300,
        paddingHorizontal: 20,
    },
    firmaBox: {
        flex: 1,
        alignItems: 'center',

    },
    firmaLabel: {
        marginTop: 5,
        fontSize: 6,
        textAlign: 'center',
    },

    line: {
        position: 'relative',
        border: "1px",
        width: "100%",
        marginTop: '200'
    },
    printLabel: {
        display: 'flex',
        justifyContent: 'flex-start'
    }
});
const DocumentoPDF = ({ row }: { row: listaCuentaFechas[]; }) => (
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
                <Text style={styles.header}>Fecha: {fechaHoy}</Text>
            </View>
            {/* Tabla */}
            <View style={styles.table}>
                {/* Cabecera de la tabla */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Código Cuenta</Text>
                    {/* <Text style={styles.tableCellHeader}>Cuenta</Text> */}
                    <Text style={styles.tableCellHeader}>Especie</Text>
                    <Text style={styles.tableCellHeader}>Código Inventario</Text>
                    <Text style={styles.tableCellHeader}>Fecha Ingreso</Text>
                    <Text style={styles.tableCellHeader}>Marca</Text>
                    <Text style={styles.tableCellHeader}>Serie</Text>
                    <Text style={styles.tableCellHeader}>N° Alta</Text>
                    <Text style={styles.tableCellHeader}>N° OCO</Text>
                    <Text style={styles.tableCellHeader}>N° Factura</Text>
                    <Text style={styles.tableCellHeader}>Proveedor</Text>
                    <Text style={styles.tableCellHeader}>Establecimiento</Text>
                    <Text style={styles.tableCellHeader}>Destino</Text>
                    <Text style={styles.tableCellHeader}>Valor Inicial</Text>
                    <Text style={styles.tableCellHeader}>Depreciación</Text>
                    <Text style={styles.tableCellHeader}>Depreciación Acumulada</Text>
                    <Text style={styles.tableCellHeader}>Valor Libro</Text>
                </View>
                {/* Fila de datos */}
                {row.map((lista) => (
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>{lista.codcuenta}</Text>
                        {/* <Text style={styles.tableCell}>{lista.cuenta}</Text> */}
                        <Text style={styles.tableCell}>{lista.especie}</Text>
                        <Text style={styles.tableCell}>{lista.codinventario}</Text>
                        <Text style={styles.tableCell}>{lista.fechaingreso}</Text>
                        <Text style={styles.tableCell}>{lista.marca}</Text>
                        <Text style={styles.tableCell}>{lista.serie}</Text>
                        <Text style={styles.tableCell}>{lista.nuM_ALTA?.toString() ?? ""}</Text>
                        <Text style={styles.tableCell}>{lista.nuM_OCO}</Text>
                        <Text style={styles.tableCell}>{lista.nuM_FAC}</Text>
                        <Text style={styles.tableCell}>{lista.proveedor}</Text>
                        <Text style={styles.tableCell}>{lista.establecimiento}</Text>
                        <Text style={styles.tableCell}>{lista.destino}</Text>
                        <Text style={styles.tableCell}>{lista.valorinicial?.toString() ?? ""}</Text>
                        <Text style={styles.tableCell}>{lista.depreciacion?.toString() ?? ""}</Text>
                        <Text style={styles.tableCell}>{lista.depreciacionacumulada?.toString() ?? ""}</Text>
                        <Text style={styles.tableCell}>{lista.valorlibro?.toString() ?? ""}</Text>
                    </View>
                ))}
            </View>
            {/* <Text style={styles.printLabel}>Impreso el {fechaDescarga}</Text> */}
        </Page >
    </Document >

);

export default DocumentoPDF;
