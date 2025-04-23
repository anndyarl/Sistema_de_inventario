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

    table: {
        display: 'flex',
        flexDirection: 'column',
        padding: 5
    },
    tableRow: {
        flexDirection: 'row',
        margin: 5,
        justifyContent: 'center',
        border: '1px solid rgb(219, 219, 219)',
        width: '40%',
        alignSelf: 'center',
        borderRadius: 4,
    },

    tableCell: {
        fontSize: 8,
        padding: 6,
        // flex: 2, // más espacio horizontal
        wordWrap: 'break-word',
        overflow: 'hidden',
        whiteSpace: 'wrap',
        maxWidth: 100,
    },

});
const DocumentoEtiquetasPDF = ({ row }: { row: ListaEtiquetas[]; }) => (
    <Document>
        <Page style={styles.page}>
            {/* Tabla */}
            <View style={styles.table}>
                {/* Fila de datos */}
                {row.map((lista, index) => (
                    <View style={styles.tableRow} key={index}>
                        {lista.qrImage ? (
                            <Image src={lista.qrImage} style={{ ...styles.tableCell, flex: 1 }} />
                        ) : (
                            <Text>Sin QR</Text>
                        )}
                        <Text style={{ ...styles.tableCell, flex: 3 }}>
                            {`\n${lista.aF_UBICACION}\n\n\n\n${lista.aF_CODIGO_LARGO}\n\n${lista.aF_DESCRIPCION}`}
                        </Text>
                    </View>
                ))}
            </View>

        </Page >
    </Document >

);

export default DocumentoEtiquetasPDF;
