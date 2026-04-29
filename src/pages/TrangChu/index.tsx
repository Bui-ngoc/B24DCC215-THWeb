import { Card, Button, Row, Col } from 'antd';
import { UserOutlined, ReadOutlined, TeamOutlined } from '@ant-design/icons';
import './components/style.less';
import { unitName } from '@/services/base/constant';
import { useModel, history } from 'umi';

const TrangChu = () => {
	const { data } = useModel('randomuser');

	const handleViewAuthorInfo = () => {
		history.push('/gioi-thieu');
	};

	const handleViewBlog = () => {
		history.push('/blog');
	};

	const handleViewGroupTask = () => {
		history.push('/group-task');
	};

	return (
		<>
			<Card bodyStyle={{ height: '100%', marginBottom: 24 }}>
				<div className='home-welcome'>
					<div>
						<b>{data.length} users</b>
					</div>
					<h1 className='title'>THỰC HÀNH LẬP TRÌNH WEB</h1>
					<h2 className='sub-title'>{unitName.toUpperCase()}</h2>
				</div>
			</Card>

			{/* Feature Cards */}
			<Row gutter={[24, 24]}>
				<Col xs={24} sm={12} md={8}>
					<Card hoverable style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleViewAuthorInfo}>
						<UserOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
						<h3>Thông tin tác giả</h3>
						<p style={{ color: '#666', marginBottom: 16 }}>Xem thông tin chi tiết về tác giả, kỹ năng và kinh nghiệm</p>
						<Button type='primary' block>
							Xem Chi Tiết
						</Button>
					</Card>
				</Col>

				<Col xs={24} sm={12} md={8}>
					<Card hoverable style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleViewBlog}>
						<ReadOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 16 }} />
						<h3>Blog cá nhân</h3>
						<p style={{ color: '#666', marginBottom: 16 }}>
							Đọc các bài viết về lập trình, công nghệ và phát triển web
						</p>
						<Button type='primary' block style={{ background: '#52c41a' }}>
							Xem Blog
						</Button>
					</Card>
				</Col>

				<Col xs={24} sm={12} md={8}>
					<Card hoverable style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleViewGroupTask}>
						<TeamOutlined style={{ fontSize: 32, color: '#faad14', marginBottom: 16 }} />
						<h3>Quản lý công việc nhóm</h3>
						<p style={{ color: '#666', marginBottom: 16 }}>Quản lý và theo dõi công việc nhóm một cách hiệu quả</p>
						<Button type='primary' block style={{ background: '#faad14' }}>
							Xem Công Việc
						</Button>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default TrangChu;
