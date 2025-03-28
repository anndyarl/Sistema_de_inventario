import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import ssmso_logo from "../../../../assets/img/SSMSO-LOGO.png";
import { Container } from "react-bootstrap";
import { ListaInvenarioEspecies } from "./ConsultaInventarioEspecies";

const styles = StyleSheet.create({
    page: { padding: 20, fontSize: 12 },
    logo: {
        width: 100, // Ajusta el tamaño del logo
        height: 'auto',
    },
    containerHeader: {
        marginBottom: 20,
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    p: {
        fontSize: 8,
        marginBottom: 2,
        fontWeight: 'semibold',
        textAlign: 'center',
    },
    textContainer: {
        marginLeft: 5
    },
    header: { fontSize: 16, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
    table: { display: "flex", flexDirection: "column", border: "1px solid black", marginBottom: 20 },
    tableRow: { flexDirection: "row" },
    tableCellHeader: { fontWeight: "bold", padding: 5, border: "1px solid black", flex: 1 },
    tableCell: { padding: 5, borderBottom: "1px solid black", borderRight: "1px solid black", flex: 1 },
    tableCellNoBorder: { padding: 5, borderRight: "1px solid black", flex: 1 },
    line: {
        border: "1px",
        width: "100%"
    },
    printLabel: {
        display: 'flex',
        justifyContent: 'flex-start'
    }
});
const fecha = Date.now();
const fechaHoy = new Date(fecha);
const DocumentoPDF = ({ row }: { row: ListaInvenarioEspecies }) => (
    <Document>
        <Page style={styles.page}>
            {/* Logo y Encabezado */}
            <Container style={styles.containerHeader}>
                <View style={styles.headerContainer}>
                    <Image src={ssmso_logo} style={styles.logo} />
                    {/* Textos a la derecha */}
                    <View style={styles.textContainer}>
                        <Text style={styles.p}>Servicio de Salud Metropolitano Sur Oriente</Text>
                        <Text style={styles.p}>Subdirección Administrativa</Text>
                        <Text style={styles.p}>Departamento de Finanzas</Text>
                        <Text style={styles.p}>Unidad de Inventarios</Text>
                    </View>
                </View>
            </Container>
            {/* Título */}
            <Text style={styles.header}>CONSULTA Nº INVENTARIO PARA ESPECIE</Text>
            {/* Tabla con valores fijos */}
            <View style={styles.table}>
                <View style={styles.tableRow}><Text style={styles.tableCellNoBorder}>Cuenta</Text><Text style={styles.tableCellNoBorder}>{row.ctA_COD}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCellNoBorder}>Nº Inventario</Text><Text style={styles.tableCellNoBorder}>{row.aF_CODIGO_GENERICO}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCell}>Traspaso</Text><Text style={styles.tableCell}>{row.traS_CORR}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCellNoBorder}>Especie</Text><Text style={styles.tableCellNoBorder}>{row.especie}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCellNoBorder}>Marca</Text><Text style={styles.tableCellNoBorder}>{row.deT_MARCA}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCellNoBorder}>Modelo</Text><Text style={styles.tableCellNoBorder}>{row.deT_MODELO}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCellNoBorder}>Serie</Text><Text style={styles.tableCellNoBorder}>{row.deT_SERIE}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCell}>Obs</Text><Text style={styles.tableCell}>{row.deT_OBS}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCellNoBorder}>Rut Proveedor</Text><Text style={styles.tableCellNoBorder}>{row.proV_RUN}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCell}>Nombre Proveedor</Text><Text style={styles.tableCell}>{row.proV_NOMBRE}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCellNoBorder}>Servicio Actual</Text><Text style={styles.tableCellNoBorder}>{row.servicio}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCell}>Dependencia Actual</Text><Text style={styles.tableCell}>{row.dependencia}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCellNoBorder}>Fecha Recepción</Text><Text style={styles.tableCellNoBorder}>{row.fecha}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCellNoBorder}>Años Vida Útil</Text><Text style={styles.tableCellNoBorder}>{row.vida} de 15 años</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCellNoBorder}>Nº Recepción</Text><Text style={styles.tableCellNoBorder}>{row.aF_RESOLUCION}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCellNoBorder}>Origen</Text><Text style={styles.tableCellNoBorder}>{row.aF_TIPO}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCellNoBorder}>Nº Alta</Text><Text style={styles.tableCellNoBorder}>{row.altaS_CORR}</Text></View>
                <View style={styles.tableRow}><Text style={styles.tableCellNoBorder}>Valor</Text><Text style={styles.tableCellNoBorder}>$ {(row.valor ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text></View>
            </View>

            <Text style={styles.printLabel}>UNIDAD DE INVENTARIO</Text>
            <Text style={styles.line}></Text>
            <Text style={styles.printLabel}>Impreso el {fechaHoy.toLocaleString('es-CL', { hour12: false })}</Text>
        </Page>
    </Document>
);

export default DocumentoPDF;
