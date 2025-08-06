import {
  List,
  ListItem,
  ListItemPrefix,
  Typography,
  Card,
} from "@material-tailwind/react";
import {
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";


const Sidebar = () => {
 

  const menuItems = [
    { name: "Calendar", icon: <CalendarDaysIcon className="h-5 w-5" />, path: "/calendar" },
   
  ];

  return (
    <Card className="h-screen w-full max-w-[250px] bg-[#ede6f0] shadow-lg p-4 rounded-none">
      <Typography variant="h4" color="deep-purple" className="mb-6 px-4 font-bold text-[#672d91]">
        Upraxia
      </Typography>
      <List>
        {menuItems.map((item, idx) => (
            <ListItem className= "bg-[#d6c6e1]">
              <ListItemPrefix><CalendarDaysIcon className="h-5 w-5" /></ListItemPrefix>
              Calendar
            </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default Sidebar;
