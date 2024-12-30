import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ListaBajas } from './FirmarAltas';
import ssmso_logo from "../../../assets/img/SSMSO-LOGO.png"
const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
    },
    header: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#000',
        borderStyle: 'solid',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCellHeader: {
        fontWeight: 'bold',
        padding: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#f3f3f3',
        flex: 1,
        textAlign: 'center',
    },
    tableCell: {
        padding: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        flex: 1,
        textAlign: 'center',
    },
    signaturesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 350,
        paddingHorizontal: 20,
    },
    signatureBox: {
        flex: 1,
        alignItems: 'center',
    },
    signatureLabel: {
        marginTop: 5,
        fontSize: 10,
        textAlign: 'center',
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
});

const PDFRowDocument = ({ row }: { row: ListaBajas }) => (
    <Document>
        <Page style={styles.page}>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image
                    src={ssmso_logo}
                    style={styles.logo}
                />
            </View>
            {/* Encabezado */}
            <Text style={styles.header}>Alta Nº: {row.aF_CLAVE}</Text>

            {/* Tabla */}
            <View style={styles.table}>
                {/* Cabecera de la tabla */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Código</Text>
                    <Text style={styles.tableCellHeader}>N° Inventario</Text>
                    <Text style={styles.tableCellHeader}>Vida Útil Restante</Text>
                    <Text style={styles.tableCellHeader}>En Años</Text>
                    <Text style={styles.tableCellHeader}>N° Cuenta</Text>
                    <Text style={styles.tableCellHeader}>Especie</Text>
                    <Text style={styles.tableCellHeader}>Depreciación Acumulada</Text>
                </View>
                {/* Fila de datos */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{row.bajaS_CORR}</Text>
                    <Text style={styles.tableCell}>{row.aF_CLAVE}</Text>
                    <Text style={styles.tableCell}>{row.vutiL_RESTANTE}</Text>
                    <Text style={styles.tableCell}>{row.vutiL_AGNOS}</Text>
                    <Text style={styles.tableCell}>{row.ncuenta}</Text>
                    <Text style={styles.tableCell}>{row.especie}</Text>
                    <Text style={styles.tableCell}>{row.deP_ACUMULADA}</Text>
                </View>
            </View>

            {/* Área de firmas */}
            <View style={styles.signaturesContainer}>
                {/* Firma del empleador */}
                <View style={styles.signatureBox}>
                    <Text>__________________________</Text>
                    <Text style={styles.signatureLabel}>Firma</Text>
                </View>

                {/* Firma del trabajador */}
                <View style={styles.signatureBox}>
                    <Text>__________________________</Text>
                    <Text style={styles.signatureLabel}>Firma</Text>
                </View>
            </View>
        </Page>
    </Document>

);

export default PDFRowDocument;
