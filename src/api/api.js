import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`${base}/devops/api/v1.0/login`, params).then(res => res.data); };

export const getUserListPage = params => { return axios.get(`${base}/devops/api/v1.0/user`, { params: params }); };

export const addUser = params => { return axios.post(`${base}/devops/api/v1.0/user`, { params: params  });  };

export const removeUser = id => { return axios.delete(`${base}/devops/api/v1.0/user/${id}`);  };

export const getRoleList = params => { return axios.get(`${base}/devops/api/v1.0/role`, { params: params  });  };

export const addRole = params => { return axios.post(`${base}/devops/api/v1.0/role`, { params: params   });   }; 

export const editUser = (id,params) => { return axios.put(`${base}/devops/api/v1.0/user/${id}`, { params: params  });  };

export const removeRole = id => { return axios.delete(`${base}/devops/api/v1.0/role/${id}`);   };

export const editRole = (id,params) => { return axios.put(`${base}/devops/api/v1.0/role/${id}`, { params: params   });   };

export const editRoleUser = (id,params) => { return axios.put(`${base}/devops/api/v1.0/editRoleUser/${id}`, { params: params  });  };
