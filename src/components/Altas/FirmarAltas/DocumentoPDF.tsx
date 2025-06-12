import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ListaAltas } from './FirmarAltas';
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
        backgroundColor: 'rgb(0 68 133 / 80%)',
        color: '#fff',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '2%', // más espacio base
        wordWrap: 'break-word',
        overflow: 'hidden',
        whiteSpace: 'wrap',
    },

    tableCellHeaderLongAlta: {
        fontSize: 8,
        fontWeight: 'bold',
        padding: 1,
        border: '1px solid #b3b3b3',
        backgroundColor: 'rgb(0 68 133 / 80%)',
        color: '#fff',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '1%', // más espacio base
        wordWrap: 'break-word',
        overflow: 'hidden',
        // whiteSpace: 'wrap',
    },
    tableCell: {
        fontSize: 8,
        border: '1px solid #b3b3b3',
        padding: 2,
        flex: 1,
        wordWrap: 'break-word',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'wrap',
        maxWidth: 80,
    },


    tableCellLong: {
        fontSize: 8,
        border: '1px solid #b3b3b3',
        padding: 2,
        flexGrow: 1,      // permite que esta columna crezca más que las demás
        flexShrink: 1,
        flexBasis: '2%', // punto de partida mayor
        wordWrap: 'break-word',
        overflow: 'hidden',
        whiteSpace: 'wrap',
    },

    tableCellLongAlta: {
        fontSize: 8,
        border: '1px solid #b3b3b3',
        padding: 1,
        flexGrow: 1,      // permite que esta columna crezca más que las demás
        flexShrink: 1,
        flexBasis: '1%', // punto de partida mayor
        wordWrap: 'break-word',
        overflow: 'hidden',
        // whiteSpace: 'wrap',
    },

    firmaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 250,
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
const DocumentoPDF = ({ row, /*AltaInventario, objeto, UnidadNombre, Unidad*/ }: { row: ListaAltas[]; /*AltaInventario: any, objeto: Objeto, UnidadNombre: string, Unidad: number*/ /*firmanteInventario: string, firmanteFinanzas: string, firmanteAbastecimiento: string, visadoInventario: string, visadoFinanzas: string, visadoAbastecimiento: string */ }) => (
    <Document>
        <Page style={styles.page}>
            {/* Logo */}
            {/* <Container style={styles.containerHeader}> */}
            {/* <View style={styles.headerContainer}> */}
            {/* Logo a la izquierda */}
            {/* <Image src={ssmso_logo} style={styles.logo} /> */}

            {/* Textos a la derecha */}
            {/* <View style={styles.textContainer}>
                        <Text style={styles.p}>Servicio de Salud Metropolitano Sur Oriente</Text>
                        <Text style={styles.p}>Subdirección Administrativa</Text>
                        <Text style={styles.p}>Departamento de Finanzas</Text>
                        <Text style={styles.p}>Unidad de Inventarios</Text>
                    </View> */}
            {/* </View> */}
            {/* </Container> */}
            {/* Encabezado */}
            {(() => {
                const altasUnicas = [...new Set(row.map(item => item.altaS_CORR))];
                if (altasUnicas.length === 1) {
                    const unicaAlta = row[0]; // todos tienen la misma altaS_CORR, así que usamos el primero
                    return (
                        <View style={styles.headerContent}>
                            <Text style={styles.header}>Alta Nº: {unicaAlta.altaS_CORR}</Text>
                            <Text style={styles.header}>Fecha de Alta: {unicaAlta.fechA_ALTA}</Text>
                        </View>
                    );
                }

                return null; // no mostrar nada si hay más de una alta
            })()}

            {/* Tabla */}
            <View style={styles.table}>
                {/* Cabecera de la tabla */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeaderLong}>N° Inventario</Text>
                    <Text style={styles.tableCellHeaderLongAlta}>N° Alta</Text>
                    <Text style={styles.tableCellHeaderLong}>Fecha Alta</Text>
                    <Text style={styles.tableCellHeader}>Servicio</Text>
                    <Text style={styles.tableCellHeaderLong}>Dependencia</Text>
                    <Text style={styles.tableCellHeader}>Especie</Text>
                    <Text style={styles.tableCellHeader}>N° Cuenta</Text>
                    <Text style={styles.tableCellHeader}>Marca</Text>
                    <Text style={styles.tableCellHeader}>Modelo</Text>
                    <Text style={styles.tableCellHeader}>Serie</Text>
                    <Text style={styles.tableCellHeader}>Estado</Text>
                    <Text style={styles.tableCellHeader}>Precio</Text>
                    <Text style={styles.tableCellHeader}>Nº REcepción</Text>
                </View>
                {/* Fila de datos */}
                {row.map((lista) => (
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellLong}>{lista.ninv}</Text>
                        <Text style={styles.tableCellLongAlta}>{lista.altaS_CORR}</Text>
                        <Text style={styles.tableCellLong}>{lista.fechA_ALTA}</Text>
                        <Text style={styles.tableCell}>{lista.serv}</Text>
                        <Text style={styles.tableCellLong}>{lista.dep}</Text>
                        <Text style={styles.tableCell}>{lista.esp}</Text>
                        <Text style={styles.tableCell}>{lista.ncuenta}</Text>
                        <Text style={styles.tableCell}>{lista.marca}</Text>
                        <Text style={styles.tableCell}>{lista.modelo}</Text>
                        <Text style={styles.tableCell}>{lista.serie}</Text>
                        <Text style={styles.tableCell}>{lista.estado}</Text>
                        <Text style={styles.tableCell}>{lista.precio}</Text>
                        <Text style={styles.tableCell}>{lista.nrecep}</Text>
                    </View>
                ))}
            </View>
            {/* Área de firmas */}
            {/* <View style={styles.firmaContainer}> */}
            {/* Firma Unidad Inventario */}
            {/* {AltaInventario.ajustarFirma && ( */}
            {/* <View style={styles.firmaBox}> */}
            {/* {AltaInventario.visadoInventario ? (
                            <Image src={AltaInventario.visadoInventario} style={{ ...styles.firmaImagen }} />
                        ) : (
                            <Text style={styles.firmaLabel}>Falta Visar Documento</Text>
                        )} */}
            {/* <Text>_______________________</Text>
                <Text style={styles.firmaLabel}>{AltaInventario.firmanteInventario}</Text>
                <Text style={styles.firmaLabel}>Unidad Inventario</Text>
            </View> */}
            {/* )} */}

            {/* Firma Unidad Finanzas */}
            {/* {AltaInventario.chkFinanzas && ( */}
            {/* <View style={styles.firmaBox}> */}
            {/* {AltaInventario.visadoFinanzas ? (
                            <Image src={AltaInventario.visadoFinanzas} style={{ ...styles.firmaImagen }} />
                        ) : (
                            <Text style={styles.firmaLabel}>Falta Visar Documento</Text>
                        )} */}
            {/* <Text>_______________________</Text>
                        <Text style={styles.firmaLabel}>{AltaInventario.firmanteFinanzas}</Text>
                        <Text style={styles.firmaLabel}>Departamento de Finanzas</Text>
                    </View> */}
            {/* )} */}
            {/* id usuario Gabriela 888 */}
            {/* {objeto.IdCredencial == 888 || objeto.IdCredencial === 62511 ? ( */}
            {/* <> */}
            {/* Firma Abastecimiento */}
            {/* {Unidad === 3 && (
                                <View style={styles.firmaBox}>
                                    <Text>_______________________</Text>
                                    <Text style={styles.firmaLabel}>{AltaInventario.firmanteAbastecimiento}</Text>
                                    <Text style={styles.firmaLabel}>{UnidadNombre}</Text>
                                </View>
                            )} */}
            {/* Firma Informatica */}
            {/* {Unidad === 4 && (
                                <View style={styles.firmaBox}>
                                    <Text>_______________________</Text>
                                    <Text style={styles.firmaLabel}>{AltaInventario.firmanteInformatica}</Text>
                                    <Text style={styles.firmaLabel}>{UnidadNombre}</Text>
                                </View>
                            )} */}
            {/* Firma Compra */}
            {/* {Unidad === 5 && (
                                <View style={styles.firmaBox}>
                                    <Text>_______________________</Text>
                                    <Text style={styles.firmaLabel}>{AltaInventario.firmanteCompra}</Text>
                                    <Text style={styles.firmaLabel}>{UnidadNombre}</Text>
                                </View>
                            )} */}

            {/* </>
                     ) : (
                         <> */}
            {/* Firma Unidad Abastecimiento */}
            {/* {AltaInventario.chkAbastecimiento && (
                                <View style={styles.firmaBox}> */}
            {/* {AltaInventario.visadoAbastecimiento ? (
                            <Image src={AltaInventario.visadoAbastecimiento} style={{ ...styles.firmaImagen }} />
                        ) : (
                            <Text style={styles.firmaLabel}>Falta Visar Documento</Text>
                        )} */}
            {/* <Text>_______________________</Text>
                                    <Text style={styles.firmaLabel}>{AltaInventario.firmanteAbastecimiento}</Text>
                                    <Text style={styles.firmaLabel}>Unidad de Abastecimiento</Text>
                                </View>
                            )} */}
            {/* </> */}
            {/* )} */}
            {/* </View> */}
        </Page>
    </Document >

);

export default DocumentoPDF;
