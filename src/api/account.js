import instance from '@/utils/axios'

export const getTypeListService = () => instance.get('/type/list')

// 获取账单列表
export const getBillListService = (params) =>
  instance.get('/bill/list', {
    params
  })

// 获取账单详情
export const getBillDetailService = (id) => instance.get(`/bill/detail?id=${id}`)
