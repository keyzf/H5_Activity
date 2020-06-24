<template>
	<view>
		<image :src="srcs" :mode="mode" @error="thimg()"></image>
	</view>
</template>

<script>
	export default {
        props: {
            src: {
                type: String,
                default: ''
            },
            mode: {
                type: String,
                default: 'aspectFill'
            },
        },
		data() {
			return {
				srcs:'../../static/category.png'
			}
		},
        watch: {
            src: function(newVal) {
                var s = newVal.split("?")[0];
                if(s){
                    this.srcs = encodeURI(s)
                }
            }
        },
        created() {
            var s = this.src.split("?")[0];
            if(s){
                this.srcs = encodeURI(s)
            }
        },
        methods:{
            thimg(){
                this.srcs = '../../static/category.png';
            }
        }
	}
</script>

<style>

</style>
