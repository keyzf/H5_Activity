<template>
    <view>
        <block v-if="day">
          <text>{{ d }}</text>
          :  
        </block>
        <text>{{ h }}</text>
        :
        <text>{{ i }}</text>
        :
        <text>{{ s }}</text>
    </view>
</template>

<script>
export default {
    props: {
        time: '',
        day: {
        	type: Boolean,
        	default: true
        },
    },
    data() {
        return {
            timer: null,
            d: '00',
            h: '00',
            i: '00',
            s: '00',
            leftTime: 0,
            seconds: 0
        };
    },
    watch: {
        time: function(newVal) {
            this.seconds = parseInt(newVal);
            clearInterval(this.timer);
            this.countDown();
            this.timer = setInterval(() => {
                this.seconds--;
                if (this.seconds < 0) {
                    this.timeUp();
                    return;
                }
                this.countDown();
            }, 1000);
        }
    },
    created() {
        this.seconds = parseInt(this.time);
        this.countDown();
        this.timer = setInterval(() => {
            this.seconds--;
            if (this.seconds < 0) {
                this.timeUp();
                return;
            }
            this.countDown();
        }, 1000);
    },
    methods: {
        timeUp() {
            clearInterval(this.timer);
            this.$emit('timeup');
        },
        countDown() {
            let seconds = this.seconds;
            let [day, hour, minute, second] = [0, 0, 0, 0];
            if (seconds > 0) {
                day = Math.floor(seconds / (60 * 60 * 24));
                hour = Math.floor(seconds / (60 * 60)) - day * 24;
                minute = Math.floor(seconds / 60) - day * 24 * 60 - hour * 60;
                second = Math.floor(seconds) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60;
            } else {
                this.timeUp();
            }
            if (day < 10) {
                day = '0' + day;
            }
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (minute < 10) {
                minute = '0' + minute;
            }
            if (second < 10) {
                second = '0' + second;
            }
            this.d = day;
            this.h = hour;
            this.i = minute;
            this.s = second;
        }
    }
};
</script>

<style lang="scss"></style>
