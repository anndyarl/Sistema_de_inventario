import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ssmso_logo from "../../../assets/img/SSMSO-LOGO.png"
import ago from "../../../assets/img/ago.jpg"
import { Container } from 'react-bootstrap';
import { ListaEtiquetas } from './ImprimirEtiqueta';


// Formatear la fecha actual en español (Chile)
const fechaHoy = new Date()
    .toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
    .replace(/-/g, '/');

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
        justifyContent: 'space-between'
    },
    header: {
        flex: 1,
        fontSize: 6,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    centerText: {
        flex: 1,
        textAlign: 'center',
    },
    title: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    p: {
        fontSize: 10,
        marginBottom: 2,
        fontWeight: 'semibold',
        textAlign: 'left',
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
        flex: 2, // más espacio horizontal
        wordWrap: 'break-word',
        overflow: 'hidden',
        whiteSpace: 'wrap',
        maxWidth: 100,
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
const DocumentoEtiquetasPDF = ({ row }: { row: ListaEtiquetas[]; }) => (
    <Document>
        <Page style={styles.page}>
            {/* Logo */}
            <Container style={styles.containerHeader}>
                <View style={styles.headerRow}>
                    {/* Logo izquierda */}
                    <Image src={ssmso_logo} style={styles.logo} />

                    {/* Texto centrado */}
                    <View style={styles.centerText}>
                        <Text style={styles.title}>SISTEMA DE ACTIVO FIJO</Text>
                        <Text style={styles.title}>UNIDAD DE INVENTARIO</Text>
                    </View>

                    {/* Logo derecha */}
                    <Image src={ago} style={styles.logo} />
                </View>
            </Container>

            {/* Tabla */}
            <View style={styles.table}>
                {/* Cabecera de la tabla */}
                {/* <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeaderLong}>N° Inventario</Text>
                    <Text style={styles.tableCellHeaderLong}>Especie</Text>
                    <Text style={styles.tableCellHeaderLong}>Fecha Alta</Text>
                    <Text style={styles.tableCellHeaderLong}>Nº Cuenta</Text>
                    <Text style={styles.tableCellHeaderLong}>Ubicación</Text>
                    <Text style={styles.tableCellHeaderLong}>QR</Text>
                </View> */}
                {/* Fila de datos */}
                {row.map((lista, index) => (
                    <View style={styles.tableRow} key={index}>
                        {lista.qrImage ? (
                            <Image src={lista.qrImage} style={styles.tableCell} />
                        ) : (
                            <Text>Sin QR</Text>
                        )}
                        <Text style={styles.tableCell}>
                            {`${lista.aF_UBICACION}\n\n${lista.aF_CODIGO_LARGO}\n\n${lista.aF_DESCRIPCION}`}
                        </Text>



                    </View>
                ))}



            </View>
            {/* <Text style={styles.printLabel}>Impreso el {fechaDescarga}</Text> */}
        </Page >
    </Document >

);

export default DocumentoEtiquetasPDF;
