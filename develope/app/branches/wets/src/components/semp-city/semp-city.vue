<template>
    <view>
        <uni-popup ref="popup" type="bottom" mode="fixed" :show="show" @change="ckshow">
            <view class="semp-city">
                <view class="has-choose-box flex-row pad-left">
                    <text
                        class="has-choose"
                        :class="index == showRank ? 'active' : ''"
                        v-for="(item, index) in cityList"
                        :key="index"
                        @click="onRankClick(index)"
                        v-show="index <= showRank"
                    >
                        {{ item.name != '0' ? item.name : '请选择' }}
                    </text>
                </view>
                <view>
                    <scroll-view id="city-item-box" scroll-y="true">
                        <view
                            class="city-item pad-left flex-row"
                            :class="item.value == valueObj[cityList[showRank].identify].value ? 'active' : ''"
                            v-for="(item, index) in cityList[showRank].showList"
                            :key="index"
                            @click="onChooseClick(item)"
                        >
                            <view>{{ item.districtname }}</view>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
    components: { uniPopup },
    data() {
        return {
            other: {
                label: '',
                value: '0'
            },
            show:false,
            showRank: 0,
            cityList: [
                {
                    identify: 'province',
                    name: '0',
                    showList: []
                },
                {
                    identify: 'city',
                    name: '0',
                    showList: []
                },
                {
                    identify: 'county',
                    name: '0',
                    showList: []
                },
                {
                    identify: 'town',
                    name: '0',
                    showList: []
                }
            ],
            valueObj: {
                province: {
                    label: '',
                    value: '0'
                },
                city: {
                    label: '',
                    value: '0'
                },
                county: {
                    label: '',
                    value: '0'
                },
                town: {
                    label: '',
                    value: '0'
                }
            }
        };
    },
    props: {
        showbox: {
          type: Boolean,
          default: false
        },
		postkind: {}
		
    },
    watch:{
        showbox(newValue){
            this.show = newValue;
        },
		postkind() {
			uni.showLoading({
			    title: '加载中'
			});
			const data = {
				postkind: this.postkind
			};
			this.$ajax.get('shoppingcart/getprovince', data).then(res => {
			    if (res.data.code == 0) {
			        this.cityList[0].showList = res.data.result.data;
			        uni.hideLoading();
			    } else {
			        this.$api.msg('系统出错,请稍后再试');
			    }
			});
		}
    },
    created() {
        uni.showLoading({
            title: '加载中'
        });
        const data = {
			postkind: this.postkind
		};
        this.$ajax.get('shoppingcart/getprovince', data).then(res => {
            if (res.data.code == 0) {
                this.cityList[0].showList = res.data.result.data;
                uni.hideLoading();
            } else {
                this.$api.msg('系统出错,请稍后再试');
            }
        });
    },
    methods: {
        onChooseClick(item) {
            let ul = 'shoppingcart/';
            switch (this.showRank) {
                case 0:
                    ul += 'getcity';
                    break;
                case 1:
                    ul += 'getcounty';
                    break;
                case 2:
                    ul += 'gettown';
                    break;
                case 3:
                    this.valueObj[this.cityList[this.showRank].identify].label = item.districtname;
                    this.valueObj[this.cityList[this.showRank].identify].value = item.districtid;
                    this.cityList[this.showRank].name = item.districtname;
                    this.$emit('confirm', this.valueObj);
                    return;
            }
            const data = {
                districtid: item.districtid,
				postkind: this.postkind
            };
            this.$ajax.get(ul, data).then(res => {
                if (res.data.code == 0) {
                    if (res.data.result.data.length > 0) {
                        this.valueObj[this.cityList[this.showRank].identify].label = item.districtname;
                        this.valueObj[this.cityList[this.showRank].identify].value = item.districtid;
                        this.cityList[this.showRank].name = item.districtname;
                        this.showRank++;
                        this.cityList[this.showRank].showList = res.data.result.data;
                    } else {
                        this.valueObj[this.cityList[this.showRank].identify].label = item.districtname;
                        this.valueObj[this.cityList[this.showRank].identify].value = item.districtid;
                        this.cityList[this.showRank].name = item.districtname;
                        for (var i = this.showRank + 1; i < 4; i++) {
                            this.valueObj[this.cityList[i].identify].label = '';
                            this.valueObj[this.cityList[i].identify].value = '';
                            this.cityList[i].name = '';
                        }
                        console.log(this.valueObj);
                        this.$emit('confirm', this.valueObj);
                    }
                } else {
                    this.$api.msg('系统出错,请稍后再试');
                }
            });
        },
        onRankClick(key) {
            this.showRank = key;
        },
        ckshow(e){
            this.$emit('change',e)
        }
        
    }
};
</script>

<style>
.flex-row {
    display: flex;
    flex-direction: row;
}
.pad-left {
    padding-left: 30upx;
}
view {
    font-size: 26upx;
}
uni-view {
    color: #999999;
}
.has-choose-box {
    height: 60upx;
    border-bottom: 1px solid #f5f5f5;
}
.has-choose {
    margin-right: 50upx;
}
.has-choose.active {
    color: #0faeff;
}
#city-item-box {
    height: 500upx;
}
.city-item {
    height: 80upx;
    line-height: 80upx;
}
.city-item view {
    justify-content: center;
}
.city-item.active {
    color: #0faeff;
}
.flex-row {
    display: flex;
    flex-direction: column;
    flex-direction: row;
}
.pad-left {
    padding-left: 30upx;
}
</style>
