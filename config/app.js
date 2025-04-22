module.exports = {
	//程序名称
	APP_NAME:"ICEPOS收银系统-会员中心小程序",
	// 非小程序配置，H5配置，可用非https,即http协议
	// #ifndef MP || APP-PLUS
	HTTP_REQUEST_URL: 'https://demo.icepos.cn',
	// #endif
	// 小程序配置，必须使用https
	// #ifdef MP || APP-PLUS
	// 请求域名 格式： https://您的域名
	HTTP_REQUEST_URL: 'https://demo.icepos.cn',
	// #endif

	// POST/GET等和后端通讯的Header数据
	HEADER: {
		'content-type': 'application/json',
		//#ifdef MP   
		'Form-type': 'routine',
		//#endif
	},
	//通讯访问api后台接口需设置access_token，C#/移动端/PHP配置一致
	ACCESS_TOKEN:'c2e3c130b7040fbe18e7f9b319844b42558aeb34',
	CLIENT_ID:'POS',
	// 回话密钥名称 请勿修改此配置
	TOKENNAME: 'Authori-zation',
	// 缓存时间 0 永久
	EXPIRE: 0,
	//分页最多显示条数
	LIMIT: 15,
	//首页主广告分类ID,后台
	ADV_CID:3,
}
