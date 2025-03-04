import instance from '@/utils/axios'

export const getTypeListService = () => instance.get('/type/list')

// 获取账单列表
export const getBillListService = (params) =>
  instance.get('/bill/list', {
    params
  })

// 获取账单详情
export const getBillDetailService = (id) => instance.get(`/bill/detail?id=${id}`)

// 添加账单
export const addBillService = (params) => instance.post('/bill/add', params)

// 编辑账单
export const editBillService = (params) => instance.post('/bill/update', params)

// 删除账单
export const delBillService = (id) =>
  instance.post(`/bill/delete`, {
    id
  })

// 获取当月数据
export const getMonthDataService = (curMonth) => instance.get(`/bill/data?date=${curMonth}`)
