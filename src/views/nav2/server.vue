<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getServers">查询</el-button>
				</el-form-item>	
			         <el-form-item>
                                        <el-button type="primary" @click="handlesync">同步zabbix</el-button>
                                </el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="server" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			 </el-table-column>
                        <el-table-column prop="hostname" label="主机名" width="100" sortable>
			</el-table-column>
			<el-table-column prop="ip" label="IP地址" width="140" sortable>
			</el-table-column>
			<el-table-column prop="disk" label="磁盘" width="100"  sortable>
			</el-table-column>
			<el-table-column prop="cpu" label="CPU型号" width="330" sortable>
			</el-table-column>
			<el-table-column prop="memory" label="内存" min-width="100" sortable>
			</el-table-column>
			<el-table-column prop="os" label="操作系统" min-width="260" sortable>
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
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="主机名" prop="hostname">
					<el-input v-model="editForm.hostname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="IP地址" prop='ip'>
					<el-input  v-model="editForm.ip"></el-input>
				</el-form-item>
                                <el-form-item label="操作系统" prop='os'>                           
                                     <el-input  v-model="editForm.os"></el-input>
                                </el-form-item>
                                <el-form-item label="CPU" prop='cpu'>                           
                                <el-input  v-model="editForm.cpu"></el-input>
                                  </el-form-item>
                                <el-form-item label="磁盘大小" prop='disk'>                           
                                  <el-input  v-model="editForm.disk"></el-input>
                               </el-form-item>
                                <el-form-item label="内存" prop='memory'>                           
                                  <el-input  v-model="editForm.memory"></el-input>
                              </el-form-item>                        
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

                  <!--数据同步界面-->
                <el-dialog title="同步数据" :visible.sync="syncVisible">
                      <el-form ref="form" :model="syncForm" label-width="80px">
			<el-row>	
			<el-col :span="12">
	                  <el-form-item label="主机列表">
                                <el-checkbox-group v-model="syncForm.hosts">
      				<el-checkbox v-for="ip in ips" :label="ip" :key="ip">{{ip}}</el-checkbox>	
    			</el-checkbox-group>	
			</el-form-item>
			</el-col>
			<el-col :span="12">
  			<el-form-item label="组名">
    			<el-select v-model="syncForm.value">	
				<el-option v-for="(item,index) in options" :label="item.name" :key="item.groupid" :value="item.groupid">{{item.name}}</el-option>	
    	                    </el-select>
  		</el-form-item>
		</el-col>
		</el-row>
  		<el-form-item>
    			<el-button type="primary" @click="onSubmit">同步主机</el-button>
    			<el-button  @click.native="syncVisible = false">取消</el-button>
  		</el-form-item>
		</el-form>		   
           </el-dialog>





	</section>
</template>

<script>
	import util from '../../common/js/util'
	import {  getServerList, editServer, removeServer, GetSyncIp, GetGroup, SyncHost } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				server: [],
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
				//数据同步
				syncVisible: false, //绑定界面是否显示
				RoleLoading: false,
				ips: [],
				temps: ['linux_server','host'],
				options: [],
				value: '',
				syncForm: {	 
					hosts: [],
          				value: '' 
				}
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getServers();
			},
			 handleCheckedCitiesChange(value) {
        			let checkedCount = value.length;
        			this.checkAll = checkedCount === this.cities.length;
        			this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      			},
			//获取用户列表
			getServers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getServerList(para).then((res) => {
					console.log(res)
					this.total = res.data.total;
					this.server = res.data.server;
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
					removeServer(para.id).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getServers();
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
                        handlesync: function(index, row){
				this.syncVisible = true;
				this.GetSyncIp()
				this.GetGroup()
				this.syncForm = {
                                        hosts: [],
          			        value: ''
				}
                        },
			//获取权限列表，绑定到用户
                        GetSyncIp () {
                                GetSyncIp().then((res) => {
					console.log(res.data)	
                                        this.ips = res.data 
                             
                          	})
			  },
			//获取zabbix模板
			 GetGroup () {
                                GetGroup().then((res) => {
                                        console.log(res.data) 
					this.options = res.data

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
							editServer(para.id,para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getServers();
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
								this.getServers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
                        //提交绑定用户权限事件
                        onSubmit() {
       			 console.log('submit!');
			 let para = Object.assign({}, this.syncForm)	
			 	SyncHost(para).then((res) => {
                                                                this.RoleLoading = true;
                                                                //NProgress.done();
                                                                this.$message({
                                                                        message: '绑定成功',
                                                                        type: 'success'
                                                                }); 
                                                                this.RoleLoading = false;
								this.syncVisible = false
                                                                this.getServers();
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
						this.getServers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getServers();
		}
	}

</script>


