<template>
	<section>
          <div class="toolbar">
		<!--列表-->
		<el-table :data="applylist"  border highlight-current-row  style="width: 100%;">
			<el-table-column type="selection">
			</el-table-column>
                        <el-table-column prop="name" label="项目名称" width="160">
			</el-table-column>
			<el-table-column prop="tag" label="版本">
			</el-table-column>
			<el-table-column prop="comment" label="更新内容">
			</el-table-column>
			<el-table-column prop="status" label="状态">
                               <template slot-scope="scope">
			       <el-button  v-if="scope.row.status == 1" size="small" type="success">申请</el-button>
			       <el-button  v-if="scope.row.status == 2" size="small" type="success">审核</el-button>
				<el-button  v-if="scope.row.status == 3" size="small" type="success">测试</el-button>
				<el-button  v-if="scope.row.status == 4" size="small" type="success">上线</el-button>
                                </template>   
			</el-table-column>
                        <el-table-column prop="applicanter" label="申请人">
			</el-table-column>
			<el-table-column prop="userider" label="审核人">
			</el-table-column>
                        <el-table-column prop="create_time" label="申请时间" :formatter="dateFormat" width="150">
			</el-table-column>
			<el-table-column label="操作" width="140">
				<template slot-scope="scope">	
					<el-button size="small" v-if="scope.row.userid==scope.row.user" type="primary"  @click="handleEdit(scope.$index, scope.row)">处理</el-button> 
				        <el-button type="danger"  size="small" @click="bohuiEdit(scope.$index, scope.row)">驳回</el-button>	
				</template>
			</el-table-column>
		</el-table>
                <br>
                	<el-col :span="24">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col> 


                	<!--编辑界面-->
		<el-dialog title="上线项目" :visible.sync="editFormVisible">
		      <el-steps :space="160" :active="active" finish-status="success">
		        <el-step title="申请"></el-step>
		          <el-step title="审核"></el-step>
	                <el-step title="测试"></el-step>
			<el-step title="上线"></el-step>
		     </el-steps>
			<el-form :model="editForm" :label-position="labelPosition" label-width="60px" ref="editForm">
		       	        <el-col :span="20">
		         	<el-form-item label="上线项目" prop="name">
				      <el-input v-model="editForm.name" width="200"></el-input>
				</el-form-item>
				<el-form-item label="上线版本" prop="tag">
				      <el-input v-model="editForm.tag"></el-input>
				</el-form-item>	
				<el-form-item label="发布信息" prop="comment">
				      <el-input v-model="editForm.comment"></el-input>
				</el-form-item>
				<el-form-item>
				     <el-button type="primary" @click="editSubmit">下一步</el-button>
				</el-form-item>
				</el-col>
				</el-form>
                   </el-dialog>
              </div>
	</section>
</template>

<script>
	import {  getApply,UpdateApply_status,ChangStatus } from '../../api/api';
        import moment from 'moment'
	export default {
		data() {
			return {
                                active: '',
				labelPosition: 'top',
                                applylist: [],	
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],
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
                        handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			 handleCheckedCitiesChange(value) {
        			let checkedCount = value.length;
        			this.checkAll = checkedCount === this.cities.length;
        			this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      			},
			//获取用户列表
			getApplyList() {
                                let para = {
                                        page: this.page, 
                                };
                                this.listLoading = true;
				getApply(para).then((res) => {
					this.total = res.data.total;
					this.applylist = res.data.applylist;
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
			      return moment(date).format('YYYY-MM-DD HH:mm')
			    },
                        handleEdit: function (index, row) {
                            let para = Object.assign({}, row);			    
			    this.editForm = para
       			    this.active=para.status;
			    if (this.active < 4) {
			       this.editFormVisible = true;
			       this.active++;       
			     }else{console.log('超标')}
		        },
                       	editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);	
							ChangStatus(para.id,para,this.active).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交完成，已发送通知',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getApplyList();
							});
						});
					}
				});
			},
	
		},
		mounted() {
			this.getApplyList();
		}
	}

</script>

