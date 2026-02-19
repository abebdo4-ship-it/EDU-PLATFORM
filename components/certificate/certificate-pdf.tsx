import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    border: {
        border: '5px solid #4F46E5', // Indigo-600
        padding: 20,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#1F2937', // Gray-800
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 40,
        color: '#4B5563', // Gray-600
    },
    name: {
        fontSize: 24,
        marginBottom: 10,
        fontWeight: 'extrabold',
        color: '#111827', // Gray-900
        textDecoration: 'underline',
    },
    course: {
        fontSize: 20,
        marginBottom: 40,
        fontWeight: 'bold',
        color: '#4F46E5', // Indigo-600
    },
    date: {
        fontSize: 12,
        marginBottom: 10,
        color: '#6B7280', // Gray-500
    },
    code: {
        fontSize: 10,
        color: '#9CA3AF', // Gray-400
        marginTop: 20,
    },
    signature: {
        marginTop: 50,
        borderTop: '1px solid #000',
        width: 200,
        textAlign: 'center',
        paddingTop: 5,
        fontSize: 12,
    }
});

interface CertificatePDFProps {
    studentName: string;
    courseName: string;
    date: string;
    uniqueCode: string;
    instructorName: string;
}

export const CertificatePDF = ({
    studentName,
    courseName,
    date,
    uniqueCode,
    instructorName
}: CertificatePDFProps) => (
    <Document>
        <Page size="A4" style={styles.page} orientation="landscape">
            <View style={styles.border}>
                <Text style={styles.title}>CERTIFICATE OF COMPLETION</Text>
                <Text style={styles.subtitle}>This is to certify that</Text>

                <Text style={styles.name}>{studentName}</Text>

                <Text style={styles.subtitle}>has successfully completed the course</Text>

                <Text style={styles.course}>{courseName}</Text>

                <Text style={styles.date}>Date: {date}</Text>

                <View style={styles.signature}>
                    <Text>{instructorName}</Text>
                    <Text>Instructor</Text>
                </View>

                <Text style={styles.code}>Verification ID: {uniqueCode}</Text>
                <Text style={styles.code}>Verify at: https://antigravity.edu/certificates/verify/{uniqueCode}</Text>
            </View>
        </Page>
    </Document>
);
