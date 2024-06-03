import useSWR from "swr";
import { fetcher } from "@/config/axios";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";
import AllRoutes from "./AllRoutes";
import { tokenSchema } from "@/schema/tokenSchema";

const AllTokenTable = () => {
  const { data, error, isLoading } = useSWR("/token", fetcher);
  if (isLoading) return <main>Loading...</main>;
  if (error) return <main>Error: {error.message}</main>;
  if (!data) return <main>No data found</main>;
  const parsedData = parseToken(data);
  if (parsedData.length === 0) return <main>No data found</main>;
  console.log(parsedData);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Project Name</TableColumn>
          <TableColumn>Health Route</TableColumn>
          <TableColumn>Token</TableColumn>
          <TableColumn>End Point</TableColumn>
          <TableColumn>Routes</TableColumn>
        </TableHeader>
        <TableBody>
          {parsedData.map((token) => (
            <TableRow key={token.id} className="text-start">
              <TableCell>{token.id}</TableCell>
              <TableCell>{token.name}</TableCell>
              <TableCell>{token.healthRoute}</TableCell>
              <TableCell>{token.token}</TableCell>
              <TableCell>
                {import.meta.env.VITE_API_URL}/{token.id}
              </TableCell>
              <TableCell>
                <AllRoutes routes={token.routes} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllTokenTable;

function parseToken(data: unknown) {
  try {
    return tokenSchema.parse(data);
  } catch (e) {
    console.error(e);
    return [];
  }
}
