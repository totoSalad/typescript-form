export interface filedMeta{
  [keys: string]: any,
  value?: any,
  error?: string,
  trigger: string
}

export interface fieldsMeta{
  [keys: string]: filedMeta
}

export interface Field{
  fieldsMeta: fieldsMeta
  // 注册数据，返回 onChange/value
  init(name: string):{}
}
