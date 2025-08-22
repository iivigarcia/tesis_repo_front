import React from "react";
import Menuitems from "./MenuItems";
import { Box, Typography, Avatar, Badge, IconButton } from "@mui/material";
import {
  Logo,
  Sidebar as MUI_Sidebar,
  Menu,
  MenuItem,
  Submenu,
} from "react-mui-sidebar";
import { IconPoint, IconShield, IconUser, IconSettings, IconBell } from '@tabler/icons-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upgrade } from "./Updrade";

const renderMenuItems = (items: any, pathDirect: any) => {
  return items.map((item: any) => {
    const Icon = item.icon ? item.icon : IconPoint;
    const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

    if (item.subheader) {
      return (
        <Menu
          subHeading={item.subheader}
          key={item.subheader}
        />
      );
    }

    if (item.children) {
      return (
        <Submenu
          key={item.id}
          title={item.title}
          icon={itemIcon}
          borderRadius='7px'
        >
          {renderMenuItems(item.children, pathDirect)}
        </Submenu>
      );
    }

    return (
      <Box px={3} key={item.id}>
        <MenuItem
          key={item.id}
          isSelected={pathDirect === item?.href}
          borderRadius='8px'
          icon={itemIcon}
          link={item.href}
          component={Link}
        >
          {item.title}
          {item.badge && (
            <Box sx={{ ml: 'auto', mr: 1 }}>
              <Typography variant="caption" sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                px: 1, 
                py: 0.5, 
                borderRadius: 1,
                fontSize: '0.7rem'
              }}>
                {item.badge}
              </Typography>
            </Box>
          )}
        </MenuItem>
      </Box>
    );
  });
};

const SidebarItems = () => {
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    <>
      <MUI_Sidebar width={"100%"} showProfile={false} themeColor={"#5D87FF"} themeSecondaryColor={'#49beff'}>
        {/* AeroSentinel Logo */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconShield size={32} color="#5D87FF" />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#5D87FF' }}>
            AeroSentinel
          </Typography>
        </Box>

        {/* User Profile and Notifications */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.300' }}>
            <IconUser size={20} />
          </Avatar>
          <IconButton size="small" sx={{ color: 'grey.600' }}>
            <IconSettings size={20} />
          </IconButton>
          <IconButton size="small" sx={{ color: 'grey.600' }}>
            <Badge badgeContent={9} color="error">
              <IconBell size={20} />
            </Badge>
          </IconButton>
        </Box>

        {renderMenuItems(Menuitems, pathDirect)}
        <Box px={2}>
          <Upgrade />
        </Box>
      </MUI_Sidebar>
    </>
  );
};

export default SidebarItems;
