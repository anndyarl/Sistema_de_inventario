import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ListaRemates } from './BienesRematados';
import ssmso_logo from "../../../assets/img/SSMSO-LOGO.png"

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
const styles = StyleSheet.create({
    /* ----- Pagina ----- */
    page: {
        padding: 30,
        paddingBottom: 50,
        fontSize: FONT_SIZES.base,
        color: COLORS.grayDark,
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

    /* ----- Seccion de datos del traspaso ----- */
    datosSection: {
        marginBottom: 12,
        // padding: 10,
        // backgroundColor: COLORS.grayLighter,
        // borderRadius: 4,
        // borderWidth: 1,
        // borderColor: COLORS.black,
    },
    datosGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    datosColumnaIzquierda: {
        width: "70%",
    },
    datosColumnaDerecha: {
        width: "30%",
    },
    datosFilaCompleta: {
        width: "100%",
        marginTop: 4,
    },
    datoNumero: {
        fontSize: FONT_SIZES.xl,
        fontWeight: "bold",
        color: COLORS.black,
        marginBottom: 6,
    },
    datoLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: "bold",
        color: COLORS.grayDark,
        marginBottom: 1,
    },
    datoValor: {
        fontSize: FONT_SIZES.md,
        color: COLORS.grayMedium,
        marginBottom: 4,
    },
    datoInline: {
        flexDirection: "row",
    },
    /* ----- Observacion ----- */
    observacionSection: {
        marginTop: 4,
        marginBottom: 4,
    },
    observacionLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: "bold",
        color: COLORS.grayDark,
    },
    observacionValor: {
        fontSize: FONT_SIZES.md,
        color: COLORS.grayMedium,
    },
    table: {
        display: 'flex',
        flexDirection: 'column',

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
    colRemate: { width: "10%" },
    colCertificado: { width: "10%", fontSize: 5 },
    colInventario: { width: "5%", fontSize: 5 },
    colEspecie: { width: "10%", fontSize: 5 },
    colFechaIngreso: { width: "10%", fontSize: 5 },
    colObservaciones: { width: "10%", fontSize: 5 },
    colCuenta: { width: "10%" },

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
        bottom: 20,
        left: 20,
        right: 20,
        borderTop: '1px black solid'
    },
    fechaHoy: {
        padding: 2,
    },
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

const DocumentoRematesPDF = ({ row }: { row: ListaRemates[]; }) => {

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
                <Text style={styles.tituloDocumento}>Acta de Bienes Rematados</Text>
                {/* ===== DATOS DEL REMATE ===== */}
                <View style={styles.datosSection} fixed>
                    <View style={styles.datosGrid}>
                        <View style={styles.datosColumnaIzquierda}>
                            <Text style={styles.datoInline}>
                                Cantidad {row.length}
                            </Text>
                        </View>
                        {/* <View style={styles.datosColumnaIzquierda}>
                            <Text style={styles.datoNumero}>
                                Remate Nº {row[0].boD_CORR}
                            </Text>
                        </View>
                        <View style={styles.datosColumnaDerecha}>
                            <View style={styles.datoInline}>
                                <Text style={styles.datoLabel}>Fecha Ingreso: </Text>
                                <Text style={styles.datoValor}>
                                    {row[0].fechA_INGRESO}
                                </Text>
                            </View>
                        </View> */}
                    </View>
                </View>

                {/* Observacion */}
                {/* <View style={styles.observacionSection}>
                    <Text style={styles.observacionLabel}>
                        Observacion:{" "}
                        <Text style={styles.observacionValor}>
                            {row[0].observaciones == "" ? "Sin observaciones" : row[0].observaciones}
                        </Text>
                    </Text>
                </View> */}
                {/* Tabla */}
                <View style={styles.table} >
                    {/* Cabecera de la tabla */}
                    <View style={styles.tableHeader} fixed>
                        <Text style={[styles.tableCell, styles.colRemate]}>N° Remate</Text>
                        <Text style={[styles.tableCell, styles.colInventario]}>N° Inventario</Text>
                        <Text style={[styles.tableCell, styles.colCertificado]}>N° Certificado</Text>
                        <Text style={[styles.tableCell, styles.colEspecie]}>Especie</Text>
                        <Text style={[styles.tableCell, styles.colFechaIngreso]}>Fecha Ingreso</Text>
                        <Text style={[styles.tableCell, styles.colObservaciones]}>Observaciones</Text>
                        <Text style={[styles.tableCell, styles.colCuenta]}>Nº Cuenta</Text>
                    </View>
                    {row.map((lista, idx) => (
                        <View style={styles.tableRow} key={idx}>
                            <Text style={[styles.tableCell, styles.colRemate]}>{lista.boD_CORR}</Text>
                            <Text style={[styles.tableCell, styles.colInventario]}>{lista.aF_CODIGO_GENERICO}</Text>
                            <Text style={[styles.tableCell, styles.colCertificado]}>{lista.nresolucion}</Text>
                            <Text style={[styles.tableCell, styles.colEspecie]}>{lista.especie}</Text>
                            <Text style={[styles.tableCell, styles.colFechaIngreso]}>{lista.fechA_INGRESO}</Text>
                            <Text style={[styles.tableCell, styles.colObservaciones]}> {lista.observaciones == "" ? "Sin observaciones" : lista.observaciones}</Text>
                            <Text style={[styles.tableCell, styles.colCuenta]}>{lista.ncuenta}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.firmaContainer}>
                    <View style={styles.firmaBox}>
                        <Text>_______________________</Text>
                        <Text style={styles.firmaLabel}>Jefe de Inventario</Text>
                    </View>
                </View>

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


export default DocumentoRematesPDF;
