import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import {Radio, Menu, MenuItem, Button, Range, Cell, Tag, Skeleton} from '@nutui/nutui-react-taro'
import ListCom from '../../component/listUI';
import style from './index.module.scss'
import Taro from "@tarojs/taro";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      tagList: [],
      loading: true
    }
    this.searchData = {
      firstOptions: 0,
      radioOption: null,
      options: [0, 2]
    }
    this.listData = [];
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

  searchVal = () => {
    const oneData = this.searchData.firstOptions;
    const whereMonth = this.searchData.radioOption;
    const listAm = this.searchData.options
    let data = [];
    const getData = (start, end) => {
      if (oneData) {
        return [...this.listData].filter((item) => {
          const num = parseInt(item[oneData]);
          return num > start && num < end
        })
      } else {
        return [...this.listData].filter((item) => {
          const oneData =  parseInt(item[36]);
          const twoData =  parseInt(item[48]);
          const threeData = parseInt(item[60]);
          const numArr = [oneData, twoData, threeData]
          return numArr.some((num) => {
            return num > start && num < end
          })
        })
      }
    }
    if (whereMonth === null) {
      if (oneData) {
        data = [...this.listData].filter((item) => {
          return item[oneData]
        })
      } else {
        data = [...this.listData]
      }
    } else {
      if (whereMonth) {
        const start = whereMonth[0];
        const end = whereMonth[1];
        data = getData(start, end)
      } else {
        const start = listAm[0] * 1000;
        const end = listAm[1] * 1000;
        data = getData(start, end)
      }
    }
    console.log(data.length);
    this.setState({
      listData: data
    })
    // this.state.listData
  }

  render() {
      return <View>
        <Menu>
          <MenuItem options={[
            { text: '全部', value: 0 },
            { text: '36期月供', value: 36 },
            { text: '48期月供', value: 48 },
            { text: '60期月供', value: 60 },
          ]} value={this.searchData.firstOptions} onChange={(val) => {
            this.searchData.firstOptions = val.value;
            this.searchVal();
          }} />
          <MenuItem title="筛选" ref={'itemRef'}>
            <Cell className={style.cell}>
              <Radio.RadioGroup style={{width:'100%'}} onChange={(val) => {
                this.searchData.radioOption = val
              }} direction="horizontal">
                <Radio className={style.radio} value={[0, 2000]} iconSize="15">0~2000元 </Radio>
                <Radio className={style.radio} value={[2000, 3500]} iconSize="15">2000~3500元 </Radio>
                <Radio className={style.radio} value={[3500, 100000]} iconSize="15">3500元以上 </Radio>
                <Radio className={style.radio} value={false} iconSize="15">使用自定义范围</Radio>
              </Radio.RadioGroup>
            </Cell>
            <Cell className={style.cell}>
              <Range
                modelValue={this.searchData.options}
                range
                minDesc="0k"
                maxDesc="10k"
                max={10}
                min={0}
                onChange={(value) => {
                  this.searchData.options = value
                }}
              />
            </Cell>
            <Cell>
              <Button type={"primary"} size={'small'} onClick={() => {
                if (this.searchData.radioOption) {
                  this.setState({
                    tagList: this.searchData.radioOption
                  })
                } else {
                  this.setState({
                    tagList: [this.searchData.options[0]* 1000, this.searchData.options[1]*1000]
                  })
                }
                this.searchVal()
                this.refs.itemRef.toggle(false)
              }}>确认</Button>
            </Cell>
          </MenuItem>
        </Menu>
        <View>
          {
            this.state.tagList && this.state.tagList.length ?
              <Cell center>
                <Text>筛选条件:</Text>
                <Tag closeable onClose={()=> {
                    this.setState({
                      tagList: []
                    })
                  this.searchData.radioOption = null
                  this.searchVal()
                }}  type="primary">{this.state.tagList[0]}~{this.state.tagList[1]}元</Tag>
              </Cell>
            :
            null
          }
        </View>
        {
          this.state.loading ?
            <Skeleton height="15px" row={3} width={'400px'} style={{width: '100%'}} animated />
            :
            <ListCom listData={this.state.listData} />
        }
      </View>
  }
}
