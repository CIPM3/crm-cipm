// === MODULAR SIDEBAR SYSTEM ===
// Refactored from monolithic 763-line component into focused, reusable modules

// Core Provider & Context
export { SidebarProvider } from "./SidebarProvider"
export { useSidebar } from "./SidebarContext"
export type { SidebarContext } from "./SidebarContext"

// Main Components
export { Sidebar } from "./Sidebar" 
export { SidebarTrigger } from "./SidebarTrigger"

// Content Components
export { 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter 
} from "./SidebarContent"

// Menu Components
export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "./SidebarMenu"

// Utility Components
export {
  SidebarInput,
  SidebarInset,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarGroupAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
} from "./SidebarUtils"

// Configuration
export {
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_MOBILE,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_KEYBOARD_SHORTCUT,
} from "./SidebarConfig"

// Backward compatibility - keep existing API
export { Sidebar as SidebarComponent } from "./Sidebar"