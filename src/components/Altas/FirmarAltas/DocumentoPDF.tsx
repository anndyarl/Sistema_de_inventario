import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ListaAltas } from './FirmarAltas';
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
        marginTop: 350,
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
const DocumentoPDF = ({ row, AltaInventario }: { row: ListaAltas; AltaInventario: any, firmanteInventario: string, firmanteFinanzas: string, visadoInventario: string, visadoFinanzas: string }) => (
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
                <Text style={styles.header}>Alta Nº: {row.altaS_CORR}</Text>
                <Text style={styles.header}>Fecha de Alta: {row.fechA_ALTA}</Text>
            </View>
            {/* Tabla */}
            <View style={styles.table}>
                {/* Cabecera de la tabla */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeaderLong}>N° Inventario</Text>
                    <Text style={styles.tableCellHeaderLong}>N° Alta</Text>
                    <Text style={styles.tableCellHeaderLong}>Fecha Alta</Text>
                    <Text style={styles.tableCellHeader}>Servicio</Text>
                    <Text style={styles.tableCellHeader}>Dependencia</Text>
                    <Text style={styles.tableCellHeaderLong}>Especie</Text>
                    <Text style={styles.tableCellHeader}>N° Cuenta</Text>
                    <Text style={styles.tableCellHeader}>Marca</Text>
                    <Text style={styles.tableCellHeader}>Modelo</Text>
                    <Text style={styles.tableCellHeader}>Serie</Text>
                    <Text style={styles.tableCellHeader}>Estado</Text>
                    <Text style={styles.tableCellHeader}>Precio</Text>
                    <Text style={styles.tableCellHeader}>Nº REcepción</Text>
                </View>
                {/* Fila de datos */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellLong}>{row.ninv}</Text>
                    <Text style={styles.tableCellLong}>{row.altaS_CORR}</Text>
                    <Text style={styles.tableCellLong}>{row.fechA_ALTA}</Text>
                    <Text style={styles.tableCell}>{row.serv}</Text>
                    <Text style={styles.tableCell}>{row.dep}</Text>
                    <Text style={styles.tableCellLong}>{row.esp}</Text>
                    <Text style={styles.tableCell}>{row.ncuenta}</Text>
                    <Text style={styles.tableCell}>{row.marca}</Text>
                    <Text style={styles.tableCell}>{row.modelo}</Text>
                    <Text style={styles.tableCell}>{row.serie}</Text>
                    <Text style={styles.tableCell}>{row.estado}</Text>
                    <Text style={styles.tableCell}>{row.precio}</Text>
                    <Text style={styles.tableCell}>{row.nrecep}</Text>
                </View>
            </View>
            {/* Área de firmas */}
            <View style={styles.firmaContainer}>
                {/* Firma Unidad Inventario */}
                {AltaInventario.ajustarFirma && (
                    <View style={styles.firmaBox}>
                        {AltaInventario.visadoInventario ? (
                            <Image src={AltaInventario.visadoInventario} style={{ ...styles.firmaImagen }} />
                            // <Text style={styles.firmaLabel}>{AltaInventario.visadoInventario}</Text>
                        ) : (
                            <Text style={styles.firmaLabel}>Falta Visar Documento</Text>
                        )}
                        {/* <Image src={AltaInventario.visado} style={{ width: 200, height: 'auto' }} /> */}

                        <Text>_______________________</Text>
                        <Text style={styles.firmaLabel}>{AltaInventario.firmanteInventario}</Text>
                        <Text style={styles.firmaLabel}>Unidad Inventario</Text>
                    </View>
                )}

                {/* Firma Unidad Finanzas */}
                {AltaInventario.finanzas && (
                    <View style={styles.firmaBox}>
                        {AltaInventario.visadoFinanzas ? (
                            <Image src={AltaInventario.visadoFinanzas} style={{ ...styles.firmaImagen }} />
                            // <Text style={styles.firmaLabel}>{AltaInventario.visadoFinanzas}</Text>
                        ) : (
                            <Text style={styles.firmaLabel}>Falta Visar Documento</Text>
                        )}
                        <Text>_______________________</Text>
                        <Text style={styles.firmaLabel}>{AltaInventario.firmanteFinanzas}</Text>
                        <Text style={styles.firmaLabel}>Departamento de Finanzas</Text>
                    </View>
                )}

                {/* Firma Unidad Demandante */}
                {AltaInventario.administrativa && (
                    <View style={styles.firmaBox}>
                        <Text style={styles.firmaLabel}>Falta Visar Documento</Text>
                        <Text>_______________________</Text>
                        <Text style={styles.firmaLabel}>{AltaInventario.unidadAdministrativa}</Text>
                    </View>
                )}
            </View>
        </Page >
    </Document >

);

export default DocumentoPDF;
