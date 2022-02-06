import config from './config.js'

const app = Vue.createApp({
    data() {
        return {
            user:{
                "username": "",
                "password": ""
              }
        }
    },
    methods: {
        login(){
            axios.post(`${config.api_url}v2/admin/signin`, this.user)
                .then(res => {
                    console.log(res);
                    if(res.data.success === true){
                        alert(res.data.message)
                        const {token, expired} = res.data
                        document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
                        window.location = './backstage.html'
                    } else {
                        alert(res.data.message)
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    },
})

app.mount('#app')
