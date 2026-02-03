import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

import ssmso_logo from "../../../assets/img/SSMSO-LOGO.png";
import { Container } from 'react-bootstrap';
import { ActijosFijos, FormulariosCombinados } from './DatosInventario';

// Formatear la fecha actual en español (Chile)
// const fechaHoy = new Date().toLocaleDateString('es-CL', {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric',
// });

const styles = StyleSheet.create({
    /* =======================
       PAGE
    ======================= */
    page: {
        padding: 20,
        fontSize: 12,
    },

    /* =======================
       LOGO / HEADER
    ======================= */
    logoContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
    },

    logo: {
        width: 90,
    },
    header: { display: 'flex', flexDirection: 'row', },
    textContainer: { marginLeft: 5 },
    containerHeader: {
        marginBottom: 12,
        paddingBottom: 8,
    },
    title: {
        fontSize: 13,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#000",
    },
    headerGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    column: {
        width: "32%",
    },
    label: {
        fontSize: 9,
        fontWeight: "bold",
        marginBottom: 1,
    },

    value: {
        fontSize: 9,
        marginBottom: 4,
    },

    center: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 8,
    },

    p: {
        fontSize: 8,
        marginBottom: 3,
    },

    cantidad: {
        fontSize: 8,
        textAlign: "right",
        fontWeight: "bold",
    },

    /* =======================
       TABLE (NO TOCAR)
    ======================= */
    table: {
        flexDirection: "column",
    },

    tableHeader: {
        fontSize: 6,
        flexDirection: "row",
        alignItems: "center",
        fontWeight: "bold",
        backgroundColor: "rgb(0 68 133 / 80%)",
        color: "#fff",
        borderBottom: "1px solid #000",
    },

    tableRow: {
        flexDirection: "row",
        borderBottom: "1px solid #ccc",
        alignItems: "center",
    },

    tableCell: {
        padding: 3,
        fontSize: 6,
        borderRight: "1px solid #ccc",
        overflow: "hidden",
        flexGrow: 1,
    },

    /* =======================
       COLUMN WIDTHS (NO TOCAR)
    ======================= */
    colCodigo: { width: "10%" },
    colEspecie: { width: "10%", fontSize: 5 },
    colVidaUtil: { width: "5%", fontSize: 5 },
    colMarca: { width: "10%", fontSize: 5 },
    colModelo: { width: "10%", fontSize: 5 },
    colSerie: { width: "15%" },
    colPrecio: { width: "10%" },
    colServicio: { width: "10%" },
    colCuenta: { width: "10%" },

    /* =======================
       FOOTER
    ======================= */
    footer: {
        position: "absolute",
        bottom: 20,
        left: 40,
        right: 40,
        height: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 9,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        paddingTop: 4,
    },

    footerLeft: {
        textAlign: "left",
    },

    footerRight: {
        textAlign: "right",
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

const DocumentoPDFResumen = ({ row, formulariosCombinados }: { row: ActijosFijos[]; formulariosCombinados: FormulariosCombinados }) => {

    const filasPorPagina = row.length > 30 ? 30 : 25;
    const paginas = arreglo(row, filasPorPagina);
    return (
        <Document>
            {paginas.map((rows, indicePagina) => (
                <Page key={indicePagina} style={styles.page}>
                    {/* Logo */}
                    <Container style={styles.containerHeader}>
                        <View style={styles.header}>
                            {/* Logo a la izquierda */}
                            <Image src={ssmso_logo} style={styles.logo} />
                            {/* Textos a la derecha */}
                            <View style={styles.textContainer}>
                                <Text style={styles.p}>Servicio de Salud Metropolitano Sur Oriente</Text>
                                <Text style={styles.p}>Unidad de Inventarios</Text>
                            </View>
                        </View>
                    </Container>
                    {/* Encabezado */}
                    <Container style={styles.containerHeader}>
                        <Text style={styles.title}>
                            Resumen de Registro de Activos Fijos
                        </Text>

                        <View style={styles.headerGrid}>
                            {/* Columna izquierda */}
                            <View style={styles.column}>
                                <Text style={styles.label}>Nº Recepción:</Text>
                                <Text style={styles.value}>{formulariosCombinados.nRecepcionR}</Text>

                                <Text style={styles.label}>Fecha Recepción:</Text>
                                <Text style={styles.value}>{formulariosCombinados.fechaRecepcionR}</Text>

                                <Text style={styles.label}>N° Orden de Compra:</Text>
                                <Text style={styles.value}>{formulariosCombinados.nOrdenCompraR}</Text>

                                <Text style={styles.label}>Fecha Ingreso:</Text>
                                <Text style={styles.value}>{row[0]?.fechaIngreso}</Text>
                            </View>

                            {/* Columna centro */}
                            <View style={styles.column}>
                                <Text style={styles.label}>Nº Factura:</Text>
                                <Text style={styles.value}>{formulariosCombinados.nFacturaR}</Text>

                                <Text style={styles.label}>Origen Presupuesto:</Text>
                                <Text style={styles.value}>{formulariosCombinados.origenPresupuestoR}</Text>

                                <Text style={styles.label}>Monto Recepción:</Text>
                                <Text style={styles.value}>
                                    $ {formulariosCombinados.montoRecepcionR?.toLocaleString("es-ES")}
                                </Text>
                            </View>

                            {/* Columna derecha */}
                            <View style={styles.column}>
                                <Text style={styles.label}>Fecha Factura:</Text>
                                <Text style={styles.value}>{formulariosCombinados.fechaFacturaR}</Text>

                                <Text style={styles.label}>Proveedor:</Text>
                                <Text style={styles.value}>{formulariosCombinados.rutProveedorR}</Text>

                                <Text style={styles.label}>Modalidad de Compra:</Text>
                                <Text style={styles.value}>{formulariosCombinados.modalidadDeCompraR}</Text>
                            </View>
                        </View>
                    </Container>
                    {/* Tabla */}
                    <View style={styles.table}>
                        {/* Cabecera de la tabla */}
                        <View style={styles.tableHeader}>
                            {/* <Text style={styles.tableCellHeader}>Código</Text> */}
                            <Text style={[styles.tableCell, styles.colCodigo]}>Nº Inventario</Text>
                            <Text style={[styles.tableCell, styles.colEspecie]}>Especie</Text>
                            <Text style={[styles.tableCell, styles.colVidaUtil]}>Vida Útil</Text>
                            <Text style={[styles.tableCell, styles.colMarca]}>Marca</Text>
                            <Text style={[styles.tableCell, styles.colModelo]}>Modelo</Text>
                            <Text style={[styles.tableCell, styles.colPrecio]}>Precio</Text>
                            <Text style={[styles.tableCell, styles.colSerie]}>Serie</Text>
                            <Text style={[styles.tableCell, styles.colServicio]}>Servicio/Dependencia</Text>
                            <Text style={[styles.tableCell, styles.colCuenta]}>Cuenta</Text>
                        </View>
                        {/* Fila de datos */}
                        {rows.map((lista, idx) => (
                            <View style={styles.tableRow} key={idx}>
                                {/* <Text style={styles.tableCell}>{lista.aF_CLAVE}</Text> */}
                                <Text style={[styles.tableCell, styles.colCodigo]}>{lista.id}</Text>
                                <Text style={[styles.tableCell, styles.colEspecie]}>{lista.especie}</Text>
                                <Text style={[styles.tableCell, styles.colVidaUtil]}>{lista.vidaUtil}</Text>
                                <Text style={[styles.tableCell, styles.colMarca]}>{lista.marca}</Text>
                                <Text style={[styles.tableCell, styles.colModelo]}>{lista.modelo}</Text>
                                <Text style={[styles.tableCell, styles.colPrecio]}>{(lista.precio ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                                <Text style={[styles.tableCell, styles.colSerie]}>{insertNewLinesDigits(lista.serie, 10)}</Text>
                                <Text style={[styles.tableCell, styles.colServicio]}>{lista.dependencia}</Text>
                                <Text style={[styles.tableCell, styles.colCuenta]}>{lista.cuenta}</Text>
                            </View>
                        ))}
                    </View>

                    {/* <Text style={styles.printLabel}>Impreso el {fechaDescarga}</Text> */}

                    <View style={styles.footer} fixed>
                        <Text style={styles.footerLeft}>{fechaHoy}</Text>

                        <Text
                            style={styles.footerRight}
                            render={({ pageNumber, totalPages }) =>
                                `Página ${pageNumber} de ${totalPages}`
                            }
                        />
                    </View>

                </Page >
            ))}
        </Document >
    );
};

export default DocumentoPDFResumen;
