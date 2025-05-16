import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ssmso_logo from "../../../../assets/img/SSMSO-LOGO.png"
import ago from "../../../../assets/img/ago.jpg"
import { Container } from 'react-bootstrap';
import { ListaFolioServicioDependencia } from './FolioPorServicioDependencia';

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
const DocumentoPDF = ({ row, AltaInventario }: { row: ListaFolioServicioDependencia[]; AltaInventario: any, firmanteInventario: string, firmanteFinanzas: string, firmanteAbastecimiento: string, visadoInventario: string, visadoFinanzas: string, visadoAbastecimiento: string }) => (
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

            {/* Encabezado */}
            <Container style={styles.containerHeader}>
                <View style={styles.headerContent}>
                    {row.length > 0 && (
                        <Text style={styles.p}>Servicio: {row[0].servicio}</Text>
                    )}
                    {row.length > 0 && (
                        <Text style={styles.p}>Folio: {row[0].aF_FOLIO}</Text>
                    )}
                </View>
                <View style={styles.headerContent}>
                    {row.length > 0 && (
                        <Text style={styles.p}>Dependencia: {row[0].dependencia}</Text>
                    )}
                    <Text style={styles.p}>Fecha: {fechaHoy}</Text>
                </View>
            </Container>

            {/* Tabla */}
            <View style={styles.table}>
                {/* Cabecera de la tabla */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>N° Inventario</Text>
                    <Text style={styles.tableCellHeader}>Nº Alta</Text>
                    <Text style={styles.tableCellHeader}>Fecha Ingreso</Text>
                    <Text style={styles.tableCellHeader}>Especie</Text>
                    <Text style={styles.tableCellHeader}>Marca</Text>
                    <Text style={styles.tableCellHeader}>Modelo</Text>
                    <Text style={styles.tableCellHeader}>Serie</Text>
                    <Text style={styles.tableCellHeader}>Precio</Text>
                    <Text style={styles.tableCellHeader}>Observación</Text>


                </View>
                {/* Fila de datos */}
                {row.map((lista) => (
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>{lista.aF_CODIGO_GENERICO}</Text>
                        <Text style={styles.tableCell}>{lista.altaS_CORR}</Text>
                        <Text style={styles.tableCell}>{lista.aF_FINGRESO}</Text>
                        <Text style={styles.tableCell}>{lista.aF_ESPECIE}</Text>
                        <Text style={styles.tableCell}>{lista.aF_MARCA}</Text>
                        <Text style={styles.tableCell}>{lista.aF_MODELO}</Text>
                        <Text style={styles.tableCell}>{lista.aF_SERIE}</Text>
                        <Text style={styles.tableCell}>$ {(lista.aF_PRECIO ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                        <Text style={styles.tableCell}>{lista.aF_OBS}</Text>
                    </View>
                ))}
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

                {/* Firma Unidad Abastecimiento */}
                {AltaInventario.abastecimiento && (
                    <View style={styles.firmaBox}>
                        {AltaInventario.visadoAbastecimiento ? (
                            <Image src={AltaInventario.visadoAbastecimiento} style={{ ...styles.firmaImagen }} />
                            // <Text style={styles.firmaLabel}>{AltaInventario.visadoFinanzas}</Text>
                        ) : (
                            <Text style={styles.firmaLabel}>Falta Visar Documento</Text>
                        )}
                        <Text>_______________________</Text>
                        <Text style={styles.firmaLabel}>{AltaInventario.firmanteAbastecimiento}</Text>
                        <Text style={styles.firmaLabel}>Unidad de Abastecimiento</Text>
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
