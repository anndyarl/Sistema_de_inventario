import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ssmso_logo from "../../../../assets/img/SSMSO-LOGO.png"
import ago from "../../../../assets/img/logo_red.jpg"
import { Container } from 'react-bootstrap';
import { ListaFolioServicioDependencia } from './FolioPorServicioDependencia';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
    },
    logo: {
        width: 80, // Ajusta el tamaño del logo
        height: 'auto',
        textAlign: 'left',
    },
    logo_red: {
        width: 70,
        height: 25,                // opcional: controla el alto para mejor proporción
        marginBottom: 2,           // separa un poco del texto
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
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
    titleRed: {
        fontSize: 6,
        fontWeight: 900,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        paddingTop: 3,
        borderTop: '1px black solid',
        textAlign: 'center'
    },
    p: {
        fontSize: 10,
        marginBottom: 5,
        fontWeight: 'semibold',
        textAlign: 'left',
    },
    table: {
        display: 'flex',
        flexDirection: 'column',

    },
    tableHeader: {
        fontSize: 7,
        flexDirection: "row",

    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1px solid #ccc",
    },
    tableCellHeader: {
        padding: 2,
        fontSize: 7,
        fontWeight: 'bold',
        backgroundColor: 'rgb(0 68 133 / 80%)',
        color: '#fff',
        borderBottom: "1px solid #000"

    },
    tableCell: {
        padding: 2,
        fontSize: 7,
        fontWeight: "bold",
        borderRight: "1px solid #ccc",
        backgroundColor: '#f1f1f1ff',
        overflow: "hidden",
        flexGrow: 1,
    },
    colInventario: { width: "13%" },
    colInventarioGris: { width: "13%", backgroundColor: '#c7c7c7ff' },
    colEspecie: { width: "13%" },
    colMarca: { width: "10%" },
    colModelo: { width: "10%" },
    colSerie: { width: "12%" },
    colObs: { width: "18%" },
    colFIngreso: { width: "14%" },
    colAlta: { width: "8%" },
    colEstado: { width: "7%" },
    colTraslado: { width: "8%" },
    colPrecio: { width: "12%" },
    colCuenta: { width: "9%" },

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
    footer: {
        position: 'absolute',
        bottom: 20,          // distancia del borde inferior
        left: 40,
        right: 40,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',  // separa fecha y numeración
        alignItems: 'center',
        fontSize: 9,
        color: '#000',
        borderTopWidth: 1,                // línea separadora superior
        borderTopColor: '#ccc',
        paddingTop: 4,
    },
    footerLeft: {
        textAlign: 'left',
    },
    footerRight: {
        textAlign: 'right',
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



const DocumentoPDFServicioDependencia = ({ row, Firma }: { row: ListaFolioServicioDependencia[]; Firma: any }) => {
    const filasPorPagina = 10;
    const paginas = arreglo(row, filasPorPagina);

    return (
        <Document>
            {paginas.map((rows, indicePagina) => (
                <Page key={indicePagina} style={styles.page}>
                    {/* Encabezado */}
                    <Container style={styles.containerHeader}>
                        <View style={styles.headerRow}>
                            <View style={styles.centerText}>
                                <Image src={ssmso_logo} style={styles.logo} />
                            </View>

                            <View style={styles.centerText}>
                                <Text style={styles.title}>SISTEMA DE ACTIVO FIJO</Text>
                                <Text style={styles.title}>UNIDAD DE INVENTARIO</Text>
                            </View>
                            <View style={styles.centerText}>
                                <Image src={ago} style={styles.logo_red} />
                                <Text style={styles.titleRed}>RED PUBLICA</Text>
                                <Text style={styles.titleRed}>SALUD SUR ORIENTE</Text>
                            </View>

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
                        <View style={styles.headerContent}>
                            <Text style={styles.p}>Cantidad: {row.length}</Text>
                        </View>
                    </Container>
                    {/* Tabla */}
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableCellHeader, styles.colInventario]}>N° Inventario</Text>
                            <Text style={[styles.tableCellHeader, styles.colEspecie]}>Especie</Text>
                            <Text style={[styles.tableCellHeader, styles.colMarca]}>Marca</Text>
                            <Text style={[styles.tableCellHeader, styles.colModelo]}>Modelo</Text>
                            <Text style={[styles.tableCellHeader, styles.colSerie]}>Serie</Text>
                            <Text style={[styles.tableCellHeader, styles.colObs]}>Observación</Text>
                            <Text style={[styles.tableCellHeader, styles.colFIngreso]}>Fecha Ingreso</Text>
                            <Text style={[styles.tableCellHeader, styles.colAlta]}>N° Alta</Text>
                            <Text style={[styles.tableCellHeader, styles.colEstado]}>Estado</Text>
                            <Text style={[styles.tableCellHeader, styles.colTraslado]}>N° Traslado</Text>
                            <Text style={[styles.tableCellHeader, styles.colPrecio]}>Valor Inicial</Text>
                            <Text style={[styles.tableCellHeader, styles.colCuenta]}>Cuenta Contable</Text>
                        </View>

                        {rows.map((lista, idx) => (
                            <View style={styles.tableRow} key={idx}>
                                <Text style={[styles.tableCell, styles.colInventarioGris]}>{lista.aF_CODIGO_GENERICO}</Text>
                                <Text style={[styles.tableCell, styles.colEspecie]}>{lista.aF_ESPECIE}</Text>
                                <Text style={[styles.tableCell, styles.colMarca]}>{lista.aF_MARCA}</Text>
                                <Text style={[styles.tableCell, styles.colModelo]}>{lista.aF_MODELO}</Text>
                                <Text style={[styles.tableCell, styles.colSerie]}>{insertNewLinesDigits(lista.aF_SERIE, 10)}</Text>
                                <Text style={[styles.tableCell, styles.colObs]}>{lista.aF_OBS}</Text>
                                <Text style={[styles.tableCell, styles.colFIngreso]}>{lista.aF_FINGRESO}</Text>
                                <Text style={[styles.tableCell, styles.colAlta]}>{lista.altaS_CORR}</Text>
                                <Text style={[styles.tableCell, styles.colEstado]}>{lista.traS_ESTADO_AF}</Text>
                                <Text style={[styles.tableCell, styles.colTraslado]}>{lista.ntraslado === 0 ? "" : lista.ntraslado}</Text>
                                <Text style={[styles.tableCell, styles.colPrecio]}>$ {(lista.aF_PRECIO ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                                <Text style={[styles.tableCell, styles.colCuenta]}>{lista.ctA_COD}</Text>
                            </View>
                        ))}
                    </View>
                    {indicePagina === paginas.length - 1 && (
                        <>
                            <View style={styles.firmaContainer}>
                                <View style={styles.firmaBox}>
                                    <Text style={styles.firmaBox}>{Firma.encargadoInventario}</Text>
                                    <Text>_______________________</Text>
                                    <Text style={styles.firmaLabel}>Encargado</Text>
                                </View>
                                <View style={styles.firmaBox}>
                                    <Text style={styles.firmaBox}>{Firma.jefe}</Text>
                                    <Text>_______________________</Text>
                                    <Text style={styles.firmaLabel}>Jefe</Text>
                                </View>
                                <View style={styles.firmaBox}>
                                    <Text style={styles.firmaBox}>{Firma.jefeInventario}</Text>
                                    <Text>_______________________</Text>
                                    <Text style={styles.firmaLabel}>Jefe de Inventario</Text>
                                </View>
                            </View>

                        </>
                    )}
                    {/* Pie de página para otras páginas */}
                    {/* Footer fijo en todas las páginas */}
                    <View style={styles.footer} fixed>
                        <Text style={styles.footerLeft}>{fechaHoy}</Text>

                        <Text
                            style={styles.footerRight}
                            render={({ pageNumber, totalPages }) =>
                                `Página ${pageNumber} de ${totalPages}`
                            }
                        />
                    </View>

                </Page>
            ))}
        </Document>
    );
};


export default DocumentoPDFServicioDependencia;
