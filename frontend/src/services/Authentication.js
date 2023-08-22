import Api from '@/services/Api'

export default {
    login (credentials) {
        return Api().post('/post', credentials)
    }
}