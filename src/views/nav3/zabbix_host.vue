<template>
	<section>

		<!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                        <el-form :inline="true" :model="filters">
                                <el-form-item>
                                        <el-input v-model="filters.name" placeholder="姓名"></el-input>
                                </el-form-item>
                                <el-form-item>
                                        <el-button type="primary" v-on:click="checkzbhost">查询</el-button>
                                </el-form-item>
                                
                        </el-form>
                </el-col>



		<!--列表-->
		<template>
			<el-table :data="zbhost" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index">
				</el-table-column>
				<el-table-column prop="hostid" label="主机ID" width="80">
				</el-table-column>
				<el-table-column prop="host" label="主机IP"  width="200">
				</el-table-column>
				<el-table-column prop="name" label="主机名"  width="200" sortable>
				</el-table-column>
				<el-table-column prop="groups" label="所属组" width="200" sortable>	
				</el-table-column>
				<el-table-column prop="available" label="状态" width="100" sortable>
					<template slot-scope="scope">

                        			<el-button v-if="scope.row.available == 1" size="small" type="success"><i
                           			 class="el-icon-check"></i>可用
                       				 </el-button>
                        			<el-button v-if="scope.row.available == 0" size="small" type="danger"><i
                            			class="el-icon-close"></i>未知
                       				 </el-button>
                        			<el-button v-if="scope.row.available == 2" size="small" type="danger"><i
                            			class="el-icon-close"></i> 失效
                        		</el-button>
					</template>		 
				</el-table-column>
                                <el-table-column label="操作">
                                <template slot-scope="scope">
                                        <el-button type="warning" size="small" @click="hostDetail(scope.$index, scope.row)"><i class="el-icon-video-pause"></i>详情</el-button>
                                        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-success"></i>恢复</el-button> 
                                        <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                                </template>
                        </el-table-column>


			</el-table>
		</template>

	</section>
</template>
<script>
	import { getZabbixList } from '../../api/api';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
				zbhost: []
			}
		},
		methods: {
			checkzbhost(){},
			//获取用户列表
		        hostDetail(index, row) {                                                                            
                               this.$router.push({
                               path: 'HostDetail',
                        query: {
                              hostid: row.hostid, 
                              }
                            })
                          },	
			getzbhost: function () {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.loading = true;
				//NProgress.start();
				getZabbixList(para).then((res) => {
					console.log(res.data)
					this.zbhost = res.data;
					this.loading = false;
					//NProgress.done();
				});
			}
		},
		mounted() {
			this.getzbhost();
		}
	};

</script>

<style scoped>

</style>
