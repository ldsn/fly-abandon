<template>
  <div class="param set" :class="name">
    <el-row type="flex" class="row-bg" >
      <el-col class="key">
        <el-input placeholder="key" v-model="param.key" @change="lazyUpdate"></el-input>
      </el-col>
      <el-col class="config">
        <el-cascader
          v-if="name !== 'headers'"
          popper-class="type-cascader"
          @change="changeParamType"
          :options="tpyeList"
          v-model="apiType">
        </el-cascader>
        <el-checkbox v-model="param.required" @change="update">必填</el-checkbox>
      </el-col>
      <el-col class="comment">
        <el-input placeholder="备注" v-model="param.comment" @change="lazyUpdate"></el-input>
      </el-col>
      <el-col class="example">
        <el-input placeholder="示例" v-model="example" @change="lazyUpdate"></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { debounce } from '@/util'
export default {
  props: {
    param: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: false
    }
  },
  computed: {
    example: {
      get () {
        return typeof this.param.example === 'string' ? this.param.example : JSON.stringify(this.param.example)
      },
      set (value) {
        if (this.param.type === 'string') {
          this.param.example = value
        } else {
          try {
            this.param.example = JSON.parse(value)
          } catch (err) {
            this.param.example = value
          }
        }
      }
    },
    apiType () {
      const type = [this.param.type]
      if (this.param.type === 'array') {
        type.push(this.param.items.type)
      }
      return type
    },
    tpyeList () {
      return this.getTypeList()
    }
  },
  data () {
    return {
      selectedOptions: [],
      lazyUpdate: debounce(this.update, 300)
    }
  },
  methods: {
    lazy (fn) {
      return debounce(fn, 300)
    },
    changeParamType (val) {
      this.$set(this.param, 'type', val[0])
      if (val[0] === 'object') {
        if (!this.param.params) {
          this.$set(this.param, 'params', [{
            key: null,
            type: 'string',
            required: true
          }])
        }
        this.$emit('buildObject', this.param)
      } else if (val[0] === 'array') {
        this.setArrayType(val[1])
      }
      this.update()
    },
    setArrayType (type) {
      this.$set(this.param, 'items', {
        type
      })
      if (type === 'object' && !this.param.items.params) {
        this.$set(this.param.items, 'params', [{
          key: null,
          type: 'string',
          required: true
        }])
        this.$emit('buildObject', this.param)
      }
    },
    update () {
      this.$emit('change', this.param)
    },
    getDefaultType () {
      const type = [this.param.type]
      if (this.param.type === 'array') {
        type.push(this.param.items.type)
      }
      return type
    },
    getTypeList () {
      const types = []
      if (this.name === 'query' || this.name === 'path') {
        types.push('String', 'Number', 'Boolean')
      } else {
        types.push('String', 'Number', 'Boolean', 'Object', 'Array')
        if (this.name === 'body') {
          types.push('File')
        }
      }
      return types.map(t => {
        const type = {
          value: t.toLowerCase(),
          label: t
        }
        if (t === 'Array') {
          type.children = ['String', 'Number', 'Boolean', 'Object'].map(t => ({
            value: t.toLowerCase(),
            label: t
          }))
        }
        return type
      })
    }
  }
}
</script>
<style lang="less">
.type-cascader .el-cascader-menu {
  height: auto;
}
.param.set .el-checkbox {
  height: 36px;
  line-height: 35px;
}
.params-box {
  .config {
    min-width: 220px;
    max-width: 220px;
  }
  .headers .config {
    min-width: 80px;
    max-width: 80px;
    text-align: center;
  }
  .example {
    min-width: 145px;
    max-width: 220px;
  }
  .comment {
    margin-right: 20px;
    min-width: 145px;
    max-width: 240px;
  }
  .key {
    min-width: 100px;
  }
  .el-input__inner {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #EFF2F7;
    font-family: monospace;
  }
  .el-input-number {
    width: 100%;
  }
  .el-select {
    margin-right: 20px;
  }
}

</style>
