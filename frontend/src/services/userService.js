import http from '../utils/httpClient.js'

export const userService = {
    getAll() {
        return http.get('/users')
    },


    create(data) {
        return http.post('/users', data)
    },

    update(id, data) {
        return http.put(`/users/${id}`, data)
    },

    delete(id) {
        return http.delete(`/users/${id}`)
    }
}