import {
  IconHome,
  IconAlertTriangle,
  IconDrone,
  IconFileText,
  IconApps,
  IconPlane,
  IconSettings,
  IconBell,
  IconUser,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Inicio",
    icon: IconHome,
    href: "/",
  },
  {
    id: uniqueId(),
    title: "Alertas",
    icon: IconAlertTriangle,
    href: "/alertas",
  },
  {
    id: uniqueId(),
    title: "Tus Drones",
    icon: IconDrone,
    href: "/drones",
  },
  {
    id: uniqueId(),
    title: "Reportes",
    icon: IconFileText,
    href: "/reportes",
  },
  {
    id: uniqueId(),
    title: "Configuraciones",
    icon: IconSettings,
    href: "/configuraciones",
  },
];

export default Menuitems;


