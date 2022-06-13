<template>
	<view class="goods-item">
		<!-- 左侧的盒子 -->
		<view class="goods-item-left">
			<!-- // 动态决定checked状态 是否显示 radio -->
			<radio @click="radioClickHandler" :checked='item.goods_state' color="#c00000" v-if="showRadio"> </radio>
			<image :src="item.goods_big_logo || defaultPic" class="goods-pic"></image>
		</view>
		<!-- 右侧的盒子 -->
		<view class="goods-item-right">
			<!-- 商品的名字 -->
			<view class="goods-name">
				{{item.goods_name}}
			</view>
			<!-- 商品信息 -->
			<view class="goods-info-box">
				<view class="goods-price">
					¥{{item.goods_price | toFixed}}
				</view>
				<uni-number-box v-if="showNumber" :min="1" :value="item.goods_count" @change="changeValue" />
			</view>

		</view>

	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins: [badgeMix],
		name: "my-goods",
		data() {
			return {
				//  默认图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'

			};
		},
		props: {
			item: {
				type: Object,
				default: {}
			},
			// showRadio 默认清空不展示radio
			showRadio: {
				type: Boolean,
				default: false
			},
			// 展示numberbox
			showNumber: {
				type: Boolean,
				default: false
			}
		},
		filters: {
			// 把数字处理为带有两位小数的数组
			toFixed(num) {
				return Number(num).toFixed(2)
			}
		},
		methods: {
			// radio 点击事件处理函数
			radioClickHandler() {
				// 触发外界绑定的自定义事件 
				//  @radio-change='radioChangeHandler'
				this.$emit('radio-change', {
					goods_id: this.item.goods_id,
					goods_state: !this.item.goods_state
				})
				// console.log('0000000000000000');
			},
			// 修改goods_count
			// 监听到了NumberBox 组件数量的变化
			changeValue(val) {
				// console.log(val, '---');
				this.$emit('num-change', {
					goods_id: this.item.goods_id,
					goods_count: val
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		padding: 5px 10px;
		border-bottom: 1px solid #efefef;

		.goods-item-left {
			margin: 5px;
			display: flex;
			justify-content: center;
			align-items: center;

			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;

			}
		}

		.goods-item-right {
			flex: 1;
			font-size: 13px;
			display: flex;
			justify-content: space-between;
			flex-direction: column;

			.goods-name {}

			.goods-info-box {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.goods-price {
					color: red;
				}
			}
		}
	}
</style>
