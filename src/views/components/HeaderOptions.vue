<!--
 * @Author: ShawnPhang
 * @Date: 2022-01-12 11:26:53
 * @Description: 顶部操作按钮组
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-08-23 17:33:12
-->
<template>
  <div class="top-title"><el-input v-model="title" placeholder="未命名的设计" class="input-wrap" /></div>
  <div class="top-icon-wrap">
    <template v-if="tempEditing">
      <span style="color: #999; font-size: 14px; margin-right: 0.5rem">{{ stateBollean ? '启用' : '停用' }}</span> <el-switch v-model="stateBollean" @change="stateChange" />
      <div class="divide__line">|</div>
      <el-button plain type="primary" @click="saveTemp">保存模板</el-button>
      <el-button @click="$store.commit('managerEdit', false)">取消</el-button>
      <div class="divide__line">|</div>
    </template>
    <!-- <el-button @click="draw">绘制(测试)</el-button> -->
    <el-button size="large" class="primary-btn" :disabled="tempEditing" @click="save(false)">保存</el-button>
    <copyRight>
      <el-button :loading="loading" size="large" class="primary-btn" :disabled="tempEditing" plain type="primary" @click="download">下载作品</el-button>
    </copyRight>
  </div>
  <!-- 生成图片组件 -->
  <SaveImage ref="canvasImage" />
</template>

