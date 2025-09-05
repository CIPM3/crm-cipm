"use client"

import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useSidebar } from "./SidebarContext"

const sidebarVariants = cva(
  "group flex h-full w-full flex-col bg-sidebar text-sidebar-foreground",
  {
    variants: {
      variant: {
        default: "border-r",
        floating:
          "border-r border-sidebar-border bg-sidebar shadow-md data-[state=closed]:shadow-none",
        inset: "border-r border-sidebar-border bg-background",
        sidebar: "",
      },
      side: {
        left: "",
        right: "border-l border-r-0",
      },
      collapsible: {
        offcanvas: "",
        icon: "",
        none: "",
      },
    },
    defaultVariants: {
      side: "left",
      variant: "default",
      collapsible: "offcanvas",
    },
  }
)

interface SidebarProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof sidebarVariants> {
  side?: "left" | "right"
  collapsible?: "offcanvas" | "icon" | "none"
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = "left",
      variant = "default",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            sidebarVariants({ side, variant }),
            "h-svh w-sidebar",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-sidebar bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={{
              "--sidebar-width": "18rem",
            } as React.CSSProperties}
          >
            <div className={cn(sidebarVariants({ side, variant }), className)}>
              {children}
            </div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        className={cn(
          "group peer hidden transition-[width,height] ease-linear md:block",
          "h-svh w-sidebar shrink-0",
          state === "collapsed" &&
            collapsible === "icon" &&
            "w-sidebar-icon",
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className={cn(sidebarVariants({ side, variant }), "h-full")}
        >
          {children}
        </div>
      </div>
    )
  }
)

Sidebar.displayName = "Sidebar"