<!--
 * @Author: ShawnPhang
 * @Date: 2022-03-25 15:19:02
 * @Description: 版权声明
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-08-08 10:09:59
-->
<template>
  <tool-tip title="免责声明" :width="340" :content="content">
    <div>
      <slot />
    </div>
  </tool-tip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import toolTip from '@/components/common/PopoverTip.vue'

export default defineComponent({
  components: { toolTip },
  setup() {
    const content = '本系统仅对设计提供支持，请谨慎上传素材，并确保无版权问题。'
    return {
      content,
    }
  },
})
</script>

<style lang="less" scoped>
.text {
  color: #33383e;
  font-size: 14px;
}
</style>
