import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ssmso_logo from "../../../../assets/img/SSMSO-LOGO.png"
import { Container } from 'react-bootstrap';
import { ListaFolioServicioDependencia } from './FolioPorServicioDependencia';

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
        fontSize: 10,
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
        fontSize: 8,
        fontWeight: 'bold',
        padding: "0.5px",
        border: '1px solid #b3b3b3',
        backgroundColor: "rgb(0 68 133 / 80%)",
        color: "#fff",
        flex: 1,
        // textAlign: 'center',
    },
    tableCellHeaderLong: {
        fontSize: 8,
        fontWeight: 'bold',
        padding: 2,
        border: '1px solid #b3b3b3',
        backgroundColor: "rgb(0 68 133 / 80%)",
        color: "#fff",
        flex: 2,
        wordWrap: 'break-word',
        overflow: 'hidden',
        whiteSpace: 'wrap',
        maxWidth: 120,
    },
    tableCell: {
        fontSize: 8,
        border: '1px solid #b3b3b3',
        padding: 2,
        flex: 1,
        wordWrap: 'break-word',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'wrap', // react-pdf no reconoce "normal", usa "wrap"
        maxWidth: 80, // puedes ajustar esto según el diseño
    },
    tableCellLong: {
        fontSize: 8,
        border: '1px solid #b3b3b3',
        padding: 2,
        flex: 2, // más espacio horizontal
        wordWrap: 'break-word',
        overflow: 'hidden',
        whiteSpace: 'wrap',
        maxWidth: 120,
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
        fontSize: 10,
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
const DocumentoPDF = ({ row }: { row: ListaFolioServicioDependencia[]; }) => (
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
                    <Text style={styles.tableCellHeader}>N° Inventario</Text>
                    <Text style={styles.tableCellHeaderLong}>Especie</Text>
                    <Text style={styles.tableCellHeader}>Marca</Text>
                    <Text style={styles.tableCellHeader}>Modelo</Text>
                    <Text style={styles.tableCellHeader}>Serie</Text>
                    {/* <Text style={styles.tableCellHeader}>Observación</Text> */}
                    <Text style={styles.tableCellHeader}>Fecha Ingreso</Text>
                    <Text style={styles.tableCellHeader}>Nº Alta</Text>
                    <Text style={styles.tableCellHeader}>Estado</Text>
                    <Text style={styles.tableCellHeader}>Nº Traslado</Text>
                </View>
                {/* Fila de datos */}
                {row.map((lista) => (
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>{lista.aF_CODIGO_GENERICO}</Text>
                        <Text style={styles.tableCellLong}>{lista.especie}</Text>
                        <Text style={styles.tableCell}>{lista.aF_MARCA}</Text>
                        <Text style={styles.tableCell}>{lista.aF_MODELO}</Text>
                        <Text style={styles.tableCell}>{lista.aF_SERIE}</Text>
                        {/* <Text style={styles.tableCellLong}>{lista.aF_OBS}</Text> */}
                        <Text style={styles.tableCell}>{lista.aF_FINGRESO}</Text>
                        <Text style={styles.tableCell}>{lista.altaS_CORR}</Text>
                        <Text style={styles.tableCell}>{lista.traS_ESTADO_AF}</Text>
                        <Text style={styles.tableCell}>{lista.ntraslado}</Text>
                    </View>
                ))}
            </View>
            {/* <Text style={styles.printLabel}>Impreso el {fechaDescarga}</Text> */}
        </Page >
    </Document >

);

export default DocumentoPDF;
