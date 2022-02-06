import config from './config.js'

const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
axios.defaults.headers.common['Authorization'] = token;

let productModal = ''
let deleteModal = ''

const app = Vue.createApp({
    data() {
        return {
            productsData: [],
            tempProduct:{
                imagesUrl:[]
            },
            isNew:false
        }
    },
    methods: {
        checklogin() {
            axios.post(`${config.api_url}v2/api/user/check`)
                .then((res) => {
                    this.getProductsData()
                })
                .catch(error => {
                    alert(error.data.message);
                    window.location = './index.html'
                })
        },
        getProductsData() {
            axios.get(`${config.api_url}v2/api/${config.api_path}/admin/products/all`)
                .then(res => {
                    this.productsData = res.data.products
                })
                .catch(error => {
                    console.log(error);
                })
        },
        updateProduct() {
            let obj = {
                data:{
                    ...this.tempProduct
                }
            }
            if( this.isNew === false){
                axios.put(`${config.api_url}v2/api/${config.api_path}/admin/product/${this.tempProduct.id}`, obj)
                    .then(res => {
                        alert(res.data.message)
                        productModal.hide()
                        this.getProductsData()
                    })
                    .catch(error => {
                        console.log(error.data);
                    })
            } else if (this.isNew === true){
                axios.post(`${config.api_url}v2/api/${config.api_path}/admin/product`, obj)
                .then(res => {
                    alert(res.data.message)
                    productModal.hide()
                    this.getProductsData()
                })
                .catch(error => {
                    console.log(error.data);
                })
            }
        },
        deleteProduct() {
            axios.delete(`${config.api_url}v2/api/${config.api_path}/admin/product/${this.tempProduct.id}`)
            .then(res => {
                alert(res.data.message)
                deleteModal.hide()
                this.getProductsData()
            })
            .catch(error => {
                console.log(error.data);
            }) 
        },
        openModal(status, product) {
            if(status === 'new'){
                this.isNew = true
                this.tempProduct = {}
                this.tempProduct.imagesUrl = []
                productModal.show()
            } else if (status === 'edit'){
                this.tempProduct = { ...product }
                productModal.show()
            } else if (status === 'delete'){
                this.tempProduct = { ...product }
                deleteModal.show()
            }
        },
        createImg() {
            this.tempProduct = {}
            this.tempProduct.imagesUrl = []
            this.tempProduct.imagesUrl.push('')
        }

    },
    mounted() {
        productModal = new bootstrap.Modal(document.querySelector('#productModal'))
        deleteModal = new bootstrap.Modal(document.querySelector('#delProductModal'))
        this.checklogin()
    },
})

app.mount('#app')