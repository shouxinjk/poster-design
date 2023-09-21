/*
 * @Author: ShawnPhang
 * @Date: 2021-08-19 18:43:22
 * @Description:
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-24 13:01:10
 */
import fetch from '@/utils/axios'
import _config from '@/config'

// const screenshot_url = window.location.protocol + '//' + window.location.host + '/draw'
//TODO ilife： 需要接受动态表单参数，调整为POST方法？？
export const download = (params: Type.Object = {}) => `${_config.SCREEN_URL}/api/screenshots?id=${params.id}&width=${params.width}&height=${params.height}`

// 获取模板列表
export const getTempList = (params: Type.Object = {}) => fetch('erp/designTemplate/list', params, 'get')
export const getTempDetail = (params: Type.Object = {}) => fetch('erp/designTemplate/queryById', params, 'get')
export const getCategories = (params: Type.Object = {}) => fetch('erp/designCategory/rootList', params, 'get')
// 保存模板
export const saveTemp = (params: Type.Object = {}) => {
  console.log("try save template.", params);
  if( params.id && params.id.trim().length>0){
    console.log("try update existed template.", params);
    fetch('erp/designTemplate/edit', params, 'post')
  }else{
    console.log("try add new template.", params);
    fetch('erp/designTemplate/add', params, 'post')
  }
}
// export const delTemp = (params: Type.Object = {}) => fetch('/api/template/temp_del', params)

// 组件相关接口：与designTemplate是相同接口，通过参数中的type区分
export const getCompList = (params: Type.Object = {}) => fetch('erp/designTemplate/list', params, 'get')
export const removeComp = (params: Type.Object = {}) => fetch('erp/designTemplate/delete', params, 'post')
// export const getCompDetail = (params: Type.Object = {}) => fetch('/api/template/temp_info', params, 'get')

// 保存作品
export const saveWorks = (params: Type.Object = {}) => fetch('erp/designWorks/add', params, 'post')

// 保存个人模板
export const saveMyTemp = (params: Type.Object = {}) => fetch('design/user/temp', params, 'post')

// 获取作品：注意是获取单个作品
export const getWorks = (params: Type.Object = {}) => fetch('erp/designWorks/queryById', params, 'get')

// 作品列表
// export const getMyDesign = (params: Type.Object = {}) => fetch('design/my', params, 'get')
export const getMyDesign = (params: Type.Object = {}) => fetch('erp/designWorks/list', params, 'get')
