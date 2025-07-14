import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ListaAltas } from './FirmarAltas';
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
    tableHeader: {
        fontSize: 8,
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
        fontSize: 8,
        borderRight: "1px solid #ccc",
        textAlign: "center",
        overflow: "hidden",
    },
    colCodigo: {
        width: "45%", // o fixed in pt: 60
        wordWrap: 'break-word',
    },
    colNAlta: {
        width: "20%",
    },
    colFechaAlta: {
        width: "40%",
    },
    colServicio: {
        width: "50%",
    },
    colDependencia: {
        width: "50%",
    },
    colEspecie: {
        width: "40%",
    },
    colCuenta: {
        width: "40%",
    },
    colMarca: {
        width: "30%",
    },
    colModelo: {
        width: "35%",
    },
    colSerie: {
        width: "30%",
    },
    colPrecio: {
        width: "50%",
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
    firmaImagen: {
        bottom: 40,
        width: "30%",
        position: 'absolute'
    },
    containerFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        fontSize: 9,
        bottom: 20,
        left: 20,
        right: 20,
        borderTop: '1px black solid'
    },
    fechaHoy: {
        padding: 2,
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

const DocumentoPDF = ({ row, totalSum /*AltaInventario, objeto, UnidadNombre, Unidad*/ }: { row: ListaAltas[]; totalSum: number /*AltaInventario: any, objeto: Objeto, UnidadNombre: string, Unidad: number*/ /*firmanteInventario: string, firmanteFinanzas: string, firmanteAbastecimiento: string, visadoInventario: string, visadoFinanzas: string, visadoAbastecimiento: string */ }) => {
    const filasPorPagina = 12;
    const paginas = arreglo(row, filasPorPagina);

    // const DocumentoPDF = ({ row, totalSum /*AltaInventario, objeto, UnidadNombre, Unidad*/ }: { row: ListaAltas[]; totalSum: number /*AltaInventario: any, objeto: Objeto, UnidadNombre: string, Unidad: number*/ /*firmanteInventario: string, firmanteFinanzas: string, firmanteAbastecimiento: string, visadoInventario: string, visadoFinanzas: string, visadoAbastecimiento: string */ }) => (

    return (
        <Document>
            {paginas.map((rows, indicePagina) => (
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
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableCell, styles.colCodigo]}>N° Inventario</Text>
                            <Text style={[styles.tableCell, styles.colNAlta]}>N° Alta</Text>
                            <Text style={[styles.tableCell, styles.colFechaAlta]}>Fecha Alta</Text>
                            <Text style={[styles.tableCell, styles.colServicio]}>Servicio</Text>
                            <Text style={[styles.tableCell, styles.colDependencia]}>Dependencia</Text>
                            <Text style={[styles.tableCell, styles.colEspecie]}>Especie</Text>
                            <Text style={[styles.tableCell, styles.colCuenta]}>N° Cuenta</Text>
                            <Text style={[styles.tableCell, styles.colMarca]}>Marca</Text>
                            <Text style={[styles.tableCell, styles.colModelo]}>Modelo</Text>
                            <Text style={[styles.tableCell, styles.colSerie]}>Serie</Text>
                            {/* <Text style={[styles.tableCell, styles.colObs]}>Estado</Text> */}
                            <Text style={[styles.tableCell, styles.colPrecio]}>Precio</Text>
                            <Text style={[styles.tableCell, styles.colRecepcion]}>Nº Recepción</Text>
                        </View>
                        {/* Fila de datos */}
                        {rows.map((lista) => (

                            <View style={styles.tableRow} key={lista}>
                                <Text style={[styles.tableCell, styles.colCodigo]}>{lista.ninv}</Text>
                                <Text style={[styles.tableCell, styles.colNAlta]}>{lista.altaS_CORR}</Text>
                                <Text style={[styles.tableCell, styles.colFechaAlta]}>{lista.fechA_ALTA}</Text>
                                <Text style={[styles.tableCell, styles.colServicio]}>{lista.serv}</Text>
                                <Text style={[styles.tableCell, styles.colDependencia]}>{lista.dep}</Text>
                                <Text style={[styles.tableCell, styles.colEspecie]}>{lista.esp}</Text>
                                <Text style={[styles.tableCell, styles.colCuenta]}>{lista.ncuenta}</Text>
                                <Text style={[styles.tableCell, styles.colMarca]}>{lista.marca}</Text>
                                <Text style={[styles.tableCell, styles.colModelo]}>{lista.modelo}</Text>
                                <Text style={[styles.tableCell, styles.colSerie]}>{lista.serie}</Text>
                                {/* <Text style={[styles.tableCell, styles.colObs]}>{lista.estado}</Text> */}
                                <Text style={[styles.tableCell, styles.colPrecio]}>$ {(lista.precio ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                                <Text style={[styles.tableCell, styles.colRecepcion]}>{lista.nrecep}</Text>
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


                    <Container style={styles.containerFooter}>
                        <Text style={styles.fechaHoy}>{fechaHoy}</Text>
                        <Text>Pág {indicePagina + 1} de {paginas.length}</Text>
                    </Container>


                    {/* Pie de página para otras páginas */}
                    {indicePagina !== paginas.length - 1 && (
                        <Container style={styles.containerFooter}>
                            {/* <View style={styles.flex}> */}
                            <Text style={styles.fechaHoy}>{fechaHoy}</Text>
                            <Text>Pág {indicePagina + 1} de {paginas.length}</Text>
                            {/* </View> */}
                        </Container>
                    )}
                </Page>
            ))
            }
        </Document >

    );
};
export default DocumentoPDF;
