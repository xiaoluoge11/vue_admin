<template>
 <el-row :gutter="20">
  <el-col :span="12">
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="企业微信" name="first">
        <el-form  label-width="80px" :model="formLabelAlign">
  		<el-form-item label="主题">
    		<el-input v-model="formLabelAlign.name"></el-input>
  		</el-form-item>
  		<el-form-item label="接收人">
    		<el-input v-model="formLabelAlign.region"></el-input>
  		</el-form-item>
		<el-form-item>
    		<el-button type="primary" @click="onSubmit">发送</el-button>	
  		</el-form-item>
	</el-form>	    
    
    </el-tab-pane>
    <el-tab-pane label="邮件" name="second">
      <el-form  label-width="80px" :model="formLabelAlign">
                <el-form-item label="主题">
                <el-input v-model="formLabelAlign.name"></el-input>
                </el-form-item>
                <el-form-item label="接收人">
                <el-input v-model="formLabelAlign.region"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="onSubmit">发送</el-button>            
                </el-form-item>
        </el-form>   
    
    </el-tab-pane>
    <el-tab-pane label="短信" name="third">
        <el-form  label-width="80px" :model="formLabelAlign">
                <el-form-item label="主题">
                <el-input v-model="formLabelAlign.name"></el-input>
                </el-form-item>
                <el-form-item label="接收人">
                <el-input v-model="formLabelAlign.region"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="onSubmit">发送</el-button>            
                </el-form-item>
        </el-form> 
     </el-tab-pane> 
  </el-tabs>
  </el-col>
  </el-row>
</template>
<script>
  import { getUserListPage,getProject,getProject_tags,addApply  } from '../../api/api';
  export default {
    data() {
      return {
        activeName: 'first',
        formLabelAlign: {
          name: '',
          region: '',
          type: ''
        }	
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      onSubmit() {
		 console.log('submit!');
		 let para = Object.assign({}, this.formLabelAlign)	
			console.log(para)
			addApply(para).then((res) => {
			this.RoleLoading = true;
			this.$message({
				message: '添加成功，已发送审批邮件',
				type: 'success'
			});
			      this.$router.push({path: 'ApplyList'})	
			});
		},
    }
  };
</script>
