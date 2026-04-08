import { initOneSignal } from '@/services/base/api';
import { currentRole, oneSignalClient, oneSignalRole } from '@/utils/ip';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import OneSignal from 'react-onesignal';

const OneSignalBounder = (props: { children: React.ReactNode }) => {
	const [oneSignalId, setOneSignalId] = useState<string | null | undefined>();
	const auth = useAuth();

	const getUserIdOnesignal = async () => {
		if (!!oneSignalClient) {
			await OneSignal.init({
				appId: oneSignalClient,
			});
			const id = await OneSignal.getUserId();
			setOneSignalId(id);
		}
	};

	useEffect(() => {
		// Nếu đây là trang handle OneSignal
		if (oneSignalRole.valueOf() === currentRole.valueOf()) getUserIdOnesignal();
	}, []);

	/**
	 * Init OneSignal playerId with auth User
	 */
	useEffect(() => {
		if (oneSignalId) {
			if (auth.user?.access_token) {
				try {
					initOneSignal({ playerId: oneSignalId });
				} catch (er) {
					console.log(er);
				}
			}
		}
	}, [oneSignalId, auth.user?.access_token]);

	return <>{props.children}</>;
};

export default OneSignalBounder;
