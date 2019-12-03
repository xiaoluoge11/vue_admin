<template>
 <section>
 <div class="toolbar"> 
  <el-row :gutter="21">
  <el-col :span="6">
    <el-card shadow="always">
	<el-tree :data="data"  default-expand-all :props="defaultProps" @node-click="handleNodeClick"></el-tree> 
    </el-card>
  </el-col>
  <el-col :span="18">
   <el-row :gutter="6">
    <el-card shadow="always">
 	      <el-col :gutter="6">
                        <el-form :inline="true" :model="search" size="mini">
                                <el-form-item>
                                        <el-input v-model="search.name" placeholder="搜索"></el-input>
                                </el-form-item>
                                <el-form-item>
                                        <el-button type="success" v-on:click="onconfig">zabbix配置</el-button>
                                </el-form-item>
                                <el-form-item>
                                        <el-button type="primary" @click="handleAdd">配置刷新</el-button>
                                </el-form-item>
                        </el-form>
                </el-col>

              <el-col>
		  <div v-show="show">
                        <el-form :inline="true" :model="zabbix_config" size="mini">
                                <el-form-item>
                                        <el-input v-model="zabbix_config.name" placeholder="名称"></el-input>
                                </el-form-item> 
                                <el-form-item>
                                        <el-input v-model="zabbix_config.url" placeholder="zabbix_url"></el-input> 
                                </el-form-item>
                                <el-form-item>
                                        <el-input v-model="zabbix_config.username" placeholder="zabbix_用户名"></el-input> 
                                </el-form-item>
                                <el-form-item>
                                        <el-input v-model="zabbix_config.password" placeholder="zabbix_密码"></el-input>
                                </el-form-item>
                                <el-form-item>
                                       <el-button type="primary" v-on:click="addconfig">测试保存</el-button> 
                                </el-form-item>
                        </el-form>
			</div>
                </el-col>
		
		<!--列表-->
                 <el-table :data="zabbix" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
                        <el-table-column type="selection">
                        </el-table-column>
                        <el-table-column type="index">
                         </el-table-column>
                        <el-table-column prop="name" label="zabbix名称"  sortable>
                        </el-table-column>
                        <el-table-column prop="url" label="zabbix地址"  sortable>
                        </el-table-column>
                        <el-table-column prop="username" label="zabbix用户名"  sortable>
                        </el-table-column>
                        <el-table-column prop="password" label="zabbix密码"  sortable>
                        </el-table-column>
                        <el-table-column label="操作">
                                <template slot-scope="scope">
                                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                        <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                                </template> 
                        </el-table-column>
                </el-table> 
    </el-card>
   </el-row>
  </el-col>
 </el-row>
 </div>
</section>
</template>

<script>
    import util from '../../common/js/util' 
    import { getZabbixConfig , addZabbixConfig , removeZabbixConfig, getZabbixTree } from '../../api/api';
  export default {
    data() {
      return {
         search: {
              name: ''
         },
         zabbix_config: {
	     name: '',
             url: '',
             username: '',	
             password: ''
	},
	show: false,
        listLoading: false,
	zabbix: [],
        data: [{
          label: 'zabbix',
          children: [{
            label: 'linux_server',
            children: [{
              label: 'linux_template'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      },
       selsChange: function (sels) {
            this.sels = sels;
      },
      onconfig(){
         this.show=true
       },
      	getTree() {	
	    getZabbixTree().then((res) => {
		this.data = res.data;
	   });
	},
      handleAdd(){	
	  this.getTree()
	},
      addconfig(){
	    let para = Object.assign({}, this.zabbix_config); 
            addZabbixConfig(para).then((res) => {
		console.log(res.data.code)
		if (res.data.code === 0) {
                    this.addLoading = false; 
                    this.$message({
                         message: '提交成功',
                         type: 'success'
                        });
		   }   
		else{
		  this.$message({
                         message: res.data.msg,
                         type: 'warning'
                        });			
		}
	this.getzabbix();
        this.show=false;
	});
    },
    getzabbix() { 
            getZabbixConfig().then((res) => {
			console.log(res.data)  
                     this.zabbix = res.data.zabbix; 
                         });
   },
  handleDel: function (index, row) {
             this.$confirm('确认删除该记录吗?', '提示', {
                         type: 'warning'
                 }).then(() => {
                     this.listLoading = true; 
                     let para = { id: row.id };
                     removeZabbixConfig(para.id).then((res) => {
                         this.listLoading = false; 
                         this.$message({
                              message: '删除成功',
                              type: 'success'
                             });
                         this.getzabbix();
                        });
                }).catch(() => {
        });
    }
  },
  mounted() {
         this.getzabbix();
         this.getTree();	  
      } 

}
</script>

