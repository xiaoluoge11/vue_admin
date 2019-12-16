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

export const getServerList = params => { return axios.get(`${base}/devops/api/v1.0/server`, { params: params  });  };

export const editServer = (id,params) => { return axios.put(`${base}/devops/api/v1.0/server/${id}`, { params: params    });    };

export const removeServer = id => { return axios.delete(`${base}/devops/api/v1.0/server/${id}`);    };

export const addProduct = params => { return axios.post(`${base}/devops/api/v1.0/product`, { params: params    });    };

export const getProduct = params => { return axios.get(`${base}/devops/api/v1.0/product`, { params: params   });   };

export const editProduct = (id,params) => { return axios.put(`${base}/devops/api/v1.0/product/${id}`, { params: params   });   };

export const removeProduct = id => { return axios.delete(`${base}/devops/api/v1.0/product/${id}`);     };

export const addService = params => { return axios.post(`${base}/devops/api/v1.0/service`, { params: params     });     };

export const getService = params => { return axios.get(`${base}/devops/api/v1.0/service`, { params: params    });    };

export const get_Pid_Product = params => { return axios.get(`${base}/devops/api/v1.0/get_pid_product`, { params: params     });};

export const removeService = id => { return axios.delete(`${base}/devops/api/v1.0/service/${id}`);      };

export const editService = (id,params) => { return axios.put(`${base}/devops/api/v1.0/service/${id}`, { params: params    });    };

export const getTree = params => { return axios.get(`${base}/devops/api/v1.0/getTree`, { params: params  });  };

export const getCpu = params => { return axios.get(`${base}/devops/api/v1.0/cpu`, { params: params     });     };

export const getMemory = params => { return axios.get(`${base}/devops/api/v1.0/memory`, { params: params      });      };

export const getNetwork = params => { return axios.get(`${base}/devops/api/v1.0/network`, { params: params       });       };

export const getZabbixConfig = params => { return axios.get(`${base}/devops/api/v1.0/zabbixconfig`, { params: params  });  };

export const addZabbixConfig = params => { return axios.post(`${base}/devops/api/v1.0/zabbixconfig`, { params: params }); };

export const removeZabbixConfig = id => { return axios.delete(`${base}/devops/api/v1.0/zabbixconfig/${id}`); };

export const getZabbixTree = params => { return axios.get(`${base}/devops/api/v1.0/getZabbixTree`, { params: params }); };

export const GetSyncIp = params => { return axios.get(`${base}/devops/api/v1.0/Sync`, { params: params  });  };

export const SyncHost = params => { return axios.post(`${base}/devops/api/v1.0/Sync`, { params: params   });   };

export const GetGroup = params => { return axios.get(`${base}/devops/api/v1.0/getgroup`, { params: params   });   };

export const getTemplate = params => { return axios.get(`${base}/devops/api/v1.0/template`, { params: params    });    };

export const addHost_temlpate = (ids,params) => { return axios.post(`${base}/devops/api/v1.0/template`, { params: params,ids: ids   });  };

export const getProduct_Ip = params => { return axios.get(`${base}/devops/api/v1.0/getProduct_Ip`, { params: params     });     };

export const getZabbixList = params => { return axios.get(`${base}/devops/api/v1.0/zabbixlist`, { params: params     });     };

export const CreateMaintenance = params => { return axios.post(`${base}/devops/api/v1.0/maintenance`, { params: params    });    };

export const DeleteMaintenance = id => { return axios.delete(`${base}/devops/api/v1.0/maintenance/${id}`);  };

export const addGongdan = params => { return axios.post(`${base}/devops/api/v1.0/gongdan`, { params: params  });  };

export const getGongdan = params => { return axios.get(`${base}/devops/api/v1.0/gongdan`, { params: params   });   };

export const UpdateGongdan = id => { return axios.put(`${base}/devops/api/v1.0/gongdan/${id}`);   };

export const FinshGongdan = id => { return axios.put(`${base}/devops/api/v1.0/finsh/${id}`);    };

export const BohuiGongdan = (ids,params) => { return axios.post(`${base}/devops/api/v1.0/bohuigongdan`, { params: params,id: ids }) }
