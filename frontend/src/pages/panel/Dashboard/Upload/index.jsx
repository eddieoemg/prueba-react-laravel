import { useState } from 'react'
import { peopleService } from '../../../../services/peopleService.js'
import ExcelDropzone from './DropZone.jsx'

export default function UploadModal({ show, onHide, onComplete }) {
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)
    const [result, setResult] = useState(null)

    const reset = () => {
        setFile(null)
        setError(null)
        setResult(null)
        setProgress(0)
    }

    const handleClose = () => {
        if (uploading) return
        reset()
        onHide()
    }

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        setError(null)
        setResult(null)

        try {
            const response = await peopleService.upload(file, setProgress)

            setResult({
                loaded: response.data?.registros_cargados || 0,
                message: response.data?.message || 'Proceso completado'
            })

            if (onComplete) onComplete()
        } catch (e) {
            const errorMsg = e.response?.data?.error || 'Error al procesar el archivo'
            setError(errorMsg)
        } finally {
            setUploading(false)
        }
    }

    if (!show) return null

    return (
        <div className="modal d-block" >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Cargar Archivo Excel</h5>
                        {!uploading && (
                            <button type="button" className="btn-close" onClick={handleClose} />
                        )}
                    </div>

                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger alert-dismissible">
                                {error}
                                <button type="button" className="btn-close" onClick={() => setError(null)} />
                            </div>
                        )}

                        {result && (
                            <div className="alert alert-success">
                                <strong>{result.message}</strong>
                                <p className="mb-0 mt-2">
                                    Registros procesados: <strong>{result.loaded}</strong>
                                </p>
                            </div>
                        )}

                        {!result && (
                            <ExcelDropzone
                                onFileSelect={setFile}
                                disabled={uploading}
                                selectedFile={file}
                            />
                        )}

                        {uploading && (
                            <div className="mt-3">
                                <small className="text-muted">
                                    {progress < 100 ? 'Subiendo archivo...' : 'Procesando datos...'}
                                </small>
                                <div className="progress mt-1">
                                    <div
                                        className="progress-bar progress-bar-striped progress-bar-animated"
                                        style={{ width: `${progress}%` }}
                                    >
                                        {progress}%
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={handleClose} disabled={uploading}>
                            {result ? 'Cerrar' : 'Cancelar'}
                        </button>
                        {!result && (
                            <button className="btn btn-primary" onClick={handleUpload} disabled={!file || uploading}>
                                {uploading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Procesando...
                                    </>
                                ) : 'Subir y Procesar'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}