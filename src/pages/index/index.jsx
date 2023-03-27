import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import style from './index.module.scss'
import Taro from '@tarojs/taro';
import logo from '../../img/img.png'

export default class Index extends Component {

  render () {
    return (
      <View className={style.container}>
        <View className={style.logo_warp}>
          <Image
            style='width: 100px;height:100px;'
            src={logo}
          />
          <Text className={style.logo_title}>欢迎使用卡方臣小程序</Text>
        </View>
        <View className={style.contentItem}>
          <Button type="primary" block size='large' icon='search' onClick={() => {
            Taro.navigateTo({
              url: '/pages/orderByCar/index',
            })
          }}>
            按车型查询
          </Button>
          <View className={style.borderContent}>
          </View>
          <Button type="primary" block size='large' icon='search' onClick={() => {
            Taro.navigateTo({
              url: '/pages/orderByMoth/index',
            })
          }}>
            按月供金额查询
          </Button>
          <View className={style.borderContent}>
          </View>
        </View>
      </View>
    )
  }
}
