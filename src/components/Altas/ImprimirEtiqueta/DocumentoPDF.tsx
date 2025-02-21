import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Formatear la fecha actual en español (Chile)
const fechaHoy = new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
});

// Estilos del PDF
const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontSize: 12,
        // Puedes agregar un borde si lo deseas
        // border: '1px solid black'
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        padding: 10,
        border: 0.4,
        borderColor: '#000',
    },
    qrContainer: {
        // Contenedor para el QR, con margen derecho para separar del texto
        marginRight: 20,
    },
    qrImage: {
        width: 300,
    },
    textContainer: {
        position: 'absolute',
        left: 230,
        right: 0,
        top: 8,
        // borderBottomWidth: 0.4,
        // borderBottomColor: '#000',
        // padding: 10
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    code: {
        fontSize: 12,
        marginBottom: 3,
    },
    ubicacion: {
        fontSize: 10,
    },
    footer: {
        fontSize: 10,
        textAlign: 'center',
        color: '#555',
        marginTop: 20,
    },
});

// Componente del PDF
const DocumentoPDF = ({ Etiqueta }: { Etiqueta: any }) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.container}>
                {/* Contenedor del QR */}
                <View style={styles.qrContainer}>
                    {Etiqueta.qrImage && (
                        <Image style={styles.qrImage} src={Etiqueta.qrImage} />
                    )}
                </View>

                {/* Contenedor de los datos */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{Etiqueta.aF_DESCRIPCION}</Text>
                    <Text style={styles.code}>{Etiqueta.aF_CODIGO_LARGO}</Text>
                    <Text style={styles.ubicacion}>{Etiqueta.aF_UBICACION}</Text>
                </View>
            </View>

            {/* Footer con fecha de generación */}
            <Text style={styles.footer}>Generado el: {fechaHoy}</Text>
        </Page>
    </Document>
);

export default DocumentoPDF;
