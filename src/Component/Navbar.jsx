import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Badge,
} from "@material-tailwind/react";
import { BellIcon, Bars3Icon } from "@heroicons/react/24/outline";

const TopNavbar = () => {
  return (
    <Navbar className="mx-auto max-w-full px-4 py-3 bg-white shadow-sm rounded-none">
      <div className="flex items-end justify-end">
       
        <div className="flex items-center gap-4">
          <IconButton variant="text">
            <Badge content="0" color="red">
              <BellIcon className="h-5 w-5 text-[#672d91]" />
            </Badge>
          </IconButton>

          <Menu>
            <MenuHandler>
              <Avatar
                src="https://i.pravatar.cc/150?img=3"
                alt="profile"
                size="sm"
                className="cursor-pointer border border-gray-300"
              />
            </MenuHandler>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
};

export default TopNavbar;
