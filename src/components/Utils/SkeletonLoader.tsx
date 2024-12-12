import { Table } from 'react-bootstrap'
import '../../styles/skeleton-loader.css'

const SkeletonRow = () => (
    <tr>
        {[...Array(100)].map((_, index) => (
            <td key={index}>
                <div className="skeleton-loader"></div>
            </td>
        ))}
    </tr>
)

export default function SkeletonLoader({ rowCount = 10 }) {
    return (
        <div className='skeleton-table'>
            <Table striped bordered hover>
                <tbody>
                    {[...Array(rowCount)].map((_, index) => (
                        <SkeletonRow key={index} />
                    ))}
                </tbody>
            </Table>
        </div>
    )
}