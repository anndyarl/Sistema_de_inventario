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
    header: {
        fontSize: 10,
        textAlign: 'right',
        color: '#555',
        marginTop: 5,
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        width: '50%',
        margin: 1,
        padding: 5,
        border: 0.4,
        borderColor: '#000',
    },
    qrContainer: {
        // Contenedor para el QR, con margen derecho para separar del texto
        marginRight: 20,
    },
    qrImage: {
        width: 100,
    },
    textContainer: {
        position: 'absolute',
        left: 60,
        right: 0,
        top: 8,
        // borderBottomWidth: 0.4,
        // borderBottomColor: '#000',
        // padding: 10
    },
    ubicacion: {
        fontSize: 8,
        marginBottom: 5
    },
    code: {
        fontSize: 10,
        marginBottom: 5,
    },
    title: {
        fontSize: 8,
        fontWeight: 'bold'
    },


});

// Componente del PDF
const DocumentoPDF = ({ Etiqueta }: { Etiqueta: any }) => (
    <Document>
        {/* Footer con fecha de generación */}

        <Page style={styles.page}>
            <Text style={styles.header}>{fechaHoy}</Text>
            <View style={styles.container}>
                {/* Contenedor del QR */}
                <View style={styles.qrContainer}>
                    {Etiqueta.qrImage && (
                        <Image style={styles.qrImage} src={Etiqueta.qrImage} />
                    )}
                </View>

                {/* Contenedor de los datos */}
                <View style={styles.textContainer}>
                    <Text style={styles.ubicacion}>{Etiqueta.aF_UBICACION}</Text>
                    <Text style={styles.code}>{Etiqueta.aF_CODIGO_LARGO}</Text>
                    <Text style={styles.title}>{Etiqueta.aF_DESCRIPCION}</Text>
                </View>
            </View>


        </Page>
    </Document>
);

export default DocumentoPDF;
