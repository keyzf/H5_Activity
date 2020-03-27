import Vue from 'vue'
import Vuex from 'vuex'
import footer_store from "./home.js"
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        jump_shop:false,
        display:'',
        distance:0,
        showpop:false
    },
    mutations: {
        login(state, provider) {
            uni.setStorageSync('userInfo',provider)
        },
        logout(state) {
            uni.removeStorageSync('isopenbuildcompany')
            uni.removeStorageSync('userInfo')
            uni.removeStorageSync('companyguid')
            uni.removeStorageSync('uniquekey')
        },
        jumpshop(state, start) {
            state.jump_shop = start;
        },
        update_display(state,data){
        	state.display = data
        }
    },
    actions: {
    	get_display(ctx,data){
    		//ctx.commit("update_display",data)
    	}
    },
    modules:{
    	footer_store
    }
})

export default store
