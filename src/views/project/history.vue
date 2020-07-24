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
					<el-button size="small" v-if="scope.row.userid==scope.row.user" type="primary"  @click="handleEdit(scope.$index, scope.row)">详情</el-button> 
				</template>
			</el-table-column>
		</el-table>
                <br>
                	<el-col :span="24">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col> 
		
	        <el-dialog
  			title="jenkins 结果"
  			:visible.sync="historyVisible"
  			width="200%"
  		center>
  		<pre>{{history}}</pre>
  		<span slot="footer" class="dialog-footer">
    		<el-button @click="historyVisible = false">取 消</el-button>
    		<el-button type="primary" @click="historyVisible = false">确 定</el-button>
  		</span>
		</el-dialog>	

              </div>
	</section>
</template>

<script>
	import {  getApply,UpdateApply_status,ChangStatus,getHistory } from '../../api/api';
        import moment from 'moment'
	export default {
		data() {
			return {
				historyVisible:false,	
				history:'',
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
                            getHistory(row.id).then((res) => {
					let a = JSON.parse(res.data);
					this.historyVisible=true;
					this.history=a;
				}); 
		 	},
	        },
		mounted() {
			this.getApplyList();
		}
	}

</script>

