import { useMutation } from "@tanstack/react-query";

import { deleteAccount } from "@/api/auth";
import { useToastStore } from "@/store/toast.store";

export function useDeleteAccount() {
  const showToast = useToastStore((state) => state.show);

  return useMutation({
    mutationFn: deleteAccount,
    onError: () => {
      showToast("계정 삭제에 실패했어요.");
    },
  });
}
