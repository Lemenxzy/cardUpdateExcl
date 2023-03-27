/**
 * @Author zhiyuan.xu
 * @Date 2023/3/24
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2023/3/24
 */
import { Component } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { Cell, Divider, Row, Col, Tag, Empty, ActionSheet } from '@nutui/nutui-react-taro'
import style from "./index.module.scss";

export default class Index extends Component {
  constructor(props) {
     super(props);
    this.state = {
      activeDom: {},
      isVisible: false
    }
  }

  render() {
    const activeDom = this.state.activeDom;
    return <View>
        <ScrollView scrollY scrollWithAnimation scrollTop={0}
                    className={
                      style.listWrap
                    }>
          {
            this.props.listData.length > 0 ?
              this.props.listData.map((item, index) => {
                return <Cell center icon={'shop'} key={index} title={item.title}
                             subTitle={item.subTitle}
                             onClick={() => {
                               this.setState({
                                 activeDom: item,
                                 isVisible: true
                               })
                             }}
                />
              })
              :
              <Empty description="无数据" />
          }
        </ScrollView>
        <ActionSheet
          visible={this.state.isVisible}
          title={activeDom.title}
          description={activeDom.subTitle}
          onCancel={() => {
            this.setState({
              isVisible: false
            })
          }}
        >
          <View className={style.actStyle}>
            <Row>
              <Col span='12' className={style.contentext}>
                <View >新车指导价:
                  <Tag round type='danger' >
                    {activeDom.guidePrice || '-'}
                  </Tag>
                </View>
              </Col>
              <Col span='12' className={style.contentext}>
                <View className='col-content'>最低首付:
                  <Tag round type='danger' >
                    {activeDom.downPayments || '-'}
                  </Tag>
                </View>
              </Col>
            </Row>
            <Divider dashed />
            <Row>
              <Col span='8' className={style.contentext}>
                <View>36期月付: <Tag round type='warning'>
                  {activeDom[36] && !isNaN(activeDom[36]) ? activeDom[36].toFixed(1) : activeDom[36] || '-'}
                </Tag></View>
              </Col>
              <Col span='8' className={style.contentext}>
                <View>48期月付: <Tag round type='warning'>
                  {activeDom[48] && !isNaN(activeDom[48]) ? activeDom[48].toFixed(1) : activeDom[48] || '-'}
                </Tag>
                </View>
              </Col>
              <Col span='8' className={style.contentext}>
                <View>60期月付: <Tag round type='warning'>
                  {activeDom[60] && !isNaN(activeDom[60]) ? activeDom[60].toFixed(1) : activeDom[60] || '-'}
                </Tag>
                </View>
              </Col>
            </Row>
            <Divider dashed />
            <Row>
              <Col span='24' className={style.contentext}>
                <View className={style.remarks}>备注: {activeDom.remarks || '-'}</View>
              </Col>
            </Row>
          </View>
        </ActionSheet>
      </View>
  }
}
