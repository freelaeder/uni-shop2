<template>
	<view class="cart-container" v-if="cart.length !== 0">
		<!-- 收获地址组件 -->
		<my-address></my-address>
		<!-- 商品列标题表区域 -->
		<view class="cart-title">
			<!-- 左侧图标 -->
			<uni-icons type="shop-filled" size="18"></uni-icons>
			<!-- 右侧的文本 -->
			<text class="cart-title-text">购物车</text>
		</view>


		<uni-swipe-action>
			<block v-for="(goods,i) in cart" :key="i">
				<uni-swipe-action-item :right-options="options" @click="swiperItemClickHandler(goods)">
					<!-- 循环渲染购物车中的商品信息 -->
					<my-goods :item="goods" :showNumber="true" :showRadio="true" @num-change='numberChangeHandler'
						@radio-change='radioChangeHandler'></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		<!-- 使用自定义组件 -->
		<my-settle></my-settle>

	</view>
	<!-- 空白购物车区域 -->
	<view class="empty-cart" v-else>
		<image src="/static/cart_border@2x.png" ></image>
		<text>空空如也</text>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		// 挂载mixins 
		mixins: [badgeMix],
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#c00000'
					}
				}, ]

			};
		},
		computed: {
			...mapState('m_cart', ['cart'])
		},
		methods: {
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			// 商品勾选状态发生变化
			// 此时e.goods_state 的状态已经通过子组件已经改变，
			// 调用 updateGoodsState 是为了重新赋值，持久化更新状态
			radioChangeHandler(e) {
				this.updateGoodsState(e)

			},
			// 修改goods_count 
			numberChangeHandler(e) {
				this.updateGoodsCount(e)
			},
			// 删除商品信息
			swiperItemClickHandler(e) {
				console.log(e);
				this.removeGoodsById(e.goods_id)
			}
		},
		watch: {
			'total': function(val) {
				// 这是通过mixins 混合的方法 在tabbar-badge.js
				this.setBadge()
				// console.log(val,'000');
			}
		}

	}
</script>

<style lang="scss">
	// 标题
	.cart-title {
		display: flex;
		height: 40px;
		align-items: center;
		padding-left: 15px;
		border-bottom: 1px solid #efefef;
		font-size: 14px;

		.catr-title-text {
			margin-left: 10px;
		}

	}
	.cart-container{
		padding-bottom: 50px;
	}
	.empty-cart{
		display: flex;
		flex-direction: column;
		align-items: center;
		image {
			width: 100%;
			height: 250px;
		}
	}
</style>
