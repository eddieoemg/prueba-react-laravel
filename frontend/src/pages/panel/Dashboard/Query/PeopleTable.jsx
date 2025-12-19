export default function PeopleTable({ data, loading, selectedId, onSelect, pagination, onPageChange }) {
    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" />
                <p className="mt-2 text-muted">Cargando...</p>
            </div>
        )
    }

    if (!data.length) {
        return (
            <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox fs-1 d-block mb-2" />
                No hay registros
            </div>
        )
    }

    const { page, lastPage, total } = pagination

    const buildPages = () => {
        const pages = []
        const delta = 2
        const start = Math.max(2, page - delta)
        const end = Math.min(lastPage - 1, page + delta)

        pages.push(
            <li key={1} className={`page-item ${page === 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(1)}>1</button>
            </li>
        )

        if (start > 2) {
            pages.push(
                <li key="e1" className="page-item disabled">
                    <span className="page-link">...</span>
                </li>
            )
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(i)}>{i}</button>
                </li>
            )
        }

        if (end < lastPage - 1) {
            pages.push(
                <li key="e2" className="page-item disabled">
                    <span className="page-link">...</span>
                </li>
            )
        }

        if (lastPage > 1) {
            pages.push(
                <li key={lastPage} className={`page-item ${page === lastPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(lastPage)}>
                        {lastPage}
                    </button>
                </li>
            )
        }

        return pages
    }

    return (
        <>
            <div className="table-responsive" style={{ maxHeight: '400px' }}>
                <table className="table table-hover table-sm mb-0">
                    <thead className="table-dark sticky-top">
                    <tr>
                        <th style={{ width: '60px' }}>#</th>
                        <th>Nombre Completo</th>
                        <th className="text-center" style={{ width: '80px' }}>Tel.</th>
                        <th className="text-center" style={{ width: '80px' }}>Dir.</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(p => (
                        <tr
                            key={p.id}
                            className={selectedId === p.id ? 'table-primary' : ''}
                            style={{ cursor: 'pointer' }}
                            onClick={() => onSelect(p)}
                        >
                            <td className="text-muted">{p.id}</td>
                            <td>
                                {p.nombre} {p.paterno} {p.materno || ''}
                            </td>
                            <td className="text-center">
                                    <span className="badge bg-info">
                                        {p.total_telefonos || 0}
                                    </span>
                            </td>
                            <td className="text-center">
                                    <span className="badge bg-secondary">
                                        {p.total_direcciones || 0}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {lastPage > 1 && (
                <nav className="mt-3">
                    <ul className="pagination pagination-sm justify-content-center mb-0 flex-wrap">
                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => onPageChange(page - 1)}
                                disabled={page === 1}
                            >
                                &laquo; Anterior
                            </button>
                        </li>
                        {buildPages()}
                        <li className={`page-item ${page === lastPage ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => onPageChange(page + 1)}
                                disabled={page === lastPage}
                            >
                                Siguiente &raquo;
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </>
    )
}