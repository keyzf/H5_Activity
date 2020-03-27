<template>
	<view class="uni-numbox">
		<view class="uni-numbox-minus" :class="minDisabled?'uni-numbox-disabled': ''" @click="_calcValue('subtract')" >
			<text class="yticon icon--jianhao" ></text>
		</view>
		<input class="uni-numbox-value" type="number" :disabled="disabled || isMax" :value="value" @input="_input" >
		<view class="uni-numbox-plus" :class="maxDisabled?'uni-numbox-disabled': ''" @click="_calcValue('add')" >
			<text class="yticon icon-jia2"></text>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'uni-number-box',
		props: {
			isMax: {
				type: Boolean,
				default: false
			},
			isMin: {
				type: Boolean,
				default: false
			},
			zindex: {
				type: Number,
				default: 0
			},
            index: {
            	type: Number,
            	default: 0
            },
			value: {
				type: Number,
				default: 0
			},
			min: {
				type: Number,
				default: -Infinity
			},
			max: {
				type: Number,
				default: Infinity
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				inputValue: this.value,
				minDisabled: false,
				maxDisabled: false
			}
		},
		created(){
			this.maxDisabled = this.isMax;
			this.minDisabled = this.isMin;
		},
		watch: {
			inputValue(number) {
				const data = {
					number: number,
					index: this.index,
                    zindex:this.zindex
				}
				this.$emit('eventChange', data);
			},
            isMax(va){
                this.maxDisabled = va;
            },
            isMin(va){
                this.minDisabled = va;
            },
		},
		methods: {
			_calcValue(type) {
				const scale = this._getDecimalScale();
				let value = this.value * scale;
				let newValue = 0;
				let step = this.step * scale;
				
				if(type === 'subtract'){
					newValue = value - step;
					if (newValue <= this.min){
						this.minDisabled = true;
					}
					if(newValue < this.min){
						newValue = this.min
					}
					if(newValue < this.max && this.maxDisabled === true){
						this.maxDisabled = false;
					}
				}else if(type === 'add'){
					newValue = value + step;
					if (newValue >= this.max){
						this.maxDisabled = true;
					}
					if(newValue > this.max){
						newValue = this.max
					}
					if(newValue > this.min && this.minDisabled === true){
						this.minDisabled = false;
					}
				}
				if(newValue === value){
					return;
				}
				this.inputValue = newValue / scale;
			},
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + '').split('.')[1].length);
				}
				return scale;
			},
            _input(event) {
				let value = event.detail.value;
				if (!value) {
					this.inputValue = 1;
					return
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min
				}
				this.inputValue = value
			},
		}
	}
</script>
<style>
	.uni-numbox {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width:200upx;
		height: 60upx;
	}

	.uni-numbox-minus,
	.uni-numbox-plus {
		margin: 0;
		width: 60upx;
		height: 100%;
		line-height: 60upx;
		text-align: center;
		position: relative;
        border-radius: 50%;
        border: 1px solid #dedede;
	}
	.uni-numbox-minus .yticon,
	.uni-numbox-plus .yticon{
		font-size: 36upx;
		color: #ff4040;
	}

	.uni-numbox-value {
		position: relative;
		width: 80upx;
		height: 50upx;
		text-align: center;
		padding: 0;
		font-size: 30upx;
	}
    .uni-numbox-disabled{
        background: #f1f1f1;
    }
	.uni-numbox-disabled .yticon {
		color: #d6d6d6;
	}
</style>
