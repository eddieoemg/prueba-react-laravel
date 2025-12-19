import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function ExcelDropzone({ onFileSelect, disabled, selectedFile }) {
    const [error, setError] = useState(null)

    const onDrop = useCallback((accepted, rejected) => {
        setError(null)

        if (rejected.length) {
            const code = rejected[0]?.errors?.[0]?.code
            if (code === 'file-invalid-type') {
                setError('Solo se permiten archivos CSV (.csv)')
            } else {
                setError('Archivo no válido')
            }
            onFileSelect(null)
            return
        }

        if (accepted.length) {
            onFileSelect(accepted[0])
        }
    }, [onFileSelect])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv']
        },
        maxFiles: 1,
        disabled
    })

    const clearFile = () => {
        setError(null)
        onFileSelect(null)
    }

    return (
        <div>
            <div
                {...getRootProps()}
                className={`border border-2 border-dashed rounded p-4 text-center 
                    ${isDragActive ? 'border-primary bg-light' : 'border-secondary'}
                    ${disabled ? 'opacity-50' : ''}`}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="mb-0 text-primary">Suelta el archivo aquí...</p>
                ) : (
                    <>
                        <i className="bi bi-filetype-csv fs-1 text-success" />
                        <p className="mb-1 mt-2">Arrastra un archivo CSV aquí</p>
                        <p className="mb-0 text-muted small">o haz clic para seleccionar</p>
                        <span className="badge bg-secondary mt-2">.csv</span>
                    </>
                )}
            </div>

            {error && (
                <div className="alert alert-danger mt-3 py-2 d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle me-2" />
                    {error}
                </div>
            )}

            {selectedFile && (
                <div className="alert alert-success mt-3 py-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <i className="bi bi-file-earmark-check me-2" />
                            <strong>{selectedFile.name}</strong>
                        </div>
                        {!disabled && (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={clearFile}
                            >
                                <i className="bi bi-x" />
                            </button>
                        )}
                    </div>
                    <small className="text-muted">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                    </small>
                </div>
            )}
        </div>
    )
}