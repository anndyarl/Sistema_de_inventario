import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Col, Row } from 'react-bootstrap';
const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
    },
    body: {
        flex: 1, // ocupa todo el espacio disponible
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
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 20
    },

    headerContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    header: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 2,
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
    tableHeader: {
        fontSize: 7,
        flexDirection: "row",
        fontWeight: 'bold',
        backgroundColor: 'rgb(0 68 133 / 80%)',
        color: '#fff',
        borderBottom: "1px solid #000",
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1px solid #ccc",
        alignItems: "center",
    },
    tableCell: {
        padding: 3,
        fontSize: 7,
        borderRight: "1px solid #ccc",
        textAlign: "center",
        overflow: "hidden",
    },
    colCodigo: {
        width: "45%", // o fixed in pt: 60
        wordWrap: 'break-word',
    },
    colNfactura: {
        width: "30%",
        textAlign: "center",
    },
    colOdeCompra: {
        width: "40%",
    },
    colServicio: {
        width: "45%",
    },
    colDependencia: {
        width: "45%",
    },
    colEspecie: {
        width: "35%",
    },
    colCuenta: {
        width: "35%",
    },
    colMarca: {
        width: "35%",
    },
    colModelo: {
        width: "35%",
    },
    colSerie: {
        width: "35%",
    },
    colPrecio: {
        width: "35%",
    },
    colRecepcion: {
        width: "35%",
    },

    firmaBox: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    firmaLabel1: {
        marginTop: 5,
        marginRight: 50,
        fontSize: 10,
        textAlign: 'left'
    },
    firmaLabel2: {
        marginTop: 5,
        fontSize: 10,
        textAlign: 'right'
    },
    firmaLabel3: {
        marginTop: 5,
        marginBottom: 5,
        marginRight: 10,
        fontSize: 12,
        textAlign: 'left'
    },
    firmaImagen: {
        bottom: 40,
        width: "30%",
        position: 'absolute'
    },
    footer: {
        marginTop: 10,
        paddingTop: 5,
        fontSize: 9,
        flexDirection: "column",
        alignItems: "flex-end",
    },
    datosGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 1,
    },
    datosColumnaIzquierda: {
        width: "20%",
    },
    datosColumnaDerecha: {
        width: "80%",
    },
    fakeGradient: {
        height: 1,
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.15)", // simulación
    },
});

// Formatear la fecha actual en español (Chile)
const fechaHoy = new Date()
    .toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
    .replace(/-/g, '/');

