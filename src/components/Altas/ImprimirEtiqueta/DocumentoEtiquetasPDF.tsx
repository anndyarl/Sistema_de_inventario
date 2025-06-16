import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ListaEtiquetas } from './ImprimirEtiqueta';


// Formatear la fecha actual en español (Chile)
// const fechaHoy = new Date()
//     .toLocaleDateString('es-CL', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//     })
//     .replace(/-/g, '/');
const styles = StyleSheet.create({
    page: {
        padding: 0,
        margin: 0,
        fontSize: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullPageContainer: {
        width: '100%',
        padding: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrImage: {
        width: 100, // ajusta según el tamaño real de tu etiqueta       
        marginRight: 4,
        marginBottom: 1
    },
    labelText: {
        fontSize: 12,
        flexShrink: 1,              // Permite que el texto reduzca su tamaño si es necesario
        flexGrow: 1,
        wordWrap: 'break-word',     // Fuerza el quiebre de palabra si es muy larga
        whiteSpace: 'pre-wrap',     // Respeta los saltos de línea y permite envolver
        maxWidth: '60%',            // Limita el ancho para que no desborde
    },
});

const DocumentoEtiquetasPDF = ({ row }: { row: ListaEtiquetas[] }) => (
    <Document>
        {row.map((lista, index) => (
            <Page key={index} size={{ width: 300 }} style={styles.page}>
                <View style={styles.fullPageContainer}>
                    {lista.qrImage ? (
                        <Image src={lista.qrImage} style={styles.qrImage} />
                    ) : (
                        <Text>Sin QR</Text>
                    )}
                    <Text style={styles.labelText}>
                        {`${lista.aF_UBICACION}\n\n${lista.aF_CODIGO_GENERICO}\n\n${lista.aF_DESCRIPCION}\n${lista.origen.charAt(0).toUpperCase() + lista.origen.slice(1).toLocaleLowerCase()}`}
                    </Text>
                </View>
            </Page>
        ))}
    </Document>
);


export default DocumentoEtiquetasPDF;
