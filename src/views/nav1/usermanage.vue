<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			 </el-table-column>
                        <el-table-column prop="username" label="用户名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="email" label="邮件" width="180" sortable>
			</el-table-column>
			<el-table-column prop="addr" label="地址" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="操作" width="350">
				<template slot-scope="scope">
					<el-button size="small" @click="handlerole(scope.$index, scope.row)">绑定</el-button>
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
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="username">
                                        <el-input v-model="editForm.username" auto-complete="off"></el-input>
                                </el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="邮件">
					<el-input v-model="editForm.email" auto-complete="off"></el-input>	
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


               

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="用户名" prop="username">
                                        <el-input v-model="addForm.username" auto-complete="off"></el-input>
                                </el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="邮箱">
			             <el-input v-model="addForm.email" auto-complete="off"></el-input>	
				</el-form-item>
				<el-form-item label="头像">
                                     <el-input v-model="addForm.avatar" auto-complete="off"></el-input>
                                </el-form-item>				
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		

                <!--绑定用户界面-->
                <el-dialog title="绑定权限" :visible.sync="roleVisible">
		     <el-form :model="roleForm" label-width="80px" ref="roleForm">
                            <el-form-item label="权限">
    				<el-checkbox-group v-model="roleForm.city">
      				     <el-checkbox v-for="(item,index) in cities" :label="item.id" :key="item.id" name="city">{{item.name}}</el-checkbox>
    				</el-checkbox-group>
  		    	</el-form-item> 
		           <el-form-item>
    			<el-button type="primary" @click="onSubmit" :loading="RoleLoading">绑定权限</el-button>
    			<el-button @click.native="roleVisible = false">取消</el-button>
  			</el-form-item>	
		      </el-form>
                </el-dialog>


	</section>
</template>

<script>
	import { getUserListPage } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
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
					username: '',
					name: '',
					sex: -1,
					email: '',
					addr: '',
					avatar: ''
				},
				//用户和权限绑定
				roleVisible: false, //绑定界面是否显示
				RoleLoading: false,
				userdata: '',
			        cities: '',	
				roleForm: {	 
					city: []
				}
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
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
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					console.log(res)
					this.total = res.data.total;
					this.users = res.data.users;
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
					removeUser(para.id).then((res) => {
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
					name: '',
					sex: -1,
					email: '',	
					addr: '',
					avatar: ''
				};
			},
			//显示绑定界面
                        handlerole: function(index, row){
				this.roleVisible = true;
				this.getRoles()	
				this.userdata = Object.assign({}, row);
				console.log(this.userdata)
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
							editUser(para.id,para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
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
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
				console.log(sels)
			},
                        //提交绑定用户权限事件
                        onSubmit() {
       			 console.log('submit!');
			 let para = Object.assign({}, this.roleForm)
			 editRoleUser(this.userdata.id,para.city).then((res) => {
                                                                this.RoleLoading = true;
                                                                //NProgress.done();
                                                                this.$message({
                                                                        message: '绑定成功',
                                                                        type: 'success'
                                                                }); 
                                                                this.RoleLoading = false;
								this.roleVisible = false
                                                                this.getUsers();
                                                        });
      			},
			//批量删除
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
			this.getUsers();
		}
	}

</script>