const arreglo = (array: any[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};

// Inserta saltos de línea 
function insertNewLinesDigits(value: any, every = 10) {
    if (value === null || value === undefined) return "";
    const s = String(value);
    // Si ya tiene saltos, procesamos cada línea por separado para no romperlos
    return s
        .split('\n')
        .map(line => line.replace(new RegExp(`(.{${every}})`, 'g'), '$1\n'))
        .join('\n');
}



const DocumentoPDF = ({ row, totalSum /*AltaInventario, objeto, UnidadNombre, Unidad*/ }: { row: any[]; totalSum: number /*AltaInventario: any, objeto: Objeto, UnidadNombre: string, Unidad: number*/ /*firmanteInventario: string, firmanteFinanzas: string, firmanteAbastecimiento: string, visadoInventario: string, visadoFinanzas: string, visadoAbastecimiento: string */ }) => {
    const filasPorPagina = 12;
    const paginas = arreglo(row, filasPorPagina);

    // const DocumentoPDF = ({ row, totalSum /*AltaInventario, objeto, UnidadNombre, Unidad*/ }: { row: ListaAltas[]; totalSum: number /*AltaInventario: any, objeto: Objeto, UnidadNombre: string, Unidad: number*/ /*firmanteInventario: string, firmanteFinanzas: string, firmanteAbastecimiento: string, visadoInventario: string, visadoFinanzas: string, visadoAbastecimiento: string */ }) => (

    return (
        <Document>
            {paginas.map((rows, indicePagina) => (
                <Page size="A4" style={styles.page}>
                    <View style={styles.body}>
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
                                const lista = row[0]; // todos tienen la misma altaS_CORR, así que usamos el primero
                                return (
                                    <>

                                        <Row>
                                            <View style={styles.headerContainer}>
                                                <Col md={6}>
                                                    <Text style={styles.header}>Alta Nº: {lista.altaS_CORR}</Text>
                                                    <Text style={styles.header}>Nº Recepción: {lista.nrecep}</Text>
                                                </Col>
                                                <Col md={6}>
                                                    <Text style={styles.header}>Fecha de Alta: {lista.fechA_ALTA}</Text>
                                                    {/* <Text style={styles.header}>Nº Factura: {lista.aF_NUM_FAC}</Text> */}
                                                    {/* <Text style={styles.header}>Orde de Compra:{lista.aF_OCO_NUMERO_REF}</Text> */}
                                                </Col>

                                            </View>
                                        </Row>
                                    </>

                                );
                            }

                            return null; // no mostrar nada si hay más de una alta
                        })()}

                        {/* {indicePagina === 0 && ( */}
                        <View style={styles.firmaBox}>
                            <Text style={styles.firmaLabel3}>Cantidad: {row.length}</Text>
                        </View>
                        {/* )} */}
                        {/* Tabla */}
                        <View style={styles.table}>
                            {/* Cabecera de la tabla */}
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableCell, styles.colCodigo]}>N° Inventario</Text>
                                <Text style={[styles.tableCell, styles.colNfactura]}>N° Factura</Text>
                                <Text style={[styles.tableCell, styles.colOdeCompra]}>Ord. Compra</Text>
                                <Text style={[styles.tableCell, styles.colServicio]}>Servicio</Text>
                                <Text style={[styles.tableCell, styles.colDependencia]}>Dependencia</Text>
                                <Text style={[styles.tableCell, styles.colEspecie]}>Especie</Text>
                                <Text style={[styles.tableCell, styles.colCuenta]}>N° Cuenta</Text>
                                <Text style={[styles.tableCell, styles.colMarca]}>Marca</Text>
                                <Text style={[styles.tableCell, styles.colModelo]}>Modelo</Text>
                                <Text style={[styles.tableCell, styles.colSerie]}>Serie</Text>
                                {/* <Text style={[styles.tableCell, styles.colObs]}>Estado</Text> */}
                                <Text style={[styles.tableCell, styles.colPrecio]}>Precio</Text>
                                {/* <Text style={[styles.tableCell, styles.colRecepcion]}>Nº Recepción</Text> */}
                            </View>
                            {/* Fila de datos */}
                            {rows.map((lista) => (

                                <View style={styles.tableRow} key={lista}>
                                    <Text style={[styles.tableCell, styles.colCodigo]}>{lista.aF_CODIGO_GENERICO}</Text>
                                    <Text style={[styles.tableCell, styles.colNfactura]}> {insertNewLinesDigits(lista.aF_NUM_FAC, 10)}</Text>
                                    <Text style={[styles.tableCell, styles.colOdeCompra]}> {insertNewLinesDigits(lista.aF_OCO_NUMERO_REF, 10)}</Text>
                                    <Text style={[styles.tableCell, styles.colServicio]}>{lista.serv}</Text>
                                    <Text style={[styles.tableCell, styles.colDependencia]}>{lista.dep}</Text>
                                    <Text style={[styles.tableCell, styles.colEspecie]}>{lista.esP_NOMBRE}</Text>
                                    <Text style={[styles.tableCell, styles.colCuenta]}>{lista.ctA_COD}</Text>
                                    <Text style={[styles.tableCell, styles.colMarca]}>{lista.deT_MARCA}</Text>
                                    <Text style={[styles.tableCell, styles.colModelo]}>{lista.deT_MODELO}</Text>
                                    <Text style={[styles.tableCell, styles.colSerie]}> {insertNewLinesDigits(lista.deT_SERIE, 10)}</Text>
                                    {/* <Text style={[styles.tableCell, styles.colObs]}>{lista.estado}</Text> */}
                                    <Text style={[styles.tableCell, styles.colPrecio]}>$ {insertNewLinesDigits((lista.deT_PRECIO ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 }), 10)}</Text>
                                    {/* <Text style={[styles.tableCell, styles.colRecepcion]}>{lista.nrecep}</Text> */}
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
                        {indicePagina === paginas.length - 1 && (
                            <>
                                <Text style={styles.firmaLabel2}>_________________________</Text>
                                <View style={styles.firmaBox}>
                                    <Text style={styles.firmaLabel1}>Total</Text>
                                    <Text style={styles.firmaLabel2}>
                                        $ {(totalSum ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                    </Text>
                                </View>
                            </>
                        )}


                    </View>
                    <View style={styles.datosGrid}>
                        <View style={styles.datosColumnaIzquierda}>
                        </View>
                        <View style={styles.datosColumnaDerecha}>

                            <View style={styles.footer}>
                                <Text>{fechaHoy}</Text>
                                <View style={styles.fakeGradient} />
                                <Text>Pág {indicePagina + 1} de {paginas.length}</Text>
                            </View>
                        </View>
                    </View>

                </Page>
            ))
            }
        </Document >

    );
};
export default DocumentoPDF;
