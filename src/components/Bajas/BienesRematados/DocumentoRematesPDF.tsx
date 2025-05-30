import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ListaRemates } from './BienesRematados';
import { Container } from 'react-bootstrap';
import ssmso_logo from "../../../assets/img/SSMSO-LOGO.png"

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
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
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
    tableCellLong: {
        fontSize: 8,
        border: '1px solid #b3b3b3',
        padding: 2,
        flex: 2,
        wordWrap: 'break-word',
        overflow: 'hidden',
        whiteSpace: 'wrap',
        maxWidth: 120,
    },
    firmaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 100,
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
    firmaImagen: {
        bottom: 40,
        width: "30%",
        position: 'absolute'
    },

});
const DocumentoPDF = ({ row }: { row: ListaRemates[]; }) => (
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
            {/* Tabla */}
            <View style={styles.table}>
                {/* Cabecera de la tabla */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeaderLong}>N° Inventario</Text>
                    <Text style={styles.tableCellHeaderLong}>N° Resolución</Text>
                    <Text style={styles.tableCellHeaderLong}>Nº Alta</Text>
                    <Text style={styles.tableCellHeaderLong}>Especie</Text>
                    <Text style={styles.tableCellHeaderLong}>Fecha Ingreso</Text>
                    <Text style={styles.tableCellHeaderLong}>Vida Útil Restante</Text>
                    <Text style={styles.tableCellHeaderLong}>Vida Útil en Años</Text>
                    <Text style={styles.tableCellHeaderLong}>Observaciones</Text>
                    <Text style={styles.tableCellHeaderLong}>Depreciación Acumulada</Text>
                    <Text style={styles.tableCellHeaderLong}>Nº Cuenta</Text>
                    <Text style={styles.tableCellHeaderLong}>Estado</Text>
                </View>
                {/* Fila de datos */}
                {row.map((lista) => (
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellLong}>{lista.aF_CODIGO_GENERICO}</Text>
                        <Text style={styles.tableCellLong}>{lista.nresolucion}</Text>
                        <Text style={styles.tableCellLong}>{lista.bajaS_CORR}</Text>
                        <Text style={styles.tableCellLong}>{lista.especie}</Text>
                        <Text style={styles.tableCellLong}>{lista.fechA_INGRESO}</Text>
                        <Text style={styles.tableCellLong}>{lista.vutiL_RESTANTE}</Text>
                        <Text style={styles.tableCellLong}>{lista.vutiL_AGNOS}</Text>
                        <Text style={styles.tableCellLong}>{lista.observaciones}</Text>
                        <Text style={styles.tableCellLong}>{lista.deP_ACUMULADA}</Text>
                        <Text style={styles.tableCellLong}>{lista.ncuenta}</Text>
                        <Text style={styles.tableCellLong}>{lista.estado}</Text>
                    </View>
                ))}
            </View>
        </Page >
    </Document >

);

export default DocumentoPDF;
