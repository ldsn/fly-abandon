<template>
<el-row type="flex" class="out-box">
  <el-col class="status">
    <status :response="response"
            :active-index="activeIndex"
            @add="addResponse"
            @delete="deleteResponse"
            @change="changeSchema"></status>
  </el-col>
  <el-col class="schema-content">
    <schema :schema="response[activeIndex]"
            :fullscreen="fullscreen"
            @change="updateResponse">
      <el-tab-pane class="tab-item" label="状态" name="status">
        <status-setting :schema="response[activeIndex]" @change="updateStatus"></status-setting>
      </el-tab-pane>
    </schema>
  </el-col>
</el-row>
</template>

<script>
import Schema from '../schema/Index'
import Status from './Status'
import StatusSetting from './StatusSetting'
import R from 'ramda'
export default {
  props: {
    response: {
      type: Array,
      required: true
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Status,
    StatusSetting,
    Schema
  },
  data () {
    return {
      activeIndex: 0
    }
  },
  methods: {
    changeSchema (index) {
      this.activeIndex = index
    },
    deleteResponse (index) {
      this.$store.commit('DELETE_API_RESPONSE', index)
      if (this.activeIndex !== 0) {
        this.activeIndex --
      }
    },
    addResponse () {
      this.$store.commit('ADD_API_RESPONSE')
      this.activeIndex = this.response.length - 1
    },
    updateStatus ({ status, statusText }) {
      const schema = R.clone(this.response[this.activeIndex])
      schema.status = status
      schema.statusText = statusText
      this.updateResponse(schema)
    },
    updateResponse (schema) {
      const key = `options.response.${this.activeIndex}`
      this.$store.commit('UPDATE_API_PROPS',
               [key, R.clone(schema)])
    }
  }
}
</script>
<style lang="less">
.out-box {
  height: 300px;

  .el-col {
    position: relative;
  }
  .el-col.status {
    position: relative;
    min-width: 150px;
    max-width: 150px;
    height: 100%;
    overflow-y: auto;
  }
}
.fullscreen {
  .out-box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .schema-content{
    height: auto;
  }
}
</style>
