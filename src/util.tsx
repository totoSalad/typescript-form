
const getValueFromEvent = (e: Event | any) => {
  if (!e || !e.target) {
    return e
  }

  const { target } = e

  if (target.type === "checkbox") {
      return target.checked
  } else if (target.type === "radio") {
      // 兼容原生radioGroup
      if (target.value) {
          return target.value
      } else {
          return target.checked
      }
  }
  return target.value
}
export { getValueFromEvent }
