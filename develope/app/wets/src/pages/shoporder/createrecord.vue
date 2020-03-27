<template>
    <view><uni-steps :data="date" direction="column" active="" @change="btnChange"></uni-steps></view>
</template>

<script>
import uniSteps from '@/components/uni-steps/uni-steps.vue';
export default {
    components: { uniSteps },
    data() {
        return {
            date: [
                { title: '买家申请退款,待商家处理', lx:'仅退款', yy:'多拍/拍错/不需要', tk:'计算中', ms:'',desc: '2018-11-11' ,btn:['退款','退货']}, 
                { title: '卖家发货', desc: '2018-11-12' }, 
                ],
            refundcode: ''
        };
    },
    onLoad(option) {
        this.refundcode = option.refundcode;
        this.getRefundFlowList();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onNavigationBarButtonTap(e) {
        this.getRefundRule();
    },
    methods: {
        // 获取流程信息
        getRefundFlowList() {
            this.$ajax.get('com/getRefundFlowList', {refundcode: this.refundcode}).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    let data = res.data.result.data;
                    this.date = [];
                    data.forEach((item, index) => {
                        let info = {};
                        info.title = item.title;
                        info.yy = item.content;
                        if (item.piclist && item.piclist.length > 0) info.img = item.piclist;
                        // 直接退款：1。仅退款 2.退款和退货
                        // 同意退款: 3.同意退款 4 直接退款 9送至店家退款
                        // 拒绝退款：5
                        // 跟踪物流：6
                        // 送到门店：7
                        // 填写物流：8
                        // 取消退货：0
                        switch(item.state) {
                            case 1: 
                                break;
                            case 2: //直接退款、同意退款、拒绝退款（买家申请退货，待商家处理）
                                info.tk = item.refund_money;
                                info.ms = item.refund_desc;
                                if (item.refund_type_int == 0) {
                                    if (item.is_showbtn == 1) info.btn = [{type: 1, btnstr: '直接退款'}, {type: 5, btnstr: '拒绝退款'}];
                                } else {
                                    if (item.is_showbtn == 1) info.btn = [{type: 2, btnstr: '直接退款'}, {type: 3, state: item.state, btnstr: '同意退款'}, {type: 5, btnstr: '拒绝退款'}];
                                }
                                break;
                            case 3: 
                                break;
                            case 4: //(商家拒绝退)
                                
                                break;
                            case 5: //(商家同意退款，商城系统退款中) ; (商家同意退款，商城系统退款中)
                                
                                break;
                            case 6: //（退款成功）;（退款成功）
                                
                                break;
                            case 7: 
                                break;
                            case 8: //（买家撤销）
                                
                                break;
                            case 9: //直接退款（请买家退回商品，并提交物流单号）；取消退货、自己送到门店、填写物流信息（请买家退回商品，并提交物流单号）
                                if (item.refund_type_int == 0) {
                                    
                                } else {
                                    if (item.is_showbtn == 1) info.btn = [{type: 2, btnstr: '直接退款'}];
                                }
                                break;
                            case 10: //跟踪物流、拒绝退款、同意退款（买家填物流单号并退回商品，待商家同意退款）;（买家填物流单号并退回商品，待商家同意退款）
                                if (item.refund_type_int == 0) {
                                    if (item.is_showbtn == 1) info.btn = [{type: 1, btnstr: '直接退款'}, {type: 5, btnstr: '拒绝退款'}];
                                } else {
                                    if (item.is_showbtn == 1) info.btn = [{type: 6, btnstr: '跟踪物流'}, {type: 4, btnstr: '同意退款'}, {type: 5, btnstr: '拒绝退款'}];
                                }
                                break;
                            case 11: //拒绝退款、同意退款（买家将商品送到门店，待商家同意退款）;（买家将商品送到门店，待商家同意退款）
                                if (item.refund_type_int == 1) {
                                    if (item.is_showbtn == 1) info.btn = [{type: 9, state: item.state, btnstr: '同意退款'}, {type: 5, btnstr: '拒绝退款'}];
                                }
                                break;
                        }
                        info.desc = item.createtime;
                        this.date.push(info);
                    });
                } else {
                    this.$api.msg('获取流程信息失败');
                }
            });
        },
        // 
        btnChange(e){
            let btnData = e.title;
            let _this = this;
            switch(btnData.type) {
                case 1: 
                    uni.showModal({
                        title: '提示',
                        content: '买家申请的是仅退款，您确认仅退款无需退货吗？',
                        success: function(res) {
                            if (res.confirm) {
                                _this.$ajax.get('com/directRefund', {refundcode: _this.refundcode}).then(res => {
                                    _this.getRefundFlowList();
                                });
                            }
                        }
                    });
                    break;
                case 2:
                    uni.showModal({
                        title: '提示',
                        content: '退款将原路退回至买家账户，请确保退货商品已收到，避免资金损失！',
                        success: function(res) {
                            if (res.confirm) {
                                _this.$ajax.get('com/directRefund', {refundcode: _this.refundcode}).then(res => {
                                    _this.getRefundFlowList();
                                });
                            }
                        }
                    });
                    break;
                case 3:
                    uni.navigateTo({
                        url: '/pages/shoporder/address?refundcode=' + this.refundcode + '&refundstate=' + btnData.state
                    })
                    break;
                case 4:
                    uni.showModal({
                        title: '提示',
                        content: '退款将原路退回至买家账户，请确保退货商品已收到，避免资金损失！',
                        success: function(res) {
                            if (res.confirm) {
                                _this.$ajax.get('com/directRefund', {refundcode: _this.refundcode}).then(res => {
                                    _this.getRefundFlowList();
                                });
                            }
                        }
                    });
                    break;
                case 5:
                    uni.navigateTo({
                        url: '/pages/shoporder/refuse?refundcode=' + this.refundcode
                    })
                    break;
                case 6:
                    uni.navigateTo({
                        url: '/pages/shoporder/logistics?refundcode=' + this.refundcode
                    })
                    break;
                case 9: 
                    uni.showModal({
                        title: '提示',
                        content: '同意买家的退款申请？',
                        confirmText: '确认退款',
                        success: function(res) {
                            if (res.confirm) {
                                _this.$ajax.get('com/agreeRefund', {refundcode: _this.refundcode, state: btnData.state}).then(res => {
                                    _this.getRefundFlowList();
                                });
                            }
                        }
                    });
                    break;
            }
        },
        // 退款规则
        getRefundRule() {
            this.$ajax.get('com/getRefundRule', {}).then(res => {
                if (res.data.code == 0) {
                    uni.navigateTo({
                        url: '/pages/establishment/help?url=' + encodeURIComponent(res.data.result.data.url) + '&type=1'
                    });
                } else {
                    this.$api.msg(res.data.msg);
                }
            });
        }
    }
};
</script>

<style lang="scss"></style>
