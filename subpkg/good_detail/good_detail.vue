<template>
	<view v-if="goods_info.goods_name" class="goods-detail-container">
		<!-- 轮播图 -->
		<swiper :circular="true" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item,i ) in goods_info.pics" :key="i">
				<image :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">
				${{goods_info.goods_price}}

			</view>
			<!-- 商品信息主体区域 -->
			<view class="goods-info-body">
				<!-- 商品名字 -->
				<view class="goods-name">
					{{goods_info.goods_name}}
				</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"> </uni-icons>
					<text>收藏</text>

				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">
				快递:免运费{{cart.length}}
			</view>

		</view>
		<!-- 渲染富文本html结构 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		<!-- 商品导航组件区域` -->
		<view class="goods_nav">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />

		</view>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'
	export default {
		computed: {
			// 映射cart.js 中的数据
			...mapState('m_cart', ['cart']),
			// 计算属性
			...mapGetters('m_cart', ['total'])
		},
		watch: {
			// 动态监听
			// total(newVal) {
			// 	const findResult = this.options.find(x => x.text === '购物车')
			// 	if(findResult){
			// 		findResult.info = newVal
			// 	}
			// }
			total: {
				handler(newVal) {
					const findResult = this.options.find(x => x.text === '购物车')
					if (findResult) {
						findResult.info = newVal
					}
				},
				//代表页面首次加载执行次方法
				immediate: true
			}


		},
		data() {
			return {
				goods_info: {},
				options: [{
					icon: 'shop',
					text: '店铺',
					infoBackgroundColor: '#007aff',
					infoColor: "red"
				}, {
					icon: 'cart',
					text: '购物车',
					info: 0
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				],


			};
		},
		onLoad(options) {
			// console.log(options);
			const goods_id = options.goods_id
			// 调用方法 获取商品详情
			this.getGoodsDetail(goods_id)
		},
		methods: {
			// 映射 cart.js 中的方法
			...mapMutations('m_cart', ['addToCart']),

			// 获取商品详情
			async getGoodsDetail(e) {
				// console.log(e);
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/detail?goods_id=' + e)
				// 赋值
				// console.log(res);
				if (res.meta.status !== 200) return uni.$showMsg()
				// 处理图片底部空白 处理ios图片不显示
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,
					'<img style="display:block;"').replace(/webp/g, 'jpg')
				this.goods_info = res.message

			},
			// 点击图片预览效果
			preview(i) {
				uni.previewImage({
					// 所有图片的url地址
					urls: this.goods_info.pics.map(x => x.pics_big),
					// 预览时默认显示的图片位置
					current: i,

				})
			},
			//点击店铺或者购物车触发
			onClick(e) {
				// console.log(e.content.text);
				if (e.content.text === '购物车') {
					// 切换到购物车页
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			buttonClick(e) {
				if (e.content.text === '加入购物车') {
					//组织商品信息对象
					const goods = {
						goods_id: this.goods_info.goods_id,
						goods_name: this.goods_info.goods_name,
						goods_price: this.goods_info.goods_price,
						goods_count: 1,
						goods_big_logo: this.goods_info.goods_small_logo,
						goods_state: true
					}
					// 调用addToCart方法
					this.addToCart(goods)

				}
			}

		}
	}
</script>

<style lang="scss">
	swiper {
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.goods-info-box {
		padding: 10px;
		padding-right: 0;

		.price {
			color: #c00000;
			font-size: 18px;
		}

		.goods-info-body {
			display: flex;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
				margin-right: 10px;
			}

			.favi {
				width: 120px;
				font-size: 12px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-left: 1px solid #efefef;
			}
		}

		.yf {
			font-size: 12px;
			color: gray;
			margin: 10px 0;
		}
	}

	.goods_nav {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	// 解决底部图片被遮住
	.goods-detail-container {
		margin-bottom: 50px;
	}
</style>
