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
        flexGrow: 1,
    },
    colCodigo: { width: "13%" },
    colEspecie: { width: "13%" },
    colMarca: { width: "10%" },
    colModelo: { width: "10%" },
    colSerie: { width: "10%" },
    colObs: { width: "20%" },
    colFIngreso: { width: "12%" },
    colAlta: { width: "8%" },
    colEstado: { width: "5%" },
    colTraslado: { width: "10%" },
    colPrecio: { width: "13%" },
    colCuenta: { width: "15%" },

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
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableCell, styles.colCodigo]}>N° Inventario</Text>
                            <Text style={[styles.tableCell, styles.colEspecie]}>Especie</Text>
                            <Text style={[styles.tableCell, styles.colMarca]}>Marca</Text>
                            <Text style={[styles.tableCell, styles.colModelo]}>Modelo</Text>
                            <Text style={[styles.tableCell, styles.colSerie]}>Serie</Text>
                            <Text style={[styles.tableCell, styles.colObs]}>Observación</Text>
                            <Text style={[styles.tableCell, styles.colFIngreso]}>Fecha Ingreso</Text>
                            <Text style={[styles.tableCell, styles.colAlta]}>N° Alta</Text>
                            <Text style={[styles.tableCell, styles.colEstado]}>Estado</Text>
                            <Text style={[styles.tableCell, styles.colTraslado]}>N° Traslado</Text>
                            <Text style={[styles.tableCell, styles.colPrecio]}>Valor Inicial</Text>
                            <Text style={[styles.tableCell, styles.colCuenta]}>Cuenta Contable</Text>
                        </View>

                        {rows.map((lista, idx) => (
                            <View style={styles.tableRow} key={idx}>
                                <Text style={[styles.tableCell, styles.colCodigo]}>{lista.aF_CODIGO_GENERICO}</Text>
                                <Text style={[styles.tableCell, styles.colEspecie]}>{lista.aF_ESPECIE}</Text>
                                <Text style={[styles.tableCell, styles.colMarca]}>{lista.aF_MARCA}</Text>
                                <Text style={[styles.tableCell, styles.colModelo]}>{lista.aF_MODELO}</Text>
                                <Text style={[styles.tableCell, styles.colSerie]}>{lista.aF_SERIE}</Text>
                                <Text style={[styles.tableCell, styles.colObs]}>{lista.aF_OBS}</Text>
                                <Text style={[styles.tableCell, styles.colFIngreso]}>{lista.aF_FINGRESO}</Text>
                                <Text style={[styles.tableCell, styles.colAlta]}>{lista.altaS_CORR}</Text>
                                <Text style={[styles.tableCell, styles.colEstado]}>{lista.traS_ESTADO_AF}</Text>
                                <Text style={[styles.tableCell, styles.colTraslado]}>{lista.ntraslado === 0 ? "" : lista.ntraslado}</Text>
                                <Text style={[styles.tableCell, styles.colPrecio]}>$ {(lista.aF_PRECIO_REF ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                                <Text style={[styles.tableCell, styles.colCuenta]}>{lista.ctA_COD}</Text>
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
