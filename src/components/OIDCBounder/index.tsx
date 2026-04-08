import { useAuthActions } from '@/hooks/useAuthActions';
import { primaryColor } from '@/services/base/constant';
import axios from '@/utils/axios';
import { oidcConfig } from '@/utils/oidcConfig';
import { ConfigProvider } from 'antd';
import { useEffect, type FC } from 'react';
import { AuthProvider, useAuth } from 'react-oidc-context';

let OIDCBounderHandlers: ReturnType<typeof useAuthActions> | null = null;

const OIDCBounder_: FC<{ children?: React.ReactNode }> = ({ children }) => {
	const auth = useAuth();
	const actions = useAuthActions();

	const handleAxios = (access_token: string) => {
		axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
	};

	useEffect(() => {
		if (auth.user?.access_token) handleAxios(auth.user.access_token);
	}, [auth.user?.access_token]);

	useEffect(() => {
		OIDCBounderHandlers = actions;
	}, [actions]);

	useEffect(() => {
		// Đổi màu real time => Hỗ trợ đổi tenant
		ConfigProvider.config({ theme: { primaryColor } });
	}, []);

	return <>{children}</>;
};

export const OIDCBounder: FC & { getActions: () => typeof OIDCBounderHandlers } = (props) => {
	return (
		<AuthProvider
			{...oidcConfig}
			redirect_uri={window.location.pathname.includes('/user') ? window.location.origin : window.location.href}
		>
			<OIDCBounder_ {...props} />
		</AuthProvider>
	);
};

OIDCBounder.getActions = () => OIDCBounderHandlers;
