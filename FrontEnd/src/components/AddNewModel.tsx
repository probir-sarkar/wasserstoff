import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import { BiReset } from "react-icons/bi";
import { z } from "zod";
import { Input } from "@nextui-org/react";
import { apiClient } from "@/config/axios";
import { toast } from "sonner";

const inputSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  healthRoute: z.string().min(3, { message: "Health Route must be at least 3 characters" }),
});

type Inputs = z.infer<typeof inputSchema>;

export default function AddNewToken() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(inputSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await apiClient.post("/token", data);
      onClose();
      toast.success("Token added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add token");
    }
  };

  return (
    <>
      <Button onPress={onOpen}>Add New</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex items-center gap-1 ">
            Modal Title{" "}
            <Tooltip content="Reset Form">
              <BiReset onClick={() => reset()} />
            </Tooltip>
          </ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <div className="space-y-2">
                <Input
                  label="Project Name"
                  isInvalid={!!errors.name}
                  errorMessage={errors?.name?.message?.toString() || ""}
                  {...register("name")}
                  placeholder="My Project"
                />
                <Input
                  isInvalid={!!errors.healthRoute}
                  errorMessage={errors?.healthRoute?.message?.toString() || ""}
                  label="Health Route"
                  {...register("healthRoute")}
                  placeholder="/health"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" type="submit">
                Action
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
