<template>
	<section>
             <div class="toolbar">

  <el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column
      prop="hostname"
      label=""
      width="180">
    </el-table-column>
    <el-table-column
      prop="ip"
      label=""
      width="180">
    </el-table-column>
    <el-table-column
      prop="comment"
      label="">
    </el-table-column>
   <el-table-column
     prop="status"
     label="">  
    </el-table-column>
    <el-table-column   
       prop="alert_status"    
       label="">    
   </el-table-column>

  </el-table>
  </div>
  </section>
</template>

<script>
  import {  getAlerts  } from '../../api/api';
  export default {
    data() {
      return {
        tableData: [{
          name: '',
          comment: '',
          ip: '',
	  status:'',
	  alert_status:'',
        }]
      }
    },
  methods: {
          getAlerts() {
	      getAlerts().then((res) => {
	      console.log(res)			
	      this.tableData = res.data;
	      this.listLoading = false;																													//NProgress.done();
			});			
	     },

    },
      mounted() {
          this.getAlerts();
       }
  }
</script>
