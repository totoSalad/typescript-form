import {Component} from "react"
import {fieldsMeta} from "../types"
import {getValueFromEvent} from "./util"
// 解决获取、修改值
// 校验值

const initMeta = {
  trigger: "onChange",
  value: ''
}
class Field {
  [key: string]: any
  private fieldsMeta: fieldsMeta = {}
  private com: Component | null = null

  constructor(com: Component) {
    this.com = com
    ;[ "init", "getValue", "getValues"].forEach((m: string) => {
      this[m] = this[m].bind(this)
    })
  }

  // TODO: 增加校验
  public init = (name: string) => {
    let field = this.get(name)
    console.log('stored field', field)
    if(field){
      return field
    }

    field = this.getInitMeta(name)
    const trigger = field.trigger
    field.value = ''
    field[trigger] = (...args: any[]) => {
      this.callOnChange(name, [], trigger, ...args) // 修改内部值和校验
      this.reRender() // 重绘
    }
    return field
  }
  
  public getValues = () => {
    let result: {[key: string]: any} = {}
    Object.keys(this.fieldsMeta).forEach((key: string) => {
      result[key] = this.fieldsMeta[key].value
    })
    return result
  }

  // 修改内部值和校验，统一处理 onChange
  private callOnChange = (name: string, rule: [], trigger: string, ...rest: any[] ) => {
    // TODO: 校验与错误重置
    const e = rest[0]
    const field = this.get(name)!
    field.value = getValueFromEvent(e)
  }

  // 注册/获取 fieldsMeta[name]
  private getInitMeta = (name: string) => {
    if (!(name in this.fieldsMeta)) {
        this.fieldsMeta[name] = Object.assign({}, initMeta)
    }
    return this.fieldsMeta[name]
  }

  private get = (name: string) => {
    return (name in this.fieldsMeta) ? this.fieldsMeta[name] : null
  }
  public getValue = this.get

  // 因为数据和组件分离了，所以需要 setState({}) 强制组件刷新
  private reRender = () => {
    this.com && this.com.setState({})
  }
}
export default Field
