import { Component } from 'react'
import { View } from '@tarojs/components'
import { SearchBar, Skeleton } from '@nutui/nutui-react-taro'
import PinyinMatch from 'pinyin-match';  // es
import ListCom from '../../component/listUI';
import Taro from '@tarojs/taro';

export default class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      loading: true
    }
    this.listData = [];
    this.debounce = function(func, delay) {
      let timer;  // 定时器

      return function () {
        let context = this;  // 记录 this 值,防止在回调函数中丢失
        let args = arguments;  // 函数参数

        // 标识是否立即执行
        let isImmediately = !timer;

        //如果定时器存在，则清除定时器(如果没有,也没必要进行处理)
        timer ? clearTimeout(timer) : null;

        timer = setTimeout(() => {
          timer = null;
        }, delay);

        // isImmediately 为 true 则 执行函数(即首次触发事件)
        isImmediately ? func.apply(context, args) : null;
      }
    }
    this.keyChange = this.debounce(this.dChange, 250);
  }

  componentDidMount () {
    Taro.request({
      url: 'https://kafangchengstatic-1317421607.cos.ap-chongqing.myqcloud.com/config.json',
      method: 'get'
    }).then((response) => {
      // handle success
      if (response.data) {
        this.setState({
          loading: false,
          listData: response.data
        })
        this.listData = response.data;
      }else {
        Taro.showToast({
          title: '上传文件有误',
          icon:'error'
        })
      }
    }).catch(function (error) {
        Taro.showToast({
          title: '请求错误',
          icon:'error'
        })
      })
  }

  clear = () => {
    this.setState({
      listData: [...this.listData]
    })
  }

  dChange = (val)=> {
    if (val) {
      const mapData = [...this.listData].filter((item) => {
        return PinyinMatch.match(item.title, val)
      })
      this.setState({
        listData: mapData
      })
    }
  }

  onChange = (val) => {
    if (val) {
      this.keyChange(val)
    } else {
      this.setState({
        listData: [...this.listData]
      })
    }
  }

  render() {
      return <View>
        <SearchBar placeholder={'搜索车型'}
                  onChange={(value) => {
                    console.log(111, value);
                    this.onChange(value)
                  }}
                  onClear={this.clear}
        />
        {
          this.state.loading ?
          <Skeleton height="15px" row={3} width={'400px'} style={{width: '100%'}} animated />
          :
          <ListCom listData={this.state.listData} />
        }

      </View>
  }
}
