<template>
	<view>
		<view class="goods-list">
			<block v-for="(item,i) in goodsList" :key="i">
				<my-goods :item="item"></my-goods>
			</block>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数
				queryObj: {
					query: '',
					cid: '',
					pagenum: '1',
					pagesize: '20',

				},
				// 商品列表数据
				goodsList: [],
				total: 0,
				//  默认图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'

			};
		},
		onLoad(options) {
			// 页面加载时
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			// 获取商品列表数据
			this.getGoodsList()
		},
		methods: {
			// 获取商品数据的方法
			async getGoodsList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				if (res.meta.status !== 200) return uni.$showMsg()
				// 赋值
				this.goodsList = res.message.goods
				this.total = res.message.total
			}
		}
	}
</script>

<style lang="scss">
	.goods-list {
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
	}
</style>
