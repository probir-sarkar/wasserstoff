import { fetcher } from "@/config/axios";
import { z } from "zod";
import { tokenWithRoutesSchema } from "@/schema/tokenSchema";
import { Link, useParams } from "react-router-dom";
import useSWR from "swr";
import RouteForm from "@/components/RouteForm";
import { IoIosArrowRoundBack } from "react-icons/io";

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
    <div className="max-w-2xl mx-auto my-8">
      <Link to="/" className=" underline">
        <IoIosArrowRoundBack className="inline-block" />
        Back to all projects
      </Link>
      <h1 className="text-center text-3xl font-extrabold my-12">Update Project Details</h1>
      <RouteForm data={parsedData} />
    </div>
  );
};

export default ProjectDetails;
