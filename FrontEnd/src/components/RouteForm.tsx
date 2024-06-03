import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { tokenWithRoutesSchema } from "@/schema/tokenSchema";
import { Button, Input } from "@nextui-org/react";
import { RxCross1 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { toast } from "sonner";
import { apiClient } from "@/config/axios";

type Inputs = z.infer<typeof tokenWithRoutesSchema>;

const RouteForm: React.FC<{ data: Inputs }> = ({ data }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(tokenWithRoutesSchema),
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "routes",
  });
  useEffect(() => {
    reset(data);
    replace(data.routes);
  }, [data, reset, replace]);
  async function onSubmit(data: Inputs) {
    try {
      const res = await apiClient.put(`/token`, data);
      console.log(res.data);
      toast.success("Project updated successfully");
    } catch (e) {
      toast.error("Failed to update project");
    }
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-2xl font-semibold my-4 ">Project Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
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
        <h2 className="text-2xl font-semibold my-4 ">Routes</h2>
        <div>
          <div className="space-y-8">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4">
                <Input
                  label="URL/IP"
                  {...register(`routes.${index}.url` as const)}
                  errorMessage={errors?.routes?.[index]?.url?.message?.toString() || ""}
                  isInvalid={!!errors?.routes?.[index]?.url}
                />
                <Input
                  className="basis-2/6"
                  label="weight"
                  {...register(`routes.${index}.weight` as const)}
                  errorMessage={errors?.routes?.[index]?.weight?.message?.toString() || ""}
                  isInvalid={!!errors?.routes?.[index]?.weight}
                />
                <button type="button" onClick={() => remove(index)}>
                  <RxCross1 />
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              className="ml-auto my-4 "
              type="button"
              onClick={() => append({ id: fields.length, url: "", weight: 1 })}
            >
              <GoPlus /> Add Route
            </Button>
          </div>
        </div>
        {/* <button type="submit">Submit</button> */}
        <Button fullWidth color="primary" type="submit">
          Update Project
        </Button>
      </form>
    </div>
  );
};

export default RouteForm;
