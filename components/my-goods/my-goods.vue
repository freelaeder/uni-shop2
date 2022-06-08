<template>
	<view class="goods-item">
		<!-- 左侧的盒子 -->
		<view class="goods-item-left">
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
			</view>

		</view>

	</view>
</template>

<script>
	export default {
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
			}
		},
		filters:{
			// 把数字处理为带有两位小数的数组
			toFixed(num){
				return Number(num).toFixed(2)
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

			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;

			}
		}

		.goods-item-right {
			font-size: 13px;
			display: flex;
			justify-content: space-between;
			flex-direction: column;

			.goods-name {}

			.goods-info-box {
				.goods-price {
					color: red;
				}
			}
		}
	}
</style>
