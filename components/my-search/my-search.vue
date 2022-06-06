<template>
	<view>
		<view class="my-search-container">
			<view class="my-search-box">
				<uni-icons type="search" size="17"></uni-icons>
				<text class="placeholder">搜索</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	// 搜索框
	.my-search-container{
		height: 50px;
		background-color: #c00000;
		display: flex;
		align-items: center;
		text-align: center;
		padding: 0 10px;
		.my-search-box{
			width: 100%;
			line-height: 30px;
			background-color: #fff;
			border-radius: 16px;
			.placeholder{
				margin-left: 5px;
				font-size: 15px;
			}
		}
	}

</style>