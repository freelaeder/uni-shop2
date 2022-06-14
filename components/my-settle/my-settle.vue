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
