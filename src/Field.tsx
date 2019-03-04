import {Component} from "react"
import {fieldsMeta, Irule} from "../types"
import {getValueFromEvent} from "./util"
// 解决获取、修改值
// 校验值

const initMeta = {
  trigger: "onChange",
  value: '',
  error: '',
}
class Field {
  [key: string]: any
  private fieldsMeta: fieldsMeta = {}
  private com: Component | null = null

  constructor(com: Component) {
    this.com = com
    ;[ "init", "getValue", "getValues", "getError"].forEach((m: string) => {
      this[m] = this[m].bind(this)
    })
  }

  public init = (name: string, option?: {rule: Irule[]}) => {
    let {rule=[]} = option || {}
    let field = this.get(name)
    if(field){
      return field
    }

    field = this.getInitMeta(name)
    const trigger = field.trigger
    field.value = ''
    field[trigger] = (...args: any[]) => {
      this.callOnChange(name, rule, trigger, ...args) // 修改内部值和校验
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
  private callOnChange = (name: string, rule: Irule[], trigger: string, ...rest: any[] ) => {
    // TODO: 校验与错误重置
    const e = rest[0]
    const field = this.get(name)!
    field.value = getValueFromEvent(e)
    this.validate(name, rule, trigger)
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
  public getError = (name: string) => {
    return (this.get(name)||{} as any).error
  }

  // 因为数据和组件分离了，所以需要 setState({}) 强制组件刷新
  private reRender = () => {
    this.com && this.com.setState({})
  }
  private validate = (name: string, rules: Irule[], trigger: string) => {
    const field = this.get(name)
    if(!field) return

    const value = field.value
    this.exeValidate({value, rules}, (error: string) => {
      field.error = error
      this.reRender()
    })
  }
  private exeValidate = (info:{value: any, rules: Irule[]}, callback: (error: string)=>void) => {
    const {value, rules} = info
    let errorMessage = ''
    for(let i in rules){
      let rule = rules[i]
      if(!rule.validator(value)){
        errorMessage = rule.message
        break
      }
    }
    callback(errorMessage)
  }
}
export default Field