<script lang="ts">
import api from '@/api'
import { defineComponent, reactive, toRefs, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { mapGetters, mapActions, useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import _dl from '@/common/methods/download'
import useNotification from '@/common/methods/notification'
import SaveImage from '@/components/business/save-download/CreateCover.vue'
import { useFontStore } from '@/common/methods/fonts'
import copyRight from './CopyRight.vue'
import _config from '@/config'
import {v4 as uuidv4} from 'uuid';

export default defineComponent({
  components: { copyRight, SaveImage },
  props: ['modelValue'],
  emits: ['change', 'update:modelValue'],
  setup(props, context) {
    const { proxy }: any = getCurrentInstance() as ComponentInternalInstance
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      stateBollean: false,
      title: '',
      loading: false,
    })

    // 保存作品
    async function save(hasCover: boolean = false) {
      // Bugs: 历史操作有问题，且page操作未及时入栈 proxy?.dPageHistory
      if (proxy?.dHistory.length <= 0) {
        return
      }
      store.commit('setShowMoveable', false) // 清理掉上一次的选择框
      // console.log(proxy?.dPage, proxy?.dWidgets)
      const { id, tempid } = route.query
      const cover = hasCover ? await proxy?.draw() : undefined
      const widgets = proxy.dWidgets // reviseData()
      let newId = uuidv4().replace(/\-/g, ""); //ilife：需要前端生成ID传递到后端
      // const { id: newId, stat, msg } = await api.home.saveWorks({ 
      let res = await api.home.saveWorks({ 
        cover, 
        id: newId, //id, 
        title: proxy.title || '未命名设计', 
        data: JSON.stringify({ page: proxy.dPage, widgets }), 
        tempId: tempid, 
        width: proxy.dPage.width, 
        height: proxy.dPage.height })
      console.log("save works done", res, id, tempid)
      // res.success ? useNotification('保存成功', '可在"我的作品"中查看') : useNotification('保存失败', res.message, { type: 'error' })
      useNotification('保存成功', res);
      !id && router.push({ path: '/home', query: { id: newId }, replace: true })
      // !id && router.push({ path: '/home', query: { id: id }, replace: true })
      store.commit('setShowMoveable', true)
    }
    // 保存模板
    async function saveTemp() {
      const { tempid } = route.query
      let res = await api.home.saveTemp({ 
        id: tempid, 
        title: proxy.title || '未命名模板', 
        data: JSON.stringify({ 
          page: proxy.dPage, 
          widgets: proxy.dWidgets 
        }), 
        width: proxy.dPage.width, 
        height: proxy.dPage.height 
      })
      useNotification('保存成功', res);
    }
    // 停用启用
    async function stateChange(e: any) {
      const { tempid } = route.query
      let res = await api.home.saveTemp({ id: tempid, state: e ? 1 : 0 })
      useNotification('保存成功', res)
    }
    async function download() {
      console.log("start download image");
      if (state.loading === true) {
        return
      }
      state.loading = true
      context.emit('update:modelValue', true)
      context.emit('change', { downloadPercent: 1, downloadText: '正在处理封面' })
      console.log("try save ...");
      //ilife: 在外部调用时，需要提前融合动态表单数据
      await save(true)
      console.log("save done");
      setTimeout(async () => {
        const { id } = route.query
        if (id) {
          const { width, height } = proxy.dPage
          context.emit('update:modelValue', true)
          context.emit('change', { downloadPercent: 1, downloadText: '准备合成图片' })
          state.loading = false
          let timerCount = 0
          const animation = setInterval(() => {
            if (props.modelValue && timerCount < 75) {
              timerCount += RandomNumber(1, 10)
              context.emit('change', { downloadPercent: 1 + timerCount, downloadText: '正在合成图片' })
            } else {
              clearInterval(animation)
            }
          }, 800)
          console.log("try _dl.downloadImg");
          await _dl.downloadImg(api.home.download({ id, width, height }) + '&r=' + Math.random(), (progress: number, xhr: any) => {
            if (props.modelValue) {
              clearInterval(animation)
              progress >= timerCount && context.emit('change', { downloadPercent: Number(progress.toFixed(0)), downloadText: '图片生成中' })
            } else {
              xhr.abort()
            }
          })
          context.emit('change', { downloadPercent: 100, downloadText: '图片下载中' })
        }
      }, 100)
    }
    function RandomNumber(min: number, max: number) {
      return Math.ceil(Math.random() * (max - min)) + min
    }

    return {
      ...toRefs(state),
      download,
      save,
      saveTemp,
      stateChange,
    }
  },
  computed: {
    ...mapGetters(['dPage', 'dWidgets', 'tempEditing', 'dHistory', 'dPageHistory']),
  },
  methods: {
    ...mapActions(['pushHistory']),
    async load(id: any, tempId: any, cb: Function) {
      if (this.$route.name !== 'Draw') {
        await useFontStore.init() // 初始化加载字体
      }
      const apiName = tempId && !id ? 'getTempDetail' : 'getWorks'
      if (!id && !tempId) {
        cb()
        return
      }
      let { data, title, state } = await api.home[apiName]({ id: id || tempId })
      console.log("got template/works data.", data);
      if (data) {
        data = JSON.parse(data)
        console.log("got parsed data.", data);
        this.stateBollean = !!state
        this.title = title
        this.$store.commit('setShowMoveable', false) // 清理掉上一次的选择框
        // this.$store.commit('setDWidgets', [])
        this.$store.commit('setDPage', data.page)
        id ? this.$store.commit('setDWidgets', data.widgets) : this.$store.dispatch('setTemplate', data.widgets)
        cb()
        this.pushHistory('请求加载load')
      }
    },
    draw() {
      return new Promise((resolve) => {
        this.$refs.canvasImage.createCover(({ key }) => {
          resolve(_config.IMG_URL + key)
        })
      })
    },
  },
})
</script>

<style lang="less" scoped>
.top-icon-wrap {
  display: flex;
  align-items: center;
  padding-right: 20px;
  height: 54px;
  .top-icon {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    color: #ffffff;
    cursor: pointer;
    font-weight: bold;
    margin: 8px;
    padding: 5px 8px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}
.top-title {
  color: @color-black;
  flex: 1;
  padding-left: 88px;
  // font-weight: bold;
  .input-wrap {
    width: 15rem;
    :deep(input) {
      border-color: #ffffff;
      // border-color: #e8eaec;
    }
  }
  .input-wrap:hover {
    :deep(input) {
      border-color: #e8eaec;
    }
  }
}
.primary-btn {
  font-weight: 600;
  transform: scale(0.95);
  margin-left: 10px;
}

.divide__line {
  margin: 0 1rem;
  color: #e8eaec;
  height: 20px;
}
</style>
