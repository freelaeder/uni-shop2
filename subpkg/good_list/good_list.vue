<template>
	<view>
		<view class="goods-list">
			<!-- // block 不支持点击事件 -->
			<view v-for="(item,i) in goodsList" :key="i" @click="gotoDetail(item)">
				<my-goods :item="item"></my-goods>
			</view>

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
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				// 是否正在请求数据
				isloading:false,

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
			async getGoodsList(cb) {
				// 打开节流阀
				this.isloading = true
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				if (res.meta.status !== 200) return uni.$showMsg()
				// 关闭节流阀
				this.isloading= false
				cb && cb()
				// 赋值
				console.log(res,'-------------------------------');
				// 拼接旧数据 和新数据
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
			},
			// 点击进入详情页
			gotoDetail(e){
				console.log(e.goods_id,'000000000000000');
				uni.navigateTo({
					url:'/subpkg/good_detail/good_detail?goods_id='+e.goods_id
				})
			}
		},
		// 上拉触底事件
		onReachBottom() {
			// 判断是否加载完毕
			if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据已经加载完了哦')
			// 判断节流阀的状态
			if(this.isloading) return
			// 页码加一
			this.queryObj.pagenum++
			this.getGoodsList()
		},
		// 下拉刷新
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum= 1
			this.total=0
			this.isloading = false
			this.goodsList=[]
			
			// 重新发起请求
			this.getGoodsList(()=>uni.stopPullDownRefresh())
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
