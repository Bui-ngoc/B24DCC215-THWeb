import React from 'react';

const UserDisplay: React.FC<{ username: string }> = ({ username }) => (
	<div style={{ marginBottom: 16 }}>
		Người dùng hiện tại: <b>{username}</b>
	</div>
);

export default UserDisplay;
