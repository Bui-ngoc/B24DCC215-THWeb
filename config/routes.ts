export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		redirect: '/blog/gioi-thieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },
	// TH07
	{
		path: '/group-task',
		name: 'Quản lý Công việc Nhóm',
		component: './GroupTaskManager',
		icon: 'TeamOutlined',
	},

	// TH08
	{
		path: '/blog',
		name: 'Blog Cá Nhân',
		icon: 'ReadOutlined',
		routes: [
			{
				path: '/blog',
				name: 'Trang chủ Blog',
				component: './QuanLyBlog/Home',
				exact: true,
			},
			{
				path: '/blog/gioi-thieu',
				name: 'Giới thiệu',
				component: './TienIch/GioiThieu',
				exact: true,
			},
			{
				path: '/blog/manage',
				name: 'Quản lý bài viết',
				component: './QuanLyBlog/ManagePosts',
				exact: true,
			},
			{
				path: '/blog/tags',
				name: 'Quản lý thẻ',
				component: './QuanLyBlog/ManageTags',
				exact: true,
			},
			{
				path: '/blog/:id',
				component: './QuanLyBlog/Detail',
				hideInMenu: true,
				exact: true,
			},
		],
	},

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
