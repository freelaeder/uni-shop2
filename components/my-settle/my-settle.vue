<template>
	<view class="my-settle-container">
		<!-- 全选 -->
		<label class="radio" @click="changeAllState">
			<radio :checked="isFullCheck" color="#c00000" /><text> 全选</text>
		</label>
		<!-- 合计 -->
		<view class="amout-box">
			合计：<text class="amout">￥{{checkedGoodsAmout}}</text>
		</view>
		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">
			结算({{checkedCount}})
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		name: "my-settle",
		data() {
			return {
				// 倒计时的秒数
				seconds: 3,
				// 定时器的ID
				timer: null
			};
		},
		computed: {
			...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmout']),
			// 详细的收货地址
			...mapGetters('m_user', ['addstr']),
			// token 是用户登录后返回的字符串
			...mapState('m_user', ['token']),
			...mapState('m_cart', ['cart']),
			// 判断是否全部选中
			isFullCheck() {
				return this.total === this.checkedCount
			}
		},
		methods: {
			// 2. 使用 mapMutations 辅助函数，
			//把 m_cart 模块提供的 updateAllGoodsState 方法映射到当前组件中使用
			...mapMutations('m_cart', ['updateAllGoodsState']),
			// 把 m_user 模块中的 updateRedirectInfo 方法映射到当前页面中使用
			...mapMutations('m_user', ['updateRedirectInfo']),
			// 改变所有的选中状态
			changeAllState() {
				// 修改购物车中所有商品的选中状态
				// !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
				this.updateAllGoodsState(!this.isFullCheck)
			},
			// 点击结算
			settlement() {
				// 判断是否勾选了商品
				if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品')
				// 判断是否选择收货地址
				if (!this.addstr) return uni.$showMsg('请选择收货地址')
				// 判断是否登录
				// if (!this.token) return uni.$showMsg('请先登录')
				// 如果没有登陆 跳转登录
				if (!this.token) return this.delayNavigate()
				// 实现微信支付
				this.payOrder()
			},
			// 展示倒计时的提示消息
			showTips(n) {
				// 调用 uni.showToast()
				uni.showToast({
					icon: 'none',
					title: '请登录后再结算！' + n + '秒后自动跳转到登录页',
					// 为页面设置透明遮罩，防止点击穿透
					mask: true,
					duration: 1500
				})
			},
			// 延迟导航到my
			delayNavigate() {
				//把data数据重置为3
				this.seconds = 3
				// 展示提示消息
				this.showTips(this.seconds)
				// 创建定时器
				this.timer = setInterval(() => {
					// 秒数自减一
					this.seconds--
					// 判断秒数是否 <= 0
					if (this.seconds <= 0) {
						clearInterval(this.timer)
						//跳转页面
						uni.switchTab({
							url: '/pages/my/my',
							//页面跳转成功之后的函数回调
							success: () => {
								this.updateRedirectInfo({
									//跳转的方式
									openType: 'switchTab',
									// 从哪个页面跳转过去
									from: '/pages/cart/cart'
								})
							}
						})
						// 终止代码向下运行
						return
					}
					// 根据最新的秒数展示
					this.showTips(this.seconds)
				}, 1000)
			},
			// 实现微信支付
			async payOrder() {
				// 组织订单对象
				const orderInfo = {
					// order_price:this.checkedGoodsAmout,
					order_price: 0.01,
					consignee_addr: this.addstr,
					goods: this.cart.filter(x => x.goods_state).map(x => ({
						goods_id: x.goods_id,
						goods_number: x.goods_count,
						goods_price: x.goods_price,
					}))
				}
				// console.log(orderInfo, 'orderinfo');
				// 发起订单请求
				const {
					data: res
				} = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)

				// if(res.meta.status !== 200) return uni.$showMsg('创建订单失败')
				// const orderNumber = res.message.order_number

				const orderNumber = "GD20220614000043400232303"
				// 2. 订单预支付
				// 2.1 发起请求获取订单的支付信息
				const {
					data: res2
				} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
					order_number: orderNumber
				})
				// 2.2 预付订单生成失败
				// if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
				// 2.3 得到订单支付相关的必要参数
				// const payInfo = res2.message.pay
				const payInfo = {
					paySign: "8dasf90dfad9f0sdaf9sd90f",
					signType: "MD5",
					timeStamp: "159894333",
					nonceStr: "IYENd2efvdjj",
					package: "prepay_id-wx01123jflksadjflsjfljaslflsdd"
				}
				// 3. 发起微信支付
				// 3.1 调用 uni.requestPayment() 发起微信支付
				const [err, succ] = await uni.requestPayment(payInfo)
				console.log(err,'err');
				// 3.2 未完成支付
				// if (err) return uni.$showMsg('订单未支付！')
				// 3.3 完成了支付，进一步查询支付的结果
				const {
					data: res3
				} = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
					order_number: orderNumber
				})
				// 3.4 检测到订单未支付
				// if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
				// 3.5 检测到订单支付完成
				uni.showToast({
					title: '支付完成！',
					icon: 'success'
				})
			}

		}
	}
</script>

<style lang="scss">
	.my-settle-container {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		background-color: white;
		z-index: 999;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;
	}

	.radio {
		display: flex;
		align-items: center;
	}

	.amout {
		color: #c00000;
		font-weight: bold;
	}

	.btn-settle {
		background-color: #c00000;
		line-height: 50px;
		padding: 0 10px;
		color: white;
		min-width: 100px;
		text-align: center;
	}
</style>
