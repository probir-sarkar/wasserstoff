import { TbRouteAltLeft } from "react-icons/tb";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import type { Route } from "@/schema/tokenSchema";

const AllRoutes: React.FC<{ routes: Route[] | undefined }> = ({ routes }) => {
  return (
    <Dropdown size="lg">
      <DropdownTrigger>
        <Button variant="ghost" isIconOnly>
          <TbRouteAltLeft size={20} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        {routes?.map((route) => (
          <DropdownItem key={route.id}>{route.url}</DropdownItem>
        ))}

        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AllRoutes;
