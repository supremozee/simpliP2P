import { useMutation } from '@tanstack/react-query';
import { auth } from '@/api/auths';
import { ErrorResponse, RefreshToken, RefreshTokenResponse } from '@/types';

const useRefreshToken = () => {
  return useMutation<RefreshTokenResponse, ErrorResponse, RefreshToken>({
    mutationFn: (refreshToken) => auth.refreshToken(refreshToken),
    onSuccess: () => {
    },
  });
};

export default useRefreshToken;