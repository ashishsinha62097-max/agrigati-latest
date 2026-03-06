import { useMutation } from "@tanstack/react-query";
import type { OrganizationType } from "../backend";
import { useActor } from "./useActor";

export function useSubmitContact() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      orgType,
      email,
      phone,
      message,
    }: {
      name: string;
      orgType: OrganizationType;
      email: string;
      phone: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitContact(name, orgType, email, phone, message);
    },
  });
}

export function useIncrementVisitCount() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.incrementVisitCount();
    },
  });
}
