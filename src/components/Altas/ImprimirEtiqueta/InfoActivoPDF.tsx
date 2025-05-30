import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ListaEtiquetas } from './ImprimirEtiqueta';
import ssmso_logo from "../../../assets/img/LOGOrgb.png";

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 8,
        fontFamily: 'Helvetica',
    },
    logo: {
        width: 100,
        height: 'auto',
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    titleCentered: {
        textAlign: 'center',
        fontSize: 10,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    subTitle: {
        textAlign: 'left',
        fontSize: 8,
        fontWeight: 'bold',
        borderTop: "1px black solid",
        marginBottom: 5,
        marginTop: 5,
        padding: 2
    },
    section: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    column: {
        width: '48%',
    },
    label: {
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: 2,
        width: '100%',           // Ocupa todo el ancho disponible
        textAlign: 'justify',    // Justifica el texto para que se distribuya
        overflow: 'hidden',      // Evita desbordamiento
        whiteSpace: 'normal',    // Permite que el texto haga salto de línea si es necesario
        wordWrap: 'break-word',  // Corta palabras si son muy largas
    },
    value: {
        border: '1pt solid #000',
        padding: 4,
        minHeight: 18,
    }
});

const InfoActivoPDF = ({ row }: { row: ListaEtiquetas[] }) => (
    <Document>
        <Page style={styles.page}>
            {/* Encabezado con logo */}
            <View style={styles.header}>
                <Image src={ssmso_logo} style={styles.logo} />
            </View>

            {row.map((item, idx) => (
                <View key={idx} style={styles.section}>
                    <Text style={styles.titleCentered}>Información Activo</Text>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Código Artículo</Text>
                            <Text style={styles.value}>{item.aF_CODIGO_GENERICO}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Correlativo Interno</Text>
                            <Text style={styles.value}>{item.aF_CLAVE || '-'}</Text>
                        </View>
                    </View>
                    <Text style={styles.subTitle}>1.- Recepción</Text>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Nº Recepción</Text>
                            <Text style={styles.value}>{item.nrecepcion}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Fecha Recepción</Text>
                            <Text style={styles.value}>{item.fechA_RECEPCION}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Orden de Compra</Text>
                            <Text style={styles.value}>{item.n_ORDEN_COMPRA}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Origen</Text>
                            <Text style={styles.value}>{item.origen}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Número Factura</Text>
                            <Text style={styles.value}>{item.n_FACTURA}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Fecha Factura</Text>
                            <Text style={styles.value}>{item.fechA_FACTURA || '-'}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Rut Proveedor</Text>
                            <Text style={styles.value}>{item.proV_RUN}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Proveedor</Text>
                            <Text style={styles.value}>{item.proV_NOMBRE || '-'}</Text>
                        </View>
                    </View>
                    <Text style={styles.subTitle}>2.- Inventario</Text>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Fecha Inventario</Text>
                            <Text style={styles.value}>{item.fechA_FACTURA}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>id Agrupación</Text>
                            <Text style={styles.value}>{item.iD_GRUPO || '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Nº Alta</Text>
                            <Text style={styles.value}>{item.altaS_CORR || '-'}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Fecha Alta</Text>
                            <Text style={styles.value}>{item.aF_FECHA_ALTA}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Servicio-Dependencia</Text>
                            <Text style={styles.value}>{item.aF_UBICACION || '-'}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Especie</Text>
                            <Text style={styles.value}>{item.aF_DESCRIPCION || '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Marca</Text>
                            <Text style={styles.value}>{item.deT_MARCA || '-'}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Modelo</Text>
                            <Text style={styles.value}>{item.deT_MODELO || '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Serie</Text>
                            <Text style={styles.value}>{item.deT_SERIE || '-'}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Observación</Text>
                            <Text style={styles.value}>{item.deT_OBS || '-'}</Text>
                        </View>
                    </View>
                    <Text style={styles.subTitle}>3.- Contabilidad</Text>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Valor Ingreso</Text>
                            <Text style={styles.value}>{item.valoR_INGRESO || '-'}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Valor Útil</Text>
                            <Text style={styles.value}>{item.aF_VIDAUTIL || '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Cuenta Activo</Text>
                            <Text style={styles.value}>{item.aF_NCUENTA + " " + item.ctA_NOMBRE || '-'}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Depreciación</Text>
                            <Text style={styles.value}>{item.aF_FECHA_ALTA || '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Cta. Depreciación</Text>
                            <Text style={styles.value}>{0 || '-'}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Deterioro</Text>
                            <Text style={styles.value}>{0 || '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Cta. Deterioro</Text>
                            <Text style={styles.value}>{0 || '-'}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Valor Libro</Text>
                            <Text style={styles.value}>{0 || '-'}</Text>
                        </View>
                    </View>
                    <Text style={styles.subTitle}></Text>
                </View>
            ))}
        </Page>
    </Document>
);

export default InfoActivoPDF;
