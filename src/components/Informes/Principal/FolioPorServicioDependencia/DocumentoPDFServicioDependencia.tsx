import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ssmso_logo from "../../../../assets/img/SSMSO-LOGO.png"
import ago from "../../../../assets/img/ago.jpg"
import { Container } from 'react-bootstrap';
import { ListaFolioServicioDependencia } from './FolioPorServicioDependencia';

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
        marginBottom: 10,
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
        marginBottom: 5,
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
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        paddingTop: 2,
        borderTop: '1px black solid',
        textAlign: 'center'
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
        padding: 2,
        border: '1px solid #b3b3b3',
        backgroundColor: 'rgb(0 68 133 / 80%)',
        color: '#fff',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '8%', // proporción base para columnas pequeñas
    },

    tableCellHeaderLong: {
        fontSize: 8,
        fontWeight: 'bold',
        padding: 2,
        border: '1px solid #b3b3b3',
        backgroundColor: 'rgb(0 68 133 / 80%)',
        color: '#fff',
        flexGrow: 4,
        flexShrink: 1,
        flexBasis: '20%', // más espacio base
        wordWrap: 'break-word',
        overflow: 'hidden',
        whiteSpace: 'wrap',
    },

    tableCell: {
        fontSize: 8,
        border: '1px solid #b3b3b3',
        padding: 2,
        flexGrow: 1,      // usar flexGrow en vez de flex fijo
        flexShrink: 1,
        flexBasis: '8%',  // proporción base para columnas pequeñas
        wordWrap: 'break-word',
        overflow: 'hidden',
        whiteSpace: 'wrap',
    },

    tableCellLong: {
        fontSize: 8,
        border: '1px solid #b3b3b3',
        padding: 2,
        flexGrow: 4,      // permite que esta columna crezca más que las demás
        flexShrink: 1,
        flexBasis: '20%', // punto de partida mayor
        wordWrap: 'break-word',
        overflow: 'hidden',
        whiteSpace: 'wrap',
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


const DocumentoPDFServicioDependencia = ({ row }: { row: ListaFolioServicioDependencia[]; }) => {
    const filasPorPagina = 12;
    const paginas = arreglo(row, filasPorPagina);

    return (
        <Document>
            {paginas.map((rows, indicePagina) => (
                <Page key={indicePagina} style={styles.page}>
                    {/* Encabezado */}
                    <Container style={styles.containerHeader}>
                        <View style={styles.headerRow}>
                            <Image src={ssmso_logo} style={styles.logo} />
                            <View style={styles.centerText}>
                                <Text style={styles.title}>SISTEMA DE ACTIVO FIJO</Text>
                                <Text style={styles.title}>UNIDAD DE INVENTARIO</Text>
                            </View>
                            <Image src={ago} style={styles.logo} />
                        </View>
                    </Container>

                    <Container style={styles.containerHeader}>
                        <Text style={styles.subTitle}>INVENTARIO</Text>
                        <View style={styles.headerContent}>
                            <Text style={styles.p}>Servicio: {row[0]?.servicio}</Text>
                            <Text style={styles.p}>Folio: {row[0]?.aF_FOLIO}</Text>
                        </View>
                        <View style={styles.headerContent}>
                            <Text style={styles.p}>Dependencia: {row[0]?.dependencia}</Text>
                            <Text style={styles.p}>Fecha: {fechaHoy}</Text>
                        </View>
                    </Container>

                    {/* Tabla */}
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCellHeader}>N° Inventario</Text>
                            <Text style={styles.tableCellHeader}>Especie</Text>
                            <Text style={styles.tableCellHeader}>Marca</Text>
                            <Text style={styles.tableCellHeader}>Modelo</Text>
                            <Text style={styles.tableCellHeader}>Serie</Text>
                            <Text style={styles.tableCellHeaderLong}>Observación</Text>
                            <Text style={styles.tableCellHeader}>Fecha Ingreso</Text>
                            <Text style={styles.tableCellHeader}>Nº Alta</Text>
                            <Text style={styles.tableCellHeader}>Estado</Text>
                            <Text style={styles.tableCellHeader}>Nº Traslado</Text>
                            <Text style={styles.tableCellHeader}>Valor Inicial</Text>
                            <Text style={styles.tableCellHeader}>Cuenta Contable</Text>
                        </View>
                        {rows.map((lista, idx) => (
                            <View style={styles.tableRow} key={idx}>
                                <Text style={styles.tableCell}>{lista.aF_CODIGO_GENERICO}</Text>
                                <Text style={styles.tableCell}>{lista.aF_ESPECIE}</Text>
                                <Text style={styles.tableCell}>{lista.aF_MARCA}</Text>
                                <Text style={styles.tableCell}>{lista.aF_MODELO}</Text>
                                <Text style={styles.tableCell}>{lista.aF_SERIE}</Text>
                                <Text style={styles.tableCellLong}>{lista.aF_OBS}</Text>
                                <Text style={styles.tableCell}>{lista.aF_FINGRESO}</Text>
                                <Text style={styles.tableCell}>{lista.altaS_CORR}</Text>
                                <Text style={styles.tableCell}>{lista.traS_ESTADO_AF}</Text>
                                <Text style={styles.tableCell}>{lista.ntraslado === 0 ? "" : lista.ntraslado}</Text>
                                <Text style={styles.tableCell}>$ {(lista.aF_PRECIO_REF ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                                <Text style={styles.tableCell}>{lista.ctA_COD}</Text>
                            </View>
                        ))}
                    </View>
                    {indicePagina === paginas.length - 1 && (
                        <>
                            <View style={styles.firmaContainer}>
                                <View style={styles.firmaBox}>
                                    <Text>_______________________</Text>
                                    <Text style={styles.firmaLabel}>Encargado</Text>
                                </View>
                                <View style={styles.firmaBox}>
                                    <Text>_______________________</Text>
                                    <Text style={styles.firmaLabel}>Jefe</Text>
                                </View>
                                <View style={styles.firmaBox}>
                                    <Text>_______________________</Text>
                                    <Text style={styles.firmaLabel}>Jefe de Inventario</Text>
                                </View>
                            </View>

                            <Container style={styles.containerFooter}>
                                <Text style={styles.fechaHoy}>{fechaHoy}</Text>
                                <Text>Pág {indicePagina + 1} de {paginas.length}</Text>
                            </Container>
                        </>
                    )}
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
            ))}
        </Document>
    );
};


export default DocumentoPDFServicioDependencia;
