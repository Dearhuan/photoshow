/*
 * @Author: ShawnPhang
 * @Date: 2022-11-13 17:34:04
 * @Description: 书架流排版
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-11-13 17:45:51
 * @site: book.palxp.com
 */
const gap = 8 // 图片之间的间隔

export default async (state: any, data: any) => {
  let { offsetWidth: limitWidth } = state.listEl.parentNode
  const list = JSON.parse(JSON.stringify(data))

  const standardHeight = 180 // 高度阈值
  const neatArr: any = [] // 整理后的数组
  function factory(cutArr: any) {
    return new Promise((resolve) => {
      const lineup = list.shift()
      if (!lineup) {
        resolve({ height: calculate(cutArr), list: cutArr })
        return
      }
      cutArr.push(lineup)
      const finalHeight = calculate(cutArr)
      if (finalHeight > standardHeight) {
        resolve(factory(cutArr))
      } else {
        resolve({ height: finalHeight, list: cutArr })
      }
    })
  }
  function calculate(cutArr: any) {
    let cumulate = 0
    for (const iterator of cutArr) {
      const { width, height } = iterator
      cumulate += width / height
    }
    return (limitWidth - gap * (cutArr.length - 1)) / cumulate
  }
  async function handleList() {
    if (list.length <= 0) {
      return
    }
    const { list: newList, height }: any = await factory([list.shift()])
    neatArr.push(
      newList.map((x: any, index: number) => {
        x.w = (x.width / x.height) * height
        x.h = height
        x.m = index ? `0 0 ${gap}px ${gap}px` : `0 0 ${gap}px 0`
        return x
      }),
    )
    if (list.length > 0) {
      await handleList()
    }
  }
  await handleList()

  state.list.length <= 0 && (state.list = neatArr.flat())
  for (let i = 0; i < state.list.length; i++) {
    state.list[i].w = neatArr.flat()[i].w
    state.list[i].h = neatArr.flat()[i].h
    state.list[i].m = neatArr.flat()[i].m
  }
}
