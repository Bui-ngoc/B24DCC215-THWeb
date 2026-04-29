import { Card, Avatar, Typography, Space, Divider, Button, Layout, Tabs, Button as AntButton } from 'antd';
import { LinkedinOutlined, GithubOutlined, FacebookOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import '../../TrangChu/components/style.less';
import './styles.less';
import { unitName } from '@/services/base/constant';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

interface AuthorInfo {
	name: string;
	avatar: string;
	bio: string;
	email?: string;
	phone?: string;
	skills: string[];
	experience: string;
	education: string;
	socialLinks: {
		facebook?: string;
		github?: string;
		linkedin?: string;
	};
}

const AboutPage = () => {
	const author: AuthorInfo = {
		name: 'Nguyễn Văn A',
		avatar: 'https://joeschmoe.io/api/v1/random',
		bio: 'Lập trình viên Front-end với 5 năm kinh nghiệm trong phát triển ứng dụng web.',
		email: 'nguyenvana@example.com',
		phone: '+84 981627050',
		skills: [
			'React',
			'TypeScript',
			'UmiJS',
			'Ant Design',
			'Node.js',
			'JavaScript',
			'HTML/CSS',
			'MongoDB',
			'Git',
			'Docker',
		],
		experience:
			'Có hơn 5 năm kinh nghiệm làm việc với React và các công nghệ web hiện đại. Đã tham gia phát triển nhiều dự án lớn cho các công ty hàng đầu.',
		education: 'Cử nhân Công nghệ Thông tin - HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG',
		socialLinks: {
			facebook: 'https://www.facebook.com/manh.hieu.26982?locale=vi_VN',
			github: 'https://github.com/bmhking-droid',
			linkedin: 'https://linkedin.com',
		},
	};

	const handleSocialClick = (url?: string) => {
		if (url) {
			window.open(url, '_blank');
		}
	};

	const handleDownloadCV = () => {
		// Placeholder for CV download
		alert('Tính năng tải CV sẽ được cập nhật sớm');
	};

	return (
		<Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
			<Content style={{ padding: '24px 50px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
				<Card bodyStyle={{ padding: 0 }}>
					<div className='about-header'>
						<h1 className='title'>GIỚI THIỆU {unitName.toUpperCase()}</h1>
						<h2 className='sub-title'>HỆ THỐNG CHUYỂN ĐỔI SỐ - {unitName.toUpperCase()}</h2>
					</div>
				</Card>

				{/* Author Section */}
				<Card style={{ marginTop: 24 }}>
					<div className='author-section'>
						{/* Author Avatar and Basic Info */}
						<div className='author-header'>
							<Avatar src={author.avatar} size={120} style={{ marginRight: 32 }} />
							<div className='author-info'>
								<Title level={2} style={{ marginTop: 0 }}>
									{author.name}
								</Title>
								<Paragraph type='secondary' style={{ fontSize: 16, marginBottom: 16 }}>
									{author.bio}
								</Paragraph>

								{/* Contact Information */}
								<Space direction='vertical' size='small' style={{ marginBottom: 16 }}>
									{author.email && (
										<Space>
											<MailOutlined style={{ color: '#1890ff' }} />
											<a href={`mailto:${author.email}`}>{author.email}</a>
										</Space>
									)}
									{author.phone && (
										<Space>
											<PhoneOutlined style={{ color: '#1890ff' }} />
											<Text>{author.phone}</Text>
										</Space>
									)}
								</Space>

								{/* Social Links */}
								<Space size='large'>
									{author.socialLinks.facebook && (
										<AntButton
											type='text'
											icon={<FacebookOutlined style={{ fontSize: 24, color: '#1877F2' }} />}
											onClick={() => handleSocialClick(author.socialLinks.facebook)}
											title='Facebook'
										/>
									)}
									{author.socialLinks.github && (
										<AntButton
											type='text'
											icon={<GithubOutlined style={{ fontSize: 24 }} />}
											onClick={() => handleSocialClick(author.socialLinks.github)}
											title='GitHub'
										/>
									)}
									{author.socialLinks.linkedin && (
										<AntButton
											type='text'
											icon={<LinkedinOutlined style={{ fontSize: 24, color: '#0A66C2' }} />}
											onClick={() => handleSocialClick(author.socialLinks.linkedin)}
											title='LinkedIn'
										/>
									)}
								</Space>

								<div style={{ marginTop: 16 }}>
									<Button type='primary' onClick={handleDownloadCV}>
										Tải CV
									</Button>
								</div>
							</div>
						</div>

						<Divider />

						{/* Tabs for more information */}
						<Tabs>
							<Tabs.TabPane key='skills' tab='Kỹ Năng'>
								<div className='skills-section'>
									<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
										{author.skills.map((skill, index) => (
											<span
												key={index}
												style={{
													display: 'inline-block',
													backgroundColor: '#e6f7ff',
													color: '#0050b3',
													padding: '8px 16px',
													borderRadius: '20px',
													fontSize: 14,
													fontWeight: 500,
													border: '1px solid #91d5ff',
												}}
											>
												{skill}
											</span>
										))}
									</div>
								</div>
							</Tabs.TabPane>
							<Tabs.TabPane key='experience' tab='Kinh Nghiệm'>
								<div className='experience-section'>
									<Paragraph>{author.experience}</Paragraph>
								</div>
							</Tabs.TabPane>
							<Tabs.TabPane key='education' tab='Học Vấn'>
								<div className='education-section'>
									<Paragraph>{author.education}</Paragraph>
								</div>
							</Tabs.TabPane>
						</Tabs>
					</div>
				</Card>
			</Content>
		</Layout>
	);
};

export default AboutPage;
