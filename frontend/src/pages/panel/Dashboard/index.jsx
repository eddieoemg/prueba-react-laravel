import { useState, useEffect, useCallback } from 'react'
import { useUser } from '../../../hooks/useUser'
import { peopleService } from '../../../services/peopleService.js'
import PeopleTable from './Query/PeopleTable'
import PeopleDetail from './Query/PeopleDetail'
import UploadModal from './Upload'
import Users from './Users'

export default function Dashboard() {
    const { fullName, isAdmin, logout } = useUser()
    const [activeTab, setActiveTab] = useState('people')
    const [people, setPeople] = useState([])
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0 })
    const [showUpload, setShowUpload] = useState(false)

    const fetchPeople = useCallback(async (page = 1) => {
        setLoading(true)
        try {
            const { data } = await peopleService.getAll(page)
            setPeople(data.data || [])
            setPagination({
                page: data.pagination?.current_page || 1,
                lastPage: data.pagination?.last_page || 1,
                total: data.pagination?.total || 0
            })
        } catch (e) {
            console.error('Error fetching people:', e)
            setPeople([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (activeTab === 'people') fetchPeople(1)
    }, [fetchPeople, activeTab])

    const handlePageChange = (page) => {
        setSelected(null)
        fetchPeople(page)
    }

    const handleUploadComplete = () => {
        setShowUpload(false)
        setSelected(null)
        fetchPeople(1)
    }

    return (
        <>
            <nav className="navbar navbar-dark bg-dark mb-4">
                <div className="container-fluid px-4">
                    <span className="navbar-brand">
                        <i className="bi bi-people-fill me-2" />
                        Sistema de Población
                    </span>
                    <div className="d-flex align-items-center gap-2">
                        <span className="text-light">
                            <i className="bi bi-person-circle me-1" />
                            {fullName}
                            {isAdmin && <span className="badge bg-warning text-dark ms-2">Admin</span>}
                        </span>
                        <button className="btn btn-outline-light btn-sm" onClick={logout}>
                            <i className="bi bi-box-arrow-right me-1" />
                            Salir
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container-fluid px-4">
                {isAdmin && (
                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'people' ? 'active' : ''}`}
                                onClick={() => setActiveTab('people')}
                            >
                                <i className="bi bi-people me-2" />
                                Población
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                                onClick={() => setActiveTab('users')}
                            >
                                <i className="bi bi-person-gear me-2" />
                                Usuarios
                            </button>
                        </li>
                    </ul>
                )}

                {activeTab === 'users' && isAdmin ? (
                    <Users />
                ) : (
                    <>
                        <div className="row mb-3">
                            <div className="col">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h4 className="mb-1">
                                            <i className="bi bi-people me-2" />
                                            Consulta de Población
                                        </h4>
                                        <small className="text-muted">
                                            Total: {pagination.total.toLocaleString()} registros
                                        </small>
                                    </div>
                                    <div className="d-flex gap-2">
                                        {isAdmin && (
                                            <button className="btn btn-warning" onClick={() => setShowUpload(true)}>
                                                <i className="bi bi-file-earmark-arrow-up me-2" />
                                                Importar Excel
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => fetchPeople(pagination.page)}
                                            disabled={loading}
                                        >
                                            <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className={selected ? 'col-lg-7' : 'col-12'}>
                                <div className="card shadow-sm">
                                    <div className="card-body p-0">
                                        <PeopleTable
                                            data={people}
                                            loading={loading}
                                            selectedId={selected?.id}
                                            onSelect={setSelected}
                                            pagination={pagination}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            {selected && (
                                <div className="col-lg-5 mt-3 mt-lg-0">
                                    <PeopleDetail person={selected} onClose={() => setSelected(null)} />
                                </div>
                            )}
                        </div>


                    </>
                )}
            </div>


            {isAdmin && (
                <UploadModal show={showUpload} onHide={() => setShowUpload(false)} onComplete={handleUploadComplete} />
            )}

        </>

    )
}