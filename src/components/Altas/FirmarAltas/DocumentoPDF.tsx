import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ListaBajas } from './FirmarAltas';
import ssmso_logo from "../../../assets/img/SSMSO-LOGO.png"
import { Container } from 'react-bootstrap';
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
    tableCellHeader: {
        fontWeight: 'bold',
        padding: 5,
        border: '1px solid #000',
        flex: 1,
        textAlign: 'center',
    },
    tableCell: {
        padding: 5,
        border: '1px solid #000',
        flex: 1,
        textAlign: 'center',
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
const fecha = Date.now();
const fechaHoy = new Date(fecha);
const DocumentoPDF = ({ row, firma, /*fechaDescarga*/ AltaInventario }: { row: ListaBajas; firma?: string,/* fechaDescarga: string | undefined */ AltaInventario: any }) => (
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
                <Text style={styles.header}>Alta Nº: {row.aF_CLAVE}</Text>
                <Text style={styles.header}>Fecha de Alta: {fechaHoy.toLocaleDateString('es-CL')}</Text>
            </View>
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
            <View style={styles.firmaContainer}>
                {/* Firma Unidad Inventario */}
                {AltaInventario.ajustarFirma && (
                    <View style={styles.firmaBox}>
                        {firma ? (
                            <Image
                                src={firma}
                                style={{
                                    position: 'absolute',
                                    bottom: 35,
                                    width: 150,
                                    height: 50,
                                }}
                            />
                        ) : (
                            <Text
                                style={{
                                    position: 'absolute',
                                    bottom: 35,
                                }}>
                                Falta Visar Documento
                            </Text>
                        )}
                        <Text>_______________________</Text>
                        <Text style={styles.firmaLabel}>Andy Riquelme</Text>
                        <Text style={styles.firmaLabel}>Unidad Inventario</Text>
                    </View>
                )}

                {/* Firma Unidad Finanzas */}
                {AltaInventario.finanzas && (
                    <View style={styles.firmaBox}>
                        <Text
                            style={{
                                position: 'absolute',
                                bottom: 35,
                            }}>Falta Visar Documento
                        </Text>
                        <Text>_______________________</Text>
                        <Text style={styles.firmaLabel}>Rodrigo Toledo</Text>
                        <Text style={styles.firmaLabel}>Unidad de Finanzas</Text>
                    </View>
                )}

                {/* Firma Unidad Demandante */}
                {AltaInventario.administrativa && (
                    <View style={styles.firmaBox}>
                        <Text
                            style={{
                                position: 'absolute',
                                bottom: 35,
                            }}>Falta Visar Documento
                        </Text>
                        <Text>_______________________</Text>
                        <Text style={styles.firmaLabel}>Rodrigo Toledo</Text>
                        <Text style={styles.firmaLabel}>{AltaInventario.unidadAdministrativa}</Text>
                    </View>
                )}
            </View>
            <Text style={styles.line}></Text>
            {/* <Text style={styles.printLabel}>Impreso el {fechaDescarga}</Text> */}
        </Page >
    </Document >

);

export default DocumentoPDF;
