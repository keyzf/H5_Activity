<template>
    <view>
        <picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray" @change="revert">
            <view class="uni-input">{{time == ''?'请选择时间':time}}</view>
        </picker>
    </view>
</template>

<script>
export default {
    name: 'PickerTime',
    props: {
        time: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            multiArray: [
                ['2010', '2011'],
                ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
                ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                ['00', '10', '20', '30', '40', '50']
            ],
            multiIndex: [0, 0, 0, 0, 0]
        };
    },
    watch: {
        time: function(newVal) {
            let year, month, day, hour,minutes, date;
            if (newVal == '') {
                date = new Date();
            } else {
                date = new Date(Date.parse(newVal.replace(/-/g, '/')));
            }
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate() - 1;
            hour = date.getHours();
            minutes = date.getMinutes();
            let years = [];
            for (let i = 10; i >= 1; i--) {
                years.push(year - i);
            }
            for (let e = 0; e <= 10; e++) {
                years.push(year + e);
            }
            this.multiArray[0] = years;
            this.multiIndex = [10, month, day, hour, parseInt(minutes/10)];
        }
    },
    created() {
        let year, month, day, hour,minutes, date;
        if (this.time == '') {
            date = new Date();
        } else {
            date = new Date(Date.parse(this.time.replace(/-/g, '/')));
        }
        year = date.getFullYear();
        month = date.getMonth();
        day = date.getDate() - 1;
        hour = date.getHours();
        minutes = date.getMinutes();
        let years = [];
        for (let i = 10; i >= 1; i--) {
            years.push(year - i);
        }
        for (let e = 0; e <= 10; e++) {
            years.push(year + e);
        }
        this.multiArray[0] = years;
        this.multiIndex = [10, month, day, hour, parseInt(minutes/10)];
    },
    methods: {
        revert(e){
            let time = '';
            this.multiIndex.forEach((item,index)=>{
                if(index == 2){
                    time = time + this.multiArray[index][item] + ' ';
                }else if(index < 2){
                    time = time + this.multiArray[index][item] + '-';
                }else if(index == this.multiIndex.length-1){
                    time = time + this.multiArray[index][item] + ':00';
                }else{
                    time = time + this.multiArray[index][item] + ':';
                }
            })
            this.$emit('change', {
              time: time
            })
        },
        bindMultiPickerColumnChange: function(e) {
            this.multiIndex.splice(e.detail.column, 1, e.detail.value);
            if (e.detail.column == 0 && this.multiIndex[1] == 1) {
                let curMonthDays = new Date(this.multiArray[0][this.multiIndex[0]], 2, 0).getDate();
                if (curMonthDays == 28) {
                    this.multiArray[2] = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28'];
                } else {
                    this.multiArray[2] = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29'];
                }
            } else if (e.detail.column == 1) {
                switch (e.detail.value + 1) {
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                    case 8:
                    case 10:
                    case 12:
                        this.multiArray[2] = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
                        break;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        this.multiArray[2] = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'];
                        break;
                    case 2:
                        let curMonthDays = new Date(this.multiArray[0][this.multiIndex[0]], 2, 0).getDate();
                        if (curMonthDays == 28) {
                            this.multiArray[2] = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28'];
                        } else {
                            this.multiArray[2] = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29'];
                        }
                        break;
                }
            }
        }
    }
};
</script>

<style lang="scss"></style>
