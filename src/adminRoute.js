export const adminRoutersTable=[
	  { path: '/admin',name: 'adminPage1', component:  () => import('@/views/nav1/admin.vue') },	
	  { path: '*',name: '404', component:  () => import('@/views/404.vue')  }	
]
