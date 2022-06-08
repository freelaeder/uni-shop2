<template>
	<view>
		<!-- 搜索组件 -->
		<!-- 添加自定义属性 bgcolor radius -->
		<!-- <my-search :bgcolor="'pink'" :radius="3"></my-search> -->
		<view class="my-search-box">
			<my-search @myclick='btnSearch'></my-search>
		</view>
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<!-- //  重写 view -->
				<navigator class="swiper-item" :url=" '/subpkg/good_detail/good_detail?goods_id=' + item.goods_id ">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类 -->
		<view class="nav-list">
			<view class="nav-item" @click="navClick(item)" v-for="(item,index) in navList" :key="index">
				<image :src="item.image_src" mode=""></image>
			</view>

		</view>
		<!-- 楼层容器 -->
		<view class="floor-list">
			<!--每一层的item  -->
			<view class="floor-item" v-for="(item,index) in floorList" :key="index">
				<!-- 楼层的标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层的图片区域容器 -->
				<view class="floor-img-box">
					<!-- 左侧 大的图片 -->
					<navigator class="floor-img-left" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src"
							:style="{width:item.product_list[0].image_width +'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧 4 个小图片的盒子 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2"
							v-if="i2 !== 0" :url="item2.url">
							<image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}">
							</image>
						</navigator>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图的数据列表
				swiperList: [],
				// 首页分类的列表
				navList: [],
				// 楼层数据
				floorList: [],



			};
		},
		onLoad() {
			// 调用方法 获取轮播图数据
			this.getSwiperList()
			// 获取分类
			this.getNavList()
			// 楼层
			this.getFloorList()
		},
		methods: {
			//获取轮播图数据
			async getSwiperList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/swiperdata')
				// 判断是否成功
				// if(res.meta.status != 200){
				// 	return uni.showToast({
				// 		title:'数据跑丢了',
				// 		duration:1500,
				// 		icon:'none'
				// 	})
				// }
				// 优化
				if (res.meta.status != 200) return uni.$showMsg()
				// 请求成功赋值
				this.swiperList = res.message
			},
			// 获取分类数据
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems')
				// console.log(res);
				// 判断是否获取成功
				if (res.meta.status != 200) return uni.$showMsg()
				// 赋值
				this.navList = res.message
			},
			// 分类点击事件
			navClick(e) {
				if (e.name == '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}

			},
			// 获取楼层数据
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')
				// console.log(res);
				// 判断失败
				if (res.meta.status != 200) return uni.$showMsg()
				// 通过双层 forEach 循环，处理 URL 地址
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/good_list/good_list?' + prod.navigator_url.split('?')[1]
						// console.log(prod.navigator_url.split('?')[1]);
						// console.log(prod.navigator_url.split('?')[0]);
					})
				})
				// 成功的话赋值
				this.floorList = res.message
			},
			// 点击搜索·框
			btnSearch() {
				// console.log('search');
				// 跳转 search
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}




		}
	}
</script>

<style lang="scss">
	// search
	.my-search-box{
		position: sticky;
		top: 0;
		z-index: 999;
	}
	// 轮播图
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}

		navigator {
			width: 100%;
			height: 100%;
		}
	}

	// 分类
	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15rpx 0;

		image {
			width: 128rpx;
			height: 140rpx;
		}
	}

	// 楼层
	.floor-title {
		width: 100%;
		height: 60rpx;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10rpx;

	}

	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
</style>
