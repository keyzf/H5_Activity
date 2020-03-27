<template>
	<view>
		<picker mode="multiSelector" @change="onConfirm" @columnchange="bindMultiPickerColumnChange" :value="oldMultiIndex" :range="multiArray">
			<view class="uni-input">{{city == ''?'未设置':city}}</view>
		</picker>
	</view>
</template>

<script>
	export default {
        props: {
            city: ''
        },
		data() {
			return {
				multiArray: [['全国'], ['全部'], ['全部']],
				oldMultiIndex: [0, 0, 0],
                newMultiIndex: [0, 0, 0]
			};
		},
        watch: {
            city: function(newVal) {
                let addressArray = newVal.split(",");
                let list;
                if(this.list == undefined){
                    list = uni.getStorageSync('citylist');
                }else{
                    list = this.list;
                }
                
                list.forEach((item, index) => {
                	if (item.name == addressArray[0]) {
                		this.oldMultiIndex[0] = index;
                	}
                });
                let datas = [];
                list[this.oldMultiIndex[0]].subs.forEach((item, index) => {
                	if (item.name == addressArray[1]) {
                		this.oldMultiIndex[1] = index;
                	}
                	datas.push(item.name);
                });
                this.multiArray[1] = datas;
                datas = [];
                list[this.oldMultiIndex[0]].subs[this.oldMultiIndex[1]].subs.forEach((item, index) => {
                	if (item.name == addressArray[2]) {
                		this.oldMultiIndex[2] = index;
                	}
                	datas.push(item.name);
                });
                this.multiArray[2] = datas;
                this.newMultiIndex = this.oldMultiIndex;
            }
        },
        created() {
            try {
                const value = uni.getStorageSync('citylist');
                if (value) {
                    let list = value;
                    this.list = list;
                    let date = [['全国'], ['全部'], ['全部']];
                    list.forEach((items,index) => {
                    	date[0][index] = items.name
                    });
                    this.multiArray = date;
                    if(this.city != '' && this.city != undefined){
                        let addressArray = this.city.split(",");
                        list.forEach((item, index) => {
                            if (item.name == addressArray[0]) {
                                this.oldMultiIndex[0] = index;
                            }
                        });
                        let datas = [];
                        list[this.oldMultiIndex[0]].subs.forEach((item, index) => {
                            if (item.name == addressArray[1]) {
                                this.oldMultiIndex[1] = index;
                            }
                            datas.push(item.name);
                        });
                        this.multiArray[1] = datas;
                        
                        datas = [];
                        list[this.oldMultiIndex[0]].subs[this.oldMultiIndex[1]].subs.forEach((item, index) => {
                            if (item.name == addressArray[2]) {
                                this.oldMultiIndex[2] = index;
                            }
                            datas.push(item.name);
                        });
                        this.multiArray[2] = datas;
                        this.newMultiIndex = this.oldMultiIndex;
                    }
                }else{
                    this.$ajax.get('com/getAllDistricts', { timestamp: 0, update: 0 }).then(res => {
                    	let list = res.data.result.data.districts;
                        uni.setStorageSync('citylist',list);
                    	this.list = list;
                    	let date = [['全国'], ['全部'], ['全部']];
                    	list.forEach((items,index) => {
                    		date[0][index] = items.name
                    	});
                    	this.multiArray = date;
                        if(this.city != '' && this.city != undefined){
                            let addressArray = this.city.split(",");
                            list.forEach((item, index) => {
                                if (item.name == addressArray[0]) {
                                    this.oldMultiIndex[0] = index;
                                }
                            });
                            let datas = [];
                            list[this.oldMultiIndex[0]].subs.forEach((item, index) => {
                                if (item.name == addressArray[1]) {
                                    this.oldMultiIndex[1] = index;
                                }
                                datas.push(item.name);
                            });
                            this.multiArray[1] = datas;
                            
                            datas = [];
                            list[this.oldMultiIndex[0]].subs[this.oldMultiIndex[1]].subs.forEach((item, index) => {
                                if (item.name == addressArray[2]) {
                                    this.oldMultiIndex[2] = index;
                                }
                                datas.push(item.name);
                            });
                            this.multiArray[2] = datas;
                            this.newMultiIndex = this.oldMultiIndex;
                        }
                    });
                }
            } catch (e) {
                this.$ajax.get('com/getAllDistricts', { timestamp: 0, update: 0 }).then(res => {
                	let list = res.data.result.data.districts;
                    uni.setStorageSync('citylist',list);
                	this.list = list;
                	let date = [['全国'], ['全部'], ['全部']];
                	list.forEach((items,index) => {
                		date[0][index] = items.name
                	});
                	this.multiArray = date;
                    if(this.city != '' && this.city != undefined){
                        let addressArray = this.city.split(",");
                        list.forEach((item, index) => {
                            if (item.name == addressArray[0]) {
                                this.oldMultiIndex[0] = index;
                            }
                        });
                        let datas = [];
                        list[this.oldMultiIndex[0]].subs.forEach((item, index) => {
                            if (item.name == addressArray[1]) {
                                this.oldMultiIndex[1] = index;
                            }
                            datas.push(item.name);
                        });
                        this.multiArray[1] = datas;
                        
                        datas = [];
                        list[this.oldMultiIndex[0]].subs[this.oldMultiIndex[1]].subs.forEach((item, index) => {
                            if (item.name == addressArray[2]) {
                                this.oldMultiIndex[2] = index;
                            }
                            datas.push(item.name);
                        });
                        this.multiArray[2] = datas;
                        this.newMultiIndex = this.oldMultiIndex;
                    }
                });
            }
            
        },
        methods:{
            bindMultiPickerColumnChange: function(e) {
            	this.newMultiIndex[e.detail.column] = e.detail.value;
            	let list = this.list;
            	let data = [];
            	switch (e.detail.column) {
            		case 0: //拖动第1列
            			list[e.detail.value].subs.forEach((items, index) => {
            				data.push(items.name);
            			});
            			this.multiArray[1] = data;
            			let datas = [];
            			if (list[this.newMultiIndex[0]].subs[this.newMultiIndex[1]] != undefined && list[this.newMultiIndex[0]].subs[this.newMultiIndex[1]].subs.length > 0) {
            				list[this.newMultiIndex[0]].subs[this.newMultiIndex[1]].subs.forEach((items, index) => {
            					datas.push(items.name);
            				});
            				this.multiArray[2] = datas;
            			}
            			break;
            		case 1: //拖动第2列
            			list[this.newMultiIndex[0]].subs[e.detail.value].subs.forEach((items, index) => {
            				data.push(items.name);
            			});
            			this.multiArray[2] = data;
            			break;
            	}
            },
            /* 设置服务范围 */
            onConfirm() {
            	let list = this.list;
            	let adress = this.multiArray[0][this.newMultiIndex[0]]+','+this.multiArray[1][this.newMultiIndex[1]]+','+this.multiArray[2][this.newMultiIndex[2]];
            	let areaId = [];
                areaId.push(this.list[this.newMultiIndex[0]].id);
                areaId.push(this.list[this.newMultiIndex[0]].subs[this.newMultiIndex[1]].id);
                areaId.push(this.list[this.newMultiIndex[0]].subs[this.newMultiIndex[1]].subs[this.newMultiIndex[2]].id);
            	this.oldMultiIndex = this.newMultiIndex;
                this.$emit('change', {
                  adress: adress,
                  areaId:areaId
                })
            },
        }
	}
</script>

<style lang="scss">

</style>
