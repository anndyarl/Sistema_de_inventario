import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import ssmso_logo from "../../../assets/img/SSMSO-LOGO.png";
import { ActijosFijos, FormulariosCombinados } from "./DatosInventario";

const FONT_SIZES = {
    xs: 5.5,
    sm: 6.5,
    md: 7.5,
    base: 8,
    lg: 9,
    xl: 10,
    xxl: 13,
};
const COLORS = {
    primary: "#004485",
    primaryLight: "#e8f0f8",
    white: "#ffffff",
    black: "#000000",
    grayDark: "#333333",
    grayMedium: "#666666",
    grayLight: "#e0e0e0",
    grayLighter: "#f5f7fa",
    border: "#cccccc",
};

/* ======================= ESTILOS ======================= */
const styles = StyleSheet.create({
    /* ===== PAGE ===== */
    page: {
        padding: 30,
        paddingBottom: 60,
        fontSize: 9,
        color: "#333",
    },

    /* ===== HEADER / LOGO ===== */
    containerHeader: {
        marginBottom: 14,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },

    /* ----- Cabecera con logo ----- */
    logoSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
        paddingBottom: 10,
        // borderBottomWidth: 2,
        // borderBottomColor: COLORS.primary,
    },
    logo: {
        width: 70,
        marginRight: 12,
    },
    orgInfo: {
        flexDirection: "column",
        gap: 1,
    },
    orgName: {
        fontSize: FONT_SIZES.lg,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 2,
    },
    orgDetail: {
        fontSize: FONT_SIZES.md,
        color: COLORS.grayMedium,
        marginBottom: 1,
    },

    /* ----- Titulo del documento ----- */
    tituloDocumento: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: "bold",
        textAlign: "center",
        // color: COLORS.primary,
        marginBottom: 12,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grayLight,
    },


    /* ===== GRID INFORMACIÓN ===== */
    headerGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    column: {
        width: "32%",
    },

    label: {
        fontSize: 7,
        // fontWeight: "bold",
        color: "#000",
        margin: 2,
    },

    value: {
        fontSize: 7,
        color: "#555",
        marginBottom: 5,
    },

    /* ===== TABLE (NO TOCAR) ===== */
    table: {
        flexDirection: "column",
        marginTop: 12,
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

    colCodigo: { width: "10%" },
    colEspecie: { width: "10%", fontSize: 5 },
    colVidaUtil: { width: "5%", fontSize: 5 },
    colMarca: { width: "10%", fontSize: 5 },
    colModelo: { width: "10%", fontSize: 5 },
    colSerie: { width: "15%" },
    colPrecio: { width: "10%" },
    colServicio: { width: "10%" },
    colCuenta: { width: "10%" },

    /* ===== FOOTER ===== */
    footer: {
        position: 'absolute',
        bottom: 3,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 6,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 4,
    },
    footerLeft: {
        textAlign: "left",
        color: "#666",
    },
    footerRight: {
        textAlign: "right",
        color: "#666",
    },
});

/* ======================= FECHA ACTUAL ======================= */
const fechaHoy = new Date()
    .toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
    .replace(/-/g, "/");

/* ======================= SALTOS EN SERIE ======================= */
function insertNewLinesDigits(value: any, every = 10) {
    if (!value) return "";
    const s = String(value);
    return s
        .split("\n")
        .map((line) =>
            line.replace(new RegExp(`(.{${every}})`, "g"), "$1\n")
        )
        .join("\n");
}

const DocumentoPDFResumen = ({ row, formulariosCombinados, }: { row: ActijosFijos[]; formulariosCombinados: FormulariosCombinados; }) => {

    return (
        <Document>
            <Page style={styles.page} wrap>
                {/* ===== CABECERA CON LOGO ===== */}
                <View style={styles.logoSection}>
                    <Image src={ssmso_logo} style={styles.logo} />
                    <View style={styles.orgInfo}>
                        <Text style={styles.orgName}>
                            Servicio de Salud Metropolitano Sur Oriente
                        </Text>
                        <Text style={styles.orgDetail}>
                            Subdireccion Administrativa
                        </Text>
                        <Text style={styles.orgDetail}>
                            Departamento de Finanzas
                        </Text>
                        <Text style={styles.orgDetail}>Unidad de Inventarios</Text>
                    </View>
                </View>

                <Text style={styles.tituloDocumento}>Registro de Activos Fijos</Text>

                {/* ===== GRID DATOS ===== */}
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

                        <Text style={styles.label}>Monto Recepción:</Text>
                        <Text style={styles.value}>
                            $ {formulariosCombinados.montoRecepcionR?.toLocaleString("es-CL")}
                        </Text>
                    </View>

                    {/* Columna derecha */}
                    <View style={styles.column}>
                        <Text style={styles.label}>Proveedor:</Text>
                        <Text style={styles.value}>{formulariosCombinados.rutProveedorR}</Text>

                        <Text style={styles.label}>Modalidad Compra:</Text>
                        <Text style={styles.value}>{formulariosCombinados.modalidadDeCompraR}</Text>
                    </View>
                </View>

                {/* ===== TABLA ===== */}
                < View style={styles.table} >
                    <View style={styles.tableHeader} fixed>
                        <Text style={[styles.tableCell, styles.colCodigo]}>Nº Inventario</Text>
                        <Text style={[styles.tableCell, styles.colEspecie]}>Especie</Text>
                        <Text style={[styles.tableCell, styles.colVidaUtil]}>Vida Útil</Text>
                        <Text style={[styles.tableCell, styles.colMarca]}>Marca</Text>
                        <Text style={[styles.tableCell, styles.colModelo]}>Modelo</Text>
                        <Text style={[styles.tableCell, styles.colPrecio]}>Precio</Text>
                        <Text style={[styles.tableCell, styles.colSerie]}>Serie</Text>
                        <Text style={[styles.tableCell, styles.colServicio]}>Dependencia</Text>
                        <Text style={[styles.tableCell, styles.colCuenta]}>Cuenta</Text>
                    </View>

                    {
                        row.map((lista, idx) => (
                            <View style={styles.tableRow} key={idx}>
                                <Text style={[styles.tableCell, styles.colCodigo]}>{lista.id}</Text>
                                <Text style={[styles.tableCell, styles.colEspecie]}>{insertNewLinesDigits(lista.especie, 9)}</Text>
                                <Text style={[styles.tableCell, styles.colVidaUtil]}>{lista.vidaUtil}</Text>
                                <Text style={[styles.tableCell, styles.colMarca]}>{insertNewLinesDigits(lista.marca, 9)}</Text>
                                <Text style={[styles.tableCell, styles.colModelo]}>{insertNewLinesDigits(lista.modelo, 9)}</Text>
                                <Text style={[styles.tableCell, styles.colPrecio]}>
                                    {parseFloat(lista.precio).toLocaleString("es-ES", {
                                        minimumFractionDigits: 0,
                                    })}
                                </Text>
                                <Text style={[styles.tableCell, styles.colSerie]}>
                                    {insertNewLinesDigits(lista.serie, 9)}
                                </Text>
                                <Text style={[styles.tableCell, styles.colServicio]}>{insertNewLinesDigits(lista.dependencia, 9)}</Text>
                                <Text style={[styles.tableCell, styles.colCuenta]}>{lista.cuenta}</Text>
                            </View>
                        ))
                    }
                </View>

                {/* ===== FOOTER ===== */}
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

        </Document >
    );
};

export default DocumentoPDFResumen;
