/*
 * @Author: ShawnPhang
 * @Date: 2021-08-27 14:42:15
 * @Description:
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-21 11:19:04
 */
import fetch from '@/utils/axios'

// 获取素材分类：
export const getKinds = (params: Type.Object = {}) => fetch('erp/designCategory/rootList', params)

// 获取素材列表：
export const getList = (params: Type.Object = {}) => fetch('erp/designMaterial/list', params)

// 获取字体
export const getFonts = (params: Type.Object = {}) => fetch('erp/designFonts/list', params)
export const getFontSub = (params: Type.Object = {}) => fetch('design/font_sub', params) //ilife: pending replace

// 图库列表
export const getImagesList = (params: Type.Object = {}) => fetch('erp/designImage/list', params, 'get')

// 我的上传列表
export const getMyPhoto = (params: Type.Object = {}) => fetch('design/user/image', params) //ilife: pending replace
export const deleteMyPhoto = (params: Type.Object = {}) => fetch('design/user/image/del', params, 'post') //ilife: pending replace

// 添加图片
export const addMyPhoto = (params: Type.Object = {}) => fetch('design/user/add_image', params) //ilife: pending replace
