<template>
	<section>
             <div class="toolbar">

  <el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column
      prop="name"
      label="项目名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="comment"
      label="项目概述"
      width="180">
    </el-table-column>
    <el-table-column
      prop="repo"
      label="项目地址">
    </el-table-column>
  </el-table>
  </div>
  </section>
</template>

<script>
  import {  getProject  } from '../../api/api';
  export default {
    data() {
      return {
        tableData: [{
          name: '',
          comment: '',
          repo: ''
        }]
      }
    },
  methods: {
          getProjects() {
	      getProject().then((res) => {
	      console.log(res)			
	      this.tableData = res.data.project;
	      this.listLoading = false;																													//NProgress.done();
			});			
	     },

    },
      mounted() {
          this.getProjects();
       }
  }
</script>
