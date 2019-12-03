<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProduct">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="products" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			 </el-table-column>
                        <el-table-column prop="service_name" label="产品/业务线" width="140" sortable>
			</el-table-column>
			<el-table-column prop="module_letter" label="业务线缩写" width="140" sortable>
			</el-table-column>
			<el-table-column prop="dev_interface" label="开发接口人" width="180" sortable>
			</el-table-column>
			<el-table-column prop="op_interface" label="运维接口人" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="操作" width="350">
				<template slot-scope="scope">	
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible">
			<el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm">
				<el-form-item label="产品线" prop="service_name">
                                        <el-input v-model="editForm.service_name" auto-complete="off"></el-input>
                                </el-form-item>
				<el-form-item label="缩写" prop="module_letter">
					<el-input v-model="editForm.module_letter" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="开发接口人">
					<el-input v-model="editForm.dev_interface" auto-complete="off"></el-input>	
				</el-form-item>
				<el-form-item label="运维接口人">
					<el-input v-model="editForm.op_interface" auto-complete="off"></el-input>	
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

               

		<!--新增界面-->
		<el-dialog title="业务线管理" :visible.sync="addFormVisible">
			<el-form :model="addForm" label-width="95px" :rules="addFormRules" ref="addForm"> 
				<el-form-item label="业务/产品线">
					<el-input v-model="addForm.service_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="英文缩写">
			             <el-input v-model="addForm.module_letter" auto-complete="off"></el-input>	
				</el-form-item>
				<el-form-item label="研发负责人">
                                     <el-input v-model="addForm.dev_interface" auto-complete="off"></el-input>
                                </el-form-item>				
				<el-form-item label="运维负责人">
					<el-input v-model="addForm.op_interface" auto-complete="off"></el-input>	
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">新增</el-button>
			</div>
		</el-dialog>
		

	</section>
</template>

<script>
	import util from '../../common/js/util'
	import {  removeProduct, editProduct, addProduct, getProduct } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				products: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					service_name: '',
					module_letter: '',	
					dev_interface: '',
					op_interface: ''	
				},
				//用户和权限绑定
				roleVisible: false, //绑定界面是否显示
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getProduct();
			},
			 handleCheckedCitiesChange(value) {
        			let checkedCount = value.length;
        			this.checkAll = checkedCount === this.cities.length;
        			this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      			},
			//获取用户列表
			getProduct() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getProduct(para).then((res) => {
					console.log(res)
					this.total = res.data.total;
					this.products = res.data.product;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeProduct(para.id).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getProduct();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {	
				this.addFormVisible = true;
				this.addForm = {
					service_name: '',
					module_letter: '',
					op_interface: '',	
					dev_interface: ''
				};
			},
			//获取权限列表，绑定到用户
                         getRoles() {
                                getAllRoleList().then((res) => {
                                        console.log(res)
                                        this.cities = res.data 
                             
                          	})
			  },
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							console.log(para.id)
				//			para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editProduct(para.id,para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getProduct();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);	
						//	para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addProduct(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getProduct();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				console.log(ids)
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getProduct();
		}
	}

</script>


