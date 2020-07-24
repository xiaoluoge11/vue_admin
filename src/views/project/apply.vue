<template>
	<section>
	   <div class="toolbar">
		<el-form ref="form" :model="form" label-width="100px">
		  <el-form-item label="选择项目">
		     <el-select v-model="form.name" placeholder="Projects" style="width:700px" @change="selectOne">
  			<el-option v-for="(item,index) in project_data" :label="item.name" :key="item.id" :value="item.id">{{item.name}}</el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="项目版本">
		    <el-select v-model="form.tag" placeholder="Tags" style="width:700px">
			<el-option v-for="(item,index) in tags" :label="item" :key="item" :value="item">{{item}}</el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="发布信息" style="width:700px">
			<el-input v-model="form.comment"></el-input>
		  </el-form-item>
                  <el-form-item label="指派给">
                      <el-select v-model="form.userid" style="width:700px">
			   <el-option v-for="(item,index) in option_data" :label="item.username" :key="item.id" :value="item.id">{{item.username}}</el-option>
                      </el-select> 
                  </el-form-item>
 
		  <el-form-item>
		    <el-button type="primary" @click="onSubmit">发布</el-button>
		  </el-form-item>
		</el-form> 
           </div>	
	</section>
</template>

<script>
  import { getUserListPage,getProject,getProject_tags,addApply } from '../../api/api';
export default {
  data() {
     return {
	form: {
	  name: '', 
	  comment: '',
	  userid:'',
	},
        option_data: [],
        project_data: [],
	tags: []
    }
  },
methods: {
	getUsers() {
		getUserListPage().then((res) => {
			this.option_data = res.data.users;
			//this.listLoading = false;
			//NProgress.done();
		});
	},
        getProjects() {
	      getProject().then((res) => {
	      console.log(res.data.project)
	      this.project_data = res.data.project;
	      this.listLoading = false;																	 //NProgress.done();
			});			
	     },
	get_tags(id){
	      getProject_tags(id).then((res) => {
	      this.tags = res.data.tag; 
	    });   
	},
        onSubmit() {
		 console.log('submit!');
		 let para = Object.assign({}, this.form)	
			addApply(para).then((res) => {
			this.RoleLoading = true;
			this.$message({
				message: '添加成功，已发送审批邮件',
				type: 'success'
			});
			      this.$router.push({path: 'ApplyList'})	
			});
		},
        selectOne(item) {
	    this.get_tags(item);
         },
    }, 
    mounted() {
            this.getUsers();
	    this.getProjects();
	} 
  }
</script>
