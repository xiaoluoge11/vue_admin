<template>
    <div class="detail">

        <el-card style="margin-top: 50px;">
            <div slot="header">
                <h2 style="color: #d15e10;">cpu监控</h2>
            </div>
            <div>
                <cpu :hostid="hostid"></cpu>
            </div>
        </el-card>

        <el-card style="margin-top: 50px;">
            <div slot="header">
                <h2 style="color: #d15e10;">memory监控</h2>
            </div>
            <div>
                <memory :hostid="hostid"></memory>
            </div>
        </el-card>
    
         <el-card style="margin-top: 50px;">
            <div slot="header">
                <h2 style="color: #d15e10;">ens33流量</h2>
            </div>
            <div>
                <network :hostid="hostid"></network>
            </div>
        </el-card>


    </div>
</template>

<script>

    import cpu from "./Cpu.vue"
    import memory from "./Memory.vue"
    import network from "./network.vue" 
    import moment from "moment";

    export default {
        components: {cpu, memory , network},
        data() {
            return {
                hostid: this.$route.query.hostid,
                systemTime: ''
            }
        },       
        methods: {}
    }
</script>

<style scoped>
    .circle {
        display: inline-block;
        margin: 0 50px;
    }

    .box {
        height: 150px;
        padding: 0 50px;
        border: 1px solid #292929;
        text-align: center;
    }

    .box .title {
        font-weight: 600;
        font-size: 1rem;
        line-height: 2;
    }

    .box .contents {
        text-align: center;
        font-size: 3em;
        font-weight: 700;
        line-height: 3;
    }

    .color-yellow {
        background-color: rgba(250, 139, 47, 0.890196);
    }

    .color-blue {
        background-color: rgba(50, 172, 45, 0.972549);
    }

    .color-green {
        background-color: rgb(60, 87, 14);
    }
</style>
