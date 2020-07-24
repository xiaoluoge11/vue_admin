<template>
	<section>
	   <div class="toolbar"> 
		<!--列表-->
		<el-table :data="gongdan"  border highlight-current-row  style="width: 100%;">
			<el-table-column type="selection">
			</el-table-column>
			<el-table-column type="index">
			 </el-table-column>
                        <el-table-column prop="name" label="工单标题" min-width="120">
			</el-table-column>
			<el-table-column prop="type" label="工单类型" min-width="100">
			</el-table-column>
			<el-table-column prop="comment" label="工单内容" min-width="250">
			</el-table-column>
			<el-table-column prop="status" label="工单状态" min-width="100">
                               <template slot-scope="scope">
					<el-button  v-if="scope.row.status == 1" size="small" type="warning" >处理中</el-button>
					<el-button  v-if="scope.row.status == 0" size="small" type="primary">申请</el-button>
				       <el-button  v-if="scope.row.status == 2" size="small" type="success" >完成</el-button>
			               <el-button  v-if="scope.row.status == 3" size="small" type="danger" >已驳回</el-button>	       
                                        </template>   
			</el-table-column>
                        <el-table-column prop="shenqingman" label="申请人" min-width="100">
			</el-table-column>
                        <el-table-column prop="create_time" label="申请时间" :formatter="dateFormat" min-width="180">
			</el-table-column>
			<el-table-column label="操作" min-width="150">
				<template slot-scope="scope">	
					<el-button size="small" v-if="scope.row.status == 0" type="primary"  @click="handleEdit(scope.$index, scope.row)">接受</el-button>
				        <el-button size="small" v-if="scope.row.status == 1" type="warning"  @click="finshEdit(scope.$index, scope.row)">结束</el-button>
				        <el-button type="danger"v-if="scope.row.status == !2" size="small" @click="bohuiEdit(scope.$index, scope.row)">驳回</el-button>
				        <el-button size="small" v-if="scope.row.status == 2" type="success" >已完成</el-button>
					<el-button size="small" v-if="scope.row.status == 3" type="danger" >已驳回</el-button>	
				</template>
			</el-table-column>
		</el-table>

                   <el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
 

                	<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
			   <el-form-item label="工单标题" prop="name">
				      <el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="工单类型" prop="type">
				      <el-input v-model="editForm.type" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="工单内容" prop="comment">
				      <el-input v-model="editForm.comment" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="说明" prop="explain">
				      <el-input v-model="editForm.explain" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
              </div>
	</section>
</template>

<script>
	import {  getGongdan,UpdateGongdan,FinshGongdan,BohuiGongdan } from '../../api/api';
        import moment from 'moment'
	export default {
		data() {
			return {
                                gongdan: [],
				total: 0,
				page: 1,
				listLoading: false,
                                editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入驳回理由', trigger: 'blur' }
					]
				},
                                editForm: {
					id: 0,
					name: '',
					type: '',
					comment: '',
					shuoming: '',
				},

			}
		},
		methods: {
			//获取用户列表
			getJobList() {
				getGongdan().then((res) => {
					console.log(res)
					this.total = res.data.total;
					this.gongdan = res.data.gongdan;
					this.listLoading = false;
					//NProgress.done();
				});
			},
		        dateFormat: function(row, column) {
			      console.log(row, column)
			      const date = row[column.property]
			      if (date === undefined) {
                                   return ''
			      }
			      return moment(date).format('YYYY-MM-DD HH:mm:ss')
			    },
                        handleEdit: function (index, row) {	
					//NProgress.start();
					let para = { id: row.id };
					UpdateGongdan(para.id).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '处理中',
							type: 'success'
						});
						this.getJobList();
					});
			    	
		 	},
		        finshEdit: function (index, row) {	
					//NProgress.start();
					let para = { id: row.id };
					FinshGongdan(para.id).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '工单处理完成',
							type: 'success'
						});
						this.getJobList();
					});
			    	
		 	},
		        bohuiEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
                       	editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							console.log(para)
							BohuiGongdan(para.id,para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交完成，已发送通知',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getJobList();
							});
						});
					}
				});
			},
	
		},
		mounted() {
			this.getJobList();
		}
	}

</script>


