import React, { MouseEvent } from "react"
import Field from "../src/Field"

/**
 * 数据更新与获取
 */
export default class Demo extends React.Component<{}, {}> {
  public field = new Field(this)

  public handleSubmit = (e: MouseEvent) => {
    e.preventDefault()
    // 获取数据
    console.log(this.field.getValues())
  }
  public render() {
    const {init} = this.field
    // tslint:disable-next-line:jsx-wrap-multiline
    return <form>
        username: <input {...init("username", {rule: [{validator: (value) => value!=='ckb', message: '不能输入ckb哦'}]})} />
        <span style={{display: 'block'}}>{this.field.getError('username')}</span>
        passowrd: <input {...init("password")} />
        <span style={{display: 'block'}}>{this.field.getError('password')}</span>
        <button onClick={this.handleSubmit} >submit</button>
    </form>
  }
}
