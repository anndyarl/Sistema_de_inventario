import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Col, Row } from 'react-bootstrap';
import { Objeto } from '../../Navegacion/Profile';

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
        flexDirection: 'column',
        alignItems: 'center',
        width: '30%',
    },
    derecha: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 5,
        marginBottom: 10,
    },
    firmaLabel1: {
        marginTop: 5,
        marginRight: 60,
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
        width: 100,
        height: 40,
        marginBottom: 5,
        objectFit: 'contain',
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

    firmaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
        paddingHorizontal: 20,
        flexWrap: 'wrap',
        gap: 10,
    },

    firmaLinea: {
        fontSize: 10,
        marginBottom: 2,
        textAlign: 'center',
    },

    firmaNombre: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
        textAlign: 'center',
    },

    firmaUnidad: {
        fontSize: 9,
        textAlign: 'center',
        color: '#666',
    },
    firmaMensaje: {
        height: 40, // Misma altura que firmaImagen (width: 100, height: 40)
        fontSize: 9,
        color: '#ff0000',
        textAlign: 'center',
        marginBottom: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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

const DocumentoPDF = ({
    row,
    totalSum,
    AltaInventario,
    objeto,
    UnidadNombre,
    Unidad
}: {
    row: any[];
    totalSum: number;
    AltaInventario: any;
    objeto: Objeto;
    UnidadNombre: string;
    Unidad: number;
}) => {
    const filasPorPagina = 12;
    const paginas = arreglo(row, filasPorPagina);

    return (
        <Document>
            {paginas.map((rows, indicePagina) => (
                <Page style={styles.page} key={indicePagina}>
                    <View style={styles.body}>
                        {/* Encabezado */}
                        {(() => {
                            const altasUnicas = [...new Set(rows.map(item => item.altaS_CORR))];
                            if (altasUnicas.length === 1) {
                                const lista = rows[0]; // todos tienen la misma altaS_CORR, así que usamos el primero
                                return (
                                    <Row>
                                        <View style={styles.headerContainer}>
                                            <Col md={6}>
                                                <Text style={styles.header}>Alta Nº: {lista.altaS_CORR}</Text>
                                                <Text style={styles.header}>Nº Recepción: {lista.nrecep}</Text>
                                            </Col>
                                            <Col md={6}>
                                                <Text style={styles.header}>Fecha de Alta: {lista.fechA_ALTA}</Text>
                                            </Col>
                                        </View>
                                    </Row>
                                );
                            }
                            return null; // no mostrar nada si hay más de una alta
                        })()}

                        <View style={styles.derecha}>
                            <Text style={styles.firmaLabel2}>Cantidad: {rows.length}</Text>
                        </View>

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
                                <Text style={[styles.tableCell, styles.colPrecio]}>Precio</Text>
                            </View>

                            {/* Filas de datos */}
                            {rows.map((lista, index) => (
                                <View style={styles.tableRow} key={index}>
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
                                    <Text style={[styles.tableCell, styles.colPrecio]}>$ {insertNewLinesDigits((lista.deT_PRECIO ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 }), 10)}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Total al final de cada página */}
                        {indicePagina === paginas.length - 1 && (
                            <>
                                <Text style={styles.firmaLabel2}>_________________________</Text>
                                <View style={styles.derecha}>
                                    <Text style={styles.firmaLabel1}>Total</Text>
                                    <Text style={styles.firmaLabel2}>
                                        $ {(totalSum ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                    </Text>
                                </View>
                            </>
                        )}

                        {/* Área de firmas - Solo en la última página y si idocumento coincide */}
                        {indicePagina === paginas.length - 1 && rows[0]?.idocumento === 441154 && (
                            <View style={styles.firmaContainer}>
                                {/* Firma Unidad Inventario */}
                                {AltaInventario.ajustarFirma && (
                                    <View style={styles.firmaBox}>
                                        {AltaInventario.visadoInventario ? (
                                            <Image src={AltaInventario.visadoInventario} style={styles.firmaImagen} />
                                        ) : (
                                            <Text style={styles.firmaMensaje}>Falta Visar Documento</Text>
                                        )}
                                        <Text style={styles.firmaLinea}>_______________________</Text>
                                        <Text style={styles.firmaNombre}>{AltaInventario.firmanteInventario || 'NOMBRE FIRMANTE'}</Text>
                                        <Text style={styles.firmaUnidad}>Unidad Inventario</Text>
                                    </View>
                                )}

                                {/* Firma Unidad Finanzas */}
                                {AltaInventario.chkFinanzas && (
                                    <View style={styles.firmaBox}>
                                        {AltaInventario.visadoFinanzas ? (
                                            <Image src={AltaInventario.visadoFinanzas} style={styles.firmaImagen} />
                                        ) : (
                                            <Text style={styles.firmaMensaje}>Falta Visar Documento</Text>
                                        )}
                                        <Text style={styles.firmaLinea}>_______________________</Text>
                                        <Text style={styles.firmaNombre}>{AltaInventario.firmanteFinanzas || 'NOMBRE FIRMANTE'}</Text>
                                        <Text style={styles.firmaUnidad}>Departamento de Finanzas</Text>
                                    </View>
                                )}

                                {/* Verificación de rol para mostrar firmas adicionales */}
                                {objeto?.Roles && objeto.Roles[0]?.codigoEstablecimiento === 1 ? (
                                    <>
                                        {/* Firma Abastecimiento */}
                                        {Unidad === 3 && (
                                            <View style={styles.firmaBox}>
                                                {AltaInventario.visadoAbastecimiento ? (
                                                    <Image src={AltaInventario.visadoAbastecimiento} style={styles.firmaImagen} />
                                                ) : (
                                                    <Text style={styles.firmaMensaje}>Falta Visar Documento</Text>
                                                )}
                                                <Text style={styles.firmaLinea}>_______________________</Text>
                                                <Text style={styles.firmaNombre}>{AltaInventario.firmanteAbastecimiento || 'NOMBRE FIRMANTE'}</Text>
                                                <Text style={styles.firmaUnidad}>{UnidadNombre}</Text>
                                            </View>
                                        )}
                                        {/* Firma Informatica */}
                                        {Unidad === 4 && (
                                            <View style={styles.firmaBox}>
                                                {AltaInventario.visadoInformatica ? (
                                                    <Image src={AltaInventario.visadoInformatica} style={styles.firmaImagen} />
                                                ) : (
                                                    <Text style={styles.firmaMensaje}>Falta Visar Documento</Text>
                                                )}
                                                <Text style={styles.firmaLinea}>_______________________</Text>
                                                <Text style={styles.firmaNombre}>{AltaInventario.firmanteInformatica || 'NOMBRE FIRMANTE'}</Text>
                                                <Text style={styles.firmaUnidad}>{UnidadNombre}</Text>
                                            </View>
                                        )}
                                        {/* Firma Compra */}
                                        {Unidad === 5 && (
                                            <View style={styles.firmaBox}>
                                                {AltaInventario.visadoCompra ? (
                                                    <Image src={AltaInventario.visadoCompra} style={styles.firmaImagen} />
                                                ) : (
                                                    <Text style={styles.firmaMensaje}>Falta Visar Documento</Text>
                                                )}
                                                <Text style={styles.firmaLinea}>_______________________</Text>
                                                <Text style={styles.firmaNombre}>{AltaInventario.firmanteCompra || 'NOMBRE FIRMANTE'}</Text>
                                                <Text style={styles.firmaUnidad}>{UnidadNombre}</Text>
                                            </View>
                                        )}
                                        {/* Firma Convenio */}
                                        {Unidad === 6 && (
                                            <View style={styles.firmaBox}>
                                                {AltaInventario.visadoConvenio ? (
                                                    <Image src={AltaInventario.visadoConvenio} style={styles.firmaImagen} />
                                                ) : (
                                                    <Text style={styles.firmaMensaje}>Falta Visar Documento</Text>
                                                )}
                                                <Text style={styles.firmaLinea}>_______________________</Text>
                                                <Text style={styles.firmaNombre}>{AltaInventario.firmanteConvenio || 'NOMBRE FIRMANTE'}</Text>
                                                <Text style={styles.firmaUnidad}>{UnidadNombre}</Text>
                                            </View>
                                        )}
                                        {/* Firma Recursos Fisicos */}
                                        {Unidad === 7 && (
                                            <View style={styles.firmaBox}>
                                                {AltaInventario.visadoRFisico ? (
                                                    <Image src={AltaInventario.visadoRFisico} style={styles.firmaImagen} />
                                                ) : (
                                                    <Text style={styles.firmaMensaje}>Falta Visar Documento</Text>
                                                )}
                                                <Text style={styles.firmaLinea}>_______________________</Text>
                                                <Text style={styles.firmaNombre}>{AltaInventario.firmanteRFisico || 'NOMBRE FIRMANTE'}</Text>
                                                <Text style={styles.firmaUnidad}>{UnidadNombre}</Text>
                                            </View>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {/* Firma Unidad Abastecimiento - caso general */}
                                        {AltaInventario.chkAbastecimiento && (
                                            <View style={styles.firmaBox}>
                                                {AltaInventario.visadoAbastecimiento ? (
                                                    <Image src={AltaInventario.visadoAbastecimiento} style={styles.firmaImagen} />
                                                ) : (
                                                    <Text style={styles.firmaMensaje}>Falta Visar Documento</Text>
                                                )}
                                                <Text style={styles.firmaLinea}>_______________________</Text>
                                                <Text style={styles.firmaNombre}>{AltaInventario.firmanteAbastecimiento || 'NOMBRE FIRMANTE'}</Text>
                                                <Text style={styles.firmaUnidad}>Unidad de Abastecimiento</Text>
                                            </View>
                                        )}
                                    </>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Pie de página */}
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
            ))}
        </Document>
    );
};

export default DocumentoPDF;