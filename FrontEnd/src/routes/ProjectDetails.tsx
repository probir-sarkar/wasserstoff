import { fetcher } from "@/config/axios";
import { z } from "zod";
import { tokenWithRoutesSchema } from "@/schema/tokenSchema";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import RouteForm from "@/components/RouteForm";

type TokenData = z.infer<typeof tokenWithRoutesSchema>;

const parseToken = (data: unknown): TokenData | null => {
  try {
    return tokenWithRoutesSchema.parse(data);
  } catch (e) {
    console.error("Token parsing error:", e);
    return null;
  }
};

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useSWR(`/token/${id}`, fetcher);

  if (isLoading) return <main>Loading...</main>;
  if (error) return <main>Error: {error.message}</main>;
  if (!data) return <main>No data found</main>;

  const parsedData = parseToken(data);
  if (!parsedData) return <main>Invalid data format</main>;

  return (
    <div>
      <h1 className="text-center text-3xl font-extrabold my-12">Update Project Details</h1>
      <RouteForm data={parsedData} />
    </div>
  );
};

export default ProjectDetails;
