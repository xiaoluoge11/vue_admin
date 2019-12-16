import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Role from './views/nav1/role.vue'
import Usermanager from './views/nav1/usermanage.vue'
import Form from './views/nav1/Form.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import Cpu   from './views/nav3/Cpu.vue'
import Memory from './views/nav3/Memory.vue'
import echarts from './views/charts/echarts.vue'
import Server  from './views/nav2/server.vue'
import Product from './views/nav2/product.vue'
import Service from './views/nav2/service.vue'
import Template from './views/nav2/template.vue'
import Config_zabbix from './views/nav3/zabbix_config.vue'
import HostDetail from './views/nav3/HostDetail.vue'
import zabbix_host from './views/nav3/zabbix_host.vue'
import network from './views/nav3/network.vue'
import Job from './views/nav4/job.vue'
import JobList from './views/nav4/joblist.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
];

export default routes;


export const powerRouter = [
    {
        path: '/',
        component: Home,
        name: '用户权限管理',
        iconCls: 'el-icon-message',//图标样式classi
        role:['admin','user'],
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/role', component: Role, name: '权限管理' }, 
            { path: '/user', component: Usermanager, name: '用户管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '资产管理',
        iconCls: 'fa fa-id-card-o',
	role: ['admin'],
        children: [
	    { path: '/Server', component: Server, name: '资产信息' },
            { path: '/Product', component: Product, name: '业务线' },
            { path: '/Service', component: Service, name: '服务线' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'zabbix管理',
        iconCls: 'fa fa-address-card', 
	role: ['admin'],
        children: [ 
	    { path: '/zabbix', component: Config_zabbix, name: 'zabbix配置'  },
	    { path: '/zabbixlist', component: zabbix_host, name: '主机列表'   },
	    { path: '/template', component: Template, name: '模板绑定'   },
	    { path: '/hostdetail', component: HostDetail, name: 'HostDetail'   }
        ]
    },
    {  
        path: '/',
        component: Home,
        name: '工单管理',
        iconCls: 'fa fa-bar-chart',
        role: ['admin','user'],
        children: [
            { path: '/job', component: Job, name: '申请工单' },
	    { path: '/JobList', component: JobList, name: '工单列表'  }
        ]   
    },  
];

