import http from '../utils/httpClient.js'

export const peopleService = {
    upload: (file, onProgress) => {
        const form = new FormData()
        form.append('archivo', file)

        return http.post('/upload', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: e => {
                if (onProgress && e.total) {
                    onProgress(Math.round((e.loaded * 100) / e.total))
                }
            }
        })
    },

    getAll: (page = 1) => {
        return http.get('/persons', { params: { page } })
    },

    getById: id => http.get(`/persons/${id}`),
}